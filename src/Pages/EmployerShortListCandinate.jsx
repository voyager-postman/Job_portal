import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
function EmployerShortListCandinate() {
  const { t, i18n } = useTranslation("global");


  const cityDropdownRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const availabilityRef = useRef(null);
  const salaryRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const experienceLevels = [
    { label: "- de 1 an", value: "0-1" },
    { label: "1–2 ans", value: "1-2" },
    { label: "3–4 ans", value: "3-4" },
    { label: "5–10 ans", value: "5-10" },
    { label: "11–15 ans", value: "11-15" },
    { label: "+ de 15 ans", value: "15+" },
  ];
  const availabilityOptions = ["Immediate", "1 month", "1-3 months", "More"];
  const [perPage, setPerPage] = useState(100000);
  const [totalResults, setTotalResults] = useState(0);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [showAllExperience, setShowAllExperience] = useState(false);

  const [hoveredCandidate, setHoveredCandidate] = useState(null);
  const [showCityOptions, setShowCityOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
  const [totalCandidates, setTotalCandidates] = useState(0); // ✅ ADD THIS
  const token = localStorage.getItem("token");
  const [selectedJob, setSelectedJob] = useState("");
  const [search, setSearch] = useState("");
  const [folders, setFolders] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState([]);
  const [showSalaryDropdown, setShowSalaryDropdown] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] =
    useState(false);

  const [selectedCities, setSelectedCities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [seniorityLevels, setSeniorityLevels] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [activeFolder, setActiveFolder] = useState("all");
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [country, setCountry] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(5000);
  const educationLevels = [
    t("header.High_School"),
    t("header.Secondary_School"),
    t("header.Higher_Secondary"),
    t("header.Certificate"),
    t("header.Diploma"),
    t("header.Associate_Degree"),
    t("header.Bachelor_Degree"),
    t("header.Master_Degree"),
    t("header.Doctorate"),
    t("header.Post_Doctorate"),
    t("header.Professional_Degree"),
  ];

  const handleDownloadCV = () => {
    const resumes = candidateDetails?.resumeUrls;

    if (!resumes || resumes.length === 0) {
      toast.info(t("header.No_CV_uploaded_by_candidate"), {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const latestResume = resumes[resumes.length - 1];
    const fileUrl = `${API_IMAGE_URL}${latestResume.url}`;

    window.open(fileUrl, "_blank");
  };
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - 50);
    setMinValue(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + 50);
    setMaxValue(value);
  };
  const minPercent = (minValue / 5000) * 100;
  const maxPercent = (maxValue / 5000) * 100;
  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  const handleFolderClick = (folderId) => {
    setActiveFolder(folderId);
    setCurrentPage(1);
  };
  const handleUnlockContact = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}viewCandidate/${candidateDetails.userId._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.data.success) {
        toast.error(response.data.message);

        // 🚀 Navigate only if credits exhausted
        if (response.data.is_exhausted === 1) {
          setTimeout(() => {
            navigate("/add-plan");
          }, 2000);
        }

        return;
      }

      // ✅ Unlock success
      setCandidateDetails((prev) => ({
        ...prev,
        isUnlocked: true,
      }));
    } catch (error) {
      const message = error.response?.data?.message;
      const exhausted = error.response?.data?.is_exhausted;

    toast.error(message || t("header.something_wrong"));

      // 🚀 Navigate only if exhausted
      if (exhausted === 1) {
        setTimeout(() => {
          navigate("/add-plan");
        }, 2000);
      }
    }
  };
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
  const handleCreateFolder = async () => {
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
        toast.success(t("header.Folder_created_successfully"));
        setShowModal(false);
        setFolderName(""); // reset input
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("header.Failed_to_create_folder");
    }
  };
  useEffect(() => {
    if (selectedCandidateId) {
      fetchCandidateDetails(selectedCandidateId);
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

      setCandidateDetails(res.data?.data);
    } catch (err) {
      console.error("Error fetching candidate details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const result = await Swal.fire({
      title: t("header.Delete_Folder"),
      text: t(
        "header.All_bookmarked_candidates_inside_this_folder_will_be_removed",
      ),
      icon: t("header.warning"),
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: t("header.Yes_delete_it"),
      cancelButtonText: t("header.Cancel"),
    });

    if (!result.isConfirmed) return;

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
        // ✅ Remove folder instantly from UI (No reload flicker)
        setFolders((prev) => prev.filter((folder) => folder._id !== folderId));

        // ✅ If deleted folder was active → reset to "all"
        if (activeFolder === folderId) {
          setActiveFolder("all");
        }

        // ✅ Success popup with OK button
        await Swal.fire({
          icon: t("header.success"),
          title: t("header.Deleted"),
          text: t("header.Folder_deleted_successfully"),
          confirmButtonColor: "#3085d6",
          confirmButtonText: t("header.OK"),
        });
      }
    } catch (error) {
      console.error("Delete folder error:", error);

      Swal.fire({
        icon: t("header.error"),
        title: t("header.Failed"),
        text: t("header.Unable_to_delete_folder"),
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };
  const toggleExperience = (exp) => {
    if (selectedExperience.includes(exp)) {
      setSelectedExperience(selectedExperience.filter((e) => e !== exp));
    } else {
      setSelectedExperience([...selectedExperience, exp]);
    }
  };
  const toggleEducation = (edu) => {
    if (selectedEducation.includes(edu)) {
      setSelectedEducation(selectedEducation.filter((e) => e !== edu));
    } else {
      setSelectedEducation([...selectedEducation, edu]);
    }
  };
  const toggleAvailability = (value) => {
    if (selectedAvailability.includes(value)) {
      setSelectedAvailability(
        selectedAvailability.filter((item) => item !== value),
      );
    } else {
      setSelectedAvailability([...selectedAvailability, value]);
    }
  };
  const toggleSalary = (value) => {
    if (selectedSalary.includes(value)) {
      setSelectedSalary(selectedSalary.filter((item) => item !== value));
    } else {
      setSelectedSalary([...selectedSalary, value]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        experienceRef.current &&
        !experienceRef.current.contains(event.target)
      ) {
        setShowExperienceDropdown(false);
      }

      if (
        educationRef.current &&
        !educationRef.current.contains(event.target)
      ) {
        setShowEducationDropdown(false);
      }

      if (
        availabilityRef.current &&
        !availabilityRef.current.contains(event.target)
      ) {
        setShowAvailabilityDropdown(false);
      }

      if (salaryRef.current && !salaryRef.current.contains(event.target)) {
        setShowSalaryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const clearEducation = () => {
    setSelectedEducation([]);
  };
  const clearAvailability = () => {
    setSelectedAvailability([]);
  };
  const clearSalary = () => {
    setSelectedSalary([]);
  };
  const handleResetFilters = () => {
    setSelectedSkills([]);
    setSelectedExperience([]);
    setSelectedEducation([]);
    setSelectedSalary([]);
    setSelectedAvailability([]);
    setSelectedCountry("");
    setSelectedCity("");
    setSelectedJob("");

    setMinValue(0);
    setMaxValue(5000);
    setIsFreelancer(false);

    setShowExperienceDropdown(false);
    setShowSalaryDropdown(false);
    setShowEducationDropdown(false);
    setShowAvailabilityDropdown(false);

    setSearch("");
    setCurrentPage(1);

    setTimeout(() => {
      fetchApplicants(1);
    }, 0);
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
  const clearExperience = () => {
    setSelectedExperience([]);
  };
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

      let sortField = "";
      let sortOrder = "";

      if (sortBy) {
        const [field, order] = sortBy.split("|");
        sortField = field;
        sortOrder = order;
      }

      const res = await axios.get(`${API_BASE_URL}getFolderCandidates`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          folderId: folderId !== "all" ? folderId : undefined,
          search: customSearch || undefined,
          skills:
            customFilters.selectedSkills?.length > 0
              ? customFilters.selectedSkills.join(",")
              : undefined,
          experience:
            customFilters.selectedExperience?.length > 0
              ? customFilters.selectedExperience.join(",")
              : undefined,
          education:
            customFilters.selectedEducation?.length > 0
              ? customFilters.selectedEducation.join(",")
              : undefined,
          availability:
            customFilters.selectedAvailability?.length > 0
              ? customFilters.selectedAvailability.join(",")
              : undefined,
          salary:
            selectedSalary?.length > 0
              ? selectedSalary
                  .map(
                    (item) => item.replace(/\s*dh$/i, "").trim(), // ✅ remove "dh"
                  )
                  .join(",")
              : undefined,

          country: customFilters.selectedCountry || undefined,
          city: customFilters.selectedCity || undefined,
          tjm: isFreelancer ? `${minValue}-${maxValue}` : undefined,
          freelance: isFreelancer,
          sortByExp: sortBy || undefined, // ✅ FIXED
          order: sortOrder || undefined,
          page: page,
          limit: perPage,
        },
      });

      if (res.data.success) {
        const list = res.data.data || [];

        setApplicants(list);
        setTotalCandidates(res.data.total || 0);

        if (list.length > 0) {
          setSelectedCandidateId(list[0]?.userId?._id);
        } else {
          setSelectedCandidateId(null);

          // ✅ ADD THIS (VERY IMPORTANT)
          setCandidateDetails(null);
        }
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
    perPage,
    activeFolder,
    selectedJob,
    search,
    selectedSkills,
    selectedExperience,
    selectedSalary, // ✅ ADD THIS
    selectedEducation,
    selectedAvailability,
    selectedCountry,
    selectedCity,
    sortBy,
    minValue,
    maxValue,
    isFreelancer,
  ]);
  const handleRemoveBookmark = async (bookmarkId) => {
    const result = await Swal.fire({
      title: t("header.Remove_from_Bookmark"),
      text: t("header.This_candidate_will_be_removed_from_your_bookmarks"),
      icon: t("header.warning"),
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: t("header.Yes_remove"),
      cancelButtonText: t("header.Cancel"),
    });

    if (!result.isConfirmed) return;

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
        fetchApplicants(currentPage);
        // ✅ Remove instantly from UI (better UX)

        // ✅ Success popup WITH OK button
        await Swal.fire({
          icon: t("header.success"),
          title: t("header.Removed"),
          text: t("header.Candidate_removed_from_bookmark"),
          confirmButtonColor: "#3085d6",
          confirmButtonText: t("header.OK"),
        });
      }
    } catch (error) {
      console.error("Remove bookmark error:", error);

      Swal.fire({
        icon: t("header.error"),
        title: t("header.error"),
        text: t("header.something_wrong"),
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

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
  useEffect(() => {
    if (applicants.length > 0) {
      setSelectedCandidateId(applicants[0]?.userId?._id);
    }
  }, [applicants]);
  useEffect(() => {
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
            <h1> {t("header.Bookmark_Candidates")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/"> {t("header.home")}</Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" />{" "}
                  {t("header.dashboard")}
                </Link>
              </li>
              <li className="item">
                <Link to="/bookmark-candidate">
                  <i className="fa-solid fa-angle-right" />{" "}
                  {t("header.Bookmark_Candidates")}
                </Link>
              </li>
            </ol>
          </div>
          <div className="employer-dashboard-common-heading  pb-3">
            <h2> {t("header.Candidates_Bookmark")}</h2>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start Bookmark Jobs Area*/}
          <div className="bg-white p-4 rounded shadow-sm border mt-3 mb-4 ">
            <div className="row g-3 mb-4">
              <div className="col-12 mb-3">
                <h5 className="mb-0 fw-bold">
                  All Candidates{t("header.All_Candidates")}{" "}
                  <span className="text-muted fs-6 fw-normal">
                    ({totalCandidates || 0} {t("header.candidates")})
                  </span>
                </h5>
              </div>
              <div className="col-12">
                <div className="d-flex gap-2">
                  <div className="flex-grow-1 position-relative">
                    <i
                      className="fa-solid fa-magnifying-glass position-absolute"
                      style={{
                        left: "15px",
                        top: "50%",
                        "-webkit-transform": "translateY(-50%)",
                        "-ms-transform": "translateY(-50%)",
                        transform: "translateY(-50%)",
                        color: "rgb(102, 102, 102)",
                      }}
                    />
                    <input
                      className="form-control ps-5 py-2"
                      type="text"
                      placeholder={t("header.Search_candidates_by_name")}
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      style={{
                        height: "45px",
                        "border-radius": "8px",
                        "background-color": "rgb(240, 245, 247)",
                      }}
                    />
                  </div>
                  <button
                    className="btn btn-outline-secondary px-3 d-flex align-items-center gap-2"
                    style={{
                      height: "45px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      border: "1px solid rgb(221, 221, 221)",
                    }}
                    onClick={() => setShowFilter(!showFilter)}
                  >
                    <i
                      className={`fa-solid ${
                        showFilter ? "fa-chevron-up" : "fa-filter"
                      }`}
                    />
                    {showFilter
                      ? t("header.Hide_Filters")
                      : t("header.Show_Filters")}
                  </button>
                  <button
                    className="btn btn-primary px-4 fw-bold"
                    onClick={() => {
                      setCurrentPage(1);
                      fetchApplicants(1); // ✅ CALL API
                    }}
                    style={{
                      height: "45px",
                      "border-radius": "8px",
                      background: "rgb(243, 122, 71)",
                      border: "none",
                    }}
                  >
                    {t("header.Find_Candidate")}
                  </button>
                </div>
              </div>
            </div>

            {showFilter && (
              <>
                <div className="advanced-filters-section mt-4 p-4 border rounded-4 bg-white shadow-sm">
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <div
                      style={{
                        width: "4px",
                        height: "20px",
                        "background-color": "rgb(243, 122, 71)",
                        "border-radius": "4px",
                      }}
                    />
                    <h2
                      className="m-0 fw-bold"
                      style={{ "font-size": "16px", color: "rgb(26, 26, 26)" }}
                    >
                      {t("header.Filtres_Avancés")}
                    </h2>
                  </div>
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-3">
                      <div
                        ref={experienceRef}
                        className="multi-select-container position-relative w-100"
                      >
                        <h3
                          style={{
                            fontSize: "14px",
                            marginBottom: "8px",
                            fontWeight: "600",
                          }}
                        >
                          {t("header.Experience")}
                        </h3>

                        {/* SELECT BOX */}
                        <div
                          onClick={() =>
                            setShowExperienceDropdown(!showExperienceDropdown)
                          }
                          className="d-flex align-items-center justify-content-between p-2 border-primary"
                          style={{
                            fontSize: "13px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            minHeight: "38px",
                            backgroundColor: "rgb(240, 245, 247)",
                          }}
                        >
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "90%" }}
                          >
                            {selectedExperience.length === 0
                              ? "All Levels"
                              : `${selectedExperience.length} Selected`}
                          </span>

                          <i
                            className={`fa-solid ${
                              showExperienceDropdown
                                ? "fa-chevron-up"
                                : "fa-chevron-down"
                            }`}
                          />
                        </div>

                        {/* DROPDOWN */}
                        {showExperienceDropdown && (
                          <div
                            className="position-absolute w-100 bg-white shadow-lg rounded mt-1 border"
                            style={{
                              zIndex: "1000",
                              maxHeight: "250px",
                              overflowY: "auto",
                              padding: "8px 0px",
                            }}
                          >
                            {/* HEADER */}
                            <div className="px-3 pb-2 mb-2 border-bottom d-flex justify-content-between align-items-center">
                              <span
                                className="text-muted small"
                                style={{ fontSize: "11px" }}
                              >
                                {selectedExperience.length}{" "}
                                {t("header.selected")}
                              </span>

                              <button
                                onClick={clearExperience}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{
                                  fontSize: "11px",
                                  color: "rgb(243, 122, 71)",
                                }}
                              >
                                {t("header.Clear_All")}
                              </button>
                            </div>

                            {experienceLevels.map((level) => (
                              <div
                                key={level.value}
                                onClick={() => toggleExperience(level.value)}
                                className="px-3 py-2 d-flex align-items-center gap-2 hover-bg-light"
                                style={{ cursor: "pointer" }}
                              >
                                <input
                                  className="form-check-input mt-0"
                                  type="checkbox"
                                  checked={selectedExperience.includes(
                                    level.value,
                                  )}
                                  readOnly
                                />

                                <span
                                  className="small text-dark"
                                  style={{ fontSize: "13px" }}
                                >
                                  {level.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div
                        ref={educationRef}
                        className="multi-select-container position-relative w-100"
                      >
                        <h3
                          style={{
                            fontSize: "14px",
                            marginBottom: "8px",
                            fontWeight: "600",
                          }}
                        >
                          {t("header.Education")}
                        </h3>

                        {/* SELECT BOX */}
                        <div
                          onClick={() =>
                            setShowEducationDropdown(!showEducationDropdown)
                          }
                          className="d-flex align-items-center justify-content-between p-2 border-primary"
                          style={{
                            fontSize: "13px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            minHeight: "38px",
                            backgroundColor: "rgb(240, 245, 247)",
                          }}
                        >
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "90%" }}
                          >
                            {selectedEducation.length === 0
                              ? "Any"
                              : `${selectedEducation.length} Selected`}
                          </span>

                          <i
                            className={`fa-solid ${
                              showEducationDropdown
                                ? "fa-chevron-up"
                                : "fa-chevron-down"
                            }`}
                          />
                        </div>

                        {/* DROPDOWN */}
                        {showEducationDropdown && (
                          <div
                            className="position-absolute w-100 bg-white shadow-lg rounded mt-1 border"
                            style={{
                              zIndex: "1000",
                              maxHeight: "250px",
                              overflowY: "auto",
                              padding: "8px 0px",
                            }}
                          >
                            {/* HEADER */}
                            <div className="px-3 pb-2 mb-2 border-bottom d-flex justify-content-between align-items-center">
                              <span
                                className="text-muted small"
                                style={{ fontSize: "11px" }}
                              >
                                {selectedEducation.length}{" "}
                                {t("header.selected")}
                              </span>

                              <button
                                onClick={clearEducation}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{
                                  fontSize: "11px",
                                  color: "rgb(243, 122, 71)",
                                }}
                              >
                                {t("header.Clear_All")}
                              </button>
                            </div>

                            {/* OPTIONS */}
                            {educationLevels.map((edu, index) => (
                              <div
                                key={index}
                                onClick={() => toggleEducation(edu)}
                                className="px-3 py-2 d-flex align-items-center gap-2 hover-bg-light"
                                style={{ cursor: "pointer" }}
                              >
                                <input
                                  className="form-check-input mt-0"
                                  type="checkbox"
                                  checked={selectedEducation.includes(edu)}
                                  readOnly
                                />

                                <span
                                  className="small text-dark"
                                  style={{ fontSize: "13px" }}
                                >
                                  {edu}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div
                        ref={availabilityRef}
                        className="multi-select-container position-relative w-100"
                      >
                        <h3
                          style={{
                            fontSize: "14px",
                            marginBottom: "8px",
                            fontWeight: "600",
                          }}
                        >
                          {t("header.aboutUs")}
                        </h3>

                        {/* SELECT BOX */}
                        <div
                          onClick={() =>
                            setShowAvailabilityDropdown(
                              !showAvailabilityDropdown,
                            )
                          }
                          className="d-flex align-items-center justify-content-between p-2 border-primary"
                          style={{
                            fontSize: "13px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            minHeight: "38px",
                            backgroundColor: "rgb(240, 245, 247)",
                          }}
                        >
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "90%" }}
                          >
                            {selectedAvailability.length === 0
                              ? "Any Status"
                              : `${selectedAvailability.length} Selected`}
                          </span>

                          <i
                            className={`fa-solid ${
                              showAvailabilityDropdown
                                ? "fa-chevron-up"
                                : "fa-chevron-down"
                            }`}
                          />
                        </div>

                        {/* DROPDOWN */}
                        {showAvailabilityDropdown && (
                          <div
                            className="position-absolute w-100 bg-white shadow-lg rounded mt-1 border"
                            style={{
                              zIndex: "1000",
                              maxHeight: "250px",
                              overflowY: "auto",
                              padding: "8px 0px",
                            }}
                          >
                            {/* HEADER */}
                            <div className="px-3 pb-2 mb-2 border-bottom d-flex justify-content-between align-items-center">
                              <span
                                className="text-muted small"
                                style={{ fontSize: "11px" }}
                              >
                                {selectedAvailability.length}{" "}
                                {t("header.selected")}
                              </span>

                              <button
                                onClick={clearAvailability}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{
                                  fontSize: "11px",
                                  color: "rgb(243, 122, 71)",
                                }}
                              >
                                {t("header.Clear_All")}
                              </button>
                            </div>

                            {/* OPTIONS */}
                            {availabilityOptions.map((item, index) => (
                              <div
                                key={index}
                                onClick={() => toggleAvailability(item)}
                                className="px-3 py-2 d-flex align-items-center gap-2 hover-bg-light"
                                style={{ cursor: "pointer" }}
                              >
                                <input
                                  className="form-check-input mt-0"
                                  type="checkbox"
                                  checked={selectedAvailability.includes(item)}
                                  readOnly
                                />

                                <span
                                  className="small text-dark"
                                  style={{ fontSize: "13px" }}
                                >
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div
                        ref={salaryRef}
                        className="multi-select-container position-relative w-100"
                      >
                        <h3
                          style={{
                            fontSize: "14px",
                            marginBottom: "8px",
                            fontWeight: "600",
                          }}
                        >
                          {t("header.Salary")}
                        </h3>

                        {/* SELECT BOX */}
                        <div
                          onClick={() =>
                            setShowSalaryDropdown(!showSalaryDropdown)
                          }
                          className="d-flex align-items-center justify-content-between p-2 border-primary"
                          style={{
                            fontSize: "13px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            minHeight: "38px",
                            backgroundColor: "rgb(240, 245, 247)",
                          }}
                        >
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "90%" }}
                          >
                            {selectedSalary.length === 0
                              ? "Any"
                              : `${selectedSalary.length} Selected`}
                          </span>

                          <i
                            className={`fa-solid ${
                              showSalaryDropdown
                                ? "fa-chevron-up"
                                : "fa-chevron-down"
                            }`}
                          />
                        </div>

                        {/* DROPDOWN */}
                        {showSalaryDropdown && (
                          <div
                            className="position-absolute w-100 bg-white shadow-lg rounded mt-1 border"
                            style={{
                              zIndex: "1000",
                              maxHeight: "250px",
                              overflowY: "auto",
                              padding: "8px 0px",
                            }}
                          >
                            {/* HEADER */}
                            <div className="px-3 pb-2 mb-2 border-bottom d-flex justify-content-between align-items-center">
                              <span
                                className="text-muted small"
                                style={{ fontSize: "11px" }}
                              >
                                {selectedSalary.length} {t("header.selected")}
                              </span>

                              <button
                                onClick={clearSalary}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{
                                  fontSize: "11px",
                                  color: "rgb(243, 122, 71)",
                                }}
                              >
                                {t("header.Clear_All")}
                              </button>
                            </div>

                            {/* OPTIONS */}
                            {salaryRanges.map((item) => (
                              <div
                                key={item._id}
                                onClick={() => toggleSalary(item.range)}
                                className="px-3 py-2 d-flex align-items-center gap-2 hover-bg-light"
                                style={{ cursor: "pointer" }}
                              >
                                <input
                                  className="form-check-input mt-0"
                                  type="checkbox"
                                  checked={selectedSalary.includes(item.range)}
                                  readOnly
                                />

                                <span
                                  className="small text-dark"
                                  style={{ fontSize: "13px" }}
                                >
                                  {item.range}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row g-4 align-items-start border-top pt-4">
                    <div className="col-12 col-md-5">
                      <div className="single-sidebar-widget">
                        <label
                          className="fw-bold mb-2 d-block"
                          style={{
                            fontSize: "13px",
                            color: "rgb(75, 85, 99)",
                          }}
                        >
                          {t("header.Compétences")}
                        </label>

                        {/* INPUT */}
                        <div className="position-relative">
                          <input
                            className="form-control"
                            placeholder="Ex: React, Node, SQL..."
                            type="text"
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
                            style={{
                              fontSize: "14px",
                              padding: "10px 15px",
                              borderRadius: "8px",
                              backgroundColor: "rgb(240, 245, 247)",
                              height: "45px",
                              border: "1px solid rgb(226, 232, 240)",
                            }}
                          />

                          <i
                            className="fa-solid fa-tags position-absolute"
                            style={{
                              right: "15px",
                              top: "15px",
                              color: "rgb(148, 163, 184)",
                            }}
                          />
                        </div>

                        {/* SKILL TAGS */}
                        {selectedSkills.length > 0 && (
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            {selectedSkills.map((skill) => (
                              <span
                                key={skill}
                                className="badge bg-white text-dark border d-flex align-items-center gap-2 py-2 px-3 shadow-sm rounded-pill"
                                style={{ fontSize: "12px" }}
                              >
                                {skill}

                                <i
                                  className="fa-solid fa-xmark text-danger"
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "11px",
                                  }}
                                  onClick={() =>
                                    setSelectedSkills((prev) =>
                                      prev.filter((s) => s !== skill),
                                    )
                                  }
                                />
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-7">
                      <div className="d-flex flex-column h-100">
                        <label
                          className="fw-bold mb-2 d-block"
                          style={{
                            "font-size": "13px",
                            color: "rgb(75, 85, 99)",
                          }}
                        >
                          {t("header.Localisation")}
                        </label>
                        <div className="row g-2 mb-3">
                          <div className="col-6">
                            <input
                              className="form-control"
                              placeholder="Pays..."
                              type="text"
                              value={selectedCountry || ""}
                              onChange={(e) => {
                                const value = e.target.value;

                                setSelectedCountry(value);
                                setSelectedCities([]);
                                setSelectedCity("");
                                setCityList([]);

                                // find country id from country list
                                const selectedCountryObj = country.find(
                                  (c) =>
                                    c.name.toLowerCase() ===
                                    value.toLowerCase(),
                                );

                                if (selectedCountryObj?.id) {
                                  fetchCitiesByCountry(selectedCountryObj.id);
                                }

                                setCurrentPage(1);
                              }}
                              style={{
                                fontSize: "14px",
                                borderRadius: "8px",
                                height: "45px",
                                backgroundColor: "rgb(240, 245, 247)",
                                border: "1px solid rgb(226, 232, 240)",
                              }}
                            />
                          </div>
                          <div className="col-6">
                            <div className="position-relative">
                              <input
                                className="form-control"
                                placeholder="Ville..."
                                type="text"
                                value={selectedCity || ""}
                                onChange={(e) => {
                                  setSelectedCity(e.target.value);
                                  setCurrentPage(1);
                                }}
                                // disabled={!selectedCountry}
                                style={{
                                  fontSize: "14px",
                                  borderRadius: "8px",
                                  height: "45px",
                                  backgroundColor: "rgb(240, 245, 247)",
                                  border: "1px solid rgb(226, 232, 240)",
                                  paddingLeft: "35px",
                                }}
                              />
                              <i
                                className="fa-solid fa-location-dot position-absolute"
                                style={{
                                  left: "12px",
                                  top: "15px",
                                  color: "rgb(148, 163, 184)",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="d-flex align-items-center gap-4 py-2 px-3 border rounded-3"
                          style={{ backgroundColor: "rgb(248, 250, 251)" }}
                        >
                          {/* SWITCH */}
                          <div className="form-check form-switch d-flex align-items-center gap-2 m-0">
                            <input
                              className="form-check-input"
                              id="freelancerSwitchApplicants"
                              type="checkbox"
                              checked={isFreelancer}
                              onChange={(e) =>
                                setIsFreelancer(e.target.checked)
                              }
                              style={{
                                cursor: "pointer",
                                width: "35px",
                                height: "18px",
                              }}
                            />
                            <label
                              className="form-check-label fw-bold"
                              htmlFor="freelancerSwitchApplicants"
                              style={{
                                fontSize: "13px",
                                cursor: "pointer",
                                color: "rgb(51, 65, 85)",
                              }}
                            >
                              {t("header.Recherche_Freelance")}
                            </label>
                          </div>

                          {/* SHOW ONLY WHEN TRUE */}
                          {isFreelancer && (
                            <div className="flex-grow-1 d-flex align-items-center gap-3 ms-2 border-start ps-4">
                              <span
                                className="fw-bold text-muted text-nowrap"
                                style={{
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {t("header.Budget_TJM_MAD")}{" "}
                                {t("header.Recherche_Freelance")}
                              </span>

                              <div
                                className="flex-grow-1 position-relative"
                                style={{ height: "30px", minWidth: "150px" }}
                              >
                                <div
                                  className="range-slider-container w-100 m-0"
                                  style={{
                                    height: "4px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                  }}
                                >
                                  <div
                                    className="range-slider-track"
                                    style={{ height: "4px" }}
                                  />
                                  <div
                                    className="range-slider-progress"
                                    style={{
                                      height: "4px",
                                      left: "0%",
                                      right: "0%",
                                    }}
                                  />

                                  <div
                                    className="range-slider-container w-100 m-0 position-relative"
                                    style={{
                                      height: "4px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                    }}
                                  >
                                    <div
                                      className="range-slider-track"
                                      style={{ height: "4px" }}
                                    />

                                    <div
                                      className="range-slider-progress"
                                      style={{
                                        height: "4px",
                                        left: `${minPercent}%`,
                                        right: `${100 - maxPercent}%`,
                                      }}
                                    />

                                    {/* MIN */}
                                    <input
                                      className="range-slider-input"
                                      min={0}
                                      max={5000}
                                      step={50}
                                      type="range"
                                      value={minValue}
                                      onChange={handleMinChange}
                                    />

                                    {/* MAX */}
                                    <input
                                      className="range-slider-input"
                                      min={0}
                                      max={5000}
                                      step={50}
                                      type="range"
                                      value={maxValue}
                                      onChange={handleMaxChange}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div
                                className="badge bg-white text-primary border shadow-sm px-2 py-1"
                                style={{
                                  fontSize: "12px",
                                  minWidth: "110px",
                                }}
                              >
                                {minValue} - {maxValue} DH
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                    <button
                      className="btn btn-link text-decoration-none text-muted d-flex align-items-center gap-2 px-3 fw-bold"
                      style={{
                        "font-size": "13px",
                        "-webkit-transition": "0.2s",
                        transition: "0.2s",
                      }}
                      onClick={handleResetFilters}
                    >
                      <i className="fa-solid fa-rotate-left" />
                      {t("header.Réinitialiser_tous_les_filtres")}
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="row g-3 align-items-end mt-2">
              <div className="col-12 col-md-5">
                <label className="filter-label-inline text-primary">
                  {t("header.job_offers")}
                </label>
                <select
                  className="form-select form-select-sm fw-bold border-primary shadow-sm"
                  value={activeFolder}
                  onChange={(e) => handleFolderClick(e.target.value)}
                >
                  <option value="all">
                    {t("header.All_Job_Offers_None_Selected")}
                  </option>

                  {autoJobFolders.map((folder) => (
                    <option key={folder._id} value={folder._id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-5">
                <label className="filter-label-inline text-success">
                  {t("header.Custom_Folders")}
                </label>

                <div className="d-flex gap-2">
                  {/* DROPDOWN */}
                  <select
                    className="form-select form-select-sm fw-bold border-success shadow-sm"
                    value={activeFolder}
                    onChange={(e) => handleFolderClick(e.target.value)}
                  >
                    <option value="all">
                      {t("header.All_Custom_Folders_None_Selected")}
                    </option>

                    {customFolders.map((folder) => (
                      <option key={folder._id} value={folder._id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>

                  {/* CREATE BUTTON */}
                  {/* <button
                    className="btn btn-sm btn-outline-success text-nowrap shadow-sm d-flex align-items-center gap-1"
                    onClick={handleCreateFolder}
                  >
                    + Create
                  </button> */}
                  <button
                    className="btn btn-sm btn-outline-success text-nowrap shadow-sm d-flex align-items-center gap-1"
                    onClick={() => setShowModal(true)}
                  >
                    + {t("header.Create")}
                  </button>

                  {/* DELETE BUTTON (CONDITIONAL) */}
                  {activeFolder !== "all" && (
                    <button
                      title="Delete Folder"
                      onClick={() => handleDeleteFolder(activeFolder)}
                      class="btn btn-sm btn-outline-danger shadow-sm d-flex align-items-center"
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 448 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-2 d-flex justify-content-end gap-2">
                <button
                  onClick={handleResetFilters}
                  className="btn btn-sm btn-outline-secondary px-4 fw-bold shadow-sm"
                  style={{
                    "font-size": "14px",
                    height: "38px",
                    "border-radius": "8px",
                  }}
                >
                  {t("header.Reset_Filters")}
                </button>
              </div>
            </div>
          </div>

          <section className="employer-candidate-info-area">
            <div className="row">
              <div
                className="col-lg-4 d-none d-lg-block"
                style={{
                  "-webkit-flex": "0 0 30%",
                  "-ms-flex": "0 0 30%",
                  flex: "0 0 30%",
                  "max-width": "30%",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-2 rounded border-0 shadow-sm px-3">
                  <div
                    className="text-muted fw-bold"
                    style={{ "font-size": "13px" }}
                  >
                    {t("header.Total")}:{" "}
                    <span className="text-primary">
                      ({totalCandidates || 0})
                    </span>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="form-select form-select-sm border-0 bg-light fw-bold"
                    style={{
                      width: "auto",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">
                      Sort By Experience{t("header.Sort_By_Experience")}
                    </option>

                    {/* ✅ FIXED */}
                    <option value="asc">{t("header.Least_Experienced")}</option>
                    <option value="desc">{t("header.Most_Experienced")}</option>
                  </select>
                </div>
                <div
                  className="candidate-list-scroll"
                  style={{ maxHeight: "800px", overflowY: "auto" }}
                >
                  {applicants.length > 0 ? (
                    applicants.map((candidate, index) => {
                      const user = candidate?.userId || {};
                      const role = candidate?.aboutRole || {};

                      return (
                        <div
                          onClick={() => {
                            setSelectedCandidateId(user._id);
                          }}
                          key={candidate._id || index}
                          className={`card mb-3 border-0 shadow-sm candidate-list-card-candidate ${
                            String(selectedCandidateId) === String(user._id)
                              ? "active"
                              : ""
                          }`}
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveBookmark(
                                          candidate.bookmarkId,
                                        );
                                      }}
                                      className="btn btn-link text-danger p-0"
                                      title="Remove Bookmark"
                                    >
                                      <i className="fa-solid fa-trash-can fs-6" />
                                    </button>
                                  </div>
                                </div>

                                {/* Job Title */}

                                {/* Experience + Location */}
                                <div
                                  className="d-flex align-items-center gap-2 mb-1"
                                  style={{ fontSize: "12px" }}
                                >
                                  <span className="text-primary fw-bold">
                                    <i class="fa-solid fa-briefcase"></i>{" "}
                                    {role.yearOfExperience
                                      ? `${role.yearOfExperience} Years`
                                      : "N/A"}
                                  </span>

                                  <span className="text-muted">•</span>

                                  <span className="text-muted">
                                    <span className="text-muted">
                                      <i class="fa-solid fa-location-dot text-danger"></i>
                                      &nbsp;
                                      {user?.city
                                        ? `${user.city}`
                                        : user?.city ||
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
                    <div className="text-center p-5 bg-white rounded border shadow-sm">
                      <p className="text-muted mb-0">
                        {t("header.No_candidates_found_in_this_folder_filter")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="col-lg-8"
                style={{
                  "-webkit-flex": "0 0 70%",
                  "-ms-flex": "0 0 70%",
                  flex: "0 0 70%",
                  "max-width": "70%",
                }}
              >
                <div className="card border-0 shadow-sm">
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
                        <div className="d-flex flex-column flex-md-row gap-4 mb-4 border-bottom pb-4 align-items-center align-items-md-start">
                          <div class="position-relative">
                            <img
                              crossOrigin="anonymous"
                              alt="profile"
                              className="rounded shadow-sm"
                              style={{
                                width: "120px",
                                height: "120px",
                                "object-fit": "cover",
                                border: "3px solid rgb(255, 255, 255)",
                              }}
                              src={
                                cleanImageUrl(
                                  candidateDetails.userId?.profileImage,
                                ) || "assets/images/userIcon.png"
                              }
                            />
                            <span
                              className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                              title="Profile Visible"
                              style={{ width: "15px", height: "15px" }}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h4 className="fw-bold mb-1">
                                  {candidateDetails?.userId?.first_name}{" "}
                                  {candidateDetails?.userId?.last_name}
                                </h4>
                                <p
                                  className="text-primary fw-medium mb-2"
                                  style={{ "font-size": "16px" }}
                                >
                                  {" "}
                                  {candidateDetails?.aboutRole?.jobTitle
                                    ?.toLowerCase()
                                    .replace(/^\w/, (c) => c.toUpperCase()) ||
                                    "Not Provided"}{" "}
                                </p>
                              </div>
                              <div className="d-flex gap-2">
                                {candidateDetails?.isUnlocked && (
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={handleDownloadCV}
                                  >
                                    <i className="fa-solid fa-download me-1" />{" "}
                                    {t("header.Download_CV")}
                                  </button>
                                )}
                              </div>
                            </div>
                            <div
                              className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 text-muted mb-2"
                              style={{ "font-size": "13px" }}
                            >
                              <span className="d-flex align-items-center gap-1">
                                <i className="fa-solid fa-location-dot text-danger" />
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
                                        .replace(/^\w/, (c) => c.toUpperCase())
                                    : candidateDetails?.userId?.Nationality ||
                                      "Not Provided"}
                              </span>
                              <span className="d-flex align-items-center gap-1">
                                <i className="fa-solid fa-briefcase text-info" />
                                {candidateDetails?.aboutRole?.yearOfExperience
                                  ? `${candidateDetails.aboutRole.yearOfExperience}+ Years Exp.`
                                  : "N/A"}
                              </span>
                            </div>

                            <div class="mt-3">
                              {candidateDetails?.isUnlocked ? (
                                // ✅ If already unlocked → show contact directly
                                <div className="animate__animated animate__fadeInUp mt-">
                                  <div
                                    className="p-3 bg-light rounded border d-flex align-items-center gap-4"
                                    style={{
                                      borderLeft: "4px solid rgb(243, 122, 71)",
                                      flexWrap: "nowrap",
                                      overflowX: "auto", // optional if screen is small
                                    }}
                                  >
                                    <div className="d-flex align-items-center gap-2">
                                      <div
                                        className="bg-white rounded-circle p-2 shadow-sm border"
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          display: "flex",
                                          "-webkit-align-items": "center",
                                          "-webkit-box-align": "center",
                                          "-ms-flex-align": "center",
                                          "align-items": "center",
                                          "-webkit-box-pack": "center",
                                          "-webkit-justify-content": "center",
                                          "-ms-flex-pack": "center",
                                          "justify-content": "center",
                                        }}
                                      >
                                        <i
                                          className="fa-regular fa-envelope text-primary"
                                          style={{ "font-size": "14px" }}
                                        />
                                      </div>
                                      <div>
                                        <div
                                          className="text-muted small"
                                          style={{ "font-size": "10px" }}
                                        >
                                          {t("header.email")}
                                        </div>
                                        <div
                                          className="fw-bold small"
                                          style={{ "font-size": "12px" }}
                                        >
                                          {candidateDetails?.userId?.email ||
                                            "Not Provided"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 border-start ps-4">
                                      <div
                                        className="bg-white rounded-circle p-2 shadow-sm border"
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          display: "flex",
                                          "-webkit-align-items": "center",
                                          "-webkit-box-align": "center",
                                          "-ms-flex-align": "center",
                                          "align-items": "center",
                                          "-webkit-box-pack": "center",
                                          "-webkit-justify-content": "center",
                                          "-ms-flex-pack": "center",
                                          "justify-content": "center",
                                        }}
                                      >
                                        <i
                                          className="fa-solid fa-phone text-success"
                                          style={{ "font-size": "14px" }}
                                        />
                                      </div>
                                      <div>
                                        <div
                                          className="text-muted small"
                                          style={{ "font-size": "10px" }}
                                        >
                                          {t("header.phone")}
                                        </div>
                                        <div
                                          className="fw-bold small"
                                          style={{ "font-size": "12px" }}
                                        >
                                          {candidateDetails?.userId?.countryCode
                                            ? `+${candidateDetails.userId.countryCode} ${
                                                candidateDetails?.userId
                                                  ?.phone || ""
                                              }`
                                            : candidateDetails?.userId?.phone ||
                                              "Not Provided"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="border-start ps-4">
                                      <a
                                        href={
                                          candidateDetails?.links?.linkedin ||
                                          "#"
                                        }
                                        target={
                                          candidateDetails?.links?.linkedin
                                            ? "_blank"
                                            : "_self"
                                        }
                                        rel="noopener noreferrer"
                                        onClick={(e) => {
                                          if (
                                            !candidateDetails?.links?.linkedin
                                          ) {
                                            e.preventDefault(); // stop navigation
                                            toast.info(
                                              "LinkedIn profile not provided",
                                            );
                                          }
                                        }}
                                        className="bg-white rounded-circle shadow-sm border text-info d-flex align-items-center justify-content-center hover-scale transition-all"
                                        style={{
                                          width: "38px",
                                          height: "38px",
                                          color: "rgb(0, 119, 181)",
                                        }}
                                      >
                                        <i
                                          className="fa-brands fa-linkedin"
                                          style={{ fontSize: "22px" }}
                                        />
                                      </a>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <Link
                                      to="/messaging-system"
                                      state={{
                                        candidateId:
                                          candidateDetails?.userId?._id,
                                        candidate: candidateDetails,
                                      }}
                                      className="btn btn-warning text-white btn-sm shadow-sm gap-2 fw-bold "
                                    >
                                      <i
                                        className="fa-solid fa-envelope"
                                        style={{ marginRight: "5px" }}
                                      />
                                      {t("header.Envoyer_un_message")}
                                    </Link>
                                  </div>
                                </div>
                              ) : (
                                // 🔒 If locked → show button
                                <div className="w-100">
                                  <button
                                    onClick={handleUnlockContact}
                                    className="btn btn-light btn-sm border text-primary fw-bold"
                                    style={{
                                      "font-size": "12px",
                                      padding: "6px 15px",
                                      "border-radius": "20px",
                                    }}
                                  >
                                    <i className="fa-regular fa-eye me-2" />
                                    {t("header.Afficher_les_coordonnées")}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row g-4 mt-2">
                          <div className="col-12 col-xl-8">
                            <div className="mb-5">
                              <h5 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <span
                                  style={{
                                    width: "4px",
                                    height: "18px",
                                    background: "rgb(243, 122, 71)",
                                    borderRadius: "4px",
                                  }}
                                />
                                {t("header.Professional_Summary")}
                              </h5>

                              <p
                                className="text-muted"
                                style={{
                                  lineHeight: "1.7",
                                  whiteSpace: "pre-line",
                                }}
                              >
                                {candidateDetails?.professionalSummary
                                  ? candidateDetails?.professionalSummary
                                  : "No professional summary added."}
                              </p>
                            </div>
                            <div className="mb-5">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold d-flex align-items-center gap-2">
                                  <span
                                    style={{
                                      width: "4px",
                                      height: "18px",
                                      background: "rgb(243, 122, 71)",
                                      borderRadius: "4px",
                                    }}
                                  />
                                  {t("header.Work_Experience")}
                                </h5>

                                {candidateDetails?.workHistory?.length > 2 && (
                                  <button
                                    className="btn btn-link btn-sm text-decoration-none fw-bold"
                                    onClick={() =>
                                      setShowAllExperience(!showAllExperience)
                                    }
                                  >
                                    {showAllExperience
                                      ? "Voir moins"
                                      : "Voir plus"}{" "}
                                    ({candidateDetails?.workHistory?.length})
                                  </button>
                                )}
                              </div>

                              <div className="experience-timeline position-relative ps-4">
                                <div
                                  className="position-absolute start-0 h-100 border-start border-2 border-light-subtle"
                                  style={{ left: "16px" }}
                                />

                                {candidateDetails?.workHistory?.length > 0 ? (
                                  (showAllExperience
                                    ? candidateDetails.workHistory
                                    : candidateDetails.workHistory.slice(0, 2)
                                  ).map((work, index) => (
                                    <div
                                      key={index}
                                      className="experience-item position-relative mb-4"
                                    >
                                      {/* Timeline dot */}
                                      <div
                                        className="position-absolute bg-white border border-primary rounded-circle"
                                        style={{
                                          left: "-27px",
                                          top: "0px",
                                          width: "12px",
                                          height: "12px",
                                          zIndex: "1",
                                        }}
                                      />

                                      {/* Job Title + Years */}
                                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-1">
                                        <h6 className="fw-bold mb-0">
                                          {work.jobTitle || "NA"}
                                        </h6>

                                        <span className="badge bg-light text-muted border px-2 py-1">
                                          {work.startDate
                                            ? new Date(
                                                work.startDate,
                                              ).getFullYear()
                                            : "NA"}{" "}
                                          -{" "}
                                          {work.currentlyWorkingHere
                                            ? "Present"
                                            : work.endDate
                                              ? new Date(
                                                  work.endDate,
                                                ).getFullYear()
                                              : "NA"}
                                        </span>
                                      </div>

                                      {/* Company + Location */}
                                      <div className="text-primary fw-medium small mb-2">
                                        {work.keep_employer_anonymous
                                          ? "Confidential"
                                          : work.companyName || "NA"}{" "}
                                        •{" "}
                                        {work.workLocation ||
                                          "Location not provided"}
                                      </div>

                                      {/* Description */}
                                      {work.Description && (
                                        <p className="text-muted small mb-0">
                                          {work.Description || "N/A"}
                                        </p>
                                      )}

                                      {/* Salary */}
                                      {/* {work.currentSalary && (
                                        <p className="text-muted small mt-1">
                                          Salary: {work.currentSalary.amount}{" "}
                                          {work.currentSalary.currency} (
                                          {work.currentSalary.payrollFrequency})
                                        </p>
                                      )} */}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-muted small">
                                    {t("header.No_experience_added")}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="mb-5">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold d-flex align-items-center gap-2">
                                  <span
                                    style={{
                                      width: "4px",
                                      height: "18px",
                                      background: "rgb(243, 122, 71)",
                                      borderRadius: "4px",
                                    }}
                                  />
                                  {t("header.Education")}
                                </h5>
                              </div>

                              <div className="education-list d-flex flex-column gap-3">
                                {candidateDetails?.education?.length > 0 ? (
                                  candidateDetails.education.map(
                                    (edu, index) => (
                                      <div
                                        key={index}
                                        className="edu-card p-3 bg-light rounded-3 border-0 transition-hover"
                                      >
                                        <div className="d-flex gap-3">
                                          {/* ICON */}
                                          <div className="bg-white rounded p-2 border shadow-sm h-100">
                                            <i className="fa-solid fa-graduation-cap text-primary fs-4" />
                                          </div>

                                          {/* CONTENT */}
                                          <div>
                                            <h6 className="fw-bold mb-1">
                                              {edu.diplomaTitle || "NA"}
                                            </h6>

                                            <div className="text-muted small mb-1">
                                              {edu.University || "NA"}
                                            </div>

                                            <span
                                              className="text-primary fw-medium"
                                              style={{ fontSize: "11px" }}
                                            >
                                              {edu.level || "Level"} :{" "}
                                              {edu.degree || "NA"} •{" "}
                                              {edu.startDate
                                                ? new Date(
                                                    edu.startDate,
                                                  ).getFullYear()
                                                : "NA"}{" "}
                                              -{" "}
                                              {edu.currentlyStudyingHere
                                                ? "Present"
                                                : edu.endDate
                                                  ? new Date(
                                                      edu.endDate,
                                                    ).getFullYear()
                                                  : "NA"}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ),
                                  )
                                ) : (
                                  <p className="text-muted small">
                                    {t("header.No_education_added")}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="mb-4">
                              <h5 className="fw-bold d-flex align-items-center gap-2 mb-3">
                                <span
                                  style={{
                                    width: "4px",
                                    height: "18px",
                                    background: "rgb(243, 122, 71)",
                                    borderRadius: "4px",
                                  }}
                                />
                                {t("header.Technical_Skills")}
                              </h5>

                              <div className="d-flex flex-wrap gap-2 mt-3">
                                {candidateDetails?.skills?.length > 0 ? (
                                  candidateDetails.skills.map(
                                    (skill, index) => (
                                      <span
                                        key={index}
                                        className="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle px-3 py-2"
                                        style={{
                                          borderRadius: "6px",
                                          fontSize: "13px",
                                        }}
                                      >
                                        {skill}
                                      </span>
                                    ),
                                  )
                                ) : (
                                  <span className="text-muted small">
                                    {t("header.No_skills_added")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-xl-4">
                            <div
                              className="sticky-md-top Career-Preference-details"
                              style={{ top: "20px" }}
                            >
                              <div
                                className="card border-0 shadow-sm mb-4"
                                style={{
                                  backgroundColor: "rgb(252, 252, 253)",
                                }}
                              >
                                <div className="card-body p-4">
                                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-bullseye text-primary" />
                                    {t("header.Career_Preferences")}
                                  </h6>

                                  {candidateDetails?.career_goals ? (
                                    <div className="d-flex flex-column gap-3 mt-3">
                                      {/* Desired Roles */}
                                      <div className="job-pref-item">
                                        <div
                                          className="text-muted text-uppercase mb-1"
                                          style={{
                                            fontSize: "10px",
                                            letterSpacing: "1px",
                                          }}
                                        >
                                          {t("header.Desired_Roles")}
                                        </div>

                                        <div className="fw-bold small">
                                          {Array.isArray(
                                            candidateDetails.career_goals
                                              ?.DesiredJobTitle,
                                          )
                                            ? candidateDetails.career_goals.DesiredJobTitle.join(
                                                ", ",
                                              )
                                            : candidateDetails.career_goals
                                                ?.DesiredJobTitle || "NA"}
                                        </div>
                                      </div>

                                      {/* Contract Types */}
                                      <div className="job-pref-item">
                                        <div
                                          className="text-muted text-uppercase mb-1"
                                          style={{
                                            fontSize: "10px",
                                            letterSpacing: "1px",
                                          }}
                                        >
                                          {t("header.Contract_Types")}
                                        </div>

                                        <div className="d-flex flex-wrap gap-1">
                                          {Array.isArray(
                                            candidateDetails.career_goals
                                              ?.DesiredEmploymentType,
                                          ) ? (
                                            candidateDetails.career_goals.DesiredEmploymentType.map(
                                              (type, index) => (
                                                <span
                                                  key={index}
                                                  className="badge bg-white text-dark border px-2 py-1"
                                                  style={{ fontSize: "10px" }}
                                                >
                                                  {type}
                                                </span>
                                              ),
                                            )
                                          ) : candidateDetails.career_goals
                                              ?.DesiredEmploymentType ? (
                                            <span className="badge bg-white text-dark border px-2 py-1">
                                              {
                                                candidateDetails.career_goals
                                                  .DesiredEmploymentType
                                              }
                                            </span>
                                          ) : (
                                            <span className="text-muted small">
                                              NA
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Occupation Type */}
                                      <div className="job-pref-item">
                                        <div
                                          className="text-muted text-uppercase mb-1"
                                          style={{
                                            fontSize: "10px",
                                            letterSpacing: "1px",
                                          }}
                                        >
                                          {t("header.Occupation_Type")}
                                        </div>

                                        <div className="fw-bold small">
                                          {Array.isArray(
                                            candidateDetails.career_goals
                                              ?.DesiredJobCategory,
                                          )
                                            ? candidateDetails.career_goals.DesiredJobCategory.join(
                                                ", ",
                                              )
                                            : candidateDetails.career_goals
                                                ?.DesiredJobCategory || "NA"}
                                        </div>
                                      </div>

                                      {/* Job Search Status */}
                                      <div className="job-pref-item">
                                        <div
                                          className="text-muted text-uppercase mb-1"
                                          style={{
                                            fontSize: "10px",
                                            letterSpacing: "1px",
                                          }}
                                        >
                                          {t("header.Job_Search_Status")}
                                        </div>

                                        <div className="fw-bold small">
                                          {candidateDetails.career_goals
                                            ?.jobSearchStatus || "NA"}
                                        </div>
                                      </div>

                                      {/* Work Eligibility */}
                                      <div className="job-pref-item">
                                        <div
                                          className="text-muted text-uppercase mb-1"
                                          style={{
                                            fontSize: "10px",
                                            letterSpacing: "1px",
                                          }}
                                        >
                                          {t("header.Work_Eligibility_France")}
                                        </div>

                                        <div className="fw-bold small d-flex align-items-center gap-2">
                                          {candidateDetails?.eligibleToWorkInFrance ? (
                                            <span className="text-success d-flex align-items-center gap-1">
                                              <i className="fa-solid fa-circle-check" />{" "}
                                              {t("header.Eligible")}
                                            </span>
                                          ) : (
                                            <span className="text-danger d-flex align-items-center gap-1">
                                              <i className="fa-solid fa-circle-xmark" />{" "}
                                              {t("header.Not_Eligible")}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Availability + Salary */}
                                      <div className="row g-2">
                                        <div className="col-6">
                                          <div
                                            className="text-muted text-uppercase mb-1"
                                            style={{ fontSize: "10px" }}
                                          >
                                            {t("header.Availability")}
                                          </div>

                                          <div className="fw-bold small text-success">
                                            {candidateDetails.career_goals
                                              ?.availabilityToJoin || "NA"}
                                          </div>
                                        </div>

                                        <div className="col-6 text-end">
                                          <div
                                            className="text-muted text-uppercase mb-1"
                                            style={{ fontSize: "10px" }}
                                          >
                                            {t("header.Min_Salary")}
                                          </div>

                                          <div className="fw-bold small">
                                            {candidateDetails.career_goals
                                              ?.MinimumDesiredSalary?.amount ||
                                              "NA"}{" "}
                                            {
                                              candidateDetails.career_goals
                                                ?.MinimumDesiredSalary?.currency
                                            }{" "}
                                            {candidateDetails.career_goals
                                              ?.MinimumDesiredSalary?.type
                                              ? `/ ${candidateDetails.career_goals.MinimumDesiredSalary.type}`
                                              : ""}
                                          </div>
                                        </div>

                                        {/* TJM */}
                                        <div className="mt-2 pt-2 border-top border-light-subtle d-flex justify-content-between">
                                          <div className="text-muted small fw-bold">
                                            {t("header.TJM")}
                                          </div>

                                          <div
                                            className="fw-bold text-info"
                                            style={{ fontSize: "13px" }}
                                          >
                                            {candidateDetails.career_goals?.TJM
                                              ?.amount
                                              ? `${candidateDetails.career_goals.TJM.amount} ${candidateDetails.career_goals.TJM.currency}/j`
                                              : "NA"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-muted small">
                                      {t("header.No_career_goals_specified")}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="card border-0 shadow-sm mb-4">
                                <div className="card-body p-4">
                                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-language text-primary" />
                                    {t("header.Languages")}
                                  </h6>

                                  <div className="d-flex flex-column gap-3 mt-3">
                                    {candidateDetails?.languages?.length > 0 ? (
                                      candidateDetails.languages.map(
                                        (lang, index) => (
                                          <div
                                            key={index}
                                            className="d-flex justify-content-between align-items-center pb-2 border-bottom border-light"
                                          >
                                            <div>
                                              <div className="fw-bold small">
                                                {lang.language || "NA"}
                                              </div>

                                              <div
                                                className="text-muted"
                                                style={{ fontSize: "11px" }}
                                              >
                                                {lang.proficiency || "NA"}
                                              </div>
                                            </div>

                                            <span
                                              className="badge bg-light text-dark border px-2 py-1"
                                              style={{ fontSize: "10px" }}
                                            >
                                              {lang.level || "NA"}
                                            </span>
                                          </div>
                                        ),
                                      )
                                    ) : (
                                      <span className="text-muted small">
                                        {t("header.No_languages_added")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-medal text-warning" />
                                    {t("header.Certifications")}
                                  </h6>

                                  <div className="d-flex flex-column gap-3 mt-3">
                                    {candidateDetails?.certificates?.length >
                                    0 ? (
                                      candidateDetails?.certificates.map(
                                        (cer) => (
                                          <div
                                            key={cer._id}
                                            className="d-flex align-items-start gap-2"
                                          >
                                            <i
                                              className="fa-solid fa-circle-check text-success mt-1"
                                              style={{ fontSize: "12px" }}
                                            />

                                            <div>
                                              <div
                                                className="fw-bold small"
                                                style={{ lineHeight: "1.2" }}
                                              >
                                                {cer.title || "NA"}
                                              </div>

                                              <div
                                                className="text-muted"
                                                style={{ fontSize: "11px" }}
                                              >
                                                Issued:{" "}
                                                {cer.issueDate
                                                  ? new Date(
                                                      cer.issueDate,
                                                    ).toLocaleDateString()
                                                  : "NA"}
                                              </div>
                                            </div>
                                          </div>
                                        ),
                                      )
                                    ) : (
                                      <p className="text-muted small">
                                        {t("header.No_certificates_added")}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
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
                          {t(
                            "header.Sélectionnez_un_candidat_pour_voir_les_détails",
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/*End Bookmark Jobs Area*/}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name">
                      {t("header.Connect_Work")}
                    </span>{" "}
                    {t("header.All_Rights_Reserved")}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    {t("header.Designed_By")}{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      {t("header.Webnmobapps_Solution_Pvt_Ltd")}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content ">
                <div className="modal-header">
                  <h5 className="modal-title">{t("header.Create_Folder")}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("header.Enter_folder_name")}
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    {t("header.Cancel")}
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={handleCreateFolder}
                  >
                    {t("header.Create")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployerShortListCandinate;
