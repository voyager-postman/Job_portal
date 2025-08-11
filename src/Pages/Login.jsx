import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance"; // path based on your folder structure
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

import { API_BASE_URL } from "../Url/Url";
// import bannerImg from "";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}user/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200 && response.data.success) {
        const { token, user } = response.data;

        // Save login data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("user_role", user.role);
        localStorage.setItem("first_name", user.first_name);
        localStorage.setItem("last_name", user.last_name);
        login(); // call your login context or auth function

        toast.success("Login successful!");

        // Navigate based on profile completion
        if (user?.is_completed) {
          navigate("/candidate-profile");
        } else {
          navigate("/profile-basic-info");
        }
      } else {
        toast.error(response.data?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (Array.isArray(error.response?.data?.errors)) {
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

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <>
      <ToastContainer />
      {/* <div className="page-banner-area bg-f0f4fc">
        <div className="container">
          <div className="page-banner-content">
            <h1>Login</h1>
            <ul>
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>Login</li>
            </ul>
          </div>
        </div>
      </div> */}
      <section class="inner-banners-info-area">
        <div class="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="breadcrumb Img"
          />
        </div>
        <div class="inner-banners-title-info">
          <div class="container">
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="inner-page-banner-title">
                  <h2>Login</h2>
                  <ul>
                    <li class="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Login</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <h3>Log In</h3>
            <form onSubmit={handleLogin}>
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
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Remember Me
                </label>
              </div>

              <div className="login-btn-recover-password">
                <div className="login-btn">
                  <button type="submit" className="default-btn btn">
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
                <div className="recover-password">
                  <span className="default-btn btn">
                    <Link to="/recovery-password">Lost your password?</Link>
                  </span>
                </div>
              </div>

              <label>
                Don't have an account?{" "}
                <span
                  onClick={goToRegister}
                  style={{ cursor: "pointer", color: "#007bff" }}
                >
                  Sign up
                </span>
              </label>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
