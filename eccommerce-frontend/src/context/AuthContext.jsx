import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Fallback JWT parser to extract role and email from claims
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const decoded = parseJwt(token);
      let role = 'CUSTOMER';
      if (decoded) {
         // Some backends put role in a "role" or "roles" array or "Authorities" claim.
         if (decoded.role) role = decoded.role;
         else if (decoded.roles) role = Array.isArray(decoded.roles) ? decoded.roles[0] : decoded.roles;
         else if (decoded.authorities) role = Array.isArray(decoded.authorities) ? decoded.authorities[0] : decoded.authorities;
         
         // If it contains "ROLE_" prefix, removing it might help, but we'll adapt later if needed.
         if (typeof role === 'string' && role.includes('ADMIN')) {
            role = 'ADMIN';
         } else {
            role = 'CUSTOMER';
         }
      }
      
      setUser({
        email: decoded?.sub || decoded?.email,
        role: role,
      });
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setToken(response.data.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
