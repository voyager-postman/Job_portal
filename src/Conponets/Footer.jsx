import { Link } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import React, { useEffect, useRef, useState } from "react";

import axios from "axios";

function Footer() {
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
      <div>
        <div className="footer-area bg-color pt-50 pb-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-sm-6">
                <div className="single-footer-widget logo-content">
                  <div className="footer-logo">
                    <Link className="navbar-brand" to="/">
                      <img
                        crossorigin="anonymous"
                        src={
                          homeData?.footerSection?.image
                            ? `${API_IMAGE_URL}${homeData.footerSection.image}`
                            : "/jobPortal/assets/images/white-logo.png"
                        }
                        alt="Footer Logo"
                      />
                    </Link>
                  </div>

                  <p>{homeData?.footerSection?.shortDescription}</p>

                  <div className="social-content">
                    <ul>
                      <li>
                        <span>Follow Us:</span>
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
                    <h3>Job Seeker</h3>
                    <ul>
                      <li>
                        <Link to="/jobs">Browse Jobs </Link>
                      </li>
                      <li>
                        <Link to="/companies">Browse Companies </Link>
                      </li>
                      <li>
                        <Link
                          to={
                            userRole === "JobSeeker"
                              ? "/candidate-profile"
                              : "/login"
                          }
                        >
                          Upload Your Resume
                        </Link>
                      </li>
                      <li>
                        <Link to="/faq/jobseeker">FAQ JobSeeker</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {(isEmployer || isGuest) && (
                <div className="col-lg-2 col-sm-6">
                  <div className="single-footer-widget quick-link">
                    <h3>Employer</h3>
                    <ul>
                      <li>
                        <Link
                          to={
                            userRole === "Recruiter" || userRole === "Company"
                              ? "/your-job-posts"
                              : "/employer-login"
                          }
                        >
                          Job Posts
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={
                            localStorage.getItem("token")
                              ? "/bookmark-candidate"
                              : "/employer-login"
                          }
                        >
                          CV Database
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={
                            localStorage.getItem("token")
                              ? "/candidates-search"
                              : "/employer-login"
                          }
                        >
                          Candidate Listing
                        </Link>
                      </li>
                      <li>
                        <Link to="/faq/recruiter">FAQ Employer</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              <div className="col-lg-4 col-sm-6">
                <div className="single-footer-widget info">
                  <h3>Contact Info</h3>
                  <ul>
                    <li>
                      <i className="fa-solid fa-location-dot" />
                      <h4>{contactData.location?.address}</h4>
                    </li>
                    <li>
                      <i className="fa-solid fa-envelope" />
                      <h4>
                        Email :{" "}
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
                        Phone:{" "}
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
              © <span>Connect Work.ma</span> is Proudly Owned by{" "}
              <a href="https://www.webnmobappssolutions.com/" target="_blank">
                Webnmobapps Solution Pvt. Ltd
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
      </div>
    </>
  );
}

export default Footer;
