import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import Swal from "sweetalert2";

import { ToastContainer, toast } from "react-toastify";
function EmployerShortListCandinate() {
  const cityDropdownRef = useRef(null);
  const [hoveredCandidate, setHoveredCandidate] = useState(null);
  const [showCityOptions, setShowCityOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCandidates, setTotalCandidates] = useState(0); // ✅ ADD THIS
  const token = localStorage.getItem("token");
  const [selectedJob, setSelectedJob] = useState("");
  const [search, setSearch] = useState("");
  const [folders, setFolders] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [seniorityLevels, setSeniorityLevels] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [activeFolder, setActiveFolder] = useState("all");
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [country, setCountry] = useState([]);
  const [cityList, setCityList] = useState([]);
  // const [customFolders, setCustomFolders] = useState([
  //   { id: "top-talents", name: "Top Talents", type: "custom" },
  // ]);
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
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "VISHAL PATEL",
      skill: "node js",
      city: "Varanasi",
      folder: "all",
    },
    {
      id: 2,
      name: "Neha Singh",
      skill: "React Developer",
      city: "Noida",
      folder: "marketing",
    },
  ]);

  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  const handleFolderClick = (folderId) => {
    setActiveFolder(folderId);
    setCurrentPage(1);
  };

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name");

    // If user clicked Cancel → do nothing
    if (folderName === null) {
      return;
    }

    // If empty string after clicking OK → show validation
    if (folderName.trim() === "") {
      toast.error("Folder name is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}createBookmarkFolder`,
        { name: folderName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setFolders((prev) => [...prev, res.data.folder]);
        toast.success("Folder created successfully");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const result = await Swal.fire({
      title: "Delete Folder?",
      text: "All bookmarked candidates inside this folder will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);

        const res = await axios.delete(
          `${API_BASE_URL}bookmark-folder/${folderId}/candidates`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Folder deleted successfully.",
            timer: 1500,
            showConfirmButton: false,
          });

          // Refresh folders list
          fetchFolders();

          // If active folder was deleted → reset
          if (activeFolder === folderId) {
            setActiveFolder("all");
          }
        }
      } catch (error) {
        console.error("Delete folder error:", error);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Unable to delete folder.",
        });
      } finally {
        setLoading(false);
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
  const filters = {
    selectedJob,
    selectedSkills,
    selectedExperience,
    selectedEducation,
    selectedAvailability,
    selectedCountry,
    selectedCity,
  };
  const fetchApplicants = async (
    page = 1,
    customFilters = filters,
    customSearch = search,
    folderId = activeFolder,
  ) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE_URL}getFolderCandidates`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          folderId: folderId !== "all" ? folderId : undefined,
          search: customSearch || undefined,
          skills:
            customFilters.selectedSkills?.length > 0
              ? customFilters.selectedSkills.join(",")
              : undefined,
          experience: customFilters.selectedExperience || undefined,
          education: customFilters.selectedEducation || undefined,
          availability: customFilters.selectedAvailability || undefined,
          country: customFilters.selectedCountry || undefined,
          city: customFilters.selectedCity || undefined,
          page: page,
          limit: 20,
        },
      });

      if (res.data.success) {
        setApplicants(res.data.data);
        setTotalCandidates(res.data.total || 0); // ✅ ADD THIS
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
    activeFolder, // ✅ ADD THIS
    selectedJob,
    search,
    selectedSkills,
    selectedExperience,
    selectedEducation,
    selectedAvailability,
    selectedCountry,
    selectedCity,
  ]);
  const handleRemoveBookmark = async (bookmarkId) => {
    const result = await Swal.fire({
      title: "Remove from Bookmark?",
      text: "This candidate will be removed from your bookmarks.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, remove",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_BASE_URL}removeBookmark/${bookmarkId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Removed!",
            text: "Candidate removed from bookmark.",
            timer: 1500,
            showConfirmButton: false,
          });

          // Refresh list
          fetchApplicants(currentPage);

          // OR instant remove without API refetch (faster UI)
          // setApplicants(prev => prev.filter(item => item._id !== bookmarkId));
        }
      } catch (error) {
        console.error("Remove bookmark error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE_URL}getFolders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setFolders(res.data.folders);
        }
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, []);
  const autoJobFolders = folders.filter((folder) => folder.type === "AUTO_JOB");

  const customFolders = folders.filter((folder) => folder.type === "CUSTOM");

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
  return (
    <>
      <ToastContainer />
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
          <div className="bookmark-container">
            <aside className="folder-sidebar">
              <div className="folder-sidebar-header">
                <h3>Bookmarks</h3>
              </div>

              <div className="folder-list-container">
                {/* ALL CANDIDATES */}
                <div className="folder-section">
                  <div
                    className={`folder-item ${activeFolder === "all" ? "active" : ""}`}
                    onClick={() => handleFolderClick("all")}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      viewBox="0 0 512 512"
                      className="folder-icon"
                      height="1em"
                      width="1em"
                    >
                      <path d="M400 480a16 16 0 0 1-10.63-4L256 357.41 122.63 476A16 16 0 0 1 96 464V96a64.07 64.07 0 0 1 64-64h192a64.07 64.07 0 0 1 64 64v368a16 16 0 0 1-16 16z" />
                    </svg>

                    <span className="folder-name">All Candidates</span>
                    <span className="folder-count">{totalCandidates}</span>
                  </div>
                </div>

                {/* JOB OFFERS */}
                {/* JOB OFFERS */}
                <div className="folder-section">
                  <div className="folder-section-label">Job Offers</div>

                  {autoJobFolders.map((folder) => (
                    <div
                      key={folder._id}
                      className={`folder-item ${
                        activeFolder === folder._id ? "active" : ""
                      }`}
                      onClick={() => handleFolderClick(folder._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        viewBox="0 0 512 512"
                        className="folder-icon"
                        height="1em"
                        width="1em"
                      >
                        <path d="M320 336c0 8.84-7.16 16-16 16h-96c-8.84 0-16-7.16-16-16v-48H0v144c0 25.6 22.4 48 48 48h416c25.6 0 48-22.4 48-48V288H320v48zM464 128h-80V80c0-25.6-22.4-48-48-48H176c-25.6 0-48 22.4-48 48v48H48c-25.6 0-48 22.4-48 48v80h512v-80c0-25.6-22.4-48-48-48z" />
                      </svg>

                      <span className="folder-name">{folder.name}</span>

                      <span className="folder-badge auto">Auto</span>
                    </div>
                  ))}
                </div>

                {/* CUSTOM FOLDERS */}
                {/* CUSTOM FOLDERS */}
                <div className="folder-section">
                  <div className="folder-section-label">Custom Folders</div>

                  {customFolders.map((folder) => (
                    <div
                      key={folder._id}
                      className={`folder-item ${
                        activeFolder === folder._id ? "active" : ""
                      }`}
                      onClick={() => handleFolderClick(folder._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        viewBox="0 0 512 512"
                        className="folder-icon"
                        height="1em"
                        width="1em"
                      >
                        <path d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z" />
                      </svg>

                      <span className="folder-name">{folder.name}</span>

                      <div
                        className="folder-actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="btn btn-sm text-danger"
                          // onClick={() => handleDeleteFolder(folder._id)}
                        >
                          <div className="folder-actions ms-auto d-flex gap-2">
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth={0}
                              viewBox="0 0 448 512"
                              className="text-danger"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ "font-size": "12px" }}
                            >
                              <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" />
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    className="create-folder-btn w-100 mt-2"
                    onClick={handleCreateFolder}
                  >
                    + Create Folder
                  </button>
                </div>
              </div>
            </aside>

            <main className="bookmark-main-content">
              <header className="bookmark-content-header">
                <div className="header-left">
                  <h1>
                    {activeFolder === "all"
                      ? "All Candidates"
                      : folders.find((f) => f._id === activeFolder)?.name ||
                        "Folder"}
                  </h1>
                  <p className="text-muted mb-0">
                    {totalCandidates} candidate
                    {totalCandidates !== 1 && "s"} in this folder
                  </p>
                </div>
                <div className="header-right header-controls">
                  <select className="per-page-select">
                    <option value={20}>Show: 20</option>
                    <option value={30}>Show: 30</option>
                    <option value={50}>Show: 50</option>
                  </select>
                  <div className="search-input-group">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 512 512"
                      color="#999"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: "rgb(153, 153, 153)" }}
                    >
                      <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                    </svg>
                    <input
                      placeholder="Search candidates..."
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </header>
              <div className="bookmark-filters-row px-4 pt-3 pb-2 bg-white border-bottom">
                <div className="row g-2 align-items-end">
                  <div className="col-md">
                    <label className="filter-label-inline">SKILLS</label>

                    <input
                      type="text"
                      className="form-control form-control-sm w-100"
                      placeholder="Type skill & press Enter"
                      value={skillInput}
                      style={{ height: "38px", fontSize: "12px" }}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && skillInput.trim()) {
                          e.preventDefault();
                          if (!selectedSkills.includes(skillInput.trim())) {
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
                      <div className="d-flex flex-wrap gap-1 mt-2">
                        {selectedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="badge bg-primary d-flex align-items-center gap-1"
                            style={{ fontSize: "10px" }}
                          >
                            {skill}
                            <span
                              style={{ cursor: "pointer", marginLeft: "6px" }}
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

                  <div className="col">
                    <label className="filter-label-inline">Country</label>
                    <select
                      className="form-select form-select-sm"
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
                  <div className="col">
                    <label className="filter-label-inline">City</label>
                    <select
                      className="form-select form-select-sm"
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
                  <div className="col">
                    <label className="filter-label-inline">Exp.</label>

                    <select
                      value={selectedExperience}
                      onChange={(e) => setSelectedExperience(e.target.value)}
                      className="form-select form-select-sm"
                      style={{ "font-size": "13px", padding: "8px" }}
                    >
                      <option value="">All Levels</option>
                      {seniorityLevels.map((level) => (
                        <option key={level._id} value={level.name}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <label className="filter-label-inline">Edu.</label>

                    <select
                      value={selectedEducation}
                      onChange={(e) => setSelectedEducation(e.target.value)}
                      className="form-select form-select-sm"
                      style={{ "font-size": "13px", padding: "8px" }}
                    >
                      <option value="">Any</option>
                      {educationLevels.map((edu) => (
                        <option key={edu} value={edu}>
                          {edu}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <label className="filter-label-inline">Availability</label>

                    <select
                      value={selectedAvailability}
                      onChange={(e) => setSelectedAvailability(e.target.value)}
                      className="form-select form-select-sm"
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
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    className="btn btn-sm btn-outline-secondary px-3"
                    onClick={() => {
                      setSelectedSkills([]);
                      setSelectedExperience("");
                      setSelectedEducation("");
                      setSelectedAvailability("");
                      setSelectedCountry("");
                      setSelectedCity("");
                      setSearch("");
                      setCurrentPage(1);
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="btn btn-sm btn-primary px-4"
                    onClick={() => {
                      setCurrentPage(1);
                      fetchApplicants(1);
                    }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
              <div
                className="bookmark-list-area p-4"
                style={{ overflow: "visible" }}
              >
                {" "}
                <div className="bookmark-user-list-cell">
                  {applicants.length === 0 ? (
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
                          No applicants match your current filters. Try
                          adjusting your filter criteria or reset filters to see
                          more candidates.
                        </p>

                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setSelectedSkills([]);
                            setSelectedExperience("");
                            setSelectedEducation("");
                            setSelectedAvailability("");
                            setSelectedCountry("");
                            setSelectedCity("");
                            setSearch("");
                            setCurrentPage(1);
                          }}
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  ) : (
                    applicants.map((candidate) => {
                      const user = candidate.userId;
                      const role = candidate.aboutRole;

                      return (
                        <div
                          key={candidate._id}
                          className="candidate-row"
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setShowProfile(true);
                          }}
                          onMouseEnter={() => setHoveredCandidate(candidate)}
                          onMouseLeave={() => setHoveredCandidate(null)}
                        >
                          <img
                            crossOrigin="anonymous"
                            className="candidate-avatar"
                            alt={candidate.fullName}
                            src={
                              cleanImageUrl(user.profileImage) ||
                              "assets/images/userIcon.png"
                            }
                          />

                          <div className="candidate-info">
                            <h4 className="candidate-name">
                              {candidate.fullName}
                            </h4>

                            <div className="candidate-meta">
                              <span className="me-3">
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth={0}
                                  viewBox="0 0 512 512"
                                  className="me-1"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M320 336c0 8.84-7.16 16-16 16h-96c-8.84 0-16-7.16-16-16v-48H0v144c0 25.6 22.4 48 48 48h416c25.6 0 48-22.4 48-48V288H320v48zm144-208h-80V80c0-25.6-22.4-48-48-48H176c-25.6 0-48 22.4-48 48v48H48c-25.6 0-48 22.4-48 48v80h512v-80c0-25.6-22.4-48-48-48zm-144 0H192V96h128v32z" />
                                </svg>
                                {role?.jobTitle || "N/A"}
                              </span>
                              <span>
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth={0}
                                  viewBox="0 0 512 512"
                                  className="me-1"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                                </svg>
                                {user?.city && user?.Nationality
                                  ? `${user.city}, ${user.Nationality}`
                                  : user?.city || user?.Nationality || "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="candidate-actions">
                            <Link
                              className="btn btn-sm btn-light"
                              to={`/candidates-details`}
                              state={{
                                userId: candidate?.userId?._id,
                                from: "/bookmark-candidate",
                              }}
                            >
                              View Profile
                            </Link>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleRemoveBookmark(candidate._id)
                              }
                            >
                              <div className="folder-actions ms-auto d-flex gap-2">
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth={0}
                                  viewBox="0 0 448 512"
                                  className="text-danger"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                  style={{ "font-size": "12px" }}
                                >
                                  <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" />
                                </svg>
                              </div>
                            </button>
                          </div>
                          {/* {hoveredCandidate?._id === candidate._id && ( */}
                            <div className="hover-profile-card">
                              <div className="user-hover-short-details card">
                                {/* HEADER */}
                                <div className="header">
                                  <img
                                    crossOrigin="anonymous"
                                    className="profile-pic"
                                    alt={candidate.fullName}
                                    src={
                                      cleanImageUrl(user?.profileImage) ||
                                      "assets/images/userIcon.png"
                                    }
                                  />

                                  <div className="header-info">
                                    <h1>{candidate.fullName}</h1>
                                    <p>
                                      {candidate.aboutRole?.jobTitle || "N/A"}
                                    </p>
                                    <svg
                                      stroke="currentColor"
                                      fill="currentColor"
                                      strokeWidth={0}
                                      viewBox="0 0 512 512"
                                      className="me-1"
                                      height="1em"
                                      width="1em"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                                    </svg>
                                    {candidate.userId?.city &&
                                    candidate.userId?.Nationality
                                      ? `${candidate.userId.city}, ${candidate.userId.Nationality}`
                                      : candidate.userId?.city ||
                                        candidate.userId?.Nationality ||
                                        "N/A"}
                                  </div>
                                </div>

                                {/* DETAILS GRID */}
                                <div className="details-grid">
                                  <div className="detail-item">
                                    <p>Experience</p>
                                    <span>
                                      {candidate.aboutRole?.yearOfExperience
                                        ? `${candidate.aboutRole.yearOfExperience} Years`
                                        : "N/A"}
                                    </span>
                                  </div>

                                  <div className="detail-item">
                                    <p>Availability</p>
                                    <span className="na">
                                      {candidate.career_goals
                                        ?.jobSearchStatus || "N/A"}
                                    </span>
                                  </div>

                                  <div className="detail-item">
                                    <p>Education</p>
                                    <span>
                                      {candidate.education?.length > 0
                                        ? `${candidate.education[0].degree} - ${candidate.education[0].University}`
                                        : "N/A"}
                                    </span>
                                  </div>

                                  <div className="detail-item">
                                    <p>Languages</p>
                                    <span>
                                      {candidate.languages?.length > 0
                                        ? candidate.languages.join(", ")
                                        : "N/A"}
                                    </span>
                                  </div>
                                </div>

                                {/* PROFESSIONAL SUMMARY */}
                                {candidate.aboutRole?.professionalSummary && (
                                  <div className="skills-section">
                                    <h2>PROFESSIONAL SUMMARY</h2>
                                    <p>
                                      {candidate.aboutRole.professionalSummary}
                                    </p>
                                  </div>
                                )}

                                {/* SKILLS */}
                                {candidate.skills?.length > 0 && (
                                  <div className="skills-section">
                                    <h2>Skills</h2>
                                    <div className="skills-list">
                                      {candidate.skills
                                        .slice(0, 6)
                                        .map((skill, index) => (
                                          <span
                                            key={index}
                                            className="skill-tag"
                                          >
                                            {skill}
                                          </span>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          {/* )} */}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </main>
          </div>

          <div
            className={`side-panel-overlay ${showProfile ? "open" : ""}`}
            onClick={() => setShowProfile(false)}
          >
            <div
              className="side-panel-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="side-panel-header">
                <h2>Candidate Profile</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowProfile(false)}
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 1024 1024"
                    fillRule="evenodd"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926 224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512 166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" />
                  </svg>
                </button>
              </div>
              <div className="side-panel-body">
                <div className="profile-top text-center mb-4">
                  {selectedCandidate && (
                    <>
                      <img
                        crossOrigin="anonymous"
                        className="profile-img-large mb-3"
                        src={
                          cleanImageUrl(
                            selectedCandidate.userId?.profileImage,
                          ) || "assets/images/userIcon.png"
                        }
                        alt={selectedCandidate.fullName}
                      />

                      <h3>{selectedCandidate.fullName}</h3>

                      <p className="text-muted">
                        {selectedCandidate.aboutRole?.jobTitle}
                      </p>
                    </>
                  )}
                </div>
                <div className="profile-info-section">
                  <h4>Contact Information</h4>
                  <ul className="info-list">
                    <li>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z" />
                      </svg>{" "}
                      <li>{selectedCandidate?.userId?.email}</li>
                    </li>
                    <li>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z" />
                      </svg>{" "}
                      {selectedCandidate?.userId?.phone}
                    </li>
                    <li>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 384 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
                      </svg>{" "}
                      {selectedCandidate?.userId?.city}
                    </li>
                  </ul>
                </div>
                <div className="profile-info-section work-section">
                  <h6 className="section-title1">WORK EXPERIENCE</h6>

                  <div className="divider" />

                  {/* Total Experience */}
                  <div className="total-exp">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 512 512"
                      height="16"
                      width="16"
                      className="me-2"
                    >
                      <path d="M320 336c0 8.84-7.16 16-16 16h-96c-8.84 0-16-7.16-16-16v-48H0v144c0 25.6 22.4 48 48 48h416c25.6 0 48-22.4 48-48V288H320v48zm144-208h-80V80c0-25.6-22.4-48-48-48H176c-25.6 0-48 22.4-48 48v48H48c-25.6 0-48 22.4-48 48v80h512v-80c0-25.6-22.4-48-48-48zm-144 0H192V96h128v32z" />
                    </svg>
                    {selectedCandidate?.workHistory?.reduce(
                      (total, job) =>
                        total + parseFloat(job.yearOfExperience || 0),
                      0,
                    )}{" "}
                    Years Experience
                  </div>

                  {/* Experience List */}
                  {selectedCandidate?.workHistory
                    ?.sort(
                      (a, b) => new Date(b.startDate) - new Date(a.startDate),
                    )
                    .map((job) => (
                      <div key={job._id} className="experience-block">
                        <div className="job-title">{job.jobTitle}</div>

                        <div className="company-name">
                          at{" "}
                          {job.keep_employer_anonymous
                            ? "Confidential"
                            : job.companyName}
                        </div>

                        <div className="job-duration">
                          {new Date(job.startDate).getFullYear()} -{" "}
                          {job.currentlyWorkingHere
                            ? "Present"
                            : job.endDate
                              ? new Date(job.endDate).getFullYear()
                              : ""}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="profile-info-section education-section">
                  <h6 className="section-title1">EDUCATION</h6>

                  <div className="divider" />

                  {selectedCandidate?.education
                    ?.sort(
                      (a, b) => new Date(b.startDate) - new Date(a.startDate),
                    )
                    .map((edu) => (
                      <div key={edu._id} className="education-block">
                        <div className="education-row">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 640 512"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M622.34 153.2L343.4 67.5c-15.2-4.67-31.6-4.67-46.79 0L17.66 153.2c-23.54 7.23-23.54 38.36 0 45.59l48.63 14.94c-10.67 13.19-17.23 29.28-17.88 46.9C38.78 266.15 32 276.11 32 288c0 10.78 5.68 19.85 13.86 25.65L20.33 428.53C18.11 438.52 25.71 448 35.94 448h56.11c10.24 0 17.84-9.48 15.62-19.47L82.14 313.65C90.32 307.85 96 298.78 96 288c0-11.57-6.47-21.25-15.66-26.87.76-15.02 8.44-28.3 20.69-36.72L296.6 284.5c9.06 2.78 26.44 6.25 46.79 0l278.95-85.7c23.55-7.24 23.55-38.36 0-45.6zM352.79 315.09c-28.53 8.76-52.84 3.92-65.59 0l-145.02-44.55L128 384c0 35.35 85.96 64 192 64s192-28.65 192-64l-14.18-113.47-145.03 44.56z"></path>
                          </svg>

                          <div>
                            <div className="degree-line">
                              {edu.degree} - {edu.University}
                            </div>

                            <div className="education-year">
                              ({new Date(edu.startDate).getFullYear()} -{" "}
                              {edu.currentlyStudyingHere
                                ? "Present"
                                : new Date(edu.endDate).getFullYear()}
                              )
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="profile-info-section">
                  <h4>Skills</h4>
                  <div className="skills-tags">
                    {selectedCandidate?.skills?.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="side-panel-footer">
                <Link
                  className="default-btn btn-primary w-100 mb-2"
                  to={`/candidates-details`}
                  state={{
                    userId: selectedCandidate?.userId?._id,
                    from: "/bookmark-candidate",
                  }}
                >
                  {" "}
                  View Full Profile
                </Link>
                <button className="btn btn-outline-danger w-100">
                  Remove from Folder
                </button>
              </div>
            </div>
          </div>

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
