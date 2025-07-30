import React from "react";
import { Link } from "react-router-dom";
function CompanyDetailsInfo() {
  return (
    <>
      <div className="page-banner-area bg-f0f4fc">
            <div className="container">
              <div className="page-banner-content">
                <h1>Company Details</h1>
                <ul>
                  <li>
                    <Link to="/" className="nav-link">
                      {" "}
                      Home
                    </Link>
                  </li>
                  <li>Company Details</li>
                </ul>
              </div>
            </div>
          </div>
      <div className="container">
        <div className="row">
          <section className="company-detail-info-area">
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
                      <a href="#" target="_blank">
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
                      About
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
                      Jobs
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
                      CSR Policy
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
                      The Management Team
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
                      Career
                    </a>
                  </li>
                </ul>
              </div>
              <div className="company-detail-tab-description">
                {/* Tab panes */}
                <div className="tab-content">
                  <div id="menu1" className="tab-pane active" role="tabpanel">
                    <h4>Who are we ?</h4>
                    <p>
                      The men and women of ID2 by tibco work at the heart of our
                      clients' infrastructures to support them in their digital
                      transformation, with all the expertise, proximity and
                      responsiveness of a human-sized structure and the strength
                      of a large Group.
                    </p>
                    <p>
                      The men and women of ID2 by tibco work at the heart of our
                      clients' infrastructures to support them in their digital
                      transformation, with all the expertise, proximity and
                      responsiveness of a human-sized structure and the strength
                      of a large Group.
                    </p>
                    <p>
                      The men and women of ID2 by tibco work at the heart of our
                      clients' infrastructures to support them in their digital
                      transformation, with all the expertise, proximity and
                      responsiveness of a human-sized structure and the strength
                      of a large Group.
                    </p>
                    <p>
                      The men and women of ID2 by tibco work at the heart of our
                      clients' infrastructures to support them in their digital
                      transformation, with all the expertise, proximity and
                      responsiveness of a human-sized structure and the strength
                      of a large Group.
                    </p>
                  </div>
                  <div id="menu2" className="tab-pane fade" role="tabpanel">
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
                      <h4>CSR Policy</h4>
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
                  <div id="menu4" className="tab-pane fade" role="tabpanel">
                    <div className="company-detail-fourth-tab">
                      <h4>The Managment Team</h4>
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
                  <div id="menu5" className="tab-pane fade" role="tabpanel">
                    <div className="company-detail-fifth-tab">
                      <h4>Career</h4>
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
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default CompanyDetailsInfo;
