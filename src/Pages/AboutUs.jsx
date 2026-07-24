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
import PageSEO from "../components/PageSEO";
import { absoluteUrl, buildOrganizationSchema, buildBreadcrumbSchema } from "../utils/seo";
import { ToastContainer, toast } from "react-toastify";
import AOS from "aos";

function AboutUs() {
  const [homeData, setHomeData] = useState({});
  const [secondSection, setSecondSection] = useState(null);
  const [teamSection, setTeamSection] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("global");
  const steps = [
    {
      icon: "flaticon-bag",
      number: 1,
      title: t("jobs.find_right_job"),
      description: t("jobs.lorem_short"),
      delay: 200,
    },
    {
      icon: "flaticon-company",
      number: 2,
      title: t("jobs.research_companies"),
      description: t("jobs.lorem_short"),
      delay: 400,
    },
    {
      icon: "flaticon-business",
      number: 3,
      title: t("jobs.compare_salaries"),
      description: t("jobs.lorem_short"),
      delay: 600,
    },
    {
      icon: "flaticon-recruitment",
      number: 4,
      title: t("jobs.register_account"),
      description: t("jobs.lorem_short"),
      delay: 800,
    },
  ];
  const containerRef = useRef(null);
  const [stats, setStats] = useState([]);
  const [aboutData, setAboutData] = useState(null);

  const fetchAboutUs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getAboutUs`);
      console.log(res);
      setAboutData(res.data.data.firstSection);
      setSecondSection(res.data.data.secondSection);
      setTeamSection(res.data.data.teamSection);
    } catch (error) {
      console.error(error);
      toast.error(t("header.Failed_to_fetch_About_Us_data"));
    }
  };
  const getStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getHomePageStats`);

      const data = res.data.data;

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
    fetchAboutUs();
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
      <PageSEO
        title={t("header.aboutUs")}
        description="Learn about Connect Work.ma, our mission, and how we help job seekers and employers connect across Morocco."
        canonical="/about-us"
        image="/assets/images/banner/inner-banner-img.jpg"
        jsonLd={[
          buildOrganizationSchema({
            description:
              "Job portal connecting job seekers with top companies across Morocco.",
            url: absoluteUrl("/about-us"),
          }),
          buildBreadcrumbSchema([
            { name: t("header.home"), path: "/" },
            { name: t("header.aboutUs"), path: "/about-us" },
          ]),
        ]}
      />
      <section className="inner-banners-info-area">
        <div className="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt={t("header.aboutUs")}
          />
        </div>
        <div className="inner-banners-title-info">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="inner-page-banner-title">
                  <h1>{t("header.aboutUs")}</h1>
                  <ul>
                    <li className="menu-divide-arrow">
                      <Link to="/">{t("header.home")}</Link>
                    </li>
                    <li> {t("header.aboutUs")}</li>
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
                  src={
                    aboutData?.image
                      ? `${API_IMAGE_URL}${aboutData.image}`
                      : "/jobPortal/assets/images/cv/candidate-with-cv.png"
                  }
                  alt={aboutData?.mainTitle || t("header.aboutUs")}
                  onError={(e) => {
                    e.target.src =
                      "/jobPortal/assets/images/cv/candidate-with-cv.png";
                  }}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="cv-content style2 pl-15">
                <h2>
                  {aboutData?.mainTitle ? (
                    <>
                      {aboutData.mainTitle.split("For")[0] + "For "}
                      <span className="oragneColor">
                        {aboutData.mainTitle.split("For")[1]}
                      </span>
                    </>
                  ) : (
                    t("jobs.loading")
                  )}
                </h2>

                {aboutData?.mainTitleDescription &&
                  aboutData.mainTitleDescription
                    .split("\r\n\r\n")
                    .map((para, index) => <p key={index}>{para}</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="works-area pt-100 pb-70 bg-f0f5f7">
        <div className="container">
          <div className="section-title">
            <h2>{secondSection?.mainTitle || t("jobs.loading")}</h2>
            <p>{secondSection?.description}</p>
          </div>

          <div className="row">
            {secondSection?.steps?.map((step, index) => (
              <div
                key={step._id || index}
                className="col-lg-3 col-sm-6"
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay={(index + 1) * 200}
              >
                <div className="single-works-card style-2">
                  <div className="icon">
                    {/* Static icons (since API doesn't provide icons) */}
                    <i
                      className={
                        [
                          "flaticon-bag",
                          "flaticon-company",
                          "flaticon-business",
                          "flaticon-recruitment",
                        ][index % 4]
                      }
                    />

                    <div className="number">
                      <span>{index + 1}</span>
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
                          alt={`${homeData?.fifthSection?.mainTitle || t("header.uploadYourCV")} - ${index + 1}`}
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

      <div className="reviews-area bg-f0f5f7 pt-50 pb-70">
        <div className="container">
          <div className="title">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-9">
                <div className="section-title style2">
                  <h2>{teamSection?.title || t("jobs.loading")}</h2>
                  <p>{teamSection?.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {teamSection?.members?.map((member, index) => (
              <div key={member._id || index} className="col-lg-3 col-sm-6">
                <div className="single-team-card">
                  {/* ✅ Image with fallback */}
                  <div className="team-img">
                    <img
                      crossorigin="anonymous"
                      src={`${API_IMAGE_URL}${member.image}`}
                      alt={member.name}
                      onError={(e) => {
                        console.log("Image failed:", e.target.src);
                        e.target.src =
                          "/jobPortal/assets/images/team/team-1.jpg";
                      }}
                    />
                  </div>

                  <div className="team-content">
                    <div className="row align-items-center">
                      <div className="col-10">
                        <div className="team-left-content">
                          <h3>{member.name}</h3>
                          <span>{member.designation}</span>
                        </div>
                      </div>

                      <div className="col-2">
                        <div className="social-content">
                          <div className="social-control">
                            <div className="icon">
                              <i className="fa-solid fa-plus" />
                            </div>

                            {/* ✅ Dynamic Social Links */}
                            <div className="social-icon">
                              <ul>
                                <li>
                                  <a
                                    href={member.socialLinks?.facebook}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <i className="flaticon-facebook-app-symbol" />
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={member.socialLinks?.twitter}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <i className="flaticon-twitter" />
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={member.socialLinks?.instagram}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <i className="flaticon-instagram" />
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href={member.socialLinks?.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
