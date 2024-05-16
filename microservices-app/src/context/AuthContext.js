import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (user, token) => {
    Cookies.set('token', token, { expires: 1 });
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetch('http://localhost:5002/verifyToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.valid) {
            setUser(data.user);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        })
        .catch(error => {
          console.error('Error verifying token:', error);
          logout();
        });
    }
  }, []);

  const refreshToken = () => {
    const token = Cookies.get('token');
    if (token) {
      fetch('http://localhost:5002/refreshToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.token) {
            Cookies.set('token', data.token, { expires: 1 });
            setIsAuthenticated(true);
          } else {
            logout();
          }
        })
        .catch(error => {
          console.error('Error refreshing token:', error);
          logout();
        });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 7 * 3600000); // Odśwież token co 7 godzin
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
