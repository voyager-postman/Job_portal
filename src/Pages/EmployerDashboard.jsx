import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import { TableView } from "../Conponets/DataTable";

function EmployerDashboard() {
  const [stats, setStats] = useState("");
  const [activity, setActivity] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Messages", "Replies"],
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

  const [funnelState, setFunnelState] = useState({
    series: [
      {
        name: "Funnel Series",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
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
          return `${opt.w.globals.labels[opt.dataPointIndex]}: ${val}`;
        },
      },
      title: {
        text: "Recruitment Funnel",
        align: "center",
      },
      xaxis: {
        categories: ["View", "Click", "Application", "Hired"],
      },
      legend: {
        show: false,
      },
    },
  });

  const [lineChartConfig, setLineChartConfig] = useState({
    series: [
      {
        name: "Views",
        data: [],
      },
      {
        name: "Applications",
        data: [],
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
        categories: [],
      },
      yaxis: {
        min: 0,
        tickAmount: 5,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
      },
      colors: ["#2563eb", "#60a5fa"],
    },
  });

  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
      accessorKey: "jobTitle",
      header: "Job Title",
      accessorFn: (row) => (row.jobTitle || "").toLowerCase(),
      cell: ({ row }) => row.original.jobTitle || "Not Provided",
    },
    {
      accessorKey: "location",
      header: "Location",
      accessorFn: (row) => (row.location || "").toLowerCase(),
      cell: ({ row }) => row.original.location || "Not Provided",
    },
    {
      accessorKey: "employmentType",
      header: "Employment Type",
      accessorFn: (row) => (row.employmentType || "").toLowerCase(),
      cell: ({ row }) => row.original.employmentType || "Not Provided",
    },
    {
      accessorKey: "uniqueViews",
      header: "Views",
      accessorFn: (row) => (row.uniqueViews || "").toLowerCase(),
      cell: ({ row }) => String(row.original.uniqueViews) || "Not Provided",
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}recruiter/dashboardStats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Dashboard Stats:", response.data);
        setStats(response.data.stats);
      } catch (err) {
        console.error("Error Fetching Dashboard Stats:", err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchJobPerformance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}getJobPerformanceData`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { labels, views, applications } = response.data;

        setLineChartConfig((prev) => ({
          ...prev,
          series: [
            { name: "Views", data: views },
            { name: "Applications", data: applications },
          ],
          options: {
            ...prev.options,
            xaxis: {
              categories: labels,
            },
          },
        }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchJobPerformance();
  }, []);

  useEffect(() => {
    const fetchFunnelData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}getJobFunnelData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);

        const { totalViews, totalClicks, totalApplications, totalHires } =
          response.data;
        const normalize = (value) => (value === 0 ? 0 : value);

        const originalValues = [
          totalViews,
          totalClicks,
          totalApplications,
          totalHires,
        ];
        const funnelValues = originalValues.map(normalize);

        setFunnelState((prev) => ({
          ...prev,
          series: [
            {
              name: "Funnel Series",
              data: funnelValues,
            },
          ],
          options: {
            ...prev.options,
            dataLabels: {
              enabled: true,
              formatter: function (val, opt) {
                return `${opt.w.globals.labels[opt.dataPointIndex]}: ${
                  originalValues[opt.dataPointIndex]
                }`;
              },
            },
          },
        }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchFunnelData();
  }, []);

  useEffect(() => {
    const fetchInslight = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}getCandidateEngagementInsights`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { uniqueMessageSentPercentage, uniqueReplyPercentage } =
          response?.data?.data?.uniqueEngagement;

        setChartData((prev) => ({
          ...prev,
          series: [uniqueMessageSentPercentage, uniqueReplyPercentage],
        }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchInslight();
  }, []);

  useEffect(() => {
    const fetchJobList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}getCompanyJobOverview?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response);
        setActivity(response.data.data);
        setTotalPages(response?.data?.pagination?.totalPages || 1);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJobList();
  }, [page, limit]);

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Dashboard</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  {" "}
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
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
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Link to="/your-job-posts">
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fa-solid fa-briefcase" />
                      </div>
                      <div className="employer-box-content">
                        <h4>All Jobs</h4>
                        <h5>{stats.totalJobs || 0}</h5>
                        <p>
                          <i className="fa-solid fa-arrow-up" />{" "}
                          {stats?.weekly?.jobsPosted?.percent || 0}% this week
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/candidates-search">
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fa-solid fa-file" />
                      </div>
                      <div className="employer-box-content">
                        <h4>Total Applicants</h4>
                        <h5>{stats.totalApplicants || 0}</h5>
                        <p>
                          <i className="fa-solid fa-arrow-up" />{" "}
                          {stats?.weekly?.applicants?.percent || 0}% this week
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/jobs">
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fa-solid fa-envelope" />
                      </div>
                      <div className="employer-box-content">
                        <h4>Interview Invitations </h4>
                        <h5>0</h5>
                        <p>
                          <i className="fa-solid fa-arrow-up" /> 0% this week
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/jobs">
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fa-solid fa-bookmark" />
                      </div>
                      <div className="employer-box-content">
                        <h4>Shortlist</h4>
                        <h5>{stats.totalShortlisted || 0}</h5>
                        <p>
                          <i className="fa-solid fa-arrow-up" />{" "}
                          {stats?.weekly?.shortlisted?.percent || 0}% this week
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
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
                  Views → Clicks → Applications → Hires
                </div>
                <ReactApexChart
                  options={funnelState.options}
                  series={funnelState.series}
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
              <div className="left dashboard-bottom">
                <TableView
                  columns={columns}
                  data={activity}
                  limit={limit}
                  setLimit={(value) => {
                    setLimit(value);
                    setPage(1);
                  }}
                />
                {/* PAGINATION BUTTONS */}
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-sm btn-primary mx-1"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm mx-1 ${
                        page === index + 1
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    className="btn btn-sm btn-primary mx-1"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
              {/* Right Panel */}
              <div className="right dashboard-bottom">
                <h5>Candidate Engagement Insights</h5>
                <ReactApexChart
                  options={chartData.options}
                  series={chartData.series}
                  width={400}
                  height={400}
                  type="donut"
                />
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
