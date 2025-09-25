import Slider from "react-slick";
import { FaStar, FaQuoteLeft, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useRef } from "react";
import mixitup from "mixitup";
import "odometer/themes/odometer-theme-default.css";
import Odometer from "react-odometerjs";
import { useInView } from "react-intersection-observer";
import "odometer/themes/odometer-theme-default.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import OwlCarousel from "react-owl-carousel3";
import { Link } from "react-router-dom";

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

const categories = [
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
  const containerRef = useRef(null);
  const { ref, inView } = useInView({
    threshold: 0.4, // trigger when 40% is visible
    triggerOnce: true,
  });

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
            <div className="col-lg-6">
              <div className="banner-content">
                <div className="banner-title">
                  <span className="homespan">Looking For A Job!</span>
                  <h1>
                    Find Your Career To{" "}
                    <span className="oragneColor">Make A Better</span> Life
                  </h1>
                </div>
                <div className="serech-over">
                  <span>Search Over 70,000 Jobs Today!</span>
                </div>
                <div className="banner-search-form">
                  <form>
                    <div className="row g-0">
                      <div className="col-lg-3 col-sm-6">
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Job Title"
                          />
                          <i className="flaticon-portfolio" />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Location"
                          />
                          <i className="flaticon-location" />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <div className="form-group style">
                          <select className="form-select form-control">
                            <option selected>Category</option>
                            <option value={1}>Development</option>
                            <option value={2}>Information IT</option>
                            <option value={3}>Corporate Job</option>
                          </select>
                          <i className="flaticon-list" />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <div className="search-btn">
                          <button type="submit" className="default-btn btn">
                            <i className="flaticon-search" />
                            Search Jobs
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="trending-keywords">
                  <ul>
                    <li>
                      <span>Trending Keywords:</span>
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
            <div className="col-lg-6">
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
                  className="join-now"
                  data-aos="fade-down-right"
                  data-aos-duration={1500}
                  data-aos-delay={800}
                >
                  <div className="sm-img">
                    <img
                      src="/jobPortal/assets/images/banner/banner-sm-1.png"
                      alt="Image"
                    />
                  </div>
                  <h3>Web Development Class</h3>
                  <span>Today at 12.00 PM</span>
                  <a href="company.html" className="default-btn btn">
                    Join Now
                  </a>
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
              Companies of <label className="oragneColor">the Week</label>
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt.
            </p>
          </div>

          <OwlCarousel className="owl-theme" {...options}>
            {[...Array(6)].map((_, index) => (
              <div className="item" key={index}>
                <div className="companies-week-box-info">
                  <div className="companies-week-logo">
                    <img
                      src="/jobPortal/assets/images/partner-logo/partner-logo-2.png"
                      alt="logo"
                    />
                  </div>
                  <div className="companies-week-img">
                    <img
                      src="/jobPortal/assets/images/company/company-img-1.jpg"
                      alt="company"
                    />
                  </div>
                  <div className="companies-week-content">
                    <h4>Hauts De Seine Department</h4>
                    <ul>
                      <li>
                        <i className="fa-solid fa-location-dot" />{" "}
                        Levallois-Perret
                      </li>
                      <li>
                        <i className="fa-solid fa-user" /> 1000 - 20000
                      </li>
                      <li>
                        <i className="fa-solid fa-globe" /> Technicien support
                        VIP Anglais
                      </li>
                    </ul>
                  </div>
                  <div className="available-company-btn">
                    <Link to="/companies-details" className="default-btn btn">
                      View Company
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </OwlCarousel>
        </div>
      </section>

      <div className="job-categories-area ptb-100">
        <div className="container">
          <div className="section-title">
            <h2>
              Most Demanded Jobs{" "}
              <label className="oragneColor">Categories</label>{" "}
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt.
            </p>
          </div>
          {/* <div className="category-slider owl-carousel owl-theme">
            <div className="single-category-card">
              <div className="icon">
                <i className="flaticon-web-development" />
              </div>
              <h3>Development (55)</h3>
            </div>
            <div className="single-category-card">
              <div className="icon">
                <i className="flaticon-customer-support" />
              </div>
              <h3>Information IT (25)</h3>
            </div>
            <div className="single-category-card">
              <div className="icon">
                <i className="flaticon-business" />
              </div>
              <h3>Corporate Job (47)</h3>
            </div>
            <div className="single-category-card">
              <div className="icon">
                <i className="flaticon-business-1" />
              </div>
              <h3>Business Policy (69)</h3>
            </div>
            <div className="single-category-card">
              <div className="icon">
                <i className="flaticon-web-development" />
              </div>
              <h3>Development (55)</h3>
            </div>
            <div className="single-category-card">
              <div className="icon">
                <i className="flaticon-customer-support" />
              </div>
              <h3>Information IT (25)</h3>
            </div>
            <div className="single-category-card">
              <div className="icon">
                <i className="flaticon-office-building" />
              </div>
              <h3>Corporate Job (47)</h3>
            </div>
            <div className="single-category-card">
              <div className="icon">
                <i className="flaticon-business" />
              </div>
              <h3>Business Policy (69)</h3>
            </div>
          </div>  */}
          <div className="category-slider-wrapper">
            <Slider {...settings3}>
              {categories.map((cat, i) => (
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
              Find Your Best <label className="oragneColor">Jobs</label>
            </h2>
            <p>155 jobs live - 30 added today</p>
          </div>
          <div className="shoting-btn">
            <ul>
              <li>
                <button className="filter" data-filter="all">
                  All Categories
                </button>
              </li>
              <li>
                <button className="filter" data-filter=".design">
                  Design
                </button>
              </li>
              <li>
                <button className="filter" data-filter=".marketing">
                  Marketing
                </button>
              </li>
              <li>
                <button className="filter" data-filter=".service">
                  Service
                </button>
              </li>
              <li>
                <button className="filter" data-filter=".health-care">
                  Health Care
                </button>
              </li>
              <li>
                <button className="filter" data-filter=".writing">
                  Writing
                </button>
              </li>
              <li>
                <button className="filter" data-filter=".business">
                  Business
                </button>
              </li>
            </ul>
          </div>
          <div
            id="Container"
            className="row justify-content-center"
            ref={containerRef}
          >
            <div className="col-lg-4 col-md-6 mix marketing writing">
              <div className="single-job-card">
                <div className="job-image">
                  <Link to="/job-details">
                    <img
                      src="/jobPortal/assets/images/job/job-img-1.jpg"
                      alt="Image"
                    />
                  </Link>
                  <a href="#">
                    <div className="bookmark">
                      <i className="flaticon-bookmark" />
                    </div>
                  </a>
                </div>
                <div className="job-content">
                  <span className="time">Fulltime</span>
                  <h2>
                    <Link to="/job-details">
                      UI/UX Design Pattern For Successful Software Applications
                    </Link>
                  </h2>
                  <div className="info">
                    <ul>
                      <li>
                        <i className="flaticon-time" />3 Days Left
                      </li>
                      <li>
                        <i className="flaticon-location" />
                        42, Malsh Street, USA
                      </li>
                    </ul>
                  </div>
                  <div className="bottom-content">
                    <ul className="d-flex justify-content-between">
                      <li>
                        <div className="left-content">
                          <div className="icon">
                            <img
                              src="/jobPortal/assets/images/icon/icon-2.png"
                              alt="Logo"
                            />
                          </div>
                          <span>Solit IT Solution</span>
                        </div>
                      </li>
                      <li>
                        <h3>
                          $120 <span>/Month</span>
                        </h3>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mix design health-care business">
              <div className="single-job-card">
                <div className="job-image">
                  <Link to="/job-details">
                    <img
                      src="/jobPortal/assets/images/job/job-img-2.jpg"
                      alt="Image"
                    />
                  </Link>
                  <a href="#">
                    <div className="bookmark">
                      <i className="flaticon-bookmark" />
                    </div>
                  </a>
                  <a href="#">
                    <span className="urgent">Urgent</span>
                  </a>
                </div>
                <div className="job-content">
                  <span className="time">Fulltime</span>
                  <h2>
                    <Link to="/job-details">
                      Basic Knowldge About Hodiernal Bharat In History
                    </Link>
                  </h2>
                  <div className="info">
                    <ul>
                      <li>
                        <i className="flaticon-time" />5 Days Left
                      </li>
                      <li>
                        <i className="flaticon-location" />
                        42, Malsh Street, USA
                      </li>
                    </ul>
                  </div>
                  <div className="bottom-content">
                    <ul className="d-flex justify-content-between">
                      <li>
                        <div className="left-content">
                          <div className="icon">
                            <img
                              src="/jobPortal/assets/images/icon/icon-3.png"
                              alt="Logo"
                            />
                          </div>
                          <span>Constik Solution</span>
                        </div>
                      </li>
                      <li>
                        <h3>
                          $120 <span>/Month</span>
                        </h3>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mix service health-care business">
              <div className="single-job-card">
                <div className="job-image">
                  <Link to="/job-details">
                    <img
                      src="/jobPortal/assets/images/job/job-img-3.jpg"
                      alt="Image"
                    />
                  </Link>
                  <a href="#">
                    <div className="bookmark">
                      <i className="flaticon-bookmark" />
                    </div>
                  </a>
                </div>
                <div className="job-content">
                  <span className="time">Fulltime</span>
                  <h2>
                    <Link to="/job-details">
                      Visual Effects For Games In Unity Beginner To Intermediate
                    </Link>
                  </h2>
                  <div className="info">
                    <ul>
                      <li>
                        <i className="flaticon-time" />8 Days Left
                      </li>
                      <li>
                        <i className="flaticon-location" />
                        42, Malsh Street, USA
                      </li>
                    </ul>
                  </div>
                  <div className="bottom-content">
                    <ul className="d-flex justify-content-between">
                      <li>
                        <div className="left-content">
                          <div className="icon">
                            <img
                              src="/jobPortal/assets/images/icon/icon-4.png"
                              alt="Logo"
                            />
                          </div>
                          <span>Medizo Health Care</span>
                        </div>
                      </li>
                      <li>
                        <h3>
                          $120 <span>/Month</span>
                        </h3>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mix design marketing writing">
              <div className="single-job-card">
                <div className="job-image">
                  <Link to="/job-details">
                    <img
                      src="/jobPortal/assets/images/job/job-img-4.jpg"
                      alt="Image"
                    />
                  </Link>
                  <a href="#">
                    <div className="bookmark">
                      <i className="flaticon-bookmark" />
                    </div>
                  </a>
                </div>
                <div className="job-content">
                  <span className="time">Fulltime</span>
                  <h2>
                    <Link to="/job-details">
                      The Complete Accounting &amp; Bank Financial Course 2024
                    </Link>
                  </h2>
                  <div className="info">
                    <ul>
                      <li>
                        <i className="flaticon-time" />4 Days Left
                      </li>
                      <li>
                        <i className="flaticon-location" />
                        42, Malsh Street, USA
                      </li>
                    </ul>
                  </div>
                  <div className="bottom-content">
                    <ul className="d-flex justify-content-between">
                      <li>
                        <div className="left-content">
                          <div className="icon">
                            <img
                              src="/jobPortal/assets/images/icon/icon-5.png"
                              alt="Logo"
                            />
                          </div>
                          <span>INVA Business Solution</span>
                        </div>
                      </li>
                      <li>
                        <h3>
                          $120 <span>/Month</span>
                        </h3>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mix service health-care business">
              <div className="single-job-card">
                <div className="job-image">
                  <Link to="/job-details">
                    <img
                      src="/jobPortal/assets/images/job/job-img-5.jpg"
                      alt="Image"
                    />
                  </Link>
                  <a href="#">
                    <div className="bookmark">
                      <i className="flaticon-bookmark" />
                    </div>
                  </a>
                </div>
                <div className="job-content">
                  <span className="time">Fulltime</span>
                  <h2>
                    <Link to="/job-details">
                      The Complete Business Plan Course Includes 40 Templates
                    </Link>
                  </h2>
                  <div className="info">
                    <ul>
                      <li>
                        <i className="flaticon-time" />8 Days Left
                      </li>
                      <li>
                        <i className="flaticon-location" />
                        42, Malsh Street, USA
                      </li>
                    </ul>
                  </div>
                  <div className="bottom-content">
                    <ul className="d-flex justify-content-between">
                      <li>
                        <div className="left-content">
                          <div className="icon">
                            <img
                              src="/jobPortal/assets/images/icon/icon-6.png"
                              alt="Logo"
                            />
                          </div>
                          <span>Pufo Corporation</span>
                        </div>
                      </li>
                      <li>
                        <h3>
                          $120 <span>/Month</span>
                        </h3>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mix design service writing">
              <div className="single-job-card">
                <div className="job-image">
                  <Link to="/job-details">
                    <img
                      src="/jobPortal/assets/images/job/job-img-6.jpg"
                      alt="Image"
                    />
                  </Link>
                  <a href="#">
                    <div className="bookmark">
                      <i className="flaticon-bookmark" />
                    </div>
                  </a>
                  <a href="#">
                    <span className="urgent">Urgent</span>
                  </a>
                </div>
                <div className="job-content">
                  <span className="time">Fulltime</span>
                  <h2>
                    <Link to="/job-details">
                      Full Web Designing Course With 20 Web Template Designing
                    </Link>
                  </h2>
                  <div className="info">
                    <ul>
                      <li>
                        <i className="flaticon-time" />2 Days Left
                      </li>
                      <li>
                        <i className="flaticon-location" />
                        42, Malsh Street, USA
                      </li>
                    </ul>
                  </div>
                  <div className="bottom-content">
                    <ul className="d-flex justify-content-between">
                      <li>
                        <div className="left-content">
                          <div className="icon">
                            <img
                              src="/jobPortal/assets/images/icon/icon-7.png"
                              alt="Logo"
                            />
                          </div>
                          <span>Abaz News Magazine</span>
                        </div>
                      </li>
                      <li>
                        <h3>
                          $120 <span>/Month</span>
                        </h3>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link to="/jobs" className="default-btn btn">
              Browse All Jobs
            </Link>
          </div>
        </div>
      </div>
      <div className="reviews-area bg-f0f5f7 ptb-100">
        <div className="container">
          <div className="section-title">
            <h2>
              <label className="oragneColor">Review</label> Of The Users
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod
            </p>
          </div>
          {/* <div className="reviews-slider owl-carousel owl-theme">
            <div className="single-reviews-card bu">
              <div className="ratings">
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
              </div>
              <p>
                “Morbi porttitor ligula id varius consectetur. Integer ipsum
                justo, congue sit amet massa vel, porttitor semper magna. Orci
                varius natoque penatibus et magnis dis parturient”
              </p>
              <div className="clien-info">
                <h3>Nikolas Brooten</h3>
                <span>Digital Marketer</span>
              </div>
              <div className="quote">
                <i className="fa-solid fa-quote-left" />
              </div>
            </div>
            <div className="single-reviews-card bu">
              <div className="ratings">
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
              </div>
              <p>
                “Morbi porttitor ligula id varius consectetur. Integer ipsum
                justo, congue sit amet massa vel, porttitor semper magna. Orci
                varius natoque penatibus et magnis dis parturient”
              </p>
              <div className="clien-info">
                <h3>Terry Ambady</h3>
                <span>IT Specialist</span>
              </div>
              <div className="quote">
                <i className="fa-solid fa-quote-left" />
              </div>
            </div>
            <div className="single-reviews-card bu">
              <div className="ratings">
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
              </div>
              <p>
                “Morbi porttitor ligula id varius consectetur. Integer ipsum
                justo, congue sit amet massa vel, porttitor semper magna. Orci
                varius natoque penatibus et magnis dis parturient”
              </p>
              <div className="clien-info">
                <h3>Camelia Renesa</h3>
                <span>President Of Sale</span>
              </div>
              <div className="quote">
                <i className="fa-solid fa-quote-left" />
              </div>
            </div>
            <div className="single-reviews-card bu">
              <div className="ratings">
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
              </div>
              <p>
                “Morbi porttitor ligula id varius consectetur. Integer ipsum
                justo, congue sit amet massa vel, porttitor semper magna. Orci
                varius natoque penatibus et magnis dis parturient”
              </p>
              <div className="clien-info">
                <h3>Nikolas Brooten</h3>
                <span>Digital Marketer</span>
              </div>
              <div className="quote">
                <i className="fa-solid fa-quote-left" />
              </div>
            </div>
            <div className="single-reviews-card bu">
              <div className="ratings">
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
              </div>
              <p>
                “Morbi porttitor ligula id varius consectetur. Integer ipsum
                justo, congue sit amet massa vel, porttitor semper magna. Orci
                varius natoque penatibus et magnis dis parturient”
              </p>
              <div className="clien-info">
                <h3>Terry Ambady</h3>
                <span>IT Specialist</span>
              </div>
              <div className="quote">
                <i className="fa-solid fa-quote-left" />
              </div>
            </div>
            <div className="single-reviews-card bu">
              <div className="ratings">
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
              </div>
              <p>
                “Morbi porttitor ligula id varius consectetur. Integer ipsum
                justo, congue sit amet massa vel, porttitor semper magna. Orci
                varius natoque penatibus et magnis dis parturient”
              </p>
              <div className="clien-info">
                <h3>Camelia Renesa</h3>
                <span>President Of Sale</span>
              </div>
              <div className="quote">
                <i className="fa-solid fa-quote-left" />
              </div>
            </div>
          </div> */}
          <div className="reviews-slider-wrapper">
            <Slider {...settings1}>
              {reviews.map((item, idx) => (
                <div key={idx} className="single-reviews-card">
                  <div className="ratings">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="star" />
                    ))}
                  </div>
                  <p>{item.text}</p>
                  <div className="client-info">
                    <h3>{item.name}</h3>
                    <span>{item.role}</span>
                  </div>
                  <div className="quote-icon">
                    <FaQuoteLeft />
                  </div>
                </div>
              ))}
            </Slider>
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
                <div className="inbox">
                  <div className="icon">
                    <i className="fa-regular fa-envelope" />
                  </div>
                  <h3>Inbox</h3>
                  <span>Work With Us!</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="cv-content pl-15">
                <h2>
                  Put Your CV In Front Of The Great For{" "}
                  <label class="oragneColor">Employers To See</label>
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor labore et dolore magna aliqua. Quis ipsum
                  suspendisse ultrices gravida risus viverra maecenas accumsan
                  lacus vel facilisis dolore magna.
                </p>
                <div className="cv-btn">
                  <a href="#!" className="default-btn btn mr-20">
                    Upload Your CV
                  </a>
                  <a
                    className="popup-youtube video-btn"
                    href="https://www.youtube.com/watch?v=6WQCJx_vEX4"
                  >
                    <i className="fa-solid fa-play" />
                    CEO Message
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
              Top Hiring <label class="oragneColor">Company</label>
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
      <div className="job-location bg-f0f5f7 ptb-100">
        <div className="container">
          <div className="section-title">
            <h2>
              Popular Job <label class="oragneColor">Location</label>
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod
            </p>
          </div>
          {/* <div className="job-location-slider owl-carousel owl-theme">
            <div className="job-location-card">
              <img src="/jobPortal/assets/images/job/job-img-7.jpg" alt="Image" />
              <span>3 Open Job</span>
              <h3>
                <a href="job-listing.html">Kabul, Afganistan</a>
              </h3>
            </div>
            <div className="job-location-card">
              <img src="/jobPortal/assets/images/job/job-img-8.jpg" alt="Image" />
              <span>6 Open Job</span>
              <h3>
                <a href="job-listing.html">Austria, Vienna</a>
              </h3>
            </div>
            <div className="job-location-card">
              <img src="/jobPortal/assets/images/job/job-img-9.jpg" alt="Image" />
              <span>2 Open Job</span>
              <h3>
                <a href="job-listing.html">Tirana, Albania</a>
              </h3>
            </div>
            <div className="job-location-card">
              <img src="/jobPortal/assets/images/job/job-img-10.jpg" alt="Image" />
              <span>8 Open Job</span>
              <h3>
                <a href="job-listing.html">Cardiff, UK</a>
              </h3>
            </div>
            <div className="job-location-card">
              <img src="/jobPortal/assets/images/job/job-img-7.jpg" alt="Image" />
              <span>3 Open Job</span>
              <h3>
                <a href="job-listing.html">Kabul, Afganistan</a>
              </h3>
            </div>
            <div className="job-location-card">
              <img src="/jobPortal/assets/images/job/job-img-8.jpg" alt="Image" />
              <span>6 Open Job</span>
              <h3>
                <a href="job-listing.html">Austria, Vienna</a>
              </h3>
            </div>
            <div className="job-location-card">
              <img src="/jobPortal/assets/images/job/job-img-9.jpg" alt="Image" />
              <span>2 Open Job</span>
              <h3>
                <a href="job-listing.html">Tirana, Albania</a>
              </h3>
            </div>
            <div className="job-location-card">
              <img src="/jobPortal/assets/images/job/job-img-10.jpg" alt="Image" />
              <span>8 Open Job</span>
              <h3>
                <a href="job-listing.html">Cardiff, UK</a>
              </h3>
            </div>
          </div> */}
          <div className="job-location-slider-wrapper">
            <Slider {...settings2}>
              {jobs.map((job, index) => (
                <div key={index} className="job-location-slide">
                  <div className="job-location-card">
                    <img src={job.image} alt={job.title} />
                    <span className="job-count">{job.count}</span>
                    <h3>
                      <a href="job-listing.html">{job.title}</a>
                    </h3>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
      <div className="freelancer-area pt-100 pb-70">
        <div className="container">
          <div className="freelancer-top-content">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-9">
                <div className="section-title style2">
                  <h2>
                    Highest Rated <label class="oragneColor">Freelancers</label>
                  </h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="browse-btn">
                  <a href="freelancer.html">Browse All Candidates</a>
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
                      <a href="freelancer-details.html">
                        <img
                          src="/jobPortal/assets/images/freelancers/freelancers-img-1.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="freelancer-details.html">
                        <h3>Jequline Fenda</h3>
                      </a>
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
                      <a href="freelancer-details.html">
                        <img
                          src="/jobPortal/assets/images/freelancers/freelancers-img-2.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="freelancer-details.html">
                        <h3>Thomas Abedin</h3>
                      </a>
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
                      <a href="freelancer-details.html">
                        <img
                          src="/jobPortal/assets/images/freelancers/freelancers-img-3.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="freelancer-details.html">
                        <h3>Jean Burke</h3>
                      </a>
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
                      <a href="freelancer-details.html">
                        <img
                          src="/jobPortal/assets/images/freelancers/freelancers-img-4.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="freelancer-details.html">
                        <h3>Robin William</h3>
                      </a>
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
                      <a href="freelancer-details.html">
                        <img
                          src="/jobPortal/assets/images/freelancers/freelancers-img-5.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="freelancer-details.html">
                        <h3>Tom Henry</h3>
                      </a>
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
                      <a href="freelancer-details.html">
                        <img
                          src="/jobPortal/assets/images/freelancers/freelancers-img-6.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="freelancer-details.html">
                        <h3>Jubra Ward</h3>
                      </a>
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
                    Read Our Article To{" "}
                    <label class="oragneColor">Get Tricks</label>{" "}
                  </h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod dolore magna
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="browse-btn">
                  <a href="freelancer.html">Browse All Candidates</a>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8">
              <div className="row">
                <div
                  className="col-lg-6 col-md-6"
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
                  className="col-lg-6 col-md-6"
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
              </div>
            </div>
            <div className="col-lg-4">
              <div className="row justify-content-center">
                <div
                  className="col-lg-12 col-md-6"
                  data-aos=""
                  data-aos-duration={1200}
                  data-aos-delay={400}
                >
                  <div className="single-blog-card style2">
                    <div className="row">
                      <div className="col-lg-4 col-sm-4">
                        <div className="blog-img">
                          <a href="blog-details.html">
                            <img
                              src="/jobPortal/assets/images/blog/blog-img-3.jpg"
                              alt="Image"
                            />
                          </a>
                        </div>
                      </div>
                      <div className="col-lg-8 col-sm-8">
                        <div className="blog-content">
                          <div className="info-list">
                            <ul>
                              <li>
                                <i className="fa-solid fa-user" />
                                <a href="#">Espinoza Lara</a>
                              </li>
                              <li>
                                <i className="fa-solid fa-calendar-days" /> Feb
                                12, 2024
                              </li>
                            </ul>
                          </div>
                          <h2>
                            <a href="blog-details.html">
                              The Most Popular Job in The Country
                            </a>
                          </h2>
                          <a href="blog-details.html" className="read-more">
                            Read More
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-12 col-md-6"
                  data-aos=""
                  data-aos-duration={1200}
                  data-aos-delay={600}
                >
                  <div className="single-blog-card style2">
                    <div className="row">
                      <div className="col-lg-4 col-sm-4">
                        <div className="blog-img">
                          <a href="blog-details.html">
                            <img
                              src="/jobPortal/assets/images/blog/blog-img-4.jpg"
                              alt="Image"
                            />
                          </a>
                        </div>
                      </div>
                      <div className="col-lg-8 col-sm-8">
                        <div className="blog-content">
                          <div className="info-list">
                            <ul>
                              <li>
                                <i className="fa-solid fa-user" />
                                <a href="#">Runald Jhon</a>
                              </li>
                              <li>
                                <i className="fa-solid fa-calendar-days" /> Feb
                                12, 2024
                              </li>
                            </ul>
                          </div>
                          <h2>
                            <a href="blog-details.html">
                              We’ve Weeded Through a Job Hunting
                            </a>
                          </h2>
                          <a href="blog-details.html" className="read-more">
                            Read More
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-12 col-md-6"
                  data-aos=""
                  data-aos-duration={1200}
                  data-aos-delay={800}
                >
                  <div className="single-blog-card style2">
                    <div className="row">
                      <div className="col-lg-4 col-sm-4">
                        <div className="blog-img">
                          <a href="blog-details.html">
                            <img
                              src="/jobPortal/assets/images/blog/blog-img-5.jpg"
                              alt="Image"
                            />
                          </a>
                        </div>
                      </div>
                      <div className="col-lg-8 col-sm-8">
                        <div className="blog-content">
                          <div className="info-list">
                            <ul>
                              <li>
                                <i className="fa-solid fa-user" />
                                <a href="#">Michel Adward </a>
                              </li>
                              <li>
                                <i className="fa-solid fa-calendar-days" /> Feb
                                12, 2024
                              </li>
                            </ul>
                          </div>
                          <h2>
                            <a href="blog-details.html">
                              Find Thousand Job If You Ready To Get
                            </a>
                          </h2>
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
        </div>
      </div>
      <div className="contact-area bg-f0f5f7">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-9">
              <div className="contact-left-content">
                <h2>
                  Find Your Next Great{" "}
                  <label class="oragneColor">Job Opportunity!</label>
                </h2>
              </div>
            </div>
            <div className="col-lg-4 col-md-3">
              <div className="contact-btn">
                <Link to="/contact-us" className="default-btn btn">
                  Contact Us Now
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
