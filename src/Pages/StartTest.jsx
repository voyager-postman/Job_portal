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
  useEffect(() => {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";

    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
  }, []);
  // useEffect(() => {
  //   if (document.documentElement.requestFullscreen) {
  //     document.documentElement.requestFullscreen();
  //   }

  //   return () => {
  //     if (document.fullscreenElement) {
  //       document.exitFullscreen();
  //     }
  //   };
  // }, []);
  const closeAllModals = () => {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";

    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());

    document.querySelectorAll(".modal.show").forEach((modal) => {
      modal.classList.remove("show");
      modal.style.display = "none";
    });
  };

  return (
    <div className="full-screen-test">
      {/* <!--Test Question Modal Start Here --> */}
      <div className="skill-assessment-test-form-area">
        <div className="skill-assessment-test-page-area">
          {/* Header */}

          <div className="skill-assessment-test-question-header">
            <div className="skill-assessment-test-name-timer">
              <span>JavaScript Fundamentals</span>
              <span className="test-start-timer-area">
                <i className="fa-solid fa-clock" /> Time Left:{" "}
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="skill-assessment-test-tq-close">
              {/* <span>0/5 Answered</span> */}
              <div className="display-flex ">
                <span
                  className="quit-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#submitTestModal"
                >
                  Submit
                </span>

                <span
                  className="quit-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#quitTestModal"
                >
                  Quit
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Quit Test Modal */}
        <div className="modal fade" id="quitTestModal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <h5>Quit Test?</h5>
                <p>
                  If you quit now, all your answers will be lost and the test
                  will end.
                </p>
              </div>

              <div className="modal-footer justify-content-center">
                <button className="default-btn btn" data-bs-dismiss="modal">
                  Continue Test
                </button>

                <button
                  className="default-btn btn btn-danger"
                  onClick={() => {
                    closeAllModals();

                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    }

                    navigate("/skill-assessments-tests");
                  }}
                >
                  Quit Test
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Submit Test Modal */}
        <div className="modal fade" id="submitTestModal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <h5>Submit Test?</h5>
                <p>
                  Once you submit, you won’t be able to change your answers.
                </p>
              </div>

              <div className="modal-footer justify-content-center">
                <button className="default-btn btn" data-bs-dismiss="modal">
                  Cancel
                </button>

                <button
                  className="default-btn btn btn-success"
                  onClick={() => {
                    closeAllModals();

                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    }

                    navigate("/test-result", {
                      state: {
                        total: totalQuestions,
                        correct: 4,
                        incorrect: 1,
                        score: 80,
                        testName: "JavaScript Fundamentals",
                      },
                    });
                  }}
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}

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

        {/* Footer */}
        <div className="test-footer">
          <button
            className="default-btn btn"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion((q) => Math.max(0, q - 1))}
          >
            Previous
          </button>{" "}
          {currentQuestion < totalQuestions - 1 ? (
            <button
              className="default-btn btn"
              onClick={() =>
                setCurrentQuestion((q) => Math.min(totalQuestions - 1, q + 1))
              }
            >
              Next
            </button>
          ) : (
            <button
              className="default-btn btn"
              data-bs-toggle="modal"
              data-bs-target="#finishTestModal"
            >
              Finish Test
            </button>
          )}
        </div>
      </div>

      {/* <!--Test Question Modal End Here --> */}

      {/* <!-- Finish Test Modal Start here --> */}
      <div class="skill-assessment-test-finish-area">
        {/* <!-- Modal --> */}
        {/* Finish Test Modal */}
        <div className="modal fade" id="finishTestModal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <h5>Finish Test?</h5>
                <p>
                  You have answered {totalQuestions} of {totalQuestions}{" "}
                  questions.
                </p>
              </div>

              <div className="modal-footer justify-content-center">
                <button className="default-btn btn" data-bs-dismiss="modal">
                  Cancel
                </button>

                <button
                  className="default-btn btn btn-success"
                  onClick={() => {
                    closeAllModals();

                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    }

                    navigate("/test-result", {
                      state: {
                        total: totalQuestions,
                        correct: 4,
                        incorrect: 1,
                        score: 80,
                        testName: "JavaScript Fundamentals",
                      },
                    });
                  }}
                >
                  Submit Test
                </button>
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
