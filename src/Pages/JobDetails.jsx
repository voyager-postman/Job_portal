import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import Slider from "react-slick";
import { API_IMAGE_URL } from "../Url/Url";
import companyLogo from "../../src/images/images1.png";
import "./JobDetailsModern.css";
function JobDetails() {
  const location = useLocation();
  const sliderRef = useRef(null);
  const userRole = localStorage.getItem("user_role");
  const jobStatus = location.state?.status;
  const [assessmentDetails, setAssessmentDetails] = useState(null);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [globalCurrency, setGlobalCurrency] = useState({
    code: "MAD",
    symbol: "DH",
  });
  const [categoryCount, setCategoryCount] = useState([]);
  console.log("Job Status:", jobStatus);
  const token = localStorage.getItem("token"); // 🔹 assuming JWT is stored here
  const { jobSlug } = useParams();

  const id = location.state?.JobId;

  console.log("Slug:", jobSlug);
  console.log("Job ID:", id);
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

        // update form state also
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchGlobalCurrency();
  }, []);
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
        setTimeout(() => {
          navigate("/");
        }, 1500);

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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false, // we use custom buttons
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };
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
                <div className="breadcrumb-main-list-area ">
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
                    {breadcrumbLabel ? (
                      <li>
                        <Link to={from}>{breadcrumbLabel}</Link>
                        <i className="fa-solid fa-angle-right"></i>
                      </li>
                    ) : (
                      ""
                    )}

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
      <div className="job-modern-container">
        <section
          className="Toastify"
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions text"
          aria-label="Notifications Alt+T"
        />
        <section className="job-hero-section">
          <div className="job-hero-pattern" />
        </section>
        <div className="container">
          <div className="job-branding-area">
            <div className="job-branding-card pill-badge-style">
              <div className="branding-top-row">
                <div className="job-company-logo-small">
                  <img
                    crossOrigin="anonymous"
                    alt="Company 1"
                    src={
                      job?.jobDetails?.companyId?.logo
                        ? `${API_IMAGE_URL}${job.jobDetails.companyId.logo}`
                        : companyLogo
                    }
                  />
                </div>
                <Link
                  className="job-company-link-minimal"
                  to={`/${job?.jobDetails?.companyId?.slug}`}
                  state={{ companyId: job?.jobDetails?.companyId?._id }}
                >
                  <span style={{ verticalAlign: "inherit" }}>
                    <span style={{ verticalAlign: "inherit" }}>
                      {job?.jobDetails?.companyId?.brandName}
                    </span>
                  </span>
                </Link>
              </div>
              <div className="branding-title-row">
                <h1>{job?.jobDetails?.jobTitle}</h1>
                <div className="branding-meta-info">
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        Posted{" "}
                      </font>
                    </font>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {moment(job?.jobDetails?.createdAt).fromNow()}
                      </font>
                    </font>
                  </span>
                </div>
              </div>
              <div className="job-quick-facts-pills">
                <div className="fact-pill">
                  <i className="fa-solid fa-layer-group" />

                  <div className="fact-pill-link">
                    <span>
                      {job?.jobDetails?.jobCategory?.length > 0
                        ? job.jobDetails.jobCategory
                            .map((item) => item.name)
                            .join(", ")
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="fact-pill">
                  <i className="fa-solid fa-location-dot" />
                  <span>
                    <span style={{ verticalAlign: "inherit" }}>
                      <span style={{ verticalAlign: "inherit" }}>
                        {Array.isArray(job?.jobDetails?.city) &&
                        job.jobDetails.city.length > 0
                          ? job.jobDetails.city.join(", ")
                          : job?.jobDetails?.companyId?.city || "N/A"}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="fact-pill" title="Employment Type">
                  <i className="fa-solid fa-file-contract" />
                  <span>
                    {job?.jobDetails?.employmentType?.length > 0
                      ? job.jobDetails.employmentType
                          .map((item) => item.name)
                          .join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div className="fact-pill" title="Remote Status">
                  <i className="fa-solid fa-house-laptop" />
                  <span>{job?.jobDetails?.remote?.name || "N/A"}</span>
                </div>
                <div className="fact-pill">
                  <i className="fa-solid fa-money-bill-wave" />
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        Salary:{" "}
                      </font>
                    </font>
                    <font dir="auto" style={{ verticalAlign: "inherit" }}>
                      <font dir="auto" style={{ verticalAlign: "inherit" }}>
                        {job?.jobDetails?.privatJobDetails?.salaryNegotiable ? (
                          "Salary negotiable"
                        ) : job?.jobDetails?.privatJobDetails?.minSalary ||
                          job?.jobDetails?.privatJobDetails?.maxSalary ? (
                          <>
                            {job?.jobDetails?.privatJobDetails?.minSalary || 0}{" "}
                            -{" "}
                            {job?.jobDetails?.privatJobDetails?.maxSalary || 0}{" "}
                            {globalCurrency?.code || "$"}
                          </>
                        ) : (
                          "Salary negotiable"
                        )}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="fact-pill">
                  <i className="fa-solid fa-signal" />
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        Experience:{" "}
                      </font>
                    </font>
                    <font dir="auto" style={{ verticalAlign: "inherit" }}>
                      <font dir="auto" style={{ verticalAlign: "inherit" }}>
                        {job?.jobDetails?.minimumLevel?.name || "N/A"}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="fact-pill">
                  <i className="fa-solid fa-users" />
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {job?.jobDetails?.availablePosts}
                      </font>
                    </font>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        Bed(s)
                      </font>
                    </font>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="job-grid-container">
            <div className="content-main">
              {job?.jobDetails?.isAssessmentRequired && (
                <div
                  className="modern-alert mb-5"
                  style={{
                    border: `1px solid ${
                      assessmentDetails?.status === "failed"
                        ? "#f5c2c7"
                        : assessmentDetails?.status === "passed"
                          ? "#badbcc"
                          : "#cfe2ff"
                    }`,
                    background:
                      assessmentDetails?.status === "failed"
                        ? "#fff5f5"
                        : assessmentDetails?.status === "passed"
                          ? "#f0fff4"
                          : "#f8f9ff",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    gap: "15px",
                    alignItems: "flex-start",
                  }}
                >
                  {/* ICON */}
                  <div
                    style={{
                      minWidth: "45px",
                      height: "45px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        assessmentDetails?.status === "failed"
                          ? "#dc3545"
                          : assessmentDetails?.status === "passed"
                            ? "#28a745"
                            : "#5e72e4",
                      color: "#fff",
                    }}
                  >
                    <i className="fa-solid fa-file-shield" />
                  </div>

                  {/* CONTENT */}
                  <div>
                    <h4
                      style={{
                        marginBottom: "6px",
                        fontWeight: "600",
                        color:
                          assessmentDetails?.status === "failed"
                            ? "#dc3545"
                            : assessmentDetails?.status === "passed"
                              ? "#28a745"
                              : "#2d3748",
                      }}
                    >
                      Skills Assessment Required
                    </h4>

                    {/* MESSAGE */}
                    <p
                      style={{
                        marginBottom: "10px",
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      {/* NOT ATTEMPTED */}
                      {(!assessmentDetails ||
                        assessmentDetails?.status === "not_attempted") && (
                        <>
                          This position requires a quick skills assessment to
                          validate your profile. Passing this will increase
                          visibility to the recruiter.
                        </>
                      )}

                      {/* FAILED */}
                      {assessmentDetails?.status === "failed" && (
                        <>
                          You did not pass the test on your previous attempt.
                          {canRetryNow && (
                            <strong>
                              <br />
                              You can try the assessment again.
                            </strong>
                          )}
                          {canRetryLater && (
                            <strong>
                              <br />
                              You can retry in {assessmentDetails.daysLeft} day
                              {assessmentDetails.daysLeft > 1 ? "s" : ""}
                            </strong>
                          )}
                          {cannotRetry && (
                            <strong>
                              <br />
                              This assessment cannot be retaken. Please contact
                              the employer for further assistance.
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

                    {/* STATS */}
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap",
                        fontSize: "13px",
                        color: "#5e72e4",
                      }}
                    >
                      <span>
                        <i className="fa-solid fa-clock" />{" "}
                        {job?.jobDetails?.assessment?.totalDuration || 0} min
                      </span>

                      <span>
                        <i className="fa-solid fa-list-check" />{" "}
                        {job?.jobDetails?.assessment?.totalQuestions || 0}{" "}
                        questions
                      </span>

                      <span>
                        <i className="fa-solid fa-percentage" />{" "}
                        {job?.jobDetails?.assessment?.passingPercentage || 0}%
                      </span>
                    </div>

                    {/* SCORE */}
                    {assessmentDetails?.status === "passed" && (
                      <div
                        style={{
                          marginTop: "8px",
                          color: "#28a745",
                          fontWeight: "600",
                        }}
                      >
                        Score: {assessmentDetails?.scorePercentage ?? 0}%
                      </div>
                    )}
                  </div>
                </div>
              )}
              <section className="job-modern-card main-content-card">
                <div className="modern-content-block first">
                  <h2>About the role</h2>
                  <div className="rich-text-content">
                    <p>{job?.jobDetails?.shortDescription}</p>
                  </div>
                </div>
                <div className="modern-content-block">
                  <h2>Job Description</h2>

                  <div
                    className="rich-text-content"
                    dangerouslySetInnerHTML={{
                      __html: decodedHtml || "<p>N/A</p>",
                    }}
                  />
                </div>
                {job?.jobDetails?.recruitmentProcess?.length > 0 && (
                  <div className="modern-content-block mb-5">
                    <h2
                      className="mb-4 d-flex align-items-center gap-2"
                      style={{
                        "font-size": "20px",
                        "font-weight": "700",
                        color: "rgb(15, 23, 42)",
                      }}
                    >
                      Processus de recrutement
                    </h2>

                    <div className="recruitment-steps-modern mt-4">
                      {job?.jobDetails?.recruitmentProcess?.map(
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
                <div className="modern-content-block last">
                  <h2>Related Tags</h2>

                  <div className="job-tags-list">
                    {job?.jobDetails?.tags && job.jobDetails.tags.length > 0 ? (
                      job.jobDetails.tags.map((tag, index) => (
                        <span key={index} className="job-tag">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="no-tags">No related tags found.</span>
                    )}
                  </div>
                </div>
              </section>
              {job?.similarJobs?.length > 0 && (
                <section className="job-modern-card">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Similar Jobs</h2>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => sliderRef.current.slickPrev()}
                        className="btn btn-outline-secondary rounded-circle"
                        style={{
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          "-webkit-align-items": "center",
                          "-webkit-box-align": "center",
                          "-ms-flex-align": "center",
                          "align-items": "center",
                          "-webkit-box-pack": "center",
                          "-webkit-justify-content": "center",
                          "-ms-flex-pack": "center",
                          "justify-content": "center",
                          border: "1px solid rgb(226, 232, 240)",
                        }}
                      >
                        <i className="fa-solid fa-chevron-left" />
                      </button>
                      <button
                        onClick={() => sliderRef.current.slickNext()}
                        className="btn btn-outline-secondary rounded-circle"
                        style={{
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          "-webkit-align-items": "center",
                          "-webkit-box-align": "center",
                          "-ms-flex-align": "center",
                          "align-items": "center",
                          "-webkit-box-pack": "center",
                          "-webkit-justify-content": "center",
                          "-ms-flex-pack": "center",
                          "justify-content": "center",
                          border: "1px solid rgb(226, 232, 240)",
                        }}
                      >
                        <i className="fa-solid fa-chevron-right" />
                      </button>
                    </div>
                  </div>
                  <Slider
                    ref={sliderRef}
                    {...settings}
                    className="similar-jobs-slider"
                  >
                    {job?.similarJobs?.map((item, index) => (
                      <div key={item._id || index} className="mt-2">
                        <Link
                          to={`/job/${item.slug}`}
                          state={{
                            from: "/job-search",
                            JobId: item._id,
                          }}
                          className="job-link text-decoration-none"
                        >
                          <div
                            className="elegant-job-card modern-layout d-flex flex-column"
                            style={{
                              height: "320px",
                              border: "1px solid #e2e8f0",
                              borderRadius: "16px",
                            }}
                          >
                            <div className="card-header-row d-flex align-items-center gap-3 mb-3">
                              <div
                                className="card-logo flex-shrink-0"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  "border-radius": "10px",
                                  overflow: "hidden",
                                  background: "rgb(248, 250, 252)",
                                  padding: "5px",
                                  border: "1px solid rgb(226, 232, 240)",
                                }}
                              >
                                <img
                                  crossOrigin="anonymous"
                                  alt="Devstringx Technologies Pvt Ltd"
                                  src={
                                    item?.companyId?.logo
                                      ? `${API_IMAGE_URL}${item.companyId.logo}`
                                      : companyLogo
                                  }
                                  alt={item?.companyId?.brandName || "Company"}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    "object-fit": "contain",
                                  }}
                                />
                              </div>
                              <div className="card-header-text">
                                <h4
                                  className="company-name mb-1"
                                  style={{
                                    "font-size": "0.95rem",
                                    "font-weight": "700",
                                    color: "rgb(51, 65, 85)",
                                    margin: "0px",
                                  }}
                                >
                                  {" "}
                                  {item?.companyId?.brandName ||
                                    "Unknown Company"}
                                </h4>
                                <span
                                  className="post-date"
                                  style={{
                                    "font-size": "0.8rem",
                                    color: "rgb(148, 163, 184)",
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
                                      {item?.createdAt
                                        ? moment(item.createdAt).fromNow()
                                        : "Recently posted"}
                                    </font>
                                  </font>
                                </span>
                              </div>
                            </div>
                            <div className="card-title-row mb-3">
                              <h3
                                className="job-card-title text-capitalize"
                                style={{
                                  "font-size": "1.15rem",
                                  "font-weight": "800",
                                  color: "rgb(15, 23, 42)",
                                  margin: "0px",
                                }}
                              >
                                {item.jobTitle || "Job Title"}
                              </h3>
                            </div>
                            <div className="card-tags-grid d-flex flex-wrap gap-2">
                              <span
                                style={{
                                  background: "rgb(241, 245, 249)",
                                  padding: "4px 10px",
                                  "border-radius": "6px",
                                  "font-size": "0.8rem",
                                  color: "rgb(71, 85, 105)",
                                  "font-weight": "600",
                                }}
                              >
                                <i className="fa-solid fa-briefcase me-1" />{" "}
                                {item?.jobCategory?.length > 0
                                  ? item.jobCategory
                                      .map((c) => c.name)
                                      .join(", ")
                                  : "Category"}
                              </span>
                              <span
                                className="card-tag-pill"
                                style={{
                                  background: "rgb(241, 245, 249)",
                                  padding: "4px 10px",
                                  "border-radius": "6px",
                                  "font-size": "0.8rem",
                                  color: "rgb(71, 85, 105)",
                                  "font-weight": "600",
                                }}
                              >
                                <i className="fa-solid fa-house-laptop me-1" />{" "}
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    {Array.isArray(item?.employmentType) &&
                                    item.employmentType.length > 0
                                      ? item.employmentType
                                          .map((t) => t.name)
                                          .join(", ")
                                      : "Full Time"}
                                  </font>
                                </font>
                              </span>
                              <span
                                className="card-tag-pill"
                                style={{
                                  background: "rgb(241, 245, 249)",
                                  padding: "4px 10px",
                                  "border-radius": "6px",
                                  "font-size": "0.8rem",
                                  color: "rgb(71, 85, 105)",
                                  "font-weight": "600",
                                }}
                              >
                                <i className="fa-solid fa-location-dot me-1" />{" "}
                                {item?.companyId?.city || "Location"}
                              </span>
                              <span
                                className="card-tag-pill"
                                style={{
                                  background: "rgb(255, 247, 237)",
                                  padding: "4px 10px",
                                  "border-radius": "6px",
                                  "font-size": "0.8rem",
                                  color: "rgb(251, 118, 26)",
                                  "font-weight": "700",
                                }}
                              >
                                <i className="fa-solid fa-users me-1" />{" "}
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    {item?.availablePosts || 0} Posts
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
                                    Bed(s)
                                  </font>
                                </font>
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </Slider>
                </section>
              )}
            </div>
            <aside className="job-sticky-sidebar">
              <div className="job-modern-card action-card">
                <div className="apply-button-group">
                  {/* 🔒 Already Applied */}
                  {job?.jobDetails?.isApplied ? (
                    <button className="btn-modern-primary w-100" disabled>
                      {job?.jobDetails?.applicationStatus || "Applied"}
                    </button>
                  ) : (
                    <>
                      {/* 🧪 Assessment Required */}
                      {job?.jobDetails?.isAssessmentRequired &&
                      !hasPassedAssessment ? (
                        <a
                          href="#"
                          className={`btn-modern-outline text-decoration-none text-center ${
                            isRetryBlocked ? "disabled-btn" : ""
                          }`}
                          onClick={(e) => {
                            e.preventDefault();

                            // ⛔ Retry blocked
                            if (isRetryBlocked) return;

                            // 🔐 Not logged in
                            if (userRole !== "JobSeeker") {
                              navigate("/login");
                              return;
                            }

                            // 📥 Fetch assessment
                            fetchAssessmentDetails(
                              job?.jobDetails?.assessment?._id,
                            );

                            // 📦 Open assessment modal
                            const modalEl = document.getElementById(
                              "skillAssessmentModal",
                            );
                            if (modalEl) {
                              const modal = new window.bootstrap.Modal(modalEl);
                              modal.show();
                            }
                          }}
                        >
                          Apply (Test Required)
                        </a>
                      ) : (
                        /* ✅ Apply Directly */
                        <button
                          className="btn-modern-primary"
                          onClick={(e) => {
                            e.preventDefault();

                            if (userRole !== "JobSeeker") {
                              navigate("/login");
                              return;
                            }

                            setJobId(job?.jobDetails?._id);

                            const modalEl =
                              document.getElementById("exampleModal");
                            if (modalEl) {
                              const modal = new window.bootstrap.Modal(modalEl);
                              modal.show();
                            }
                          }}
                        >
                          Apply Now
                        </button>
                      )}

                      {/* ⏳ Retry Message */}
                      {canRetryLater && (
                        <p className="reapply-info-tag">
                          You can retry in {assessmentDetails.daysLeft} day
                          {assessmentDetails.daysLeft > 1 ? "s" : ""}
                        </p>
                      )}

                      {cannotRetry && (
                        <p className="reapply-info-tag">
                          This assessment cannot be retaken. Please contact the
                          employer for further assistance.
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="sidebar-action-tools">
                  <button
                    className="tool-item "
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveJob2(job?.jobDetails?._id);
                    }}
                  >
                    <i
                      className={`fa-${
                        job?.jobDetails?.isSaved ? "solid" : "regular"
                      } fa-heart`}
                      style={{
                        color: job?.jobDetails?.isSaved ? "#ff0000" : "",
                      }}
                    />
                    <span>Save</span>
                  </button>
                  <button
                    className="tool-item"
                    title={linkUrl ? "Copy link" : "Link not available"}
                    onClick={(e) => handleCopy(e, linkUrl)}
                    style={{ cursor: linkUrl ? "pointer" : "not-allowed" }}
                  >
                    <i className="fa-solid fa-link" />
                    <span>Share</span>
                  </button>
                  <a href="#" className="tool-item text-decoration-none">
                    <i className="fa-solid fa-flag" />
                    <span>Report</span>
                  </a>
                </div>
                <div className="share-links mt-3">
                  <a
                    href={
                      job?.jobDetails?.companyId?.links?.linkedin ||
                      "https://www.linkedin.com/login"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn"
                  >
                    <i className="fa-brands fa-linkedin-in" />
                  </a>
                  <a
                    href={
                      job?.jobDetails?.companyId?.links?.facebook ||
                      "https://www.facebook.com/"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn"
                  >
                    <i className="fa-brands fa-facebook-f" />
                  </a>

                  <a
                    href={
                      job?.jobDetails?.companyId?.links?.twitter ||
                      "https://twitter.com/"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn"
                  >
                    <i className="fa-brands fa-x-twitter" />
                  </a>
                  <a
                    href={
                      job?.jobDetails?.companyId?.links?.instagram ||
                      "https://www.instagram.com/"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn"
                  >
                    <i className="fa-brands fa-instagram" />
                  </a>
                </div>
                <div className="sidebar-company-integrated mt-5 pt-5 border-top">
                  <h3 className="sidebar-sub-title">About the Company</h3>
                  <h4 className="sidebar-company-name">
                    <Link
                      className="job-company-link-minimal text-decoration-none"
                      to={`/${job?.jobDetails?.companyId?.slug}`}
                      state={{ companyId: job?.jobDetails?.companyId?._id }}
                    >
                      {job?.jobDetails?.companyId?.brandName ||
                        "Unknown Company"}
                    </Link>
                  </h4>
                  <div className="side-company-description rich-text-content company-description-clamped mt-3">
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          job?.jobDetails?.companyId?.aboutCompany ||
                          "No company description available",
                      }}
                    />
                    <font
                      dir="auto"
                      style={{ "vertical-align": "inherit" }}
                    ></font>
                  </div>
                  <div className="mt-4">
                    <Link
                      className="btn-view-company-minimal"
                      to={`/${job?.jobDetails?.companyId?.slug}`}
                      state={{ companyId: job?.jobDetails?.companyId?._id }}
                    >
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          View profile
                        </font>
                      </font>
                    </Link>
                  </div>
                </div>
                <div className="sidebar-company-jobs mt-5 pt-4 border-top">
                  <h3
                    className="sidebar-sub-title mb-4"
                    style={{ color: "rgb(15, 23, 42)" }}
                  >
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        Latest offers by{" "}
                      </font>
                    </font>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {job?.jobDetails?.companyId?.brandName ||
                          "Unknown Company"}
                      </font>
                    </font>
                  </h3>
                  <div className="d-flex flex-column gap-3">
                    {job?.latestJobs?.length > 0 ? (
                      job.latestJobs.map((item, index) => (
                        <Link
                          key={item._id || index}
                          to={`/job/${item.slug}`}
                          state={{
                            from: "/job-search",
                            JobId: item._id,
                          }}
                          className="text-decoration-none"
                        >
                          <div
                            className="compact-job-card"
                            style={{
                              background: "rgb(248, 250, 252)",
                              padding: "1.25rem",
                              borderRadius: "12px",
                              transition: "0.2s",
                              border: "1px solid rgb(226, 232, 240)",
                            }}
                          >
                            <h5
                              className="compact-job-title text-capitalize"
                              style={{
                                fontSize: "0.95rem",
                                fontWeight: "700",
                                color: "rgb(15, 23, 42)",
                                margin: "0 0 0.5rem",
                              }}
                            >
                              {item?.jobTitle || "Job Title"}
                            </h5>

                            <div
                              className="compact-job-meta d-flex justify-content-between align-items-center"
                              style={{
                                fontSize: "0.8rem",
                                color: "rgb(100, 116, 139)",
                              }}
                            >
                              <span>
                                <i className="fa-solid fa-location-dot me-1" />
                                {Array.isArray(item?.city) &&
                                item.city.length > 0
                                  ? item.city.join(", ")
                                  : "Location"}
                              </span>

                              <span
                                style={{
                                  color: "rgb(251, 118, 26)",
                                  fontWeight: "600",
                                }}
                              >
                                {item?.published_date
                                  ? moment(item.published_date).fromNow()
                                  : "Recently posted"}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-muted">No jobs available</p>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
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
                        Array.isArray(resumeList) && resumeList.length > 0
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
                            onClick={() => handleSelect("resume", resume.url)}
                            style={{ cursor: "pointer" }}
                          >
                            <span className="file-name-text">
                              <i className="fa-solid fa-file" /> {fileName}
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
                        Array.isArray(resumeList) && resumeList.length > 0
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
                            onClick={() => handleSelect("cover", cover.url)}
                            style={{ cursor: "pointer" }}
                          >
                            <span className="file-name-text">
                              <i className="fa-solid fa-file" /> {fileName}
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
                          cursor: selectedCustomFile ? "pointer" : "default",
                        }}
                      >
                        <span className="file-name-text">
                          <i className="fa-solid fa-file" />{" "}
                          {selectedCustomFile ? selectedCustomFile.name : ""}
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
                <h1 className="modal-title" id="skillAssessmentModalLabel">
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
                    To apply for {job?.jobDetails?.jobTitle} you must complete a
                    skills assessment
                  </p>
                  <div className="skill-assessment-javaScript-fundamental">
                    <h6>{assessment?.assessmentName}</h6>
                    {/* <span>Java Questions:10</span> */}
                    {categoryCount?.map((cat) => (
                      <span key={cat.categoryName}>
                        {cat.categoryName} Questions: {cat.numberOfQuestions}{" "}
                        Questions
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
                        <i className="fa-solid fa-percent"></i>Pass threshold:{" "}
                        {assessment?.passingPercentage}%
                      </li>
                    </ul>
                  </div>
                  <div className="skill-assessment-important-area">
                    <h6>Important</h6>
                    <p>
                      once started, the timer cannot be paused. Make sure you
                      have enough time to complete the test.
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a href="#" className="default-btn btn" data-bs-dismiss="modal">
                  Cancel
                </a>
                <button className="default-btn btn" onClick={handleStartTest}>
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
                      <h6>What is the output of typeof null in javaScript?</h6>
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
                      <h6>Are is the output of typeof null in javaScript?</h6>
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
                      <h6>Why is the output of typeof null in javaScript?</h6>
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
                      <h6>This is the output of typeof null in javaScript?</h6>
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
                        React.js is the output of typeof null in javaScript?
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
    </>
  );
}

export default JobDetails;
