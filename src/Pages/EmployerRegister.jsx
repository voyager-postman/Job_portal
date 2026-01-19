import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { API_BASE_URL } from "../Url/Url";

function EmployerRegister() {
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
      toast.error("Please fill in all required fields");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match");
      return false;
    }

    // Validate captcha
    if (!captchaVerified) {
      toast.error("Please verify the captcha!");
      return false;
    }

    // Validate terms & conditions
    if (!agree) {
      toast.error("You must accept the terms and conditions");
      return false;
    }

    return true; // All validations passed
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}register/company`, {
        email,
        password,
      });
      console.log(response);

      if (response.data.success) {
        const { token, user } = response.data;

        // ✅ store token and user details correctly
        localStorage.setItem("token", token);

        toast.success("Registration successful!");
        login(); // ✅ update auth context / global state

        // ✅ Navigate to verification page with email
        navigate("/verification", { state: { email, token, showToast: true } });
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error(
        error.response?.data?.message || "Registration failed. Try again."
      );
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
    console.log(queryParams);
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
                      alt="logo"
                    />
                  </div>
                  <div className="container">
                    <div className="register">
                      <h3>Employer Sign Up</h3>
                      <div className="form-group">
                        <label>Email Address*</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email Address*"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-group  eye-icon-postion">
                        <label>Password*</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Password*"
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
                        <label>Confirm password*</label>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Confirm Password"
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
                        <label htmlFor="vehicle1">
                          I accept the{" "}
                          <Link
                            to="/terms-condition"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#007bff",
                              textDecoration: "underline",
                            }}
                          >
                            Terms &amp; Condition
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy-policy"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#007bff",
                              textDecoration: "underline",
                            }}
                          >
                            Privacy Policy
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
                            {loading ? "Registering..." : "Register"}
                          </button>
                        </div>
                        <div className="register-login-text-btn">
                          <p>
                            Already have an account?{" "}
                            <Link to="/employer-login">
                              <i className="fa-solid fa-user" />
                              Sign in
                            </Link>
                          </p>
                        </div>
                        <div className="linkeding-login-register-btn-info">
                          <button
                            className="linkeding-login-btn default-btn btn"
                            onClick={handleLinkedinLogin}
                          >
                            <img src="assets/images/icon/linkedin-icon.png" />
                            Linkedin Register
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
                    alt="register-img"
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
