import { Link } from "react-router-dom";
import React from "react";
import ReactPaginate from "react-paginate";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import {
  Navigation,
  Pagination as SwiperPagination,
  Autoplay,
} from "swiper/modules";
import "./CandidateDashboardModern.css";
import Pagination from "@mui/material/Pagination"; // MUI one
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CandidateDashboard() {
  const { t, i18n } = useTranslation("global");
  const [count, setCount] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const userRole = localStorage.getItem("user_role");
  const [searchQuotes, setSearchQuotes] = useState([]);
  const [chatStats, setChatStats] = useState({
    totalChats: 0,
    totalUnread: 0,
    responseRate: "0%",
  });
  const [jobList, setJobList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [globalCurrency, setGlobalCurrency] = useState({
    code: "MAD",
    symbol: "DH",
  });
  const [pageSize, setPageSize] = useState(15);
  const [totalJobData, setTotalJobData] = useState({});
  const [resumeList, setResumeList] = useState([]);
  const [coverLetterList, setCoverLetterList] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [profileVisible, setProfileVisible] = useState(true); // ✅ default true
  const [selectedResumeUrl, setSelectedResumeUrl] = useState(null);
  const [selectedCoverLetterUrl, setSelectedCoverLetterUrl] = useState(null);
  const [selectedCustomFile, setSelectedCustomFile] = useState(null);
  const fileInputRef = useRef(null);
  const [visibilityMessage, setVisibilityMessage] = useState("");
  const [jobId, setJobId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [unreadChat, setUnreadChat] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fetchGlobalCurrency = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getGlobalCurrency`);

      if (res.data.success) {
        const currencyCode = res.data.data?.code || "MAD";
        const currencySymbol = res.data.data?.symbol || "DH";

        setGlobalCurrency({
          code: currencyCode,
          symbol: currencySymbol,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchGlobalCurrency();
  }, []);
  // ================= FETCH SEARCH QUOTES =================
  const fetchSearchQuotes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getSearchQuotes`);

      if (response.data?.success) {
        // only active quotes
        const activeQuotes = response.data.data.filter((item) => item.isActive);

        setSearchQuotes(activeQuotes || []);
      }
    } catch (error) {
      console.error("Error fetching search quotes:", error);
    }
  };

  useEffect(() => {
    fetchSearchQuotes();
  }, []);
  const getAllJobList = async (limit, page) => {
    try {
      const res = await axios.get(`${API_BASE_URL}RecentAddedJobList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit,
          page,
        },
      });
      console.log(res);
      setJobList(res.data?.jobs || []);
      setTotalJobData(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  const handleCopy = async (e, url) => {
    e.preventDefault();

    if (!url) {
      toast.error("Link not available yet");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Copy failed");
    }
  };

  const getUnreadChatList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getJobseekerUnreadChatList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      setUnreadChat(res.data?.chats || []);

      setChatStats({
        totalChats: res.data?.totalChats || 0,
        totalUnread: res.data?.totalUnread || 0,
        responseRate: res.data?.responseRate || "0%",
      });
    } catch (error) {
      console.error("Error Fetching Unread Chat:", error);
    }
  };

  useEffect(() => {
    fetchCompaniesSlider();
    getUnreadChatList();
  }, []);

  useEffect(() => {
    const fetchDashboardAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}getDashboardAnalytics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        // console.log("Dashboard Count Data:", response.data.counts);
        setCount(response.data.counts);
      } catch (err) {
        console.error("Error Fetching Dashboard Count:", err);
      }
    };
    fetchDashboardAnalytics();
  }, []);

  useEffect(() => {
    const fetchStrength = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}profile/strength`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Dashboard Profile Strength", response.data);
        setProfileData(response.data);
      } catch (err) {
        console.error("Error Fetching Profile Strength:", err);
      }
    };
    fetchStrength();
  }, []);

  const fetchCompaniesSlider = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getCompanyDetailsListSlider`);
      if (res.data.success) {
        setCompanies(res.data);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  const handleViewCompany = (company) => {
    navigate(`/${company.slug}`, {
      state: { companyId: company._id },
    });
  };

  const handleToggleVisibility = async (e) => {
    const newValue = e.target.checked;
    setProfileVisible(newValue); // update UI instantly

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}updateProfileVisibility`,
        { profileVisible: newValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        toast.success(
          `Profile visibility updated to ${newValue ? "Visible" : "Hidden"}`,
          { autoClose: 2000, theme: "colored" },
        );
        setVisibilityMessage(response.data.message); // ✅ set backend msg
        fetchResume();
      }
    } catch (error) {
      console.error("Error updating profile visibility:", error);
      toast.error("Failed to update profile visibility", {
        autoClose: 2000,
        theme: "colored",
      });
      setProfileVisible(!newValue); // rollback if API fails
    }
  };

  const fetchResume = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}candidate/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Resume Data:-", res.data.profile);
      const profile = res.data.profile;
      setProfileVisible(profile?.profileVisible);

      setResumeList(profile.resumeUrls || []);
      setCoverLetterList(profile.coverLetter || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleSelect = (type, id = null) => {
    if (type === "resume") {
      setSelectedResumeUrl(id);
      setSelectedCustomFile(null);
      if (fileInputRef?.current) fileInputRef.current.value = "";
    } else if (type === "cover") {
      setSelectedCoverLetterUrl(id);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCustomFile(file);
      setSelectedResumeUrl(null);
    }
  };

  const getFileName = (url) => {
    return url?.split("/").pop();
  };

  useEffect(() => {
    getAllJobList(pageSize, pageNumber);
  }, [pageNumber, pageSize]);

  const handleJobClick = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}jobs/${jobId}/click`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
    } catch (error) {
      console.log(console.error);
    }
  };

  const isSelectionMade = () => {
    return !!(selectedResumeUrl || selectedCustomFile);
  };

  const resetApplyModal = () => {
    setSelectedResumeUrl(null);
    setSelectedCoverLetterUrl(null);
    setSelectedCustomFile(null);
    setIsApplying(false);

    if (fileInputRef?.current) fileInputRef.current.value = "";
  };
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const handleApplyJob = async () => {
    if (!jobId) {
      console.error("❌ jobId is missing");
      return;
    }

    if (!selectedResumeUrl && !selectedCustomFile) {
      toast.error(t("header.Please_select_resume_file"), {
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    setIsApplying(true);

    const formData = new FormData();

    if (selectedResumeUrl) {
      formData.append("cv", selectedResumeUrl);
    }

    if (selectedCoverLetterUrl) {
      formData.append("coverLetter", selectedCoverLetterUrl);
    }

    if (selectedCustomFile) {
      if (selectedCustomFile.size > MAX_FILE_SIZE) {
        toast.error(t("header.file_too_large"), {
          autoClose: 2000,
          theme: "colored",
        });
        setIsApplying(false);
        return;
      }
      formData.append("customResume", selectedCustomFile);
    }

    formData.append("jobId", jobId);

    try {
      const res = await axios.post(`${API_BASE_URL}applyJob`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message || "Applied successfully!");
      getAllJobList(pageSize, pageNumber);
      setIsPanelOpen(false);
      const modal = document.getElementById("exampleModal");
      if (modal) {
        const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
        bootstrapModal?.hide();
      }
    } catch (error) {
      console.error("Apply job error:", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message, {
          autoClose: 2000,
          theme: "colored",
        });
      } else if (
        error?.response?.status === 413 ||
        error?.message?.includes("413")
      ) {
        toast.error("Uploaded file is too large. Max size is 2MB.", {
          autoClose: 2000,
          theme: "colored",
        });
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsApplying(false); // 🔥 Stop loader
    }
  };
  const isJobEmpty = !jobList || jobList.length === 0;

  // const handleApplyJob = async () => {
  //   if (!jobId) {
  //     console.error("❌ jobId is missing");
  //     return;
  //   }

  //   setIsApplying(true); // 🔥 Start loader

  //   const formData = new FormData();

  //   if (selectedType === "resume") {
  //     formData.append("cv", selectedId);
  //   }

  //   if (selectedType === "cover") {
  //     formData.append("coverLetter", selectedId);
  //   }

  //   if (selectedType === "custom") {
  //     formData.append("customResume", fileInputRef.current.files[0]);
  //   }

  //   formData.append("jobId", jobId);

  //   try {
  //     const res = await axios.post(`${API_BASE_URL}applyJob`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     getAllJobList(pageSize, pageNumber);
  //     toast.success(res.data.message || "Applied successfully!");

  //     const modal = document.getElementById("exampleModal");
  //     if (modal) {
  //       const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
  //       bootstrapModal?.hide();
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Something went wrong!");
  //   } finally {
  //     setIsApplying(false); // 🔥 Stop loader
  //   }
  // };
  // ⚡ Example total count (replace with value from API if available)
  // const totalJobs = 7700;
  // const totalPages = Math.ceil(totalJobs / pageSize);

  const totalPages = totalJobData?.totalPages;
  const jobChunks = [];
  for (let i = 0; i < jobList.length; i += 10) {
    jobChunks.push(jobList.slice(i, i + 10));
  }
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

      if (res.data.success) {
        const { message } = res.data;

        // ✅ 1. Update Job List instantly
        setJobList((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, isSaved: !job.isSaved } : job,
          ),
        );

        // ✅ 2. ALSO update selectedJob (IMPORTANT FIX)
        setSelectedJob((prev) =>
          prev && prev._id === jobId
            ? { ...prev, isSaved: !prev.isSaved }
            : prev,
        );

        // ✅ Toast
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
      console.error(err);
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Dashboard</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home</Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* candidate mannage Job application section start here */}
          <div className="dashboard-stats-grid">
            <Link
              className="metric-card-modern"
              to="/manage-job-application?tab=applications"
            >
              <div className="metric-icon-box">
                <i className="fa-solid fa-file" />
              </div>
              <div className="metric-content-box">
                <h4>Applications</h4>
                <h5>{count.totalApplications || 0}</h5>
              </div>
            </Link>

            <Link
              className="metric-card-modern"
              to="/manage-job-application?tab=saved-jobs"
            >
              <div className="metric-icon-box">
                <i className="fa-solid fa-heart" />
              </div>
              <div className="metric-content-box">
                <h4>Favorites</h4>
                <h5>{count.totalSavedJobs || 0}</h5>
              </div>
            </Link>

            <Link
              className="metric-card-modern"
              to="/manage-job-application?tab=job-alerts"
            >
              <div className="metric-icon-box">
                <i className="fa-solid fa-bell" />
              </div>
              <div className="metric-content-box">
                <h4>Job Alerts</h4>
                <h5>{count.totalJobAlerts || 0}</h5>
              </div>
            </Link>

            <Link className="metric-card-modern" to="/chat-messaging-system">
              <div className="metric-icon-box">
                <i className="fa-solid fa-comment-dots" />
              </div>
              <div className="metric-content-box">
                <h4>Messages</h4>
                <h5>{count.recruiterMessages || 0}</h5>
              </div>
            </Link>

            <div className="metric-card-modern">
              <div className="metric-icon-box">
                <i className="fa-solid fa-clipboard-question" />
              </div>
              <div className="metric-content-box">
                <h4>Interviews</h4>
                <h5>{count.upcomingInterviews || 0}</h5>
              </div>
            </div>

            <Link className="metric-card-modern" to="/activity-timeline">
              <div className="metric-icon-box">
                <i className="fa-solid fa-clock-rotate-left" />
              </div>
              <div className="metric-content-box">
                <h4>Historical</h4>
                <h5>{count.userLogs || 0}</h5>
              </div>
            </Link>

            <Link
              className="metric-card-modern"
              to="/manage-job-application?tab=profile-views"
            >
              <div className="metric-icon-box">
                <i className="fa-solid fa-eye" />
              </div>
              <div className="metric-content-box">
                <h4>Profile Views</h4>
                <h5>{count.profileViews || 0}</h5>
              </div>
            </Link>
          </div>
          {/* candidate mannage Job application end here*/}
          {/* candidate Complete profile section start here */}
          <div className="profile-strength-card-modern">
            <div className="strength-info-left">
              <h4>Complete your profile to get better opportunities</h4>

              <div className="modern-progress-wrapper">
                <div className="modern-progress-bar">
                  <div
                    className="modern-progress-fill"
                    style={{
                      "--target-width": `${profileData?.strength ?? 0}%`,
                    }}
                  >
                    <div className="modern-progress-cursor" />
                  </div>
                </div>

                <div className="modern-progress-labels">
                  <span>Initial</span>
                  <span>Qualified</span>
                  <span>Optimized</span>
                </div>
              </div>
            </div>

            <div className="strength-info-right">
              <h4>Profile strength: {profileData?.strength ?? 0}%</h4>

              <Link className="btn-complete-profile" to="/candidate-profile">
                Complete my Profile
                <i className="fa-solid fa-arrow-right ms-2" />
              </Link>
            </div>
          </div>

          {/* candidate Complete profile section end here */}
          {/* dashboard recent job posts  section start here */}
          <div className="dashboard-main-grid">
            <div className="main-content-area">
              <div className="dashboard-section-title">
                <h2>
                  <font dir="auto" style={{ "vertical-align": "inherit" }}>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      Current job openings
                    </font>
                  </font>
                </h2>
                <h4>
                  <font dir="auto" style={{ "vertical-align": "inherit" }}>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      Job offers that Match the profile
                    </font>
                  </font>
                </h4>
              </div>
              <div className="dashboard-recent-job-post-info">
                {!isJobEmpty ? (
                  <>
                    {jobChunks.map((chunk, chunkIndex) => (
                      <React.Fragment key={chunkIndex}>
                        {/* Render jobs */}
                        {chunk.map((job) => (
                          <div
                            key={job._id}
                            className="job-link-wrapper"
                            onClick={() => {
                              setSelectedJob(job);
                              setIsPanelOpen(true);
                            }}
                          >
                            <div className="modern-job-card clickable">
                              {/* Header */}
                              <div className="modern-job-header">
                                <div className="modern-company-info">
                                  <div className="modern-logo-container">
                                    <img
                                      crossOrigin="anonymous"
                                      alt="logo"
                                      className="modern-company-logo"
                                      src={
                                        job?.logo
                                          ? `${API_IMAGE_URL}${job.logo}`
                                          : "assets/images/dashboard/images1.png"
                                      }
                                    />
                                  </div>

                                  <div className="modern-company-details">
                                    <p className="modern-company-name">
                                      {job?.brandName}
                                    </p>

                                    <span className="modern-post-date">
                                      <i className="fa-regular fa-calendar" />
                                      {moment(job?.createdAt).fromNow()}
                                    </span>
                                  </div>
                                </div>

                                <div className="modern-job-actions">
                                  {/* Featured */}
                                  {job?.isFeatured && (
                                    <span className="modern-status-badge featured me-2">
                                      <i className="fa-solid fa-star me-1"></i>
                                      {t("header.Featured")}
                                    </span>
                                  )}

                                  {/* Assessment */}
                                  {job?.isAssessmentRequired && (
                                    <span className="modern-status-badge assessment me-2">
                                      {job?.assessmentResult?.status ===
                                        "passed"
                                        ? "Test Passed"
                                        : job?.assessmentResult?.status ===
                                          "failed"
                                          ? "Test Failed"
                                          : t("header.Test_Required")}
                                    </span>
                                  )}

                                  {/* Save */}
                                  <button
                                    className="modern-action-icon"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();

                                      if (userRole !== "JobSeeker") {
                                        navigate("/login");
                                        return;
                                      }

                                      handleSaveJob(job._id);
                                    }}
                                  >
                                    <i
                                      className={`fa-${job.isSaved ? "solid" : "regular"
                                        } fa-heart`}
                                      style={{
                                        color: job?.isSaved
                                          ? "#ff0000"
                                          : "#65758a",
                                      }}
                                    />
                                  </button>

                                  {/* Linkedin */}
                                  <button
                                    className="modern-action-icon"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();

                                      window.open(
                                        job?.social_links?.linkedin ||
                                        "https://linkedin.com",
                                        "_blank",
                                      );
                                    }}
                                  >
                                    <i className="fa-brands fa-linkedin-in" />
                                  </button>
                                </div>
                              </div>

                              {/* Body */}
                              <div className="modern-job-body">
                                <h5 className="modern-job-title">
                                  {job?.jobTitle}
                                </h5>

                                <p className="modern-job-description">
                                  {job?.shortDescription || "N/A"}
                                </p>

                                {/* Meta */}
                                <div className="modern-job-meta">
                                  <span className="modern-meta-tag">
                                    <i className="fa-regular fa-file me-1"></i>
                                    {job?.jobCategory?.length > 0
                                      ? job.jobCategory
                                        .map((item) => item.name)
                                        .join(", ")
                                      : "N/A"}
                                  </span>

                                  <span className="modern-meta-tag">
                                    <i className="fa-solid fa-signal me-1"></i>
                                    {job?.experienceLevel || "All Levels"}
                                  </span>

                                  <span className="modern-meta-tag">
                                    <i className="fa-regular fa-user me-1"></i>
                                    {Array.isArray(job?.employmentType) &&
                                      job.employmentType.length > 0
                                      ? job.employmentType.join(", ")
                                      : "N/A"}
                                  </span>

                                  <span className="modern-meta-tag">
                                    <i className="fa-solid fa-location-dot me-1"></i>
                                    {job?.city?.length > 0
                                      ? job.city.join(", ")
                                      : job?.company_city || "N/A"}
                                  </span>

                                  <span className="modern-meta-tag">
                                    <i
                                      className="fa-solid fa-house-laptop"
                                      style={{ marginRight: "4px" }}
                                    />
                                    {job?.remote?.name || "N/A"}
                                  </span>
                                </div>
                              </div>

                              {/* Footer */}
                              <div className="modern-job-footer">
                                <div className="modern-job-info-badges">
                                  <div className="modern-info-badge">
                                    <i className="fa-solid fa-users" />
                                    {job?.availablePosts || 0} Post(s) available
                                  </div>

                                  <div className="modern-info-badge">
                                    <i className="fa-solid fa-wallet" />

                                    {job?.privatJobDetails?.salaryNegotiable ===
                                      true ? (
                                      "Salary Negotiable"
                                    ) : job?.privatJobDetails?.minSalary ||
                                      job?.privatJobDetails?.maxSalary ? (
                                      <>
                                        {job?.privatJobDetails?.minSalary || 0}{" "}
                                        -{" "}
                                        {job?.privatJobDetails?.maxSalary || 0}{" "}
                                        {globalCurrency.code}
                                      </>
                                    ) : (
                                      "Salary Negotiable"
                                    )}
                                  </div>
                                </div>

                                <div className="modern-apply-btn-wrapper">
                                  {job?.isApplied ? (
                                    <button
                                      className="modern-apply-btn"
                                      disabled
                                    >
                                      {job?.applicationStatus}
                                    </button>
                                  ) : job?.isAssessmentRequired ? (
                                    <Link
                                      to={`/job/${job.slug}`}
                                      state={{
                                        from: "/candidate-dashboard",
                                        JobId: job._id,
                                      }}
                                      className="modern-apply-btn"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      View Details
                                      <i className="fa-solid fa-arrow-right ms-2" />
                                    </Link>
                                  ) : (
                                    <button
                                      className="modern-apply-btn"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        if (userRole !== "JobSeeker") {
                                          navigate("/login");
                                          return;
                                        }

                                        setJobId(job._id);
                                        handleJobClick(job._id);

                                        const modalEl =
                                          document.getElementById(
                                            "exampleModal",
                                          );

                                        if (modalEl) {
                                          const modal =
                                            new window.bootstrap.Modal(modalEl);
                                          modal.show();
                                        }
                                      }}
                                    >
                                      {t("header.apply_now")}
                                      <i className="fa-solid fa-arrow-right ms-2" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div
                          className="modal fade"
                          id="exampleModal"
                          tabIndex={-1}
                          aria-labelledby="exampleModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1
                                  className="modal-title fs-5"
                                  id="exampleModalLabel"
                                >
                                  {t("header.apply_now")}
                                </h1>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                  onClick={resetApplyModal}
                                />
                              </div>
                              {/* NOTE: use className, not class */}
                              <div className="modal-body">
                                <div className="job-apply-defult-resume-custom-resume">
                                  <div
                                    className="job-apply-custom-resume-info-area"
                                    style={{
                                      display:
                                        Array.isArray(resumeList) &&
                                          resumeList.length > 0
                                          ? "block"
                                          : "none",
                                    }}
                                  >
                                    {Array.isArray(resumeList) &&
                                      resumeList.map((resume) => {
                                        const fileName = getFileName(
                                          resume.url,
                                        );
                                        return (
                                          <div
                                            key={resume._id}
                                            className={
                                              "job-apply-custom-resume-info " +
                                              (selectedResumeUrl === resume.url
                                                ? "active"
                                                : "")
                                            }
                                            onClick={() =>
                                              handleSelect("resume", resume.url)
                                            }
                                            style={{ cursor: "pointer" }}
                                          >
                                            <span className="file-name-text">
                                              <i className="fa-solid fa-file" />{" "}
                                              {fileName}
                                            </span>
                                            {selectedResumeUrl ===
                                              resume.url && (
                                                <i className="fa-solid fa-circle-check selected-check-icon" />
                                              )}
                                          </div>
                                        );
                                      })}
                                  </div>

                                  <div
                                    className="defult-resume-custom-resume-divder-line"
                                    style={{
                                      display:
                                        Array.isArray(resumeList) &&
                                          resumeList.length > 0
                                          ? "block"
                                          : "none",
                                    }}
                                  >
                                    <h4>or</h4>
                                  </div>

                                  <div
                                    className="job-apply-custom-resume-info-area"
                                    style={{
                                      display:
                                        Array.isArray(coverLetterList) &&
                                          coverLetterList.length > 0
                                          ? "block"
                                          : "none",
                                    }}
                                  >
                                    {Array.isArray(coverLetterList) &&
                                      coverLetterList.map((cover) => {
                                        const fileName = getFileName(cover.url);
                                        return (
                                          <div
                                            key={cover._id}
                                            className={
                                              "job-apply-custom-resume-info " +
                                              (selectedCoverLetterUrl ===
                                                cover.url
                                                ? "active"
                                                : "")
                                            }
                                            onClick={() =>
                                              handleSelect("cover", cover.url)
                                            }
                                            style={{ cursor: "pointer" }}
                                          >
                                            <span className="file-name-text">
                                              <i className="fa-solid fa-file" />{" "}
                                              {fileName}
                                            </span>
                                            {selectedCoverLetterUrl ===
                                              cover.url && (
                                                <i className="fa-solid fa-circle-check selected-check-icon" />
                                              )}
                                          </div>
                                        );
                                      })}
                                  </div>

                                  <div
                                    className="defult-resume-custom-resume-divder-line"
                                    style={{
                                      display:
                                        Array.isArray(coverLetterList) &&
                                          coverLetterList.length > 0
                                          ? "block"
                                          : "none",
                                    }}
                                  >
                                    <h4>{t("header.or")}</h4>
                                  </div>

                                  <div
                                    className="job-apply-custom-resume-info-area"
                                    style={{ display: "block" }}
                                  >
                                    <div
                                      style={{
                                        display: selectedCustomFile
                                          ? "block"
                                          : "none",
                                      }}
                                    >
                                      <div
                                        className={
                                          "job-apply-custom-resume-info " +
                                          (selectedCustomFile ? "active" : "")
                                        }
                                        style={{
                                          cursor: selectedCustomFile
                                            ? "pointer"
                                            : "default",
                                        }}
                                      >
                                        <span className="file-name-text">
                                          <i className="fa-solid fa-file" />{" "}
                                          {selectedCustomFile
                                            ? selectedCustomFile.name
                                            : ""}
                                        </span>
                                        {selectedCustomFile && (
                                          <i className="fa-solid fa-circle-check selected-check-icon" />
                                        )}
                                      </div>
                                    </div>

                                    <div
                                      className="job-apply-custom-resume-cover-letter-btn"
                                      style={{ marginTop: 12 }}
                                    >
                                      <a
                                        href="#"
                                        className="default-btn btn"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          if (
                                            fileInputRef &&
                                            fileInputRef.current
                                          )
                                            fileInputRef.current.click();
                                        }}
                                      >
                                        {t(
                                          "header.Custom_resume_with_cover_letter",
                                        )}
                                      </a>
                                      <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                        style={{ display: "none" }}
                                      />
                                    </div>
                                  </div>

                                  {/* Divider before apply button (always keep in DOM) */}
                                  <div
                                    className="defult-resume-custom-resume-divder"
                                    style={{ marginTop: 16 }}
                                  />

                                  {/* APPLY BUTTON - always present */}
                                  <div
                                    className="job-apply-defult-resume-btn"
                                    style={{ marginTop: 12 }}
                                  >
                                    <button
                                      className="default-btn btn w-100"
                                      onClick={handleApplyJob}
                                      disabled={
                                        isApplying || !isSelectionMade()
                                      }
                                    >
                                      {isApplying ? (
                                        <>
                                          <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                          ></span>
                                          {t("header.applying")}
                                        </>
                                      ) : (
                                        t("header.apply_now")
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>{" "}
                              {/* .modal-body */}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-2">
                    <img
                      crossOrigin="anonymous"
                      src="/jobPortal/assets/images/recent_job.png"
                      alt="No jobs found"
                      className="mb-4"
                      style={{ maxWidth: "100%", opacity: 0.8 }}
                    />

                    <h4>No jobs found</h4>

                    <p className="text-muted mb-4">
                      Try adjusting your search or filters to find more
                      opportunities.
                    </p>

                    <button
                      className="default-btn btn"
                      // className="btn btn-primary px-4"
                      onClick={() => navigate("/job-search")}
                    >
                      🔍 Search Jobs
                    </button>
                  </div>
                )}
              </div>

              {!isJobEmpty && (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ mt: 3 }}
                >
                  <Pagination
                    count={totalPages}
                    page={pageNumber}
                    onChange={(e, value) => setPageNumber(value)}
                    variant="outlined"
                    shape="rounded"
                    color="secondary"
                    siblingCount={2}
                    boundaryCount={1}
                  />

                  <Select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(e.target.value);
                      setPageNumber(1); // reset to page 1
                    }}
                    size="small"
                  >
                    <MenuItem value={15}>15 / page</MenuItem>
                    <MenuItem value={25}>25 / page</MenuItem>
                    <MenuItem value={50}>50 / page</MenuItem>
                    <MenuItem value={100}>100 / page</MenuItem>
                  </Select>
                </Stack>
              )}
            </div>
            <div className="dashboard-sidebar-modern">
              <div className="sidebar-card-modern">
                <h4 className="sidebar-card-title">
                  <i className="fa-solid fa-eye" />
                  Profile Visibility
                </h4>

                <div className="visibility-toggle-area">
                  <span className="visibility-status">
                    {profileVisible ? "Visible" : "Mask"}
                  </span>

                  <label className="modern-switch">
                    <input
                      type="checkbox"
                      checked={profileVisible}
                      onChange={handleToggleVisibility}
                    />
                    <span className="modern-slider" />
                  </label>
                </div>

                <p className="visibility-desc">
                  {profileVisible
                    ? "Your profile is visible to employers and recruiters!"
                    : "Make your profile visible to receive more job offers!"}
                </p>
              </div>
              <div className="sidebar-card-modern">
                <h4 className="sidebar-card-title">
                  <i className="fa-solid fa-bolt" />
                  Search tips
                </h4>

                <ul className="sidebar-perks-list">
                  {searchQuotes?.length > 0 ? (
                    searchQuotes.map((item, index) => (
                      <li key={item._id || index}>
                        <i className="fa-solid fa-circle-check" />
                        {item.quote}
                      </li>
                    ))
                  ) : (
                    <li>No search tips found</li>
                  )}
                </ul>
              </div>
              <div className="sidebar-card-modern">
                <h4 className="sidebar-card-title">
                  <i className="fa-solid fa-comment-dots" />
                  Messages from recruiters
                </h4>

                {/* Stats */}
                <div className="modern-msg-stats">
                  <div className="msg-stat-item">
                    <span className="msg-stat-value">
                      {chatStats?.totalChats}
                    </span>
                    <span className="msg-stat-label">Total</span>
                  </div>

                  <div className="msg-stat-item unread">
                    <span className="msg-stat-value">
                      {chatStats?.totalUnread}
                    </span>
                    <span className="msg-stat-label">Unread</span>
                  </div>

                  <div className="msg-stat-item rate">
                    <span className="msg-stat-value">
                      {chatStats?.responseRate}
                    </span>
                    <span className="msg-stat-label">Response</span>
                  </div>
                </div>

                {/* Message List */}
                <ul className="modern-messages-list">
                  {unreadChat && unreadChat.length > 0 ? (
                    unreadChat.map((chat, index) => (
                      <li
                        key={chat.groupId}
                        className={`modern-message-item ${chat?.unreadCount > 0 ? "today" : ""
                          }`}
                      >
                        <Link
                          className="message-link-wrapper"
                          to="/chat-messaging-system"
                          state={{
                            groupId: chat.groupId,
                            companyId:
                              chat?.otherUser?.companyId ||
                              chat?.otherUser?._id,
                          }}
                        >
                          <div className="message-icon">
                            {chat?.otherUser?.logo ? (
                              <img
                                crossOrigin="anonymous"
                                src={
                                  chat?.otherUser?.logo?.startsWith("http")
                                    ? chat.otherUser.logo
                                    : `${API_IMAGE_URL}${chat.otherUser.logo}`
                                }
                                alt={chat?.otherUser?.brandName}
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <i className="fa-solid fa-building" />
                            )}
                          </div>

                          <div className="message-content">
                            <div className="message-header">
                              <span className="message-sender">
                                {chat?.otherUser?.brandName?.trim() ||
                                  "Company"}
                              </span>

                              <span className="message-time">
                                {moment(chat?.lastMessageAt).fromNow()}
                              </span>
                            </div>

                            <p
                              className="message-text"
                              style={{
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {chat?.jobTitle ? (
                                <>
                                  New message regarding{" "}
                                  <span className="message-job-title">
                                    {chat?.jobTitle}
                                  </span>
                                </>
                              ) : (
                                chat?.lastMessage || "No messages"
                              )}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="modern-message-item empty">
                      <div className="message-content text-center w-100">
                        <h5>No messages yet</h5>
                        <p>Recruiters haven’t contacted you.</p>
                      </div>
                    </li>
                  )}
                </ul>

                {/* View All */}
                <Link
                  className="modern-view-all-link"
                  to="/chat-messaging-system"
                >
                  View all messages
                  <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
          {/* dashboard recent job posts  section end here */}
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
      {isPanelOpen && selectedJob && (
        <div className="side-panel-overlay open">
          <div className="side-panel-content">
            <div className="side-panel-header">
              <div className="header-company-info">
                <img
                  crossOrigin="anonymous"
                  alt="logo"
                  className="side-panel-logo"
                  src={
                    selectedJob?.logo
                      ? `${API_IMAGE_URL}${selectedJob.logo}`
                      : "assets/images/dashboard/images1.png"
                  }
                />
                <div>
                  <h2 className="side-panel-title">
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.jobTitle}
                      </font>
                    </font>
                  </h2>
                  <p className="side-panel-company-name">
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.brandName}
                      </font>
                    </font>
                  </p>
                </div>
              </div>
              <button className="close-btn">
                <svg
                  stroke="currentColor"
                  onClick={() => setIsPanelOpen(false)}
                  fill="currentColor"
                  strokeWidth={0}
                  viewBox="0 0 1024 1024"
                  fillRule="evenodd"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926 224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512 166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" />
                </svg>
              </button>
            </div>
            <div className="side-panel-body">
              <div className="side-panel-meta-grid">
                <div className="meta-item">
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
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.city?.length > 0
                          ? selectedJob.city.join(", ")
                          : selectedJob?.company_city || "N/A"}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item">
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
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {Array.isArray(selectedJob?.jobCategory) &&
                          selectedJob.jobCategory.length > 0
                          ? selectedJob.jobCategory.join(", ")
                          : "N/A"}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item">
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
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.minimumLevel || "NA"}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item">
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
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {Array.isArray(selectedJob?.employmentType) &&
                          selectedJob.employmentType.length > 0
                          ? selectedJob.employmentType.join(", ")
                          : "N/A"}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item">
                  <i className="fa-solid fa-house-laptop" />
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.remote
                          ? typeof selectedJob.remote === "string"
                            ? selectedJob.remote
                            : selectedJob.remote.name
                          : "NA"}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item highlight">
                  <i className="fa-solid fa-wallet" />
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.privatJobDetails?.salaryNegotiable ===
                          true ? (
                          "Salaire à négocier"
                        ) : selectedJob?.privatJobDetails?.minSalary ||
                          selectedJob?.privatJobDetails?.maxSalary ? (
                          <>
                            {selectedJob?.privatJobDetails?.minSalary || 0} -{" "}
                            {selectedJob?.privatJobDetails?.maxSalary || 0}{" "}
                            {globalCurrency.code}
                          </>
                        ) : (
                          "Salaire à négocier"
                        )}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item">
                  <i className="fa-solid fa-users" />
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {" "}
                        {selectedJob?.availablePosts || 0} position(s)
                        disponible(s)
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item">
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
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        Published{" "}
                      </font>
                    </font>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {moment(selectedJob?.createdAt).fromNow()}
                      </font>
                    </font>
                  </span>
                </div>
              </div>
              <div className="side-panel-description">
                <div className="side-panel-tags mb-4">
                  <h4 className="mb-2">
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        Tags
                      </font>
                    </font>
                  </h4>
                  <div className="modern-tag-list">
                    {Array.isArray(selectedJob?.tags) &&
                      selectedJob.tags.length > 0 ? (
                      selectedJob.tags.map((tag, index) => (
                        <span key={index} className="modern-job-tag">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">No tags available</span>
                    )}
                  </div>
                </div>
                <h4>
                  <font dir="auto" style={{ "vertical-align": "inherit" }}>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      Description of the offer
                    </font>
                  </font>
                </h4>
                <div>
                  <p>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.shortDescription || "N/A"}
                      </font>
                    </font>
                  </p>
                </div>
              </div>
            </div>
            <div className="side-panel-footer">
              {selectedJob?.isApplied ? (
                // 🔒 Already Applied
                <button className="modern-apply-btn w-100" disabled>
                  {selectedJob?.applicationStatus || "Applied"}
                </button>
              ) : !selectedJob?.isAssessmentRequired ? (
                // ✅ Normal Apply (NO assessment)
                <button
                  className="modern-apply-btn w-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setIsPanelOpen(false);

                    if (userRole !== "JobSeeker") {
                      navigate("/login");
                      return;
                    }

                    setJobId(selectedJob._id);
                    handleJobClick(selectedJob._id);
                    setIsPanelOpen(true);
                    const modalEl = document.getElementById("exampleModal");
                    if (modalEl) {
                      const modal = new window.bootstrap.Modal(modalEl);
                      modal.show();
                    }
                  }}
                >
                  {t("header.apply_now")}
                </button>
              ) : null}

              <Link
                to={`/job/${selectedJob.slug}`}
                state={{
                  from: "/candidate-dashboard",
                  JobId: selectedJob._id,
                }}
                className="modern-orange-btn"
                onClick={() => setIsPanelOpen(false)}
              >
                <font dir="auto" style={{ "vertical-align": "inherit" }}>
                  <font dir="auto" style={{ "vertical-align": "inherit" }}>
                    View the offer
                  </font>
                </font>
              </Link>
              <ul className="side-panel-social-sharing">
                {/* 🔗 COPY LINK */}
                <li style={{ position: "relative" }}>
                  <a
                    href="#"
                    className="side-panel-social-link"
                    onClick={(e) => handleCopy(e, selectedJob?.linkUrl)}
                    title={
                      selectedJob?.jobLink ? "Copy link" : "Link not available"
                    }
                    style={{
                      cursor: selectedJob?.jobLink ? "pointer" : "not-allowed",
                    }}
                  >
                    <i className="fa-solid fa-link" />
                  </a>

                  {copied && <span className="copy-tooltip">Copied!</span>}
                </li>

                {/* ❤️ SAVE JOB */}
                <li>
                  <a
                    href="#"
                    className="side-panel-social-link"
                    title="Save"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (userRole !== "JobSeeker") {
                        navigate("/login");
                        return;
                      }

                      handleSaveJob(selectedJob._id);
                    }}
                  >
                    <i
                      className={`fa-${selectedJob?.isSaved ? "solid" : "regular"
                        } fa-heart`}
                      style={{
                        color: selectedJob?.isSaved ? "#ff0000" : "#65758a",
                      }}
                    />
                  </a>
                </li>

                {/* LINKEDIN */}
                <li>
                  <a
                    href={
                      selectedJob?.social_links?.linkedin ||
                      "https://www.linkedin.com/"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="side-panel-social-link linkedin"
                  >
                    <i className="fa-brands fa-linkedin-in" />
                  </a>
                </li>

                {/* FACEBOOK */}
                <li>
                  <a
                    href={
                      selectedJob?.social_links?.facebook ||
                      "https://www.facebook.com/"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="side-panel-social-link facebook"
                  >
                    <i className="fa-brands fa-facebook-f" />
                  </a>
                </li>

                {/* TWITTER */}
                <li>
                  <a
                    href={
                      selectedJob?.social_links?.twitter ||
                      "https://twitter.com/"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="side-panel-social-link twitter"
                  >
                    <i className="fa-brands fa-x-twitter" />
                  </a>
                </li>

                {/* INSTAGRAM */}
                <li>
                  <a
                    href={
                      selectedJob?.social_links?.instagram ||
                      "https://www.instagram.com/"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="side-panel-social-link instagram"
                  >
                    <i className="fa-brands fa-instagram" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CandidateDashboard;
