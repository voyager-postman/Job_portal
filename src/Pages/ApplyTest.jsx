import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

const ApplyTest = () => {
  const { t } = useTranslation("global");
  const location = useLocation();
  const { jobTitle } = location.state || {};

  return (
    <div>
      <section className="inner-breadcrumb-main-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="breadcrumb-main-list-area mt-4">
                <h4>{t("assessment.apply_test")}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="skill-assessment-test-page-area py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="skill-assessment-test-card p-4 shadow-sm">
                <div className="test-header mb-3">
                  <h4>
                    <i className="fa-solid fa-file me-2"></i>
                    {t("assessment.test_required")}
                  </h4>
                </div>

                <div className="skill-assessment-test-modal-details">
                  <p>
                    <Trans
                      i18nKey="assessment.apply_test_message"
                      values={{ jobTitle: jobTitle || "Senior JavaScript Developer" }}
                      components={{ strong: <strong /> }}
                    />
                  </p>

                  <div className="skill-assessment-javaScript-fundamental mb-3">
                    <h6>JavaScript Fundamentals</h6>
                    <p>Assess your knowledge of JavaScript core concepts</p>
                    <ul>
                      <li>
                        <i className="fa-solid fa-calendar me-1"></i>{" "}
                        {t("assessment.minutes", { count: 5 })}
                      </li>
                      <li>
                        <i className="fa-solid fa-file me-1"></i>{" "}
                        {t("assessment.questions_count", { count: 5 })}
                      </li>
                      <li>
                        <i className="fa-solid fa-percent me-1"></i>{" "}
                        {t("assessment.pass_threshold", { percent: 70 })}
                      </li>
                    </ul>
                  </div>

                  <div className="skill-assessment-important-area">
                    <h6>{t("assessment.important")}</h6>
                    <p>{t("assessment.timer_warning")}</p>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Link to="/start-test" className="default-btn btn">
                    {t("assessment.start_test")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplyTest;
