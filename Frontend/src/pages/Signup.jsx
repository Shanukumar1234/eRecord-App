import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "calc(100vh - 136px)" }}>
        <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="text-center mb-4 text-success">Create an Account</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" className="form-control mb-3" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" className="form-control mb-3" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" className="form-control mb-3" onChange={handleChange} required />
            <button type="submit" className="btn btn-success w-100">Sign Up</button>
          </form>
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
