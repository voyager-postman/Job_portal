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
import { ToastContainer, toast } from "react-toastify";

function EmployerHomePage() {
  const { t, i18n } = useTranslation("global");
  const [sliders, setSliders] = useState([]);
  const [secondSection, setSecondSection] = useState(null);
  const [thirdSection, setThirdSection] = useState(null);
  const [fourthSection, setFourthSection] = useState(null);
  const [fifthSection, setFifthSection] = useState(null);
  const fetchRecruiterHome = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}recruiterHome`);
      console.log(res);

      if (res.data.success) {
        setSliders(res.data.data.sliders);
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
  return (
    <>
      <section className="employer-slider-info-area">
        <div
          id="carouselExampleCaptions"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          {/* Indicators */}
          <div className="carousel-indicators">
            {sliders?.map((slider, index) => (
              <button
                key={slider._id}
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
              />
            ))}
          </div>

          {/* Slides */}
          <div className="carousel-inner">
            {sliders?.map((slider, index) => (
              <div
                key={slider._id}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  crossorigin="anonymous"
                  src={`${API_IMAGE_URL}${slider.image}`}
                  className="d-block w-100"
                  alt="slider"
                />

                <div className="carousel-caption d-none d-md-block">
                  <h2>{slider.title}</h2>
                  <p>{slider.paragraph}</p>

                  <Link to="/employer-register" className="default-btn btn">
                    {t("header.Get_Start")}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Previous */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" />
          </button>

          {/* Next */}
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
        <section className="employer-home-first-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="employer-home-first-section-img">
                  <img
                    crossorigin="anonymous"
                    src={
                      secondSection?.image
                        ? `${API_IMAGE_URL}${secondSection.image}`
                        : "/jobPortal/assets/images/employer-home/home-first-section-img.jpg"
                    }
                    alt="section"
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="section-title">
                  <h2>
                    {secondSection?.title?.split("Easily")[0]}
                    <label className="oragneColor">Easily & Quickly</label>
                  </h2>

                  <p>{secondSection?.paragraph}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      <section className="employer-home-second-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="section-title">
                <h2>
                  {thirdSection?.title?.split(" ").slice(0, -2).join(" ")}{" "}
                  <label className="oragneColor">
                    {thirdSection?.title?.split(" ").slice(-2).join(" ")}
                  </label>
                </h2>

                <p>{thirdSection?.paragraph}</p>
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="employer-home-second-section-img">
                <img
                  crossorigin="anonymous"
                  src={
                    thirdSection?.image
                      ? `${API_IMAGE_URL}${thirdSection.image}`
                      : "/jobPortal/assets/images/employer-home/new-home-second-section-img.png"
                  }
                  alt="section"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="employer-home-third-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="section-title">
                <h2>
                  Steps Of Recruitment{" "}
                  <label className="oragneColor">Process</label>
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3">
              <div className="employer-home-category-card">
                <div className="icon">
                  <i className="far fa-id-card" />
                </div>
                <h3>Identifying The Needs</h3>
                <p>Hear from industry leading HR professionals and solution</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3">
              <div className="employer-home-category-card">
                <div className="icon">
                  <i className="far fa-file-alt" />
                </div>
                <h3>Preparing A Job Description</h3>
                <p>
                  Access to all of your candidate responses and against global
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3">
              <div className="employer-home-category-card">
                <div className="icon">
                  <i className="fas fa-search" />
                </div>
                <h3>Find A Talented Candidate</h3>
                <p>
                  Companies are backing up their strategic decisions with inform
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3">
              <div className="employer-home-category-card">
                <div className="icon">
                  <i className="far fa-user" />
                </div>
                <h3>Screening And Shortlisting</h3>
                <p>
                  Make smart decisions with our guide to solution and service
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <section className="employer-home-third-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="section-title">
                <h2>
                  {fourthSection?.title?.split(" ").slice(0, -1).join(" ")}{" "}
                  <label className="oragneColor">
                    {fourthSection?.title?.split(" ").slice(-1)}
                  </label>
                </h2>

                <p>{fourthSection?.paragraph}</p>
              </div>
            </div>

            {fourthSection?.steps?.map((step, index) => {
              const icons = [
                "far fa-id-card",
                "far fa-file-alt",
                "fas fa-search",
                "far fa-user",
              ];

              return (
                <div className="col-lg-3 col-md-3" key={step._id}>
                  <div className="single-category-card">
                    <div className="icon">
                      <i className={icons[index]} />
                    </div>

                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="employer-home-fourth-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="employer-home-fourth-section-img">
                <img
                  crossorigin="anonymous"
                  src={`${API_IMAGE_URL}${fifthSection?.image}`}
                  alt="recruitment"
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="section-title">
                <h2>
                  {fifthSection?.title?.split(" ").slice(0, -1).join(" ")}{" "}
                  <label className="oragneColor">
                    {fifthSection?.title?.split(" ").slice(-1)}
                  </label>
                </h2>

                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>

              {fifthSection?.cards?.map((card, index) => {
                const icons = [
                  "fa-regular fa-user",
                  "fa-regular fa-circle-user",
                ];

                return (
                  <div className="employer-home-fourth-box" key={card._id}>
                    <div className="employer-home-fourth-icon">
                      <i className={icons[index]} />
                    </div>

                    <div className="employer-home-fourth-box-content">
                      <h4>{card.title}</h4>
                      <p>{card.description}</p>
                    </div>
                  </div>
                );
              })}

              <div className="employer-home-fourth-bottom-content">
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EmployerHomePage;
