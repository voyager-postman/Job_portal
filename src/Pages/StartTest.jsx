import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
const StartTest = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state);
  const assessmentId = state?.assessmentId;
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitMode, setSubmitMode] = useState(null);
  // "auto" | "submit" | "finish"

  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];
  const isMultiple = currentQ?.questionType === "multiple";

  useEffect(() => {
    if (!assessmentId) {
      navigate("/");
      return;
    }

    fetchAssessmentQuestions(assessmentId);
  }, [assessmentId]);

  const fetchAssessmentQuestions = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_BASE_URL}assessments/${id}/questions`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { assessment, questions } = res.data;

      setAssessment(assessment);
      setQuestions(questions);

      // 🔥 FETCH LIVE TIME FROM BACKEND
      const timeRes = await fetchLiveRemainingTime(assessmentId, state?.jobId);

      if (!timeRes.success) {
        alert("Unable to fetch remaining time");
        return;
      }

      const remaining = timeRes.remainingSeconds;

      if (remaining <= 0) {
        setTimeLeft(0);
        handleAutoSubmit();
      } else {
        setTimeLeft(remaining);
      }
    } catch (err) {
      console.error("Failed to fetch questions", err);
    } finally {
      setLoading(false);
    }
  };

  // Timer
  const handleAutoSubmit = () => {
    if (submitMode) return; // 👈 prevent double calls

    setSubmitMode("auto");
    closeAllModals();

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    submitAssessment(true);
  };
  const isLastQuestion = currentQuestion === questions.length - 1;

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

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
  const buildAnswersPayload = () => {
    return Object.entries(answers).map(([questionId, selectedAnswers]) => ({
      questionId,
      selectedAnswers, // already array
    }));
  };

  const submitAssessment = async (autoSubmitted = false) => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        jobId: state?.jobId,
        answers: buildAnswersPayload(),
        autoSubmitted,
      };

      const res = await axios.post(
        `${API_BASE_URL}submitAssessment/${assessmentId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { success, message, result } = res.data;

      if (!success) {
        alert(message);
        return;
      }

      navigate("/test-result", {
        state: {
          jobId: state?.jobId,
          testName: assessment?.assessmentName,
          submitMode, // 👈 useful
          message,
          autoSubmitted,
          ...result,
        },
      });
    } catch (error) {
      const apiMessage = error?.response?.data?.message;

      if (apiMessage === "Assessment already submitted") {
        alert("⚠️ You have already submitted this assessment.");
        navigate("/skill-assessments-tests");
        return;
      }

      alert("Something went wrong");
    }
  };
  const fetchLiveRemainingTime = async (assessmentId, jobId) => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${API_BASE_URL}getLiveRemainingTime/${assessmentId}/${jobId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return res.data;
  };

  return (
    <div className="full-screen-test">
      {/* <!--Test Question Modal Start Here --> */}
      <div className="skill-assessment-test-form-area">
        <div className="skill-assessment-test-page-area">
          {/* Header */}

          <div className="skill-assessment-test-question-header">
            <div className="skill-assessment-test-name-timer">
              <span>{assessment?.assessmentName}</span>
              <span className="test-start-timer-area">
                <i className="fa-solid fa-clock" /> Time Left:{" "}
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="skill-assessment-test-tq-close">
              {/* <span>0/5 Answered</span> */}
              {!isLastQuestion && (
                <span
                  className="quit-btn submit-assessment"
                  data-bs-toggle="modal"
                  data-bs-target="#submitTestModal"
                  onClick={() => setSubmitMode("submit")}
                >
                  Submit
                </span>
              )}

              <span
                className="quit-btn quit-assessment"
                data-bs-toggle="modal"
                data-bs-target="#quitTestModal"
              >
                Quit
              </span>
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
                    submitAssessment(false);
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
            Question {currentQuestion + 1} of {assessment?.totalQuestions}
          </span>
          <span className="skill-assessment-test-level">
            {" "}
            Level {currentQ?.level}
          </span>
        </div>

        {/* Question */}
        {currentQ && (
          <div className="skill-assessment-test-question-option active">
            <h6>{currentQ.question}</h6>

            {currentQ.options.map((opt) => (
              <label key={opt._id} className="d-block">
                <input
                  type={isMultiple ? "checkbox" : "radio"}
                  name={currentQ._id} // important for radio grouping
                  checked={
                    isMultiple
                      ? answers[currentQ._id]?.includes(opt.key) || false
                      : answers[currentQ._id]?.[0] === opt.key
                  }
                  onChange={() => {
                    setAnswers((prev) => {
                      const prevAnswers = prev[currentQ._id] || [];

                      // SINGLE / BOOLEAN → replace
                      if (!isMultiple) {
                        return {
                          ...prev,
                          [currentQ._id]: [opt.key],
                        };
                      }

                      // MULTIPLE → toggle
                      return {
                        ...prev,
                        [currentQ._id]: prevAnswers.includes(opt.key)
                          ? prevAnswers.filter((k) => k !== opt.key)
                          : [...prevAnswers, opt.key],
                      };
                    });
                  }}
                />
                <span className="ms-2">
                  {opt.key}. {opt.text}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="test-footer">
          <button
            className="default-btn btn"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion((q) => q - 1)}
          >
            Previous
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              className="default-btn btn"
              onClick={() => setCurrentQuestion((q) => q + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className="default-btn btn"
              data-bs-toggle="modal"
              data-bs-target="#finishTestModal"
              onClick={() => setSubmitMode("finish")}
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
                    submitAssessment(false);
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
