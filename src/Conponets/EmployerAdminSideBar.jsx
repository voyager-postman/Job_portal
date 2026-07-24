import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function EmployerAdminSideBar() {
  const { t } = useTranslation("global");
  return (
    <div className="sidemenu-area">
      <div className="sidemenu-header">
        <div className="responsive-burger-menu d-block">
          <i className="fa-solid fa-xmark" />
        </div>
      </div>
      <div className="sidemenu-body">
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
                <img src="assets/images/svg-icon/icon-1.svg" alt={t("sidebar.dashboard")} />
              </span>
              <span className="menu-title">{t("sidebar.dashboard")}</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/YourJobPosts"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              <span className="icon">
                <img src="assets/images/svg-icon/icon-2.svg" alt={t("sidebar.job_search")} />
              </span>
              <span className="menu-title">{t("sidebar.job_search")}</span>
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
                <img src="assets/images/svg-icon/icon-8.svg" alt={t("sidebar.my_profile")} />
              </span>
              <span className="menu-title">{t("sidebar.my_profile")}</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default EmployerAdminSideBar;
