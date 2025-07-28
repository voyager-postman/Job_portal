import React from "react";
import { Link } from "react-router-dom";
function JobDetails() {
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
                <i className="fa-solid fa-angle-right" />
                Job Details
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Job Detail Section Start here Area*/}
          <section className="job-details-top-main-info">
            <div className="job-details-top-info-area">
              <div className="job-name-company-name">
                <div className="job-details-job-name">
                  <h2>
                    Senior Back-end Software Engineer PHP (F/M) - Sophia
                    Antipolis
                  </h2>
                  <Link
                    to="/companies-details"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <p style={{ cursor: "pointer" }}>
                      <strong>Company Name: </strong>Integra Technologies
                    </p>
                  </Link>
                  <p>
                    <strong>Posted by: </strong>Vcloud Technologies Investment
                  </p>
                </div>
                <div className="job-name-company-logo">
                  <img
                    src="/jobPortal/assets/images/logo/connect-work-ma-login.png"
                    alt="logo"
                  />
                </div>
              </div>
              <div className="job-apply-link-save-btn-info">
                <div className="job-save-btn">
                  <ul>
                    <li>
                      <i className="fa-solid fa-link" />
                    </li>
                    <li>
                      <i className="fa-regular fa-heart" />
                    </li>
                  </ul>
                </div>
                <div className="job-apply-btn">
                  <a href="#" className="default-btn btn">
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
            <div className="job-details-tag-info-area">
              <div className="job-details-tag-main-area">
                <div className="job-details-tag-box">
                  <h4>
                    <i className="fa-solid fa-location-dot" />
                    Place
                  </h4>
                  <p>Boulogne-Billancourt</p>
                </div>
                <div className="job-details-tag-box">
                  <h4>
                    <i className="fa-solid fa-calendar-days" />
                    Publication date
                  </h4>
                  <p>6 hours ago</p>
                </div>
                <div className="job-details-tag-box">
                  <h4>
                    <i className="fa-solid fa-signal" />
                    Experience level
                  </h4>
                  <p>Intermediate</p>
                </div>
                <div className="job-details-tag-box">
                  <h4>
                    <i className="fa-solid fa-user" />
                    Type of contract
                  </h4>
                  <p>Full time</p>
                </div>
              </div>
              <div className="job-details-spaceline" />
              <div className="job-details-tag-main-area">
                <div className="job-details-tag-box">
                  <h4>
                    <i className="fa-solid fa-gear" /> Job category
                  </h4>
                  <p>Software Engineering / Web Development</p>
                </div>
                <div className="job-details-tag-box">
                  <h4>
                    <i className="fa-solid fa-briefcase" />
                    Openings
                  </h4>
                  <p>10</p>
                </div>
                <div className="job-details-tag-box">
                  <h4>
                    <i className="fa-solid fa-file" />
                    Applicants
                  </h4>
                  <p>1000</p>
                </div>
                <div className="job-details-tag-box">
                  <h4>
                    <i className="fa-solid fa-money-bill" />
                    Salary
                  </h4>
                  <p>€ 20000</p>
                </div>
              </div>
            </div>
            <div className="job-details-role-company-discription">
              <h5>About the role</h5>
              <p>
                The Master Data Management (MDM) competence center in Nantes is
                expanding rapidly with the integration of new strategic projects
                aimed at strengthening master data management for our clients.
              </p>
              <p>
                In this dynamic context, we are looking to integrate DATA
                consultants. An opportunity to participate in the evolution of
                the competence center by contributing to the implementation of
                innovative MDM solutions. The consultant will be involved in
                various projects, in collaboration with experts in the field, to
                support clients in optimizing the quality and governance of
                their data.
              </p>
              <p>
                The objective of this mission is to contribute to the
                implementation and optimization of MDM solutions in order to
                improve the quality, consistency and governance of master data
                for our clients.
              </p>
              <h5>Company Description</h5>
              <p>
                The Master Data Management (MDM) competence center in Nantes is
                expanding rapidly with the integration of new strategic projects
                aimed at strengthening master data management for our clients.
              </p>
              <p>
                In this dynamic context, we are looking to integrate DATA
                consultants. An opportunity to participate in the evolution of
                the competence center by contributing to the implementation of
                innovative MDM solutions. The consultant will be involved in
                various projects, in collaboration with experts in the field, to
                support clients in optimizing the quality and governance of
                their data.
              </p>
              <p>
                The objective of this mission is to contribute to the
                implementation and optimization of MDM solutions in order to
                improve the quality, consistency and governance of master data
                for our clients.
              </p>
            </div>
            <div className="job-details-job-description">
              <h5>Job Description</h5>
              <p>
                You will join Believe's Data Office Tribu and the Dataplateforme
                squad as a Data Engineer. The Dataplateforme is based on an AWS
                / Snowflake stack with state-of-the-art practices in data
                engineering and data modeling, and high volume and high
                performance constraints.
              </p>
              <p>
                Within the squad organized according to the Scrum practice, in
                charge of the Build and Run of its scope, you will be
                responsible for implementing data flows from the ingestion of
                new sources to their preparation for exposure through the
                Bronze, Silver and Gold levels.
              </p>
            </div>
            <div className="job-details-job-qualifications">
              <h5>Required Qualifications</h5>
              <p>
                You are at BAC + 3 to BAC + 5 level (Engineering schools, BTS,
                DUT, DESS, Master).
              </p>
              <p>Your level of English is fluent, both spoken and written.</p>
              <p>
                You like to stay up to date with new technological developments,
                and practice regular monitoring.
              </p>
              <p>
                You have significant experience (at least 3 years) in the
                technologies of our stack: AWS, Snowflake, python, spark scala,
                SQL.
              </p>
            </div>
            <div className="job-details-job-qualifications">
              <h5>Required Skills</h5>
              <p>
                Proficiency in front-end technologies (HTML, CSS, JavaScript,
                React, Angular, or Vue.js).
              </p>
              <p>
                Experience with back-end development using Node.js, Python, PHP,
                or Java.
              </p>
              <p>
                Familiarity with SQL and NoSQL databases (PostgreSQL, MySQL,
                MongoDB, etc.).
              </p>
              <p>Experience with cloud platforms (AWS, GCP, or Azure).</p>
              <p>
                Proficiency in version control systems (Git, GitHub, GitLab,
                etc.).
              </p>
            </div>
            <div className="job-details-related-tags">
              <h5>Related Tags</h5>
              <ul>
                <li>Node.Js</li>
                <li>Web Designing</li>
                <li>Devops</li>
                <li>Microsoft Azure</li>
                <li>Responsive Web Design</li>
                <li>Responsive Design</li>
                <li>Java</li>
                <li>Selenium</li>
                <li>Bootstrap</li>
                <li>JQuery</li>
                <li>Frontend Development</li>
                <li>Responsive Web Design</li>
              </ul>
            </div>
            <div className="summary-offer-info-area">
              <div className="summary-offer-post-details">
                <div className="summary-offer-job-post">
                  <h4>
                    <img
                      src="/jobPortal/assets/images/logo/connect-work-ma-login.png"
                      alt="logo"
                    />{" "}
                    Integra Technologies
                  </h4>
                </div>
                <div className="summary-offer-save-job">
                  <i className="fa-regular fa-heart" />
                </div>
              </div>
              <div className="summary-offer-job-short-detail">
                <h4>
                  Senior Back-end Software Engineer PHP (F/M) - Sophia Antipolis
                </h4>
                <ul>
                  <li>
                    <i className="fa-solid fa-location-dot" />{" "}
                    Boulogne-Billancourt
                  </li>
                  <li>
                    <i className="fa-regular fa-calendar" /> 6 hours ago
                  </li>
                  <li>
                    <i className="fa-regular fa-file" /> Intermediate
                  </li>
                  <li>
                    <i className="fa-regular fa-user" /> Full time
                  </li>
                </ul>
                <div className="summary-offer-apply-report-btn">
                  <a href="#" className="default-btn btn">
                    Apply Now
                  </a>
                  <a href="#" className="report-btn-info">
                    Report this job
                  </a>
                </div>
              </div>
            </div>
          </section>
          {/*Job Detail Section End here Area*/}
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

export default JobDetails;
