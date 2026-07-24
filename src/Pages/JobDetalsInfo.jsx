import React from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import { useTranslation } from "react-i18next";
function JobDetalsInfo() {
  const { t } = useTranslation("global");
  return (
    <>
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
                  <h2>{t("breadcrumbs.job_details")}</h2>
                  <ul>
                    <li class="menu-divide-arrow">
                      <Link to="/">{t("header.home")}</Link>
                    </li>
                    <li>{t("breadcrumbs.job_details")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="contact-us-area pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="single-contact-info-box">
                <div className="info-content">
                  <div className="icon">
                    <i className="fa-solid fa-location-dot" />
                  </div>
                  <h3>{t("header.our_location")}</h3>
                  <span>
                    CA 560 bush st &amp; 20th ave, apt 5 san francisco,230909,
                    canada
                  </span>
                </div>
              </div>
              <div className="single-contact-info-box">
                <div className="info-content">
                  <div className="icon">
                    <i className="fa-solid fa-envelope" />
                  </div>
                  <h3>{t("header.email_us")}</h3>
                  <a href="https://templates.hibootstrap.com/cdn-cgi/l/email-protection#543c3138383b143339353d387a373b39">
                    <span
                      className="__cf_email__"
                      data-cfemail="4b232e2727240b2c262a222765282426"
                    >
                      [email&nbsp;protected]
                    </span>
                  </a>
                  <a href="https://templates.hibootstrap.com/cdn-cgi/l/email-protection#5d1b3c251d3a303c3431733e3230">
                    <span
                      className="__cf_email__"
                      data-cfemail="5a1c3b221a3d373b333674393537"
                    >
                      [email&nbsp;protected]
                    </span>
                  </a>
                </div>
              </div>
              <div className="single-contact-info-box">
                <div className="info-content">
                  <div className="icon">
                    <i className="fa-solid fa-envelope" />
                  </div>
                  <h3>{t("header.phone")}</h3>
                  <a href="tel:+44587154756">+44 587 154756</a>
                  <a href="tel:+55555514574">+55555514574</a>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="contact-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12711295.912702927!2d-97.8942370839028!3d38.93897514662292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited%20States!5e0!3m2!1sen!2sbd!4v1654928837073!5m2!1sen!2sbd"
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-form-area pb-100">
        <div className="container">
          <div className="section-title">
            <span>{t("header.send_message").toUpperCase()}</span>
            <h2>Ready To Get Started?</h2>
          </div>
          <div className="contact-form">
            <form id="contactForm">
              <div className="row">
                <div className="col-lg-6 col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      id="name"
                      className="form-control"
                      required
                      data-error="Please enter your name"
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      className="form-control"
                      required
                      data-error="Please enter your email"
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="phone_number"
                      id="phone_number"
                      placeholder="Number"
                      required
                      data-error="Please enter your number"
                      className="form-control"
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="msg_subject"
                      id="msg_subject"
                      className="form-control"
                      placeholder="Subject"
                      required
                      data-error="Please enter your subject"
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <textarea
                      name="message"
                      className="form-control"
                      placeholder="Message"
                      id="message"
                      cols={30}
                      rows={6}
                      required
                      data-error="Write your message"
                      defaultValue={""}
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-check">
                    <input
                      name="gridCheck"
                      defaultValue="I agree to the terms and privacy policy."
                      className="form-check-input"
                      type="checkbox"
                      id="gridCheck"
                      required
                    />
                    <label className="form-check-label" htmlFor="gridCheck">
                      I agree to the <a href="terms-conditions.html">terms</a>{" "}
                      and <a href="privacy-policy.html">privacy policy</a>
                    </label>
                    <div className="help-block with-errors gridCheck-error" />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <button type="submit" className="default-btn">
                    <span>Send Message</span>
                  </button>
                  <div id="msgSubmit" className="h3 text-center hidden" />
                  <div className="clearfix" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobDetalsInfo;
