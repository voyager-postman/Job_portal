import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postUserLogin, isInsecureTransportError } from "../utils/authApi";
import { getInsecureTransportMessage } from "../utils/secureCredentials";
import { isRateLimitError } from "../utils/apiRateLimitHandler";
import { persistAuthToken } from "../utils/apiHeaders";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { SITE } from "../utils/seo";
import { useTranslation } from "react-i18next";

function EmailOTPVerification() {
  const { t } = useTranslation("global");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.error(t("header.email_password_required"));
      return false;
    }
    if (!captchaVerified) {
      toast.error(t("header.captcha_required"));
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await postUserLogin({
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200 && response.data.success) {
        const { token, user } = response.data;

        setFormData((prev) => ({ ...prev, password: "" }));
        persistAuthToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("user_role", user.role);
        localStorage.setItem("first_name", user.first_name);
        localStorage.setItem("last_name", user.last_name);
        login();

        if (user?.is_completed) {
          navigate("/candidate-profile", { state: { loginSuccess: true } });
        } else {
          navigate("/profile-basic-info", { state: { loginSuccess: true } });
        }
      } else {
        toast.error(response.data?.message || t("header.invalid_credentials"));
      }
    } catch (error) {
      console.error("Login error:", error);

      if (isInsecureTransportError(error)) {
        toast.error(getInsecureTransportMessage());
        return;
      }

      if (isRateLimitError(error)) {
        // Handled globally by installApiRateLimitHandler()
      } else if (Array.isArray(error.response?.data?.errors)) {
        error.response.data.errors.forEach((errMsg) => toast.error(errMsg));
      } else {
        toast.error(
          error.response?.data?.message || t("header.login_failed"),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="login-area-info-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 p-0">
              <div className="login-area">
                <div className="company-logo-info-area">
                  <img
                    src="assets/images/logo/connect-work-ma-login.png"
                    className="main-logo"
                    alt={`${SITE.name} logo`}
                  />
                </div>
                <div className="container">
                  <div className="login">
                    <h1>{t("auth.jobseeker_login_title")}</h1>
                    <form onSubmit={handleLogin}>
                      <div className="form-group">
                        <label>{t("auth.email_label")}</label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          placeholder={t("auth.username_email_placeholder")}
                          value={formData.email}
                          onChange={handleChange}
                        />{" "}
                      </div>
                      <div className="form-group eye-icon-postion">
                        <label>{t("auth.password_label")}</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="form-control"
                            placeholder={t("auth.password_placeholder")}
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <i
                            className={`fa-solid ${
                              showPassword ? "fa-eye-slash" : "fa-eye"
                            } toggle-password`}
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </div>

                      <div className="form-group mb-3">
                        <ReCAPTCHA
                          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                          onChange={() => setCaptchaVerified(true)}
                        />
                      </div>
                      <div className="login-forgot-password">
                        <Link to="/recovery-password">
                          <i className="fa-solid fa-lock" />{" "}
                          {t("auth.forgot_password_link")}
                        </Link>
                      </div>
                      <div className="login-btn-recover-password">
                        <div className="login-recover-password-btn">
                          <button type="submit" className="default-btn btn">
                            {loading ? t("otp.verifying") : t("otp.verify")}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 p-0">
              <div className="login-img-info-area">
                <img
                  src="assets/images/company/book-appointment-orignal.png"
                  alt={t("auth.jobseeker_login_title")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EmailOTPVerification;
