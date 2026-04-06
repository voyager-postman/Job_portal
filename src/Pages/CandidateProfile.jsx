import axios from "axios";
import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
function CandidateProfile() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const degreeOptions = [
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
  const jobTypeOptions = [
    { value: "Immediate", label: "Immediate" },
    { value: "Temporary", label: "Temporary" },
    { value: "Freelance", label: "Freelance" },
    { value: "Permanent", label: "Permanent" },
  ];
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { logout, updateProfileImage, updateName } = useAuth();
  const [editWork, setEditWork] = useState(false);
  const [editEducation, setEditEducation] = useState(false);
  const [editingLanguageId, setEditingLanguageId] = useState(null);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const DEFAULT_IMAGE = "jobPortal/assets/images/dashboard/images.png";
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [showAllExp, setShowAllExp] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  const [profileDetails, setProfileDetails] = useState("");

  const [jobTypes, setJobTypes] = useState([]);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [editSummary, setEditSummary] = useState(false);
  const [editCareerGoals, setEditCareerGoals] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);
  const [occupationTypes, setOccupationTypes] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [languageEditMode, setLanguageEditMode] = useState(false);
  const [certificateEditMode, setCertificateEditMode] = useState(false);

  const PROFICIENCY_LEVELS = [
    { label: "Basic", code: "Basic" },
    { label: "Limited working", code: "Limited working" },
    { label: "Professional working", code: "Professional working" },
    { label: "Full professional", code: "Full professional" },
    { label: "Native / Bilingual", code: "Native / Bilingual" },
  ];

  const [masterLanguages, setMasterLanguages] = useState([]); // from /getLanguage
  const [languageForm, setLanguageForm] = useState({
    language_id: "", // only when editing
    language: "", // language name from dropdown
    proficiency: "",
    comment: "", // NEW FIELD
  });
  useEffect(() => {
    fetch(`${API_BASE_URL}getActiveSalaryRangeList`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSalaryRanges(data.data);
        }
      })
      .catch((err) => console.log("Error:", err));
  }, []);
  const [image, setImage] = useState(DEFAULT_IMAGE);
  console.log(image);
  const [storedImage, setStoredImage] = useState(null);

  const fileInputRef = useRef(null);
  const handleFileChange1 = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Only PDF, DOC, and DOCX files are allowed.");
        return;
      }
      setError("");
      setFile(selectedFile); // for display
      setFormData1((prev) => ({
        ...prev,
        attachment: selectedFile,
      }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    const formData = new FormData();
    formData.append("profile", file);
    try {
      setIsLoadingJobs(true); // 🔵 START LOADER
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}updateProfileImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const profileImg = res.data?.profileImage;
      if (res.data?.success && profileImg && profileImg.trim() !== "") {
        const fullUrl = profileImg;
        setImage(fullUrl);
        updateProfileImage(fullUrl); // ✅ update header image instantly
      } else {
        setImage(DEFAULT_IMAGE);
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setImage(DEFAULT_IMAGE);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsLoadingJobs(false); // 🔵 STOP LOADER
    }
  };
  const JobListLoader = () => (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p>Loading Image, please wait...</p>
    </div>
  );

  const token = localStorage.getItem("token");
  const [cvFiles, setCvFiles] = useState([]); // List of uploaded CVs
  const [menuOpenId, setMenuOpenId] = useState(null); // Track which CV menu is open
  // ✅ Cover Letter states
  const [coverLetters, setCoverLetters] = useState([]); // uploaded cover letters
  const [menuOpenIdCL, setMenuOpenIdCL] = useState(null); // track which menu is open
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({
    certificate_id: "",
    title: "",
    issueDate: "",
  });

  const [formData1, setFormData1] = useState({
    attachment: null,
  });
  const [educationForm, setEducationForm] = useState({
    education_id: "",
    degree: "",
    University: "",
    startDate: "",
    endDate: "",
    currentlyStudyingHere: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [educationList, setEducationList] = useState([]);
  const [careerGoalsData, setCareerGoalsData] = useState({
    desiredJobTitle: "",
    employmentType: [],
    occupationType: "",
    availabilityToJoin: "",
    eligibleToWork: false,
    salaryAmount: "",
    salaryType: "Hourly",
    salaryCurrency: "MAD",
    lookingForJob: "",
  });
  const [workExperienceData, setWorkExperienceData] = useState({
    workHistory_id: "",
    companyName: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    yearOfExperience: "",
    currentlyWorkingHere: false,
    currentlyWorkingHereEmp: false,
    Description: "",
    EmploymentType: "",
    workLocation: "",
    salaryAmount: "",
    salaryCurrency: "MAD",
    salaryType: "Monthly",
  });
  const [profileVisible, setProfileVisible] = useState(true); // ✅ default true
  const [profileData, setProfileData] = useState("");
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [checkStatus, setCheckStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [citySearch, setCitySearch] = useState(""); // for search input
  const [visibilityMessage, setVisibilityMessage] = useState("");
  const [editPortfolioLinks, setEditPortfolioLinks] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editAboutRole, setEditAboutRole] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [editPersonal, setEditPersonal] = useState(false);
  const [summary, setSummary] = useState("");
  const [personalDetails, setPersonalDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "", // ✅ API key
    birthYear: "",
    gender: "",
    city: "",
    nationality: "",
  });

  const [aboutRole, setAboutRole] = useState({
    jobTitle: "",
    yearsOfExperience: "",
    jobCategory: "",
  });
  const [portfolioLinks, setPortfolioLinks] = useState({
    personalWebsite: "",
    github: "",
    linkedin: "",
  });
  console.log(profileData.eligibleToWorkInFrance);
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}candidate/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile data:", res.data);

      setProfileDetails(res.data.profileStats);
      setProfileVisible(res.data.profile?.profileVisible);
      setProfileData(res.data.profile); // ✅ set API response into state
      setCheckStatus(res.data.sectionStatus);
      if (res.data.profile?.skills) {
        setSkills(res.data.profile.skills);
      }
      setEducationList(res.data.profile?.education || []);
      setCvFiles(res.data.profile?.resumeUrls || []);
      setCoverLetters(res.data.profile?.coverLetter || []);

      const profileImg = res.data?.profile?.profileImage;
      if (profileImg && profileImg.trim() !== "") {
        setImage(profileImg); // stored image
      } else {
        setImage(DEFAULT_IMAGE); // fallback
      }
      const resLang = await axios.get(`${API_BASE_URL}getLanguage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("GetLanguage API response:", resLang.data);
      setMasterLanguages(resLang.data.languages || []); // ✅ ensure array
    } catch (error) {
      console.error("Error fetching candidate profile:", error);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  const countryOptions = countries.map((c) => ({
    value: c.phonecode, // numeric value to save
    label: `${c.emoji} +${c.phonecode} ${c.name}`,
  }));
  const term = (countryCode || "").toString().toLowerCase();
  const filteredCountries = countries.filter((c) => {
    const name = (c.name || "").toLowerCase();
    const phone = (c.phonecode || "").toString();
    const iso2 = (c.iso2 || "").toLowerCase();

    return name.includes(term) || phone.includes(term) || iso2.includes(term);
  });
  const fetchIndustries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getIndustries`);
      if (res.data.success && Array.isArray(res.data.industries)) {
        setOccupationTypes(res.data.industries);
      } else {
        setOccupationTypes([]);
      }
    } catch (err) {
      console.error("Error fetching industries:", err);
    }
  };
  useEffect(() => {
    fetchIndustries();
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

  const handleWorkLocationSearch = async (e) => {
    const value = e.target.value;

    setWorkExperienceData((prev) => ({
      ...prev,
      workLocation: value,
    }));

    if (!value.trim()) {
      setCitySuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}searchCities`, {
        params: { key: value },
      });

      if (res.data?.success && Array.isArray(res.data.cities)) {
        setCitySuggestions(res.data.cities);
      } else {
        setCitySuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCitySuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // When user selects city from dropdown
  const handleSelectWorkLocation = (city) => {
    setWorkExperienceData((prev) => ({
      ...prev,
      workLocation: `${city.name}, ${city.state_name}, ${city.country_name}`,
    }));
    setCitySuggestions([]); // hide dropdown
  };

  const userLanguages = profileData.languages || [];
  const handleSaveLanguage = async () => {
    if (!languageForm.language) {
      toast.error("Please select a language");
      return;
    }
    if (!languageForm.proficiency) {
      toast.error("Please select proficiency");
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const payload = {
        language_id: languageForm.language_id || undefined,
        language: languageForm.language,
        proficiency: languageForm.proficiency,
        comment: languageForm.comment,
      };

      const res = await axios.post(`${API_BASE_URL}updateLanguages`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        // ✅ use backend returned language object with correct _id
        const newLang = {
          _id: res.data.language?._id || res.data.language_id, // make sure to take backend id
          language: languageForm.language,
          proficiency: languageForm.proficiency,
          comment: languageForm.comment,
        };

        const updated = languageForm.language_id
          ? profileData.languages.map((l) =>
              l._id === languageForm.language_id ? newLang : l,
            )
          : [...(profileData.languages || []), newLang];

        setProfileData((prev) => ({ ...prev, languages: updated }));
        await fetchProfile();

        toast.success(
          languageForm.language_id ? "Language updated!" : "Language added!",
        );
        setLanguageForm({
          language_id: "",
          language: "",
          proficiency: "",
          comment: "",
        });
        setLanguageEditMode(false);
      }
    } catch (err) {
      console.error("Error saving language:", err);
      toast.error("Failed to save language");
    }
  };

  const handleDeleteLanguage = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}DeleteLanguage`,
        { language_id: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200) {
        setProfileData((prev) => ({
          ...prev,
          languages: prev.languages.filter((l) => l._id !== id),
        }));
        toast.success("Language deleted!");
      }
    } catch (err) {
      console.error("Error deleting language:", err);
      toast.error("Failed to delete language");
    }
  };

  const openAddForm = () => {
    setLanguageForm({ language_id: "", language: "", proficiency: "" });
    setLanguageEditMode(true);
    const collapse = document.getElementById("collapseLanguages");
    if (collapse && !collapse.classList.contains("show")) {
      new window.bootstrap.Collapse(collapse, { toggle: true });
    }
  };

  const openEditForm = (lang) => {
    setLanguageForm({
      language_id: lang._id,
      language: lang.language,
      proficiency: lang.proficiency,
      comment: lang.comment || "",
    });
    setLanguageEditMode(true);
    const collapse = document.getElementById("collapseLanguages");
    if (collapse && !collapse.classList.contains("show")) {
      new window.bootstrap.Collapse(collapse, { toggle: true });
    }
  };
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
    fetchCategoryList();
  }, []);
  console.log(portfolioLinks);
  console.log(profileData);
  const handleDelete = async () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    if (!comments.trim()) {
      toast.error("Please enter comments");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}DeleteAccount`,
        { reason, comments },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const modal = document.getElementById("exampleModaldlt");
      const modalInstance = window.bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      toast.success("Your account has been deleted successfully!");
      setTimeout(() => {
        logout();
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error("Failed to delete account.");
    }
  };

  const handleUploadCoverLetter = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    // ✅ Max 3 cover letters allowed
    if (coverLetters.length >= 3) {
      toast.error(
        "You can upload only up to 3 cover letters. Please delete one first.",
        { autoClose: 2000, theme: "colored" },
      );
      return;
    }

    const token = localStorage.getItem("token");

    for (let file of files) {
      if (coverLetters.length >= 3) break;

      // ✅ FILE SIZE CHECK (prevents 413)
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File "${file.name}" is too large. Max size is 2MB.`, {
          autoClose: 2000,
          theme: "colored",
        });
        continue; // ⛔ skip this file
      }

      const formData = new FormData();
      formData.append("coverLetter", file);

      try {
        const response = await axios.put(
          `${API_BASE_URL}updateCoverLetter`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.status === 200) {
          setCoverLetters((prev) => [
            ...prev,
            {
              name: file.name,
              url: response.data.coverLetterUrl,
              _id: String(response.data.coverLetterId || Date.now()),
            },
          ]);

          await fetchProfile();

          toast.success("Cover letter uploaded successfully!", {
            autoClose: 2000,
            theme: "colored",
          });
        }
      } catch (error) {
        console.error("Upload cover letter error:", error);

        // ✅ HANDLE 413 ERROR PROPERLY
        if (error.response?.status === 413) {
          toast.error(`File "${file.name}" is too large for upload.`, {
            autoClose: 2000,
            theme: "colored",
          });
        } else {
          toast.error("Failed to upload cover letter", {
            autoClose: 2000,
            theme: "colored",
          });
        }
      }
    }
  };

  const handleSelect = (c) => {
    const formatted = `${c.emoji.toUpperCase()} +${c.phonecode} ${c.name}`;
    setCountryCode(formatted); // input shows exact format
    setFormData((prev) => ({
      ...prev,
      country_code: String(c.phonecode),
    }));
    setOpen(false);
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const handleUploadCv = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    // ✅ Max 3 CVs allowed
    if (cvFiles.length >= 3) {
      toast.error("You can upload only up to 3 CVs. Please delete one first.", {
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    const token = localStorage.getItem("token");

    for (let file of files) {
      if (cvFiles.length >= 3) break;

      // ✅ FILE SIZE CHECK (prevents 413)
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File "${file.name}" is too large. Max size is 2MB.`, {
          autoClose: 2000,
          theme: "colored",
        });
        continue; // ⛔ skip this file, continue next
      }

      const formData = new FormData();
      formData.append("resume", file);

      try {
        const response = await axios.put(
          `${API_BASE_URL}updateResumeUrl`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.status === 200) {
          setCvFiles((prev) => [
            ...prev,
            {
              name: file.name,
              url: response.data.resumeUrl,
              _id: String(response.data.resumeId || Date.now()),
            },
          ]);

          await fetchProfile();

          toast.success("CV uploaded successfully!", {
            autoClose: 2000,
            theme: "colored",
          });
        }
      } catch (error) {
        console.error("Upload CV error:", error);

        // ✅ HANDLE 413 ERROR PROPERLY
        if (error.response?.status === 413) {
          toast.error(`File "${file.name}" is too large for upload.`, {
            autoClose: 2000,
            theme: "colored",
          });
        } else {
          toast.error("Failed to upload CV", {
            autoClose: 2000,
            theme: "colored",
          });
        }
      }
    }
  };

  const handleDeleteCoverLetter = async (clId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}DeleteCoverLetter`,
        { coverLetterId: String(clId) },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        setCoverLetters((prev) => prev.filter((cl) => cl._id !== clId));
        toast.success("Cover letter deleted successfully!", {
          autoClose: 2000,
          theme: "colored",
        });
      } else {
        toast.error("Failed to delete cover letter", {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Delete cover letter error:", error);
      toast.error("Failed to delete cover letter", {
        autoClose: 2000,
        theme: "colored",
      });
    }

    setMenuOpenIdCL(null);
  };

  // ✅ Delete CV
  const handleDeleteCv = async (cvId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}DeleteResume`,
        { resumeId: String(cvId) }, // ✅ ensure string
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        setCvFiles((prev) => prev.filter((cv) => cv._id !== cvId));
        toast.success("CV deleted successfully!", {
          autoClose: 2000,
          theme: "colored",
        });
      } else {
        toast.error("Failed to delete CV", {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Delete CV error:", error);
      toast.error("Failed to delete CV", { autoClose: 2000, theme: "colored" });
    }

    setMenuOpenId(null);
  };

  const handleSelectCity = (city) => {
    setPersonalDetails((prev) => ({
      ...prev,
      city: city.name,
      state: city.state_name,
      country: city.country_name,
    }));
    setCitySuggestions([]); // ✅ hide dropdown after selecting
  };
  // Prefill form for edit
  const handleEdit = () => {
    setCareerGoalsData({
      desiredJobTitle: profileData.careerGoals?.desiredJobTitle || "",
      employmentType: profileData.careerGoals?.employmentType || "",
      occupationType: profileData.careerGoals?.occupationType || "",
      availabilityToJoin:
        profileData.careerGoals?.availabilityToJoin || "Immediate",
      eligibleToWork: profileData.careerGoals?.eligibleToWork || false,
      salaryAmount: profileData.careerGoals?.salaryAmount || "",
      salaryType: profileData.careerGoals?.salaryType || "Hourly",
      salaryCurrency: profileData.careerGoals?.salaryCurrency || "MAD",
      lookingForJob: profileData.careerGoals?.lookingForJob || "",
    });
    setEditMode(true);

    const collapseElement = document.getElementById("collapseCareerGoals");
    if (collapseElement && !collapseElement.classList.contains("show")) {
      new window.bootstrap.Collapse(collapseElement, { toggle: true });
    }
  };

  // Section-specific change handler
  const handleCareerGoalsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCareerGoalsData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save Career Goals
  const handleSaveGoals = async () => {
    try {
      if (
        !careerGoalsData.desiredJobTitle ||
        careerGoalsData.desiredJobTitle.length === 0
      ) {
        toast.error("Please enter a Desired Job Title", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (
        !careerGoalsData.employmentType ||
        careerGoalsData.employmentType.length === 0
      ) {
        toast.error("Please select a Job Type", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (
        !careerGoalsData.occupationType ||
        careerGoalsData.occupationType.length === 0
      ) {
        toast.error("Please select a Desired Occupation Type", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (!careerGoalsData.availabilityToJoin) {
        toast.error("Please select a Available to join", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (!careerGoalsData.salaryType) {
        toast.error(
          "Please select a Salary Type (Hourly, Daily, Monthly, Yearly)",
          {
            autoClose: 2000,
            theme: "colored",
          },
        );
        return;
      }

      if (!careerGoalsData.salaryCurrency) {
        toast.error("Please select a Salary Currency", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (!careerGoalsData.lookingForJob) {
        toast.error("Please select a job opportunity", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }
      const token = localStorage.getItem("token");

      const payload = {
        DesiredJobTitle: careerGoalsData.desiredJobTitle.map(
          (item) => item.value,
        ),

        DesiredEmploymentType: careerGoalsData.employmentType.map(
          (item) => item.value,
        ),

        DesiredOccupationType: careerGoalsData.occupationType.map(
          (item) => item.value,
        ),

        availabilityToJoin: careerGoalsData.availabilityToJoin,

        MinimumDesiredSalary: {
          amount: String(careerGoalsData.salaryAmount),
          currency: careerGoalsData.salaryCurrency,
          type: careerGoalsData.salaryType,
        },
        jobSearchStatus: careerGoalsData.lookingForJob,
        eligibleToWorkInFrance: careerGoalsData.eligibleToWork,
      };
      const response = await axios.put(
        `${API_BASE_URL}updateCareerGoals`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        setProfileData((prev) => ({
          ...prev,
          career_goals: {
            DesiredJobTitle: payload.DesiredJobTitle,
            DesiredEmploymentType: payload.DesiredEmploymentType,
            DesiredOccupationType: payload.DesiredOccupationType,
            MinimumDesiredSalary: payload.MinimumDesiredSalary,
            jobSearchStatus: payload.jobSearchStatus,
            availabilityToJoin: payload.availabilityToJoin,
          },
          eligibleToWorkInFrance: payload.eligibleToWorkInFrance,
        }));

        setCheckStatus((prev) => ({ ...prev, careerGoals: 1 }));
        setEditMode(false);

        toast.success(
          profileData.career_goals
            ? "Career Goals updated successfully!"
            : "Career Goals added successfully!",
          { autoClose: 2000, theme: "colored" },
        );
      }
    } catch (error) {
      console.error("Error saving career goals:", error);
      toast.error("Failed to save Career Goals", {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}get/countries`);
        console.log("Countries API Response:", response.data);

        if (response.status === 200) {
          // check if response contains "countries" key
          if (Array.isArray(response.data)) {
            setCountries(response.data);
          } else if (Array.isArray(response.data.countries)) {
            setCountries(response.data.countries);
          } else {
            console.error("Unexpected countries API format", response.data);
            setCountries([]); // fallback empty
          }
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);
  useEffect(() => {
    if (!citySearch) return; // prevent empty call

    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}searchCities?key=${citySearch}`,
        );
        if (response.status === 200) {
          setCities(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    const delayDebounce = setTimeout(fetchCities, 500); // debounce API calls
    return () => clearTimeout(delayDebounce);
  }, [citySearch]);
  const handleCitySearch = async (e) => {
    const value = e.target.value;
    setPersonalDetails((prev) => ({ ...prev, city: value }));

    if (!value.trim()) {
      setCitySuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}searchCities`, {
        params: { key: value },
      });

      if (res.data?.success && Array.isArray(res.data.cities)) {
        setCitySuggestions(res.data.cities);
      } else {
        setCitySuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCitySuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!summary?.trim()) {
        toast.error("Professional Summary is required", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}updateProfessionalSummary`,
        { professionalSummary: summary },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        // ✅ update local state
        setProfileData((prev) => ({
          ...prev,
          professionalSummary: summary,
        }));

        // ✅ change status so edit icon shows
        setCheckStatus((prev) => ({
          ...prev,
          professionalSummary: 1,
        }));

        // ✅ exit edit mode
        setEditCareerGoals(false);
        if (profileData?.professionalSummary) {
          toast.success("Professional Summary updated successfully!", {
            autoClose: 2000,
            theme: "colored",
          });
        } else {
          toast.success("Professional Summary added successfully!", {
            autoClose: 2000,
            theme: "colored",
          });
        }
      }
    } catch (error) {
      console.error("Error saving professional summary:", error);
      toast.error("Failed to save Professional Summary", {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEducationForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSaveEducation = async () => {
    try {
      if (!educationForm.degree) {
        toast.error("Please enter a valid Degree", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (!educationForm.University) {
        toast.error("Please enter a valid University", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (!educationForm.startDate) {
        toast.error("Please select a Start Date", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (!educationForm.endDate && !educationForm.currentlyStudyingHere) {
        toast.error("Please select an End Date", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      const today = new Date();
      const startDate = new Date(educationForm.startDate);
      const endDate = educationForm.endDate
        ? new Date(educationForm.endDate)
        : null;

      // ✅ Start date should not be in the future
      if (startDate > today) {
        toast.error("Start Date cannot be in the future", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      // ✅ Ensure start date is not after end date
      if (
        !educationForm.currentlyStudyingHere &&
        endDate &&
        startDate > endDate
      ) {
        toast.error("End Date cannot be before Start Date", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      const token = localStorage.getItem("token");
      // ✅ Build payload safely
      const payload = {
        education_id: educationForm.education_id,
        degree: educationForm.degree,
        University: educationForm.University,
        startDate: educationForm.startDate,
        currentlyStudyingHere: educationForm.currentlyStudyingHere,
      };

      // ✅ Only send endDate when needed
      if (!educationForm.currentlyStudyingHere && educationForm.endDate) {
        payload.endDate = educationForm.endDate;
      }

      const response = await axios.post(
        `${API_BASE_URL}updateEducation`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        const updatedEducationList = educationForm.education_id
          ? educationList.map((edu) =>
              edu._id === educationForm.education_id
                ? { ...edu, ...educationForm }
                : edu,
            )
          : [
              ...educationList,
              { ...educationForm, _id: response.data.education_id },
            ];

        setEducationList(updatedEducationList);
        setIsEditing(false);

        setEducationForm({
          education_id: "",
          degree: "",
          University: "",
          startDate: "",
          endDate: "",
          currentlyStudyingHere: false,
        });

        toast.success(
          educationForm.education_id
            ? "Education updated successfully!"
            : "Education added successfully!",
          { autoClose: 2000, theme: "colored" },
        );
      }
      await fetchProfile();
    } catch (error) {
      console.error("Error saving education:", error);
      toast.error("Failed to save education", {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  // ✅ Delete education
  const handleDeleteEducation = async (education_id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}DeleteEducation`,
        { education_id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        setEducationList((prev) =>
          prev.filter((edu) => edu._id !== education_id),
        );
        toast.success("Education deleted successfully!", {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error("Failed to delete education", {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };
  const isAge18OrAbove = (dobString) => {
    if (!dobString) return false;

    const [year, month, day] = dobString.split("-");
    const dob = new Date(year, month - 1, day); // local date

    if (isNaN(dob.getTime())) return false;

    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );

    return dob <= eighteenYearsAgo;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSavePersonal = async () => {
    try {
      if (!personalDetails.firstName?.trim()) {
        toast.error("First name is required", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }
      if (!personalDetails.lastName?.trim()) {
        toast.error("Last name is required", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }
      if (!personalDetails.birthYear) {
        toast.error("Date of birth is required", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (!isAge18OrAbove(personalDetails.birthYear)) {
        toast.error("You must be at least 18 years old", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (!personalDetails.gender) {
        toast.error("Gender is required", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }
      if (!personalDetails.countryCode) {
        toast.error("Country code is required", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (!personalDetails.phone?.trim()) {
        toast.error("Phone number is required", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      // ✅ Phone number validation (10 digits, you can adjust regex for your format)
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(personalDetails.phone)) {
        toast.error("Please enter a valid 10-digit phone number", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      const token = localStorage.getItem("token");

      const payload = {
        firstname: personalDetails.firstName,
        lastname: personalDetails.lastName,
        dateOfBirth: personalDetails.birthYear,
        gender: personalDetails.gender,
        nationality: personalDetails.nationality || "",
        city: personalDetails.city || "",
        phone: personalDetails.phone,
        countryCode: String(personalDetails.countryCode), // ✅ FORCE STRING
      };

      const response = await axios.put(
        `${API_BASE_URL}updatePersonalDetails`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        // ✅ Update local state immediately
        setPersonalDetails((prev) => ({
          ...prev,
          firstName: payload.firstname,
          lastName: payload.lastname,
          birthYear: payload.dateOfBirth,
          gender: payload.gender,
          nationality: payload.nationality,
          city: payload.city,
          phone: payload.phone,
          countryCode: payload.countryCode, // ✅
        }));

        // ✅ If you have global profileData, update it too
        setProfileData((prev) => ({
          ...prev,
          first_name: payload.firstname,
          last_name: payload.lastname,
          date_of_birth: payload.dateOfBirth,
          gender: payload.gender,
          Nationality: payload.nationality,
          city: payload.city,
          phone: payload.phone,
          countryCode: payload.countryCode, // ✅
        }));
        updateName(payload.firstname, payload.lastname);
        setCheckStatus((prev) => ({
          ...prev,
          personalDetails: 1,
        }));
        setEditPersonal(false);
        toast.success("Personal details saved successfully!", {
          containerId: "verify-email-toast",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error saving personal details:", error);
      toast.error("Failed to save personal details", {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };
  const uploadResume = async () => {
    const userId = localStorage.getItem("extract_id");
    const file = formData1?.attachment;

    if (!userId) {
      toast.error("User not found. Please login again.", {
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    if (!file) {
      toast.error("Please select a resume file.", {
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Uploaded file is too large. Max size is 2MB.", {
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    const data = new FormData();
    data.append("resume", file);

    try {
      setIsUploading(true); // ✅ START LOADER

      const res = await axios.post(
        `${API_BASE_URL}extractResume/${userId}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.data.success && res.data.jobId) {
        setIsExtracting(true); // ✅ extraction loader
        fetchExtractedData(res.data.jobId);
      } else {
        toast.error("Upload succeeded but jobId missing.");
        setIsUploading(false);
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      setIsUploading(false);

      if (err?.response?.status === 413) {
        toast.error("Uploaded file is too large. Max size is 2MB.");
      } else {
        toast.error("Failed to upload resume.");
      }
    }
  };

  const fetchExtractedData = async (jobId, attempt = 0) => {
    try {
      const res = await axios.get(`${API_BASE_URL}resume/result/${jobId}`);
      const { state, result } = res.data;

      // ⏳ Still processing
      if (state === "active") {
        if (attempt < 10) {
          setTimeout(() => fetchExtractedData(jobId, attempt + 1), 2000);
        } else {
          setIsExtracting(false);
          toast.error("Resume extraction taking too long.");
        }
        return;
      }

      // ❌ Failed
      if (state === "completed" && !result?.success) {
        setIsExtracting(false);
        toast.error("Resume extraction failed.");
        return;
      }

      // ✅ Success
      if (state === "completed" && result?.parsedResume?.data) {
        const data = result.parsedResume.data;
        await fetchProfile();
        setIsUploading(false);
        setIsExtracting(false);
        setShowModal(false);
        toast.success("Resume extracted successfully!");
      }
    } catch (err) {
      console.error("Extraction Error:", err);
      setIsUploading(false);
      setIsExtracting(false);
      toast.error("Error fetching resume data.");
    }
  };
  const handleSaveLocation = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        firstname: personalDetails.firstName,
        lastname: personalDetails.lastName,
        dateOfBirth: personalDetails.birthYear,
        gender: personalDetails.gender,
        // nationality: locationDetails.nationality, // ✅ location state
        // city: locationDetails.city, // ✅ location state
        phone: personalDetails.phone,
      };

      const response = await axios.put(
        `${API_BASE_URL}updatePersonalDetails`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        setCheckStatus((prev) => ({
          ...prev,
          personalDetails: 1,
        }));
        setEditLocation(false);

        toast.success("Location details saved successfully!", {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error saving location details:", error);
      toast.error("Failed to save location details", {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };
  const handleSaveAboutRole = async () => {
    try {
      if (!aboutRole.jobTitle) {
        toast.error("Job title is required", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }
      if (!aboutRole.yearsOfExperience) {
        toast.error("Years of experience is required", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }
      if (!aboutRole.jobCategory) {
        toast.error("Job category is required", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }
      const token = localStorage.getItem("token");

      const payload = {
        jobTitle: aboutRole.jobTitle,
        yearOfExperience: aboutRole.yearsOfExperience,
        jobCategory: aboutRole.jobCategory,
      };

      const response = await axios.put(
        `${API_BASE_URL}updateAboutRole`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setCheckStatus((prev) => ({
          ...prev,
          aboutRole: 1,
        }));
        setEditAboutRole(false);

        setProfileData((prev) => ({
          ...prev,
          aboutRole: payload,
        }));

        fetchProfile();
        // ✅ Success toast
        toast.success(
          response.data.message || "About role updated successfully!",
          {
            autoClose: 2000,
            theme: "colored",
          },
        );
      }
    } catch (error) {
      console.error("Error updating About Role:", error);

      // ❌ Error toast
      toast.error(
        error.response?.data?.message || "Failed to update About Role",
        {
          autoClose: 2000,
          theme: "colored",
        },
      );
    }
  };
  const handleChangeOfWork = (e) => {
    const { name, value, type, checked } = e.target;

    setWorkExperienceData((prev) => {
      // ✅ If "Currently Working Here" checked → clear endDate
      if (name === "currentlyWorkingHere" && checked) {
        return {
          ...prev,
          currentlyWorkingHere: true,
          endDate: "",
        };
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleSaveWorkExperience = async () => {
    try {
      const {
        companyName,
        jobTitle,
        startDate,
        endDate,
        currentlyWorkingHere,
        currentlyWorkingHereEmp,
        Description,
        EmploymentType,
        workLocation,
        salaryType,
        salaryAmount,
        salaryCurrency,
      } = workExperienceData;

      // ✅ VALIDATION SECTION
      if (!jobTitle?.trim()) {
        toast.error("Please enter Job Title", { theme: "colored" });
        return;
      }

      if (!companyName?.trim()) {
        toast.error("Please enter Company Name", { theme: "colored" });
        return;
      }

      if (!startDate) {
        toast.error("Please select Start Date", { theme: "colored" });
        return;
      }

      if (!currentlyWorkingHere && !endDate) {
        toast.error("Please select End Date or mark 'Currently Working Here'", {
          theme: "colored",
        });
        return;
      }

      // ✅ Normalize Dates to avoid time-zone issues
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = endDate ? new Date(endDate) : null;
      if (end) end.setHours(0, 0, 0, 0);

      // ✅ Start Date cannot be in the future
      if (start > today) {
        toast.error("Start Date cannot be a future date", { theme: "colored" });
        return;
      }

      // ✅ End Date cannot be before Start Date
      if (start && end && end < start) {
        toast.error("End Date cannot be earlier than Start Date", {
          theme: "colored",
        });
        return;
      }

      if (!EmploymentType?.trim()) {
        toast.error("Please select Employment Type", { theme: "colored" });
        return;
      }

      if (!workLocation?.trim()) {
        toast.error("Please enter Work Location", { theme: "colored" });
        return;
      }

      if (!salaryCurrency) {
        toast.error("Please select Salary Currency", { theme: "colored" });
        return;
      }

      if (!salaryType) {
        toast.error("Please select Payroll Frequency", { theme: "colored" });
        return;
      }

      // ✅ Clean Description
      const cleanDescription =
        Description && Description.trim() !== ""
          ? Description.trim()
          : undefined;

      // ✅ Construct Payload
      const payload = {
        workHistory_id: workExperienceData.workHistory_id || undefined,
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        startDate,
        endDate: currentlyWorkingHere ? undefined : endDate || undefined,
        currentlyWorkingHere,
        keep_employer_anonymous: currentlyWorkingHereEmp,
        ...(cleanDescription && { Description: cleanDescription }),
        EmploymentType,
        workLocation: workLocation.trim(),
        currentSalary: {
          payrollFrequency: salaryType,
          amount: salaryAmount,
          currency: salaryCurrency,
        },
      };

      const token = localStorage.getItem("token");

      // ✅ API CALL
      const response = await axios.post(
        `${API_BASE_URL}updateWorkHistory`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        const updatedWorkHistory = response.data.workHistory;

        setProfileData((prev) => ({
          ...prev,
          workHistory: updatedWorkHistory,
        }));

        setCheckStatus((prev) => ({
          ...prev,
          workExperience: 1,
        }));

        setEditMode(false);

        toast.success("Work experience saved successfully!", {
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error saving work experience:", error);
      const backendError = error.response?.data?.errors?.[0];
      toast.error(backendError || "Failed to save work experience", {
        theme: "colored",
      });
    }
  };

  // DELETE WORK EXPERIENCE
  const handleDeleteWorkExperience = async (experience_id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}DeleteExperience`,
        { experience_id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        if (response.data.workHistory) {
          // ✅ API returns updated list
          setProfileData((prev) => ({
            ...prev,
            workHistory: response.data.workHistory,
          }));
        } else {
          // ✅ API returns only success, remove manually
          setProfileData((prev) => ({
            ...prev,
            workHistory: prev.workHistory.filter(
              (exp) => exp._id !== experience_id,
            ),
          }));
        }

        toast.success("Work experience deleted successfully!", {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error deleting work experience:", error);
      toast.error("Failed to delete work experience", {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };
  const handleSavePortfolioLinks = async () => {
    try {
      // 🔹 At least one link must be provided (optional rule – you can remove if not needed)
      if (
        !portfolioLinks.personalWebsite &&
        !portfolioLinks.github &&
        !portfolioLinks.linkedin
      ) {
        toast.error("Please add at least one portfolio link", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      // 🔹 Build payload dynamically (ONLY filled fields)
      const payload = {};

      if (portfolioLinks.personalWebsite) {
        payload.portfolio = portfolioLinks.personalWebsite;
      }

      if (portfolioLinks.github) {
        payload.github = portfolioLinks.github;
      }

      if (portfolioLinks.linkedin) {
        payload.linkedin = portfolioLinks.linkedin;
      }

      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_BASE_URL}updateLinks`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const updatedLinks = {
          portfolio:
            response.data?.portfolio ?? portfolioLinks.personalWebsite ?? "",
          github: response.data?.github ?? portfolioLinks.github ?? "",
          linkedin: response.data?.linkedin ?? portfolioLinks.linkedin ?? "",
        };

        // ✅ update local state
        setPortfolioLinks({
          personalWebsite: updatedLinks.portfolio,
          github: updatedLinks.github,
          linkedin: updatedLinks.linkedin,
        });

        // ✅ update profile data
        setProfileData((prev) => ({
          ...prev,
          links: updatedLinks,
        }));

        // ✅ mark section completed
        setCheckStatus((prev) => ({ ...prev, links: 1 }));

        // ✅ exit edit mode
        setEditPortfolioLinks(false);

        toast.success("Portfolio links updated successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error("Error saving links:", err);

      // 🔥 Extract backend validation message
      const errorMsg =
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.message ||
        "Failed to update portfolio links";

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  // const handleSavePortfolioLinks = async () => {
  //   try {
  //     if (!portfolioLinks.personalWebsite) {
  //       toast.error("Please enter a valid Personal Website URL", {
  //         autoClose: 2000,
  //         theme: "colored",
  //       });
  //       return;
  //     }

  //     if (!portfolioLinks.github) {
  //       toast.error("Please enter a valid GitHub profile link", {
  //         autoClose: 2000,
  //         theme: "colored",
  //       });
  //       return;
  //     }

  //     if (!portfolioLinks.linkedin) {
  //       toast.error("Please enter a valid LinkedIn profile link", {
  //         autoClose: 2000,
  //         theme: "colored",
  //       });
  //       return;
  //     }
  //     const token = localStorage.getItem("token");
  //     const response = await axios.post(
  //       `${API_BASE_URL}updateLinks`,
  //       {
  //         portfolio: portfolioLinks.personalWebsite,
  //         github: portfolioLinks.github,
  //         linkedin: portfolioLinks.linkedin,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (response.status === 200) {
  //       const updatedLinks = {
  //         portfolio: response.data?.portfolio || portfolioLinks.personalWebsite,
  //         github: response.data?.github || portfolioLinks.github,
  //         linkedin: response.data?.linkedin || portfolioLinks.linkedin,
  //       };

  //       // ✅ update local state
  //       setPortfolioLinks({
  //         personalWebsite: updatedLinks.portfolio,
  //         github: updatedLinks.github,
  //         linkedin: updatedLinks.linkedin,
  //       });

  //       // ✅ also update profileData so it reflects instantly
  //       setProfileData((prev) => ({
  //         ...prev,
  //         links: updatedLinks,
  //       }));

  //       // ✅ mark section completed
  //       setCheckStatus((prev) => ({ ...prev, links: 1 }));

  //       // ✅ exit edit mode
  //       setEditPortfolioLinks(false);

  //       // ✅ success toast
  //       toast.success("Portfolio links updated successfully!", {
  //         position: "top-right",
  //         autoClose: 2000,
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Error saving links:", err);
  //     toast.error("Failed to update portfolio links", {
  //       position: "top-right",
  //       autoClose: 2000,
  //     });
  //   }
  // };
  const handleToggleVisibility = async (e) => {
    const newValue = e.target.checked;
    setProfileVisible(newValue); // update UI instantly

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}updateProfileVisibility`,
        { profileVisible: newValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        toast.success(
          `Profile visibility updated to ${newValue ? "Visible" : "Hidden"}`,
          { autoClose: 2000, theme: "colored" },
        );
        setVisibilityMessage(response.data.message); // ✅ set backend msg
      }
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile visibility:", error);
      toast.error("Failed to update profile visibility", {
        autoClose: 2000,
        theme: "colored",
      });
      setProfileVisible(!newValue); // rollback if API fails
    }
  };
  const handleSaveCertificate = async () => {
    try {
      if (!formData.title?.trim()) {
        toast.error("Certificate title is required", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (!formData.issueDate) {
        toast.error("Issue date is required", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      // ✅ Check if issue date is in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const issueDate = new Date(formData.issueDate);
      issueDate.setHours(0, 0, 0, 0);

      if (issueDate > today) {
        toast.error("Issue date cannot be a future date", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}updateCertificates`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        // ✅ Update profileData state
        const updatedCertificates = formData.certificate_id
          ? profileData.certificates.map((c) =>
              c._id === formData.certificate_id ? { ...c, ...formData } : c,
            )
          : [
              ...profileData.certificates,
              { ...formData, _id: response.data.certificate_id },
            ];

        setProfileData((prev) => ({
          ...prev,
          certificates: updatedCertificates,
        }));
        setCheckStatus((prev) => ({ ...prev, certificates: 1 }));
        setCertificateEditMode(false);

        // reset form
        setFormData({ certificate_id: "", title: "", issueDate: "" });
        await fetchProfile();
        toast.success(
          formData.certificate_id
            ? "Certificate updated successfully!"
            : "Certificate added successfully!",
          { autoClose: 2000, theme: "colored" },
        );
      }
    } catch (error) {
      console.error("Error saving certificate:", error);
      toast.error("Failed to save Certificate", {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const handleDeleteCertificate = async (certificate_id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}DeleteCertificate`,
        { certificate_id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 200) {
        // ✅ Remove deleted certificate from state
        setProfileData((prev) => ({
          ...prev,
          certificates: prev.certificates.filter(
            (c) => c._id !== certificate_id,
          ),
        }));

        toast.success("Certificate deleted successfully!", {
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("Failed to delete Certificate", {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const handleAddSkill = async () => {
    const trimmedSkill = newSkill.trim();

    if (!trimmedSkill) {
      toast.error("Please enter a skill", { theme: "colored" });
      return;
    }

    // 🚫 Prevent duplicate
    if (skills.includes(trimmedSkill)) {
      toast.warning("Skill already added", { theme: "colored" });
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}updateSkills`,
        { skills: [...skills, trimmedSkill] },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200) {
        setSkills(res.data.skills || [...skills, trimmedSkill]);
        setNewSkill("");

        // ✅ mark section completed
        setCheckStatus((prev) => ({ ...prev, skills: 1 }));

        toast.success("Skill added successfully!", { theme: "colored" });
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill", { theme: "colored" });
    }
  };

  // ✅ Delete skill
  const handleDeleteSkill = async (skill) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}deleteSkill`,
        { skill },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200) {
        const updatedSkills = skills.filter((s) => s !== skill);

        setSkills(updatedSkills);

        // ✅ if all skills removed → show Add button again
        if (updatedSkills.length === 0) {
          setCheckStatus((prev) => ({ ...prev, skills: 0 }));
        }
        await fetchProfile();
        toast.success("Skill deleted successfully!", { theme: "colored" });
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill", { theme: "colored" });
    }
  };
  const cleanImageUrl = (url) => {
    if (!url) return "";

    // ✅ Dashboard default images
    if (url.includes("assets/images/dashboard/")) {
      // ensure absolute path
      return url.startsWith("/") ? url : `/${url}`;
    }

    // ✅ Fix wrongly stored upload URLs
    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    // ✅ External URLs
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // ✅ Backend uploaded image
    return `${API_IMAGE_URL}${url}`;
  };

  console.log(image);
  const formatEmail = (email, maxLength = 35) => {
    if (!email) return "N/A";

    if (email.length <= maxLength) return email;

    const atIndex = email.indexOf("@");
    if (atIndex === -1) {
      return email.slice(0, maxLength) + "...";
    }

    return email.slice(0, atIndex + 1) + "...";
  };
  const resetDeleteForm = () => {
    setReason("");
    setComments("");
  };
  const toArray = (value) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };
  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>My Profile</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/"> Home </Link>
              </li>
              <li className="item">
                <Link to="/candidate-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> My Profile
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div class="saas-profile-container">
            <div class="saas-layout-grid">
              <div class="saas-left-sidebar">
                <div className="saas-card profile-overview-card">
                  <div className="saas-avatar-wrapper">
                    {/* Avatar Image */}
                    {isLoadingJobs ? (
                      <JobListLoader />
                    ) : (
                      <img
                        alt="Candidate"
                        className="saas-avatar"
                        crossOrigin="anonymous"
                        src={
                          image
                            ? cleanImageUrl(image)
                            : "https://randomuser.me/api/portraits/women/44.jpg"
                        }
                      />
                    )}

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    {/* Camera Edit Button */}
                    <div
                      className="saas-avatar-edit-btn"
                      title="Upload Photo"
                      onClick={() => fileInputRef.current.click()}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fas fa-camera" />
                    </div>
                  </div>
                  <h3 className="profile-name">
                    {" "}
                    {profileData.first_name} {profileData.last_name}
                  </h3>
                  <p className="profile-title">{profileData.position}</p>
                  <div className="profile-stats-grid">
                    <div className="stat-item">
                      <span className="stat-value">
                        {profileDetails?.experienceCount || 0}
                      </span>
                      <span className="stat-label">Exp</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">
                        {profileDetails?.educationCount || 0}
                      </span>
                      <span className="stat-label">Edu</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">
                        {profileDetails?.skillsCount || 0}
                      </span>
                      <span className="stat-label">Skills</span>
                    </div>
                  </div>
                  <div className="completion-bar-container">
                    <div className="progress-label">
                      <span>Profile Completion</span>
                      <span>85%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div className="visibility-toggle-wrapper justify-content-center mt-3 mb-4">
                    <label className="switch mb-0">
                      <input
                        type="checkbox"
                        checked={profileVisible}
                        onChange={handleToggleVisibility}
                      />
                      <span className="slider round" />
                    </label>

                    <span className="visibility-label ml-2">
                      <i className="fa-regular fa-eye mr-1" />
                      {profileVisible ? "Public" : "Private"}
                    </span>
                  </div>
                  <button className="saas-btn-primary sticky-save-btn">
                    <i className="fas fa-save" /> Save All Changes
                  </button>
                  <div className="mt-3 w-100">
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={(e) => {
                        setShowModal(true);
                      }}
                    >
                      <i className="fas fa-file-pdf" /> CV Auto Extractor
                    </button>

                    <input
                      accept=".pdf,.doc,.docx"
                      type="file"
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>
              <div className="saas-main-content">
                <div className="saas-card">
                  <div className="saas-card-header">
                    <h4 className="saas-card-title">
                      <i className="fas fa-user" /> Personal Information
                    </h4>

                    {editPersonal ? (
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => setEditPersonal(false)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => {
                          setPersonalDetails({
                            firstName: profileData?.first_name || "",
                            lastName: profileData?.last_name || "",
                            email: profileData?.email || "",
                            phone: profileData?.phone || "",
                            countryCode: profileData?.countryCode || "",
                            birthYear: profileData?.date_of_birth
                              ? new Date(profileData.date_of_birth)
                                  .toISOString()
                                  .split("T")[0]
                              : "",
                            gender: profileData?.gender || "",
                            city: profileData?.city || "",
                            nationality: profileData?.Nationality || "",
                          });
                          setEditPersonal(true);
                        }}
                      >
                        <i className="fas fa-pencil-alt" /> Edit
                      </button>
                    )}
                  </div>

                  {editPersonal ? (
                    /* ================= EDIT FORM ================= */
                    <form className="saas-form-grid row">
                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">First Name</label>
                        <input
                          className="saas-input"
                          type="text"
                          value={personalDetails.firstName}
                          onChange={(e) =>
                            setPersonalDetails({
                              ...personalDetails,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">Last Name</label>
                        <input
                          className="saas-input"
                          type="text"
                          value={personalDetails.lastName}
                          onChange={(e) =>
                            setPersonalDetails({
                              ...personalDetails,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">Email</label>
                        <input
                          className="saas-input"
                          type="email"
                          value={personalDetails.email}
                          readOnly
                        />
                      </div>

                      {/* Phone */}
                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">Phone</label>

                        <div className="d-flex gap-2">
                          <div style={{ width: "140px" }}>
                            <Select
                              options={countryOptions}
                              value={countryOptions.find(
                                (option) =>
                                  String(option.value) ===
                                  String(personalDetails.countryCode),
                              )}
                              onChange={(selected) =>
                                setPersonalDetails({
                                  ...personalDetails,
                                  countryCode: selected.value,
                                })
                              }
                              isSearchable
                            />
                          </div>

                          <input
                            className="saas-input"
                            type="text"
                            value={personalDetails.phone}
                            onChange={(e) =>
                              setPersonalDetails({
                                ...personalDetails,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">Date of Birth</label>
                        <input
                          className="saas-input"
                          type="date"
                          value={personalDetails.birthYear}
                          onChange={(e) =>
                            setPersonalDetails({
                              ...personalDetails,
                              birthYear: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">Gender</label>
                        <select
                          className="saas-select"
                          value={personalDetails.gender}
                          onChange={(e) =>
                            setPersonalDetails({
                              ...personalDetails,
                              gender: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">Country</label>
                        <select
                          className="saas-select"
                          value={personalDetails.nationality}
                          onChange={(e) =>
                            setPersonalDetails({
                              ...personalDetails,
                              nationality: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Country</option>
                          {countries?.map((c, idx) => (
                            <option key={idx} value={c.name || c}>
                              {c.name || c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">City</label>
                        <input
                          className="saas-input"
                          type="text"
                          value={personalDetails.city}
                          onChange={(e) =>
                            setPersonalDetails({
                              ...personalDetails,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-12 text-end mt-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSavePersonal}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ================= VIEW MODE ================= */
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="text-muted small">Full Name</label>
                        <p className="fw-bold">
                          {profileData.first_name} {profileData.last_name}
                        </p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="text-muted small">Email</label>
                        <p className="fw-bold">{profileData.email}</p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="text-muted small">Phone</label>
                        <p className="fw-bold">
                          +{profileData.countryCode} {profileData.phone}
                        </p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="text-muted small">Location</label>
                        <p className="fw-bold">
                          {profileData.city}, {profileData.Nationality}
                        </p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="text-muted small">
                          Date of Birth
                        </label>
                        <p className="fw-bold">
                          {profileData.date_of_birth
                            ? new Date(profileData.date_of_birth)
                                .toISOString()
                                .split("T")[0]
                            : "N/A"}
                        </p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="text-muted small">Gender</label>
                        <p className="fw-bold">{profileData.gender}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="saas-card">
                  <div className="saas-card-header">
                    <h4 className="saas-card-title">
                      <i className="fas fa-file-alt" /> Professional Summary
                    </h4>

                    {editSummary ? (
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => setEditSummary(false)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => {
                          setEditCareerGoals(false); // close other section
                          setSummary(profileData?.professionalSummary || "");
                          setEditSummary(true);
                        }}
                      >
                        {checkStatus.professionalSummary === 0 ? (
                          "Add"
                        ) : (
                          <>
                            <i className="fas fa-pencil-alt"></i> Edit
                          </>
                        )}{" "}
                      </button>
                    )}
                  </div>

                  {editSummary ? (
                    /* ================= EDIT MODE ================= */
                    <div>
                      <div className="saas-form-group">
                        <textarea
                          className="saas-textarea"
                          rows={6}
                          placeholder="Write a brief bio or professional summary..."
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                        />

                        <div className="d-flex justify-content-between mt-2">
                          <small className="text-muted">
                            {summary?.length || 0} characters
                          </small>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-info"
                          >
                            <i className="fas fa-magic" /> AI Enhancement
                          </button>
                        </div>
                      </div>

                      <div className="text-end mt-3">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            handleSave();
                            setEditSummary(false); // close after save
                          }}
                        >
                          Save Summary
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ================= VIEW MODE ================= */
                    <div className="profile-summary-content">
                      {profileData?.professionalSummary ? (
                        <>
                          <p
                            className="text-muted"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {expanded
                              ? profileData.professionalSummary
                              : profileData.professionalSummary.slice(0, 200) +
                                "..."}
                          </p>

                          {profileData.professionalSummary.length > 200 && (
                            <button
                              className="btn shadow-none p-0 text-primary"
                              style={{ background: "transparent" }}
                              onClick={() => setExpanded(!expanded)}
                            >
                              {expanded ? "Afficher moins" : "Afficher plus"}
                            </button>
                          )}
                        </>
                      ) : (
                        <p>No professional summary added yet.</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="saas-card">
                  {/* CARD HEADER */}
                  <div className="saas-card-header">
                    <h4 className="saas-card-title">
                      <i className="fas fa-bullseye" /> Career Goals
                    </h4>

                    {editMode ? (
                      <button
                        className="btn btn-link shadow-none text-decoration-underline p-0 m-0"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        className="btn btn-link shadow-none text-decoration-underline p-0 m-0"
                        onClick={() => {
                          const goals = profileData?.career_goals || {};

                          setCareerGoalsData({
                            desiredJobTitle: toArray(goals.DesiredJobTitle).map(
                              (item) => ({
                                value: item,
                                label: item,
                              }),
                            ),

                            employmentType: toArray(
                              goals.DesiredEmploymentType,
                            ).map((item) => ({
                              value: item,
                              label: item,
                            })),

                            occupationType: toArray(
                              goals.DesiredOccupationType,
                            ).map((item) => ({
                              value: item,
                              label: item,
                            })),

                            availabilityToJoin:
                              goals.availabilityToJoin || "Immediate",

                            salaryAmount:
                              goals?.MinimumDesiredSalary?.amount || "",

                            salaryCurrency:
                              goals?.MinimumDesiredSalary?.currency || "MAD",

                            salaryType:
                              goals?.MinimumDesiredSalary?.type || "Monthly",

                            lookingForJob: goals?.jobSearchStatus || "",

                            eligibleToWork:
                              profileData?.eligibleToWorkInFrance ?? false,
                          });

                          setEditMode(true);
                        }}
                      >
                        <i className="fas fa-pencil-alt" /> Edit
                      </button>
                    )}
                  </div>

                  {/* ================= EDIT FORM ================= */}
                  {editMode ? (
                    <form className="saas-form-grid row">
                      {/* Desired Job Title */}
                      <div className="col-12 saas-form-group">
                        <label className="saas-label">
                          Desired Job Title (Max 3)
                        </label>

                        <CreatableSelect
                          isMulti
                          placeholder="Type a title and press enter"
                          value={careerGoalsData.desiredJobTitle}
                          onChange={(selected) => {
                            if (selected.length <= 3) {
                              setCareerGoalsData({
                                ...careerGoalsData,
                                desiredJobTitle: selected,
                              });
                            }
                          }}
                          classNamePrefix="react-select"
                        />
                      </div>
                      {/* Employment Type */}
                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">
                          Employment Type (Max 3)
                        </label>

                        <Select
                          isMulti
                          options={jobTypes?.map((job) => ({
                            value: job.name,
                            label: job.name,
                          }))}
                          value={careerGoalsData.employmentType}
                          onChange={(selected) => {
                            if (selected.length <= 3) {
                              setCareerGoalsData({
                                ...careerGoalsData,
                                employmentType: selected,
                              });
                            }
                          }}
                          classNamePrefix="react-select"
                          placeholder="Select types"
                        />
                      </div>

                      {/* Job Type */}
                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">Job Type (Max 3)</label>

                        <Select
                          isMulti
                          options={jobTypeOptions}
                          placeholder="Select Job Type"
                          value={careerGoalsData.occupationType}
                          onChange={(selected) => {
                            if (selected.length <= 3) {
                              setCareerGoalsData({
                                ...careerGoalsData,
                                occupationType: selected,
                              });
                            }
                          }}
                        />
                      </div>

                      {/* Available to Join */}
                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">Available to Join</label>
                        <select
                          className="saas-select"
                          name="availabilityToJoin"
                          value={careerGoalsData.availabilityToJoin}
                          onChange={handleCareerGoalsChange}
                        >
                          <option value="">Select Availability</option>
                          <option value="Immediate">Immediate</option>
                          <option value="1 month">1 month</option>
                          <option value="1-3 months">1-3 months</option>
                          <option value="More">More</option>
                        </select>
                      </div>
                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">Minimum Salary</label>

                        <div className="d-flex gap-2">
                          <select
                            className="saas-input"
                            name="salaryAmount"
                            value={careerGoalsData.salaryAmount}
                            onChange={handleCareerGoalsChange}
                          >
                            <option value="">Select Range</option>
                            <option value="0-5000">0 - 5000</option>
                            <option value="5000-10000">5000 - 10000</option>
                            <option value="10000-15000">
                              10000 - 15000 dh
                            </option>
                            <option value="15000-20000">
                              15000 - 20000 dh
                            </option>
                            <option value="20000+">20000+ dh</option>
                          </select>

                          <select
                            className="saas-select"
                            name="salaryCurrency"
                            value={careerGoalsData.salaryCurrency}
                            onChange={handleCareerGoalsChange}
                            style={{ width: "100px" }}
                          >
                            <option value="">Currency</option>
                            <option value="MAD">MAD</option>
                          </select>
                        </div>
                      </div>

                      {/* Salary Frequency */}
                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">Salary Frequency</label>

                        <select
                          className="saas-select"
                          name="salaryType"
                          value={careerGoalsData.salaryType}
                          onChange={handleCareerGoalsChange}
                        >
                          <option value="Hourly">Hourly</option>
                          <option value="Daily">Daily</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Yearly">Yearly</option>
                        </select>
                      </div>

                      {/* Eligible to Work */}
                      <div className="col-12 mt-2">
                        <label className="d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            name="eligibleToWork"
                            checked={careerGoalsData.eligibleToWork}
                            onChange={handleCareerGoalsChange}
                          />
                          <span>I am eligible to work in France</span>
                        </label>
                      </div>

                      {/* Looking for job */}
                      <div className="col-12 mt-4">
                        <h6 className="fw-bold mb-3">
                          Looking for a new job opportunity?
                        </h6>

                        <div className="d-flex flex-column gap-2">
                          {[
                            "Yes, I need one as soon as possible",
                            "Open to the right opportunity",
                            "No, I'm not looking",
                          ].map((item) => (
                            <label
                              key={item}
                              className="d-flex align-items-center gap-2"
                              style={{ cursor: "pointer" }}
                            >
                              <input
                                type="radio"
                                name="lookingForJob"
                                value={item}
                                checked={careerGoalsData.lookingForJob === item}
                                onChange={handleCareerGoalsChange}
                              />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* SAVE BUTTON */}
                      <div className="col-12 mt-3 text-end">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSaveGoals}
                        >
                          Save Goals
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ================= DISPLAY MODE ================= */
                    <div className="career-goals-display">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="text-muted small">
                            Desired Title
                          </label>
                          <p className="fw-bold">
                            {Array.isArray(
                              profileData?.career_goals?.DesiredJobTitle,
                            )
                              ? profileData.career_goals.DesiredJobTitle.join(
                                  ", ",
                                )
                              : profileData?.career_goals?.DesiredJobTitle ||
                                "-"}
                          </p>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="text-muted small">
                            Employment Type
                          </label>
                          <p className="fw-bold">
                            {Array.isArray(
                              profileData?.career_goals?.DesiredEmploymentType,
                            )
                              ? profileData.career_goals.DesiredEmploymentType.join(
                                  ", ",
                                )
                              : profileData?.career_goals
                                  ?.DesiredEmploymentType || "-"}
                          </p>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="text-muted small">Job Type</label>
                          <p className="fw-bold">
                            {Array.isArray(
                              profileData?.career_goals?.DesiredOccupationType,
                            )
                              ? profileData.career_goals.DesiredOccupationType.join(
                                  ", ",
                                )
                              : profileData?.career_goals
                                  ?.DesiredOccupationType || "-"}
                          </p>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="text-muted small">
                            Salary Expectation
                          </label>
                          <p className="fw-bold">
                            {profileData?.career_goals?.MinimumDesiredSalary
                              ? `${profileData.career_goals.MinimumDesiredSalary.amount} ${profileData.career_goals.MinimumDesiredSalary.currency} / ${profileData.career_goals.MinimumDesiredSalary.type}`
                              : "-"}
                          </p>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="text-muted small">
                            Available to Join
                          </label>
                          <p className="fw-bold">
                            {profileData?.career_goals?.availabilityToJoin ||
                              "-"}
                          </p>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="text-muted small">
                            Looking for a Job
                          </label>
                          <p className="fw-bold">
                            {profileData?.career_goals?.jobSearchStatus || "-"}
                          </p>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="text-muted small">
                            Work Eligibility
                          </label>
                          <p className="fw-bold">
                            {profileData?.eligibleToWorkInFrance ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="saas-card mb-4" id="aboutRole">
                  <div className="saas-card-header">
                    <h4 className="saas-card-title">
                      <i className="fas fa-user-tie" /> About your role
                    </h4>

                    {editAboutRole || checkStatus.aboutRole === 0 ? null : (
                      <button
                        className="btn btn-link shadow-none text-decoration-underline p-0 m-0"
                        onClick={() => {
                          setAboutRole({
                            jobTitle: profileData?.aboutRole?.jobTitle || "",
                            yearsOfExperience:
                              profileData?.aboutRole?.yearOfExperience || "",
                            jobCategory:
                              profileData?.aboutRole?.jobCategory || "",
                          });
                          setEditAboutRole(true);
                        }}
                      >
                        <i className="fas fa-pencil-alt" /> Edit
                      </button>
                    )}
                  </div>

                  <div className="saas-card-body">
                    {editAboutRole || checkStatus.aboutRole === 0 ? (
                      /* ================= FORM ================= */
                      <form className="saas-form-grid row">
                        <div className="col-md-6 saas-form-group">
                          <label className="saas-label">Job Title</label>
                          <input
                            className="saas-input"
                            type="text"
                            value={aboutRole.jobTitle}
                            onChange={(e) =>
                              setAboutRole({
                                ...aboutRole,
                                jobTitle: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-md-6 saas-form-group">
                          <label className="saas-label">
                            Years of experience
                          </label>
                          <input
                            className="saas-input"
                            type="number"
                            value={aboutRole.yearsOfExperience}
                            onChange={(e) =>
                              setAboutRole({
                                ...aboutRole,
                                yearsOfExperience: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-md-12 saas-form-group">
                          <label className="saas-label">Job Category</label>

                          <select
                            className="saas-select"
                            value={aboutRole.jobCategory}
                            onChange={(e) =>
                              setAboutRole({
                                ...aboutRole,
                                jobCategory: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Category</option>

                            {categoryList?.map((category) => (
                              <option key={category._id} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12 mt-3 text-end">
                          <button
                            type="button"
                            className="btn btn-link shadow-none text-decoration-underline text-secondary p-0 m-0 me-3"
                            onClick={() => setEditAboutRole(false)}
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSaveAboutRole}
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* ================= DISPLAY ================= */
                      <div className="about-role-display">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="text-muted small mb-1">
                              Job Title
                            </label>
                            <p className="fw-medium mb-0">
                              {profileData?.aboutRole?.jobTitle ||
                                "Not provided"}
                            </p>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="text-muted small mb-1">
                              Years of experience
                            </label>
                            <p className="fw-medium mb-0">
                              {profileData?.aboutRole?.yearOfExperience ||
                                "Not provided"}{" "}
                              Years
                            </p>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="text-muted small mb-1">
                              Job Category
                            </label>
                            <p className="fw-medium mb-0">
                              {profileData?.aboutRole?.jobCategory ||
                                "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="saas-card">
                  <div className="saas-card-header">
                    <h4 className="saas-card-title">
                      <i className="fas fa-briefcase" /> Work Experience
                    </h4>

                    {editWork ? (
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => setEditWork(false)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        className="btn btn-link shadow-none text-decoration-underline p-0 m-0"
                        onClick={() => {
                          setWorkExperienceData({
                            workHistory_id: "",
                            companyName: "",
                            jobTitle: "",
                            startDate: "",
                            endDate: "",
                            currentlyWorkingHere: false,
                            currentlyWorkingHereEmp: false,
                            Description: "",
                            EmploymentType: "",
                            workLocation: "",
                            salaryAmount: "",
                            salaryCurrency: "MAD",
                            salaryType: "Monthly",
                          });
                          setEditWork(true);
                        }}
                      >
                        <i className="fas fa-plus" /> Add
                      </button>
                    )}
                  </div>

                  {editWork ? (
                    /* ================= EDIT FORM ================= */
                    <div className="saas-form-content">
                      <form className="saas-form-grid row">
                        <div className="col-md-6 saas-form-group">
                          <label className="saas-label">Job Title</label>
                          <input
                            className="saas-input"
                            type="text"
                            name="jobTitle"
                            value={workExperienceData.jobTitle}
                            onChange={handleChangeOfWork}
                          />
                        </div>

                        <div className="col-md-6 saas-form-group">
                          <label className="saas-label">Company</label>
                          <input
                            className="saas-input"
                            type="text"
                            name="companyName"
                            value={workExperienceData.companyName}
                            onChange={handleChangeOfWork}
                          />
                        </div>
                        <div className="currently-working-here">
                          <input
                            type="checkbox"
                            id="CurrentlyWorking"
                            name="currentlyWorkingHereEmp"
                            checked={workExperienceData.currentlyWorkingHereEmp}
                            onChange={handleChangeOfWork}
                          />
                          <label htmlFor="CurrentlyWorking">
                            &nbsp;Keep my current employer anonymous
                          </label>
                        </div>
                        <div className="col-md-6 saas-form-group">
                          <label className="saas-label">Employment Type</label>
                          <select
                            className="saas-input"
                            name="EmploymentType"
                            value={workExperienceData.EmploymentType}
                            onChange={handleChangeOfWork}
                          >
                            <option value="">Select type</option>
                            {jobTypes?.map((job) => (
                              <option key={job._id} value={job.name}>
                                {job.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* <div className="col-md-6 saas-form-group">
                          <label className="saas-label">Work Location</label>
                          <input
                            className="saas-input"
                            type="text"
                            name="workLocation"
                            value={workExperienceData.workLocation}
                            onChange={handleChangeOfWork}
                          />
                        </div> */}
                        <div className="col-md-6 saas-form-group">
                          <div className="form-group position-relative">
                            <label>Work Location</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Search city"
                              name="workLocation"
                              value={workExperienceData.workLocation}
                              onChange={handleWorkLocationSearch} // 👈 new handler
                              autoComplete="off"
                            />

                            {/* Suggestions Dropdown */}
                            {loading && (
                              <div className="suggestion-box">Searching...</div>
                            )}
                            {!loading && citySuggestions.length > 0 && (
                              <ul
                                className="list-group position-absolute w-100"
                                style={{
                                  zIndex: 1000,
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                }}
                              >
                                {citySuggestions.map((city) => (
                                  <li
                                    key={city._id}
                                    className="list-group-item list-group-item-action"
                                    onClick={() =>
                                      handleSelectWorkLocation(city)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    {city.name}, {city.state_name},{" "}
                                    {city.country_name}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6 saas-form-group">
                          <label className="saas-label">Start Date</label>
                          <input
                            className="saas-input"
                            type="date"
                            name="startDate"
                            value={workExperienceData.startDate}
                            onChange={handleChangeOfWork}
                          />
                        </div>

                        <div className="col-md-6 saas-form-group">
                          <label className="saas-label">End Date</label>
                          <input
                            className="saas-input"
                            type="date"
                            name="endDate"
                            value={workExperienceData.endDate}
                            disabled={workExperienceData.currentlyWorkingHere}
                            onChange={handleChangeOfWork}
                          />
                        </div>

                        <div className="col-12 mb-3">
                          <label className="d-flex align-items-center gap-2">
                            <input
                              type="checkbox"
                              name="currentlyWorkingHere"
                              checked={workExperienceData.currentlyWorkingHere}
                              onChange={handleChangeOfWork}
                            />
                            <span>I currently work here</span>
                          </label>
                        </div>

                        <div className="col-md-4 saas-form-group">
                          <label className="saas-label">Salary Amount</label>
                          <input
                            className="saas-input"
                            type="number"
                            name="salaryAmount"
                            value={workExperienceData.salaryAmount}
                            onChange={handleChangeOfWork}
                          />
                        </div>
                        <div className="col-md-4 saas-form-group">
                          <label className="saas-label">Currency</label>
                          <select
                            className="saas-input"
                            name="salaryCurrency"
                            value={workExperienceData.salaryCurrency}
                            onChange={handleChangeOfWork}
                          >
                            <option value="MAD">MAD</option>
                          </select>
                        </div>

                        <div className="col-md-4 saas-form-group">
                          <label className="saas-label">Frequency</label>
                          <select
                            className="saas-input"
                            name="salaryType"
                            value={workExperienceData.salaryType}
                            onChange={handleChangeOfWork}
                          >
                            <option value="Hourly">Hourly</option>
                            <option value="Daily">Daily</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Yearly">Yearly</option>
                          </select>
                        </div>
                        <div className="col-12 saas-form-group">
                          <label className="saas-label">
                            Description / Achievements
                          </label>
                          <textarea
                            className="saas-textarea"
                            rows={4}
                            name="Description"
                            value={workExperienceData.Description}
                            onChange={handleChangeOfWork}
                          />
                        </div>
                        <div className="col-12 text-end">
                          <button
                            type="button"
                            className="btn btn-outline-secondary me-2"
                            onClick={() => setEditWork(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              handleSaveWorkExperience();
                              setEditWork(false);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* ================= LIST VIEW ================= */
                    /* ================= LIST VIEW ================= */
                    <div className="experience-list">
                      {profileData?.workHistory?.length > 0 ? (
                        <>
                          {(showAllExp
                            ? profileData.workHistory
                            : profileData.workHistory.slice(0, 1)
                          ).map((exp, index) => (
                            <div
                              key={index}
                              className="d-flex gap-3 mb-4 border-bottom pb-3 last-no-border"
                            >
                              {/* ICON */}
                              <div
                                className="exp-icon"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  background: "rgb(239, 246, 255)",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "rgb(37, 99, 235)",
                                }}
                              >
                                <i className="fas fa-briefcase" />
                              </div>

                              {/* CONTENT */}
                              <div className="flex-grow-1">
                                <h5 className="mb-1 fw-bold">{exp.jobTitle}</h5>

                                <p className="mb-1 text-muted">
                                  {exp.companyName} •{" "}
                                  {exp.workLocation || "N/A"} •{" "}
                                  {exp.EmploymentType || "Full Time"}
                                </p>

                                <p className="small text-muted mb-1">
                                  {exp.startDate?.split("T")[0]} -{" "}
                                  {exp.currentlyWorkingHere
                                    ? "Present"
                                    : exp.endDate?.split("T")[0]}
                                </p>

                                {exp?.currentSalary?.amount && (
                                  <p className="small text-muted mb-2">
                                    <i className="fas fa-money-bill-wave me-1" />
                                    {exp.currentSalary.amount}{" "}
                                    {exp.currentSalary.currency} /{" "}
                                    {exp.currentSalary.payrollFrequency}
                                  </p>
                                )}

                                {exp.Description && (
                                  <p className="small mb-0 mt-2">
                                    {exp.Description}
                                  </p>
                                )}
                              </div>

                              {/* ACTION BUTTONS */}
                              <div className="action-btns">
                                <button
                                  className="btn btn-sm text-primary"
                                  onClick={() => {
                                    setWorkExperienceData({
                                      workHistory_id: exp._id || "",
                                      companyName: exp.companyName || "",
                                      jobTitle: exp.jobTitle || "",
                                      startDate:
                                        exp.startDate?.split("T")[0] || "",
                                      endDate: exp.endDate?.split("T")[0] || "",

                                      currentlyWorkingHere:
                                        exp.currentlyWorkingHere || false,
                                      currentlyWorkingHereEmp:
                                        exp.keep_employer_anonymous || false,

                                      Description: exp.Description || "",
                                      EmploymentType: exp.EmploymentType || "",
                                      workLocation: exp.workLocation || "",
                                      salaryAmount:
                                        exp.currentSalary?.amount || "",
                                      salaryCurrency:
                                        exp.currentSalary?.currency || "MAD",
                                      salaryType:
                                        exp.currentSalary?.payrollFrequency ||
                                        "Monthly",
                                    });
                                    setEditWork(true);
                                  }}
                                >
                                  <i className="fas fa-pencil-alt" />
                                </button>

                                <button
                                  className="btn btn-sm text-danger"
                                  onClick={() =>
                                    handleDeleteWorkExperience(exp._id)
                                  }
                                >
                                  <i className="fas fa-trash" />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* SHOW MORE BUTTON */}
                          {profileData.workHistory.length > 1 && (
                            <div className="text-center mt-2">
                              <button
                                className="btn btn-outline-primary btn-sm rounded-pill px-4"
                                onClick={() => setShowAllExp(!showAllExp)}
                              >
                                {showAllExp
                                  ? "Afficher moins"
                                  : "Afficher plus d'expériences"}
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-muted">
                          No work experience added yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="saas-card">
                  <div className="saas-card-header">
                    <h4 className="saas-card-title">
                      <i className="fas fa-graduation-cap" /> Education
                    </h4>

                    {editEducation ? (
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => {
                          setEditEducation(false);
                          setEducationForm({
                            education_id: "",
                            degree: "",
                            University: "",
                            startDate: "",
                            endDate: "",
                            currentlyStudyingHere: false,
                          });
                        }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        className="btn btn-link shadow-none text-decoration-underline p-0 m-0"
                        onClick={() => {
                          setEducationForm({
                            education_id: "",
                            degree: "",
                            University: "",
                            startDate: "",
                            endDate: "",
                            currentlyStudyingHere: false,
                          });
                          setEditEducation(true);
                        }}
                      >
                        <i className="fas fa-plus" /> Add
                      </button>
                    )}
                  </div>

                  {editEducation ? (
                    /* ================= FORM ================= */
                    <div className="saas-form-content">
                      <form className="row">
                        <div className="col-md-6 mb-3">
                          <label className="saas-label">Degree</label>
                          <select
                            className="saas-input"
                            name="degree"
                            value={educationForm.degree}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Degree</option>
                            {degreeOptions.map((degree, index) => (
                              <option key={index} value={degree}>
                                {degree}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="saas-label">
                            Institution / University
                          </label>
                          <input
                            type="text"
                            className="saas-input"
                            name="University"
                            value={educationForm.University}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="saas-label">Start Date</label>
                          <input
                            type="date"
                            className="saas-input"
                            name="startDate"
                            value={educationForm.startDate}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="saas-label">End Date</label>
                          <input
                            type="date"
                            className="saas-input"
                            name="endDate"
                            value={educationForm.endDate}
                            disabled={educationForm.currentlyStudyingHere}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-12 mb-3">
                          <label className="d-flex align-items-center gap-2">
                            <input
                              type="checkbox"
                              name="currentlyStudyingHere"
                              checked={educationForm.currentlyStudyingHere}
                              onChange={handleInputChange}
                            />
                            <span>I am currently studying here</span>
                          </label>
                        </div>

                        <div className="col-12 text-end">
                          <button
                            type="button"
                            className="btn btn-outline-secondary me-2"
                            onClick={() => {
                              setEditEducation(false);
                              setEducationForm({
                                education_id: "",
                                degree: "",
                                University: "",
                                startDate: "",
                                endDate: "",
                                currentlyStudyingHere: false,
                              });
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              handleSaveEducation();
                              setEditEducation(false);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* ================= LIST ================= */
                    <div className="education-list">
                      {educationList?.length > 0 ? (
                        <>
                          {(showAllEducation
                            ? educationList
                            : educationList.slice(0, 1)
                          ).map((edu) => (
                            <div
                              key={edu._id}
                              className="d-flex gap-3 mb-4 border-bottom pb-3 last-no-border"
                            >
                              <div
                                className="edu-icon"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  background: "rgb(255, 247, 237)",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "rgb(249, 115, 22)",
                                }}
                              >
                                <i className="fas fa-graduation-cap" />
                              </div>

                              <div className="flex-grow-1">
                                <h5 className="mb-1 fw-bold">{edu.degree}</h5>
                                <p className="mb-1 text-muted">
                                  {edu.University}
                                </p>
                                <p className="small text-muted mb-0">
                                  {edu.startDate?.slice(0, 10)} -{" "}
                                  {edu.currentlyStudyingHere
                                    ? "Present"
                                    : edu.endDate?.slice(0, 10)}
                                </p>
                              </div>

                              <div className="action-btns">
                                <button
                                  className="btn btn-sm text-primary"
                                  onClick={() => {
                                    setEducationForm({
                                      education_id: edu._id,
                                      degree: edu.degree,
                                      University: edu.University,
                                      startDate: edu.startDate?.slice(0, 10),
                                      endDate: edu.endDate?.slice(0, 10),
                                      currentlyStudyingHere:
                                        edu.currentlyStudyingHere,
                                    });
                                    setEditEducation(true);
                                  }}
                                >
                                  <i className="fas fa-pencil-alt" />
                                </button>

                                <button
                                  className="btn btn-sm text-danger"
                                  onClick={() => handleDeleteEducation(edu._id)}
                                >
                                  <i className="fas fa-trash" />
                                </button>
                              </div>
                            </div>
                          ))}

                          {educationList.length > 1 && (
                            <div className="text-center mt-2">
                              {!showAllEducation ? (
                                <button
                                  className="btn btn-outline-primary btn-sm rounded-pill px-4"
                                  onClick={() => setShowAllEducation(true)}
                                >
                                  Voir plus de formations
                                </button>
                              ) : (
                                <button
                                  className="btn btn-outline-primary btn-sm rounded-pill px-4"
                                  onClick={() => setShowAllEducation(false)}
                                >
                                  Afficher moins
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-muted">
                          No education details added yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="saas-card">
                  <div className="saas-card-header">
                    <h4 className="saas-card-title">
                      <i className="fas fa-lightbulb" /> Skills & Technologies
                    </h4>

                    {editSkills ? (
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => setEditSkills(false)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => setEditSkills(true)}
                      >
                        {skills.length === 0 ? "Add" : "Edit"}
                      </button>
                    )}
                  </div>

                  <div className="saas-card-body">
                    {editSkills ? (
                      <>
                        {/* Input Area */}
                        <div className="d-flex gap-2 mb-3">
                          <input
                            className="saas-input"
                            placeholder="Add a skill (e.g. React, Node.js)"
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                          />
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleAddSkill}
                          >
                            Add
                          </button>
                        </div>

                        {/* Editable Skills */}
                        <div className="d-flex flex-wrap gap-2">
                          {skills.length > 0 ? (
                            skills.map((skill, index) => (
                              <span
                                key={index}
                                className="badge bg-light text-dark border p-2 d-flex align-items-center gap-2"
                              >
                                {skill}
                                <i
                                  className="fas fa-times text-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleDeleteSkill(skill)}
                                />
                              </span>
                            ))
                          ) : (
                            <p className="text-muted">No skills added yet.</p>
                          )}
                        </div>

                        {/* Save Button */}
                      </>
                    ) : (
                      <>
                        {/* View Mode */}
                        <div className="d-flex flex-wrap gap-2">
                          {skills.length > 0 ? (
                            skills.map((skill, index) => (
                              <span
                                key={index}
                                className="badge bg-light text-dark border p-2"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-muted">No skills added yet.</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="saas-card">
                  <div className="saas-card-header">
                    <h4 className="saas-card-title">
                      <i className="fas fa-globe" /> Languages
                    </h4>

                    {!languageEditMode && (
                      <button
                        className="btn btn-link shadow-none text-decoration-underline p-0 m-0"
                        onClick={openAddForm}
                      >
                        <i className="fas fa-plus" />{" "}
                        {userLanguages.length === 0 ? "Add" : "Add"}
                      </button>
                    )}
                  </div>

                  <div className="saas-card-body">
                    {languageEditMode ? (
                      /* ================= FORM MODE ================= */
                      <div className="saas-form-content">
                        <div className="saas-form-group">
                          <label className="saas-label">Language</label>
                          <select
                            className="saas-select"
                            value={languageForm.language}
                            onChange={(e) =>
                              setLanguageForm((prev) => ({
                                ...prev,
                                language: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select Language</option>
                            {Array.isArray(masterLanguages) &&
                              masterLanguages.map((lang) => (
                                <option key={lang._id} value={lang.name}>
                                  {lang.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="saas-form-group">
                          <label className="saas-label">Proficiency</label>
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            {PROFICIENCY_LEVELS.map((lvl) => (
                              <div
                                key={lvl.code}
                                className={`badge p-2 border ${
                                  languageForm.proficiency === lvl.code
                                    ? "bg-primary text-white"
                                    : "bg-white text-dark"
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  setLanguageForm((prev) => ({
                                    ...prev,
                                    proficiency: lvl.code,
                                  }))
                                }
                              >
                                {lvl.label}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div class="saas-form-group mt-3">
                          <label class="saas-label">
                            Comment/Certificates (e.g., TOEFL, TOEIC)
                          </label>
                          <input
                            className="saas-input"
                            placeholder="Add comments or certificates"
                            type="text"
                            value={languageForm.comment}
                            onChange={(e) =>
                              setLanguageForm((prev) => ({
                                ...prev,
                                comment: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="text-end mt-3">
                          <button
                            className="btn btn-outline-secondary me-2"
                            onClick={() => setLanguageEditMode(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={handleSaveLanguage}
                          >
                            {editingLanguageId ? "Update" : "Save"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ================= VIEW MODE ================= */
                      <div className="language-list">
                        {userLanguages.length > 0 ? (
                          userLanguages.map((lang) => (
                            <div
                              key={lang._id}
                              className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
                            >
                              <div>
                                <h6 className="mb-0 fw-bold">
                                  {lang.language}
                                </h6>
                                <small className="text-muted">
                                  {lang.proficiency}
                                </small>
                                <p class="mb-0 text-muted small">
                                  <i class="fas fa-file-alt me-1"></i>
                                  {lang.comment}
                                </p>
                              </div>

                              <div>
                                <button
                                  className="btn btn-sm text-primary"
                                  onClick={() => openEditForm(lang)}
                                >
                                  <i className="fas fa-pencil-alt" />
                                </button>
                                <button
                                  className="btn btn-sm text-danger"
                                  onClick={() => handleDeleteLanguage(lang._id)}
                                >
                                  <i className="fas fa-trash" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No languages added yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="saas-card">
                  <div className="saas-card-header">
                    <h4 className="saas-card-title">
                      <i className="fas fa-certificate" /> Certificates
                    </h4>

                    {!certificateEditMode && (
                      <button
                        className="btn btn-link shadow-none text-decoration-underline p-0 m-0"
                        onClick={() => {
                          setFormData({
                            certificate_id: "",
                            title: "",
                            issueDate: "",
                          });
                          setCertificateEditMode(true);
                        }}
                      >
                        <i className="fas fa-plus" /> Add
                      </button>
                    )}
                  </div>

                  <div className="saas-card-body">
                    {certificateEditMode ? (
                      /* ================= FORM MODE ================= */
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="saas-label">
                            Certificate Title
                          </label>
                          <input
                            type="text"
                            className="saas-input"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="saas-label">Issue Date</label>
                          <input
                            type="date"
                            className="saas-input"
                            name="issueDate"
                            value={formData.issueDate}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-12 text-end">
                          <button
                            className="btn btn-outline-secondary me-2"
                            onClick={() => setCertificateEditMode(false)}
                          >
                            Cancel
                          </button>

                          <button
                            className="btn btn-primary"
                            onClick={handleSaveCertificate}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ================= VIEW MODE ================= */
                      <div>
                        {profileData.certificates?.length > 0 ? (
                          <>
                            {(showAllCertificates
                              ? profileData.certificates
                              : profileData.certificates.slice(0, 1)
                            ).map((cert) => (
                              <div
                                key={cert._id}
                                className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
                              >
                                <div>
                                  <h6 className="fw-bold mb-0">{cert.title}</h6>
                                  <small className="text-muted">
                                    Issue Date: {cert?.issueDate?.slice(0, 10)}
                                  </small>
                                </div>

                                <div>
                                  <button
                                    className="btn btn-sm text-primary"
                                    onClick={() => {
                                      setFormData({
                                        certificate_id: cert._id,
                                        title: cert.title,
                                        issueDate: cert.issueDate.slice(0, 10),
                                      });
                                      setCertificateEditMode(true);
                                    }}
                                  >
                                    <i className="fas fa-pencil-alt" />
                                  </button>

                                  <button
                                    className="btn btn-sm text-danger"
                                    onClick={() =>
                                      handleDeleteCertificate(cert._id)
                                    }
                                  >
                                    <i className="fas fa-trash" />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* SHOW MORE / SHOW LESS BUTTON */}
                            {profileData.certificates.length > 1 && (
                              <div className="text-center mt-2">
                                {!showAllCertificates ? (
                                  <button
                                    className="btn btn-outline-primary btn-sm rounded-pill px-4"
                                    onClick={() => setShowAllCertificates(true)}
                                  >
                                    Voir plus de certifications
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-outline-primary btn-sm rounded-pill px-4"
                                    onClick={() =>
                                      setShowAllCertificates(false)
                                    }
                                  >
                                    Afficher moins
                                  </button>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-muted">
                            No certificates added yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {!isEditingLinks ? (
                  // ================= VIEW MODE =================
                  <div className="saas-card">
                    <div className="saas-card-header">
                      <h4 className="saas-card-title">
                        <i className="fas fa-link" /> Portfolio & Social Links
                      </h4>

                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => {
                          setPortfolioLinks({
                            personalWebsite:
                              profileData?.links?.portfolio || "",
                            github: profileData?.links?.github || "",
                            linkedin: profileData?.links?.linkedin || "",
                          });

                          setIsEditingLinks(true);
                        }}
                      >
                        {profileData?.links ? "Edit" : "Add"}
                      </button>
                    </div>

                    <div className="d-flex flex-wrap gap-3">
                      {profileData?.links?.portfolio && (
                        <a
                          href={profileData.links.portfolio}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <i class="fas fa-globe me-1"></i>Website
                        </a>
                      )}

                      {profileData?.links?.linkedin && (
                        <a
                          href={profileData.links.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <i class="fab fa-linkedin me-1"></i> LinkedIn
                        </a>
                      )}

                      {profileData?.links?.github && (
                        <a
                          href={profileData.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <i class="fab fa-github me-1"></i> GitHub
                        </a>
                      )}

                      {!profileData?.links && <p>No links added yet.</p>}
                    </div>
                  </div>
                ) : (
                  // ================= EDIT MODE =================
                  <div className="saas-card">
                    <div className="saas-card-header">
                      <h4 className="saas-card-title">
                        <i className="fas fa-link" /> Portfolio & Social Links
                      </h4>

                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => setIsEditingLinks(false)}
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="saas-form-grid row">
                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">
                          <i className="fas fa-globe me-1" /> Personal Website
                        </label>
                        <input
                          className="saas-input"
                          type="url"
                          value={portfolioLinks.personalWebsite}
                          onChange={(e) =>
                            setPortfolioLinks({
                              ...portfolioLinks,
                              personalWebsite: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6 saas-form-group">
                        <label className="saas-label">
                          <i className="fab fa-linkedin me-1" /> LinkedIn
                        </label>
                        <input
                          className="saas-input"
                          type="url"
                          value={portfolioLinks.linkedin}
                          onChange={(e) =>
                            setPortfolioLinks({
                              ...portfolioLinks,
                              linkedin: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6 saas-form-group">
                        <label class="saas-label">
                          <i class="fab fa-github me-1"></i> GitHub
                        </label>
                        <input
                          className="saas-input"
                          type="url"
                          value={portfolioLinks.github}
                          onChange={(e) =>
                            setPortfolioLinks({
                              ...portfolioLinks,
                              github: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-12 text-end mt-2">
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            handleSavePortfolioLinks();
                            setIsEditingLinks(false);
                          }}
                        >
                          Save Links
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="saas-card">
                  <div className="saas-card-header d-flex justify-content-between align-items-center">
                    <h4 className="saas-card-title">
                      <i className="fas fa-folder-open" /> Documents
                    </h4>

                    <span className="badge bg-light text-dark">
                      {cvFiles.length + coverLetters.length} Files
                    </span>
                  </div>

                  <div className="row">
                    {/* ================= CV SECTION ================= */}
                    <div className="col-md-6 border-end">
                      <h6 className="text-muted mb-3 text-uppercase small fw-bold">
                        Resumes / CVs
                      </h6>

                      <div className="d-flex flex-column gap-2">
                        {/* ✅ CV LIST */}
                        {cvFiles.length > 0 ? (
                          cvFiles.map((cv, index) => {
                            const fileUrl =
                              typeof cv === "string"
                                ? `${API_IMAGE_URL}${cv}`
                                : cv?.url
                                  ? `${API_IMAGE_URL}${cv.url}`
                                  : null;

                            const fileName =
                              typeof cv === "string"
                                ? decodeURIComponent(cv.split("/").pop())
                                : cv?.url
                                  ? decodeURIComponent(cv.url.split("/").pop())
                                  : cv?.name || "Unknown file";

                            return (
                              <div
                                key={cv._id || index}
                                className="d-flex justify-content-between align-items-center bg-light p-2 rounded border"
                              >
                                <div className="d-flex align-items-center gap-2 overflow-hidden">
                                  <i className="fas fa-file-pdf text-danger" />
                                  <span
                                    className="text-truncate small"
                                    style={{ maxWidth: "150px" }}
                                  >
                                    {fileName}
                                  </span>
                                </div>

                                <div>
                                  {fileUrl && (
                                    <i
                                      className="fas fa-download text-muted me-2"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        window.open(fileUrl, "_blank")
                                      }
                                    />
                                  )}
                                  <i
                                    className="fas fa-trash text-danger"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleDeleteCv(cv._id || index)
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="small text-muted">
                            No CVs uploaded yet.
                          </p>
                        )}

                        {/* ✅ Upload Box */}
                        {cvFiles.length < 3 && (
                          <div className="upload-box text-center p-3 border border-dashed rounded bg-white mt-2">
                            <label style={{ cursor: "pointer" }}>
                              <i className="fas fa-cloud-upload-alt text-primary mb-1" />
                              <p className="small text-muted mb-0">Upload CV</p>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                multiple
                                hidden
                                onChange={handleUploadCv}
                              />
                            </label>
                          </div>
                        )}

                        {cvFiles.length >= 3 && (
                          <p className="text-danger small">
                            Max 3 CVs allowed. Delete one to upload new.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ================= COVER LETTER SECTION ================= */}
                    <div className="col-md-6 ps-md-4">
                      <h6 className="text-muted mb-3 text-uppercase small fw-bold mt-3 mt-md-0">
                        Cover Letters
                      </h6>

                      <div className="d-flex flex-column gap-2">
                        {/* ✅ Cover Letter List */}
                        {coverLetters.length > 0 ? (
                          coverLetters.map((cl, index) => {
                            const fileUrl =
                              typeof cl === "string"
                                ? `${API_IMAGE_URL}${cl}`
                                : cl?.url
                                  ? `${API_IMAGE_URL}${cl.url}`
                                  : null;

                            const fileName =
                              typeof cl === "string"
                                ? decodeURIComponent(cl.split("/").pop())
                                : cl?.url
                                  ? decodeURIComponent(cl.url.split("/").pop())
                                  : cl?.name || "Unknown file";

                            return (
                              <div
                                key={cl._id || index}
                                className="d-flex justify-content-between align-items-center bg-light p-2 rounded border"
                              >
                                <div className="d-flex align-items-center gap-2 overflow-hidden">
                                  <i className="fas fa-file-word text-primary" />
                                  <span
                                    className="text-truncate small"
                                    style={{ maxWidth: "150px" }}
                                  >
                                    {fileName}
                                  </span>
                                </div>

                                <div>
                                  {fileUrl && (
                                    <i
                                      className="fas fa-download text-muted me-2"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        window.open(fileUrl, "_blank")
                                      }
                                    />
                                  )}
                                  <i
                                    className="fas fa-trash text-danger"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleDeleteCoverLetter(cl._id || index)
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="small text-muted">
                            No Cover Letters uploaded yet.
                          </p>
                        )}

                        {/* ✅ Upload Box */}
                        {coverLetters.length < 3 && (
                          <div className="upload-box text-center p-3 border border-dashed rounded bg-white mt-2">
                            <label style={{ cursor: "pointer" }}>
                              <i className="fas fa-cloud-upload-alt text-primary mb-1" />
                              <p className="small text-muted mb-0">
                                Upload Cover Letter
                              </p>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                multiple
                                hidden
                                onChange={handleUploadCoverLetter}
                              />
                            </label>
                          </div>
                        )}

                        {coverLetters.length >= 3 && (
                          <p className="text-danger small">
                            Max 3 Cover Letters allowed.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*End My Profile Area*/}
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
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload CV</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setFile(null); // clear selected file
                    setFormData1((prev) => ({
                      ...prev,
                      attachment: null, // clear from formData
                    }));
                  }}
                />
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <div
                    className="custom-file-upload text-center"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.add("drag-active");
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove("drag-active");
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove("drag-active");

                      const droppedFiles = e.dataTransfer.files;
                      if (droppedFiles && droppedFiles.length > 0) {
                        // ✅ Reuse your existing handler
                        const fakeEvent = {
                          target: { files: droppedFiles },
                        };
                        handleFileChange1(fakeEvent);
                      }
                    }}
                  >
                    <label htmlFor="file-upload" className="fw-bold">
                      Upload Your File (PDF/DOC/DOCX)
                    </label>

                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={handleFileChange1}
                      className="input-hidden"
                    />

                    <label
                      htmlFor="file-upload"
                      className="file-text cursor-pointer"
                    >
                      <i
                        className="fas fa-cloud-upload-alt"
                        style={{
                          fontSize: "30px",
                          color: "#007bff",
                        }}
                      />
                      <br />
                      Click to Upload or drag & drop
                    </label>

                    {error && (
                      <div className="invalid-feedback d-block mt-2">
                        {error}
                      </div>
                    )}
                    {file && (
                      <div className="mt-2 text-success">
                        Selected: {file.name}
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      className="mt-3 default-btn btn"
                      onClick={uploadResume}
                      disabled={isUploading || isExtracting}
                    >
                      {isUploading || isExtracting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          />
                          {isUploading
                            ? "Uploading..."
                            : "Extracting Resume..."}
                        </>
                      ) : (
                        "Upload"
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {(isUploading || isExtracting) && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex
       justify-content-center align-items-center bg-white bg-opacity-75"
                  style={{ zIndex: 1050 }}
                >
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-3" />
                    <p className="fw-bold">
                      {isUploading
                        ? "Uploading resume..."
                        : "Extracting information from resume..."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CandidateProfile;
