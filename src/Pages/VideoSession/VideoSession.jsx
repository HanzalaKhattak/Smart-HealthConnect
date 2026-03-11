import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash,
  FaPhoneSlash, FaPaperPlane, FaComments, FaTimes,
  FaUserMd, FaUser, FaSpinner, FaExpand, FaCompress
} from 'react-icons/fa';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Dynamically fetch ICE server credentials from metered.ca
const fetchIceConfig = async () => {
  // Use Metered app name and API key from .env file
  const appName = import.meta.env.VITE_METERED_APP_NAME;
  const apiKey = import.meta.env.VITE_METERED_API_KEY;
  const url = `https://${appName}.metered.live/api/v1/turn/credentials?apiKey=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch ICE servers');
    const data = await response.json();
    // Metered API returns a plain array of ICE server objects
    return { iceServers: Array.isArray(data) ? data : data.iceServers };
  } catch (error) {
    console.error('Error fetching ICE config:', error);
    // Fallback to public STUN
    return {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };
  }
};

const VideoSession = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const roomId = `appointment-${appointmentId}`;

  /* ── user info from localStorage ── */
  const userId   = localStorage.getItem('userId')   || '';
  const userName = localStorage.getItem('username')  || 'User';
  const userType = localStorage.getItem('userType')  || 'patient';

  /* ── refs ── */
  const socketRef    = useRef(null);
  const pcRef        = useRef(null);   // RTCPeerConnection
  const localStream  = useRef(null);
  const localVideo   = useRef(null);
  const remoteVideo  = useRef(null);
  const chatEndRef   = useRef(null);
  const targetSocketRef = useRef(null); // who we signal to

  /* ── state ── */
  const [connected, setConnected]       = useState(false);
  const [waiting, setWaiting]           = useState(true);
  const [videoOn, setVideoOn]           = useState(true);
  const [audioOn, setAudioOn]           = useState(true);
  const [chatOpen, setChatOpen]         = useState(false);
  const [fullscreen, setFullscreen]     = useState(false);
  const [messages, setMessages]         = useState([]);
  const [newMsg, setNewMsg]             = useState('');
  const [remoteName, setRemoteName]     = useState('');
  const [remoteRole, setRemoteRole]     = useState('');
  const [callEnded, setCallEnded]       = useState(false);

  /* ── scroll chat on new message ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ── helpers ── */
  const addSystemMsg = (text) => {
    setMessages(prev => [...prev, { message: text, sender: 'System', timestamp: new Date().toISOString(), system: true }]);
  };

  /* ── create RTCPeerConnection ── */
  const createPC = useCallback(async (stream) => {
    const iceConfig = await fetchIceConfig();
    const pc = new RTCPeerConnection(iceConfig);

    // Add local tracks to connection
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    // When remote tracks arrive
    pc.ontrack = (event) => {
      console.log('🎥 Received remote track:', event.track.kind);
      if (remoteVideo.current && event.streams[0]) {
        remoteVideo.current.srcObject = event.streams[0];
      }
      setConnected(true);
      setWaiting(false);
    };

    // Send ICE candidates to remote peer
    pc.onicecandidate = (event) => {
      if (event.candidate && targetSocketRef.current) {
        console.log('📤 Sending ICE candidate');
        socketRef.current?.emit('signal', {
          to: targetSocketRef.current,
          signal: { type: 'candidate', candidate: event.candidate },
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('🔗 ICE state:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        setConnected(true);
        setWaiting(false);
      }
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        setConnected(false);
      }
      if (pc.iceConnectionState === 'closed') {
        setConnected(false);
        setCallEnded(true);
      }
    };

    return pc;
  }, []);

  /* ── initialise socket + media ── */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Get camera & mic
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.current = stream;
        if (localVideo.current) localVideo.current.srcObject = stream;

        // Connect socket
        const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('Socket connected:', socket.id);
          socket.emit('join-room', { roomId, userId, userName, role: userType });
        });

        // Someone is already in the room → I am the initiator (create offer)
        socket.on('room-users', async (users) => {
          if (!mounted || users.length === 0) return;
          const target = users[0];
          console.log('🚀 I am the initiator, connecting to:', target.userName);
          setRemoteName(target.userName);
          setRemoteRole(target.role);
          setWaiting(false);

          targetSocketRef.current = target.socketId;
          const pc = await createPC(localStream.current);
          pcRef.current = pc;

          // Create and send offer
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          console.log('📤 Sending offer');
          socket.emit('signal', { to: target.socketId, signal: { type: 'offer', sdp: offer } });
        });

        // A new user joins → I wait for their offer
        socket.on('user-joined', ({ userName: name, role }) => {
          if (!mounted) return;
          console.log('👤 User joined:', name, '- waiting for their offer');
          setRemoteName(name);
          setRemoteRole(role);
        });

        // Relay signaling data (offer / answer / ICE candidates)
        socket.on('signal', async ({ from, signal }) => {
          if (!mounted) return;
          console.log('📡 Received signal from:', from, 'Type:', signal.type);

          targetSocketRef.current = from;

          if (signal.type === 'offer') {
            // I'm the responder – create peer, set remote desc, send answer
            const pc = await createPC(localStream.current);
            pcRef.current = pc;

            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            console.log('📤 Sending answer');
            socket.emit('signal', { to: from, signal: { type: 'answer', sdp: answer } });
            setWaiting(false);

          } else if (signal.type === 'answer') {
            // I'm the initiator – set remote desc
            if (pcRef.current) {
              await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal.sdp));
              console.log('✅ Answer set');
            }

          } else if (signal.type === 'candidate') {
            // Add ICE candidate
            if (pcRef.current) {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(signal.candidate));
            }
          }
        });

        // Remote user left
        socket.on('user-left', ({ userName: name }) => {
          if (!mounted) return;
          setConnected(false);
          setCallEnded(true);
          addSystemMsg(`${name} has left the session`);
          if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
          }
          if (remoteVideo.current) remoteVideo.current.srcObject = null;
        });

        // Chat
        socket.on('chat-message', ({ message, sender, timestamp }) => {
          if (!mounted) return;
          setMessages(prev => [...prev, { message, sender, timestamp, own: false }]);
        });

      } catch (err) {
        console.error('Media / socket error:', err);
        addSystemMsg('Could not access camera/microphone. Please grant permissions.');
      }
    };

    init();

    return () => {
      mounted = false;
      if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
      localStream.current?.getTracks().forEach(t => t.stop());
      socketRef.current?.disconnect();
    };
  }, [roomId, userId, userName, userType, createPC]);

  const toggleVideo = () => {
    const track = localStream.current?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; setVideoOn(track.enabled); }
  };

  const toggleAudio = () => {
    const track = localStream.current?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setAudioOn(track.enabled); }
  };

  const endCall = () => {
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
    localStream.current?.getTracks().forEach(t => t.stop());
    socketRef.current?.disconnect();
    setCallEnded(true);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const timestamp = new Date().toISOString();
    socketRef.current?.emit('chat-message', { roomId, message: newMsg, sender: userName, timestamp });
    setMessages(prev => [...prev, { message: newMsg, sender: userName, timestamp, own: true }]);
    setNewMsg('');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /* ── Call ended screen ── */
  if (callEnded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white space-y-4">
          <FaPhoneSlash className="text-red-500 text-5xl mx-auto" />
          <h2 className="text-2xl font-bold">Session Ended</h2>
          <p className="text-gray-400">The consultation session has ended</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ── Main UI ── */
  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">

      {/* ── Top Bar ── */}
      <div className="bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <FaVideo className="text-green-400 shrink-0" />
          <span className="text-white font-semibold text-xs sm:text-sm truncate">Smart HealthConnect</span>
          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full hidden sm:inline">Room: {appointmentId?.substring(0, 8)}...</span>
        </div>
        <div className="flex items-center gap-3">
          {connected && (
            <span className="flex items-center gap-1 text-green-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Connected
            </span>
          )}
          <button onClick={toggleFullscreen} className="text-gray-400 hover:text-white transition">
            {fullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* ── Video + Chat Container ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Video Area ── */}
        <div className="flex-1 relative bg-black">
          {/* Remote video (large) */}
          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Waiting overlay */}
          {waiting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10">
              <FaSpinner className="animate-spin text-green-400 text-4xl mb-4" />
              <p className="text-white text-lg font-medium">Waiting for {userType === 'doctor' ? 'patient' : 'doctor'} to join…</p>
              <p className="text-gray-400 text-sm mt-1">Share the session link or ask them to join from their dashboard</p>
            </div>
          )}

          {/* Remote user label */}
          {connected && remoteName && (
            <div className="absolute top-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg flex items-center gap-2 text-white text-sm z-10">
              {remoteRole === 'doctor' ? <FaUserMd className="text-blue-400" /> : <FaUser className="text-green-400" />}
              {remoteName}
            </div>
          )}

          {/* Local video (picture-in-picture) */}
          <div className="absolute bottom-24 right-2 sm:right-4 w-28 h-20 sm:w-48 sm:h-36 rounded-xl overflow-hidden border-2 border-gray-600 shadow-xl z-10">
            <video
              ref={localVideo}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
            />
            {!videoOn && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <FaVideoSlash className="text-gray-500 text-2xl" />
              </div>
            )}
            <div className="absolute bottom-1 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">
              You ({userType === 'doctor' ? 'Doctor' : 'Patient'})
            </div>
          </div>

          {/* ── Bottom Controls ── */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 sm:gap-4 py-3 sm:py-4 bg-gradient-to-t from-black/80 to-transparent z-10">
            <ControlBtn
              icon={videoOn ? <FaVideo /> : <FaVideoSlash />}
              label={videoOn ? 'Camera On' : 'Camera Off'}
              active={videoOn}
              onClick={toggleVideo}
            />
            <ControlBtn
              icon={audioOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
              label={audioOn ? 'Mic On' : 'Mic Off'}
              active={audioOn}
              onClick={toggleAudio}
            />
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-full transition ${chatOpen ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              <FaComments className="text-lg" />
              <span className="text-[10px]">Chat</span>
            </button>
            <button
              onClick={endCall}
              className="flex flex-col items-center gap-1 px-6 py-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
            >
              <FaPhoneSlash className="text-lg" />
              <span className="text-[10px]">End</span>
            </button>
          </div>
        </div>

        {/* ── Chat Panel ── */}
        {chatOpen && (
          <div className="fixed inset-0 sm:static sm:inset-auto w-full sm:w-80 bg-gray-800 flex flex-col border-l border-gray-700 shrink-0 z-20">
            {/* Chat header */}
            <div className="p-3 bg-gray-750 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <FaComments className="text-blue-400" /> Session Chat
              </h3>
              <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 && (
                <p className="text-gray-500 text-xs text-center mt-8">No messages yet. Say hello!</p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.system ? 'items-center' : msg.own ? 'items-end' : 'items-start'}`}>
                  {msg.system ? (
                    <span className="text-xs text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">{msg.message}</span>
                  ) : (
                    <>
                      <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                        msg.own ? 'bg-green-600 text-white rounded-br-sm' : 'bg-gray-700 text-gray-100 rounded-bl-sm'
                      }`}>
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-gray-500 mt-0.5 px-1">
                        {msg.sender} • {formatTime(msg.timestamp)}
                      </span>
                    </>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 border-t border-gray-700 flex gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 bg-gray-700 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
              />
              <button
                type="submit"
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mirror CSS for local video */}
      <style>{`.mirror { transform: scaleX(-1); }`}</style>
    </div>
  );
};

/* ── Control Button ── */
const ControlBtn = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-3 rounded-full transition ${
      active ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500/80 text-white hover:bg-red-600'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-[10px]">{label}</span>
  </button>
);

export default VideoSession;
