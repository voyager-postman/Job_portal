import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import {
  FaToolbox,
  FaListCheck,
  FaUsersGear,
  FaGoogleWallet,
} from "react-icons/fa6";
import { IoBookmark, IoSearchSharp, IoWalletSharp } from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { SiReaddotcv } from "react-icons/si";

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
                to="/skill-assessments-tests"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <i>
                    <FaToolbox />
                  </i>
                </span>
                <span className="menu-title">Skill Assessments & Tests</span>
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
                  {/* <i className="fa-solid fa-chart-line" /> */}
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
                  {/* <i className="fa-solid fa-briefcase" /> */}
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
                  {/* <i className="fa-solid fa-briefcase" /> */}
                  <i>
                    <IoWalletSharp />
                  </i>
                </span>
                <span className="menu-title">Employer Wallet</span>
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
                  {/* <i className="fa-solid fa-briefcase" /> */}
                  <i>
                    <FaListCheck />
                  </i>
                </span>
                <span className="menu-title">Application Management</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/shortlist-candidates"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  {/* <i className="fa-solid fa-bookmark" /> */}
                  <i>
                    <IoBookmark />
                  </i>
                </span>
                <span className="menu-title">Bookmark Resumes</span>
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
                  {/* <i className="fa-solid fa-magnifying-glass" /> */}
                  <i>
                    <IoSearchSharp />
                  </i>
                </span>
                <span className="menu-title">Candidate Search</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/employer-profile"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  {/* <i className="fa-solid fa-user-tie" /> */}
                  <i>
                    <FaUserTie />
                  </i>
                </span>
                <span className="menu-title">Employer Profile</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/recruiters-list"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  {/* <i className="fa-solid fa-users-gear" /> */}
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
