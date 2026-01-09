import Slider from "react-slick";
import { FaStar, FaQuoteLeft, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useRef, useState } from "react";
import mixitup from "mixitup";
import axios from "../Services/axios";
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

const categories1 = [
  { icon: "flaticon-web-development", label: "Development (55)" },
  { icon: "flaticon-customer-support", label: "Information IT (25)" },
  { icon: "flaticon-business", label: "Corporate Job (47)" },
  { icon: "flaticon-business-1", label: "Business Policy (69)" },
  { icon: "flaticon-web-development", label: "Development (55)" },
  { icon: "flaticon-customer-support", label: "Information IT (25)" },
  { icon: "flaticon-office-building", label: "Corporate Job (47)" },
  { icon: "flaticon-business", label: "Business Policy (69)" },
];
const reviews = [
  {
    name: "Nikolas Brooten",
    role: "Digital Marketer",
    text: `“Morbi porttitor ligula id varius consectetur. Integer ipsum justo, congue sit amet massa vel, porttitor semper magna. Orci varius natoque penatibus et magnis dis parturient”`,
  },
  {
    name: "Terry Ambady",
    role: "IT Specialist",
    text: `“Morbi porttitor ligula id varius consectetur. Integer ipsum justo, congue sit amet massa vel, porttitor semper magna. Orci varius natoque penatibus et magnis dis parturient”`,
  },
  {
    name: "Camelia Renesa",
    role: "President Of Sale",
    text: `“Morbi porttitor ligula id varius consectetur. Integer ipsum justo, congue sit amet massa vel, porttitor semper magna. Orci varius natoque penatibus et magnis dis parturient”`,
  },
  // repeat or map more if needed
];
function Home() {
  const { t, i18n } = useTranslation("global");
  const userRole = localStorage.getItem("user_role");
  const navigate = useNavigate();
  const [jobList, setJobList] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    keywords: "",
    location: "",
    category: "",
  });
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
      const res = await axios.get(`${API_BASE_URL}getAllJob`, {
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
    getCategories();
  }, []);
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
  const handleViewCompany = (company) => {
    navigate("/companies-details", {
      state: { companyId: company }, // 👈 send ID as prop-like data
    });
  };
  const stats = [
    { icon: "flaticon-bag", count: 15000, label: "Jobs Added", showPlus: true },
    { icon: "flaticon-office-building", count: 123842, label: "Companies" },
    { icon: "flaticon-cv", count: 20554, label: "Resume" },
    { icon: "flaticon-member", count: 18435, label: "Members" },
  ];
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
  return (
    <>
      <div className="banner-area bg-f0f4fc">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="banner-content">
                <div className="banner-title">
                  <span className="homespan">{t("header.lookingForJob")}</span>
                  <h1>
                    {t("header.findYourCareerTo")}{" "}
                    <span className="oragneColor">
                      {t("header.makeABetter")}
                    </span>{" "}
                    {t("header.life")}
                  </h1>
                </div>
                <div className="serech-over">
                  <span>{t("header.searchJobsToday")}</span>
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
                    <li>
                      <a href="/">Design</a>
                    </li>
                    <li>
                      <a href="/">Development</a>
                    </li>
                    <li>
                      <a href="/">Marketing</a>
                    </li>
                    <li>
                      <a href="/">Affiliate</a>
                    </li>
                    <li>
                      <a href="/">Senior</a>
                    </li>
                    <li>
                      <a href="/">Engineer</a>
                    </li>
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
                  <div className="col-lg-6 col-sm-6 col-6">
                    <div className="banner-img-1">
                      <img
                        src="/jobPortal/assets/images/banner/banner-img-1.jpg"
                        alt="Image"
                      />
                      <div className="shape-2">
                        <img
                          src="/jobPortal/assets/images/banner/shape-2.png"
                          alt="Image"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-6">
                    <div className="banner-img-1">
                      <img
                        src="/jobPortal/assets/images/banner/banner-img-4.jpg"
                        alt="Image"
                      />
                      <div className="shape-2">
                        <img
                          src="/jobPortal/assets/images/banner/shape-2.png"
                          alt="Image"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-6">
                    <div className="banner-img-1">
                      <img
                        src="/jobPortal/assets/images/banner/banner-img-2.jpg"
                        alt="Image"
                      />
                      <div className="shape-2">
                        <img
                          src="/jobPortal/assets/images/banner/shape-2.png"
                          alt="Image"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-6 col-6">
                    <div className="banner-img-1">
                      <img
                        src="/jobPortal/assets/images/banner/banner-img-3.jpg"
                        alt="Image"
                      />
                      <div className="shape-2">
                        <img
                          src="/jobPortal/assets/images/banner/shape-2.png"
                          alt="Image"
                        />
                      </div>
                    </div>
                  </div>
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

      <section className="companies-week-slider-info">
        <div className="container">
          <div className="section-title text-center">
            <h2>
              {t("header.companiesOf")}{" "}
              <label className="oragneColor">{t("header.theWeek")}</label>
            </h2>
          </div>

          <OwlCarousel className="owl-theme" {...options}>
            {companies?.companies?.length > 0 ? (
              companies.companies.map((item) => {
                const company = item?.companyId;
                return (
                  <div className="item" key={company?._id}>
                    <div className="companies-week-box-info">
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
                          onClick={() => handleViewCompany(company?._id)}
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

      <div className="job-categories-area ptb-100">
        <div className="container">
          <div className="section-title">
            <h2>
              {t("header.mostDemandedJobs")}{" "}
              <label className="oragneColor">{t("header.categories")}</label>{" "}
            </h2>
          </div>

          <div className="category-slider-wrapper">
            <Slider {...settings3}>
              {categories1?.map((cat, i) => (
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
      <div className="find-job-area pb-100">
        <div className="container">
          <div className="section-title">
            <h2>
              {t("header.findYourBest")}{" "}
              <label className="oragneColor">{t("header.jobs")} </label>
            </h2>
            <p>
              155 {t("header.jobsLive")} - 30 {t("header.addedToday")}
            </p>
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
                    <div className="job-image">
                      <Link to={`/job-details/${job._id}`}>
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
                        <Link to={`/job-details/${job._id}`}>
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
                                    job?.logo
                                      ? `${API_IMAGE_URL}${job.logo}`
                                      : "/jobPortal/assets/images/icon/icon-7.png"
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

      <div className="counter-area" ref={ref}>
        <div className="container">
          <div className="counter-overly">
            <div className="row">
              {stats.map((item, index) => (
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
      <div className="cv-area ptb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="cv-img-area pr-15">
                <div className="row">
                  <div
                    className="col-lg-6 col-md-6"
                    data-aos=""
                    data-aos-duration={1200}
                    data-aos-delay={600}
                  >
                    <div className="cv-img-1">
                      <img
                        src="/jobPortal/assets/images/cv/cv-img-1.png"
                        alt="Image"
                      />
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-md-6"
                    data-aos=""
                    data-aos-duration={1200}
                    data-aos-delay={800}
                  >
                    <div className="cv-img-2">
                      <img
                        src="/jobPortal/assets/images/cv/cv-img-2.png"
                        alt="Image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="cv-content pl-15">
                <h2>
                  {t("header.putYourCVFront")}{" "}
                  <label class="oragneColor">
                    {" "}
                    {t("header.employersToSee")}
                  </label>
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor labore et dolore magna aliqua. Quis ipsum
                  suspendisse ultrices gravida risus viverra maecenas accumsan
                  lacus vel facilisis dolore magna.
                </p>
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
              <label class="oragneColor"> {t("header.company")}</label>
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
                    {t("header.highestRated")}{" "}
                    <label class="oragneColor">{t("header.freelancers")}</label>
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
            <div
              className="col-lg-4 col-sm-6"
              data-aos=""
              data-aos-duration={1200}
              data-aos-delay={200}
            >
              <div className="single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <img
                        src="/jobPortal/assets/images/freelancers/freelancers-img-1.jpg"
                        alt="Image"
                      />
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <h3>Jequline Fenda</h3>

                      <span>IT Developer</span>
                      <div className="ratings">
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                      </div>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="flaticon-coin" />
                            $35 Per Hour
                          </li>
                          <li>
                            <i className="flaticon-location" />
                            USA
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-sm-6"
              data-aos=""
              data-aos-duration={1200}
              data-aos-delay={400}
            >
              <div className="single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <img
                        src="/jobPortal/assets/images/freelancers/freelancers-img-2.jpg"
                        alt="Image"
                      />
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <h3>Thomas Abedin</h3>

                      <span>Software Engineer</span>
                      <div className="ratings">
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                      </div>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="flaticon-coin" />
                            $43 Per Hour
                          </li>
                          <li>
                            <i className="flaticon-location" />
                            Brazil
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-sm-6"
              data-aos=""
              data-aos-duration={1200}
              data-aos-delay={600}
            >
              <div className="single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <img
                        src="/jobPortal/assets/images/freelancers/freelancers-img-3.jpg"
                        alt="Image"
                      />
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <h3>Jean Burke</h3>

                      <span>Graphics Designer</span>
                      <div className="ratings">
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                      </div>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="flaticon-coin" />
                            $52 Per Hour
                          </li>
                          <li>
                            <i className="flaticon-location" />
                            Canada
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-sm-6"
              data-aos=""
              data-aos-duration={1200}
              data-aos-delay={800}
            >
              <div className="single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <img
                        src="/jobPortal/assets/images/freelancers/freelancers-img-4.jpg"
                        alt="Image"
                      />
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <h3>Robin William</h3>

                      <span>Manager Support</span>
                      <div className="ratings">
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                      </div>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="flaticon-coin" />
                            $67 Per Hour
                          </li>
                          <li>
                            <i className="flaticon-location" />
                            Japan
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-sm-6"
              data-aos=""
              data-aos-duration={1200}
              data-aos-delay={1000}
            >
              <div className="single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <img
                        src="/jobPortal/assets/images/freelancers/freelancers-img-5.jpg"
                        alt="Image"
                      />
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <h3>Tom Henry</h3>

                      <span>Director At School</span>
                      <div className="ratings">
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                      </div>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="flaticon-coin" />
                            $55 Per Hour
                          </li>
                          <li>
                            <i className="flaticon-location" />
                            Australia
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-sm-6"
              data-aos=""
              data-aos-duration={1200}
              data-aos-delay={1200}
            >
              <div className="single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <img
                        src="/jobPortal/assets/images/freelancers/freelancers-img-6.jpg"
                        alt="Image"
                      />
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <h3>Jubra Ward</h3>

                      <span>CEO Founder</span>
                      <div className="ratings">
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                      </div>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="flaticon-coin" />
                            $82 Per Hour
                          </li>
                          <li>
                            <i className="flaticon-location" />
                            Italy
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="download-area bg-f0f5f7 ptb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="download-image">
                <img
                  src="/jobPortal/assets/images/download/download-img-1.png"
                  alt="Image"
                />
                <div className="shape">
                  <img
                    src="/jobPortal/assets/images/download/shape-1.png"
                    alt="Image"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="download-content">
                <h2>
                  Get More In Our Application Sit Back And Enjoy The{" "}
                  <label class="oragneColor">Mobile App</label>
                </h2>
                <p>
                  In our restaurant with people who are important to you,
                  conversations that bring you to closer to each other and those
                  who enjoy our dishes. Quisque pretium dolor turpis, quis
                  blandit turpis semper ut. Nam malesuada eros nec luctus
                  laoreet. Fusce sodales consequat velit eget dictum. Integer
                  ornare magna.
                </p>
                <h3>Available At Mobile App</h3>
                <div className="download-btn">
                  <ul>
                    <li>
                      <a href="#">
                        <img
                          src="/jobPortal/assets/images/download/google-play.png"
                          alt="Image"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img
                          src="/jobPortal/assets/images/download/app-store.png"
                          alt="Image"
                        />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="blog-area pt-100 pb-70">
        <div className="container">
          <div className="blog-top-content">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-9">
                <div className="section-title style2">
                  <h2>
                    {t("header.readArticleTo")}{" "}
                    <label class="oragneColor"> {t("header.getTricks")}</label>{" "}
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
                <div
                  className="col-lg-4 col-md-6"
                  data-aos=""
                  data-aos-duration={1200}
                  data-aos-delay={200}
                >
                  <div className="single-blog-card">
                    <div className="blog-img">
                      <a href="blog-details.html">
                        <img
                          src="/jobPortal/assets/images/blog/blog-img-1.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                    <div className="blog-content">
                      <div className="info-list">
                        <ul>
                          <li>
                            <i className="fa-solid fa-user" />
                            <a href="#">Andrew Lawson</a>
                          </li>
                          <li>
                            <i className="fa-solid fa-calendar-days" /> Feb 12,
                            2024
                          </li>
                        </ul>
                      </div>
                      <h2>
                        <a href="blog-details.html">
                          The Internet Is A Job Seeker Most Crucial Success
                        </a>
                      </h2>
                      <p>
                        Lorem ipsum dolor sit amet, constetur adipiscing elit,
                        sed do eiusmod tempor incididunt.
                      </p>
                      <a href="blog-details.html" className="read-more">
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-4 col-md-6"
                  data-aos=""
                  data-aos-duration={1200}
                  data-aos-delay={400}
                >
                  <div className="single-blog-card">
                    <div className="blog-img">
                      <a href="blog-details.html">
                        <img
                          src="/jobPortal/assets/images/blog/blog-img-2.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                    <div className="blog-content">
                      <div className="info-list">
                        <ul>
                          <li>
                            <i className="fa-solid fa-user" />
                            <a href="#">Andrew Lawson</a>
                          </li>
                          <li>
                            <i className="fa-solid fa-calendar-days" /> Feb 12,
                            2024
                          </li>
                        </ul>
                      </div>
                      <h2>
                        <a href="blog-details.html">
                          Today From Connecting With Potential Employers
                        </a>
                      </h2>
                      <p>
                        Lorem ipsum dolor sit amet, constetur adipiscing elit,
                        sed do eiusmod tempor incididunt.
                      </p>
                      <a href="blog-details.html" className="read-more">
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-4 col-md-6"
                  data-aos=""
                  data-aos-duration={1200}
                  data-aos-delay={400}
                >
                  <div className="single-blog-card">
                    <div className="blog-img">
                      <a href="blog-details.html">
                        <img
                          src="/jobPortal/assets/images/blog/blog-img-6.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                    <div className="blog-content">
                      <div className="info-list">
                        <ul>
                          <li>
                            <i className="fa-solid fa-user" />
                            <a href="#">Andrew Lawson</a>
                          </li>
                          <li>
                            <i className="fa-solid fa-calendar-days" /> Feb 12,
                            2024
                          </li>
                        </ul>
                      </div>
                      <h2>
                        <a href="blog-details.html">
                          Today From Connecting With Potential Employers
                        </a>
                      </h2>
                      <p>
                        Lorem ipsum dolor sit amet, constetur adipiscing elit,
                        sed do eiusmod tempor incididunt.
                      </p>
                      <a href="blog-details.html" className="read-more">
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
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
                  {t("header.findNextGreat")}{" "}
                  <label class="oragneColor">
                    {t("header.jobOpportunity")}
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
