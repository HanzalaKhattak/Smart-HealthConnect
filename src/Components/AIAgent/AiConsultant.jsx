import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { API_AI } from '../apis/apisUrl';
import { AI_Consult, AI_Feedback } from '../apis/endpoints';
import { useAuth } from '../../context/AuthContext';

/**
 * AI Medical Consultation UI backed by the server-side RAG pipeline
 * (Postgres + pgvector + Gemini). No API key ever touches the browser.
 *
 * Flow per turn:
 *   1. POST /api/v0/ai/consult  { message, sessionId? }
 *   2. Server retrieves top-K chunks from pgvector, calls Gemini,
 *      persists the turn, returns { reply, sessionId, sources, recommendations }.
 */
const BASE_STORAGE_KEY = 'shc.aiConsult.v1';
const INITIAL_GREETING = {
  role: 'model',
  content: "Hello! I'm your Smart-HealthConnect assistant. Tell me what symptoms you're experiencing and I'll point you toward the right specialist.",
  sources: [],
};

const AiConsultant = () => {
  const { user } = useAuth();
  // Scope localStorage to the logged-in user so sessions never bleed between accounts.
  const storageKey = user?.id ? `${BASE_STORAGE_KEY}.${user.id}` : BASE_STORAGE_KEY;

  // Hydrate chat + sessionId from localStorage so a refresh doesn't wipe context.
  const [chat, setChat] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved?.chat?.length) return saved.chat;
    } catch { /* ignore */ }
    return [INITIAL_GREETING];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || 'null')?.sessionId || null;
    } catch { return null; }
  });
  const [emergency, setEmergency] = useState(false);
  const [recommendations, setRecommendations] = useState({ doctors: [], hospitals: [] });
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [chat, loading]);

  // Persist chat + sessionId on every change.
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ chat, sessionId }));
    } catch { /* quota / privacy mode — ignore */ }
  }, [chat, sessionId, storageKey]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setChat((c) => [...c, userMsg]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post(`${API_AI}${AI_Consult}`, {
        message: text,
        sessionId,
      });

      setSessionId(data.sessionId);
      setEmergency(!!data.emergency);
      setRecommendations(data.recommendations || { doctors: [], hospitals: [] });
      setChat((c) => [
        ...c,
        {
          role: 'model',
          content: data.reply,
          sources: data.sources || [],
          messageId: data.messageId,
        },
      ]);
    } catch (err) {
      const msg = err?.response?.data?.msg || 'The assistant is unavailable right now. Please try again.';
      setError(msg);
      setChat((c) => [...c, { role: 'model', content: `⚠️ ${msg}`, sources: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async (messageId, rating) => {
    if (!messageId) return;
    try {
      await api.post(`${API_AI}${AI_Feedback}`, { messageId, rating });
    } catch {
      /* silently ignore — feedback is best-effort */
    }
  };

  const startNewSession = () => {
    setSessionId(null);
    setEmergency(false);
    setRecommendations({ doctors: [], hospitals: [] });
    setError('');
    setChat([
      {
        role: 'model',
        content: 'New consultation started. What symptoms are you experiencing?',
        sources: [],
      },
    ]);
    try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] max-w-3xl mx-auto p-3 sm:p-4 mt-2 sm:mt-4 bg-white shadow-md rounded animate-fade-in">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h1 className="text-lg sm:text-2xl font-bold text-center flex-1">🧠 AI Medical Assistant</h1>
        <button
          type="button"
          onClick={startNewSession}
          className="text-xs sm:text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
        >
          New chat
        </button>
      </div>

      {emergency && (
        <div className="mb-2 rounded border border-red-400 bg-red-50 text-red-800 px-3 py-2 text-sm">
          ⚠️ Possible medical emergency detected. Please call your local emergency number immediately.
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-gray-100 p-3 sm:p-4 rounded mb-2">
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-[85%] sm:max-w-md px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-green-100 text-gray-800'}`}>
              {msg.content}

              {msg.role === 'model' && msg.sources?.length > 0 && (
                <div className="mt-2 pt-2 border-t border-green-200 text-xs text-gray-600">
                  <div className="font-semibold mb-1">Sources:</div>
                  <ul className="space-y-0.5">
                    {msg.sources.map((s) => (
                      <li key={s.chunkId} className="truncate">
                        [{s.tag}] {s.title}
                        <span className="text-gray-400 ml-1">({(s.score * 100).toFixed(0)}%)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {msg.role === 'model' && msg.messageId && (
                <div className="mt-2 flex gap-2 text-xs">
                  <button onClick={() => sendFeedback(msg.messageId, 1)} className="hover:text-green-700" aria-label="Helpful">👍</button>
                  <button onClick={() => sendFeedback(msg.messageId, -1)} className="hover:text-red-700" aria-label="Not helpful">👎</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <p className="italic text-sm text-center text-gray-500">AI is thinking…</p>}
      </div>

      {recommendations.doctors?.length > 0 && (
        <div className="mb-2">
          <div className="text-sm font-semibold text-gray-700 mb-1">Recommended doctors:</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recommendations.doctors.map((d) => (
              <Link
                key={d._id}
                to={`/doctors/${d._id}`}
                className="min-w-[220px] border border-green-300 rounded-lg p-2 bg-white hover:shadow"
              >
                <div className="font-semibold text-green-700 truncate">
                  Dr. {d.fullName || d.username}
                </div>
                <div className="text-xs text-gray-600 truncate">{d.specialization}</div>
                <div className="text-xs mt-1 text-gray-500">
                  ⭐ {d.rating?.toFixed?.(1) || '—'} · Fee: {d.consultationFee ?? '—'}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-2 text-xs text-red-600 text-center">{error}</div>
      )}

      <form onSubmit={sendMessage} className="flex mt-1 gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Describe your symptoms…"
          className="flex-grow border border-gray-300 rounded-l px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm disabled:bg-gray-50"
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-3 sm:px-4 py-2 rounded-r hover:scale-105 transition-all font-semibold shadow text-sm sm:text-base disabled:opacity-50 disabled:hover:scale-100"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AiConsultant;
