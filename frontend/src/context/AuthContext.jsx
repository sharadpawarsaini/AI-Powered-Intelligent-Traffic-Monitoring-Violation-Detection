import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('traffic_ai_token');
    if (token) {
      authAPI.getMe()
        .then((userData) => setUser(userData))
        .catch(() => {
          localStorage.removeItem('traffic_ai_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('traffic_ai_token', data.access_token);
    setUser({ name: data.name, email, role: data.role });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('traffic_ai_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
