import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      try {
        const decodedUser = jwtDecode(token);
        // Check for token expiration
        if (decodedUser.exp && Date.now() >= decodedUser.exp * 1000) {
          // Token expired
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setUser(null);
        } else {
          setUser({ ...decodedUser, userId });
        }
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // login now accepts both token and userId
  const login = (token, userId) => {
    try {
      const decodedUser = jwtDecode(token);
      // Check for token expiration
      if (decodedUser.exp && Date.now() >= decodedUser.exp * 1000) {
        // Token expired
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
      } else {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        setUser({ ...decodedUser, userId });
      }
    } catch (e) {
      console.error("Invalid token on login", e);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
