import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { clearAuthStorage } from "../utils/apiHeaders";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const VerifiedCancel = () => {
  const { t } = useTranslation("global");
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const reason = queryParams.get("reason");
  const email = queryParams.get("email");

  useEffect(() => {
    clearAuthStorage();
  }, [email]);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error(t("verification.resend_email_required"));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}resendVerificationEmail`,
        { email },
      );
      const { success, message } = response.data;
      if (success) {
        toast.success(t("verification.resend_success"));
      } else if (success === false) {
        toast.success(message);
      } else {
        toast.error(message || t("verification.resend_failed"));
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error(
        error.response?.data?.message || t("verification.resend_failed"),
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
          <h1>{t("verification.verification_failed_title")}</h1>
          <p>
            {t("verification.verification_failed_message")}{" "}
            <span className="username">{email}</span>
          </p>
          {reason && (
            <p className="reason-text">
              {t("verification.reason_label")} {reason}
            </p>
          )}
          <p className="message">
            {t("verification.verification_failed_resend_prompt")}
          </p>
          <div className="personal-info-btn">
            <button
              className="default-btn btn"
              onClick={handleResendVerification}
              disabled={loading}
            >
              {loading
                ? t("verification.resending")
                : t("verification.resend_verification")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifiedCancel;
