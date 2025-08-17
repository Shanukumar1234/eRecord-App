import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const cardStyle = {
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const onMouseEnter = (e) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
  };
  const onMouseLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #117a65, #20c997)",
          paddingTop: "2rem",
          paddingBottom: "3rem",
          color: "white",
        }}
      >
        <div className="container text-center">
          <header className="mb-4">
            <h1 className="display-4 fw-bold">Welcome to eRecord</h1>
            <p className="lead">
              Manage household, education, and trading activities—all in one place.
            </p>
          </header>

          {/* First row: 3 cards on large, 2 on medium, 1 on small */}
          <div className="row g-4 justify-content-center row-cols-1 row-cols-md-2 row-cols-lg-3 mb-4">
            <div
              className="col"
              style={cardStyle}
              onClick={() => handleNavigate("/household-expenses")}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <div className="card shadow-sm h-100">
                <div className="card-body text-dark">
                  <h5 className="card-title text-primary">🏠 Household Expenses</h5>
                  <p className="card-text">
                    Keep track of daily and monthly household costs like groceries, rent, and utilities.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="col"
              style={cardStyle}
              onClick={() => handleNavigate("/education-fees")}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <div className="card shadow-sm h-100">
                <div className="card-body text-dark">
                  <h5 className="card-title text-success">🎓 Education Fees</h5>
                  <p className="card-text">
                    Add and view fees paid for your children's school or college education.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="col"
              style={cardStyle}
              onClick={() => handleNavigate("/buy-products")}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <div className="card shadow-sm h-100">
                <div className="card-body text-dark">
                  <h5 className="card-title text-warning">🛒 Buy Products</h5>
                  <p className="card-text">
                    Record purchases from farmers, payment method, and itemized costs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Second row: 2 cards on large and medium, 1 on small */}
          <div className="row g-4 justify-content-center row-cols-1 row-cols-md-2 row-cols-lg-2">
            <div
              className="col"
              style={cardStyle}
              onClick={() => handleNavigate("/sell-products")}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <div className="card shadow-sm h-100">
                <div className="card-body text-dark">
                  <h5 className="card-title text-danger">💰 Sell Products</h5>
                  <p className="card-text">
                    Add product sales with buyer info, payment method, and item list.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="col"
              style={cardStyle}
              onClick={() => handleNavigate("/labourcost")}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <div className="card shadow-sm h-100">
                <div className="card-body text-dark d-flex flex-column justify-content-center align-items-center">
                  <span style={{ fontSize: "2rem" }}>👷‍♂️</span>
                  <h5 className="mt-3">Labour Costs</h5>
                  <p className="text-center">Manage labour cost records easily.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
