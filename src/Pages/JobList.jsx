import React from "react";
import { Link } from "react-router-dom";

const JobList = () => {
  return (
    <div>
      <section className="inner-banners-info-area">
        <div className="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="breadcrumb Img"
          />
        </div>
        <div className="inner-banners-title-info">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="inner-page-banner-title">
                  <h2>Job List</h2>
                  <ul>
                    <li className="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Job List</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="job-card-list-info-area">
        <div class="container">
          <div class="row">
            <div class="col-lg-12 col-sm-12">
              <div class="manage-jobs-box">
                <div class="job-listing-search-form job-search-info-area">
                  <form>
                    <div class="row g-0">
                      <div class="col-lg-3 col-sm-6">
                        <div class="form-group">
                          <input
                            class="form-control"
                            type="text"
                            placeholder="Keywords / Job Title"
                          />
                          <i class="flaticon-portfolio"></i>
                        </div>
                      </div>
                      <div class="col-lg-3 col-sm-6">
                        <div class="form-group">
                          <input
                            class="form-control"
                            type="text"
                            placeholder="City Or Postcode"
                          />
                          <i class="flaticon-location"></i>
                        </div>
                      </div>
                      <div class="col-lg-4 col-sm-6">
                        <div class="form-group style">
                          <select
                            class="form-select form-control"
                            aria-label="Default select example"
                          >
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
                          <button type="submit" class="default-btn btn">
                            Find Jobs
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-lg-12 col-sm-12">
              <div class="job-card-list-filter-info">
                <div class="row">
                  <div class="col-lg-3 col-sm-3">
                    <div class="job-filter-main-info">
                      <div class="job-filter-heading-area">
                        <h4>
                          <a href="SearchJobList.html" class="active">
                            <i class="fa-regular fa-file"></i> Job offers
                          </a>
                        </h4>
                      </div>
                      <div class="job-filter-heading-area">
                        <h4>
                          <a href="companies-list.html">
                            <i class="fa-regular fa-building"></i> Companies
                          </a>
                        </h4>
                      </div>
                      <div class="divder-line-info"></div>
                      <div class="job-filter-search-area">
                        <div class="job-filter-heading-cancel">
                          <div class="job-filter-heading">
                            <h4>
                              <i class="fa-solid fa-gear"></i> Job category
                            </h4>
                          </div>
                          <div class="job-filter-cancel-heading">
                            <h4>Clear</h4>
                          </div>
                        </div>
                        <div class="job-filter-select-info">
                          <select
                            class="form-select form-control"
                            aria-label="Default select example"
                          >
                            <option selected="">Select Job Category</option>
                            <option value="1">Java</option>
                            <option value="2">Python</option>
                            <option value="3">React</option>
                            <option value="2">Python</option>
                            <option value="3">React</option>
                          </select>
                        </div>
                      </div>
                      <div class="divder-line-info"></div>
                      <div class="job-filter-search-area">
                        <div class="job-filter-heading-cancel">
                          <div class="job-filter-heading">
                            <h4>
                              <i class="fa-solid fa-gear"></i> Job Type
                            </h4>
                          </div>
                          <div class="job-filter-cancel-heading">
                            <h4>Clear</h4>
                          </div>
                        </div>
                        <div class="job-filter-select-info">
                          <ul>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> Full Time</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> Part Time</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> Freelance</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> Internship</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> Remote</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> Hybrid Jobs</label>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="divder-line-info"></div>
                      <div class="job-filter-search-area">
                        <div class="job-filter-heading-cancel">
                          <div class="job-filter-heading">
                            <h4>
                              <i class="fa-solid fa-location-dot"></i> Location
                            </h4>
                          </div>
                          <div class="job-filter-cancel-heading">
                            <h4>Clear</h4>
                          </div>
                        </div>
                        <div class="job-filter-select-info">
                          <select
                            class="form-select form-control"
                            aria-label="Default select example"
                          >
                            <option selected="">Select Job Location</option>
                            <option value="1">India</option>
                            <option value="2">USA</option>
                            <option value="3">Paris</option>
                            <option value="4">Germany</option>
                            <option value="2">Spain</option>
                            <option value="3">Mau</option>
                          </select>
                        </div>
                      </div>
                      <div class="divder-line-info"></div>
                      <div class="job-filter-search-area">
                        <div class="job-filter-heading-cancel">
                          <div class="job-filter-heading">
                            <h4>
                              <i class="fas fa-signal"></i> Experience Level
                            </h4>
                          </div>
                          <div class="job-filter-cancel-heading">
                            <h4>Clear</h4>
                          </div>
                        </div>
                        <div class="job-filter-select-info">
                          <ul>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> 0 - 2 Years</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> 2 - 4 Years</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> 5 - 7 Years</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> 8 - 10 Years</label>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="divder-line-info"></div>
                      <div class="job-filter-search-area">
                        <div class="job-filter-heading-cancel">
                          <div class="job-filter-heading">
                            <h4>
                              <i class="fas fa-money-bill-alt"></i> Salary Range
                            </h4>
                          </div>
                          <div class="job-filter-cancel-heading">
                            <h4>Clear</h4>
                          </div>
                        </div>
                        <div class="job-filter-select-info">
                          <ul>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> 0 to $100</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> $ 101 to $ 150</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> $ 151 to $ 200</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                value="Other Preferences"
                              />
                              <label for="vehicle1"> $ 201 to $ 250</label>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="divder-line-info"></div>
                      <div class="job-filter-search-area">
                        <div class="job-filter-heading-cancel">
                          <div class="job-filter-heading">
                            <h4>
                              <i class="fas fa-building"></i> Industry Sector
                            </h4>
                          </div>
                          <div class="job-filter-cancel-heading">
                            <h4>Clear</h4>
                          </div>
                        </div>
                        <div class="job-filter-select-info">
                          <select
                            class="form-select form-control"
                            aria-label="Default select example"
                          >
                            <option selected="">Select Industry</option>
                            <option value="1">Agriculture</option>
                            <option value="2">Air Transport</option>
                            <option value="3">Automotive</option>
                            <option value="4">Biotechnology</option>
                            <option value="2">Chemicals</option>
                            <option value="3">Construction</option>
                          </select>
                        </div>
                      </div>
                      <div class="divder-line-info"></div>
                      <div class="job-filter-search-area">
                        <div class="job-filter-heading-cancel">
                          <div class="job-filter-heading">
                            <h4>
                              <i class="fas fa-building"></i> Company
                            </h4>
                          </div>
                          <div class="job-filter-cancel-heading">
                            <h4>Clear</h4>
                          </div>
                        </div>
                        <div class="job-filter-select-info">
                          <select
                            class="form-select form-control"
                            aria-label="Default select example"
                          >
                            <option selected="">Select Company</option>
                            <option value="1">Agriculture</option>
                            <option value="2">Air Transport</option>
                            <option value="3">Automotive</option>
                            <option value="4">Biotechnology</option>
                            <option value="2">Chemicals</option>
                            <option value="3">Construction</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-9 col-md-9">
                    <div class="available-job-posts-info">
                      <div class="available-job-posts-heading">
                        <h4>
                          <i class="fa-regular fa-file"></i> 6905 available job
                          posts
                        </h4>
                      </div>

                      <a href="job-details.html">
                        <div class="available-job-posts-box">
                          <div class="available-job-company-name-save-job">
                            <div class="available-job-company-name">
                              <h4>
                                <i class="fa-solid fa-building"></i> Alibaba
                                Cloud
                              </h4>
                            </div>
                            <div class="available-job-save-job">
                              <i class="fa-regular fa-heart"></i>
                              <a
                                href="https://www.linkedin.com/login"
                                target="_blank"
                              >
                                <i class="fa-brands fa-linkedin-in"></i>
                              </a>
                              <a
                                href="https://www.facebook.com/"
                                target="_blank"
                              >
                                <i class="fa-brands fa-facebook-f"></i>
                              </a>
                              <a
                                href="https://web.whatsapp.com/"
                                target="_blank"
                              >
                                <i class="fa-brands fa-whatsapp"></i>
                              </a>
                            </div>
                          </div>
                          <div class="available-job-type-details">
                            <h5>
                              Alibaba Cloud-Facility Operation Manager-Paris,
                              France
                            </h5>
                            <ul>
                              <li>
                                <i class="fa-regular fa-calendar"></i> 3 hours
                                ago
                              </li>
                              <li>
                                <i class="fa-regular fa-file"></i> 5 Years
                              </li>
                              <li>
                                <i class="fa-regular fa-user"></i> Full time
                              </li>
                              <li>
                                <i class="fa-solid fa-location-dot"></i> Paris
                              </li>
                              <li>
                                <i class="fa-regular fa-file"></i> Information
                                Systems / Networks
                              </li>
                            </ul>
                          </div>
                        </div>
                      </a>

                      <a href="job-details.html">
                        <div class="available-job-posts-box">
                          <div class="available-job-company-name-save-job">
                            <div class="available-job-company-name">
                              <h4>
                                <i class="fa-solid fa-building"></i> Alibaba
                                Cloud
                              </h4>
                            </div>
                            <div class="available-job-save-job">
                              <i class="fa-regular fa-heart"></i>
                              <a
                                href="https://www.linkedin.com/login"
                                target="_blank"
                              >
                                <i class="fa-brands fa-linkedin-in"></i>
                              </a>
                              <a
                                href="https://www.facebook.com/"
                                target="_blank"
                              >
                                <i class="fa-brands fa-facebook-f"></i>
                              </a>
                              <a
                                href="https://web.whatsapp.com/"
                                target="_blank"
                              >
                                <i class="fa-brands fa-whatsapp"></i>
                              </a>
                            </div>
                          </div>
                          <div class="available-job-type-details">
                            <h5>
                              Alibaba Cloud-Facility Operation Manager-Paris,
                              France
                            </h5>
                            <ul>
                              <li>
                                <i class="fa-regular fa-calendar"></i> 3 hours
                                ago
                              </li>
                              <li>
                                <i class="fa-regular fa-file"></i> 5 Years
                              </li>
                              <li>
                                <i class="fa-regular fa-user"></i> Full time
                              </li>
                              <li>
                                <i class="fa-solid fa-location-dot"></i> Paris
                              </li>
                              <li>
                                <i class="fa-regular fa-file"></i> Information
                                Systems / Networks
                              </li>
                            </ul>
                          </div>
                        </div>
                      </a>

                      <a href="job-details.html">
                        <div class="available-job-posts-box">
                          <div class="available-job-company-name-save-job">
                            <div class="available-job-company-name">
                              <h4>
                                <i class="fa-solid fa-building"></i> Alibaba
                                Cloud
                              </h4>
                            </div>
                            <div class="available-job-save-job">
                              <i class="fa-regular fa-heart"></i>
                              <a
                                href="https://www.linkedin.com/login"
                                target="_blank"
                              >
                                <i class="fa-brands fa-linkedin-in"></i>
                              </a>
                              <a
                                href="https://www.facebook.com/"
                                target="_blank"
                              >
                                <i class="fa-brands fa-facebook-f"></i>
                              </a>
                              <a
                                href="https://web.whatsapp.com/"
                                target="_blank"
                              >
                                <i class="fa-brands fa-whatsapp"></i>
                              </a>
                            </div>
                          </div>
                          <div class="available-job-type-details">
                            <h5>
                              Alibaba Cloud-Facility Operation Manager-Paris,
                              France
                            </h5>
                            <ul>
                              <li>
                                <i class="fa-regular fa-calendar"></i> 3 hours
                                ago
                              </li>
                              <li>
                                <i class="fa-regular fa-file"></i> 5 Years
                              </li>
                              <li>
                                <i class="fa-regular fa-user"></i> Full time
                              </li>
                              <li>
                                <i class="fa-solid fa-location-dot"></i> Paris
                              </li>
                              <li>
                                <i class="fa-regular fa-file"></i> Information
                                Systems / Networks
                              </li>
                            </ul>
                          </div>
                        </div>
                      </a>

                      <a href="job-details.html">
                        <div class="available-job-posts-box">
                          <div class="available-job-company-name-save-job">
                            <div class="available-job-company-name">
                              <h4>
                                <i class="fa-solid fa-building"></i> Alibaba
                                Cloud
                              </h4>
                            </div>
                            <div class="available-job-save-job">
                              <i class="fa-regular fa-heart"></i>
                              <a
                                href="https://www.linkedin.com/login"
                                target="_blank"
                              >
                                <i class="fa-brands fa-linkedin-in"></i>
                              </a>
                              <a
                                href="https://www.facebook.com/"
                                target="_blank"
                              >
                                <i class="fa-brands fa-facebook-f"></i>
                              </a>
                              <a
                                href="https://web.whatsapp.com/"
                                target="_blank"
                              >
                                <i class="fa-brands fa-whatsapp"></i>
                              </a>
                            </div>
                          </div>
                          <div class="available-job-type-details">
                            <h5>
                              Alibaba Cloud-Facility Operation Manager-Paris,
                              France
                            </h5>
                            <ul>
                              <li>
                                <i class="fa-regular fa-calendar"></i> 3 hours
                                ago
                              </li>
                              <li>
                                <i class="fa-regular fa-file"></i> 5 Years
                              </li>
                              <li>
                                <i class="fa-regular fa-user"></i> Full time
                              </li>
                              <li>
                                <i class="fa-solid fa-location-dot"></i> Paris
                              </li>
                              <li>
                                <i class="fa-regular fa-file"></i> Information
                                Systems / Networks
                              </li>
                            </ul>
                          </div>
                        </div>
                      </a>

                      <a href="job-details.html">
                        <div class="available-job-posts-box">
                          <div class="available-job-company-name-save-job">
                            <div class="available-job-company-name">
                              <h4>
                                <i class="fa-solid fa-building"></i> Alibaba
                                Cloud
                              </h4>
                            </div>
                            <div class="available-job-save-job">
                              <i class="fa-regular fa-heart"></i>
                              <a
                                href="https://www.linkedin.com/login"
                                target="_blank"
                              >
                                <i class="fa-brands fa-linkedin-in"></i>
                              </a>
                              <a
                                href="https://www.facebook.com/"
                                target="_blank"
                              >
                                <i class="fa-brands fa-facebook-f"></i>
                              </a>
                              <a
                                href="https://web.whatsapp.com/"
                                target="_blank"
                              >
                                <i class="fa-brands fa-whatsapp"></i>
                              </a>
                            </div>
                          </div>
                          <div class="available-job-type-details">
                            <h5>
                              Alibaba Cloud-Facility Operation Manager-Paris,
                              France
                            </h5>
                            <ul>
                              <li>
                                <i class="fa-regular fa-calendar"></i> 3 hours
                                ago
                              </li>
                              <li>
                                <i class="fa-regular fa-file"></i> 5 Years
                              </li>
                              <li>
                                <i class="fa-regular fa-user"></i> Full time
                              </li>
                              <li>
                                <i class="fa-solid fa-location-dot"></i> Paris
                              </li>
                              <li>
                                <i class="fa-regular fa-file"></i> Information
                                Systems / Networks
                              </li>
                            </ul>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobList;
