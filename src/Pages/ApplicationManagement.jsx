import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
function ApplicationManagement() {
  const { t } = useTranslation("global");

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>{t("header.Application_Management")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">{t("header.home")} </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> {t("header.dashboard")}
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Application Management
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          <div className="employer-dashboard-common-heading">
            <h2>{t("breadcrumbs.profiles_applicants_heading")}</h2>
          </div>
          {/* Application Management Search Start Area */}
          {/* <div class="manage-jobs-box">
          <div class="job-listing-search-form job-search-info-area">
              <form>
                  <div class="row g-0">
                      <div class="col-lg-3 col-sm-6">
                          <div class="form-group">
                              <input class="form-control" type="text" placeholder={t("header.keywords")}>
                              <i class="flaticon-portfolio"></i>
                          </div>
                      </div>
                      <div class="col-lg-3 col-sm-6">
                          <div class="form-group">
                              <input class="form-control" type="text" placeholder={t("header.location_city")}>
                              <i class="flaticon-location"></i>
                          </div>
                      </div>
                      <div class="col-lg-4 col-sm-6">
                          <div class="form-group style">
                              <select class="form-select form-control" aria-label="Default select example">
                                  <option selected="">Chpoose A Category</option>
                                  <option value="1">Development</option>
                                  <option value="2">Information IT</option>
                                  <option value="3">Corporate Job</option>
                              </select>
                              <i class="flaticon-list"></i>
                          </div>
                      </div>
                      <div class="col-lg-2 col-sm-6">
                          <div class="search-btn">
                              <button type="submit" class="default-btn btn">{t("header.find_jobs")}</button>
                          </div>
                      </div>
                  </div>
              </form>
          </div>
      </div> */}
          {/* Application Management Search End Area */}
          {/*Application Management Candidates List Start Area */}
          <div className="application-management-filter-candidate-list">
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
                <div className="application-management-applied-jobs">
                  <div className="available-job-posts-box">
                    <div className="available-job-company-name-save-job">
                      <div className="available-job-company-name">
                        <a href="comapny-details-info.html">
                          <h4>
                            <i className="fa-solid fa-building" /> Alibaba Cloud
                          </h4>
                        </a>
                      </div>
                      <div className="available-job-save-job">
                        <a
                          href="https://www.linkedin.com/login"
                          target="_blank"
                        >
                          <i className="fa-brands fa-linkedin-in" />
                        </a>
                        <a href="https://www.facebook.com/" target="_blank">
                          <i className="fa-brands fa-facebook-f" />
                        </a>
                        <a href="https://web.whatsapp.com/" target="_blank">
                          <i className="fa-brands fa-whatsapp" />
                        </a>
                      </div>
                    </div>
                    <a href="job-details.html">
                      <div className="available-job-type-details">
                        <h5>
                          Alibaba Cloud-Facility Operation Manager-Paris, France
                        </h5>
                        <ul>
                          <li>
                            <i className="fa-regular fa-calendar" /> 3 hours ago
                          </li>
                          <li>
                            <i className="fa-regular fa-file" /> 5 Years
                          </li>
                          <li>
                            <i className="fa-regular fa-user" /> Full time
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" /> Paris
                          </li>
                          <li>
                            <i className="fa-regular fa-file" /> Information
                            Systems / Networks
                          </li>
                        </ul>
                      </div>
                    </a>
                    <div className="total-applicants-info">
                      <p>Applicants: 100</p>
                    </div>
                  </div>
                </div>
                <div className="application-management-filter-info">
                  <h5>Application pipeline</h5>
                  <select
                    className="form-select form-control"
                    aria-label="Default2 select example"
                  >
                    <option selected>New</option>
                    <option value={1}>Reviewed</option>
                    <option value={2}>Interviewed </option>
                    <option value={3}>Rejected</option>
                    <option value={4}>Hired</option>
                  </select>
                </div>
                <div className="row">
                  <div
                    className="col-lg-6 col-sm-6 aos-init aos-animate"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                    data-aos-delay={200}
                  >
                    <div className="candidate-list-info single-freelancer-card">
                      <div className="row align-items-center">
                        <div className="col-lg-4">
                          <div className="freelancer-img">
                            <a href="candidates-profile-details.html">
                              <img
                                src="assets/images/freelancers/freelancers-img-1.jpg"
                                alt="Image"
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <a href="candidates-profile-details.html">
                              <h6>Jequline Fenda</h6>
                            </a>
                            <span>IT Developer</span>
                            <p className="employers-review">Top Talent</p>
                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-file" /> 5 Years
                                </li>
                                <li>
                                  <i className="fa-solid fa-money-bill" />$ 2000
                                </li>
                                <li>
                                  <i className="fa-solid fa-location-dot" />
                                  Washington DC, US
                                </li>
                                <li>
                                  <i className="fa-solid fa-graduation-cap" />
                                  Master’s Degree
                                </li>
                                <li className="application-pipeline-area">
                                  <div className="application-pipeline-info">
                                    <p>
                                      <i className="fa-solid fa-gear" /> Status
                                    </p>
                                    <select>
                                      <option selected>New</option>
                                      <option value={1}>Reviewed</option>
                                      <option value={2}>Interviewed</option>
                                      <option value={3}>Rejected</option>
                                      <option value={4}>Hired</option>
                                    </select>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="candidate-list-bookmark">
                              <i className="fa-regular fa-heart" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 aos-init aos-animate"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                    data-aos-delay={400}
                  >
                    <div className="candidate-list-info single-freelancer-card">
                      <div className="row align-items-center">
                        <div className="col-lg-4">
                          <div className="freelancer-img">
                            <a href="candidates-profile-details.html">
                              <img
                                src="assets/images/freelancers/freelancers-img-2.jpg"
                                alt="Image"
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <a href="candidates-profile-details.html">
                              <h6>Jequline Fenda</h6>
                            </a>
                            <span>IT Developer</span>
                            <p className="employers-review">Top Talent</p>
                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-file" /> 5 Years
                                </li>
                                <li>
                                  <i className="fa-solid fa-money-bill" />$ 2000
                                </li>
                                <li>
                                  <i className="fa-solid fa-location-dot" />
                                  Washington DC, US
                                </li>
                                <li>
                                  <i className="fa-solid fa-graduation-cap" />
                                  Master’s Degree
                                </li>
                                <li className="application-pipeline-area">
                                  <div className="application-pipeline-info">
                                    <p>
                                      <i className="fa-solid fa-gear" /> Status
                                    </p>
                                    <select>
                                      <option selected>New</option>
                                      <option value={1}>Reviewed</option>
                                      <option value={2}>Interviewed</option>
                                      <option value={3}>Rejected</option>
                                      <option value={4}>Hired</option>
                                    </select>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="candidate-list-bookmark">
                              <i className="fa-regular fa-heart" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 aos-init aos-animate"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                    data-aos-delay={600}
                  >
                    <div className="candidate-list-info single-freelancer-card">
                      <div className="row align-items-center">
                        <div className="col-lg-4">
                          <div className="freelancer-img">
                            <a href="candidates-profile-details.html">
                              <img
                                src="assets/images/freelancers/freelancers-img-3.jpg"
                                alt="Image"
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <a href="candidates-profile-details.html">
                              <h6>Jequline Fenda</h6>
                            </a>
                            <span>IT Developer</span>
                            <p className="employers-review">Top Talent</p>
                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-file" /> 5 Years
                                </li>
                                <li>
                                  <i className="fa-solid fa-money-bill" />$ 2000
                                </li>
                                <li>
                                  <i className="fa-solid fa-location-dot" />
                                  Washington DC, US
                                </li>
                                <li>
                                  <i className="fa-solid fa-graduation-cap" />
                                  Master’s Degree
                                </li>
                                <li className="application-pipeline-area">
                                  <div className="application-pipeline-info">
                                    <p>
                                      <i className="fa-solid fa-gear" /> Status
                                    </p>
                                    <select>
                                      <option selected>New</option>
                                      <option value={1}>Reviewed</option>
                                      <option value={2}>Interviewed</option>
                                      <option value={3}>Rejected</option>
                                      <option value={4}>Hired</option>
                                    </select>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="candidate-list-bookmark">
                              <i className="fa-regular fa-heart" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 aos-init aos-animate"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                    data-aos-delay={800}
                  >
                    <div className="candidate-list-info single-freelancer-card">
                      <div className="row align-items-center">
                        <div className="col-lg-4">
                          <div className="freelancer-img">
                            <a href="candidates-profile-details.html">
                              <img
                                src="assets/images/freelancers/freelancers-img-4.jpg"
                                alt="Image"
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <a href="candidates-profile-details.html">
                              <h6>Jequline Fenda</h6>
                            </a>
                            <span>IT Developer</span>
                            <p className="employers-review">Top Talent</p>
                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-file" /> 5 Years
                                </li>
                                <li>
                                  <i className="fa-solid fa-money-bill" />$ 2000
                                </li>
                                <li>
                                  <i className="fa-solid fa-location-dot" />
                                  Washington DC, US
                                </li>
                                <li>
                                  <i className="fa-solid fa-graduation-cap" />
                                  Master’s Degree
                                </li>
                                <li className="application-pipeline-area">
                                  <div className="application-pipeline-info">
                                    <p>
                                      <i className="fa-solid fa-gear" /> Status
                                    </p>
                                    <select>
                                      <option selected>New</option>
                                      <option value={1}>Reviewed</option>
                                      <option value={2}>Interviewed</option>
                                      <option value={3}>Rejected</option>
                                      <option value={4}>Hired</option>
                                    </select>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="candidate-list-bookmark">
                              <i className="fa-regular fa-heart" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 aos-init aos-animate"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                    data-aos-delay={200}
                  >
                    <div className="candidate-list-info single-freelancer-card">
                      <div className="row align-items-center">
                        <div className="col-lg-4">
                          <div className="freelancer-img">
                            <a href="candidates-profile-details.html">
                              <img
                                src="assets/images/freelancers/freelancers-img-6.jpg"
                                alt="Image"
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <a href="candidates-profile-details.html">
                              <h6>Jequline Fenda</h6>
                            </a>
                            <span>IT Developer</span>
                            <p className="employers-review">Top Talent</p>
                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-file" /> 5 Years
                                </li>
                                <li>
                                  <i className="fa-solid fa-money-bill" />$ 2000
                                </li>
                                <li>
                                  <i className="fa-solid fa-location-dot" />
                                  Washington DC, US
                                </li>
                                <li>
                                  <i className="fa-solid fa-graduation-cap" />
                                  Master’s Degree
                                </li>
                                <li className="application-pipeline-area">
                                  <div className="application-pipeline-info">
                                    <p>
                                      <i className="fa-solid fa-gear" /> Status
                                    </p>
                                    <select>
                                      <option selected>New</option>
                                      <option value={1}>Reviewed</option>
                                      <option value={2}>Interviewed</option>
                                      <option value={3}>Rejected</option>
                                      <option value={4}>Hired</option>
                                    </select>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="candidate-list-bookmark">
                              <i className="fa-regular fa-heart" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 aos-init aos-animate"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                    data-aos-delay={400}
                  >
                    <div className="candidate-list-info single-freelancer-card">
                      <div className="row align-items-center">
                        <div className="col-lg-4">
                          <div className="freelancer-img">
                            <a href="candidates-profile-details.html">
                              <img
                                src="assets/images/freelancers/freelancers-img-5.jpg"
                                alt="Image"
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <a href="candidates-profile-details.html">
                              <h6>Jequline Fenda</h6>
                            </a>
                            <span>IT Developer</span>
                            <p className="employers-review">Top Talent</p>
                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-file" /> 5 Years
                                </li>
                                <li>
                                  <i className="fa-solid fa-money-bill" />$ 2000
                                </li>
                                <li>
                                  <i className="fa-solid fa-location-dot" />
                                  Washington DC, US
                                </li>
                                <li>
                                  <i className="fa-solid fa-graduation-cap" />
                                  Master’s Degree
                                </li>
                                <li className="application-pipeline-area">
                                  <div className="application-pipeline-info">
                                    <p>
                                      <i className="fa-solid fa-gear" /> Status
                                    </p>
                                    <select>
                                      <option selected>New</option>
                                      <option value={1}>Reviewed</option>
                                      <option value={2}>Interviewed</option>
                                      <option value={3}>Rejected</option>
                                      <option value={4}>Hired</option>
                                    </select>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="candidate-list-bookmark">
                              <i className="fa-regular fa-heart" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 aos-init"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                    data-aos-delay={600}
                  >
                    <div className="candidate-list-info single-freelancer-card">
                      <div className="row align-items-center">
                        <div className="col-lg-4">
                          <div className="freelancer-img">
                            <a href="candidates-profile-details.html">
                              <img
                                src="assets/images/freelancers/freelancers-img-15.jpg"
                                alt="Image"
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <a href="candidates-profile-details.html">
                              <h6>Jequline Fenda</h6>
                            </a>
                            <span>IT Developer</span>
                            <p className="employers-review">Top Talent</p>
                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-file" /> 5 Years
                                </li>
                                <li>
                                  <i className="fa-solid fa-money-bill" />$ 2000
                                </li>
                                <li>
                                  <i className="fa-solid fa-location-dot" />
                                  Washington DC, US
                                </li>
                                <li>
                                  <i className="fa-solid fa-graduation-cap" />
                                  Master’s Degree
                                </li>
                                <li className="application-pipeline-area">
                                  <div className="application-pipeline-info">
                                    <p>
                                      <i className="fa-solid fa-gear" /> Status
                                    </p>
                                    <select>
                                      <option selected>New</option>
                                      <option value={1}>Reviewed</option>
                                      <option value={2}>Interviewed</option>
                                      <option value={3}>Rejected</option>
                                      <option value={4}>Hired</option>
                                    </select>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="candidate-list-bookmark">
                              <i className="fa-regular fa-heart" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 aos-init"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                    data-aos-delay={600}
                  >
                    <div className="candidate-list-info single-freelancer-card">
                      <div className="row align-items-center">
                        <div className="col-lg-4">
                          <div className="freelancer-img">
                            <a href="candidates-profile-details.html">
                              <img
                                src="assets/images/freelancers/freelancers-img-16.jpg"
                                alt="Image"
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <a href="candidates-profile-details.html">
                              <h6>Jequline Fenda</h6>
                            </a>
                            <span>IT Developer</span>
                            <p className="employers-review">Top Talent</p>
                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-file" /> 5 Years
                                </li>
                                <li>
                                  <i className="fa-solid fa-money-bill" />$ 2000
                                </li>
                                <li>
                                  <i className="fa-solid fa-location-dot" />
                                  Washington DC, US
                                </li>
                                <li>
                                  <i className="fa-solid fa-graduation-cap" />
                                  Master’s Degree
                                </li>
                                <li className="application-pipeline-area">
                                  <div className="application-pipeline-info">
                                    <p>
                                      <i className="fa-solid fa-gear" /> Status
                                    </p>
                                    <select>
                                      <option selected>New</option>
                                      <option value={1}>Reviewed</option>
                                      <option value={2}>Interviewed</option>
                                      <option value={3}>Rejected</option>
                                      <option value={4}>Hired</option>
                                    </select>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="candidate-list-bookmark">
                              <i className="fa-regular fa-heart" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 aos-init"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                    data-aos-delay={600}
                  >
                    <div className="candidate-list-info single-freelancer-card">
                      <div className="row align-items-center">
                        <div className="col-lg-4">
                          <div className="freelancer-img">
                            <a href="candidates-profile-details.html">
                              <img
                                src="assets/images/freelancers/freelancers-img-17.jpg"
                                alt="Image"
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <a href="candidates-profile-details.html">
                              <h6>Jequline Fenda</h6>
                            </a>
                            <span>IT Developer</span>
                            <p className="employers-review">Top Talent</p>
                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-file" /> 5 Years
                                </li>
                                <li>
                                  <i className="fa-solid fa-money-bill" />$ 2000
                                </li>
                                <li>
                                  <i className="fa-solid fa-location-dot" />
                                  Washington DC, US
                                </li>
                                <li>
                                  <i className="fa-solid fa-graduation-cap" />
                                  Master’s Degree
                                </li>
                                <li className="application-pipeline-area">
                                  <div className="application-pipeline-info">
                                    <p>
                                      <i className="fa-solid fa-gear" /> Status
                                    </p>
                                    <select>
                                      <option selected>New</option>
                                      <option value={1}>Reviewed</option>
                                      <option value={2}>Interviewed</option>
                                      <option value={3}>Rejected</option>
                                      <option value={4}>Hired</option>
                                    </select>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="candidate-list-bookmark">
                              <i className="fa-regular fa-heart" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-sm-6 aos-init"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                    data-aos-delay={600}
                  >
                    <div className="candidate-list-info single-freelancer-card">
                      <div className="row align-items-center">
                        <div className="col-lg-4">
                          <div className="freelancer-img">
                            <a href="candidates-profile-details.html">
                              <img
                                src="assets/images/freelancers/freelancers-img-18.jpg"
                                alt="Image"
                                loading="lazy"
                                decoding="async"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <a href="candidates-profile-details.html">
                              <h6>Jequline Fenda</h6>
                            </a>
                            <span>IT Developer</span>
                            <p className="employers-review">Top Talent</p>
                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-file" /> 5 Years
                                </li>
                                <li>
                                  <i className="fa-solid fa-money-bill" />$ 2000
                                </li>
                                <li>
                                  <i className="fa-solid fa-location-dot" />
                                  Washington DC, US
                                </li>
                                <li>
                                  <i className="fa-solid fa-graduation-cap" />
                                  Master’s Degree
                                </li>
                                <li className="application-pipeline-area">
                                  <div className="application-pipeline-info">
                                    <p>
                                      <i className="fa-solid fa-gear" /> Status
                                    </p>
                                    <select>
                                      <option selected>New</option>
                                      <option value={1}>Reviewed</option>
                                      <option value={2}>Interviewed</option>
                                      <option value={3}>Rejected</option>
                                      <option value={4}>Hired</option>
                                    </select>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div className="candidate-list-bookmark">
                              <i className="fa-regular fa-heart" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Application Management Candidates List end Area */}
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

export default ApplicationManagement;
