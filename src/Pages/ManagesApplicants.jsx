import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
function ManagesApplicants() {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const cityDropdownRef = useRef(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [seniorityLevels, setSeniorityLevels] = useState([]);
  const [showContact, setShowContact] = useState(false);
  const [companyJobs, setCompanyJobs] = useState([]);

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
  // const [showCityOptions, setShowCityOptions] = useState(false);
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
  // const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [showCityOptions, setShowCityOptions] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(6); // default
  const [totalResults, setTotalResults] = useState(0);
  const statusFilters = [
    { label: "All", value: "" },
    { label: "New", value: "Applied" },
    { label: "Pré-sélectionné", value: "Preselected" }, // ✅ FIXED
    { label: "Contacted", value: "Contacted" },
    { label: "HR Interview", value: "HR Interview" },
    { label: "Tech Interview", value: "Technical Interview" },
    { label: "Offer", value: "Offered" },
    { label: "Recruté", value: "Hired" },
    { label: "Rejeté", value: "Rejected" },
  ];
  useEffect(() => {
    if (location.state?.jobId) {
      setSelectedJob(location.state.jobId);
      setActiveTab("all"); // optional if needed
    }
  }, [location.state]);

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

  // const [currentStatus, setCurrentStatus] = useState("");
  const [currentStatus, setCurrentStatus] = useState(
    selectedCandidate?.status || "New",
  );
  useEffect(() => {
    if (selectedCandidate?.status) {
      setCurrentStatus(selectedCandidate.status);
    }
  }, [selectedCandidate]);

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
  const handleViewFromTable = (candidate) => {
    // 1. Switch tab
    setActiveTab("all");

    // 2. Set selected candidate
    setSelectedCandidate(candidate);

    // 3. Optional: scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTableStatusUpdate = async (value, applicationId, jobId) => {
    try {
      await axios.post(
        `${API_BASE_URL}updateApplicationStatus`,
        {
          jobId: jobId?._id || jobId,
          applicationId: applicationId,
          newStatus: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(`Candidate status updated to ${value}`);

      // Update UI instantly (without refresh)
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate._id === applicationId
            ? { ...candidate, status: value }
            : candidate,
        ),
      );
    } catch (error) {
      console.error("Update Status Error:", error);
      toast.error("Failed to update status");
    }
  };

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
  const fetchCompanyJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getCompanyJobsFilterList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        setCompanyJobs(res.data.jobs || []);
      }
    } catch (error) {
      console.error("Error fetching company jobs:", error);
      toast.error("Failed to load job list");
    }
  };
  useEffect(() => {
    fetchCompanyJobs();
  }, []);

  const fetchCitiesByCountry = async (countryId) => {
    if (!countryId) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}getCitiesByCountry?countryId=${countryId}`,
      );
      const cities = response.data?.cities || [];
      setCityList(cities);

      // ✅ If editing, keep previously selected cities (if they still exist in the list)
      // console.log("City data on the behalf of country", cities);
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

  const filters = {
    selectedJob,
    status,
    selectedSkills,
    selectedExperience,
    selectedEducation,
    selectedSalary,
    selectedAvailability,
    selectedCountry,
    selectedCity,
    sortByATS,
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const fetchApplicants = async (
    page = 1,
    customFilters = filters,
    customSearch = search,
  ) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE_URL}getAllApplicantsPerCompany`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          // 🔎 Search
          search: customSearch || undefined,

          // 🔽 Filters
          skills:
            customFilters.selectedSkills?.length > 0
              ? customFilters.selectedSkills.join(",")
              : undefined,
          experience: customFilters.selectedExperience || undefined,
          education: customFilters.selectedEducation || undefined,
          salary: customFilters.selectedSalary || undefined,
          availability: customFilters.selectedAvailability || undefined,
          country: customFilters.selectedCountry || undefined,
          city: customFilters.selectedCity || undefined,
          status: customFilters.status || undefined,
          jobId: customFilters.selectedJob || undefined,
          sortByATS: customFilters.sortByATS || undefined, // ✅ ADD THIS

          page,
          limit: perPage,
        },
      });

      const applicants = res.data.applicants || [];

      // ✅ Set Data
      setCandidates(applicants);
      setTotalResults(res.data.totalApplicants || 0);
      setTotalPages(res.data.pagination?.totalPages || 1);

      // ✅ Auto select first candidate
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
  const getResumeUrl = () => {
    const { coverLetter, cv, customResume } = selectedCandidate || {};
    console.log(selectedCandidate);
    if (coverLetter) return coverLetter;
    if (cv) return cv;
    if (customResume) return customResume;

    return null;
  };
  useEffect(() => {
    if (!selectedCandidate && candidates?.length > 0) {
      setSelectedCandidate(candidates[0]);
    }

    if (candidates.length === 0) {
      setSelectedCandidate(null);
    }
  }, [candidates]);

  const handleStatusUpdate = async (value) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}updateApplicationStatus`,
        {
          jobId: selectedCandidate?.jobId?._id || selectedCandidate?.jobId,
          applicationId: selectedCandidate?._id,
          newStatus: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ✅ Update UI instantly
      setCurrentStatus(value);

      // ✅ Update selectedCandidate locally
      setSelectedCandidate((prev) => ({
        ...prev,
        status: value,
      }));

      toast.success(`Candidate status updated to ${value}`);

      // Refresh list
      fetchApplicants(currentPage);
    } catch (error) {
      console.error("Update Status Error:", error);
      toast.error("Failed to update status");
    }
  };
  const handleResetFilters = () => {
    const resetValues = {
      selectedSkills: [],
      selectedExperience: "",
      selectedEducation: "",
      selectedSalary: "",
      selectedAvailability: "",
      selectedCountry: "",
      selectedCity: "",
      status: "",
      selectedJob: "",
    };

    setSearch(""); // if you have search state
    fetchApplicants(1, resetValues, ""); // reload data
  };
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("You need to log in first.");
            return;
          }

          const response = await axios.post(
            `${API_BASE_URL}deleteApplicant/${id}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (response.data.success) {
            toast.success(response.data.message);

            // ✅ Remove candidate from list instantly
            setCandidates((prev) =>
              prev.filter((candidate) => candidate._id !== id),
            );

            // ✅ If deleted candidate was selected → select next
            if (selectedCandidate?._id === id) {
              const remaining = candidates.filter((c) => c._id !== id);
              setSelectedCandidate(remaining[0] || null);
            }

            // ❌ REMOVE THIS (causes refresh)
            // fetchApplicants();
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete applicant");
        }
      }
    });
  };

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

          <section className="employer-candidate-filter-info-area">
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
                      onClick={() => {
                        setCurrentPage(1);
                        fetchApplicants(1); // ✅ CALL API
                      }}
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
                  onChange={(e) => {
                    setSelectedJob(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-select border-0 bg-transparent text-dark fw-bold p-0 shadow-none"
                  style={{
                    width: "auto",
                    cursor: "pointer",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  <option value="">All Job Offers</option>

                  {companyJobs.map((job) => (
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
                const isActive = selectedFilter === statusItem.label;

                return (
                  <button
                    key={statusItem}
                    onClick={() => {
                      setSelectedFilter(statusItem.label);
                      setStatus(statusItem.value); // ✅ send correct API value
                      setCurrentPage(1);
                    }}
                    className={`btn btn-sm rounded-pill px-3 ${
                      isActive
                        ? "btn-dark text-white"
                        : "btn-outline-light text-dark border"
                    }`}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {statusItem.label}
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
                              <option key={level._id} value={level.name}>
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
                            style={{ fontSize: "13px", padding: "8px" }}
                          >
                            <option value="">Any Status</option>
                            <option value="Immediate">Immediate</option>
                            <option value="15 Days">15 Days</option>
                            <option value="30 Days">30 Days</option>
                            <option value="45 Days">45 Days</option>
                            <option value="60 Days">60 Days</option>
                            <option value="90 Days">90 Days</option>
                            <option value="Negotiable">Negotiable</option>
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
                    onClick={() => {
                      const newFilters = {
                        selectedJob,
                        status,
                        selectedSkills,
                        selectedExperience,
                        selectedEducation,
                        selectedSalary,
                        selectedAvailability,
                        selectedCountry,
                        selectedCity,
                        sortByATS,
                      };

                      setCurrentPage(1);
                      fetchApplicants(1, newFilters);
                    }}
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
                        value={sortByATS}
                        onChange={(e) => {
                          setSortByATS(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="form-select border-0 text-muted"
                        style={{ fontSize: "14px" }}
                      >
                        <option value="">Sort By ATS</option>
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
                            crossOrigin="anonymous"
                            alt="profile"
                            className="rounded"
                            src={
                              cleanImageUrl(
                                selectedCandidate.userId?.profileImage,
                              ) || "assets/images/userIcon.png"
                            }
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
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const fileUrl = getResumeUrl();

                                    if (!fileUrl) {
                                      toast.error("No resume uploaded");
                                      return;
                                    }

                                    // open in new tab
                                    window.open(
                                      `${API_IMAGE_URL}${fileUrl}`,
                                      "_blank",
                                    );
                                  }}
                                >
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
                                <strong>Address:</strong>{" "}
                                {selectedCandidate?.userId?.city &&
                                selectedCandidate?.userId?.Nationality
                                  ? `${selectedCandidate.userId.city
                                      .toLowerCase()
                                      .replace(/^\w/, (c) =>
                                        c.toUpperCase(),
                                      )}, ${selectedCandidate.userId.Nationality}`
                                  : selectedCandidate?.userId?.city
                                    ? selectedCandidate.userId.city
                                        .toLowerCase()
                                        .replace(/^\w/, (c) => c.toUpperCase())
                                    : selectedCandidate?.userId?.Nationality ||
                                      "Not Provided"}
                              </div>

                              <div className="col-md-6 d-flex align-items-center">
                                <strong
                                  className="me-2"
                                  style={{ minWidth: "70px" }}
                                >
                                  ATS Match:
                                </strong>
                                <div className="d-flex align-items-center flex-grow-1 gap-2">
                                  <div
                                    className="progress flex-grow-1"
                                    style={{
                                      height: "8px",
                                      backgroundColor: "rgb(233, 236, 239)",
                                    }}
                                  >
                                    <div
                                      className="progress-bar rounded"
                                      role="progressbar"
                                      style={{
                                        width: `${selectedCandidate?.ats?.percentage || 0}%`,
                                        backgroundColor:
                                          selectedCandidate?.ats?.percentage >=
                                          70
                                            ? "rgb(25, 135, 84)" // green
                                            : selectedCandidate?.ats
                                                  ?.percentage >= 40
                                              ? "rgb(255, 193, 7)" // yellow
                                              : "rgb(220, 53, 69)", // red
                                      }}
                                    />
                                  </div>
                                  <span
                                    className="fw-bold"
                                    style={{
                                      fontSize: "12px",
                                      color:
                                        selectedCandidate?.ats?.percentage >= 70
                                          ? "rgb(25, 135, 84)"
                                          : selectedCandidate?.ats
                                                ?.percentage >= 40
                                            ? "rgb(255, 193, 7)"
                                            : "rgb(220, 53, 69)",
                                    }}
                                  >
                                    {selectedCandidate?.ats?.percentage || 0}%
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
                                  className="btn btn-light btn-sm border text-muted"
                                  style={{
                                    fontSize: "11px",
                                    padding: "2px 8px",
                                  }}
                                  onClick={() => setShowContact(!showContact)}
                                >
                                  <i className="fa-regular fa-eye me-1" />
                                  {showContact
                                    ? "Masquer les coordonnées"
                                    : "Afficher les coordonnées"}
                                </button>
                              </div>
                              {showContact && (
                                <div className="w-100 d-flex flex-wrap gap-3 mt-2">
                                  <div className="d-flex align-items-center gap-1">
                                    <i className="fa-regular fa-envelope" />
                                    {selectedCandidate?.userId?.email ||
                                      "Not Provided"}
                                  </div>

                                  <div className="d-flex align-items-center gap-1">
                                    <i className="fa-solid fa-phone" />
                                    {selectedCandidate?.userId?.countryCode
                                      ? `+${selectedCandidate.userId.countryCode} ${
                                          selectedCandidate?.userId?.phone || ""
                                        }`
                                      : selectedCandidate?.userId?.phone ||
                                        "Not Provided"}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-3">
                              {selectedCandidate?.userId?.candidateProfile
                                ?.skills?.length > 0 ? (
                                selectedCandidate.userId.candidateProfile.skills.map(
                                  (s, i) => (
                                    <span
                                      key={i}
                                      className="badge bg-light text-dark border px-2 py-1 user-select-none"
                                    >
                                      {s}
                                    </span>
                                  ),
                                )
                              ) : (
                                <span className="text-muted small">
                                  No skills added
                                </span>
                              )}
                            </div>

                            <div className="mt-4 mb-2">
                              <h6 className="fw-bold mb-3">
                                Recruitment Process
                              </h6>

                              {(() => {
                                const progressSteps = statusFilters.filter(
                                  (item) =>
                                    item.value !== "" &&
                                    item.value !== "Rejected",
                                );

                                const currentIndex = progressSteps.findIndex(
                                  (s) => s.value === currentStatus,
                                );

                                const isRejected = currentStatus === "Rejected";

                                return (
                                  <>
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

                                      {progressSteps.map((item, index) => {
                                        const isCompleted =
                                          currentIndex !== -1 &&
                                          index < currentIndex;

                                        const isActive =
                                          currentIndex !== -1 &&
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
                                            key={item.value}
                                            onClick={() =>
                                              handleStatusUpdate(item.value)
                                            }
                                            className="d-flex flex-column align-items-center position-relative"
                                            style={{
                                              zIndex: 1,
                                              cursor: "pointer",
                                              width: `${100 / progressSteps.length}%`,
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
                                              {item.label}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Only show alert */}
                                    {isRejected && (
                                      <div
                                        className="alert alert-danger mt-3 py-2 px-3 text-center"
                                        role="alert"
                                        style={{ fontSize: "13px" }}
                                      >
                                        <i className="fa-solid fa-circle-xmark me-2" />
                                        This candidate has been{" "}
                                        <strong>Rejected</strong>.
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-3">
                              <div className="dropdown">
                                <button
                                  className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                >
                                  {statusFilters.find(
                                    (item) => item.value === currentStatus,
                                  )?.label || currentStatus}
                                </button>

                                <ul className="dropdown-menu">
                                  {statusFilters
                                    .filter((item) => item.value !== "") // remove "All"
                                    .map((item) => (
                                      <li key={item.value}>
                                        <button
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleStatusUpdate(item.value)
                                          } // ✅ PASS VALUE
                                        >
                                          {item.label} {/* show label */}
                                        </button>
                                      </li>
                                    ))}
                                </ul>
                              </div>

                              <Link
                                to="/messaging-system"
                                state={{
                                  candidateId: selectedCandidate?.userId?._id,
                                  candidate: selectedCandidate,
                                }}
                                className="btn btn-warning text-white btn-sm"
                              >
                                <i className="fa-solid fa-envelope me-1" /> Send
                                Message
                              </Link>
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
                              {selectedCandidate?.userId?.candidateProfile
                                ?.aboutRole?.jobTitle
                                ? `Currently working as ${selectedCandidate.userId.candidateProfile.aboutRole.jobTitle}.`
                                : "No professional summary added."}
                            </p>
                          </div>
                          <div className="mb-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                              About Your Role
                            </h5>

                            {selectedCandidate?.userId?.candidateProfile
                              ?.aboutRole ? (
                              <div className="row">
                                <div className="col-md-4 mb-2">
                                  <label class="fw-bold d-block text-muted small">
                                    Job Title
                                  </label>
                                  <p>
                                    {selectedCandidate.userId.candidateProfile
                                      .aboutRole.jobTitle || "NA"}
                                  </p>
                                </div>

                                <div className="col-md-4 mb-2">
                                  <label class="fw-bold d-block text-muted small">
                                    Years of Experience
                                  </label>
                                  <p>
                                    {selectedCandidate.userId.candidateProfile
                                      .aboutRole.yearOfExperience || "NA"}
                                  </p>
                                </div>

                                <div className="col-md-4 mb-2">
                                  <label class="fw-bold d-block text-muted small">
                                    Job Category
                                  </label>
                                  <p>
                                    {selectedCandidate.userId.candidateProfile
                                      .aboutRole.jobCategory || "NA"}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="text-muted small border rounded p-3 bg-light">
                                No role information added
                              </div>
                            )}
                          </div>

                          <div className="mb-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                              Experience
                            </h5>

                            {selectedCandidate?.userId?.candidateProfile
                              ?.workHistory?.length > 0 ? (
                              selectedCandidate.userId.candidateProfile.workHistory.map(
                                (work) => (
                                  <div key={work._id} className="mb-3">
                                    <h6 className="fw-bold mb-0">
                                      {work.jobTitle || "NA"}{" "}
                                      <span className="text-muted fw-normal">
                                        at{" "}
                                        {work.keep_employer_anonymous
                                          ? "Confidential"
                                          : work.companyName || "NA"}
                                      </span>
                                    </h6>

                                    <small className="text-primary d-block mb-1">
                                      {work.startDate
                                        ? new Date(work.startDate).getFullYear()
                                        : "NA"}{" "}
                                      -{" "}
                                      {work.currentlyWorkingHere
                                        ? "Present"
                                        : work.endDate
                                          ? new Date(work.endDate).getFullYear()
                                          : "NA"}
                                    </small>

                                    <p className="text-muted small mb-1">
                                      {work.workLocation ||
                                        "Location not provided"}
                                    </p>

                                    {work.currentSalary && (
                                      <p className="text-muted small mb-0">
                                        Salary: {work.currentSalary.amount}{" "}
                                        {work.currentSalary.currency} (
                                        {work.currentSalary.payrollFrequency})
                                      </p>
                                    )}
                                  </div>
                                ),
                              )
                            ) : (
                              <p className="text-muted small">
                                No experience added
                              </p>
                            )}
                          </div>

                          <div className="mb-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                              Education
                            </h5>

                            {selectedCandidate?.userId?.candidateProfile
                              ?.education?.length > 0 ? (
                              selectedCandidate.userId.candidateProfile.education.map(
                                (edu) => (
                                  <div key={edu._id} className="mb-3">
                                    <h6 className="fw-bold mb-0">
                                      {edu.degree || "NA"}
                                    </h6>

                                    <small className="text-muted">
                                      {edu.University || "NA"}
                                      {edu.startDate &&
                                        `, ${new Date(edu.startDate).getFullYear()}`}
                                      {edu.currentlyStudyingHere
                                        ? " - Present"
                                        : edu.endDate
                                          ? ` - ${new Date(edu.endDate).getFullYear()}`
                                          : ""}
                                    </small>
                                  </div>
                                ),
                              )
                            ) : (
                              <p className="text-muted small">
                                No education added
                              </p>
                            )}
                          </div>

                          <div className="mb-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                              Languages
                            </h5>

                            <div className="d-flex gap-2 flex-wrap">
                              {selectedCandidate?.userId?.candidateProfile
                                ?.languages?.length > 0 ? (
                                selectedCandidate.userId.candidateProfile.languages.map(
                                  (lang) => (
                                    <span
                                      key={lang._id}
                                      className="badge bg-secondary"
                                    >
                                      {lang.language || "NA"}{" "}
                                      {lang.proficiency &&
                                        `(${lang.proficiency})`}
                                    </span>
                                  ),
                                )
                              ) : (
                                <span className="text-muted small">
                                  No languages added
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mb-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                              Skills
                            </h5>

                            <div className="d-flex flex-wrap gap-2">
                              {selectedCandidate?.userId?.candidateProfile
                                ?.skills?.length > 0 ? (
                                selectedCandidate.userId.candidateProfile.skills.map(
                                  (skill, index) => (
                                    <span
                                      key={index}
                                      className="badge bg-light text-dark border"
                                    >
                                      {skill}
                                    </span>
                                  ),
                                )
                              ) : (
                                <span className="text-muted small">
                                  No skills added
                                </span>
                              )}
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
                                <p>
                                  {selectedCandidate?.userId?.candidateProfile
                                    ?.career_goals?.DesiredJobTitle || "NA"}
                                </p>
                              </div>

                              <div className="col-md-6 mb-2">
                                <label className="fw-bold d-block text-muted small">
                                  Desired Employment Type
                                </label>
                                <p>
                                  {selectedCandidate?.userId?.candidateProfile
                                    ?.career_goals?.DesiredEmploymentType ||
                                    "NA"}
                                </p>
                              </div>

                              <div className="col-md-6 mb-2">
                                <label className="fw-bold d-block text-muted small">
                                  Desired Occupation Type
                                </label>
                                <p>
                                  {selectedCandidate?.userId?.candidateProfile
                                    ?.career_goals?.DesiredOccupationType ||
                                    "NA"}
                                </p>
                              </div>

                              <div className="col-md-6 mb-2">
                                <label className="fw-bold d-block text-muted small">
                                  Minimum Desired Salary
                                </label>
                                <p>
                                  {selectedCandidate?.userId?.candidateProfile
                                    ?.career_goals?.MinimumDesiredSalary
                                    ?.amount || "NA"}{" "}
                                  {selectedCandidate?.userId?.candidateProfile
                                    ?.career_goals?.MinimumDesiredSalary
                                    ?.currency || ""}{" "}
                                  {selectedCandidate?.userId?.candidateProfile
                                    ?.career_goals?.MinimumDesiredSalary?.type
                                    ? ` / ${selectedCandidate.userId.candidateProfile.career_goals.MinimumDesiredSalary.type}`
                                    : ""}
                                </p>
                              </div>

                              <div className="col-md-6 mb-2">
                                <label className="fw-bold d-block text-muted small">
                                  Job Search Status
                                </label>
                                <p>
                                  {selectedCandidate?.userId?.candidateProfile
                                    ?.career_goals?.jobSearchStatus || "NA"}
                                </p>
                              </div>

                              <div className="col-md-6 mb-2">
                                <label className="fw-bold d-block text-muted small">
                                  Availability to Join
                                </label>
                                <p>
                                  {selectedCandidate?.userId?.candidateProfile
                                    ?.career_goals?.availabilityToJoin || "NA"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                              Certificates
                            </h5>

                            {selectedCandidate?.userId?.candidateProfile
                              ?.certificates?.length > 0 ? (
                              selectedCandidate.userId.candidateProfile.certificates.map(
                                (cer) => (
                                  <div key={cer._id} className="mb-3">
                                    <h6 className="fw-bold mb-0">
                                      {cer.title || "NA"}
                                    </h6>

                                    <small className="text-muted">
                                      Issued on{" "}
                                      {cer.issueDate
                                        ? new Date(
                                            cer.issueDate,
                                          ).toLocaleDateString()
                                        : "NA"}
                                    </small>
                                  </div>
                                ),
                              )
                            ) : (
                              <p className="text-muted small">
                                No certificates added
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-center text-muted">
                    <div
                      className="d-flex flex-column align-items-center justify-content-center text-center"
                      style={{ height: "60vh" }}
                    >
                      <div style={{ fontSize: "50px" }}>🔍</div>

                      <h5 className="mt-3 fw-bold">No Candidates Found</h5>

                      <p
                        className="text-muted mb-3"
                        style={{ maxWidth: "400px" }}
                      >
                        No applicants match your current filters. Try adjusting
                        your filter criteria or reset filters to see more
                        candidates.
                      </p>

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleResetFilters} // create this function
                      >
                        Reset Filters
                      </button>
                    </div>
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
                        {candidates.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-5">
                              <div className="d-flex flex-column align-items-center justify-content-center">
                                <div style={{ fontSize: "40px" }}>📄</div>

                                <h6 className="fw-bold mt-3">
                                  No Candidates Found
                                </h6>

                                <p
                                  className="text-muted mb-3"
                                  style={{ fontSize: "13px" }}
                                >
                                  No applicants match your selected filters. Try
                                  adjusting filters or resetting them.
                                </p>

                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={handleResetFilters}
                                >
                                  Reset Filters
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          candidates.map((item) => {
                            // your existing map code here

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
                                        crossOrigin="anonymous"
                                        alt="user"
                                        className="rounded-circle me-2"
                                        src={
                                          cleanImageUrl(
                                            item.userId?.profileImage,
                                          )
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
                                        {statusFilters
                                          .filter(
                                            (status) => status.value !== "",
                                          )
                                          .map((status) => (
                                            <li key={status.value}>
                                              <button
                                                className="dropdown-item"
                                                onClick={() =>
                                                  handleTableStatusUpdate(
                                                    status.value,
                                                    item._id,
                                                    item.jobId,
                                                  )
                                                }
                                              >
                                                {status.label}
                                              </button>
                                            </li>
                                          ))}
                                      </ul>
                                    </div>
                                  </td>

                                  {/* ACTION */}
                                  <td className="pe-4 py-3 text-end">
                                    <div className="dropdown">
                                      <button
                                        className="btn btn-light btn-sm rounded-circle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <i className="fa-solid fa-ellipsis" />
                                      </button>

                                      <ul className="dropdown-menu dropdown-menu-end border-0 shadow">
                                        <li>
                                          <button
                                            className="dropdown-item"
                                            onClick={() =>
                                              handleViewFromTable(item)
                                            }
                                          >
                                            <i className="fa-regular fa-eye me-2" />
                                            View Details
                                          </button>
                                        </li>

                                        <li>
                                          <Link
                                            to="/messaging-system"
                                            state={{
                                              candidateId: item.userId?._id,
                                              candidate: item,
                                            }}
                                            className="dropdown-item"
                                          >
                                            <i className="fa-regular fa-comment-dots me-2" />
                                            Message
                                          </Link>
                                        </li>

                                        <li>
                                          <button className="dropdown-item">
                                            <i className="fa-regular fa-envelope me-2" />
                                            Email
                                          </button>
                                        </li>

                                        <li>
                                          <hr className="dropdown-divider" />
                                        </li>

                                        <li>
                                          <button
                                            className="dropdown-item text-danger"
                                            onClick={() =>
                                              handleDelete(item?._id)
                                            }
                                          >
                                            <i className="fa-regular fa-trash-can me-2" />
                                            Delete
                                          </button>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>

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
                                          {/* Gray progress line */}
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

                                          {statusFilters
                                            .filter(
                                              (s) =>
                                                s.value !== "" &&
                                                s.value !== "Rejected", // ❌ remove Rejected from progress
                                            )
                                            .map((step, index, arr) => {
                                              const isRejected =
                                                item.status === "Rejected";

                                              const currentIndex =
                                                arr.findIndex(
                                                  (s) =>
                                                    s.value === item.status,
                                                );

                                              const isCompleted =
                                                !isRejected &&
                                                index < currentIndex;
                                              const isActive =
                                                !isRejected &&
                                                index === currentIndex;

                                              let bgColor = "#fff";
                                              let borderColor = "#dee2e6";
                                              let textColor = "#6c757d";
                                              let fontWeight = "normal";

                                              // ✅ IF REJECTED → ALL STEPS RED
                                              if (isRejected) {
                                                bgColor = "#d62a47";
                                                borderColor = "#d62a47";
                                                textColor = "#d62a47";
                                                fontWeight = "bold";
                                              } else {
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
                                              }

                                              return (
                                                <div
                                                  key={step.value}
                                                  onClick={() =>
                                                    handleTableStatusUpdate(
                                                      step.value,
                                                      item._id,
                                                      item.jobId,
                                                    )
                                                  }
                                                  className="d-flex flex-column align-items-center position-relative"
                                                  style={{
                                                    zIndex: 1,
                                                    cursor: "pointer",
                                                    width: `${100 / arr.length}%`,
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
                                                    {isCompleted &&
                                                    !isRejected ? (
                                                      <i
                                                        className="fa-solid fa-check"
                                                        style={{
                                                          color: "#fff",
                                                          fontSize: "10px",
                                                        }}
                                                      />
                                                    ) : (
                                                      <span
                                                        style={{
                                                          width: 6,
                                                          height: 6,
                                                          backgroundColor:
                                                            isRejected
                                                              ? "#fff"
                                                              : "#dee2e6",
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
                                                    {step.label}
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
                          })
                        )}
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
