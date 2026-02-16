import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const TestResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  console.log(state);
  useEffect(() => {
    if (!state) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state) return null;

  const {
    testName,
    from,
    jobId,
    message,
    scorePercentage,
    passingPercentage,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    isPassed,
    autoSubmitted,
  } = state;
  const closeAnyOpenModal = () => {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";

    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((bd) => bd.remove());
  };

  return (
    <section className="skill-assessment-test-score-card-area">
      <div className="score-card-wrapper text-center p-40">
        {/* Optional auto-submit message */}
        {autoSubmitted && (
          <p className="text-warning mb-3">
            ⏱ Test was auto-submitted due to time expiration.
          </p>
        )}
        {/* ================= NOT PASSED ================= */}
        {!isPassed && (
          <div className="skill-assessment-test-score-NoPassed card p-4 text-center">
            <div className="score-card-top-area">
              <i className="fa-regular fa-circle-xmark text-danger fs-1"></i>
              <h5 className="mt-3">{message || "Test Not Passed"}</h5>
              <p>You needed {passingPercentage}% to pass.</p>
            </div>

            <div className="score-card-final-score my-3">
              <h2>{scorePercentage || 0}%</h2>
              <p>Final Score</p>
            </div>

            <div className="score-card-number-area d-flex justify-content-around">
              <div>
                <h5>{totalQuestions || 0}</h5>
                <p>Total</p>
              </div>
              <div>
                <h5>{correctAnswers || 0}</h5>
                <p>Correct</p>
              </div>
              <div>
                <h5>{incorrectAnswers || 0}</h5>
                <p>Incorrect</p>
              </div>
            </div>

            <div className="mt-4">
              <button
                className="default-btn btn"
                onClick={() => {
                  closeAnyOpenModal();
                  navigate(`/job-details/${jobId}`, {
                    state: { from: "/job-search" },
                  });
                }}
              >
                Back to Application
              </button>
            </div>
          </div>
        )}
        {isPassed && (
          <div className="skill-assessment-test-score-Passed card p-4 text-center">
            <div className="score-card-top-area">
              <i className="fa-solid fa-trophy"></i>
              <h5 className="mt-3">Congratulations!</h5>
              <p>You have successfully passed the assessment.</p>
            </div>

            <div className="score-card-final-score my-3">
              <h2>{scorePercentage || 0}%</h2>
              <p>Final Score</p>
            </div>

            <div className="score-card-number-area d-flex justify-content-around">
              <div>
                <h5>{totalQuestions || 0}</h5>
                <p>Total</p>
              </div>
              <div>
                <h5>{correctAnswers || 0}</h5>
                <p>Correct</p>
              </div>
              <div>
                <h5>{incorrectAnswers || 0}</h5>
                <p>Incorrect</p>
              </div>
            </div>

            <div className="continue-application-btn-area mt-4">
              <button
                className="default-btn btn"
                onClick={() => {
                  closeAnyOpenModal();
                  navigate(`/job-details/${jobId}`, {
                    state: { from: from || "/job-search" },
                  });
                }}
              >
                Continue Application
              </button>
            </div>
          </div>
        )}{" "}
        *
      </div>
    </section>
  );
};

export default TestResult;
