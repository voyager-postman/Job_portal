import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { postUserLogin, isInsecureTransportError } from "../utils/authApi";
import { getInsecureTransportMessage } from "../utils/secureCredentials";
import { isRateLimitError, getRateLimitMessage } from "../utils/apiRateLimitHandler";
import { getRequestConfig, persistLoginSession, getPostLoginPath, extractLoginToken } from "../utils/apiHeaders";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { API_BASE_URL } from "../Url/Url";
import { SITE } from "../utils/seo";
import { useTranslation } from "react-i18next";

function Login() {
  const { t } = useTranslation("global");
  const { login, updateProfileImage, updateName } = useAuth();
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
        role: "JobSeeker",
      });

      if (response.status === 200 && response.data.success) {
        const { token, user } = response.data;

        if (!user) {
          toast.error(response.data?.message || t("header.invalid_credentials"));
          return;
        }

        persistLoginSession({
          token,
          user,
          data: response.data,
          extras: { extract_id: user?.id },
        });
        try {
          const profileRes = await axios.get(
            `${API_BASE_URL}candidate/profile`,
            getRequestConfig(),
          );
          const profileImg = profileRes.data?.profile?.profileImage;
          const profileData = profileRes.data?.profile;
          if (profileImg && profileImg.trim() !== "") {
            const fullUrl = `${profileImg}`;
            localStorage.setItem("profileImage", fullUrl);
            if (typeof updateProfileImage === "function") {
              updateProfileImage(fullUrl);
            }
          } else {
            localStorage.setItem(
              "profileImage",
              "/jobPortal/assets/images/dashboard/images.png",
            );
          }
          if (profileData) {
            updateName(profileData.first_name, profileData.last_name);
          }
        } catch (profileErr) {
          console.error("Profile fetch error:", profileErr);
        }
        setFormData((prev) => ({ ...prev, password: "" }));
        login();
        toast.success(
          response.data?.message || t("header.login_success") || "Login successful!",
          { toastId: "login-success" }
        );

        if (
          process.env.NODE_ENV === "development" &&
          !extractLoginToken(response.data)
        ) {
          toast.warn(
            "Local dev: no JWT in login response. Use a local API URL or ask backend to return token for development.",
            { autoClose: 8000 },
          );
        }

        navigate(getPostLoginPath(user));
      } else {
        toast.error(response.data?.message || t("header.invalid_credentials"));
      }
    } catch (error) {
      console.error("Login error:", error);

      if (isInsecureTransportError(error)) {
        toast.error(getInsecureTransportMessage());
        return;
      }

      if (
        error.response?.data?.success === false &&
        error.response?.data?.action === "resendVerificationEmail"
      ) {
        toast.error(error.response.data.message);
        navigate("/verification", {
          state: { email: formData.email, showToast: true },
        });
      } else if (isRateLimitError(error)) {
        const rateMsg =
          error.response?.data?.message ||
          getRateLimitMessage(error) ||
          "Your IP has been temporarily blocked due to excessive requests. Try again later.";
        toast.error(rateMsg, { toastId: "api-ip-banned" });
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
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="container">
                  <div className="login">
                    <h1>{t("auth.jobseeker_login_title")}</h1>
                    <form onSubmit={handleLogin}>
                      <div className="form-group">
                        <label htmlFor="email">{t("auth.email_label")}</label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          placeholder={t("auth.username_email_placeholder")}
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group eye-icon-postion">
                        <label htmlFor="password">{t("auth.password_label")}</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="form-control"
                            placeholder={t("auth.password_placeholder")}
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            <i
                              className={`fa-solid ${
                                showPassword ? "fa-eye-slash" : "fa-eye"
                              }`}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      <div className="form-group mb-3">
                        <ReCAPTCHA
                          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                          onChange={() => setCaptchaVerified(true)}
                        />
                      </div>
                      <div className="login-forgot-password">
                        <Link
                          to="/recovery-password"
                          state={{ role: "jobseeker" }}
                        >
                          <i className="fa-solid fa-lock" />{" "}
                          {t("auth.forgot_password_link")}
                        </Link>
                      </div>
                      <div className="login-btn-recover-password">
                        <div className="login-recover-password-btn">
                          <button type="submit" className="default-btn btn">
                            {loading
                              ? t("auth.logging_in")
                              : t("auth.login_btn")}
                          </button>
                        </div>
                        <div className="login-singup-bottom-content">
                          <p>
                            {t("auth.no_account_yet")}
                            <Link to="/register">
                              <i className="fa-solid fa-square-plus" />{" "}
                              {t("auth.create_an_account")}
                            </Link>
                          </p>
                        </div>
                      </div>
                    </form>
                    <div className="recruiter-login-content-area">
                      <p>{t("auth.recruiter_login_prompt")}</p>
                      <Link to="/employer-login">
                        <i className="fa-solid fa-users" />{" "}
                        {t("auth.recruiter_login_link")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 p-0">
              <div className="login-img-info-area">
                <img
                  src="assets/images/company/book-appointment-orignal.png"
                  alt={t("auth.jobseeker_login_title")}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
