import Slider from "react-slick";
import { FaStar, FaQuoteLeft, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "odometer/themes/odometer-theme-default.css";
import Odometer from "react-odometerjs";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "odometer/themes/odometer-theme-default.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import OwlCarousel from "react-owl-carousel3";
import { Link } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { useTranslation } from "react-i18next";
import {
  handleCompanyLogoError,
  handleJobCoverError,
  resolveCompanyLogoUrl,
  resolveJobCoverUrl,
} from "../utils/companyLogo";
import { SITE } from "../utils/seo";
import "./HomeJobs.css";

const NextArrow = ({ onClick }) => (
  <button className="custom-arrow next-arrow" onClick={onClick}>
    <FaArrowRight />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button className="custom-arrow prev-arrow" onClick={onClick}>
    <FaArrowLeft />
  </button>
);

const getJobPostedLabel = (job) =>
  job?.posted ||
  (job?.createdAt ? moment(job.createdAt).fromNow() : "N/A");

const getJobLocation = (job) => job?.location || job?.city || "N/A";

const getJobCompanyName = (job) => job?.companyName || job?.brandName || "N/A";

const getJobCardCoverImage = (job) => resolveJobCoverUrl(job, job?._id);

const isJobSalaryNegotiable = (job) =>
  job?.salaryNegotiable === true ||
  job?.privatJobDetails?.salaryNegotiable === true;

const formatJobSalaryDisplay = (job, currencyCode = "MAD") => {
  if (isJobSalaryNegotiable(job)) {
    return "";
  }

  if (job?.salary) {
    return `${String(job.salary).trim()} ${currencyCode}`;
  }

  const minSalary = job?.privatJobDetails?.minSalary;
  const maxSalary = job?.privatJobDetails?.maxSalary;

  if (minSalary || maxSalary) {
    return `${minSalary || 0} - ${maxSalary || 0} ${currencyCode}`;
  }

  return "";
};

import { isJobFeaturedOnHomepage } from "../utils/featuredJobDisplay";

function Home() {
  const { t, i18n } = useTranslation("global");
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [categories1, setCategories1] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [homeData, setHomeData] = useState({});
  const userRole = localStorage.getItem("user_role");
  const navigate = useNavigate();
  const [jobList, setJobList] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [blogData, setBlogData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    keywords: "",
    location: "",
    category: "",
  });
  const [stats, setStats] = useState([]);
  const [homePageStats, setHomePageStats] = useState(null);
  const [globalCurrency, setGlobalCurrency] = useState({
    code: "MAD",
    symbol: "DH",
  });

  const fetchGlobalCurrency = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getGlobalCurrency`);

      if (res.data.success) {
        setGlobalCurrency({
          code: res.data.data?.code || "MAD",
          symbol: res.data.data?.symbol || "DH",
        });
      }
    } catch (error) {
      console.error("Error fetching global currency:", error);
    }
  };

  const parseJobStatsFromText = (text = "") => {
    const liveMatch = text.match(/(\d[\d,]*)\s*jobs?\s*live/i);
    const todayMatch = text.match(/(\d[\d,]*)\s*added\s*today/i);

    return {
      live: liveMatch ? Number(liveMatch[1].replace(/,/g, "")) : 0,
      today: todayMatch ? Number(todayMatch[1].replace(/,/g, "")) : 0,
    };
  };

  const getStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getHomePageStats`);

      const data = res.data.data;

      setHomePageStats(data);

      const formattedStats = [
        {
          icon: "flaticon-bag",
          count: data.jobsAdded || 0,
          label: t("header.jobsAdded"),
          showPlus: true,
        },
        {
          icon: "flaticon-office-building",
          count: data.companies || 0,
          label: t("header.companies"),
        },
        {
          icon: "flaticon-cv",
          count: data.resumes || 0,
          label: t("header.resume"),
        },
        {
          icon: "flaticon-member",
          count: data.jobseeker ?? data.jobSeeker ?? 0,
          label: t("header.candidates"),
        },
      ];

      setStats(formattedStats);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStats();
    fetchGlobalCurrency();
  }, []);
  useEffect(() => {
    const getTopJobCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}getTopJobCategories`);
        if (res.data?.data) {
          // Map API data to { icon, label } format
          const formattedCategories = res.data.data.map((cat) => ({
            icon: "flaticon-web-development", // you can customize icons per category
            label: `${cat.categoryName} (${cat.totalJobs})`,
          }));

          setCategories1(formattedCategories);
        }
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };

    getTopJobCategories();
  }, []);
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}getTopRatedCandidates`);
        if (res.data.success && res.data.data) {
          setCandidates(res.data.data.slice(0, 6)); // Only show first 6
        }
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
      }
    };

    fetchCandidates();
  }, []);
  const getCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getJobCategory`);
      setCategories(res.data.jobCategories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const getAllJobList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getHomePageJobs`, {
        params: { page: 1 },
      });

      setJobList(res.data?.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    getAllJobList();
  }, []);
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}getHomePage`);

        const data = res.data?.data;

        setHomeData(data);

        // trending keywords
        if (data?.firstSection?.trendingKeywords) {
          setTrendingKeywords(data.firstSection.trendingKeywords);
        }

        // banner images
        if (data?.firstSection?.firstSectionImages) {
          setBannerImages(data.firstSection.firstSectionImages);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchHomeData();
  }, []);
  useEffect(() => {
    getCategories();
  }, []);
  const getBlogList = async (page = 1, limit = pageSize) => {
    try {
      const params = {
        page,
        limit,
      };

      const res = await axios.get(`${API_BASE_URL}getActiveBlogs`, {
        params,
      });
      if (res.data.success) {
        setBlogData(res.data.data);
        setPageSize(res.data.limit);
        setPageNumber(res.data.page);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Error Fetching Blog Data:-", error);
    }
  };

  useEffect(() => {
    getBlogList(pageNumber);
  }, [pageNumber]);
  const cleanImageUrl = (url) => {
    if (!url) return "";

    // ✅ Default local dashboard image
    if (url === "/jobPortal/assets/images/dashboard/images1.png") {
      return url;
    }

    // ✅ Fix wrong stored URL like "/uploads/https://..."
    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    // ✅ External image (Google, GitHub, etc.)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // ✅ Local uploaded image
    return `${API_IMAGE_URL}${url}`;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Build query params
    const queryParams = new URLSearchParams();
    if (filters.keywords) queryParams.append("keywords", filters.keywords);
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.category) queryParams.append("category", filters.category);

    // Navigate to job-search with params
    navigate(`/jobs?${queryParams.toString()}`);
  };

  const getCompanyList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getHighlightedCompanyDetailsList`);

      if (res.data.success) {
        setCompanies(res.data);
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
  };
  useEffect(() => {
    getCompanyList();
  }, []);

  const { ref, inView } = useInView({
    threshold: 0.4, // trigger when 40% is visible
    triggerOnce: true,
  });

  const handleViewCompany = (company, from) => {
    navigate(`/${company.slug}`, {
      state: { companyId: company._id, from },
    });
  };

  const companyList = companies?.companies || [];
  const companyCount = companyList.length;

  const companyCarouselOptions = useMemo(() => {
    const count = Math.max(companyCount, 1);
    const desktopItems = Math.min(count, 4);
    const tabletItems = Math.min(count, 3);
    const mobileItems = Math.min(count, 2);

    return {
      margin: 20,
      nav: companyCount > 1,
      dots: false,
      loop: companyCount > desktopItems,
      autoplay: companyCount > 1,
      autoplayTimeout: 3000,
      smartSpeed: 800,
      navText: [
        '<span class="custom-nav-arrow ">&#8249;</span>',
        '<span class="custom-nav-arrow ">&#8250;</span>',
      ],
      responsive: {
        0: {
          items: Math.min(count, 1),
        },
        576: {
          items: mobileItems,
        },
        768: {
          items: tabletItems,
        },
        992: {
          items: desktopItems,
        },
      },
    };
  }, [companyCount]);

  const settings4 = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const companyLogos = homeData?.sixthSection?.companyLogos || [];

  const settings1 = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const settings3 = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const jobs = [
    {
      image: "/jobPortal/assets/images/job/job-img-8.jpg",
      title: "Austria, Vienna",
      count: "6 Open Job",
    },
    {
      image: "/jobPortal/assets/images/job/job-img-9.jpg",
      title: "Tirana, Albania",
      count: "2 Open Job",
    },
    {
      image: "/jobPortal/assets/images/job/job-img-10.jpg",
      title: "Cardiff, UK",
      count: "8 Open Job",
    },
    {
      image: "/jobPortal/assets/images/job/job-img-7.jpg",
      title: "Kabul, Afganistan",
      count: "3 Open Job",
    },
  ];
  const settings2 = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const heroHighlight = t("header.makeABetter");
  const titleParts =
    homeData?.firstSection?.mainTitle?.split(heroHighlight) ||
    homeData?.firstSection?.mainTitle?.split("Make A Better") ||
    [];
  const title = homeData?.secondSection?.mainTitle || "";
  const words = title.split(" ");
  const thirdTitle = homeData?.thirdSection?.mainTitle || "";
  const thirdWords = thirdTitle.split(" ");
  const fourthTitle = homeData?.fourthSection?.mainTitle || "";
  const fourthWords = fourthTitle.trim().split(" ");
  const parsedJobStats = parseJobStatsFromText(
    homeData?.fourthSection?.shortParagraph || "",
  );
  const jobsLiveCount =
    homePageStats?.totalJobs ??
    homePageStats?.jobsLive ??
    homePageStats?.liveJobs ??
    parsedJobStats.live ??
    0;
  const jobsTodayCount =
    homePageStats?.jobsAddedToday ??
    homePageStats?.addedToday ??
    homePageStats?.todayJobs ??
    parsedJobStats.today ??
    0;
  const fifthTitle = homeData?.fifthSection?.mainTitle || "";
  const fifthWords = fifthTitle.trim().split(" ");
  const seventhTitle =
    homeData?.seventhSection?.mainTitle ||
    `${t("header.highestRated")} ${t("header.freelancers")}`;
  const seventhWords = seventhTitle.trim().split(" ");
  const eighthTitle =
    homeData?.eighthSection?.mainTitle ||
    `${t("header.readArticleTo")} ${t("header.getTricks")}`;
  const eighthWords = eighthTitle.trim().split(" ");
  const ninthTitle =
    homeData?.ninthSection?.mainTitle ||
    `${t("header.findNextGreat")} ${t("header.jobOpportunity")}`;
  const ninthWords = ninthTitle.trim().split(" ");

  const fifthImages = homeData?.fifthSection?.images || [];
  const heroAltLabel =
    homeData?.firstSection?.shortTitle || SITE.name;
  const cvSectionAlt =
    homeData?.fifthSection?.mainTitle || t("header.uploadYourCV");

  return (
    <>
      <section className="banner-area bg-f0f4fc" aria-label="Hero">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="banner-content">
                <div className="banner-title">
                  <span className="homespan">
                    {homeData?.firstSection?.shortTitle}
                  </span>
                  <h1>
                    {titleParts[0]}
                    <span className="oragneColor">{heroHighlight}</span>
                    {titleParts[1]}
                  </h1>
                </div>
                <div className="serech-over">
                  <span className="cw-home-section-paragraph">
                    {homeData?.firstSection?.shortParagraph}
                  </span>
                </div>
                <div className="banner-search-form">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-0">
                      <div className="col-lg-3 col-sm-6">
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="text"
                            placeholder={t("header.jobTitle")}
                            aria-label={t("header.jobTitle")}
                            value={filters.keywords}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                keywords: e.target.value,
                              })
                            }
                          />
                          <i className="flaticon-portfolio" />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="text"
                            placeholder={t("header.location")}
                            aria-label={t("header.location")}
                            value={filters.location}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                location: e.target.value,
                              })
                            }
                          />
                          <i className="flaticon-location" />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <div className="form-group style">
                          <select
                            className="form-select form-control"
                            value={filters.category}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                category: e.target.value,
                              })
                            }
                          >
                            <option value=""> {t("header.category")}</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          <i className="flaticon-list" />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <div className="search-btn">
                          <button type="submit" className="default-btn btn">
                            <i className="flaticon-search" />
                            {t("header.searchJobsBtn")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="trending-keywords">
                  <ul>
                    <li>
                      <span>{t("header.trendingKeywords")}:</span>
                    </li>
                    {trendingKeywords.map((keyword) => (
                      <li key={keyword}>
                        <Link
                          to={`/jobs?keywords=${encodeURIComponent(keyword)}`}
                        >
                          {keyword}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="shape-1">
                  <img
                    src="/jobPortal/assets/images/banner/shape-1.png"
                    alt=""
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="banner-image-content">
                <div className="row aligns-item-center">
                  {bannerImages.map((img, index) => (
                    <div className="col-lg-6 col-sm-6 col-6" key={index}>
                      <div className="banner-img-1">
                        <img
                          crossorigin="anonymous"
                          src={`${API_IMAGE_URL}${img}`}
                          alt={`${heroAltLabel} - ${index + 1}`}
                          loading={index > 1 ? "lazy" : "eager"}
                        />

                        <div className="shape-2">
                          <img
                            crossorigin="anonymous"
                            src="/jobPortal/assets/images/banner/shape-2.png"
                            alt=""
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="assisted-candidate d-none"
                  data-aos="fade-up-right"
                  data-aos-duration={1300}
                  data-aos-delay={600}
                >
                  <div className="icon">
                    <img
                      src="/jobPortal/assets/images/icon/icon-1.png"
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                  <h3>50K+</h3>
                  <span>Assisted Candidate</span>
                </div>
                <div
                  className="creative-agency d-none"
                  data-aos="fade-down-left"
                  data-aos-duration={1400}
                  data-aos-delay={600}
                >
                  <div className="icon">
                    <i className="flaticon-bag" />
                  </div>
                  <h3>Creative Agency</h3>
                  <span>Upload Your CV</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies of the Week */}
      {companyCount > 0 && (
        <section className="companies-week-slider-info">
          <div className="container">
            <div className="section-title text-center cw-home-section-header">
              <h2>
                {words.slice(0, words.length - 2).join(" ")}{" "}
                <span className="oragneColor">
                  {words.slice(words.length - 2).join(" ")}
                </span>
              </h2>
              {homeData?.secondSection?.shortParagraph && (
                <p className="cw-home-section-paragraph">
                  {homeData.secondSection.shortParagraph}
                </p>
              )}
            </div>

            <OwlCarousel
              key={`companies-week-${companyCount}`}
              className="owl-theme"
              {...companyCarouselOptions}
            >
              {companyList.map((item, index) => {
                const company = item?.companyId;
                return (
                  <div className="item" key={company?._id || `company-${index}`}>
                    {item?.isHighlighted && (
                      <span
                        className="highlight-badge"
                        title="This is a highlight-badge Company listing"
                      >
                        <i className="fa-solid fa-star"></i>
                      </span>
                    )}
                    <div className={`companies-week-box-info`}>
                      {/* ✅ Company Logo */}
                      <div className="companies-week-logo">
                        <img
                          crossOrigin="anonymous"
                          src={
                            company?.logo
                              ? `${API_IMAGE_URL}${company.logo}`
                              : "/jobPortal/assets/images/partner-logo/partner-logo-2.png"
                          }
                          alt={company?.brandName || "Company Logo"}
                        />
                      </div>
                      {/* ✅ Company Background Image */}
                      <div className="companies-week-img">
                        <img
                          crossOrigin="anonymous"
                          src={
                            company?.coverPhoto
                              ? `${API_IMAGE_URL}${company.coverPhoto}`
                              : "/jobPortal/assets/images/company/company-img-1.jpg"
                          }
                          alt={company?.brandName || "Company Cover"}
                        />
                      </div>

                      {/* ✅ Company Details */}
                      <div className="companies-week-content">
                        <h4>{company?.brandName || "Unnamed Company"}</h4>
                        <ul>
                          <li>
                            <i className="fa-solid fa-location-dot" />{" "}
                            {company?.city || "Location not available"}
                          </li>
                          <li>
                            <i className="fa-solid fa-user" />{" "}
                            {company?.numberOfEmployees || "N/A"}
                          </li>
                          <li>
                            <i className="fa-solid fa-globe" />{" "}
                            {company?.industry?.name ||
                              "Industry not specified"}
                          </li>
                        </ul>
                      </div>

                      {/* ✅ View Button */}
                      <div className="available-company-btn">
                        <button
                          className="default-btn btn"
                          onClick={() => handleViewCompany(company, "/")}
                        >
                          {t("header.viewCompany")}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </OwlCarousel>
          </div>
        </section>
      )}

      {/* Most Demanded Jobs Categories */}
      <div className="job-categories-area ptb-100">
        <div className="container">
          <div className="section-title text-center cw-home-section-header">
            <h2>
              {thirdWords.slice(0, -1).join(" ")}{" "}
              <span className="oragneColor">{thirdWords.slice(-1)}</span>
            </h2>

            {homeData?.thirdSection?.shortParagraph && (
              <p className="cw-home-section-paragraph">
                {homeData.thirdSection.shortParagraph}
              </p>
            )}
          </div>

          <div className="category-slider-wrapper">
            <Slider {...settings3}>
              {categories1.map((cat, i) => (
                <div key={i} className="category-slide">
                  <div className="single-category-card">
                    <div className="icon">
                      <i className={cat.icon} />
                    </div>
                    <h3>{cat.label}</h3>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      {/* Find Your Best Jobs */}
      <section className="cw-jobs-pro find-job-area">
        <div className="container">
          <div className="cw-jobs-pro-header section-title text-center cw-home-section-header">
            <h2>
              {fourthWords.slice(0, -1).join(" ")}{" "}
              <span className="oragneColor">{fourthWords.slice(-1)}</span>
            </h2>
            {homeData?.fourthSection?.shortParagraph && (
              <p className="cw-home-section-paragraph">
                {homeData.fourthSection.shortParagraph}
              </p>
            )}
            {(jobsLiveCount > 0 || jobsTodayCount > 0) && (
              <div className="cw-jobs-pro-stats">
                {jobsLiveCount > 0 && (
                  <span className="cw-jobs-pro-stat is-live">
                    <strong>{jobsLiveCount}</strong> {t("header.jobsLive")}
                  </span>
                )}
                {jobsTodayCount > 0 && (
                  <span className="cw-jobs-pro-stat">
                    <strong>{jobsTodayCount}</strong> {t("header.addedToday")}
                  </span>
                )}
              </div>
            )}
          </div>

          <div id="home-jobs-container" className="row g-4">
            {jobList.length > 0 ? (
              jobList.map((job, index) => {
                const salaryLabel = formatJobSalaryDisplay(
                  job,
                  globalCurrency.code,
                );
                const resolvedCoverImage = getJobCardCoverImage(job);
                const coverImage = resolvedCoverImage.startsWith("http")
                  ? resolvedCoverImage
                  : resolvedCoverImage.startsWith("/jobPortal/")
                    ? resolvedCoverImage
                    : `${API_IMAGE_URL}${resolvedCoverImage}`;
                const jobLinkState = {
                  from: "/",
                  JobId: job._id,
                  coverImage,
                };

                return (
                  <div
                    key={job._id || index}
                    className="col-lg-4 col-md-6"
                  >
                    <article className="cw-job-pro-card">
                      <Link
                        to={`/job/${job.slug}`}
                        state={jobLinkState}
                        className="cw-job-pro-media"
                      >
                        <img
                          crossOrigin="anonymous"
                          src={coverImage}
                          alt={job.jobTitle || job.title}
                          onError={handleJobCoverError}
                        />
                        {job.isUrgent && (
                          <span className="cw-job-pro-urgent">Urgent</span>
                        )}
                        {isJobFeaturedOnHomepage(job) && (
                          <span className="cw-job-pro-featured">Featured</span>
                        )}
                        <span className="cw-job-pro-type">
                          {job.employmentType || "N/A"}
                        </span>
                      </Link>

                      <div className="cw-job-pro-body">
                        <h2>
                          <Link to={`/job/${job.slug}`} state={jobLinkState}>
                            {job.jobTitle}
                          </Link>
                        </h2>

                        <ul className="cw-job-pro-meta">
                          <li>
                            <i className="flaticon-time" />
                            {getJobPostedLabel(job)}
                          </li>
                          <li>
                            <i className="flaticon-location" />
                            {getJobLocation(job)}
                          </li>
                        </ul>

                        <div className="cw-job-pro-footer">
                          <div className="cw-job-pro-company">
                            <div className="cw-job-pro-company-logo">
                              <img
                                crossOrigin="anonymous"
                                src={resolveCompanyLogoUrl(job?.companyLogo)}
                                alt={getJobCompanyName(job)}
                                onError={handleCompanyLogoError}
                              />
                            </div>
                            <span>{getJobCompanyName(job)}</span>
                          </div>
                          <div className="cw-job-pro-salary">
                            {isJobSalaryNegotiable(job) ? (
                              <small>{t("jobs.salary_negotiable")}</small>
                            ) : salaryLabel ? (
                              <span>{salaryLabel}</span>
                            ) : (
                              <small>—</small>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })
            ) : (
              <p className="text-center">{t("header.noJobsAvailable")}</p>
            )}
          </div>

          <div className="text-center cw-jobs-pro-cta">
            <Link to="/jobs" className="default-btn btn">
              {t("header.browseAllJobs")}
            </Link>
          </div>
        </div>
      </section>

      {/* count section */}
      <div className="counter-area" ref={ref}>
        <div className="container">
          <div className="counter-overly">
            <div className="row">
              {stats?.map((item, index) => (
                <div key={index} className="col-lg-3 col-sm-6">
                  <div className="single-counter-item">
                    <div className="icon">
                      <i className={item.icon} />
                    </div>
                    <h2 className="counter-value">
                      <Odometer
                        value={inView ? item.count : 0}
                        format="(,ddd)"
                        duration={2000}
                      />
                      {item.showPlus && <span className="target">+</span>}
                    </h2>
                    <p>{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Put Your CV In Front Of The Great For Employers To See */}
      <div className="cv-area ptb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="cv-img-area pr-15">
                <div className="row">
                  {fifthImages.map((img, index) => (
                    <div
                      key={index}
                      className="col-lg-6 col-md-6"
                      data-aos-duration={1200}
                      data-aos-delay={600 + index * 200}
                    >
                      <div className={`cv-img-${index + 1}`}>
                        <img
                          crossorigin="anonymous"
                          src={`${API_IMAGE_URL}${img}`}
                          alt={`${cvSectionAlt} - ${index + 1}`}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="cv-content pl-15">
                <h2>
                  {fifthWords.slice(0, -3).join(" ")}{" "}
                  <span className="oragneColor">
                    {fifthWords.slice(-3).join(" ")}
                  </span>
                </h2>

                {homeData?.fifthSection?.mainTitleDescription && (
                  <p className="cw-home-section-paragraph is-preline">
                    {homeData.fifthSection.mainTitleDescription}
                  </p>
                )}

                <div className="cv-btn">
                  <a
                    href="#!"
                    className="default-btn btn mr-20"
                    onClick={(e) => {
                      e.preventDefault();

                      const userId = localStorage.getItem("user_id");
                      const userRole = localStorage.getItem("user_role");

                      if (userId && userRole === "JobSeeker") {
                        navigate("/candidate-profile"); // ✅ go to candidate profile
                      } else {
                        navigate("/login"); // ❌ not logged in or not jobseeker
                      }
                    }}
                  >
                    {t("header.uploadYourCV")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {companyLogos.length > 0 && (
        <div className="partner-area pb-100">
          <div className="container">
            <div className="partner-title text-center cw-home-section-header">
              <h2>
                <span className="oragneColor">
                  {homeData?.sixthSection?.mainTitle}
                </span>
              </h2>
              {homeData?.sixthSection?.mainTitleDescription && (
                <p className="cw-home-section-paragraph">
                  {homeData.sixthSection.mainTitleDescription}
                </p>
              )}
            </div>
            <Slider
              {...settings4}
              infinite={companyLogos.length > 5}
              className="cw-partner-slider"
            >
              {companyLogos.map((logo, index) => (
                <div key={logo || index} className="parner-logo">
                  <a href="#!">
                    <img
                      crossOrigin="anonymous"
                      src={cleanImageUrl(logo)}
                      alt={`${homeData?.sixthSection?.mainTitle || "Partner"} ${index + 1}`}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </a>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}

      {candidates.length > 0 && (
        <div className="freelancer-area pt-70 pb-40">
          <div className="container">
            <div className="freelancer-top-content">
              <div className="row align-items-center">
                <div className="col-lg-8 col-md-9">
                  <div className="section-title style2">
                    <h2>
                      {seventhWords.slice(0, -1).join(" ")}{" "}
                      <span className="oragneColor">
                        {seventhWords.slice(-1)}
                      </span>
                    </h2>
                    {homeData?.seventhSection?.paragraph && (
                      <p className="cw-home-section-paragraph">
                        {homeData.seventhSection.paragraph}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-md-3 text-md-end">
                  <div className="browse-btn">
                    <Link
                      to={
                        userRole === "Recruiter" || userRole === "Company"
                          ? "/candidates-search"
                          : "/employer-login"
                      }
                    >
                      {t("header.browseAllCandidates")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="row freelancer-cards-row">
              {candidates.map((candidate) => (
                <div
                  className="col-lg-4 col-md-6"
                  key={candidate.userId}
                >
                  <div className="single-freelancer-card">
                    <div className="row align-items-center">
                      <div className="col-lg-4">
                        <div className="freelancer-img">
                          <img
                            style={{
                              width: "110px",
                              height: "125px",
                              objectFit: "cover",
                            }}
                            crossorigin="anonymous"
                            src={
                              cleanImageUrl(candidate.userImage) ||
                              "/jobPortal/assets/images/userIcon.png"
                            }
                            alt={candidate.name}
                          />
                        </div>
                      </div>
                      <div className="col-lg-8">
                        <div className="freelancer-content">
                          <h3>{candidate.name}</h3>
                          <span>{candidate.jobTitle}</span>

                          <div className="info">
                            <ul>
                              <li>
                                <i className="flaticon-coin" />
                                {candidate.salary?.amount}{" "}
                                {candidate.salary?.currency} /{" "}
                                {candidate.salary?.type}
                              </li>
                              <li>
                                <i className="flaticon-location" />
                                {candidate.location}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Read Our Article To Get Tricks */}
      <div className="blog-area pt-50 pb-70">
        <div className="container">
          <div className="blog-top-content">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-9">
                <div className="section-title style2">
                  <h2>
                    {eighthWords.slice(0, -2).join(" ")}{" "}
                    <span className="oragneColor">
                      {eighthWords.slice(-2).join(" ")}
                    </span>
                  </h2>
                  {homeData?.eighthSection?.paragraph && (
                    <p className="cw-home-section-paragraph">
                      {homeData.eighthSection.paragraph}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-lg-4 col-md-3 text-md-end">
                <div className="browse-btn">
                  <Link to="/blog">{t("header.blog_list")}</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                {blogData?.slice(0, 3).map((blog) => (
                  <div
                    key={blog._id}
                    className="col-lg-4 col-md-6 aos-init aos-animate"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                    data-aos-delay={200}
                  >
                    <div className="single-blog-card">
                      <div className="blog-img">
                        <Link to={`/blogDetails/${blog._id}`}>
                          <img
                            crossorigin="anonymous"
                            src={cleanImageUrl(blog.bannerImage)}
                            alt={blog.title || t("header.blog")}
                            loading="lazy"
                          />
                        </Link>
                      </div>
                      <div className="blog-content">
                        <div className="info-list">
                          <ul>
                            <li>
                              <i className="fa-solid fa-user" />
                              <Link to="#">{blog.authorName}</Link>
                            </li>
                            <li>
                              <i className="fa-solid fa-calendar-days" />{" "}
                              {new Date(blog.publishDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </li>
                          </ul>
                        </div>
                        <h2>
                          <Link to={`/blogDetails/${blog._id}`}>
                            {blog.title}
                          </Link>
                        </h2>
                        <p>{blog.content.substring(0, 150) + "..."}</p>
                        <div className="blog-btn-info-area">
                          <Link
                            to={`/blogDetails/${blog._id}`}
                            className="read-more default-btn btn"
                          >
                            {t("header.readMore")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-area bg-f0f5f7">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-9">
              <div className="contact-left-content">
                <h2>
                  {ninthWords.slice(0, -2).join(" ")}{" "}
                  <span className="oragneColor">
                    {ninthWords.slice(-2).join(" ")}
                  </span>
                </h2>
                {homeData?.ninthSection?.paragraph && (
                  <p className="cw-home-section-paragraph">
                    {homeData.ninthSection.paragraph}
                  </p>
                )}
              </div>
            </div>
            <div className="col-lg-4 col-md-3">
              <div className="contact-btn">
                <Link to="/contact-us" className="default-btn btn">
                  {t("header.contactUsNow")}{" "}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
