import React from "react";
import {
  BrowserRouter as Router,  Route,  Routes} from "react-router-dom";
import Home from "./pages/MainPage/Home";
import Contactos from "./pages/Contactos";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminPanel from "./pages/AdminPanel";
import Personal from "./components/Profile/Personal";
import SideMenu from "./components/SideMenu"
import { AuthProvider } from "./Service/AuthContext";
import "./app.css";


export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <SideMenu />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Contactos" element={<Contactos />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/AdminPanel" element={<AdminPanel />} />
            <Route path="/PersonalArea" element={<Personal />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
