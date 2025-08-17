import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "If the email is registered, instructions will be sent.");
    } catch (err) {
      setMessage("Server error: " + err.message);
    }
  };

  return (
    <>
      <Header />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "calc(100vh - 136px)",
          background: "linear-gradient(to bottom right, #117a65, #20c997)",
          padding: "2rem 1rem",
        }}
      >
        <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h4 className="text-center mb-4 text-success fw-bold">Forgot Password</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-success w-100">
              Send Instructions
            </button>
          </form>
          {message && <p className="mt-3 text-center text-success">{message}</p>}
        </div>
      </div>
      <Footer />
    </>
  );
}
