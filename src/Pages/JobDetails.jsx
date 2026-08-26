import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { isAuthReady } from "../utils/apiHeaders";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import Slider from "react-slick";
import { API_IMAGE_URL } from "../Url/Url";
import companyLogo from "../../src/images/images1.png";
import "./JobDetailsModern.css";
import { useTranslation } from "react-i18next";
import JobApplyModal from "../components/JobApplyModal";
import ReportJobModal from "../components/ReportJobModal";
import { useJobApply } from "../hooks/useJobApply";
import PageSEO from "../components/PageSEO";
import {
  absoluteUrl,
  buildJobCanonicalPath,
  buildJobCanonicalUrl,
  buildJobPostingSchema,
  buildBreadcrumbSchema,
  stripHtml,
  isJobExpired,
  resolveJobSeoData,
  SITE,
} from "../utils/seo";
import { fetchJobRecord, resolveRedirectSlug } from "../utils/jobRoutes";
import {
  resolveHeroCoverUrl,
  resolveJobCoverUrl,
  resolveCompanyLogoUrl,
  DEFAULT_COMPANY_LOGO,
} from "../utils/companyLogo";
import SafeHtml from "../components/SafeHtml";

function JobDetails() {
  const { t } = useTranslation("global");
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
  const token = localStorage.getItem("token");
  const { jobSlug } = useParams();

  const id = location.state?.JobId;

  console.log("Slug:", jobSlug);
  console.log("Job ID:", id);
  const navigate = useNavigate();
  console.log(id);
  const [job, setJob] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [heroBgImage, setHeroBgImage] = useState(null);
  const [heroReady, setHeroReady] = useState(false);
  console.log(id);
  const from = location.state?.from;
  console.log(from);

  const breadcrumbLabel = from?.includes("/manage-job-application")
    ? t("applications.manage_job_application")
    : from?.includes("/job-search")
      ? t("jobs.job_search_title")
      : from?.includes("/applied-jobs-list")
        ? t("header.Application_Management")
        : from?.includes("/jobs")
          ? "Jobs"
          : t("breadcrumbs.candidate_dashboard");

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
  const loadJob = async () => {
    const lookup = id || jobSlug;
    if (!lookup) {
      setLoading(false);
      return;
    }

    let redirected = false;
    try {
      setLoading(true);
      const responseData = await fetchJobRecord(lookup, token);

      // Backend returns 301 / { redirect: true, slug|location } when the title (slug) changed.
      if (responseData?.redirect) {
        const newSlug =
          resolveRedirectSlug(responseData.location || responseData.slug) ||
          responseData.slug;
        if (newSlug && newSlug !== jobSlug) {
          redirected = true;
          navigate(`/job/${newSlug}`, { replace: true });
          return;
        }
      }

      const jobDetails = responseData?.jobDetails;

      if (
        userRole === "JobSeeker" &&
        jobDetails?.confidentialJobPost === true
      ) {
        toast.error(
          "This confidential job is no longer available for candidate access.",
        );

        setJob(null);
        setAssessmentDetails(null);
        setLinkUrl("");
        setTimeout(() => {
          navigate("/");
        }, 1500);

        return;
      }

      setJob(responseData);
      setLinkUrl(jobDetails?.jobLink || "");
      setAssessmentDetails(responseData?.assessmentResult || null);
    } catch (error) {
      console.error("Error fetching job details:", error);

      toast.error(
        error?.response?.data?.message || "Unable to load job details.",
      );
    } finally {
      if (!redirected) {
        setLoading(false);
      }
    }
  };

  const {
    resumeList,
    coverLetterList,
    selectedResumeUrl,
    selectedCoverLetterUrl,
    selectedCustomFile,
    isApplying,
    isUploadingCv,
    isUploadingCover,
    jobId,
    setJobId,
    fileInputRef,
    cvUploadInputRef,
    coverUploadInputRef,
    handleSelect,
    handleFileUpload,
    handleCvUpload,
    handleCoverUpload,
    handleApplyJob,
    resetApplyModal,
    clearCustomFile,
    isSelectionMade,
  } = useJobApply({
    t,
    onApplySuccess: () => {
      loadJob();
    },
  });

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
    loadJob();
  }, [id, jobSlug]);

  // Prefetch cover before paint so the default never flashes under the company image
  useEffect(() => {
    let cancelled = false;
    const coverSeed = job?.jobDetails?._id || job?._id || id || jobSlug;
    const passedCover = location.state?.coverImage;

    const applyCover = async () => {
      // Wait for job payload unless we already have a cover from navigation
      if (!job && loading) {
        if (passedCover) {
          try {
            const optimistic = await resolveHeroCoverUrl(
              { companyCoverPhoto: passedCover, coverPhoto: passedCover },
              coverSeed,
            );
            if (!cancelled && optimistic) {
              setHeroBgImage(optimistic);
              setHeroReady(true);
            }
          } catch {
            // keep skeleton until job loads
          }
        }
        return;
      }

      // Keep any optimistic cover visible while we resolve the final URL
      try {
        const url = await resolveHeroCoverUrl(
          job || { companyCoverPhoto: passedCover },
          coverSeed,
        );
        if (cancelled) return;
        setHeroBgImage(url);
        setHeroReady(true);
      } catch {
        if (cancelled) return;
        setHeroBgImage(resolveJobCoverUrl(job, coverSeed));
        setHeroReady(true);
      }
    };

    applyCover();

    return () => {
      cancelled = true;
    };
  }, [job, jobSlug, id, loading, location.state?.coverImage]);

  console.log(linkUrl);

  const handleSaveJob = async (jobId) => {
    try {
      // 🧠 Step 1: Check if user is logged in
      if (!isAuthReady()) {
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

        loadJob();

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

  const handleSaveJob1 = async (jobId) => {
    try {
      // 🧠 Step 1: Check if user is logged in
      if (!isAuthReady()) {
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

        loadJob();

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
      toast.error(t("jobs.link_not_available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error(t("jobs.copy_failed"));
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
        error?.response?.data?.message || t("jobs.unable_load_assessment"),
      );
    } finally {
      setLoadingAssessment(false);
    }
  };

  const handleSaveJob2 = async (jobId) => {
    try {
      // 🧠 Step 1: Check if user is logged in
      if (!isAuthReady()) {
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
          loadJob();
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
          jobSlug: jobSlug,
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
        toast.error(t("jobs.cannot_retake_assessment"));
        return;
      }

      // 🟠 Already submitted
      if (apiResponse?.message === "Assessment already submitted") {
        toast.error(t("jobs.assessment_already_submitted"));

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

  const canonicalPath = job
    ? buildJobCanonicalPath(job) || `/job/${jobSlug}`
    : `/job/${jobSlug}`;
  const canonicalUrl = job
    ? buildJobCanonicalUrl(job) || absoluteUrl(`/job/${jobSlug}`)
    : absoluteUrl(`/job/${jobSlug}`);
  const jobTitle = job?.jobDetails?.jobTitle || (jobSlug ? jobSlug.replace(/-/g, " ") : t("breadcrumbs.job_details"));
  const companyName = job?.jobDetails?.companyId?.brandName;
  const jobCity = Array.isArray(job?.jobDetails?.city) && job.jobDetails.city.length > 0
    ? job.jobDetails.city.join(", ")
    : job?.jobDetails?.companyId?.city;

  const cleanTitleParts = [jobTitle, companyName, jobCity]
    .map((part) => String(part || "").trim())
    .filter(
      (part) =>
        part &&
        part.toLowerCase() !== "n/a" &&
        part.toLowerCase() !== "null" &&
        part.toLowerCase() !== "undefined",
    );

  const seoTitle = cleanTitleParts.join(" - ");

  const jobSeo = resolveJobSeoData(job, seoTitle, canonicalPath);
  const expiredListing = isJobExpired(job);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: t("header.home"), path: "/" },
    { name: t("header.jobs"), path: "/jobs" },
    { name: job?.jobDetails?.jobTitle || jobTitle, path: canonicalPath },
  ]);

  const jobSchemas = [jobSeo.jsonLd, breadcrumbSchema].filter(Boolean);

  return (
    <>
      <PageSEO
        title={jobSeo.title}
        description={jobSeo.description}
        canonical={jobSeo.canonical}
        image={jobSeo.image || heroBgImage || SITE.defaultImage}
        ogType={jobSeo.ogType || "article"}
        robots={jobSeo.robots}
        ogTitle={jobSeo.ogTitle}
        ogDescription={jobSeo.ogDescription}
        jsonLd={jobSchemas}
      />
      <ToastContainer />
      {from !== "/" && (
        <section className="inner-breadcrumb-main-area ">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-sm-12">
                <div className="breadcrumb-main-list-area ">
                  <p className="breadcrumb-page-label">{t("breadcrumbs.job_details")}</p>
                  <ul>
                    <li>
                      <Link to="/">{t("header.home")}</Link>
                      <i className="fa-solid fa-angle-right"></i>
                    </li>
                    {from !== "/jobs" && (
                      <li>
                        <Link to="/candidate-dashboard">{t("header.dashboard")}</Link>
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
                          t("breadcrumbs.job_details")}
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
        <section
          className={`job-hero-section${heroReady ? " is-ready" : " is-loading"}`}
        >
          {heroBgImage ? (
            <img
              className={`job-hero-cover${heroReady ? " is-visible" : ""}`}
              alt=""
              src={heroBgImage}
              {...(String(heroBgImage || "").startsWith("http")
                ? { crossOrigin: "anonymous" }
                : {})}
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div className="job-hero-pattern" />
        </section>
        <div className="container">
          <div className="job-branding-area">
            <div className="job-branding-card pill-badge-style">
              <div className="branding-top-row">
                <div className="job-company-logo-small">
                  <img
                    alt={`${job?.jobDetails?.companyId?.brandName || t("jobs.unknown_company")} logo`}
                    src={resolveCompanyLogoUrl(job?.jobDetails?.companyId?.logo)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_COMPANY_LOGO;
                    }}
                    loading="lazy"
                    decoding="async"
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
                <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                  <h1 className="mb-0">{job?.jobDetails?.jobTitle}</h1>
                  {expiredListing && (
                    <span className="job-expired-pill-badge">
                      <i className="fa-solid fa-clock-rotate-left me-1" />
                      {t("jobs.applications_closed")}
                    </span>
                  )}
                </div>
                <div className="branding-meta-info">
                  <span>
                    <span>{t("jobs.posted")} </span>
                    <span>{moment(job?.jobDetails?.createdAt).fromNow()}</span>
                  </span>
                  {(job?.jobDetails?.expiresAt || job?.jobDetails?.expiryDate) && (
                    <span className="ms-3">
                      <i className="fa-regular fa-calendar-xmark me-1" />
                      {expiredListing
                        ? `${t("jobs.expired_on")} ${moment(job.jobDetails.expiresAt || job.jobDetails.expiryDate).format("LL")}`
                        : `${t("jobs.expires_on")} ${moment(job.jobDetails.expiresAt || job.jobDetails.expiryDate).format("LL")}`}
                    </span>
                  )}
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
                <div className="fact-pill" title={t("jobs.employment_type")}>
                  <i className="fa-solid fa-file-contract" />
                  <span>
                    {job?.jobDetails?.employmentType?.length > 0
                      ? job.jobDetails.employmentType
                          .map((item) => item.name)
                          .join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div className="fact-pill" title={t("jobs.remote_status")}>
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
                          t("jobs.salary_negotiable")
                        ) : job?.jobDetails?.privatJobDetails?.minSalary ||
                          job?.jobDetails?.privatJobDetails?.maxSalary ? (
                          <>
                            {job?.jobDetails?.privatJobDetails?.minSalary || 0}{" "}
                            -{" "}
                            {job?.jobDetails?.privatJobDetails?.maxSalary || 0}{" "}
                            {globalCurrency?.code || "$"}
                          </>
                        ) : (
                          t("jobs.salary_negotiable")
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
              {expiredListing && (
                <div className="job-expired-alert-banner" role="alert">
                  <div className="expired-alert-icon">
                    <i className="fa-solid fa-triangle-exclamation" />
                  </div>
                  <div className="expired-alert-content">
                    <h3 className="expired-alert-heading">
                      {t("jobs.expired_banner_title")}
                    </h3>
                    <p className="expired-alert-message">
                      {t("jobs.expired_banner_desc")}
                    </p>
                    {job?.similarJobs?.length > 0 ? (
                      <a
                        href="#similar-jobs-section"
                        className="btn-expired-view-similar"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById("similar-jobs-section")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <i className="fa-solid fa-arrow-down" />
                        {t("jobs.view_similar_jobs")}
                      </a>
                    ) : (
                      <Link to="/jobs" className="btn-expired-view-similar">
                        <i className="fa-solid fa-briefcase" />
                        {t("jobs.browse_all_jobs")}
                      </Link>
                    )}
                  </div>
                </div>
              )}
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
                    <p
                      className="assessment-card-title"
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
                    </p>

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
                  <h2>{t("jobs.about_role")}</h2>
                  <div className="rich-text-content">
                    <p>{job?.jobDetails?.shortDescription}</p>
                  </div>
                </div>
                <div className="modern-content-block">
                  <h2>{t("header.Job_Description")}</h2>

                  <SafeHtml
                    className="rich-text-content"
                    html={job?.jobDetails?.jobDescription}
                    decode
                    fallback={<p>N/A</p>}
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
                  <h2>{t("jobs.related_tags")}</h2>

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
                <section className="job-modern-card" id="similar-jobs-section">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <h2 className="mb-0">{t("jobs.similar_jobs")}</h2>
                      {expiredListing && (
                        <span className="similar-active-badge">
                          <i className="fa-solid fa-circle-check me-1" />
                          {t("jobs.active_recommendations")}
                        </span>
                      )}
                    </div>
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
                                  src={resolveCompanyLogoUrl(item?.companyId?.logo)}
                                  alt={item?.companyId?.brandName || "Company"}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = DEFAULT_COMPANY_LOGO;
                                  }}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                              <div className="card-header-text">
                                <p
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
                                    t("jobs.unknown_company")}
                                </p>
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
                                        : t("jobs.recently_posted")}
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
                                {item.jobTitle || t("header.jobTitle")}
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
                                  : t("header.category")}
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
                                      : t("jobs.full_time")}
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
                                {item?.companyId?.city || t("header.location")}
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
                  {/* ⌛ Expired Job Notice & Disabled Button */}
                  {expiredListing ? (
                    <div className="job-expired-sidebar-wrap w-100">
                      <button
                        type="button"
                        className="btn-modern-primary w-100 btn-job-expired-disabled"
                        disabled
                        aria-disabled="true"
                        title={t("jobs.applications_closed")}
                      >
                        <i className="fa-solid fa-ban me-2" />
                        {t("jobs.applications_closed")}
                      </button>
                      <p className="job-expired-sidebar-hint text-center mt-2 mb-0">
                        <i className="fa-solid fa-circle-info me-1" />
                        {t("jobs.expired_sidebar_note")}
                      </p>
                    </div>
                  ) : job?.jobDetails?.isApplied ? (
                    <button className="btn-modern-primary w-100" disabled>
                      {job?.jobDetails?.applicationStatus || t("jobs.applied")}
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
                    <span>{t("jobs.save")}</span>
                  </button>
                  <button
                    className="tool-item"
                    title={linkUrl ? t("jobs.copy_link") : t("jobs.link_not_available")}
                    onClick={(e) => handleCopy(e, linkUrl)}
                    style={{ cursor: linkUrl ? "pointer" : "not-allowed" }}
                  >
                    <i className="fa-solid fa-link" />
                    <span>{t("jobs.share")}</span>
                  </button>
                  <button
                    type="button"
                    className="tool-item text-decoration-none btn btn-link p-0 border-0"
                    data-bs-toggle="modal"
                    data-bs-target="#reportJobModal"
                    title={t("jobs.report_job_tooltip") || "Report this job"}
                    style={{ background: "transparent", color: "inherit" }}
                  >
                    <i className="fa-solid fa-flag text-danger" />
                    <span>{t("jobs.report") || "Report"}</span>
                  </button>
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
                  <h3 className="sidebar-sub-title">{t("jobs.about_company")}</h3>
                  <p className="sidebar-company-name">
                    <Link
                      className="job-company-link-minimal text-decoration-none"
                      to={`/${job?.jobDetails?.companyId?.slug}`}
                      state={{ companyId: job?.jobDetails?.companyId?._id }}
                    >
                      {job?.jobDetails?.companyId?.brandName ||
                        t("jobs.unknown_company")}
                    </Link>
                  </p>
                  <div className="side-company-description rich-text-content company-description-clamped mt-3">
                    <SafeHtml
                      as="p"
                      html={job?.jobDetails?.companyId?.aboutCompany}
                      decode
                      fallback={t("jobs.no_company_description")}
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
                          t("jobs.unknown_company")}
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
                            <p
                              className="compact-job-title text-capitalize"
                              style={{
                                fontSize: "0.95rem",
                                fontWeight: "700",
                                color: "rgb(15, 23, 42)",
                                margin: "0 0 0.5rem",
                              }}
                            >
                              {item?.jobTitle || "Job Title"}
                            </p>

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
                                  : t("jobs.recently_posted")}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-muted">{t("header.no_jobs")}</p>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
        <JobApplyModal
          resumeList={resumeList}
          coverLetterList={coverLetterList}
          selectedResumeUrl={selectedResumeUrl}
          selectedCoverLetterUrl={selectedCoverLetterUrl}
          selectedCustomFile={selectedCustomFile}
          isApplying={isApplying}
          isUploadingCv={isUploadingCv}
          isUploadingCover={isUploadingCover}
          fileInputRef={fileInputRef}
          cvUploadInputRef={cvUploadInputRef}
          coverUploadInputRef={coverUploadInputRef}
          onSelect={handleSelect}
          onFileUpload={handleFileUpload}
          onUploadCv={handleCvUpload}
          onUploadCover={handleCoverUpload}
          onApply={handleApplyJob}
          onClose={resetApplyModal}
          onClearCustom={clearCustomFile}
          isSelectionMade={isSelectionMade()}
        />
        <ReportJobModal
          modalId="reportJobModal"
          jobId={job?.jobDetails?._id || id}
          jobTitle={job?.jobDetails?.jobTitle}
          companyName={job?.jobDetails?.companyId?.brandName}
        />
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
                <span className="modal-title fs-5 fw-bold" id="skillAssessmentModalLabel">
                  <i className="fa-solid fa-file"></i>Test Required
                </span>
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
                    <p className="assessment-subtitle fw-semibold">
                      {assessment?.assessmentName}
                    </p>
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
                    <p className="assessment-note fw-semibold">{t("jobs.important")}</p>
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
                      <p className="assessment-question">What is the output of typeof null in javaScript?</p>
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
                      <p className="assessment-question">Are is the output of typeof null in javaScript?</p>
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
                      <p className="assessment-question">Why is the output of typeof null in javaScript?</p>
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
                      <p className="assessment-question">This is the output of typeof null in javaScript?</p>
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
                      <p className="assessment-question">
                        React.js is the output of typeof null in javaScript?
                      </p>
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
                  <p className="modal-section-title">Finish Test?</p>
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
