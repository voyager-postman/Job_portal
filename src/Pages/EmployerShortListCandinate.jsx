import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";

function EmployerShortListCandinate() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [bookmarkedCandidates, setBookmarkedCandidates] = useState([]);
  // const [bookmarkCount, setBookMarkCount] = useState("");
  const [itemsPerPage] = useState(6); // show 6 candidates per page
  // Calculate index range
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPages = Math.ceil(totalCount / perPage);

  // Total pages

  // Page change handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const token = localStorage.getItem("token");
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  useEffect(() => {
    fetchBookmarkedCandidates();
  }, [currentPage, perPage]);

  const pageSizeOptions = [10, 20, 30, 50];

  const fetchBookmarkedCandidates = async (page = currentPage) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE_URL}getBookmarked/candidates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: perPage,
          search: search?.trim() || "", // 👈 THIS
        },
      });

      setBookmarkedCandidates(res.data.bookmarks || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (error) {
      console.error("Error fetching bookmarked candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const JobListLoader = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p>Loading BookMark Candidates, please wait...</p>
    </div>
  );

  const handleBookmark = async (candidateId, jobId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}bookmark/candidate`,
        { candidateId, jobId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Show message from backend
      toast.success(res.data.message);
      fetchBookmarkedCandidates(); // load bookmark list
    } catch (err) {
      console.error("Error bookmarking candidate:", err);

      // If backend sends error message
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to bookmark candidate!");
      }
    }
  };
  useEffect(() => {
    // whenever search becomes empty, reload full list
    if (search.trim() === "") {
      setCurrentPage(1);
      fetchBookmarkedCandidates(1);
    }
  }, [search]);

  const cleanImageUrl = (url) => {
    if (!url) return "";

    // Case: wrong URL like "/uploads/https://"
    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    // External image URL
    if (url.startsWith("http")) {
      return url;
    }

    // Local uploads
    return `${API_IMAGE_URL}${url}`;
  };
  console.log(totalCount);
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1> Bookmark Candidates</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <Link to="/bookmark-candidate">
                  <i className="fa-solid fa-angle-right" /> Bookmark Candidates
                </Link>
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start Bookmark Jobs Area*/}
          <div className="applied-shorting-content">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-5">
                <div className="employer-shortlist-candidates-heading">
                  <h4>{totalCount} BookMark Candidates</h4>
                </div>
              </div>
              <div className="col-lg-4 col-md-7">
                <div className="shorting-right-content">
                  <div className="row">
                    <div className="col-6">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>All Jobs</option>
                        <option value={1}>UI/UX Designer</option>
                        <option value={2}>Magento Developer</option>
                        <option value={3}>App Developer</option>
                        <option value={4}>Product Designer</option>
                        <option value={5}>WordPress Developer</option>
                        <option value={6}>Content Writer</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <select
                        className="form-select form-control"
                        value={perPage}
                        onChange={(e) => {
                          setPerPage(Number(e.target.value));
                          setCurrentPage(1); // reset page
                        }}
                      >
                        {pageSizeOptions.map((size) => (
                          <option key={size} value={size}>
                            Show {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
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
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="employer-candidate-btn-area">
                  <button
                    className="default-btn btn"
                    onClick={() => {
                      setCurrentPage(1);
                      fetchBookmarkedCandidates(1);
                    }}
                  >
                    Find
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {loading && <JobListLoader />}
            {!loading && bookmarkedCandidates.length === 0 && (
              <p className="text-center py-4">
                No bookmarked candidates found.
              </p>
            )}

            {!loading &&
              bookmarkedCandidates.length > 0 &&
              bookmarkedCandidates.map((item, index) => {
                const candidate = item.candidateId;
                const role = candidate?.candidateProfile?.aboutRole;
                const careerGoals = candidate?.candidateProfile?.career_goals;
                return (
                  <div
                    className="col-lg-6 col-sm-6"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    key={item._id}
                  >
                    <div className="candidate-list-info single-freelancer-card">
                      <Link
                        to={`/candidates-details`}
                        state={{
                          userId: candidate?._id,
                          from: "/bookmark-candidate",
                        }}
                      >
                        <div className="row align-items-center">
                          <div className="col-lg-4">
                            <div className="freelancer-img">
                              <img
                                crossOrigin="anonymous"
                                src={
                                  cleanImageUrl(candidate?.profileImage) ||
                                  "assets/images/userIcon.png"
                                }
                                alt="Profile"
                              />
                            </div>
                          </div>

                          <div className="col-lg-8">
                            <div className="freelancer-content">
                              <h3>
                                {candidate?.first_name} {candidate?.last_name}
                              </h3>
                              <span>
                                {candidate?.candidateProfile?.aboutRole
                                  ?.jobTitle || "N/A"}
                              </span>

                              <div className="info">
                                <ul>
                                  <li>
                                    <i className="fa-solid fa-file" />{" "}
                                    {role?.yearOfExperience
                                      ? `${role.yearOfExperience} Years`
                                      : "N/A"}
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-money-bill" />
                                    {careerGoals?.MinimumDesiredSalary?.amount
                                      ? `$${careerGoals.MinimumDesiredSalary.amount}/${careerGoals.MinimumDesiredSalary.type}`
                                      : "Salary not specified"}
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-location-dot" />
                                    {candidate?.city ||
                                      "Location not available"}
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-graduation-cap" />
                                    {careerGoals?.DesiredEmploymentType ||
                                      "Not specified"}
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-gear" />
                                    <span className="candidate-active">
                                      {candidate?.candidateProfile
                                        ?.profileVisible
                                        ? "Active"
                                        : "Inactive"}
                                    </span>
                                  </li>
                                </ul>
                              </div>

                              <div className="candidate-list-shortlist-candidates">
                                <div
                                  className="candidate-list-bookmark"
                                  onClick={(e) => {
                                    e.preventDefault(); // ⬅ stop page reload
                                    e.stopPropagation(); // ⬅ stop parent card click
                                    handleBookmark(
                                      candidate?._id,
                                      candidate?.jobId,
                                    );
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <i
                                    className={"fa-solid fa-bookmark"}
                                    style={{
                                      cursor: "pointer",
                                      color: "#1868ca",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
          {totalPages > 1 && (
            <div className="paginations mb-30">
              <ul>
                {/* Previous button */}
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1);
                      }
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

                {/* Next button */}
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={currentPage === totalPages ? "disabled" : ""}
                  >
                    <i className="fa-solid fa-angle-right" />
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/*End Bookmark Jobs Area*/}
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

export default EmployerShortListCandinate;
