import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  postCompanyRegister,
  isInsecureTransportError,
} from "../utils/authApi";
import { getInsecureTransportMessage } from "../utils/secureCredentials";
import { extractLoginToken, persistAuthToken } from "../utils/apiHeaders";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { API_BASE_URL } from "../Url/Url";
import { SITE } from "../utils/seo";
import { useTranslation } from "react-i18next";

function EmployerRegister() {
  const { t } = useTranslation("global");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false); // ✅ state
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login, login: authLogin } = useAuth();

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      toast.error(t("header.required_fields"));
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("header.valid_email"));
      return false;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error(t("header.password_length"));
      return false;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error(t("header.password_mismatch"));
      return false;
    }

    // Validate captcha
    if (!captchaVerified) {
      toast.error(t("auth.verify_captcha"));
      return false;
    }

    // Validate terms & conditions
    if (!agree) {
      toast.error(t("header.accept_terms_conditions"));
      return false;
    }

    return true; // All validations passed
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await postCompanyRegister({
        email,
        password,
      });

      if (response.data.success) {
        const { user } = response.data;
        const token = extractLoginToken(response.data);

        setPassword("");
        setConfirmPassword("");
        persistAuthToken(token);
        localStorage.setItem("user_email", email);

        toast.success(t("header.registration_success"));
        login();

        navigate(`/verification?email=${encodeURIComponent(email)}`, {
          state: { email, token, showToast: true },
        });
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


  const handleLinkedinLogin = () => {
    const role = "Company";
    window.location.href = `${API_BASE_URL}auth/linkedin?role=${role}`;
  };
  
  return (
    <>
      <ToastContainer />
      <div>
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
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="container">
                    <div className="register">
                      <h1>{t("auth.employer_signup_title")}</h1>
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
                      <div className="form-group  eye-icon-postion">
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
                          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Google test key
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
                            <Link to="/employer-login">
                              <i className="fa-solid fa-user" />
                              {t("auth.sign_in_link")}
                            </Link>
                          </p>
                        </div>
                        <div className="linkeding-login-register-btn-info">
                          <button
                            className="linkeding-login-btn default-btn btn"
                            onClick={handleLinkedinLogin}
                          >
                            <img src="assets/images/icon/linkedin-icon.png" loading="lazy" decoding="async" />
                            {t("header.linkedin_register")}
                          </button>
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
                    alt={t("auth.employer_signup_title")}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default EmployerRegister;
