import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
function EmployerDashboard() {
  const [chartData] = useState({
    series: [44, 55],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Messages", "Replies"], // optional labels
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });
  const [state] = useState({
    series: [
      {
        name: "Funnel Series",
        data: [1380, 1100, 990, 780],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        // dropShadow: {
        //   enabled: true,
        // },
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          barHeight: "85%",
          isFunnel: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        // dropShadow: {
        //   enabled: true,
        // },
      },
      title: {
        text: "Recruitment Funnel",
        align: "center",
      },
      xaxis: {
        categories: [
          "View",
          "Click",
          "Application",
          "Hired",
        ],
      },
      legend: {
        show: false,
      },
    },
  });
  const [lineChartConfig] = useState({
    series: [
      {
        name: "Views",
        data: [3, 5, 10, 15, 13, 20, 25], // sample data
      },
      {
        name: "Applications",
        data: [1, 3, 5, 7, 6, 9, 12], // sample data
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
        zoom: { enabled: false },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      },
      yaxis: {
        min: 0,
        max: 30,
        tickAmount: 5,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
      },
      colors: ["#2563eb", "#60a5fa"], // dark blue and light blue
    },
  });
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
            <div className="employer-dashboard-common-heading">
              <h2>Recruiter Dashboard</h2>
            </div>
            <div className="employer-dashboard-box">
            <Link to="/your-job-posts">
                <div className="employer-dashboard-box-icon-content">
                  <div className="employer-box-icon">
                    <i className="fa-solid fa-briefcase" />
                  </div>
                  <div className="employer-box-content">
                    <h4>Jobs Posted</h4>
                    <h5>25</h5>
                    <p>
                      <i className="fa-solid fa-arrow-up" /> 12% this week
                    </p>
                  </div>
                </div>
             </Link>
            <Link to="/jobs">
                <div className="employer-dashboard-box-icon-content">
                  <div className="employer-box-icon">
                    <i className="fa-solid fa-file" />
                  </div>
                  <div className="employer-box-content">
                    <h4>Total Applicants</h4>
                    <h5>932</h5>
                    <p>
                      <i className="fa-solid fa-arrow-up" /> 5% this week
                    </p>
                  </div>
                </div>
             </Link>
              <a
                className="box-size"
                href="employer-manage-job-application.html"
              >
                <div className="employer-dashboard-box-icon-content">
                  <div className="employer-box-icon">
                    <i className="fa-solid fa-envelope" />
                  </div>
                  <div className="employer-box-content">
                    <h4>Interview Invitations Sent</h4>
                    <h5>1000</h5>
                    <p>
                      <i className="fa-solid fa-arrow-up" /> 15% this week
                    </p>
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
                    <p>
                      <i className="fa-solid fa-arrow-up" /> 12% this week
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </section>
          {/* employer dashboard end here */}
          {/* Job performance analyticssection start here */}
          <section className="job-performance-analytics-info">
            <div className="employer-dashboard-common-heading">
              <h2>Job performance analytics</h2>
            </div>
            <div className="performance-line-chart-funnel">
              <div className="chart-box">
                <div>
                  <strong>Job Views vs. Applications</strong>
                </div>
                <ReactApexChart
                  options={lineChartConfig.options}
                  series={lineChartConfig.series}
                  type="line"
                  height={300}
                />
              </div>
              {/* Funnel Chart */}
              <div className="chart-box funnel-container">
                <div className="funnel-title">
                  Views → Clicks →{" "}
                  <span style={{ "font-weight": "normal", color: "#555" }}>
                    Applications → Hires
                  </span>
                </div>
                <ReactApexChart
                  options={state.options}
                  series={state.series}
                  type="bar"
                  height={350}
                />
              </div>
            </div>
          </section>
          {/* Job performance analytics section end here */}
          {/* response rate analytics section start here */}
          <section className="response-rates-info-area">
            <div className="employer-dashboard-common-heading">
              <h2>Job OverView</h2>
            </div>
            <div className="dashboard">
              {/* Left Panel */}
              <div className="left">
                <div className="filters">
                  <select id="locationFilter" onchange="filterJobs()">
                    <option value="All">All Locations</option>
                    <option value="New York">New York</option>
                    <option value="Ohbari">Ohbari</option>
                    <option value="Linkedin">Linkedin</option>
                  </select>
                  <select id="typeFilter" onchange="filterJobs()">
                    <option value="All">All Types</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Once">Once</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
                <table className="table table-bordered" id="jobsTable">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Location / Type</th>
                      <th>Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr data-location="New York" data-type="Onsite">
                      <td>Software Engineer</td>
                      <td>New York / Onsite</td>
                      <td>300</td>
                    </tr>
                    <tr data-location="New York" data-type="Once">
                      <td>Product Manager</td>
                      <td>New York / Once</td>
                      <td>280</td>
                    </tr>
                    <tr data-location="Ohbari" data-type="Hybrid">
                      <td>Sales Representative</td>
                      <td>Ohbari / Hybrid</td>
                      <td>230</td>
                    </tr>
                    <tr data-location="Linkedin" data-type="Referral">
                      <td>Marketing Specialist</td>
                      <td>Linkedin / Referral</td>
                      <td>160</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Right Panel */}
              <div className="right">
                <h5>Candidate Engagement Ini sights</h5>
                <ReactApexChart
                  options={chartData.options}
                  series={chartData.series}
                  width={350} // 👈 set width
                  height={350} // 👈 set height
                  type="donut"
                />
                <div className="stat">
                  Avg. Application Completion Time: <strong>2.5 min</strong>
                </div>
              </div>
            </div>
          </section>
          {/* response rate analytics section start here */}
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
