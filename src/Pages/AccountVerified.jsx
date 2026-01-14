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
  const token = queryParams.get("token");
  console.log(role);
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    localStorage.removeItem("isLoggedIn");
  }, [reason, email, role, token]);

  //   console.log(role);

  //   console.log(token);
  //   console.log(email);
  //   if (token) {
  //     localStorage.setItem("token", token);
  //   }
  //   if (email) {
  //     localStorage.setItem("user_email", email);
  //   }
  //   if (role) {
  //     localStorage.setItem("user_role", role);
  //     localStorage.setItem("isLoggedIn", true);
  //   }
  //   // Navigate to login/profile based on role
  //   if (role == "JobSeeker") {
  //     console.log("JobSeeker");
  //     navigate(`/profile-basic-info?token=${token}`);
  //   } else if (role == "Recruiter" || role == "Company") {
  //     console.log("Recruiter");
  //     navigate(`/employer-basic-info?token=${token}`);
  //   } else {
  //     console.log("login");

  //     // fallback in case role is missing or invalid
  //     navigate("/login");
  //   }
  // };
  const handleContinue = () => {
    console.log(role, token, email);

    if (token) localStorage.setItem("token", token);
    if (email) localStorage.setItem("user_email", email);
    if (role) {
      localStorage.setItem("user_role", role);
      localStorage.setItem("isLoggedIn", "true");
    }

    // ✅ HARD redirect (works in iframe / external page)
    if (role === "JobSeeker") {
      window.location.href = `/jobPortal/profile-basic-info?token=${token}`;
    } else if (role === "Recruiter" || role === "Company") {
      window.location.href = `/jobPortal/employer-basic-info?token=${token}`;
    } else {
      window.location.href = `/jobPortal/login`;
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
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountVerified;
