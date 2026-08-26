import React from "react";
import { Link } from "react-router-dom";
import { SITE } from "../utils/seo";
import { useTranslation } from "react-i18next";

function SendOtp() {
  const { t } = useTranslation("global");

  return (
    <>
      <section className="forgot-password-info-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 p-0">
              <div className="password-area">
                <div className="company-logo-info-area">
                  <img
                    src="assets/images/logo/connect-work-ma-login.png"
                    className="main-logo"
                    alt={`${SITE.name} logo`}
                    loading="eager"
                    decoding="async"
                  />
                </div>

                <div className="container">
                  <div className="password">
                    <h1>{t("otp.verify_title")}</h1>
                    <form>
                      <p className="form-section-lead">{t("otp.verify_subtitle")}</p>

                      <div className="form-group">
                        <label>{t("otp.otp_label")}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("otp.enter_otp_placeholder")}
                          maxLength="6"
                        />
                      </div>

                      <div className="forgot-password-btn">
                        <button type="submit" className="default-btn btn">
                          {t("otp.verify_btn")}
                        </button>
                      </div>

                      <div className="text-center mt-3">
                        <p>
                          {t("otp.resend_prompt")}{" "}
                          <Link to="/recovery-password">{t("otp.resend_link")}</Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 p-0">
              <div className="login-img-info-area">
                <img
                  src="assets/images/company/book-appointment-orignal.png"
                  alt="otp-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SendOtp;
