import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
 
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      alert("Login successful!");
      navigate("/profile");
    } else {
      console.error("Login failed:", data);
      alert(data.message || "Login failed.");
    }
  } catch (err) {
    console.error("Error during login:", err);
    alert("Network or server error: " + err.message);
  }
};


  return (
    <>
      <Header />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "calc(100vh - 136px)",
          
          padding: "2rem 1rem",
        }}
      >
        <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="text-center mb-4 text-success fw-bold">🔐 Login to eRecord</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Login
            </button>
          </form>

          <p className="mt-3 text-center">
            <span className="text-dark">
              Don't have an account?{" "}
              <Link to="/signup" className="text-decoration-none text-success fw-bold">Sign Up</Link>
            </span>
            <br />
            <Link to="/forgot-password" className="text-decoration-none text-success fw-bold">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
