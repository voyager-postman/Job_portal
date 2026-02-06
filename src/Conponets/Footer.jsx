import React from "react";
import { Link } from "react-router-dom";

function Footer() {
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
                        src="/jobPortal/assets/images/white-logo.png"
                        alt="Image"
                      />
                    </Link>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consec tetur adipiscing elit
                    eiusmod tempor incididunt eiusmod tempor incididunt.
                  </p>
                  <div className="social-content">
                    <ul>
                      <li>
                        {" "}
                        <span>Follow Us:</span>
                      </li>
                      <li>
                        <a href="https://www.facebook.com/" target="_blank">
                          <i className="fa-brands fa-facebook-f" />
                        </a>
                      </li>
                      <li>
                        <a href="https://www.twitter.com/" target="_blank">
                          <i className="fa-brands fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://instagram.com/?lang=en"
                          target="_blank"
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
                        <Link to="/faq">FAQ JobSeeker </Link>
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
                        <Link to="/faq">FAQ Employer</Link>
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
                      <h4>Location: 2976 sunrise road las vegas</h4>
                    </li>
                    <li>
                      <i className="fa-solid fa-envelope" />
                      <h4>
                        Email :{" "}
                        <a href="mailto:info@companyname.com">
                          info@companyname.com
                        </a>
                      </h4>
                    </li>
                    <li>
                      <i className="fa-solid fa-phone" />
                      <h4>
                        Phone: <a href="tel:098765432150">098765432150</a>
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
