import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import Home from "./pages/MainPage/Home";
import Contactos from "./pages/Contactos";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/AdminPanel";
import Personal from "./components/Profile/Personal";
// import Player from "./components/Player/Player";
import SideMenu from "./components/SideMenu";
import { AuthProvider } from "./Service/AuthContext";
import { ThemeProvider } from "./Service/ThemeProvider";
import { useAuth } from './Service/AuthContext';
import "./app.css";

const ProtectedRoute = ({ element }) => {
  const { auth } = useAuth(); // Получите состояние авторизации из вашего AuthContext
  const navigate = useNavigate();

  if (!auth) {
    navigate('/signin'); // Перенаправить на страницу входа, если пользователь не авторизован
    return null;
  }

  return element;
};


export const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider >
          <Router>
            <SideMenu/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contactos" element={<Contactos />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/personal" element={<ProtectedRoute element={<Personal />} />} />
            </Routes>
          </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
