import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");  
    setIsAuthenticated(false);          
    navigate("/");                      
  };

  return (
   <nav className="navbar navbar-expand-lg navbar-dark" style={{  background: "linear-gradient(to left, #117a65, #20c997)", }}>
  <div className="container">
    <NavLink to="/" className="navbar-brand d-flex align-items-center">
      <img src="/erecord-logo.jpeg" alt="eRecord" width="40" height="40" className="rounded-circle me-2" />
      <span className="fs-4 fw-bold text-white">eRecord</span>
    </NavLink>

    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className="nav-link">About</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contact" className="nav-link">Contact</NavLink>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <NavLink to="/profile" className="nav-link">Profile</NavLink>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-outline-light ms-2">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">Login</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/signup" className="nav-link">Signup</NavLink>
              </li>
            </>
          )}
        </ul>
      </ul>
    </div>
  </div>
</nav>

  );
}
