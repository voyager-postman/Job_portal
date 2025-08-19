import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
function EmployerDashboard() {
  const [timeRange, setTimeRange] = useState("Last 6 Months");

  const options = {
    chart: {
      type: "line",
    },
    title: {
      text: "Your Profile Views",
    },
    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yAxis: {
      title: {
        text: "Values",
      },
    },
    series: [
      {
        name: "Series 1",
        data: [30, 70, 110, 130, 150, 180, 130, 140, 220, 190, 100, 50],
      },
    ],
  };
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Dashboard</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="#">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* employer dashboard  start here */}
          <section className="employer-dashboard-info-area">
            <div className="employer-dashboard-box">
              <a href="employer-manage-job-application.html">
                <div className="employer-dashboard-box-icon-content">
                  <div className="employer-box-icon">
                    <i className="fa-solid fa-briefcase" />
                  </div>
                  <div className="employer-box-content">
                    <h4>Posted Jobs</h4>
                    <h5>25</h5>
                  </div>
                </div>
              </a>
              <a href="employer-manage-job-application.html">
                <div className="employer-dashboard-box-icon-content">
                  <div className="employer-box-icon">
                    <i className="fa-solid fa-file" />
                  </div>
                  <div className="employer-box-content">
                    <h4>Application</h4>
                    <h5>932</h5>
                  </div>
                </div>
              </a>
              <a href="employer-manage-job-application.html">
                <div className="employer-dashboard-box-icon-content">
                  <div className="employer-box-icon">
                    <i className="fa-solid fa-message" />
                  </div>
                  <div className="employer-box-content">
                    <h4>Messages</h4>
                    <h5>75</h5>
                  </div>
                </div>
              </a>
              <a href="employer-manage-job-application.html">
                <div className="employer-dashboard-box-icon-content">
                  <div className="employer-box-icon">
                    <i className="fa-solid fa-bookmark" />
                  </div>
                  <div className="employer-box-content">
                    <h4>Shortlist</h4>
                    <h5>40</h5>
                  </div>
                </div>
              </a>
            </div>
          </section>
          {/* employer dashboard end here */}
          {/* your profile view section start here */}
          <section className="your-profile-info-notification-info">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="your-profile-view-chart">
                  <div className="your-profile-heading-select">
                    <span>
                      <h4>Your Profile Views</h4>
                    </span>
                    <span>
                      <select
                        className="form-select form-control"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                      >
                        <option>Last 6 Months</option>
                        <option>Last 12 Months</option>
                        <option>Last 16 Months</option>
                        <option>Last 24 Months</option>
                        <option>Last 5 year</option>
                      </select>
                    </span>
                  </div>

                  <HighchartsReact highcharts={Highcharts} options={options} />
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="recent-notifications-box">
                  <h3>Recent Notifications</h3>
                  <ul>
                    <li>
                      <div className="icon">
                        <i className="flaticon-portfolio" />
                      </div>
                      <span>Tyrone Lowe</span> Applied For A Job{" "}
                      <strong>Software Engineer</strong>
                      <button
                        type="button"
                        className="close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </li>
                    <li>
                      <div className="icon">
                        <i className="flaticon-portfolio" />
                      </div>
                      <span>Kaedyn Fraser</span> Applied For A Job{" "}
                      <strong>Web Developer</strong>
                      <button
                        type="button"
                        className="close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </li>
                    <li>
                      <div className="icon">
                        <i className="flaticon-portfolio" />
                      </div>
                      <span>Harold Adams</span> Applied For A Job{" "}
                      <strong>Technical Architect</strong>
                      <button
                        type="button"
                        className="close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </li>
                    <li>
                      <div className="icon">
                        <i className="flaticon-portfolio" />
                      </div>
                      <span>Joshua Mcnair</span> Applied For A Job{" "}
                      <strong>UI Designer</strong>
                      <button
                        type="button"
                        className="close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </li>
                    <li>
                      <div className="icon">
                        <i className="flaticon-portfolio" />
                      </div>
                      <span>Kathryn Mcgee</span> Applied For A Job{" "}
                      <strong>Senior Product Designer</strong>
                      <button
                        type="button"
                        className="close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </li>
                    <li>
                      <div className="icon">
                        <i className="flaticon-portfolio" />
                      </div>
                      <span>Kaedyn Fraser</span> Applied For A Job{" "}
                      <strong>Product Designer</strong>
                      <button
                        type="button"
                        className="close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </li>
                    <li>
                      <div className="icon">
                        <i className="flaticon-portfolio" />
                      </div>
                      <span>Dianna Smiley</span> Applied For A Job{" "}
                      <strong>Android Developer</strong>
                      <button
                        type="button"
                        className="close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          {/* your profile view section end here */}
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

export default EmployerDashboard;