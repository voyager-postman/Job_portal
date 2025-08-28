import React from "react";
import { Link } from "react-router-dom";
function CertificateScorePage() {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Certificates Scores</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Certificates Scores
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>Certificate of completion</h3>
              <div className="profile-form">
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="certificates-scores-detail-info">
                      <div className="certificates-company-logo">
                        <img
                          src="assets/images/logo/connect-work-ma-login.png"
                          className="main-logo"
                          alt="logo"
                        />
                      </div>
                      <div className="certificates-scores-detail">
                        <h2>Certificate of completion</h2>
                        <p>This certifies that</p>
                        <h3>Andy Smith</h3>
                        <p>
                          has completed the necessary courses of study and
                          passed
                        </p>
                        <p>
                          the Connect Work.ma' SQL exams and is hereby declared
                          a
                        </p>
                        <h3>Certified SQL Developer</h3>
                        <p>
                          with fundamental knowledge of SQL development using
                          SQL query.
                        </p>
                        <h6>Issued May 25, 2025</h6>
                      </div>
                      <div className="website-name-signature-info">
                        <div className="website-name-info">
                          <h6>Verify completion at</h6>
                          <a href="#">Connect Work.ma</a>
                        </div>
                        <div className="authorized-signature-info">
                          <div className="authorized-signature-img">
                            <img
                              src="assets/images/company/signatureImg.png"
                              alt="authorized-signature"
                            />
                          </div>
                          <h6>Thomas Thorsell Arntsen</h6>
                          <h6>For Connect Work.ma</h6>
                        </div>
                      </div>
                      <div className="certificates-download-icon">
                        <a
                          href="https://itdevelopmentservices.com/design_website/jobPortal/assets/images/certificate/certificate.pdf"
                          target="_blank"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          aria-label="Download Certificate"
                          data-bs-original-title="Download Certificate"
                        >
                          <i className="fa-solid fa-cloud-arrow-down" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="certificates-scores-detail-info">
                      <div className="certificates-company-logo">
                        <img
                          src="assets/images/logo/connect-work-ma-login.png"
                          className="main-logo"
                          alt="logo"
                        />
                      </div>
                      <div className="certificates-scores-detail">
                        <h2>Certificate of completion</h2>
                        <p>This certifies that</p>
                        <h3>Andy Smith</h3>
                        <p>
                          has completed the necessary courses of study and
                          passed
                        </p>
                        <p>
                          the Connect Work.ma' CSS exams and is hereby declared
                          a
                        </p>
                        <h3>Certified CSS Developer</h3>
                        <p>
                          with fundamental knowledge of CSS development using
                          CSS code.
                        </p>
                        <h6>Issued May 25, 2025</h6>
                      </div>
                      <div className="website-name-signature-info">
                        <div className="website-name-info">
                          <h6>Verify completion at</h6>
                          <a href="#">Connect Work.ma</a>
                        </div>
                        <div className="authorized-signature-info">
                          <div className="authorized-signature-img">
                            <img
                              src="assets/images/company/signatureImg.png"
                              alt="authorized-signature"
                            />
                          </div>
                          <h6>Thomas Thorsell Arntsen</h6>
                          <h6>For Connect Work.ma</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*End My Profile Area*/}
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

export default CertificateScorePage;
