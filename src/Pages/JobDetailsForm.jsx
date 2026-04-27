import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { useLocation, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
// ===============================
// 1. INSTALL if not installed
// npm install react-select
// ===============================

import Select from "react-select";
function JobDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const job = location.state?.job || {};
  // ===============================
  // State
  // ===============================
  // ===============================
  // State
  // ===============================
  const [creditInfo, setCreditInfo] = useState({
    totalJobCredits: 0,
    remainingJobCredits: 0,
    dailyLimit: 0,
    usedToday: 0,
    remainingToday: 0,
    packName: "",
    daysLeft: 0,

    // Full Credit
    fullCredit: {
      jobCredits: {
        total: 0,
        used: 0,
        remaining: 0,
      },
    },

    // Featured Job Info
    featuredJobsAvailable: false,
    maxFeaturedJobs: 0,
    featuredJobsUsed: 0,
    maxActiveFeaturedJobs: 0,
    featuredJobDurationDays: 0,
  });
  const [loading, setLoading] = useState(false);
  const [globalCurrency, setGlobalCurrency] = useState({
    code: "MAD",
    symbol: "DH",
  });
  const fromPath = location.state?.from || "/your-job-posts";
  console.log("job from state:", job);
  const theme = useTheme();
  const [scheduleDate, setScheduleDate] = useState("");
  const [showScheduleDate, setShowScheduleDate] = useState(false);
  const [showExpireDate, setShowExpireDate] = useState(false);
  const getDefaultExpiryDate = () => {
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);
    return defaultExpiry.toISOString().split("T")[0];
  };

  const [expiresAt, setExpiresAt] = useState(getDefaultExpiryDate());
  const [aiLoading, setAiLoading] = useState(false);
  const Title = job?.jobTitle;
  const Category = job?.jobCategory;
  console.log("Job Title:-", Title);
  console.log("Job Category:-", Category);
  const debounceTimer = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [cityList, setCityList] = useState([]);
  const [seniorityLevels, setSeniorityLevels] = useState([]);
  const [jobAssessment, setJobAssessment] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // Group assessments by source using useMemo
  const groupedAssessments = useMemo(() => {
    const groups = {};
    jobAssessment.forEach((assessment) => {
      const source = assessment.source || "Other";
      if (!groups[source]) {
        groups[source] = [];
      }
      groups[source].push(assessment);
    });
    return groups;
  }, [jobAssessment]);

  const [jobTypes, setJobTypes] = useState([]);
  // ✅ Job data passed from previous page
  const jobFromState = location.state?.jobData || {};
  console.log(jobFromState);

  // ---- Initialize once with either state job or empty
  const [formData, setFormData] = useState(() => ({
    jobTitle: jobFromState.jobTitle || "",
    recruitmentProcess:
      jobFromState.recruitmentProcess?.length > 0
        ? jobFromState.recruitmentProcess
        : [{ step: 1, title: "" }],
    jobCategory: Array.isArray(jobFromState.jobCategory)
      ? jobFromState.jobCategory.map((item) => ({
          value: item._id,
          label: item.name,
        }))
      : jobFromState.jobCategory
        ? [
            {
              value: jobFromState.jobCategory._id || jobFromState.jobCategory,
              label: jobFromState.jobCategory.name || "",
            },
          ]
        : [],
    // jobCategory:
    //   jobFromState.jobCategory?._id || jobFromState.jobCategory || "",
    minimumLevel:
      jobFromState.minimumLevel?._id || jobFromState.minimumLevel || "",
    employmentType: Array.isArray(jobFromState.employmentType)
      ? jobFromState.employmentType.map((item) => ({
          value: item._id,
          label: item.name,
        }))
      : [],
    TJM: jobFromState.TJM?.amount || "",
    remote: jobFromState.remote || "",
    jobAddress: jobFromState.jobAddress || "",
    availablePosts: jobFromState.availablePosts || "",
    city: Array.isArray(jobFromState.city)
      ? jobFromState.city
      : Array.isArray(jobFromState.cities)
        ? jobFromState.cities
        : [],
    region: jobFromState.region || "",
    Country: jobFromState.country?._id || jobFromState.country || "",
    shortDescription: jobFromState.shortDescription || "",
    tags: jobFromState.tags || [],
    jobDescription: jobFromState.jobDescription || "",
    enableExternalApply: jobFromState.enableExternalApply || false,
    confidentialJobPost: jobFromState.confidentialJobPost || false,
    referenceId: jobFromState.referenceId || "",
    enableEmailNotification: jobFromState.enableEmailNotification || false,
    // enableHighlightedJob: jobFromState.enableHighlightedJob || false,
    // enableHomePageVisibility: jobFromState.enableHomePageVisibility || false,
    enableFeaturedJob: jobFromState.enableFeaturedJob || false,
    enableRemovalRelevantJobs: jobFromState.enableRemovalRelevantJobs || false,
    ExternalApplyLink: jobFromState.ExternalApplyLink || "",
    minSalary: jobFromState?.privatJobDetails?.minSalary || "",
    maxSalary: jobFromState?.privatJobDetails?.maxSalary || "",
    coverPhoto: null,
    coverPhotoPreview: null,
    availableJobs: "",
    isAssessmentRequired: jobFromState.isAssessmentRequired || false,
    assessment: jobFromState.assessment?._id || jobFromState.assessment || "",
    validation_required: jobFromState.validation_required || false,
    retry_period_days: jobFromState.validation_required
      ? jobFromState.retry_period_days
        ? String(jobFromState.retry_period_days)
        : ""
      : "0",
    status: jobFromState.status || "draft",
  }));

  const [selectedCities, setSelectedCities] = useState(
    Array.isArray(jobFromState.city)
      ? jobFromState.city
      : Array.isArray(jobFromState.cities)
        ? jobFromState.cities
        : [],
  );
  const isFreelanceSelected = formData.employmentType?.some(
    (item) => item?.label?.trim().toLowerCase() === "freelance",
  );

  console.log(isFreelanceSelected);
  // const isFreelanceSelected = formData.employmentType?.some((item) =>
  //   item.label?.toLowerCase().includes("freelance"),
  // );
  // ---- Fetch if page was refreshed (no state) but we have an id
  useEffect(() => {
    if (!jobFromState._id && id) {
      const token = localStorage.getItem("token");
      axios
        .get(`${API_BASE_URL}getJobById/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const job = res.data?.data || res.data?.job || res.data;
          if (!job) return;

          const jobCities = Array.isArray(job.city)
            ? job.city
            : Array.isArray(job.cities)
              ? job.cities
              : [];

          setFormData((prev) => ({
            ...prev,
            jobTitle: job.jobTitle || "",
            jobCategory: job.jobCategory?._id || job.jobCategory || "",
            minimumLevel: job.minimumLevel?._id || job.minimumLevel || "",
            // employmentType: job.employmentType?._id || job.employmentType || "",
            employmentType: Array.isArray(job.employmentType)
              ? job.employmentType.map((item) => ({
                  value: item._id,
                  label: item.name,
                }))
              : [],
            remote: job.remote || "",
            recruitmentProcess:
              job.recruitmentProcess?.length > 0
                ? job.recruitmentProcess
                : [{ step: 1, title: "" }],

            jobAddress: job.jobAddress || "",
            city: jobCities,
            region: job.region || "",
            TJM: job.TJM?.amount || "",
            Country: job.country?._id || job.country || "",
            shortDescription: job.shortDescription || "",
            tags: job.tags || [],
            jobDescription: job.jobDescription || "",
            enableExternalApply: job.enableExternalApply || false,
            confidentialJobPost: job.confidentialJobPost || false,
            enableRemovalRelevantJobs: job.enableRemovalRelevantJobs || false,
            enableFeaturedJob: job.enableFeaturedJob || false,
            // enableHighlightedJob: job.enableHighlightedJob || false,
            // enableHomePageVisibility: job.enableHomePageVisibility || false,
            referenceId: job.referenceId || "",
            enableEmailNotification: job.enableEmailNotification || false,
            ExternalApplyLink: job.ExternalApplyLink || "",
            minSalary: job?.privatJobDetails?.minSalary || "",
            maxSalary: job?.privatJobDetails?.maxSalary || "",
            coverPhoto: null,
            isAssessmentRequired: job.isAssessmentRequired || false,
            assessment: job.assessment?._id || job.assessment || "",
            validation_required: job.validation_required || false,
            retry_period_days: job.validation_required
              ? job.retry_period_days
                ? String(job.retry_period_days)
                : ""
              : "0",
            status: job.status || "draft",
          }));
          if (job.expiresAt) {
            setExpiresAt(new Date(job.expiresAt).toISOString().split("T")[0]);
          } else {
            setExpiresAt(getDefaultExpiryDate());
          }
          console.log("Job Details Data:", job);
          setSelectedCities(jobCities);
        })
        .catch((err) => console.error("Failed to fetch job:", err));
    }
  }, [id, jobFromState._id]);
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
  const handleStepChange = (index, value) => {
    const updated = [...formData.recruitmentProcess];

    updated[index] = {
      ...updated[index],
      step: index + 1,
      title: value,
    };

    setFormData((prev) => ({
      ...prev,
      recruitmentProcess: updated,
    }));
  };
  const fetchcreditStatus = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_BASE_URL}credit-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const data = response.data.data;

        const pack = data?.purchasedPack?.active
          ? data.purchasedPack
          : data.welcomePack;

        const feature = pack?.features || {};

        setCreditInfo({
          totalJobCredits: pack?.jobCreditsTotal || 0,
          remainingJobCredits: pack?.jobCreditsRemaining || 0,

          // ✅ Daily Limit
          dailyLimit: pack?.dailyJobLimit || 0,

          // ✅ Used Today
          usedToday: data?.usageToday?.jobPostingUsed || 0,

          remainingToday: data?.remainingToday?.jobPostingRemaining || 0,

          packName: pack?.packName || "Welcome Pack",
          daysLeft: pack?.daysLeft || 0,

          // ✅ Full Credit
          fullCredit: data?.fullCredit || {
            jobCredits: {
              total: 0,
              used: 0,
              remaining: 0,
            },
          },

          // Featured Jobs
          featuredJobsAvailable: feature?.featuredJobsAvailable || false,
          maxFeaturedJobs: feature?.maxFeaturedJobs || 0,
          featuredJobsUsed: feature?.featuredJobsUsed || 0,
          maxActiveFeaturedJobs: feature?.maxActiveFeaturedJobs || 0,
          featuredJobDurationDays: feature?.featuredJobDurationDays || 0,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchcreditStatus();
  }, []);
  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      recruitmentProcess: [
        ...prev.recruitmentProcess,
        {
          step: prev.recruitmentProcess.length + 1,
          title: "",
        },
      ],
    }));
  };
  const removeStep = (index) => {
    let updated = formData.recruitmentProcess.filter((_, i) => i !== index);

    updated = updated.map((item, i) => ({
      ...item,
      step: i + 1,
    }));

    if (updated.length === 0) {
      updated = [{ step: 1, title: "" }];
    }

    setFormData((prev) => ({
      ...prev,
      recruitmentProcess: updated,
    }));
  };
  useEffect(() => {
    const fetchAssessmentLevels = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}getAssessmentDropdownList`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.data.success && Array.isArray(res.data.data)) {
          setJobAssessment(res.data.data);
        }
        console.log(res.data);
      } catch (error) {
        console.error("Error While Fetching Assessment");
      }
    };
    fetchAssessmentLevels();
  }, []);

  const handleAssessment = (e) => {
    const assessmentId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      assessment: assessmentId,
    }));

    setErrors((prev) => ({
      ...prev,
      assessment: "",
    }));
  };

  const handleAssessmentToggle = (e) => {
    const { checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      isAssessmentRequired: checked,
      assessment: checked ? prev.assessment : "",
    }));
  };

  const handleCountryChange = async (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];

    const countryId = selectedOption.getAttribute("data-id");
    const countryObjectId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      Country: countryObjectId,
    }));

    if (countryId) {
      fetchCitiesByCountry(countryId);
    }
  };
  const handleSeniorityChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      minimumLevel: value,
    }));
  };

  const [showCityOptions, setShowCityOptions] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");

  const filteredCities = cityList.filter((city) =>
    city.name.toLowerCase().includes(citySearchTerm.toLowerCase()),
  );
  const updateCities = (updatedCities) => {
    setSelectedCities(updatedCities);

    setFormData((prev) => ({
      ...prev,
      city: updatedCities,
    }));
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
    const handleClickOutside = (e) => {
      if (!e.target.closest(".multi-select-container")) {
        setShowCityOptions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    // Next button
    const nextButtons = document.querySelectorAll(".next-tab-btn");
    nextButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const currentPane = e.target.closest(".tab-pane");
        if (!currentPane) return;
        const nextPane = currentPane.nextElementSibling;
        if (!nextPane) return;
        const nextTabLink = document.querySelector(
          `.nav-link[href="#${nextPane.id}"]`,
        );
        if (nextTabLink) {
          const tab = new window.bootstrap.Tab(nextTabLink);
          tab.show();
        }
      });
    });

    // Back button
    const backButtons = document.querySelectorAll(".back-tab-btn");
    backButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();

        const currentPane = e.target.closest(".tab-pane");

        if (!currentPane) return;

        const prevPane = currentPane.previousElementSibling;

        if (!prevPane) return;

        const prevTabLink = document.querySelector(
          `.nav-link[href="#${prevPane.id}"]`,
        );

        if (prevTabLink) {
          const tab = new window.bootstrap.Tab(prevTabLink);

          tab.show();
        }
      });
    });
  }, []);

  const [categoryList, setCategoryList] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}getJobCategory`);

      console.log(response.data.jobCategories);

      setCategoryList(response.data.jobCategories);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!isFreelanceSelected && formData.TJM) {
      setFormData((prev) => ({
        ...prev,
        TJM: "",
      }));
    }
  }, [isFreelanceSelected]);
  const fetchCountryList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}get/countries`);
      setCountryList(response.data.countries || []); // depends on your backend response shape
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchCategoryList();
    fetchCountryList();
  }, []);

  useEffect(() => {
    if (Array.isArray(formData.city)) {
      setSelectedCities(formData.city);
    }
  }, [formData.city]);

  const [tagInput, setTagInput] = useState("");

  // Replace handleAddTag with reusable function

  const handleAddTag = () => {
    const skill = tagInput.trim();

    if (skill === "") return;

    // prevent duplicate skill
    if (formData.tags.includes(skill)) {
      toast.error("Skill already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, skill],
    }));

    setTagInput("");
  };

  // Add Enter key support
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((item) => item !== tag),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files, options } = e.target;

    setFormData((prev) => {
      let updated = { ...prev };

      // MULTIPLE SELECT
      if (name === "employmentType") {
        const selectedValues = Array.from(options)
          .filter((option) => option.selected)
          .map((option) => option.value);

        updated.employmentType = selectedValues;
      }

      // CHECKBOX
      else if (type === "checkbox") {
        updated[name] = checked;
      }

      // FILE
      else if (type === "file") {
        updated[name] = files[0];
      }

      // Prevent negative values
      else if (name === "TJM" || name === "availablePosts") {
        updated[name] = value < 0 ? "" : value;
      }

      // NORMAL INPUT
      else {
        updated[name] = value;
      }

      return updated;
    });
  };
  const fetchCitiesByCountry = async (countryId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}getCitiesByCountry?countryId=${countryId}`,
      );
      const cities = response.data?.cities || [];
      setCityList(cities);

      // ✅ If editing, keep previously selected cities (if they still exist in the list)
      if (formData.city?.length) {
        const validCities = formData.city.filter((cityName) =>
          cities.some((c) => c.name === cityName),
        );
        setSelectedCities(validCities);
      }
    } catch (error) {
      console.error("❌ Error fetching cities:", error);
      setCityList([]);
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
    if (jobFromState?.country && countryList.length > 0) {
      const matchedCountry = countryList.find(
        (c) => c._id === jobFromState.country,
      );
      if (matchedCountry?.id) {
        fetchCitiesByCountry(matchedCountry.id);
      }
    }
  }, [countryList]);

  const handleCityChange = (event) => {
    const {
      target: { value },
    } = event;

    const updatedCities = typeof value === "string" ? value.split(",") : value;

    setSelectedCities(updatedCities);

    setFormData((prev) => {
      const updated = { ...prev, cities: updatedCities };

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        handlePublishJob(updated, false);
      }, 1000);

      return updated;
    });
  };
  useEffect(() => {
    if (jobFromState?._id) {
      if (jobFromState.expiresAt) {
        setExpiresAt(
          new Date(jobFromState.expiresAt).toISOString().split("T")[0],
        );
      } else {
        setExpiresAt(getDefaultExpiryDate());
      }
    }
  }, [jobFromState]);
  const handlePublishJob = async (
    data = formData,
    // isPublish = false,
    statusType = null,
    scheduleDate = null,
    expiresAt = null,
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found");
        return;
      }
      const minSalary = Number(data.minSalary || 0);
      const maxSalary = Number(data.maxSalary || 0);

      if (data.minSalary && !data.maxSalary) {
        toast.error("Please enter Maximum salary");
        return;
      }

      if (!data.minSalary && data.maxSalary) {
        toast.error("Please enter Minimum salary");
        return;
      }

      if (data.minSalary && data.maxSalary) {
        if (minSalary <= 0 || maxSalary <= 0) {
          toast.error("Salary must be greater than 0");
          return;
        }

        if (minSalary > maxSalary) {
          toast.error("Minimum salary cannot be greater than Maximum salary");
          return;
        }

        if (minSalary === maxSalary) {
          toast.error("Minimum salary and Maximum salary cannot be the same");
          return;
        }
      }
      if (Number(data.TJM) < 0) {
        toast.error("TJM cannot be negative");
        return;
      }

      if (Number(data.availablePosts) <= 0) {
        toast.error("Available jobs must be greater than 0");
        return;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedExpiry = expiresAt
        ? new Date(expiresAt)
        : new Date(getDefaultExpiryDate());
      selectedExpiry.setHours(0, 0, 0, 0);
      if (statusType === "published") {
        if (!selectedExpiry || selectedExpiry < today) {
          toast.error("Expiry date cannot be in the past");
          return;
        }
      }
      const isFreelanceSelected = data.employmentType?.some(
        (item) => item?.label?.trim().toLowerCase() === "freelance",
      );

      if (!data.jobTitle?.trim()) {
        toast.error("Please enter Job Title");
        return;
      }

      if (!data.jobCategory || data.jobCategory.length === 0) {
        toast.error("Please select Job Category");
        return;
      }
      if (isFreelanceSelected && !data.TJM) {
        toast.error("Please enter TJM");
        return;
      }
      if (data.isAssessmentRequired && !data.assessment) {
        toast.error("Please select an assessment");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("job_id", id || jobFromState._id);
      formDataToSend.append("jobTitle", data.jobTitle || "");
      formDataToSend.append(
        "jobCategory",
        JSON.stringify(data.jobCategory.map((item) => item.value)),
      );
      formDataToSend.append("minimumLevel", data.minimumLevel || "");
      formDataToSend.append(
        "employmentType",
        JSON.stringify(data.employmentType.map((item) => item.value)),
      );
      formDataToSend.append(
        "recruitmentProcess",
        JSON.stringify(data.recruitmentProcess || []),
      );
      formDataToSend.append("TJM", isFreelanceSelected ? data.TJM || "" : "");
      formDataToSend.append("remote", data.remote || "");
      formDataToSend.append("jobAddress", data.jobAddress || "");
      formDataToSend.append("city", JSON.stringify(data.city || []));
      formDataToSend.append("region", data.region || "");
      formDataToSend.append("country", data.Country || "");
      formDataToSend.append("shortDescription", data.shortDescription || "");
      formDataToSend.append("tags", JSON.stringify(data.tags || []));
      formDataToSend.append("jobDescription", data.jobDescription || "");
      formDataToSend.append("enableExternalApply", data.enableExternalApply);
      formDataToSend.append("ExternalApplyLink", data.ExternalApplyLink || "");
      formDataToSend.append("confidentialJobPost", data.confidentialJobPost);
      formDataToSend.append(
        "enableRemovalRelevantJobs",
        data.enableRemovalRelevantJobs,
      );

      formDataToSend.append("enableFeaturedJob", data.enableFeaturedJob);
      formDataToSend.append("referenceId", data.referenceId || "");
      formDataToSend.append(
        "enableEmailNotification",
        data.enableEmailNotification,
      );
      formDataToSend.append("availablePosts", data.availablePosts || "");
      formDataToSend.append("minSalary", data.minSalary || "");
      formDataToSend.append("maxSalary", data.maxSalary || "");
      formDataToSend.append("isAssessmentRequired", data.isAssessmentRequired);
      formDataToSend.append("assessment", data.assessment || "");
      formDataToSend.append(
        "recruitmentSteps",
        JSON.stringify(data.recruitmentSteps || []),
      );
      formDataToSend.append(
        "retry_period_days",
        data.validation_required ? data.retry_period_days : "0",
      );
      formDataToSend.append(
        "validation_required",
        data.validation_required ? "true" : "false",
      );
      // **Core Logic** Preserve existing status for auto-save, set for explicit actions
      if (statusType) {
        const finalStatus = statusType;
        if (finalStatus === "published") {
          formDataToSend.append("status", "published");
          formDataToSend.append("expiresAt", expiresAt);
        } else if (finalStatus === "scheduled") {
          formDataToSend.append("status", "scheduled");
          formDataToSend.append("scheduleDate", scheduleDate);
        } else {
          formDataToSend.append("status", "draft");
        }
      }
      if (data.coverPhoto) {
        formDataToSend.append("jobCoverPhoto", data.coverPhoto);
      }
      console.log("🚀 Sending to API:", Object.fromEntries(formDataToSend));
      const response = await axios.post(
        `${API_BASE_URL}updateJob`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("✅ Job Updated:", response.data);
      // ✅ Only navigate if this is an explicit publish/save action (not auto-save on change)
      if (statusType) {
        navigate(fromPath, {
          state: {
            jobTitle: data.jobTitle,
            jobCategory: data.jobCategory,
          },
        });
      }
    } catch (error) {
      const message = error.response?.data?.message;
      const exhausted = error.response?.data?.is_exhausted;

      toast.error(message || "Something went wrong while publishing the job.");

      if (exhausted === 1) {
        setTimeout(() => {
          navigate("/add-plan");
        }, 2000);
      }

      console.error("❌ Error creating job:", error.response || error);
    }
  };

  const simpleJobCredit = 1;
  const featuredJobCredit = formData.enableFeaturedJob ? 1 : 0;

  const totalCredits = simpleJobCredit + featuredJobCredit;
  const totalCredits1 = simpleJobCredit;

  // top of component (before return)
  const today = new Date();
  console.log(expiresAt);
  const expiryDate = expiresAt ? new Date(expiresAt) : null;

  const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  console.log(diffDays);
  // ===============================
  // Add State (already have aiLoading)
  // ===============================
  const generateJobDescription = async () => {
    try {
      if (!formData.jobTitle?.trim()) {
        toast.error("Please enter Job Title");
        return;
      }

      if (!formData.jobCategory || formData.jobCategory.length === 0) {
        toast.error("Please select Job Category");
        return;
      }

      setAiLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        jobTitle: formData.jobTitle || "",

        jobCategory: formData.jobCategory.map((item) => item.label),

        skills: formData.tags || [],

        experience:
          seniorityLevels.find((item) => item._id === formData.minimumLevel)
            ?.name || "",

        employmentType: formData.employmentType.map((item) => item.label),

        city: formData.city || [],

        country:
          countryList.find((item) => item._id === formData.Country)?.name || "",

        shortDescription: formData.shortDescription || "",

        tags: formData.tags || [],
      };

      const response = await axios.post(
        `${API_BASE_URL}generate-job-description`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          jobDescription: response.data.description || "",
        }));

        toast.success("Job Description Generated Successfully");
      } else {
        toast.error("Failed to generate description");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setAiLoading(false);
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Job Details Form</h1>
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
                <Link to={fromPath}>
                  <i className="fa-solid fa-angle-right" />{" "}
                  {fromPath === "/applied-jobs-list"
                    ? "Applied Jobs"
                    : "Job Post"}
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Job Details Form
              </li>
            </ol>
          </div>

          <div className="publish-job-payment-details">
            <div className="tab-content">
              <div id="menu1" className="tab-pane fade show active">
                <div className="job-details-form-area">
                  <div className="job-details-form-heading">
                    <h3>Job Details</h3>
                  </div>

                  <form>
                    <div className="job-details-input-form-info">
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Job Title*</label>
                            <input
                              className="form-control"
                              type="text"
                              name="jobTitle"
                              value={formData.jobTitle}
                              onChange={handleChange}
                              placeholder="Enter Job Title"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Minimum level </label>
                            <select
                              className="form-select form-control"
                              name="minimumLevel"
                              value={formData.minimumLevel}
                              onChange={handleSeniorityChange}
                            >
                              <option value="" disabled>
                                Select minimum level
                              </option>

                              {seniorityLevels.map((level) => (
                                <option key={level._id} value={level._id}>
                                  {level.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Employment Type</label>

                            <Select
                              isMulti
                              options={jobTypes?.map((type) => ({
                                value: type._id, // pass id
                                label: type.name, // show name
                                name: type.name, // extra field if needed
                              }))}
                              placeholder="Select employment type"
                              value={formData.employmentType}
                              onChange={(selected) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  employmentType: selected || [],
                                }))
                              }
                            />
                          </div>
                        </div>
                        {isFreelanceSelected && (
                          <div className="col-lg-6 col-md-6 mt-3">
                            <div className="form-group">
                              <label>TJM (Taux Journalier Moyen)</label>

                              <input
                                type="number"
                                min="0"
                                className="form-control"
                                name="TJM"
                                value={formData.TJM}
                                onChange={handleChange}
                                placeholder="Enter TJM"
                              />
                            </div>
                          </div>
                        )}
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>
                              Remote
                              {/* <span className="text-danger">*</span> */}
                            </label>

                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                              name="remote"
                              value={formData.remote}
                              onChange={handleChange}
                            >
                              <option value="" disabled>
                                Select remote type
                              </option>

                              {/* ✅ New Option Added */}
                              <option value="Not remote (On-site only)">
                                Not remote (On-site only)
                              </option>

                              <option value="Fully remote">Fully remote</option>
                              <option value="Partialy-remote">
                                Partialy-remote
                              </option>
                              <option value="Temporarily remote">
                                Temporarily remote
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Job category</label>
                            <span className="text-danger">*</span>
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                              name="jobCategory"
                              value={formData.jobCategory}
                              onChange={handleChange}
                            >
                              <option value="" disabled>
                                Choose A Category
                              </option>
                              {categoryList.map((list) => (
                                <option value={list._id} key={list._id}>
                                  {list.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div> */}
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>
                              Job category{" "}
                              <span className="text-danger">*</span>
                            </label>

                            <Select
                              isMulti
                              options={categoryList.map((item) => ({
                                value: item._id,
                                label: item.name,
                              }))}
                              value={formData.jobCategory}
                              placeholder="Choose Categories"
                              onChange={(selected) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  jobCategory: selected || [],
                                }))
                              }
                            />
                          </div>
                        </div>
                        {/* Country Field */}
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Country</label>
                            <select
                              className="form-select form-control"
                              aria-label="Select Country"
                              name="Country"
                              value={formData.Country}
                              onChange={handleCountryChange}
                            >
                              <option value="" disabled>
                                Choose a Country
                              </option>
                              {countryList.map((country) => (
                                <option
                                  value={country._id}
                                  key={country._id}
                                  data-id={country.id} // ✅ store numeric id
                                >
                                  {country.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Cities */}
                        {/* City Selection (Searchable Multi-Select) */}
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Select City</label>
                            <div className="multi-select-container">
                              <div
                                className="selected-items"
                                onClick={() => setShowCityOptions(true)}
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  border: "1px solid #ccc",
                                  borderRadius: "6px",
                                  padding: "6px",
                                  cursor: "text",
                                }}
                              >
                                {/* Show selected city tags */}
                                {selectedCities.map((cityName) => (
                                  <span
                                    key={cityName}
                                    className="tag"
                                    style={{
                                      background: "#007bff",
                                      color: "white",
                                      borderRadius: "4px",
                                      padding: "3px 6px",
                                      margin: "2px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {cityName}
                                    <i
                                      className="fa-solid fa-xmark"
                                      style={{
                                        cursor: "pointer",
                                        marginLeft: "6px",
                                      }}
                                      onClick={() => handleRemoveCity(cityName)}
                                    />
                                  </span>
                                ))}

                                {/* Search Input */}
                                <input
                                  type="text"
                                  placeholder="Search city..."
                                  value={citySearchTerm}
                                  onChange={(e) =>
                                    setCitySearchTerm(e.target.value)
                                  }
                                  onFocus={() => setShowCityOptions(true)}
                                  style={{
                                    flex: 1,
                                    border: "none",
                                    outline: "none",
                                    minWidth: "100px",
                                  }}
                                />
                              </div>

                              {/* Dropdown list */}
                              {showCityOptions && (
                                <ul
                                  className="options-list"
                                  style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "6px",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    background: "#fff",
                                    position: "absolute",
                                    width: "100%",
                                    zIndex: 1000,
                                    marginTop: "4px",
                                    padding: 0,
                                    listStyle: "none",
                                  }}
                                >
                                  {filteredCities.length > 0 ? (
                                    filteredCities.map((city) => (
                                      <li
                                        key={city._id}
                                        onClick={() => toggleCity(city.name)}
                                        className={
                                          selectedCities.includes(city.name)
                                            ? "selected"
                                            : ""
                                        }
                                        style={{
                                          padding: "6px 10px",
                                          cursor: "pointer",
                                          background: selectedCities.includes(
                                            city.name,
                                          )
                                            ? "#007bff"
                                            : "transparent",
                                          color: selectedCities.includes(
                                            city.name,
                                          )
                                            ? "white"
                                            : "black",
                                        }}
                                      >
                                        {city.name}
                                        {selectedCities.includes(city.name) && (
                                          <span style={{ float: "right" }}>
                                            ✔
                                          </span>
                                        )}
                                      </li>
                                    ))
                                  ) : (
                                    <li
                                      style={{
                                        padding: "6px 10px",
                                        color: "#888",
                                      }}
                                    >
                                      No cities found
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="job-description-box-info">
                  <h3>Short Description</h3>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      placeholder="Enter a short description for this job post"
                      rows={10}
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="post-job-form-info-area">
                  <div className="input-info-edit-area form-heading-info">
                    <h3>Tags</h3>
                    <span className="heading-small-description">
                      Add tags to your job post. This will help it appear in as
                      many relevant job posts as possible.
                    </span>
                  </div>

                  <div className="profile-form">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="enter-skill-info">
                          <div className="form-group">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter Skills"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleTagKeyDown}
                            />
                          </div>
                          <div
                            className="skill-btn-info"
                            style={{ width: "22%" }}
                          >
                            <button
                              className="default-btn btn"
                              onClick={handleAddTag}
                              type="button"
                            >
                              Add Skills
                            </button>
                          </div>
                        </div>

                        <div className="enter-skill-tag-info">
                          <br />
                          <ul>
                            {formData.tags.map((tag) => (
                              <li key={tag}>
                                {tag}{" "}
                                <i
                                  className="fa-solid fa-xmark"
                                  onClick={() => handleRemoveTag(tag)}
                                  style={{ cursor: "pointer" }}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="job-description-box-info">
                  <div
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
                      "margin-bottom": "15px",
                    }}
                  >
                    <h3 style={{ margin: "0px" }}>Job Description</h3>
                    <button
                      type="button"
                      className="btn default-btn"
                      onClick={generateJobDescription}
                      disabled={aiLoading}
                      style={{
                        padding: "8px 15px",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        opacity: aiLoading ? 0.7 : 1,
                      }}
                    >
                      {aiLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          ></span>
                          Generating...
                        </>
                      ) : (
                        <>✨ Generate with AI</>
                      )}
                    </button>
                  </div>
                  <div className="form-group">
                    {/* <CKEditor
                      editor={ClassicEditor}
                      data={formData.jobDescription}
                      onChange={(event, editor) => {
                        const data = editor.getData();

                        // Update formData
                        setFormData((prev) => {
                          const updated = { ...prev, jobDescription: data };

                          // ✅ Clear any validation error
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            jobDescription: "",
                          }));

                          // ✅ Trigger same debounce auto-save logic
                          if (debounceTimer.current)
                            clearTimeout(debounceTimer.current);
                          debounceTimer.current = setTimeout(() => {
                            handlePublishJob(updated, false);
                          }, 1000);

                          return updated;
                        });
                      }}
                    /> */}
                    <CKEditor
                      editor={ClassicEditor}
                      data={formData.jobDescription}
                      onChange={(event, editor) => {
                        const data = editor.getData();

                        setFormData((prev) => ({
                          ...prev,
                          jobDescription: data,
                        }));

                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          jobDescription: "",
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="job-description-box-info">
                  <div
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
                      "margin-bottom": "15px",
                    }}
                  >
                    <h3 style={{ margin: "0px" }}>Processus de recrutement</h3>

                    <button
                      type="button"
                      className="btn default-btn"
                      onClick={addStep}
                    >
                      <i className="fa-solid fa-plus" /> Ajouter une étape
                    </button>
                  </div>

                  <div className="recruitment-steps-list">
                    {formData.recruitmentProcess.map((item, index) => (
                      <div
                        key={index}
                        className="form-group mb-4 p-3 border rounded"
                        style={{
                          position: "relative",
                          background: "#fcfcfc",
                        }}
                      >
                        <div className="d-flex align-items-center mb-2">
                          <span className="badge bg-primary me-2">
                            Etape {item.step}
                          </span>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger ms-auto"
                            onClick={() => removeStep(index)}
                          >
                            <i className="fa-solid fa-trash-can" />
                          </button>
                        </div>

                        <textarea
                          className="form-control"
                          rows={3}
                          value={item.title}
                          onChange={(e) =>
                            handleStepChange(index, e.target.value)
                          }
                          placeholder={`Description de l'étape ${item.step}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="job-description-box-info">
                  <div id="menu2" class="job-details-form-area mb-1">
                    <div className="input-info-edit-area form-heading-info">
                      <h3>Options</h3>
                      <hr></hr>
                    </div>
                    <div className="job-option-branding-input-area">
                      <div className="job-option-branding-heading">
                        <h3>External Apply</h3>
                        <span className="heading-small-description">
                          Add tags to your job post. This will help it appear in
                          as many relevant job posts as possible.
                        </span>
                      </div>

                      <div className="job-option-branding-content-switch">
                        <div className="job-option-branding-content">
                          <p>Enable external apply</p>
                        </div>
                        <div className="job-option-branding-switch">
                          <label className="switch">
                            <input
                              type="checkbox"
                              name="enableExternalApply"
                              checked={formData.enableExternalApply}
                              onChange={handleChange}
                            />
                            <span className="slider round" />
                          </label>
                        </div>
                      </div>
                      {formData.enableExternalApply && (
                        <div className="col-lg-12 col-md-12 mt-2">
                          <div className="form-group">
                            <label>External Url</label>
                            <span className="text-danger">*</span>
                            <input
                              className="form-control mt-2"
                              type="text"
                              name="ExternalApplyLink"
                              value={formData.ExternalApplyLink}
                              onChange={handleChange}
                              placeholder="Enter the link"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="job-option-branding-input-area">
                      <div className="job-option-branding-heading">
                        <h3>Job Assessment</h3>
                        <span className="heading-small-description">
                          Select job assessments for your job post. This helps
                          your job appear in relevant searches and reach the
                          right candidates.
                        </span>
                      </div>
                      <div className="job-option-branding-content-switch">
                        <div className="job-option-branding-content">
                          <p>Enable Job Assessment</p>
                        </div>
                        <div className="job-option-branding-switch">
                          <label className="switch">
                            <input
                              type="checkbox"
                              name="isAssessmentRequired"
                              checked={formData.isAssessmentRequired}
                              onChange={handleAssessmentToggle}
                            />
                            <span className="slider round" />
                          </label>
                        </div>
                      </div>

                      {formData.isAssessmentRequired && (
                        <>
                          <div className="col-lg-12 col-md-12 mt-2">
                            <div className="form-group">
                              <label>Select Job Assessment</label>
                              <span className="text-danger">*</span>
                              <select
                                className="form-select form-control mt-2"
                                name="assessment"
                                value={formData.assessment}
                                onChange={handleAssessment}
                                required
                              >
                                <option value="" disabled>
                                  Select job assessment
                                </option>
                                {Object.keys(groupedAssessments).map(
                                  (source) => (
                                    <optgroup
                                      key={source}
                                      label={`${source} Assessments`}
                                    >
                                      {groupedAssessments[source].map(
                                        (assessment) => (
                                          <option
                                            key={assessment._id}
                                            value={assessment._id}
                                          >
                                            {assessment.assessmentName}
                                          </option>
                                        ),
                                      )}
                                    </optgroup>
                                  ),
                                )}
                              </select>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="job-option-branding-input-area">
                      <div className="job-option-branding-heading">
                        <h3>Allow Retry After Failure</h3>
                        <span className="heading-small-description">
                          Enable this to allow candidates to retry the
                          assessment if it fails.
                        </span>
                      </div>

                      <div className="job-option-branding-content-switch">
                        <div className="job-option-branding-content">
                          <p>Enable Retry</p>
                        </div>
                        <div className="job-option-branding-switch">
                          <label className="switch">
                            <input
                              type="checkbox"
                              name="validation_required"
                              checked={formData.validation_required}
                              onChange={handleChange}
                            />
                            <span className="slider round" />
                          </label>
                        </div>
                      </div>
                      {formData.validation_required && (
                        <div className="col-lg-12 col-md-12 mt-2">
                          <div className="form-group">
                            <label>Retry Cooldown (days)</label>
                            <span className="text-danger">*</span>
                            <input
                              className="form-control mt-2"
                              type="number"
                              name="retry_period_days"
                              value={formData.retry_period_days}
                              onChange={handleChange}
                              placeholder="Enter retry cooldown days"
                              min="1"
                              disabled={!formData.validation_required}
                            />
                            <small className="text-muted">
                              (0 = immediate retry)
                            </small>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="job-option-branding-input-area">
                      <div className="job-option-branding-heading">
                        <h3>Confidential job post</h3>
                        <span className="heading-small-description">
                          Enable this option to hide your company details from
                          the job post. (Anonymous Company)
                        </span>
                      </div>
                      <div className="job-option-branding-content-switch">
                        <div className="job-option-branding-content">
                          <p>Enable confidential post</p>
                        </div>
                        <div className="job-option-branding-switch">
                          <label className="switch">
                            <input
                              type="checkbox"
                              name="confidentialJobPost"
                              checked={formData.confidentialJobPost}
                              onChange={handleChange}
                            />
                            <span className="slider round" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="job-option-branding-input-area">
                      <div className="job-option-branding-heading">
                        <h3>Reference ID</h3>
                        <span className="heading-small-description">
                          You can give your job post a unique Reference ID. This
                          can help you distinguish it and find it easier.
                        </span>
                      </div>
                      <div className="job-option-branding-input-box">
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="text"
                            name="referenceId"
                            placeholder="e.g. PROD3913"
                            value={formData.referenceId}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="job-option-branding-input-area">
                      <div className="job-option-branding-heading">
                        <h3>Number of Available Jobs </h3>
                        <span className="heading-small-description">
                          Specify how many positions are available for this job
                          role.
                        </span>
                      </div>
                      <div className="job-option-branding-input-box">
                        <div className="form-group">
                          <input
                            type="number"
                            className="form-control"
                            name="availablePosts"
                            placeholder="Enter number of openings"
                            min="1"
                            value={formData.availablePosts}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="job-option-branding-input-area">
                      <div className="job-option-branding-heading">
                        <h3>Email notification</h3>
                        <span className="heading-small-description">
                          We can notify you via email when you receive a new
                          application for this job post.
                        </span>
                      </div>
                      <div className="job-option-branding-content-switch">
                        <div className="job-option-branding-content">
                          <p>Enable / Disable</p>
                        </div>

                        <div className="job-option-branding-switch">
                          <label className="switch">
                            <input
                              type="checkbox"
                              name="enableEmailNotification"
                              checked={formData.enableEmailNotification}
                              onChange={handleChange}
                            />
                            <span className="slider round" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="job-option-branding-input-area">
                      <div className="job-option-branding-heading">
                        <h3>Private job details</h3>
                        <span className="heading-small-description">
                          Private job details are non-visible to job seekers
                          that see your job post.
                        </span>
                      </div>
                      <div className="job-option-branding-input-box">
                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>
                                Min salary (Gross{" "}
                                {globalCurrency.symbol || globalCurrency.code})
                              </label>
                              {/* <span className="text-danger">*</span> */}
                              <input
                                className="form-control"
                                type="number"
                                name="minSalary"
                                min="0"
                                placeholder="Enter minimum salary"
                                value={formData.minSalary}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>
                                Max salary (Gross{" "}
                                {globalCurrency.symbol || globalCurrency.code})
                              </label>
                              {/* <span className="text-danger">*</span> */}
                              <input
                                className="form-control"
                                type="number"
                                name="maxSalary"
                                min="0"
                                placeholder="Enter maximum salary"
                                value={formData.maxSalary}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="job-description-box-info">
                  <div id="menu2" class="job-details-form-area mb-1">
                    <div className="input-info-edit-area form-heading-info">
                      <h3>Job Promotion</h3>
                      <hr></hr>
                    </div>

                    {creditInfo.featuredJobsAvailable && (
                      <>
                        <h3>Featured Your Job</h3>
                        <p className="text-muted small">
                          Increase visibility of your job post with these
                          promotion options.
                        </p>

                        {/* FEATURED JOB */}
                        <div className="job-option-branding-content-switch">
                          <div className="job-option-branding-content">
                            <p>Featured Job</p>
                            <span className="feature-desc">
                              Priority placement — job appears at top of list
                            </span>
                          </div>

                          <div className="job-option-branding-switch">
                            <label className="switch">
                              <input
                                type="checkbox"
                                name="enableFeaturedJob"
                                checked={formData.enableFeaturedJob}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    enableFeaturedJob: e.target.checked,
                                  }))
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                        </div>
                        {/* {formData.isFeatured && ( */}

                        {formData.enableFeaturedJob && (
                          <div className="col-lg-12 mt-3">
                            <div className="card border-warning shadow-sm">
                              <div className="card-body">
                                <h6 className="text-warning mb-3">
                                  ⭐ Featured Job Benefits
                                </h6>

                                <ul className="mb-0">
                                  <li>
                                    Job will appear on the{" "}
                                    <strong>Homepage</strong>
                                  </li>
                                  <li>
                                    Job will be highlighted in{" "}
                                    <strong>Search Results</strong>
                                  </li>
                                  <li>
                                    Job will appear in{" "}
                                    <strong>Highlighted Listings</strong>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                        <hr />
                      </>
                    )}

                    <h5 className="mt-3">Set Job Expiry Date</h5>

                    <p className="text-muted small">
                      Default expiry is set to 30 days. You can change it if
                      required.
                    </p>

                    <input
                      type="date"
                      className="form-control mt-2"
                      value={expiresAt}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        const selected = new Date(e.target.value);
                        selected.setHours(0, 0, 0, 0);

                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (selected < today) {
                          toast.error("Please select a future expiry date");
                          return;
                        }

                        setExpiresAt(e.target.value);
                      }}
                    />

                    <div className="job-detail-in-cart-info">
                      <div className="job-create-form-back-next-info">
                        <div className="job-create-form-back-next-btn">
                          <button
                            onClick={() => handlePublishJob(formData, "draft")}
                            className="default-btn btn"
                          >
                            Save Draft
                          </button>
                        </div>
                        <div className="job-create-form-back-next-btn">
                          <button
                            onClick={() => {
                              if (!expiresAt) {
                                toast.error("Please select an expiry date");
                                return;
                              }

                              handlePublishJob(
                                formData,
                                "published",
                                null,
                                expiresAt,
                              );
                            }}
                            className="default-btn btn"
                          >
                            Publish Job
                          </button>
                        </div>
                        <div className="job-create-form-back-next-btn">
                          <button
                            // onClick={() => handlePublishJob(formData, "published")}
                            onClick={() => setShowScheduleDate(true)}
                            className="default-btn btn"
                          >
                            Schedule Job
                          </button>
                        </div>
                      </div>
                    </div>
                    {showScheduleDate && (
                      <div className="schedule-modal-overlay">
                        <div className="schedule-modal">
                          <h3>Schedule Job Publishing</h3>
                          <label className="mt-3">Select Schedule Date</label>
                          <input
                            type="date"
                            className="form-control mt-1"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                          />
                          <div className="modal-button-group mt-4">
                            <button
                              className="default-btn btn"
                              onClick={() =>
                                handlePublishJob(
                                  formData,
                                  "scheduled",
                                  scheduleDate,
                                )
                              }
                            >
                              Confirm Schedule
                            </button>
                            <button
                              className="default-btn btn btn-light"
                              onClick={() => setShowScheduleDate(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="job-payment-detail-box-info">
              {/* Header */}
              <div className="job-payment-detail-info mb-3">
                <h4 style={{ fontWeight: "700", marginBottom: "0" }}>
                  Payment Details
                </h4>
              </div>

              {/* Info Alert */}
              <div
                className="alert alert-info"
                style={{
                  borderRadius: "10px",
                  fontSize: "14px",
                  padding: "14px",
                  marginBottom: "20px",
                }}
              >
                <i className="fa-solid fa-circle-info me-2"></i>
                Your job post will be active for{" "}
                <strong>{diffDays > 0 ? diffDays : 30}</strong> days once
                published. published.
              </div>
              {/* Featured Job Details */}

              {/* KPI Cards Better UI */}
              <div className="row g-3 mb-4">
                {/* Credits Left */}
                <div className="col-4">
                  <div
                    style={{
                      background: "#f8f9ff",
                      borderRadius: "12px",
                      padding: "10px 2px",
                      textAlign: "center",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        marginBottom: "8px",
                        color: "#666",
                      }}
                    >
                      Credits Left
                    </p>

                    <h3
                      style={{ color: "#2d6cdf", margin: 0, fontSize: "15px" }}
                    >
                      {creditInfo.fullCredit?.jobCredits?.total === -1
                        ? "Unlimited"
                        : `${creditInfo.fullCredit?.jobCredits?.remaining || 0}/${
                            creditInfo.fullCredit?.jobCredits?.total || 0
                          }`}
                    </h3>
                  </div>
                </div>

                {/* Daily Limit */}
                <div className="col-4">
                  <div
                    style={{
                      background: "#f8fff8",
                      borderRadius: "12px",
                      padding: "10px 2px",
                      textAlign: "center",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        marginBottom: "8px",
                        color: "#666",
                      }}
                    >
                      Daily Limit
                    </p>

                    <h3
                      style={{ color: "#198754", margin: 0, fontSize: "15px" }}
                    >
                      {creditInfo.dailyLimit === -1
                        ? "Unlimited"
                        : creditInfo.dailyLimit}
                    </h3>
                  </div>
                </div>

                {/* Used Today */}
                <div className="col-4">
                  <div
                    style={{
                      background: "#fff8f8",
                      borderRadius: "12px",
                      padding: "10px 2px",
                      textAlign: "center",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        marginBottom: "8px",
                        color: "#666",
                      }}
                    >
                      Used Today
                    </p>

                    <h3
                      style={{ color: "#dc3545", margin: 0, fontSize: "15px" }}
                    >
                      {creditInfo.usedToday}
                    </h3>
                  </div>
                </div>
              </div>
              {creditInfo.featuredJobsAvailable && (
                <div
                  className="mt-4 p-3"
                  style={{
                    background: "#fff8e1",
                    borderRadius: "12px",
                    border: "1px solid #ffe082",
                  }}
                >
                  <h5
                    style={{
                      fontWeight: "700",
                      marginBottom: "5px",
                      fontSize: "16px",
                      color: "#ff9800",
                    }}
                  >
                    Featured Job Benefits
                  </h5>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Featured Jobs</span>
                    <strong>{creditInfo.maxFeaturedJobs}</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Used Featured Jobs</span>
                    <strong>{creditInfo.featuredJobsUsed || 0}</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Remaining Featured Jobs</span>
                    <strong>
                      {creditInfo.maxFeaturedJobs - creditInfo.featuredJobsUsed}
                    </strong>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Max Active Featured</span>
                    <strong>{creditInfo.maxActiveFeaturedJobs}</strong>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Expiry Duration</span>
                    <strong>{creditInfo.featuredJobDurationDays} Days</strong>
                  </div>
                </div>
              )}
              {/* Charges */}
              <div
                className="border-top "
                style={{
                  marginTop: "20px",
                }}
              >
                <div
                  className="d-flex justify-content-between "
                  style={{
                    paddingTop: "15px",
                  }}
                >
                  <span>Job Post</span>
                  <strong>1 Credit</strong>
                </div>

                {formData.enableFeaturedJob && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Featured Job</span>
                    <strong>1 Credit</strong>
                  </div>
                )}
              </div>

              {/* Total */}
              <div
                className="d-flex justify-content-between mt-3 pt-3"
                style={{ borderTop: "1px dashed #ddd" }}
              >
                <span style={{ fontWeight: "700", color: "#0d6efd" }}>
                  Total Cost
                </span>
                <span style={{ fontWeight: "700", color: "#ff6600" }}>
                  {formData.enableFeaturedJob
                    ? "1 Job Credit + 1 Featured Credit"
                    : "1 Job Credit"}
                </span>
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

export default JobDetailsForm;
