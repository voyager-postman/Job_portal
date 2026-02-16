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

function CandidateDashboard() {
  const [count, setCount] = useState("");
  const [jobList, setJobList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalJobData, setTotalJobData] = useState({});
  const [resumeList, setResumeList] = useState([]);
  const [coverLetterList, setCoverLetterList] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [profileVisible, setProfileVisible] = useState(true); // ✅ default true
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCustomFile, setSelectedCustomFile] = useState(null);
  const [visibilityMessage, setVisibilityMessage] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const fileInputRef = useRef(null);
  const [jobId, setJobId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [unreadChat, setUnreadChat] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  const getUnreadChatList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getJobseekerUnreadChatList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setUnreadChat(res.data?.chats);
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
    navigate("/companies-details", {
      state: { companyId: company }, // 👈 send ID as prop-like data
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

  const handleLinkClick = (e) => {
    e.preventDefault(); // prevent navigation
    fileInputRef.current.click(); // open file dialog
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
    setSelectedType(type);
    setSelectedId(id);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCustomFile(file);
      setSelectedType("custom");
      setSelectedId(null);
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
    return (
      (selectedType === "resume" && selectedId) ||
      (selectedType === "cover" && selectedId) ||
      (selectedType === "custom" && selectedCustomFile)
    );
  };

  const resetApplyModal = () => {
    setSelectedType("");
    setSelectedId(null);
    setSelectedCustomFile(null);
    setIsApplying(false);

    // reset file input
    if (fileInputRef?.current) {
      fileInputRef.current.value = "";
    }
  };
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const handleApplyJob = async () => {
    if (!jobId) {
      console.error("❌ jobId is missing");
      return;
    }
    setIsApplying(true); // 🔥 Start loader

    const formData = new FormData();

    if (selectedType === "resume") {
      formData.append("cv", selectedId);
    }

    if (selectedType === "cover") {
      formData.append("coverLetter", selectedId);
    }

    if (selectedType === "custom") {
      const file = fileInputRef.current?.files?.[0];

      // ✅ FILE REQUIRED
      if (!file) {
        toast.error("Please select a resume file.", {
          autoClose: 2000,
          theme: "colored",
        });
        setIsApplying(false);
        return;
      }

      // ✅ FILE SIZE CHECK (THIS FIXES YOUR ISSUE)
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Uploaded file is too large. Max size is 2MB.", {
          autoClose: 2000,
          theme: "colored",
        });
        setIsApplying(false);
        return; // ⛔ STOP — DO NOT HIT API
      }

      formData.append("customResume", file);
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
        // 🔒 BACKUP SAFETY (in case proxy still throws 413)
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

      console.log("✅ API Response:", res.data);

      if (res.data.success) {
        const { message } = res.data;

        // ✅ Toggle locally without refetch
        // setJobList((prevJobs) =>
        //   prevJobs.map((job) =>
        //     job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        //   )
        // );
        getAllJobList();
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
          <section className="candidate-dashboard-info-area">
            <div className="candidate-dashboard-box-info">
              <div className="candidate-dashboard-box">
                <div className="row">
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <Link to="/manage-job-application?tab=applications">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i className="fa-solid fa-file" />
                        </div>
                        <div className="box-content">
                          <h4>Applications</h4>
                          <h5>{count.totalApplications || 0}</h5>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <Link to="/manage-job-application?tab=saved-jobs">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i className="fa-solid fa-heart" />
                        </div>
                        <div className="box-content">
                          <h4>Saved Jobs</h4>
                          <h5>{count.totalSavedJobs || 0}</h5>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <Link to="/manage-job-application?tab=job-alerts">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i className="fa-solid fa-bell" />
                        </div>
                        <div className="box-content">
                          <h4>Job Alerts</h4>
                          <h5>{count.totalJobAlerts || 0}</h5>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <Link to="/chat-messaging-system">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i class="fa-solid fa-comment-dots"></i>
                        </div>
                        <div className="box-content">
                          <h4>Recruiter Messages </h4>
                          <h5>{count.recruiterMessages || 0}</h5>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <a href="#">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i class="fa-solid fa-clipboard-question"></i>
                        </div>
                        <div className="box-content">
                          <h4>Upcoming interviews </h4>
                          <h5>{count.upcomingInterviews || 0}</h5>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <Link to="/activity-timeline">
                      {" "}
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="box-content">
                          <h4>User Log</h4>
                          <h5>{count.userLogs || 0}</h5>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* candidate mannage Job application end here*/}
          {/* candidate Complete profile section start here */}
          <section className="candidate-complete-info-area">
            <div className="candidate-complete-info-box single-line">
              {/* LEFT SIDE */}
              <div className="left-area">
                <h4>Complete your profile and get better matches</h4>

                <div className="steps-wrapper">
                  {[...Array(profileData?.totalSections || 0)].map(
                    (_, index) => {
                      const isCompleted = index < profileData.completedSections;

                      return (
                        <div key={index} className="step-item">
                          <div
                            className={`step-circle ${
                              isCompleted ? "completed" : "pending"
                            }`}
                          >
                            {isCompleted && <i className="fa-solid fa-check" />}
                          </div>

                          {index !== profileData.totalSections - 1 && (
                            <div
                              className={`step-line ${
                                index < profileData.completedSections - 1
                                  ? "line-completed"
                                  : "line-pending"
                              }`}
                            />
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="right-area">
                <h4>Profile strength: {profileData?.strength ?? 0}%</h4>
                <Link to="/candidate-profile" className="default-btn btn">
                  Complete Profile
                </Link>
              </div>
            </div>
          </section>

          {/* candidate Complete profile section end here */}
          {/* dashboard recent job posts  section start here */}
          <section className="dashboard-heading-job-profile-info">
            <div className="dashboard-heading-info-area">
              <h2>Job Hiring Now</h2>
              <h4>Recently added jobs compatible with your profile</h4>
            </div>
            <div className="dashboard-job-post-profile-area">
              <div className="container">
                <div className="row">
                  <div className="col-lg-8 col-md-6">
                    <div className="dashboard-recent-job-post-info">
                      {!isJobEmpty ? (
                        <>
                          {jobChunks.map((chunk, chunkIndex) => (
                            <React.Fragment key={chunkIndex}>
                              {/* Render jobs */}
                              {chunk.map((job) => (
                                <Link
                                  key={job._id}
                                  to={`/job-details/${job._id}`} // ✅ Pass ID in URL
                                  state={{ from: "/candidate-dashboard" }}
                                  className="job-link"
                                >
                                  <div className="available-job-posts-box">
                                    <div className="available-job-company-name-save-job">
                                      <div className="available-job-company-name">
                                        <a href="job-details.html">
                                          <h4>
                                            <img
                                              crossorigin="anonymous"
                                              src={
                                                job?.companyId?.logo
                                                  ? `${API_IMAGE_URL}${job.companyId.logo}`
                                                  : "/jobPortal/assets/images/dashboard/images1.png"
                                              }
                                              alt="logo"
                                            />
                                            {job?.brandName}
                                          </h4>
                                        </a>
                                      </div>
                                      <div className="d-flex justify-space-between">
                                        <div>
                                          {job?.isAssessmentRequired && (
                                            <>
                                              {/* 🟢 PASSED */}
                                              {job?.assessmentResult?.status ===
                                                "passed" && (
                                                <span className="test-passed-tag-area">
                                                  <i className="fa-solid fa-circle-check"></i>
                                                  Test Passed
                                                </span>
                                              )}

                                              {/* 🔴 FAILED */}
                                              {job?.assessmentResult?.status ===
                                                "failed" && (
                                                <span className="test-failed-tag-area">
                                                  <i className="fa-solid fa-circle-xmark"></i>
                                                  Test Failed
                                                </span>
                                              )}

                                              {/* 🟠 NOT ATTEMPTED */}
                                              {(!job?.assessmentResult ||
                                                job?.assessmentResult
                                                  ?.status ===
                                                  "not_attempted") && (
                                                <span className="test-required-tag-area">
                                                  <i className="fa-solid fa-clipboard-check"></i>
                                                  Test Required
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </div>
                                        <div className="available-job-save-job">
                                          <i
                                            className={`fa-${
                                              job.isSaved ? "solid" : "regular"
                                            } fa-heart`}
                                            style={{
                                              cursor: "pointer",
                                              color: job.isSaved
                                                ? "#fb761a"
                                                : "#fff",
                                            }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              handleSaveJob(job._id);
                                            }}
                                          />
                                          <i
                                            className="fa-brands fa-linkedin-in"
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              const link =
                                                job?.companyId?.links
                                                  ?.linkedin ||
                                                "https://www.linkedin.com/";
                                              window.open(link, "_blank");
                                            }}
                                          />

                                          {/* Facebook */}
                                          <i
                                            className="fa-brands fa-facebook-f"
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              const link =
                                                job?.companyId?.links
                                                  ?.facebook ||
                                                "https://www.facebook.com/";
                                              window.open(link, "_blank");
                                            }}
                                          />

                                          {/* Instagram */}
                                          <i
                                            className="fa-brands fa-instagram"
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              const link =
                                                job?.companyId?.links
                                                  ?.instagram ||
                                                "https://www.instagram.com/";
                                              window.open(link, "_blank");
                                            }}
                                          />

                                          {/* Twitter (X) */}
                                          <i
                                            className="fa-brands fa-x-twitter"
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              const link =
                                                job?.companyId?.links
                                                  ?.twitter ||
                                                "https://twitter.com/";
                                              window.open(link, "_blank");
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <a href="job-details.html">
                                      <div className="available-job-type-details">
                                        <h5>{job?.jobTitle || "N/A"}</h5>
                                        <p>{job?.shortDescription || "N/A"}</p>
                                        <ul>
                                          <li>
                                            <i className="fa-regular fa-calendar" />{" "}
                                            {moment(job?.createdAt).fromNow()}
                                          </li>
                                          <li>
                                            <i className="fa-regular fa-file" />{" "}
                                            {job?.jobCategory?.name || "N/A"}
                                          </li>
                                          <li>
                                            <i className="fa-regular fa-user" />
                                            &nbsp;{job?.employmentType || "N/A"}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-location-dot" />{" "}
                                            {job?.city && job?.city.length > 0
                                              ? job.city
                                              : job?.companyId?.city || "N/A"}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-users" />{" "}
                                            Available:{" "}
                                            {job?.availablePosts || 0}{" "}
                                          </li>
                                        </ul>
                                      </div>
                                    </a>
                                    <div className="available-job-type-apply-btn">
                                      {/* 🔒 Already Applied */}
                                      {job?.isApplied ? (
                                        <button
                                          className="default-btn btn"
                                          disabled
                                          style={{ color: "#ff6600" }}
                                        >
                                          {job?.applicationStatus}
                                        </button>
                                      ) : job?.isAssessmentRequired ? (
                                        /* 🧪 Assessment Required → View Details */
                                        <Link
                                          to={`/job-details/${job._id}`}
                                          className="default-btn btn"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          View Details
                                        </Link>
                                      ) : (
                                        /* ✅ No Assessment → Direct Apply */
                                        <a
                                          href="#"
                                          className="default-btn btn"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setJobId(job._id);
                                            handleJobClick(job._id);
                                          }}
                                          data-bs-toggle="modal"
                                          data-bs-target="#exampleModal"
                                        >
                                          Apply Now
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </Link>
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
                                        Apply now
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
                                        {/* RESUME LIST - inline hide */}
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
                                                    (selectedType ===
                                                      "resume" &&
                                                    selectedId === resume.url
                                                      ? "active"
                                                      : "")
                                                  }
                                                  onClick={() =>
                                                    handleSelect(
                                                      "resume",
                                                      resume.url,
                                                    )
                                                  }
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  <span className="file-name-text">
                                                    <i className="fa-solid fa-file" />{" "}
                                                    {fileName}
                                                  </span>

                                                  {selectedType === "resume" &&
                                                    selectedId ===
                                                      resume.url && (
                                                      <i className="fa-solid fa-circle-check selected-check-icon" />
                                                    )}
                                                </div>
                                              );
                                            })}
                                        </div>

                                        {/* OR DIVIDER for resume - inline hide */}
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

                                        {/* COVER LETTER LIST - inline hide */}
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
                                              const fileName = getFileName(
                                                cover.url,
                                              );
                                              return (
                                                <div
                                                  key={cover._id}
                                                  className={
                                                    "job-apply-custom-resume-info " +
                                                    (selectedType === "cover" &&
                                                    selectedId === cover.url
                                                      ? "active"
                                                      : "")
                                                  }
                                                  onClick={() =>
                                                    handleSelect(
                                                      "cover",
                                                      cover.url,
                                                    )
                                                  }
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  <span className="file-name-text">
                                                    <i className="fa-solid fa-file" />{" "}
                                                    {fileName}
                                                  </span>

                                                  {selectedType === "cover" &&
                                                    selectedId ===
                                                      cover.url && (
                                                      <i className="fa-solid fa-circle-check selected-check-icon" />
                                                    )}
                                                </div>
                                              );
                                            })}
                                        </div>

                                        {/* OR DIVIDER for cover - inline hide */}
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
                                          <h4>or</h4>
                                        </div>

                                        {/* CUSTOM FILE SECTION (show only if user uploaded file or always show upload button) */}
                                        <div
                                          className="job-apply-custom-resume-info-area"
                                          style={{ display: "block" }}
                                        >
                                          {/* Show selected custom file if exists */}
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
                                                (selectedType === "custom"
                                                  ? "active"
                                                  : "")
                                              }
                                              onClick={() =>
                                                selectedCustomFile &&
                                                handleSelect("custom")
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

                                              {selectedType === "custom" && (
                                                <i className="fa-solid fa-circle-check selected-check-icon" />
                                              )}
                                            </div>
                                          </div>

                                          {/* Upload Button — prevent default and open file input */}
                                          <div
                                            className="job-apply-custom-resume-cover-letter-btn"
                                            style={{ marginTop: 12 }}
                                          >
                                            <a
                                              href="#"
                                              className="default-btn btn"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                // ensure fileInputRef.current exists
                                                if (
                                                  fileInputRef &&
                                                  fileInputRef.current
                                                )
                                                  fileInputRef.current.click();
                                              }}
                                            >
                                              Custom resume with cover letter
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
                                                Applying...
                                              </>
                                            ) : (
                                              "Apply Now"
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    </div>{" "}
                                    {/* .modal-body */}
                                  </div>
                                </div>
                              </div>
                              {/* Show Swiper only if this chunk has 10 jobs */}
                              {chunk.length === 10 && (
                                <section className="job-card-companies-inf-area">
                                  <div className="container">
                                    <Swiper
                                      modules={[
                                        Navigation,
                                        SwiperPagination,
                                        Autoplay,
                                      ]}
                                      spaceBetween={20}
                                      slidesPerView={3}
                                      navigation
                                      // pagination={{ clickable: true }}
                                      autoplay={{ delay: 3000 }}
                                      loop={true}
                                      breakpoints={{
                                        320: { slidesPerView: 1 },
                                        768: { slidesPerView: 2 },
                                        1024: { slidesPerView: 3 },
                                      }}
                                    >
                                      {companies?.companies?.length > 0 ? (
                                        companies.companies.map((item) => {
                                          const company = item?.companyId;
                                          const topThreeJobs =
                                            item?.jobList?.slice(0, 3) || [];
                                          return (
                                            <SwiperSlide key={company?._id}>
                                              <div className="job-card-companies-box">
                                                <div className="job-card-companies-img">
                                                  <img
                                                    alt={
                                                      company?.brandName ||
                                                      "Company Cover"
                                                    }
                                                    src={
                                                      company?.coverPhoto
                                                        ? `${API_IMAGE_URL}${company.coverPhoto}`
                                                        : "/jobPortal/assets/images/company/company-img-1.jpg"
                                                    }
                                                    crossOrigin="anonymous"
                                                  />

                                                  <div className="job-card-companies-logo">
                                                    <img
                                                      alt="logo"
                                                      src={
                                                        company?.logo
                                                          ? `${API_IMAGE_URL}${company.logo}`
                                                          : "/jobPortal/assets/images/icon/icon-25.png"
                                                      }
                                                      crossOrigin="anonymous"
                                                    />
                                                  </div>
                                                </div>

                                                <div className="job-card-companies-name">
                                                  <h4
                                                    onClick={() =>
                                                      handleViewCompany(
                                                        company?._id,
                                                      )
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    {company?.brandName ||
                                                      "Unnamed Company"}
                                                  </h4>
                                                </div>

                                                {/* ✅ Latest Jobs */}
                                                <div className="job-card-companies-name">
                                                  <h5>Latest Jobs</h5>

                                                  <ul>
                                                    {topThreeJobs.length > 0 ? (
                                                      topThreeJobs.map(
                                                        (job) => (
                                                          <li key={job._id}>
                                                            <Link
                                                              to={`/job-details/${job._id}`} // ✅ Pass ID in URL
                                                              className="job-link"
                                                              style={{
                                                                color:
                                                                  "#007bff",
                                                                textDecoration:
                                                                  "none",
                                                                fontWeight:
                                                                  "500",
                                                              }}
                                                            >
                                                              {job.jobTitle}
                                                            </Link>{" "}
                                                          </li>
                                                        ),
                                                      )
                                                    ) : (
                                                      <li>No jobs available</li>
                                                    )}
                                                  </ul>
                                                </div>

                                                {/* ✅ View Jobs Button */}
                                                <div className="view-job-count-btn">
                                                  <button
                                                    className="default-btn btn"
                                                    onClick={() =>
                                                      handleViewCompany(
                                                        company?._id,
                                                      )
                                                    }
                                                  >
                                                    View {item?.jobCount || 0}{" "}
                                                    Jobs
                                                  </button>
                                                </div>
                                              </div>
                                            </SwiperSlide>
                                          );
                                        })
                                      ) : (
                                        <p className="text-center mt-4">
                                          No companies available.
                                        </p>
                                      )}
                                    </Swiper>
                                  </div>
                                </section>
                              )}
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
                  <div className="col-lg-4 col-md-6">
                    <div className="dashboard-profile-visibility-other-info">
                      <div className="dashboard-profile-visibility-hide">
                        <div className="dashboard-profile-visibility">
                          <h4>Profile Visibility</h4>
                          <span>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={profileVisible}
                                onChange={handleToggleVisibility}
                              />
                              <span className="slider round" />
                            </label>
                            <span>Visible</span>
                          </span>
                        </div>
                        <div className="dashboard-profile-visibility-content">
                          <p>
                            {profileVisible
                              ? "Your profile is visible to employers and recruiters!"
                              : "Make your profile information visible to employers and recruiters and get more job offers!"}
                          </p>
                        </div>
                      </div>
                      <div className="dashboard-other-detail-info">
                        <ul>
                          <li>
                            <i className="fa-solid fa-calendar-days" /> Browse
                            fresh job listings daily
                          </li>
                          <li>
                            <i className="fa-solid fa-heart" /> Save and
                            organize your top picks
                          </li>
                          <li>
                            <i className="fa-solid fa-bell" /> Get instant email
                            alerts for new opportunities
                          </li>
                          <li>
                            <i className="fa-solid fa-building" /> Follow your
                            dream companies for updates
                          </li>
                          <li>
                            <i className="fa-solid fa-file" /> Apply quickly
                            with your saved resume
                          </li>
                          <li>
                            <i className="fa-solid fa-signal" /> Stay on top of
                            your job search with ease
                          </li>
                        </ul>
                      </div>
                      <div className="recent-notifications-box">
                        <h3>Recruiter Messages</h3>

                        <ul>
                          {unreadChat && unreadChat.length > 0 ? (
                            unreadChat.map((chat, index) => (
                              <li key={index}>
                                <div className="icon">
                                  <i className="flaticon-portfolio" />
                                </div>
                                <span>{chat?.otherUser?.brandName}</span>{" "}
                                Applied For A Job{" "}
                                <strong>{chat.jobTitle}</strong>
                              </li>
                            ))
                          ) : (
                            <li className="no-messages">
                              <div className="text-center">
                                <h5>No messages yet</h5>
                                <p>Recruiters haven’t contacted you.</p>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
    </>
  );
}

export default CandidateDashboard;
