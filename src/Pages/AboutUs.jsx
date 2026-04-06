import { useInView } from "react-intersection-observer";
import mixitup from "mixitup";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";

import "odometer/themes/odometer-theme-default.css";
import Odometer from "react-odometerjs";
import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AOS from "aos";
const steps = [
  {
    icon: "flaticon-bag",
    number: 1,
    title: "Find The Right Job",
    description: "There many variations of dolor passages of Lorem Ipsum.",
    delay: 200,
  },
  {
    icon: "flaticon-company",
    number: 2,
    title: "Research Companies",
    description: "There many variations of dolor passages of Lorem Ipsum.",
    delay: 400,
  },
  {
    icon: "flaticon-business",
    number: 3,
    title: "Compare Salaries",
    description: "There many variations of dolor passages of Lorem Ipsum.",
    delay: 600,
  },
  {
    icon: "flaticon-recruitment",
    number: 4,
    title: "Register An Account",
    description: "There many variations of dolor passages of Lorem Ipsum.",
    delay: 800,
  },
];

function AboutUs() {
  const [homeData, setHomeData] = useState({});
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("global");
  const containerRef = useRef(null);
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
  const { ref, inView } = useInView({
    threshold: 0.4, // trigger when 40% is visible
    triggerOnce: true,
  });

  useEffect(() => {
    AOS.init({ once: true });
  }, []);
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}getHomePage`);

        const data = res.data?.data;

        setHomeData(data);

        // trending keywords
      } catch (error) {
        console.error(error);
      }
    };

    fetchHomeData();
  }, []);
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
  const fifthTitle = homeData?.fifthSection?.mainTitle || "";
  const fifthWords = fifthTitle.trim().split(" ");

  const fifthImages = homeData?.fifthSection?.images || [];

  return (
    <>
      {/* <div className="page-banner-area bg-f0f4fc">
        <div className="container">
          <div className="page-banner-content">
            <h1>About Us</h1>
            <ul>
              <li>
                <Link to="/" className="nav-link">
                  {" "}
                  Home
                </Link>
              </li>
              <li>About Us</li>
            </ul>
          </div>
        </div>
      </div> */}
      <section class="inner-banners-info-area">
        <div class="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="breadcrumb Img"
          />
        </div>
        <div class="inner-banners-title-info">
          <div class="container">
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="inner-page-banner-title">
                  <h2>About Us</h2>
                  <ul>
                    <li class="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>About Us</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="cv-area ptb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="cv-img-area-style2">
                <img
                  src="/jobPortal/assets/images/cv/candidate-with-cv.png"
                  alt="Image"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="cv-content style2 pl-15">
                <h2>
                  Put Your CV In Front Of The Great For{" "}
                  <label className="oragneColor">Employers To See</label>
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Feugiat enim a erat sit vulputate elementum orci. Risus nec
                  viverra ornare venenatis proin ac varius tristique ut. Vitae
                  egestas tellus amet nulla cursus.ands Pellentesque placerat
                  maecenas egestas ullamcorper sed nunc. Vitae egestas tellus
                  amet nulla something loss Pellentesque placerat maecenas
                  egestas.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Feugiat enim a erat sit vulputate elementum orci. Risus nec
                  viverra ornare venenatis proin ac varius tristique ut. Vitae
                  egestas tellus amet nulla cursus in that. Pellentesque
                  placerat maecenas egestas ullamcorper sed sarinto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="works-area pt-100 pb-70 bg-f0f5f7">
        <div className="container">
          <div className="section-title">
            <h2>How Connect Work Works For You</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
            </p>
          </div>
          <div className="row">
            {steps.map((step, index) => (
              <div
                key={index}
                className="col-lg-3 col-sm-6"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay={step.delay}
              >
                <div className="single-works-card style-2">
                  <div className="icon">
                    <i className={step.icon} />
                    <div className="number">
                      <span>{step.number}</span>
                    </div>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="counters-area pt-100 pb-70" ref={ref}>
        <div className="container">
          <div className="row">
            {stats.map((item, index) => (
              <div key={index} className="col-lg-3 col-md-3 col-6">
                <div className="single-counter-item style-2">
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
      <div className="cv-area pb-100">
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
     
     <div className="reviews-area bg-f0f5f7 pt-100 pb-70">
        <div className="container">
          <div className="title">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-9">
                <div className="section-title style2">
                  <h2>Meet Our Company Members</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod
                  </p>
                </div>
              </div>
              
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="single-team-card">
                <div className="team-img">
                  <img
                    src="/jobPortal/assets/images/team/team-1.jpg"
                    alt="Image"
                  />
                </div>
                <div className="team-content">
                  <div className="row align-items-center">
                    <div className="col-10">
                      <div className="team-left-content">
                        <h3>Jequline Fenda</h3>
                        <span>IT Developer</span>
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="social-content">
                        <div className="social-control">
                          <div className="icon">
                            <i className="fa-solid fa-plus" />
                          </div>
                          <div className="social-icon">
                            <ul>
                              <li>
                                <a
                                  href="https://www.facebook.com/"
                                  target="_blank"
                                >
                                  <i className="flaticon-facebook-app-symbol" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://www.twitter.com/"
                                  target="_blank"
                                >
                                  <i className="flaticon-twitter" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://instagram.com/?lang=en"
                                  target="_blank"
                                >
                                  <i className="flaticon-instagram" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://linkedin.com/?lang=en"
                                  target="_blank"
                                >
                                  <i className="flaticon-linkedin" />
                                </a>
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
            <div className="col-lg-3 col-sm-6">
              <div className="single-team-card">
                <div className="team-img">
                  <img
                    src="/jobPortal/assets/images/team/team-2.jpg"
                    alt="Image"
                  />
                </div>
                <div className="team-content">
                  <div className="row align-items-center">
                    <div className="col-10">
                      <div className="team-left-content">
                        <h3>Floyd Mileserton</h3>
                        <span>Web Designer</span>
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="social-content">
                        <div className="social-control">
                          <div className="icon">
                            <i className="fa-solid fa-plus" />
                          </div>
                          <div className="social-icon">
                            <ul>
                              <li>
                                <a
                                  href="https://www.facebook.com/"
                                  target="_blank"
                                >
                                  <i className="flaticon-facebook-app-symbol" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://www.twitter.com/"
                                  target="_blank"
                                >
                                  <i className="flaticon-twitter" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://instagram.com/?lang=en"
                                  target="_blank"
                                >
                                  <i className="flaticon-instagram" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://linkedin.com/?lang=en"
                                  target="_blank"
                                >
                                  <i className="flaticon-linkedin" />
                                </a>
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
            <div className="col-lg-3 col-sm-6">
              <div className="single-team-card">
                <div className="team-img">
                  <img
                    src="/jobPortal/assets/images/team/team-3.jpg"
                    alt="Image"
                  />
                </div>
                <div className="team-content">
                  <div className="row align-items-center">
                    <div className="col-10">
                      <div className="team-left-content">
                        <h3>Brooklyn Simmons</h3>
                        <span>Dog Trainer</span>
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="social-content">
                        <div className="social-control">
                          <div className="icon">
                            <i className="fa-solid fa-plus" />
                          </div>
                          <div className="social-icon">
                            <ul>
                              <li>
                                <a
                                  href="https://www.facebook.com/"
                                  target="_blank"
                                >
                                  <i className="flaticon-facebook-app-symbol" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://www.twitter.com/"
                                  target="_blank"
                                >
                                  <i className="flaticon-twitter" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://instagram.com/?lang=en"
                                  target="_blank"
                                >
                                  <i className="flaticon-instagram" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://linkedin.com/?lang=en"
                                  target="_blank"
                                >
                                  <i className="flaticon-linkedin" />
                                </a>
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
            <div className="col-lg-3 col-sm-6">
              <div className="single-team-card">
                <div className="team-img">
                  <img
                    src="/jobPortal/assets/images/team/team-4.jpg"
                    alt="Image"
                  />
                </div>
                <div className="team-content">
                  <div className="row align-items-center">
                    <div className="col-10">
                      <div className="team-left-content">
                        <h3>Michel Dunald Philips</h3>
                        <span>CEO Founder</span>
                      </div>
                    </div>
                    <div className="col-2">
                      <div className="social-content">
                        <div className="social-control">
                          <div className="icon">
                            <i className="fa-solid fa-plus" />
                          </div>
                          <div className="social-icon">
                            <ul>
                              <li>
                                <a
                                  href="https://www.facebook.com/"
                                  target="_blank"
                                >
                                  <i className="flaticon-facebook-app-symbol" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://www.twitter.com/"
                                  target="_blank"
                                >
                                  <i className="flaticon-twitter" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://instagram.com/?lang=en"
                                  target="_blank"
                                >
                                  <i className="flaticon-instagram" />
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://linkedin.com/?lang=en"
                                  target="_blank"
                                >
                                  <i className="flaticon-linkedin" />
                                </a>
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
        </div>
      </div>
    </>
  );
}

export default AboutUs;
