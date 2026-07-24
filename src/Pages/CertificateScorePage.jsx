import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CertificateScorePage() {
  const { t } = useTranslation("global");
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          <div className="breadcrumb-area">
            <h1>{t("assessment.certificates_scores")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")} </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> {t("header.dashboard")}
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> {t("assessment.certificates_scores")}
              </li>
            </ol>
          </div>
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>{t("assessment.certificate_of_completion")}</h3>
              <div className="profile-form">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="certificates-scores-detail-info">
                      <div className="certificates-company-logo">
                        <img
                          src="assets/images/logo/connect-work-ma-login.png"
                          className="main-logo"
                          alt="logo"
                        />
                      </div>
                      <div className="certificates-scores-detail">
                        <h2>{t("assessment.certificate_of_completion")}</h2>
                        <p>{t("assessment.certifies_that")}</p>
                        <h3>Andy Smith</h3>
                        <p>{t("assessment.has_completed")}</p>
                        <p>{t("assessment.sql_exams")}</p>
                        <h3>{t("assessment.certified_sql_developer")}</h3>
                        <p>{t("assessment.fundamental_knowledge")}</p>
                        <h6>{t("assessment.issued_date", { date: "May 25, 2025" })}</h6>
                      </div>
                      <div className="website-name-signature-info">
                        <div className="website-name-info">
                          <h6>{t("assessment.verify_completion")}</h6>
                          <a href="#">{t("header.Connect_Work")}</a>
                        </div>
                        <div className="authorized-signature-info">
                          <div className="authorized-signature-img">
                            <img src="assets/images/company/signatureImg.png" alt="authorized-signature" />
                          </div>
                          <h6>Thomas Thorsell Arntsen</h6>
                          <h6>{t("assessment.for_connect_work")}</h6>
                        </div>
                      </div>
                      <div className="certificates-download-icon">
                        <a
                          href="https://itdevelopmentservices.com/design_website/jobPortal/assets/images/certificate/certificate.pdf"
                          target="_blank"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          aria-label={t("assessment.download_certificate")}
                          data-bs-original-title={t("assessment.download_certificate")}
                        >
                          <i className="fa-solid fa-cloud-arrow-down" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name"> {t("header.Connect_Work")} </span>
                    {t("header.All_Rights_Reserved")}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    {t("header.Designed_By")}{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      {t("header.Webnmobapps_Solution_Pvt_Ltd")}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CertificateScorePage;
