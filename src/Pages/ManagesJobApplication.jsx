import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination"; // MUI one
import "./ManagesJobApplicationModern.css";
import Swal from "sweetalert2";
function ManagesJobApplication() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedNotify, setSelectedNotify] = useState({});
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);
  const [filter, setFilter] = useState("all");
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [selectedRemote, setSelectedRemote] = useState([]);
  const [remoteOptions, setRemoteOptions] = useState([]);
  const [jobTypes, setJobTypes] = useState([]); // 🔹 dynamic data
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [alertName, setAlertName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [searchText, setSearchText] = useState("");
  const [notifyEvery, setNotifyEvery] = useState("1 day");
  const [endDate, setEndDate] = useState("");
  const [applications, setApplications] = useState([]);
  const [seniorityLevels, setSeniorityLevels] = useState([]);
    const [profileData, setProfileData] = useState(null);
  const [selectedSeniority, setSelectedSeniority] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // 🔹 new state for filter
  const [companies, setCompanies] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const token = localStorage.getItem("token"); // 🔹 assuming JWT is stored here
  const [jobAlerts, setJobAlerts] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const industryDropdownRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [selectedTechStacks, setSelectedTechStacks] = useState([]);
  useEffect(() => {
    const fetchStrength = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}profile/strength`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Dashboard Profile Strength", response.data);
        setProfileData(response.data);
      } catch (err) {
        console.error("Error Fetching Profile Strength:", err);
      }
    };
    fetchStrength();
  }, []);
  useEffect(() => {
    getCategories();
  }, []);

  const handleTechStackChange = (categoryId) => {
    setSelectedTechStacks((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        industryDropdownRef.current &&
        !industryDropdownRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchIndustries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getIndustries`);

      if (res.data.success && Array.isArray(res.data.industries)) {
        setOptions(res.data.industries);
      }
    } catch (err) {
      console.error("Error fetching industries:", err);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const filteredOptions = options.filter((industry) =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleOption = (industry) => {
    const alreadySelected = selected.find((i) => i._id === industry._id);

    if (alreadySelected) {
      setSelected(selected.filter((i) => i._id !== industry._id));
    } else {
      setSelected([...selected, industry]);
    }

    setSearchTerm("");
  };

  const removeTag = (id) => {
    setSelected(selected.filter((industry) => industry._id !== id));
  };
  const handleSelectCompany = (company) => {
    const alreadySelected = selectedCompanies.find(
      (c) => c._id === company._id,
    );

    if (!alreadySelected) {
      setSelectedCompanies([...selectedCompanies, company]);
    }

    setCompanySearchTerm("");
  };

  const handleRemoveCompany = (id) => {
    setSelectedCompanies(
      selectedCompanies.filter((company) => company._id !== id),
    );
  };

  const fetchCompanies = async (search = "") => {
    try {
      const res = await axios.get(`${API_BASE_URL}getCompanyList`, {
        params: { search },
      });

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
    fetchCompanies(companySearchTerm);
  }, [companySearchTerm]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCompanyDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // const queryParams = new URLSearchParams(location.search);
  // const defaultTab = queryParams.get("tab") || "applications";
  const handleSalaryChange = (e) => {
    const { value, checked } = e.target;

    setSelectedSalaryRanges((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    );
  };
  useEffect(() => {
    getSalaryRanges();
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
  useEffect(() => {
    fetchRemoteOptions();
    getCategories();
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
  const getCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getJobCategory`);

      setCategories(res.data.jobCategories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const statusOptions = [
    {
      label: "All statuses",
      value: "",
    },
    {
      label: "Application received",
      value: "Applied",
    },
    {
      label: "Shortlisted",
      value: "Shortlisted",
    },
    {
      label: "Contacted",
      value: "Contacted",
    },
    {
      label: "HR Interview",
      value: "HR Interview",
    },
    {
      label: "Technical maintenance",
      value: "Technical maintenance",
    },
    {
      label: "Offer sent",
      value: "Offer sent",
    },
    {
      label: "Recruited",
      value: "Recruited",
    },
    {
      label: "Rejected",
      value: "Rejected",
    },
    {
      label: "Application withdrawn",
      value: "Withdrawn",
    },
  ];
  const statusConfig = {
    Applied: {
      label: "Application received",
      background: "#dbeafe",
      color: "#2563eb",
    },

    Shortlisted: {
      label: "Shortlisted",
      background: "#ede9fe",
      color: "#7c3aed",
    },

    Contacted: {
      label: "Contacted",
      background: "#fef3c7",
      color: "#d97706",
    },

    "HR Interview": {
      label: "HR Interview",
      background: "#cffafe",
      color: "#0891b2",
    },

    "Technical maintenance": {
      label: "Technical maintenance",
      background: "#fde68a",
      color: "#b45309",
    },

    "Offer sent": {
      label: "Offer sent",
      background: "#dcfce7",
      color: "#16a34a",
    },

    Recruited: {
      label: "Recruited",
      background: "#bbf7d0",
      color: "#15803d",
    },

    Rejected: {
      label: "Rejected",
      background: "#fee2e2",
      color: "#dc2626",
    },

    Withdrawn: {
      label: "Application withdrawn",
      background: "#e5e7eb",
      color: "#4b5563",
    },
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [consent, setConsent] = useState(false);
  const [activeTab, setActiveTab] = useState("applications");
  const handleWithdrawClick = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setReason("");
    setComments("");
    setConsent(false);
  };

  // Handle Withdraw Submit
  const handleWithdrawSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}withdrawJobApplication`,
        {
          applicationId: selectedApplicationId,
          reason,
          comments,
          consent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Close Bootstrap modal safely
      const modalEl = document.getElementById("exampleModal");
      if (modalEl) {
        const modalInstance =
          window.bootstrap.Modal.getInstance(modalEl) ||
          new window.bootstrap.Modal(modalEl);
        modalInstance.hide();
      }

      toast.success(
        res?.data?.message || "Application withdrawn successfully!",
      );

      if (activeTab === "saved-jobs") {
        fetchSavedJobs();
      } else if (activeTab === "applications") {
        fetchApplications();
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to withdraw application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // read query param ?tab=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/manage-job-application?tab=${tab}`);
  };
  // ================= FETCH API =================
  const fetchInterestedCompanies = async (
    selectedFilter = filter,
    start = startDate,
    end = endDate,
  ) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      let url = `${API_BASE_URL}getInterestedCompanies?filter=${selectedFilter}`;

      if (selectedFilter === "custom" && start && end) {
        url += `&startDate=${start}&endDate=${end}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompanies(response?.data?.views || []);
    } catch (error) {
      console.log(error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchInterestedCompanies("all");
  }, []);

  // ================= FILTER CLICK =================
  const handleFilter = (type) => {
    setFilter(type);

    if (type !== "custom") {
      fetchInterestedCompanies(type);
    }
  };

  // ================= CUSTOM SEARCH =================
  const handleCustomFilter = () => {
    if (!startDate || !endDate) return;

    fetchInterestedCompanies("custom", startDate, endDate);
  };
  useEffect(() => {
    if (activeTab === "saved-jobs") {
      fetchSavedJobs();
    } else if (activeTab === "applications") {
      fetchApplications();
    }
  }, [activeTab]);
  // 🔹 Initial fetch based on active tab
  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications(statusFilter);
    }
  }, [activeTab]);

  // 🔹 Fetch again whenever filter changes
  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications(statusFilter);
    }
  }, [statusFilter]);

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
        fetchSavedJobs();
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

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}savedJobList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setSavedJobs(res.data.savedJobs || []);
      } else {
        toast.error(res.data.message || "Failed to load saved jobs");
      }
    } catch (error) {
      console.error("❌ Error fetching saved jobs:", error);
      toast.error("Error fetching saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (status = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}getJobSeekerApplications`, {
        headers: { Authorization: `Bearer ${token}` },
        params: status ? { status } : {}, // ✅ pass status only if not empty
      });

      if (res.data.success) {
        setApplications(res.data.applications || []);
      } else {
        toast.error(res.data.message || "Failed to load applications");
      }
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      toast.error("Error fetching applications");
    } finally {
      setLoading(false);
    }
  };
  const filteredApplications = applications.filter((app) => {
    const jobTitle = app?.jobId?.jobTitle?.toLowerCase() || "";
    const company = app?.jobId?.companyId?.brandName?.toLowerCase() || "";
    const search = searchText.toLowerCase();

    return jobTitle.includes(search) || company.includes(search);
  });
  useEffect(() => {
    const selectedIndustryIds = selected.map((i) => i._id);
  }, [pageNumber, pageSize, selected]);

  const handleViewCompany = (company, from) => {
    navigate(`/${company.slug}`, {
      state: { companyId: company._id, from },
    });
  };

  const totalPages = companies?.totalPages;

  useEffect(() => {
    if (activeTab === "job-alerts") {
      fetchJobAlerts();
    }
  }, [activeTab]);

  // ✅ Fetch all saved job alerts
  const fetchJobAlerts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}getSavedJobAlert`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setJobAlerts(res.data.savedJobs || []);
      } else {
        toast.error(res.data.message || "Failed to load job alerts");
      }
    } catch (error) {
      console.error("❌ Error fetching job alerts:", error);
      toast.error("Error fetching job alerts");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle status (for switch)
  const handleToggleStatus = async (alertId, newStatus) => {
    const isDisabling = newStatus === "Inactive";

    // Show confirmation only when disabling
    if (isDisabling) {
      const result = await Swal.fire({
        title: "Disable the alert?",
        text: "You will no longer receive notifications for this alert.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, disable",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}updateJobAlert`,
        {
          alertId,
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        toast.success("Alert status updated successfully!");

        setJobAlerts((prev) =>
          prev.map((a) =>
            a._id === alertId ? { ...a, status: newStatus } : a,
          ),
        );
      } else {
        toast.error(res.data.message || "Failed to update alert");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating alert");
    }
  };

  const handleUpdateAlert = async (
    alertId,
    notifyEvery = null,
    status = null,
  ) => {
    try {
      const payload = { alertId };
      if (notifyEvery !== null) payload.notifyEvery = notifyEvery;
      if (status !== null) payload.status = status;

      const res = await axios.post(`${API_BASE_URL}updateJobAlert`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const modal = document.getElementById(`editAlertModal-${alertId}`);
        if (modal) {
          const bsModal = window.bootstrap.Modal.getInstance(modal);
          if (bsModal) {
            bsModal.hide();
          }
        }
        toast.success("Job alert updated successfully!");
        fetchJobAlerts();
      } else {
        toast.error(res.data.message || "Failed to update alert");
      }
    } catch (err) {
      console.error("❌ Error updating alert:", err);
      toast.error("Error updating alert");
    }
  };

  // Delete alert
  const handleDeleteAlert = async (alertId) => {
    const result = await Swal.fire({
      title: "Delete the alert?",
      text: "This action is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}deleteJobAlert`,
        { alertId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        toast.success("Alert deleted successfully!");

        setJobAlerts((prev) => prev.filter((a) => a._id !== alertId));
      } else {
        toast.error(res.data.message || "Failed to delete alert");
      }
    } catch (err) {
      console.error("❌ Error deleting alert:", err);
      toast.error("Error deleting alert");
    }
  };
  const handleCreateAlert = async () => {
    // ✅ At least one field validation
    const hasAnyFilter =
      jobTitle?.trim() ||
      alertName?.trim() ||
      selectedCompanies.length > 0 ||
      selected.length > 0 ||
      selectedJobTypes.length > 0 ||
      selectedSeniority.length > 0 ||
      selectedTechStacks.length > 0 ||
      selectedSalaryRanges.length > 0 ||
      selectedRemote.length > 0;

    if (!hasAnyFilter) {
      return toast.error("Please fill at least one field to create job alert");
    }

    setLoading(true);

    try {
      const payload = {
        alertName: alertName?.trim(),

        jobTitle: jobTitle?.trim(),

        Filtercategory: [...selectedTechStacks].filter(Boolean),

        jobType: selectedJobTypes.filter(Boolean),

        remote: selectedRemote.filter(Boolean),

        experience: selectedSeniority.filter(Boolean),

        company: selectedCompanies.map((c) => c.brandName).filter(Boolean),

        industry: selected.map((i) => i._id).filter(Boolean),

        salaryRange: selectedSalaryRanges.filter(Boolean),

        notifyEvery: notifyEvery || "1 day",
      };

      console.log("📤 Sending Job Alert payload:", payload);

      const res = await axios.post(`${API_BASE_URL}saveJobAlert`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Alert Created:", res.data);

      fetchJobAlerts();

      toast.success("Job Alert created successfully!");

      setShowAlertModal(false);

      // ✅ Reset Form
      setAlertName("");
      setJobTitle("");
      setSelectedCompanies([]);
      setSelected([]);
      setSelectedJobTypes([]);
      setSelectedRemote([]);
      setSelectedSeniority([]);
      setSelectedTechStacks([]);
      setSelectedSalaryRanges([]);
      setNotifyEvery("1 day");
    } catch (error) {
      console.error("❌ Error creating job alert:", error.response || error);

      toast.error(
        error?.response?.data?.message || "Failed to create job alert.",
      );
    } finally {
      setLoading(false);
    }
  };
  const resetAlertForm = () => {
    setAlertName("");
    setJobTitle("");
    setSelectedCompanies([]);
    setSelected([]);
    setSelectedJobTypes([]);
    setSelectedRemote([]);
    setSelectedSeniority([]);
    setSelectedTechStacks([]);
    setSelectedSalaryRanges([]);
    setNotifyEvery("1 day");

    setCompanySearchTerm("");
    setSearchTerm("");

    setShowCompanyDropdown(false);
    setShowOptions(false);
  };
  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Manage Job Application</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/candidate-dashboard">Home </Link>
              </li>
              <li className="item">
                <Link to="/candidate-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <Link to={`/manage-job-application?tab=${activeTab}`}>
                  <i className="fa-solid fa-angle-right" />
                  Manage Job Application
                </Link>
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          <div className="modern-tabs-nav">
            <button
              className={`modern-tab-btn ${
                activeTab === "applications" ? "active" : ""
              }`}
              onClick={() => handleTabChange("applications")}
            >
              Candidatures
            </button>

            <button
              className={`modern-tab-btn ${
                activeTab === "saved-jobs" ? "active" : ""
              }`}
              onClick={() => handleTabChange("saved-jobs")}
            >
              Favoris
            </button>

            <button
              className={`modern-tab-btn ${
                activeTab === "job-alerts" ? "active" : ""
              }`}
              onClick={() => handleTabChange("job-alerts")}
            >
              Alertes
            </button>

            <button
              className={`modern-tab-btn ${
                activeTab === "profile-views" ? "active" : ""
              }`}
              onClick={() => handleTabChange("profile-views")}
            >
              Vue Profile
            </button>
          </div>
          {/* mannage Job application section start here */}

          <section className="mannage-job-application-tab-description">
            {/* Tab panes */}
            <div className="tab-content">
              {activeTab === "applications" && (
                <div className="manage-main-grid">
                  <div className="manage-content-area">
                    <div className="applications-tab-view">
                      <div className="modern-search-filter-container mb-4">
                        <div className="search-box-modern">
                          <i className="fa-solid fa-magnifying-glass search-icon" />
                          <input
                            placeholder="Search by job title or company..."
                            className="search-input-modern"
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                          />
                        </div>
                        <div
                          className={`filter-box-modern custom-dropdown ${dropdownOpen ? "active" : ""}`}
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                          {/* Trigger */}

                          <i className="fa-solid fa-filter filter-icon" />

                          <div className="selected-value-modern">
                            {statusOptions.find((s) => s.value === statusFilter)
                              ?.label || "All statuses"}
                          </div>

                          <i className="fa-solid fa-chevron-down arrow-icon" />

                          {/* Dropdown */}
                          {dropdownOpen && (
                            <div className="dropdown-menu-modern">
                              {statusOptions.map((item) => (
                                <div
                                  key={item.value}
                                  className={`dropdown-item-modern ${
                                    statusFilter === item.value ? "active" : ""
                                  }`}
                                  onClick={() => {
                                    setStatusFilter(item.value);
                                    setDropdownOpen(false);
                                  }}
                                >
                                  {item.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {loading ? (
                        <div className="text-center py-5">
                          <h5>Loading...</h5>
                        </div>
                      ) : filteredApplications.length === 0 ? (
                        <div className="text-center py-5">
                          <div
                            style={{
                              background: "#fff",
                              borderRadius: "20px",
                              padding: "50px 20px",
                              border: "1px solid #eee",
                            }}
                          >
                            <i
                              className="fa-regular fa-folder-open mb-3"
                              style={{
                                fontSize: "60px",
                                color: "#cbd5e1",
                              }}
                            />

                            <h4
                              style={{
                                fontWeight: "700",
                                marginBottom: "10px",
                              }}
                            >
                              No Applications Found
                            </h4>

                            <p
                              style={{
                                color: "#64748b",
                                marginBottom: "20px",
                              }}
                            >
                              You don’t have any job applications matching this
                              filter.
                            </p>

                            <Link
                              to="/job-search"
                              className="modern-apply-btn"
                              style={{
                                textDecoration: "none",
                              }}
                            >
                              Browse Jobs
                            </Link>
                          </div>
                        </div>
                      ) : (
                        filteredApplications.map((app) => {
                          const job = app?.jobId;
                          const company = job?.companyId;

                          return (
                            <div
                              className="modern-job-card clickable mb-4"
                              key={app._id}
                            >
                              {/* HEADER */}
                              <div className="modern-job-header">
                                <div className="modern-company-info">
                                  <div className="modern-logo-container">
                                    <img
                                      crossOrigin="anonymous"
                                      alt="logo"
                                      className="modern-company-logo"
                                      src={
                                        company?.logo
                                          ? `${API_IMAGE_URL}${company.logo}`
                                          : "assets/images/dashboard/images1.png"
                                      }
                                    />
                                  </div>

                                  <div className="modern-company-details">
                                    <h4 className="modern-company-name">
                                      {company?.brandName || "N/A"}
                                    </h4>

                                    <span className="modern-post-date">
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

                                      {moment(app?.createdAt).fromNow()}
                                    </span>
                                  </div>
                                </div>

                                {/* STATUS */}
                                <div className="modern-job-actions">
                                  <span
                                    className="modern-status-badge"
                                    style={{
                                      background:
                                        statusConfig[app?.status]?.background ||
                                        "#f3f4f6",
                                      color:
                                        statusConfig[app?.status]?.color ||
                                        "#374151",
                                      padding: "6px 14px",
                                      borderRadius: "30px",
                                      fontSize: "13px",
                                      fontWeight: "600",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "6px",
                                    }}
                                  >
                                    {statusConfig[app?.status]?.label ||
                                      app?.status}
                                  </span>
                                </div>
                              </div>

                              {/* BODY */}
                              <div className="modern-job-body">
                                <h3 className="modern-job-title">
                                  {job?.jobTitle || "N/A"}
                                </h3>

                                <p className="modern-job-description">
                                  You applied for this position. View details to
                                  see full job information.
                                </p>
                              </div>

                              {/* META */}
                              <div className="modern-job-meta">
                                {/* CATEGORY */}
                                <span className="modern-meta-tag">
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

                                  {job?.jobCategory
                                    ?.map((cat) => cat?.name)
                                    .join(", ") || "N/A"}
                                </span>

                                {/* LOCATION */}
                                <span className="modern-meta-tag">
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

                                  {job?.city?.join(", ") ||
                                    company?.city ||
                                    "N/A"}
                                </span>

                                {/* EMPLOYMENT TYPE */}
                                <span className="modern-meta-tag">
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
                                    <path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z" />
                                  </svg>

                                  {job?.employmentType
                                    ?.map((type) => type?.name)
                                    .join(", ") || "N/A"}
                                </span>

                                {/* EXPERIENCE */}
                                <span className="modern-meta-tag">
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

                                  {job?.minimumLevel?.name || "N/A"}
                                </span>
                              </div>

                              {/* FOOTER */}
                              <div className="modern-job-footer">
                                <div className="modern-job-info-badges">
                                  <span className="modern-info-badge">
                                    <i className="fa-solid fa-calendar-check" />
                                    Apply on{" "}
                                    {moment(app?.createdAt).format(
                                      "MMM DD, YYYY",
                                    )}
                                  </span>
                                </div>

                                <div
                                  className="modern-job-footer-actions"
                                  style={{
                                    display: "flex",
                                    gap: "12px",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Link
                                    className="view-details-link"
                                    to={`/job/${job?.slug}`}
                                    state={{
                                      from: `/manage-job-application?tab=${activeTab}`,
                                      JobId: job?._id,
                                    }}
                                    style={{
                                      textDecoration: "none",
                                      fontWeight: "700",
                                      fontSize: "14px",
                                      color: "var(--primary-color)",
                                    }}
                                  >
                                    See details
                                  </Link>

                                  {/* WITHDRAW BUTTON */}
                                  {app?.status === "Applied" && (
                                    <button
                                      type="button"
                                      className="modern-apply-btn"
                                      data-bs-toggle="modal"
                                      data-bs-target="#exampleModal"
                                      onClick={() =>
                                        handleWithdrawClick(app._id)
                                      }
                                      style={{
                                        background: "rgb(254, 242, 242)",
                                        color: "rgb(239, 68, 68)",
                                        padding: "8px 20px",
                                        border: "none",
                                        borderRadius: "10px",
                                        fontWeight: "600",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                      }}
                                    >
                                      Cancel my application
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div className="insights-sidebar">
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Who has seen my profile?
                          </font>
                        </font>
                      </h4>
                      <div className="view-count-box">
                        <h2>{companies?.length ?? 0}</h2>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              Views this month
                            </font>
                          </font>
                        </p>
                      </div>

                      <ul className="viewers-list">
                        {Array.isArray(companies) &&
                          companies.slice(0, 5).map((item, index) => (
                            <li className="viewer-item" key={index}>
                              <div className="viewer-avatar">
                                {item?.company?.brandName?.charAt(0)}
                              </div>

                              <div className="viewer-info">
                                <h5>{item?.company?.brandName || "N/A"}</h5>

                                <p>{moment(item?.unlockedAt).fromNow()}</p>
                              </div>
                            </li>
                          ))}
                      </ul>
                      <button
                        className="view-all-btn"
                        onClick={() => handleTabChange("profile-views")}
                      >
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            See the full report
                          </font>
                        </font>
                      </button>
                    </div>
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Force you Profile
                          </font>
                        </font>
                      </h4>
                      <div className="strength-mini-box">
                        <div className="mini-progress-bar">
                          <div
                            className="mini-progress-fill"
                            style={{ width: "70%" }}
                          />
                        </div>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                            {profileData?.strength ?? 0}% Completed
                            </font>
                          </font>
                        </p>
                      </div>
                      <Link
                        to="/candidate-profile"
                        className="view-all-btn text-center d-block text-decoration-none"
                      >
                        Complete my Profile
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "saved-jobs" && (
                <div className="manage-main-grid">
                  <div className="manage-content-area">
                    <div className="saved-jobs-tab-view">
                      <h2>Saved Offers</h2>

                      {loading ? (
                        <div className="text-center py-5">
                          <div
                            className="spinner-border text-primary mb-3"
                            role="status"
                          />
                          <p className="fw-semibold text-muted mb-0">
                            Loading saved jobs...
                          </p>
                        </div>
                      ) : savedJobs?.length > 0 ? (
                        savedJobs?.map((job) => {
                          const jobData = job?.jobId || job;

                          return (
                            <div
                              className="modern-job-card mb-4"
                              key={jobData?._id}
                            >
                              {/* HEADER */}
                              <div className="modern-job-header">
                                <div className="modern-company-info">
                                  <div className="modern-logo-container">
                                    <img
                                      crossOrigin="anonymous"
                                      alt="logo"
                                      className="modern-company-logo"
                                      src={
                                        jobData?.companyId?.logo
                                          ? `${API_IMAGE_URL}${jobData?.companyId?.logo}`
                                          : "assets/images/dashboard/images1.png"
                                      }
                                    />
                                  </div>

                                  <div className="modern-company-details">
                                    <h4 className="modern-company-name">
                                      {jobData?.companyId?.brandName ||
                                        "Unknown Company"}
                                    </h4>

                                    <span className="modern-post-date">
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

                                      {moment(jobData?.createdAt).fromNow()}
                                    </span>
                                  </div>
                                </div>

                                <div className="modern-job-actions">
                                  <button
                                    className="modern-action-icon saved"
                                    title="Unsave"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSaveJob(jobData?._id);
                                    }}
                                  >
                                    <i className="fa-solid fa-heart" />
                                  </button>
                                </div>
                              </div>

                              {/* BODY */}
                              <div className="modern-job-body">
                                <h3 className="modern-job-title">
                                  {jobData?.jobTitle || "Untitled Position"}
                                </h3>

                                <p className="modern-job-description">
                                  {jobData?.shortDescription ||
                                    "No description available."}
                                </p>
                              </div>

                              {/* META */}
                              <div className="modern-job-meta">
                                <span className="modern-meta-tag">
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

                                  {jobData?.jobCategory
                                    ?.map((cat) => cat?.name)
                                    ?.join(", ") || "N/A"}
                                </span>

                                <span className="modern-meta-tag">
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

                                  {jobData?.city?.join(", ") ||
                                    jobData?.companyId?.city?.split(",")[0] ||
                                    "N/A"}
                                </span>

                                <span className="modern-meta-tag">
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

                                  {jobData?.employmentType
                                    ?.map((type) => type?.name)
                                    ?.join(", ") || "N/A"}
                                </span>

                                <span className="modern-meta-tag">
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

                                  {jobData?.minimumLevel?.name || "N/A"}
                                </span>
                              </div>

                              {/* FOOTER */}
                              <div className="modern-job-footer">
                                <div className="modern-job-info-badges">
                                  <span className="modern-info-badge">
                                    <i className="fa-solid fa-bookmark" /> Saved{" "}
                                    {moment(job?.savedAt).fromNow()}
                                  </span>
                                </div>

                                <div className="modern-job-footer-actions">
                                  <Link
                                    className="modern-apply-btn"
                                    to={`/job/${jobData?.slug}`}
                                    state={{
                                      from: `/manage-job-application?tab=${activeTab}`,
                                      JobId: jobData?._id,
                                    }}
                                    style={{
                                      textDecoration: "none",
                                    }}
                                  >
                                    View Details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-5">
                          <div
                            style={{
                              background: "#fff",
                              borderRadius: "20px",
                              padding: "50px 20px",
                              border: "1px solid #eee",
                            }}
                          >
                            <i
                              className="fa-regular fa-bookmark mb-3"
                              style={{
                                fontSize: "60px",
                                color: "#cbd5e1",
                              }}
                            />

                            <h4
                              style={{
                                fontWeight: "700",
                                marginBottom: "10px",
                              }}
                            >
                              No Saved Jobs Found
                            </h4>

                            <p
                              style={{
                                color: "#64748b",
                                marginBottom: "20px",
                              }}
                            >
                              Start saving jobs to view them later.
                            </p>

                            <Link
                              to="/jobs"
                              className="modern-apply-btn"
                              style={{
                                textDecoration: "none",
                              }}
                            >
                              Browse Jobs
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="insights-sidebar">
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Who has seen my profile?
                          </font>
                        </font>
                      </h4>
                      <div className="view-count-box">
                        <h2>{companies?.length ?? 0}</h2>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              Views this month
                            </font>
                          </font>
                        </p>
                      </div>

                      <ul className="viewers-list">
                        {Array.isArray(companies) &&
                          companies.slice(0, 5).map((item, index) => (
                            <li className="viewer-item" key={index}>
                              <div className="viewer-avatar">
                                {item?.company?.brandName?.charAt(0)}
                              </div>

                              <div className="viewer-info">
                                <h5>{item?.company?.brandName || "N/A"}</h5>

                                <p>{moment(item?.unlockedAt).fromNow()}</p>
                              </div>
                            </li>
                          ))}
                      </ul>
                      <button className="view-all-btn">
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            See the full report
                          </font>
                        </font>
                      </button>
                    </div>
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Force you Profile
                          </font>
                        </font>
                      </h4>
                      <div className="strength-mini-box">
                        <div className="mini-progress-bar">
                          <div
                            className="mini-progress-fill"
                            style={{ width: "70%" }}
                          />
                        </div>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              70% Completed
                            </font>
                          </font>
                        </p>
                      </div>
                      <Link
                        to="/candidate-profile"
                        className="view-all-btn text-center d-block text-decoration-none"
                      >
                        Complete my Profile
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "job-alerts" && (
                <div className="manage-main-grid">
                  <div className="manage-content-area">
                    <div className="job-alerts-tab-view">
                      <div
                        className="tab-header-actions mb-4"
                        style={{
                          display: "flex",
                          "-webkit-box-pack": "space-between",
                          "-webkit-justify-content": "space-between",
                          "-ms-flex-pack": "space-between",
                          "justify-content": "space-between",
                          "-webkit-align-items": "center",
                          "-webkit-box-align": "center",
                          "-ms-flex-align": "center",
                          "align-items": "center",
                        }}
                      >
                        <h2 className="mb-0">
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              My Job Alerts
                            </font>
                          </font>
                        </h2>
                        {/* BUTTON */}
                        <button
                          className="modern-btn-create"
                          onClick={() => setShowAlertModal(true)}
                          style={{
                            background: "var(--primary-orange)",
                            color: "#fff",
                            border: "none",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "0.75rem",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <i className="fa-solid fa-plus" />
                          Create an alert
                        </button>{" "}
                        {showAlertModal && (
                          <>
                            <div
                              className="modal fade show"
                              id="createJobAlertModal"
                              tabIndex={-1}
                              style={{ display: "block" }}
                              aria-modal="true"
                              role="dialog"
                            >
                              <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content modern-modal">
                                  <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title-modern">
                                      <font
                                        dir="auto"
                                        style={{ "vertical-align": "inherit" }}
                                      >
                                        <font
                                          dir="auto"
                                          style={{
                                            "vertical-align": "inherit",
                                          }}
                                        >
                                          Create a job alert
                                        </font>
                                      </font>
                                    </h5>
                                    <button
                                      type="button"
                                      className="btn-close custom-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                      onClick={() => {
                                        resetAlertForm();
                                        setShowAlertModal(false);
                                      }}
                                    />
                                  </div>
                                  <div className="modal-body pt-0">
                                    <p className="modal-subtitle-modern">
                                      <font
                                        dir="auto"
                                        style={{ "vertical-align": "inherit" }}
                                      >
                                        <font
                                          dir="auto"
                                          style={{
                                            "vertical-align": "inherit",
                                          }}
                                        >
                                          Define your criteria to receive the
                                          best opportunities directly in your
                                          inbox.
                                        </font>
                                      </font>
                                    </p>
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Alert name (Optional)
                                              </font>
                                            </font>
                                          </label>
                                          <input
                                            className="modern-input"
                                            placeholder="Example: My Marketing Research"
                                            type="text"
                                            value={alertName}
                                            onChange={(e) =>
                                              setAlertName(e.target.value)
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Job Title / Keywords
                                              </font>
                                            </font>
                                          </label>
                                          <input
                                            className="modern-input"
                                            placeholder="Example: React Developer"
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) =>
                                              setJobTitle(e.target.value)
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>Business</label>

                                          <div
                                            className="modern-business-select"
                                            ref={dropdownRef}
                                          >
                                            {/* Selected Companies + Input */}
                                            <div
                                              className="modern-business-input-wrapper"
                                              onClick={() =>
                                                setShowCompanyDropdown(true)
                                              }
                                            >
                                              {/* Selected Tags */}
                                              {selectedCompanies.map(
                                                (company) => (
                                                  <div
                                                    key={company._id}
                                                    className="modern-business-tag"
                                                  >
                                                    <span>
                                                      {company.brandName}
                                                    </span>

                                                    <i
                                                      className="fa-solid fa-xmark remove-tag"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveCompany(
                                                          company._id,
                                                        );
                                                      }}
                                                    />
                                                  </div>
                                                ),
                                              )}

                                              {/* Search Input */}
                                              <input
                                                type="text"
                                                className="modern-business-input"
                                                placeholder="Search for a company..."
                                                value={companySearchTerm}
                                                onChange={(e) => {
                                                  setCompanySearchTerm(
                                                    e.target.value,
                                                  );
                                                  setShowCompanyDropdown(true);
                                                }}
                                                onFocus={() =>
                                                  setShowCompanyDropdown(true)
                                                }
                                              />

                                              {/* Right Icons */}
                                              <div className="modern-business-icons">
                                                {companySearchTerm && (
                                                  <i
                                                    className="fa-solid fa-xmark clear-icon"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setCompanySearchTerm("");
                                                    }}
                                                  />
                                                )}

                                                <i className="fa-solid fa-angle-down dropdown-icon" />
                                              </div>
                                            </div>

                                            {/* Dropdown */}
                                            {showCompanyDropdown && (
                                              <ul className="modern-business-dropdown">
                                                {companyOptions.length > 0 ? (
                                                  companyOptions.map(
                                                    (company) => {
                                                      const isSelected =
                                                        selectedCompanies.some(
                                                          (c) =>
                                                            c._id ===
                                                            company._id,
                                                        );

                                                      return (
                                                        <li
                                                          key={company._id}
                                                          className={`modern-business-option ${
                                                            isSelected
                                                              ? "selected"
                                                              : ""
                                                          }`}
                                                          onClick={() =>
                                                            handleSelectCompany(
                                                              company,
                                                            )
                                                          }
                                                        >
                                                          {company.brandName}
                                                        </li>
                                                      );
                                                    },
                                                  )
                                                ) : (
                                                  <li className="no-options">
                                                    No options
                                                  </li>
                                                )}
                                              </ul>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>Industry Sector</label>

                                          <div
                                            className="modern-business-select"
                                            ref={industryDropdownRef}
                                          >
                                            {/* Selected Tags + Input */}
                                            <div
                                              className="modern-business-input-wrapper"
                                              onClick={() =>
                                                setShowOptions(true)
                                              }
                                            >
                                              {/* Tags */}
                                              {selected.map((industry) => (
                                                <div
                                                  key={industry._id}
                                                  className="modern-business-tag"
                                                >
                                                  <span>{industry.name}</span>

                                                  <i
                                                    className="fa-solid fa-xmark remove-tag"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      removeTag(industry._id);
                                                    }}
                                                  />
                                                </div>
                                              ))}

                                              {/* Input */}
                                              <input
                                                type="text"
                                                className="modern-business-input"
                                                placeholder="Example: Search Industry Sector"
                                                value={searchTerm}
                                                onChange={(e) => {
                                                  setSearchTerm(e.target.value);
                                                  setShowOptions(true);
                                                }}
                                                onFocus={() =>
                                                  setShowOptions(true)
                                                }
                                              />

                                              {/* Right Icons */}
                                              <div className="modern-business-icons">
                                                {searchTerm && (
                                                  <i
                                                    className="fa-solid fa-xmark clear-icon"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setSearchTerm("");
                                                    }}
                                                  />
                                                )}

                                                <i className="fa-solid fa-angle-down dropdown-icon" />
                                              </div>
                                            </div>

                                            {/* Dropdown */}
                                            {showOptions && (
                                              <ul className="modern-business-dropdown">
                                                {filteredOptions.length > 0 ? (
                                                  filteredOptions.map(
                                                    (industry) => {
                                                      const isSelected =
                                                        selected.some(
                                                          (i) =>
                                                            i._id ===
                                                            industry._id,
                                                        );

                                                      return (
                                                        <li
                                                          key={industry._id}
                                                          className={`modern-business-option ${
                                                            isSelected
                                                              ? "selected"
                                                              : ""
                                                          }`}
                                                          onClick={() =>
                                                            toggleOption(
                                                              industry,
                                                            )
                                                          }
                                                        >
                                                          {industry.name}
                                                        </li>
                                                      );
                                                    },
                                                  )
                                                ) : (
                                                  <li className="no-options">
                                                    No industries found
                                                  </li>
                                                )}
                                              </ul>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                verticalAlign: "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  verticalAlign: "inherit",
                                                }}
                                              >
                                                Contract type
                                              </font>
                                            </font>
                                          </label>

                                          <div className="tag-cloud">
                                            {jobTypes.map((type) => (
                                              <span
                                                key={type._id}
                                                className={`selectable-tag ${
                                                  selectedJobTypes.includes(
                                                    type._id,
                                                  )
                                                    ? "active"
                                                    : ""
                                                }`}
                                                onClick={() => {
                                                  setSelectedJobTypes(
                                                    (prev) =>
                                                      prev.includes(type._id)
                                                        ? prev.filter(
                                                            (id) =>
                                                              id !== type._id,
                                                          ) // remove
                                                        : [...prev, type._id], // add
                                                  );
                                                }}
                                              >
                                                {type.name}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>Experience level</label>

                                          <div className="tag-cloud">
                                            {seniorityLevels.map((level) => {
                                              const isSelected =
                                                selectedSeniority.includes(
                                                  level._id,
                                                );

                                              return (
                                                <span
                                                  key={level._id}
                                                  className={`selectable-tag ${
                                                    isSelected ? "active" : ""
                                                  }`}
                                                  onClick={() => {
                                                    setSelectedSeniority(
                                                      (prev) =>
                                                        isSelected
                                                          ? prev.filter(
                                                              (id) =>
                                                                id !==
                                                                level._id,
                                                            )
                                                          : [
                                                              ...prev,
                                                              level._id,
                                                            ],
                                                    );
                                                  }}
                                                >
                                                  {level.name}
                                                </span>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>Business sectors</label>

                                          <div className="tag-cloud">
                                            {categories.map((cat) => {
                                              const isSelected =
                                                selectedTechStacks.includes(
                                                  cat._id,
                                                );

                                              return (
                                                <span
                                                  key={cat._id}
                                                  className={`selectable-tag ${
                                                    isSelected ? "active" : ""
                                                  }`}
                                                  onClick={() =>
                                                    handleTechStackChange(
                                                      cat._id,
                                                    )
                                                  }
                                                >
                                                  {cat.name}
                                                </span>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>Salary range</label>

                                          <div className="tag-cloud">
                                            {salaryRanges.map((range) => {
                                              const isSelected =
                                                selectedSalaryRanges.includes(
                                                  range.range,
                                                );

                                              return (
                                                <span
                                                  key={range._id}
                                                  className={`selectable-tag ${
                                                    isSelected ? "active" : ""
                                                  }`}
                                                  onClick={() =>
                                                    handleSalaryChange({
                                                      target: {
                                                        value: range.range,
                                                        checked: !isSelected,
                                                      },
                                                    })
                                                  }
                                                >
                                                  {range.range}
                                                </span>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="modal-form-group">
                                          <label>Working method</label>

                                          <div className="tag-cloud">
                                            {remoteOptions.map((item) => {
                                              const isSelected =
                                                selectedRemote.includes(
                                                  item._id,
                                                );

                                              return (
                                                <span
                                                  key={item._id}
                                                  className={`selectable-tag ${
                                                    isSelected ? "active" : ""
                                                  }`}
                                                  onClick={() => {
                                                    setSelectedRemote((prev) =>
                                                      isSelected
                                                        ? prev.filter(
                                                            (id) =>
                                                              id !== item._id,
                                                          )
                                                        : [...prev, item._id],
                                                    );
                                                  }}
                                                >
                                                  {item.name}
                                                </span>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="modal-form-group">
                                          <label>
                                            <font
                                              dir="auto"
                                              style={{
                                                "vertical-align": "inherit",
                                              }}
                                            >
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                Notification frequency
                                              </font>
                                            </font>
                                          </label>
                                          <select
                                            className="modern-select"
                                            value={notifyEvery}
                                            onChange={(e) =>
                                              setNotifyEvery(e.target.value)
                                            }
                                          >
                                            <option value="1 day">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  Each day
                                                </font>
                                              </font>
                                            </option>
                                            <option value="3 days">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  Every 3 days
                                                </font>
                                              </font>
                                            </option>
                                            <option value="Week">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  Each week
                                                </font>
                                              </font>
                                            </option>
                                            <option value="Month">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  Each month
                                                </font>
                                              </font>
                                            </option>
                                            <option value="Just save">
                                              <font
                                                dir="auto"
                                                style={{
                                                  "vertical-align": "inherit",
                                                }}
                                              >
                                                <font
                                                  dir="auto"
                                                  style={{
                                                    "vertical-align": "inherit",
                                                  }}
                                                >
                                                  Do not notify (Save only)
                                                </font>
                                              </font>
                                            </option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="modal-actions-modern mt-4">
                                      <button
                                        className="confirm-withdraw-btn"
                                        style={{
                                          background: "var(--primary-orange)",
                                        }}
                                        onClick={handleCreateAlert}
                                        disabled={loading}
                                      >
                                        {loading ? "Saving..." : "Save Alert"}
                                      </button>
                                      <button
                                        className="cancel-withdraw-btn"
                                        data-bs-dismiss="modal"
                                        onClick={() => {
                                          resetAlertForm();
                                          setShowAlertModal(false);
                                        }}
                                      >
                                        <font
                                          dir="auto"
                                          style={{
                                            "vertical-align": "inherit",
                                          }}
                                        >
                                          <font
                                            dir="auto"
                                            style={{
                                              "vertical-align": "inherit",
                                            }}
                                          >
                                            Cancel
                                          </font>
                                        </font>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="mannage-job-application-notification">
                        {loading ? (
                          <div className="text-center py-5">
                            <div
                              className="spinner-border text-primary mb-3"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <p className="text-muted">Loading job alerts...</p>
                          </div>
                        ) : jobAlerts.length === 0 ? (
                          <div className="text-center py-5 empty-state-box">
                            <div className="empty-state-icon mb-3">
                              <i
                                className="fa-solid fa-bell-slash"
                                style={{
                                  fontSize: "60px",
                                  color: "#d1d5db",
                                }}
                              />
                            </div>

                            <h4
                              style={{
                                fontWeight: "700",
                                color: "#111827",
                                marginBottom: "10px",
                              }}
                            >
                              No Job Alerts Found
                            </h4>

                            <p
                              style={{
                                color: "#6b7280",
                                maxWidth: "500px",
                                margin: "0 auto",
                              }}
                            >
                              You haven’t created any job alerts yet. Create
                              alerts to receive notifications about matching job
                              opportunities.
                            </p>
                          </div>
                        ) : (
                          jobAlerts.map((alert) => (
                            <div
                              className="modern-job-card mb-4"
                              key={alert._id}
                            >
                              <div className="modern-job-header">
                                <div className="modern-company-info">
                                  <div
                                    className="modern-logo-container"
                                    style={{
                                      background: "rgb(255, 247, 237)",
                                      color: "rgb(251, 146, 60)",
                                    }}
                                  >
                                    <i
                                      className="fa-solid fa-bell"
                                      style={{ fontSize: "24px" }}
                                    />
                                  </div>

                                  <div className="modern-company-details">
                                    <span className="modern-post-date">
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
                                      Notifying every:{" "}
                                      <strong>
                                        {alert?.notifyEvery
                                          ? alert.notifyEvery
                                              .charAt(0)
                                              .toUpperCase() +
                                            alert.notifyEvery.slice(1)
                                          : "Not specified"}
                                      </strong>
                                    </span>
                                  </div>
                                </div>

                                <div
                                  className="modern-job-actions"
                                  style={{
                                    alignItems: "center",
                                  }}
                                >
                                  {/* Status Toggle */}
                                  <div
                                    className="modern-switch-box"
                                    style={{ marginRight: "8px" }}
                                  >
                                    <label className="modern-switch">
                                      <input
                                        type="checkbox"
                                        checked={alert.status === "Active"}
                                        onChange={() =>
                                          handleToggleStatus(
                                            alert._id,
                                            alert.status === "Active"
                                              ? "Inactive"
                                              : "Active",
                                          )
                                        }
                                      />
                                      <span className="modern-slider" />
                                    </label>
                                  </div>

                                  {/* Edit Button */}

                                  {/* Delete Button */}
                                  <button
                                    className="modern-action-icon"
                                    title="Delete"
                                    onClick={() => handleDeleteAlert(alert._id)}
                                    style={{
                                      color: "rgb(239, 68, 68)",
                                      background: "rgb(254, 242, 242)",
                                    }}
                                  >
                                    <i className="fa-solid fa-trash-can" />
                                  </button>
                                </div>
                              </div>

                              <div className="modern-job-body">
                                <h3 className="modern-job-title">
                                  {alert?.alertName || "All Industries"}
                                </h3>

                                <div className="alert-filters-container">
                                  {/* Positions */}
                                  <div className="alert-filter-group">
                                    <span className="filter-group-label">
                                      Positions:
                                    </span>

                                    <div className="filter-tags">
                                      {alert?.jobTitle?.length > 0 ? (
                                        alert.jobTitle.map((title, index) => (
                                          <span
                                            className="modern-meta-tag"
                                            key={index}
                                          >
                                            {title}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="modern-meta-tag">
                                          All Positions
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Criteria */}
                                  <div className="alert-filter-group">
                                    <span className="filter-group-label">
                                      Criteria:
                                    </span>

                                    <div className="filter-tags">
                                      {[
                                        ...(alert?.filterCategory || []).map(
                                          (item) => ({
                                            icon: "fa-solid fa-layer-group",
                                            value: item?.name,
                                          }),
                                        ),

                                        ...(alert?.experience || []).map(
                                          (item) => ({
                                            icon: "fa-solid fa-signal",
                                            value: item?.name,
                                          }),
                                        ),

                                        ...(alert?.jobType || []).map(
                                          (item) => ({
                                            icon: "fa-regular fa-user",
                                            value: item?.name,
                                          }),
                                        ),

                                        ...(alert?.location || []).map(
                                          (item) => ({
                                            icon: "fa-solid fa-location-dot",
                                            value: item?.name || item,
                                          }),
                                        ),

                                        ...(alert?.remote || []).map(
                                          (item) => ({
                                            icon: "fa-solid fa-house-laptop",
                                            value: item?.name,
                                          }),
                                        ),
                                      ]
                                        .filter((item) => item.value)
                                        .map((item, index) => (
                                          <span
                                            className="modern-meta-tag"
                                            key={index}
                                          >
                                            <i className={item.icon} />{" "}
                                            {item.value}
                                          </span>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="modern-job-footer">
                                <div className="modern-job-info-badges">
                                  <span
                                    className="modern-status-badge assessment"
                                    style={{
                                      fontSize: "11px",
                                      padding: "4px 12px",
                                      background:
                                        alert.status === "Active"
                                          ? "#dcfce7"
                                          : "#fee2e2",
                                      color:
                                        alert.status === "Active"
                                          ? "#166534"
                                          : "#991b1b",
                                    }}
                                  >
                                    {alert.status}
                                  </span>
                                </div>

                                <div className="modern-job-footer-actions">
                                  <Link
                                    to="/job-search"
                                    // state={{ alert }}
                                    className="modern-apply-btn"
                                    style={{
                                      textDecoration: "none",
                                    }}
                                  >
                                    View Offers
                                  </Link>
                                </div>
                              </div>

                              {/* Modal */}
                              <div
                                className="modal fade"
                                id={`editAlertModal-${alert._id}`}
                                data-bs-backdrop="static"
                                data-bs-keyboard="false"
                                tabIndex={-1}
                                aria-labelledby={`editAlertLabel-${alert._id}`}
                                aria-hidden="true"
                              >
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id={`editAlertLabel-${alert._id}`}
                                      >
                                        Set job alerts notification
                                      </h1>

                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      />
                                    </div>

                                    <div className="modal-body">
                                      <div className="mannage-job-notification-info">
                                        {[
                                          "1 day",
                                          "3 days",
                                          "week",
                                          "month",
                                          "Just save",
                                        ].map((freq) => {
                                          const labelText =
                                            freq.charAt(0).toUpperCase() +
                                            freq.slice(1);

                                          return (
                                            <span
                                              key={freq}
                                              style={{
                                                marginRight: "10px",
                                              }}
                                            >
                                              <input
                                                type="radio"
                                                id={`${freq}-${alert._id}`}
                                                name={`notify-${alert._id}`}
                                                value={freq}
                                                checked={
                                                  selectedNotify[alert._id] ===
                                                  freq
                                                }
                                                onChange={(e) =>
                                                  setSelectedNotify((prev) => ({
                                                    ...prev,
                                                    [alert._id]: e.target.value,
                                                  }))
                                                }
                                              />

                                              <label
                                                htmlFor={`${freq}-${alert._id}`}
                                              >
                                                {labelText}
                                              </label>
                                            </span>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    <div className="modal-footer">
                                      <button
                                        type="button"
                                        className="default-btn btn"
                                        onClick={() =>
                                          handleUpdateAlert(
                                            alert._id,
                                            selectedNotify[alert._id],
                                            alert.status,
                                          )
                                        }
                                      >
                                        Save
                                      </button>

                                      <button
                                        type="button"
                                        className="default-btn btn"
                                        data-bs-dismiss="modal"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="insights-sidebar">
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Who has seen my profile?
                          </font>
                        </font>
                      </h4>
                      <div className="view-count-box">
                        <h2>{companies?.length ?? 0}</h2>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              Views this month
                            </font>
                          </font>
                        </p>
                      </div>

                      <ul className="viewers-list">
                        {Array.isArray(companies) &&
                          companies.slice(0, 5).map((item, index) => (
                            <li className="viewer-item" key={index}>
                              <div className="viewer-avatar">
                                {item?.company?.brandName?.charAt(0)}
                              </div>

                              <div className="viewer-info">
                                <h5>{item?.company?.brandName || "N/A"}</h5>

                                <p>{moment(item?.unlockedAt).fromNow()}</p>
                              </div>
                            </li>
                          ))}
                      </ul>
                      <button className="view-all-btn">
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            See the full report
                          </font>
                        </font>
                      </button>
                    </div>
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Force you Profile
                          </font>
                        </font>
                      </h4>
                      <div className="strength-mini-box">
                        <div className="mini-progress-bar">
                          <div
                            className="mini-progress-fill"
                            style={{ width: "70%" }}
                          />
                        </div>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              70% Completed
                            </font>
                          </font>
                        </p>
                      </div>
                      <Link
                        to="/candidate-profile"
                        className="view-all-btn text-center d-block text-decoration-none"
                      >
                        Complete my Profile
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "profile-views" && (
                <div className="manage-main-grid">
                  <div className="manage-content-area">
                    <div className="profile-views-tab-view">
                      <div className="section-header-modern mb-4">
                        <h2
                          style={{
                            "font-size": "1.75rem",
                            "font-weight": "800",
                            color: "var(--text-dark)",
                          }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              Profile Visits
                            </font>
                          </font>
                        </h2>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            "font-size": "0.95rem",
                          }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              Discover which companies are interested in your
                              profile.
                            </font>
                          </font>
                        </p>
                      </div>
                      <div
                        className="modern-filter-bar mb-4"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "rgb(255, 255, 255)",
                          padding: "1rem",
                          borderRadius: "1rem",
                          border: "1px solid var(--border-color)",
                          flexWrap: "wrap",
                          gap: "1rem",
                        }}
                      >
                        <div
                          className="filter-pills"
                          style={{ display: "flex", gap: "0.5rem" }}
                        >
                          <button
                            className={`filter-pill ${
                              filter === "all" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("all")}
                            style={{
                              padding: "0.6rem 1.2rem",
                              borderRadius: "0.75rem",
                              border: "none",
                              background:
                                filter === "all"
                                  ? "var(--primary-orange)"
                                  : "rgb(248, 250, 252)",
                              color:
                                filter === "all" ? "#fff" : "var(--text-muted)",
                              fontWeight: "600",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                            }}
                          >
                            All
                          </button>

                          <button
                            className={`filter-pill ${
                              filter === "today" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("today")}
                            style={{
                              padding: "0.6rem 1.2rem",
                              borderRadius: "0.75rem",
                              border: "none",
                              background:
                                filter === "today"
                                  ? "var(--primary-orange)"
                                  : "rgb(248, 250, 252)",
                              color:
                                filter === "today"
                                  ? "#fff"
                                  : "var(--text-muted)",
                              fontWeight: "600",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                            }}
                          >
                            Today
                          </button>

                          <button
                            className={`filter-pill ${
                              filter === "last7days" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("last7days")}
                            style={{
                              padding: "0.6rem 1.2rem",
                              borderRadius: "0.75rem",
                              border: "none",
                              background:
                                filter === "last7days"
                                  ? "var(--primary-orange)"
                                  : "rgb(248, 250, 252)",
                              color:
                                filter === "last7days"
                                  ? "#fff"
                                  : "var(--text-muted)",
                              fontWeight: "600",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                            }}
                          >
                            Last 7 Days
                          </button>

                          <button
                            className={`filter-pill ${
                              filter === "custom" ? "active" : ""
                            }`}
                            onClick={() => handleFilter("custom")}
                            style={{
                              padding: "0.6rem 1.2rem",
                              borderRadius: "0.75rem",
                              border: "none",
                              background:
                                filter === "custom"
                                  ? "var(--primary-orange)"
                                  : "rgb(248, 250, 252)",
                              color:
                                filter === "custom"
                                  ? "#fff"
                                  : "var(--text-muted)",
                              fontWeight: "600",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                            }}
                          >
                            Custom
                          </button>
                        </div>

                        {filter === "custom" && (
                          <div
                            className="custom-date-range"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              style={{
                                padding: "0.5rem",
                                borderRadius: "0.5rem",
                                border: "1px solid var(--border-color)",
                                fontSize: "0.85rem",
                              }}
                            />

                            <span
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.85rem",
                              }}
                            >
                              To
                            </span>

                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              style={{
                                padding: "0.5rem",
                                borderRadius: "0.5rem",
                                border: "1px solid var(--border-color)",
                                fontSize: "0.85rem",
                              }}
                            />

                            <button
                              onClick={handleCustomFilter}
                              style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "0.5rem",
                                border: "none",
                                background: "var(--primary-orange)",
                                color: "#fff",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                            >
                              Search
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="profile-viewers-grid">
                        {loading ? (
                          <div className="text-center py-5">
                            <h5>Loading...</h5>
                          </div>
                        ) : companies?.length > 0 ? (
                          companies?.map((item, index) => (
                            <div
                              className="modern-viewer-card mb-3"
                              key={index}
                              style={{
                                background: "rgb(255, 255, 255)",
                                borderRadius: "1.25rem",
                                border: "1px solid var(--border-color)",
                                padding: "1.25rem",
                                transition: "0.3s",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                              }}
                            >
                              <div
                                className="viewer-card-body"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                  gap: "1rem",
                                }}
                              >
                                {/* LEFT */}
                                <div
                                  className="viewer-brand"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    flex: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  <div
                                    className="brand-logo-modern"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      background: "rgb(248, 250, 252)",
                                      borderRadius: "0.75rem",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      overflow: "hidden",
                                      border: "1px solid rgb(241, 245, 249)",
                                    }}
                                  >
                                    <span
                                      className="brand-initial"
                                      style={{
                                        color: "var(--primary-orange)",
                                        fontWeight: "700",
                                        fontSize: "1.1rem",
                                      }}
                                    >
                                      {item?.company?.brandName?.charAt(0)}
                                    </span>
                                  </div>

                                  <div className="brand-info-modern">
                                    <h4
                                      style={{
                                        margin: "0px",
                                        fontSize: "1.05rem",
                                        fontWeight: "700",
                                        color: "var(--text-dark)",
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                        lineHeight: "1.4",
                                      }}
                                    >
                                      {item?.company?.brandName || "N/A"}
                                    </h4>
                                  </div>
                                </div>

                                {/* CENTER */}
                                <div
                                  className="viewer-meta-modern"
                                  style={{
                                    display: "flex",
                                    gap: "1.5rem",
                                    flexWrap: "nowrap", // changed
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    className="meta-item-modern"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      color: "var(--text-muted)",
                                      fontSize: "0.85rem",
                                    }}
                                  >
                                    <i
                                      className="fa-solid fa-location-dot"
                                      style={{
                                        color: "var(--primary-orange)",
                                      }}
                                    />

                                    {/* <span>{item?.company?.city || "N/A"}</span> */}
                                    <span>
                                      {item?.company?.city
                                        ? item.company.city.split(",")[0]
                                        : "N/A"}
                                    </span>
                                  </div>

                                  <div
                                    className="meta-item-modern"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      color: "var(--text-muted)",
                                      fontSize: "0.85rem",
                                    }}
                                  >
                                    <i
                                      className="fa-solid fa-calendar-days"
                                      style={{
                                        color: "var(--primary-orange)",
                                      }}
                                    />

                                    <span>
                                      {moment(item?.unlockedAt).format(
                                        "MMMM DD, YYYY [at] hh:mm A",
                                      )}
                                    </span>
                                  </div>
                                </div>

                                {/* RIGHT */}
                                <div
                                  className="viewer-action-modern"
                                  style={{
                                    marginLeft: "auto",
                                    flexShrink: 0,
                                  }}
                                >
                                  <Link
                                    to={`/${item?.company?.slug}`}
                                    className="btn-view-company"
                                    style={{
                                      padding: "0.6rem 1.25rem",
                                      borderRadius: "0.75rem",
                                      border: "1px solid var(--primary-orange)",
                                      background: "transparent",
                                      color: "var(--primary-orange)",
                                      fontWeight: "600",
                                      fontSize: "0.85rem",
                                      textDecoration: "none",
                                    }}
                                  >
                                    View Company
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            className="text-center py-5"
                            style={{
                              background: "#fff",
                              borderRadius: "20px",
                              padding: "60px 20px",
                              border: "1px solid #f1f5f9",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                            }}
                          >
                            <div
                              style={{
                                width: "90px",
                                height: "90px",
                                margin: "0 auto 20px",
                                borderRadius: "50%",
                                background: "rgba(249, 115, 22, 0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <i
                                className="fa-regular fa-building"
                                style={{
                                  fontSize: "40px",
                                  color: "var(--primary-orange)",
                                }}
                              />
                            </div>

                            <h3
                              style={{
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#0f172a",
                                marginBottom: "10px",
                              }}
                            >
                              No Interested Companies Found
                            </h3>

                            <p
                              style={{
                                color: "#64748b",
                                fontSize: "15px",
                                maxWidth: "500px",
                                margin: "0 auto 25px",
                                lineHeight: "1.7",
                              }}
                            >
                              No companies have viewed or unlocked your profile
                              yet. Complete your profile and apply to more jobs
                              to increase visibility.
                            </p>

                            <Link
                              to="/candidate-profile"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                background: "var(--primary-orange)",
                                color: "#fff",
                                padding: "12px 24px",
                                borderRadius: "12px",
                                textDecoration: "none",
                                fontWeight: "600",
                                fontSize: "15px",
                                transition: "0.3s",
                              }}
                            >
                              <i className="fa-solid fa-user-pen" />
                              Complete Profile
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="insights-sidebar">
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Who has seen my profile?
                          </font>
                        </font>
                      </h4>
                      <div className="view-count-box">
                        <h2>{companies?.length ?? 0}</h2>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              Views this month
                            </font>
                          </font>
                        </p>
                      </div>

                      <ul className="viewers-list">
                        {Array.isArray(companies) &&
                          companies.slice(0, 5).map((item, index) => (
                            <li className="viewer-item" key={index}>
                              <div className="viewer-avatar">
                                {item?.company?.brandName?.charAt(0)}
                              </div>

                              <div className="viewer-info">
                                <h5>{item?.company?.brandName || "N/A"}</h5>

                                <p>{moment(item?.unlockedAt).fromNow()}</p>
                              </div>
                            </li>
                          ))}
                      </ul>
                      <button className="view-all-btn">
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            See the full report
                          </font>
                        </font>
                      </button>
                    </div>
                    <div className="insights-card">
                      <h4>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Force you Profile
                          </font>
                        </font>
                      </h4>
                      <div className="strength-mini-box">
                        <div className="mini-progress-bar">
                          <div
                            className="mini-progress-fill"
                            style={{ width: "70%" }}
                          />
                        </div>
                        <p>
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              70% Completed
                            </font>
                          </font>
                        </p>
                      </div>
                      <Link
                        to="/candidate-profile"
                        className="view-all-btn text-center d-block text-decoration-none"
                      >
                        Complete my Profile
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
          {/*mannage Job application end here*/}
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
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content modern-modal">
            {/* HEADER */}
            <div className="modal-header border-0 pb-0">
              <div className="modal-icon-box text-danger">
                <i className="fa-solid fa-circle-exclamation" />
              </div>

              <button
                type="button"
                className="btn-close custom-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            {/* BODY */}
            <div className="modal-body text-center pt-0">
              <h5 className="modal-title-modern">Cancel my application</h5>

              <p className="modal-subtitle-modern">
                Please tell us the reason for your cancellation. This helps us
                improve our service.
              </p>

              {/* REASONS */}
              <div className="withdraw-options-modern mb-4">
                <label
                  className={`withdraw-option ${
                    reason === "I found another offer" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value="I found another offer"
                    checked={reason === "I found another offer"}
                    onChange={(e) => setReason(e.target.value)}
                    className="hidden-radio"
                  />

                  <div className="option-circle" />

                  <span>I found another offer</span>
                </label>

                <label
                  className={`withdraw-option ${
                    reason === "Applied by mistake" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value="Applied by mistake"
                    checked={reason === "Applied by mistake"}
                    onChange={(e) => setReason(e.target.value)}
                    hidden
                  />

                  <div className="option-circle" />

                  <span>Applied by mistake</span>
                </label>

                <label
                  className={`withdraw-option ${
                    reason === "Unsatisfactory conditions" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value="Unsatisfactory conditions"
                    checked={reason === "Unsatisfactory conditions"}
                    onChange={(e) => setReason(e.target.value)}
                    hidden
                  />

                  <div className="option-circle" />

                  <span>Unsatisfactory conditions</span>
                </label>

                <label
                  className={`withdraw-option ${
                    reason === "Other reason" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value="Other reason"
                    checked={reason === "Other reason"}
                    onChange={(e) => setReason(e.target.value)}
                    hidden
                  />

                  <div className="option-circle" />

                  <span>Other reason</span>
                </label>
              </div>

              {/* COMMENTS */}
              <textarea
                className="form-control modern-textarea mb-4"
                placeholder="Additional comments (optional)"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />

              <div className="modal-actions-modern">
                <button
                  className="confirm-withdraw-btn"
                  onClick={handleWithdrawSubmit}
                  disabled={loading}
                >
                  {loading ? "Withdrawing..." : "Confirm the cancellation"}
                </button>

                <button className="cancel-withdraw-btn" data-bs-dismiss="modal">
                  Keep my application
                </button>
              </div>
            </div>

            {/* FOOTER */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagesJobApplication;
