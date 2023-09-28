import React, { useState } from "react";
import {
  BrowserRouter as Router,  Route,  Routes} from "react-router-dom";
import "./App.css";
import Home from "./components/MainPage/Home";
import Contactos from "./pages/Contactos";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminPanel from "./pages/AdminPanel";
import PersonalArea from "./components/PersonalArea/PersonalArea"
//import { Component } from "react";

export const App = () => {
  return (
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Contactos" element={<Contactos />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/AdminPanel" element={<AdminPanel />} />
            <Route path="/PersonalArea" element={<PersonalArea />} />
          </Routes>
      </Router>
  );
};

export default App;
