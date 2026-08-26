import { Link } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SITE } from "../utils/seo";
import axios from "axios";
import { isAuthReady } from "../utils/apiHeaders";

function Footer() {
  const { t, i18n } = useTranslation("global");
  const [homeData, setHomeData] = useState({});
  const [contactData, setContactData] = useState({});
  const getContactInfo = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getContactUs`);

      if (res.data.success) {
        setContactData(res.data.data);
      }
    } catch (error) {
      console.error("Contact info error:", error);
    }
  };

  useEffect(() => {
    getContactInfo();
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
  const userRole = localStorage.getItem("user_role");
  const isJobSeeker = userRole === "JobSeeker";
  const isEmployer = userRole === "Recruiter" || userRole === "Company";
  const isGuest = !userRole;

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer>
        <div className="footer-area bg-color pt-50 pb-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-sm-6">
                <div className="single-footer-widget logo-content">
                  <div className="footer-logo">
                    <Link className="navbar-brand" to="/">
                      <img
                        crossOrigin="anonymous"
                        src={
                          homeData?.footerSection?.image
                            ? `${API_IMAGE_URL}${homeData.footerSection.image}`
                            : "/jobPortal/assets/images/white-logo.png"
                        }
                        alt={`${SITE.name} logo`}
                        width={160}
                        height={42}
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>
                  </div>

                  <p>{homeData?.footerSection?.shortDescription}</p>

                  <div className="social-content">
                    <ul>
                      <li>
                        <span>{t("header.followUs")}:</span>
                      </li>

                      <li>
                        <a
                          href={homeData?.footerSection?.socialLinks?.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-facebook-f" />
                        </a>
                      </li>

                      <li>
                        <a
                          href={homeData?.footerSection?.socialLinks?.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-twitter" />
                        </a>
                      </li>

                      <li>
                        <a
                          href={homeData?.footerSection?.socialLinks?.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-instagram" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {(isJobSeeker || isGuest) && (
                <div className="col-lg-2 col-sm-6">
                  <div className="single-footer-widget quick-link">
                    <h3>{t("header.jobSeeker")}</h3>
                    <ul>
                      <li>
                        <Link to="/jobs"> {t("header.browseJobs")} </Link>
                      </li>
                      <li>
                        <Link to="/companies">
                          {t("header.browseCompanies")}{" "}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={
                            userRole === "JobSeeker"
                              ? "/candidate-profile"
                              : "/login"
                          }
                        >
                          {t("header.uploadResume")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/faq/jobseeker">
                          {t("header.faqJobSeeker")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {(isEmployer || isGuest) && (
                <div className="col-lg-2 col-sm-6">
                  <div className="single-footer-widget quick-link">
                    <h3>{t("header.employer")}</h3>
                    <ul>
                      <li>
                        <Link
                          to={
                            userRole === "Recruiter" || userRole === "Company"
                              ? "/your-job-posts"
                              : "/employer-login"
                          }
                        >
                          {t("header.jobPosts")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={
                            isAuthReady()
                              ? "/bookmark-candidate"
                              : "/employer-login"
                          }
                        >
                          {t("header.cvDatabase")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={
                            isAuthReady()
                              ? "/candidates-search"
                              : "/employer-login"
                          }
                        >
                          {t("header.candidateListing")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/faq/recruiter">
                          {" "}
                          {t("header.faqEmployer")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              <div className="col-lg-4 col-sm-6">
                <div className="single-footer-widget info">
                  <h3>{t("header.contactInfo")}</h3>
                  <ul>
                    <li>
                      <i className="fa-solid fa-location-dot" />
                      <h4>{contactData.location?.address}</h4>
                    </li>
                    <li>
                      <i className="fa-solid fa-envelope" />
                      <h4>
                        {t("header.email")} :{" "}
                        {contactData.emails?.map((e, i) => (
                          <span key={i}>
                            <a href={`mailto:${e}`}>{e}</a>
                            {i !== contactData.emails.length - 1 && ", "}
                          </span>
                        ))}
                      </h4>
                    </li>
                    <li>
                      <i className="fa-solid fa-phone" />
                      <h4>
                        {t("header.phone")}:{" "}
                        {contactData.phones?.map((p, i) => (
                          <span key={i}>
                            <a href={`tel:${p}`}>{p}</a>
                            {i !== contactData.phones.length - 1 && ", "}
                          </span>
                        ))}
                      </h4>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copy-right">
          <div className="container">
            <p>
              <span></span>
              <a
                href="https://itdevelopmentservices.com/jobPortal"
                target="_blank"
              >
                © 2026 Connect Work.ma | All Rights Reserved
              </a>
            </p>
          </div>
        </div>
        <div
          className="go-top"
          onClick={handleScrollTop}
          style={{ cursor: "pointer" }}
        >
          <i className="fa-solid fa-arrow-up-long" />
          <i className="fa-solid fa-arrow-up-long" />
        </div>
      </footer>
    </>
  );
}

export default Footer;
