import { Link } from "react-router-dom";
import axios from "axios";

import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { TbMessages } from "react-icons/tb";
import moment from "moment";

function AppliedJobList() {
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

  const getImageUrl = (url) => {
    if (!url) return "assets/images/icon/icon-26.png";

    // full external url
    if (url.startsWith("http")) return url;

    // local assets
    if (url.startsWith("assets/")) return url;

    // backend upload
    return `${API_IMAGE_URL}${url}`;
  };
  const JobListLoader = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p>Loading Application jobs, please wait...</p>
    </div>
  );

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Application Management</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard{" "}
                </Link>
              </li>
              <li className="item">
                <Link to="/applied-jobs-list">
                  <i className="fa-solid fa-angle-right" /> Application
                  Management
                </Link>
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Applied jobs list start here */}
          <section className="applied-jobs-list-info">
            <div className="application-management-filter-info">
              <h5>Job Applications</h5>
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
                        placeholder="Search By: Keywords, Job Title"
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
                    Find
                  </button>
                </div>

                {/* Show Dropdown */}
                <div className="ms-3 d-flex align-items-center">
                  <span className="me-2 fw-semibold text-secondary text-nowrap">
                    Show:
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
              <p className="text-center mt-3">No jobs found.</p>
            ) : (
              <div className="table-responsive ">
                <table className="table align-middle table-hover">
                  <thead>
                    <tr className="custom-header-row">
                      <th>Job Title</th>
                      <th>Recruiters</th>
                      <th>Status</th>
                      <th>Published Date</th>
                      <th>Expired</th>
                      <th>Views</th>
                      <th>Applicants</th>
                      <th>Location</th>
                      <th>Action</th>
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
                              {/* #{job?.jobId || job?._id} */}
                              #JOB-OB_1
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
                              {`${job?.recruiter?.firstName || ""} ${job?.recruiter?.lastName || ""}`}
                            </small>
                          </div>
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className="badge px-3 py-2 text-capitalize"
                            style={{
                              backgroundColor:
                                job?.status?.toLowerCase() === "published"
                                  ? "#2a8855"
                                  : job?.status?.toLowerCase() === "expired"
                                    ? "#dc3545"
                                    : "#6c757d",
                              borderRadius: "20px",
                              fontSize: "12px",
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
                        <td>{job?.views || 0}</td>

                        {/* Applicants */}
                        <td>
                          <Link
                            to="/applied-candidate-list"
                            state={{ jobId: job._id }}
                            style={{ color: "#0d6efd", fontWeight: "500" }}
                          >
                            {job?.applicantCount || 0} Applicants
                          </Link>
                        </td>

                        {/* Location */}
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="fa-solid fa-location-dot text-danger me-2"></i>
                            <small className="text-muted">
                              {job?.city && job.city.length > 0
                                ? job.city.join(", ")
                                : job?.company_city || "N/A"}
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
                                  to={`/job-details/${job._id}`}
                                >
                                  <i className="fa-regular fa-eye me-2"></i>
                                  View Details
                                </Link>
                              </li>

                              <li>
                                <Link
                                  className="dropdown-item"
                                  to={`/job-details-form/${job._id}`}
                                >
                                  <i className="fa-regular fa-pen-to-square me-2"></i>
                                  Edit Job
                                </Link>
                              </li>

                              <li>
                                <hr className="dropdown-divider" />
                              </li>

                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => console.log("Delete job")}
                                >
                                  <i className="fa-regular fa-trash-can me-2"></i>
                                  Delete
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

export default AppliedJobList;
