import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Chart } from "chart.js/auto";
function SkillAssementTestPage() {
  const questions = [
    {
      q: "1. What does SQL stand for?",
      options: ["Class", "Array", "List", "Type"],
    },
    {
      q: "2. Which SQL command is used to remove a record?",
      options: ["Array", "Class", "Array", "List"],
    },
    {
      q: "3. What is a primary key?",
      options: ["List", "Class", "Array", "List"],
    },
    {
      q: "4. Which clause is used to sort results?",
      options: ["Type", "Class", "Array", "List"],
    },
    {
      q: "5. Which SQL command is used to remove a record?",
      options: ["SQL command", "Array", "List", "Type"],
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  useEffect(() => {
    const ctx = document.getElementById("techSkillsChart");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Java", "Python", "SQL"],
        datasets: [
          {
            label: "Score (%)",
            data: [85, 92, 78], // ✅ Match number of labels
            backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
            borderRadius: 8,
            barThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 20,
            max: 100,
            ticks: {
              stepSize: 20,
              callback: (value) => value + "%",
            },
            title: {
              display: true,
              text: "Score (%)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Skills",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: ${context.parsed.y}%`,
            },
          },
        },
      },
    });
  }, []);
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Skill Assessments &amp; Tests</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/candidate-dashboard" style={{ marginLeft: 6 }}>
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>{" "}
              </li>
              <li className="item">
                <Link to="/skill-assessments-tests">
                  <i className="fa-solid fa-angle-right" /> Skill Assessments
                  &amp; Tests
                </Link>
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Skill Assessments & Tests Start Area*/}
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>Skill Assessments &amp; Tests</h3>
              <div className="profile-form">
                <div className="row">
                  <div className="col-lg-4 col-md-4">
                    <div className="skill-assessments-tests-card">
                      <div className="skill-test-logo-name-info">
                        <div className="skill-test-logo">
                          <i className="fa-brands fa-java" />
                        </div>
                        <div className="skill-test-name">
                          <h5>Java</h5>
                        </div>
                      </div>
                      <div className="skill-test-status-score">
                        <div className="skill-test-status">
                          <h5>Completed</h5>
                        </div>
                        <div className="skill-test-score">
                          <h5>85/100</h5>
                        </div>
                      </div>
                      <div className="skill-test-status-score skill-test-date">
                        <div className="skill-test-status">
                          <h5>Date</h5>
                        </div>
                        <div className="skill-test-score">
                          <p>Aug 20, 2025</p>
                        </div>
                      </div>
                      <div className="skill-assessments-test-btn">
                        <Link
                          to="/certificates-scores"
                          className="default-btn btn"
                        >
                          Certificate
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="skill-assessments-tests-card">
                      <div className="skill-test-logo-name-info">
                        <div className="skill-test-logo">
                          <i className="fa-brands fa-python" />
                        </div>
                        <div className="skill-test-name">
                          <h5>Python</h5>
                        </div>
                      </div>
                      <div className="skill-test-status-score">
                        <div className="skill-test-status">
                          <h5>In Progress</h5>
                        </div>
                        <div className="skill-test-score">
                          <h5>50%</h5>
                        </div>
                      </div>
                      <div className="skill-test-status-score skill-test-date">
                        <div className="skill-test-status">
                          <h5>30 Min remaining</h5>
                        </div>
                        {/* <div class="skill-test-score">
                  <p>Aug 20, 2025</p>
                 </div>  */}
                      </div>
                      <div className="skill-assessments-test-btn">
                        <a href="#" className="default-btn btn">
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="skill-assessments-tests-card">
                      <div className="skill-test-logo-name-info">
                        <div className="skill-test-logo">
                          <i className="fa-solid fa-database" />
                        </div>
                        <div className="skill-test-name">
                          <h5>SQL</h5>
                        </div>
                      </div>
                      <div className="skill-test-not-started">
                        <h5>Not Started</h5>
                      </div>
                      <div className="skill-assessments-test-btn">
                        <a
                          href="#"
                          className="default-btn btn"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          Take Test
                        </a>
                      </div>
                    </div>

                    {/* Modal */}
                    <div
                      className="modal fade"
                      id="exampleModal"
                      tabIndex={-1}
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog" style={{ maxWidth: "50%" }}>
                        <div className="modal-content">
                          <div className="modal-header">
                            <div className="modal-title" id="exampleModalLabel">
                              <div className="test-logo-name-info">
                                <div className="test-logo">
                                  <i className="fa-solid fa-database" />
                                </div>
                                <div className="test-name">
                                  <h5>SQL</h5>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            />
                          </div>

                          <div className="modal-body">
                            <div className="skill-assessment-questions-info">
                              {/* Current Question */}
                              <div className="skill-assessment-questions-ans active">
                                <h5>{questions[currentIndex].q}</h5>
                                {questions[currentIndex].options.map(
                                  (opt, i) => (
                                    <label key={i} style={{ display: "block" }}>
                                      <input
                                        type="radio"
                                        name={`q${currentIndex}`}
                                      />{" "}
                                      {opt}
                                    </label>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="skill-assessment-questions-nextBtn">
                            {currentIndex < questions.length - 1 ? (
                              <span
                                className="default-btn btn"
                                onClick={handleNext}
                              >
                                Next
                              </span>
                            ) : (
                              <span
                                className="default-btn btn"
                                data-bs-dismiss="modal"
                              >
                                Finish
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="column-chart-diagram">
                      <div className="chart-wrapper">
                        <h6>Tech Skill Assessments - Score Overview</h6>
                        <canvas id="techSkillsChart" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="skill-assessments-tests-card">
                      <div className="skill-result-heading-number">
                        <div className="skill-result-heading">
                          <h5>Assessments Name</h5>
                        </div>
                        <div className="skill-result-number">
                          <h5>3</h5>
                        </div>
                      </div>
                      <div className="skill-test-status">
                        <h5>SQL</h5>
                        <h5>Java</h5>
                        <h5>Python</h5>
                      </div>
                      <div className="skill-test-text-number">
                        <div className="skill-test-text-info">
                          <h5>Total Assessments:</h5>
                        </div>
                        <div className="skill-test-total-number">
                          <h5>3</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="skill-assessments-tests-card">
                      <div className="skill-result-heading-number">
                        <div className="skill-result-heading">
                          <h5>Total Test Score</h5>
                        </div>
                        {/*  <div class="skill-result-number">
                  <h5>3</h5>
                 </div> */}
                      </div>
                      <div className="skill-name-pecentage-info">
                        <div className="skill-test-status-score">
                          <div className="skill-test-status">
                            <h5>SQL</h5>
                          </div>
                          <div className="skill-test-score">
                            <h5>35/100</h5>
                          </div>
                        </div>
                        <div className="skill-test-status-score">
                          <div className="skill-test-status">
                            <h5>Java</h5>
                          </div>
                          <div className="skill-test-score">
                            <h5>33/100</h5>
                          </div>
                        </div>
                        <div className="skill-test-status-score">
                          <div className="skill-test-status">
                            <h5>Python</h5>
                          </div>
                          <div className="skill-test-score">
                            <h5>45/100</h5>
                          </div>
                        </div>
                      </div>
                      <div className="skill-test-text-number total-assessments-score">
                        <div className="skill-test-text-info">
                          <h5>Total Average Score:</h5>
                        </div>
                        <div className="skill-test-total-number">
                          <h5>75%</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Skill Assessments & Tests End Area*/}
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

export default SkillAssementTestPage;
