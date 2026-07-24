import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const JobAlert = () => {
  const { t } = useTranslation("global");

  return (
    <div>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          <div className="breadcrumb-area">
            <h1>{t("breadcrumbs.set_job_alerts")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/candidate-dashboard">{t("header.home")} </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> {t("header.dashboard")}
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> {t("breadcrumbs.job_alerts")}
              </li>
            </ol>
          </div>
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>{t("breadcrumbs.set_alerts")}</h3>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>{t("jobs.keyword")}</label>
                        <div className="tag-box" id="tagBox">
                          <input
                            type="text"
                            id="tagInput"
                            placeholder={t("jobs.enter_keyword")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>{t("header.location")}</label>
                        <select
                          className="form-select form-control"
                          aria-label={t("jobs.select_location")}
                        >
                          <option selected="">{t("jobs.select_location")}</option>
                          <option selected="">Delhi</option>
                          <option value="1">Bangalore</option>
                          <option value="2">USA</option>
                          <option value="3">Remote</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>{t("header.job_type")}</label>
                        <select
                          className="form-select form-control"
                          aria-label={t("jobs.select_job_type")}
                        >
                          <option selected="">{t("jobs.select_job_type")}</option>
                          <option value="1">Part-time</option>
                          <option value="2">Internship</option>
                          <option value="3">Contract</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>{t("jobs.delivery_method")}</label>
                        <select
                          className="form-select form-control"
                          aria-label={t("jobs.select_delivery_method")}
                        >
                          <option selected="">{t("jobs.select_delivery_method")}</option>
                          <option value="1">{t("jobs.email_delivery")}</option>
                          <option value="2">{t("jobs.in_app_notification")}</option>
                          <option value="3">{t("jobs.email_and_in_app")}</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group frequency-radio-btn">
                        <label>{t("jobs.frequency")}</label>
                        <div className="form-group">
                          <input
                            type="radio"
                            id="Hourly"
                            name="fav_language"
                            value="Hourly"
                          />
                          <label htmlFor="Hourly">{t("jobs.real_time")}</label>
                          <input
                            type="radio"
                            id="Daily"
                            name="fav_language"
                            value="Daily"
                          />
                          <label htmlFor="Daily">{t("jobs.daily")}</label>
                          <input
                            type="radio"
                            id="Weekly"
                            name="fav_language"
                            value="Weekly"
                          />
                          <label htmlFor="Weekly">{t("jobs.weekly")}</label>
                          <input
                            type="radio"
                            id="Monthly"
                            name="fav_language"
                            value="Monthly"
                          />
                          <label htmlFor="Monthly">{t("header.Month")}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="set-job-alert-btn">
                    <a href="#" className="default-btn btn">
                      {t("jobs.submit")}
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAlert;
