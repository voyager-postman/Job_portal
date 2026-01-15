import { useState, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance"
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, token, showToast } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  /* ✅ Show initial toast */
  useEffect(() => {
    if (showToast) {
      toast.info("Please check your email for verification.");
    }
  }, [showToast]);

  /* ✅ Check verification status */
  const checkVerificationStatus = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE_URL}checkVerificationStatus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      if (res.data?.verified === true && !isVerified) {
        setIsVerified(true);

        toast.success("Email verified successfully!", {
          containerId: "verify-email-toast",
          autoClose: 2000,
        });

        // ✅ Auto redirect after short delay
        setTimeout(() => {
          const redirectUrl =
            `https://itdevelopmentservices.com/jobPortal/account-verified` +
            `?email=${encodeURIComponent(email)}` +
            `&role=${encodeURIComponent(res.data.role || "JobSeeker")}` +
            `&token=${encodeURIComponent(token)}`;

          window.location.href = redirectUrl; // 👈 external redirect
        }, 2000);
      }
    } catch (error) {
      console.error("Verification status error:", error);
    }
  };

  /* ✅ Auto-check every 5 seconds */
  useEffect(() => {
    if (!email || isVerified) return;

    const interval = setInterval(() => {
      checkVerificationStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [email, isVerified]);

  /* ✅ Resend email */
  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Email is required.", {
        containerId: "verify-email-toast",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}resendVerificationEmail`, {
        email,
      });

      if (res.data.success) {
        toast.success("Verification email resent!", {
          containerId: "verify-email-toast",
        });
      } else {
        toast.error(res.data.message || "Failed to resend email.", {
          containerId: "verify-email-toast",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resending email.", {
        containerId: "verify-email-toast",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ✅ Continue after verification */
  const handleContinue = () => {
    navigate("/login"); // or dashboard
  };

  return (
    <>
      <ToastContainer
        containerId="verify-email-toast"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <div className="verify-container">
        <div className="verify-card">
          <div className="icon-wrapper">
            <span className="mail-icon">
              <MdEmail />
            </span>
          </div>

          <h2>Please verify your email</h2>
          <p>We sent a verification email to</p>
          <p className="email">{email}</p>

          <button
            className="default-btn btn"
            onClick={handleResendVerification}
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
