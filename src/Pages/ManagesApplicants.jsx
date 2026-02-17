import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

function ManagesApplicants() {
  const token = localStorage.getItem("token");
  const cityDropdownRef = useRef(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [seniorityLevels, setSeniorityLevels] = useState([]);
  const [country, setCountry] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [showProcess, setShowProcess] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [salaryRanges, setSalaryRanges] = useState([]);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedEducation, setSelectedEducation] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [sortByATS, setSortByATS] = useState("");

  const handleStatusChange = (candidateId, newStatus) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c._id === candidateId ? { ...c, status: newStatus } : c,
      ),
    );
  };

  console.log(selectedCandidate);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(6); // default
  const [totalResults, setTotalResults] = useState(0);
  const statusFilters = [
    "All",
    "New",
    "Pré-sélectionné",
    "Contacted",
    "HR Interview",
    "Tech Interview",
    "Offer",
    "Recruté",
    "Rejeté",
  ];
  const recruitmentSteps = [
    "New",
    "Pré-sélectionné",
    "Contacté",
    "Entretien RH",
    "Entretien Tech",
    "Offre",
    "Recruté",
    "Rejeté",
  ];
  const educationLevels = [
    "High School",
    "Secondary School",
    "Higher Secondary",
    "Certificate",
    "Diploma",
    "Associate Degree",
    "Bachelor Degree",
    "Master’s Degree",
    "Doctorate (PhD)",
    "Post Doctorate",
    "Professional Degree",
  ];
  useEffect(() => {
    if (selectedCandidate?.status) {
      setCurrentStatus(selectedCandidate.status);
    }
  }, [selectedCandidate]);

  const [currentStatus, setCurrentStatus] = useState(
    selectedCandidate?.status || "New",
  );
  const jobOptions = [
    ...new Map(
      candidates
        ?.filter((c) => c.jobId?._id)
        .map((c) => [c.jobId._id, c.jobId]),
    ).values(),
  ];
  useEffect(() => {
    const fetchSeniorityLevels = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}getActiveSeniorityLevelList`,
        );
        if (res.data.success && Array.isArray(res.data.levels)) {
          setSeniorityLevels(res.data.levels);
        }
      } catch (error) {
        console.error("Error fetching seniority levels:", error);
      }
    };

    fetchSeniorityLevels();
  }, []);
  useEffect(() => {
    const fetchSalaryRanges = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}getActiveSalaryRangeList`);
        const data = await res.json();

        if (data?.success && Array.isArray(data.data)) {
          setSalaryRanges(data.data);
        }
      } catch (err) {
        console.log("Error fetching salary ranges:", err);
      }
    };

    fetchSalaryRanges();
  }, []);
  const fetchCountry = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}get/countries`);
      setCountry(res.data.countries || []);
      console.log("candidates-search- Country Data", res.data.countries);
    } catch (error) {
      console.error("Error While Fetching Country:", error);
    }
  };

  const fetchCitiesByCountry = async (countryId) => {
    if (!countryId) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}getCitiesByCountry?countryId=${countryId}`,
      );
      const cities = response.data?.cities || [];
      setCityList(cities);

      // ✅ If editing, keep previously selected cities (if they still exist in the list)
      console.log("City data on the behalf of country", cities);
    } catch (error) {
      console.error(error);
      setCityList([]);
    }
  };
  useEffect(() => {
    fetchCountry();

    // Close city dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setShowCityOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        headers: { Authorization: `Bearer ${token}` },
        params: {
          jobId: selectedJob || undefined,
          search: search || undefined,
          status: status || undefined,
          skills:
            selectedSkills.length > 0 ? selectedSkills.join(",") : undefined,
          experience: selectedExperience || undefined,
          education: selectedEducation || undefined,
          salary: selectedSalary || undefined,
          availability: selectedAvailability || undefined,
          country: selectedCountry || undefined,
          city: selectedCity || undefined,
          sortByATS: sortByATS || undefined,
          page,
          limit: perPage,
        },
      });

      const applicants = res.data.applicants || [];

      setCandidates(applicants);
      setTotalResults(res.data.totalApplicants || 0);
      setTotalPages(res.data.pagination?.totalPages || 1);

      if (applicants.length > 0) {
        setSelectedCandidate(applicants[0]);
      } else {
        setSelectedCandidate(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchApplicants(currentPage);
}, [
  currentPage,
  selectedJob,
  status,
  search,
  selectedSkills,
  selectedExperience,
  selectedEducation,
  selectedSalary,
  selectedAvailability,
  selectedCountry,
  selectedCity,
  sortByATS,
  perPage,
]);

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
                <Link to="/all-applicants-list">
                  <i className="fa-solid fa-angle-right" /> Applicant Management
                </Link>
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}

          <div className="employer-dashboard-common-heading">
            <h2>All Applicants</h2>
          </div>
          {/*Job Applied Candidates List Start Area */}

          <section
            className="employer-candidate-filter-info-area"
            style={{ padding: "20px 0px" }}
          >
            <div className="row">
              <div className="col-12 mb-4">
                <div
                  className="employer-candidate-search-box"
                  style={{
                    display: "flex",
                    "-webkit-align-items": "center",
                    "-webkit-box-align": "center",
                    "-ms-flex-align": "center",
                    "align-items": "center",
                    background: "rgb(255, 255, 255)",
                    padding: "15px 20px",
                    "border-radius": "8px",
                    "box-shadow": "rgba(0, 0, 0, 0.05) 0px 2px 10px",
                  }}
                >
                  <div
                    className="employer-candidate-input-icon"
                    style={{
                      "-webkit-flex": "1 1 0%",
                      "-ms-flex": "1 1 0%",
                      flex: "1 1 0%",
                      display: "flex",
                      "-webkit-align-items": "center",
                      "-webkit-box-align": "center",
                      "-ms-flex-align": "center",
                      "align-items": "center",
                    }}
                  >
                    <div
                      className="employer-candidate-icon"
                      style={{
                        "margin-right": "15px",
                        color: "rgb(102, 102, 102)",
                        "font-size": "18px",
                      }}
                    >
                      <i className="fa-solid fa-magnifying-glass" />
                    </div>
                    <div
                      className="employer-candidate-input-area"
                      style={{ width: "100%" }}
                    >
                      <input
                        className="form-control"
                        placeholder="Search candidates by name, skills, or keywords..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                          border: "none",
                          background: "transparent",
                          height: "100%",
                          "font-size": "16px",
                          padding: "10px 0px",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="employer-candidate-btn-area"
                    style={{ "margin-left": "15px" }}
                  >
                    <button
                      className="default-btn btn"
                      style={{ padding: "10px 25px", "border-radius": "5px" }}
                    >
                      Find Candidate
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-12" />
            </div>
          </section>

          <div className="d-flex flex-column gap-3 mb-3 p-3 bg-white shadow-sm rounded">
            <div className="d-flex justify-content-between align-items-center w-100">
              <h3
                className="mb-0"
                style={{ "font-size": "18px", "font-weight": "bold" }}
              >
                Candidates ({totalResults || 0})
              </h3>
              <div
                className="d-flex bg-light rounded-pill p-1"
                style={{ border: "1px solid rgb(233, 236, 239)" }}
              >
                {/* All Applicants */}
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`btn btn-sm rounded-pill px-3 fw-bold ${
                    activeTab === "all"
                      ? "bg-white shadow-sm text-primary"
                      : "text-muted"
                  }`}
                  style={{
                    border: "none",
                    transition: "0.2s",
                  }}
                >
                  <i className="fa-solid fa-list me-2" />
                  All Applicants
                </button>

                {/* Applicant Summary */}
                <button
                  type="button"
                  onClick={() => setActiveTab("summary")}
                  className={`btn btn-sm rounded-pill px-3 fw-bold ${
                    activeTab === "summary"
                      ? "bg-white shadow-sm text-primary"
                      : "text-muted"
                  }`}
                  style={{
                    border: "none",
                    transition: "0.2s",
                  }}
                >
                  <i className="fa-solid fa-table me-2" />
                  Applicant Summary
                </button>
              </div>
              <div
                className="d-none d-md-block"
                style={{ width: "100px" }}
              />{" "}
            </div>
            <div className="d-flex align-items-center mb-0 pt-3 border-top px-1">
              <div
                className="d-flex align-items-center bg-light rounded-pill px-3 py-2"
                style={{ border: "1px solid rgb(233, 236, 239)" }}
              >
                <i className="fa-solid fa-briefcase text-secondary me-2" />
                <span
                  className="text-secondary fw-medium me-2"
                  style={{ "font-size": "14px" }}
                >
                  Filter by Poste:
                </span>
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="form-select border-0 bg-transparent text-dark fw-bold p-0 shadow-none"
                  style={{
                    width: "auto",
                    cursor: "pointer",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  <option value="">All Job Offers</option>

                  {jobOptions.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.jobTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div
              className="d-flex gap-2 text-muted pt-2 w-100 align-items-center justify-content-start overflow-auto"
              style={{ fontSize: "14px", scrollbarWidth: "none" }}
            >
              <span
                className="fw-bold text-dark me-2"
                style={{ whiteSpace: "nowrap" }}
              >
                Filter by Status:
              </span>

              {statusFilters.map((statusItem) => {
                const isActive = selectedFilter === statusItem;

                return (
                  <button
                    key={statusItem}
                    onClick={() => {
                      setSelectedFilter(statusItem);
                      setStatus(statusItem === "All" ? "" : statusItem); // 👈 important
                      setCurrentPage(1); // reset to first page when filtering
                    }}
                    className={`btn btn-sm rounded-pill px-3 ${
                      isActive
                        ? "btn-dark text-white"
                        : "btn-outline-light text-dark border"
                    }`}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {statusItem}
                  </button>
                );
              })}
            </div>

            <div className="w-100 mt-2">
              <button
                type="button"
                onClick={() => setShowFilter(!showFilter)}
                className={`btn btn-sm rounded-pill px-3 fw-bold shadow-sm ${
                  showFilter
                    ? "bg-primary text-white"
                    : "bg-light text-muted border"
                }`}
                style={{
                  transition: "0.2s",
                  fontSize: "13px",
                }}
              >
                <i
                  className={`fa-solid ${
                    showFilter ? "fa-minus" : "fa-filter"
                  } me-2`}
                />
                {showFilter ? "Hide Filter" : "Add Filter"}
              </button>
            </div>
            {showFilter && (
              <>
                <div className="row g-2 pt-3 border-top">
                  <div className="col-12 col-md-4 col-lg">
                    <div className="employer-candidate-filter-box">
                      <div className="single-sidebar-widget keyword">
                        <h3
                          style={{
                            "font-size": "14px",
                            "margin-bottom": "8px",
                          }}
                        >
                          Skills
                        </h3>
                        <div className="form-group">
                          {/* Input */}
                          <input
                            type="text"
                            className="form-control border-0 bg-light rounded-pill px-3 shadow-none"
                            placeholder="Type skill & press Enter"
                            value={skillInput}
                            style={{
                              fontSize: "12px",
                              height: "38px",
                            }}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && skillInput.trim()) {
                                e.preventDefault();

                                if (
                                  !selectedSkills.includes(skillInput.trim())
                                ) {
                                  setSelectedSkills((prev) => [
                                    ...prev,
                                    skillInput.trim(),
                                  ]);
                                }

                                setSkillInput("");
                              }
                            }}
                          />

                          {/* Selected Skills */}
                          {selectedSkills.length > 0 && (
                            <div className="mt-2 d-flex flex-wrap gap-2">
                              {selectedSkills.map((skill) => (
                                <span
                                  key={skill}
                                  className="d-flex align-items-center"
                                  style={{
                                    background: "#0d6efd",
                                    color: "white",
                                    borderRadius: "12px",
                                    padding: "3px 10px",
                                    fontSize: "11px",
                                  }}
                                >
                                  {skill}
                                  <span
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "6px",
                                    }}
                                    onClick={() =>
                                      setSelectedSkills((prev) =>
                                        prev.filter((s) => s !== skill),
                                      )
                                    }
                                  >
                                    ✕
                                  </span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4 col-lg">
                    <div className="employer-candidate-filter-box">
                      <div className="single-sidebar-widget keyword">
                        <h3
                          style={{
                            "font-size": "14px",
                            "margin-bottom": "8px",
                          }}
                        >
                          Experience
                        </h3>
                        <div className="form-group">
                          <select
                            value={selectedExperience}
                            onChange={(e) =>
                              setSelectedExperience(e.target.value)
                            }
                            className="form-select form-control"
                            style={{ "font-size": "13px", padding: "8px" }}
                          >
                            <option value>Level</option>
                            {seniorityLevels.map((level) => (
                              <option key={level._id} value={level._id}>
                                {level.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4 col-lg">
                    <div className="employer-candidate-filter-box">
                      <div className="single-sidebar-widget keyword">
                        <h3
                          style={{
                            "font-size": "14px",
                            "margin-bottom": "8px",
                          }}
                        >
                          Country
                        </h3>
                        <div className="form-group">
                          <select
                            className="form-select border-0 bg-light rounded-pill px-3 shadow-none"
                            style={{
                              fontSize: "12px",
                              height: "38px",
                              cursor: "pointer",
                            }}
                            value={selectedCountry || ""}
                            onChange={(e) => {
                              const selectedOption =
                                e.target.options[e.target.selectedIndex];

                              const countryId =
                                selectedOption.getAttribute("data-id"); // numeric id

                              const countryObjectId = e.target.value; // name (as before)

                              setSelectedCountry(countryObjectId);
                              setSelectedCities([]); // Reset cities when country changes

                              if (countryId) {
                                fetchCitiesByCountry(countryId);
                              } else {
                                setCityList([]);
                              }

                              setCurrentPage(1);
                            }}
                          >
                            <option value="">All Country</option>

                            {country.map((count) => (
                              <option
                                key={count._id}
                                value={count.name}
                                data-id={count.id}
                              >
                                {count.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4 col-lg">
                    <div className="employer-candidate-filter-box">
                      <div className="single-sidebar-widget keyword">
                        <h3
                          style={{
                            "font-size": "14px",
                            "margin-bottom": "8px",
                          }}
                        >
                          City
                        </h3>
                        <div className="form-group">
                          <select
                            className="form-select border-0 bg-light rounded-pill px-3 shadow-none"
                            style={{
                              fontSize: "12px",
                              height: "38px",
                              cursor: "pointer",
                            }}
                            value={selectedCity || ""}
                            onChange={(e) => {
                              setSelectedCity(e.target.value);
                              setCurrentPage(1);
                            }}
                            disabled={!selectedCountry} // disable if no country selected
                          >
                            <option value="">All Cities</option>

                            {cityList.map((city) => (
                              <option key={city._id} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4 col-lg">
                    <div className="employer-candidate-filter-box">
                      <div className="single-sidebar-widget keyword">
                        <h3
                          style={{
                            "font-size": "14px",
                            "margin-bottom": "8px",
                          }}
                        >
                          Education
                        </h3>
                        <div className="form-group">
                          <select
                            value={selectedEducation}
                            onChange={(e) =>
                              setSelectedEducation(e.target.value)
                            }
                            className="form-select form-control"
                            style={{ "font-size": "13px", padding: "8px" }}
                          >
                            <option value>Any</option>
                            {educationLevels.map((edu) => (
                              <option key={edu} value={edu}>
                                {edu}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4 col-lg">
                    <div className="employer-candidate-filter-box">
                      <div className="single-sidebar-widget keyword">
                        <h3
                          style={{
                            "font-size": "14px",
                            "margin-bottom": "8px",
                          }}
                        >
                          Salary
                        </h3>
                        <div className="form-group">
                          <select
                            value={selectedSalary}
                            onChange={(e) => setSelectedSalary(e.target.value)}
                            className="form-select form-control"
                            style={{ "font-size": "13px", padding: "8px" }}
                          >
                            <option value>Any</option>
                            {salaryRanges.map((item) => (
                              <option key={item._id} value={item.range}>
                                {item.range}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4 col-lg">
                    <div className="employer-candidate-filter-box">
                      <div className="single-sidebar-widget keyword">
                        <h3
                          style={{
                            "font-size": "14px",
                            "margin-bottom": "8px",
                          }}
                        >
                          Availability
                        </h3>
                        <div className="form-group">
                          <select
                            value={selectedAvailability}
                            onChange={(e) =>
                              setSelectedAvailability(e.target.value)
                            }
                            className="form-select form-control"
                            style={{ "font-size": "13px", padding: "8px" }}
                          >
                            <option value="">Any Status</option>
                            <option value="Immediate">Immediate</option>
                            <option value="Notice">With Notice</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    className="btn btn-primary btn-sm px-5"
                    style={{ "font-size": "14px", height: "38px" }}
                    // onClick={() => {
                    //   setCurrentPage(1);
                    //   fetchApplicants(1);
                    // }}
                  >
                    Apply Filter
                  </button>
                </div>
              </>
            )}
          </div>

          {activeTab === "all" && (
            <section
              className="employer-candidate-info-area"
              style={{ padding: "0px 20px 40px" }}
            >
              <div className="row">
                <div className="col-lg-4">
                  <div className="card shadow-sm border-0 mb-3">
                    <div className="card-body p-2">
                      <select
                        className="form-select border-0 text-muted"
                        style={{ "font-size": "14px" }}
                      >
                        <option value="desc">ATS Score: High to Low</option>
                        <option value="asc">ATS Score: Low to High</option>
                      </select>
                    </div>
                  </div>
                  <div
                    className="candidate-list-scroll"
                    style={{ maxHeight: "800px", overflowY: "auto" }}
                  >
                    {candidates.map((item) => {
                      const profile = item.userId?.candidateProfile;
                      const about = profile?.aboutRole;
                      const ats = item?.ats;
                      // ATS color logic
                      const atsColor =
                        ats?.percentage >= 70
                          ? "rgb(25, 135, 84)" // green
                          : ats?.percentage >= 40
                            ? "rgb(255, 193, 7)" // yellow
                            : "rgb(220, 53, 69)"; // red

                      return (
                        <div
                          key={item._id}
                          onClick={() => setSelectedCandidate(item)} // 👈 ADD THIS
                          className="card mb-2 border-0 shadow-sm"
                          style={{
                            cursor: "pointer",
                            borderLeft:
                              selectedCandidate?._id === item._id
                                ? "4px solid #0d6efd"
                                : "4px solid transparent",
                            background:
                              selectedCandidate?._id === item._id
                                ? "#f8f9ff"
                                : "#fff",
                            transition: "0.2s",
                          }}
                        >
                          <div className="card-body p-3">
                            <div className="d-flex align-items-start">
                              {/* IMAGE */}
                              <img
                                crossOrigin="anonymous"
                                alt="user"
                                className="rounded-circle me-3"
                                src={
                                  cleanImageUrl(item.userId?.profileImage) ||
                                  "assets/images/userIcon.png"
                                }
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />

                              <div className="flex-grow-1">
                                {/* NAME + BOOKMARK */}
                                <div className="d-flex justify-content-between">
                                  <h6 className="mb-1 fw-bold">
                                    {item.userId?.first_name}{" "}
                                    {item.userId?.last_name}
                                  </h6>

                                  {/* STATIC FOLDER DROPDOWN */}
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-outline-warning rounded-circle dropdown-toggle no-caret"
                                      data-bs-toggle="dropdown"
                                      style={{
                                        width: 32,
                                        height: 32,
                                        padding: 0,
                                      }}
                                    >
                                      <i className="fa-regular fa-bookmark" />
                                    </button>

                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                      <li>
                                        <h6 className="dropdown-header">
                                          Add to Folder
                                        </h6>
                                      </li>

                                      <li>
                                        <button className="dropdown-item">
                                          React Developer
                                        </button>
                                      </li>
                                      <li>
                                        <button className="dropdown-item">
                                          Backend Developer
                                        </button>
                                      </li>
                                      <li>
                                        <button className="dropdown-item">
                                          UI/UX Designer
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>

                                {/* JOB TITLE */}
                                <p
                                  className="mb-1 text-muted"
                                  style={{ fontSize: "12px" }}
                                >
                                  {about?.jobTitle || item.jobId?.jobTitle}
                                </p>

                                {/* EXPERIENCE + STATUS */}
                                <div
                                  className="d-flex align-items-center gap-2 mb-1"
                                  style={{ fontSize: "12px" }}
                                >
                                  <span className="text-primary fw-bold">
                                    {about?.yearOfExperience || 0} Years
                                  </span>

                                  <span className="text-muted">•</span>

                                  <span
                                    className="badge bg-secondary"
                                    style={{ fontSize: "10px" }}
                                  >
                                    {item.status}
                                  </span>
                                </div>

                                {/* ATS MATCH */}
                                <div className="d-flex flex-column gap-1 mt-2">
                                  <span
                                    className="fw-bold text-muted"
                                    style={{ fontSize: "10px" }}
                                  >
                                    ATS Match
                                  </span>

                                  <div className="d-flex align-items-center gap-2">
                                    <div
                                      className="progress flex-grow-1"
                                      style={{
                                        height: "6px",
                                        backgroundColor: "#e9ecef",
                                      }}
                                    >
                                      <div
                                        className="progress-bar rounded"
                                        role="progressbar"
                                        style={{
                                          width: `${ats?.percentage || 0}%`,
                                          backgroundColor: atsColor,
                                        }}
                                      />
                                    </div>

                                    <span
                                      className="fw-bold"
                                      style={{ color: atsColor }}
                                    >
                                      {ats?.percentage || 0}%
                                    </span>
                                  </div>
                                </div>

                                {/* CITY */}
                                <div
                                  className="mt-2 text-muted"
                                  style={{ fontSize: "11px" }}
                                >
                                  <i className="fa-solid fa-location-dot me-1" />
                                  {item.userId?.city || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {selectedCandidate ? (
                  <div className="col-lg-8">
                    <div
                      className="card border-0 shadow-sm"
                      style={{ "min-height": "600px" }}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex flex-column flex-md-row gap-4 mb-4 border-bottom pb-4">
                          <img
                            alt="profile"
                            className="rounded"
                            src="https://randomuser.me/api/portraits/men/23.jpg"
                            style={{
                              width: "120px",
                              height: "120px",
                              "object-fit": "cover",
                            }}
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h4 className="fw-bold mb-1">
                                  {selectedCandidate?.userId?.first_name}{" "}
                                  {selectedCandidate?.userId?.last_name}
                                </h4>
                                <p className="text-muted mb-2">
                                  {selectedCandidate?.jobId?.jobTitle || "N/A"}
                                </p>
                              </div>
                              <div className="d-flex gap-2">
                                <button className="btn btn-primary btn-sm">
                                  <i className="fa-solid fa-download me-1" />{" "}
                                  Download CV
                                </button>
                                <a
                                  href="https://www.linkedin.com/in/candidate-gonzalez"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                                  title="LinkedIn Profile"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    padding: "0px",
                                  }}
                                >
                                  <i className="fa-brands fa-linkedin-in" />
                                </a>
                                <div className="dropdown">
                                  <button
                                    className="btn btn-outline-warning rounded-circle d-flex align-items-center justify-content-center dropdown-toggle no-caret"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    title="Bookmark Candidate"
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      padding: "0px",
                                    }}
                                  >
                                    <i className="fa-regular fa-bookmark" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                    <li>
                                      <h6 className="dropdown-header">
                                        Add to Folder
                                      </h6>
                                    </li>
                                    <li>
                                      <button className="dropdown-item d-flex align-items-center gap-2">
                                        <i className="fa-solid fa-folder text-warning" />
                                        <div
                                          className="d-flex flex-column"
                                          style={{ "line-height": "1.2" }}
                                        >
                                          <span
                                            className="fw-bold"
                                            style={{ "font-size": "12px" }}
                                          >
                                            Job Application
                                          </span>
                                          <span
                                            className="text-muted"
                                            style={{ "font-size": "10px" }}
                                          >
                                            DevOps Engineer
                                          </span>
                                        </div>
                                      </button>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <h6 className="dropdown-header">
                                        Manual Folders
                                      </h6>
                                    </li>
                                    <li>
                                      <button className="dropdown-item d-flex align-items-center gap-2">
                                        <i className="fa-regular fa-folder" />
                                        <span style={{ "font-size": "13px" }}>
                                          React Developer
                                        </span>
                                      </button>
                                    </li>
                                    <li>
                                      <button className="dropdown-item d-flex align-items-center gap-2">
                                        <i className="fa-regular fa-folder" />
                                        <span style={{ "font-size": "13px" }}>
                                          Backend Senior Developer
                                        </span>
                                      </button>
                                    </li>
                                    <li>
                                      <button className="dropdown-item d-flex align-items-center gap-2">
                                        <i className="fa-regular fa-folder" />
                                        <span style={{ "font-size": "13px" }}>
                                          UI/UX Designer
                                        </span>
                                      </button>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <button className="dropdown-item text-primary">
                                        <i className="fa-solid fa-plus me-2" />
                                        Create New Folder
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div
                              className="row g-2 mt-2"
                              style={{ "font-size": "13px" }}
                            >
                              <div className="col-md-6">
                                <strong>Address:</strong> Remote
                              </div>
                              <div className="col-md-6 d-flex align-items-center">
                                <strong
                                  className="me-2"
                                  style={{ "min-width": "70px" }}
                                >
                                  ATS Match:
                                </strong>
                                <div className="d-flex align-items-center flex-grow-1 gap-2">
                                  <div
                                    className="progress flex-grow-1"
                                    style={{
                                      height: "8px",
                                      "background-color": "rgb(233, 236, 239)",
                                    }}
                                  >
                                    <div
                                      className="progress-bar rounded"
                                      role="progressbar"
                                      style={{
                                        width: "97%",
                                        "background-color": "rgb(25, 135, 84)",
                                      }}
                                    />
                                  </div>
                                  <span
                                    className="fw-bold"
                                    style={{
                                      "font-size": "12px",
                                      color: "rgb(25, 135, 84)",
                                    }}
                                  >
                                    97%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div
                              className="row g-2 mt-1"
                              style={{ "font-size": "13px" }}
                            >
                              <div className="col-12">
                                <button
                                  className="btn btn-light btn-sm w-auto border text-muted"
                                  style={{
                                    "font-size": "11px",
                                    padding: "2px 8px",
                                  }}
                                >
                                  <i className="fa-regular fa-eye me-1" />
                                  Afficher les coordonnées
                                </button>
                              </div>
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-3">
                              <span className="badge bg-light text-dark border px-2 py-1 user-select-none">
                                React
                              </span>
                              <span className="badge bg-light text-dark border px-2 py-1 user-select-none">
                                Design
                              </span>
                              <span className="badge bg-light text-dark border px-2 py-1 user-select-none">
                                SQL
                              </span>
                              <span className="badge bg-light text-dark border px-2 py-1 user-select-none">
                                AWS
                              </span>
                              <span className="badge bg-light text-dark border px-2 py-1 user-select-none">
                                Node.js
                              </span>
                            </div>
                            <div className="mt-4 mb-2">
                              <h6 className="fw-bold mb-3">
                                Recruitment Process
                              </h6>

                              <div className="d-flex justify-content-between align-items-center position-relative">
                                {/* Progress Line */}
                                <div
                                  className="position-absolute"
                                  style={{
                                    top: "15px",
                                    left: 0,
                                    right: 0,
                                    height: "2px",
                                    background: "#e9ecef",
                                    zIndex: 0,
                                  }}
                                />

                                {recruitmentSteps.map((step, index) => {
                                  const currentIndex =
                                    recruitmentSteps.indexOf(currentStatus);

                                  const isCompleted = index < currentIndex;
                                  const isActive = index === currentIndex;

                                  let bgColor = "#fff";
                                  let borderColor = "#dee2e6";
                                  let textColor = "#6c757d";
                                  let fontWeight = "normal";

                                  if (isCompleted) {
                                    bgColor = "#198754";
                                    borderColor = "#198754";
                                    textColor = "#6c757d";
                                  }

                                  if (isActive) {
                                    bgColor = "#0d6efd";
                                    borderColor = "#0d6efd";
                                    textColor = "#0d6efd";
                                    fontWeight = "bold";
                                  }

                                  return (
                                    <div
                                      key={step}
                                      onClick={() => setCurrentStatus(step)} // 👈 CLICK STEP TO CHANGE
                                      className="d-flex flex-column align-items-center position-relative"
                                      style={{
                                        zIndex: 1,
                                        cursor: "pointer",
                                        width: "14%",
                                      }}
                                    >
                                      <div
                                        className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                        style={{
                                          width: 32,
                                          height: 32,
                                          backgroundColor: bgColor,
                                          border: `2px solid ${borderColor}`,
                                          transition: "0.3s",
                                        }}
                                      >
                                        {isCompleted ? (
                                          <i
                                            className="fa-solid fa-check"
                                            style={{
                                              color: "#fff",
                                              fontSize: "12px",
                                            }}
                                          />
                                        ) : isActive ? (
                                          <span
                                            style={{
                                              width: 8,
                                              height: 8,
                                              backgroundColor: "#fff",
                                              borderRadius: "50%",
                                            }}
                                          />
                                        ) : (
                                          <span
                                            style={{
                                              width: 8,
                                              height: 8,
                                              backgroundColor: "#dee2e6",
                                              borderRadius: "50%",
                                            }}
                                          />
                                        )}
                                      </div>

                                      <span
                                        className="mt-2 text-center"
                                        style={{
                                          fontSize: "10px",
                                          fontWeight,
                                          color: textColor,
                                        }}
                                      >
                                        {step}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-3">
                              <div className="dropdown">
                                <button
                                  className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                >
                                  {currentStatus}
                                </button>

                                <ul className="dropdown-menu">
                                  {recruitmentSteps.map((step) => (
                                    <li key={step}>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => setCurrentStatus(step)} // 👈 CHANGE STATUS
                                      >
                                        {step}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <button className="btn btn-warning text-white btn-sm">
                                <i className="fa-solid fa-envelope me-1" /> Send
                                Message
                              </button>
                            </div>
                          </div>
                        </div>
                        <div
                          className="detail-sections"
                          style={{
                            "max-height": "500px",
                            overflow: "hidden auto",
                          }}
                        >
                          <div className="mb-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                              Professional Summary
                            </h5>
                            <p className="text-muted">
                              Experienced Backend Engineer with over 7 years of
                              experience in the industry. Passionate about
                              building scalable applications and working in
                              agile teams.
                            </p>
                          </div>
                          <div className="mb-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                              Experience
                            </h5>
                            <div className="mb-3">
                              <h6 className="fw-bold mb-0">
                                Senior Developer{" "}
                                <span className="text-muted fw-normal">
                                  at Tech Solutions Inc.
                                </span>
                              </h6>
                              <small className="text-primary d-block mb-1">
                                2019 - Present
                              </small>
                              <p className="text-muted small mb-0">
                                Leading the frontend team and architecting
                                scalable solutions.
                              </p>
                            </div>
                            <div className="mb-3">
                              <h6 className="fw-bold mb-0">
                                Junior Developer{" "}
                                <span className="text-muted fw-normal">
                                  at WebCorp
                                </span>
                              </h6>
                              <small className="text-primary d-block mb-1">
                                2016 - 2018
                              </small>
                              <p className="text-muted small mb-0">
                                Developed and maintained client websites using
                                React and Node.js.
                              </p>
                            </div>
                          </div>
                          <div className="mb-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                              Education
                            </h5>
                            <div className="mb-3">
                              <h6 className="fw-bold mb-0">
                                B.Sc. in Computer Science
                              </h6>
                              <small className="text-muted">
                                University of Technology, 2015
                              </small>
                            </div>
                          </div>
                          <div className="mb-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                              Languages
                            </h5>
                            <div className="d-flex gap-2">
                              <span className="badge bg-secondary">
                                English
                              </span>
                              <span className="badge bg-secondary">French</span>
                              <span className="badge bg-secondary">
                                Spanish
                              </span>
                            </div>
                          </div>
                          <div className="mb-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                              Skills
                            </h5>
                            <div className="d-flex flex-wrap gap-2">
                              <span className="badge bg-light text-dark border">
                                React
                              </span>
                              <span className="badge bg-light text-dark border">
                                Design
                              </span>
                              <span className="badge bg-light text-dark border">
                                SQL
                              </span>
                              <span className="badge bg-light text-dark border">
                                AWS
                              </span>
                              <span className="badge bg-light text-dark border">
                                Node.js
                              </span>
                            </div>
                          </div>
                          <div className="mb-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                              Career Goals
                            </h5>
                            <div className="row">
                              <div className="col-md-6 mb-2">
                                <label className="fw-bold d-block text-muted small">
                                  Desired Job Title
                                </label>
                                <p>Data Scientist</p>
                              </div>
                              <div className="col-md-6 mb-2">
                                <label className="fw-bold d-block text-muted small">
                                  Desired Salary
                                </label>
                                <p>54k</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-center text-muted">
                    No candidate selected
                  </div>
                )}
              </div>
            </section>
          )}
          {activeTab === "summary" && (
            <section
              className="employer-candidate-info-area w-100"
              style={{
                padding: "0px",
                display: "flex",
                "-webkit-flex-direction": "column",
                "-ms-flex-direction": "column",
                "flex-direction": "column",
                "-webkit-align-items": "flex-start",
                "-webkit-box-align": "flex-start",
                "-ms-flex-align": "flex-start",
                "align-items": "flex-start",
                "-webkit-box-pack": "start",
                "-webkit-justify-content": "flex-start",
                "-ms-flex-pack": "start",
                "justify-content": "flex-start",
              }}
            >
              <div className="card border-0 shadow-sm rounded-0 w-100">
                <div className="card-body p-0">
                  <div className="table-responsive w-100">
                    <table
                      className="table table-hover align-top mb-0 w-100"
                      style={{ "font-size": "14px" }}
                    >
                      <thead
                        style={{
                          "background-color": "rgb(243, 122, 71)",
                          color: "white",
                        }}
                      >
                        <tr>
                          <th
                            className="py-3 ps-4 text-start"
                            style={{
                              "background-color": "rgb(243, 122, 71)",
                              color: "white",
                              border: "none",
                              width: "25%",
                            }}
                          >
                            Job Title
                          </th>
                          <th
                            className="py-3 text-start"
                            style={{
                              "background-color": "rgb(243, 122, 71)",
                              color: "white",
                              border: "none",
                            }}
                          >
                            Candidate Name
                          </th>
                          <th
                            className="py-3 text-start"
                            style={{
                              "background-color": "rgb(243, 122, 71)",
                              color: "white",
                              border: "none",
                            }}
                          >
                            CV Title / Position
                          </th>
                          <th
                            className="py-3 text-center"
                            style={{
                              "background-color": "rgb(243, 122, 71)",
                              color: "white",
                              border: "none",
                            }}
                          >
                            Experience
                          </th>
                          <th
                            className="py-3 text-center"
                            style={{
                              "background-color": "rgb(243, 122, 71)",
                              color: "white",
                              border: "none",
                            }}
                          >
                            Applied Date
                          </th>
                          <th
                            className="py-3 text-center"
                            style={{
                              "background-color": "rgb(243, 122, 71)",
                              color: "white",
                              border: "none",
                            }}
                          >
                            Country
                          </th>
                          <th
                            className="py-3 text-center"
                            style={{
                              "background-color": "rgb(243, 122, 71)",
                              color: "white",
                              border: "none",
                            }}
                          >
                            Status
                          </th>
                          <th
                            className="py-3 pe-4 text-end"
                            style={{
                              "background-color": "rgb(243, 122, 71)",
                              color: "white",
                              border: "none",
                            }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((item) => {
                          const profile = item.userId?.candidateProfile;
                          const about = profile?.aboutRole;
                          const ats = item?.ats;

                          const atsColor =
                            ats?.percentage >= 70
                              ? "rgb(25, 135, 84)"
                              : ats?.percentage >= 40
                                ? "rgb(255, 193, 7)"
                                : "rgb(220, 53, 69)";

                          const currentIndex = recruitmentSteps.indexOf(
                            item.status,
                          );

                          return (
                            <React.Fragment key={item._id}>
                              {/* MAIN ROW */}
                              <tr style={{ borderBottom: "1px solid #eee" }}>
                                {/* JOB TITLE */}
                                <td className="ps-4 py-3">
                                  <div className="fw-bold text-dark">
                                    {item.jobId?.jobTitle}
                                  </div>

                                  {/* ATS */}
                                  <div
                                    className="d-flex align-items-center gap-2 mt-1"
                                    style={{ maxWidth: "150px" }}
                                  >
                                    <span
                                      className="fw-bold text-muted"
                                      style={{ fontSize: "10px" }}
                                    >
                                      ATS:
                                    </span>

                                    <div
                                      className="progress flex-grow-1"
                                      style={{
                                        height: "4px",
                                        backgroundColor: "#e9ecef",
                                      }}
                                    >
                                      <div
                                        className="progress-bar rounded"
                                        style={{
                                          width: `${ats?.percentage || 0}%`,
                                          backgroundColor: atsColor,
                                        }}
                                      />
                                    </div>

                                    <span
                                      className="fw-bold"
                                      style={{
                                        fontSize: "10px",
                                        color: atsColor,
                                      }}
                                    >
                                      {ats?.percentage || 0}%
                                    </span>
                                  </div>

                                  {/* EXPAND BUTTON */}
                                  <div
                                    className="d-flex align-items-center gap-1 mt-1"
                                    style={{
                                      cursor: "pointer",
                                      maxWidth: "150px",
                                    }}
                                    onClick={() => {
                                      setExpandedRows(
                                        (prev) =>
                                          prev.includes(item._id)
                                            ? prev.filter(
                                                (id) => id !== item._id,
                                              ) // close
                                            : [...prev, item._id], // open
                                      );
                                    }}
                                  >
                                    <span
                                      className="fw-bold text-muted"
                                      style={{ fontSize: "10px" }}
                                    >
                                      Recruitment Process
                                    </span>

                                    <i
                                      className={`fa-solid ${
                                        expandedRows.includes(item._id)
                                          ? "fa-chevron-up"
                                          : "fa-chevron-down"
                                      }`}
                                      style={{
                                        fontSize: "10px",
                                        color: "#6c757d",
                                      }}
                                    />
                                  </div>
                                </td>

                                {/* NAME */}
                                <td className="py-3">
                                  <div className="d-flex align-items-center">
                                    <img
                                      alt="user"
                                      className="rounded-circle me-2"
                                      src={
                                        cleanImageUrl(
                                          item.userId?.profileImage,
                                        ) || "assets/images/userIcon.png"
                                      }
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                        objectFit: "cover",
                                      }}
                                    />
                                    {item.userId?.first_name}{" "}
                                    {item.userId?.last_name}
                                  </div>
                                </td>

                                {/* CV TITLE */}
                                <td className="py-3 text-muted text-start">
                                  {about?.jobTitle || item.jobId?.jobTitle}
                                </td>

                                {/* EXPERIENCE */}
                                <td className="py-3 text-center">
                                  {about?.yearOfExperience || 0} Years
                                </td>

                                {/* APPLIED DATE */}
                                <td className="py-3 text-secondary text-center">
                                  {new Date(
                                    item.createdAt,
                                  ).toLocaleDateString()}
                                </td>

                                {/* CITY */}
                                <td className="py-3 text-center">
                                  {item.userId?.city || "N/A"}
                                </td>

                                {/* STATUS */}
                                <td className="py-3 text-center">
                                  <div className="dropdown d-inline-block">
                                    <button
                                      className="btn btn-outline-secondary btn-sm dropdown-toggle w-100"
                                      data-bs-toggle="dropdown"
                                      style={{
                                        minWidth: "120px",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {item.status}
                                    </button>

                                    <ul className="dropdown-menu">
                                      {recruitmentSteps.map((step) => (
                                        <li key={step}>
                                          <button
                                            className="dropdown-item"
                                            style={{ fontSize: "12px" }}
                                            onClick={() =>
                                              handleStatusChange(item._id, step)
                                            }
                                          >
                                            {step}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </td>

                                {/* ACTION */}
                                <td className="pe-4 py-3 text-end">
                                  <button className="btn btn-light btn-sm rounded-circle">
                                    <i className="fa-solid fa-ellipsis" />
                                  </button>
                                </td>
                              </tr>

                              {/* EXPANDED ROW */}
                              {expandedRows.includes(item._id) && (
                                <tr>
                                  <td
                                    colSpan={8}
                                    className="px-4 pb-4 pt-0 border-bottom"
                                    style={{ backgroundColor: "transparent" }}
                                  >
                                    <div className="mt-2 p-3 bg-light rounded">
                                      <h6
                                        className="fw-bold mb-3"
                                        style={{ fontSize: "12px" }}
                                      >
                                        Recruitment Process
                                      </h6>

                                      <div className="d-flex justify-content-between align-items-center position-relative px-3">
                                        {/* SAME GRAY LINE */}
                                        <div
                                          className="position-absolute"
                                          style={{
                                            top: "15px",
                                            left: "20px",
                                            right: "20px",
                                            height: "2px",
                                            background: "#e9ecef",
                                            zIndex: 0,
                                          }}
                                        />

                                        {recruitmentSteps.map((step, index) => {
                                          const currentIndex =
                                            recruitmentSteps.indexOf(
                                              item.status,
                                            );

                                          const isCompleted =
                                            index < currentIndex;
                                          const isActive =
                                            index === currentIndex;

                                          let bgColor = "#fff";
                                          let borderColor = "#dee2e6";
                                          let textColor = "#6c757d";
                                          let fontWeight = "normal";

                                          if (isCompleted) {
                                            bgColor = "#198754";
                                            borderColor = "#198754";
                                          }

                                          if (isActive) {
                                            bgColor = "#0d6efd";
                                            borderColor = "#0d6efd";
                                            textColor = "#0d6efd";
                                            fontWeight = "bold";
                                          }

                                          return (
                                            <div
                                              key={step}
                                              onClick={() =>
                                                handleStatusChange(
                                                  item._id,
                                                  step,
                                                )
                                              }
                                              className="d-flex flex-column align-items-center position-relative"
                                              style={{
                                                zIndex: 1,
                                                cursor: "pointer",
                                                width: "14%",
                                              }}
                                            >
                                              <div
                                                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                                style={{
                                                  width: 28,
                                                  height: 28,
                                                  backgroundColor: bgColor,
                                                  border: `2px solid ${borderColor}`,
                                                  transition: "0.3s",
                                                }}
                                              >
                                                {isCompleted ? (
                                                  <i
                                                    className="fa-solid fa-check"
                                                    style={{
                                                      color: "#fff",
                                                      fontSize: "10px",
                                                    }}
                                                  />
                                                ) : isActive ? (
                                                  <span
                                                    style={{
                                                      width: 6,
                                                      height: 6,
                                                      backgroundColor: "#fff",
                                                      borderRadius: "50%",
                                                    }}
                                                  />
                                                ) : (
                                                  <span
                                                    style={{
                                                      width: 6,
                                                      height: 6,
                                                      backgroundColor:
                                                        "#dee2e6",
                                                      borderRadius: "50%",
                                                    }}
                                                  />
                                                )}
                                              </div>

                                              <span
                                                className="mt-2 text-center"
                                                style={{
                                                  fontSize: "9px",
                                                  fontWeight,
                                                  color: textColor,
                                                }}
                                              >
                                                {step}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}
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
