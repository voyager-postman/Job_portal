import Slider from "react-slick";
import { FaStar, FaQuoteLeft, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useRef, useState } from "react";
import mixitup from "mixitup";
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

  const getStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getHomePageStats`);

      const data = res.data.data;

      const formattedStats = [
        {
          icon: "flaticon-bag",
          count: data.jobsAdded || 0,
          label: "Jobs Added",
          showPlus: true,
        },
        {
          icon: "flaticon-office-building",
          count: data.companies || 0,
          label: "Companies",
        },
        {
          icon: "flaticon-cv",
          count: data.resumes || 0,
          label: "Resume",
        },
        {
          icon: "flaticon-member",
          count: data.jobSeeker || 0,
          label: "Members",
        },
      ];

      setStats(formattedStats);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStats();
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
  const getAllJobList = async (limit = 6, page = 1) => {
    try {
      const res = await axios.get(`${API_BASE_URL}getHomePageJobs`, {
        params: { limit, page }, // ✅ send limit & page to API
      });

      // ✅ If your API respects limit, it will return only 6 jobs
      // But if not, we’ll still slice the data to show only 6
      const jobs = res.data?.jobs || [];
      setJobList(jobs.slice(0, limit));
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    getAllJobList(6, 1); // ✅ Fetch only 6 jobs by default on first load
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
      const res = await axios.get(`${API_BASE_URL}getCompanyDetailsListSlider`);

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

  const containerRef = useRef(null);
  const { ref, inView } = useInView({
    threshold: 0.4, // trigger when 40% is visible
    triggerOnce: true,
  });

  const handleViewCompany = (company, from) => {
    console.log(company);

    navigate(`/${company.slug}`, {
      state: { companyId: company._id, from },
    });
  };

  useEffect(() => {
    if (containerRef.current) {
      mixitup(containerRef.current, {
        selectors: {
          target: ".mix",
        },
        animation: {
          duration: 300,
        },
      });
    }
  }, []);
  const options = {
    margin: 20,
    nav: true,
    dots: false,
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    smartSpeed: 800,
    navText: [
      '<span class="custom-nav-arrow ">&#8249;</span>', // ‹
      '<span class="custom-nav-arrow ">&#8250;</span>', // ›
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4, // show 4 items at desktop width
      },
    },
  };
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

  const logos = [
    "partner-logo-1.png",
    "partner-logo-2.png",
    "partner-logo-3.png",
    "partner-logo-4.png",
    "partner-logo-5.png",
    "partner-logo-6.png",
  ];

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

  const titleParts =
    homeData?.firstSection?.mainTitle?.split("Make A Better") || [];
  const title = homeData?.secondSection?.mainTitle || "";
  const words = title.split(" ");
  const thirdTitle = homeData?.thirdSection?.mainTitle || "";
  const thirdWords = thirdTitle.split(" ");
  const fourthTitle = homeData?.fourthSection?.mainTitle || "";
  const fourthWords = fourthTitle.trim().split(" ");
  const fifthTitle = homeData?.fifthSection?.mainTitle || "";
  const fifthWords = fifthTitle.trim().split(" ");

  const fifthImages = homeData?.fifthSection?.images || [];
  return (
    <>
      <div className="banner-area bg-f0f4fc">
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
                    <span className="oragneColor">Make A Better</span>
                    {titleParts[1]}
                  </h1>
                </div>
                <div className="serech-over">
                  <span>{homeData?.firstSection?.shortParagraph}</span>
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
                    {trendingKeywords.map((keyword, index) => (
                      <li key={index}>
                        <a href="/">{keyword}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="shape-1">
                  <img
                    src="/jobPortal/assets/images/banner/shape-1.png"
                    alt="Image"
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
                          alt="Banner"
                        />

                        <div className="shape-2">
                          <img
                            crossorigin="anonymous"
                            src="/jobPortal/assets/images/banner/shape-2.png"
                            alt="Shape"
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
                      alt="Image"
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
      </div>

      {/* Companies of the Week */}
      <section className="companies-week-slider-info">
        <div className="container">
          <div className="section-title text-center">
            <h2>
              {words.slice(0, words.length - 2).join(" ")}{" "}
              <label className="oragneColor">
                {words.slice(words.length - 2).join(" ")}
              </label>
            </h2>
          </div>

          <OwlCarousel className="owl-theme" {...options}>
            {companies?.companies?.length > 0 ? (
              companies.companies.map((item) => {
                const company = item?.companyId;
                return (
                  <div className="item" key={company?._id}>
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
              })
            ) : (
              <div className="item">
                <p className="text-center mt-4">{t("header.noCompanies")}</p>
              </div>
            )}
          </OwlCarousel>
        </div>
      </section>

      {/* Most Demanded Jobs Categories */}
      <div className="job-categories-area ptb-100">
        <div className="container">
          <div className="section-title">
            <h2>
              {thirdWords.slice(0, -1).join(" ")}{" "}
              <label className="oragneColor">{thirdWords.slice(-1)}</label>
            </h2>

            {/* <p>{homeData?.thirdSection?.shortParagraph}</p> */}
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
      <div className="find-job-area pb-100">
        <div className="container">
          <div className="section-title">
            <h2>
              {fourthWords.slice(0, -1).join(" ")}{" "}
              <label className="oragneColor">{fourthWords.slice(-1)}</label>
            </h2>

            <p>{homeData?.fourthSection?.shortParagraph}</p>
          </div>
          <div className="shoting-btn"></div>
          <div
            id="Container"
            className="row justify-content-center"
            ref={containerRef}
          >
            {jobList.length > 0 ? (
              jobList.map((job, index) => (
                <div
                  key={job._id || index}
                  className="col-lg-4 col-md-6 mix design service writing"
                >
                  <div className="single-job-card">
                    {job?.badge && (
                      <span
                        className="featured-badge"
                        title="This is a featured job listing"
                      >
                        <i className="fa-solid fa-star"></i> Featured
                      </span>
                    )}
                    <div className="job-image">
                      <Link
                        to={`/job/${job.slug}`}
                        state={{
                          from: "/",
                          JobId: job._id,
                        }}
                      >
                        <img
                          crossorigin="anonymous"
                          src={
                            job?.JobCoverPhoto
                              ? `${API_IMAGE_URL}${job.JobCoverPhoto}`
                              : "/jobPortal/assets/images/job/job-img-6.jpg"
                          }
                          alt={job.title}
                        />
                      </Link>
                      {job.isUrgent && <span className="urgent">Urgent</span>}
                    </div>

                    <div className="job-content">
                      <span className="time">
                        {job.employmentType || "N/A"}
                      </span>
                      <h2>
                        <Link
                          to={`/job/${job.slug}`}
                          state={{
                            JobId: job._id,
                            from: "/",
                          }}
                        >
                          {job.jobTitle}
                        </Link>
                      </h2>

                      <div className="info">
                        <ul>
                          <li>
                            <i className="flaticon-time" />
                            {moment(job?.createdAt).fromNow()}
                          </li>
                          <li>
                            <i className="flaticon-location" />
                            {job?.city || "N/A"}{" "}
                          </li>
                        </ul>
                      </div>
                      <div className="bottom-content">
                        <ul className="d-flex justify-content-between">
                          <li>
                            <div className="left-content">
                              <div className="icon">
                                <img
                                  crossorigin="anonymous"
                                  src={
                                    job?.companyLogo
                                      ? `${API_IMAGE_URL}${job.companyLogo}`
                                      : "/jobPortal/assets/images/partner-logo/partner-logo-2.png"
                                  }
                                  alt="Company Logo"
                                />
                              </div>
                              <span>{job.brandName || "N/A"}</span>
                            </div>
                          </li>
                          <li>
                            <h3>
                              ${job?.privatJobDetails?.minSalary}
                              <span>/{t("header.month")}</span>
                            </h3>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">{t("header.noJobsAvailable")}</p>
            )}
          </div>

          <div className="text-center">
            <Link to="/jobs" className="default-btn btn">
              {t("header.browseAllJobs")}
            </Link>
          </div>
        </div>
      </div>

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
                    <h1>
                      <Odometer
                        value={inView ? item.count : 0}
                        format="(,ddd)"
                        duration={2000}
                      />
                      {item.showPlus && <span className="target">+</span>}
                    </h1>
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
                          alt="CV"
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
                  <label className="oragneColor">
                    {fifthWords.slice(-3).join(" ")}
                  </label>
                </h2>

                <p>{homeData?.fifthSection?.mainTitleDescription}</p>

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
      <div className="partner-area pb-100">
        <div className="container">
          <div className="partner-title">
            <h3>
              <label className="oragneColor">
                {homeData?.sixthSection?.mainTitle}
              </label>
            </h3>
          </div>
          <Slider {...settings4} className="partner-slider">
            {logos.map((logo, index) => (
              <div key={index} className="parner-logo">
                <a href="#">
                  <img
                    src={`/jobPortal/assets/images/partner-logo/${logo}`}
                    alt={`Partner ${index + 1}`}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </a>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <div className="freelancer-area pt-100 pb-70">
        <div className="container">
          <div className="freelancer-top-content">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-9">
                <div className="section-title style2">
                  <h2>
                    {homeData?.seventhSection?.mainTitle
                      ?.split(" ")
                      .slice(0, -1)
                      .join(" ")}{" "}
                    <label className="oragneColor">
                      {homeData?.seventhSection?.mainTitle
                        ?.split(" ")
                        .slice(-1)}
                    </label>
                  </h2>
                </div>
              </div>
              <div className="col-lg-4">
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
          <div className="row">
            {candidates.map((candidate, index) => (
              <div
                className="col-lg-4 col-sm-6"
                key={candidate.userId}
                data-aos=""
                data-aos-duration={1200}
                data-aos-delay={200 + index * 200}
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
                            "/jobPortal/assets/images/freelancers/default.jpg"
                          }
                          alt={candidate.name}
                        />
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="freelancer-content">
                        <h3>{candidate.name}</h3>
                        <span>{candidate.jobTitle}</span>
                        <div className="ratings">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <i
                                key={i}
                                className={`fa-solid fa-star ${i < candidate.avgRating ? "text-warning" : ""}`}
                              />
                            ))}
                        </div>
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

      {/* Read Our Article To Get Tricks */}
      <div className="blog-area pt-100 pb-70">
        <div className="container">
          <div className="blog-top-content">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-9">
                <div className="section-title style2">
                  <h2>
                    {homeData?.eighthSection?.mainTitle
                      ?.split(" ")
                      .slice(0, -2)
                      .join(" ")}{" "}
                    <label className="oragneColor">
                      {homeData?.eighthSection?.mainTitle
                        ?.split(" ")
                        .slice(-2)
                        .join(" ")}
                    </label>
                  </h2>
                </div>
              </div>
              <div className="col-lg-4">
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
                            alt="Image"
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
                            Read More
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
                  {homeData?.ninthSection?.mainTitle
                    ?.split(" ")
                    .slice(0, -2)
                    .join(" ")}{" "}
                  <label className="oragneColor">
                    {homeData?.ninthSection?.mainTitle
                      ?.split(" ")
                      .slice(-2)
                      .join(" ")}
                  </label>
                </h2>
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
