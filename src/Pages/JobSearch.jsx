import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
// import axios from "../utils/axiosInstance"
import axios from "axios";
import moment from "moment";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { ToastContainer, toast } from "react-toastify";
import {
  Navigation,
  Pagination as SwiperPagination,
  Autoplay,
} from "swiper/modules";
import Pagination from "@mui/material/Pagination"; // MUI one
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "swiper/css/pagination";
import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function JobSearch() {
  const location = useLocation();
  const { t, i18n } = useTranslation("global");
  const { alert } = location.state || {};
  const userRole = localStorage.getItem("user_role");
  const userId = localStorage.getItem("user_id");
  const [selectedCustomFile, setSelectedCustomFile] = useState(null);
  console.log("Received Alert Data:", alert);
  const [resumeList, setResumeList] = useState([]);
  const [globalCurrency, setGlobalCurrency] = useState({
    code: "MAD",
    symbol: "DH",
  });
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [coverLetterList, setCoverLetterList] = useState([]);
  const [showAlertOptions, setShowAlertOptions] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const fileInputRef = useRef(null);
  const [jobId, setJobId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [notifyEvery, setNotifyEvery] = useState("1 day");
  const [loading, setLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [alertCreated, setAlertCreated] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
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

        // update form state also
        setCareerGoalsData((prev) => ({
          ...prev,
          salaryCurrency: currencyCode,
          TJMCurrency: currencyCode,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGlobalCurrency();
  }, []);
  // Loading state for city suggestions
  const [isLocationLoading, setIsLocationLoading] = useState(false);
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

  useEffect(() => {
    const fetchResume = async () => {
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
    };
    fetchResume();
  }, []);
  const handleSelect = (type, id = null) => {
    setSelectedType(type);
    setSelectedId(id);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCustomFile(file);
      setSelectedType("custom");
      setSelectedId(null);
    }
  };

  const getFileName = (url) => {
    return url?.split("/").pop();
  };

  const handleLinkClick = (e) => {
    e.preventDefault(); // prevent navigation
    fileInputRef.current.click(); // open file dialog
  };

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

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const handleApplyJob = async () => {
    if (!jobId) {
      console.error("❌ jobId is missing");
      return;
    }

    // ✅ VALIDATION: Ensure one of the three options is selected
    if (
      selectedType === "resume" &&
      !selectedId &&
      selectedType === "cover" &&
      !selectedId &&
      selectedType === "custom" &&
      !selectedCustomFile
    ) {
      toast.error(
        "Please select a resume, cover letter, or upload a custom file.",
        {
          autoClose: 2000,
          theme: "colored",
        },
      );
      return; // stop here
    }

    setIsApplying(true); // 🔥 Start loader

    const formData = new FormData();

    if (selectedType === "resume") {
      formData.append("cv", selectedId);
    } else if (selectedType === "cover") {
      formData.append("coverLetter", selectedId);
    } else if (selectedType === "custom") {
      const file = selectedCustomFile;

      if (!file) {
        toast.error("Please select a custom file.", {
          autoClose: 2000,
          theme: "colored",
        });
        setIsApplying(false);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("Uploaded file is too large. Max size is 2MB.", {
          autoClose: 2000,
          theme: "colored",
        });
        setIsApplying(false);
        return;
      }

      formData.append("customResume", file);
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

      const modal = document.getElementById("exampleModal");
      if (modal) {
        const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
        bootstrapModal?.hide();
      }
    } catch (error) {
      console.error("Apply job error:", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message, {
          autoClose: 2000,
          theme: "colored",
        });
      } else if (
        error?.response?.status === 413 ||
        error?.message?.includes("413")
      ) {
        toast.error("Uploaded file is too large. Max size is 2MB.", {
          autoClose: 2000,
          theme: "colored",
        });
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsApplying(false); // 🔥 Stop loader
    }
  };

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
    // 1️⃣ Remove from appliedFilters
    const updatedAppliedFilters = { ...appliedFilters };
    delete updatedAppliedFilters[key];
    setAppliedFilters(updatedAppliedFilters);

    // 2️⃣ Clear the corresponding field in filters
    const updatedFilters = { ...filters, [key]: "" };
    setFilters(updatedFilters);

    // 3️⃣ Call API with updated filters directly
    getAllJobList(
      pageSize, // limit
      pageNumber, // page
      selectedJobTypes, // ✅ jobTypes
      selectedSeniority, // ✅ experience / seniority
      selectedTechStacks, // ✅ techStacks
      selectedCategories, // ✅ categories
      selectedCompanies, // ✅ companies
      selected, // ✅ industries
      updatedFilters.keywords, // ✅ keywords
      updatedFilters.location, // ✅ location
      updatedFilters.category, // ✅ category
      selectedLocations.map((l) => l.name).join(","), // ✅ Filterlocation
      selectedSalaryRanges, // ✅ salary_range
    );
  };

  // Clear all filters
  const handleClearSalaryFilters = () => {
    setSelectedSalaryRanges([]);

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
      selectedLocations.map((l) => l.name).join(","), // ✅ still keep locations
      [], // ✅ cleared salary ranges
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

      toast.success("Job Alert created successfully!");
    } catch (error) {
      console.error("❌ Error creating job alert:", error.response || error);
      toast.error(
        error?.response?.data?.message || "Failed to create job alert.",
      );
    } finally {
      setLoading(false);
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

      console.log("✅ API Response:", res.data);

      if (res.data.success) {
        const { message } = res.data;

        // ✅ Toggle locally without refetch
        // setJobList((prevJobs) =>
        //   prevJobs.map((job) =>
        //     job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        //   )
        // );
        getAllJobList();
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
      console.error("❌ Save/Unsave error:", err);
      toast.error(err.response?.data?.message || "Server error. Try again!");
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
  const getCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getJobCategory`);
      console.log(res);
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
    fetchCompanies(companySearchTerm); // call API with search term
  }, [companySearchTerm]);
  const formatSalaryRanges = (ranges = []) => {
    return ranges.map(
      (range) =>
        range
          .replace(/\$/g, "") // remove $
          .replace(/\s+/g, "") // remove spaces
          .replace("-", "-"), // keep dash
    );
  };

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
      };

      if (locationFilter) params.Filterlocation = locationFilter;
      if (salaryRangesAPI.length > 0) {
        const formattedSalaryRanges = formatSalaryRanges(salaryRangesAPI);
        params.salary_range = formattedSalaryRanges.join(",");
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

  useEffect(() => {
    fetchCompanies(companySearchTerm);
  }, [companySearchTerm]);

  const totalPages = totalJobData?.totalPages;
  const jobChunks = [];
  for (let i = 0; i < jobList.length; i += 10) {
    jobChunks.push(jobList.slice(i, i + 10));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // build visible filter tags
    const newFilters = {};
    if (filters.keywords) newFilters.keywords = filters.keywords;
    if (filters.location) newFilters.location = filters.location;
    if (filters.category) {
      const selectedCat = categories.find((c) => c._id === filters.category);
      if (selectedCat) {
        newFilters.category = {
          id: selectedCat._id, // ✅ use this for API
          name: selectedCat.name, // ✅ use this for UI
        };
      }
    }

    setAppliedFilters(newFilters);

    // ✅ now call the API with latest filters
    getAllJobList();
  };
  useEffect(() => {
    getCategories();
    getAllJobList(pageSize, pageNumber);
  }, [pageNumber, pageSize]);
  const resetApplyModal = () => {
    setSelectedType("");
    setSelectedId(null);
    setSelectedCustomFile(null);
    setIsApplying(false);

    // reset file input
    if (fileInputRef?.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearAll = () => {
    const clearedIndustries = [];
    setSelected(clearedIndustries);

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      selectedTechStacks,
      selectedCategories,
      selectedCompanies,
      clearedIndustries,
      filters.keywords,
      filters.location,
      filters.category,
      selectedLocations.map((l) => l.name).join(","),
      selectedSalaryRanges,
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
    setSelectedJobTypes([]);

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
    setSelectedSeniority([]);

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
  const isSelectionMade = () => {
    return (
      (selectedType === "resume" && selectedId) ||
      (selectedType === "cover" && selectedId) ||
      (selectedType === "custom" && selectedCustomFile)
    );
  };

  const handleClearTechStacks = () => {
    setSelectedTechStacks([]);
    setSearchTech("");

    getAllJobList(
      pageSize,
      pageNumber,
      selectedJobTypes,
      selectedSeniority,
      [], // cleared tech stacks
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
  console.log(alertCreated, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
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

  const handleViewCompany = (company) => {
    navigate("/companies-details", {
      state: { companyId: company }, // 👈 send ID as prop-like data
    });
  };
  const JobListLoader = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p>Loading jobs, please wait...</p>
    </div>
  );
  const hasAnyFilter =
    selectedJobTypes.length > 0 ||
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
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Job Search</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/candidate-dashboard" style={{ marginLeft: 6 }}>
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>{" "}
              </li>
              <li className="item">
                <Link to="/job-search">
                  <i className="fa-solid fa-angle-right" />
                  Job Search
                </Link>
              </li>
            </ol>
          </div>

          <div className="manage-jobs-box">
            <div className="job-listing-search-form job-search-info-area">
              <form onSubmit={handleSubmit}>
                <div className="row g-0">
                  <div className="col-lg-7 col-sm-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Keywords / Job Title"
                        value={filters.keywords}
                        onChange={(e) =>
                          setFilters({ ...filters, keywords: e.target.value })
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
                        placeholder="City Or Postcode"
                        value={filters.location}
                        onChange={(e) =>
                          setFilters({ ...filters, location: e.target.value })
                        }
                      />
                      <i className="flaticon-location" />
                    </div>
                  </div>

                  <div className="col-lg-2 col-sm-6">
                    <div className="search-btn">
                      <button type="submit" className="default-btn btn">
                        Find Jobs
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="job-filter-job-list-info">
            <div className="container">
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
                            <i className="fa fa-angle-up" aria-hidden="true" />
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
                            {t("header.job_type")}
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
                                  checked={selectedJobTypes.includes(type._id)} // ✅ check by ID
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
                            <i className="fa-solid fa-location-dot" />{" "}
                            {t("header.Location")}
                          </h4>
                        </div>
                        <div className="job-filter-cancel-heading">
                          <h4
                            style={{ cursor: "pointer" }}
                            onClick={handleClearLocations} // clear all selected locations
                          >
                            {t("header.Clear")}
                          </h4>
                        </div>
                      </div>

                      <div className="job-filter-select-info">
                        <div className="job-filter-select-location">
                          <input
                            className="form-control"
                            type="search"
                            placeholder="Search Location"
                            value={locationSearchTerm}
                            onChange={handleLocationSearch}
                          />

                          {/* Suggestions dropdown */}
                          {isLocationLoading && (
                            <div className="suggestion-box">
                              {" "}
                              {t("header.searching")}...
                            </div>
                          )}

                          {!isLocationLoading &&
                            locationSuggestions.length > 0 && (
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
                                    {city.name}, {city.state_name},{" "}
                                    {city.country_name}
                                  </li>
                                ))}
                              </ul>
                            )}

                          {/* Selected locations */}
                        </div>
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
                                checked={selectedSeniority.includes(level._id)} // ✅ Compare by ID
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
                            <i className="fa fa-angle-up" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="divder-line-info" />
                    <div className="modern-filter-section" ref={wrapperRef}>
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fas fa-building" />
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

                      <div className="job-filter-select-info">
                        <div className="multi-select-container">
                          <div
                            className="selected-items"
                            onClick={() => setShowOptions(true)}
                          >
                            {/* Show first 2 selected industries and +X more if any */}
                            {selected?.map((industry) => (
                              <span key={industry._id} className="tag">
                                {industry.name}
                                <i
                                  className="fa-solid fa-xmark"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "6px",
                                  }}
                                  onClick={() => removeTag(industry._id)}
                                />
                              </span>
                            ))}
                            <input
                              type="text"
                              placeholder={t("header.Search_industries")}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onFocus={() => setShowOptions(true)}
                            />
                          </div>

                          {showOptions && (
                            <ul className="options-list">
                              {filteredOptions.length > 0 ? (
                                filteredOptions.map((industry) => (
                                  <li
                                    key={industry._id}
                                    onClick={() => toggleOption(industry)}
                                    className={
                                      selected.some(
                                        (i) => i._id === industry._id,
                                      )
                                        ? "selected"
                                        : ""
                                    }
                                  >
                                    {industry.name}
                                    {selected.some(
                                      (i) => i._id === industry._id,
                                    ) && <span className="checkmark">✔</span>}
                                  </li>
                                ))
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
                    <div className="divder-line-info" />
                    <div
                      className="modern-filter-section"
                      ref={companyContainerRef}
                    >
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

                      <div className="job-filter-select-info">
                        <div className="multi-select-container">
                          <div className="selected-items">
                            {selectedCompanies.map((company) => (
                              <div key={company._id} className="tag">
                                <span>{company.brandName}</span>
                                <span
                                  className="remove-tag"
                                  onClick={() =>
                                    handleRemoveCompany(company._id)
                                  }
                                >
                                  ×
                                </span>
                              </div>
                            ))}

                            <input
                              type="text"
                              placeholder={t("header.Search_Company")}
                              value={companySearchTerm}
                              onChange={(e) =>
                                setCompanySearchTerm(e.target.value)
                              }
                              onFocus={() => setShowCompanyDropdown(true)}
                            />
                          </div>

                          {showCompanyDropdown && (
                            <ul className="options-list">
                              {filteredCompanyOptions.length > 0 ? (
                                filteredCompanyOptions.map((company) => (
                                  <li
                                    key={company._id}
                                    onClick={() => handleSelectCompany(company)}
                                  >
                                    {company.brandName}
                                  </li>
                                ))
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
                        {Object.entries(appliedFilters).map(([key, value]) => (
                          <span key={key} className="modern-filter-pill">
                            {typeof value === "object" ? value.name : value}

                            <i
                              className="fa-solid fa-xmark"
                              onClick={() => handleRemoveFilterJob(key)}
                            ></i>
                          </span>
                        ))}

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
                              <Link
                                key={job._id}
                                to={`/job-details/${job._id}`}
                                state={{ from: "/jobs" }}
                                className="job-link text-decoration-none"
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
                                            : job?.assessmentResult?.status ===
                                                "failed"
                                              ? "Test Failed"
                                              : t("header.Test_Required")}
                                        </span>
                                      )}

                                      {/* Save */}
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
                                      {job?.jobCategory || "N/A"}
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
                                  </div>

                                  {/* Footer */}
                                  <div className="modern-job-footer">
                                    <div className="modern-job-info-badges">
                                      <span className="modern-info-badge">
                                        <i className="fa-solid fa-briefcase me-1"></i>
                                        {job?.availablePosts || 0} Position(s)
                                      </span>

                                      <span className="modern-info-badge">
                                        <i className="fa-solid fa-wallet me-1"></i>

                                        {job?.privatJobDetails
                                          ?.salaryNegotiable === true ? (
                                          "Salaire à négocier"
                                        ) : job?.privatJobDetails?.minSalary ||
                                          job?.privatJobDetails?.maxSalary ? (
                                          <>
                                            {job?.privatJobDetails?.minSalary ||
                                              0}{" "}
                                            -{" "}
                                            {job?.privatJobDetails?.maxSalary ||
                                              0}{" "}
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
                                        <button className="modern-apply-btn">
                                          {t("header.View_Details")}
                                        </button>
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
                              </Link>
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
                                      {/* RESUME LIST - inline hide */}
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
                                                  (selectedType === "resume" &&
                                                  selectedId === resume.url
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

                                                {selectedType === "resume" &&
                                                  selectedId === resume.url && (
                                                    <i className="fa-solid fa-circle-check selected-check-icon" />
                                                  )}
                                              </div>
                                            );
                                          })}
                                      </div>

                                      {/* OR DIVIDER for resume - inline hide */}
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

                                      {/* COVER LETTER LIST - inline hide */}
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
                                                  (selectedType === "cover" &&
                                                  selectedId === cover.url
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

                                                {selectedType === "cover" &&
                                                  selectedId === cover.url && (
                                                    <i className="fa-solid fa-circle-check selected-check-icon" />
                                                  )}
                                              </div>
                                            );
                                          })}
                                      </div>

                                      {/* OR DIVIDER for cover - inline hide */}
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

                                      {/* CUSTOM FILE SECTION (show only if user uploaded file or always show upload button) */}
                                      <div
                                        className="job-apply-custom-resume-info-area"
                                        style={{ display: "block" }}
                                      >
                                        {/* Show selected custom file if exists */}
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
                                              (selectedType === "custom"
                                                ? "active"
                                                : "")
                                            }
                                            onClick={() =>
                                              selectedCustomFile &&
                                              handleSelect("custom")
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

                                            {selectedType === "custom" && (
                                              <i className="fa-solid fa-circle-check selected-check-icon" />
                                            )}
                                          </div>
                                        </div>

                                        {/* Upload Button — prevent default and open file input */}
                                        <div
                                          className="job-apply-custom-resume-cover-letter-btn"
                                          style={{ marginTop: 12 }}
                                        >
                                          <a
                                            href="#"
                                            className="default-btn btn"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              // ensure fileInputRef.current exists
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
                                                handleViewCompany(company?._id)
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
                                                      to={`/job-details/${latestJob._id}`}
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
        {/* <Outlet /> */}
      </div>
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
                Notify me every
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
                Cancel Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobSearch;
