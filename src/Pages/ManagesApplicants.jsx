import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
function ManagesApplicants() {
  const token = localStorage.getItem("token");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");

  const [selectedJob, setSelectedJob] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [perPage, setPerPage] = useState(6); // default
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [jobs, setJobs] = useState([]);
  const JobListLoader = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p>Loading Candidates Listing, please wait...</p>
    </div>
  );
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}getCompanyActiveJobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  const cleanImageUrl = (url) => {
    if (!url) return "";

    // ✅ Default local dashboard image
    if (url === "/jobPortal/assets/images/dashboard/images1.png") {
      return url;
    }

    // ✅ Fix wrong stored URL like "/uploads/https://..."
    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    // ✅ External image (Google, GitHub, etc.)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // ✅ Local uploaded image
    return `${API_IMAGE_URL}${url}`;
  };
  const fetchApplicants = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE_URL}getAllApplicantsPerCompany`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          jobId: selectedJob || undefined,
          search: keyword || undefined,
          status: status || undefined,
          page,
          limit: perPage,
        },
      });

      setCandidates(res.data.applicants || []);
      setTotalResults(res.data.totalApplicants || 0);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants(currentPage);
  }, [currentPage, keyword, selectedJob, status, perPage]);

  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Applicant Management</h1>
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
                <i className="fa-solid fa-angle-right" /> All Applicants
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          <div className="employer-dashboard-common-heading">
            <h2>All Applicants</h2>
          </div>
          {/*Job Applied Candidates List Start Area */}
          <div className="application-management-filter-candidate-list">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="application-management-search-select-box">
                  <div className="application-management-search-keyword">
                    <div className="application-management-search-input">
                      <div className="form-group">
                        <input
                          type="search"
                          className="form-control"
                          placeholder="Search by name or skill..."
                          value={keyword}
                          onChange={(e) => {
                            setKeyword(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                    </div>
                    <div className="application-management-Icon">
                      <i className="fa-solid fa-magnifying-glass" />
                    </div>
                  </div>
                  <div className="application-management-select-box">
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        value={selectedJob}
                        onChange={(e) => {
                          setSelectedJob(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="">All Jobs</option>
                        {jobs.map((job) => (
                          <option key={job._id} value={job._id}>
                            {job?.jobTitle}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="application-management-select-box">
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="">All Status</option>
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {loading ? (
                <JobListLoader />
              ) : candidates.length === 0 ? (
                <p className="text-center py-5">No applicants found</p>
              ) : (
                <div className="row">
                  {candidates.map((item) => {
                    const profile = item.userId?.candidateProfile;
                    const about = profile?.aboutRole;
                    const jobId = item?.jobId?._id;

                    return (
                      <div className="col-lg-6 col-sm-6" key={item._id}>
                        <Link
                          to="/applicants-details"
                          state={{
                            jobId: jobId,
                          }}
                        >
                          <div className="application-management-user-Img-details">
                            {/* IMAGE */}
                            <div className="application-management-user-Img">
                              <img
                                crossOrigin="anonymous"
                                src={
                                  cleanImageUrl(item.userId?.profileImage) ||
                                  "assets/images/userIcon.png"
                                }
                                alt="candidate"
                              />
                            </div>

                            {/* DETAILS */}
                            <div className="application-management-user-details">
                              <div className="application-management-skill">
                                <h6>
                                  {item.userId?.first_name}{" "}
                                  {item.userId?.last_name}
                                </h6>
                                <p>
                                  <i className="fa-solid fa-briefcase" />{" "}
                                  {item.jobId?.jobTitle ||
                                    "Job title not available"}
                                </p>
                              </div>

                              <ul>
                                <li>
                                  <i className="fa-solid fa-user-tie" />{" "}
                                  {about?.jobTitle || "N/A"}
                                </li>
                                <li>
                                  <i className="fa-solid fa-file" />
                                  {about?.yearOfExperience || 0} Years
                                </li>

                                <li>
                                  <i className="fa-solid fa-money-bill" />
                                  {profile?.career_goals?.MinimumDesiredSalary
                                    ?.amount || "N/A"}
                                </li>

                                <li>
                                  <i className="fa-solid fa-location-dot" />
                                  {item.userId?.city || "N/A"}
                                </li>

                                <li>
                                  <i className="fa-solid fa-graduation-cap" />
                                  {profile?.education?.[0]?.degree || "N/A"}
                                </li>

                                <li className="application-pipeline-area" />
                              </ul>

                              <p>
                                Applied{" "}
                                {moment(item.createdAt).format("MMM DD, YYYY")}
                              </p>
                            </div>

                            {/* STATUS */}
                            <div
                              className={`application-management-status ${item.status}`}
                            >
                              <span>{item.status}</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {/*Job Applied Candidates List End Area */}
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

export default ManagesApplicants;
