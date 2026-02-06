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
              <div className="employer-candidate-search-box">
                <div className="employer-candidate-input-icon">
                  <div className="employer-candidate-icon">
                    <i className="fa-solid fa-briefcase" />
                  </div>
                  <div className="employer-candidate-input-area">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search By: Keywords, Job Title"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} // ✅ update search term
                    />
                  </div>
                </div>
                <div className="employer-candidate-btn-area">
                  <button
                    className="default-btn btn"
                    onClick={() => fetchJobs(searchTerm)} // ✅ Manual search trigger
                  >
                    Find
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <JobListLoader />
            ) : jobs.length === 0 ? (
              <p className="text-center mt-3">No jobs found.</p>
            ) : (
              jobs.map((job, index) => (
                <div className="available-job-posts-box">
                  <div className="available-job-company-name-save-job">
                    <div className="available-job-company-name">
                      <h4>
                        <img
                          crossOrigin="anonymous"
                          src={getImageUrl(job?.company?.logo)}
                          alt="logo"
                          onError={(e) => {
                            e.target.src = "assets/images/icon/icon-26.png";
                          }}
                        />
                        {job?.jobTitle}
                      </h4>
                    </div>
                  </div>

                  <div className="available-job-type-details">
                    <h5>
                      <p>{job?.shortDescription}</p>
                    </h5>
                    <ul>
                      <li>
                        <i className="fa-regular fa-calendar" />{" "}
                        {moment(job?.createdAt).fromNow() || "N/A"}
                      </li>
                      {/* <li>
                            <i className="fa-regular fa-file" /> 5 Years
                          </li> */}
                      <li>
                        <i className="fa-regular fa-user" />
                        {job?.employmentType?.name || "N/A"}
                      </li>
                      <li>
                        <i className="fa-solid fa-location-dot" />{" "}
                        {job?.city && job.city.length > 0
                          ? job.city.join(", ")
                          : job?.company_city || "N/A"}
                      </li>
                      <li>
                        <i className="fa-regular fa-file" />{" "}
                        {job?.jobCategory?.name || "N/A"}{" "}
                      </li>
                      <li>
                        <i
                          style={{
                            fontSize: "16px",
                          }}
                        >
                          {" "}
                          <TbMessages />
                        </i>
                        <Link
                          to="/messaging-system"
                          state={{
                            jobId: job._id,
                          }}
                        >
                          <span
                            style={{
                              color: "#f37a47",
                            }}
                          >
                            Send Message
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div
                    className="total-applicants-info"
                    style={{
                      pointerEvents:
                        job?.applicantCount === 0 ? "none" : "auto",
                      opacity: job?.applicantCount === 0 ? 0.5 : 1,
                      cursor:
                        job?.applicantCount === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    <Link
                      to="/applied-candidate-list"
                      state={{
                        jobId: job._id,
                        tags: job.tags, // 👈 passing tags also
                      }}
                    >
                      <p>View Applicants: {job?.applicantCount || 0}</p>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </section>
          {totalPages > 1 && (
            <div className="paginations mb-30">
              <ul>
                {/* Previous */}
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "disabled" : ""}
                  >
                    <i className="fa-solid fa-angle-left" />
                  </a>
                </li>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i + 1}>
                    <a
                      href="#"
                      className={currentPage === i + 1 ? "active" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                      }}
                    >
                      {i + 1}
                    </a>
                  </li>
                ))}

                {/* Next */}
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "disabled" : ""}
                  >
                    <i className="fa-solid fa-angle-right" />
                  </a>
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
