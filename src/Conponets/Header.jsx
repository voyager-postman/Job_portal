import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import axios from "axios";
function Header({ bgColor }) {
  const { t, i18n } = useTranslation("global");
  const {
    isLoggedIn,
    profileImage,
    firstName,
    lastName,
    login: authLogin,
    updateProfileImage,
    updateName,
  } = useAuth();
  const userRole = localStorage.getItem("user_role");
  const emailName = localStorage.getItem("user_email");
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isEmployerPage =
    location.pathname === "/employer-home" ||
    location.pathname === "/employer-login" ||
    location.pathname === "/employer-register";

  const handleLogout = () => {
    logout(); // clears localStorage + state
    navigate("/"); // redirect to home or login
  };

  const handleLogin = () => {
    // do login logic...
    navigate("/login"); // redirect to dashboard
  };
  const handleRegister = () => {
    // do login logic...
    navigate("/register"); // redirect to dashboard
  };
  const handleGithubLogin = () => {
    window.location.href = `${API_BASE_URL}auth/github`;
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

    // Split GitHub or LinkedIn name
    const [first_name = "", last_name = ""] = name?.split(" ") || [];

    const user = {
      email,
      role,
      first_name,
      last_name,
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
    const role = "JobSeeker";
    window.location.href = `${API_BASE_URL}auth/linkedin?role=${role}`;
  };

  // const login = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       console.log("Google Access Token:", tokenResponse.access_token);

  //       // 1️⃣ Fetch Google User Info
  //       const res = await fetch(
  //         "https://www.googleapis.com/oauth2/v3/userinfo",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${tokenResponse.access_token}`,
  //           },
  //         }
  //       );

  //       const userInfo = await res.json();
  //       console.log("Google User Info:", userInfo);

  //       const payload = {
  //         googleId: userInfo.sub,
  //         email: userInfo.email,
  //         first_name: userInfo.given_name,
  //         last_name: userInfo.family_name,
  //         profileImage: userInfo.picture,
  //       };

  //       console.log("Sending to Backend:", payload);

  //       // 2️⃣ Send to Backend API
  //       const apiRes = await axios.post(`${API_BASE_URL}google/login`, payload);
  //       console.log("Backend Response:", apiRes.data);

  //       if (!apiRes.data?.success) {
  //         toast.error(apiRes.data?.message || "Invalid credentials");
  //         return;
  //       }

  //       const { token, user } = apiRes.data;

  //       localStorage.setItem("token", token);
  //       localStorage.setItem("user", JSON.stringify(user));
  //       localStorage.setItem("user_id", user?._id);
  //       localStorage.setItem("user_email", user?.email);
  //       localStorage.setItem("user_role", user?.role);
  //       localStorage.setItem("first_name", user?.first_name);
  //       localStorage.setItem("last_name", user?.last_name);
  //       localStorage.setItem("is_completed", user?.is_completed);
  //       localStorage.setItem("user_profile", user?.profileImage);
  //       localStorage.setItem(
  //         "user_name",
  //         `${user?.first_name} ${user?.last_name}`
  //       );

  //       // 4️⃣ Fetch Profile Data
  //       try {
  //         const profileRes = await axios.get(
  //           `${API_BASE_URL}candidate/profile`,
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );

  //         const profileData = profileRes.data?.profile;
  //         const profileImg = profileData?.profileImage;

  //         if (profileImg && profileImg.trim() !== "") {
  //           const fullUrl = `${API_IMAGE_URL}${profileImg}`;
  //           localStorage.setItem("profileImage", fullUrl);
  //           if (typeof updateProfileImage === "function") {
  //             updateProfileImage(fullUrl);
  //           }
  //         } else {
  //           localStorage.setItem(
  //             "profileImage",
  //             "/jobPortal/assets/images/dashboard/images1.png"
  //           );
  //         }

  //         if (profileData) {
  //           updateName(profileData.first_name, profileData.last_name);
  //         }
  //       } catch (profileErr) {
  //         console.error("Profile fetch error:", profileErr);
  //       }
  //       authLogin();
  //       toast.success("Login successful!");
  //       console.log(user?.is_completed);
  //       // 7️⃣ Navigation
  //       if (user?.is_completed) {
  //         console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  //         if (user.role === "Recruiter" || user.role === "Company") {
  //           navigate("/employer-dashboard");
  //         } else {
  //           console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

  //           navigate("/candidate-profile");
  //         }
  //       } else {
  //         if (user.role === "Recruiter" || user.role === "Company") {
  //           navigate("/employer-basic-info");
  //         } else {
  //           navigate("/profile-basic-info");
  //         }
  //       }

  //       // 8️⃣ Close Login Modal
  //       const modal = document.getElementById("exampleModalLogin");
  //       if (modal) {
  //         const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
  //         bootstrapModal?.hide();
  //       }
  //     } catch (error) {
  //       console.error("Google Login Error:", error.response?.data || error);
  //       toast.error("Google login failed!");
  //     }
  //   },

  //   onError: () => {
  //     console.log("Google Login Failed");
  //     toast.error("Google login failed. Try again.");
  //   },

  //   flow: "implicit",
  // });
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Google Access Token:", tokenResponse.access_token);

        // 1️⃣ Fetch Google User Info
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = await res.json();
        console.log("Google User Info:", userInfo);

        const payload = {
          googleId: userInfo.sub,
          email: userInfo.email,
          first_name: userInfo.given_name,
          last_name: userInfo.family_name,
          profileImage: userInfo.picture,
        };

        console.log("Sending to Backend:", payload);

        // 2️⃣ Send to Backend API
        const apiRes = await axios.post(`${API_BASE_URL}google/login`, payload);
        console.log("Backend Response:", apiRes.data);

        // ⚠️ Handle backend error (Google or LinkedIn restriction)
        if (!apiRes.data?.success) {
          toast.error(apiRes.data.message || "Login failed");
          return; // STOP EXECUTION HERE
        }

        const { token, user } = apiRes.data;

        // 3️⃣ Save Data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user_id", user?._id);
        localStorage.setItem("user_email", user?.email);
        localStorage.setItem("user_role", user?.role);
        localStorage.setItem("first_name", user?.first_name);
        localStorage.setItem("last_name", user?.last_name);
        localStorage.setItem("is_completed", user?.is_completed);
        localStorage.setItem("user_profile", user?.profileImage);
        localStorage.setItem(
          "user_name",
          `${user?.first_name} ${user?.last_name}`
        );

        // 4️⃣ Fetch Profile Data
        try {
          const profileRes = await axios.get(
            `${API_BASE_URL}candidate/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const profileData = profileRes.data?.profile;
          const profileImg = profileData?.profileImage;

          if (profileImg && profileImg.trim() !== "") {
            const fullUrl = `${API_IMAGE_URL}${profileImg}`;
            localStorage.setItem("profileImage", fullUrl);
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

        authLogin();
        toast.success("Login successful!");
        console.log(user?.is_completed);

        // 7️⃣ Navigation
        if (user?.is_completed) {
          if (user.role === "Recruiter" || user.role === "Company") {
            navigate("/employer-dashboard");
          } else {
            navigate("/candidate-profile");
          }
        } else {
          if (user.role === "Recruiter" || user.role === "Company") {
            navigate("/employer-basic-info");
          } else {
            navigate("/profile-basic-info");
          }
        }

        // 8️⃣ Close Login Modal
        const loginModal = document.getElementById("exampleModalLogin");
        const registerModal = document.getElementById("exampleModalRegister");

        if (loginModal?.classList.contains("show")) {
          const modalInstance = window.bootstrap.Modal.getInstance(loginModal);
          modalInstance?.hide();
        }

        if (registerModal?.classList.contains("show")) {
          const modalInstance =
            window.bootstrap.Modal.getInstance(registerModal);
          modalInstance?.hide();
        }
      } catch (error) {
        console.error("Google Login Error:", error.response?.data || error);

        // 🔥 Correct backend error message handling
        const errMsg =
          error.response?.data?.message || "Google login failed! Try again.";

        toast.error(errMsg);
      }
    },

    onError: () => {
      console.log("Google Login Failed");
      toast.error("Google login failed. Try again.");
    },

    flow: "implicit",
  });
  const cleanImageUrl = (url) => {
    if (!url) return "";

    // If URL wrongly contains "/uploads/https"
    if (url.includes("uploads/https")) {
      // Extract only the "https://..." part
      const httpsPart = url.substring(url.indexOf("https"));
      return httpsPart;
    }

    // External URL (starts with http)
    if (url.startsWith("http")) return url;

    // Local upload → prepend API base URL
    return `${API_IMAGE_URL}${url}`;
  };

  return (
    <>
      <ToastContainer />
      <div className="navbar-area" style={{ backgroundColor: bgColor }}>
        <div className="mobile-responsive-nav">
          <div className="container">
            <div className="mobile-responsive-menu">
              <div className="logo">
                <img
                  src="/jobPortal/assets/images/logo.png"
                  className="main-logo"
                  alt="logo"
                />
                <img
                  src="/jobPortal/assets/images/white-logo.png"
                  className="white-logo"
                  alt="logo"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="desktop-nav">
          <div className="container-fluid">
            <nav className="navbar navbar-expand-md navbar-light">
              <Link className="navbar-brand" to="/">
                <img
                  src="/jobPortal/assets/images/logo.png"
                  className="main-logo"
                  alt="logo"
                />
                <img
                  src="/jobPortal/assets/images/white-logo.png"
                  className="white-logo"
                  alt="logo"
                />
              </Link>
              <div
                className="collapse navbar-collapse mean-menu"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      {t("header.home")}
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/about-us"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      {t("header.aboutUs")}
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/jobs"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      {t("header.jobs")}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/employers"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      {t("header.employers")}
                    </NavLink>
                  </li>
                  {userRole === "Recruiter" && (
                    <li className="nav-item">
                      <NavLink
                        to="/employer-candidates-list"
                        className={({ isActive }) =>
                          "nav-link" + (isActive ? " active" : "")
                        }
                      >
                        {t("header.candidates")}
                      </NavLink>
                    </li>
                  )}
                  <li className="nav-item">
                    <NavLink
                      to="/contact-us"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      {t("header.contactUs")}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/blog"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      {t("header.blog")}
                    </NavLink>
                  </li>
                </ul>

                <div className="others-options">
                  {emailName ? (
                    <div className="option-item">
                      <div className="dropdown profile-nav-item">
                        <a
                          href="#"
                          className="dropdown-bs-toggle"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <div className="menu-profile">
                            <img
                              crossorigin="anonymous"
                              src={cleanImageUrl(profileImage)}
                              className="rounded-circle"
                              alt="Profile"
                            />
                            <span className="name">
                              {t("header.myAccount")}
                              <i className="fa-solid fa-angle-down" />
                            </span>
                          </div>
                        </a>
                        <div className="dropdown-menu">
                          <div className="dropdown-header d-flex flex-column align-items-center">
                            <div className="figure mb-3">
                              <img
                                crossorigin="anonymous"
                                src={cleanImageUrl(profileImage)}
                                className="rounded-circle"
                                alt="Profile"
                              />
                            </div>
                            <div className="info text-center">
                              {(() => {
                                const hasValidName =
                                  (firstName &&
                                    firstName !== "null" &&
                                    firstName !== "undefined") ||
                                  (lastName &&
                                    lastName !== "null" &&
                                    lastName !== "undefined");

                                return (
                                  hasValidName && (
                                    <span className="name">
                                      {firstName &&
                                      firstName !== "null" &&
                                      firstName !== "undefined"
                                        ? firstName
                                        : ""}{" "}
                                      {lastName &&
                                      lastName !== "null" &&
                                      lastName !== "undefined"
                                        ? lastName
                                        : ""}
                                    </span>
                                  )
                                );
                              })()}

                              {localStorage.getItem("user_email") && (
                                <p className="mb-3 email">
                                  <a
                                    href={`mailto:${localStorage.getItem(
                                      "user_email"
                                    )}`}
                                    className="__cf_email__"
                                  >
                                    {localStorage.getItem("user_email")}
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>

                          {localStorage.getItem("is_completed") === "true" && (
                            <div className="dropdown-body">
                              <ul className="profile-nav p-0 pt-3">
                                <li className="nav-item active">
                                  <Link
                                    to={
                                      userRole === "JobSeeker"
                                        ? "/candidate-dashboard"
                                        : "/employer-dashboard"
                                    }
                                    className="nav-link"
                                  >
                                    <span className="icon">
                                      <img
                                        src="/jobPortal/assets/images/svg-icon/icon-1.svg"
                                        alt="Dashboard"
                                      />
                                    </span>
                                    <span className="menu-title">
                                      {t("header.dashboard")}
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          )}
                          {/* {userRole !== "JobSeeker" && (
                            <div className="dropdown-body">
                              <ul className="profile-nav p-0 pt-3">
                                <li className="nav-item active">
                                  <Link to="/setting" className="nav-link">
                                    <span className="icon">
                                      <img
                                        src="/jobPortal/assets/images/svg-icon/icon-9.svg"
                                        alt="Dashboard"
                                      />
                                    </span>
                                    <span className="menu-title">Setting</span>
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          )} */}
                          <div className="dropdown-footer">
                            <ul className="profile-nav">
                              <li className="nav-item">
                                <button
                                  onClick={handleLogout}
                                  className="nav-link"
                                  style={{
                                    background: "none",
                                    border: "none",
                                  }}
                                >
                                  <img
                                    src="/jobPortal/assets/images/svg-icon/icon-11.svg"
                                    alt="Image"
                                  />
                                  <span>{t("header.logout")}</span>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : isEmployerPage ? (
                    <>
                      <div className="option-item">
                        <div className="default-btn btn style-2  employer-login-register-button">
                          <Link to="/employer-login">
                            <span>
                              <i className="fa-regular fa-user" /> Login /
                            </span>
                          </Link>
                          <Link to="/employer-register">
                            <span> Register </span>
                          </Link>
                        </div>
                      </div>
                      <div className="option-item post-job-employers-btn">
                        <Link to="/" className="default-btn btn">
                          Post New Job
                        </Link>
                        <Link to="/" className="default-btn btn">
                          For Jobseeker
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <>
                        <div className="option-item">
                          <div className="default-btn btn style-2">
                            <span
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModalLogin"
                            >
                              <i className="fa-regular fa-user" /> Login /
                            </span>
                            <span
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModalRegister"
                            >
                              {" "}
                              Register{" "}
                            </span>
                          </div>
                        </div>

                        <div className="option-item post-job-employers-btn">
                          <Link to="/" className="default-btn btn">
                            Post New Job
                          </Link>
                          <Link to="/employer-home" className="default-btn btn">
                            For Employers
                          </Link>
                        </div>
                      </>
                    </>
                  )}
                </div>
                <div className="header-language-toggle">
                  <select
                    className="form-select"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                  >
                    <option value="en">Eng</option>
                    <option value="fr">Fr</option>
                  </select>
                </div>
              </div>
            </nav>
          </div>
        </div>
        <div className="others-option-for-responsive">
          <div className="container">
            <div className="dot-menu">
              <div className="inner">
                <div className="circle circle-one" />
                <div className="circle circle-two" />
                <div className="circle circle-three" />
              </div>
            </div>
            <div className="container">
              <div className="option-inner">
                <div className="others-options justify-content-center d-flex align-items-center">
                  <div className="others-options">
                    <div className="option-item">
                      <a href="login.html" className="default-btn btn style-2">
                        <i className="fa-regular fa-user" /> Login / Register
                      </a>
                    </div>
                    <div className="option-item">
                      <a href="/" className="default-btn btn">
                        Post New Job
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/*Login Modal */}
        <div className="register-modal-info">
          <div
            className="modal fade"
            id="exampleModalLogin"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            style={{ display: "none" }}
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Sign in as jobseeker
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div className="sign-with-email-info">
                    <button
                      onClick={handleLogin}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      className="default-btn btn"
                    >
                      Sign in with email
                    </button>
                  </div>
                  <div className="option-or-content">
                    <p>or</p>
                  </div>
                  <div className="register-option-info-are">
                    <button
                      className="default-btn btn"
                      onClick={handleLinkedinLogin}
                    >
                      <div className="social-icon">
                        <img
                          src="/jobPortal/assets/images/icon/linkedin-icon.png"
                          alt="LinkedIn"
                        />
                      </div>
                    </button>

                    <button className="default-btn btn" onClick={() => login()}>
                      <div className="social-icon">
                        <img
                          src="/jobPortal/assets/images/icon/Google-icon.png"
                          alt="Google"
                        />
                      </div>
                    </button>

                    <button
                      className="default-btn btn"
                      onClick={handleGithubLogin}
                    >
                      <div className="social-icon">
                        <img
                          src="/jobPortal/assets/images/icon/github-icon.png"
                          alt="GitHub"
                        />
                      </div>
                    </button>
                  </div>

                  <div className="already-have-account-content">
                    <p>Don't have an account yet?</p>
                    <span
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalRegister"
                      style={{ cursor: "pointer", color: "#007bff" }}
                    >
                      {" "}
                      Register{" "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="register-modal-info">
          <div
            className="modal fade"
            id="exampleModalRegister"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            style={{ display: "none" }}
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Create Your Account
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div className="sign-with-email-info">
                    <button
                      type="button"
                      onClick={handleRegister}
                      class="default-btn btn"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Sign up with email
                    </button>
                  </div>
                  <div className="option-or-content">
                    <p>or</p>
                  </div>
                  <div className="register-option-info-are">
                    <button
                      className="default-btn btn"
                      onClick={handleLinkedinLogin}
                    >
                      <div className="social-icon">
                        <img src="/jobPortal/assets/images/icon/linkedin-icon.png" />
                      </div>
                    </button>
                    <button className="default-btn btn" onClick={() => login()}>
                      <div className="social-icon">
                        <img src="/jobPortal/assets/images/icon/Google-icon.png" />
                      </div>
                    </button>
                    <button
                      className="default-btn btn"
                      onClick={handleGithubLogin}
                    >
                      <div className="social-icon">
                        <img src="/jobPortal/assets/images/icon/github-icon.png" />
                      </div>
                    </button>
                  </div>
                  <div className="already-have-account-content">
                    <p>Already have an account?</p>

                    <span
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalLogin"
                      style={{ cursor: "pointer", color: "#007bff" }}
                    >
                      <i className="fa-regular fa-user" /> Sign in
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
