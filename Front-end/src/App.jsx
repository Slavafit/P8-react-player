import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Home from "./pages/MainPage/Home";
import Contactos from "./pages/Contactos";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/AdminPanel";
import Personal from "./components/Profile/Personal";
import SideMenu from "./components/SideMenu";
import { AuthProvider } from "./Service/AuthContext";
import { ThemeProvider } from "./Service/ThemeProvider";
import { UserProvider } from "./Service/UserContext";
import "./app.css";

export const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider >
        <UserProvider>
          <Router>
            <SideMenu/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Contactos" element={<Contactos />} />
              <Route path="/SignIn" element={<SignIn />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/personal" element={<Personal />} />
            </Routes>
          </Router>
        </UserProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
