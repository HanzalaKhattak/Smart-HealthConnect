import React, { useEffect, useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { io } from 'socket.io-client';
import api from '../../api/axios';
import { API_BASE_URL } from '../apis/apisUrl';

const NotificationBell = () => {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const socketRef = useRef(null);

  const refresh = async () => {
    try {
      const { data } = await api.get('/api/v0/notifications');
      setItems(data.notifications || []);
      setUnread(data.unreadCount || 0);
    } catch { /* unauth or offline */ }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    refresh();

    const s = io(API_BASE_URL, { withCredentials: true, transports: ['websocket', 'polling'] });
    socketRef.current = s;
    s.on('connect', () => s.emit('register', { token }));
    s.on('notification', (n) => {
      setItems((arr) => [n, ...arr].slice(0, 50));
      setUnread((u) => u + 1);
    });
    return () => { s.disconnect(); };
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/api/v0/notifications/${id}/read`);
      setItems((arr) => arr.map(n => n._id === id ? { ...n, read: true } : n));
      setUnread((u) => Math.max(0, u - 1));
    } catch { /* ignore */ }
  };

  const markAll = async () => {
    try {
      await api.put('/api/v0/notifications/read-all');
      setItems((arr) => arr.map(n => ({ ...n, read: true })));
      setUnread(0);
    } catch { /* ignore */ }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="relative p-2 rounded-full hover:bg-gray-100">
        <FaBell className="text-xl text-gray-700" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white shadow-xl rounded-xl border z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h4 className="font-semibold text-gray-800">Notifications</h4>
            {items.length > 0 && (
              <button onClick={markAll} className="text-xs text-green-700 hover:underline">Mark all read</button>
            )}
          </div>
          {items.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-6">No notifications</p>
          ) : (
            <ul className="divide-y">
              {items.map((n) => (
                <li key={n._id} onClick={() => !n.read && markRead(n._id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${n.read ? '' : 'bg-blue-50'}`}>
                  <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                  {n.message && <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>}
                  <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
