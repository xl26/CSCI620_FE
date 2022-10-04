import * as React from "react";
import { Routes, Route } from "react-router-dom";
// import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";
import FullFeaturedCrudGrid from "./components/invNav";
import SignInSide from "./components/SignIn";
import SignUp from "./components/signUp";


export default function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<h1>{"Inventory Management"}</h1>} /> */}
      <Route path="/" element={<SignInSide />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/inventory" element={<FullFeaturedCrudGrid />} />
    </Routes>
  );
}
