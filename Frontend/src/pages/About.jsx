import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #117a65, #20c997)",
          paddingTop: "5rem",
          paddingBottom: "3rem",
        }}
      >
        <div className="container">
          <div className="card shadow p-4">
            <h2 className="text-center text-success mb-4 fw-bold" style={{ fontSize: "2rem" }}>
            About eRecord
            </h2>

            <p className="lead text-dark" style={{ fontSize: "1.1rem" }}>
              <strong>eRecord</strong> is a modern digital solution designed to help individuals and small businesses manage daily operations with ease. Whether you're tracking household expenses, managing education fees, buying or selling goods, or calculating labor costs — eRecord simplifies everything into one unified platform.
            </p>

            <h4 className="mt-4 text-success">🎯 Our Mission</h4>
            <p>
              To empower users — especially from rural and semi-urban areas — with a user-friendly and secure platform to digitize financial and resource records for better planning and accountability.
            </p>

            <h4 className="mt-4 text-success">💡 What We Offer</h4>
            <ul>
              <li>Track and categorize household expenses</li>
              <li>Manage children's education fee records</li>
              <li>Buy items from farmers with payment details</li>
              <li>Sell items to buyers and generate reports</li>
              <li>Track labor costs and daily resource expenses</li>
              <li>Fully secure login and data privacy per user</li>
            </ul>

            <h4 className="mt-4 text-success">🔐 User Privacy</h4>
            <p>
              Each user's data is private and protected. Only the logged-in user can access or manage their records — no one else. We ensure your data stays safe with JWT-based authentication and encrypted credentials.
            </p>

            <h4 className="mt-4 text-success">🌍 Vision for the Future</h4>
            <p>
              We're building eRecord to scale into a complete business ecosystem with reporting tools, analytics, and mobile support — making it the go-to platform for small enterprises and individuals across India.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
