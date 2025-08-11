import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import mixitup from "mixitup";
import "odometer/themes/odometer-theme-default.css";
import Odometer from "react-odometerjs";
import { Link } from "react-router-dom";

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
    AOS.init({ once: true });
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
                <div className="candidate-content">
                  <div className="candidate">
                    <a href="candidates.html">Candidate</a>
                  </div>
                  <p>
                    “Lorem ipsum dolor sit amet labore et dolore magna aliqua”
                  </p>
                  <div className="info">
                    <h4>Dunald Milon</h4>
                    <span>Web Designer</span>
                  </div>
                </div>
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
            <h2>How Jaba Works For You</h2>
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
                  <div
                    className="col-lg-6 col-md-6"
                    data-aos="fade-up"
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
                    data-aos="fade-down"
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
                <h2>Put Your CV In Front Of The Great For Employers To See</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor labore et dolore magna aliqua. Quis ipsum
                  suspendisse ultrices gravida risus viverra maecenas accumsan
                  lacus vel facilisis dolore magna.
                </p>
                <div className="cv-btn">
                  <a
                    href="https://templates.hibootstrap.com/cdn-cgi/l/email-protection#8cefe3e2f8edeff8cce6edeeeda2efe3e1a2"
                    className="default-btn btn mr-20"
                  >
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
      <div className="reviews-area bg-f0f5f7 pt-100 pb-70">
        <div className="container">
          <div className="section-title">
            <h2>Review Of The Users</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod
            </p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="single-review-box style-2">
                <div className="top-content">
                  <div className="review-img">
                    <img
                      src="/jobPortal/assets/images/review/review-img-1.png"
                      alt="Image"
                    />
                  </div>
                  <h3>Nikolas Brooten</h3>
                  <span>Digital Marketer</span>
                  <div className="ratings">
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                  </div>
                </div>
                <p>
                  “Morbi porttitor ligula id varius consectetur. Integer ipsum
                  justo, congue sit amet massa vel porttitor semper magna. Orci
                  varius amet”
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="single-review-box style-2">
                <div className="top-content">
                  <div className="review-img">
                    <img
                      src="/jobPortal/assets/images/review/review-img-2.png"
                      alt="Image"
                    />
                  </div>
                  <h3>Jennifer Rose</h3>
                  <span>IT Specialist</span>
                  <div className="ratings">
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                  </div>
                </div>
                <p>
                  “Morbi porttitor ligula id varius consectetur. Integer ipsum
                  justo, congue sit amet massa vel porttitor semper magna. Orci
                  varius amet”
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="single-review-box style-2">
                <div className="top-content">
                  <div className="review-img">
                    <img
                      src="/jobPortal/assets/images/review/review-img-3.png"
                      alt="Image"
                    />
                  </div>
                  <h3>Camelia Renesa</h3>
                  <span>Web Designer</span>
                  <div className="ratings">
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                  </div>
                </div>
                <p>
                  “Morbi porttitor ligula id varius consectetur. Integer ipsum
                  justo, congue sit amet massa vel porttitor semper magna. Orci
                  varius amet”
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="team-area pt-100 pb-70">
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
              <div className="col-lg-4 col-md-3">
                <div className="browse-btn">
                  <a href="company.html" className="default-btn btn">
                    View All Categories
                  </a>
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
