import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('recoverx_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('recoverx_token') || null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync token to API headers if needed
  useEffect(() => {
    if (token) {
      localStorage.setItem('recoverx_token', token);
    } else {
      localStorage.removeItem('recoverx_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('recoverx_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('recoverx_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Invalid email or password.');
      }

      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (e) {
      // Ignore network errors during logout
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('recoverx_token');
      localStorage.removeItem('recoverx_user');
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
