import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";

function CandinatesList() {
  const token = localStorage.getItem("token");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [perPage, setPerPage] = useState(10); // default
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState("");

  const candidatesPerPage = 6; // ✅ show 6 candidates per page
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
  const experienceLevels = ["0-2", "2-4", "5-7", "8-10", "10+"];

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
    setSelectedLocation(city.name); // ✅ NAME
    setLocationSearchTerm(
      `${city.name}, ${city.state_name}, ${city.country_name}`,
    );
    setLocationSuggestions([]);
  };

  const clearLocationFilter = () => {
    setSelectedLocation(null);
    setLocationSearchTerm("");
    setLocationSuggestions([]);
  };

  const visibleEducation = showAllEducation
    ? educationLevels
    : educationLevels.slice(0, 5);
  const fetchCandidates = async (page = 1, limit = perPage) => {
    try {
      setLoading(true);

      // 🔥 split sortBy value
      let sortField = "";
      let sortOrder = "";

      if (sortBy) {
        const [field, order] = sortBy.split("|");
        sortField = field;
        sortOrder = order;
      }

      const response = await axios.post(
        `${API_BASE_URL}getCandidateList`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit,
            skills: selectedSkills.join(","),
            location: selectedLocation || "",
            education: selectedEducation.join(","),
            experience: selectedExperience.join(","),
            keyword: keyword.trim(),

            // ✅ SORTING PARAMS
            sortBy: sortField || undefined,
            order: sortOrder || undefined,
          },
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

  const startResult = totalResults === 0 ? 0 : (currentPage - 1) * perPage + 1;

  const endResult = Math.min(currentPage * perPage, totalResults);

  useEffect(() => {
    fetchCandidates(currentPage, perPage);
  }, [currentPage, perPage]);

  const JobListLoader = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p>Loading Candidates Listing, please wait...</p>
    </div>
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
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
  const toggleEducation = (value) => {
    setSelectedEducation((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );
  };
  useEffect(() => {
    fetchCandidates(1, perPage); // always reset to page 1
    setCurrentPage(1);
  }, [
    keyword,
    selectedSkills,
    selectedEducation,
    selectedExperience,
    selectedLocation,
    sortBy,
    perPage,
  ]);

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
                  <i className="fa-solid fa-angle-right" />Candidate Search
                </Link>
              </li>
            </ol>
          </div>
          <div className="candidate-listing-area">
            <div className="container">
              <div className="row">
                <div className="col-lg-3">
                  <div className="sidebar candidate-list-filter">
                    <div className="single-sidebar-widget keyword">
                      <h3>Search By Keyword</h3>
                      <form>
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Keywords / Job Title"
                            value={keyword}
                            onChange={(e) => {
                              setKeyword(e.target.value);
                              setCurrentPage(1); // reset page
                            }}
                          />
                        </div>
                      </form>
                    </div>
                    <div className="single-sidebar-widget skills">
                      <h3>Skills</h3>
                      <form>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type skill and press Enter"
                            value={skillInput}
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
                          {selectedSkills.length > 0 && (
                            <div className="mt-2 d-flex flex-wrap gap-2">
                              {selectedSkills.map((skill) => (
                                <span
                                  key={skill}
                                  className="badge bg-primary d-flex align-items-center"
                                >
                                  {skill}
                                  <span
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "6px",
                                      padding: "5px",
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
                      </form>
                    </div>
                    <div className="single-sidebar-widget">
                      <h3>Experience level</h3>
                      <div className="candidate-list-select-filter">
                        <ul>
                          {experienceLevels.map((exp, index) => (
                            <li key={index}>
                              <input
                                type="checkbox"
                                id={`exp-${index}`}
                                value={exp}
                                checked={selectedExperience.includes(exp)}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSelectedExperience((prev) =>
                                    prev.includes(value)
                                      ? prev.filter((i) => i !== value)
                                      : [...prev, value],
                                  );
                                }}
                              />
                              <label htmlFor={`exp-${index}`}>
                                {exp === "10+"
                                  ? "10+ Years"
                                  : exp.replace("-", " - ") + " Years"}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="single-sidebar-widget">
                      <h3>Education</h3>

                      <div className="candidate-list-select-filter">
                        <ul>
                          {/* First 5 */}
                          {educationLevels.slice(0, 5).map((edu, index) => (
                            <li key={edu}>
                              <input
                                type="checkbox"
                                id={`education-${index}`}
                                value={edu}
                                checked={selectedEducation.includes(edu)}
                                onChange={() => toggleEducation(edu)}
                              />
                              <label htmlFor={`education-${index}`}>
                                {edu}
                              </label>
                            </li>
                          ))}
                        </ul>

                        {/* Collapsed items */}
                        <div className="collapse" id="educationCollapse">
                          <ul>
                            {educationLevels.slice(5).map((edu, index) => {
                              const realIndex = index + 5;
                              return (
                                <li key={edu}>
                                  <input
                                    type="checkbox"
                                    id={`education-${realIndex}`}
                                    value={edu}
                                    checked={selectedEducation.includes(edu)}
                                    onChange={() => toggleEducation(edu)}
                                  />
                                  <label htmlFor={`education-${realIndex}`}>
                                    {edu}
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* Show More / Show Less */}
                        {educationLevels.length > 5 && (
                          <div
                            className="show-more-less-btn collapsed"
                            data-bs-toggle="collapse"
                            data-bs-target="#educationCollapse"
                            aria-expanded="false"
                          >
                            <span className="show-more">
                              Show More <i className="fa fa-angle-down" />
                            </span>
                            <span className="show-less">
                              Show Less <i className="fa fa-angle-up" />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="single-sidebar-widget location-style2">
                      <h3>Location</h3>

                      <div className="position-relative">
                        <input
                          type="search"
                          className="form-control"
                          placeholder="Search location"
                          value={locationSearchTerm}
                          onChange={handleLocationSearch}
                        />

                        {/* ❌ Clear icon */}
                        {selectedLocation && (
                          <span
                            onClick={clearLocationFilter}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                              fontSize: "16px",
                              color: "#999",
                            }}
                            title="Clear location"
                          >
                            ✕
                          </span>
                        )}
                      </div>

                      {/* Loading */}
                      {isLocationLoading && (
                        <div className="suggestion-box">Searching...</div>
                      )}

                      {/* Suggestions */}
                    </div>
                    {!isLocationLoading && locationSuggestions.length > 0 && (
                      <ul
                        className="list-group position-absolute "
                        style={{
                          zIndex: 1000,
                          maxHeight: "200px",
                          width: "250px",
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
                <div className="col-lg-9">
                  <div className="search-job-top-content">
                    <div className="row align-items-center">
                      <div className="col-lg-6 col-md-4">
                        <div className="shoing-content">
                          <span>
                            Showing {startResult} – {endResult} of{" "}
                            {totalResults} results
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-8">
                        <div className="candidate-list-short-info shorting-content">
                          <div className="row">
                            <div className="col-6">
                              <select
                                className="form-select form-control"
                                value={perPage}
                                onChange={(e) => {
                                  setPerPage(Number(e.target.value));
                                  setCurrentPage(1); // reset page
                                }}
                              >
                                <option value={10}>10 Per Page</option>
                                <option value={20}>20 Per Page</option>
                                <option value={50}>50 Per Page</option>
                              </select>
                            </div>
                            <div className="col-6">
                              <select
                                className="form-select form-control"
                                value={sortBy}
                                onChange={(e) => {
                                  setSortBy(e.target.value);
                                  setCurrentPage(1); // reset page on sort
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {loading ? (
                      <JobListLoader />
                    ) : candidates.length > 0 ? (
                      candidates.map((candidate, index) => {
                        // ✅ Declare variables here (not inside JSX)
                        const user = candidate?.userId || {};
                        const role = candidate?.aboutRole || {};

                        return (
                          <div
                            key={candidate._id || index}
                            className="col-lg-6 col-sm-6 aos-init aos-animate"
                            data-aos="fade-up"
                            data-aos-duration={1200}
                            data-aos-delay={200}
                          >
                            <div className="candidate-list-info single-freelancer-card">
                              <Link
                                to="/candidates-details"
                                state={{ userId: user._id }}
                              >
                                <div className="row align-items-center">
                                  <div className="col-lg-4">
                                    <div className="freelancer-img">
                                      <img
                                        src={
                                          cleanImageUrl(user?.profileImage) ||
                                          "assets/images/userIcon.png"
                                        }
                                        crossOrigin="anonymous"
                                        alt="Profile"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-8">
                                    <div className="freelancer-content">
                                      <h3>
                                        {`${user.first_name || ""} ${
                                          user.last_name || ""
                                        }`}
                                      </h3>

                                      <span>
                                        {role.jobTitle || "Not specified"}
                                      </span>
                                      <div className="info">
                                        <ul>
                                          <li>
                                            <i className="fa-solid fa-file" />{" "}
                                            {role.yearOfExperience
                                              ? `${role.yearOfExperience} Years`
                                              : "N/A"}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-money-bill" />
                                            {candidate.career_goals
                                              ?.MinimumDesiredSalary?.amount
                                              ? `$ ${candidate.career_goals?.MinimumDesiredSalary?.amount}/${candidate.career_goals?.MinimumDesiredSalary?.type}`
                                              : "$ 0"}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-location-dot" />
                                            {user.city ||
                                              "Location not available"}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-graduation-cap" />
                                            {candidate?.career_goals
                                              ?.DesiredEmploymentType ||
                                              "Not specified"}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-gear" />
                                            <span className="candidate-active">
                                              {candidate.profileVisible
                                                ? "Active"
                                                : "Inactive"}
                                            </span>
                                          </li>
                                        </ul>
                                      </div>

                                      <div
                                        className="candidate-list-bookmark"
                                        onClick={(e) => {
                                          e.preventDefault(); // 🔥 stop form submit
                                          e.stopPropagation(); // 🔥 stop parent navigation
                                          handleBookmark(
                                            user?._id,
                                            candidate.jobId,
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
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center">No candidates found.</p>
                    )}
                  </div>

                  <div className="paginations mb-30">
                    <ul>
                      {/* Previous button */}
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              handlePageChange(currentPage - 1);
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
                            if (currentPage < totalPages)
                              handlePageChange(currentPage + 1);
                          }}
                          className={
                            currentPage === totalPages ? "disabled" : ""
                          }
                        >
                          <i className="fa-solid fa-angle-right" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

export default CandinatesList;
