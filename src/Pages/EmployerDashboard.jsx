import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { getRequestConfig } from "../utils/apiHeaders";
import { useState, useEffect } from "react";
import { useDebounce, SEARCH_DEBOUNCE_MS } from "../hooks/useDebounce";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import {
  buildDashboardReportSections,
  exportDashboardCsv,
  exportDashboardExcel,
  exportDashboardPdf,
} from "../utils/dashboardReportExport";
import { resolveMediaUrl } from "../utils/companyLogo";

function EmployerDashboard() {
  const { t, i18n } = useTranslation("global");
  const [activity, setActivity] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all"); // 'all', 'today', 'monthly', 'custom'
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [stats, setStats] = useState(null);
  const [profileData, setProfileData] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const userRole = localStorage.getItem("user_role");
  const fName = localStorage.getItem("first_name");
  const lName = localStorage.getItem("last_name");
  const recruiterDepartment = (() => {
    const stored = localStorage.getItem("department");
    if (stored) return stored;
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.department || "";
    } catch {
      return "";
    }
  })();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const [createdAt, setCreatedAt] = useState(-1);

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Messages", "Replies"],
      legend: {
        position: "bottom",
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%", // 🔽 smaller donut (default ~65%)
          },
        },
      },
      responsive: [
        {
          breakpoint: 300,
          options: {
            chart: {
              height: 180,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
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

  const companyData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const companyId = user?.companyId;

      if (!companyId) {
        toast.error(t("header.Company_ID_not_found"));
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}GetCompanyById/${companyId}`,
        getRequestConfig(),
      );
      console.log(response.data.company);
      setProfileData(response.data.company);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    companyData();
  }, []);

  const PUBLIC_PREFIX = (process.env.PUBLIC_URL || "/jobPortal").replace(/\/$/, "");
  const DEFAULT_COMPANY_LOGO = `${PUBLIC_PREFIX}/assets/images/dashboard/images1.png`;

  const getImageUrl = (url) => {
    if (!url || url === "null" || url === "undefined" || url === "assets/images/userIcon.png") {
      return DEFAULT_COMPANY_LOGO;
    }
    return resolveMediaUrl(url) || DEFAULT_COMPANY_LOGO;
  };

  const updateLineChart = (performance) => {
    setLineChartConfig((prev) => ({
      ...prev,
      series: [
        {
          name: "Views",
          data: performance?.views || [],
        },
        {
          name: "Applications",
          data: performance?.applications || [],
        },
      ],
      options: {
        ...prev.options,
        xaxis: {
          categories: performance?.labels || [],
        },
      },
    }));
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const params = { filter };

        if (filter === "custom") {
          params.startDate = startDate.toISOString().split("T")[0];
          params.endDate = endDate.toISOString().split("T")[0];
        }
        if (filter === "custom" && (!startDate || !endDate)) return;

        const response = await axios.get(
          `${API_BASE_URL}recruiter/dashboardStats`,
          getRequestConfig({ params }),
        );
        // console.log("Dashboard Stats:", response.data);
        setStats(response.data);
        updateLineChart(response.data?.performance);
      } catch (err) {
        console.error("Error Fetching Dashboard Stats:", err);
      }
    };
    fetchStats();
  }, [filter, startDate, endDate]);

  const ZERO_COLOR = "#b2bacf"; // light gray
  const NORMAL_COLORS = ["#3b82f6", "#34d399"]; // Messages, Replies

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}getCandidateEngagementInsights`,
          getRequestConfig(),
        );

        const { uniqueMessageSentPercentage = 0, uniqueReplyPercentage = 0 } =
          response?.data?.data?.uniqueEngagement || {};

        const isZeroState =
          uniqueMessageSentPercentage === 0 && uniqueReplyPercentage === 0;

        setChartData((prev) => ({
          ...prev,
          series: isZeroState
            ? [100] // full circle
            : [uniqueMessageSentPercentage, uniqueReplyPercentage],

          options: {
            ...prev.options,
            labels: isZeroState ? ["No Engagement"] : ["Messages", "Replies"],

            colors: isZeroState ? [ZERO_COLOR] : NORMAL_COLORS,

            dataLabels: {
              enabled: !isZeroState,
              formatter: (val) => `${val}%`,
            },

            tooltip: {
              enabled: !isZeroState,
              formatter: (val) => `${val}%`,
            },

            plotOptions: {
              pie: {
                donut: {
                  size: "65%",
                  labels: {
                    show: true,
                    total: {
                      // show: isZeroState,
                      // label: "No Engagement",
                      formatter: () => "0%",
                    },
                  },
                },
              },
            },
          },
        }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchInsight();
  }, []);

  useEffect(() => {
    const fetchJobList = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}getCompanyJobOverview`,
          getRequestConfig({
            params: {
              page,
              limit,
              search: debouncedSearch,
              createdAt,
            },
          }),
        );
        console.log("Job Overview Data:-", response.data.data);
        setActivity(response.data.data);
        setTotalPages(response?.data?.pagination?.totalPages || 1);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJobList();
  }, [page, limit, debouncedSearch, createdAt]);

  const fetchJobsForExport = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}getCompanyJobOverview`,
        getRequestConfig({
          params: {
            page: 1,
            limit: 1000,
            search: debouncedSearch,
            createdAt,
          },
        }),
      );
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching jobs for export:", error);
      return activity;
    }
  };

  const handleExportReport = async (format) => {
    if (!stats) {
      toast.error(t("header.export_no_data"));
      return;
    }

    setIsExporting(true);
    try {
      const jobs = await fetchJobsForExport();
      const report = buildDashboardReportSections({
        stats,
        jobs,
        companyName: profileData?.brandName || "",
        filter,
        startDate,
        endDate,
      });

      if (format === "csv") exportDashboardCsv(report);
      else if (format === "excel") exportDashboardExcel(report);
      else if (format === "pdf") exportDashboardPdf(report);

      toast.success(t("header.export_success"));
    } catch (error) {
      console.error("Dashboard export failed:", error);
      toast.error(t("header.export_failed"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1> {t("header.dashboard")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")} </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  {" "}
                  <i className="fa-solid fa-angle-right" />{" "}
                  {t("header.dashboard")}
                </Link>
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* employer dashboard  start here */}
          <section className="employer-dashboard-info-area">
            <div className="dashboard-header">
              <div className="company-branding">
                <div className="company-logo">
                  <img
                    alt="Company Logo"
                    src={getImageUrl(profileData?.logo)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_COMPANY_LOGO;
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="company-info">
                  <h2>{profileData?.brandName}</h2>
                  <span>{userRole} Dashboard</span>
                </div>
              </div>
              {localStorage.getItem("user_role") === "Recruiter" && (
                <div className="user-welcome">
                  <h3>
                    {t("header.Hello")}, {fName} {lName}
                  </h3>
                  <p>{userRole}</p>
                  {recruiterDepartment && (
                    <p className="recruiter-department-text">{recruiterDepartment}</p>
                  )}
                </div>
              )}
            </div>
            <div className="d-flex align-items-center justify-content-end mb-4 gap-2 flex-wrap">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn btn-outline-primary ${filter === "today" ? "active" : ""}`}
                  onClick={() => setFilter("today")}
                >
                  {t("header.Today")}
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-primary ${filter === "week" ? "active" : ""}`}
                  onClick={() => setFilter("week")}
                >
                  {t("header.Week")}
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-primary ${filter === "month" ? "active" : ""}`}
                  onClick={() => setFilter("month")}
                >
                  {t("header.Month")}
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-primary ${filter === "custom" ? "active" : ""}`}
                  onClick={() => setFilter("custom")}
                >
                  {t("header.Custom_Date")}
                </button>
              </div>
              {filter === "custom" && (
                <div className="d-flex gap-2">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText={t("header.Start_Date")}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                  />

                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText={t("header.End_Date")}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                  />
                </div>
              )}
              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-primary dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  disabled={isExporting || !stats}
                >
                  <i className="fa-solid fa-download me-1" />
                  {isExporting
                    ? t("header.exporting")
                    : t("header.export_report")}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => handleExportReport("pdf")}
                      disabled={isExporting}
                    >
                      {t("header.export_pdf")}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => handleExportReport("excel")}
                      disabled={isExporting}
                    >
                      {t("header.export_excel")}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => handleExportReport("csv")}
                      disabled={isExporting}
                    >
                      {t("header.export_csv")}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-lg-4">
                <div className="employer-dashboard-common-heading mb-3">
                  <h2>{t("header.Overview")}</h2>
                </div>
                <div className="d-flex flex-column" style={{ gap: "10px" }}>
                  <Link className="text-decoration-none" to="/your-job-posts">
                    <div className="summary-card-compact">
                      <div className="employer-box-icon">
                        <i className="fa-solid fa-briefcase" />
                      </div>
                      <div className="content-wrapper">
                        <div className="main-info">
                          <h5>{stats?.overview?.totalJobs || 0}</h5>
                          <span>{t("header.All_Jobs")}</span>
                        </div>
                        <div className="trend-info">
                          <i className="fa-solid fa-arrow-up" />
                          {stats?.overview?.jobsPercentage || 0}%
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    className="text-decoration-none"
                    to="/all-applicants-list"
                    state={{ showAllJobs: true }}
                  >
                    <div className="summary-card-compact green-theme">
                      <div className="employer-box-icon">
                        <i className="fa-regular fa-user" />
                      </div>
                      <div className="content-wrapper">
                        <div className="main-info">
                          <h5>{stats?.overview?.totalApplicants || 0}</h5>
                          <span>Applicants</span>
                        </div>
                        <div className="trend-info">
                          <i className="fa-solid fa-arrow-up" />
                          {stats?.overview?.applicantsPercentage || 0}%
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="ats-flow-section h-100">
                  <div className="employer-dashboard-common-heading mb-3">
                    <h2>{t("header.ATS_Flow_Stats")}</h2>
                  </div>
                  <div className="ats-card-grid">
                    <div className="ats-card ats-new">
                      <div className="ats-card-icon">
                        <i className="fa-solid fa-plus" />
                      </div>
                      <div className="ats-card-content">
                        <h5>{stats?.atsFlow?.New || 0}</h5>
                        <span>{t("header.New")}</span>
                      </div>
                    </div>
                    <div className="ats-card ats-pre">
                      <div className="ats-card-icon">
                        <i className="fa-solid fa-filter" />
                      </div>
                      <div className="ats-card-content">
                        <h5>{stats?.atsFlow?.Preselected || 0}</h5>
                        <span>{t("header.Pre_selected")}</span>
                      </div>
                    </div>
                    <div className="ats-card ats-con">
                      <div className="ats-card-icon">
                        <i className="fa-solid fa-phone" />
                      </div>
                      <div className="ats-card-content">
                        <h5>{stats?.atsFlow?.Contacted || 0}</h5>
                        <span>{t("header.Contacted")}</span>
                      </div>
                    </div>
                    <div className="ats-card ats-hr">
                      <div className="ats-card-icon">
                        <i className="fa-solid fa-user-tie" />
                      </div>
                      <div className="ats-card-content">
                        <h5>{stats?.atsFlow?.HRInterview || 0}</h5>
                        <span>{t("header.HR_Interview")}</span>
                      </div>
                    </div>
                    <div className="ats-card ats-tech">
                      <div className="ats-card-icon">
                        <i className="fa-solid fa-laptop-code" />
                      </div>
                      <div className="ats-card-content">
                        <h5>{stats?.atsFlow?.TechInterview || 0}</h5>
                        <span>{t("header.Tech_Interview")}</span>
                      </div>
                    </div>
                    <div className="ats-card ats-off">
                      <div className="ats-card-icon">
                        <i className="fa-solid fa-file-contract" />
                      </div>
                      <div className="ats-card-content">
                        <h5>{stats?.atsFlow?.Offered || 0}</h5>
                        <span>{t("header.Offer")}</span>
                      </div>
                    </div>
                    <div className="ats-card ats-hire">
                      <div className="ats-card-icon">
                        <i className="fa-solid fa-check-double" />
                      </div>
                      <div className="ats-card-content">
                        <h5>{stats?.atsFlow?.Hired || 0}</h5>
                        <span>{t("header.Hired")}</span>
                      </div>
                    </div>
                    <div className="ats-card ats-rej">
                      <div className="ats-card-icon">
                        <i className="fa-solid fa-xmark" />
                      </div>
                      <div className="ats-card-content">
                        <h5>{stats?.atsFlow?.Rejected || 0}</h5>
                        <span>{t("header.Rejected")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* employer dashboard end here */}
          {/* Job performance analyticssection start here */}
          <section className="job-performance-analytics-info">
            <div className="employer-dashboard-common-heading">
              <h2>{t("header.Job_performance_analytics")}</h2>
            </div>
            <div className="performance-line-chart-funnel">
              <div className="chart-box">
                <div>
                  <strong>{t("header.Job_Views_vs_Applications")}</strong>
                </div>
                <ReactApexChart
                  options={lineChartConfig.options}
                  series={lineChartConfig.series}
                  type="line"
                  height={300}
                />
              </div>
              <div className="chart-box funnel-container">
                <div
                  className="employer-dashboard-common-heading"
                  style={{ "margin-bottom": "20px" }}
                >
                  <h2 style={{ "font-size": "18px", margin: "0px" }}>
                    {t("header.Recruitment_Pipeline")}
                  </h2>
                </div>
                <div className="recruitment-pipeline">
                  <div className="step-item active">
                    <div className="step-icon-circle">
                      <i className="fa-solid fa-eye" />
                    </div>
                    <span className="step-count">
                      {stats?.funnel?.uniqueViews || 0}
                    </span>
                    <span className="step-label">{t("header.Views")}</span>
                  </div>
                  <div className="step-item active">
                    <div className="step-icon-circle">
                      <i className="fa-solid fa-mouse-pointer" />
                    </div>
                    <span className="step-count">
                      {stats?.funnel?.uniqueClicks || 0}
                    </span>
                    <span className="step-label">{t("header.Clicks")}</span>
                  </div>
                  <div className="step-item active">
                    <div className="step-icon-circle">
                      <i className="fa-solid fa-file-alt" />
                    </div>
                    <span className="step-count">
                      {stats?.funnel?.applied || 0}
                    </span>
                    <span className="step-label">{t("header.Applied")}</span>
                  </div>
                  <div className="step-item active">
                    <div className="step-icon-circle">
                      <i className="fa-solid fa-check" />
                    </div>
                    <span className="step-count">
                      {stats?.funnel?.hired || 0}
                    </span>
                    <span className="step-label">{t("header.Hired")}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Job performance analytics section end here */}
          {/* response rate analytics section start here */}
          <section className="response-rates-info-area">
            <div className="employer-dashboard-common-heading">
              <h2>{t("header.Job_OverView")}</h2>
            </div>
            <div className="dashboard">
              <div className="left dashboard-bottom">
                <div className="top-space-search-reslute">
                  <div className="tab-content px-2 md:!px-4">
                    <div className="parentProduceSearch">
                      <div className="entries">
                        <div className="d-flex align-items-center">
                          <select
                            className="form-select form-select-sm"
                            style={{ width: "150px" }}
                            value={createdAt}
                            onChange={(e) => {
                              setCreatedAt(Number(e.target.value));
                              setPage(1);
                            }}
                          >
                            <option value={-1}>
                              {" "}
                              {t("header.Plus_récent")}
                            </option>
                            <option value={1}>
                              {" "}
                              {t("header.Plus_ancien")}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="table-search-box-info">
                        <input
                          placeholder={t("header.search")}
                          type="search"
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                          }}
                        />
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>{t("header.S_No")}</th>
                            <th>{t("header.jobTitle")}</th>
                            <th>{t("header.location")}</th>
                            <th>{t("header.Employment_Type")}</th>
                            <th>{t("header.Views")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activity.map((jobData, index) => (
                            <tr key={jobData._id || index}>
                              <td>{(page - 1) * limit + index + 1}</td>
                              <td>{jobData.jobTitle}</td>
                              <td>
                                {jobData.location && jobData.location !== "N/A"
                                  ? jobData.location
                                  : jobData.companyDetails?.city ||
                                    "Not provided"}
                              </td>

                              <td>{jobData.employmentType}</td>
                              <td>{jobData.uniqueViews}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-sm btn-primary mx-1"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    {t("header.Prev")}
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm mx-1 ${page === index + 1 ? "btn-primary" : "btn-outline-primary"}`}
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
                    {t("header.Next")}
                  </button>
                </div>
              </div>
              <div className="right dashboard-bottom">
                <h5>{t("header.Candidate_Engagement_Insights")}</h5>
                <ReactApexChart
                  options={chartData.options}
                  series={chartData.series}
                  width={300}
                  height={350}
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
                    <span className="template-name">
                      {t("header.Connect_Work")}{" "}
                    </span>
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

export default EmployerDashboard;
