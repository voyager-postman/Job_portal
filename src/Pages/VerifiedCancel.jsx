import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const VerifiedCancel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  const reason = queryParams.get("reason");
  const email = queryParams.get("email");
  useEffect(() => {
    console.log("Reason:", reason);
    console.log("Email:", email);
  }, [reason, email]);
  const handleResend = () => {
    // Navigate to home page
    navigate("/");
  };
  return (
    <>
      <div className="verified-container">
        <div className="verified-card">
          <div className="icon-wrapper2 ">
            <span className="cross-icon">✖️</span>
          </div>
          <h2>Verification Failed</h2>
          <p>
            Sorry, <span className="username">{email}</span>
          </p>
          <p className="message">
            Sorry, the verification link has expired or is no longer valid.
            Please click the button below to send a new verification email.
          </p>
          <div className="personal-info-btn">
            <button className="default-btn btn" onClick={handleResend}>
              Resend Verification Email
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifiedCancel;