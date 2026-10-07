import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('exp_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('exp_token') || '');

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Login failed' };

      const userToken = data.token;
      const userData = data.user;

      setToken(userToken);
      setCurrentUser(userData);
      localStorage.setItem('exp_token', userToken);
      localStorage.setItem('exp_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Could not connect to backend server' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Registration failed' };

      const userToken = data.token;
      const userData = data.user;

      setToken(userToken);
      setCurrentUser(userData);
      localStorage.setItem('exp_token', userToken);
      localStorage.setItem('exp_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Could not connect to backend server' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('exp_token');
    localStorage.removeItem('exp_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);