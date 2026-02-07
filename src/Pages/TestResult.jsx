import React from "react";
import { Link } from "react-router-dom";

const TestResult = () => {
  return (
    <div>
      {/* Breadcrumb */}
      <section className="inner-breadcrumb-main-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="breadcrumb-main-list-area mt-4">
                <h4>Test Result</h4>
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
                    <Link to="/apply-test">Apply Test</Link>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <Link to="/start-test">Start Test</Link>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <span>Test Result</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Result Page */}
      <section className="skill-assessment-test-score-card-area py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="score-card-wrapper text-center p-4">
                {/* ❌ Not Passed */}

                <div className="skill-assessment-test-score-NoPassed card p-4 text-center">
                  <div className="score-card-top-area">
                    <i className="fa-regular fa-circle-xmark text-danger fs-1"></i>
                    <h5 className="mt-3">Test Not Passed</h5>
                    <p>You needed 70% to pass.</p>
                  </div>

                  <div className="score-card-final-score my-3">
                    <h2>40%</h2>
                    <p>Final Score</p>
                  </div>

                  <div className="score-card-number-area d-flex justify-content-around">
                    <div className="score-card-total-number">
                      <h5>5</h5>
                      <p>Total</p>
                    </div>
                    <div className="score-card-correct-number">
                      <h5>2</h5>
                      <p>Correct</p>
                    </div>
                    <div className="score-card-incorrect-number">
                      <h5>3</h5>
                      <p>Incorrect</p>
                    </div>
                  </div>
                </div>

                <div className="skill-assessment-test-score-Passed card p-4 text-center">
                  <div className="score-card-top-area">
                    <i className="fa-solid fa-trophy text-success fs-1"></i>
                    <h5 className="mt-3">Congratulations!</h5>
                    <p>You have successfully passed the assessment.</p>
                  </div>

                  <div className="score-card-final-score my-3">
                    <h2>100%</h2>
                    <p>Final Score</p>
                  </div>

                  <div className="score-card-number-area d-flex justify-content-around">
                    <div className="score-card-total-number">
                      <h5>5</h5>
                      <p>Total</p>
                    </div>
                    <div className="score-card-correct-number">
                      <h5>5</h5>
                      <p>Correct</p>
                    </div>
                    <div className="score-card-incorrect-number">
                      <h5>0</h5>
                      <p>Incorrect</p>
                    </div>
                  </div>

                  <div className="continue-application-btn-area mt-4">
                    <Link to="/candidate-dashboard" className="default-btn btn">
                      Continue Application
                    </Link>
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

export default TestResult;
