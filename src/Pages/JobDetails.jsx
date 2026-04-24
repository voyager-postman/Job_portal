import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import companyLogo from "../../src/images/images1.png";

function JobDetails() {
  const location = useLocation();
  const userRole = localStorage.getItem("user_role");
  const jobStatus = location.state?.status;
  const [assessmentDetails, setAssessmentDetails] = useState(null);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [assessment, setAssessment] = useState(null);

  const [categoryCount, setCategoryCount] = useState([]);
  console.log("Job Status:", jobStatus);
  const token = localStorage.getItem("token"); // 🔹 assuming JWT is stored here
  const { id } = useParams(); // ✅ Get job ID from URL
  const navigate = useNavigate();
  console.log(id);
  const [selectedId, setSelectedId] = useState(null);
  const fileInputRef = useRef(null);
  const [jobId, setJobId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [resumeList, setResumeList] = useState([]);
  const [coverLetterList, setCoverLetterList] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCustomFile, setSelectedCustomFile] = useState(null);
  const [job, setJob] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [loading, setLoading] = useState(true);
  console.log(id);
  const from = location.state?.from;
  console.log(from);

  const breadcrumbLabel = from?.includes("/manage-job-application")
    ? "Manage Job Application"
    : from?.includes("/job-search")
      ? "Job Search"
      : from?.includes("/applied-jobs-list")
        ? "Application Management"
        : from?.includes("/jobs")
          ? "Jobs"
          : "Candidate Dashboard";

  // {
  //   "/manage-job-application": "Manage Job Application",
  //   "/job-search": "Job Search",
  //   "/jobs": "Jobs",
  //   "/applied-jobs-list": " Application Management",
  //   "/candidate-dashboard": "",
  // };

  // const breadcrumbLabel = breadcrumbLabelMap[from];
  const fetchJobDetails = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE_URL}getJobById/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const responseData = res.data?.data;
      const jobDetails = responseData?.jobDetails;

      console.log(jobDetails?.confidentialJobPost);
      console.log(userRole);

      // ✅ Block JobSeeker for confidential jobs
      if (
        userRole === "JobSeeker" &&
        jobDetails?.confidentialJobPost === true
      ) {
        toast.error(
          "This confidential job is no longer available for candidate access.",
        );

        // ❌ Do not navigate anywhere
        setJob(null);
        setAssessmentDetails(null);
        setLinkUrl("");

        return;
      }

      // ✅ Recruiter / Admin / Others can access
      setJob(responseData);
      setLinkUrl(jobDetails?.jobLink || "");
      setAssessmentDetails(responseData?.assessmentResult || null);
    } catch (error) {
      console.error("Error fetching job details:", error);

      toast.error(
        error?.response?.data?.message || "Unable to load job details.",
      );
    } finally {
      setLoading(false);
    }
  };
  // const fetchJobDetails = async () => {
  //   try {
  //     const res = await axios.get(`${API_BASE_URL}getJobById/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setJob(res.data?.data || res.data); // Adjust according to your API response
  //     console.log(res);
  //     setLinkUrl(res?.data?.data?.jobDetails?.jobLink);
  //     setAssessmentDetails(res?.data?.data?.assessmentResult);
  //   } catch (error) {
  //     console.error("Error fetching job details:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);
  console.log(linkUrl);

  const handleSaveJob = async (jobId) => {
    try {
      // 🧠 Step 1: Check if user is logged in
      if (!token) {
        toast.warning("⚠️ Please login first to save jobs!");
        // optionally redirect to login page:
        // navigate("/login");
        return;
      }
      // 🧠 Step 2: Call API
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

      // 🧠 Step 3: Handle response
      if (res.data.success) {
        const { message } = res.data;

        // Optional: Optimistic UI update
        // setJobList((prevJobs) =>
        //   prevJobs.map((job) =>
        //     job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        //   )
        // );

        fetchJobDetails();

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

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}candidate/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Resume Data:-", res.data.profile);
        const profile = res.data.profile;
        setResumeList(profile.resumeUrls || []);
        setCoverLetterList(profile.coverLetter || []);
      } catch (error) {
        console.log(error);
      }
    };
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
  const handleLinkClick = (e) => {
    e.preventDefault(); // prevent navigation
    fileInputRef.current.click(); // open file dialog
  };
  const handleSaveJob1 = async (jobId) => {
    try {
      // 🧠 Step 1: Check if user is logged in
      if (!token) {
        toast.warning("⚠️ Please login first to save jobs!");
        // optionally redirect to login page:
        // navigate("/login");
        return;
      }

      // 🧠 Step 2: Call API
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

      // 🧠 Step 3: Handle response
      if (res.data.success) {
        const { message } = res.data;

        // Optional: Optimistic UI update
        // setJobList((prevJobs) =>
        //   prevJobs.map((job) =>
        //     job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        //   )
        // );

        fetchJobDetails();

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
  console.log(assessment);
  const [copied, setCopied] = useState(false);
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
  const isSelectionMade = () => {
    return (
      (selectedType === "resume" && selectedId) ||
      (selectedType === "cover" && selectedId) ||
      (selectedType === "custom" && selectedCustomFile)
    );
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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
      if (id) {
        fetchJobDetails();
      }

      const modal = document.getElementById("exampleModal");
      if (modal) {
        const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
        bootstrapModal?.hide();
      }
    } catch (error) {
      console.error("Apply job error:", error);

      // 🔒 BACKUP SAFETY (in case proxy still throws 413)
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
  //     fetchJobDetails();
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
  // const fetchAssessmentDetails = async (assessmentId) => {
  //   try {
  //     setLoadingAssessment(true);

  //     const res = await axios.get(
  //       `${API_BASE_URL}getSkillAssessmentFullDetails/${assessmentId}`,
  //     );

  //     setAssessment(res.data.assessmentDetails);
  //     setCategoryCount(res.data.categoryQuestionCount);
  //   } catch (error) {
  //     console.error("Failed to load assessment", error);
  //   } finally {
  //     setLoadingAssessment(false);
  //   }
  // };
  const fetchAssessmentDetails = async (assessmentId) => {
    if (!assessmentId) {
      console.warn("Assessment ID not found");
      return;
    }

    try {
      setLoadingAssessment(true);

      const res = await axios.get(
        `${API_BASE_URL}getSkillAssessmentFullDetails/${assessmentId}`,
      );

      setAssessment(res.data.assessmentDetails);
      setCategoryCount(res.data.categoryQuestionCount);
    } catch (error) {
      console.error("Failed to load assessment", error);

      toast.error(
        error?.response?.data?.message || "Unable to load assessment",
      );
    } finally {
      setLoadingAssessment(false);
    }
  };

  const handleSaveJob2 = async (jobId) => {
    try {
      // 🧠 Step 1: Check if user is logged in
      if (!token) {
        toast.warning("⚠️ Please login first to save jobs!");
        // optionally redirect to login page:
        // navigate("/login");
        return;
      }

      // 🧠 Step 2: Call API
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
      // 🧠 Step 3: Handle response
      if (res.data.success) {
        const { message } = res.data;

        // Optional: Optimistic UI update
        // setJobList((prevJobs) =>
        //   prevJobs.map((job) =>
        //     job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        //   )
        // );

        if (id) {
          fetchJobDetails();
        }
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

  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // Optionally decode twice if double-encoded
  const decodedHtml = decodeHtml(
    decodeHtml(job?.jobDetails?.jobDescription || ""),
  );

  function decodeHtml1(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // Double decode for escaped HTML
  const decodedHtml1 = decodeHtml1(
    decodeHtml1(job?.jobDetails?.companyId?.aboutCompany || ""),
  );
  console.log(job?.jobDetails);
  // const handleStartTest = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     await axios.post(
  //       `${API_BASE_URL}startAssessment/${assessment?.assessmentId}/${id}`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     // ✅ Start allowed
  //     navigate("/start-test", {
  //       state: {
  //         assessmentId: assessment?.assessmentId,
  //         jobId: id,
  //       },
  //     });
  //   } catch (error) {
  //     const apiResponse = error?.response?.data;

  //     // 🔴 Retake blocked
  //     if (apiResponse?.status === "FAILED_BLOCKED") {
  //       toast.error("You cannot retake this assessment after failing");

  //       // navigate("/skill-assessments-tests");
  //       return;
  //     }

  //     // 🔴 Already submitted
  //     if (apiResponse?.message === "Assessment already submitted") {
  //       toast.warning("You have already submitted this assessment");

  //       navigate("/skill-assessments-tests");
  //       return;
  //     }

  //     // 🔴 Generic error
  //     console.error("Failed to start assessment", error);
  //     toast.error("Unable to start assessment. Please try again later");
  //   }
  // };
  const handleStartTest = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE_URL}startAssessment/${assessment?.assessmentId}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ✅ Assessment required → start test
      navigate("/start-test", {
        state: {
          assessmentId: assessment?.assessmentId,
          jobId: id,
          from: from, // ✅ pass original source
        },
      });
    } catch (error) {
      const apiResponse = error?.response?.data;

      // 🟡 Assessment NOT required
      if (apiResponse?.message === "Assessment is not required for this job") {
        toast.error("No assessment required. You can apply directly.");

        // 👉 Redirect wherever your normal apply flow is

        return;
      }

      // 🔴 Retake blocked
      if (apiResponse?.status === "FAILED_BLOCKED") {
        toast.error("You cannot retake this assessment after failing");
        return;
      }

      // 🟠 Already submitted
      if (apiResponse?.message === "Assessment already submitted") {
        toast.error("You have already submitted this assessment");

        return;
      }

      // 🔴 Fallback
      console.error("Failed to start assessment", error);
      toast.error("Unable to start assessment. Please try again later");
    }
  };
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
  const hasPassedAssessment = assessmentDetails?.status === "passed";

  // const canRetryLater =
  //   assessmentDetails?.validation_required === true &&
  //   assessmentDetails?.status === "failed" &&
  //   assessmentDetails?.retry_period_days > 0;
  // const canRetryLater =
  //   assessmentDetails?.validation_required === true &&
  //   assessmentDetails?.status === "failed" &&
  //   assessmentDetails?.daysLeft > 0;

  // const canRetryNow =
  //   assessmentDetails?.validation_required === true &&
  //   assessmentDetails?.status === "failed" &&
  //   assessmentDetails?.retry_period_days === 0;

  // const cannotRetry =
  //   assessmentDetails?.validation_required === false &&
  //   assessmentDetails?.status === "failed";

  // const isRetryBlocked = canRetryLater || cannotRetry;
  const canRetryLater =
    assessmentDetails?.validation_required === true &&
    assessmentDetails?.status === "failed" &&
    assessmentDetails?.daysLeft > 0;

  const canRetryNow =
    assessmentDetails?.validation_required === true &&
    assessmentDetails?.status === "failed" &&
    assessmentDetails?.daysLeft === 0;

  const cannotRetry =
    assessmentDetails?.validation_required === false &&
    assessmentDetails?.status === "failed";

  const isRetryBlocked = canRetryLater || cannotRetry;

  return (
    <>
      <ToastContainer />
      {from !== "/" && (
        <section className="inner-breadcrumb-main-area ">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-sm-12">
                <div className="breadcrumb-main-list-area mt-4">
                  <h4>Job Details</h4>
                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                      <i className="fa-solid fa-angle-right"></i>
                    </li>
                    {from !== "/jobs" && (
                      <li>
                        <Link to="/candidate-dashboard">Dashboard</Link>
                        <i className="fa-solid fa-angle-right"></i>
                      </li>
                    )}
                    <li>
                      <Link to={from}>{breadcrumbLabel}</Link>
                      <i className="fa-solid fa-angle-right"></i>
                    </li>
                    <li>
                      {loading
                        ? "Loading..."
                        : job?.jobDetails?.jobTitle ||
                          job?.jobTitle ||
                          "Job Details"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="job-details-main-info-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="job-details-top-info-area">
                <div className="job-name-company-name">
                  <div className="job-details-job-name">
                    <h2>{job?.jobTitle}</h2>
                    <p>
                      <strong>Company Name: </strong>
                      <Link
                        to={{
                          pathname: "/companies-details",
                        }}
                        state={{ companyId: job?.jobDetails?.companyId?._id }}
                      >
                        {job?.jobDetails?.companyId?.brandName}
                      </Link>
                    </p>
                    <p>
                      <strong>Posted by: </strong>
                    </p>
                  </div>
                  <div className="job-name-company-logo">
                    <img
                      crossOrigin="anonymous"
                      src={
                        job?.jobDetails?.companyId?.logo
                          ? `${API_IMAGE_URL}${job.jobDetails.companyId.logo}`
                          : companyLogo
                      }
                      alt={
                        job?.jobDetails?.companyId?.brandName || "Company Logo"
                      }
                    />
                  </div>
                </div>
                <div className="job-apply-link-save-btn-info">
                  <div className="job-save-btn">
                    <ul>
                      <li style={{ position: "relative" }}>
                        <a
                          href="#"
                          onClick={(e) => handleCopy(e, linkUrl)}
                          style={{
                            cursor: linkUrl ? "pointer" : "not-allowed",
                          }}
                          title={linkUrl ? "Copy link" : "Link not available"}
                        >
                          <i className="fa-solid fa-link" />
                        </a>

                        {/* Small "Copied!" text that fades in/out */}
                        {copied && (
                          <span
                            style={{
                              position: "absolute",
                              top: "-20px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              backgroundColor: "#333",
                              color: "#fff",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              opacity: 0.9,
                            }}
                          >
                            Copied!
                          </span>
                        )}
                      </li>

                      <li>
                        <i
                          className={`fa-${
                            job?.jobDetails?.isSaved ? "solid" : "regular"
                          } fa-heart`}
                          style={{
                            cursor: "pointer",
                            color: job?.jobDetails?.isSaved
                              ? "#fb761a"
                              : "#fff",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveJob2(job?.jobDetails?._id);
                          }}
                        />
                      </li>
                      <li>
                        <a
                          href={
                            job?.jobDetails?.companyId?.links?.linkedin
                              ? job?.jobDetails?.companyId?.links?.linkedin
                              : "https://www.linkedin.com/login"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                      </li>

                      {/* Facebook */}
                      <li>
                        <a
                          href={
                            job?.jobDetails?.companyId?.links?.facebook
                              ? job?.jobDetails?.companyId?.links?.facebook
                              : "https://www.facebook.com/"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-facebook-f"></i>
                        </a>
                      </li>

                      {/* Twitter / X */}
                      <li>
                        <a
                          href={
                            job?.jobDetails?.companyId?.links?.twitter
                              ? job?.jobDetails?.companyId?.links?.twitter
                              : "https://twitter.com/"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-x-twitter"></i>
                        </a>
                      </li>

                      {/* Instagram */}
                      <li>
                        <a
                          href={
                            job?.jobDetails?.companyId?.links?.instagram
                              ? job?.jobDetails?.companyId?.links?.instagram
                              : "https://www.instagram.com/"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/* <div className="job-apply-btn edit-popup-modal">
                    {job?.jobDetails?.isApplied ? (
                      <div className="default-btn btn">
                        {job?.jobDetails?.applicationStatus}
                      </div>
                    ) : (
                      <a
                        href="#"
                        className="default-btn btn"
                        onClick={(e) => {
                          e.preventDefault();

                          // 🔥 If not logged in, redirect to login page
                          if (userRole !== "JobSeeker") {
                            navigate("/login");
                            return;
                          }

                          // 🔥 If logged in → set jobId
                          setJobId(job?.jobDetails?._id);

                          // 🔥 Open Apply Modal (correct way)
                          const modalEl =
                            document.getElementById("exampleModal");
                          if (modalEl) {
                            const modalInstance = new window.bootstrap.Modal(
                              modalEl,
                            );
                            modalInstance.show();
                          }
                        }}
                      >
                        Apply Now
                      </a>
                    )}{" "}
                    <a
                      className="default-btn btn"
                      data-bs-toggle="modal"
                      data-bs-target="#skillAssessmentModal"
                    >
                      Apply (Test Required)
                    </a>
                  </div> */}
                  <div className="job-apply-btn edit-popup-modal">
                    {/* 🔒 Already Applied */}
                    {job?.jobDetails?.isApplied ? (
                      <div className="default-btn btn">
                        {job?.jobDetails?.applicationStatus}
                      </div>
                    ) : (
                      <>
                        {/* 🧪 Assessment Flow */}
                        {job?.jobDetails?.isAssessmentRequired &&
                        !hasPassedAssessment ? (
                          <>
                            <a
                              href="#"
                              className={`default-btn btn ${isRetryBlocked ? "disabled-btn" : ""}`}
                              onClick={(e) => {
                                e.preventDefault();

                                // ⛔ Retry blocked
                                if (isRetryBlocked) return;

                                if (userRole !== "JobSeeker") {
                                  navigate("/login");
                                  return;
                                }

                                fetchAssessmentDetails(
                                  job?.jobDetails?.assessment,
                                );

                                const modalEl = document.getElementById(
                                  "skillAssessmentModal",
                                );
                                if (modalEl) {
                                  const modal = new window.bootstrap.Modal(
                                    modalEl,
                                  );
                                  modal.show();
                                }
                              }}
                              aria-disabled={isRetryBlocked}
                            >
                              Apply (Test Required)
                            </a>

                            {/* ⏳ Retry message */}
                            {canRetryLater && (
                              <p className="reapply-info-tag">
                                You can retry in {assessmentDetails.daysLeft}{" "}
                                day
                                {assessmentDetails.daysLeft > 1 ? "s" : ""}
                              </p>
                            )}

                            {cannotRetry && (
                              <p className="reapply-info-tag">
                                This assessment cannot be retaken. Please
                                contact the employer for further assistance.
                              </p>
                            )}
                          </>
                        ) : (
                          /* ✅ Apply directly (passed or no assessment) */
                          <a
                            href="#"
                            className="default-btn btn"
                            onClick={(e) => {
                              e.preventDefault();

                              if (userRole !== "JobSeeker") {
                                navigate("/login");
                                return;
                              }

                              setJobId(job?.jobDetails?._id);
                              handleJobClick(job?.jobDetails?._id);
                              const modalEl =
                                document.getElementById("exampleModal");
                              if (modalEl) {
                                const modal = new window.bootstrap.Modal(
                                  modalEl,
                                );
                                modal.show();
                              }
                            }}
                          >
                            Apply Now
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="skill-assessment-test-allModal-area">
                  {/* <!-- Test Required Modal Start Here --> */}
                  <div
                    className="modal fade"
                    id="skillAssessmentModal"
                    tabindex="-1"
                    aria-labelledby="skillAssessmentModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title"
                            id="skillAssessmentModalLabel"
                          >
                            <i className="fa-solid fa-file"></i>Test Required
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="skill-assessment-test-modal-details">
                            <p>
                              To apply for {job?.jobDetails?.jobTitle} you must
                              complete a skills assessment
                            </p>
                            <div className="skill-assessment-javaScript-fundamental">
                              <h6>{assessment?.assessmentName}</h6>
                              {/* <span>Java Questions:10</span> */}
                              {categoryCount?.map((cat) => (
                                <span key={cat.categoryName}>
                                  {cat.categoryName} Questions:{" "}
                                  {cat.numberOfQuestions} Questions
                                </span>
                              ))}

                              <ul>
                                <li>
                                  <i className="fa-solid fa-file"></i>
                                  {assessment?.totalQuestions}
                                  {""} {""}
                                  Questions
                                </li>
                                <li>
                                  <i className="fa-solid fa-calendar"></i>
                                  {assessment?.totalDuration}
                                  {""} {""}
                                  Minutes
                                </li>

                                <li>
                                  <i className="fa-solid fa-percent"></i>Pass
                                  threshold: {assessment?.passingPercentage}%
                                </li>
                              </ul>
                            </div>
                            <div className="skill-assessment-important-area">
                              <h6>Important</h6>
                              <p>
                                once started, the timer cannot be paused. Make
                                sure you have enough time to complete the test.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <a
                            href="#"
                            className="default-btn btn"
                            data-bs-dismiss="modal"
                          >
                            Cancel
                          </a>
                          <button
                            className="default-btn btn"
                            onClick={handleStartTest}
                          >
                            Start Test
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Test Required Modal End Here --> */}

                  {/* <!--Test Question Modal Start Here --> */}
                  <div className="skill-assessment-test-question-list">
                    <div
                      className="modal fade"
                      id="startTestModal"
                      tabindex="-1"
                      aria-labelledby="startTestModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <div className="skill-assessment-test-question-header">
                              <div className="skill-assessment-test-name-timer">
                                <span>JavaScript Fundamentals</span>
                                <span className="test-start-timer-area">
                                  <i className="fa-solid fa-calendar"></i>04:59
                                </span>
                              </div>
                              <div className="skill-assessment-test-tq-close">
                                <span>0/5 Answered</span>
                                <span>
                                  <i className="fa-solid fa-xmark"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="modal-body">
                            <div className="skill-assessment-test-question-area">
                              <div className="skill-assessment-test-num-level">
                                <span>Question 1 of 5</span>
                                <span className="skill-assessment-test-level">
                                  Level B
                                </span>
                              </div>
                              <div className="skill-assessment-test-question-option active">
                                <h6>
                                  What is the output of typeof null in
                                  javaScript?
                                </h6>
                                <label>
                                  <input type="radio" name="q6" checked />
                                  Class
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  Array
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  List
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  Type
                                </label>
                              </div>
                              <div className="skill-assessment-test-question-option">
                                <h6>
                                  Are is the output of typeof null in
                                  javaScript?
                                </h6>
                                <label>
                                  <input type="radio" name="q6" checked />
                                  Array
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  Class
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  List
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  Type
                                </label>
                              </div>
                              <div className="skill-assessment-test-question-option">
                                <h6>
                                  Why is the output of typeof null in
                                  javaScript?
                                </h6>
                                <label>
                                  <input type="radio" name="q6" />
                                  List
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  Class
                                </label>
                                <label>
                                  <input type="radio" name="q6" checked />
                                  Array
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  Type
                                </label>
                              </div>
                              <div className="skill-assessment-test-question-option">
                                <h6>
                                  This is the output of typeof null in
                                  javaScript?
                                </h6>
                                <label>
                                  <input type="radio" name="q6" />
                                  List
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  Class
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  Array
                                </label>
                                <label>
                                  <input type="radio" name="q6" checked />
                                  Type
                                </label>
                              </div>
                              <div className="skill-assessment-test-question-option">
                                <h6>
                                  React.js is the output of typeof null in
                                  javaScript?
                                </h6>
                                <label>
                                  <input type="radio" name="q6" checked />
                                  Class
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  Array
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  List
                                </label>
                                <label>
                                  <input type="radio" name="q6" />
                                  Type
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <span className="default-btn btn" id="prevBtn">
                              Previous
                            </span>
                            <span className="default-btn btn" id="nextBtn">
                              Next
                            </span>
                            <span
                              className="default-btn btn"
                              id="finishBtn"
                              data-bs-toggle="modal"
                              data-bs-target="#finishTestModal"
                            >
                              Finish Test
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!--Test Question Modal End Here --> */}

                  {/* <!-- Finish Test Modal Start here --> */}
                  <div class="skill-assessment-test-finish-area">
                    {/* <!-- Modal --> */}
                    <div
                      class="modal fade"
                      id="finishTestModal"
                      tabindex="-1"
                      aria-labelledby="finishTestModalLabel"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-body">
                            <h5>Finish Test?</h5>
                            <p>You have answered 5 of 5 questions.</p>
                          </div>
                          <div class="modal-footer">
                            <span class="default-btn btn" id="reviewBtn">
                              Review Answers
                            </span>
                            <span
                              class="default-btn btn"
                              id="submitBtn"
                              data-bs-toggle="modal"
                              data-bs-target="#scoreCardModal"
                            >
                              Submit Test
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Finish Test Modal End here --> */}

                  {/* <!--Score Card Modal Start Here --> */}

                  {/* <!--Score Card Modal End Here --> */}
                </div>
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
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
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
                                const fileName = getFileName(resume.url);
                                return (
                                  <div
                                    key={resume._id}
                                    className={
                                      "job-apply-custom-resume-info " +
                                      (selectedType === "resume" &&
                                      selectedId === resume.url
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

                                    {selectedType === "resume" &&
                                      selectedId === resume.url && (
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
                                const fileName = getFileName(cover.url);
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
                                      handleSelect("cover", cover.url)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <span className="file-name-text">
                                      <i className="fa-solid fa-file" />{" "}
                                      {fileName}
                                    </span>

                                    {selectedType === "cover" &&
                                      selectedId === cover.url && (
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
                                display: selectedCustomFile ? "block" : "none",
                              }}
                            >
                              <div
                                className={
                                  "job-apply-custom-resume-info " +
                                  (selectedType === "custom" ? "active" : "")
                                }
                                onClick={() =>
                                  selectedCustomFile && handleSelect("custom")
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
                                  if (fileInputRef && fileInputRef.current)
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
                              disabled={isApplying || !isSelectionMade()}
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
              </div>

              {job?.jobDetails?.isAssessmentRequired && (
                <div
                  className={`skills-assessment-test-required-details ${
                    assessmentDetails?.status === "failed"
                      ? "assessment-failed"
                      : assessmentDetails?.status === "passed"
                        ? "assessment-passed"
                        : ""
                  }`}
                >
                  <div
                    className={`skills-assessment-test-icon-content ${
                      assessmentDetails?.status === "failed"
                        ? "assessment-icon"
                        : "assessment-icon"
                    }`}
                  >
                    <div className="skills-assessment-icon">
                      <i className="fa-solid fa-file"></i>
                    </div>

                    <div className="skills-assessment-test-passed-area">
                      <div className="skills-assessment-content">
                        <h5
                          className={
                            assessmentDetails?.status === "failed"
                              ? "text-danger"
                              : assessmentDetails?.status === "passed"
                                ? "text-success"
                                : "text-muted"
                          }
                        >
                          Skills Assessment Required
                        </h5>
                        <p
                          className={
                            assessmentDetails?.status === "failed"
                              ? "text-danger"
                              : assessmentDetails?.status === "passed"
                                ? "text-success"
                                : "text-muted"
                          }
                        >
                          <i className="fa-solid fa-file"></i> <></>
                          {/* 🟡 NOT ATTEMPTED (assessmentResult is null OR status not present) */}
                          {(!assessmentDetails ||
                            assessmentDetails?.status === "not_attempted") && (
                            <>
                              You need to pass a skills assessment before
                              applying for this position.
                            </>
                          )}
                          {/* 🔴 FAILED */}
                          {assessmentDetails?.status === "failed" && (
                            <>
                              You did not pass the test on your previous
                              attempt.
                              {/* {assessmentDetails?.retry_period_days > 0 && (
                                <>
                                  <br />
                                  <strong>
                                    You can retry in{" "}
                                    {assessmentDetails?.retry_period_days} days.
                                  </strong>
                                </>
                              )}
                              {assessmentDetails?.retry_period_days === 0 && (
                                <>
                                  <br />
                                  <strong>
                                    This assessment cannot be retaken. Please
                                    contact the employer for further assistance.
                                  </strong>
                                </>
                              )} */}
                              {canRetryNow && (
                                <strong>
                                  <br />
                                  You can try the assessment again.
                                </strong>
                              )}
                              {canRetryLater && (
                                <strong>
                                  <br />
                                  You can retry in {
                                    assessmentDetails.daysLeft
                                  }{" "}
                                  day
                                  {assessmentDetails.daysLeft > 1 ? "s" : ""}
                                </strong>
                              )}
                              {cannotRetry && (
                                <strong>
                                  <br />
                                  This assessment cannot be retaken. Please
                                  contact the employer for further assistance.
                                </strong>
                              )}
                            </>
                          )}
                          {/* 🟢 PASSED */}
                          {assessmentDetails?.status === "passed" && (
                            <>
                              You have already passed this test! You can apply
                              directly.
                            </>
                          )}
                        </p>
                      </div>

                      {/* ✅ Show score ONLY when PASSED */}
                      {assessmentDetails?.status === "passed" && (
                        <div className="test-passed-percentage">
                          <p style={{ color: "#28a745" }}>
                            <i
                              className="fa-solid fa-file"
                              style={{ color: "#28a745" }}
                            ></i>{" "}
                            Total Passed (
                            {assessmentDetails?.scorePercentage ?? 0}%)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* <!-- skill Assessment Test All Modal Start Area--> */}
              <div className="job-details-tag-info-area">
                <div className="job-details-tag-main-area">
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-location-dot" />
                      Place
                    </h4>

                    <p className="active_link">
                      {Array.isArray(job?.jobDetails?.city) &&
                      job.jobDetails.city.length > 0
                        ? job.jobDetails.city.join(", ")
                        : job?.jobDetails?.companyId?.city || "N/A"}
                    </p>
                  </div>
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-calendar-days" />
                      Publication date
                    </h4>
                    <p> {moment(job?.jobDetails?.createdAt).fromNow()}</p>
                  </div>
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-signal" />
                      Experience level
                    </h4>
                    <Link to="/jobs">
                      <p className="active_link">
                        {job?.jobDetails?.minimumLevel?.name || "N/A"}
                      </p>
                    </Link>
                  </div>
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-user" />
                      Type of contract
                    </h4>
                    <p className="active_link">
                      {job?.jobDetails?.employmentType?.length > 0
                        ? job.jobDetails.employmentType
                            .map((item) => item.name)
                            .join(", ")
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="job-details-spaceline" />
                <div className="job-details-tag-main-area">
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-gear" /> Job category
                    </h4>
                    <Link to="/jobs">
                      <p className="active_link">
                        {job?.jobDetails?.jobCategory?.length > 0
                          ? job.jobDetails.jobCategory
                              .map((item) => item.name)
                              .join(", ")
                          : "N/A"}
                      </p>
                    </Link>
                  </div>
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-briefcase" />
                      Openings
                    </h4>
                    <p>{job?.jobDetails?.availablePosts || "N/A"}</p>
                  </div>

                  {(userRole === "Recruiter" || userRole === "Company") && (
                    <div className="job-details-tag-box">
                      <h4>
                        <i className="fa-solid fa-file" />
                        Applicants
                      </h4>
                      <p>0</p>
                    </div>
                  )}
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-money-bill" />
                      Salary
                    </h4>

                    <p>
                      ${job?.jobDetails?.privatJobDetails?.minSalary} - $
                      {job?.jobDetails?.privatJobDetails?.maxSalary}
                    </p>

                    {job?.jobDetails?.TJM?.amount && (
                      <p className="mt-2">
                        <strong>TJM -</strong>
                        {job.jobDetails.TJM.amount}{" "}
                        {job.jobDetails.TJM.currency}/j
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="job-details-role-company-discription">
                <h5>About the role</h5>
                <p>{job?.jobDetails?.shortDescription}</p>

                <h5>Company Description</h5>
                <div dangerouslySetInnerHTML={{ __html: decodedHtml1 }} />
              </div>
              <div className="job-details-job-description">
                <h5>Job Description</h5>
                <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />
              </div>

              <div className="job-details-related-tags">
                <h5>Related Tags</h5>
                {job?.jobDetails?.tags && job?.jobDetails?.tags.length > 0 ? (
                  <ul>
                    {job?.jobDetails?.tags.map((tag, index) => (
                      <li key={index}>{tag}</li> // ✅ dynamically render tag
                    ))}
                  </ul>
                ) : (
                  <p>No related tags found.</p> // ✅ fallback message
                )}
              </div>

              <div className="summary-offer-info-area">
                <div className="summary-offer-post-details">
                  <div className="summary-offer-job-post">
                    <h4>
                      <img
                        crossorigin="anonymous"
                        src={
                          job?.jobDetails?.companyId?.logo
                            ? `${API_IMAGE_URL}${job?.jobDetails?.companyId?.logo}`
                            : companyLogo
                        }
                        alt="logo"
                      />
                      {job?.jobDetails?.companyId?.brandName ||
                        "Unknown Company"}
                    </h4>
                  </div>
                  <div className="summary-offer-save-job">
                    <i
                      className={`fa-${
                        job?.jobDetails?.isSaved ? "solid" : "regular"
                      } fa-heart`}
                      style={{
                        cursor: "pointer",
                        color: job?.jobDetails?.isSaved ? "red" : "#888",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSaveJob1(job?.jobDetails?._id);
                      }}
                    />
                  </div>
                </div>

                <div className="summary-offer-job-short-detail">
                  <h4>
                    {job?.jobDetails?.jobTitle || "Job Title Not Provided"}
                  </h4>
                  <p>
                    {job?.jobDetails?.shortDescription ||
                      "Location not specified"}
                  </p>
                  <ul>
                    <li>
                      <i className="fa-solid fa-location-dot" />{" "}
                      {job?.jobDetails?.companyId?.city ||
                        "Location not specified"}
                    </li>
                    <li>
                      <i className="fa-regular fa-calendar" />{" "}
                      {job?.jobDetails?.createdAt
                        ? moment(job?.jobDetails?.createdAt).fromNow()
                        : "Recently posted"}
                    </li>
                    <li>
                      <i className="fa-regular fa-file" />{" "}
                      {job?.jobDetails?.jobCategory?.length > 0
                        ? job.jobDetails.jobCategory
                            .map((item) => item.name)
                            .join(", ")
                        : "N/A"}
                    </li>
                    <li>
                      <i className="fa-regular fa-user" />{" "}
                      {/* {job?.jobDetails?.employmentType?.name || "Full time"} */}
                      {job?.jobDetails?.employmentType?.length > 0
                        ? job.jobDetails.employmentType
                            .map((item) => item.name)
                            .join(", ")
                        : "N/A"}
                    </li>
                  </ul>

                  <div className="summary-offer-apply-report-btn edit-popup-modal">
                    {/* {job?.jobDetails?.isApplied ? (
                      <div className="default-btn btn">
                        {job?.jobDetails?.applicationStatus}
                      </div>
                    ) : (
                      <a
                        href="#"
                        className="default-btn btn"
                        onClick={(e) => {
                          e.preventDefault();

                          // 🔥 If not logged in, redirect to login page
                          if (userRole !== "JobSeeker") {
                            navigate("/login");
                            return;
                          }

                          // 🔥 If logged in → set jobId
                          setJobId(job?.jobDetails?._id);

                          // 🔥 Open Apply Modal (correct way)
                          const modalEl =
                            document.getElementById("exampleModal");
                          if (modalEl) {
                            const modalInstance = new window.bootstrap.Modal(
                              modalEl,
                            );
                            modalInstance.show();
                          }
                        }}
                      >
                        Apply Now
                      </a>
                    )} */}
                    {/* 🔒 Already Applied */}
                    {job?.jobDetails?.isApplied ? (
                      <div className="default-btn btn">
                        {job?.jobDetails?.applicationStatus}
                      </div>
                    ) : (
                      <>
                        {/* 🧪 Assessment Flow */}
                        {job?.jobDetails?.isAssessmentRequired &&
                        !hasPassedAssessment ? (
                          <>
                            <a
                              href="#"
                              className={`default-btn btn ${isRetryBlocked ? "disabled-btn" : ""}`}
                              onClick={(e) => {
                                e.preventDefault();

                                // ⛔ Retry blocked
                                if (isRetryBlocked) return;

                                if (userRole !== "JobSeeker") {
                                  navigate("/login");
                                  return;
                                }

                                fetchAssessmentDetails(
                                  job?.jobDetails?.assessment,
                                );

                                const modalEl = document.getElementById(
                                  "skillAssessmentModal",
                                );
                                if (modalEl) {
                                  const modal = new window.bootstrap.Modal(
                                    modalEl,
                                  );
                                  modal.show();
                                }
                              }}
                              aria-disabled={isRetryBlocked}
                            >
                              Apply (Test Required)
                            </a>

                            {/* ⏳ Retry message */}
                            {canRetryLater && (
                              <p className="reapply-info-tag">
                                You can retry in {assessmentDetails.daysLeft}{" "}
                                day
                                {assessmentDetails.daysLeft > 1 ? "s" : ""}
                              </p>
                            )}

                            {cannotRetry && (
                              <p className="reapply-info-tag">
                                This assessment cannot be retaken. Please
                                contact the employer for further assistance.
                              </p>
                            )}
                          </>
                        ) : (
                          /* ✅ Apply directly (passed or no assessment) */
                          <a
                            href="#"
                            className="default-btn btn"
                            onClick={(e) => {
                              e.preventDefault();

                              if (userRole !== "JobSeeker") {
                                navigate("/login");
                                return;
                              }

                              setJobId(job?.jobDetails?._id);
                              handleJobClick(job?.jobDetails?._id);
                              const modalEl =
                                document.getElementById("exampleModal");
                              if (modalEl) {
                                const modal = new window.bootstrap.Modal(
                                  modalEl,
                                );
                                modal.show();
                              }
                            }}
                          >
                            Apply Now
                          </a>
                        )}
                      </>
                    )}
                    <a href="#" className="report-btn-info">
                      Report this job
                    </a>
                  </div>
                </div>
              </div>

              {job?.similarJobs?.length > 0 && (
                <div className="similar-jobs-section mt-3">
                  <h5>Other job posts you may be interested in</h5>
                  {job.similarJobs.map((item) => (
                    <Link
                      key={item._id}
                      to={`/job-details/${item._id}`} // Pass ID in URL
                      state={{ from: "/job-search" }}
                      className="job-link"
                    >
                      <div className="available-job-posts-box">
                        {/* Company Name & Logo */}
                        <div className="available-job-company-name-save-job">
                          <div className="available-job-company-name">
                            <h4>
                              <img
                                crossOrigin="anonymous"
                                src={
                                  item?.companyId?.logo
                                    ? `${API_IMAGE_URL}${item.companyId.logo}`
                                    : companyLogo
                                }
                                alt={
                                  item?.companyId?.brandName || "Company Logo"
                                }
                              />

                              {item.companyId?.brandName || "Unknown Company"}
                            </h4>
                          </div>

                          {/* Save Job & Social Icons */}
                          <div className="d-flex justify-space-between">
                            <div>
                              {item?.isAssessmentRequired && (
                                <>
                                  {/* 🟢 PASSED */}
                                  {item?.assessmentResult?.status ===
                                    "passed" && (
                                    <span className="test-passed-tag-area">
                                      <i className="fa-solid fa-circle-check"></i>
                                      Test Passed
                                    </span>
                                  )}

                                  {/* 🔴 FAILED */}
                                  {item?.assessmentResult?.status ===
                                    "failed" && (
                                    <span className="test-failed-tag-area">
                                      <i className="fa-solid fa-circle-xmark"></i>
                                      Test Failed
                                    </span>
                                  )}

                                  {/* 🟠 NOT ATTEMPTED */}
                                  {(!item?.assessmentResult ||
                                    item?.assessmentResult?.status ===
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
                                  item.isSaved ? "solid" : "regular"
                                } fa-heart`}
                                style={{
                                  cursor: "pointer",
                                  color: item.isSaved ? "#fb761a" : "#fff",
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSaveJob(item._id);
                                }}
                              />
                              <a
                                href="https://www.linkedin.com/login"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="fa-brands fa-linkedin-in" />
                              </a>
                              <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="fa-brands fa-facebook-f" />
                              </a>
                              <a
                                href="https://web.whatsapp.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="fa-brands fa-whatsapp" />
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="available-job-type-details">
                          <h5>{item.jobTitle || "Job Title Not Provided"}</h5>
                          <p>
                            {item.shortDescription ||
                              "No description available"}
                          </p>
                          <ul>
                            <li>
                              <i className="fa-regular fa-calendar" />{" "}
                              {item.createdAt
                                ? moment(item.createdAt).fromNow()
                                : "Recently posted"}
                            </li>
                            <li>
                              <i className="fa-regular fa-file" />{" "}
                              {item?.jobCategory?.length > 0
                                ? item.jobCategory
                                    .map((cat) => cat.name)
                                    .join(", ")
                                : "Category not specified"}
                            </li>
                            <li>
                              <i className="fa-regular fa-user" />{" "}
                              {Array.isArray(item?.employmentType) &&
                              item.employmentType.length > 0
                                ? item.employmentType
                                    .map((type) => type.name)
                                    .join(", ")
                                : "Full Time"}
                            </li>
                            <li>
                              <i className="fa-solid fa-location-dot" />{" "}
                              {item.companyId?.city || "Location not specified"}
                            </li>
                            <li>
                              <i className="fa-solid fa-users" /> Available:{" "}
                              {item?.availablePosts || 0}
                            </li>
                          </ul>
                        </div>

                        {/* Apply Button */}
                        {/* <div className="available-job-type-apply-btn">
                          {item?.isApplied ? (
                            <button className="default-btn btn">
                              {item?.applicationStatus}
                            </button>
                          ) : (
                            <button
                              className="default-btn btn"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                              onClick={() => setJobId(item._id)}
                            >
                              Apply Now
                            </button>
                          )}
                        </div> */}
                        <div className="available-job-type-apply-btn">
                          {/* 🔒 Already Applied */}
                          {item?.isApplied ? (
                            <button
                              className="default-btn btn"
                              disabled
                              style={{ color: "#ff6600" }}
                            >
                              {item?.applicationStatus}
                            </button>
                          ) : item?.isAssessmentRequired ? (
                            /* 🧪 Assessment Required → View Details */
                            <Link
                              to={`/job-details/${item._id}`}
                              className="default-btn btn"
                              state={{ from: "/job-search" }}
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

                                if (userRole !== "JobSeeker") {
                                  navigate("/login");
                                  return;
                                }

                                setJobId(item._id);

                                const modalEl =
                                  document.getElementById("exampleModal");
                                if (modalEl) {
                                  const modal = new window.bootstrap.Modal(
                                    modalEl,
                                  );
                                  modal.show();
                                }
                              }}
                            >
                              Apply Now
                            </a>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default JobDetails;
