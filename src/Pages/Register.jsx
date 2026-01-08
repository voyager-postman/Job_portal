import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "../Services/axios";import Spinner from "../Conponets/Spinner"; // optional
import { useAuth } from "../context/AuthContext"; // adjust path
import ReCAPTCHA from "react-google-recaptcha";

import { API_BASE_URL } from "../Url/Url";
function Register() {
  const [email, setEmail] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false); // ✅ state
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

  // const handleRegister = async () => {
  //   if (!validateForm()) return;

  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}user/register`, {
  //       email,
  //       password,
  //     });

  //     if (response.status === 200 && response.data.success) {
  //       const { token, user } = response.data;

  //       localStorage.setItem("token", token);

  //       toast.success("Registration successful!");
  //       login();
  //       navigate("/profile-basic-info");
  //     } else {
  //       toast.error("Something went wrong, please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Register error:", error);
  //     toast.error(
  //       error.response?.data?.message || "Registration failed. Try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}user/register`, {
        email,
        password,
      });

      if (response.status === 200 && response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);

        toast.success("Registration successful!");
        login();

        // ✅ Navigate to verification page and pass email
        navigate("/verification", { state: { email, token, showToast: true } });
      } else {
        toast.error("Something went wrong, please try again.");
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
                    <h3>JobSeeker Sign Up</h3>
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
                        placeholder="Confirm Password*"
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
                          Terms &amp; Conditions
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
                          <Link to="/login">
                            <i className="fa-solid fa-user" />
                            Sign in
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

export default Register;
