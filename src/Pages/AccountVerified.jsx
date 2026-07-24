import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  persistAuthToken,
  resolveAuthToken,
  getUserToken,
} from "../utils/apiHeaders";

const AccountVerified = () => {
  const { t } = useTranslation("global");
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const reason = queryParams.get("reason");
  const email =
    queryParams.get("email") || localStorage.getItem("user_email") || "";
  const role =
    queryParams.get("role") || localStorage.getItem("user_role") || "";
  const token = resolveAuthToken(queryParams.get("token"), getUserToken());

  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("isLoggedIn");
    if (email) localStorage.setItem("user_email", email);
    if (role) localStorage.setItem("user_role", role);
    if (token) persistAuthToken(token);
  }, [reason, email, role, token]);

  const handleContinue = () => {
    if (token) {
      persistAuthToken(token);
    }
    if (email) localStorage.setItem("user_email", email);
    if (role) {
      localStorage.setItem("user_role", role);
      localStorage.setItem("isLoggedIn", "true");
    }

    if (role === "JobSeeker") {
      navigate("/profile-basic-info", { replace: true });
    } else if (role === "Recruiter" || role === "Company") {
      navigate("/employer-basic-info", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="verified-container">
      <div className="verified-card">
        <div className="icon-wrapper">
          <span className="check-icon">✔️</span>
        </div>
        <h1>{t("verification.account_verified_title")}</h1>
        <p>
          {t("verification.congratulations")},{" "}
          <span className="username">{email}</span>
        </p>
        <p className="message">
          {t("verification.account_verified_profile_message")}
        </p>
        <div className="personal-info-btn">
          <button className="default-btn btn" onClick={handleContinue}>
            {t("verification.continue_btn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountVerified;
