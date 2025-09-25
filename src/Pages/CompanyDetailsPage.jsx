import React from "react";
import { Link } from "react-router-dom";
function CompanyDetailsPage() {
  return (
    <>
      <section className="company-detail-info-area">
        <div className="container">
          <div className="row">
            <div className="company-img-short-detail">
              <div className="company-img-info">
                <img src="assets/images/company/company-img-1.jpg" />
              </div>
              <div className="company-short-detail-info">
                <div className="company-short-detail-img">
                  <img src="assets/images/partner-logo/partner-logo-2.png" />
                </div>
                <div className="company-about-short-detail">
                  <h4>Hauts De Seine Department</h4>
                  <div className="subscribe-best-employer-btn">
                    <span className="subscribe-btn default-btn btn">
                      + Subscribe
                    </span>
                    <span>
                      <div className="best-employer-btn">
                        <i className="fa-solid fa-award" /> Best Employer
                      </div>
                    </span>
                  </div>
                  <ul>
                    <li>
                      <i className="fa-solid fa-user" />
                      1000 - 2000
                    </li>
                    <li>
                      <i className="fa-solid fa-globe" />
                      Services
                    </li>
                    <li>
                      <a
                        href="https://itdevelopmentservices.com/jobPortal/"
                        target="_blank"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square" />
                        Visit the company website
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="company-detail-tab-description-info">
              <div className="company-detail-tab-info">
                {/* Nav tabs */}
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link active"
                      data-bs-toggle="tab"
                      href="#menu1"
                      aria-selected="true"
                      role="tab"
                    >
                      About the company{" "}
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu2"
                      aria-selected="false"
                      tabIndex={-1}
                      role="tab"
                    >
                      Current openings
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu3"
                      aria-selected="false"
                      tabIndex={-1}
                      role="tab"
                    >
                      Office photos
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu4"
                      aria-selected="false"
                      tabIndex={-1}
                      role="tab"
                    >
                      Office videos
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu5"
                      aria-selected="false"
                      tabIndex={-1}
                      role="tab"
                    >
                      Career Details
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu6"
                      aria-selected="false"
                      tabIndex={-1}
                      role="tab"
                    >
                      Links
                    </a>
                  </li>
                </ul>
              </div>
              <div className="company-detail-tab-description">
                {/* Tab panes */}
                <div className="tab-content">
                  <div id="menu1" className="tab-pane active" role="tabpanel">
                    <h5>Company Information</h5>
                    <div className="company-profile-detail-info">
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-building-columns" />
                          Company Name
                        </h4>
                        <p>Hauts De Seine Department</p>
                      </div>
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-gear" />
                          Industry
                        </h4>
                        <p>Automobile Industry</p>
                      </div>
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-user" />
                          Number of Employees
                        </h4>
                        <p>100</p>
                      </div>
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-phone" />
                          Phone number
                        </h4>
                        <p>+1 212-213-6050</p>
                      </div>
                    </div>
                    <div className="company-profile-detail-info">
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-address-card" />
                          Street Address
                        </h4>
                        <p>205 North Michigan Avenue</p>
                      </div>
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-city" />
                          City
                        </h4>
                        <p>Chicago</p>
                      </div>
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-map-location-dot" />
                          State
                        </h4>
                        <p>Illinois</p>
                      </div>
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-globe" />
                          Country
                        </h4>
                        <p>USA</p>
                      </div>
                    </div>
                    <div className="company-profile-description">
                      <p>
                        Moody’s Corporation, often referred to as Moody’s, is an
                        American business and financial services company. It is
                        the holding company for Moody’s Investors Service (MIS),
                        an American credit rating agency, and Moody’s Analytics
                        (MA), an American provider of financial analysis
                        software and services.
                      </p>
                      <p>
                        Moody’s was founded by John Moody in 1909 to produce
                        manuals of statistics related to stocks and bonds and
                        bond ratings. Moody’s was acquired by Dun &amp;
                        Bradstreet in 1962. In 2000, Dun &amp; Bradstreet spun
                        off Moody’s Corporation as a separate company that was
                        listed on the NYSE under MCO. In 2007, Moody’s
                        Corporation was split into two operating divisions,
                        Moody’s Investors Service, the rating agency, and
                        Moody’s Analytics, with all of its other products.
                      </p>
                    </div>
                  </div>
                  <div id="menu2" className="tab-pane fade" role="tabpanel">
                    <h5>Current openings</h5>
                    <div className="company-detail-job-box">
                      <a href="job-details.html">
                        <div className="company-detail-card">
                          <h4>Technicien support VIP Anglais</h4>
                          <ul>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Paris
                            </li>
                            <li>
                              <i className="fa-solid fa-calendar-days" />
                              July2,2025, 3:47PM
                            </li>
                            <li>
                              <i className="fa-solid fa-signal" />
                              Intermediate Level
                            </li>
                            <li>
                              <i className="fa-solid fa-user" />
                              Full Time
                            </li>
                          </ul>
                        </div>
                      </a>
                      <div className="company-detail-apply-link-save-btn">
                        <div className="company-detail-apply-btn">
                          {/* Button trigger modal */}
                          <a
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#ApplyQuickly"
                            className="default-btn btn"
                          >
                            Apply Quickly
                          </a>
                          {/* Modal */}
                          <div
                            className="modal fade"
                            id="ApplyQuickly"
                            data-bs-backdrop="static"
                            data-bs-keyboard="false"
                            tabIndex={-1}
                            aria-labelledby="ApplyQuicklyLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h1
                                    className="modal-title fs-5"
                                    id="staticBackdropLabel"
                                  >
                                    Apply Now
                                  </h1>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  />
                                </div>
                                <div className="modal-body">
                                  <div className="company-detail-show-upload">
                                    <div className="company-detail-doc-tyep">
                                      <h4>
                                        <i className="fa-solid fa-circle-check" />
                                        Resume Name, pdf,doc
                                      </h4>
                                    </div>
                                    <div className="company-detail-download-edit">
                                      <i className="fa-solid fa-ellipsis-vertical" />
                                      <ul>
                                        <li>
                                          <i className="fa-solid fa-arrow-down" />{" "}
                                          Download
                                        </li>
                                        <li>
                                          <i className="fa-solid fa-trash" />{" "}
                                          Delete
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="company-detail-attechment-info">
                                    &nbsp; &nbsp; &nbsp; &nbsp;{" "}
                                    <div className="control-label-file-up">
                                      <i className="fa-solid fa-arrow-up-from-bracket" />{" "}
                                      Upload CV
                                      <input
                                        type="file"
                                        id="attach"
                                        className="optional-inputfile"
                                        name="attach"
                                        accept=".pdf, .doc, .docx"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="company-detail modal-footer">
                                  <a href="#" className="default-btn btn">
                                    Apply
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="company-detail-link-save-icon">
                          <ul>
                            <li>
                              <i className="fa-solid fa-link" />
                            </li>
                            <li>
                              <i className="fa-regular fa-heart" />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="company-detail-job-box">
                      <a href="job-details.html">
                        <div className="company-detail-card">
                          <h4>Technicien support VIP Anglais</h4>
                          <ul>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Paris
                            </li>
                            <li>
                              <i className="fa-solid fa-calendar-days" />
                              July2,2025, 3:47PM
                            </li>
                            <li>
                              <i className="fa-solid fa-signal" />
                              Intermediate Level
                            </li>
                            <li>
                              <i className="fa-solid fa-user" />
                              Full Time
                            </li>
                          </ul>
                        </div>
                      </a>
                      <div className="company-detail-apply-link-save-btn">
                        <div className="company-detail-apply-btn">
                          {/* Button trigger modal */}
                          <a
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#ApplyQuickly"
                            className="default-btn btn"
                          >
                            Apply Quickly
                          </a>
                          {/* Modal */}
                          <div
                            className="modal fade"
                            id="ApplyQuickly"
                            data-bs-backdrop="static"
                            data-bs-keyboard="false"
                            tabIndex={-1}
                            aria-labelledby="ApplyQuicklyLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h1
                                    className="modal-title fs-5"
                                    id="staticBackdropLabel"
                                  >
                                    Apply Now
                                  </h1>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  />
                                </div>
                                <div className="modal-body">
                                  <div className="company-detail-show-upload">
                                    <div className="company-detail-doc-tyep">
                                      <h4>
                                        <i className="fa-solid fa-circle-check" />
                                        Resume Name, pdf,doc
                                      </h4>
                                    </div>
                                    <div className="company-detail-download-edit">
                                      <i className="fa-solid fa-ellipsis-vertical" />
                                      <ul>
                                        <li>
                                          <i className="fa-solid fa-arrow-down" />{" "}
                                          Download
                                        </li>
                                        <li>
                                          <i className="fa-solid fa-trash" />{" "}
                                          Delete
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="company-detail-attechment-info">
                                    &nbsp; &nbsp; &nbsp; &nbsp;{" "}
                                    <div className="control-label-file-up">
                                      <i className="fa-solid fa-arrow-up-from-bracket" />{" "}
                                      Upload CV
                                      <input
                                        type="file"
                                        id="attach"
                                        className="optional-inputfile"
                                        name="attach"
                                        accept=".pdf, .doc, .docx"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="company-detail modal-footer">
                                  <a href="#" className="default-btn btn">
                                    Apply
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="company-detail-link-save-icon">
                          <ul>
                            <li>
                              <i className="fa-solid fa-link" />
                            </li>
                            <li>
                              <i className="fa-regular fa-heart" />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="company-detail-job-box">
                      <a href="job-details.html">
                        <div className="company-detail-card">
                          <h4>Technicien support VIP Anglais</h4>
                          <ul>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Paris
                            </li>
                            <li>
                              <i className="fa-solid fa-calendar-days" />
                              July2,2025, 3:47PM
                            </li>
                            <li>
                              <i className="fa-solid fa-signal" />
                              Intermediate Level
                            </li>
                            <li>
                              <i className="fa-solid fa-user" />
                              Full Time
                            </li>
                          </ul>
                        </div>
                      </a>
                      <div className="company-detail-apply-link-save-btn">
                        <div className="company-detail-apply-btn">
                          {/* Button trigger modal */}
                          <a
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#ApplyQuickly"
                            className="default-btn btn"
                          >
                            Apply Quickly
                          </a>
                          {/* Modal */}
                          <div
                            className="modal fade"
                            id="ApplyQuickly"
                            data-bs-backdrop="static"
                            data-bs-keyboard="false"
                            tabIndex={-1}
                            aria-labelledby="ApplyQuicklyLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h1
                                    className="modal-title fs-5"
                                    id="staticBackdropLabel"
                                  >
                                    Apply Now
                                  </h1>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  />
                                </div>
                                <div className="modal-body">
                                  <div className="company-detail-show-upload">
                                    <div className="company-detail-doc-tyep">
                                      <h4>
                                        <i className="fa-solid fa-circle-check" />
                                        Resume Name, pdf,doc
                                      </h4>
                                    </div>
                                    <div className="company-detail-download-edit">
                                      <i className="fa-solid fa-ellipsis-vertical" />
                                      <ul>
                                        <li>
                                          <i className="fa-solid fa-arrow-down" />{" "}
                                          Download
                                        </li>
                                        <li>
                                          <i className="fa-solid fa-trash" />{" "}
                                          Delete
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="company-detail-attechment-info">
                                    &nbsp; &nbsp; &nbsp; &nbsp;{" "}
                                    <div className="control-label-file-up">
                                      <i className="fa-solid fa-arrow-up-from-bracket" />{" "}
                                      Upload CV
                                      <input
                                        type="file"
                                        id="attach"
                                        className="optional-inputfile"
                                        name="attach"
                                        accept=".pdf, .doc, .docx"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="company-detail modal-footer">
                                  <a href="#" className="default-btn btn">
                                    Apply
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="company-detail-link-save-icon">
                          <ul>
                            <li>
                              <i className="fa-solid fa-link" />
                            </li>
                            <li>
                              <i className="fa-regular fa-heart" />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="company-detail-job-box">
                      <a href="job-details.html">
                        <div className="company-detail-card">
                          <h4>Technicien support VIP Anglais</h4>
                          <ul>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Paris
                            </li>
                            <li>
                              <i className="fa-solid fa-calendar-days" />
                              July2,2025, 3:47PM
                            </li>
                            <li>
                              <i className="fa-solid fa-signal" />
                              Intermediate Level
                            </li>
                            <li>
                              <i className="fa-solid fa-user" />
                              Full Time
                            </li>
                          </ul>
                        </div>
                      </a>
                      <div className="company-detail-apply-link-save-btn">
                        <div className="company-detail-apply-btn">
                          {/* Button trigger modal */}
                          <a
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#ApplyQuickly"
                            className="default-btn btn"
                          >
                            Apply Quickly
                          </a>
                          {/* Modal */}
                          <div
                            className="modal fade"
                            id="ApplyQuickly"
                            data-bs-backdrop="static"
                            data-bs-keyboard="false"
                            tabIndex={-1}
                            aria-labelledby="ApplyQuicklyLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h1
                                    className="modal-title fs-5"
                                    id="staticBackdropLabel"
                                  >
                                    Apply Now
                                  </h1>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  />
                                </div>
                                <div className="modal-body">
                                  <div className="company-detail-show-upload">
                                    <div className="company-detail-doc-tyep">
                                      <h4>
                                        <i className="fa-solid fa-circle-check" />
                                        Resume Name, pdf,doc
                                      </h4>
                                    </div>
                                    <div className="company-detail-download-edit">
                                      <i className="fa-solid fa-ellipsis-vertical" />
                                      <ul>
                                        <li>
                                          <i className="fa-solid fa-arrow-down" />{" "}
                                          Download
                                        </li>
                                        <li>
                                          <i className="fa-solid fa-trash" />{" "}
                                          Delete
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="company-detail-attechment-info">
                                    &nbsp; &nbsp; &nbsp; &nbsp;{" "}
                                    <div className="control-label-file-up">
                                      <i className="fa-solid fa-arrow-up-from-bracket" />{" "}
                                      Upload CV
                                      <input
                                        type="file"
                                        id="attach"
                                        className="optional-inputfile"
                                        name="attach"
                                        accept=".pdf, .doc, .docx"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="company-detail modal-footer">
                                  <a href="#" className="default-btn btn">
                                    Apply
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="company-detail-link-save-icon">
                          <ul>
                            <li>
                              <i className="fa-solid fa-link" />
                            </li>
                            <li>
                              <i className="fa-regular fa-heart" />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="menu3" className="tab-pane fade" role="tabpanel">
                    <div className="company-detail-third-tab">
                      <h5>Office Photos</h5>
                      <div className="row">
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-photos-box">
                            <img src="assets/images/company/company-img-1.jpg" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-photos-box">
                            <img src="assets/images/company/company-img-2.jpg" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-photos-box">
                            <img src="assets/images/company/company-img-3.jpg" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-photos-box">
                            <img src="assets/images/company/company-img-4.jpg" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-photos-box">
                            <img src="assets/images/company/company-img-4.jpg" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-photos-box">
                            <img src="assets/images/company/company-img-3.jpg" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-photos-box">
                            <img src="assets/images/company/company-img-1.jpg" />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-photos-box">
                            <img src="assets/images/company/company-img-2.jpg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="menu4" className="tab-pane fade" role="tabpanel">
                    <div className="company-detail-fourth-tab">
                      <h5>Office Videos</h5>
                      <div className="row">
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-video-box">
                            <video width="100%" height={150} controls>
                              <source
                                src="assets/images/video/camera.mp4"
                                type="video/mp4"
                              />
                            </video>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-video-box">
                            <video width="100%" height={150} controls>
                              <source
                                src="assets/images/video/recorderProject1.mp4"
                                type="video/mp4"
                              />
                            </video>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-video-box">
                            <video width="100%" height={150} controls>
                              <source
                                src="assets/images/video/recorderProject1.mp4"
                                type="video/mp4"
                              />
                            </video>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-video-box">
                            <video width="100%" height={150} controls>
                              <source
                                src="assets/images/video/search-lecla.mp4"
                                type="video/mp4"
                              />
                            </video>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-video-box">
                            <video width="100%" height={150} controls>
                              <source
                                src="assets/images/video/RecorderProject1.mp4"
                                type="video/mp4"
                              />
                            </video>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-video-box">
                            <video width="100%" height={150} controls>
                              <source
                                src="assets/images/video/search-lecla.mp4"
                                type="video/mp4"
                              />
                            </video>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-video-box">
                            <video width="100%" height={150} controls>
                              <source
                                src="assets/images/video/Tender.mp4"
                                type="video/mp4"
                              />
                            </video>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4">
                          <div className="company-office-video-box">
                            <video width="100%" height={150} controls>
                              <source
                                src="assets/images/video/camera.mp4"
                                type="video/mp4"
                              />
                            </video>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="menu5" className="tab-pane fade" role="tabpanel">
                    <div className="company-detail-fifth-tab">
                      <h5>Career Details</h5>
                      <p>
                        Respect for people, our priority at ID2, also includes
                        respect for the environment; it's a strong conviction
                        and our corporate culture. We feel strongly about the
                        importance of adopting eco-responsible behavior,
                        particularly with ID2's growth, which is leading to an
                        increase in our energy consumption.
                      </p>
                      <p>
                        Since 2008, we have been a member of the Global Compact
                        France. This pact aligns our operations and strategies
                        with ten universally accepted principles relating to
                        human rights, labor standards, the environment, and the
                        fight against corruption. These principles align with
                        ID2's values, particularly those related to working
                        conditions and the environment.
                      </p>
                      <p>
                        To measure our progress, we use ECOVADIS, an expert in
                        Corporate Social Responsibility. To date, ID2's
                        commitment to CSR is qualified as Platinum with a rating
                        of 78/100, which places us in the top 5% of suppliers
                        evaluated
                      </p>
                    </div>
                  </div>
                  <div id="menu6" className="tab-pane fade" role="tabpanel">
                    <div className="company-detail-sixth-tab">
                      <h5>Links</h5>
                      <div className="company-detail-official-website">
                        <h4>
                          <i className="fa-solid fa-globe" /> Company offical
                          website
                        </h4>
                        <h5>
                          <a
                            href="https://itdevelopmentservices.com/jobPortal/"
                            target="_blank"
                          >
                            Hauts De Seine Department
                          </a>
                        </h5>
                      </div>
                      <div className="company-detail-social-link">
                        <div className="company-detail-social-box">
                          <h4>
                            <i className="fa-brands fa-linkedin" /> Linkedin
                          </h4>
                          <a href="https://in.linkedin.com/" target="_blank">
                            https://in.linkedin.com/
                          </a>
                        </div>
                        <div className="company-detail-social-box">
                          <h4>
                            <i className="fa-brands fa-facebook-f" /> facebook
                          </h4>
                          <a href="https://www.facebook.com/" target="_blank">
                            https://www.facebook.com/
                          </a>
                        </div>
                        <div className="company-detail-social-box">
                          <h4>
                            <i className="fa-brands fa-instagram" /> Instagram
                          </h4>
                          <a href="https://www.instagram.com/" target="_blank">
                            https://www.instagram.com/
                          </a>
                        </div>
                        <div className="company-detail-social-box">
                          <h4>
                            <i className="fa-brands fa-x-twitter" /> Twitter
                          </h4>
                          <a href="https://x.com/" target="_blank">
                            https://x.com/
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CompanyDetailsPage;
