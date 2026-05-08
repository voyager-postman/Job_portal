import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination"; // MUI one
import "./ManagesJobApplicationModern.css";
function ManagesJobApplication() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedNotify, setSelectedNotify] = useState({});
  const [selected, setSelected] = useState([]);
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // 🔹 new state for filter
  const [companies, setCompanies] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const token = localStorage.getItem("token"); // 🔹 assuming JWT is stored here
  const [jobAlerts, setJobAlerts] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  // const queryParams = new URLSearchParams(location.search);
  // const defaultTab = queryParams.get("tab") || "applications";
  const statusOptions = [
    { label: "All statuses", value: "" },
    { label: "Applied", value: "Applied" },
    { label: "Reviewed", value: "Reviewed" },
    { label: "Shortlisted", value: "Shortlisted" },
    { label: "Contacted", value: "Contacted" },
    { label: "HR Interview", value: "HR Interview" },
    { label: "Technical maintenance", value: "Technical maintenance" },
    { label: "Offer sent", value: "Offer sent" },
    { label: "Recruited", value: "Recruited" },
    { label: "Rejected", value: "Rejected" },
    { label: "Application withdrawn", value: "Withdrawn" },
  ];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [consent, setConsent] = useState(false);
  const [activeTab, setActiveTab] = useState("applications");
  const handleWithdrawClick = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setReason("");
    setComments("");
    setConsent(false);
  };

  // Handle Withdraw Submit
  const handleWithdrawSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason.");
      return;
    }

    if (!consent) {
      toast.error("Please agree to the consent checkbox.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}withdrawJobApplication`,
        {
          applicationId: selectedApplicationId,
          reason,
          comments,
          consent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Close Bootstrap modal safely
      const modalEl = document.getElementById("exampleModal");
      if (modalEl) {
        const modalInstance =
          window.bootstrap.Modal.getInstance(modalEl) ||
          new window.bootstrap.Modal(modalEl);
        modalInstance.hide();
      }

      toast.success(
        res?.data?.message || "Application withdrawn successfully!",
      );

      if (activeTab === "saved-jobs") {
        fetchSavedJobs();
      } else if (activeTab === "applications") {
        fetchApplications();
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to withdraw application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // read query param ?tab=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/manage-job-application?tab=${tab}`);
  };

  useEffect(() => {
    if (activeTab === "saved-jobs") {
      fetchSavedJobs();
    } else if (activeTab === "applications") {
      fetchApplications();
    }
  }, [activeTab]);
  // 🔹 Initial fetch based on active tab
  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications(statusFilter);
    }
  }, [activeTab]);

  // 🔹 Fetch again whenever filter changes
  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications(statusFilter);
    }
  }, [statusFilter]);

  const handleSaveJob = async (jobId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}savedJob`,
        { job_id: jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("✅ API Response:", res.data);

      if (res.data.success) {
        const { message } = res.data;

        // ✅ Toggle locally without refetch
        // setJobList((prevJobs) =>
        //   prevJobs.map((job) =>
        //     job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        //   )
        // );
        fetchSavedJobs();
        if (message.toLowerCase().includes("saved")) {
          toast.success(message + " ❤️");
        } else if (message.toLowerCase().includes("unsaved")) {
          toast.info(message + " 💔");
        } else {
          toast.success(message);
        }
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("❌ Save/Unsave error:", err);
      toast.error(err.response?.data?.message || "Server error. Try again!");
    }
  };

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}savedJobList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setSavedJobs(res.data.savedJobs || []);
      } else {
        toast.error(res.data.message || "Failed to load saved jobs");
      }
    } catch (error) {
      console.error("❌ Error fetching saved jobs:", error);
      toast.error("Error fetching saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (status = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}getJobSeekerApplications`, {
        headers: { Authorization: `Bearer ${token}` },
        params: status ? { status } : {}, // ✅ pass status only if not empty
      });

      if (res.data.success) {
        setApplications(res.data.applications || []);
      } else {
        toast.error(res.data.message || "Failed to load applications");
      }
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      toast.error("Error fetching applications");
    } finally {
      setLoading(false);
    }
  };

  const getCompanyList = async (
    industryIds = [],
    page = 1,
    limit = pageSize,
  ) => {
    try {
      const params = {
        page,
        limit,
      };

      if (industryIds.length > 0) {
        params.industry = industryIds.join(",");
      }

      const res = await axios.get(`${API_BASE_URL}GetCompanyDetailsList`, {
        params,
      });

      if (res.data.success) {
        setCompanies(res.data);
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
  };

  useEffect(() => {
    const selectedIndustryIds = selected.map((i) => i._id);
    getCompanyList(selectedIndustryIds, pageNumber, pageSize);
  }, [pageNumber, pageSize, selected]);

  const handleViewCompany = (company, from) => {
    navigate(`/${company.slug}`, {
      state: { companyId: company._id, from },
    });
  };

  const totalPages = companies?.totalPages;

  useEffect(() => {
    getCompanyList();
  }, []);

  useEffect(() => {
    if (activeTab === "job-alerts") {
      fetchJobAlerts();
    }
  }, [activeTab]);

  // ✅ Fetch all saved job alerts
  const fetchJobAlerts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}getSavedJobAlert`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setJobAlerts(res.data.savedJobs || []);
      } else {
        toast.error(res.data.message || "Failed to load job alerts");
      }
    } catch (error) {
      console.error("❌ Error fetching job alerts:", error);
      toast.error("Error fetching job alerts");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle status (for switch)
  const handleToggleStatus = async (alertId, newStatus) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}updateJobAlert`,
        {
          alertId,
          status: newStatus,
          // notifyEvery: selectedNotify[alertId] || "", // keep existing if needed
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        toast.success("Alert status updated successfully!");
        // ✅ Update UI
        setJobAlerts((prev) =>
          prev.map((a) =>
            a._id === alertId ? { ...a, status: newStatus } : a,
          ),
        );
      } else {
        toast.error(res.data.message || "Failed to update alert");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating alert");
    }
  };

  const handleUpdateAlert = async (
    alertId,
    notifyEvery = null,
    status = null,
  ) => {
    try {
      const payload = { alertId };
      if (notifyEvery !== null) payload.notifyEvery = notifyEvery;
      if (status !== null) payload.status = status;

      const res = await axios.post(`${API_BASE_URL}updateJobAlert`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const modal = document.getElementById(`editAlertModal-${alertId}`);
        if (modal) {
          const bsModal = window.bootstrap.Modal.getInstance(modal);
          if (bsModal) {
            bsModal.hide();
          }
        }
        toast.success("Job alert updated successfully!");
        fetchJobAlerts();
      } else {
        toast.error(res.data.message || "Failed to update alert");
      }
    } catch (err) {
      console.error("❌ Error updating alert:", err);
      toast.error("Error updating alert");
    }
  };

  // Delete alert
  const handleDeleteAlert = async (alertId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}deleteJobAlert`,
        { alertId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        const modal = document.getElementById(`editAlertModal-${alertId}`);
        if (modal) {
          const bsModal = window.bootstrap.Modal.getInstance(modal);
          if (bsModal) {
            bsModal.hide();
          }
        }
        toast.success("Alert deleted successfully!");
        setJobAlerts((prev) => prev.filter((a) => a._id !== alertId));
      } else {
        toast.error(res.data.message || "Failed to delete alert");
      }
    } catch (err) {
      console.error("❌ Error deleting alert:", err);
      toast.error("Error deleting alert");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Manage Job Application</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/candidate-dashboard">Home </Link>
              </li>
              <li className="item">
                <Link to="/candidate-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <Link to={`/manage-job-application?tab=${activeTab}`}>
                  <i className="fa-solid fa-angle-right" />
                  Manage Job Application
                </Link>
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          <div className="modern-tabs-nav">
            <button
              className={`modern-tab-btn ${
                activeTab === "applications" ? "active" : ""
              }`}
              onClick={() => handleTabChange("applications")}
            >
              Candidatures
            </button>

            <button
              className={`modern-tab-btn ${
                activeTab === "saved-jobs" ? "active" : ""
              }`}
              onClick={() => handleTabChange("saved-jobs")}
            >
              Favoris
            </button>

            <button
              className={`modern-tab-btn ${
                activeTab === "job-alerts" ? "active" : ""
              }`}
              onClick={() => handleTabChange("job-alerts")}
            >
              Alertes
            </button>

            <button
              className={`modern-tab-btn ${
                activeTab === "companies" ? "active" : ""
              }`}
              onClick={() => handleTabChange("companies")}
            >
              Vue Profile
            </button>
          </div>
          {/* mannage Job application section start here */}

          <section className="mannage-job-application-tab-description">
            {/* Tab panes */}
            <div className="tab-content">
              {activeTab === "applications" && (
                <div className="manage-main-grid">
                  <div className="manage-content-area">
                    <div className="applications-tab-view">
                      <div className="modern-search-filter-container mb-4">
                        <div className="search-box-modern">
                          <i className="fa-solid fa-magnifying-glass search-icon" />
                          <input
                            placeholder="Search by job title or company..."
                            className="search-input-modern"
                            type="text"
                          />
                        </div>
                        <div
                          className={`filter-box-modern custom-dropdown ${dropdownOpen ? "active" : ""}`}
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                          {/* Trigger */}

                          <i className="fa-solid fa-filter filter-icon" />

                          <div className="selected-value-modern">
                            {statusOptions.find((s) => s.value === statusFilter)
                              ?.label || "All statuses"}
                          </div>

                          <i className="fa-solid fa-chevron-down arrow-icon" />

                          {/* Dropdown */}
                          {dropdownOpen && (
                            <div className="dropdown-menu-modern">
                              {statusOptions.map((item) => (
                                <div
                                  key={item.value}
                                  className={`dropdown-item-modern ${
                                    statusFilter === item.value ? "active" : ""
                                  }`}
                                  onClick={() => {
                                    setStatusFilter(item.value);
                                    setDropdownOpen(false);
                                  }}
                                >
                                  {item.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {applications.length === 0 ? (
                        <p className="text-center py-5 text-gray-500">
                          No applications found.
                        </p>
                      ) : (
                        applications.map((app) => {
                          const job = app?.jobId;
                          const company = job?.companyId;

                          return (
                            <div
                              className="modern-job-card clickable mb-4"
                              key={app._id}
                            >
                              <div className="modern-job-header">
                                <div className="modern-company-info">
                                  <div className="modern-logo-container">
                                    <img
                                      crossOrigin="anonymous"
                                      alt="logo"
                                      className="modern-company-logo"
                                      src={
                                        company?.logo
                                          ? `${API_IMAGE_URL}${company.logo}`
                                          : "assets/images/dashboard/images1.png"
                                      }
                                    />
                                  </div>
                                  <div className="modern-company-details">
                                    <h4 className="modern-company-name">
                                      {" "}
                                      Devstringx Technologies Pvt Ltd
                                    </h4>
                                    <span className="modern-post-date">
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 24 24"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path fill="none" d="M0 0h24v24H0V0z" />
                                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                      </svg>{" "}
                                      <font
                                        dir="auto"
                                        style={{ "vertical-align": "inherit" }}
                                      >
                                        <font
                                          dir="auto"
                                          style={{
                                            "vertical-align": "inherit",
                                          }}
                                        >
                                          21 minutes ago
                                        </font>
                                      </font>
                                    </span>
                                  </div>
                                </div>
                                <div className="modern-job-actions">
                                  <span className="modern-status-badge status-applied">
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      <font
                                        dir="auto"
                                        style={{ "vertical-align": "inherit" }}
                                      >
                                        Application received
                                      </font>
                                    </font>
                                  </span>
                                </div>
                              </div>
                              <div className="modern-job-body">
                                <h3 className="modern-job-title">
                                  Node js Developer
                                </h3>
                                <p className="modern-job-description">
                                  You applied for this position. View details to
                                  see full job information.
                                </p>
                              </div>
                              <div className="modern-job-meta">
                                <span className="modern-meta-tag">
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth={0}
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path fill="none" d="M0 0h24v24H0V0z" />
                                    <path d="M14 6V4h-4v2h4zM4 8v11h16V8H4zm16-2c1.11 0 2 .89 2 2v11c0 1.11-.89 2-2 2H4c-1.11 0-2-.89-2-2l.01-11c0-1.11.88-2 1.99-2h4V4c0-1.11.89-2 2-2h4c1.11 0 2 .89 2 2v2h4z" />
                                  </svg>
                                  Cyber security / IT Security
                                </span>
                                <span className="modern-meta-tag">
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth={0}
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path fill="none" d="M0 0h24v24H0V0z" />
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z" />
                                    <circle cx={12} cy={9} r="2.5" />
                                  </svg>
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      The Surgents
                                    </font>
                                  </font>
                                </span>
                                <span className="modern-meta-tag">
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth={0}
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path fill="none" d="M0 0h24v24H0V0z" />
                                    <path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z" />
                                  </svg>
                                  CDI
                                </span>
                                <span className="modern-meta-tag">
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth={0}
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path fill="none" d="M0 0h24v24H0z" />
                                    <path d="m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                                  </svg>
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      69144c786321f6c78b7e0942
                                    </font>
                                  </font>
                                </span>
                              </div>
                              <div className="modern-job-footer">
                                <div className="modern-job-info-badges">
                                  <span className="modern-info-badge">
                                    <i className="fa-solid fa-calendar-check" />
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      <font
                                        dir="auto"
                                        style={{ "vertical-align": "inherit" }}
                                      >
                                        Apply on{" "}
                                      </font>
                                    </font>
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      <font
                                        dir="auto"
                                        style={{ "vertical-align": "inherit" }}
                                      >
                                        May 8, 2026
                                      </font>
                                    </font>
                                  </span>
                                </div>
                                <div
                                  className="modern-job-footer-actions"
                                  style={{ display: "flex", gap: "12px" }}
                                >
                                  <a
                                    className="view-details-link"
                                    href="/jobPortal/job-details/69fd7d5d05687d325ec06b33"
                                    style={{
                                      "-webkit-text-decoration": "none",
                                      "text-decoration": "none",
                                      "font-weight": "700",
                                      "font-size": "14px",
                                      color: "var(--primary-color)",
                                      display: "flex",
                                      "-webkit-align-items": "center",
                                      "-webkit-box-align": "center",
                                      "-ms-flex-align": "center",
                                      "align-items": "center",
                                    }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      <font
                                        dir="auto"
                                        style={{ "vertical-align": "inherit" }}
                                      >
                                        <Link
                                          to={`/job/${job?.slug}`}
                                          state={{
                                            from: `/manage-job-application?tab=${activeTab}`,
                                            JobId: job?._id,
                                          }}
                                        >
                                          {" "}
                                          See details
                                        </Link>
                                      </font>
                                    </font>
                                  </a>
                                  <button
                                    className="modern-apply-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#withdrawModal"
                                    style={{
                                      background: "rgb(254, 242, 242)",
                                      color: "rgb(239, 68, 68)",
                                      padding: "8px 20px",
                                    }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      <font
                                        dir="auto"
                                        style={{ "vertical-align": "inherit" }}
                                      >
                                        Cancel my application
                                      </font>
                                    </font>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div className="insights-sidebar">
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Who has seen my profile?
                          </font>
                        </font>
                      </h4>
                      <div className="view-count-box">
                        <h2>124</h2>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              Views this month
                            </font>
                          </font>
                        </p>
                      </div>
                      <ul className="viewers-list">
                        <li className="viewer-item">
                          <div className="viewer-avatar">T</div>
                          <div className="viewer-info">
                            <h5>Tech Corp</h5>
                            <p>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  2h ago
                                </font>
                              </font>
                            </p>
                          </div>
                        </li>
                        <li className="viewer-item">
                          <div className="viewer-avatar">G</div>
                          <div className="viewer-info">
                            <h5>Global Solutions</h5>
                            <p>1d ago</p>
                          </div>
                        </li>
                        <li className="viewer-item">
                          <div className="viewer-avatar">I</div>
                          <div className="viewer-info">
                            <h5>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  Innovate AI
                                </font>
                              </font>
                            </h5>
                            <p>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  August 6th
                                </font>
                              </font>
                            </p>
                          </div>
                        </li>
                      </ul>
                      <button className="view-all-btn">
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            See the full report
                          </font>
                        </font>
                      </button>
                    </div>
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Force you Profile
                          </font>
                        </font>
                      </h4>
                      <div className="strength-mini-box">
                        <div className="mini-progress-bar">
                          <div
                            className="mini-progress-fill"
                            style={{ width: "70%" }}
                          />
                        </div>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              70% Completed
                            </font>
                          </font>
                        </p>
                      </div>
                      <a
                        className="view-all-btn text-center d-block text-decoration-none"
                        href="/jobPortal/candidate-profile"
                      >
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Complete my Profile
                          </font>
                        </font>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "saved-jobs" && (
                <div className="manage-main-grid">
                  <div className="manage-content-area">
                    <div className="saved-jobs-tab-view">
                      <h2>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Saved Offers
                          </font>
                        </font>
                      </h2>
                      <div className="modern-job-card mb-4">
                        <div className="modern-job-header">
                          <div className="modern-company-info">
                            <div className="modern-logo-container">
                              <img
                                crossOrigin="anonymous"
                                alt="logo"
                                className="modern-company-logo"
                                src="assets/images/dashboard/images1.png"
                              />
                            </div>
                            <div className="modern-company-details">
                              <h4 className="modern-company-name">
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    Company Name
                                  </font>
                                </font>
                              </h4>
                            </div>
                          </div>
                          <div className="modern-job-actions">
                            <button
                              className="modern-action-icon saved"
                              title="Unsave"
                            >
                              <i className="fa-solid fa-heart" />
                            </button>
                          </div>
                        </div>
                        <div className="modern-job-body">
                          <h3 className="modern-job-title">
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                Untitled Position
                              </font>
                            </font>
                          </h3>
                        </div>
                        <div className="modern-job-meta">
                          <span className="modern-meta-tag">
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 24 24"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path fill="none" d="M0 0h24v24H0V0z" />
                              <path d="M14 6V4h-4v2h4zM4 8v11h16V8H4zm16-2c1.11 0 2 .89 2 2v11c0 1.11-.89 2-2 2H4c-1.11 0-2-.89-2-2l.01-11c0-1.11.88-2 1.99-2h4V4c0-1.11.89-2 2-2h4c1.11 0 2 .89 2 2v2h4z" />
                            </svg>
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                Job Category
                              </font>
                            </font>
                          </span>
                          <span className="modern-meta-tag">
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 24 24"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path fill="none" d="M0 0h24v24H0V0z" />
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z" />
                              <circle cx={12} cy={9} r="2.5" />
                            </svg>
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                Morocco
                              </font>
                            </font>
                          </span>
                          <span className="modern-meta-tag">
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 24 24"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path fill="none" d="M0 0h24v24H0V0z" />
                              <path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z" />
                            </svg>
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                CDI
                              </font>
                            </font>
                          </span>
                        </div>
                        <div className="modern-job-footer">
                          <div className="modern-job-info-badges">
                            <span className="modern-info-badge">
                              <i className="fa-solid fa-bookmark" /> Saved to
                              your list
                            </span>
                          </div>
                          <div className="modern-job-footer-actions">
                            <a
                              className="modern-apply-btn"
                              href="/jobPortal/job-details/undefined"
                              style={{
                                "-webkit-text-decoration": "none",
                                "text-decoration": "none",
                              }}
                            >
                              View Details
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="insights-sidebar">
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Who has seen my profile?
                          </font>
                        </font>
                      </h4>
                      <div className="view-count-box">
                        <h2>124</h2>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              Views this month
                            </font>
                          </font>
                        </p>
                      </div>
                      <ul className="viewers-list">
                        <li className="viewer-item">
                          <div className="viewer-avatar">T</div>
                          <div className="viewer-info">
                            <h5>Tech Corp</h5>
                            <p>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  2h ago
                                </font>
                              </font>
                            </p>
                          </div>
                        </li>
                        <li className="viewer-item">
                          <div className="viewer-avatar">G</div>
                          <div className="viewer-info">
                            <h5>Global Solutions</h5>
                            <p>1d ago</p>
                          </div>
                        </li>
                        <li className="viewer-item">
                          <div className="viewer-avatar">I</div>
                          <div className="viewer-info">
                            <h5>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  Innovate AI
                                </font>
                              </font>
                            </h5>
                            <p>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  August 6th
                                </font>
                              </font>
                            </p>
                          </div>
                        </li>
                      </ul>
                      <button className="view-all-btn">
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            See the full report
                          </font>
                        </font>
                      </button>
                    </div>
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Force you Profile
                          </font>
                        </font>
                      </h4>
                      <div className="strength-mini-box">
                        <div className="mini-progress-bar">
                          <div
                            className="mini-progress-fill"
                            style={{ width: "70%" }}
                          />
                        </div>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              70% Completed
                            </font>
                          </font>
                        </p>
                      </div>
                      <a
                        className="view-all-btn text-center d-block text-decoration-none"
                        href="/jobPortal/candidate-profile"
                      >
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Complete my Profile
                          </font>
                        </font>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "job-alerts" && (
                <div className="manage-main-grid">
                  <div className="manage-content-area">
                    <div className="job-alerts-tab-view">
                      <div
                        className="tab-header-actions mb-4"
                        style={{
                          display: "flex",
                          "-webkit-box-pack": "space-between",
                          "-webkit-justify-content": "space-between",
                          "-ms-flex-pack": "space-between",
                          "justify-content": "space-between",
                          "-webkit-align-items": "center",
                          "-webkit-box-align": "center",
                          "-ms-flex-align": "center",
                          "align-items": "center",
                        }}
                      >
                        <h2 className="mb-0">
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              My Job Alerts
                            </font>
                          </font>
                        </h2>
                        {/* BUTTON */}
                        <button
                          className="modern-btn-create"
                          onClick={() => setShowAlertModal(true)}
                          style={{
                            background: "var(--primary-orange)",
                            color: "#fff",
                            border: "none",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "0.75rem",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <i className="fa-solid fa-plus" />
                          Create an alert
                        </button>{" "}
                        {showAlertModal && (
                          <>
                            <div
                              className="modal fade show"
                              id="createJobAlertModal"
                              tabIndex={-1}
                              style={{ display: "block" }}
                              aria-modal="true"
                              role="dialog"
                            >
                              <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content modern-modal">
                                  <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title-modern">
                                      <font
                                        dir="auto"
                                        style={{ "vertical-align": "inherit" }}
                                      >
                                        <font
                                          dir="auto"
                                          style={{
                                            "vertical-align": "inherit",
                                          }}
                                        >
                                          Create a job alert
                                        </font>
                                      </font>
                                    </h5>
                                    <button
                                      type="button"
                                      className="btn-close custom-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                      onClick={() => setShowAlertModal(false)}
                                    />
                                  </div>
                                  <div className="modal-body pt-0">
                                    <p className="modal-subtitle-modern">
                                      <font
                                        dir="auto"
                                        style={{ "vertical-align": "inherit" }}
                                      >
                                        <font
                                          dir="auto"
                                          style={{
                                            "vertical-align": "inherit",
                                          }}
                                        >
                                          Define your criteria to receive the
                                          best opportunities directly in your
                                          inbox.
                                        </font>
                                      </font>
                                    </p>
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Alert name (Optional)
                                              </font>
                                            </font>
                                          </label>
                                          <input
                                            className="modern-input"
                                            placeholder="Example: My Marketing Research"
                                            type="text"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Job Title / Keywords
                                              </font>
                                            </font>
                                          </label>
                                          <input
                                            className="modern-input"
                                            placeholder="Example: React Developer"
                                            type="text"
                                            defaultValue
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Alert name (Optional)
                                              </font>
                                            </font>
                                          </label>
                                          <input
                                            className="modern-input"
                                            placeholder="Example: My Marketing Research"
                                            type="text"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Alert name (Optional)
                                              </font>
                                            </font>
                                          </label>
                                          <input
                                            className="modern-input"
                                            placeholder="Example: My Marketing Research"
                                            type="text"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Contract type
                                              </font>
                                            </font>
                                          </label>
                                          <div className="tag-cloud">
                                            <span className="selectable-tag ">
                                              CDI
                                            </span>
                                            <span className="selectable-tag ">
                                              CDD
                                            </span>
                                            <span className="selectable-tag ">
                                              Freelance
                                            </span>
                                            <span className="selectable-tag ">
                                              Stage
                                            </span>
                                            <span className="selectable-tag ">
                                              volontaire
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Experience level
                                              </font>
                                            </font>
                                          </label>
                                          <div className="tag-cloud">
                                            <span className="selectable-tag ">
                                              &lt;1 ans
                                            </span>
                                            <span className="selectable-tag ">
                                              1 - 3 ans
                                            </span>
                                            <span className="selectable-tag ">
                                              3 - 5 ans
                                            </span>
                                            <span className="selectable-tag ">
                                              5 - 10 ans
                                            </span>
                                            <span className="selectable-tag ">
                                              &gt;10 ans
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Business sectors
                                              </font>
                                            </font>
                                          </label>
                                          <div className="tag-cloud">
                                            <span className="selectable-tag ">
                                              AI &amp; Machine Learning
                                            </span>
                                            <span className="selectable-tag ">
                                              Cloud Computing
                                            </span>
                                            <span className="selectable-tag ">
                                              Cyber security / IT Security
                                            </span>
                                            <span className="selectable-tag ">
                                              Data / Big data
                                            </span>
                                            <span className="selectable-tag ">
                                              Data Science
                                            </span>
                                            <span className="selectable-tag ">
                                              DevOps / Cloud
                                            </span>
                                            <span className="selectable-tag ">
                                              IT Consulting
                                            </span>
                                            <span className="selectable-tag ">
                                              Information Technology Management
                                            </span>
                                            <span className="selectable-tag ">
                                              Information systems / Networks
                                            </span>
                                            <span className="selectable-tag ">
                                              Other
                                            </span>
                                            <span className="selectable-tag ">
                                              Project / Product Management
                                            </span>
                                            <span className="selectable-tag ">
                                              Quality Assurance
                                            </span>
                                            <span className="selectable-tag ">
                                              Software Development
                                            </span>
                                            <span className="selectable-tag ">
                                              Software Engineering / Web
                                              Development
                                            </span>
                                            <span className="selectable-tag ">
                                              Tech Stack
                                            </span>
                                            <span className="selectable-tag ">
                                              UI / UX Design
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Salary range
                                              </font>
                                            </font>
                                          </label>
                                          <div className="tag-cloud">
                                            <span className="selectable-tag ">
                                              0 - 5000 dh
                                            </span>
                                            <span className="selectable-tag ">
                                              10000 - 15000 dh
                                            </span>
                                            <span className="selectable-tag ">
                                              15000 - 20000 dh
                                            </span>
                                            <span className="selectable-tag ">
                                              20000+ dh
                                            </span>
                                            <span className="selectable-tag ">
                                              5000 - 10000 dh
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Working method
                                              </font>
                                            </font>
                                          </label>
                                          <div className="tag-cloud">
                                            <span className="selectable-tag ">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  Telework
                                                </font>
                                              </font>
                                            </span>
                                            <span className="selectable-tag ">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  On site
                                                </font>
                                              </font>
                                            </span>
                                            <span className="selectable-tag ">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  Hybrid
                                                </font>
                                              </font>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Notification frequency
                                              </font>
                                            </font>
                                          </label>
                                          <select className="modern-select">
                                            <option value="1 day">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  Each day
                                                </font>
                                              </font>
                                            </option>
                                            <option value="3 days">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  Every 3 days
                                                </font>
                                              </font>
                                            </option>
                                            <option value="Week">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  Each week
                                                </font>
                                              </font>
                                            </option>
                                            <option value="Month">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  Each month
                                                </font>
                                              </font>
                                            </option>
                                            <option value="Just save">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  Do not notify (Save only)
                                                </font>
                                              </font>
                                            </option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="modal-actions-modern mt-4">
                                      <button
                                        className="confirm-withdraw-btn"
                                        style={{
                                          background: "var(--primary-orange)",
                                        }}
                                        onClick={() => setShowAlertModal(false)}
                                      >
                                        Enregistrer l'alerte
                                      </button>
                                      <button
                                        className="cancel-withdraw-btn"
                                        data-bs-dismiss="modal"
                                        onClick={() => setShowAlertModal(false)}
                                      >
                                        <font
                                          dir="auto"
                                          style={{
                                            "vertical-align": "inherit",
                                          }}
                                        >
                                          <font
                                            dir="auto"
                                            style={{
                                              "vertical-align": "inherit",
                                            }}
                                          >
                                            Cancel
                                          </font>
                                        </font>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="modern-job-card mb-4">
                        <div className="modern-job-header">
                          <div className="modern-company-info">
                            <div
                              className="modern-logo-container"
                              style={{
                                background: "rgb(255, 247, 237)",
                                color: "rgb(251, 146, 60)",
                              }}
                            >
                              <i
                                className="fa-solid fa-bell"
                                style={{ "font-size": "24px" }}
                              />
                            </div>
                            <div className="modern-company-details">
                              <h4 className="modern-company-name">
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    Job alert
                                  </font>
                                </font>
                              </h4>
                              <span className="modern-post-date">
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth={0}
                                  viewBox="0 0 24 24"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path fill="none" d="M0 0h24v24H0V0z" />
                                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                </svg>
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    Notifying every:{" "}
                                  </font>
                                </font>
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    week
                                  </font>
                                </font>
                              </span>
                            </div>
                          </div>
                          <div
                            className="modern-job-actions"
                            style={{
                              "-webkit-align-items": "center",
                              "-webkit-box-align": "center",
                              "-ms-flex-align": "center",
                              "align-items": "center",
                            }}
                          >
                            <div
                              className="modern-switch-box"
                              style={{ "margin-right": "8px" }}
                            >
                              <label className="modern-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="modern-slider" />
                              </label>
                            </div>
                            <button
                              className="modern-action-icon"
                              title="DELETE"
                              style={{
                                color: "rgb(239, 68, 68)",
                                background: "rgb(254, 242, 242)",
                              }}
                            >
                              <i className="fa-solid fa-trash-can" />
                            </button>
                          </div>
                        </div>
                        <div className="modern-job-body">
                          <h3 className="modern-job-title">
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                Permanent contract / Casablanca / 3-5 years / AI
                                &amp; Machine Learning / Engineer
                              </font>
                            </font>
                          </h3>
                          <div className="alert-filters-container">
                            <div className="alert-filter-group">
                              <span className="filter-group-label">
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    Positions:
                                  </font>
                                </font>
                              </span>
                              <div className="filter-tags">
                                <span className="modern-meta-tag">
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      engineer
                                    </font>
                                  </font>
                                </span>
                              </div>
                            </div>
                            <div className="alert-filter-group">
                              <span className="filter-group-label">
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    Criteria:
                                  </font>
                                </font>
                              </span>
                              <div className="filter-tags">
                                <span className="modern-meta-tag">
                                  <i className="fa-solid fa-location-dot" />{" "}
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      casablanca
                                    </font>
                                  </font>
                                </span>
                                <span className="modern-meta-tag">
                                  <i className="fa-solid fa-briefcase" />{" "}
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      CDI
                                    </font>
                                  </font>
                                </span>
                                <span className="modern-meta-tag">
                                  <i className="fa-solid fa-graduation-cap" />{" "}
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      3-5 years
                                    </font>
                                  </font>
                                </span>
                                <span className="modern-meta-tag">
                                  <i className="fa-solid fa-layer-group" />{" "}
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      AI &amp; Machine Learning
                                    </font>
                                  </font>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="modern-job-footer">
                          <div className="modern-job-info-badges">
                            <span
                              className="modern-status-badge assessment"
                              style={{
                                "font-size": "11px",
                                padding: "4px 12px",
                              }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  Active
                                </font>
                              </font>
                            </span>
                          </div>
                          <div className="modern-job-footer-actions">
                            <button className="modern-apply-btn">
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  View offers
                                </font>
                              </font>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="insights-sidebar">
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Who has seen my profile?
                          </font>
                        </font>
                      </h4>
                      <div className="view-count-box">
                        <h2>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              124
                            </font>
                          </font>
                        </h2>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              Views this month
                            </font>
                          </font>
                        </p>
                      </div>
                      <ul className="viewers-list">
                        <li className="viewer-item">
                          <div className="viewer-avatar">
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                T
                              </font>
                            </font>
                          </div>
                          <div className="viewer-info">
                            <h5>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  Tech Corp
                                </font>
                              </font>
                            </h5>
                            <p>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  2h ago
                                </font>
                              </font>
                            </p>
                          </div>
                        </li>
                        <li className="viewer-item">
                          <div className="viewer-avatar">
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                G
                              </font>
                            </font>
                          </div>
                          <div className="viewer-info">
                            <h5>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  Global Solutions
                                </font>
                              </font>
                            </h5>
                            <p>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  1d ago
                                </font>
                              </font>
                            </p>
                          </div>
                        </li>
                        <li className="viewer-item">
                          <div className="viewer-avatar">
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                I
                              </font>
                            </font>
                          </div>
                          <div className="viewer-info">
                            <h5>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  Innovate AI
                                </font>
                              </font>
                            </h5>
                            <p>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  August 6th
                                </font>
                              </font>
                            </p>
                          </div>
                        </li>
                      </ul>
                      <button className="view-all-btn">
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            See the full report
                          </font>
                        </font>
                      </button>
                    </div>
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Force you Profile
                          </font>
                        </font>
                      </h4>
                      <div className="strength-mini-box">
                        <div className="mini-progress-bar">
                          <div
                            className="mini-progress-fill"
                            style={{ width: "70%" }}
                          />
                        </div>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              70% Completed
                            </font>
                          </font>
                        </p>
                      </div>
                      <a
                        className="view-all-btn text-center d-block text-decoration-none"
                        href="/jobPortal/candidate-profile"
                      >
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Complete my Profile
                          </font>
                        </font>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "companies" && (
                <div className="manage-main-grid">
                  <div className="manage-content-area">
                    <div className="profile-views-tab-view">
                      <div className="section-header-modern mb-4">
                        <h2
                          style={{
                            "font-size": "1.75rem",
                            "font-weight": "800",
                            color: "var(--text-dark)",
                          }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              Profile Visits
                            </font>
                          </font>
                        </h2>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            "font-size": "0.95rem",
                          }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              Discover which companies are interested in your
                              profile.
                            </font>
                          </font>
                        </p>
                      </div>
                      <div
                        className="modern-filter-bar mb-4"
                        style={{
                          display: "flex",
                          "-webkit-box-pack": "space-between",
                          "-webkit-justify-content": "space-between",
                          "-ms-flex-pack": "space-between",
                          "justify-content": "space-between",
                          "-webkit-align-items": "center",
                          "-webkit-box-align": "center",
                          "-ms-flex-align": "center",
                          "align-items": "center",
                          background: "rgb(255, 255, 255)",
                          padding: "1rem",
                          "border-radius": "1rem",
                          border: "1px solid var(--border-color)",
                          "-webkit-flex-wrap": "wrap",
                          "-ms-flex-wrap": "wrap",
                          "flex-wrap": "wrap",
                          gap: "1rem",
                        }}
                      >
                        <div
                          className="filter-pills"
                          style={{ display: "flex", gap: "0.5rem" }}
                        >
                          <button
                            className="filter-pill "
                            style={{
                              padding: "0.6rem 1.2rem",
                              "border-radius": "0.75rem",
                              "border-width": "medium",
                              "border-style": "none",
                              "border-color": "currentcolor",
                              "border-image": "initial",
                              background: "rgb(248, 250, 252)",
                              color: "var(--text-muted)",
                              "font-weight": "600",
                              "font-size": "0.85rem",
                              "-webkit-transition": "0.2s",
                              transition: "0.2s",
                              cursor: "pointer",
                            }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                All
                              </font>
                            </font>
                          </button>
                          <button
                            className="filter-pill "
                            style={{
                              padding: "0.6rem 1.2rem",
                              "border-radius": "0.75rem",
                              "border-width": "medium",
                              "border-style": "none",
                              "border-color": "currentcolor",
                              "border-image": "initial",
                              background: "rgb(248, 250, 252)",
                              color: "var(--text-muted)",
                              "font-weight": "600",
                              "font-size": "0.85rem",
                              "-webkit-transition": "0.2s",
                              transition: "0.2s",
                              cursor: "pointer",
                            }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                Today
                              </font>
                            </font>
                          </button>
                          <button
                            className="filter-pill "
                            style={{
                              padding: "0.6rem 1.2rem",
                              "border-radius": "0.75rem",
                              "border-width": "medium",
                              "border-style": "none",
                              "border-color": "currentcolor",
                              "border-image": "initial",
                              background: "rgb(248, 250, 252)",
                              color: "var(--text-muted)",
                              "font-weight": "600",
                              "font-size": "0.85rem",
                              "-webkit-transition": "0.2s",
                              transition: "0.2s",
                              cursor: "pointer",
                            }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                last 7 days
                              </font>
                            </font>
                          </button>
                          <button
                            className="filter-pill active"
                            style={{
                              padding: "0.6rem 1.2rem",
                              "border-radius": "0.75rem",
                              "border-width": "medium",
                              "border-style": "none",
                              "border-color": "currentcolor",
                              "border-image": "initial",
                              background: "var(--primary-orange)",
                              color: "rgb(255, 255, 255)",
                              "font-weight": "600",
                              "font-size": "0.85rem",
                              "-webkit-transition": "0.2s",
                              transition: "0.2s",
                              cursor: "pointer",
                            }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                Custom
                              </font>
                            </font>
                          </button>
                        </div>
                        <div
                          className="custom-date-range"
                          style={{
                            display: "flex",
                            "-webkit-align-items": "center",
                            "-webkit-box-align": "center",
                            "-ms-flex-align": "center",
                            "align-items": "center",
                            gap: "0.5rem",
                          }}
                        >
                          <input
                            type="date"
                            defaultValue
                            style={{
                              padding: "0.5rem",
                              "border-radius": "0.5rem",
                              border: "1px solid var(--border-color)",
                              "font-size": "0.85rem",
                            }}
                          />
                          <span
                            style={{
                              color: "var(--text-muted)",
                              "font-size": "0.85rem",
                            }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                At
                              </font>
                            </font>
                          </span>
                          <input
                            type="date"
                            defaultValue
                            style={{
                              padding: "0.5rem",
                              "border-radius": "0.5rem",
                              border: "1px solid var(--border-color)",
                              "font-size": "0.85rem",
                            }}
                          />
                        </div>
                      </div>
                      <div className="profile-viewers-grid">
                        <div
                          className="modern-viewer-card mb-3"
                          style={{
                            background: "rgb(255, 255, 255)",
                            "border-radius": "1.25rem",
                            border: "1px solid var(--border-color)",
                            padding: "1.25rem",
                            "-webkit-transition": "0.3s",
                            transition: "0.3s",
                            cursor: "pointer",
                            display: "flex",
                            "-webkit-flex-direction": "column",
                            "-ms-flex-direction": "column",
                            "flex-direction": "column",
                            gap: "1rem",
                          }}
                        >
                          <div
                            className="viewer-card-body"
                            style={{
                              display: "flex",
                              "-webkit-box-pack": "space-between",
                              "-webkit-justify-content": "space-between",
                              "-ms-flex-pack": "space-between",
                              "justify-content": "space-between",
                              "-webkit-align-items": "center",
                              "-webkit-box-align": "center",
                              "-ms-flex-align": "center",
                              "align-items": "center",
                              "-webkit-flex-wrap": "wrap",
                              "-ms-flex-wrap": "wrap",
                              "flex-wrap": "wrap",
                              gap: "1rem",
                            }}
                          >
                            <div
                              className="viewer-brand"
                              style={{
                                display: "flex",
                                "-webkit-align-items": "center",
                                "-webkit-box-align": "center",
                                "-ms-flex-align": "center",
                                "align-items": "center",
                                gap: "1rem",
                              }}
                            >
                              <div
                                className="brand-logo-modern"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  background: "rgb(248, 250, 252)",
                                  "border-radius": "0.75rem",
                                  display: "flex",
                                  "-webkit-align-items": "center",
                                  "-webkit-box-align": "center",
                                  "-ms-flex-align": "center",
                                  "align-items": "center",
                                  "-webkit-box-pack": "center",
                                  "-webkit-justify-content": "center",
                                  "-ms-flex-pack": "center",
                                  "justify-content": "center",
                                  overflow: "hidden",
                                  border: "1px solid rgb(241, 245, 249)",
                                }}
                              >
                                <span
                                  className="brand-initial"
                                  style={{
                                    color: "var(--primary-orange)",
                                    "font-weight": "700",
                                    "font-size": "1.1rem",
                                  }}
                                >
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      G
                                    </font>
                                  </font>
                                </span>
                              </div>
                              <div className="brand-info-modern">
                                <h4
                                  style={{
                                    margin: "0px",
                                    "font-size": "1.05rem",
                                    "font-weight": "700",
                                    color: "var(--text-dark)",
                                  }}
                                >
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      Global Solutions
                                    </font>
                                  </font>
                                </h4>
                              </div>
                            </div>
                            <div
                              className="viewer-meta-modern"
                              style={{
                                display: "flex",
                                gap: "1.5rem",
                                "-webkit-flex-wrap": "wrap",
                                "-ms-flex-wrap": "wrap",
                                "flex-wrap": "wrap",
                              }}
                            >
                              <div
                                className="meta-item-modern"
                                style={{
                                  display: "flex",
                                  "-webkit-align-items": "center",
                                  "-webkit-box-align": "center",
                                  "-ms-flex-align": "center",
                                  "align-items": "center",
                                  gap: "0.5rem",
                                  color: "var(--text-muted)",
                                  "font-size": "0.85rem",
                                }}
                              >
                                <i
                                  className="fa-solid fa-location-dot"
                                  style={{ color: "var(--primary-orange)" }}
                                />
                                <span>
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      Rabat
                                    </font>
                                  </font>
                                </span>
                              </div>
                              <div
                                className="meta-item-modern"
                                style={{
                                  display: "flex",
                                  "-webkit-align-items": "center",
                                  "-webkit-box-align": "center",
                                  "-ms-flex-align": "center",
                                  "align-items": "center",
                                  gap: "0.5rem",
                                  color: "var(--text-muted)",
                                  "font-size": "0.85rem",
                                }}
                              >
                                <i
                                  className="fa-solid fa-calendar-days"
                                  style={{ color: "var(--primary-orange)" }}
                                />
                                <span>
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    <font
                                      dir="auto"
                                      style={{ "vertical-align": "inherit" }}
                                    >
                                      April 30, 2026 at 8:00 PM
                                    </font>
                                  </font>
                                </span>
                              </div>
                            </div>
                            <div className="viewer-action-modern">
                              <button
                                className="btn-view-company"
                                style={{
                                  padding: "0.6rem 1.25rem",
                                  "border-radius": "0.75rem",
                                  border: "1px solid var(--primary-orange)",
                                  background: "transparent",
                                  color: "var(--primary-orange)",
                                  "font-weight": "600",
                                  "font-size": "0.85rem",
                                  "-webkit-transition": "0.2s",
                                  transition: "0.2s",
                                  cursor: "pointer",
                                }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    View the company
                                  </font>
                                </font>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="insights-sidebar">
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Who has seen my profile?
                          </font>
                        </font>
                      </h4>
                      <div className="view-count-box">
                        <h2>124</h2>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              Views this month
                            </font>
                          </font>
                        </p>
                      </div>
                      <ul className="viewers-list">
                        <li className="viewer-item">
                          <div className="viewer-avatar">T</div>
                          <div className="viewer-info">
                            <h5>Tech Corp</h5>
                            <p>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  2h ago
                                </font>
                              </font>
                            </p>
                          </div>
                        </li>
                        <li className="viewer-item">
                          <div className="viewer-avatar">G</div>
                          <div className="viewer-info">
                            <h5>Global Solutions</h5>
                            <p>1d ago</p>
                          </div>
                        </li>
                        <li className="viewer-item">
                          <div className="viewer-avatar">I</div>
                          <div className="viewer-info">
                            <h5>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  Innovate AI
                                </font>
                              </font>
                            </h5>
                            <p>
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  August 6th
                                </font>
                              </font>
                            </p>
                          </div>
                        </li>
                      </ul>
                      <button className="view-all-btn">
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            See the full report
                          </font>
                        </font>
                      </button>
                    </div>
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Force you Profile
                          </font>
                        </font>
                      </h4>
                      <div className="strength-mini-box">
                        <div className="mini-progress-bar">
                          <div
                            className="mini-progress-fill"
                            style={{ width: "70%" }}
                          />
                        </div>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              70% Completed
                            </font>
                          </font>
                        </p>
                      </div>
                      <a
                        className="view-all-btn text-center d-block text-decoration-none"
                        href="/jobPortal/candidate-profile"
                      >
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Complete my Profile
                          </font>
                        </font>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
          {/*mannage Job application end here*/}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name"> Connect Work.ma </span> All
                    Rights Reserved
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    Designed By{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      Webnmobapps Solution Pvt. Ltd
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagesJobApplication;
