import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Register from "../pages/Register/Register";
import { LogIn } from "../pages/LogIn/LogIn";
import Manuscript from "../pages/Home/Manuscript-writing";
import Plan from "../pages/Plan";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "../contexts/Authcontext";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/manuscript" element={<Manuscript />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
