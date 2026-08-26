import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios"

function EmployerFilterCandinateList() {
  const { t } = useTranslation("global");

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>{t("breadcrumbs.jobs_listing")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/employer-dashboard">{t("header.home")} </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> {t("header.dashboard")}
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> {t("breadcrumbs.jobs_listing")}
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* Start Manage Jobs Area */}
          <div className="manage-jobs-box">
            <div className="job-listing-search-form job-search-info-area">
              <form>
                <div className="row g-0">
                  <div className="col-lg-3 col-sm-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder={t("header.keywords")}
                      />
                      <i className="flaticon-portfolio" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder={t("header.location_city")}
                      />
                      <i className="flaticon-location" />
                    </div>
                  </div>
                  <div className="col-lg-4 col-sm-6">
                    <div className="form-group style">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>{t("header.choose_category")}</option>
                        <option value={1}>Development</option>
                        <option value={2}>Information IT</option>
                        <option value={3}>Corporate Job</option>
                      </select>
                      <i className="flaticon-list" />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6">
                    <div className="search-btn">
                      <button type="submit" className="default-btn btn">
                        Find Jobs
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* End Manage Jobs Area */}
          {/*employer Candidates List filter Area */}
          <div className="job-filter-job-list-info">
            <div className="row">
              <div className="col-lg-3 col-sm-3">
                <div className="job-filter-main-info">
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fa-solid fa-gear" /> Skills Type
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>{t("header.clear")}</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>{t("breadcrumbs.choose_skills")}</option>
                        <option value={1}>Digital</option>
                        <option value={2}>Design</option>
                        <option value={3}>Developer</option>
                        <option value={4}>Front End</option>
                        <option value={5}>Microsoft Excel</option>
                        <option value={6}>Telemarketing</option>
                        <option value={7}>Account</option>
                        <option value={8}>Finance</option>
                        <option value={9}>Marketing</option>
                      </select>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fas fa-signal" /> Experience level
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>{t("header.clear")}</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <ul>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> {t("breadcrumbs.years_0_2")}</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> {t("breadcrumbs.years_2_4")}</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> {t("breadcrumbs.years_5_7")}</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> {t("breadcrumbs.years_8_10")}</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> 11 - 13 Years</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> 14 - 16 Years</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fa-solid fa-graduation-cap" /> Education
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>{t("header.clear")}</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <ul>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Certified</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Diploma</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Associate Degree</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Bachelor Degree</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Master’s Degree</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fa-solid fa-location-dot" /> Location
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>{t("header.clear")}</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Select Job type</option>
                        <option value={1}>India</option>
                        <option value={2}>USA</option>
                        <option value={3}>Paris</option>
                        <option value={4}>Germany</option>
                        <option value={2}>Spain</option>
                        <option value={3}>Mau</option>
                      </select>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fa-solid fa-calendar-days" /> Date
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>{t("header.clear")}</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <form>
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="date"
                            placeholder="Date"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fas fa-money-bill-alt" /> Salary Range
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>{t("header.clear")}</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <ul>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> 0 to $100</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> $ 101 to $ 150</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> $ 151 to $ 200</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> $ 201 to $ 250</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-9">
                <div className="available-job-posts-info">
                  <div className="available-job-posts-heading">
                    <h4>
                      <i className="fa-solid fa-user" /> 5 Applicant profiles
                      per job
                    </h4>
                  </div>
                  <div className="employer-candidate-short-info">
                    <div className="employer-candidate-short-box">
                      <div className="employer-candidate-img-name">
                        <div className="employer-candidate-img">
                          <img
                            src="assets/images/candidate-img/candidate1.jpg"
                            alt="image"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="employer-candidate-name-position">
                          <h4>Jimmy Divison</h4>
                          <p>Web Designer Ul/Ux</p>
                        </div>
                      </div>
                      <div className="employer-candidate-action">
                        <h4>Application pipeline</h4>
                        <form>
                          <div className="form-group">
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                            >
                              <option selected>New</option>
                              <option value={1}>Reviewed</option>
                              <option value={2}>Interviewed</option>
                              <option value={3}>Rejected</option>
                              <option value={4}>Hired</option>
                            </select>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="employer-candidate-detail-reject-dlt-info">
                      <div className="employer-candidate-detail-info">
                        <h5>
                          Alibaba Cloud-Facility Operation Web Designer Ul/UX
                        </h5>
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" />5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 20k To $
                            30k
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            France
                          </li>
                          <li>
                            <i className="fa-solid fa-calendar-days" />3 hours
                            ago
                          </li>
                        </ul>
                      </div>
                      <div className="employer-candidate-detail-reject-dlt-btn">
                        <a href="#" className="default-btn btn">
                          Download CV
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="employer-candidate-short-info">
                    <div className="employer-candidate-short-box">
                      <div className="employer-candidate-img-name">
                        <div className="employer-candidate-img">
                          <img
                            src="assets/images/candidate-img/candidate1.jpg"
                            alt="image"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="employer-candidate-name-position">
                          <h4>Jimmy Divison</h4>
                          <p>Web Designer Ul/Ux</p>
                        </div>
                      </div>
                      <div className="employer-candidate-action">
                        <h4>Application pipeline</h4>
                        <form>
                          <div className="form-group">
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                            >
                              <option selected>New</option>
                              <option value={1}>Reviewed</option>
                              <option value={2}>Interviewed</option>
                              <option value={3}>Rejected</option>
                              <option value={4}>Hired</option>
                            </select>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="employer-candidate-detail-reject-dlt-info">
                      <div className="employer-candidate-detail-info">
                        <h5>
                          Alibaba Cloud-Facility Operation Web Designer Ul/UX
                        </h5>
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" />5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 20k To $
                            30k
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            France
                          </li>
                          <li>
                            <i className="fa-solid fa-calendar-days" />3 hours
                            ago
                          </li>
                        </ul>
                      </div>
                      <div className="employer-candidate-detail-reject-dlt-btn">
                        <a href="#" className="default-btn btn">
                          Download CV
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="employer-candidate-short-info">
                    <div className="employer-candidate-short-box">
                      <div className="employer-candidate-img-name">
                        <div className="employer-candidate-img">
                          <img
                            src="assets/images/candidate-img/candidate1.jpg"
                            alt="image"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="employer-candidate-name-position">
                          <h4>Jimmy Divison</h4>
                          <p>Web Designer Ul/Ux</p>
                        </div>
                      </div>
                      <div className="employer-candidate-action">
                        <h4>Application pipeline</h4>
                        <form>
                          <div className="form-group">
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                            >
                              <option selected>New</option>
                              <option value={1}>Reviewed</option>
                              <option value={2}>Interviewed</option>
                              <option value={3}>Rejected</option>
                              <option value={4}>Hired</option>
                            </select>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="employer-candidate-detail-reject-dlt-info">
                      <div className="employer-candidate-detail-info">
                        <h5>
                          Alibaba Cloud-Facility Operation Web Designer Ul/UX
                        </h5>
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" />5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 20k To $
                            30k
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            France
                          </li>
                          <li>
                            <i className="fa-solid fa-calendar-days" />3 hours
                            ago
                          </li>
                        </ul>
                      </div>
                      <div className="employer-candidate-detail-reject-dlt-btn">
                        <a href="#" className="default-btn btn">
                          Download CV
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="employer-candidate-short-info">
                    <div className="employer-candidate-short-box">
                      <div className="employer-candidate-img-name">
                        <div className="employer-candidate-img">
                          <img
                            src="assets/images/candidate-img/candidate1.jpg"
                            alt="image"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="employer-candidate-name-position">
                          <h4>Jimmy Divison</h4>
                          <p>Web Designer Ul/Ux</p>
                        </div>
                      </div>
                      <div className="employer-candidate-action">
                        <h4>Application pipeline</h4>
                        <form>
                          <div className="form-group">
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                            >
                              <option selected>New</option>
                              <option value={1}>Reviewed</option>
                              <option value={2}>Interviewed</option>
                              <option value={3}>Rejected</option>
                              <option value={4}>Hired</option>
                            </select>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="employer-candidate-detail-reject-dlt-info">
                      <div className="employer-candidate-detail-info">
                        <h5>
                          Alibaba Cloud-Facility Operation Web Designer Ul/UX
                        </h5>
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" />5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 20k To $
                            30k
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            France
                          </li>
                          <li>
                            <i className="fa-solid fa-calendar-days" />3 hours
                            ago
                          </li>
                        </ul>
                      </div>
                      <div className="employer-candidate-detail-reject-dlt-btn">
                        <a href="#" className="default-btn btn">
                          Download CV
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="employer-candidate-short-info">
                    <div className="employer-candidate-short-box">
                      <div className="employer-candidate-img-name">
                        <div className="employer-candidate-img">
                          <img
                            src="assets/images/candidate-img/candidate1.jpg"
                            alt="image"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="employer-candidate-name-position">
                          <h4>Jimmy Divison</h4>
                          <p>Web Designer Ul/Ux</p>
                        </div>
                      </div>
                      <div className="employer-candidate-action">
                        <h4>Application pipeline</h4>
                        <form>
                          <div className="form-group">
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                            >
                              <option selected>New</option>
                              <option value={1}>Reviewed</option>
                              <option value={2}>Interviewed</option>
                              <option value={3}>Rejected</option>
                              <option value={4}>Hired</option>
                            </select>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="employer-candidate-detail-reject-dlt-info">
                      <div className="employer-candidate-detail-info">
                        <h5>
                          Alibaba Cloud-Facility Operation Web Designer Ul/UX
                        </h5>
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" />5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 20k To $
                            30k
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            France
                          </li>
                          <li>
                            <i className="fa-solid fa-calendar-days" />3 hours
                            ago
                          </li>
                        </ul>
                      </div>
                      <div className="employer-candidate-detail-reject-dlt-btn">
                        <a href="#" className="default-btn btn">
                          Download CV
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*employer Candidates List filter Area */}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name"> Connect Work.ma </span> All
                    Rights Reserved
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    Designed By{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      Webnmobapps Solution Pvt. Ltd
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

export default EmployerFilterCandinateList;
