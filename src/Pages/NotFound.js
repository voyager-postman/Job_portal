// src/Pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center" style={{ padding: "100px" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Go Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
