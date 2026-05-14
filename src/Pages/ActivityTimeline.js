import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ActivityTimelineModern.css";
import { API_BASE_URL } from "../Url/Url";
import { Link, useNavigate } from "react-router-dom";

function ActivityTimeline() {
  const navigate = useNavigate();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({
    all: 0,
    today: 0,
    last7days: 0,
    filtered: 0,
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  // ✅ CUSTOM DATE
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");

  // ================= FETCH API =================
  const fetchActivity = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const params = {
        page,
        limit,
        filter,
        search,
      };

      // ✅ SEND CUSTOM DATE
      if (filter === "custom") {
        params.startDate = customFromDate;
        params.endDate = customToDate;
      }

      const res = await axios.get(`${API_BASE_URL}jobseeker/activity`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setActivity(res?.data?.data || []);
      setCounts(
        res?.data?.counts || {
          all: 0,
          today: 0,
          last7days: 0,
          filtered: 0,
        },
      );

      setTotalPages(res?.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Activity fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= API CALL =================

  useEffect(() => {
    fetchActivity();
  }, [page, filter, search, customFromDate, customToDate]);

  // ================= ICON =================

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "login":
        return "fa-solid fa-right-to-bracket";

      case "job saved":
        return "fa-solid fa-heart";

      case "profile updated":
        return "fa-solid fa-user-pen";

      default:
        return "fa-solid fa-bell";
    }
  };

  // ================= BADGE CLASS =================

  const getBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case "login":
        return "type-login";

      case "job saved":
        return "type-job-saved";

      case "profile updated":
        return "type-profile-updated";

      default:
        return "type-job-alert";
    }
  };
  const getDaysAgo = (date) => {
    const createdDate = new Date(date);
    const now = new Date();
    const diffTime = now - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";

    return `${diffDays} days ago`;
  };
  return (
    <div className="main-dashboard-content d-flex flex-column">
      <div className="container-fluid">
        <div className="responsive-content">
          {/* ================= HEADER ================= */}

          <div className="breadcrumb-area mb-4">
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "800",
                color: "var(--text-dark)",
                marginBottom: "0.5rem",
              }}
            >
              Activity History
            </h1>

            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Welcome </Link>
              </li>

              <li className="item">
                <Link to="/candidate-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>

              <li className="item active">
                <i className="fa-solid fa-angle-right" />
                Historical
              </li>
            </ol>
          </div>

          {/* ================= SEARCH + STATS ================= */}

          <div className="activity-page-header">
            <div className="search-box-modern">
              <i className="fa-solid fa-magnifying-glass" />

              <input
                type="text"
                placeholder="Search for an activity..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div
              className="activity-stats"
              style={{
                color: "var(--text-muted)",
                fontSize: "0.95rem",
                fontWeight: "600",
              }}
            >
              <i
                className="fa-solid fa-list-check me-2"
                style={{ color: "var(--primary-orange)" }}
              />
              {counts?.filtered || 0} activities displayed
            </div>
          </div>

          {/* ================= FILTER BUTTONS ================= */}

          <div className="filter-pills-modern">
            {/* ALL */}
            <button
              className={`filter-pill ${filter === "all" ? "active" : ""}`}
              onClick={() => {
                setFilter("all");
                setPage(1);
              }}
            >
              All ({counts?.all || 0})
            </button>

            {/* TODAY */}
            <button
              className={`filter-pill ${filter === "today" ? "active" : ""}`}
              onClick={() => {
                setFilter("today");
                setPage(1);
              }}
            >
              Today ({counts?.today || 0})
            </button>

            {/* LAST 7 DAYS */}
            <button
              className={`filter-pill ${
                filter === "last7days" ? "active" : ""
              }`}
              onClick={() => {
                setFilter("last7days");
                setPage(1);
              }}
            >
              Last 7 Days ({counts?.last7days || 0})
            </button>

            {/* CUSTOM */}
            <button
              className={`filter-pill ${filter === "custom" ? "active" : ""}`}
              onClick={() => {
                setFilter("custom");
                setPage(1);
              }}
            >
              Custom
            </button>

            {/* CUSTOM DATE FILTER */}
            {filter === "custom" && (
              <div className="custom-date-filter d-flex align-items-center gap-2">
                <input
                  type="date"
                  value={customFromDate}
                  onChange={(e) => {
                    setCustomFromDate(e.target.value);
                    setPage(1);
                  }}
                />

                <span
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: "600",
                  }}
                >
                  To
                </span>

                <input
                  type="date"
                  value={customToDate}
                  onChange={(e) => {
                    setCustomToDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            )}
          </div>

          {/* ================= TIMELINE ================= */}

          <div className="timeline-container">
            {loading ? (
              <div className="text-center py-5">
                <h5>Loading...</h5>
              </div>
            ) : activity?.length > 0 ? (
              activity?.map((item, index) => (
                <div
                  className="timeline-item-modern"
                  key={item?._id || index}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* DOT */}
                  <div className="timeline-dot">
                    <i className={getIcon(item?.activityType)} />
                  </div>

                  {/* CARD */}
                  <div className="activity-card-modern">
                    {/* HEADER */}
                    <div className="activity-header-modern">
                      <span
                        className={`activity-type-badge ${getBadgeClass(
                          item?.activityType,
                        )}`}
                      >
                        {item?.activityType}
                      </span>

                      <span className="activity-time-modern">
                        <i className="fa-regular fa-clock me-1" />

                        {getDaysAgo(item?.createdAt)}
                      </span>
                    </div>

                    {/* MESSAGE */}
                    <p className="activity-message-modern">{item?.message}</p>

                    {/* DETAILS */}
                    <div className="activity-details-modern">
                      {/* DATE */}
                      <div className="detail-item">
                        <i
                          className="fa-solid fa-calendar-day mt-1"
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--primary-orange)",
                          }}
                        />

                        <span>
                          <span className="detail-label">Date:</span>{" "}
                          {new Date(item?.createdAt).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* EMAIL */}
                      {item?.details?.email && (
                        <div className="detail-item mt-1">
                          <i
                            className="fa-solid fa-envelope mt-1"
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--primary-orange)",
                            }}
                          />

                          <span>
                            <span className="detail-label">Email:</span>{" "}
                            {item?.details?.email}
                          </span>
                        </div>
                      )}

                      {/* PROVIDER */}
                      {/* {item?.details?.provider && (
                        <div className="detail-item mt-1">
                          <i
                            className="fa-solid fa-globe mt-1"
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--primary-orange)",
                            }}
                          />

                          <span>
                            <span className="detail-label">Provider:</span>{" "}
                            {item?.details?.provider}
                          </span>
                        </div>
                      )} */}

                      {/* JOB ID */}
                      {/* {item?.details?.jobId && (
                        <div className="detail-item mt-1">
                          <i
                            className="fa-solid fa-briefcase mt-1"
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--primary-orange)",
                            }}
                          />

                          <span>
                            <span className="detail-label">Job ID:</span>{" "}
                            {item?.details?.jobId}
                          </span>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    padding: "60px 20px",
                    border: "1px solid #eee",
                    maxWidth: "420px",
                    margin: "0 auto",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* ICON */}
                  <div
                    style={{
                      width: "90px",
                      height: "90px",
                      margin: "0 auto 20px",
                      borderRadius: "50%",
                      background: "rgba(249, 115, 22, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="fa-solid fa-wave-square"
                      style={{
                        fontSize: "40px",
                        color: "var(--primary-orange)",
                      }}
                    />
                  </div>

                  {/* TITLE */}
                  <h4
                    style={{
                      fontWeight: "700",
                      marginBottom: "10px",
                      color: "#0f172a",
                    }}
                  >
                    No Activity Yet
                  </h4>

                  {/* DESCRIPTION */}
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      marginBottom: "20px",
                      lineHeight: "1.6",
                    }}
                  >
                    Your recent actions and updates will appear here once you
                    start interacting with jobs, applications, or profile
                    updates.
                  </p>

                  {/* OPTIONAL BUTTON */}
                  <button
                    className="modern-apply-btn"
                    style={{
                      background: "var(--primary-orange)",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      color: "#fff",
                      fontWeight: "600",
                      display: "block",
                      margin: "0 auto",
                    }}
                    onClick={() => navigate("/job-search")}
                  >
                    Explore Jobs
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= PAGINATION ================= */}

          <div className="pagination-modern">
            {/* PREVIOUS */}
            <button
              className="btn-pagination"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              <i className="fa-solid fa-chevron-left me-2" />
              Previous
            </button>

            {/* PAGE INFO */}
            <span
              style={{
                fontWeight: "700",
                color: "var(--text-dark)",
                background: "#fff",
                padding: "0.6rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid rgb(226, 232, 240)",
              }}
            >
              Page {page} of {totalPages}
            </span>

            {/* NEXT */}
            <button
              className="btn-pagination"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
              <i className="fa-solid fa-chevron-right ms-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityTimeline;
