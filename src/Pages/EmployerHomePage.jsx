import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import PageSEO from "../components/PageSEO";
import { PUBLIC_PAGE_SEO } from "../config/publicPageSeo";
import "./EmployerHome.css";

const STEP_ICONS = [
  "far fa-id-card",
  "far fa-file-alt",
  "fas fa-search",
  "far fa-user",
];

const FOURTH_CARD_ICONS = ["fa-regular fa-user", "fa-regular fa-circle-user"];

const highlightLastWords = (title, wordCount = 1) => {
  if (!title) return { main: "", highlight: "" };
  const words = title.trim().split(/\s+/);
  if (words.length <= wordCount) {
    return { main: "", highlight: title };
  }
  return {
    main: words.slice(0, -wordCount).join(" "),
    highlight: words.slice(-wordCount).join(" "),
  };
};

function EmployerHomePage() {
  const { t } = useTranslation("global");
  const [sliders, setSliders] = useState([]);
  const [secondSection, setSecondSection] = useState(null);
  const [thirdSection, setThirdSection] = useState(null);
  const [fourthSection, setFourthSection] = useState(null);
  const [fifthSection, setFifthSection] = useState(null);

  const fetchRecruiterHome = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}recruiterHome`);

      if (res.data.success) {
        setSliders(res.data.data.sliders || []);
        setSecondSection(res.data.data.secondSections);
        setThirdSection(res.data.data.thirdSections);
        setFourthSection(res.data.data.fourthSection);
        setFifthSection(res.data.data.fifthSection);
      }
    } catch (error) {
      console.error(error);
      toast.error(t("Failed_to_fetch_recruiter_home_data"));
    }
  };

  useEffect(() => {
    fetchRecruiterHome();
  }, []);

  const secondTitle = highlightLastWords(secondSection?.title, 2);
  const thirdTitle = highlightLastWords(thirdSection?.title, 2);
  const fourthTitle = highlightLastWords(fourthSection?.title, 1);
  const fifthTitle = highlightLastWords(fifthSection?.title, 1);

  return (
    <>
      <PageSEO
        title={PUBLIC_PAGE_SEO["/employer-home"].title}
        description={PUBLIC_PAGE_SEO["/employer-home"].description}
        canonical="/employer-home"
        image={PUBLIC_PAGE_SEO["/employer-home"].image}
        ogType={PUBLIC_PAGE_SEO["/employer-home"].ogType}
        jsonLd={PUBLIC_PAGE_SEO["/employer-home"].jsonLd}
      />
      <section className="employer-slider-info-area">
        <div
          id="carouselExampleCaptions"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            {sliders?.map((slider, index) => (
              <button
                key={slider._id}
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="carousel-inner">
            {sliders?.map((slider, index) => (
              <div
                key={slider._id}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  crossOrigin="anonymous"
                  src={`${API_IMAGE_URL}${slider.image}`}
                  className="d-block w-100"
                  alt={slider.title || "slider"}
                />

                <div className="carousel-caption d-none d-md-block">
                  {index === 0 ? (
                    <h1>{slider.title}</h1>
                  ) : (
                    <h2>{slider.title}</h2>
                  )}
                  <p>{slider.paragraph}</p>

                  <Link to="/employer-register" className="default-btn btn">
                    {t("header.Get_Start")}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" />
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" />
          </button>
        </div>
      </section>

      <section className="employer-home-first-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6">
              <div className="employer-home-media employer-home-first-section-img">
                <img
                  crossOrigin="anonymous"
                  src={
                    secondSection?.image
                      ? `${API_IMAGE_URL}${secondSection.image}`
                      : "/jobPortal/assets/images/employer-home/home-first-section-img.jpg"
                  }
                  alt={secondSection?.title || "section"}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/jobPortal/assets/images/employer-home/home-first-section-img.jpg";
                  }}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="section-title employer-home-section-copy">
                <h2>
                  {secondTitle.main}{" "}
                  {secondTitle.highlight ? (
                    <span className="oragneColor">{secondTitle.highlight}</span>
                  ) : null}
                </h2>
                <p>{secondSection?.paragraph}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="employer-home-second-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 order-lg-1 order-2">
              <div className="section-title employer-home-section-copy">
                <h2>
                  {thirdTitle.main}{" "}
                  {thirdTitle.highlight ? (
                    <span className="oragneColor">{thirdTitle.highlight}</span>
                  ) : null}
                </h2>
                <p>{thirdSection?.paragraph}</p>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 order-lg-2 order-1">
              <div className="employer-home-media employer-home-second-section-img">
                <img
                  crossOrigin="anonymous"
                  src={
                    thirdSection?.image
                      ? `${API_IMAGE_URL}${thirdSection.image}`
                      : "/jobPortal/assets/images/employer-home/new-home-second-section-img.png"
                  }
                  alt={thirdSection?.title || "section"}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/jobPortal/assets/images/employer-home/new-home-second-section-img.png";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="employer-home-third-section">
        <div className="container">
          <div className="section-title">
            <h2>
              {fourthTitle.main}{" "}
              {fourthTitle.highlight ? (
                <span className="oragneColor">{fourthTitle.highlight}</span>
              ) : null}
            </h2>
            <p>{fourthSection?.paragraph}</p>
          </div>

          <div className="row employer-recruitment-steps-row">
            {fourthSection?.steps?.map((step, index) => (
              <div
                className="col-lg-3 col-md-6 col-sm-12"
                key={step._id || step.title}
              >
                <div className="single-category-card employer-recruitment-step">
                  <div className="icon">
                    <i className={STEP_ICONS[index] || STEP_ICONS[0]} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="employer-home-fourth-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6">
              <div className="employer-home-media employer-home-fourth-section-img">
                <img
                  crossOrigin="anonymous"
                  src={
                    fifthSection?.image
                      ? `${API_IMAGE_URL}${fifthSection.image}`
                      : "/jobPortal/assets/images/employer-home/home-first-section-img.jpg"
                  }
                  alt={fifthSection?.title || "recruitment"}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/jobPortal/assets/images/employer-home/home-first-section-img.jpg";
                  }}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="section-title employer-home-section-copy">
                <h2>
                  {fifthTitle.main}{" "}
                  {fifthTitle.highlight ? (
                    <span className="oragneColor">{fifthTitle.highlight}</span>
                  ) : null}
                </h2>
                <p>{fifthSection?.paragraph}</p>
              </div>

              {fifthSection?.cards?.map((card, index) => (
                <div className="employer-home-fourth-box" key={card._id || card.title}>
                  <div className="employer-home-fourth-icon">
                    <i className={FOURTH_CARD_ICONS[index] || FOURTH_CARD_ICONS[0]} />
                  </div>

                  <div className="employer-home-fourth-box-content">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                </div>
              ))}

              {fifthSection?.bottomParagraph ? (
                <div className="employer-home-fourth-bottom-content">
                  <p>{fifthSection.bottomParagraph}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EmployerHomePage;
