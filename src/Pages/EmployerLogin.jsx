import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

import { API_BASE_URL } from "../Url/Url";

function EmployerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

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
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}user/login`, {
        email: formData.email,
        password: formData.password,
      });
      console.log(response);
      if (response.status === 200 && response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(token));
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("user_role", user.role);
        localStorage.setItem("first_name", user.first_name);
        localStorage.setItem("last_name", user.last_name);
        login();
        toast.success("Login successful!");
        // if (user?.is_completed) {
        navigate("/employer-dashboard");
      } else {
        toast.error(response.data?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 429) {
        // Handle Too Many Requests
        toast.error(
          "Too many login attempts. Please wait a moment and try again."
        );
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
  return (
    <>
      <ToastContainer />
      <div>
        <section className="inner-banners-info-area">
          <div className="inner-banners-img-area">
            <img
              src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
              alt="breadcrumb Img"
            />
          </div>
          <div className="inner-banners-title-info">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="inner-page-banner-title">
                    <h2>Employer Login</h2>
                    <ul>
                      <li className="menu-divide-arrow">
                        <Link to="/">Home</Link>
                      </li>
                      <li>Employer Login</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*End Page Banner Area*/}
        {/*Start Login Area*/}
        <div className="login-area ptb-100">
          <div className="container">
            <div className="login">
              <div class="company-logo-info-area">
                <img
                  src="/jobPortal/assets/images/logo/connect-work-ma-login.png"
                  class="main-logo"
                  alt="logo"
                />
              </div>
              <h3>Employer Log In</h3>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Username Or Email Address*"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Password*"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultValue
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Keep Me Signed In
                </label>
              </div>
              <div className="login-btn-recover-password">
                <div className="login-recover-password-btn">
                  <button
                    type="button"
                    className="default-btn btn"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                </div>
                <div className="employer-login-social-btn">
                  <a href="#" className="default-btn btn">
                    <div className="social-icon">
                      <img src="/jobPortal/assets/images/icon/Google-icon.png" />
                    </div>
                  </a>
                </div>
              </div>

              <div className="employer-login-singup-password-btn">
                <div className="employer-login-singup-password-link">
                  <p>Don't have an account yet?</p>
                  <Link to="/employer-register">Sign up</Link>
                </div>
                <div className="employer-login-singup-password-link">
                  <p>Forgot your password?</p>
                  <Link to="/recovery-password">Reset your password</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployerLogin;
