import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {isAuthReady, getRequestConfig } from "../utils/apiHeaders";
import { API_BASE_URL } from "../Url/Url";
import { toast } from "react-toastify";
import { Modal, Typography, Card, Divider, Box } from "@mui/material";
import { API_IMAGE_URL } from "../Url/Url";
import Swal from "sweetalert2";
import { green } from "@mui/material/colors";
import { useTranslation } from "react-i18next";
import { useDebounce, SEARCH_DEBOUNCE_MS } from "../hooks/useDebounce";
import SafeHtml from "../components/SafeHtml";

const MODERATION_FEEDBACK_DISMISS_KEY = "cw_dismissed_moderation_feedback";

function readDismissedModerationMap() {
  try {
    const raw = localStorage.getItem(MODERATION_FEEDBACK_DISMISS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getModerationFeedbackToken(job) {
  return String(job?.lastModeratedAt || job?.moderationComment || "");
}

function shouldShowModerationFeedback(job, dismissedMap) {
  if (!job?.moderationComment) return false;
  if (String(job.status || "").toLowerCase() !== "unpublished") return false;
  const latest = Array.isArray(job.moderationHistory)
    ? job.moderationHistory[job.moderationHistory.length - 1]
    : null;
  if (latest && String(latest.status || "").toLowerCase() === "published") {
    return false;
  }
  return dismissedMap[job._id] !== getModerationFeedbackToken(job);
}

function YourJobPosts() {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();
  const [cateroryList, setCategoryList] = useState([]);
  const [jobTypeList, setJobTypeList] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  // add with your other useState hooks
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_MS);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewData, setViewData] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [perPage, setPerPage] = useState(10); // default
  const [dismissedModeration, setDismissedModeration] = useState(() =>
    readDismissedModerationMap(),
  );

  const dismissModerationFeedback = (job) => {
    const next = {
      ...readDismissedModerationMap(),
      [job._id]: getModerationFeedbackToken(job),
    };
    localStorage.setItem(MODERATION_FEEDBACK_DISMISS_KEY, JSON.stringify(next));
    setDismissedModeration(next);
  };

  useEffect(() => {
    if (!location.state?.openModal) {
      return;
    }

    navigate("/job-details-form", { replace: true, state: {} });
  }, [location.state, navigate]);

  const handleCreate = async () => {
    if (!jobTitle || !jobCategory) {
      toast.error(t("header.Please_fill_all_required_fields"));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const tempTitle = jobTitle;
      const tempCategory = jobCategory;

      const response = await axios.post(
        `${API_BASE_URL}createJob`,
        { jobTitle: tempTitle, jobCategory: tempCategory },
        getRequestConfig(),
      );

      console.log("Job Created:", response.data);
      const createdJob = response.data.job;

      toast.success(t("header.Job_created_successfully"));

      setJobTitle("");
      setJobCategory("");

      navigate(`/job-details-form/${createdJob._id}`, {
        state: { jobData: createdJob },
      });
    } catch (error) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message;
      const exhausted = error.response?.data?.is_exhausted;

      console.log("Status:", status);
      console.log("Message:", errorMessage);
      console.log("Exhausted:", exhausted);

      // 🚀 Credit exhausted condition
      if (
        status === 400 &&
        (exhausted === 1 || errorMessage?.includes("credits"))
      ) {
        toast.warning(errorMessage, { autoClose: 5000 });

        setTimeout(() => {
          navigate("/add-plan");
        }, 5000);

        return;
      }

      toast.error(errorMessage || t("something_wrong"));
    }
  };
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.classList.contains("menu-icon")) {
        const parent = e.target.closest(".job-short-detail-box");
        if (!parent) return;
        const thisMenu = parent.querySelector(".job-short-detail-crud-menu");
        document
          .querySelectorAll(".job-short-detail-crud-menu")
          .forEach((menu) => {
            if (menu !== thisMenu) {
              menu.classList.remove("show");
            }
          });
        if (thisMenu) {
          thisMenu.classList.toggle("show");
        }
      } else {
        document
          .querySelectorAll(".job-short-detail-crud-menu")
          .forEach((menu) => menu.classList.remove("show"));
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}getJobCategory`);
      console.log(response.data.jobCategories);
      setCategoryList(response.data.jobCategories);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCountryList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}get/countries`);
      setCountryList(response.data.countries || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchJobTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}getActiveJobTypeList`);
      setJobTypeList(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };

  useEffect(() => {
    fetchCountryList();
    fetchCategoryList();
    fetchJobTypes();
  }, []);

  const fetchJobs = async (
    status = activeStatus,
    page = currentPage,
    limit = perPage,
    search = debouncedSearchTerm,
    sort = sortBy,
    sDate = startDate,
    eDate = endDate,
    jType = selectedJobType,
  ) => {
    try {
      setLoading(true);

      let url = `${API_BASE_URL}getRecruiterJobList?status=${status}&page=${page}&limit=${limit}&search=${encodeURIComponent(search || "")}&sort=${sort}`;
      if (sDate) url += `&startDate=${sDate}`;
      if (eDate) url += `&endDate=${eDate}`;
      if (jType) url += `&jobType=${encodeURIComponent(jType)}`;

      const res = await axios.get(url, getRequestConfig());

      setJobs(res.data.jobs || []);
      setTotalPages(res?.data?.pagination?.totalPages || 1);
      setTotalResults(res?.data?.pagination?.totalJobs || 0);
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(activeStatus, currentPage, perPage, debouncedSearchTerm, sortBy, startDate, endDate, selectedJobType);
  }, [activeStatus, currentPage, debouncedSearchTerm, sortBy, startDate, endDate, selectedJobType]);

  const startResult = totalResults === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endResult = Math.min(currentPage * perPage, totalResults);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getEmptyMessage = () => {
    switch (activeStatus) {
      case "published":
        return "There Are No Published Job Posts.";
      case "draft":
        return "There Are No Draft Job Posts.";
      case "expired":
        return "There Are No Expired Job Posts.";
      case "unpublished":
        return "There Are No Unpublished Job Posts.";
      case "archived":
        return "There Are No Archived Job Posts.";
      case "scheduled":
        return "There Are No Scheduled Job Posts.";
      case "all":
      default:
        return "No Jobs Found.";
    }
  };

  const jobUpdate = (job) => {
    navigate(`/job-details-form/${job._id}`, {
      state: { jobData: job, from: "/your-job-posts" },
    });
  };

  const copyDraft = async (id, title, category) => {
    try {
      const token = localStorage.getItem("token");
      if (!isAuthReady()) {
        toast.error(t("You_need_to_log_in_first"));
        return;
      }

      const data = {
        jobTitle: title,
        jobCategory: category,
      };
      console.log("Job title:-", title);
      console.log("Job Category:-", category);
      const response = await axios.post(
        `${API_BASE_URL}jobs/${id}/copy-as-draft`,
        data,
        getRequestConfig(),
      );
      // ✅ Show success message
      toast.success(
        response.data?.message || t("header.Draft_copied_successfully"),
      );
      setMenuOpen(false);
      fetchJobs(activeStatus);
    } catch (error) {
      console.error("Copy Draft Error:", error);
      toast.error(
        error.response?.data?.message || t("header.Draft_copied_successfully"),
      );
    }
  };

  const archiveData = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!isAuthReady()) {
        toast.error("You need to log in first.");
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}jobs/${id}/archived`,
        {},
        getRequestConfig(),
      );
      // ✅ Show success message
      toast.success(
        response.data?.message || t("header.Archived_Job_successfully"),
      );
      setMenuOpen(false);
      fetchJobs(activeStatus);
    } catch (error) {
      console.error("Archived Job Error:", error);
      toast.error(
        error.response?.data?.message ||
          t("header.Failed_to_Archived_Job_Try_again"),
      );
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: t("header.Are_you_sure"),
      text: t("header.Are_you_sure"),
      icon: t("header.warning"),
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("header.Yes_delete_it"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          if (!isAuthReady()) {
            toast.error(t("header.You_need_to_log_in_first"));
            return;
          }
          const response = await axios.post(
            `${API_BASE_URL}deleteJob/${id}`,
            {},
            getRequestConfig(),
          );
          if (response.data.success) {
            toast.success(response.data.message);
            fetchJobs(activeStatus);
          }
        } catch (error) {
          console.error(error.response.data.message);
        }
      }
    });
  };

  const fetchJobDashboardStats = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}get/jobDashboardStats`,
        getRequestConfig(),
      );

      setDashboardStats(res.data.data); // adjust key if needed
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
    }
  };
  useEffect(() => {
    fetchJobDashboardStats();
  }, []);

  const handleViewOpen = () => setViewOpen(true);
  const handleViewClose = () => setViewOpen(false);

  // Handle Particular Data
  const handleView = (id) => {
    axios
      .get(`${API_BASE_URL}getJobById/${id}`, getRequestConfig())
      .then((response) => {
        setViewData(response.data.data);
        console.log(response.data.data);
        handleViewOpen();
        setMenuOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderWeeklyChange = (value) => (
    <p>
      <i
        className={`fa-solid ${value >= 0 ? "fa-arrow-up" : "fa-arrow-down"}`}
      />{" "}
      {Math.abs(value)}% {t("header.this_week")}
    </p>
  );

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}

          <div className="breadcrumb-area d-flex justify-content-between align-items-center">
            <div>
              <h1> {t("header.Manage_Job_Posts")}</h1>
              <ol className="breadcrumb">
                <li className="item">
                  <Link to="/">{t("header.home")} </Link>
                </li>
                <li className="item">
                  <Link to="/employer-dashboard">
                    {" "}
                    <i className="fa-solid fa-angle-right" />
                    {t("header.dashboard")}{" "}
                  </Link>
                </li>
                <li className="item">
                  <Link to="/your-job-posts">
                    <i className="fa-solid fa-angle-right" />{" "}
                    {t("header.Job_Posts")}
                  </Link>
                </li>
              </ol>
            </div>
          </div>
          {/* End Breadcrumb Area */}

          {/* employer dashboard  start here */}
          <section className="employer-dashboard-info-area">
            <div className="employer-dashboard-common-heading">
              <h2>{t("header.Job_Post_Dashboard")}</h2>
            </div>
            <div className="employer-dashboard-box">
              <div className="row">
                {/* All Jobs */}
                <div className="col-md-4 mb-3 kpi-blue">
                  <Link
                    className={`${activeStatus === "all" ? "active" : ""}`}
                    onClick={() => setActiveStatus("all")}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fas fa-tasks"></i>
                      </div>
                      <div className="employer-box-content">
                        <h4>{t("header.All_Jobs")}</h4>
                        <h5>{dashboardStats?.allJobs?.count ?? 0}</h5>
                        {renderWeeklyChange(
                          dashboardStats?.allJobs?.weeklyChange ?? 0,
                        )}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Published Jobs */}
                <div className="col-md-4 mb-3 kpi-cyan">
                  <Link
                    className={`${activeStatus === "published" ? "active" : ""}`}
                    onClick={() => setActiveStatus("published")}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fa-solid fa-upload"></i>
                      </div>
                      <div className="employer-box-content">
                        <h4>{t("header.Published_Jobs")}</h4>
                        <h5>{dashboardStats?.published?.count ?? 0}</h5>
                        {renderWeeklyChange(
                          dashboardStats?.published?.weeklyChange ?? 0,
                        )}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Draft Jobs */}
                <div className="col-md-4 mb-3 kpi-orange">
                  <Link
                    className={`${activeStatus === "draft" ? "active" : ""}`}
                    onClick={() => setActiveStatus("draft")}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fa-solid fa-pencil"></i>
                      </div>
                      <div className="employer-box-content">
                        <h4>{t("header.Draft_Job")}</h4>
                        <h5>{dashboardStats?.draft?.count ?? 0}</h5>
                        {renderWeeklyChange(
                          dashboardStats?.draft?.weeklyChange ?? 0,
                        )}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Archived Jobs */}
                <div className="col-md-4 mb-3 kpi-purple">
                  <Link
                    className={`${activeStatus === "archived" ? "active" : ""}`}
                    onClick={() => setActiveStatus("archived")}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fas fa-archive"></i>
                      </div>
                      <div className="employer-box-content">
                        <h4>{t("header.Archived_Job")}</h4>
                        <h5>{dashboardStats?.archived?.count ?? 0}</h5>
                        {renderWeeklyChange(
                          dashboardStats?.archived?.weeklyChange ?? 0,
                        )}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Unpublished Jobs */}
                <div className="col-md-4 mb-3 kpi-green">
                  <Link
                    className={`${activeStatus === "unpublished" ? "active" : ""}`}
                    onClick={() => setActiveStatus("unpublished")}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fas fa-file-word"></i>
                      </div>
                      <div className="employer-box-content">
                        <h4>{t("header.Unpublished_Job")}</h4>
                        <h5>{dashboardStats?.unpublished?.count ?? 0}</h5>
                        {renderWeeklyChange(
                          dashboardStats?.unpublished?.weeklyChange ?? 0,
                        )}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Expired Jobs */}
                <div className="col-md-4 mb-3 kpi-red">
                  <Link
                    className={`${activeStatus === "expired" ? "active" : ""}`}
                    onClick={() => setActiveStatus("expired")}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="employer-box-content">
                        <h4>{t("header.Expired_Job")}</h4>
                        <h5>{dashboardStats?.expired?.count ?? 0}</h5>
                        {renderWeeklyChange(
                          dashboardStats?.expired?.weeklyChange ?? 0,
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          {/* employer dashboard end here */}

          {/* Your Job Posts Info*/}
          <div className="your-job-post-main-info">
            <div className="row">
              <div className="col-lg-3 col-sm-3">
                <div className="your-job-post-side-menu">
                  <div className="your-job-post-side-heading">
                    <ul className="nav nav-tabs" role="tablist">
                      <li
                        className="nav-item"
                        // data-bs-toggle="modal"
                        // data-bs-target="#exampleModal"
                        onClick={() => navigate("/job-details-form")}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <a className="nav-link">
                          <i className="fa-solid fa-plus"></i>
                          {t("header.Create_job")}
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/* Create Job Modal  */}
                  {/* <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Create a job offer
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>
                        <div className="modal-body">
                          <div>
                            <div className="form-group mb-4">
                              <label>Job Title</label>
                              <span className="text-danger">*</span>
                              <input
                                className="form-control"
                                type="text"
                                placeholder="Job Title"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                              />
                            </div>
                            <div className="form-group mb-4">
                              <label>Job Category</label>
                              <span className="text-danger">*</span>
                              <select
                                className="form-select form-control"
                                value={jobCategory}
                                onChange={(e) => setJobCategory(e.target.value)}
                              >
                                <option value="">Select Category</option>
                                {cateroryList.map((list) => (
                                  <option value={list._id} key={list._id}>
                                    {list.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer text-center">
                          <button
                            type="button"
                            className="default-btn btn"
                            data-bs-dismiss="modal"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleCreate}
                            className="default-btn btn"
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          activeStatus === "all" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("all")}
                      >
                        <i className="fas fa-tasks"></i>
                        {t("header.All")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          activeStatus === "published" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("published")}
                      >
                        <i className="fa-solid fa-upload"></i>{" "}
                        {t("header.Published")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          activeStatus === "draft" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("draft")}
                      >
                        <i className="fa-solid fa-pencil"></i>{" "}
                        {t("header.Draft")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          activeStatus === "archived" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("archived")}
                      >
                        <i className="fas fa-archive"></i>{" "}
                        {t("header.Archived")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          activeStatus === "unpublished" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("unpublished")}
                      >
                        <i className="fas fa-file-word"></i>
                        {t("header.Unpublished")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          activeStatus === "expired" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("expired")}
                      >
                        <i className="fas fa-calendar-alt"></i>
                        {t("header.Expired")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${
                          activeStatus === "scheduled" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("scheduled")}
                      >
                        <i className="fas fa-archive"></i>
                        {t("header.Scheduled")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-9 col-md-9">
                <div className="your-job-post-detail-info">
                  {/* Search + Job Type + Date Range + Sort in 1 clean row */}
                  <div className="row mb-4 align-items-center g-2">
                    {/* 1. Search by Job Title */}
                    <div className="col-lg-3 col-md-6 col-12">
                      <div className="position-relative">
                        <i
                          className="fa-solid fa-magnifying-glass position-absolute"
                          style={{
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#8898aa",
                            fontSize: "13px",
                          }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("header.Search_by_job_title")}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            borderRadius: "10px",
                            paddingLeft: "34px",
                            paddingRight: searchTerm ? "28px" : "10px",
                            border: "1px solid #e9ecef",
                            height: "44px",
                            fontSize: "13px",
                            backgroundColor: "#fff",
                          }}
                        />
                        {searchTerm && (
                          <button
                            type="button"
                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted p-0 me-2"
                            onClick={() => setSearchTerm("")}
                            style={{ fontSize: "11px", textDecoration: "none" }}
                          >
                            <i className="fa-solid fa-xmark" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 2. Job Type Dropdown */}
                    <div className="col-lg-2 col-md-6 col-12">
                      <select
                        className="form-select form-control"
                        value={selectedJobType}
                        onChange={(e) => {
                          setSelectedJobType(e.target.value);
                          setCurrentPage(1);
                        }}
                        style={{
                          borderRadius: "10px",
                          border: "1px solid #e9ecef",
                          height: "44px",
                          fontSize: "12.5px",
                          backgroundColor: "#fff",
                          cursor: "pointer",
                          paddingLeft: "10px",
                        }}
                      >
                        <option value="">{t("header.All_Job_Types", { defaultValue: "All Job Types" })}</option>
                        {jobTypeList.map((type) => (
                          <option key={type._id || type.name} value={type._id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 3. Date Range Filter */}
                    <div className="col-lg-4 col-md-6 col-12">
                      <div
                        className="d-flex align-items-center justify-content-center gap-1 px-2"
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid #e9ecef",
                          height: "44px",
                          borderRadius: "10px",
                        }}
                      >
                        <input
                          type="date"
                          className="form-control form-control-sm border-0 bg-transparent p-0"
                          value={startDate}
                          title={t("jobs.start_date") || "Start date"}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            setCurrentPage(1);
                          }}
                          style={{
                            fontSize: "12px",
                            color: "#495057",
                            width: "116px",
                            cursor: "pointer",
                          }}
                        />
                        <span className="text-muted small px-1">→</span>
                        <input
                          type="date"
                          className="form-control form-control-sm border-0 bg-transparent p-0"
                          value={endDate}
                          title={t("jobs.end_date") || "End date"}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            setCurrentPage(1);
                          }}
                          style={{
                            fontSize: "12px",
                            color: "#495057",
                            width: "116px",
                            cursor: "pointer",
                          }}
                        />
                        {(startDate || endDate) && (
                          <button
                            type="button"
                            className="btn btn-sm text-danger p-0 ms-1"
                            title={t("jobs.clear_date") || "Clear dates"}
                            onClick={() => {
                              setStartDate("");
                              setEndDate("");
                              setCurrentPage(1);
                            }}
                            style={{ border: "none", background: "none", cursor: "pointer" }}
                          >
                            <i className="fa-solid fa-xmark" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 4. Sort By Dropdown */}
                    <div className="col-lg-3 col-md-6 col-12">
                      <div className="position-relative">
                        <div
                          onClick={() => setSortOpen(!sortOpen)}
                          className="d-flex align-items-center justify-content-between px-3"
                          style={{
                            cursor: "pointer",
                            border: "1px solid #e9ecef",
                            backgroundColor: "#fff",
                            height: "44px",
                            borderRadius: "10px",
                            fontSize: "12.5px",
                          }}
                        >
                          <div className="d-flex align-items-center gap-1 text-truncate">
                            <span className="text-muted small" style={{ fontSize: "11px", fontWeight: 600 }}>
                              {t("header.Sort_By")}:
                            </span>
                            <span className="fw-semibold text-dark text-truncate">
                              {sortBy === "newest"
                                ? "Recent First"
                                : sortBy === "oldest"
                                  ? "Oldest First"
                                  : sortBy === "a-z"
                                    ? "A to Z"
                                    : sortBy === "z-a"
                                      ? "Z to A"
                                      : "Recent First"}
                            </span>
                          </div>
                          <i
                            className="fa-solid fa-chevron-down text-muted"
                            style={{
                              fontSize: "10px",
                              transition: "transform 0.2s",
                              transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                          />
                        </div>

                        {/* Sort Dropdown Menu */}
                        {sortOpen && (
                          <div
                            className="position-absolute end-0 mt-1 bg-white border shadow-lg"
                            style={{
                              zIndex: 1050,
                              minWidth: "160px",
                              borderRadius: "10px",
                              overflow: "hidden",
                              border: "1px solid #e9ecef",
                            }}
                          >
                            {[
                              { label: "Recent First", value: "newest", icon: "fa-clock" },
                              { label: "Oldest First", value: "oldest", icon: "fa-history" },
                              { label: "A to Z", value: "a-z", icon: "fa-arrow-down-a-z" },
                              { label: "Z to A", value: "z-a", icon: "fa-arrow-down-z-a" },
                            ].map((option) => (
                              <div
                                key={option.value}
                                onClick={() => {
                                  setSortBy(option.value);
                                  setSortOpen(false);
                                  setCurrentPage(1);
                                }}
                                className={`px-3 py-2 cursor-pointer small d-flex align-items-center gap-2 ${
                                  sortBy === option.value
                                    ? "bg-light text-primary fw-bold"
                                    : "text-dark"
                                }`}
                                style={{
                                  cursor: "pointer",
                                  transition: "background 0.15s",
                                  fontSize: "12px",
                                }}
                              >
                                <i className={`fa-solid ${option.icon} text-muted`} style={{ fontSize: "11px" }} />
                                {option.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Jobs */}
                  <div className="tab-content">
                    {loading ? (
                      <p>{t("header.loading_jobs")}</p>
                    ) : jobs.length === 0 ? (
                      <div className="empty-job-wrapper">
                        <div className="empty-job-content">
                          <div className="empty-job-icon">
                            <i className="fa-solid fa-briefcase"></i>
                          </div>

                          <h4>{getEmptyMessage()}</h4>
                          <p>{t("header.Start_by_creating")}</p>
                        </div>
                      </div>
                    ) : (
                      jobs
                        .filter((job) =>
                          job.jobTitle
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                        )
                        .map((job) => (
                          <div key={job._id} className="job-short-detail-box">
                            {/* Top */}
                            <div className="job-short-heading-crud d-flex align-items-center">
                              <div className="job-short-detail-heading">
                                <h4>{job.jobTitle}</h4>
                              </div>

                              <div className="d-flex align-items-center ms-auto gap-2">
                                {/* Test Badge */}
                                {job.isAssessmentRequired && (
                                  <span
                                    className="badge bg-info"
                                    style={{
                                      "font-size": "10px",
                                      "-webkit-text-transform": "uppercase",
                                      "text-transform": "uppercase",
                                      "border-radius": "30px",
                                      padding: "4px 10px",
                                      "white-space": "nowrap",
                                    }}
                                  >
                                    <i className="fa-solid fa-vial mr-1" />
                                    Test
                                  </span>
                                )}

                                {/* Private Badge */}
                                {job.confidentialJobPost && (
                                  <span
                                    className="badge bg-dark rounded-pill"
                                    style={{
                                      "font-size": "10px",
                                      "-webkit-text-transform": "uppercase",
                                      "text-transform": "uppercase",
                                      "border-radius": "30px",
                                      padding: "4px 10px",
                                      "white-space": "nowrap",
                                    }}
                                  >
                                    <i className="fa-solid fa-user-secret me-1"></i>{" "}
                                    Private
                                  </span>
                                )}

                                {/* Menu */}
                                <span
                                  className="job-short-detail-crud-info"
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    setMenuOpen((prev) =>
                                      prev === job._id ? null : job._id,
                                    )
                                  }
                                >
                                  <i className="fa-solid fa-ellipsis-vertical menu-icon"></i>
                                </span>
                              </div>

                              {/* Dropdown */}
                              {menuOpen === job._id && (
                                <div className="job-short-detail-crud-menu shadow-lg show">
                                  <ul>
                                    <li onClick={() => jobUpdate(job)}>
                                      <i className="fa-solid fa-pencil text-primary"></i>{" "}
                                      {t("header.Edit")}
                                    </li>

                                    <li onClick={() => handleView(job._id)}>
                                      <i className="fa-regular fa-eye text-info"></i>{" "}
                                      {t("header.Preview")}
                                    </li>

                                    <li
                                      onClick={() =>
                                        copyDraft(
                                          job._id,
                                          job.jobTitle,
                                          job.jobCategory,
                                        )
                                      }
                                    >
                                      <i
                                        className="fa-solid fa-clone text-success"
                                        title="Copy as draft"
                                      ></i>{" "}
                                      {t("header.Copy_as_draft")}
                                    </li>

                                    <li onClick={() => archiveData(job._id)}>
                                      <i className="fa-solid fa-box-archive text-warning"></i>{" "}
                                      {t("header.Archive")}
                                    </li>

                                    <li onClick={() => handleDelete(job._id)}>
                                      <i className="fa-regular fa-trash-can text-danger"></i>{" "}
                                      {t("header.Delete")}
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Admin feedback only while unpublished; hide after publish/dismiss */}
                            {shouldShowModerationFeedback(job, dismissedModeration) && (
                              <div
                                className="alert alert-warning d-flex align-items-start gap-2 mt-2 mb-2 p-2"
                                style={{
                                  borderRadius: "8px",
                                  fontSize: "13px",
                                  backgroundColor: "#fff8e1",
                                  border: "1px solid #ffe082",
                                  color: "#856404",
                                }}
                              >
                                <i
                                  className="fa-solid fa-triangle-exclamation mt-1"
                                  style={{ color: "#d97706" }}
                                />
                                <div className="flex-grow-1">
                                  <strong style={{ fontWeight: 600 }}>
                                    {t("header.Admin_Feedback")}:{" "}
                                  </strong>
                                  <span>{job.moderationComment}</span>
                                </div>
                                <button
                                  type="button"
                                  className="btn-close"
                                  aria-label={t("header.Close") || "Close"}
                                  onClick={() => dismissModerationFeedback(job)}
                                  style={{ fontSize: "10px" }}
                                />
                              </div>
                            )}

                            {/* Bottom Tags */}
                            <div className="job-short-detail-tags">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-location-dot"></i>
                                  {job.city?.join(", ") ||
                                    job.companyId?.city ||
                                    "Not provided"}
                                </li>

                                <li>
                                  <i className="fa-solid fa-calendar-days"></i>
                                  {new Date(job.createdAt).toLocaleDateString()}
                                </li>

                                <li>
                                  <i className="fa-solid fa-file-invoice"></i>
                                  {Array.isArray(job.employmentType) && job.employmentType.length > 0
                                    ? job.employmentType
                                        .map((x) => x?.name || x)
                                        .join(", ")
                                    : job.employmentType?.name ||
                                      (typeof job.employmentType === "string"
                                        ? job.employmentType
                                        : "Not provided")}
                                </li>

                                <li>
                                  <i className="fa-solid fa-user-plus"></i>
                                  {job?.remote?.name || "Not provided"}
                                </li>

                                {/* Recruiter Name */}
                                {(job.recruiterId?.name || job.recruiterId?.first_name) && (
                                  <li>
                                    <i className="fa-solid fa-user-tie"></i>
                                    {job.recruiterId?.name ||
                                      `${job.recruiterId?.first_name || ""} ${job.recruiterId?.last_name || ""}`.trim()}
                                  </li>
                                )}

                                {/* Status */}
                                <li>
                                  <span
                                    className={`badge ${
                                      job.status === "published"
                                        ? "bg-success"
                                        : job.status === "draft"
                                          ? "bg-warning"
                                          : job.status === "unpublished"
                                            ? "bg-secondary"
                                            : job.status === "archived"
                                              ? "bg-secondary"
                                              : "bg-secondary"
                                    }`}
                                    style={{
                                      fontSize: "11px",
                                      textTransform: "uppercase",
                                      borderRadius: "30px",
                                      padding: "5px 12px",
                                    }}
                                  >
                                    {job.status}
                                  </span>
                                </li>

                                {/* Views */}
                                {job.totalUniqueViews > 0 && (
                                  <li>
                                    <i className="fa-solid fa-eye"></i>
                                    {job.totalUniqueViews} Views
                                  </li>
                                )}

                                {/* Applicants */}
                                {job.total_applicants > 0 && (
                                  <li>
                                    <i className="fa-solid fa-users"></i>
                                    {job.total_applicants} Applicants
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Pagination */}
                {jobs.length > 0 && totalPages > 1 && (
                  <div className="paginations mb-30">
                    <ul>
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              handlePageChange(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "disabled" : ""}
                        >
                          <i className="fa-solid fa-angle-left"></i>
                        </a>
                      </li>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i + 1}>
                          <a
                            href="#"
                            className={currentPage === i + 1 ? "active" : ""}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(i + 1);
                            }}
                          >
                            {i + 1}
                          </a>
                        </li>
                      ))}

                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              handlePageChange(currentPage + 1);
                          }}
                          className={
                            currentPage === totalPages ? "disabled" : ""
                          }
                        >
                          <i className="fa-solid fa-angle-right"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Your Job Posts Info */}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name">
                      {t("header.Connect_Work")}{" "}
                    </span>
                    {t("header.All_Rights_Reserved")}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    {t("header.Designed_By")}{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      {t("header.Webnmobapps_Solution_Pvt_Ltd")}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for View Particular data */}
      <Modal open={viewOpen} onClose={handleViewClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            overflowY: "scroll",
            overflowX: "hidden",
            borderRadius: "16px",
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleViewClose}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 10,
              background: "rgba(255,255,255,0.8)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-xmark fs-5" />
          </button>

          {/* Header */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgb(251,118,26) 0%, rgb(230,96,22) 100%)",
              padding: "60px 40px 40px",
              color: "#fff",
            }}
          >
            <span className="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill">
              JOB PREVIEW
            </span>

            <h1 style={{ fontSize: "32px", fontWeight: "850" }}>
              {viewData?.jobDetails?.jobTitle || "Not Provided"}
            </h1>

            <div className="d-flex flex-wrap gap-3 small fw-bold opacity-75">
              <span>
                <i className="fa-solid fa-location-dot me-1" />
                {viewData?.jobDetails?.city?.length > 0
                  ? viewData?.jobDetails?.city?.join(", ")
                  : "Not Provided"}
              </span>

              <span>
                <i className="fa-solid fa-briefcase me-1" />

                {viewData?.jobDetails?.employmentType?.length > 0
                  ? viewData?.jobDetails?.employmentType
                      ?.map((item) => item?.name)
                      ?.join(", ")
                  : "Not Provided"}
              </span>

              <span>
                <i className="fa-solid fa-layer-group me-1" />
                {viewData?.jobDetails?.jobCategory?.length > 0
                  ? viewData.jobDetails.jobCategory
                      .map((item) => item.name)
                      .join(", ")
                  : "Not Provided"}
              </span>
            </div>
          </div>

          <div className="p-4 p-md-5">
            {/* Assessment */}
            {viewData?.jobDetails?.isAssessmentRequired && (
              <div className="modern-alert mb-5">
                <div
                  className="alert-icon"
                  style={{ background: "rgb(94,114,228)" }}
                >
                  <i className="fa-solid fa-file-shield" />
                </div>

                <div className="alert-content">
                  <h4>Skills Assessment Required</h4>

                  <p>
                    <p>
                      This position requires a quick skills assessment to
                      validate profile competency. Passing this will
                      significantly increase visibility to the recruiter.
                    </p>
                  </p>

                  <div
                    className="alert-stats"
                    style={{ color: "rgb(94, 114, 228)" }}
                  >
                    <span>
                      <i className="fa-solid fa-clock" />{" "}
                      {viewData?.jobDetails?.assessment?.totalDuration || 0}{" "}
                      Minutes
                    </span>

                    <span>
                      <i className="fa-solid fa-list-check" />{" "}
                      {viewData?.jobDetails?.assessment?.totalQuestions || 0}{" "}
                      Questions
                    </span>

                    <span>
                      <i className="fa-solid fa-percentage" /> Pass:{" "}
                      {viewData?.jobDetails?.assessment?.passingPercentage || 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* About Role */}
            <div className="modern-content-block first ">
              <h2
                className="mb-4 d-flex align-items-center gap-2"
                style={{
                  "font-size": "20px",
                  "font-weight": "700",
                  color: "rgb(15, 23, 42)",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "24px",
                    background: "rgb(251, 118, 26)",
                    "border-radius": "2px",
                  }}
                />
                About the role
              </h2>
              <div className="rich-text-content">
                <p>
                  {viewData?.jobDetails?.shortDescription || "Not Provided"}
                </p>
              </div>
            </div>

            {/* Job Description */}
            <div className="modern-content-block ">
              <h2
                className="mb-4 d-flex align-items-center gap-2"
                style={{
                  "font-size": "20px",
                  "font-weight": "700",
                  color: "rgb(15, 23, 42)",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "24px",
                    background: "rgb(251, 118, 26)",
                    "border-radius": "2px",
                  }}
                />
                Job Description
              </h2>

              <SafeHtml
                className="rich-text-content"
                html={viewData?.jobDetails?.jobDescription}
                decode
                fallback={<p>Not Provided</p>}
              />
            </div>

            {/* Recruitment Process */}
            {viewData?.jobDetails?.recruitmentProcess?.length > 0 && (
              <div className="modern-content-block mb-5">
                <h2
                  className="mb-4 d-flex align-items-center gap-2"
                  style={{
                    "font-size": "20px",
                    "font-weight": "700",
                    color: "rgb(15, 23, 42)",
                  }}
                >
                  <div
                    style={{
                      width: "4px",
                      height: "24px",
                      background: "rgb(251, 118, 26)",
                      "border-radius": "2px",
                    }}
                  />
                  Processus de recrutement
                </h2>

                <div className="recruitment-steps-modern mt-4">
                  {viewData?.jobDetails?.recruitmentProcess?.map(
                    (item, index) => (
                      <div
                        key={item._id}
                        className="recruitment-step-item d-flex gap-4 mb-4"
                        style={{
                          opacity: 1,
                          transform: "translateY(0)",
                          visibility: "visible",
                        }}
                      >
                        <div
                          className="step-number-circle"
                          style={{
                            width: "36px",
                            height: "36px",
                          }}
                        >
                          {item.step}
                        </div>

                        <div className="step-description-text p-3">
                          <p className="mb-0 small fw-bold text-dark">
                            {item.title.trim()}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {viewData?.jobDetails?.tags?.length > 0 && (
              <div className="modern-content-block last">
                <h2
                  className="mb-4 d-flex align-items-center gap-2"
                  style={{
                    "font-size": "20px",
                    "font-weight": "700",
                    color: "rgb(15, 23, 42)",
                  }}
                >
                  <div
                    style={{
                      width: "4px",
                      height: "24px",
                      background: "rgb(251, 118, 26)",
                      "border-radius": "2px",
                    }}
                  />
                  Related Tags
                </h2>

                <div className="job-tags-list d-flex flex-wrap gap-2">
                  {viewData.jobDetails.tags.map((tag, index) => (
                    <span key={index} className="job-tag text-decoration-none">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default YourJobPosts;
