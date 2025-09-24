import { TiTickOutline } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router-dom";

import { useEffect } from "react";
const AccountVerified = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const reason = queryParams.get("reason");
  const email = queryParams.get("email");
    const role = queryParams.get("role");


  useEffect(() => {
    console.log("Reason:", reason);
    console.log("Email:", email);
  }, [reason, email]);
  const handleContinue = () => {
    // Navigate to home page
    if(role==="JobSeeker")
    navigate("/login");else{
   navigate("/login")
    }
  };
  return (
    <div className="verified-container">
      <div className="verified-card">
        <div className="icon-wrapper">
          <span className="check-icon">✔️</span>
        </div>
        <h2>Your account is verified</h2>
        <p>
          Congratulations, <span className="username">{email}</span>
        </p>
        <p className="message">
           We have verified your application and confirmed your status in your
        profile. You can now log in and start using your account.
        </p>

        <div className="personal-info-btn">
          <button className="default-btn btn" onClick={handleContinue}>
            Continue to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountVerified;
