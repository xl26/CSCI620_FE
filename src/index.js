import React from "react";
import ReactDOM from "react-dom/client";
// import { StyledEngineProvider } from '@mui/material/styles';
import App from "./App";
import Axios from 'axios'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import SignInSide from "./components/SignIn";
// import SignUp from "./components/signUp";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="*" element={<App />} />
    </Routes>
  </Router>
);
