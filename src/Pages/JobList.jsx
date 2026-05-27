import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "./JobCardModern.css";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination as SwiperPagination,
  Autoplay,
} from "swiper/modules";
import Pagination from "@mui/material/Pagination"; // MUI one
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDebounce, SEARCH_DEBOUNCE_MS } from "../hooks/useDebounce";
const JobList = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation("global");
  const { alert } = location.state || {};
  const [searchParams] = useSearchParams();
  const [remoteOptions, setRemoteOptions] = useState([]);
  const [selectedRemote, setSelectedRemote] = useState([]);
  console.log("Received Alert Data:", alert);
  const userRole = localStorage.getItem("user_role");
  const userId = localStorage.getItem("user_id");
  console.log(userRole);
  // or from context:  user?.role
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState(null);
  const [selectedCoverLetterUrl, setSelectedCoverLetterUrl] = useState(null);
  const [selectedCustomFile, setSelectedCustomFile] = useState(null);
  const fileInputRef = useRef(null);
  const [jobId, setJobId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [resumeList, setResumeList] = useState([]);
  const [coverLetterList, setCoverLetterList] = useState([]);
  const [showAlertOptions, setShowAlertOptions] = useState(false);
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [copied, setCopied] = useState(false);

  // Stores the current input in the location search box
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [notifyEvery, setNotifyEvery] = useState("1 day");
  const [loading, setLoading] = useState(false);
  // Stores the list of suggested cities from API
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [alertCreated, setAlertCreated] = useState(false); // ✅ track alert creation
  // Stores the locations selected by the user (can support multiple)
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  // Loading state for city suggestions
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const debouncedLocationSearch = useDebounce(
    locationSearchTerm,
    SEARCH_DEBOUNCE_MS,
  );
  const [globalCurrency, setGlobalCurrency] = useState({
    code: "MAD",
    symbol: "DH",
  });
  useEffect(() => {
    if (!alert) return;

    console.log("🔵 Prefilling filters from alert:", alert);

    // Job Types
    setSelectedJobTypes(alert.jobType || []);

    // Seniority Levels
    setSelectedSeniority(alert.experience || []);

    // Tech Stacks (filterCategory contains objects)
    setSelectedTechStacks(alert.filterCategory?.map((item) => item._id) || []);

    // Industries (contains objects with _id + name)
    setSelected(alert.industry || []);

    // Companies (convert string → object)
    setSelectedCompanies(
      alert.company?.map((name) => ({ _id: name, brandName: name })) || [],
    );

    // Locations (convert string → object)
    setSelectedLocations(
      alert.location?.map((name) => ({ _id: name, name })) || [],
    );

    // Salary Ranges
    setSelectedSalaryRanges(alert.salaryRange || []);

    // Mark alert as created
    setAlertCreated(true);

    // Immediately load job list using restored filters
    getAllJobList(
      pageSize,
      pageNumber,
      alert.jobType,
      alert.experience,
      alert.filterCategory?.map((t) => t._id),
      [], // category
      alert.company?.map((c) => ({ brandName: c })),
      alert.industry?.map((i) => ({ _id: i._id })),
      "", // keywords
      "",
      "",
      alert.location?.join(","),
      alert.salaryRange,
    );
  }, [alert]);

  const handleSalaryChange = (e) => {
    const { value, checked } = e.target;
    const updatedRanges = checked
      ? [...selectedSalaryRanges, value]
      : selectedSalaryRanges.filter((r) => r !== value);

    setSelectedSalaryRanges(updatedRanges);

    // ✅ Always pass all filters to API
    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","), // ✅ location
      updatedRanges, // ✅ salary filters
    );
  };
  const handleCopy = async (e, url) => {
    e.preventDefault();

    if (!url) {
      toast.error("Link not available yet");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Copy failed");
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        companyContainerRef.current &&
        !companyContainerRef.current.contains(event.target)
      ) {
        setShowCompanyDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const fetchRemoteOptions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getActiveRemote`);

      if (res.data.success && Array.isArray(res.data.data)) {
        setRemoteOptions(res.data.data); // ✅ FIXED
      } else {
        setRemoteOptions([]);
      }
    } catch (error) {
      console.error("Error fetching remote options:", error);
    }
  };
  useEffect(() => {
    fetchRemoteOptions();
  }, []);
  const fetchJobTypes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getActiveJobTypeList`);
      if (res.data.success && Array.isArray(res.data.jobTypes)) {
        setJobTypes(res.data.jobTypes);
      } else {
        setJobTypes([]);
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };
  useEffect(() => {
    fetchJobTypes();
  }, []);
  const handleRemoteChange = (e) => {
    const { value, checked } = e.target;

    const updatedRemote = checked
      ? [...selectedRemote, value]
      : selectedRemote.filter((r) => r !== value);

    setSelectedRemote(updatedRemote);

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
      updatedRemote, // ✅ pass remote
    );
  };
  const fetchGlobalCurrency = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getGlobalCurrency`);

      if (res.data.success) {
        const currencyCode = res.data.data?.code || "MAD";
        const currencySymbol = res.data.data?.symbol || "DH";

        setGlobalCurrency({
          code: currencyCode,
          symbol: currencySymbol,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGlobalCurrency();
  }, []);
  const fetchSeniorityLevels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getActiveSeniorityLevelList`);
      if (res.data.success && Array.isArray(res.data.levels)) {
        setSeniorityLevels(res.data.levels);
      } else {
        setSeniorityLevels([]);
      }
    } catch (error) {
      console.error("Error fetching seniority levels:", error);
    }
  };

  useEffect(() => {
    fetchSeniorityLevels();
  }, []);
  useEffect(() => {
    getSalaryRanges();
  }, []);

  const getSalaryRanges = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getActiveSalaryRangeList`);
      if (res.data.success) {
        setSalaryRanges(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching salary ranges:", error);
    }
  };

  const handleRemoveFilterJob = (key) => {
    const updatedAppliedFilters = { ...appliedFilters };
    delete updatedAppliedFilters[key];
    setAppliedFilters(updatedAppliedFilters);

    let updatedFilters = { ...filters };

    if (key === "category") {
      updatedFilters.category = "";
      setSelectedCategories([]);
    } else {
      updatedFilters[key] = "";
    }

    setFilters(updatedFilters);

    // ✅ USE updatedFilters (NOT old filters)
    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      key === "category" ? [] : selectedCategories,
      selectedCompanies,
      selected,
      updatedFilters.keywords,
      updatedFilters.location,
      updatedFilters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
      selectedRemote,
    );

    // ✅ FIX: pass updated filters here
    getCategories(updatedFilters);
  };

  // Clear all filters
  const handleClearSalaryFilters = () => {
    setSelectedSalaryRanges([]); // ✅ only clear salary

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      [], // ✅ cleared salary
      selectedRemote, // ✅ IMPORTANT (keep remote)
    );
  };

  const handleCreateAlert = async () => {
    setLoading(true);
    try {
      const payload = {
        jobCategory: selectedCategories.map((c) => c._id).filter(Boolean),
        Filtercategory: [
          ...selectedTechStacks,
          ...(appliedFilters.category ? [appliedFilters.category.id] : []), // ✅ send only ID
        ],

        jobType: selectedJobTypes.filter(Boolean),
        remote: selectedRemote.filter(Boolean), // ✅🔥 ADD THIS
        experience: selectedSeniority.filter(Boolean),
        location: [
          ...selectedLocations.map((l) => l.name),
          ...(appliedFilters.location ? [appliedFilters.location] : []),
        ].filter(Boolean),

        company: selectedCompanies.map((c) => c.brandName).filter(Boolean),
        industry: selected.map((i) => i._id).filter(Boolean),
        salaryRange: selectedSalaryRanges.filter(Boolean),
        notifyEvery: notifyEvery || "1 day",
        // jobTitle: appliedFilters.keywords || "",
      };
      if (appliedFilters.keywords?.trim()) {
        payload.jobTitle = appliedFilters.keywords.trim();
      }
      console.log("📤 Sending Job Alert payload:", payload);
      const res = await axios.post(`${API_BASE_URL}saveJobAlert`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Alert Created:", res.data);

      // ✅ Close modal safely if open
      const modal = document.getElementById("exampleModal1");
      if (modal) {
        const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
        bootstrapModal?.hide();
      }

      setAlertCreated(true);
      // resetAlertForm();

      toast.success(t("header.alert_success"));
    } catch (error) {
      console.error("❌ Error creating job alert:", error.response || error);
      toast.error(error?.response?.data?.message || t("header.alert_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}jobs/${jobId}/click`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
    } catch (error) {
      console.log(console.error);
    }
  };

  const handleLocationSearch = (e) => {
    setLocationSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (!debouncedLocationSearch.trim()) {
      setLocationSuggestions([]);
      return undefined;
    }

    const fetchLocationSuggestions = async () => {
      try {
        setIsLocationLoading(true);
        const res = await axios.get(`${API_BASE_URL}searchCities`, {
          params: { key: debouncedLocationSearch },
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

    fetchLocationSuggestions();
  }, [debouncedLocationSearch]);

  useEffect(() => {
    const fetchResume = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API_BASE_URL}candidate/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Resume Data:-", res.data.profile);
          const profile = res.data.profile;
          setResumeList(profile.resumeUrls || []);
          setCoverLetterList(profile.coverLetter || []);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchResume();
  }, []);
  const handleSelect = (type, id = null) => {
    if (type === "resume") {
      setSelectedResumeUrl(id);
      setSelectedCustomFile(null);
      if (fileInputRef?.current) fileInputRef.current.value = "";
    } else if (type === "cover") {
      setSelectedCoverLetterUrl(id);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCustomFile(file);
      setSelectedResumeUrl(null);
    }
  };

  const getFileName = (url) => {
    return url?.split("/").pop();
  };

  const handleSelectLocation = (city) => {
    if (!selectedLocations.some((loc) => loc._id === city._id)) {
      const updated = [...selectedLocations, city];
      setSelectedLocations(updated);

      // 🔄 Call API with all filters
      getAllJobList(
        pageSize,
        pageNumber,
        selectedJobTypes,
        selectedSeniority,
        selectedTechStacks,
        selectedCategories,
        selectedCompanies,
        selected,
        filters.keywords,
        filters.location,
        filters.category,
        updated.map((l) => l.name).join(","), // ✅ send all selected location names
        selectedSalaryRanges,
      );
    }

    setLocationSearchTerm("");
    setLocationSuggestions([]);
  };

  const handleRemoveLocation = (id) => {
    const updated = selectedLocations.filter((loc) => loc._id !== id);
    setSelectedLocations(updated);

    // 🔄 Refresh API call with remaining filters
    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      updated.map((l) => l.name).join(","),
      selectedSalaryRanges,
    );
  };

  const handleClearLocations = () => {
    setSelectedLocations([]);
    setLocationSearchTerm("");
    setLocationSuggestions([]);

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords,
      "", // clear location search
      filters.category,
      "",
      selectedSalaryRanges,
    );
  };
  const token = localStorage.getItem("token"); // 🔹 assuming JWT is stored here
  const [selectedTechStacks, setSelectedTechStacks] = useState(
    alert?.filterCategory?.map((item) => item._id) || [],
  );

  useEffect(() => {
    if (alert?.filterCategory) {
      const ids = alert.filterCategory.map((item) => item._id).join(",");
      console.log("Filtercategory", ids);
    }
  }, [alert]);

  const [searchTech, setSearchTech] = useState(""); // for search
  const [searchCategories, setSearchCategories] = useState(""); // for category search
  const [seniorityLevels, setSeniorityLevels] = useState([]);
  const [selectedSeniority, setSelectedSeniority] = useState(
    alert?.experience || [],
  );

  const wrapperRef = useRef(null);
  const [jobTypes, setJobTypes] = useState([]); // 🔹 dynamic data
  const [selectedJobTypes, setSelectedJobTypes] = useState(
    alert?.jobType || [],
  );

  const [options, setOptions] = useState([]); // All industries from API
  const [searchTerm, setSearchTerm] = useState(""); // For searching
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [jobList, setJobList] = useState([]);
  const [totalJobData, setTotalJobData] = useState({});
  const [companyOptions, setCompanyOptions] = useState([]); // ✅ dynamic list
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    keywords: "",
    location: "",
    category: "",
  });
  const [selected, setSelected] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const debouncedCompanySearch = useDebounce(
    companySearchTerm,
    SEARCH_DEBOUNCE_MS,
  );
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const companyContainerRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);

  const filteredCompanyOptions = companyOptions.filter(
    (company) =>
      company.brandName
        .toLowerCase()
        .includes(companySearchTerm.toLowerCase()) &&
      !selectedCompanies.some((c) => c._id === company._id),
  );

  const handleSaveJob = async (jobId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}savedJob`,
        { job_id: jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        const { message } = res.data;

        // ✅ 1. Update Job List instantly
        setJobList((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, isSaved: !job.isSaved } : job,
          ),
        );

        // ✅ 2. ALSO update selectedJob (IMPORTANT FIX)
        setSelectedJob((prev) =>
          prev && prev._id === jobId
            ? { ...prev, isSaved: !prev.isSaved }
            : prev,
        );

        // ✅ Toast
        if (message.toLowerCase().includes("saved")) {
          toast.success(message + " ❤️");
        } else if (message.toLowerCase().includes("unsaved")) {
          toast.info(message + " 💔");
        } else {
          toast.success(message);
        }
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error");
    }
  };
  const handleSelectCompany = (company) => {
    const updatedCompanies = [...selectedCompanies, company];
    setSelectedCompanies(updatedCompanies);
    setCompanySearchTerm("");
    setShowCompanyDropdown(false);

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      updatedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
    );
  };
  const handleRemoveCompany = (companyId) => {
    const updatedCompanies = selectedCompanies.filter(
      (c) => c._id !== companyId,
    );
    setSelectedCompanies(updatedCompanies);

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      updatedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
    );
  };

  const handleClearCompanies = () => {
    const clearedCompanies = [];
    setSelectedCompanies(clearedCompanies);

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      clearedCompanies, // ✅ now empty
      selected, // ✅ industries
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","), // ✅ location
      selectedSalaryRanges,
    );
  };

  const fetchIndustries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getIndustries`);
      if (res.data.success && Array.isArray(res.data.industries)) {
        setOptions(res.data.industries); // ✅ Replaces "allIndustries"
      }
    } catch (err) {
      console.error("Error fetching industries:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        companyContainerRef.current &&
        !companyContainerRef.current.contains(event.target)
      ) {
        setShowCompanyDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((industry) =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  // ✅ Fetch categories
  const getCategories = async (customFilters = filters) => {
    try {
      const res = await axios.get(`${API_BASE_URL}getJobCategory`, {
        params: {
          keywords: customFilters.keywords || undefined,
          location: customFilters.location || undefined,
        },
      });

      setCategories(res.data.jobCategories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const handleRemoveSalaryTag = (range) => {
    const updated = selectedSalaryRanges.filter((r) => r !== range);
    setSelectedSalaryRanges(updated);

    // ✅ Re-fetch jobs with updated filters
    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      updated,
    );
  };

  const fetchCompanies = async (search = "") => {
    try {
      const res = await axios.get(`${API_BASE_URL}getCompanyList`, {
        params: { search },
      });
      console.log("Company API response:", res.data);

      if (res.data.success && Array.isArray(res.data.companies)) {
        setCompanyOptions(res.data.companies);
      } else {
        setCompanyOptions([]);
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
  };
  useEffect(() => {
    fetchCompanies(debouncedCompanySearch);
  }, [debouncedCompanySearch]);

  const getAllJobList = async (
    limit = pageSize,
    page = pageNumber,
    jobTypesArr = selectedJobTypes,
    experience = selectedSeniority,
    techStacks = selectedTechStacks,
    selectedCategoriesArr = [],
    selectedCompaniesArr = selectedCompanies,
    selectedIndustries = selected,
    keywords = filters.keywords,
    location = filters.location,
    category = filters.category,
    locationFilter = "",
    salaryRangesAPI = [],
    remoteArr = selectedRemote, // ✅ NEW
  ) => {
    try {
      setIsLoadingJobs(true); // 🔵 START LOADER
      const params = {
        limit,
        page,
        keywords: keywords || undefined,
        location: location || undefined,
        category: category || undefined,
        jobType: jobTypesArr.join(","),
        experience: experience.join(","),
        Filtercategory: techStacks.join(","), // ✅ replaced allFilterCategories
        company: selectedCompaniesArr.map((c) => c.brandName).join(","),
        industry: selectedIndustries.map((i) => i._id).join(","),
        FilterRemote: remoteArr.join(","), // ✅ ADD THIS
      };

      if (locationFilter) params.Filterlocation = locationFilter;
      if (salaryRangesAPI.length > 0) {
        params.salary_range = salaryRangesAPI
          .map((item) => item.replace(/\s*dh$/i, "").trim()) // ✅ remove "dh"
          .join(",");
      }
      const res = await axios.get(`${API_BASE_URL}getAllJob`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobList(res.data?.jobs || []);
      setTotalJobData(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoadingJobs(false); // 🔵 STOP LOADER
    }
  };
  useEffect(() => {
    fetchIndustries();
    getCategories();
    getAllJobList(pageSize, pageNumber);
  }, [pageNumber, pageSize]);

  const totalPages = totalJobData?.totalPages;
  const jobChunks = [];
  for (let i = 0; i < jobList.length; i += 10) {
    jobChunks.push(jobList.slice(i, i + 10));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFilters = {};

    if (filters.keywords) newFilters.keywords = filters.keywords;
    if (filters.location) newFilters.location = filters.location;

    if (filters.category) {
      const selectedCat = categories.find((c) => c._id === filters.category);
      if (selectedCat) {
        newFilters.category = {
          id: selectedCat._id,
          name: selectedCat.name,
        };
      }
    }

    setAppliedFilters(newFilters);

    // ✅ CALL BOTH APIs WITH FILTERS
    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords, // ✅ pass keyword
      filters.location, // ✅ pass location
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
      selectedRemote,
    );

    // ✅ NEW: call category API with same filters
    getCategories();
  };

  const isSelectionMade = () => {
    return !!(selectedResumeUrl || selectedCustomFile);
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const resetApplyModal = () => {
    setSelectedResumeUrl(null);
    setSelectedCoverLetterUrl(null);
    setSelectedCustomFile(null);
    setIsApplying(false);

    if (fileInputRef?.current) fileInputRef.current.value = "";
  };
  const handleApplyJob = async () => {
    if (!jobId) {
      console.error("❌ jobId is missing");
      return;
    }

    if (!selectedResumeUrl && !selectedCustomFile) {
      toast.error(t("header.Please_select_resume_file"), {
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    setIsApplying(true);

    const formData = new FormData();

    if (selectedResumeUrl) {
      formData.append("cv", selectedResumeUrl);
    }

    if (selectedCoverLetterUrl) {
      formData.append("coverLetter", selectedCoverLetterUrl);
    }

    if (selectedCustomFile) {
      if (selectedCustomFile.size > MAX_FILE_SIZE) {
        toast.error(t("header.file_too_large"), {
          autoClose: 2000,
          theme: "colored",
        });
        setIsApplying(false);
        return;
      }
      formData.append("customResume", selectedCustomFile);
    }

    formData.append("jobId", jobId);

    try {
      const res = await axios.post(`${API_BASE_URL}applyJob`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message || "Applied successfully!");
      getAllJobList(pageSize, pageNumber);
      setIsPanelOpen(false);
      const modal = document.getElementById("exampleModal");
      if (modal) {
        const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
        bootstrapModal?.hide();
      }
    } catch (error) {
      console.error("Apply job error:", error);

      // 🔒 BACKUP SAFETY (in case proxy still throws 413)
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message, {
          autoClose: 2000,
          theme: "colored",
        });
      } else if (
        error?.response?.status === 413 ||
        error?.message?.includes("413")
      ) {
        toast.error(t("header.file_too_large"), {
          autoClose: 2000,
          theme: "colored",
        });
      } else {
        toast.error(t("header.something_wrong"));
      }
    } finally {
      setIsApplying(false); // 🔥 Stop loader
    }
  };

  // const handleApplyJob = async () => {
  //   if (!jobId) {
  //     console.error("❌ jobId is missing");
  //     return;
  //   }

  //   setIsApplying(true); // 🔥 Start loader

  //   const formData = new FormData();

  //   if (selectedType === "resume") {
  //     formData.append("cv", selectedId);
  //   }

  //   if (selectedType === "cover") {
  //     formData.append("coverLetter", selectedId);
  //   }

  //   if (selectedType === "custom") {
  //     formData.append("customResume", fileInputRef.current.files[0]);
  //   }

  //   formData.append("jobId", jobId);

  //   try {
  //     const res = await axios.post(`${API_BASE_URL}applyJob`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     getAllJobList(pageSize, pageNumber);
  //     toast.success(res.data.message || "Applied successfully!");

  //     const modal = document.getElementById("exampleModal");
  //     if (modal) {
  //       const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
  //       bootstrapModal?.hide();
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Something went wrong!");
  //   } finally {
  //     setIsApplying(false); // 🔥 Stop loader
  //   }
  // };
  useEffect(() => {
    getCategories();
    getAllJobList(pageSize, pageNumber);
  }, [pageNumber, pageSize]);

  const clearAll = () => {
    const clearedIndustries = [];

    setSelected(clearedIndustries); // ✅ clear only industries

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      clearedIndustries, // ✅ only this cleared
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
      selectedRemote, // ✅ IMPORTANT (keep remote)
    );
  };
  const removeTag = (_id) => {
    const updatedIndustries = selected.filter((i) => i._id !== _id);
    setSelected(updatedIndustries);

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      updatedIndustries,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
    );
  };

  console.log(userRole === "JobSeeker");
  const toggleOption = (industry) => {
    let updatedIndustries;
    if (selected.some((i) => i._id === industry._id)) {
      updatedIndustries = selected.filter((i) => i._id !== industry._id);
    } else {
      updatedIndustries = [...selected, industry];
    }

    setSelected(updatedIndustries);

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      updatedIndustries,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
    );
  };
  const handleJobTypeChange = (e) => {
    const { value, checked } = e.target;
    const updatedJobTypes = checked
      ? [...selectedJobTypes, value]
      : selectedJobTypes.filter((t) => t !== value);

    setSelectedJobTypes(updatedJobTypes);

    // ✅ Call API with all current filters every time
    getAllJobList(
      pageSize,
      pageNumber,
      updatedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
    );
  };
  const handleClearFilters = () => {
    setSelectedJobTypes([]); // ✅ only clear this

    getAllJobList(
      pageSize,
      pageNumber,
      [], // cleared job types
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
      selectedRemote, // ✅ IMPORTANT (don’t lose remote filter)
    );
  };

  const handleClearFilters1 = () => {
    setSelectedRemote([]); // ✅ only remote reset

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes, // ✅ keep existing job types
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
      [], // ✅ clear remote in API
    );
  };
  const handleSeniorityChange = (e) => {
    const { value, checked } = e.target;
    const updated = checked
      ? [...selectedSeniority, value]
      : selectedSeniority.filter((lvl) => lvl !== value);

    setSelectedSeniority(updated);

    // 🔄 Always pass all filters
    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      updated, // updated seniority list
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
    );
  };

  const handleClearSeniority = () => {
    setSelectedSeniority([]); // ✅ only clear this

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      [], // cleared seniority
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
      selectedRemote, // ✅ IMPORTANT (keep remote filter)
    );
  };

  const handleTechStackChange = (e) => {
    const { value, checked } = e.target;
    const updatedTechStacks = checked
      ? [...selectedTechStacks, value]
      : selectedTechStacks.filter((t) => t !== value);

    setSelectedTechStacks(updatedTechStacks);

    // ✅ Always call API with all filters
    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      updatedTechStacks,
      selectedCategories, // category filter
      selectedCompanies, // company filter
      selected, // industry filter
      filters.keywords, // keyword search
      filters.location, // location search
      filters.category, // category name
      selectedLocations.map((l) => l.name).join(","), // location filter
      selectedSalaryRanges, // salary filter
    );
  };

  const handleClearTechStacks = () => {
    const clearedTech = []; // explicit

    setSelectedTechStacks(clearedTech);
    setSearchTech("");

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      clearedTech, // ✅ ONLY this is cleared
      selectedCategories,
      selectedCompanies,
      selected,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
      selectedRemote, // ✅ IMPORTANT (don’t lose remote)
    );
  };
  useEffect(() => {
    setAlertCreated(false);
  }, [
    selectedCategories,
    selectedTechStacks,
    selectedJobTypes,
    selectedSeniority,
    selectedLocations,
    selectedCompanies,
    selected,
    selectedSalaryRanges,
  ]);
  const resetAlertForm = () => {
    setSelectedCategories([]);
    setSelectedTechStacks([]);
    setSelectedJobTypes([]);
    setSelectedSeniority([]);
    setSelectedLocations([]);
    setSelectedCompanies([]);
    setSelected([]);
    setSelectedSalaryRanges([]);
    setNotifyEvery("1 day");
  };

  useEffect(() => {
    fetchCompaniesSlider();
  }, []);

  const fetchCompaniesSlider = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getCompanyDetailsListSlider`);
      if (res.data.success) {
        setCompanies(res.data);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  useEffect(() => {
    const keywordParam = searchParams.get("keywords") || "";
    const locationParam = searchParams.get("location") || "";
    const categoryParam = searchParams.get("category") || "";

    // 🔹 Update filter form inputs
    setFilters((prev) => ({
      ...prev,
      keywords: keywordParam,
      location: locationParam,
      category: categoryParam,
    }));
  }, [searchParams]);
  useEffect(() => {
    if (!categories.length) return;

    const newFilters = {};

    if (filters.keywords) newFilters.keywords = filters.keywords;
    if (filters.location) newFilters.location = filters.location;

    if (filters.category) {
      const selectedCat = categories.find((c) => c._id === filters.category);

      if (selectedCat) {
        newFilters.category = {
          id: selectedCat._id,
          name: selectedCat.name,
        };
      }
    }

    setAppliedFilters(newFilters);

    // 🔥 Call job list API with URL filters
    getAllJobList(pageSize, pageNumber);
  }, [categories, pageNumber, pageSize]);
  const handleViewCompany = (company) => {
    navigate(`/${company.slug}`, {
      state: { companyId: company._id },
    });
  };
  const JobListLoader = () => (
    <div className="loader-overlay">
      <div className="loader-box">
        <div className="custom-spinner"></div>
        <p className="brand-text">NADDI.MA</p>
      </div>
    </div>
  );
  const hasAnyFilter =
    selectedJobTypes.length > 0 ||
    selectedRemote.length > 0 || // ✅ ADD THIS
    selectedSeniority.length > 0 ||
    selectedCompanies.length > 0 ||
    selected.length > 0 ||
    selectedSalaryRanges.length > 0 ||
    selectedLocations.length > 0 ||
    selectedTechStacks.length > 0 ||
    Object.keys(appliedFilters).length > 0; // 🔥 key line
  return (
    <>
      <ToastContainer />
      <section className="job-card-list-info-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="manage-jobs-box">
                <div className="job-listing-search-form job-search-info-area">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-0">
                      <div className="col-lg-7 col-sm-6">
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="text"
                            placeholder={t("header.keywords")}
                            value={filters.keywords}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                keywords: e.target.value,
                              })
                            }
                          />
                          <i className="flaticon-portfolio" />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6">
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="text"
                            placeholder={t("header.location_city")}
                            value={filters.location}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                location: e.target.value,
                              })
                            }
                          />
                          <i className="flaticon-location" />
                        </div>
                      </div>

                      <div className="col-lg-2 col-sm-6">
                        <div className="search-btn">
                          <button type="submit" className="default-btn btn">
                            {t("header.find_jobs")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-sm-12">
              <div className="job-card-list-filter-info">
                <div className="row">
                  <div className="col-lg-4 col-md-4">
                    <div className="job-filter-main-info sidebar-scroll-touch-footer modern-sidebar-style">
                      <div className="modern-filter-section">
                        <div className="job-filter-heading-cancel">
                          <div className="job-filter-heading">
                            <h4>
                              <i className="fa-solid fa-laptop-code" />
                              {t("header.tech_Stack")}
                            </h4>
                          </div>
                          <div className="job-filter-cancel-heading">
                            <h4
                              style={{ cursor: "pointer" }}
                              onClick={handleClearTechStacks}
                            >
                              {t("header.Clear")}
                            </h4>
                          </div>
                        </div>

                        <div className="job-filter-select-info">
                          <ul>
                            {categories.slice(0, 3).map((cat, index) => (
                              <li key={cat._id}>
                                <input
                                  type="checkbox"
                                  id={`tech-${index}`}
                                  value={cat._id}
                                  checked={selectedTechStacks.includes(cat._id)}
                                  onChange={handleTechStackChange}
                                />
                                <label htmlFor={`tech-${index}`}>
                                  {cat.name} ({cat.jobCount})
                                </label>
                              </li>
                            ))}
                          </ul>
                          <div
                            className="job-filter-tech-stack collapse"
                            id="techStackCollapse"
                          >
                            <div className="job-filter-tech-stack-search-box mb-2">
                              <input
                                type="search"
                                className="form-control"
                                placeholder="Search..."
                                value={searchTech}
                                onChange={(e) => setSearchTech(e.target.value)}
                              />
                            </div>

                            <ul>
                              {categories
                                .slice(3)
                                .filter((cat) =>
                                  cat.name
                                    .toLowerCase()
                                    .includes(searchTech.toLowerCase()),
                                )
                                .map((cat, index) => (
                                  <li key={cat._id}>
                                    <input
                                      type="checkbox"
                                      id={`tech-${index + 3}`}
                                      value={cat._id}
                                      checked={selectedTechStacks.includes(
                                        cat._id,
                                      )}
                                      onChange={handleTechStackChange}
                                    />
                                    <label htmlFor={`tech-${index + 3}`}>
                                      {cat.name} ({cat.jobCount})
                                    </label>
                                  </li>
                                ))}
                            </ul>
                          </div>

                          <div
                            className="show-more-less-btn collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#techStackCollapse"
                            aria-expanded="false"
                            aria-controls="techStackCollapse"
                          >
                            <span className="show-more">
                              {t("header.show_more")}{" "}
                              <i
                                className="fa fa-angle-down"
                                aria-hidden="true"
                              />
                            </span>
                            <span className="show-less">
                              {t("header.show_less")}{" "}
                              <i
                                className="fa fa-angle-up"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="divder-line-info" />
                      <div className="modern-filter-section">
                        <div className="job-filter-heading-cancel">
                          <div className="job-filter-heading">
                            <h4>
                              <i className="fa-solid fa-briefcase" />
                              {t("header.Employment_Type")}
                            </h4>
                          </div>
                          <div className="job-filter-cancel-heading">
                            <h4
                              style={{ cursor: "pointer" }}
                              onClick={handleClearFilters}
                            >
                              {t("header.Clear")}
                            </h4>
                          </div>
                        </div>

                        <div className="job-filter-select-info">
                          <ul>
                            {jobTypes.slice(0, 4).map((type) => (
                              <li key={type._id}>
                                <input
                                  type="checkbox"
                                  value={type._id} // ✅ send ID instead of name
                                  checked={selectedJobTypes.includes(type._id)} // ✅ check by ID
                                  onChange={handleJobTypeChange}
                                />
                                <label>{type.name}</label>
                              </li>
                            ))}
                          </ul>

                          {/* 🔽 Collapsible section for remaining job types */}
                          <div
                            className="job-filter-tech-stack collapse"
                            id="jobTypesCollapse"
                          >
                            <ul>
                              {jobTypes.slice(4).map((type) => (
                                <li key={type._id}>
                                  <input
                                    type="checkbox"
                                    value={type._id} // ✅ send ID
                                    checked={selectedJobTypes.includes(
                                      type._id,
                                    )} // ✅ check by ID
                                    onChange={handleJobTypeChange}
                                  />
                                  <label>{type.name}</label>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 🔽 Show More / Less button */}
                          {jobTypes.length > 4 && (
                            <div
                              className="show-more-less-btn collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#jobTypesCollapse"
                              aria-expanded="false"
                              aria-controls="jobTypesCollapse"
                            >
                              <span className="show-more">
                                {t("header.show_more")}{" "}
                                <i
                                  className="fa fa-angle-down"
                                  aria-hidden="true"
                                />
                              </span>
                              <span className="show-less">
                                {t("header.show_less")}{" "}
                                <i
                                  className="fa fa-angle-up"
                                  aria-hidden="true"
                                />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="divder-line-info" />
                      <div className="modern-filter-section">
                        <div className="job-filter-heading-cancel">
                          <div className="job-filter-heading">
                            <h4>
                              <i className="fa-solid fa-house-laptop" />
                              Remote
                            </h4>
                          </div>

                          <div className="job-filter-cancel-heading">
                            <h4
                              style={{ cursor: "pointer" }}
                              onClick={handleClearFilters1} // separate clear for remote
                            >
                              {t("header.Clear")}
                            </h4>
                          </div>
                        </div>

                        <div className="job-filter-select-info">
                          {/* ✅ First 4 items */}
                          <ul>
                            {remoteOptions.slice(0, 4).map((item) => (
                              <li key={item._id}>
                                <input
                                  type="checkbox"
                                  value={item._id}
                                  checked={selectedRemote.includes(item._id)}
                                  onChange={handleRemoteChange}
                                />
                                <label>{item.name}</label>
                              </li>
                            ))}
                          </ul>

                          {/* ✅ Remaining items (collapse) */}
                          <div
                            className="job-filter-tech-stack collapse"
                            id="remoteCollapse"
                          >
                            <ul>
                              {remoteOptions.slice(4).map((item) => (
                                <li key={item._id}>
                                  <input
                                    type="checkbox"
                                    value={item._id}
                                    checked={selectedRemote.includes(item._id)}
                                    onChange={handleRemoteChange}
                                  />
                                  <label>{item.name}</label>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* ✅ Show More / Less */}
                          {remoteOptions.length > 4 && (
                            <div
                              className="show-more-less-btn collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#remoteCollapse"
                              aria-expanded="false"
                              aria-controls="remoteCollapse"
                            >
                              <span className="show-more">
                                {t("header.show_more")}{" "}
                                <i className="fa fa-angle-down" />
                              </span>

                              <span className="show-less">
                                {t("header.show_less")}{" "}
                                <i className="fa fa-angle-up" />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="divder-line-info" />
                      <div className="modern-filter-section">
                        <div className="job-filter-heading-cancel">
                          <div className="job-filter-heading">
                            <h4>
                              <i className="fas fa-signal" />{" "}
                              {t("header.seniority_level")}
                            </h4>
                          </div>
                          <div className="job-filter-cancel-heading">
                            <h4
                              style={{ cursor: "pointer" }}
                              onClick={handleClearSeniority}
                            >
                              {t("header.Clear")}
                            </h4>
                          </div>
                        </div>

                        <div className="job-filter-select-info">
                          {/* First 3 items */}
                          <ul>
                            {seniorityLevels.slice(0, 3).map((level, index) => (
                              <li key={level._id}>
                                <input
                                  type="checkbox"
                                  id={`seniority-${index}`}
                                  value={level._id} // ✅ Use ID instead of name
                                  checked={selectedSeniority.includes(
                                    level._id,
                                  )} // ✅ Compare by ID
                                  onChange={handleSeniorityChange}
                                />
                                <label htmlFor={`seniority-${index}`}>
                                  {level.name}
                                </label>
                              </li>
                            ))}
                          </ul>
                          {/* Collapse Section for Remaining Levels */}
                          <div
                            className="job-filter-tech-stack collapse"
                            id="seniorityCollapse"
                          >
                            <ul>
                              {seniorityLevels.slice(3).map((level, index) => (
                                <li key={level._id}>
                                  <input
                                    type="checkbox"
                                    id={`seniority-${index + 3}`}
                                    value={level._id} // ✅ Use ID
                                    checked={selectedSeniority.includes(
                                      level._id,
                                    )} // ✅ Compare by ID
                                    onChange={handleSeniorityChange}
                                  />
                                  <label htmlFor={`seniority-${index + 3}`}>
                                    {level.name}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Show More / Less Toggle */}
                          {seniorityLevels.length > 3 && (
                            <div
                              className="show-more-less-btn collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#seniorityCollapse"
                              aria-expanded="false"
                              aria-controls="seniorityCollapse"
                            >
                              <span className="show-more">
                                {t("header.show_more")}{" "}
                                <i
                                  className="fa fa-angle-down"
                                  aria-hidden="true"
                                />
                              </span>
                              <span className="show-less">
                                {t("header.show_less")}{" "}
                                <i
                                  className="fa fa-angle-up"
                                  aria-hidden="true"
                                />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="divder-line-info" />
                      <div className="modern-filter-section">
                        <div className="job-filter-heading-cancel">
                          <div className="job-filter-heading">
                            <h4>
                              <i className="fas fa-money-bill-alt" />{" "}
                              {t("header.salary_range")}
                            </h4>
                          </div>
                          <div className="job-filter-cancel-heading">
                            <h4
                              style={{ cursor: "pointer" }}
                              onClick={handleClearSalaryFilters}
                            >
                              {t("header.Clear")}
                            </h4>
                          </div>
                        </div>

                        <div className="job-filter-select-info">
                          <ul>
                            {salaryRanges.slice(0, 4).map((range) => (
                              <li key={range._id}>
                                <input
                                  type="checkbox"
                                  value={range.range}
                                  checked={selectedSalaryRanges.includes(
                                    range.range,
                                  )}
                                  onChange={handleSalaryChange}
                                />
                                <label>{range.range}</label>
                              </li>
                            ))}
                          </ul>

                          <div
                            className="job-filter-tech-stack collapse"
                            id="salaryCollapse"
                          >
                            <ul>
                              {salaryRanges.slice(4).map((range) => (
                                <li key={range._id}>
                                  <input
                                    type="checkbox"
                                    value={range.range}
                                    checked={selectedSalaryRanges.includes(
                                      range.range,
                                    )}
                                    onChange={handleSalaryChange}
                                  />
                                  <label>{range.range}</label>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div
                            className="show-more-less-btn collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#salaryCollapse"
                            aria-expanded="false"
                            aria-controls="salaryCollapse"
                          >
                            <span className="show-more">
                              {t("header.show_more")}{" "}
                              <i
                                className="fa fa-angle-down"
                                aria-hidden="true"
                              />
                            </span>
                            <span className="show-less">
                              {t("header.show_less")}{" "}
                              <i
                                className="fa fa-angle-up"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="divder-line-info" />
                      <div>
                        <div className="modern-filter-section" ref={wrapperRef}>
                          {/* Header */}
                          <div className="job-filter-heading-cancel">
                            <div className="job-filter-heading">
                              <h4>
                                <i className="fas fa-industry" />{" "}
                                {t("header.industry_sector")}
                              </h4>
                            </div>

                            <div
                              className="job-filter-cancel-heading"
                              onClick={clearAll}
                            >
                              <h4>{t("header.Clear")}</h4>
                            </div>
                          </div>

                          {/* Multi Select */}
                          <div className="job-filter-select-info">
                            <div className="modern-multi-select-container">
                              {/* Selected Items */}
                              <div
                                className="modern-selected-items"
                                onClick={() => setShowOptions(true)}
                              >
                                {selected?.map((industry) => (
                                  <span
                                    key={industry._id}
                                    className="modern-multi-tag"
                                  >
                                    {industry.name}
                                    <i
                                      className="fa-solid fa-xmark remove-tag"
                                      onClick={(e) => {
                                        e.stopPropagation(); // prevent dropdown open
                                        removeTag(industry._id);
                                      }}
                                    />
                                  </span>
                                ))}

                                <input
                                  className="modern-multi-input"
                                  type="text"
                                  placeholder={t("header.Search_industries")}
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                  onFocus={() => setShowOptions(true)}
                                />
                              </div>

                              {/* Dropdown */}
                              {showOptions && (
                                <ul className="modern-dropdown-menu">
                                  {filteredOptions.length > 0 ? (
                                    filteredOptions.map((industry) => {
                                      const isSelected = selected.some(
                                        (i) => i._id === industry._id,
                                      );

                                      return (
                                        <li
                                          key={industry._id}
                                          onClick={() => toggleOption(industry)}
                                          className={`modern-dropdown-item ${
                                            isSelected ? "selected" : ""
                                          }`}
                                        >
                                          {industry.name}
                                          {isSelected && (
                                            <span className="checkmark">✔</span>
                                          )}
                                        </li>
                                      );
                                    })
                                  ) : (
                                    <li className="no-options">
                                      {t("header.no_industries")}
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="divder-line-info" />
                      <div
                        className="modern-filter-section"
                        ref={companyContainerRef}
                      >
                        {/* Header */}
                        <div className="job-filter-heading-cancel">
                          <div className="job-filter-heading">
                            <h4>
                              <i className="fas fa-building" />
                              {t("header.company")}
                            </h4>
                          </div>

                          <div
                            className="job-filter-cancel-heading"
                            onClick={handleClearCompanies}
                          >
                            <h4>{t("header.Clear")}</h4>
                          </div>
                        </div>

                        {/* Select */}
                        <div className="job-filter-select-info">
                          <div className="modern-multi-select-container">
                            {/* Selected Companies */}
                            <div
                              className="modern-selected-items"
                              onClick={() => setShowCompanyDropdown(true)}
                            >
                              {selectedCompanies.map((company) => (
                                <div
                                  key={company._id}
                                  className="modern-multi-tag"
                                >
                                  <span>{company.brandName}</span>

                                  <i
                                    className="fa-solid fa-xmark remove-tag"
                                    onClick={(e) => {
                                      e.stopPropagation(); // prevent dropdown open
                                      handleRemoveCompany(company._id);
                                    }}
                                  />
                                </div>
                              ))}

                              {/* Input */}
                              <input
                                className="modern-multi-input"
                                type="text"
                                placeholder={t("header.Search_Company")}
                                value={companySearchTerm}
                                onChange={(e) =>
                                  setCompanySearchTerm(e.target.value)
                                }
                                onFocus={() => setShowCompanyDropdown(true)}
                              />
                            </div>

                            {/* Dropdown */}
                            {showCompanyDropdown && (
                              <ul className="modern-dropdown-menu">
                                {filteredCompanyOptions.length > 0 ? (
                                  filteredCompanyOptions.map((company) => {
                                    const isSelected = selectedCompanies.some(
                                      (c) => c._id === company._id,
                                    );

                                    return (
                                      <li
                                        key={company._id}
                                        className={`modern-dropdown-item ${
                                          isSelected ? "selected" : ""
                                        }`}
                                        onClick={() =>
                                          handleSelectCompany(company)
                                        }
                                      >
                                        {company.brandName}

                                        {isSelected && (
                                          <span className="checkmark">✔</span>
                                        )}
                                      </li>
                                    );
                                  })
                                ) : (
                                  <li className="no-options">
                                    {t("header.No_companies_found")}
                                  </li>
                                )}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 col-md-8">
                    <div className="available-job-posts-info">
                      <div className="available-job-posts-info modern-available-jobs-header">
                        {/* Top Header */}
                        <div className="modern-header-top">
                          <div className="available-job-posts-heading1">
                            <h4>
                              <span className="modern-count-badge">
                                {totalJobData?.total || 0}
                              </span>{" "}
                              {t("header.available_job_posts")}
                            </h4>
                          </div>

                          {/* Alert Button */}
                          {hasAnyFilter && (
                            <>
                              {!alertCreated ? (
                                <button
                                  type="button"
                                  className="modern-alert-btn"
                                  onClick={(e) => {
                                    e.preventDefault();

                                    if (!userId) {
                                      navigate("/login");
                                      return;
                                    }

                                    const modalEl =
                                      document.getElementById("exampleModal1");

                                    if (modalEl) {
                                      const modalInstance =
                                        new window.bootstrap.Modal(modalEl);
                                      modalInstance.show();
                                    }
                                  }}
                                >
                                  <i className="fa-regular fa-bell me-2"></i>
                                  {t("header.set_alert")}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="modern-alert-btn"
                                >
                                  <i className="fa-solid fa-circle-check me-2"></i>
                                  {t("header.alert_created")}
                                </button>
                              )}
                            </>
                          )}
                        </div>

                        {/* Filter Pills */}
                        <div className="modern-filter-pill-area">
                          {/* appliedFilters */}
                          {Object.entries(appliedFilters).map(
                            ([key, value]) => (
                              <span key={key} className="modern-filter-pill">
                                {typeof value === "object" ? value.name : value}

                                <i
                                  className="fa-solid fa-xmark"
                                  onClick={() => handleRemoveFilterJob(key)}
                                ></i>
                              </span>
                            ),
                          )}

                          {/* Job Types */}
                          {selectedJobTypes.map((id) => {
                            const jobType = jobTypes.find((j) => j._id === id);

                            return (
                              <span key={id} className="modern-filter-pill">
                                {jobType?.name || "Job Type"}

                                <i
                                  className="fa-solid fa-xmark"
                                  onClick={() =>
                                    handleJobTypeChange({
                                      target: {
                                        value: id,
                                        checked: false,
                                      },
                                    })
                                  }
                                ></i>
                              </span>
                            );
                          })}
                          {selectedRemote.map((id) => {
                            const remote = remoteOptions.find(
                              (r) => r._id === id,
                            );

                            return (
                              <span key={id} className="modern-filter-pill">
                                {remote?.name}

                                <i
                                  className="fa-solid fa-xmark"
                                  onClick={() =>
                                    handleRemoteChange({
                                      target: { value: id, checked: false },
                                    })
                                  }
                                ></i>
                              </span>
                            );
                          })}
                          {/* Locations */}
                          {selectedLocations.map((loc) => (
                            <span key={loc._id} className="modern-filter-pill">
                              {loc.name}

                              <i
                                className="fa-solid fa-xmark"
                                onClick={() => handleRemoveLocation(loc._id)}
                              ></i>
                            </span>
                          ))}

                          {/* Industries */}
                          {selected.map((industry) => (
                            <span
                              key={industry._id}
                              className="modern-filter-pill"
                            >
                              {industry.name}

                              <i
                                className="fa-solid fa-xmark"
                                onClick={() => removeTag(industry._id)}
                              ></i>
                            </span>
                          ))}

                          {/* Seniority */}
                          {selectedSeniority.map((id) => {
                            const level = seniorityLevels.find(
                              (l) => l._id === id,
                            );

                            return (
                              <span key={id} className="modern-filter-pill">
                                {level?.name}

                                <i
                                  className="fa-solid fa-xmark"
                                  onClick={() =>
                                    handleSeniorityChange({
                                      target: {
                                        value: id,
                                        checked: false,
                                      },
                                    })
                                  }
                                ></i>
                              </span>
                            );
                          })}

                          {/* Salary */}
                          {selectedSalaryRanges.map((range) => {
                            const label =
                              salaryRanges.find((r) => r.range === range)
                                ?.range || range;

                            return (
                              <span key={range} className="modern-filter-pill">
                                {label}

                                <i
                                  className="fa-solid fa-xmark"
                                  onClick={() => handleRemoveSalaryTag(range)}
                                ></i>
                              </span>
                            );
                          })}

                          {/* Tech Stack */}
                          {selectedTechStacks.map((id) => {
                            const cat = categories.find((c) => c._id === id);

                            return (
                              <span key={id} className="modern-filter-pill">
                                {cat?.name}

                                <i
                                  className="fa-solid fa-xmark"
                                  onClick={() =>
                                    handleTechStackChange({
                                      target: {
                                        value: id,
                                        checked: false,
                                      },
                                    })
                                  }
                                ></i>
                              </span>
                            );
                          })}

                          {/* Companies */}
                          {selectedCompanies.map((company) => (
                            <span
                              key={company._id}
                              className="modern-filter-pill"
                            >
                              {company.brandName}

                              <i
                                className="fa-solid fa-xmark"
                                onClick={() => handleRemoveCompany(company._id)}
                              ></i>
                            </span>
                          ))}
                        </div>
                      </div>
                      {isLoadingJobs ? (
                        <JobListLoader />
                      ) : jobList.length > 0 ? (
                        <>
                          {jobChunks.map((chunk, chunkIndex) => (
                            <React.Fragment key={chunkIndex}>
                              {/* Render jobs */}
                              {chunk.map((job) => (
                                <div
                                  key={job._id}
                                  className="job-link text-decoration-none"
                                  onClick={() => {
                                    setSelectedJob(job);
                                    setIsPanelOpen(true);
                                  }}
                                >
                                  <div className="modern-job-card clickable mb-4">
                                    {/* Header */}
                                    <div className="modern-job-header">
                                      <div className="modern-company-info">
                                        <div className="modern-logo-container">
                                          <img
                                            crossOrigin="anonymous"
                                            alt="logo"
                                            className="modern-company-logo"
                                            src={
                                              job?.logo
                                                ? `${API_IMAGE_URL}${job.logo}`
                                                : "assets/images/dashboard/images1.png"
                                            }
                                          />
                                        </div>

                                        <div className="modern-company-details">
                                          <h4 className="modern-company-name">
                                            {job?.brandName}
                                          </h4>

                                          <span className="modern-post-date">
                                            <i className="fa-regular fa-clock me-1"></i>
                                            {moment(job?.createdAt).fromNow()}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Right Actions */}
                                      <div className="modern-job-actions">
                                        {/* Featured */}
                                        {job?.isFeatured && (
                                          <span
                                            className="modern-status-badge featured"
                                            style={{
                                              padding: "6px 12px",
                                              fontSize: "11px",
                                              borderRadius: "8px",
                                              marginRight: "8px",
                                            }}
                                          >
                                            <i className="fa-solid fa-star me-1"></i>
                                            {t("header.Featured")}
                                          </span>
                                        )}

                                        {/* Assessment */}
                                        {job?.isAssessmentRequired && (
                                          <span
                                            className="modern-status-badge assessment"
                                            style={{
                                              padding: "6px 12px",
                                              fontSize: "11px",
                                              borderRadius: "8px",
                                              marginRight: "8px",
                                            }}
                                          >
                                            {job?.assessmentResult?.status ===
                                            "passed"
                                              ? "Test Passed"
                                              : job?.assessmentResult
                                                    ?.status === "failed"
                                                ? "Test Failed"
                                                : t("header.Test_Required")}
                                          </span>
                                        )}

                                        {/* Save */}
                                        {/* <button
                                          className="modern-action-icon"
                                          title="Save Job"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSaveJob(job._id);
                                          }}
                                        >
                                          <i
                                            className={`fa-${
                                              job.isSaved ? "solid" : "regular"
                                            } fa-heart`}
                                          ></i>
                                        </button> */}
                                        <button
                                          className="modern-action-icon"
                                          title="Save Job"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            if (userRole !== "JobSeeker") {
                                              navigate("/login");
                                              return;
                                            }

                                            handleSaveJob(job._id);
                                          }}
                                        >
                                          <i
                                            className={`fa-${
                                              job.isSaved ? "solid" : "regular"
                                            } fa-heart`}
                                            style={{
                                              color: job?.isSaved
                                                ? "#ff0000"
                                                : "#65758a",
                                            }}
                                          ></i>
                                        </button>

                                        {/* Linkedin */}
                                        <button
                                          className="modern-action-icon"
                                          title="LinkedIn"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            window.open(
                                              job?.social_links?.linkedin ||
                                                "https://linkedin.com",
                                              "_blank",
                                            );
                                          }}
                                        >
                                          <i className="fa-brands fa-linkedin-in"></i>
                                        </button>
                                      </div>
                                    </div>

                                    {/* Body */}
                                    <div className="modern-job-body">
                                      <div className="modern-title-badge-area">
                                        <h3
                                          className="modern-job-title"
                                          style={{ cursor: "pointer" }}
                                        >
                                          {job?.jobTitle}
                                        </h3>
                                      </div>

                                      <p className="modern-job-description">
                                        {job?.shortDescription || "N/A"}
                                      </p>
                                    </div>

                                    {/* Meta */}
                                    <div className="modern-job-meta">
                                      <span className="modern-meta-tag">
                                        <i className="fa-regular fa-file me-1"></i>
                                        {job?.jobCategory?.length > 0
                                          ? job.jobCategory.join(", ")
                                          : "N/A"}
                                      </span>

                                      <span className="modern-meta-tag">
                                        <i className="fa-solid fa-signal me-1"></i>
                                        {job?.experienceLevel || "All Levels"}
                                      </span>

                                      <span className="modern-meta-tag">
                                        <i className="fa-regular fa-user me-1"></i>
                                        {Array.isArray(job?.employmentType) &&
                                        job.employmentType.length > 0
                                          ? job.employmentType.join(", ")
                                          : "N/A"}
                                      </span>

                                      <span className="modern-meta-tag">
                                        <i className="fa-solid fa-location-dot me-1"></i>
                                        {job?.city?.length > 0
                                          ? job.city.join(", ")
                                          : job?.company_city || "N/A"}
                                      </span>

                                      <span className="modern-meta-tag">
                                        <i
                                          className="fa-solid fa-house-laptop"
                                          style={{ "margin-right": "8px" }}
                                        />
                                        {job?.remote || "N/A"}
                                      </span>
                                    </div>

                                    {/* Footer */}
                                    <div className="modern-job-footer">
                                      <div className="modern-job-info-badges">
                                        <span className="modern-info-badge">
                                          <i className="fa-solid fa-briefcase me-1"></i>
                                          {job?.availablePosts || 0} position(s)
                                          disponible(s)
                                        </span>

                                        <span className="modern-info-badge">
                                          <i className="fa-solid fa-wallet me-1"></i>

                                          {job?.privatJobDetails
                                            ?.salaryNegotiable === true ? (
                                            "Salaire à négocier"
                                          ) : job?.privatJobDetails
                                              ?.minSalary ||
                                            job?.privatJobDetails?.maxSalary ? (
                                            <>
                                              {job?.privatJobDetails
                                                ?.minSalary || 0}{" "}
                                              -{" "}
                                              {job?.privatJobDetails
                                                ?.maxSalary || 0}{" "}
                                              {globalCurrency.code}
                                            </>
                                          ) : (
                                            "Salaire à négocier"
                                          )}
                                        </span>
                                      </div>

                                      <div className="modern-job-footer-actions">
                                        {job?.isApplied ? (
                                          <button
                                            className="modern-apply-btn"
                                            disabled
                                          >
                                            {job?.applicationStatus}
                                          </button>
                                        ) : job?.isAssessmentRequired ? (
                                          <Link
                                            to={`/job/${job.slug}`}
                                            state={{
                                              from: "/jobs",
                                              JobId: job._id,
                                            }}
                                            className="modern-apply-btn"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            View Details
                                          </Link>
                                        ) : (
                                          <button
                                            className="modern-apply-btn"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();

                                              if (userRole !== "JobSeeker") {
                                                navigate("/login");
                                                return;
                                              }

                                              setJobId(job._id);
                                              handleJobClick(job._id);

                                              const modalEl =
                                                document.getElementById(
                                                  "exampleModal",
                                                );
                                              if (modalEl) {
                                                const modal =
                                                  new window.bootstrap.Modal(
                                                    modalEl,
                                                  );
                                                modal.show();
                                              }
                                            }}
                                          >
                                            {t("header.apply_now")}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div
                                className="modal fade"
                                id="exampleModal"
                                tabIndex={-1}
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        {t("header.apply_now")}
                                      </h1>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={resetApplyModal}
                                      />
                                    </div>
                                    {/* NOTE: use className, not class */}
                                    <div className="modal-body">
                                      <div className="job-apply-defult-resume-custom-resume">
                                        <div
                                          className="job-apply-custom-resume-info-area"
                                          style={{
                                            display:
                                              Array.isArray(resumeList) &&
                                              resumeList.length > 0
                                                ? "block"
                                                : "none",
                                          }}
                                        >
                                          {Array.isArray(resumeList) &&
                                            resumeList.map((resume) => {
                                              const fileName = getFileName(
                                                resume.url,
                                              );
                                              return (
                                                <div
                                                  key={resume._id}
                                                  className={
                                                    "job-apply-custom-resume-info " +
                                                    (selectedResumeUrl ===
                                                    resume.url
                                                      ? "active"
                                                      : "")
                                                  }
                                                  onClick={() =>
                                                    handleSelect(
                                                      "resume",
                                                      resume.url,
                                                    )
                                                  }
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  <span className="file-name-text">
                                                    <i className="fa-solid fa-file" />{" "}
                                                    {fileName}
                                                  </span>
                                                  {selectedResumeUrl ===
                                                    resume.url && (
                                                    <i className="fa-solid fa-circle-check selected-check-icon" />
                                                  )}
                                                </div>
                                              );
                                            })}
                                        </div>

                                        <div
                                          className="defult-resume-custom-resume-divder-line"
                                          style={{
                                            display:
                                              Array.isArray(resumeList) &&
                                              resumeList.length > 0
                                                ? "block"
                                                : "none",
                                          }}
                                        >
                                          <h4>or</h4>
                                        </div>

                                        <div
                                          className="job-apply-custom-resume-info-area"
                                          style={{
                                            display:
                                              Array.isArray(coverLetterList) &&
                                              coverLetterList.length > 0
                                                ? "block"
                                                : "none",
                                          }}
                                        >
                                          {Array.isArray(coverLetterList) &&
                                            coverLetterList.map((cover) => {
                                              const fileName = getFileName(
                                                cover.url,
                                              );
                                              return (
                                                <div
                                                  key={cover._id}
                                                  className={
                                                    "job-apply-custom-resume-info " +
                                                    (selectedCoverLetterUrl ===
                                                    cover.url
                                                      ? "active"
                                                      : "")
                                                  }
                                                  onClick={() =>
                                                    handleSelect(
                                                      "cover",
                                                      cover.url,
                                                    )
                                                  }
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  <span className="file-name-text">
                                                    <i className="fa-solid fa-file" />{" "}
                                                    {fileName}
                                                  </span>
                                                  {selectedCoverLetterUrl ===
                                                    cover.url && (
                                                    <i className="fa-solid fa-circle-check selected-check-icon" />
                                                  )}
                                                </div>
                                              );
                                            })}
                                        </div>

                                        <div
                                          className="defult-resume-custom-resume-divder-line"
                                          style={{
                                            display:
                                              Array.isArray(coverLetterList) &&
                                              coverLetterList.length > 0
                                                ? "block"
                                                : "none",
                                          }}
                                        >
                                          <h4>{t("header.or")}</h4>
                                        </div>

                                        <div
                                          className="job-apply-custom-resume-info-area"
                                          style={{ display: "block" }}
                                        >
                                          <div
                                            style={{
                                              display: selectedCustomFile
                                                ? "block"
                                                : "none",
                                            }}
                                          >
                                            <div
                                              className={
                                                "job-apply-custom-resume-info " +
                                                (selectedCustomFile
                                                  ? "active"
                                                  : "")
                                              }
                                              style={{
                                                cursor: selectedCustomFile
                                                  ? "pointer"
                                                  : "default",
                                              }}
                                            >
                                              <span className="file-name-text">
                                                <i className="fa-solid fa-file" />{" "}
                                                {selectedCustomFile
                                                  ? selectedCustomFile.name
                                                  : ""}
                                              </span>
                                              {selectedCustomFile && (
                                                <i className="fa-solid fa-circle-check selected-check-icon" />
                                              )}
                                            </div>
                                          </div>

                                          <div
                                            className="job-apply-custom-resume-cover-letter-btn"
                                            style={{ marginTop: 12 }}
                                          >
                                            <a
                                              href="#"
                                              className="default-btn btn"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                if (
                                                  fileInputRef &&
                                                  fileInputRef.current
                                                )
                                                  fileInputRef.current.click();
                                              }}
                                            >
                                              {t(
                                                "header.Custom_resume_with_cover_letter",
                                              )}
                                            </a>
                                            <input
                                              ref={fileInputRef}
                                              type="file"
                                              accept=".pdf,.doc,.docx"
                                              onChange={handleFileUpload}
                                              style={{ display: "none" }}
                                            />
                                          </div>
                                        </div>

                                        {/* Divider before apply button (always keep in DOM) */}
                                        <div
                                          className="defult-resume-custom-resume-divder"
                                          style={{ marginTop: 16 }}
                                        />

                                        {/* APPLY BUTTON - always present */}
                                        <div
                                          className="job-apply-defult-resume-btn"
                                          style={{ marginTop: 12 }}
                                        >
                                          <button
                                            className="default-btn btn w-100"
                                            onClick={handleApplyJob}
                                            disabled={
                                              isApplying || !isSelectionMade()
                                            }
                                          >
                                            {isApplying ? (
                                              <>
                                                <span
                                                  className="spinner-border spinner-border-sm me-2"
                                                  role="status"
                                                  aria-hidden="true"
                                                ></span>
                                                {t("header.applying")}
                                              </>
                                            ) : (
                                              t("header.apply_now")
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    </div>{" "}
                                    {/* .modal-body */}
                                  </div>
                                </div>
                              </div>
                              {/* Show Swiper only if this chunk has 10 jobs */}
                              {chunk.length === 10 && (
                                <section className="modern-company-carousel-section">
                                  <div className="modern-carousel-content-wrapper">
                                    <h3 className="modern-carousel-title">
                                      Entreprises qui Recrutent
                                    </h3>
                                    <Swiper
                                      modules={[
                                        Navigation,
                                        SwiperPagination,
                                        Autoplay,
                                      ]}
                                      spaceBetween={24}
                                      slidesPerView={3} // ✅ default desktop 3 cards
                                      navigation
                                      autoplay={{ delay: 3000 }}
                                      loop={true}
                                      pagination={{
                                        clickable: true,
                                        dynamicBullets: true,
                                        dynamicMainBullets: 4, // controls how many dots are visible
                                      }}
                                      breakpoints={{
                                        320: { slidesPerView: 1 },
                                        576: { slidesPerView: 1.2 },
                                        768: { slidesPerView: 2 },
                                        992: { slidesPerView: 3 },
                                        1200: { slidesPerView: 3 }, // ✅ keep 3 on large screen
                                      }}
                                    >
                                      {companies?.companies?.length > 0 ? (
                                        companies.companies.map((item) => {
                                          const company = item?.companyId;
                                          const topThreeJobs =
                                            item?.jobList?.slice(0, 3) || [];
                                          const latestJob = topThreeJobs[0];

                                          return (
                                            <SwiperSlide key={company?._id}>
                                              <div
                                                className="modern-company-card"
                                                onClick={() =>
                                                  handleViewCompany(company)
                                                }
                                                style={{ cursor: "pointer" }}
                                              >
                                                {/* Cover */}
                                                <div className="modern-company-cover-container">
                                                  <img
                                                    alt={
                                                      company?.brandName ||
                                                      "Company"
                                                    }
                                                    className="modern-company-cover-img"
                                                    crossOrigin="anonymous"
                                                    src={
                                                      company?.coverPhoto
                                                        ? `${API_IMAGE_URL}${company.coverPhoto}`
                                                        : "/jobPortal/assets/images/company/company-img-1.jpg"
                                                    }
                                                  />

                                                  <div className="modern-company-cover-overlay"></div>

                                                  {/* Logo */}
                                                  <div className="modern-company-logo-badge">
                                                    <img
                                                      alt="logo"
                                                      crossOrigin="anonymous"
                                                      src={
                                                        company?.logo
                                                          ? `${API_IMAGE_URL}${company.logo}`
                                                          : "/jobPortal/assets/images/icon/icon-25.png"
                                                      }
                                                    />
                                                  </div>
                                                </div>

                                                {/* Content */}
                                                <div className="modern-company-content">
                                                  <div className="modern-company-header-row">
                                                    <h4 className="modern-company-card-name">
                                                      {company?.brandName ||
                                                        "Unnamed Company"}
                                                    </h4>

                                                    <span className="modern-job-count-badge">
                                                      {item?.jobCount || 0}{" "}
                                                      {t("header.Jobs")}
                                                    </span>
                                                  </div>

                                                  {/* Latest Job */}
                                                  <div className="modern-latest-job-info">
                                                    <span className="modern-latest-job-label">
                                                      {t("header.Latest_Job")}
                                                    </span>

                                                    {latestJob ? (
                                                      <Link
                                                        to={`/job/${latestJob.slug}`}
                                                        state={{
                                                          from: "/jobs-search",
                                                          JobId: latestJob._id,
                                                        }}
                                                        className="modern-one-job-link"
                                                        onClick={(e) =>
                                                          e.stopPropagation()
                                                        }
                                                      >
                                                        {latestJob.jobTitle}
                                                      </Link>
                                                    ) : (
                                                      <div
                                                        className="modern-one-job-link"
                                                        style={{
                                                          opacity: "0.6",
                                                        }}
                                                      >
                                                        <span>
                                                          {t(
                                                            "header.noJobsAvailable",
                                                          )}
                                                        </span>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </SwiperSlide>
                                          );
                                        })
                                      ) : (
                                        <p className="text-center mt-4">
                                          {t("header.no_companies")}
                                        </p>
                                      )}
                                    </Swiper>
                                  </div>
                                </section>
                              )}
                            </React.Fragment>
                          ))}
                        </>
                      ) : (
                        <p className="text-center mt-3">
                          {" "}
                          {t("header.no_jobs_found")}
                        </p>
                      )}
                    </div>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="center"
                      sx={{ mt: 3 }}
                    >
                      <Pagination
                        count={totalPages}
                        page={pageNumber}
                        onChange={(e, value) => setPageNumber(value)}
                        variant="outlined"
                        shape="rounded"
                        color="secondary"
                        siblingCount={2}
                        boundaryCount={1}
                      />

                      <Select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(e.target.value);
                          setPageNumber(1); // reset to page 1
                        }}
                        size="small"
                      >
                        <MenuItem value={15}>15 /{t("header.page")}</MenuItem>
                        <MenuItem value={25}>25 / {t("header.page")}</MenuItem>
                        <MenuItem value={50}>50 / {t("header.page")}</MenuItem>
                        <MenuItem value={100}>100 /{t("header.page")}</MenuItem>
                      </Select>
                    </Stack>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className="modal fade"
        id="exampleModal1"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog ">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {t("header.Notify_me_every")}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={resetAlertForm} // ✅ Reset on modal close
              />
            </div>
            <div className="modal-body">
              <div className="job-alert-condittion-select">
                {["1 day", "3 days", "week", "month", "Just save"].map(
                  (freq) => {
                    const labelText =
                      freq.charAt(0).toUpperCase() + freq.slice(1);
                    return (
                      <span key={freq} style={{ marginRight: "10px" }}>
                        <input
                          type="radio"
                          id={freq}
                          name="notifyFrequency"
                          value={freq} // API value stays same
                          checked={notifyEvery === freq}
                          onChange={(e) => setNotifyEvery(e.target.value)}
                        />
                        <label htmlFor={freq}>{labelText}</label>
                      </span>
                    );
                  },
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="default-btn btn"
                onClick={handleCreateAlert}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Alert"}
              </button>
              <button
                type="button"
                className="default-btn btn"
                data-bs-dismiss="modal"
                onClick={resetAlertForm}
              >
                {t("header.cancel_alert")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isPanelOpen && selectedJob && (
        <div className="side-panel-overlay open">
          <div className="side-panel-content">
            <div className="side-panel-header">
              <div className="header-company-info">
                <img
                  crossOrigin="anonymous"
                  alt="logo"
                  className="side-panel-logo"
                  src={
                    selectedJob?.logo
                      ? `${API_IMAGE_URL}${selectedJob.logo}`
                      : "assets/images/dashboard/images1.png"
                  }
                />
                <div>
                  <h2 className="side-panel-title">
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.jobTitle}
                      </font>
                    </font>
                  </h2>
                  <p className="side-panel-company-name">
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.brandName}
                      </font>
                    </font>
                  </p>
                </div>
              </div>
              <button className="close-btn">
                <svg
                  stroke="currentColor"
                  onClick={() => setIsPanelOpen(false)}
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
              <div className="side-panel-meta-grid">
                <div className="meta-item">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z" />
                    <circle cx={12} cy={9} r="2.5" />
                  </svg>
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.city?.length > 0
                          ? selectedJob.city.join(", ")
                          : selectedJob?.company_city || "N/A"}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M14 6V4h-4v2h4zM4 8v11h16V8H4zm16-2c1.11 0 2 .89 2 2v11c0 1.11-.89 2-2 2H4c-1.11 0-2-.89-2-2l.01-11c0-1.11.88-2 1.99-2h4V4c0-1.11.89-2 2-2h4c1.11 0 2 .89 2 2v2h4z" />
                  </svg>
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {Array.isArray(selectedJob?.jobCategory) &&
                        selectedJob.jobCategory.length > 0
                          ? selectedJob.jobCategory.join(", ")
                          : "N/A"}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                  </svg>
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.minimumLevel || "N/A"}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z" />
                  </svg>
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {Array.isArray(selectedJob?.employmentType) &&
                        selectedJob.employmentType.length > 0
                          ? selectedJob.employmentType.join(", ")
                          : "N/A"}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item">
                  <i className="fa-solid fa-house-laptop" />
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.remote
                          ? typeof selectedJob.remote === "string"
                            ? selectedJob.remote
                            : selectedJob.remote.name
                          : "N/A"}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item highlight">
                  <i className="fa-solid fa-wallet" />
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.privatJobDetails?.salaryNegotiable ===
                        true ? (
                          "Salaire à négocier"
                        ) : selectedJob?.privatJobDetails?.minSalary ||
                          selectedJob?.privatJobDetails?.maxSalary ? (
                          <>
                            {selectedJob?.privatJobDetails?.minSalary || 0} -{" "}
                            {selectedJob?.privatJobDetails?.maxSalary || 0}{" "}
                            {globalCurrency.code}
                          </>
                        ) : (
                          "Salaire à négocier"
                        )}
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item">
                  <i className="fa-solid fa-users" />
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {" "}
                        {selectedJob?.availablePosts || 0} position(s)
                        disponible(s)
                      </font>
                    </font>
                  </span>
                </div>
                <div className="meta-item">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                  <span>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        Published{" "}
                      </font>
                    </font>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {moment(selectedJob?.createdAt).fromNow()}
                      </font>
                    </font>
                  </span>
                </div>
              </div>
              <div className="side-panel-description">
                <div className="side-panel-tags mb-4">
                  <h4 className="mb-2">
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        Tags
                      </font>
                    </font>
                  </h4>
                  <div className="modern-tag-list">
                    {Array.isArray(selectedJob?.tags) &&
                    selectedJob.tags.length > 0 ? (
                      selectedJob.tags.map((tag, index) => (
                        <span key={index} className="modern-job-tag">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">No tags available</span>
                    )}
                  </div>
                </div>
                <h4>
                  <font dir="auto" style={{ "vertical-align": "inherit" }}>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      Description of the offer
                    </font>
                  </font>
                </h4>
                <div>
                  <p>
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        {selectedJob?.shortDescription || "N/A"}
                      </font>
                    </font>
                  </p>
                </div>
              </div>
            </div>
            <div className="side-panel-footer">
              {selectedJob?.isApplied ? (
                // 🔒 Already Applied
                <button className="modern-apply-btn w-100" disabled>
                  {selectedJob?.applicationStatus || "Applied"}
                </button>
              ) : !selectedJob?.isAssessmentRequired ? (
                // ✅ Normal Apply (NO assessment)
                <button
                  className="modern-apply-btn w-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setIsPanelOpen(false);

                    if (userRole !== "JobSeeker") {
                      navigate("/login");
                      return;
                    }

                    setJobId(selectedJob._id);
                    handleJobClick(selectedJob._id);
                    setIsPanelOpen(true);
                    const modalEl = document.getElementById("exampleModal");
                    if (modalEl) {
                      const modal = new window.bootstrap.Modal(modalEl);
                      modal.show();
                    }
                  }}
                >
                  {t("header.apply_now")}
                </button>
              ) : null}

              <Link
                to={`/job/${selectedJob.slug}`}
                state={{
                  from: "/jobs",
                  JobId: selectedJob._id,
                }}
                className="modern-orange-btn"
                onClick={() => setIsPanelOpen(false)}
              >
                <font dir="auto" style={{ "vertical-align": "inherit" }}>
                  <font dir="auto" style={{ "vertical-align": "inherit" }}>
                    View the offer
                  </font>
                </font>
              </Link>
              <ul className="side-panel-social-sharing">
                {/* 🔗 COPY LINK */}
                <li style={{ position: "relative" }}>
                  <a
                    href="#"
                    className="side-panel-social-link"
                    onClick={(e) => handleCopy(e, selectedJob?.linkUrl)}
                    title={
                      selectedJob?.jobLink ? "Copy link" : "Link not available"
                    }
                    style={{
                      cursor: selectedJob?.jobLink ? "pointer" : "not-allowed",
                    }}
                  >
                    <i className="fa-solid fa-link" />
                  </a>

                  {copied && <span className="copy-tooltip">Copied!</span>}
                </li>

                {/* ❤️ SAVE JOB */}
                <li>
                  <a
                    href="#"
                    className="side-panel-social-link"
                    title="Save"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (userRole !== "JobSeeker") {
                        navigate("/login");
                        return;
                      }

                      handleSaveJob(selectedJob._id);
                    }}
                  >
                    <i
                      className={`fa-${
                        selectedJob?.isSaved ? "solid" : "regular"
                      } fa-heart`}
                      style={{
                        color: selectedJob?.isSaved ? "#ff0000" : "#65758a",
                      }}
                    />
                  </a>
                </li>

                {/* LINKEDIN */}
                <li>
                  <a
                    href={
                      selectedJob?.social_links?.linkedin ||
                      "https://www.linkedin.com/"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="side-panel-social-link linkedin"
                  >
                    <i className="fa-brands fa-linkedin-in" />
                  </a>
                </li>

                {/* FACEBOOK */}
                <li>
                  <a
                    href={
                      selectedJob?.social_links?.facebook ||
                      "https://www.facebook.com/"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="side-panel-social-link facebook"
                  >
                    <i className="fa-brands fa-facebook-f" />
                  </a>
                </li>

                {/* TWITTER */}
                <li>
                  <a
                    href={
                      selectedJob?.social_links?.twitter ||
                      "https://twitter.com/"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="side-panel-social-link twitter"
                  >
                    <i className="fa-brands fa-x-twitter" />
                  </a>
                </li>

                {/* INSTAGRAM */}
                <li>
                  <a
                    href={
                      selectedJob?.social_links?.instagram ||
                      "https://www.instagram.com/"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="side-panel-social-link instagram"
                  >
                    <i className="fa-brands fa-instagram" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobList;
