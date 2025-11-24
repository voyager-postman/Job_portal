import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import axios from "axios";
function EmployerCandinateList() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const jobId = location.state?.jobId;
  const [candidateList, setCandidateList] = useState([]);
  const [candidateListSummary, setCandidateListSummary] = useState({});
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
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    skills: "",
  });

  const fetchCandidates = async (status = "") => {
    try {
      let query = [];

      // check filters – but only include them if they have value
      if (status) query.push(`status=${status}`);
      if (filters.search.trim()) query.push(`search=${filters.search}`);
      if (filters.location.trim()) query.push(`location=${filters.location}`);
      if (filters.skills.trim()) query.push(`skills=${filters.skills}`);

      // if no filters → load default full list
      const queryString = query.length > 0 ? `?${query.join("&")}` : "";

      const url = `${API_BASE_URL}getApplicantsByJob/${jobId}${queryString}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setCandidateList(data.applicants || []);
      setCandidateListSummary(data.summary || {});

      // ❌ SAFETY FIX — only load first applicant if list has data
      if (data.applicants?.length > 0) {
        fetchApplicantDetails(data.applicants[0]._id);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

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
  const handleBookmark = async (candidateId, jobId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}bookmark/candidate`,
        {
          candidateId,
          jobId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Bookmark Response:", res.data);

      // OPTIONAL: Refresh candidate list after bookmarking
      fetchCandidates();
    } catch (err) {
      console.error("Error bookmarking candidate:", err);
    }
  };

  return (
    <>
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
            <div className="col-lg-6 col-sm-12">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Skills</h3>
                  <form>
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Choose A Skills</option>
                        <option value={1}>Digital</option>
                        <option value={2}>Design</option>
                        <option value={3}>Developer</option>
                        <option value={4}>Front End</option>
                        <option value={5}>Microsoft Excel</option>
                        <option value={6}>Telemarketing</option>
                        <option value={7}>Account</option>
                        <option value={8}>Finance</option>
                        <option value={9}>Marketing</option>
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
            <div className="col-lg-6 col-sm-12">
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

            {/* <div className="col-lg-2 col-sm-6">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Salary Range</h3>
                  <form>
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option value="">Choose Salary Range</option>

                        {salaryRanges?.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.range}
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
                  <h4>Candidates ({candidateListSummary?.Total})</h4>
                </div>
                <div className="employer-candidate-profile-count">
                  <ul>
                    <li>({candidateListSummary?.New}) New Candidate</li>
                    <li>
                      ({candidateListSummary?.Reviewed}) Reviewed Candidate
                    </li>
                    <li>
                      ({candidateListSummary?.Interviewed}) Interviewed
                      Candidate
                    </li>
                    <li>
                      ({candidateListSummary?.Rejected}) Rejected Candidate
                    </li>
                    <li>({candidateListSummary?.Hired}) Hired Candidate</li>
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

                    <option value="New">
                      Sort by: New Candidate ({candidateListSummary?.New})
                    </option>

                    <option value="Reviewed">
                      Sort by: Reviewed Candidate (
                      {candidateListSummary?.Reviewed})
                    </option>

                    <option value="Interviewed">
                      Sort by: Interviewed Candidate (
                      {candidateListSummary?.Interviewed})
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
                            <Link to="/candidates-profile-details">
                              <img
                                crossorigin="anonymous"
                                src={
                                  candidate?.userId?.profileImage
                                    ? `${API_IMAGE_URL}${candidate?.userId?.profileImage}`
                                    : "assets/images/freelancers/freelancers-img-1.jpg"
                                }
                                alt="Image"
                              />
                            </Link>
                          </div>
                        </div>

                        <div className="col-lg-8">
                          <div className="freelancer-content">
                            <Link to="/candidates-profile-details">
                              <h3>
                                {candidate?.userId?.first_name}{" "}
                                {candidate?.userId?.last_name}
                              </h3>
                            </Link>

                            <span>IT Developer</span>

                            <div className="info">
                              <ul>
                                <li>
                                  <i className="fa-solid fa-file" /> 5 Years
                                </li>
                                <li>
                                  <i className="fa-solid fa-money-bill" /> $2000
                                </li>
                                <li>
                                  <i className="fa-solid fa-location-dot" />{" "}
                                  {candidate?.userId?.city}
                                </li>
                                <li>
                                  <i className="fa-solid fa-graduation-cap" />{" "}
                                  Master's Degree
                                </li>
                                <li>
                                  <i className="fa-solid fa-gear" />{" "}
                                  <span className="candidate-active">
                                    Active
                                  </span>
                                </li>
                              </ul>
                            </div>

                            <div
                              className="candidate-list-bookmark"
                              onClick={(e) => {
                                e.stopPropagation(); // stop parent onClick
                                handleBookmark(candidate._id, candidate.jobId);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <i className="fa-regular fa-bookmark" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="employer-candidate-pagination-info">
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <a className="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">
                          <i className="fa-solid fa-angle-left" />
                        </span>
                        <span className="sr-only">Previous</span>
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link active" href="#">
                        1
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        2
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        3
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        4
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        5
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        ...
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        3369825
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">
                          <i className="fa-solid fa-angle-right" />
                        </span>
                        <span className="sr-only">Next</span>
                      </a>
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
                          crossorigin="anonymous"
                          src={
                            selectedCandidate?.userInfo?.profileImage
                              ? `${API_IMAGE_URL}${selectedCandidate.userInfo.profileImage}`
                              : "assets/images/default-user.png"
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
                        <a href="#" className="default-btn btn">
                          Download CV
                        </a>
                      </div>
                      <div className="employer-candidate-icon-info">
                        <ul>
                          <li>
                            <a href="#" target="_blank">
                              <i className="fa-regular fa-heart" />
                            </a>
                          </li>
                          <li>
                            <a href="https://in.linkedin.com/" target="_blank">
                              <i className="fa-brands fa-linkedin-in" />
                            </a>
                          </li>
                          <li>
                            <a href="https://x.com/" target="_blank">
                              <i className="fa-brands fa-x-twitter" />
                            </a>
                          </li>
                          <li>
                            <a href="mailto:andysmith@gmail.com">
                              <i className="fa-solid fa-envelope" />
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
                          <option value="">Relevance</option>
                          <option value="Applied">Applied</option>
                          <option value="Reviewed">Reviewed</option>
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
                      <p>{selectedCandidate?.profile?.aboutRole?.jobTitle}</p>

                      <h5>Years of experience</h5>
                      <p>
                        {
                          selectedCandidate?.profile?.aboutRole
                            ?.yearOfExperience
                        }
                      </p>

                      <h5>Job category</h5>
                      <p>
                        {selectedCandidate?.profile?.aboutRole?.jobCategory}
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
                        {
                          selectedCandidate?.profile?.career_goals
                            ?.DesiredJobTitle
                        }
                      </p>

                      <h5>Desired Employment Type</h5>
                      <p>
                        {
                          selectedCandidate?.profile?.career_goals
                            ?.DesiredEmploymentType
                        }
                      </p>

                      <h5>Desired Occupation Type</h5>
                      <p>
                        {
                          selectedCandidate?.profile?.career_goals
                            ?.DesiredOccupationType
                        }
                      </p>

                      <h5>Minimum Desired Salary</h5>
                      <p>
                        {
                          selectedCandidate?.profile?.career_goals
                            ?.MinimumDesiredSalary?.amount
                        }{" "}
                        {
                          selectedCandidate?.profile?.career_goals
                            ?.MinimumDesiredSalary?.currency
                        }{" "}
                        /{" "}
                        {
                          selectedCandidate?.profile?.career_goals
                            ?.MinimumDesiredSalary?.type
                        }
                      </p>

                      <h5>Job Search Status</h5>
                      <p>
                        {
                          selectedCandidate?.profile?.career_goals
                            ?.jobSearchStatus
                        }
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
                        <p>{edu.degree}</p>

                        <h5>University</h5>
                        <p>{edu.University}</p>

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
                        <h5>{work.jobTitle}</h5>
                        <p>
                          {new Date(work.startDate).toLocaleDateString()} -{" "}
                          {work.currentlyWorkingHere
                            ? "Present"
                            : new Date(work.endDate).toLocaleDateString()}
                        </p>

                        <h5>{work.companyName}</h5>
                        <p>{work.workLocation}</p>

                        <h5>Salary</h5>
                        <p>
                          {work.currentSalary?.amount}{" "}
                          {work.currentSalary?.currency}
                        </p>
                        <h5>Payroll frequency</h5>
                        <p>{work.currentSalary?.payrollFrequency}</p>

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
                        <h5>{lang.language}</h5>
                        <p>{lang.proficiency}</p>
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
                        <h5>{cer.title}</h5>
                        <p>
                          Issue Date:{" "}
                          {new Date(cer.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>Loading details...</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EmployerCandinateList;
