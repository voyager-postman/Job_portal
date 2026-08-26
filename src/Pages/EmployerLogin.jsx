import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { postUserLogin, isInsecureTransportError } from "../utils/authApi";
import { getInsecureTransportMessage } from "../utils/secureCredentials";
import { isRateLimitError, getRateLimitMessage } from "../utils/apiRateLimitHandler";
import {
  getRequestConfig,
  persistLoginSession,
  getPostLoginPath,
  resolveEmployerLoginUser,
  isLoginResponseValid,
} from "../utils/apiHeaders";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { API_BASE_URL } from "../Url/Url";
import { SITE } from "../utils/seo";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import {
  isVerifiedByAdmin,
  toVerifiedByAdminStorage,
} from "../utils/employerVerification";

function EmployerLogin() {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const { login, login: authLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [captchaVerified, setCaptchaVerified] = useState(false); // ✅ state
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
    if (e) e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await postUserLogin({
        email: formData.email,
        password: formData.password,
        role: "Recruiter",
      });
      if (response.status === 200 && response.data.success) {
        const { token, company } = response.data;
        const user = resolveEmployerLoginUser(response.data);

        if (!isLoginResponseValid(response.data) || !user) {
          toast.error(response.data?.message || t("auth.invalid_login_response"));
          return;
        }

        const verifiedByAdmin = isVerifiedByAdmin(
          user.verifiedByAdmin ?? company?.verifiedByAdmin,
        );
        const shouldShowAdminVerifyMsg =
          user.role === "Company" &&
          user.is_completed &&
          !verifiedByAdmin;
        if (shouldShowAdminVerifyMsg) {
          await Swal.fire({
            title: t("auth.account_not_verified_title"),
            text: t("auth.account_not_verified_text"),
            icon: "error",
            confirmButtonText: t("header.ok"),
          });
        }
        persistLoginSession({
          token,
          user,
          data: response.data,
          extras: {
            companyId: user?.companyId || company?.companyId || company?._id,
            verifiedByAdmin: toVerifiedByAdminStorage(
              user?.verifiedByAdmin ?? company?.verifiedByAdmin,
            ),
            profileImage: user?.company?.logo || company?.logo || "",
          },
        });

        setFormData((prev) => ({ ...prev, password: "" }));
        login();
        toast.success(
          response.data?.message || t("header.login_success") || "Login successful!",
          { toastId: "login-success" }
        );

        if (shouldShowAdminVerifyMsg) {
          navigate("/");
          return;
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

      if (isRateLimitError(error)) {
        const rateMsg =
          error.response?.data?.message ||
          getRateLimitMessage(error) ||
          "Your IP has been temporarily blocked due to excessive requests. Try again later.";
        toast.error(rateMsg, { toastId: "api-ip-banned" });
      } else if (
        error.response?.status === 403 &&
        error.response?.data?.action === "resendVerificationEmail"
      ) {
        // Special case: Email not verified
        toast.error(error.response.data.message);
        navigate("/verification", {
          state: { email: formData.email, showToast: true },
        });
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

  // useEffect(() => {
  //   const queryParams = new URLSearchParams(window.location.search);

  //   const success = queryParams.get("success");
  //   const token = queryParams.get("token");
  //   const message = queryParams.get("message"); // backend error message
  //   const provider = queryParams.get("provider"); // optional (github/linkedin)

  //   // ❌ Backend error handling
  //   if (success === "false") {
  //     toast.error(message || "Login failed!");
  //     console.error(`Login failed from ${provider}:`, message);

  //     // clean URL
  //     window.history.replaceState({}, document.title, "/jobPortal");
  //     return;
  //   }

  //   // No login → ignore
  //   if (!success || !token) return;

  //   // ✔ SUCCESS CASE BELOW

  //   const email = queryParams.get("email");
  //   const name = queryParams.get("name");
  //   const avatar = queryParams.get("avatar");
  //   const role = queryParams.get("role");
  //   const isVerified = queryParams.get("isVerified");
  //   const companyId = queryParams.get("companyId");

  //   // Split GitHub or LinkedIn name
  //   const [first_name = "", last_name = ""] = name?.split(" ") || [];

  //   const user = {
  //     email,
  //     role,
  //     first_name,
  //     last_name,
  //     companyId,
  //     profileImage: avatar,
  //     is_completed: isVerified === "true",
  //   };

  //   // 👉 Save login data
  //   localStorage.setItem("token", token);
  //   localStorage.setItem("user", JSON.stringify(user));
  //   localStorage.setItem("user_email", email);
  //   localStorage.setItem("user_role", role);
  //   localStorage.setItem("first_name", first_name);
  //   localStorage.setItem("last_name", last_name);
  //   localStorage.setItem("user_profile", avatar);
  //   localStorage.setItem("user_name", `${first_name} ${last_name}`);
  //   localStorage.setItem("is_completed", user.is_completed);
  //   toast.success("Login successfully");

  //   // Close modal
  //   const loginModal = document.getElementById("exampleModalLogin");
  //   const registerModal = document.getElementById("exampleModalRegister");

  //   if (loginModal?.classList.contains("show")) {
  //     const modalInstance = window.bootstrap.Modal.getInstance(loginModal);
  //     modalInstance?.hide();
  //   }

  //   if (registerModal?.classList.contains("show")) {
  //     const modalInstance = window.bootstrap.Modal.getInstance(registerModal);
  //     modalInstance?.hide();
  //   }

  //   authLogin();

  //   // 👉 Redirect based on role & completion
  //   if (user.is_completed) {
  //     if (role === "Recruiter" || role === "Company") {
  //       navigate("/employer-dashboard");
  //     } else {
  //       navigate("/candidate-profile");
  //     }
  //   } else {
  //     if (role === "Recruiter" || role === "Company") {
  //       navigate("/employer-basic-info");
  //     } else {
  //       navigate("/profile-basic-info");
  //     }
  //   }

  //   // Clean URL
  //   window.history.replaceState({}, document.title, "/jobPortal");
  // }, []);
  // useEffect(() => {
  //   const handleSocialLogin = async () => {
  //     const queryParams = new URLSearchParams(window.location.search);

  //     const success = queryParams.get("success");
  //     const token = queryParams.get("token");
  //     const message = queryParams.get("message");
  //     const provider = queryParams.get("provider");

  //     // ❌ Backend error
  //     if (success === "false") {
  //       toast.error(message || "Login failed!");
  //       console.error(`Login failed from ${provider}:`, message);

  //       window.history.replaceState({}, document.title, "/jobPortal");
  //       return;
  //     }

  //     // ⛔ No social callback
  //     if (!success || !token) return;

  //     const role = queryParams.get("role");
  //     const email = queryParams.get("email");
  //     const name = queryParams.get("name");
  //     const avatar = queryParams.get("avatar");

  //     const is_completed = queryParams.get("is_completed") === "true";
  //     const verifiedByAdmin = queryParams.get("verifiedByAdmin") === "true";

  //     const [first_name = "", last_name = ""] = name?.split(" ") || [];

  //     const user = {
  //       email,
  //       role,
  //       first_name,
  //       last_name,
  //       profileImage: avatar,
  //       is_completed,
  //       verifiedByAdmin,
  //     };

  //     // 💾 Save data
  //     localStorage.setItem("token", token);
  //     localStorage.setItem("user", JSON.stringify(user));
  //     localStorage.setItem("user_role", role);
  //     localStorage.setItem("is_completed", JSON.stringify(is_completed));
  //     localStorage.setItem("verifiedByAdmin", JSON.stringify(verifiedByAdmin));

  //     // authLogin();
  //     // toast.success("Login Successful!");

  //     // 🔒 Block unverified Company users
  //     if (role === "Company" && is_completed && !verifiedByAdmin) {
  //       await Swal.fire({
  //         title: "Account Not Verified",
  //         text: "Your account is not verified by the admin. Please contact support.",
  //         icon: "error",
  //         confirmButtonText: "OK",
  //       });

  //       navigate("/");
  //       return;
  //     }
  //     // 🚀 Redirect
  //     if (is_completed) {
  //       if (role === "Recruiter" || role === "Company") {
  //         navigate("/employer-dashboard");
  //       } else {
  //         navigate("/candidate-profile");
  //       }
  //     } else {
  //       if (role === "Recruiter" || role === "Company") {
  //         navigate("/employer-basic-info");
  //       } else {
  //         navigate("/profile-basic-info");
  //       }
  //     }

  //     // 🧹 Clean URL
  //     requestAnimationFrame(() => {
  //       window.history.replaceState(
  //         {},
  //         document.title,
  //         "/jobPortal/employer-dashboard",
  //       );
  //     });
  //   };

  //   handleSocialLogin();
  // }, []);
  const handleLinkedinLogin = () => {
    const role = "Company";
    window.location.href = `${API_BASE_URL}auth/linkedin?role=${role}`;
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
                    <h1>{t("auth.employer_login_title")}</h1>
                    <form>
                      <div className="form-group">
                        <label>{t("auth.email_label")}</label>
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
                            onClick={() => setShowPassword((prev) => !prev)} // ✅ toggle click
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

                      {/* ✅ reCAPTCHA Checkbox */}
                      <div className="form-group mb-3">
                        <ReCAPTCHA
                          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Google test key
                          onChange={() => setCaptchaVerified(true)}
                        />
                      </div>
                      <div className="login-forgot-password">
                        <Link
                          to="/recovery-password"
                          state={{ role: "employer" }}
                        >
                          <i className="fa-solid fa-lock" />{" "}
                          {t("auth.forgot_password_link")}
                        </Link>
                      </div>
                      <div className="login-btn-recover-password">
                        <div className="login-recover-password-btn">
                          <button
                            type="button"
                            className="default-btn btn"
                            onClick={handleLogin}
                          >
                            {loading
                              ? t("auth.logging_in")
                              : t("auth.login_btn")}
                          </button>
                        </div>
                        <div className="login-singup-bottom-content">
                          <p>
                            {t("auth.no_account_yet")}
                            <Link to="/employer-register">
                              <i className="fa-solid fa-square-plus" />{" "}
                              {t("auth.create_an_account")}
                            </Link>
                          </p>
                        </div>
                      </div>
                    </form>
                    <div className="recruiter-login-content-area">
                      <p>{t("auth.jobseeker_login_prompt")}</p>
                      <Link to="/login">
                        <i className="fa-solid fa-users" />{" "}
                        {t("auth.seeker_login_link")}
                      </Link>
                    </div>
                    <div className="linkeding-login-register-btn-info">
                      <button
                        className="linkeding-login-btn default-btn btn"
                        onClick={handleLinkedinLogin}
                      >
                        <img src="assets/images/icon/linkedin-icon.png" loading="lazy" decoding="async" />
                        {t("auth.linkedin_login")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 p-0">
              <div className="login-img-info-area">
                <img
                  src="assets/images/company/book-appointment-orignal.png"
                  alt={t("auth.employer_login_title")}
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

export default EmployerLogin;
