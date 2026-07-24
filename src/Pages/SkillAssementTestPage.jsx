import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Chart } from "chart.js/auto";

function SkillAssementTestPage() {
  const { t } = useTranslation("global");
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
            label: t("assessment.score_percent"),
            data: [85, 92, 78],
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
              text: t("assessment.score_percent"),
            },
          },
          x: {
            title: {
              display: true,
              text: t("assessment.skills"),
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
  }, [t]);

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          <div className="breadcrumb-area">
            <h1>{t("assessment.title")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")} </Link>
              </li>
              <li className="item">
                <Link to="/candidate-dashboard" style={{ marginLeft: 6 }}>
                  <i className="fa-solid fa-angle-right" /> {t("header.dashboard")}
                </Link>{" "}
              </li>
              <li className="item">
                <Link to="/skill-assessments-tests">
                  <i className="fa-solid fa-angle-right" /> {t("assessment.title")}
                </Link>
              </li>
            </ol>
          </div>
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>{t("assessment.title")}</h3>
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
                          <h5>{t("assessment.completed")}</h5>
                        </div>
                        <div className="skill-test-score">
                          <h5>85/100</h5>
                        </div>
                      </div>
                      <div className="skill-test-status-score skill-test-date">
                        <div className="skill-test-status">
                          <h5>{t("assessment.date")}</h5>
                        </div>
                        <div className="skill-test-score">
                          <p>Aug 20, 2025</p>
                        </div>
                      </div>
                      <div className="skill-assessments-test-btn">
                        <Link to="/certificates-scores" className="default-btn btn">
                          {t("assessment.certificate")}
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
                          <h5>{t("assessment.in_progress")}</h5>
                        </div>
                        <div className="skill-test-score">
                          <h5>50%</h5>
                        </div>
                      </div>
                      <div className="skill-test-status-score skill-test-date">
                        <div className="skill-test-status">
                          <h5>{t("assessment.min_remaining", { count: 30 })}</h5>
                        </div>
                      </div>
                      <div className="skill-assessments-test-btn">
                        <a href="#" className="default-btn btn">
                          {t("header.View_Details")}
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
                        <h5>{t("assessment.not_started")}</h5>
                      </div>
                      <div className="skill-assessments-test-btn">
                        <a href="#" className="default-btn btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                          {t("assessment.take_test")}
                        </a>
                      </div>
                    </div>

                    <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label={t("header.Close")} />
                          </div>
                          <div className="modal-body">
                            <div className="skill-assessment-questions-info">
                              <div className="skill-assessment-questions-ans active">
                                <h5>{questions[currentIndex].q}</h5>
                                {questions[currentIndex].options.map((opt, i) => (
                                  <label key={i} style={{ display: "block" }}>
                                    <input type="radio" name={`q${currentIndex}`} /> {opt}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="skill-assessment-questions-nextBtn">
                            {currentIndex < questions.length - 1 ? (
                              <span className="default-btn btn" onClick={handleNext}>
                                {t("assessment.next")}
                              </span>
                            ) : (
                              <span className="default-btn btn" data-bs-dismiss="modal">
                                {t("assessment.finish")}
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
                        <h6>{t("assessment.score_overview")}</h6>
                        <canvas id="techSkillsChart" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <div className="skill-assessments-tests-card">
                      <div className="skill-result-heading-number">
                        <div className="skill-result-heading">
                          <h5>{t("assessment.assessments_name")}</h5>
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
                          <h5>{t("assessment.total_assessments")}</h5>
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
                          <h5>{t("assessment.total_test_score")}</h5>
                        </div>
                      </div>
                      <div className="skill-name-pecentage-info">
                        <div className="skill-test-status-score">
                          <div className="skill-test-status"><h5>SQL</h5></div>
                          <div className="skill-test-score"><h5>35/100</h5></div>
                        </div>
                        <div className="skill-test-status-score">
                          <div className="skill-test-status"><h5>Java</h5></div>
                          <div className="skill-test-score"><h5>33/100</h5></div>
                        </div>
                        <div className="skill-test-status-score">
                          <div className="skill-test-status"><h5>Python</h5></div>
                          <div className="skill-test-score"><h5>45/100</h5></div>
                        </div>
                      </div>
                      <div className="skill-test-text-number total-assessments-score">
                        <div className="skill-test-text-info">
                          <h5>{t("assessment.total_average_score")}</h5>
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
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name"> {t("header.Connect_Work")} </span>
                    {t("header.All_Rights_Reserved")}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    {t("header.Designed_By")}{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      {t("header.Webnmobapps_Solution_Pvt_Ltd")}
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
