import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scroll
    });
  };
  return (
    <>
      <div>
        <div className="footer-area bg-color pt-100 pb-70">
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
                    eiusmod tempor incididunt labore dolore magna aliqua consec
                    tetur adipiscing elite sed do labor.
                  </p>
                  <div className="social-content">
                    <ul>
                      <li>
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
              <div className="col-lg-3 col-sm-6">
                <div className="single-footer-widget quick-link">
                  <h3>For Employer</h3>
                  <ul>
                    <li>
                      <Link to="/">Browse Candidates </Link>
                    </li>
                    <li>
                      <Link to="/">Employers Dashboard </Link>
                    </li>
                    <li>
                      <Link to="/">Job Packages </Link>
                    </li>
                    <li>
                      <Link to="/">Jobs Featured </Link>
                    </li>
                    <li>
                      <Link to="/">Post A Job </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2 col-sm-6">
                <div className="single-footer-widget quick-link">
                  <h3>Company</h3>
                  <ul>
                    <li>
                      <Link to="/about-us">About Us</Link>
                    </li>
                    <li>
                      <Link to="/contact-us">Contact Us</Link>
                    </li>
                    <li>
                      <Link to="/">Terms &amp; Conditions</Link>
                    </li>
                    <li>
                      <Link to="/">Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to="/">Candidate Listing</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="single-footer-widget info">
                  <h3>Official Info</h3>
                  <ul>
                    <li>
                      <i className="fa-solid fa-location-dot" />
                      <h4>Location:</h4>
                      <span>2976 sunrise road las vegas</span>
                    </li>
                    <li>
                      <i className="fa-solid fa-envelope" />
                      <h4>Email:</h4>
                      <a href="#!">
                        <span>[email&nbsp;protected]</span>
                      </a>
                    </li>
                    <li>
                      <i className="fa-solid fa-phone" />
                      <h4>Phone:</h4>
                      <a href="tel:098765432150">098765432150</a>
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
