// import axios from "../Services/axios";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

function AssessmentDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const assessmentId = state?.assessmentId ?? null;
  const isEditMode = !!assessmentId;
  const [assessmentData, setAssessmentData] = useState(null);

  const [loading, setLoading] = useState(false);

  const fetchQuestionById = async (id) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}getSkillAssessmentFullDetails/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res?.data?.success) {
        setAssessmentData(res.data);

        console.log("Question Data:", res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load question details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode && assessmentId) {
      fetchQuestionById(assessmentId);
    }
  }, [isEditMode, assessmentId]);
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Assessment Details</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <Link to="/manage-assessment">
                  <i className="fa-solid fa-angle-right" />
                  Manage Assessments
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" />
                Details
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area">
            <div className="skill-assessment-detail-main-area">
              <div className="skill-assessment-detail-main">
                <h5>
                  Skill Assessment Name:{" "}
                  <span>
                    {assessmentData?.assessmentDetails?.assessmentName}
                  </span>
                </h5>
              </div>
              <div className="skill-assessment-detail-main">
                <h5>
                  Skill Assessment Category:{" "}
                  <span>
                    {assessmentData?.assessmentDetails?.skillAssessmentCategory.join(
                      ", ",
                    )}
                  </span>
                </h5>
              </div>
              <div className="skill-assessment-detail-main">
                <h5>
                  Question Level:{" "}
                  <span>
                    {assessmentData?.assessmentDetails?.questionLevel}
                  </span>
                </h5>
              </div>
              {assessmentData?.questions.map((q, index) => (
                <div className="skill-assessment-detail-main">
                  <div key={q.questionId}>
                    <div className="skill-assessment-manually-add-question">
                      <h5>
                        <span>Q{index + 1}.</span> {q.question}
                      </h5>

                      <ul>
                        {q.options.map((opt) => (
                          <li key={opt._id}>
                            Option {opt.key}: <span>{opt.text}</span>
                          </li>
                        ))}
                      </ul>

                      <h4>
                        <span>Correct Answer: </span>
                        {q.correctAnswers.map((ans, i) => {
                          const opt = q.options.find((o) => o.key === ans);
                          return (
                            <>
                              Option {ans}: {opt?.text}
                            </>
                          );
                        })}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
              <div className="skill-assessment-detail-main">
                <div className="category-name-no-questions">
                  <div className="category-name-area">
                    <h5>Category Name</h5>
                    {assessmentData?.categoryQuestionCount.map((item) => (
                      <h4 key={item.categoryName}>{item.categoryName}</h4>
                    ))}
                  </div>

                  <div className="number-questions-per-category">
                    <h5>No. of Questions</h5>
                    {assessmentData?.categoryQuestionCount.map((item) => (
                      <h5 key={item.categoryName}>{item.numberOfQuestions}</h5>
                    ))}
                  </div>
                </div>
              </div>

              <div className="skill-assessment-detail-main">
                <div className="total-Duration-Questions-passing-percentage">
                  <div className="total-dqpp-main-area">
                    <h5>
                      Total Duration:{" "}
                      <span>
                        {assessmentData?.assessmentDetails?.totalDuration} mins
                      </span>
                    </h5>
                  </div>

                  <div className="total-dqpp-main-area">
                    <h5>
                      Total Questions:{" "}
                      <span>
                        {assessmentData?.assessmentDetails?.totalQuestions}
                      </span>
                    </h5>
                  </div>

                  <div className="total-dqpp-main-area">
                    <h5>
                      Passing Percentage:{" "}
                      <span>
                        {assessmentData?.assessmentDetails?.passingPercentage}%
                      </span>
                    </h5>
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

export default AssessmentDetails;
