import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
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
            <h2 className="text-center text-success mb-4 fw-bold" style={{ fontSize: "2rem" }}>Contact Us</h2>

            <p className="lead text-dark" style={{ fontSize: "1.1rem" }}>
              We're here to assist you with any queries, issues, or feedback. Feel free to reach out to us through the following contact details.
            </p>

            <h5 className="text-success">📍 Company Address</h5>
            <p>
              eRecord Solutions Pvt. Ltd. <br />
              2nd Floor, Sai Business Tower,<br />
              Civil Lines, Prayagraj, Uttar Pradesh - 211001<br />
              India
            </p>

            <h5 className="text-success">📧 Email Support</h5>
            <ul className="list-unstyled">
              <li>General: <a href="mailto:info@erecord.com">pkyashu123@gmail.com</a></li>
              <li>Technical: <a href="mailto:support@erecord.com">support@erecord.com</a></li>
              <li>Business: <a href="mailto:partnerships@erecord.com">partnerships@erecord.com</a></li>
            </ul>

            <h5 className="text-success mt-4">📞 Phone Numbers</h5>
            <ul className="list-unstyled">
              <li>Customer Care: <a href="tel:+919876543210">+91 7310014820</a></li>
              <li>Technical Helpline: <a href="tel:+919123456789">+91 8402092556</a></li>
            </ul>

            <h5 className="text-success mt-4">🕐 Office Hours</h5>
            <p>Monday – Friday: 9:00 AM – 6:00 PM<br />
              Saturday: 10:00 AM – 2:00 PM<br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
