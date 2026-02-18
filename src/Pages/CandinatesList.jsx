import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
function CandinatesList() {
  const { userId } = location.state || {};
  console.log(userId);
  const reviewSectionRef = useRef(null);
  const token = localStorage.getItem("token");
  const [candidates, setCandidates] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0); // selected rating
  const [hover, setHover] = useState(0); // star hover effect
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [seniorityLevels, setSeniorityLevels] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [candidate, setCandidate] = useState(null);

  const [showEducationOptions, setShowEducationOptions] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const debounceTimer = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const cityDropdownRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [perPage, setPerPage] = useState(10); // default
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [country, setCountry] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [showCityOptions, setShowCityOptions] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);
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
    if (candidates.length > 0) {
      setSelectedCandidateId(candidates[0]?.userId?._id);
    }
  }, [candidates]);

  useEffect(() => {
    if (selectedCandidateId) {
      fetchCandidateDetails(selectedCandidateId);
      getReviewsByUser(selectedCandidateId);
    }
  }, [selectedCandidateId]);

  const fetchCandidateDetails = async (id) => {
    try {
      setDetailsLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}getCandidateDetails/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setCandidateDetails(res.data?.data[0]);
    } catch (err) {
      console.error("Error fetching candidate details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };
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

  const handleDownloadCV = () => {
    const resumes = candidateDetails?.resumeUrls;

    if (!resumes || resumes.length === 0) {
      toast.info("No CV uploaded by candidate", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const latestResume = resumes[resumes.length - 1];
    const fileUrl = `${API_IMAGE_URL}${latestResume.url}`;

    window.open(fileUrl, "_blank");
  };
  console.log(selectedSalary);
  const fetchCandidates = async (page = 1, limit = perPage) => {
    try {
      setLoading(true);

      let sortField = "";
      let sortOrder = "";

      if (sortBy) {
        const [field, order] = sortBy.split("|");
        sortField = field;
        sortOrder = order;
      }

      // 🔹 Query params (remain in URL)
      const queryParams = {
        page,
        limit,
        skills: selectedSkills.length ? selectedSkills.join(",") : undefined,
        city: selectedCity || undefined,

        country: selectedCountry || undefined,
        education: selectedEducation || undefined,

        experience: selectedExperience || undefined,
        keyword: keyword.trim() || undefined,
        sortBy: sortField || undefined,
        order: sortOrder || undefined,
      };

      // 🔹 Body params (NO + encoding issue here)
      const bodyData = {
        salary: selectedSalary || undefined,
        availability: selectedAvailability || undefined,
      };

      console.log("Query Params:", queryParams);
      console.log("Body Data:", bodyData);

      const response = await axios.post(
        `${API_BASE_URL}getCandidateList`,
        bodyData, // ✅ send salary + availability in body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: queryParams, // ✅ others in query
        },
      );

      setCandidates(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalResults(response.data.totalCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(currentPage, perPage);
  }, [currentPage, perPage]);

  const handleBookmark = async (candidateId, jobId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}bookmark/candidate`,
        { candidateId, jobId },
        { headers: { Authorization: `Bearer ${token}` } },
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

  const filteredCities = cityList.filter((city) =>
    city.name.toLowerCase().includes(citySearchTerm.toLowerCase()),
  );

  const updateCities = (updatedCities) => {
    setSelectedCities(updatedCities);
  };

  const toggleCity = (cityName) => {
    updateCities(
      selectedCities.includes(cityName)
        ? selectedCities.filter((c) => c !== cityName)
        : [...selectedCities, cityName],
    );
  };

  const handleRemoveCity = (cityName) => {
    updateCities(selectedCities.filter((c) => c !== cityName));
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

  const toggleEducation = (value) => {
    setSelectedEducation((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );
  };

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setCurrentPage(1);
      fetchCandidates(1, perPage);
    }, 500);

    return () => clearTimeout(debounceTimer.current);
  }, [
    keyword,
    selectedSkills,
    selectedEducation,
    selectedExperience,
    selectedCity, // ✅ FIXED
    selectedCountry,
    selectedSalary, // ✅ ADD THIS
    selectedAvailability, // ✅ ADD THIS
    sortBy,
    perPage,
  ]);

  const cleanImageUrl = (url) => {
    if (!url) return "";

    // Case: wrong URL like "/uploads/https://..."
    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    // Case: full external URL
    if (url.startsWith("http")) {
      return url;
    }

    // Case: local upload (relative path)
    return `${API_IMAGE_URL}${url}`;
  };
  const averageRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((acc, item) => acc + (item.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : 0;
  const getReviewsByUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}getReviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={i <= rating ? "fa-solid fa-star" : "fa-regular fa-star"}
        ></i>,
      );
    }
    return <div className="rating-stars">{stars}</div>;
  };
  const truncateText = (text, limit = 100) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Candidate Search</h1>
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
                <Link to="/candidates-search">
                  <i className="fa-solid fa-angle-right" />
                  Candidate Search
                </Link>
              </li>
            </ol>
          </div>
          <div className="employer-dashboard-common-heading">
            <h2>Candidate Search</h2>
          </div>
          <section
            className="employer-candidate-filter-info-area"
            style={{ padding: "20px 0px" }}
          >
            <div className="row">
              {/* Search Box */}
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
                        placeholder="Find Candidat by Profile title , Competance , experiance .."
                        type="text"
                        value={keyword}
                        onChange={(e) => {
                          setKeyword(e.target.value);
                          setCurrentPage(1); // reset page
                        }}
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
                      onClick={() => {
                        setCurrentPage(1);
                        // If you have API call function, call it here
                        // fetchCandidates();
                      }}
                      style={{ padding: "10px 25px", "border-radius": "5px" }}
                    >
                      Find Candidate
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters Section */}
              <div className="col-12">
                <div className="p-3 bg-white shadow-sm rounded border">
                  <div className="row g-2">
                    {/* Country */}
                    <div className="col-12 col-md-4 col-lg">
                      <div className="employer-candidate-filter-box">
                        <div className="single-sidebar-widget keyword">
                          <h3
                            style={{
                              fontSize: "13px",
                              marginBottom: "8px",
                              color: "rgb(102, 102, 102)",
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

                    {/* City */}
                    <div className="col-12 col-md-4 col-lg">
                      <div className="employer-candidate-filter-box">
                        <div className="single-sidebar-widget keyword">
                          <h3
                            style={{
                              fontSize: "13px",
                              marginBottom: "8px",
                              color: "rgb(102, 102, 102)",
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
                              fontSize: "13px",
                              marginBottom: "8px",
                              color: "rgb(102, 102, 102)",
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
                              "font-size": "13px",
                              "margin-bottom": "8px",
                              color: "rgb(102, 102, 102)",
                            }}
                          >
                            Experience
                          </h3>
                          <div className="form-group">
                            <select
                              className="form-select border-0 bg-light rounded-pill px-3 shadow-none"
                              style={{
                                "font-size": "12px",
                                height: "38px",
                                cursor: "pointer",
                              }}
                              value={selectedExperience}
                              onChange={(e) =>
                                setSelectedExperience(e.target.value)
                              }
                            >
                              <option value="" disabled>
                                Select level
                              </option>

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
                              fontSize: "13px",
                              marginBottom: "8px",
                              color: "rgb(102, 102, 102)",
                            }}
                          >
                            Education
                          </h3>

                          <div className="form-group">
                            <select
                              className="form-select border-0 bg-light rounded-pill px-3 shadow-none"
                              style={{
                                fontSize: "12px",
                                height: "38px",
                                cursor: "pointer",
                              }}
                              value={selectedEducation}
                              onChange={(e) => {
                                setSelectedEducation(e.target.value);
                                setCurrentPage(1);
                              }}
                            >
                              <option value="">Any Degree</option>

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

                    {/* Skills */}

                    <div className="col-12 col-md-4 col-lg">
                      <div className="employer-candidate-filter-box">
                        <div className="single-sidebar-widget keyword">
                          <h3
                            style={{
                              "font-size": "13px",
                              "margin-bottom": "8px",
                              color: "rgb(102, 102, 102)",
                            }}
                          >
                            Salary
                          </h3>
                          <div className="form-group">
                            <select
                              className="form-select border-0 bg-light rounded-pill px-3 shadow-none"
                              style={{
                                "font-size": "12px",
                                height: "38px",
                                cursor: "pointer",
                              }}
                              value={selectedSalary}
                              onChange={(e) =>
                                setSelectedSalary(e.target.value)
                              }
                            >
                              <option value="">Choose Salary</option>

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
                    {/* Experience */}
                    <div className="col-12 col-md-4 col-lg">
                      <div className="employer-candidate-filter-box">
                        <div className="single-sidebar-widget keyword">
                          <h3
                            style={{
                              "font-size": "13px",
                              "margin-bottom": "8px",
                              color: "rgb(102, 102, 102)",
                            }}
                          >
                            Availability
                          </h3>
                          <div className="form-group">
                            <select
                              className="form-select border-0 bg-light rounded-pill px-3 shadow-none"
                              style={{
                                fontSize: "12px",
                                height: "38px",
                                cursor: "pointer",
                              }}
                              value={selectedAvailability}
                              onChange={(e) =>
                                setSelectedAvailability(e.target.value)
                              }
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

                    {/* Education */}
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      className="btn btn-primary btn-sm px-5 fw-bold"
                      onClick={() => {
                        setCurrentPage(1);
                        fetchCandidates(1, perPage);
                      }}
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section
            className="employer-candidate-info-area"
            style={{ padding: "0px 20px 40px" }}
          >
            <div className="row">
              <div className="col-lg-4">
                <div className="d-flex justify-content-end mb-2">
                  {/* Sort */}
                  <select
                    className="form-select form-select-sm shadow-none"
                    style={{ width: "auto", fontSize: "12px" }}
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Sort By (Newest First)</option>

                    <option value="name|asc">Name: A - Z</option>
                    <option value="name|desc">Name: Z - A</option>

                    <option value="experience|asc">
                      Experience: Low to High
                    </option>
                    <option value="experience|desc">
                      Experience: High to Low
                    </option>
                  </select>
                </div>

                <div
                  className="candidate-list-scroll"
                  style={{ maxHeight: "800px", overflowY: "auto" }}
                >
                  {candidates.length > 0 ? (
                    candidates.map((candidate, index) => {
                      const user = candidate?.userId || {};
                      const role = candidate?.aboutRole || {};

                      return (
                        <div
                          onClick={() => {
                            setSelectedCandidateId(user._id);
                          }}
                          key={candidate._id || index}
                          className="card mb-2 border-0 shadow-sm"
                          style={{
                            cursor: "pointer",
                            borderLeft: "4px solid #0d6efd",
                            transition: "0.2s",
                            background: "#fff",
                          }}
                        >
                          <div className="card-body p-3">
                            <div className="d-flex align-items-start">
                              {/* Profile Image */}
                              <img
                                alt="user"
                                className="rounded-circle me-3"
                                src={
                                  cleanImageUrl(user?.profileImage) ||
                                  "assets/images/userIcon.png"
                                }
                                crossOrigin="anonymous"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />

                              <div className="flex-grow-1">
                                {/* Name + Bookmark */}
                                <div className="d-flex justify-content-between">
                                  <h6 className="mb-1 fw-bold">
                                    {`${user.first_name || ""} ${user.last_name || ""}`}
                                  </h6>

                                  <div className="dropdown">
                                    <button
                                      className="btn btn-outline-warning rounded-circle d-flex align-items-center justify-content-center dropdown-toggle no-caret"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      style={{
                                        width: "32px",
                                        height: "32px",
                                        padding: "0px",
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <i
                                        className={
                                          candidate.isBookmarked
                                            ? "fa-solid fa-bookmark"
                                            : "fa-regular fa-bookmark"
                                        }
                                      />
                                    </button>

                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                      <li>
                                        <button
                                          className="dropdown-item d-flex align-items-center gap-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleBookmark(
                                              user?._id,
                                              candidate.jobId,
                                            );
                                          }}
                                        >
                                          <i className="fa-regular fa-folder" />
                                          <span style={{ fontSize: "13px" }}>
                                            Save to Default Folder
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

                                {/* Job Title */}
                                <p
                                  className="mb-1 text-muted"
                                  style={{ fontSize: "12px" }}
                                >
                                  {role.jobTitle || "Not specified"}
                                </p>

                                {/* Experience + Location */}
                                <div
                                  className="d-flex align-items-center gap-2 mb-1"
                                  style={{ fontSize: "12px" }}
                                >
                                  <span className="text-primary fw-bold">
                                    {role.yearOfExperience
                                      ? `${role.yearOfExperience} Years`
                                      : "N/A"}
                                  </span>

                                  <span className="text-muted">•</span>

                                  <span className="text-muted">
                                    <span className="text-muted">
                                      {user?.city && user?.Nationality
                                        ? `${user.city}, ${user.Nationality}`
                                        : user?.city ||
                                          user?.Nationality ||
                                          "Location not available"}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center">No candidates found.</p>
                  )}
                </div>
              </div>

              <div className="col-lg-8">
                <div
                  className="card border-0 shadow-sm"
                  style={{
                    minHeight: "600px",
                    maxHeight: "800px",
                    overflowY: "auto",
                  }}
                >
                  <div className="card-body p-4">
                    {detailsLoading ? (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: "500px" }}
                      >
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        />
                      </div>
                    ) : candidateDetails ? (
                      <>
                        <div
                          className="card border-0 shadow-sm"
                          style={{ "min-height": "600px" }}
                        >
                          <div className="card-body p-4">
                            <div className="d-flex flex-column flex-md-row gap-4 mb-4 border-bottom pb-4">
                              <img
                                alt="profile"
                                className="rounded"
                                crossOrigin="anonymous"
                                src={
                                  cleanImageUrl(
                                    candidateDetails?.userId?.profileImage,
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
                                      {candidateDetails?.userId?.first_name
                                        ?.toLowerCase()
                                        .replace(/^\w/, (c) =>
                                          c.toUpperCase(),
                                        ) || "Not Provided"}{" "}
                                      {candidateDetails?.userId?.last_name
                                        ?.toLowerCase()
                                        .replace(/^\w/, (c) => c.toUpperCase())}
                                    </h4>
                                    <p className="text-muted mb-2">
                                      {candidateDetails?.aboutRole?.jobTitle
                                        ?.toLowerCase()
                                        .replace(/^\w/, (c) =>
                                          c.toUpperCase(),
                                        ) || "Not Provided"}{" "}
                                    </p>
                                  </div>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={handleDownloadCV}
                                    >
                                      <i className="fa-solid fa-download me-1" />{" "}
                                      Download CV
                                    </button>

                                    <a
                                      href="https://www.linkedin.com/in/candidate-smith"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                                      style={{ width: "32px", height: "32px" }}
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
                                            Manual Folders
                                          </h6>
                                        </li>
                                        <li>
                                          <button className="dropdown-item d-flex align-items-center gap-2">
                                            <i className="fa-regular fa-folder" />
                                            <span
                                              style={{ "font-size": "13px" }}
                                            >
                                              React Developer
                                            </span>
                                          </button>
                                        </li>
                                        <li>
                                          <button className="dropdown-item d-flex align-items-center gap-2">
                                            <i className="fa-regular fa-folder" />
                                            <span
                                              style={{ "font-size": "13px" }}
                                            >
                                              Backend Senior Developer
                                            </span>
                                          </button>
                                        </li>
                                        <li>
                                          <button className="dropdown-item d-flex align-items-center gap-2">
                                            <i className="fa-regular fa-folder" />
                                            <span
                                              style={{ "font-size": "13px" }}
                                            >
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
                                <div className="d-flex flex-wrap gap-2 mt-3 text-sm text-muted">
                                  <div className="w-100 d-flex align-items-center gap-1">
                                    <i className="fa-solid fa-location-dot" />
                                    <span className="text-muted">
                                      {candidateDetails?.userId?.city &&
                                      candidateDetails?.userId?.Nationality
                                        ? `${candidateDetails.userId.city
                                            .toLowerCase()
                                            .replace(/^\w/, (c) =>
                                              c.toUpperCase(),
                                            )}, ${candidateDetails.userId.Nationality}`
                                        : candidateDetails?.userId?.city
                                          ? candidateDetails.userId.city
                                              .toLowerCase()
                                              .replace(/^\w/, (c) =>
                                                c.toUpperCase(),
                                              )
                                          : candidateDetails?.userId
                                              ?.Nationality || "Not Provided"}
                                    </span>
                                  </div>
                                  <div className="w-100">
                                    <button
                                      className="btn btn-light btn-sm border text-muted"
                                      style={{
                                        fontSize: "11px",
                                        padding: "2px 8px",
                                      }}
                                      onClick={() =>
                                        setShowContact(!showContact)
                                      }
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
                                        {candidateDetails?.userId?.email ||
                                          "Not Provided"}
                                      </div>

                                      <div className="d-flex align-items-center gap-1">
                                        <i className="fa-solid fa-phone" />
                                        {candidateDetails?.userId?.countryCode
                                          ? `+${candidateDetails.userId.countryCode} ${
                                              candidateDetails?.userId?.phone ||
                                              ""
                                            }`
                                          : candidateDetails?.userId?.phone ||
                                            "Not Provided"}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="d-flex flex-wrap gap-2 mt-3">
                                  {candidateDetails?.skills &&
                                  candidateDetails.skills.length > 0 ? (
                                    candidateDetails.skills.map(
                                      (skill, index) => (
                                        <span className="badge bg-light text-dark border px-2 py-1 user-select-none">
                                          {skill}
                                        </span>
                                      ),
                                    )
                                  ) : (
                                    <li>No skills listed</li>
                                  )}
                                </div>
                                <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
                                  {/* Send Message Button */}
                                  <button className="btn btn-warning btn-sm text-white">
                                    <i className="fa-solid fa-envelope me-1"></i>
                                    Send Message
                                  </button>

                                  {/* Rating Button */}
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setShowModal(true)}
                                  >
                                    <i className="fa-solid fa-star me-1"></i>
                                    Rating
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="mb-4">
                              <h5 className="fw-bold mb-3">About Candidate</h5>
                              <p
                                className="text-muted"
                                style={{ "line-height": "1.6" }}
                              >
                                {candidateDetails?.professionalSummary || "N/A"}
                              </p>
                            </div>
                            <div className="mb-4">
                              <h5 className="fw-bold mb-3">Experience</h5>

                              {candidateDetails?.workHistory &&
                              candidateDetails.workHistory.length > 0 ? (
                                candidateDetails.workHistory.map(
                                  (work, index) => {
                                    const isLast =
                                      index ===
                                      candidateDetails.workHistory.length - 1;

                                    const startDate = new Date(work.startDate);
                                    const endDateObj = work.currentlyWorkingHere
                                      ? null
                                      : new Date(work.endDate);

                                    return (
                                      <div
                                        key={index}
                                        className="position-relative d-flex gap-3 pb-4"
                                      >
                                        {/* LEFT SIDE (ICON + LINE) */}
                                        <div className="d-flex flex-column align-items-center position-relative">
                                          {/* ICON */}
                                          <div
                                            className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                              zIndex: 1,
                                            }}
                                          >
                                            <i className="fa-solid fa-briefcase text-primary" />
                                          </div>

                                          {/* VERTICAL LINE */}
                                          {!isLast && (
                                            <div
                                              style={{
                                                position: "absolute",
                                                top: "40px",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                width: "2px",
                                                height: "100%",
                                                backgroundColor: "#e9ecef",
                                              }}
                                            />
                                          )}
                                        </div>

                                        {/* RIGHT SIDE CONTENT */}
                                        <div>
                                          <h6 className="fw-bold mb-1">
                                            {work.jobTitle
                                              ?.toLowerCase()
                                              .replace(/^\w/, (c) =>
                                                c.toUpperCase(),
                                              ) || "Not Provided"}
                                          </h6>

                                          <p className="text-muted mb-1 small">
                                            {work.companyName} •{" "}
                                            {startDate.toLocaleDateString(
                                              "en-GB",
                                              {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              },
                                            )}{" "}
                                            -{" "}
                                            {work.currentlyWorkingHere
                                              ? "Present"
                                              : endDateObj?.toLocaleDateString(
                                                  "en-GB",
                                                  {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                  },
                                                )}
                                          </p>

                                          <p className="text-muted small">
                                            {work.Description}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  },
                                )
                              ) : (
                                <p>No work experience available</p>
                              )}
                            </div>

                            <div>
                              <h5 className="fw-bold mb-3">Education</h5>

                              {candidateDetails?.education &&
                              candidateDetails.education.length > 0 ? (
                                candidateDetails.education.map((edu, index) => {
                                  const isLast =
                                    index ===
                                    candidateDetails.education.length - 1;

                                  const startDate = new Date(edu.startDate);
                                  const endDateObj = edu.currentlyStudyingHere
                                    ? null
                                    : new Date(edu.endDate);

                                  return (
                                    <div
                                      key={index}
                                      className="position-relative d-flex gap-3 pb-4"
                                    >
                                      {/* LEFT SIDE (ICON + LINE) */}
                                      <div className="d-flex flex-column align-items-center position-relative">
                                        {/* ICON */}
                                        <div
                                          className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            zIndex: 1,
                                          }}
                                        >
                                          <i className="fa-solid fa-graduation-cap text-success" />
                                        </div>

                                        {/* VERTICAL LINE */}
                                        {!isLast && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              top: "40px",
                                              left: "50%",
                                              transform: "translateX(-50%)",
                                              width: "2px",
                                              height: "100%",
                                              backgroundColor: "#e9ecef",
                                            }}
                                          />
                                        )}
                                      </div>

                                      {/* RIGHT SIDE CONTENT */}
                                      <div>
                                        <h6 className="fw-bold mb-1">
                                          {edu.degree
                                            ?.toLowerCase()
                                            .replace(/^\w/, (c) =>
                                              c.toUpperCase(),
                                            ) || "Not Provided"}
                                        </h6>

                                        <p className="text-muted mb-1 small">
                                          {edu.University || "Not Provided"} •{" "}
                                          {startDate.toLocaleDateString(
                                            "en-GB",
                                            {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            },
                                          )}{" "}
                                          -{" "}
                                          {edu.currentlyStudyingHere
                                            ? "Present"
                                            : endDateObj?.toLocaleDateString(
                                                "en-GB",
                                                {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                                },
                                              )}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <p>No education information available</p>
                              )}
                            </div>

                            <div className="mb-4">
                              <h5 className="fw-bold mb-3">Career Goals</h5>

                              {candidateDetails?.career_goals ? (
                                <div className="d-flex gap-3">
                                  {/* LEFT ICON + LINE */}
                                  <div className="d-flex flex-column align-items-center">
                                    <div
                                      className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                      style={{ width: "40px", height: "40px" }}
                                    >
                                      <i className="fa-solid fa-bullseye text-warning" />
                                    </div>
                                  </div>

                                  <div>
                                    <h6 className="fw-bold mb-1">
                                      {candidateDetails.career_goals.DesiredJobTitle?.toLowerCase().replace(
                                        /^\w/,
                                        (c) => c.toUpperCase(),
                                      ) || "Not Provided"}
                                    </h6>

                                    <p className="text-muted mb-1 small">
                                      {candidateDetails.career_goals.DesiredEmploymentType?.toLowerCase().replace(
                                        /^\w/,
                                        (c) => c.toUpperCase(),
                                      ) || "-"}{" "}
                                      •{" "}
                                      {candidateDetails.career_goals.DesiredOccupationType?.toLowerCase().replace(
                                        /^\w/,
                                        (c) => c.toUpperCase(),
                                      ) || "-"}
                                    </p>

                                    <div className="mt-2 small text-muted">
                                      <p className="mb-1">
                                        <strong>Eligible to work in:</strong>{" "}
                                        {candidateDetails.eligibleToWorkInFrance
                                          ? "France"
                                          : "-"}
                                      </p>

                                      {candidateDetails.career_goals
                                        .MinimumDesiredSalary ? (
                                        <p className="mb-1">
                                          <strong>Minimum Salary:</strong>{" "}
                                          {
                                            candidateDetails.career_goals
                                              .MinimumDesiredSalary.currency
                                          }{" "}
                                          {
                                            candidateDetails.career_goals
                                              .MinimumDesiredSalary.amount
                                          }{" "}
                                          /{" "}
                                          {
                                            candidateDetails.career_goals
                                              .MinimumDesiredSalary.type
                                          }
                                        </p>
                                      ) : (
                                        <p className="mb-1">
                                          <strong>Minimum Salary:</strong> Not
                                          specified
                                        </p>
                                      )}

                                      <p className="mb-0">
                                        <strong>Job Search Status:</strong>{" "}
                                        {candidateDetails.career_goals
                                          .jobSearchStatus || "Not specified"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p>No career goals specified</p>
                              )}
                            </div>
                            <div className="mb-4">
                              <h5 className="fw-bold mb-3">About Your Role</h5>

                              {candidateDetails?.aboutRole ? (
                                <div className="d-flex gap-3">
                                  {/* LEFT ICON + LINE */}
                                  <div className="d-flex flex-column align-items-center">
                                    <div
                                      className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                      style={{ width: "40px", height: "40px" }}
                                    >
                                      <i className="fa-solid fa-user-tie text-primary" />
                                    </div>
                                  </div>

                                  {/* RIGHT CONTENT */}
                                  <div>
                                    <h6 className="fw-bold mb-1">
                                      {candidateDetails.aboutRole.jobTitle
                                        ?.toLowerCase()
                                        .replace(/^\w/, (c) =>
                                          c.toUpperCase(),
                                        ) || "Not Provided"}
                                    </h6>

                                    <p className="text-muted mb-1 small">
                                      {candidateDetails.aboutRole
                                        .yearOfExperience || 0}{" "}
                                      Years Experience
                                    </p>

                                    <p className="text-muted small">
                                      {candidateDetails.aboutRole.jobCategory
                                        ?.toLowerCase()
                                        .replace(/^\w/, (c) =>
                                          c.toUpperCase(),
                                        ) || "Not Provided"}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <p>No role information available</p>
                              )}
                            </div>
                            <div className="mb-4">
                              <h5 className="fw-bold mb-3">Languages</h5>

                              {candidateDetails?.languages &&
                              candidateDetails.languages.length > 0 ? (
                                candidateDetails.languages.map(
                                  (lang, index) => {
                                    const isLast =
                                      index ===
                                      candidateDetails.languages.length - 1;

                                    return (
                                      <div
                                        key={lang._id}
                                        className="position-relative d-flex gap-3 pb-4"
                                      >
                                        {/* LEFT SIDE (ICON + LINE) */}
                                        <div className="d-flex flex-column align-items-center position-relative">
                                          {/* ICON */}
                                          <div
                                            className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                              zIndex: 1,
                                            }}
                                          >
                                            <i className="fa-solid fa-language text-info" />
                                          </div>

                                          {/* VERTICAL LINE */}
                                          {!isLast && (
                                            <div
                                              style={{
                                                position: "absolute",
                                                top: "40px",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                width: "2px",
                                                height: "100%",
                                                backgroundColor: "#e9ecef",
                                              }}
                                            />
                                          )}
                                        </div>

                                        {/* RIGHT SIDE CONTENT */}
                                        <div>
                                          <h6 className="fw-bold mb-1">
                                            {lang.language
                                              ?.toLowerCase()
                                              .replace(/^\w/, (c) =>
                                                c.toUpperCase(),
                                              )}
                                          </h6>

                                          <p className="text-muted small mb-0">
                                            {lang.proficiency
                                              ?.toLowerCase()
                                              .replace(/^\w/, (c) =>
                                                c.toUpperCase(),
                                              )}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  },
                                )
                              ) : (
                                <p>No languages listed</p>
                              )}
                            </div>

                            <div className="mb-4">
                              <h5 className="fw-bold mb-3">Certificates</h5>

                              {candidateDetails?.certificates &&
                              candidateDetails.certificates.length > 0 ? (
                                candidateDetails.certificates.map(
                                  (cert, index) => {
                                    const isLast =
                                      index ===
                                      candidateDetails.certificates.length - 1;

                                    return (
                                      <div
                                        key={cert._id}
                                        className="position-relative d-flex gap-3 pb-4"
                                      >
                                        {/* LEFT SIDE (ICON + LINE) */}
                                        <div className="d-flex flex-column align-items-center position-relative">
                                          {/* ICON */}
                                          <div
                                            className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                              zIndex: 1,
                                            }}
                                          >
                                            <i className="fa-solid fa-certificate text-danger" />
                                          </div>

                                          {/* VERTICAL LINE */}
                                          {!isLast && (
                                            <div
                                              style={{
                                                position: "absolute",
                                                top: "40px",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                width: "2px",
                                                height: "100%",
                                                backgroundColor: "#e9ecef",
                                              }}
                                            />
                                          )}
                                        </div>

                                        {/* RIGHT SIDE CONTENT */}
                                        <div>
                                          <h6 className="fw-bold mb-1">
                                            {cert?.title
                                              ?.toLowerCase()
                                              .replace(/^\w/, (c) =>
                                                c.toUpperCase(),
                                              ) || "Not Provided"}
                                          </h6>

                                          <p className="text-muted small mb-0">
                                            Issued:{" "}
                                            {cert?.issueDate
                                              ? new Date(
                                                  cert.issueDate,
                                                ).getFullYear()
                                              : "Not Provided"}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  },
                                )
                              ) : (
                                <p>No certificates available</p>
                              )}
                            </div>
                            <div
                              className="mt-5 border-top pt-4"
                              ref={reviewSectionRef}
                            >
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">Reviews</h5>

                                {reviews.length > 0 && (
                                  <div className="d-flex align-items-center gap-2">
                                    <div className="text-warning fs-5">
                                      {renderStars(averageRating)}
                                    </div>
                                    <span className="fw-semibold">
                                      {averageRating}
                                    </span>
                                    <span className="text-muted small">
                                      ({reviews.length} reviews)
                                    </span>
                                  </div>
                                )}
                              </div>

                              {reviews.length > 0 ? (
                                reviews.map((item, index) => {
                                  const name =
                                    item?.senderCompany?.brandName ||
                                    item?.sender?.first_name ||
                                    "Anonymous";

                                  const profileImage = item?.senderCompany?.logo
                                    ? `${API_IMAGE_URL}${item.senderCompany.logo}`
                                    : "/jobPortal/assets/images/dashboard/images1.png";

                                  return (
                                    <div
                                      className="border rounded p-3 mb-3 shadow-sm"
                                      key={index}
                                    >
                                      <div className="d-flex gap-3">
                                        <img
                                          crossOrigin="anonymous"
                                          src={profileImage}
                                          alt="user"
                                          className="rounded-circle"
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                          }}
                                          onError={(e) =>
                                            (e.target.src =
                                              "/jobPortal/assets/images/dashboard/images1.png")
                                          }
                                        />

                                        <div className="flex-grow-1">
                                          <div className="d-flex justify-content-between">
                                            <h6 className="mb-1 fw-semibold">
                                              {name}
                                            </h6>
                                            <small className="text-muted">
                                              {new Date(
                                                item?.createdAt,
                                              ).toLocaleDateString()}
                                            </small>
                                          </div>

                                          <div className="text-warning mb-2">
                                            {renderStars(item?.rating)}
                                          </div>

                                          <p className="mb-0 text-muted">
                                            {truncateText(item?.message, 150)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-muted">No reviews yet.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: "500px" }}
                      >
                        <p className="text-muted">
                          Select a candidate to view details
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

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
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="modal-header">
              <h5>Add Review</h5>
              <span className="modal-close" onClick={() => setShowModal(false)}>
                &times;
              </span>
            </div>

            {/* ⭐ Star Rating */}
            <div className="star-rating-modal">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={
                    star <= (hover || rating)
                      ? "fa-solid fa-star"
                      : "fa-regular fa-star"
                  }
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>

            {/* Review Textarea */}
            <textarea
              className="form-control"
              placeholder="Write Message"
              rows={6}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            {/* Submit */}
            <button
              className="default-btn btn w-100 mt-3"
              onClick={async () => {
                if (!rating) return toast.error("Please select a rating!");
                if (!review.trim())
                  return toast.error("Review cannot be empty!");

                const token = localStorage.getItem("token");

                try {
                  const res = await axios.post(
                    `${API_BASE_URL}addReview`,
                    {
                      receiver: candidateDetails?.userId, // 👉 Receiver = candidate userId
                      message: review,
                      rating: rating,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );
                  getReviewsByUser(selectedCandidateId);
                  toast.success("Review submitted successfully!");
                  setTimeout(() => {
                    reviewSectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 300);
                  setShowModal(false);
                  setReview("");
                  setRating(0);
                } catch (error) {
                  console.error("Error submitting review:", error);
                  toast.error("Failed to submit review");
                }
              }}
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CandinatesList;
