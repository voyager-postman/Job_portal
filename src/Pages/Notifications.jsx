import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../Url/Url";
import { getAuthHeaders, isAuthReady } from "../utils/apiHeaders";
import {
  formatNotificationTime,
  getNotificationMeta,
  getNotificationRoute,
} from "../utils/notifications";
import "../Main.css";

function Notifications() {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("user_role");
  const dashboardPath =
    userRole === "JobSeeker" ? "/candidate-dashboard" : "/employer-dashboard";
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthReady()) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}get/notifications`,
        {},
        { headers: getAuthHeaders() },
      );

      const list = (response.data?.notifications || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setNotifications(list);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markNotificationRead = async (notificationId) => {
    try {
      await axios.post(
        `${API_BASE_URL}markRead/${notificationId}`,
        {},
        { headers: getAuthHeaders() },
      );
      setNotifications((prev) =>
        prev.map((note) =>
          note._id === notificationId ? { ...note, isRead: true } : note,
        ),
      );
    } catch (error) {
      console.error("Error marking notification read:", error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await axios.delete(`${API_BASE_URL}delete/AllNotifications`, {
        headers: getAuthHeaders(),
      });
      setNotifications([]);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  const handleNotificationClick = async (note) => {
    if (!note?.isRead && note?._id) {
      await markNotificationRead(note._id);
    }
    navigate(getNotificationRoute(note, userRole));
  };

  return (
    <div className="main-dashboard-content d-flex flex-column">
      <div className="responsive-content">
        <div className="breadcrumb-area">
          <h1>{t("header.Notifications")}</h1>
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
              <i className="fa-solid fa-angle-right" /> {t("header.Notifications")}
            </li>
          </ol>
        </div>

        <div className="my-profile-area notifications-page">
          <div className="profile-form-content notifications-page-card">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <p className="mb-0 text-muted">
                {notifications.length}{" "}
                {notifications.length === 1 ? "notification" : "notifications"}
              </p>
              {notifications.length > 0 && (
                <button
                  type="button"
                  className="notification-clear-btn"
                  onClick={deleteAllNotifications}
                >
                  Clear all
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="notifications-page-list">
                {notifications.map((note) => {
                  const meta = getNotificationMeta(note);
                  return (
                    <button
                      key={note._id}
                      type="button"
                      className={`notification-card notifications-page-card-item ${
                        !note.isRead ? "is-unread" : ""
                      }`}
                      onClick={() => handleNotificationClick(note)}
                    >
                      <div
                        className="notification-icon-wrap"
                        style={{ backgroundColor: meta.bg, color: meta.color }}
                      >
                        <i className={meta.icon} />
                      </div>
                      <div className="notification-content">
                        <div className="notification-title-row">
                          <span className="notification-card-title">
                            {note.title}
                          </span>
                          <span className="notification-time">
                            {formatNotificationTime(note.createdAt, i18n.language)}
                          </span>
                        </div>
                        <p className="notification-message">{note.message}</p>
                      </div>
                      {!note.isRead && (
                        <span
                          className="notification-unread-dot"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="notification-empty-state py-5">
                <div className="notification-empty-icon">
                  <i className="fa-regular fa-bell" />
                </div>
                <p>{t("header.No_notifications")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
