import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { TbMessages } from "react-icons/tb";
import moment from "moment";
import { useTranslation } from "react-i18next";
function AppliedJobList() {
  const { t, i18n } = useTranslation("global");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // waits 500ms after user stops typing
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchJobs = async (search = "", page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}getCompanyActiveJobs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search,
          page,
          limit: perPage,
        },
      });

      setJobs(res.data.jobs || []);
      setTotalCount(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(debouncedSearch);
  }, [debouncedSearch]);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchJobs(debouncedSearch, currentPage);
  }, [debouncedSearch, currentPage, perPage]);

  const handleDelete = (id) => {
    Swal.fire({
      title: t("header.Are_you_sure"),
      text: "header.You_are_not_be_able_to_revert_this",
      icon: t("header.warning"),
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("header.Yes_delete_it"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error(t("header.You_need_to_log_in_first"));
            return;
          }
          const response = await axios.post(
            `${API_BASE_URL}deleteJob/${id}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (response.data.success) {
            toast.success(response.data.message);
            fetchJobs();
          }
        } catch (error) {
          console.error(error.response.data.message);
        }
      }
    });
  };

  const JobListLoader = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p>{t("header.Loading_Application_jobs_please_wait")}</p>
    </div>
  );

  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>{t("header.Application_Management")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")} </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" />
                  {t("header.dashboard")}{" "}
                </Link>
              </li>
              <li className="item">
                <Link to="/applied-jobs-list">
                  <i className="fa-solid fa-angle-right" />{" "}
                  {t("header.Application_Management")}
                </Link>
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}

          {/*Applied jobs list start here */}
          <section className="applied-jobs-list-info">
            <div className="application-management-filter-info">
              <h5>{t("header.Job_Applications")}</h5>
            </div>
            <div className="applied-jobs-search-box-info">
              <div className="employer-candidate-search-box d-flex flex-wrap align-items-center justify-content-between">
                {/* Search Input */}
                <div className="d-flex align-items-center flex-grow-1">
                  <div className="employer-candidate-input-icon d-flex align-items-center w-100">
                    <div className="employer-candidate-icon me-2">
                      <i className="fa-solid fa-briefcase"></i>
                    </div>

                    <div className="employer-candidate-input-area flex-grow-1">
                      <input
                        className="form-control"
                        type="text"
                        placeholder={t("header.Search_By_Keywords_Job_Title")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // ✅ update search term
                      />
                    </div>
                  </div>
                </div>

                {/* Find Button */}
                <div className="employer-candidate-btn-area">
                  <button
                    className="default-btn btn px-4"
                    onClick={() => fetchJobs(searchTerm)}
                  >
                    {t("header.Find")}
                  </button>
                </div>

                {/* Show Dropdown */}
                <div className="ms-3 d-flex align-items-center">
                  <span className="me-2 fw-semibold text-secondary text-nowrap">
                    {t("header.Show")}
                  </span>

                  <select
                    className="form-select form-select-sm"
                    style={{ width: "90px", cursor: "pointer" }}
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <JobListLoader />
            ) : jobs.length === 0 ? (
              <div className="empty-state-wrapper text-center py-5">
                <div className="empty-icon mb-3">
                  <i
                    className="fa-solid fa-briefcase"
                    style={{
                      fontSize: "50px",
                      color: "#c5c5c5",
                    }}
                  ></i>
                </div>

                <h5 className="fw-semibold mb-2">No Jobs Found</h5>

                <p
                  className="text-muted mb-3"
                  style={{ maxWidth: "400px", margin: "0 auto" }}
                >
                  {t("header.No_job_postings_match")}
                </p>

                <button
                  className="btn btn-outline-primary btn-sm px-4"
                  onClick={() => {
                    setSearchTerm("");
                    setDebouncedSearch("");
                    setCurrentPage(1);
                    fetchJobs("", 1);
                  }}
                >
                  {t("header.Reset_Search")}
                </button>
              </div>
            ) : (
              <div className="table-responsive-table ">
                <table className="table align-middle table-hover">
                  <thead>
                    <tr className="custom-header-row">
                      <th>{t("header.jobTitle")}</th>
                      <th>{t("header.Recruiters")}</th>
                      <th>{t("header.Status")}</th>
                      <th>{t("header.Published_Date")}</th>
                      <th> {t("header.Expired")}</th>
                      <th> {t("header.view")}</th>
                      <th> {t("header.Applicants")}</th>
                      <th> {t("header.location")}</th>
                      <th> {t("header.Action")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job._id}>
                        {/* Job Title */}
                        <td>
                          <div>
                            <div className="fw-bold">{job?.jobTitle}</div>
                            <small className="text-muted">
                              #{job?.jobNumber || "N/A"}
                            </small>
                          </div>
                        </td>

                        {/* Recruiter */}
                        <td>
                          <div>
                            <div
                              className="fw-semibold text-truncate"
                              style={{ maxWidth: "180px" }}
                            >
                              {job?.company?.brandName || "N/A"}
                            </div>

                            <small
                              className="text-muted text-truncate d-block"
                              style={{ maxWidth: "180px" }}
                            >
                              {`${job?.recruiter?.first_name || ""} ${job?.recruiter?.last_name || ""}`}
                            </small>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3">
                          <span
                            className="badge text-capitalize"
                            style={{
                              backgroundColor:
                                job?.status?.toLowerCase() === "published"
                                  ? "#2a8855"
                                  : job?.status?.toLowerCase() === "expired"
                                    ? "#dc3545"
                                    : "#6c757d",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            {job?.status}
                          </span>
                        </td>

                        {/* Published Date */}
                        <td>
                          {" "}
                          <small className="text-muted">
                            {moment(job?.createdAt).format("MM/DD/YYYY")}
                          </small>
                        </td>

                        {/* Expired */}
                        <td>
                          {job?.expiresAt ? (
                            <small className="text-muted">
                              {moment(job?.expiresAt).format("MM/DD/YYYY")}
                            </small>
                          ) : (
                            "N/A"
                          )}
                        </td>

                        {/* Views */}
                        <td className="fw-bold text-dark">
                          {job?.uniqueViewsCount || 0}
                        </td>

                        {/* Applicants */}
                        <td className="py-3">
                          {job?.applicantCount > 0 ? (
                            <Link
                              to="/all-applicants-list"
                              state={{ jobId: job._id }}
                              className="fw-bold text-primary"
                              // style={{ color: "#0d6efd", fontWeight: "500" }}
                            >
                              {job.applicantCount} {t("header.Applicants")}
                            </Link>
                          ) : (
                            <span
                              style={{
                                color: "#6c757d",
                                fontWeight: "500",
                                cursor: "not-allowed",
                              }}
                            >
                              0 {t("header.Applicants")}
                            </span>
                          )}
                        </td>

                        {/* Location */}
                        {/* <td>
                          <div className="d-flex align-items-center">
                            <i className="fa-solid fa-location-dot text-danger me-2"></i>
                            <small className="text-muted">
                              {job?.city && job.city.length > 0
                                ? job.city.join(", ")
                                : job?.company_city || "N/A"}
                            </small>
                          </div>
                        </td> */}
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="fa-solid fa-location-dot text-danger me-2"></i>
                            <small className="text-muted">
                              {Array.isArray(job?.city) && job.city.length > 0
                                ? job.city.join(", ")
                                : job?.company?.city?.trim() || "N/A"}
                            </small>
                          </div>
                        </td>
                        {/* Action */}
                        <td className="pe-4 py-3 text-end">
                          <div className="dropdown">
                            <button
                              className="btn btn-light btn-sm rounded-circle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              <i className="fa-solid fa-ellipsis"></i>
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end border-0 shadow">
                              <li>
                                <Link
                                  className="dropdown-item"
                                  to={`/job/${job.slug}`}
                                  state={{
                                    jobData: job,
                                    from: "/applied-jobs-list",
                                    JobId: job._id,
                                  }}
                                >
                                  <i className="fa-regular fa-eye me-2"></i>
                                  {t("header.View_Details")}
                                </Link>
                              </li>

                              <li>
                                <Link
                                  className="dropdown-item"
                                  to={`/job-details-form/${job._id}`}
                                  state={{
                                    jobData: job,
                                    from: "/applied-jobs-list",
                                  }}
                                >
                                  <i className="fa-regular fa-pen-to-square me-2"></i>
                                  {t("header.Edit_Job")}
                                </Link>
                              </li>

                              <li>
                                <hr className="dropdown-divider" />
                              </li>

                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDelete(job._id)}
                                >
                                  <i className="fa-regular fa-trash-can me-2"></i>
                                  {t("header.Delete")}
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <i className="fa-solid fa-angle-left" />
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <i className="fa-solid fa-angle-right" />
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Applied jobs list end here */}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name">
                      {t("header.Connect_Work")}
                    </span>{" "}
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

export default AppliedJobList;
