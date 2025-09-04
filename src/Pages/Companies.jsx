import React from "react";
import { Link } from "react-router-dom";
function Companies() {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Search Job List</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Companies List
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Jobs filter and job list info Area */}
          <div className="job-filter-job-list-info">
            <div className="row">
              <div className="col-lg-3 col-sm-3">
                <div className="job-filter-main-info">
                  <div className="job-filter-heading-area">
                    <h4>
                      <Link to="/job-search">
                        <i className="fa-regular fa-file" /> Job offers
                      </Link>
                    </h4>
                  </div>

                  <div className="divder-line-info" />
                  <div className="job-filter-heading-area job-filter-cancel-heading">
                    <h4>
                      <i className="fa-regular fa-building" /> Companies
                    </h4>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fas fa-building" /> Industry Sector
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>Clear</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Select Industry</option>
                        <option value={1}>Agriculture</option>
                        <option value={2}>Air Transport</option>
                        <option value={3}>Automotive</option>
                        <option value={4}>Biotechnology</option>
                        <option value={2}>Chemicals</option>
                        <option value={3}>Construction</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-9">
                <div className="available-company-list-info">
                  <div className="available-company-heading">
                    <h4>
                      <i className="fa-solid fa-building" /> 25 companies
                      available
                    </h4>
                  </div>
                  <div className="available-company-list-area">
                    <div className="row">
                      <div className="col-lg-4 col-md-4">
                        <div className="available-company-box-info">
                          <div className="available-company-logo">
                            <img src="/jobPortal/assets/images/partner-logo/partner-logo-2.png" />
                          </div>
                          <div className="available-company-img">
                            <img src="/jobPortal/assets/images/company/company-img-1.jpg" />
                          </div>
                          <div className="available-company-content">
                            <h4>Hauts De Seine Department</h4>
                            <ul>
                              <li>
                                <i className="fa-solid fa-location-dot" />
                                Levallois-Perret
                              </li>
                              <li>
                                <i className="fa-solid fa-user" />
                                1000 - 20000
                              </li>
                              <li>
                                <i className="fa-solid fa-globe" />
                                Technicien support VIP Anglais
                              </li>
                            </ul>
                          </div>
                          <div className="available-company-btn">
                            <Link
                              to="/companies-details"
                              className="default-btn btn"
                            >
                              View Company
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="available-company-box-info">
                          <div className="available-company-logo">
                            <img src="/jobPortal/assets/images/partner-logo/partner-logo-2.png" />
                          </div>
                          <div className="available-company-img">
                            <img src="/jobPortal/assets/images/company/company-img-1.jpg" />
                          </div>
                          <div className="available-company-content">
                            <h4>Hauts De Seine Department</h4>
                            <ul>
                              <li>
                                <i className="fa-solid fa-location-dot" />
                                Levallois-Perret
                              </li>
                              <li>
                                <i className="fa-solid fa-user" />
                                1000 - 20000
                              </li>
                              <li>
                                <i className="fa-solid fa-globe" />
                                Technicien support VIP Anglais
                              </li>
                            </ul>
                          </div>
                          <div className="available-company-btn">
                            <Link
                              to="/companies-details"
                              className="default-btn btn"
                            >
                              View Company
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="available-company-box-info">
                          <div className="available-company-logo">
                            <img src="/jobPortal/assets/images/partner-logo/partner-logo-2.png" />
                          </div>
                          <div className="available-company-img">
                            <img src="/jobPortal/assets/images/company/company-img-1.jpg" />
                          </div>
                          <div className="available-company-content">
                            <h4>Hauts De Seine Department</h4>
                            <ul>
                              <li>
                                <i className="fa-solid fa-location-dot" />
                                Levallois-Perret
                              </li>
                              <li>
                                <i className="fa-solid fa-user" />
                                1000 - 20000
                              </li>
                              <li>
                                <i className="fa-solid fa-globe" />
                                Technicien support VIP Anglais
                              </li>
                            </ul>
                          </div>
                          <div className="available-company-btn">
                            <Link
                              to="/companies-details"
                              className="default-btn btn"
                            >
                              View Company
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="available-company-list-area">
                    <div className="row">
                      <div className="col-lg-4 col-md-4">
                        <div className="available-company-box-info">
                          <div className="available-company-logo">
                            <img src="/jobPortal/assets/images/partner-logo/partner-logo-2.png" />
                          </div>
                          <div className="available-company-img">
                            <img src="/jobPortal/assets/images/company/company-img-1.jpg" />
                          </div>
                          <div className="available-company-content">
                            <h4>Hauts De Seine Department</h4>
                            <ul>
                              <li>
                                <i className="fa-solid fa-location-dot" />
                                Levallois-Perret
                              </li>
                              <li>
                                <i className="fa-solid fa-user" />
                                1000 - 20000
                              </li>
                              <li>
                                <i className="fa-solid fa-globe" />
                                Technicien support VIP Anglais
                              </li>
                            </ul>
                          </div>
                          <div className="available-company-btn">
                            <Link
                              to="/companies-details"
                              className="default-btn btn"
                            >
                              View Company
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="available-company-box-info">
                          <div className="available-company-logo">
                            <img src="/jobPortal/assets/images/partner-logo/partner-logo-2.png" />
                          </div>
                          <div className="available-company-img">
                            <img src="/jobPortal/assets/images/company/company-img-1.jpg" />
                          </div>
                          <div className="available-company-content">
                            <h4>Hauts De Seine Department</h4>
                            <ul>
                              <li>
                                <i className="fa-solid fa-location-dot" />
                                Levallois-Perret
                              </li>
                              <li>
                                <i className="fa-solid fa-user" />
                                1000 - 20000
                              </li>
                              <li>
                                <i className="fa-solid fa-globe" />
                                Technicien support VIP Anglais
                              </li>
                            </ul>
                          </div>
                          <div className="available-company-btn">
                            <Link
                              to="/companies-details"
                              className="default-btn btn"
                            >
                              View Company
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <div className="available-company-box-info">
                          <div className="available-company-logo">
                            <img src="/jobPortal/assets/images/partner-logo/partner-logo-2.png" />
                          </div>
                          <div className="available-company-img">
                            <img src="/jobPortal/assets/images/company/company-img-1.jpg" />
                          </div>
                          <div className="available-company-content">
                            <h4>Hauts De Seine Department</h4>
                            <ul>
                              <li>
                                <i className="fa-solid fa-location-dot" />
                                Levallois-Perret
                              </li>
                              <li>
                                <i className="fa-solid fa-user" />
                                1000 - 20000
                              </li>
                              <li>
                                <i className="fa-solid fa-globe" />
                                Technicien support VIP Anglais
                              </li>
                            </ul>
                          </div>
                          <div className="available-company-btn">
                            <Link
                              to="/companies-details"
                              className="default-btn btn"
                            >
                              View Company
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Jobs filter and job list info Area */}
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

export default Companies;
