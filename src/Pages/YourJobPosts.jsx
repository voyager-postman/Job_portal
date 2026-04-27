import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Typography, Card, Divider, Box } from "@mui/material";
import { API_IMAGE_URL } from "../Url/Url";
import Swal from "sweetalert2";
import { green } from "@mui/material/colors";
import { useTranslation } from "react-i18next";
function YourJobPosts() {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();
  // const [isPost, setIsPost] = useState("");
  const [cateroryList, setCategoryList] = useState([]);
  // add with your other useState hooks
  const [searchTerm, setSearchTerm] = useState("");
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

  useEffect(() => {
    if (location.state?.openModal) {
      const modalElement = document.getElementById("exampleModal");
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }
  }, [location.state]);

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
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log("Job Created:", response.data);
      const createdJob = response.data.job;

      toast.success(t("header.Job_created_successfully"));

      setJobTitle("");
      setJobCategory("");

      const modalElement = document.getElementById("exampleModal");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();

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
          const modalElement = document.getElementById("exampleModal");
          const modal = window.bootstrap.Modal.getInstance(modalElement);
          modal.hide();

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

  useEffect(() => {
    fetchCountryList();
  }, []);

  // Fetch jobs based on status
  // Controller
  const getRecruiterJobList = async (req, res) => {
    try {
      const recruiterId = req.user.id;

      const {
        status = "all",
        page = 1,
        limit = 10,
        search = "",
        sort = "newest",
      } = req.query;

      // Filter Object
      let filter = { recruiterId };

      if (status !== "all") {
        filter.status = status;
      }

      // Search by Job Title
      if (search) {
        filter.jobTitle = { $regex: search, $options: "i" };
      }

      // Sorting
      let sortOption = {};

      switch (sort) {
        case "a-z":
          sortOption = { jobTitle: 1 };
          break;

        case "z-a":
          sortOption = { jobTitle: -1 };
          break;

        case "oldest":
          sortOption = { createdAt: 1 };
          break;

        case "newest":
        default:
          sortOption = { createdAt: -1 };
          break;
      }

      // Pagination
      const skip = (page - 1) * limit;

      const jobs = await Job.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));

      const totalJobs = await Job.countDocuments(filter);

      res.status(200).json({
        success: true,
        jobs,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalJobs / limit),
          totalJobs,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };
  // const fetchJobs = async (status, page = currentPage, limit = perPage) => {
  //   try {
  //     setLoading(true);
  //     const token = localStorage.getItem("token");
  //     const res = await axios.get(
  //       `${API_BASE_URL}getRecruiterJobList?status=${status}&page=${page}&limit=${limit}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       },
  //     );
  //     setJobs(res.data.jobs || []);
  //     setTotalPages(res?.data?.pagination?.totalPages || 1);
  //     setTotalResults(res?.data?.pagination?.totalJobs || 0);
  //     console.log(res.data.jobs || []);
  //   } catch (err) {
  //     console.error("Error fetching jobs:", err);
  //     setJobs([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchJobs = async (
    status,
    page = currentPage,
    limit = perPage,
    search = searchTerm,
    sort = sortBy,
  ) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_BASE_URL}getRecruiterJobList?status=${status}&page=${page}&limit=${limit}&search=${search}&sort=${sort}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

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
    fetchJobs(activeStatus, currentPage, perPage, searchTerm, sortBy);
  }, [activeStatus, currentPage, searchTerm, sortBy]);
  const startResult = totalResults === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endResult = Math.min(currentPage * perPage, totalResults);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchCategoryList();
    setCurrentPage(1);
    fetchJobs(activeStatus);
  }, [activeStatus]);

  useEffect(() => {
    fetchJobs(activeStatus, currentPage, perPage);
  }, [currentPage]);

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
      if (!token) {
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
        {
          headers: { Authorization: `Bearer ${token}` },
        },
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
      if (!token) {
        toast.error("You need to log in first.");
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}jobs/${id}/archived`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
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
          if (!token) {
            toast.error(t("header.You_need_to_log_in_first"));
            return;
          }
          const response = await axios.post(
            `${API_BASE_URL}deleteJob/${id}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
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
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}get/jobDashboardStats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}getJobById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
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
      <ToastContainer />
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
                  {/* Search + Sort */}
                  <div className="row mb-4 align-items-center">
                    <div className="col-lg-8 col-md-7">
                      <div
                        className="search-bar-container"
                        style={{ position: "relative" }}
                      >
                        <i
                          className="fa-solid fa-magnifying-glass"
                          style={{
                            position: "absolute",
                            left: "15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#8898aa",
                          }}
                        />

                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("header.Search_by_job_title")}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            borderRadius: "12px",
                            paddingLeft: "45px",
                            border: "1px solid #e9ecef",
                            height: "48px",
                            fontSize: "15px",
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-5 mt-3 mt-md-0">
                      <div className="d-flex align-items-center justify-content-md-end gap-3">
                        <span
                          className="text-muted small font-weight-bold"
                          style={{
                            whiteSpace: "nowrap",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {t("header.Sort_By")}
                        </span>

                        <div className="custom-dropdown-container position-relative">
                          {/* Trigger */}
                          <div
                            className="custom-dropdown-trigger"
                            onClick={() => setSortOpen(!sortOpen)}
                            style={{
                              cursor: "pointer",
                              border: "1px solid #e9ecef",
                              borderRadius: "10px",
                              padding: "10px 14px",
                              minWidth: "190px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              background: "#fff",
                            }}
                          >
                            <span>
                              {sortBy === "newest"
                                ? "Recent (Newest)"
                                : sortBy === "oldest"
                                  ? "Oldest First"
                                  : sortBy === "az"
                                    ? "A to Z"
                                    : "Z to A"}
                            </span>

                            <i
                              className={`fa-solid fa-chevron-down ms-2 ${
                                sortOpen ? "rotate-180" : ""
                              }`}
                              style={{
                                transition: "transform 0.3s",
                                transform: sortOpen
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              }}
                            />
                          </div>

                          {/* Menu */}
                          {sortOpen && (
                            <div
                              className="custom-dropdown-menu show"
                              style={{
                                position: "absolute",
                                top: "105%",
                                right: 0,
                                width: "190px",
                                background: "#fff",
                                border: "1px solid #e9ecef",
                                borderRadius: "10px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                                zIndex: 999,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                className={`custom-dropdown-item ${
                                  sortBy === "newest" ? "active" : ""
                                }`}
                                onClick={() => {
                                  setSortBy("newest");
                                  setSortOpen(false);
                                }}
                              >
                                <i className="fa-solid fa-clock me-2" /> Recent
                                First
                              </div>

                              <div
                                className={`custom-dropdown-item ${
                                  sortBy === "oldest" ? "active" : ""
                                }`}
                                onClick={() => {
                                  setSortBy("oldest");
                                  setSortOpen(false);
                                }}
                              >
                                <i className="fa-solid fa-history me-2" />{" "}
                                Oldest First
                              </div>

                              <div
                                className={`custom-dropdown-item ${
                                  sortBy === "a-z" ? "active" : ""
                                }`}
                                onClick={() => {
                                  setSortBy("a-z");
                                  setSortOpen(false);
                                }}
                              >
                                <i className="fa-solid fa-sort-alpha-down me-2" />{" "}
                                A to Z
                              </div>

                              <div
                                className={`custom-dropdown-item ${
                                  sortBy === "z-a" ? "active" : ""
                                }`}
                                onClick={() => {
                                  setSortBy("z-a");
                                  setSortOpen(false);
                                }}
                              >
                                <i className="fa-solid fa-sort-alpha-up me-2" />{" "}
                                Z to A
                              </div>
                            </div>
                          )}
                        </div>
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
                                  {job.employmentType?.length > 0
                                    ? job.employmentType
                                        .map((x) => x.name)
                                        .join(", ")
                                    : "Not provided"}
                                </li>

                                <li>
                                  <i className="fa-solid fa-user-plus"></i>
                                  {job.remote || "Not provided"}
                                </li>

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
            p: 3,
            overflowY: "scroll",
            overflowX: "hidden",
            border: "2px solid none",
          }}
        >
          <Card variant="outlined" sx={{ p: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography>
              <strong>{t("header.jobTitle")}:</strong>{" "}
              {viewData?.jobDetails?.jobTitle || "Not Provided"}
            </Typography>
            <Typography>
              <strong>{t("header.Job_Category")}:</strong>{" "}
              {viewData?.jobDetails?.jobCategory?.length > 0
                ? viewData.jobDetails.jobCategory
                    .map((item) => item.name)
                    .join(", ")
                : "Not Provided"}
            </Typography>
            <Typography>
              <strong>{t("header.Employment_Type")}:</strong>{" "}
              {viewData?.jobDetails?.employmentType?.length > 0
                ? viewData.jobDetails.employmentType
                    .map((item) => item.name)
                    .join(", ")
                : "Not Provided"}
            </Typography>

            <Typography>
              <strong>{t("header.Minimum_Level")}:</strong>{" "}
              {viewData?.jobDetails?.minimumLevel?.name || "Not Provided"}
            </Typography>

            <Typography>
              <strong>{t("header.Remote_Type")}:</strong>{" "}
              {viewData?.jobDetails?.remote || "Not Provided"}
            </Typography>
            <Typography>
              <strong>{t("header.Reference_Id")}:</strong>{" "}
              {viewData?.jobDetails?.referenceId || "Not Provided"}
            </Typography>
            <Typography>
              <strong> {t("header.City")}:</strong>
              {viewData?.jobDetails?.city?.join(",") == null
                ? viewData?.jobDetails?.companyId?.city?.join(",")
                : viewData.jobDetails.city?.join(", ") || "Not Provided"}
            </Typography>
            <Typography>
              <p>
                <strong>{t("header.Country")}:</strong>{" "}
                {countryList.find(
                  (country) => country._id === viewData?.jobDetails?.country,
                )?.name || "Not provided"}
              </p>
            </Typography>
            <Typography>
              <strong>{t("header.Enable_External_Apply")}:</strong>{" "}
              {viewData?.jobDetails?.enableExternalApply ? "Yes" : "No"}
            </Typography>
            {viewData?.jobDetails?.enableExternalApply && (
              <Typography>
                <strong>{t("header.External_Apply_Link")}:</strong>{" "}
                {viewData?.jobDetails?.ExternalApplyLink || "Not Provided"}
              </Typography>
            )}
            <Typography>
              <strong>{t("header.Job_Assessment_Required")}:</strong>{" "}
              {viewData?.jobDetails?.isAssessmentRequired ? "Yes" : "No"}
            </Typography>
            {/* {viewData?.jobDetails} */}
            <Typography>
              <strong>{t("header.Confidential_JobPost")}:</strong>{" "}
              {viewData?.jobDetails?.confidentialJobPost ? "Yes" : "No"}
            </Typography>
            <Typography>
              <strong>{t("header.Enable_Email_Notification")}:</strong>{" "}
              {viewData?.jobDetails?.enableEmailNotification ? "Yes" : "No"}
            </Typography>
            <Typography>
              <strong>{t("header.Enable_Relevant_Job")}:</strong>{" "}
              {viewData?.jobDetails?.enableRemovalRelevantJobs ? "Yes" : "No"}
            </Typography>
            <Typography>
              <strong>{t("header.Min_Salary")}:</strong>{" "}
              {viewData?.jobDetails?.privatJobDetails?.minSalary}
            </Typography>
            <Typography>
              <strong>{t("header.Max_Salary")}:</strong>{" "}
              {viewData?.jobDetails?.privatJobDetails?.maxSalary}
            </Typography>
            <Typography>
              <strong>{t("header.Tags")}:</strong>
            </Typography>
            <ul>
              {viewData?.jobDetails?.tags?.map((item, index) => (
                <li key={index}>
                  <Typography>{item}</Typography>
                </li>
              ))}
            </ul>
            <Typography>
              <strong>{t("header.Publish_Job_Date")}:</strong>{" "}
              {viewData?.jobDetails?.published_date
                ? new Date(
                    viewData.jobDetails.published_date,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "-"}
            </Typography>
            <Typography>
              <strong>{t("header.Expire_Job_Date")}:</strong>{" "}
              {viewData?.jobDetails?.expiresAt
                ? new Date(viewData.jobDetails?.expiresAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )
                : "-"}
            </Typography>
            <Typography>
              <strong>{t("header.Short_Description")}:</strong>{" "}
              {viewData?.jobDetails?.shortDescription || "null"}
            </Typography>
            <Typography>
              <strong>{t("header.Job_Description")}:</strong>{" "}
              <p
                dangerouslySetInnerHTML={{
                  __html: viewData?.jobDetails?.jobDescription,
                }}
              />
            </Typography>
            <Typography>
              <strong>Status {t("header.jobTitle")}:</strong>{" "}
              <span
                className="text-capitalize"
                style={{
                  color:
                    viewData?.jobDetails?.status === "published"
                      ? "#2a8855"
                      : viewData?.jobDetails?.status === "expired"
                        ? "#dc3545"
                        : "#6c757d",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "700",
                  // textTransform: "capitalize",
                }}
              >
                {viewData?.jobDetails?.status || "-"}
              </span>
            </Typography>
          </Card>

          {/* Close Button */}
          <Box textAlign="right" mt={3}>
            <button className="default-btn btn" onClick={handleViewClose}>
              {t("header.Close")}
            </button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default YourJobPosts;
