import { useState, useEffect, useCallback } from "react";
import { MdEmail } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  extractLoginToken,
  getRequestConfig,
  getUserToken,
  isAuthReady,
  persistAuthToken,
  resolveAuthToken,
} from "../utils/apiHeaders";

const VerifyEmail = () => {
  const { t } = useTranslation("global");
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const stateEmail = location.state?.email;
  const stateToken = location.state?.token;
  const showToast = location.state?.showToast;

  const email =
    stateEmail ||
    queryParams.get("email") ||
    localStorage.getItem("user_email") ||
    "";

  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const getSessionToken = useCallback(() => {
    const queryToken = new URLSearchParams(location.search).get("token");
    return resolveAuthToken(stateToken, queryToken, getUserToken());
  }, [stateToken, location.search]);

  useEffect(() => {
    if (email) {
      localStorage.setItem("user_email", email);
    }
    const token = getSessionToken();
    if (token) {
      persistAuthToken(token);
    }
  }, [email, getSessionToken]);

  useEffect(() => {
    if (showToast) {
      toast.info(t("verification.check_email_toast"));
    }
  }, [showToast, t]);

  const checkVerificationStatus = async () => {
    if (!email) return;

    const sessionToken = getSessionToken();
    if (!sessionToken && !isAuthReady()) return;

    try {
      const statusUrl = email
        ? `${API_BASE_URL}checkVerificationStatus?email=${encodeURIComponent(email)}`
        : `${API_BASE_URL}checkVerificationStatus`;

      const config = getRequestConfig();
      if (sessionToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${sessionToken}`,
        };
      }

      const res = await axios.get(statusUrl, config);

      if (res.data?.verified === true && !isVerified) {
        setIsVerified(true);

        const authToken = resolveAuthToken(
          extractLoginToken(res.data),
          sessionToken,
          getUserToken(),
        );
        if (authToken) {
          persistAuthToken(authToken);
        }

        toast.success(t("verification.email_verified_toast"), {
          containerId: "verify-email-toast",
          autoClose: 2000,
        });

        setTimeout(() => {
          const params = new URLSearchParams();
          params.set("email", email);
          params.set("role", res.data.role || "JobSeeker");
          navigate(`/account-verified?${params.toString()}`, { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.error("Verification status error:", error);
    }
  };

  useEffect(() => {
    if (!email || isVerified) return;

    checkVerificationStatus();
    const interval = setInterval(checkVerificationStatus, 5000);
    return () => clearInterval(interval);
  }, [email, isVerified]);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error(t("verification.email_required"), {
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
        toast.success(t("verification.verification_resent"), {
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

          <h1>{t("verification.verify_email_title")}</h1>
          <p>{t("verification.verify_email_sent")}</p>
          <p className="email">{email}</p>

          <button
            className="default-btn btn"
            onClick={handleResendVerification}
            disabled={loading}
          >
            {loading
              ? t("verification.sending")
              : t("verification.resend_verification")}
          </button>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
