import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // adjust path as needed
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
function Header() {
  const { isLoggedIn } = useAuth();
  const userRole = localStorage.getItem("user_role");

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
  // const googleLogin = useGoogleLogin({
  //   onSuccess: (tokenResponse) => {
  //     console.log(tokenResponse);
  //     const userInfo = jwtDecode(tokenResponse.credential);
  //     console.log("Google User:", userInfo);
  //     localStorage.setItem("user", JSON.stringify(userInfo));
  //   },
  //   onError: () => {
  //     console.log("Google login failed");
  //   },
  // });
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Access Token:", tokenResponse.access_token);

      // Fetch user info from Google
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      });
      const userInfo = await res.json();
      console.log("Google User:", userInfo);

      localStorage.setItem("user", JSON.stringify(userInfo));
    },
    onError: () => console.log("Login Failed"),
  });

  const handleGithubLogin = () => {
    const clientId = "Ov23liXRhmjwwotvLSVw";
    const redirectUri = "http://localhost:4000/api/auth/github/callback";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  };

  const handleLinkedinLogin = () => {
    const clientId = "86nez3pnzuzjq3";
    const redirectUri = "http://13.48.130.179:4000/api/auth/linkedin/callback";
    const state = "foobar"; // random string for security
    const scope = "r_liteprofile r_emailaddress";
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
  };
  return (
    <>
      <div className="navbar-area bg-f0f4fc">
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
                      Home
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/about-us"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      About Us
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/jobs"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      Jobs
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/employers"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      Employers
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
                        Candidates
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
                      Contact Us
                    </NavLink>
                  </li>
                </ul>

                <div className="others-options">
                  {isLoggedIn ? (
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
                              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                              className="rounded-circle"
                              alt="image"
                            />
                            <span className="name">
                              My Account{" "}
                              <i className="fa-solid fa-angle-down" />
                            </span>
                          </div>
                        </a>
                        <div className="dropdown-menu">
                          <div className="dropdown-header d-flex flex-column align-items-center">
                            <div className="figure mb-3">
                              <img
                                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                className="rounded-circle"
                                alt="image"
                              />
                            </div>
                            <div className="info text-center">
                              {(() => {
                                const firstName =
                                  localStorage.getItem("first_name");
                                const lastName =
                                  localStorage.getItem("last_name");

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
                          <div className="dropdown-body">
                            <ul className="profile-nav p-0 pt-3">
                              <li className="nav-item active">
                                <Link
                                  to={
                                    userRole === "JobSeeker"
                                      ? "/candidate-dashboard"
                                      : "/your-job-posts"
                                  }
                                  className="nav-link"
                                >
                                  <span className="icon">
                                    <img
                                      src="/jobPortal/assets/images/svg-icon/icon-1.svg"
                                      alt="Dashboard"
                                    />
                                  </span>
                                  <span className="menu-title">Dashboard</span>
                                </Link>
                              </li>
                            </ul>
                          </div>

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
                                  <span>Logout</span>
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
                <div className="header-language-toggleg">
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                  >
                    <option selected>English</option>
                    <option value={1}>French</option>
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

                    <button
                      className="default-btn btn"
                      onClick={() => googleLogin()}
                    >
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
        {/*Login Modal */}
        {/* Register Modal */}
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
                    <button className="default-btn btn">
                      <div className="social-icon">
                        <img src="/jobPortal/assets/images/icon/linkedin-icon.png" />
                      </div>
                    </button>
                    <button className="default-btn btn">
                      <div className="social-icon">
                        <img src="/jobPortal/assets/images/icon/Google-icon.png" />
                      </div>
                    </button>
                    <button className="default-btn btn">
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
