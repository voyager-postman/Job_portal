import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Swal from "sweetalert2";
function ManagesApplicants() {
  const { t, i18n } = useTranslation("global");

  const navigate = useNavigate();
  const location = useLocation();
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const availabilityRef = useRef(null);
  const salaryRef = useRef(null);
  const token = localStorage.getItem("token");
  const cityDropdownRef = useRef(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [seniorityLevels, setSeniorityLevels] = useState([]);
  const [showContact, setShowContact] = useState(false);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [activeFolder, setActiveFolder] = useState("all");
  const [country, setCountry] = useState([]);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [minValue, setMinValue] = useState(0);
  const [showAllExperience, setShowAllExperience] = useState(false);
  const [maxValue, setMaxValue] = useState(5000);
  const [skillInput, setSkillInput] = useState("");
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] =
    useState(false);
  const [selectedSalary, setSelectedSalary] = useState([]);
  const [showSalaryDropdown, setShowSalaryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [sortByATS, setSortByATS] = useState("");
  console.log(selectedCandidate);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [showCityOptions, setShowCityOptions] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState(location.state?.jobId || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10000); // default
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
  const availabilityOptions = ["Immediate", "1 month", "1-3 months", "More"];
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
  const experienceLevels = [
    { label: "- de 1 an", value: "0-1" },
    { label: "1–2 ans", value: "1-2" },
    { label: "3–4 ans", value: "3-4" },
    { label: "5–10 ans", value: "5-10" },
    { label: "11–15 ans", value: "11-15" },
    { label: "+ de 15 ans", value: "15+" },
  ];
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
  const [currentStatus, setCurrentStatus] = useState(
    selectedCandidate?.status || "New",
  );
  useEffect(() => {
    if (selectedCandidate?.status) {
      setCurrentStatus(selectedCandidate.status);
    }
  }, [selectedCandidate]);
  const toggleEducation = (edu) => {
    if (selectedEducation.includes(edu)) {
      setSelectedEducation(selectedEducation.filter((e) => e !== edu));
    } else {
      setSelectedEducation([...selectedEducation, edu]);
    }
  };

  const clearEducation = () => {
    setSelectedEducation([]);
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
  const handleViewFromTable = (candidate) => {
    // 1. Switch tab
    setActiveTab("all");

    setSelectedCandidate(candidate);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggleExperience = (exp) => {
    if (selectedExperience.includes(exp)) {
      setSelectedExperience(selectedExperience.filter((e) => e !== exp));
    } else {
      setSelectedExperience([...selectedExperience, exp]);
    }
  };

  const clearExperience = () => {
    setSelectedExperience([]);
  };
  const handleTableStatusUpdate = async (value, applicationId, jobId) => {
    console.log(applicationId);
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

      toast.success(t("header.Candidate_status_updated_to", { value }));

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
  const toggleAvailability = (value) => {
    if (selectedAvailability.includes(value)) {
      setSelectedAvailability(
        selectedAvailability.filter((item) => item !== value),
      );
    } else {
      setSelectedAvailability([...selectedAvailability, value]);
    }
  };

  const clearAvailability = () => {
    setSelectedAvailability([]);
  };
  const toggleSalary = (value) => {
    if (selectedSalary.includes(value)) {
      setSelectedSalary(selectedSalary.filter((item) => item !== value));
    } else {
      setSelectedSalary([...selectedSalary, value]);
    }
  };

  const clearSalary = () => {
    setSelectedSalary([]);
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
      toast.error(t("header.failed_to_load_job_list"));
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
    } catch (error) {
      console.error(error);
      setCityList([]);
    }
  };

  useEffect(() => {
    fetchCountry();

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
          search: customSearch || undefined,
          skills:
            customFilters.selectedSkills?.length > 0
              ? customFilters.selectedSkills.join(",")
              : undefined,
          experience: Array.isArray(customFilters.selectedExperience)
            ? customFilters.selectedExperience.join(",")
            : undefined,

          education: Array.isArray(customFilters.selectedEducation)
            ? customFilters.selectedEducation.join(",")
            : undefined,

          salary: Array.isArray(customFilters.selectedSalary)
            ? customFilters.selectedSalary
                .map(
                  (item) => item.replace(/\s*dh$/i, "").trim(), // ✅ remove "dh"
                )
                .join(",")
            : undefined,

          availability: Array.isArray(customFilters.selectedAvailability)
            ? customFilters.selectedAvailability.join(",")
            : undefined,
          country: customFilters.selectedCountry || undefined,
          city: customFilters.selectedCity || undefined,

          status: customFilters.status || undefined,
          jobId: customFilters.selectedJob || undefined,
          sortByATS: customFilters.sortByATS || undefined, // ✅ ADD THIS
          tjm: isFreelancer ? `${minValue}-${maxValue}` : undefined,
          freelance: isFreelancer,
          page,
          limit: perPage,
        },
      });

      const applicants = res.data.applicants || [];

      setCandidates(applicants);
      setTotalResults(res.data.totalApplicants || 0);
      setTotalPages(res.data.pagination?.totalPages || 1);

      if (applicants.length > 0) {
        let selected = applicants[0];

        if (selectedCandidateId) {
          const found = applicants.find(
            (item) => item._id === selectedCandidateId,
          );

          if (found) {
            selected = found; // ✅ keep previously selected
          }
        }

        setSelectedCandidate(selected);
        setSelectedCandidateId(selected._id); // keep sync
      } else {
        setSelectedCandidate(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(t("header.failed_to_load_applicants"));
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
    isFreelancer, // ✅ add
    minValue, // ✅ add
    maxValue, // ✅ add
  ]);

  useEffect(() => {
    if (selectedCandidate?._id) {
      fetchCandidateDetails(selectedCandidate._id);
    }
  }, [selectedCandidate]);
  const fetchCandidateDetails = async (id) => {
    console.log(id);
    try {
      setDetailsLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}applicant/details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCandidateDetails(res.data?.applicant);
    } catch (err) {
      console.error("Error fetching candidate details:", err);
    } finally {
      setDetailsLoading(false);
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

  const handleStatusUpdate = async (value) => {
    console.log(value);
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

      toast.success(t("header.Candidate_status_updated_to", { value }));

      // Refresh list
      fetchApplicants(currentPage);
    } catch (error) {
      console.error("Update Status Error:", error);
      toast.error(t("header.failed_to_update_status"));
    }
  };

  const handleResetFilters = () => {
    const resetValues = {
      selectedSkills: [],
      selectedExperience: [],
      selectedEducation: [],
      selectedSalary: [],
      selectedAvailability: [],
      selectedCountry: "",
      selectedCity: "",
      status: "",
      selectedJob: "",
    };

    // Reset filter states
    setSelectedSkills([]);
    setSelectedExperience([]);
    setSelectedEducation([]);
    setSelectedSalary([]);
    setSelectedAvailability([]);
    setSelectedCountry("");
    setSelectedCity("");
    setStatus("");
    setSelectedJob("");

    // Reset TJM slider
    setMinValue(0);
    setMaxValue(5000);

    // Reset freelancer switch
    setIsFreelancer(false);

    // Close dropdowns
    setShowExperienceDropdown(false);
    setShowSalaryDropdown(false);
    setShowEducationDropdown(false);
    setShowAvailabilityDropdown(false);

    // Reset search
    setSearch("");

    fetchApplicants(1, resetValues, "");
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: t("header.Are_you_sure"),
      text: t("header.You_are_not_be_able_to_revert_this"),
      icon: t("header.warning"),
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("header.Yes_delete_it"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error(t("header.You_need_to_log_in_first"));
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
          toast.error(t("header.failed_to_delete_applicant"));
        }
      }
    });
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

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name");

    // If user clicked Cancel → do nothing
    if (folderName === null) {
      return;
    }

    // If empty string after clicking OK → show validation
    if (folderName.trim() === "") {
      toast.error(t("header.folder_name_required"));
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
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error(t("header.Failed_to_create_folder"));
    }
  };
  const handleFolderClick = (folderId) => {
    setActiveFolder(folderId);
    setCurrentPage(1);
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return {
          backgroundColor: "#eef2f7",
          color: "#5f6b7a",
        };

      case "Preselected":
        return {
          backgroundColor: "#e7f1ff",
          color: "#0d6efd",
        };

      case "Contacted":
        return {
          backgroundColor: "#ede9fe",
          color: "#6f42c1",
        };

      case "HR Interview":
        return {
          backgroundColor: "#fff8e1",
          color: "#b26a00",
        };

      case "Technical Interview":
        return {
          backgroundColor: "#e6f4ea",
          color: "#1e7e34",
        };

      case "Offered":
        return {
          backgroundColor: "#d1f7e8",
          color: "#0f9d58",
        };

      case "Hired":
        return {
          backgroundColor: "#d4edda",
          color: "#198754",
        };

      case "Rejected":
        return {
          backgroundColor: "#fdecea",
          color: "#d93025",
        };

      default:
        return {
          backgroundColor: "#eef2f7",
          color: "#5f6b7a",
        };
    }
  };
  const handleBookmarkCandidate = async (candidateId, folderId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}bookmarkCandidate`,
        { candidateId, folderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(t("header.candidate_bookmarked_successfully"));

        // ✅ Refresh current candidate details
        if (selectedCandidate?._id) {
          fetchApplicants(currentPage);
          fetchCandidateDetails(selectedCandidate._id);
        }
      } else {
        toast.warning(res.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data?.message === "Already bookmarked in this folder"
      ) {
        toast.warning(t("header.already_bookmarked_in_folder"));
      } else {
        toast.error(t("header.something_wrong"));
      }
    }
  };
  const handleUnlockContact = async () => {
    try {
      const token = localStorage.getItem("token");

      const candidateId = selectedCandidate?.userId?._id;
      const jobId = selectedCandidate?.jobId?._id;

      const response = await axios.post(
        `${API_BASE_URL}viewCandidatePerJob/${candidateId}/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      setSelectedCandidate((prev) => ({
        ...prev,
        isUnlocked: true,
      }));
      if (selectedCandidate?._id) {
        fetchCandidateDetails(selectedCandidate._id);
      }
    } catch (error) {
      const message = error.response?.data?.message;
      const exhausted = error.response?.data?.is_exhausted;

      toast.error(message || t("header.something_wrong"));

      // 🚀 Navigate only if credits exhausted
      if (exhausted === 1) {
        setTimeout(() => {
          navigate("/add-plan");
        }, 2000);
      }
    }
  };
  console.log(selectedCandidate);
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

          <div className="employer-dashboard-common-heading pb-3">
            <h2>All Applicants</h2>
          </div>

          <div className="d-flex flex-column gap-3 mb-4 p-4  bg-white shadow-sm rounded border">
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
                className="d-flex align-items-center bg-light rounded-pill px-3 "
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
                  className="form-select border-0 bg-transparent text-dark fw-bold shadow-none"
                  style={{
                    width: "150px",
                    cursor: "pointer",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "rgb(240, 245, 247)",
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
          </div>

          <div className="bg-white p-4 rounded shadow-sm border mt-3 mb-4 ">
            <div className="row g-3 mb-4">
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
                      placeholder="Rechercher par titre, compétences, mots-clés..."
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
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
                    {showFilter ? "Hide Filters" : "Show Filters"}
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
                    Find Candidate
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
                      Filtres Avancés
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
                          Experience
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
                                {selectedExperience.length} selected
                              </span>

                              <button
                                onClick={clearExperience}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{
                                  fontSize: "11px",
                                  color: "rgb(243, 122, 71)",
                                }}
                              >
                                Clear All
                              </button>
                            </div>

                            {/* OPTIONS */}
                            {/* {seniorityLevels.map((level) => (
                              <div
                                key={level._id}
                                onClick={() => toggleExperience(level.name)}
                                className="px-3 py-2 d-flex align-items-center gap-2 hover-bg-light"
                                style={{ cursor: "pointer" }}
                              >
                                <input
                                  className="form-check-input mt-0"
                                  type="checkbox"
                                  checked={selectedExperience.includes(
                                    level.name,
                                  )}
                                  readOnly
                                />

                                <span
                                  className="small text-dark"
                                  style={{ fontSize: "13px" }}
                                >
                                  {level.name}
                                </span>
                              </div>
                            ))} */}
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
                          Education
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
                                {selectedEducation.length} selected
                              </span>

                              <button
                                onClick={clearEducation}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{
                                  fontSize: "11px",
                                  color: "rgb(243, 122, 71)",
                                }}
                              >
                                Clear All
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
                          Availability
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
                                {selectedAvailability.length} selected
                              </span>

                              <button
                                onClick={clearAvailability}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{
                                  fontSize: "11px",
                                  color: "rgb(243, 122, 71)",
                                }}
                              >
                                Clear All
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
                          Salary
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
                                {selectedSalary.length} selected
                              </span>

                              <button
                                onClick={clearSalary}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{
                                  fontSize: "11px",
                                  color: "rgb(243, 122, 71)",
                                }}
                              >
                                Clear All
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
                          Compétences
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
                          Localisation
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
                              Recherche Freelance
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
                                Budget TJM (MAD)
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
                      Réinitialiser tous les filtres
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {activeTab === "all" && (
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
                      Total:{" "}
                      <span className="text-primary">
                        ({totalResults || 0})
                      </span>
                    </div>
                    <select
                      value={sortByATS}
                      onChange={(e) => {
                        setSortByATS(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="form-select form-select-sm border-0 bg-light fw-bold"
                      style={{
                        width: "auto",
                        "font-size": "12px",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">Sort By ATS</option>
                      <option value="desc">ATS Score: High to Low</option>
                      <option value="asc">ATS Score: Low to High</option>
                    </select>
                  </div>
                  <div
                    className="candidate-list-scroll px-1"
                    style={{ maxHeight: "800px" }}
                  >
                    {candidates.map((item) => {
                      const user = item || {};
                      const profile = item.userId?.candidateProfile;
                      const about = profile?.aboutRole;
                      const ats = item?.ats;

                      const atsColor =
                        ats?.percentage >= 70
                          ? "rgb(25, 135, 84)"
                          : ats?.percentage >= 40
                            ? "rgb(255, 193, 7)"
                            : "rgb(220, 53, 69)";

                      return (
                        <div
                          key={item._id}
                          onClick={() => {
                            setSelectedCandidate(user);
                            setSelectedCandidateId(user._id); // ✅ track ID
                          }}
                          className={`card mb-3 border-0 shadow-sm candidate-list-card ${
                            selectedCandidateId === item._id ? "active" : ""
                          }`}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="card-body p-3">
                            <div className="d-flex align-items-center">
                              {/* PROFILE IMAGE */}
                              <img
                                crossOrigin="anonymous"
                                alt="user"
                                className="rounded-circle me-3 shadow-sm border"
                                src={
                                  cleanImageUrl(item.userId?.profileImage) ||
                                  "assets/images/userIcon.png"
                                }
                                style={{
                                  width: "55px",
                                  height: "55px",
                                  objectFit: "cover",
                                }}
                              />

                              <div className="flex-grow-1">
                                {/* NAME + STATUS + BOOKMARK */}
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="d-flex flex-column">
                                    <h6
                                      className="mb-0 fw-bold text-dark"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {item.userId?.first_name}{" "}
                                      {item.userId?.last_name}
                                    </h6>

                                    <div className="mt-1">
                                      <span
                                        className="badge px-2"
                                        style={{
                                          fontSize: "9px",
                                          borderRadius: "4px",
                                          ...getStatusStyle(item.status),
                                        }}
                                      >
                                        {item.status}
                                      </span>
                                    </div>
                                  </div>

                                  {/* BOOKMARK */}
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-link text-warning p-0 no-caret"
                                      data-bs-toggle="dropdown"
                                    >
                                      <i
                                        className={
                                          item.isBookmarked
                                            ? "fa-solid fa-bookmark fs-6"
                                            : "fa-regular fa-bookmark fs-6"
                                        }
                                      />
                                    </button>

                                    <ul
                                      className="dropdown-menu dropdown-menu-end shadow border-0"
                                      style={{
                                        height: "250px",
                                        overflow: "auto",
                                        zIndex: 1,
                                      }}
                                    >
                                      <li>
                                        <h6 className="dropdown-header">
                                          Add to Folder
                                        </h6>
                                      </li>

                                      {autoJobFolders.map((folder) => (
                                        <li key={folder._id}>
                                          <button
                                            className="dropdown-item d-flex align-items-center gap-2"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleBookmarkCandidate(
                                                selectedCandidate?.userId?._id,
                                                folder._id,
                                              );
                                            }}
                                          >
                                            <i className="fa-solid fa-folder text-warning" />

                                            <div
                                              className="d-flex flex-column"
                                              style={{ lineHeight: "1.2" }}
                                            >
                                              <span
                                                className="fw-bold"
                                                style={{ fontSize: "12px" }}
                                              >
                                                Job Application
                                              </span>

                                              <span
                                                className="text-muted"
                                                style={{ fontSize: "10px" }}
                                              >
                                                {folder.name}
                                              </span>
                                            </div>
                                          </button>
                                        </li>
                                      ))}
                                      <li>
                                        <h6 className="dropdown-header">
                                          Manual Folders
                                        </h6>
                                      </li>

                                      {customFolders.length === 0 && (
                                        <li className="dropdown-item text-muted small">
                                          No manual folders available
                                        </li>
                                      )}

                                      {customFolders.map((folder) => (
                                        <li key={folder._id}>
                                          <button
                                            className="dropdown-item d-flex align-items-center gap-2 py-2"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleBookmarkCandidate(
                                                item?.userId?._id,
                                                folder._id,
                                              );
                                            }}
                                          >
                                            <i className="fa-regular fa-folder text-primary" />
                                            <span style={{ fontSize: "13px" }}>
                                              {folder.name}
                                            </span>
                                          </button>
                                        </li>
                                      ))}

                                      <li>
                                        <hr className="dropdown-divider" />
                                      </li>

                                      <li>
                                        <button
                                          className="dropdown-item text-primary py-2 d-flex align-items-center gap-2"
                                          onClick={handleCreateFolder}
                                        >
                                          <i className="fa-solid fa-plus" />
                                          <span style={{ fontSize: "13px" }}>
                                            Create New Folder
                                          </span>
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>

                                {/* EXPERIENCE + LOCATION */}
                                <div
                                  className="d-flex align-items-center gap-2 text-muted mt-2"
                                  style={{ fontSize: "11px" }}
                                >
                                  <span className="d-flex align-items-center gap-1 text-primary fw-bold">
                                    <i className="fa-solid fa-briefcase" />
                                    {about?.yearOfExperience || 0} Years
                                  </span>

                                  <span>•</span>

                                  <span className="d-flex align-items-center gap-1">
                                    <i className="fa-solid fa-location-dot text-danger" />
                                    {profile?.location?.city || "N/A"}
                                  </span>
                                </div>

                                {/* ATS MATCH */}
                                <div
                                  className="d-flex flex-column gap-1 mt-2"
                                  style={{ fontSize: "11px" }}
                                >
                                  <div className="d-flex align-items-center gap-2">
                                    <div
                                      className="progress flex-grow-1"
                                      style={{
                                        height: "4px",
                                        backgroundColor: "rgb(233,236,239)",
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
                                      style={{
                                        fontSize: "10px",
                                        color: atsColor,
                                      }}
                                    >
                                      {ats?.percentage || 0}% Match
                                    </span>
                                  </div>
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
                  <div
                    className="col-lg-8"
                    style={{
                      "-webkit-flex": "0 0 70%",
                      "-ms-flex": "0 0 70%",
                      flex: "0 0 70%",
                      "max-width": "70%",
                    }}
                  >
                    <div
                      className="card border-0 shadow-sm"
                      style={{ "min-height": "600px" }}
                    >
                      <div className="card-body p-4">
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
                                  selectedCandidate.userId?.profileImage,
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
                                  {selectedCandidate?.userId?.first_name}{" "}
                                  {selectedCandidate?.userId?.last_name}
                                </h4>
                                <p
                                  className="text-primary fw-medium mb-2"
                                  style={{ "font-size": "16px" }}
                                >
                                  {" "}
                                  {selectedCandidate?.userId?.candidateProfile
                                    ?.aboutRole?.jobTitle || "N/A"}
                                </p>
                              </div>
                              <div className="d-flex gap-2">
                                {selectedCandidate?.isUnlocked && (
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
                                )}

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
                                    <i
                                      className={
                                        selectedCandidate.isBookmarked
                                          ? "fa-solid fa-bookmark"
                                          : "fa-regular fa-bookmark"
                                      }
                                    />
                                  </button>
                                  <ul
                                    className="dropdown-menu dropdown-menu-end shadow border-0"
                                    style={{
                                      height: "250px",
                                      overflow: "auto",
                                      zIndex: 1,
                                    }}
                                  >
                                    <li>
                                      <h6 className="dropdown-header">
                                        Add to Folder
                                      </h6>
                                    </li>

                                    {autoJobFolders.map((folder) => (
                                      <li key={folder._id}>
                                        <button
                                          className="dropdown-item d-flex align-items-center gap-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleBookmarkCandidate(
                                              selectedCandidate?.userId?._id,
                                              folder._id,
                                            );
                                          }}
                                        >
                                          <i className="fa-solid fa-folder text-warning" />

                                          <div
                                            className="d-flex flex-column"
                                            style={{ lineHeight: "1.2" }}
                                          >
                                            <span
                                              className="fw-bold"
                                              style={{ fontSize: "12px" }}
                                            >
                                              Job Application
                                            </span>

                                            <span
                                              className="text-muted"
                                              style={{ fontSize: "10px" }}
                                            >
                                              {folder.name}
                                            </span>
                                          </div>
                                        </button>
                                      </li>
                                    ))}
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <h6 className="dropdown-header">
                                        Manual Folders
                                      </h6>
                                    </li>

                                    {customFolders.length === 0 && (
                                      <li className="dropdown-item text-muted small">
                                        No manual folders available
                                      </li>
                                    )}

                                    {customFolders.map((folder) => (
                                      <li key={folder._id}>
                                        <button
                                          className="dropdown-item d-flex align-items-center gap-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleBookmarkCandidate(
                                              selectedCandidate?.userId?._id,
                                              folder._id,
                                            );
                                          }}
                                        >
                                          <i className="fa-regular fa-folder" />

                                          <span style={{ fontSize: "13px" }}>
                                            {folder.name}
                                          </span>
                                        </button>
                                      </li>
                                    ))}

                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>

                                    <li>
                                      <button
                                        className="dropdown-item d-flex align-items-center gap-2"
                                        onClick={handleCreateFolder}
                                      >
                                        <i className="fa-solid fa-plus me-2" />
                                        Create New Folder
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div
                              className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 text-muted mb-2"
                              style={{ "font-size": "13px" }}
                            >
                              <span className="d-flex align-items-center gap-1">
                                <i className="fa-solid fa-location-dot text-danger" />
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
                              </span>
                              <span className="d-flex align-items-center gap-1">
                                <i className="fa-solid fa-briefcase text-info" />
                                {selectedCandidate?.userId?.candidateProfile
                                  ?.aboutRole?.yearOfExperience
                                  ? `${selectedCandidate.userId.candidateProfile.aboutRole.yearOfExperience}+ Years Exp.`
                                  : "N/A"}
                              </span>
                            </div>

                            <div class="mt-3">
                              {selectedCandidate?.isUnlocked ? (
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
                                          Email
                                        </div>
                                        <div
                                          className="fw-bold small"
                                          style={{ "font-size": "12px" }}
                                        >
                                          {selectedCandidate?.userId?.email ||
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
                                          Phone
                                        </div>
                                        <div
                                          className="fw-bold small"
                                          style={{ "font-size": "12px" }}
                                        >
                                          {selectedCandidate?.userId
                                            ?.countryCode
                                            ? `+${selectedCandidate.userId.countryCode} ${
                                                selectedCandidate?.userId
                                                  ?.phone || ""
                                              }`
                                            : selectedCandidate?.userId
                                                ?.phone || "Not Provided"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="border-start ps-4">
                                      <a
                                        href={
                                          selectedCandidate?.userId
                                            ?.candidateProfile?.links
                                            ?.linkedin || "#"
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white rounded-circle shadow-sm border text-info d-flex align-items-center justify-content-center hover-scale transition-all"
                                        title="LinkedIn Profile"
                                        style={{
                                          width: "38px",
                                          height: "38px",
                                          color: "rgb(0, 119, 181)",
                                        }}
                                        onClick={(e) => {
                                          const linkedinUrl =
                                            selectedCandidate?.userId
                                              ?.candidateProfile?.links
                                              ?.linkedin;

                                          if (!linkedinUrl) {
                                            e.preventDefault();
                                            toast.error(
                                              "LinkedIn profile not provided",
                                            );
                                          }
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
                                          selectedCandidate?.userId?._id,
                                        candidate: selectedCandidate,
                                      }}
                                      className="btn btn-warning text-white btn-sm shadow-sm gap-2 fw-bold "
                                    >
                                      <i
                                        className="fa-solid fa-envelope"
                                        style={{ marginRight: "5px" }}
                                      />
                                      Envoyer un message
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
                                    Afficher les coordonnées
                                  </button>
                                </div>
                              )}
                              <div className="mt-4 mb-2">
                                <h6 className="fw-bold mb-3">
                                  <i class="fa-solid fa-stairs text-primary"></i>{" "}
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

                                  const isRejected =
                                    currentStatus === "Rejected";

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

                                  <ul
                                    className="dropdown-menu"
                                    style={{ zIndex: 1 }}
                                  >
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
                              </div>
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
                                Professional Summary
                              </h5>

                              <p
                                className="text-muted"
                                style={{
                                  lineHeight: "1.7",
                                  whiteSpace: "pre-line",
                                }}
                              >
                                {selectedCandidate?.userId?.candidateProfile
                                  ?.professionalSummary
                                  ? selectedCandidate.userId.candidateProfile
                                      .professionalSummary
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
                                  Work Experience
                                </h5>

                                {selectedCandidate?.userId?.candidateProfile
                                  ?.workHistory?.length > 2 && (
                                  <button
                                    className="btn btn-link btn-sm text-decoration-none fw-bold"
                                    onClick={() =>
                                      setShowAllExperience(!showAllExperience)
                                    }
                                  >
                                    {showAllExperience
                                      ? "Voir moins"
                                      : "Voir plus"}{" "}
                                    (
                                    {
                                      selectedCandidate?.userId
                                        ?.candidateProfile?.workHistory?.length
                                    }
                                    )
                                  </button>
                                )}
                              </div>

                              <div className="experience-timeline position-relative ps-4">
                                <div
                                  className="position-absolute start-0 h-100 border-start border-2 border-light-subtle"
                                  style={{ left: "16px" }}
                                />

                                {selectedCandidate?.userId?.candidateProfile
                                  ?.workHistory?.length > 0 ? (
                                  (showAllExperience
                                    ? selectedCandidate.userId.candidateProfile
                                        .workHistory
                                    : selectedCandidate.userId.candidateProfile.workHistory.slice(
                                        0,
                                        2,
                                      )
                                  ).map((work) => (
                                    <div
                                      key={work._id}
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

                                        <span
                                          className="badge bg-light text-muted border px-2 py-1"
                                          style={{ fontSize: "11px" }}
                                        >
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
                                      {work.jobDescription && (
                                        <p
                                          className="text-muted small mb-0"
                                          style={{ lineHeight: "1.6" }}
                                        >
                                          {work.jobDescription}
                                        </p>
                                      )}

                                      {/* Salary */}
                                      {work.Description && (
                                        <p className="text-muted small mt-1">
                                          {work.Description || "N/A"}
                                        </p>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-muted small">
                                    No experience added
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
                                  Education
                                </h5>
                              </div>

                              <div className="education-list d-flex flex-column gap-3">
                                {selectedCandidate?.userId?.candidateProfile
                                  ?.education?.length > 0 ? (
                                  selectedCandidate.userId.candidateProfile.education.map(
                                    (edu) => (
                                      <div
                                        key={edu._id}
                                        className="edu-card p-3 bg-light rounded-3 border-0 transition-hover"
                                      >
                                        <div className="d-flex gap-3">
                                          <div className="bg-white rounded p-2 border shadow-sm h-100">
                                            <i className="fa-solid fa-graduation-cap text-primary fs-4" />
                                          </div>

                                          <div>
                                            <h6 className="fw-bold mb-1">
                                              {/* {edu.degree || "NA"}  */}
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
                                    No education added
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
                                Technical Skills
                              </h5>

                              <div className="d-flex flex-wrap gap-2 mt-3">
                                {selectedCandidate?.userId?.candidateProfile
                                  ?.skills?.length > 0 ? (
                                  selectedCandidate.userId.candidateProfile.skills.map(
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
                                    No skills added
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
                                    Career Preferences
                                  </h6>

                                  <div className="d-flex flex-column gap-3 mt-3">
                                    {/* Desired Job Title */}
                                    <div className="job-pref-item">
                                      <div
                                        className="text-muted text-uppercase mb-1"
                                        style={{
                                          fontSize: "10px",
                                          letterSpacing: "1px",
                                        }}
                                      >
                                        Desired Roles
                                      </div>

                                      <div className="fw-bold small">
                                        {Array.isArray(
                                          selectedCandidate?.userId
                                            ?.candidateProfile?.career_goals
                                            ?.DesiredJobTitle,
                                        )
                                          ? selectedCandidate.userId.candidateProfile.career_goals.DesiredJobTitle.join(
                                              ", ",
                                            )
                                          : selectedCandidate?.userId
                                              ?.candidateProfile?.career_goals
                                              ?.DesiredJobTitle || "NA"}
                                      </div>
                                    </div>

                                    {/* Employment Type */}
                                    <div className="job-pref-item">
                                      <div
                                        className="text-muted text-uppercase mb-1"
                                        style={{
                                          fontSize: "10px",
                                          letterSpacing: "1px",
                                        }}
                                      >
                                        Contract Types
                                      </div>

                                      <div className="d-flex flex-wrap gap-1">
                                        {Array.isArray(
                                          selectedCandidate?.userId
                                            ?.candidateProfile?.career_goals
                                            ?.DesiredEmploymentType,
                                        ) ? (
                                          selectedCandidate.userId.candidateProfile.career_goals.DesiredEmploymentType.map(
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
                                        ) : selectedCandidate?.userId
                                            ?.candidateProfile?.career_goals
                                            ?.DesiredEmploymentType ? (
                                          <span
                                            className="badge bg-white text-dark border px-2 py-1"
                                            style={{ fontSize: "10px" }}
                                          >
                                            {
                                              selectedCandidate.userId
                                                .candidateProfile.career_goals
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
                                        Occupation Type
                                      </div>

                                      <div className="fw-bold small">
                                        {Array.isArray(
                                          selectedCandidate?.userId
                                            ?.candidateProfile?.career_goals
                                            ?.DesiredJobCategory,
                                        )
                                          ? selectedCandidate.userId.candidateProfile.career_goals.DesiredJobCategory.join(
                                              ", ",
                                            )
                                          : selectedCandidate?.userId
                                              ?.candidateProfile?.career_goals
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
                                        Job Search Status
                                      </div>

                                      <div className="fw-bold small">
                                        {selectedCandidate?.userId
                                          ?.candidateProfile?.career_goals
                                          ?.jobSearchStatus || "NA"}
                                      </div>
                                    </div>
                                    <div className="job-pref-item">
                                      <div
                                        className="text-muted x-small text-uppercase mb-1"
                                        style={{
                                          fontSize: "10px",
                                          letterSpacing: "1px",
                                        }}
                                      >
                                        Work Eligibility (France)
                                      </div>

                                      <div className="fw-bold small d-flex align-items-center gap-2">
                                        {selectedCandidate?.userId
                                          ?.candidateProfile
                                          ?.eligibleToWorkInFrance ? (
                                          <span className="text-success d-flex align-items-center gap-1">
                                            <i className="fa-solid fa-circle-check" />{" "}
                                            Eligible
                                          </span>
                                        ) : (
                                          <span className="text-danger d-flex align-items-center gap-1">
                                            <i className="fa-solid fa-circle-xmark" />{" "}
                                            Not Eligible
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {/* Availability + Salary */}
                                    <div className="row g-2">
                                      <div className="col-6">
                                        <div
                                          className="text-muted text-uppercase mb-1"
                                          style={{
                                            fontSize: "10px",
                                            letterSpacing: "1px",
                                          }}
                                        >
                                          Availability
                                        </div>

                                        <div className="fw-bold small text-success">
                                          {selectedCandidate?.userId
                                            ?.candidateProfile?.career_goals
                                            ?.availabilityToJoin || "NA"}
                                        </div>
                                      </div>

                                      <div className="col-6 text-end">
                                        <div
                                          className="text-muted text-uppercase mb-1"
                                          style={{
                                            fontSize: "10px",
                                            letterSpacing: "1px",
                                          }}
                                        >
                                          Min Salary
                                        </div>

                                        <div className="fw-bold small">
                                          {selectedCandidate?.userId
                                            ?.candidateProfile?.career_goals
                                            ?.MinimumDesiredSalary?.amount ||
                                            "NA"}{" "}
                                          {
                                            selectedCandidate?.userId
                                              ?.candidateProfile?.career_goals
                                              ?.MinimumDesiredSalary?.currency
                                          }{" "}
                                          {selectedCandidate?.userId
                                            ?.candidateProfile?.career_goals
                                            ?.MinimumDesiredSalary?.type
                                            ? `/ ${
                                                selectedCandidate.userId
                                                  .candidateProfile.career_goals
                                                  .MinimumDesiredSalary.type
                                              }`
                                            : ""}
                                        </div>
                                      </div>
                                      <div className="mt-2 pt-2 border-top border-light-subtle d-flex justify-content-between align-items-center">
                                        <div className="text-muted small fw-bold">
                                          TJM
                                        </div>

                                        <div
                                          className="fw-bold text-info"
                                          style={{ fontSize: "13px" }}
                                        >
                                          {selectedCandidate?.userId
                                            ?.candidateProfile?.career_goals
                                            ?.TJM?.amount
                                            ? `${selectedCandidate.userId.candidateProfile.career_goals.TJM.amount} ${selectedCandidate.userId.candidateProfile.career_goals.TJM.currency}/j`
                                            : "NA"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="card border-0 shadow-sm mb-4">
                                <div className="card-body p-4">
                                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-language text-primary" />
                                    Languages
                                  </h6>

                                  <div className="d-flex flex-column gap-3 mt-3">
                                    {selectedCandidate?.userId?.candidateProfile
                                      ?.languages?.length > 0 ? (
                                      selectedCandidate.userId.candidateProfile.languages.map(
                                        (lang) => (
                                          <div
                                            key={lang._id}
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
                                        No languages added
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-medal text-warning" />
                                    Certifications
                                  </h6>

                                  <div className="d-flex flex-column gap-3 mt-3">
                                    {selectedCandidate?.userId?.candidateProfile
                                      ?.certificates?.length > 0 ? (
                                      selectedCandidate.userId.candidateProfile.certificates.map(
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
                                        No certificates added
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
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
                  <div className=" w-100">
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
                                      {
                                        item.userId?.candidateProfile?.aboutRole
                                          ?.jobTitle
                                      }
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
                                        src={cleanImageUrl(
                                          item.userId?.profileImage,
                                        )}
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          objectFit: "cover",
                                        }}
                                      />

                                      <div className="d-flex flex-column">
                                        <span className="fw-bold text-dark">
                                          {item.userId?.first_name}{" "}
                                          {item.userId?.last_name}
                                        </span>

                                        {/* Salary Section */}
                                        <div
                                          className="d-flex flex-column mt-1"
                                          style={{
                                            fontSize: "11px",
                                            lineHeight: "1.2",
                                          }}
                                        >
                                          {/* ✅ Current Salary */}
                                          {item.userId?.candidateProfile
                                            ?.workHistory?.[0]
                                            ?.currentSalary && (
                                            <span
                                              className="fw-bold"
                                              style={{
                                                color: "rgb(25, 103, 210)",
                                              }}
                                            >
                                              Salary:{" "}
                                              {
                                                item.userId.candidateProfile
                                                  .workHistory[0].currentSalary
                                                  .amount
                                              }{" "}
                                              {
                                                item.userId.candidateProfile
                                                  .workHistory[0].currentSalary
                                                  .currency
                                              }
                                              {/* {" / "}
                                              {
                                                item.userId.candidateProfile
                                                  .workHistory[0].currentSalary
                                                  .payrollFrequency
                                              } */}
                                            </span>
                                          )}

                                          {/* ✅ Desired Salary (Fallback) */}
                                          {!item.userId?.candidateProfile
                                            ?.workHistory?.[0]?.currentSalary &&
                                            item.userId?.candidateProfile
                                              ?.career_goals
                                              ?.MinimumDesiredSalary && (
                                              <span
                                                className="fw-bold"
                                                style={{
                                                  color: "rgb(25, 103, 210)",
                                                }}
                                              >
                                                Expected:{" "}
                                                {
                                                  item.userId.candidateProfile
                                                    .career_goals
                                                    .MinimumDesiredSalary.min
                                                }
                                                {" - "}
                                                {
                                                  item.userId.candidateProfile
                                                    .career_goals
                                                    .MinimumDesiredSalary.max
                                                }{" "}
                                                {
                                                  item.userId.candidateProfile
                                                    .career_goals
                                                    .MinimumDesiredSalary
                                                    .currency
                                                }
                                              </span>
                                            )}

                                          {/* ✅ TJM */}
                                          {item.userId?.candidateProfile
                                            ?.career_goals?.TJM && (
                                            <span
                                              className="fw-bold"
                                              style={{
                                                color: "rgb(243, 122, 71)",
                                              }}
                                            >
                                              TJM:{" "}
                                              {
                                                item.userId.candidateProfile
                                                  .career_goals.TJM.amount
                                              }{" "}
                                              {
                                                item.userId.candidateProfile
                                                  .career_goals.TJM.currency
                                              }
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* CV TITLE */}
                                  <td className="py-3 text-muted text-start">
                                    {about?.jobTitle ||
                                      item.jobId?.jobTitle}{" "}
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
                                    {item?.userId?.city &&
                                    item?.userId?.Nationality
                                      ? `${item.userId.city
                                          .toLowerCase()
                                          .replace(/^\w/, (c) =>
                                            c.toUpperCase(),
                                          )}, ${item.userId.Nationality}`
                                      : item?.userId?.city
                                        ? item.userId.city
                                            .toLowerCase()
                                            .replace(/^\w/, (c) =>
                                              c.toUpperCase(),
                                            )
                                        : item?.userId?.Nationality || "N/A"}
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
