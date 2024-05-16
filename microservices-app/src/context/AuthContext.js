import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie'; // Upewnij się, że to jest dodane

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    Cookies.set('token', token, { expires: 8 / 24 }); // Wygasa po 8 godzinach
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    Cookies.remove('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
