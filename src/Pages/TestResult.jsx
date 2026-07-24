import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TestResult = () => {
  const { t } = useTranslation("global");
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state) return null;

  const {
    message,
    jobId,
    jobSlug,
    scorePercentage,
    passingPercentage,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    isPassed,
    autoSubmitted,
    from,
  } = state;

  const closeAnyOpenModal = () => {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
    document.querySelectorAll(".modal-backdrop").forEach((bd) => bd.remove());
  };

  return (
    <section className="skill-assessment-test-score-card-area">
      <div className="score-card-wrapper text-center p-40">
        {autoSubmitted && (
          <p className="text-warning mb-3">⏱ {t("assessment.auto_submitted")}</p>
        )}
        {!isPassed && (
          <div className="skill-assessment-test-score-NoPassed card p-4 text-center">
            <div className="score-card-top-area">
              <i className="fa-regular fa-circle-xmark text-danger fs-1"></i>
              <h5 className="mt-3">{message || t("assessment.test_not_passed")}</h5>
              <p>{t("assessment.needed_to_pass", { percent: passingPercentage })}</p>
            </div>
            <div className="score-card-final-score my-3">
              <h2>{scorePercentage || 0}%</h2>
              <p>{t("assessment.final_score")}</p>
            </div>
            <div className="score-card-number-area d-flex justify-content-around">
              <div>
                <h5>{totalQuestions || 0}</h5>
                <p>{t("messaging.total")}</p>
              </div>
              <div>
                <h5>{correctAnswers || 0}</h5>
                <p>{t("assessment.correct")}</p>
              </div>
              <div>
                <h5>{incorrectAnswers || 0}</h5>
                <p>{t("assessment.incorrect")}</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                className="default-btn btn"
                onClick={() => {
                  closeAnyOpenModal();
                  navigate(`/job/${jobSlug}`, {
                    state: { from: "/job-search", JobId: jobId },
                  });
                }}
              >
                {t("assessment.back_to_application")}
              </button>
            </div>
          </div>
        )}
        {isPassed && (
          <div className="skill-assessment-test-score-Passed card p-4 text-center">
            <div className="score-card-top-area">
              <i className="fa-solid fa-trophy"></i>
              <h5 className="mt-3">{t("assessment.congratulations")}</h5>
              <p>{t("assessment.passed_message")}</p>
            </div>
            <div className="score-card-final-score my-3">
              <h2>{scorePercentage || 0}%</h2>
              <p>{t("assessment.final_score")}</p>
            </div>
            <div className="score-card-number-area d-flex justify-content-around">
              <div>
                <h5>{totalQuestions || 0}</h5>
                <p>{t("messaging.total")}</p>
              </div>
              <div>
                <h5>{correctAnswers || 0}</h5>
                <p>{t("assessment.correct")}</p>
              </div>
              <div>
                <h5>{incorrectAnswers || 0}</h5>
                <p>{t("assessment.incorrect")}</p>
              </div>
            </div>
            <div className="continue-application-btn-area mt-4">
              <button
                className="default-btn btn"
                onClick={() => {
                  closeAnyOpenModal();
                  navigate(`/job/${jobSlug}`, {
                    state: { from: from || "/job-search", JobId: jobId },
                  });
                }}
              >
                {t("assessment.continue_application")}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestResult;
