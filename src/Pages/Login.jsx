import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance"; // path based on your folder structure
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
// import bannerImg from "";

function Login() {
  const { login, updateProfileImage, updateName } = useAuth();
  const navigate = useNavigate();

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

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   setLoading(true);

  //   try {
  //     const response = await axios.post(`${API_BASE_URL}user/login`, {
  //       email: formData.email,
  //       password: formData.password,
  //     });

  //     if (response.status === 200 && response.data.success) {
  //       const { token, user } = response.data;

  //       // Save login data
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("user", JSON.stringify(user));
  //       localStorage.setItem("user_id", user.id);
  //       localStorage.setItem("user_email", user.email);
  //       localStorage.setItem("user_role", user.role);
  //       localStorage.setItem("first_name", user.first_name);
  //       localStorage.setItem("last_name", user.last_name);
  //       login(); // call your login context or auth function

  //       toast.success("Login successful!");

  //       // Navigate based on profile completion
  //       if (user?.is_completed) {
  //         navigate("/candidate-profile");
  //       } else {
  //         navigate("/profile-basic-info");
  //       }
  //     } else {
  //       toast.error(response.data?.message || "Invalid credentials");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);

  //     if (error.response?.status === 429) {
  //       // Handle Too Many Requests
  //       toast.error(
  //         "Too many login attempts. Please wait a moment and try again."
  //       );
  //     } else if (Array.isArray(error.response?.data?.errors)) {
  //       error.response.data.errors.forEach((errMsg) => toast.error(errMsg));
  //     } else {
  //       toast.error(
  //         error.response?.data?.message || "Login failed. Please try again."
  //       );
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}user/login`, {
        email: formData.email,
        password: formData.password,
        role: "JobSeeker",
      });

      if (response.status === 200 && response.data.success) {
        const { token, user, profile } = response.data;
        console.log(response.data);
        // Save login data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("user_role", user.role);
        localStorage.setItem("first_name", user.first_name);
        localStorage.setItem("last_name", user.last_name);
        localStorage.setItem("is_completed", user?.is_completed);
        try {
          const profileRes = await axios.get(
            `${API_BASE_URL}candidate/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const profileImg = profileRes.data?.profile?.profileImage;
          const profileData = profileRes.data?.profile;

          if (profileImg && profileImg.trim() !== "") {
            const fullUrl = `${API_IMAGE_URL}${profileImg}`;
            localStorage.setItem("profileImage", fullUrl);

            // ✅ Update AuthContext instantly
            if (typeof updateProfileImage === "function") {
              updateProfileImage(fullUrl);
            }
          } else {
            localStorage.setItem(
              "profileImage",
              "/jobPortal/assets/images/dashboard/images1.png"
            );
          }
          if (profileData) {
            updateName(profileData.first_name, profileData.last_name);
          }
        } catch (profileErr) {
          console.error("Profile fetch error:", profileErr);
        }
        login(); // call your login context or auth function

        toast.success("Login successful!");

        // Navigate based on profile completion
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
      } else {
        toast.error(response.data?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (
        error.response?.data?.success === false &&
        error.response?.data?.action === "resendVerificationEmail"
      ) {
        // Special case: Email not verified
        toast.error(error.response.data.message);
        navigate("/verification", {
          state: { email: formData.email, showToast: true },
        });
      } else if (error.response?.status === 429) {
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
                    <h3>Jobseeker Log In</h3>
                    <form onSubmit={handleLogin}>
                      <div className="form-group">
                        <label>Email Address*</label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          placeholder="Username Or Email Address*"
                          value={formData.email}
                          onChange={handleChange}
                        />{" "}
                      </div>
                      <div className="form-group eye-icon-postion">
                        <label>Password*</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPassword ? "text" : "password"} // ✅ toggle type
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
                            onClick={() => setShowPassword((prev) => !prev)} // ✅ toggle state
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
                          <button type="submit" className="default-btn btn">
                            {loading ? "Logging in..." : "Login"}
                          </button>
                        </div>
                        <div className="login-singup-bottom-content">
                          <p>
                            Don't have an account yet?
                            <Link to="/register">
                              <i className="fa-solid fa-square-plus" /> Create
                              an account
                            </Link>
                          </p>
                        </div>
                      </div>
                    </form>
                    <div className="recruiter-login-content-area">
                      <p>
                        Are you a recruiter? Log in via our dedicated portal
                      </p>
                      <Link to="/employer-login">
                        <i className="fa-solid fa-users" /> Recruiter Loging
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

export default Login;
