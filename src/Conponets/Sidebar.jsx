import { NavLink } from "react-router-dom";
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

function Sidebar() {
  const userRole = localStorage.getItem("user_role");
  return (
    <div className="sidemenu-area">
      <div className="sidemenu-header">
        <div className="responsive-burger-menu d-block">
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
                <span className="menu-title">Dashboard</span>
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
                <span className="menu-title">Job Search</span>
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
                <span className="menu-title">Application Tracking</span>
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
                <span className="menu-title">Messages</span>
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
                <span className="menu-title">My Profile</span>
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
                <span className="menu-title">Resume Builder</span>
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
                <span className="menu-title">Dashboard</span>
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
                <span className="menu-title">Job Posts</span>
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
                <span className="menu-title">Wallet</span>
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
                <span className="menu-title">Application Management</span>
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
                <span className="menu-title">Applicant Management</span>
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
                <span className="menu-title">Bookmark Candidates</span>
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
                <span className="menu-title">Candidate Search</span>
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
                <span className="menu-title">Profile</span>
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
                <span className="menu-title"> Manage Assessments</span>
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
                <span className="menu-title"> Massages</span>
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
                <span className="menu-title">Manage Recruiters</span>
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
                <span className="menu-title">Messages</span>
              </NavLink>
            </li> */}
            {/* Repeat for other links as needed */}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
