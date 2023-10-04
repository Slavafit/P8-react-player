import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    // восстановить состояние аутентификации из sessionStorage
    useEffect(() => {
      const storedAuth = sessionStorage.getItem("isAuthenticated");
      if (storedAuth) {
        setIsAuthenticated(storedAuth === "true");
      }
    }, []);

  const login = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
