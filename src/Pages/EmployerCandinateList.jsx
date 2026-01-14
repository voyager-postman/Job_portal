import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "../Services/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function EmployerCandinateList() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const jobId = location.state?.jobId;
  const jobTags = location.state?.tags || [];
  const [candidateList, setCandidateList] = useState([]);
  const [candidateListSummary, setCandidateListSummary] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // you can change to 20, 50 etc.
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [levels, setLevels] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newApplicationStatus, setNewApplicationStatus] = useState("");
  const [candidateCount, setCandidateCount] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    skills: "",
  });

  const fetchCandidates = async (status = "") => {
    let query = [];

    query.push(`page=${page}`);
    query.push(`limit=${limit}`);

    if (status) query.push(`status=${status}`);
    if (filters.search.trim()) query.push(`search=${filters.search}`);
    if (filters.location.trim()) query.push(`location=${filters.location}`);
    if (filters.skills.trim()) query.push(`skills=${filters.skills}`);

    const queryString = `?${query.join("&")}`;

    const res = await fetch(
      `${API_BASE_URL}getApplicantsByJob/${jobId}${queryString}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    setCandidateList(data.applicants || []);
    setCandidateListSummary(data.summary || {});
    setTotalPages(data.totalPages || 1);

    if (data.applicants?.length > 0) {
      fetchApplicantDetails(data.applicants[0]._id);
    } else {
      setSelectedCandidate(null);
    }
  };
  const fetchCandidates2 = async () => {
    let query = [];

    query.push(`page=${page}`);
    query.push(`limit=${limit}`);

    const queryString = `?${query.join("&")}`;
    const res = await fetch(
      `${API_BASE_URL}getApplicantsByJob/${jobId}${queryString}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    console.log("Candidate Count Data:-", data.summary);
    setCandidateCount(data.summary || {});
    setTotalPages(data.totalPages || 1);
  };
  useEffect(() => {
    fetchCandidates2();
  }, [page]);

  useEffect(() => {
    fetchSalaryRanges();
  }, []);

  const fetchSalaryRanges = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getActiveSalaryRangeList`);
      if (res.data.success) {
        setSalaryRanges(res.data.data); // ✅ data[] from API
      }
    } catch (error) {
      console.error("Error fetching salary ranges:", error);
    }
  };
  useEffect(() => {
    fetchExperienceLevels();
  }, []);
  useEffect(() => {
    fetchCandidates(selectedStatus);
    fetchCandidates2();
  }, [page, selectedStatus]);

  const fetchExperienceLevels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getActiveSeniorityLevelList`);

      if (res.data.success) {
        setLevels(res.data.levels); // ⭐ API sends levels[]
      }
    } catch (error) {
      console.error("Error fetching experience levels:", error);
    }
  };
  useEffect(() => {
    fetchEducationList();
  }, []);
  const handleStatusUpdate = async (e) => {
    const value = e.target.value;
    setNewApplicationStatus(value);

    try {
      const res = await axios.post(
        `${API_BASE_URL}updateApplicationStatus`,
        {
          jobId: selectedCandidate?.jobId, // From useLocation()
          applicationId: selectedCandidate?._id,
          newStatus: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Status Updated", res.data);
      fetchCandidates2();
      fetchCandidates();
      // Refresh candidate details
      fetchApplicantDetails(selectedCandidate?.userInfo?._id);
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  const fetchEducationList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getActiveJobTypeList`);

      if (res.data.success) {
        setJobTypes(res.data.jobTypes); // ⭐ using jobTypes[]
      }
    } catch (error) {
      console.error("Error fetching education types:", error);
    }
  };
  const handleLocationSearch = async (e) => {
    const value = e.target.value;
    setLocationSearchTerm(value);

    if (!value.trim()) {
      setLocationSuggestions([]);
      return;
    }

    try {
      setIsLocationLoading(true);
      const res = await axios.get(`${API_BASE_URL}searchCities`, {
        params: { key: value },
      });

      if (res.data?.success && Array.isArray(res.data.cities)) {
        setLocationSuggestions(res.data.cities);
      } else {
        setLocationSuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setLocationSuggestions([]);
    } finally {
      setIsLocationLoading(false);
    }
  };
  const handleSelectLocation = (city) => {
    setSelectedLocation(city);
    setLocationSearchTerm(city.name);
    setLocationSuggestions([]);

    setFilters((prev) => ({
      ...prev,
      location: city.name,
    }));
  };
  useEffect(() => {
    if (filters.location) {
      fetchCandidates(); // now always uses updated filter value
    }
  }, [filters.location]);

  const handleSortChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);

    fetchCandidates(status); // 🔥 Fetch filtered list
  };

  // Fetch Full Details of Single Applicant
  const fetchApplicantDetails = async (applicationId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}applicant/details/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setSelectedCandidate(data.applicant);
      setNewApplicationStatus(data.applicant.status || "");
    } catch (err) {
      console.error("Details Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchCandidates(selectedStatus); // load with current filter
    }
  }, [jobId]);
  useEffect(() => {
    fetchCandidates(selectedStatus); // if you have status filter
  }, [filters]);

  const handleBookmark = async (candidateId, jobId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}bookmark/candidate`,
        { candidateId, jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Show message from backend
      toast.success(res.data.message);

      fetchCandidates();
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

  const getResumeUrl = () => {
    const { coverLetter, cv, customResume } = selectedCandidate || {};
    console.log(selectedCandidate);
    if (coverLetter) return coverLetter;
    if (cv) return cv;
    if (customResume) return customResume;

    return null;
  };

  return (
    <>
      <ToastContainer />
      <section className="employer-candidate-filter-info-area">
        <div className="container">
          <div className="row">
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
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="employer-candidate-btn-area">
                <button
                  className="default-btn btn"
                  onClick={() => fetchCandidates()}
                >
                  Find
                </button>
              </div>
            </div>
            {/* <div className="col-lg-2 col-sm-6">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Search By Keyword</h3>
                  <form>
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Keywords / Job Title"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div> */}
            <div className="col-lg-3 col-sm-12">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Skills</h3>

                  <form>
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        aria-label="Select Skill"
                        value={filters.skills}
                        onChange={(e) =>
                          setFilters({ ...filters, skills: e.target.value })
                        }
                      >
                        <option value="">Choose A Skill</option>

                        {jobTags.length > 0 ? (
                          jobTags.map((skill, index) => (
                            <option key={index} value={skill}>
                              {skill}
                            </option>
                          ))
                        ) : (
                          <option disabled>No skills found</option>
                        )}
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-12">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword ">
                  <h3>Date</h3>
                  <div className="form-group position-relative date_flex_area text-center">
                    <DatePicker
                      selectsRange
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => setDateRange(update)}
                      monthsShown={2}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="dd-mm-yyyy to dd-mm-yyyy"
                      className="form-control Date_Input"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-12">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Location</h3>
                  <div className="form-group position-relative">
                    {/* Input field with selected city */}
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Location"
                      value={locationSearchTerm}
                      onChange={handleLocationSearch}
                    />

                    {/* Loading */}
                    {isLocationLoading && (
                      <div className="suggestion-box">Searching...</div>
                    )}

                    {/* Suggestions */}
                    {!isLocationLoading && locationSuggestions.length > 0 && (
                      <ul
                        className="list-group position-absolute w-100"
                        style={{
                          zIndex: 1000,
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {locationSuggestions.map((city) => (
                          <li
                            key={city._id}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSelectLocation(city)}
                          >
                            {city.name}, {city.state_name}, {city.country_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-12">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Score</h3>
                  <form>
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        aria-label="Select Skill"
                        // value={filters.skills}
                        // onChange={(e) =>
                        //   setFilters({ ...filters, skills: e.target.value })
                        // }
                      >
                        <option value="">Choose A Score</option>
                        <option value="one"> One</option>
                        <option value="two">Two</option>
                        <option value="three">Three</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* <div className="col-lg-2 col-sm-6">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Experience level</h3>
                  <form>
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option value="">Choose Experience Level</option>

                        {levels?.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div> */}
            {/* <div className="col-lg-2 col-sm-6">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Job Type</h3>
                  <form>
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option value="">Choose Job Type</option>

                        {jobTypes?.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div> */}

            <div className="col-lg-12 col-sm-12">
              <div className="employer-candidate-number-counting">
                <div className="employer-candidate-number">
                  <h4>Candidates ({candidateCount?.Total})</h4>
                </div>
                <div className="employer-candidate-profile-count">
                  <ul>
                    <li>({candidateCount?.New}) New Candidate</li>

                    <li>
                      ({candidateCount?.Shortlisted}) Shortlisted Candidate
                    </li>
                    <li>({candidateCount?.Rejected}) Rejected Candidate</li>
                    <li>({candidateCount?.Hired}) Hired Candidate</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="employer-candidate-info-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-sm-4">
              <div className="employer-candidate-card-filter-info">
                <div className="form-group">
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                    onChange={handleSortChange} // ← ADD THIS
                  >
                    <option value="">Sort by: Relevance</option>

                    <option value="Applied">
                      Sort by: New Candidate ({candidateListSummary?.New})
                    </option>

                    <option value="Shortlisted">
                      Sort by: Shortlisted Candidate (
                      {candidateListSummary?.Shortlisted})
                    </option>

                    <option value="Rejected">
                      Sort by: Rejected Candidate (
                      {candidateListSummary?.Rejected})
                    </option>

                    <option value="Hired">
                      Sort by: Hired Candidate ({candidateListSummary?.Hired})
                    </option>
                  </select>
                </div>
              </div>
              <div className="employer-candidate-card-info">
                {candidateList?.length === 0 ? (
                  <div className="no-data-message">
                    <p>No candidates found for this filter.</p>
                  </div>
                ) : (
                  candidateList?.map((candidate) => (
                    <div
                      className="candidate-list-info single-freelancer-card"
                      key={candidate._id}
                      onClick={() => fetchApplicantDetails(candidate._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="row align-items-center">
                        <div className="col-lg-4">
                          <div className="freelancer-img">
                            <img
                              crossOrigin="anonymous"
                              src={
                                candidate?.userId?.profileImage
                                  ? candidate.userId.profileImage.startsWith(
                                      "http"
                                    )
                                    ? candidate.userId.profileImage // external URL → use directly
                                    : `${API_IMAGE_URL}${candidate.userId.profileImage}` // local uploads
                                  : "assets/images/freelancers/freelancers-img-1.jpg"
                              }
                              alt="Image"
                            />
                          </div>
                        </div>

                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <h3>
                              {candidate?.userId?.first_name}{" "}
                              {candidate?.userId?.last_name}
                            </h3>

                            <span>
                              {" "}
                              {candidate?.userId?.candidateProfile?.aboutRole
                                ?.jobCategory ?? "NA"}
                            </span>

                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-file" />{" "}
                                  {candidate?.userId?.candidateProfile
                                    ?.aboutRole?.yearOfExperience ?? "NA"}{" "}
                                  Years
                                </li>
                                <li>
                                  <i className="fa-solid fa-money-bill" />$
                                  {candidate?.userId?.candidateProfile
                                    ?.career_goals?.MinimumDesiredSalary
                                    ?.amount ?? "0"}
                                </li>

                                <li>
                                  <i className="fa-solid fa-location-dot" />{" "}
                                  {candidate?.userId?.city}
                                </li>
                                <li>
                                  <i className="fa-solid fa-briefcase" />{" "}
                                  {candidate?.userId?.candidateProfile
                                    ?.aboutRole?.jobTitle ?? "NA"}{" "}
                                </li>
                                <li>
                                  <i className="fa-solid fa-gear" />{" "}
                                  <span className="candidate-active">
                                    {candidate?.userId?.candidateProfile
                                      ?.profileVisible === true
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </li>
                              </ul>
                            </div>

                            <div
                              className="candidate-list-bookmark"
                              onClick={(e) => {
                                e.stopPropagation(); // stop parent onClick
                                handleBookmark(
                                  candidate?.userId?._id,
                                  candidate.jobId
                                );
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className={
                                  candidate.isBookmarked
                                    ? "fa-solid fa-bookmark"
                                    : "fa-regular fa-bookmark"
                                }
                                style={{
                                  cursor: "pointer",
                                  color: candidate.isBookmarked
                                    ? "#1868ca"
                                    : "#888",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="employer-candidate-pagination-info">
                <nav aria-label="Pagination">
                  <ul className="pagination">
                    {/* Previous */}
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => page > 1 && setPage(page - 1)}
                      >
                        <i className="fa-solid fa-angle-left"></i>
                      </button>
                    </li>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <li key={i} className="page-item">
                        <button
                          className={`page-link ${
                            page === i + 1 ? "active" : ""
                          }`}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}

                    {/* Next */}
                    <li
                      className={`page-item ${
                        page === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => page < totalPages && setPage(page + 1)}
                      >
                        <i className="fa-solid fa-angle-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <div className="col-lg-8 col-sm-8">
              {selectedCandidate ? (
                <>
                  {/* ================= HEADER SECTION ================= */}
                  <div className="employer-candidate-detail-new-info">
                    <div className="employer-candidate-img-content-info">
                      <div className="employer-candidate-img-info">
                        <img
                          crossOrigin="anonymous"
                          src={
                            selectedCandidate?.userInfo?.profileImage
                              ? selectedCandidate.userInfo.profileImage.startsWith(
                                  "http"
                                )
                                ? selectedCandidate.userInfo.profileImage // external URL → use directly
                                : `${API_IMAGE_URL}${selectedCandidate.userInfo.profileImage}` // local uploads
                              : "assets/images/freelancers/freelancers-img-1.jpg"
                          }
                          alt="Image"
                        />
                      </div>

                      <div className="employers-condidate-content">
                        <h3>
                          <strong>Name:</strong>{" "}
                          {selectedCandidate?.userInfo?.first_name}{" "}
                          {selectedCandidate?.userInfo?.last_name}
                        </h3>

                        <h3>
                          <strong>Position:</strong>{" "}
                          {selectedCandidate?.profile?.aboutRole?.jobTitle ||
                            "N/A"}
                        </h3>

                        <h3>
                          <strong>Email:</strong>{" "}
                          {selectedCandidate?.userInfo?.email}
                        </h3>

                        <h3>
                          <strong>Contact:</strong>{" "}
                          {selectedCandidate?.userInfo?.phone}
                        </h3>

                        <h3>
                          <strong>Address:</strong>{" "}
                          {selectedCandidate?.userInfo?.city}
                        </h3>
                      </div>
                    </div>
                    <div className="employer-candidate-dcv-icons">
                      <div className="employer-candidate-dcv-btn">
                        <a
                          href="#"
                          className="default-btn btn"
                          onClick={(e) => {
                            e.preventDefault();
                            const fileUrl = getResumeUrl();

                            if (!fileUrl) {
                              toast.error("No resume uploaded");
                              return;
                            }

                            // open in new tab
                            window.open(
                              `http://13.48.130.179:4000${fileUrl}`,
                              "_blank"
                            );
                          }}
                        >
                          Download CV
                        </a>
                      </div>

                      <div className="employer-candidate-icon-info">
                        <ul>
                          {/* LinkedIn */}
                          <li>
                            <a
                              href={
                                selectedCandidate?.profile?.links?.linkedin ||
                                "#"
                              }
                              target="_blank"
                              onClick={(e) => {
                                if (
                                  !selectedCandidate?.profile?.links?.linkedin
                                ) {
                                  e.preventDefault();
                                  toast.info("LinkedIn link not available");
                                }
                                e.stopPropagation(); // prevent parent click
                              }}
                            >
                              <i className="fa-brands fa-linkedin-in" />
                            </a>
                          </li>

                          {/* GitHub */}
                          <li>
                            <a
                              href={
                                selectedCandidate?.profile?.links?.github || "#"
                              }
                              target="_blank"
                              onClick={(e) => {
                                if (
                                  !selectedCandidate?.profile?.links?.github
                                ) {
                                  e.preventDefault();
                                  toast.info("GitHub link not available");
                                }
                                e.stopPropagation();
                              }}
                            >
                              <i className="fa-brands fa-github" />
                            </a>
                          </li>

                          {/* Portfolio */}
                          <li>
                            <a
                              href={
                                selectedCandidate?.profile?.links?.portfolio ||
                                "#"
                              }
                              target="_blank"
                              onClick={(e) => {
                                if (
                                  !selectedCandidate?.profile?.links?.portfolio
                                ) {
                                  e.preventDefault();
                                  toast.info("Portfolio link not available");
                                }
                                e.stopPropagation();
                              }}
                            >
                              <i className="fa-solid fa-globe" />
                            </a>
                          </li>
                        </ul>
                      </div>

                      <div className="new-reviewed-interviewed-rejected-hired">
                        <select
                          className="form-select form-control"
                          aria-label="Default select example"
                          value={newApplicationStatus}
                          onChange={handleStatusUpdate}
                        >
                          <option value="Applied">New</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* ================= PROFESSIONAL SUMMARY ================= */}
                  <div className="employer-candidate-detail-info-area">
                    <div className="employer-candidate-cv-heading">
                      <h3>About Role</h3>
                    </div>

                    <div className="employer-candidate-cv-details">
                      <h5>Job Title</h5>
                      <p>
                        {selectedCandidate?.profile?.aboutRole?.jobTitle ||
                          "NA"}
                      </p>

                      <h5>Years of experience</h5>
                      <p>
                        {selectedCandidate?.profile?.aboutRole
                          ?.yearOfExperience || "NA"}
                      </p>

                      <h5>Job category</h5>
                      <p>
                        {selectedCandidate?.profile?.aboutRole?.jobCategory ||
                          "NA"}
                      </p>
                    </div>

                    <div className="candidate-profile-divider-line" />

                    {/* ================= CAREER GOALS ================= */}
                    <div className="employer-candidate-cv-heading">
                      <h3>Career Goals</h3>
                    </div>

                    <div className="employer-candidate-cv-details">
                      <h5>Desired Job Title</h5>
                      <p>
                        {selectedCandidate?.profile?.career_goals
                          ?.DesiredJobTitle || "NA"}
                      </p>

                      <h5>Desired Employment Type</h5>
                      <p>
                        {selectedCandidate?.profile?.career_goals
                          ?.DesiredEmploymentType || "NA"}
                      </p>

                      <h5>Desired Occupation Type</h5>
                      <p>
                        {selectedCandidate?.profile?.career_goals
                          ?.DesiredOccupationType || "NA"}
                      </p>

                      <h5>Minimum Desired Salary</h5>
                      <p>
                        {selectedCandidate?.profile?.career_goals
                          ?.MinimumDesiredSalary?.amount || "NA"}{" "}
                        {selectedCandidate?.profile?.career_goals
                          ?.MinimumDesiredSalary?.currency || "NA"}{" "}
                        /{" "}
                        {selectedCandidate?.profile?.career_goals
                          ?.MinimumDesiredSalary?.type || "NA"}
                      </p>

                      <h5>Job Search Status</h5>
                      <p>
                        {selectedCandidate?.profile?.career_goals
                          ?.jobSearchStatus || "NA"}
                      </p>
                    </div>

                    <div className="candidate-profile-divider-line" />

                    {/* ================= SKILLS ================= */}
                    <div className="employer-candidate-cv-heading">
                      <h3>Skills</h3>
                    </div>
                    <div className="employer-candidate-profile-skill-info">
                      <ul>
                        {selectedCandidate?.profile?.skills?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="candidate-profile-divider-line" />

                    {/* ================= EDUCATION ================= */}
                    <div className="employer-candidate-cv-heading">
                      <h3>Education</h3>
                    </div>
                    {selectedCandidate?.profile?.education?.map((edu) => (
                      <div
                        key={edu._id}
                        className="employer-candidate-cv-details"
                      >
                        <h5>Degree</h5>
                        <p>{edu.degree || "NA"}</p>

                        <h5>University</h5>
                        <p>{edu.University || "NA"}</p>

                        <h5>Start Date</h5>
                        <p>{new Date(edu.startDate).toLocaleDateString()}</p>

                        <h5>End Date</h5>
                        <p>
                          {edu.currentlyStudyingHere
                            ? "Currently Studying"
                            : new Date(edu.endDate).toLocaleDateString()}
                        </p>

                        <div className="candidate-profile-divider-line" />
                      </div>
                    ))}

                    {/* ================= WORK HISTORY ================= */}
                    <div className="employer-candidate-cv-heading">
                      <h3>Experience</h3>
                    </div>

                    {selectedCandidate?.profile?.workHistory?.map((work) => (
                      <div
                        key={work._id}
                        className="employer-candidate-cv-details"
                      >
                        <h5>{work.jobTitle || "NA"}</h5>
                        <p>
                          {new Date(work.startDate).toLocaleDateString()} -{" "}
                          {work.currentlyWorkingHere
                            ? "Present"
                            : new Date(work.endDate).toLocaleDateString()}
                        </p>

                        <h5>{work.companyName || "NA"}</h5>
                        <p>{work.workLocation || "NA"}</p>

                        <h5>Salary</h5>
                        <p>
                          {work.currentSalary?.amount}{" "}
                          {work.currentSalary?.currency}
                        </p>
                        <h5>Payroll frequency</h5>
                        <p>{work.currentSalary?.payrollFrequency || "NA"}</p>

                        <div className="candidate-profile-divider-line" />
                      </div>
                    ))}

                    {/* ================= LANGUAGES ================= */}
                    <div className="employer-candidate-cv-heading">
                      <h3>Languages</h3>
                    </div>

                    {selectedCandidate?.profile?.languages?.map((lang) => (
                      <div
                        key={lang._id}
                        className="employer-candidate-cv-details"
                      >
                        <h5>{lang.language || "NA"}</h5>
                        <p>{lang.proficiency || "NA"}</p>
                      </div>
                    ))}

                    <div className="candidate-profile-divider-line" />

                    {/* ================= CERTIFICATES ================= */}
                    <div className="employer-candidate-cv-heading">
                      <h3>Certificates</h3>
                    </div>

                    {selectedCandidate?.profile?.certificates?.map((cer) => (
                      <div
                        key={cer._id}
                        className="employer-candidate-cv-details"
                      >
                        <h5>{cer.title || "NA"}</h5>
                        <p>
                          Issue Date:{" "}
                          {new Date(cer.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>No Data details...</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EmployerCandinateList;
