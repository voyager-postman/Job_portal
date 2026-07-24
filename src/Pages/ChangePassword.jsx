import React, { useState } from "react";
import { Link } from "react-router-dom";
import { putChangePassword, isInsecureTransportError } from "../utils/authApi";
import { getInsecureTransportMessage } from "../utils/secureCredentials";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import "../Main.css";

const ChangePassword = () => {
  const { t } = useTranslation("global");
  const userRole = localStorage.getItem("user_role");
  const dashboardPath =
    userRole === "JobSeeker" ? "/candidate-dashboard" : "/employer-dashboard";

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error(t("settings.password_mismatch"));
      return;
    }

    try {
      setLoading(true);
      const response = await putChangePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      toast.success(
        response.data?.message || t("settings.password_changed_success"),
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (isInsecureTransportError(error)) {
        toast.error(getInsecureTransportMessage());
        return;
      }

      toast.error(
        error?.response?.data?.message || t("settings.something_wrong"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          <div className="breadcrumb-area">
            <h1>{t("settings.change_password_title")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")}</Link>
              </li>
              <li className="item">
                <Link to={dashboardPath}>
                  <i className="fa-solid fa-angle-right" /> {t("header.dashboard")}
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" />{" "}
                {t("settings.change_password_title")}
              </li>
            </ol>
          </div>

          <div className="my-profile-area change-password-page">
            <div className="profile-form-content change-password-card">
              <h3 className="change-password-card-title">
                {t("settings.change_password_title")}
              </h3>
              <div className="profile-form">
                <form onSubmit={changePassword}>
                  <div className="row g-4">
                    <div className="col-lg-4 col-md-12">
                      <div className="form-group">
                        <label>{t("settings.current_password")}</label>
                        <input
                          className="form-control"
                          type="password"
                          placeholder={t("settings.current_password")}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12">
                      <div className="form-group">
                        <label>{t("settings.new_password")}</label>
                        <input
                          className="form-control"
                          type="password"
                          placeholder={t("settings.new_password")}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12">
                      <div className="form-group">
                        <label>{t("settings.confirm_new_password")}</label>
                        <input
                          className="form-control"
                          type="password"
                          placeholder={t("settings.confirm_new_password")}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="change-password-form-actions">
                    <button
                      type="submit"
                      className="default-btn btn"
                      disabled={loading}
                    >
                      {loading ? t("settings.updating") : t("settings.save_changes")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
