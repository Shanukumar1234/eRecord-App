
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to view this page.");
        return navigate("/login");
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();

        if (res.ok) {
          setUser(data.user || data); // Accepts both formats
        } else {
          alert(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Server error. Please try again later.");
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <h2 className="text-primary mb-4">My Profile</h2>
        {user ? (
          <div className="text-center">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user._id}</p>
          </div>
        ) : (
          <p className="text-muted">Loading profile...</p>
        )}
      </div>
      <Footer />
    </>
  );
}

