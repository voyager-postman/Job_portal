import React from "react";
import { Link, useLocation } from "react-router-dom";

const ApplyTest = () => {
  const location = useLocation();
  const { from, jobTitle } = location.state || {};

  return (
    <div>
      {/* Breadcrumb */}
      <section className="inner-breadcrumb-main-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="breadcrumb-main-list-area mt-4">
                <h4>Apply Test</h4>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <Link to="/candidate-dashboard">Dashboard</Link>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <Link to="/job-search">Job Search</Link>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <Link to={from || "/job-details"}>
                      {jobTitle || "Job Details"}
                    </Link>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li>Apply Test</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page Content (Instead of Modal) */}
      <section className="skill-assessment-test-page-area py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="skill-assessment-test-card p-4 shadow-sm">
                <div className="test-header mb-3">
                  <h4>
                    <i className="fa-solid fa-file me-2"></i>
                    Test Required
                  </h4>
                </div>

                <div className="skill-assessment-test-modal-details">
                  <p>
                    To apply for <strong>Senior JavaScript Developer</strong>,
                    you must complete a skills assessment.
                  </p>

                  <div className="skill-assessment-javaScript-fundamental mb-3">
                    <h6>JavaScript Fundamentals</h6>
                    <p>Assess your knowledge of JavaScript core concepts</p>
                    <ul>
                      <li>
                        <i className="fa-solid fa-calendar me-1"></i> 5 Minutes
                      </li>
                      <li>
                        <i className="fa-solid fa-file me-1"></i> 5 Questions
                      </li>
                      <li>
                        <i className="fa-solid fa-percent me-1"></i> Pass
                        threshold: 70%
                      </li>
                    </ul>
                  </div>

                  <div className="skill-assessment-important-area">
                    <h6>Important</h6>
                    <p>
                      Once started, the timer cannot be paused. Make sure you
                      have enough time to complete the test.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end gap-2 mt-4">
                  {/* <Link to="/candidate-dashboard" className="default-btn btn">
                    Back
                  </Link> */}
                  <Link to="/start-test" className="default-btn btn">
                    Start Test
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
