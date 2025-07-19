import React from "react";
import { Link } from "react-router-dom";

function RecoveryPassword() {
  return (
    <>
      <div className="page-banner-area bg-f0f4fc">
        <div className="container">
          <div className="page-banner-content">
            <h1>Recover Password</h1>
            <ul>
              <li>
                <Link to="/" className="nav-link">
                  {" "}
                  Home
                </Link>
              </li>
              <li>Recover Password</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="password-area ptb-100">
        <div className="container">
          <div className="password">
            <h3>Forgot Password</h3>
            <div className="form-group">
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Username Or Email Address*"
              />
            </div>
            <button type="submit" className="default-btn btn">
              Reset Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecoveryPassword;
