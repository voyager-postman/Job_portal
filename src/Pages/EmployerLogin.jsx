import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { API_BASE_URL } from "../Url/Url";
import Swal from "sweetalert2";

function EmployerLogin() {
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
      toast.error("Email and password are required");
      return false;
    }
    if (!captchaVerified) {
      toast.error("Please verify captcha!");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}user/login`, {
        email: formData.email,
        password: formData.password,
        role: "Recruiter",
      });
      console.log(response);
      if (response.status === 200 && response.data.success) {
        const { token, user } = response.data;
        const shouldShowAdminVerifyMsg =
          user.role === "Company" &&
          user.is_completed &&
          user.verifiedByAdmin === false;
        if (shouldShowAdminVerifyMsg) {
          await Swal.fire({
            title: "Account Not Verified",
            text: "Your account is not verified by the admin. Please contact support.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        // Save login data correctly
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("user_role", user.role);
        localStorage.setItem("first_name", user.first_name);
        localStorage.setItem("last_name", user.last_name);
        localStorage.setItem("is_completed", user?.is_completed);
        localStorage.setItem("companyId", user?.companyId);
        localStorage.setItem("verifiedByAdmin", user?.verifiedByAdmin);
        localStorage.setItem("profileImage", user?.company?.logo);
        
        login(); // call auth context

        toast.success("Login successful!");
        if (user?.is_completed) {
          if (user.role == "Recruiter" || user.role == "Company") {
            navigate("/employer-dashboard");
          } else {
            navigate("/candidate-profile");
          }
        } else {
          if (user.role == "Recruiter" || user.role == "Company") {
            navigate("/employer-basic-info");
          } else {
            navigate("/profile-basic-info");
          }
        }
        if (shouldShowAdminVerifyMsg) {
          navigate("/");
          return;
        }
      } else {
        toast.error(response.data?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 429) {
        toast.error(
          "Too many login attempts. Please wait a moment and try again."
        );
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
          error.response?.data?.message || "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const success = queryParams.get("success");
    const token = queryParams.get("token");
    const message = queryParams.get("message"); // backend error message
    const provider = queryParams.get("provider"); // optional (github/linkedin)

    // ❌ Backend error handling
    if (success === "false") {
      toast.error(message || "Login failed!");
      console.error(`Login failed from ${provider}:`, message);

      // clean URL
      window.history.replaceState({}, document.title, "/jobPortal");
      return;
    }

    // No login → ignore
    if (!success || !token) return;

    // ✔ SUCCESS CASE BELOW

    const email = queryParams.get("email");
    const name = queryParams.get("name");
    const avatar = queryParams.get("avatar");
    const role = queryParams.get("role");
    const isVerified = queryParams.get("isVerified");
    const companyId = queryParams.get("companyId");

    // Split GitHub or LinkedIn name
    const [first_name = "", last_name = ""] = name?.split(" ") || [];

    const user = {
      email,
      role,
      first_name,
      last_name,
      companyId,
      profileImage: avatar,
      is_completed: isVerified === "true",
    };

    // 👉 Save login data
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_role", role);
    localStorage.setItem("first_name", first_name);
    localStorage.setItem("last_name", last_name);
    localStorage.setItem("user_profile", avatar);
    localStorage.setItem("user_name", `${first_name} ${last_name}`);
    localStorage.setItem("is_completed", user.is_completed);
    toast.success("Login Successful!");

    // Close modal
    const loginModal = document.getElementById("exampleModalLogin");
    const registerModal = document.getElementById("exampleModalRegister");

    if (loginModal?.classList.contains("show")) {
      const modalInstance = window.bootstrap.Modal.getInstance(loginModal);
      modalInstance?.hide();
    }

    if (registerModal?.classList.contains("show")) {
      const modalInstance = window.bootstrap.Modal.getInstance(registerModal);
      modalInstance?.hide();
    }

    authLogin();

    // 👉 Redirect based on role & completion
    if (user.is_completed) {
      if (role === "Recruiter" || role === "Company") {
        navigate("/employer-dashboard");
      } else {
        navigate("/candidate-profile");
      }
    } else {
      if (role === "Recruiter" || role === "Company") {
        navigate("/employer-basic-info");
      } else {
        navigate("/profile-basic-info");
      }
    }

    // Clean URL
    window.history.replaceState({}, document.title, "/jobPortal");
  }, []);

  const handleLinkedinLogin = () => {
    const role = "Company";
    window.location.href = `${API_BASE_URL}auth/linkedin?role=${role}`;
  };
  return (
    <>
      <ToastContainer />

      <section className="login-area-info-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 p-0">
              <div className="login-area">
                <div className="company-logo-info-area">
                  <img
                    src="assets/images/logo/connect-work-ma-login.png"
                    className="main-logo"
                    alt="logo"
                  />
                </div>
                <div className="container">
                  <div className="login">
                    <h3>Employer Log In</h3>
                    <form>
                      <div className="form-group">
                        <label>Email Address*</label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          placeholder="Username Or Email Address*"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group eye-icon-postion">
                        <label>Password*</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPassword ? "text" : "password"} // ✅ toggle here
                            id="password"
                            className="form-control"
                            placeholder="Password*"
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
                        <Link to="/recovery-password">
                          <i className="fa-solid fa-lock" /> Forgot your
                          password?
                        </Link>
                      </div>
                      <div className="login-btn-recover-password">
                        <div className="login-recover-password-btn">
                          <button
                            type="button"
                            className="default-btn btn"
                            onClick={handleLogin}
                          >
                            {loading ? "Logging in..." : "Login"}
                          </button>
                        </div>
                        <div className="login-singup-bottom-content">
                          <p>
                            Don't have an account yet?
                            <Link to="/employer-register">
                              <i className="fa-solid fa-square-plus" /> Create
                              an account
                            </Link>
                          </p>
                        </div>
                      </div>
                    </form>
                    <div className="recruiter-login-content-area">
                      <p>
                        Are you a Job seeker ? Log in via our dedicated portal
                      </p>
                      <Link to="/login">
                        <i className="fa-solid fa-users" /> Seeker Login
                      </Link>
                    </div>
                    <div className="linkeding-login-register-btn-info">
                      <button
                        className="linkeding-login-btn default-btn btn"
                        onClick={handleLinkedinLogin}
                      >
                        <img src="assets/images/icon/linkedin-icon.png" />
                        Linkedin Login
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
                  alt="register-img"
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
