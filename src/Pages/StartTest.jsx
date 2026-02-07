import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const StartTest = () => {
  const navigate = useNavigate();
  const totalQuestions = 5;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(299); // 4:59 in seconds

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          navigate("/finish-test");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div>
      {/* Breadcrumb */}
      <section className="inner-breadcrumb-main-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="breadcrumb-main-list-area mt-4">
                <h4>Start Test</h4>
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
                  <li>Start Test</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!--Test Question Modal Start Here --> */}
      <div className="skill-assessment-test-page-area py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="start-header shadow-sm">
                {/* Header */}
                <div className="test-header">
                  <div className="skill-assessment-test-question-header">
                    <div className="skill-assessment-test-name-timer">
                      <span>JavaScript Fundamentals</span>
                      <span className="test-start-timer-area">
                        <i className="fa-solid fa-calendar"></i>{" "}
                        {formatTime(timeLeft)}
                      </span>
                    </div>

                    <div className="skill-assessment-test-tq-close">
                      <span>
                        {currentQuestion}/{totalQuestions} Answered
                      </span>
                      {/* <span
                        className="close-test"
                        onClick={() => navigate("/candidate-dashboard")}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </span> */}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="test-body">
                  <div className="skill-assessment-test-num-level">
                    <span>
                      Question {currentQuestion + 1} of {totalQuestions}
                    </span>
                    <span className="skill-assessment-test-level">Level B</span>
                  </div>

                  {/* Question */}
                  <div className="skill-assessment-test-question-option active">
                    <h6>What is the output of typeof null in JavaScript?</h6>

                    <label>
                      <input type="radio" name="q1" /> Object
                    </label>
                    <label>
                      <input type="radio" name="q1" /> Array
                    </label>
                    <label>
                      <input type="radio" name="q1" /> Null
                    </label>
                    <label>
                      <input type="radio" name="q1" /> Undefined
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="test-footer">
                  <button
                    className="default-btn btn"
                    disabled={currentQuestion === 0}
                    onClick={() =>
                      setCurrentQuestion((q) => Math.max(0, q - 1))
                    }
                  >
                    Previous
                  </button>{" "}
                  {currentQuestion < totalQuestions - 1 ? (
                    <button
                      className="default-btn btn"
                      onClick={() =>
                        setCurrentQuestion((q) =>
                          Math.min(totalQuestions - 1, q + 1),
                        )
                      }
                    >
                      Next
                    </button>
                  ) : (
                    <Link
                      to="/test-result"
                      className="default-btn btn"
                      //   id="finishBtn"
                      //   data-bs-toggle="modal"
                      //   data-bs-target="#finishTestModal"
                    >
                      Finish Test
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!--Test Question Modal End Here --> */}

      {/* <!-- Finish Test Modal Start here --> */}
      <div class="skill-assessment-test-finish-area">
        {/* <!-- Modal --> */}
        <div
          class="modal fade"
          id="finishTestModal"
          tabindex="-1"
          aria-labelledby="finishTestModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-body">
                <h5>Finish Test?</h5>
                <p>You have answered 5 of 5 questions.</p>
              </div>
              <div class="modal-footer">
                <span class="default-btn btn" id="reviewBtn">
                  Review Answers
                </span>
                <span
                  class="default-btn btn"
                  id="submitBtn"
                  data-bs-toggle="modal"
                  data-bs-target="#scoreCardModal"
                >
                  Submit Test
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Finish Test Modal End here --> */}
    </div>
  );
};

export default StartTest;
