import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { postUserRegister, isInsecureTransportError } from "../utils/authApi";
import { getInsecureTransportMessage } from "../utils/secureCredentials";
import { extractLoginToken, persistAuthToken } from "../utils/apiHeaders";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { SITE } from "../utils/seo";
import { useTranslation } from "react-i18next";

function Register() {
  const { t } = useTranslation("global");
  const [email, setEmail] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      toast.error(t("header.required_fields"));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("header.valid_email"));
      return false;
    }
    if (password.length < 6) {
      toast.error(t("header.password_length"));
      return false;
    }
    if (password !== confirmPassword) {
      toast.error(t("header.password_mismatch"));
      return false;
    }
    if (!captchaVerified) {
      toast.error(t("auth.verify_captcha"));
      return false;
    }
    if (!agree) {
      toast.error(t("header.accept_terms_conditions"));
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await postUserRegister({ email, password });

      if (response.status === 200 && response.data.success) {
        const { user } = response.data;
        const token = extractLoginToken(response.data);
        setPassword("");
        setConfirmPassword("");
        persistAuthToken(token);
        localStorage.setItem("user_email", email);
        localStorage.setItem("extract_id", user?.id);
        toast.success(t("header.registration_success"));
        login();
        navigate(`/verification?email=${encodeURIComponent(email)}`, {
          state: { email, token, showToast: true },
        });
      } else {
        toast.error(t("auth.something_wrong_try_again"));
      }
    } catch (error) {
      console.error("Register error:", error);
      if (isInsecureTransportError(error)) {
        toast.error(getInsecureTransportMessage());
        return;
      }
      toast.error(
        error.response?.data?.message || t("header.registration_failed"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="register-area-info-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 p-0">
              <div className="register-area">
                <div className="register-logo-heading">
                  <img
                    src="assets/images/logo/connect-work-ma-login.png"
                    className="main-logo"
                    alt={`${SITE.name} logo`}
                  />
                </div>
                <div className="container">
                  <div className="register">
                    <h1>{t("auth.jobseeker_signup_title")}</h1>
                    <div className="form-group">
                      <label>{t("auth.email_label")}</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder={t("auth.email_placeholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group eye-icon-postion">
                      <label>{t("auth.password_label")}</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder={t("auth.password_placeholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <i
                        className={`fa-solid ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        } toggle-password`}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <div className="form-group eye-icon-postion">
                      <label>{t("auth.confirm_password_label")}</label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        placeholder={t("auth.confirm_password_placeholder")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <i
                        className={`fa-solid ${
                          showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                        } toggle-password`}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <ReCAPTCHA
                        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                        onChange={() => setCaptchaVerified(true)}
                      />
                    </div>
                    <div className="register-terms-Policy-box">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                      />
                      <label htmlFor="terms">
                        {t("header.I_agree_to_the")}{" "}
                        <Link
                          to="/terms-condition"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#007bff",
                            textDecoration: "underline",
                          }}
                        >
                          {t("auth.terms_conditions")}
                        </Link>{" "}
                        {t("header.and")}{" "}
                        <Link
                          to="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#007bff",
                            textDecoration: "underline",
                          }}
                        >
                          {t("auth.privacy_policy")}
                        </Link>
                      </label>
                    </div>
                    <div className="register-and-social-icon-info">
                      <div className="register-btn">
                        <button
                          type="button"
                          onClick={handleRegister}
                          className="default-btn btn"
                        >
                          {loading
                            ? t("auth.registering")
                            : t("auth.register_btn")}
                        </button>
                      </div>
                      <div className="register-login-text-btn">
                        <p>
                          {t("auth.already_have_account")}{" "}
                          <Link to="/login">
                            <i className="fa-solid fa-user" />
                            {t("auth.sign_in_link")}
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 p-0">
              <div className="register-img-info-area">
                <img
                  src="assets/images/company/book-appointment-orignal.png"
                  alt={t("auth.jobseeker_signup_title")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;
