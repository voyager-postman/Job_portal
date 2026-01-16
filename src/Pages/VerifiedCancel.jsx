import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";

const VerifiedCancel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  const reason = queryParams.get("reason");
  const email = queryParams.get("email");

  useEffect(() => {
    console.log("Reason:", reason);
    console.log("Email:", email);
  }, [reason, email]);

  useEffect(() => {
    // Clear old session if coming from email verification link
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("last_name");

    console.log("Session cleared. Verification email:", email);
  }, [email]);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Email is required to resend verification.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}resendVerificationEmail`,
        { email }
      );

      const { success, message } = response.data;

      if (success) {
        toast.success("Verification email resent successfully!");
      } else {
        if (success === false) {
          toast.success(message);
          // navigate("/"); // redirect to login/home
        } else {
          toast.error(message || "Failed to resend verification email.");
        }
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error(
        error.response?.data?.message || "Error resending verification email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="verified-container">
        <div className="verified-card">
          <div className="icon-wrapper2">
            <span className="cross-icon">✖️</span>
          </div>
          <h2>Verification Failed</h2>
          <p>
            Sorry, <span className="username">{email}</span>
          </p>
          {reason && <p className="reason-text">Reason: {reason}</p>}
          <p className="message">
            Sorry, the verification link has expired or is no longer valid.
            Please click the button below to send a new verification email.
          </p>
          <div className="personal-info-btn">
            <button
              className="default-btn btn"
              onClick={handleResendVerification}
              disabled={loading}
            >
              {loading ? "Resending..." : "Resend Verification Email"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifiedCancel;
