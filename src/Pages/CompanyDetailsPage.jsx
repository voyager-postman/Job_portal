import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {isAuthReady, getRequestConfig } from "../utils/apiHeaders";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import JobApplyModal from "../components/JobApplyModal";
import { useJobApply } from "../hooks/useJobApply";
import { getJobApplyModalProps } from "../utils/jobApplyModalProps";
import PageSEO from "../components/PageSEO";
import {
  absoluteUrl,
  buildCompanyOrganizationSchema,
  buildBreadcrumbSchema,
  stripHtml,
  SITE,
} from "../utils/seo";
import "./Main.css";
function CompanyDetailsPage() {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token"); // 🔹 assuming JWT is stored here
  const userRole = localStorage.getItem("user_role");
  const [aboutMuted, setAboutMuted] = useState(true);
  const [aboutLoaded, setAboutLoaded] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [loadedVideo, setLoadedVideo] = useState({});
  const [mutedVideos, setMutedVideos] = useState({});
  const [linkUrl, setLinkUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { companySlug } = useParams();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedJobId, setCopiedJobId] = useState(null);
  const from = location.state?.from || "/";
  const [showVideoModal, setShowVideoModal] = useState(false);
  // const breadcrumbLabel = from.includes("/manage-job-application")
  //   ? t("applications.manage_job_application")
  //   : t("breadcrumbs.search_company_list");

  const breadcrumbLabel = from?.includes("/manage-job-application")
    ? t("applications.manage_job_application")
    : from?.includes("/companies-list")
      ? t("breadcrumbs.search_company_list")
      : from?.includes("/companies")
        ? t("header.companies")
        : // : from?.includes("/")
          //   ? "Home"
          t("breadcrumbs.search_company_list");

  const getCompanyDetails = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}GetCompanyDetails/${companySlug}`,
        getRequestConfig(),
      );
      setCompany(res?.data?.company);
    } catch (error) {
      console.error("Error fetching company details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companySlug) getCompanyDetails();
  }, [companySlug]);

  const apply = useJobApply({
    t,
    onApplySuccess: () => {
      if (companySlug) getCompanyDetails();
    },
  });
  const { setJobId } = apply;

  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // Optionally decode twice if double-encoded
  const decodedHtml = decodeHtml(decodeHtml(company?.aboutCompany || ""));
  function decodeHtml1(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
  const getYouTubeEmbedUrl1 = (url) => {
    if (!url) return "";

    let videoId = "";

    if (url.includes("/shorts/")) {
      videoId = url.split("/shorts/")[1].split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1`;
  };
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";

    // Shorts URL
    if (url.includes("/shorts/")) {
      const videoId = url.split("/shorts/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Watch URL
    if (url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // youtu.be URL
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };
  const openApplyModal = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthReady() || userRole !== "JobSeeker") {
      navigate("/login");
      return;
    }

    setJobId(id);
    handleJobClick(id);

    const modalEl = document.getElementById("exampleModal");
    if (modalEl) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  };

  // Double decode for escaped HTML
  const decodedHtml1 = decodeHtml1(decodeHtml1(company?.careerDetail || ""));
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

        // Optional: Optimistic UI update
        // setJobList((prevJobs) =>
        //   prevJobs.map((job) =>
        //     job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        //   )
        // );

        if (companySlug) getCompanyDetails();
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

  // ✅ Decode the careerDetail content
  const decodedCareerDetail = decodeHtml(
    decodeHtml(company?.careerDetail || ""),
  );

  const handleCopy = async (e, linkUrl, jobId) => {
    console.log(linkUrl);
    e.preventDefault();

    // ❌ No link case
    if (!linkUrl) {
      toast.error(t("jobs.link_not_available_toast"), {
        autoClose: 1500,
        theme: "colored",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(linkUrl);
      setCopiedJobId(jobId);

      // reset after 2 sec
      setTimeout(() => setCopiedJobId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error(t("jobs.failed_copy_link"));
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
  const getYoutubeId = (url) => {
    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/;
    const match = url?.match(regExp);
    return match ? match[1] : "";
  };

  const mediaType = company?.aboutPremium?.media?.type;
  const mediaUrl = company?.aboutPremium?.media?.url;
  const videoId = getYoutubeId(mediaUrl);
  const mediaItems = [
    ...(company?.photos || []).map((photo) => ({
      ...photo,
      type: "photo",
    })),
    ...(company?.videos || []).map((video) => ({
      ...video,
      type: "video",
    })),
  ];
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  const shuffledMedia = React.useMemo(() => {
    return shuffleArray(mediaItems);
  }, [company]);
  const addCrossOriginToHtml = (html) => {
    if (!html) return "";

    return html.replace(
      /<img([^>]*?)src=/g,
      '<img crossorigin="anonymous"$1src=',
    );
  };
  return (
    <>
      <PageSEO
        title={
          company?.brandName ||
          company?.companyName ||
          (companySlug ? companySlug.replace(/-/g, " ") : t("jobs.company_profile"))
        }
        description={
          company?.aboutCompany
            ? stripHtml(company.aboutCompany)
            : SITE.defaultDescription
        }
        canonical={`/${companySlug}`}
        image={company?.logo}
        jsonLd={[
          company
            ? buildCompanyOrganizationSchema(
                company,
                absoluteUrl(`/${companySlug}`),
              )
            : null,
          buildBreadcrumbSchema([
            { name: t("header.home"), path: "/" },
            { name: t("header.companies"), path: "/companies" },
            {
              name:
                company?.brandName ||
                company?.companyName ||
                t("breadcrumbs.company_details"),
              path: `/${companySlug}`,
            },
          ]),
        ]}
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
                    {from !== "/companies" && (
                      <li>
                        <Link to="/candidate-dashboard">{t("header.dashboard")}</Link>
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
                        : company?.brandName ||
                          company?.brandName ||
                          t("breadcrumbs.company_details")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <article className="company-details-container">
        <section className="company-hero-section">
          <img
            crossOrigin="anonymous"
            className="company-hero-image"
            alt={`${company?.brandName || t("breadcrumbs.company_details")} cover`}
            loading="eager"
            src={
              company?.coverPhoto
                ? `${API_IMAGE_URL}${company.coverPhoto}` // Replace API_IMAGE_URL with your base URL
                : "assets/images/company/company-img-1.jpg" // default image
            }
          />
        </section>
        <div className="container">
          <div className="company-branding-area">
            <div className="branding-card-content">
              <div className="company-logo-wrapper">
                <img
                  crossOrigin="anonymous"
                  alt={`${company?.brandName || t("breadcrumbs.company_details")} logo`}
                  src={
                    company?.logo
                      ? `${API_IMAGE_URL}${company?.logo}` // Replace API_IMAGE_URL with your base URL
                      : "assets/images/partner-logo/partner-logo-2.png" // default image
                  }
                />
              </div>
              <div className="company-title-info">
                <h1>{company?.brandName}</h1>
                <div className="company-badges">
                  <span className="badge-item">
                    <i className="fa-solid fa-building me-1" />{" "}
                    {company?.industries || "N/A"}
                  </span>
                  <span className="badge-item">
                    <i className="fa-solid fa-location-dot me-1" />{" "}
                    {company?.city || "N/A"}
                  </span>
                </div>
              </div>
              <div className="branding-actions d-flex flex-wrap gap-3 mt-3 mt-lg-0">
                <button
                  className="btn btn-primary px-4 py-2 rounded-pill fw-bold"
                  style={{
                    "background-color": "rgb(251, 118, 26)",
                    "border-color": "rgb(251, 118, 26)",
                  }}
                >
                  <i className="fa-solid fa-plus me-2" />
                  Suivre
                </button>
              </div>
            </div>
          </div>
          <div className="company-nav-tabs">
            <ul
              className="nav nav-tabs justify-content-center border-0"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#about-tab"
                  aria-selected="false"
                  role="tab"
                  tabIndex={-1}
                >
                  L'entreprise
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#teams-tab"
                  aria-selected="false"
                  tabIndex={-1}
                  role="tab"
                >
                  Teams
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link "
                  data-bs-toggle="tab"
                  href="#jobs-tab"
                  aria-selected="true"
                  role="tab"
                >
                  Offres d'emploi ({company?.jobs?.length || 0})
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#career-tab"
                  aria-selected="false"
                  tabIndex={-1}
                  role="tab"
                >
                  Carrière
                </a>
              </li>
            </ul>
          </div>
          <div className="main-content-grid">
            <div className="content-left">
              <div className="tab-content mt-2">
                <div
                  id="about-tab"
                  className="tab-pane fade show active"
                  role="tabpanel"
                >
                  <div className="content-section border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white mb-4">
                    <div className="about-premium-wrapper">
                      <div className="about-premium-header">
                        <h2> {company?.aboutPremium?.mainTitle}</h2>
                        <p className="lead">
                          {company?.aboutPremium?.subtitle}
                        </p>
                      </div>
                      <div
                        className="about-premium-content row align-items-center mb-4"
                        style={{}}
                      >
                        <div className="col-lg-6 about-text-column position-relative z-1">
                          <p>{company?.aboutPremium?.description1}</p>
                          <p>{company?.aboutPremium?.description2}</p>
                          <div className="quote-highlight">
                            {company?.aboutPremium?.quote}
                          </div>
                        </div>
                        <div className="col-lg-6 mt-5 mt-lg-0 text-center">
                          <div className="image-reveal-container">
                            <div className="about-premium-video-wrapper position-relative">
                              {/* If Video */}
                              {mediaType === "video" && mediaUrl ? (
                                <>
                                  {!aboutLoaded && (
                                    <div className="video-loader">
                                      <div className="spinner-border text-light" />
                                    </div>
                                  )}

                                  <iframe
                                    id="about-video-iframe"
                                    src={`${getYouTubeEmbedUrl(mediaUrl)}?enablejsapi=1&autoplay=1&mute=${
                                      aboutMuted ? 1 : 0
                                    }&loop=1&controls=0&modestbranding=1&playsinline=1`}
                                    title={t("jobs.about_us_video")}
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media; picture-in-picture"
                                    allowFullScreen
                                    className="about-premium-video"
                                    onLoad={() => setAboutLoaded(true)}
                                  />

                                  <button
                                    className="video-mute-btn shadow"
                                    title="Sound Toggle"
                                    onClick={() => setAboutMuted(!aboutMuted)}
                                  >
                                    <i
                                      className={`fa-solid ${
                                        aboutMuted
                                          ? "fa-volume-xmark"
                                          : "fa-volume-high"
                                      }`}
                                    />
                                  </button>
                                </>
                              ) : null}

                              {/* If Image */}
                              {mediaType === "image" && mediaUrl ? (
                                <img
                                  src={`${API_IMAGE_URL}${mediaUrl}`}
                                  alt={t("jobs.about_company_alt")}
                                  className="about-premium-video"
                                  crossOrigin="anonymous"
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="employee-reviews-section mt-5 border-top pt-5">
                      <h2
                        className="fw-bold mb-4 text-center"
                        style={{
                          color: "rgb(26, 26, 26)",
                          fontSize: "1.8rem",
                        }}
                      >
                        L'expérience de nos collaborateurs
                      </h2>

                      {company?.aboutPremium?.employeeExperience?.length >
                        0 && (
                        <div
                          id="reviewsCarousel"
                          className="carousel slide reviews-carousel-container shadow-sm rounded-4 bg-light p-4 p-md-5"
                          data-bs-ride="carousel"
                        >
                          {/* Slides */}
                          <div className="carousel-inner">
                            {company.aboutPremium.employeeExperience.map(
                              (item, index) => (
                                <div
                                  key={item._id}
                                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                                  data-bs-interval={5000}
                                >
                                  <div className="review-card-content text-center px-md-5">
                                    <i className="fa-solid fa-quote-left review-quote-icon mb-4" />

                                    <p className="review-text fs-5 font-italic text-muted mb-4">
                                      {item.testimony}
                                    </p>

                                    <div className="reviewer-profile d-flex flex-column align-items-center">
                                      <img
                                        alt={item.fullName}
                                        className="reviewer-avatar mb-3 shadow-sm"
                                        crossOrigin="anonymous"
                                        src={
                                          item.photo
                                            ? `${API_IMAGE_URL}${item.photo}`
                                            : "assets/images/userIcon.png"
                                        }
                                      />

                                      <p
                                        className="fw-bold mb-1 reviewer-name"
                                        style={{ color: "rgb(26, 26, 26)" }}
                                      >
                                        {item.fullName}
                                      </p>

                                      <span
                                        style={{
                                          color: "rgb(251, 118, 26)",
                                          fontWeight: "600",
                                          fontSize: "0.95rem",
                                        }}
                                      >
                                        {item.role}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>

                          {/* Prev */}
                          <button
                            className="carousel-control-prev custom-carousel-nav"
                            type="button"
                            data-bs-target="#reviewsCarousel"
                            data-bs-slide="prev"
                          >
                            <span
                              className="carousel-control-prev-icon review-nav-bg shadow"
                              aria-hidden="true"
                            />
                            <span className="visually-hidden">{t("jobs.previous")}</span>
                          </button>

                          {/* Next */}
                          <button
                            className="carousel-control-next custom-carousel-nav"
                            type="button"
                            data-bs-target="#reviewsCarousel"
                            data-bs-slide="next"
                          >
                            <span
                              className="carousel-control-next-icon review-nav-bg shadow"
                              aria-hidden="true"
                            />
                            <span className="visually-hidden">{t("jobs.next")}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="content-section border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white mb-4">
                    <h2
                      className="fw-bold mb-4"
                      style={{
                        color: "rgb(26, 26, 26)",
                        fontSize: "1.8rem",
                      }}
                    >
                      La vie chez Deloitte
                    </h2>

                    <p className="text-muted mb-4 fs-5">
                      Découvrez notre quotidien, nos espaces et l'énergie de nos
                      équipes.
                    </p>

                    <div className="media-grid-modern">
                      {shuffledMedia.map((item) => {
                        if (item.type === "photo") {
                          return (
                            <div className="media-item-modern" key={item._id}>
                              <a
                                href={`${API_IMAGE_URL}${item.url}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  crossOrigin="anonymous"
                                  alt={t("header.company")}
                                  loading="lazy"
                                  src={`${API_IMAGE_URL}${item.url}`}
                                />
                                <div className="media-item-overlay">
                                  <i className="fa-solid fa-expand" />
                                </div>
                              </a>
                            </div>
                          );
                        }

                        // VIDEO (reuse your existing logic)
                        const getYoutubeId = (url = "") => {
                          const regExp =
                            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?/]+)/;
                          const match = url.match(regExp);
                          return match ? match[1] : "";
                        };

                        const videoId = getYoutubeId(item.url);
                        const isHover = hoveredVideo === item._id;
                        const isLoaded = loadedVideo[item._id];
                        const isMuted = mutedVideos[item._id] !== false;

                        return (
                          <div
                            className="media-item-modern video-media-item position-relative"
                            key={item._id}
                            onMouseEnter={() => setHoveredVideo(item._id)}
                            onMouseLeave={() => setHoveredVideo(null)}
                          >
                            <a href={item.url} target="_blank" rel="noreferrer">
                              {isHover && !isLoaded && (
                                <div className="video-loader">
                                  <div
                                    className="spinner-border text-light"
                                    role="status"
                                  />
                                </div>
                              )}

                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=${
                                  isHover ? 1 : 0
                                }&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}`}
                                title={t("jobs.company_video")}
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                className="grid-video-iframe"
                                onLoad={() =>
                                  setLoadedVideo((prev) => ({
                                    ...prev,
                                    [item._id]: true,
                                  }))
                                }
                              />

                              {!isHover && (
                                <div className="video-overlay-play">
                                  <i className="fa-solid fa-play" />
                                </div>
                              )}
                            </a>

                            <button
                              type="button"
                              className="sound-toggle-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                setMutedVideos((prev) => ({
                                  ...prev,
                                  [item._id]: !isMuted,
                                }));
                              }}
                            >
                              <i
                                className={`fa-solid ${
                                  isMuted ? "fa-volume-xmark" : "fa-volume-high"
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mission-vision-wrapper mb-4">
                    <div className="mission-card">
                      <div className="d-flex align-items-center mb-4 text-primary">
                        <i
                          className="fa-solid fa-bullseye me-3 mb-0"
                          style={{
                            "font-size": "2.2rem",
                            color: "rgb(251, 118, 26)",
                          }}
                        />
                        <h2
                          className="fw-bold mb-0"
                          style={{ color: "rgb(26, 26, 26)" }}
                        >
                          Notre mission
                        </h2>
                      </div>
                      <p
                        className="text-muted fs-6"
                        style={{ "line-height": "1.7", "font-size": "1.05rem" }}
                      >
                        {company?.aboutPremium?.mission}
                      </p>
                    </div>
                    <div className="mission-card">
                      <div className="d-flex align-items-center mb-4 text-primary">
                        <i
                          className="fa-regular fa-lightbulb me-3 mb-0"
                          style={{
                            "font-size": "2.2rem",
                            color: "rgb(251, 118, 26)",
                          }}
                        />
                        <h2
                          className="fw-bold mb-0"
                          style={{ color: "rgb(26, 26, 26)" }}
                        >
                          Notre vision
                        </h2>
                      </div>
                      <p
                        className="text-muted fs-6"
                        style={{ "line-height": "1.7", "font-size": "1.05rem" }}
                      >
                        {company?.aboutPremium?.vision}
                      </p>
                    </div>
                  </div>
                </div>
                <div id="teams-tab" className="tab-pane fade" role="tabpanel">
                  <div className="content-section">
                    <h2>Rencontrez l'équipe</h2>

                    {/* First Team Member = CEO Section */}
                    {company?.aboutPremium?.leader && (
                      <div className="ceo-section">
                        <div className="ceo-image-wrapper">
                          <img
                            crossOrigin="anonymous"
                            className="ceo-image"
                            src={
                              company?.aboutPremium?.leader?.photo
                                ? `${API_IMAGE_URL}${company.aboutPremium.leader.photo}`
                                : "assets/images/userIcon.png"
                            }
                            alt={company?.aboutPremium?.leader?.name}
                          />
                        </div>

                        <div className="ceo-content">
                          <p className="ceo-name fw-bold mb-1">
                            {company?.aboutPremium?.leader?.name}
                          </p>

                          <p className="ceo-position text-muted mb-3">
                            {company?.aboutPremium?.leader?.position}
                          </p>

                          <p className="ceo-quote">
                            {company?.aboutPremium?.leader?.message}
                          </p>

                          {company?.aboutPremium?.leader?.interviewVideo && (
                            <div className="mt-4">
                              <button
                                type="button"
                                onClick={() => setShowVideoModal(true)}
                                className="btn btn-outline-light rounded-pill px-4"
                              >
                                <i className="fa-brands fa-youtube me-2" />
                                Voir l'interview vidéo
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Remaining Team Members */}
                    <div className="teams-grid">
                      {company?.aboutPremium?.team?.map((member) => (
                        <div className="team-card" key={member._id}>
                          <div className="team-card-header">
                            <img
                              className="team-avatar"
                              crossOrigin="anonymous"
                              src={
                                member?.photo
                                  ? `${API_IMAGE_URL}${member.photo}`
                                  : "assets/images/userIcon.png"
                              }
                              alt={member.fullName}
                            />

                            <div className="team-info">
                              <p className="team-member-name fw-bold mb-1">
                                {member.fullName}
                              </p>
                              <p>{member.post}</p>
                            </div>
                          </div>

                          <div className="testimonial-text">
                            <p>{member.testimonial}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* If No Data */}
                    {company?.aboutPremium?.team?.length === 0 && (
                      <p className="text-muted">{t("jobs.no_team_data")}</p>
                    )}
                  </div>
                </div>
                <div
                  id="jobs-tab"
                  className="tab-pane fade show"
                  role="tabpanel"
                >
                  <div className="content-section">
                    <h2>Offres d'emploi disponibles</h2>
                    {company?.jobs?.length > 0 ? (
                      company.jobs.map((job) => (
                        <div
                          className="elegant-job-card-wrapper position-relative"
                          key={job._id}
                        >
                          <Link
                            to={`/job/${job.slug}`}
                            state={{
                              JobId: job._id,
                            }}
                            className="elegant-job-card"
                          >
                            <div className="job-card-main">
                              <h3 className="job-card-title">
                                {job.jobTitle || "N/A"}
                              </h3>
                              <div className="job-meta">
                                <span>
                                  <i className="fa-solid fa-location-dot" />{" "}
                                  {job.city?.length
                                    ? job.city.join(", ")
                                    : "N/A"}
                                </span>
                                <span>
                                  <i className="fa-solid fa-briefcase" />{" "}
                                  {job.minimumLevel?.name || "N/A"}
                                </span>
                                <span>
                                  <i className="fa-solid fa-house-laptop" />{" "}
                                  {job?.employmentType?.name || "N/A"}
                                </span>
                                <span>
                                  <i className="fa-solid fa-calendar" /> Publié
                                  le
                                  {new Date(job.createdAt).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="job-card-action d-flex align-items-center gap-3">
                              {job?.isApplied ? (
                                <button
                                  style={{
                                    color: "rgb(251, 118, 26)",
                                    borderColor: "rgb(251, 118, 26)",
                                    width: "150px", // 👈 force same width
                                    textAlign: "center",
                                  }}
                                  className="btn btn-outline-primary rounded-pill px-4"
                                  disabled
                                >
                                  {job?.applicationStatus}
                                </button>
                              ) : job?.isAssessmentRequired ? (
                                <Link
                                  to={`/job/${job.slug}`}
                                  state={{
                                    JobId: job._id,
                                  }}
                                  className="btn btn-outline-primary rounded-pill px-4"
                                  style={{
                                    color: "rgb(251, 118, 26)",
                                    borderColor: "rgb(251, 118, 26)",
                                    width: "150px",
                                    textAlign: "center",
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {t("header.view_details")}
                                </Link>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary rounded-pill px-4"
                                    style={{
                                      color: "rgb(251, 118, 26)",
                                      borderColor: "rgb(251, 118, 26)",
                                      width: "150px",
                                      textAlign: "center",
                                    }}
                                    onClick={(e) => openApplyModal(e, job._id)}
                                  >
                                    {t("header.apply_now")}
                                  </button>
                                  <Link
                                    to={`/job/${job.slug}`}
                                    state={{
                                      JobId: job._id,
                                    }}
                                    className="btn btn-outline-primary rounded-pill px-4"
                                    style={{
                                      color: "rgb(251, 118, 26)",
                                      borderColor: "rgb(251, 118, 26)",
                                      width: "150px",
                                      textAlign: "center",
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {t("header.view_details")}
                                  </Link>
                                </>
                              )}
                              <i
                                className={`fa-${
                                  job.isSaved ? "solid" : "regular"
                                } fa-heart fs-5`}
                                style={{
                                  cursor: "pointer",
                                  color: job.isSaved ? "#fb761a" : "#dc3545",
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSaveJob(job._id);
                                }}
                              />
                            </div>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">{t("header.no_jobs")}</p>
                    )}
                  </div>
                </div>
                <div id="career-tab" className="tab-pane fade" role="tabpanel">
                  <div className="content-section">
                    <h2>{t("jobs.work_at_company", { company: company?.brandName || company?.companyName || "" })}</h2>

                    <div className="company-rich-text">
                      {decodedCareerDetail?.trim() ? (
                        <div
                          className="company-career-detail"
                          dangerouslySetInnerHTML={{
                            __html: addCrossOriginToHtml(decodedCareerDetail),
                          }}
                        />
                      ) : (
                        <p className="text-muted">{t("jobs.no_career_details")}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-right">
              <div className="sidebar-fact-card">
                <p className="sidebar-title">En un coup d'œil</p>
                <div className="fact-item">
                  <div className="fact-icon">
                    <i className="fa-solid fa-users" />
                  </div>
                  <div className="fact-detail">
                    <p className="fact-label">Taille de l'entreprise</p>
                    <p>{company?.numberOfEmployees || "N/A"}</p>
                  </div>
                </div>
                <div className="fact-item">
                  <div className="fact-icon">
                    <i className="fa-solid fa-industry" />
                  </div>
                  <div className="fact-detail">
                    <p className="fact-label">{t("jobs.sector")}</p>
                    <p>{company?.industries || "N/A"}</p>
                  </div>
                </div>
                <div className="fact-item">
                  <div className="fact-icon">
                    <i className="fa-solid fa-location-dot" />
                  </div>
                  <div className="fact-detail">
                    <p className="fact-label">Siège social</p>
                    <p>{company?.city || "N/A"}</p>
                  </div>
                </div>
                <div className="fact-item">
                  <div className="fact-icon">
                    <i className="fa-solid fa-phone" />
                  </div>
                  <div className="fact-detail">
                    <p className="fact-label">{t("jobs.contact")}</p>
                    <p>
                      {" "}
                      +{company?.phone?.countryCode} {company?.phone?.number}
                    </p>
                  </div>
                </div>
                <hr />
                {company?.links?.website ||
                company?.links?.linkedin ||
                company?.links?.facebook ||
                company?.links?.instagram ||
                company?.links?.twitter ? (
                  <>
                    <p className="sidebar-title mt-4">{t("jobs.official_links")}</p>

                    <div className="social-links-grid">
                      {/* Website */}
                      {company?.links?.website && (
                        <a
                          href={company.links.website}
                          target="_blank"
                          rel="noreferrer"
                          className="social-link-btn"
                          title="Website"
                        >
                          <i className="fa-solid fa-globe" />
                        </a>
                      )}

                      {/* LinkedIn */}
                      {company?.links?.linkedin && (
                        <a
                          href={company.links.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="social-link-btn"
                          title="LinkedIn"
                        >
                          <i className="fa-brands fa-linkedin" />
                        </a>
                      )}

                      {/* Facebook */}
                      {company?.links?.facebook && (
                        <a
                          href={company.links.facebook}
                          target="_blank"
                          rel="noreferrer"
                          className="social-link-btn"
                          title="Facebook"
                        >
                          <i className="fa-brands fa-facebook-f" />
                        </a>
                      )}

                      {/* Instagram */}
                      {company?.links?.instagram && (
                        <a
                          href={company.links.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="social-link-btn"
                          title="Instagram"
                        >
                          <i className="fa-brands fa-instagram" />
                        </a>
                      )}

                      {/* Twitter / X */}
                      {company?.links?.twitter && (
                        <a
                          href={company.links.twitter}
                          target="_blank"
                          rel="noreferrer"
                          className="social-link-btn"
                          title="Twitter"
                        >
                          <i className="fa-brands fa-x-twitter" />
                        </a>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="sidebar-title mt-4">{t("jobs.official_links")}</p>
                    <p className="text-muted">
                      Aucun lien officiel disponible.
                    </p>
                  </>
                )}
                <div className="mt-4 pt-3 border-top">
                  <p className="text-muted small mb-3">
                    Besoin d'en savoir plus sur nos processus de recrutement ?
                  </p>
                  <a
                    href={
                      company?.links?.officialWebsite ||
                      "https://itdevelopmentservices.com/jobPortal/"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-dark w-100 rounded-pill"
                  >
                    Consulter le site
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      <Modal
        show={showVideoModal}
        onHide={() => setShowVideoModal(false)}
        centered
        size="xl"
        backdrop="static"
        dialogClassName="custom-video-modal"
      >
        <Modal.Body className="p-0 position-relative bg-dark rounded-4 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => setShowVideoModal(false)}
            className="btn btn-dark position-absolute top-0 end-0 m-3 rounded-circle"
            style={{ zIndex: 10 }}
          >
            <i className="fa-solid fa-xmark text-white"></i>
          </button>

          {/* Responsive Video */}
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
            }}
          >
            <iframe
              title="YouTube Video"
              src={getYouTubeEmbedUrl1(
                company?.aboutPremium?.leader?.interviewVideo,
              )}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
      <JobApplyModal {...getJobApplyModalProps(apply)} />
    </>
  );
}

export default CompanyDetailsPage;
