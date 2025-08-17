import React from "react";

export default function Footer() {
  return (
    <footer
      className="text-white text-center py-3 mt-auto"
      style={{
        background: "linear-gradient(to right, #117a65, #20c997)",
        color: "white",
        position: "relative",
        bottom: 0,
        width: "100%",
        fontSize: "0.9rem",
      }}
    >
      <p className="mb-0">© 2025 <strong>eRecord</strong>. All rights reserved.</p>
    </footer>
  );
}
