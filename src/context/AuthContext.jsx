import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userType = localStorage.getItem('userType');
    const userInfo = localStorage.getItem('userInfo');
    const userId = localStorage.getItem('userId');

    if (token && username && userType) {
      setUser({ id: userId, username, userType, email: userInfo });
      setRole(userType);
      setIsAuthenticated(true);
      // Best-effort sync with server (silently ignore failures).
      try {
        const { data } = await api.get('/api/v0/users/me');
        if (data?.role) setRole(data.role);
        if (data?.user) {
          setUser((u) => ({ ...u, ...data.user, id: data.user._id, username: data.user.fullName || data.user.username }));
        }
      } catch { /* token expired – axios interceptor handles redirect */ }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = (userData) => {
    setUser(userData);
    setRole(userData?.userType || localStorage.getItem('userType'));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const hasRole = (roles) => {
    if (!role) return false;
    if (!roles || roles.length === 0) return true;
    return Array.isArray(roles) ? roles.includes(role) : roles === role;
  };

  return (
    <AuthContext.Provider value={{
      user, role, isAuthenticated, isLoading,
      login, logout, checkAuth, hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
