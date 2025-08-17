import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile.jsx";
import HouseholdExpenses from "./pages/HouseholdExpenses";
import EducationFees from "./pages/EducationFees";
import BuyProducts from "./pages/BuyProducts";
import SellProducts from "./pages/SellProducts";
import LabourCost from './pages/LabourCost';
import PrivateRoute from "./components/PrivateRoute.jsx";
export default function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/household-expenses" element={<HouseholdExpenses />} />
      <Route path="/education-fees" element={<EducationFees />} />
      <Route path="/buy-products" element={<BuyProducts />} />
      <Route path="/sell-products" element={<SellProducts />} />
      <Route path="/labourcost" element={<LabourCost />} />
      <Route path="/household-expenses" element={<PrivateRoute><HouseholdExpenses /></PrivateRoute>} />
  <Route path="/buy-products" element={<PrivateRoute><BuyProducts /></PrivateRoute>} />
  <Route path="/sell-products" element={<PrivateRoute><SellProducts /></PrivateRoute>} />
  <Route path="/education-fees" element={<PrivateRoute><EducationFees /></PrivateRoute>} />
    </Routes>
    </>
  );
}

