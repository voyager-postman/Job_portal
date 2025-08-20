// import React from "react";

// import { Link, useNavigate } from "react-router-dom";
// function Login() {
//   const navigate = useNavigate();
//   const handleRegister = () => {
//     navigate("/register");
//   };
//   return (
//     <>
//       <div className="page-banner-area bg-f0f4fc">
//         <div className="container">
//           <div className="page-banner-content">
//             <h1>Login</h1>
//             <ul>
//               <li>
//                 <Link to="/" className="nav-link">
//                   {" "}
//                   Home
//                 </Link>
//               </li>
//               <li>Login</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//       <div className="login-area ptb-100">
//         <div className="container">
//           <div className="login">
//             <h3>Log In</h3>
//             <form>
//               <div className="form-group">
//                 <input
//                   type="email"
//                   id="email"
//                   className="form-control"
//                   placeholder="Username Or Email Address*"
//                 />
//               </div>
//               <div className="form-group">
//                 <input
//                   type="password"
//                   id="password"
//                   className="form-control"
//                   placeholder="Password*"
//                 />
//               </div>
//               <div className="form-check">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   defaultValue
//                   id="flexCheckDefault"
//                 />
//                 <label className="form-check-label" htmlFor="flexCheckDefault">
//                   Remember Me
//                 </label>
//               </div>
//               <div className="login-btn-recover-password">
//                 <div className="login-btn">
//                   <button type="submit" className="default-btn btn">
//                     Login
//                   </button>
//                 </div>
//                 <div className="recover-password">
//                   <span className="default-btn btn">
//                     <Link to="/recovery-password">Lost your password?</Link>
//                   </span>
//                 </div>
//               </div>
//               <label>
//                 Don't have an account?{" "}
//                 <span onClick={handleRegister}>Sign in</span>
//               </label>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance"; // path based on your folder structure
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

import { API_BASE_URL } from "../Url/Url";

function EmployerRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!agree) {
      toast.error("You must accept the terms and conditions");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}register/recruiter`, // ✅ fixed missing slash
        {
          email,
          password,
        }
      );
      console.log(response);

      if (response.data.success) {
        const { token, user } = response.data;

        // ✅ store token and user details correctly
        localStorage.setItem("token", token);
        toast.success("Registration successful!");
        login(); // ✅ update auth context / global state
        navigate("/employer-basic-info");
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
                    <h2>Employer Register</h2>
                    <ul>
                      <li className="menu-divide-arrow">
                        <Link to="/">Home</Link>
                      </li>
                      <li>Employer Register</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*End Page Banner Area*/}
        {/*Start Register Area*/}
        <div className="register-area ptb-100">
          <div className="container">
            <div className="register">
              <div class="company-logo-info-area">
                <img
                  src="/jobPortal/assets/images/logo/connect-work-ma-login.png"
                  class="main-logo"
                  alt="logo"
                />
              </div>
              <h3>Employer Register</h3>
              <form>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password*"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {/* <div className="register-terms-Policy-box">
                  <input
                    type="checkbox"
                    id="vehicle1"
                    name="vehicle1"
                    defaultValue="Bike"
                  />
                  <label htmlFor="vehicle1">
                    {" "}
                    I accept the <a href="#">Terms &amp; Condition</a> and{" "}
                    <a href="#">Privacy Policy</a>
                  </label>
                </div> */}
                <div className="register-terms-Policy-box">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <label htmlFor="terms">
                    I accept the <a href="#">Terms &amp; Condition</a> and{" "}
                    <a href="#">Privacy Policy</a>
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
                  <div className="register-social-icon employer-register">
                    <button className="default-btn btn">
                      <div className="social-icon">
                        <img src="/jobPortal/assets/images/icon/Google-icon.png" />
                      </div>
                      {/* <div class="social-icon-name">
                       Google
                      </div> */}
                    </button>
                  </div>
                </div>
                {/* <div class="register-or-content">
                    <p>OR</p>  
                   </div> */}
                <div className="register-login-text-btn">
                  <p>
                    Already have an account?{" "}
                    <Link to="/employer-login">Sign in</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployerRegister;
