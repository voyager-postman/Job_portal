import { NavLink, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import {
  FaToolbox,
  FaClipboardList,
  FaListCheck,
  FaUsersGear,
  FaUsers,
  FaGoogleWallet,
  FaClipboardCheck,
} from "react-icons/fa6";
import { IoBookmark, IoSearchSharp, IoWalletSharp } from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { SiReaddotcv } from "react-icons/si";
import { TbMessages } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

function Sidebar() {
  const { t } = useTranslation("global");
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = localStorage.getItem("user_role");

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("dashboard-sidebar-open", sidebarOpen);
    return () => {
      document.body.classList.remove("dashboard-sidebar-open");
    };
  }, [sidebarOpen]);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {!sidebarOpen && (
        <button
          type="button"
          className="dashboard-mobile-menu-btn"
          aria-label={t("common.menu")}
          onClick={() => setSidebarOpen(true)}
        >
          <i className="fa-solid fa-bars" />
        </button>
      )}

      {sidebarOpen && (
        <button
          type="button"
          className="dashboard-sidebar-overlay"
          aria-label={t("common.close")}
          onClick={closeSidebar}
        />
      )}

    <div className="sidemenu-area">
      <div className="sidemenu-header">
        <div
          className="responsive-burger-menu d-block"
          role="button"
          tabIndex={0}
          aria-label={t("common.close")}
          onClick={closeSidebar}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") closeSidebar();
          }}
        >
          <i className="fa-solid fa-xmark" />
        </div>
      </div>
      <div className="sidemenu-body">
        {userRole === "JobSeeker" && (
          <ul
            className="sidemenu-nav metisMenu h-100"
            id="sidemenu-nav"
            data-simplebar
          >
            <li className="nav-item">
              <NavLink
                to="/candidate-dashboard"
                end
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <MdDashboard />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.dashboard")}</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/job-search"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <IoSearchSharp />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.job_search")}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manage-job-application"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <FaClipboardList  />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.application_tracking")}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/chat-messaging-system"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <AiFillMessage />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.messages")}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/candidate-profile"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <FaUserTie />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.my_profile")}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/resume-builder"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <SiReaddotcv />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.resume_builder")}</span>
              </NavLink>
            </li>
          </ul>
        )}
        {(userRole === "Recruiter" || userRole === "Company") && (
          <ul
            className="sidemenu-nav metisMenu h-100"
            id="sidemenu-nav"
            data-simplebar
          >
            <li className="nav-item">
              <NavLink
                to="/employer-dashboard"
                end
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <MdDashboard />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.dashboard")}</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/your-job-posts"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <FaToolbox />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.job_posts")}</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/employer-wallet"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <IoWalletSharp />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.wallet")}</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/applied-jobs-list"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <FaListCheck />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.application_management")}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/all-applicants-list"
                state={{ showAllJobs: true }}
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <FaUsers />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.applicant_management")}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/bookmark-candidate"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <IoBookmark />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.bookmark_candidates")}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/candidates-search"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <IoSearchSharp />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.candidate_search")}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/company-profile"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <FaUserTie />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.profile")}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manage-assessment"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <FaClipboardCheck />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.manage_assessments")}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/messaging-system"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <AiFillMessage />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.massages")}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/manage-recruiter"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <FaUsersGear />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.manage_recruiters")}</span>
              </NavLink>
            </li>

            {/* <li className="nav-item">
              <NavLink
                to="/messaging-system"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <AiFillMessage />
                  </i>
                </span>
                <span className="menu-title">{t("sidebar.messages")}</span>
              </NavLink>
            </li> */}
            {/* Repeat for other links as needed */}
          </ul>
        )}
      </div>
    </div>
    </>
  );
}

export default Sidebar;
