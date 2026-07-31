import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { SITE } from "../utils/seo";
import axios from "axios";
import Swal from "sweetalert2";
import { hasAuthSession, isAuthReady, getRequestConfig, persistAuthToken } from "../utils/apiHeaders";
import {
  isVerifiedByAdmin,
  readVerifiedByAdminFromStorage,
  resolveEmployerCompanyId,
  toVerifiedByAdminStorage,
} from "../utils/employerVerification";
import "./AuthModal.css";
import {
  formatNotificationTime,
  getNotificationMeta,
  getNotificationRoute,
} from "../utils/notifications";

function Header({ bgColor }) {
  const { t, i18n } = useTranslation("global");
  const currentLanguage = i18n.language?.split("-")[0] || "en";

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("i18nextLng", nextLanguage);
    document.documentElement.lang = nextLanguage;
  };
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isJobSeeker = userRole === "JobSeeker";
  const isEmployer = userRole === "Recruiter" || userRole === "Company";
  const isGuest = !userRole;
  // localStorage.setItem("verifiedByAdmin", "true");

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const closeMobileNav = () => setMobileNavOpen(false);

  useEffect(() => {
    const adminVerified = localStorage.getItem("adminVerified");
    if (adminVerified === "true") {
      localStorage.setItem("verifiedByAdmin", "true");
    }
  }, []);

  const fetchCompanyProfile = async () => {
    const role = localStorage.getItem("user_role");
    if (role !== "Company" && role !== "Recruiter") {
      return null;
    }

    try {
      const companyId = resolveEmployerCompanyId();

      if (!isAuthReady() || !companyId) {
        return null;
      }

      const response = await axios.get(
        `${API_BASE_URL}GetCompanyDetails/${companyId}`,
        getRequestConfig(),
      );

      const company = response.data?.company;
      if (!company) {
        return null;
      }

      localStorage.setItem(
        "verifiedByAdmin",
        toVerifiedByAdminStorage(company.verifiedByAdmin),
      );

      if (!localStorage.getItem("companyId") && company._id) {
        localStorage.setItem("companyId", company._id);
      }

      return company;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    if (isEmployer && resolveEmployerCompanyId()) {
      fetchCompanyProfile();
    }
  }, []);

  // Fetch notifications from API (logged-in users only)
  const fetchNotifications = async () => {
    if (!isAuthReady()) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}get/notifications`,
        {},
        getRequestConfig(),
      );

      if (response.data && response.data.notifications) {
        const list = response.data.notifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setNotifications(list);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };
  const markNotificationRead = async (notificationId) => {
    try {
      // POST /markRead/:id (verifyToken)
      await axios.post(
        `${API_BASE_URL}markRead/${notificationId}`,
        {},
        getRequestConfig(),
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const handleNotificationClick = async (note) => {
    if (!note?.isRead && note?._id) {
      await markNotificationRead(note._id);
    }

    navigate(
      getNotificationRoute(note, localStorage.getItem("user_role")),
    );
  };
  const markAllRead = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}markAllRead`,
        {},
        getRequestConfig(),
      );

      // Instantly update UI
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      // Fetch updated notifications list from backend
      fetchNotifications();
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  // Fetch notifications only when user is logged in
  useEffect(() => {
    if (isLoggedIn && hasAuthSession()) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const isEmployerPage =
    location.pathname === "/employer-home" ||
    location.pathname === "/employer-login" ||
    location.pathname === "/employer-register";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleLogin = () => {
    // do login logic...
    navigate("/login"); // redirect to dashboard
  };

  const handleRegister = () => {
    // do login logic...
    navigate("/register"); // redirect to dashboard
  };

  const handlePostJob = () => {
    navigate("/job-details-form");
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE_URL}auth/github`;
  };

  const handleLinkedinLogin = () => {
    const role = "JobSeeker";
    window.location.href = `${API_BASE_URL}auth/linkedin?role=${role}`;
  };

  const cleanImageUrl1 = (url) => {
    if (!url) return "";

    // Case 1: URL mistakenly contains "/uploads/https..."
    if (url.includes("uploads/https")) {
      const httpsPart = url.substring(url.indexOf("https"));
      return httpsPart;
    }

    // Case 2: External URL — starts with http or https
    if (url.startsWith("http")) return url;

    // Case 3: Local server file — prepend base URL
    return `${API_IMAGE_URL}${url}`;
  };

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
          },
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
        const apiRes = await axios.post(`${API_BASE_URL}google/login`, payload, {
          withCredentials: true,
        });
        console.log("Backend Response:", apiRes.data);

        // ⚠️ Handle backend error (Google or LinkedIn restriction)
        if (!apiRes.data?.success) {
          toast.error(apiRes.data.message || "Login failed");
          return; // STOP EXECUTION HERE
        }

        const { token, user } = apiRes.data;

        // 3️⃣ Save Data
        persistAuthToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user_id", user?._id);
        localStorage.setItem("user_email", user?.email);
        localStorage.setItem("user_role", user?.role);
        localStorage.setItem("first_name", user?.first_name);
        localStorage.setItem("last_name", user?.last_name);
        localStorage.setItem("department", user?.department || "");
        localStorage.setItem("is_completed", user?.is_completed);
        localStorage.setItem("user_profile", user?.profileImage);
        localStorage.setItem(
          "user_name",
          `${user?.first_name} ${user?.last_name}`,
        );

        // 4️⃣ Fetch profile data only for the matching role
        try {
          if (user.role === "JobSeeker") {
            const profileRes = await axios.get(
              `${API_BASE_URL}candidate/profile`,
              getRequestConfig(),
            );

            const profileData = profileRes.data?.profile;
            const profileImg = profileData?.profileImage;

            if (profileImg && profileImg.trim() !== "") {
              const finalImage = profileImg.startsWith("http")
                ? profileImg
                : `${API_IMAGE_URL}${profileImg}`;

              localStorage.setItem("profileImage", finalImage);

              if (typeof updateProfileImage === "function") {
                updateProfileImage(finalImage);
              }
            } else {
              localStorage.setItem("profileImage", DEFAULT_JOBSEEKER_IMG);
              updateProfileImage(DEFAULT_JOBSEEKER_IMG);
            }

            if (profileData) {
              updateName(profileData.first_name, profileData.last_name);
            }
          } else if (user.role === "Company" || user.role === "Recruiter") {
            if (user?.companyId) {
              localStorage.setItem("companyId", user.companyId);
            }

            if (resolveEmployerCompanyId()) {
              await fetchCompanyProfile();
            } else {
              localStorage.setItem("profileImage", DEFAULT_COMPANY_IMG);
              updateProfileImage(DEFAULT_COMPANY_IMG);
            }
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
          error.response?.data?.message || t("header.Google_login_failed");

        toast.error(errMsg);
      }
    },

    onError: () => {
      console.log("Google Login Failed");
      toast.error(t("header.Google_login_failed"));
    },

    flow: "implicit",
  });
  const DEFAULT_JOBSEEKER_IMG = "/jobPortal/assets/images/dashboard/images.png";

  const DEFAULT_COMPANY_IMG = "/jobPortal/assets/images/dashboard/images1.png";

  const user_role = localStorage.getItem("user_role");
  // "JobSeeker" | "Company"

  const cleanImageUrl = (url) => {
    // ✅ If empty, return role-based default
    if (!url || url === "null" || url === "undefined") {
      return user_role === "Company"
        ? DEFAULT_COMPANY_IMG
        : DEFAULT_JOBSEEKER_IMG;
    }

    // ✅ If already a default dashboard image → return as-is
    if (url === DEFAULT_JOBSEEKER_IMG || url === DEFAULT_COMPANY_IMG) {
      return url;
    }

    // ✅ Fix wrongly stored upload URLs
    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    // ✅ External image
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // ✅ Backend uploaded image
    return `${API_IMAGE_URL}${url}`;
  };

  return (
    <>
      <a href="#main-content" className="skip-to-main">
        {t("common.skip_to_content", { defaultValue: "Skip to main content" })}
      </a>
      <header className="navbar-area" style={{ backgroundColor: bgColor }}>
        <div className="mobile-responsive-nav">
          <div className="container">
            <div className="mobile-responsive-menu">
              <Link to="/" className="logo" onClick={closeMobileNav}>
                <img
                  src="/jobPortal/assets/images/logo.png"
                  className="main-logo"
                  alt={`${SITE.name} logo`}
                />
                <img
                  src="/jobPortal/assets/images/white-logo.png"
                  className="white-logo"
                  alt={`${SITE.name} logo`}
                />
              </Link>
              <button
                type="button"
                className="mobile-nav-toggle-btn"
                aria-label={t("common.menu")}
                aria-expanded={mobileNavOpen}
                onClick={() => setMobileNavOpen(true)}
              >
                <i className="fa-solid fa-bars" />
              </button>
            </div>
          </div>
        </div>
        <div className="desktop-nav">
          <div className="container-fluid">
            <nav className="navbar navbar-expand-md navbar-light" aria-label="Main navigation">
              <Link className="navbar-brand" to="/">
                <img
                  src="/jobPortal/assets/images/logo.png"
                  className="main-logo"
                  alt={`${SITE.name} logo`}
                />
                <img
                  src="/jobPortal/assets/images/white-logo.png"
                  className="white-logo"
                  alt={`${SITE.name} logo`}
                />
              </Link>
              <div
                className="collapse navbar-collapse"
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
                  {(isJobSeeker || isGuest) && (
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
                  )}
                  {(isJobSeeker || isGuest) && (
                    <li className="nav-item">
                      <NavLink
                        to="/companies"
                        className={({ isActive }) =>
                          "nav-link" + (isActive ? " active" : "")
                        }
                      >
                        {t("header.employers")}
                      </NavLink>
                    </li>
                  )}

                  {/* {(userRole === "Recruiter" || userRole === "Company") && (
                    <li className="nav-item">
                      <NavLink
                        to="/applied-candidate-list"
                        className={({ isActive }) =>
                          "nav-link" + (isActive ? " active" : "")
                        }
                      >
                        {t("header.candidates")}
                      </NavLink>
                    </li>
                  )} */}
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
                    <>
                      <div className="option-item notification-item">
                        <div className="dropdown notification-dropdown">
                          <button
                            className="btn notification-btn"
                            type="button"
                            id="notificationDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fa-regular fa-bell" />
                            {unreadCount > 0 && (
                              <span className="notification-count-badge">
                                {unreadCount > 99 ? "99+" : unreadCount}
                              </span>
                            )}
                          </button>
                          <ul
                            className="dropdown-menu dropdown-menu-end notification-panel"
                            aria-labelledby="notificationDropdown"
                          >
                            <li className="notification-panel-header">
                              <div className="notification-panel-title-wrap">
                                <p className="notification-panel-title">
                                  {t("header.Notifications")}
                                </p>
                                {unreadCount > 0 && (
                                  <button
                                    type="button"
                                    className="notification-mark-all-btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      markAllRead();
                                    }}
                                  >
                                    {t("header.Mark_all_as_read")}
                                  </button>
                                )}
                              </div>
                            </li>

                            {notifications.length > 0 ? (
                              notifications.map((note) => {
                                const meta = getNotificationMeta(note);
                                const isUnread = !note.isRead;
                                return (
                                  <li
                                    key={note._id}
                                    className={
                                      isUnread
                                        ? "notification-list-item is-unread"
                                        : "notification-list-item"
                                    }
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleNotificationClick(note)
                                      }
                                      className={`notification-card ${
                                        isUnread ? "is-unread" : ""
                                      }`}
                                    >
                                      <div
                                        className="notification-icon-wrap"
                                        style={{ background: meta.bg }}
                                      >
                                        <i
                                          className={meta.icon}
                                          style={{ color: meta.color }}
                                        />
                                      </div>
                                      <div className="notification-content">
                                        <div className="notification-title-row">
                                          <span className="notification-card-title">
                                            {note.title}
                                          </span>
                                        </div>
                                        <p className="notification-message">
                                          {note.message}
                                          {note.createdAt && (
                                            <span className="notification-time">
                                              {" "}
                                              {formatNotificationTime(
                                                note.createdAt,
                                                currentLanguage,
                                              )}
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                    </button>
                                  </li>
                                );
                              })
                            ) : (
                              <li className="notification-empty-state">
                                <div className="notification-empty-icon">
                                  <i className="fa-regular fa-bell-slash" />
                                </div>
                                <p>{t("header.No_notifications")}</p>
                              </li>
                            )}

                            {notifications.length > 0 && (
                              <>
                                <li>
                                  <hr className="dropdown-divider notification-panel-divider" />
                                </li>
                                <li className="notification-panel-actions">
                                  <Link
                                    to="/notifications"
                                    className="notification-panel-link"
                                  >
                                    {t("header.View_All_Notifications")}
                                  </Link>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>

                      {localStorage.getItem("is_completed") === "true" &&
                        localStorage.getItem("isLoggedIn") === "true" &&
                        (localStorage.getItem("user_role") === "Recruiter" ||
                          (localStorage.getItem("user_role") === "Company" &&
                            localStorage.getItem("verifiedByAdmin") ===
                            "true")) && (
                          <div className="option-item post-job-employers-btn">
                            <button
                              onClick={handlePostJob}
                              className="default-btn btn"
                              type="button"
                            >
                              {t("header.Post_New_Job")}
                            </button>
                          </div>
                        )}

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
                                        "user_email",
                                      )}`}
                                      className="__cf_email__"
                                    >
                                      {localStorage.getItem("user_email")}
                                    </a>
                                  </p>
                                )}
                              </div>
                            </div>

                            {localStorage.getItem("is_completed") ===
                              "true" && (
                                <div className="dropdown-body">
                                  <ul className="profile-nav p-0 pt-3">
                                    <li className="nav-item active">
                                      <button
                                        className="nav-link"
                                        onClick={async () => {
                                          const role =
                                            localStorage.getItem("user_role");
                                          const updatedUser =
                                            await fetchCompanyProfile();
                                          const verified = updatedUser
                                            ? isVerifiedByAdmin(
                                              updatedUser.verifiedByAdmin,
                                            )
                                            : readVerifiedByAdminFromStorage();
                                          // If employer is not verified → show popup & block access
                                          if (
                                            (role === "Recruiter" ||
                                              role === "Company") &&
                                            !verified
                                          ) {
                                            await Swal.fire({
                                              title: t(
                                                "header.Account_Not_Verified",
                                              ),
                                              text: t(
                                                "header.Your_account_is_not_verified_by_the_admin",
                                              ),
                                              icon: "error",
                                              confirmButtonText: t("header.ok"),
                                            });
                                            return;
                                          }

                                          if (role === "JobSeeker") {
                                            navigate("/candidate-dashboard");
                                          } else {
                                            navigate("/employer-dashboard");
                                          }
                                        }}
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
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              )}

                            {localStorage.getItem("is_completed") === "true" &&
                              localStorage.getItem("isLoggedIn") === "true" &&
                              (localStorage.getItem("user_role") ===
                                "JobSeeker" ||
                                (localStorage.getItem("user_role") ===
                                  "Company" &&
                                  localStorage.getItem("verifiedByAdmin") ===
                                  "true")) && (
                                <div className="dropdown-body">
                                  <ul className="profile-nav p-0 pt-3">
                                    <li className="nav-item">
                                      <Link
                                        to="/change-password"
                                        className="nav-link"
                                      >
                                        <span className="icon">
                                          <img
                                            src="/jobPortal/assets/images/svg-icon/icon-9.svg"
                                            alt=""
                                            aria-hidden="true"
                                          />
                                        </span>
                                        <span>
                                          {t("header.Change_Password")}
                                        </span>
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              )}

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
                                      alt=""
                                      aria-hidden="true"
                                    />
                                    <span>{t("header.logout")}</span>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : isEmployerPage ? (
                    <>
                      <div className="option-item">
                        <div className="default-btn btn style-2  employer-login-register-button">
                          <Link to="/employer-login">
                            <span style={{ color: "#fff" }}>
                              <i className="fa-regular fa-user" />{" "}
                              {t("header.login")} /
                            </span>
                          </Link>
                          <Link to="/employer-register">
                            <span style={{ color: "#fff" }}> {t("header.register")} </span>
                          </Link>
                        </div>
                      </div>
                      <div className="option-item post-job-employers-btn">
                        {/* <Link to="/" className="default-btn btn">
                          Post New Job
                        </Link> */}
                        <Link to="/" className="default-btn btn">
                          {t("header.For_Jobseeker")}
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
                              <i className="fa-regular fa-user" />
                              {t("header.login")} /
                            </span>
                            <span
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModalRegister"
                            >
                              {" "}
                              {t("header.register")}{" "}
                            </span>
                          </div>
                        </div>

                        <div className="option-item post-job-employers-btn">
                          {/* <Link to="/" className="default-btn btn">
                            Post New Job
                          </Link> */}
                          <Link to="/employer-home" className="default-btn btn">
                            {t("header.For_Employers")}
                          </Link>
                        </div>
                      </>
                    </>
                  )}
                </div>
                <div className="header-language-toggle">
                  <select
                    className="form-select"
                    aria-label="Language"
                    value={currentLanguage}
                    onChange={handleLanguageChange}
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
                      <Link to="/login" className="default-btn btn style-2">
                        <i className="fa-regular fa-user" /> {t("header.login")}
                        /{t("header.register")}
                      </Link>
                    </div>
                    <div className="option-item">
                      <a href="/" className="default-btn btn">
                        {t("header.Post_New_Job")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {mobileNavOpen && (
        <button
          type="button"
          className="mobile-offcanvas-backdrop"
          aria-label={t("common.close")}
          onClick={closeMobileNav}
        />
      )}

      <div
        className={`offcanvas offcanvas-end mobile-header-offcanvas${mobileNavOpen ? " show" : ""
          }`}
        tabIndex={-1}
        aria-labelledby="mobileNavLabel"
        style={mobileNavOpen ? { visibility: "visible" } : undefined}
      >
        <div className="offcanvas-header">
          <div className="offcanvas-title" id="mobileNavLabel">
            {t("common.menu")}
          </div>
          <button
            type="button"
            className="btn-close"
            aria-label={t("common.close")}
            onClick={closeMobileNav}
          />
        </div>
        <div className="offcanvas-body">
          <ul className="mobile-header-nav">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                onClick={closeMobileNav}
              >
                {t("header.home")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about-us"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                onClick={closeMobileNav}
              >
                {t("header.aboutUs")}
              </NavLink>
            </li>
            {(isJobSeeker || isGuest) && (
              <li>
                <NavLink
                  to="/jobs"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                  onClick={closeMobileNav}
                >
                  {t("header.jobs")}
                </NavLink>
              </li>
            )}
            {(isJobSeeker || isGuest) && (
              <li>
                <NavLink
                  to="/companies"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                  onClick={closeMobileNav}
                >
                  {t("header.employers")}
                </NavLink>
              </li>
            )}
            {(userRole === "Recruiter" || userRole === "Company") && (
              <li>
                <NavLink
                  to="/applied-candidate-list"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active" : "")
                  }
                  onClick={closeMobileNav}
                >
                  {t("header.candidates")}
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/contact-us"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                onClick={closeMobileNav}
              >
                {t("header.contactUs")}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                onClick={closeMobileNav}
              >
                {t("header.blog")}
              </NavLink>
            </li>
          </ul>

          <div className="mobile-header-actions">
            {emailName ? (
              <>
                {localStorage.getItem("is_completed") === "true" && (
                  <button
                    type="button"
                    className="default-btn btn"
                    onClick={async () => {
                      closeMobileNav();
                      const role = localStorage.getItem("user_role");
                      const updatedUser = await fetchCompanyProfile();
                      const verified = updatedUser
                        ? isVerifiedByAdmin(updatedUser.verifiedByAdmin)
                        : readVerifiedByAdminFromStorage();
                      if (
                        (role === "Recruiter" || role === "Company") &&
                        !verified
                      ) {
                        await Swal.fire({
                          title: t("header.Account_Not_Verified"),
                          text: t(
                            "header.Your_account_is_not_verified_by_the_admin",
                          ),
                          icon: "error",
                          confirmButtonText: t("header.ok"),
                        });
                        return;
                      }
                      navigate(
                        role === "JobSeeker"
                          ? "/candidate-dashboard"
                          : "/employer-dashboard",
                      );
                    }}
                  >
                    {t("header.dashboard")}
                  </button>
                )}
                {localStorage.getItem("is_completed") === "true" &&
                  localStorage.getItem("isLoggedIn") === "true" &&
                  (localStorage.getItem("user_role") === "Recruiter" ||
                    (localStorage.getItem("user_role") === "Company" &&
                      localStorage.getItem("verifiedByAdmin") === "true")) && (
                    <button
                      type="button"
                      className="default-btn btn"
                      onClick={() => {
                        closeMobileNav();
                        handlePostJob();
                      }}
                    >
                      {t("header.Post_New_Job")}
                    </button>
                  )}
                <button
                  type="button"
                  className="default-btn btn style-2"
                  onClick={() => {
                    closeMobileNav();
                    handleLogout();
                  }}
                >
                  {t("header.logout")}
                </button>
              </>
            ) : isEmployerPage ? (
              <>
                <Link
                  to="/employer-login"
                  className="default-btn btn style-2"
                  onClick={closeMobileNav}
                >
                  {t("header.login")} / {t("header.register")}
                </Link>
                <Link
                  to="/"
                  className="default-btn btn"
                  onClick={closeMobileNav}
                >
                  {t("header.For_Jobseeker")}
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="default-btn btn style-2"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalLogin"
                  onClick={closeMobileNav}
                >
                  {t("header.login")} / {t("header.register")}
                </button>
                <Link
                  to="/employer-home"
                  className="default-btn btn"
                  onClick={closeMobileNav}
                >
                  {t("header.For_Employers")}
                </Link>
              </>
            )}
          </div>

          <div className="mobile-header-lang">
            <select
              className="form-select"
              aria-label="Language"
              value={currentLanguage}
              onChange={handleLanguageChange}
            >
              <option value="en">Eng</option>
              <option value="fr">Fr</option>
            </select>
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
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <span className="modal-title fs-5" id="exampleModalLabel">
                    {t("header.Sign_in_as_jobseeker")}
                  </span>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label={t("common.close")}
                  />
                </div>
                <div className="modal-body">
                  <div className="sign-with-email-info">
                    <button
                      onClick={handleLogin}
                      data-bs-dismiss="modal"
                      aria-label={t("common.close")}
                      className="default-btn btn"
                    >
                      {t("header.Sign_in_with_email")}
                    </button>
                  </div>
                  <div className="option-or-content">
                    <p>{t("header.or")}</p>
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
                    <p>{t("header.Do_not_have_an_account_yet")}</p>
                    <span
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalRegister"
                      role="button"
                      tabIndex={0}
                    >
                      {t("header.Register")}
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
            aria-labelledby="exampleModalRegisterLabel"
            style={{ display: "none" }}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <span className="modal-title fs-5" id="exampleModalRegisterLabel">
                    {t("header.Create_Your_Account")}
                  </span>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label={t("common.close")}
                  />
                </div>
                <div className="modal-body">
                  <div className="sign-with-email-info">
                    <button
                      type="button"
                      onClick={handleRegister}
                      className="default-btn btn"
                      data-bs-dismiss="modal"
                      aria-label={t("common.close")}
                    >
                      {t("header.Sign_up_with_email")}
                    </button>
                  </div>
                  <div className="option-or-content">
                    <p>{t("header.or")}</p>
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
                    <p>{t("header.already_account")}</p>
                    <span
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalLogin"
                      role="button"
                      tabIndex={0}
                    >
                      <i className="fa-regular fa-user" /> {t("header.sign_in")}
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
