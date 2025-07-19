import { NavLink } from "react-router-dom";

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
        {userRole === "skiller_type" && (
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
                  <img
                    src="assets/images/svg-icon/icon-1.svg"
                    alt="Dashboard"
                  />
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
                  <img
                    src="assets/images/svg-icon/icon-2.svg"
                    alt="Job Search"
                  />
                </span>
                <span className="menu-title">Job Search</span>
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
                  <img
                    src="assets/images/svg-icon/icon-8.svg"
                    alt="My Profile"
                  />
                </span>
                <span className="menu-title">My Profile</span>
              </NavLink>
            </li>

            {/* Repeat for other links as needed */}
          </ul>
        )}
        {userRole === "employer_type" && (
          <ul
            className="sidemenu-nav metisMenu h-100"
            id="sidemenu-nav"
            data-simplebar
          >
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <span className="icon">
                  <img
                    src="assets/images/svg-icon/icon-1.svg"
                    alt="Dashboard"
                  />
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
                  <img
                    src="assets/images/svg-icon/icon-2.svg"
                    alt="Job Search"
                  />
                </span>
                <span className="menu-title">Job Posts</span>
              </NavLink>
            </li>

            {/* Repeat for other links as needed */}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
