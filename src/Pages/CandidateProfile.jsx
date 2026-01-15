import axios from "../utils/axiosInstance";
import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Select from "react-select";

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
  const { logout, updateProfileImage, updateName } = useAuth();
  const DEFAULT_IMAGE = "assets/images/dashboard/dashboard-img-5.jpg";
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobTypes, setJobTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);
  const [occupationTypes, setOccupationTypes] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const PROFICIENCY_LEVELS = [
    { label: "Basic", code: "A1/A2" },
    { label: "Limited working", code: "B1" },
    { label: "Professional working", code: "B2" },
    { label: "Full professional", code: "C1" },
    { label: "Native / Bilingual", code: "C2" },
  ];
  const [masterLanguages, setMasterLanguages] = useState([]); // from /getLanguage
  const [languageForm, setLanguageForm] = useState({
    language_id: "", // only when editing
    language: "", // language name from dropdown
    proficiency: "",
  });
  const [image, setImage] = useState(DEFAULT_IMAGE);
  console.log(image);
  const [storedImage, setStoredImage] = useState(null); // server stored image

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
        }
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
    employmentType: "",
    occupationType: "",
    eligibleToWork: false,
    salaryAmount: "",
    salaryType: "Hourly",
    salaryCurrency: "EUR",
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
    salaryCurrency: "USD",
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
        };

        const updated = languageForm.language_id
          ? profileData.languages.map((l) =>
              l._id === languageForm.language_id ? newLang : l
            )
          : [...(profileData.languages || []), newLang];

        setProfileData((prev) => ({ ...prev, languages: updated }));
        await fetchProfile();

        toast.success(
          languageForm.language_id ? "Language updated!" : "Language added!"
        );
        setLanguageForm({ language_id: "", language: "", proficiency: "" });
        setEditMode(false);
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
        { headers: { Authorization: `Bearer ${token}` } }
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
    setEditMode(true);
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
    });
    setEditMode(true);
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
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}DeleteAccount`,
        { reason, comments },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Account deleted:", res.data);
      const modal = document.getElementById("exampleModaldlt");
      const modalInstance = window.bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      toast.success("Your account has been deleted successfully!");
      logout(); // clears localStorage + state
      navigate("/"); // redirect to home or login
    } catch (error) {
      console.error("Error deleting account:", error);
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
        { autoClose: 2000, theme: "colored" }
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
          { headers: { Authorization: `Bearer ${token}` } }
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
  // const handleUploadCoverLetter = async (e) => {
  //   const files = e.target.files;
  //   if (!files.length) return;

  //   if (coverLetters.length >= 3) {
  //     toast.error(
  //       "You can upload only up to 3 cover letters. Please delete one first.",
  //       {
  //         autoClose: 2000,
  //         theme: "colored",
  //       }
  //     );
  //     return;
  //   }

  //   const token = localStorage.getItem("token");
  //   for (let file of files) {
  //     if (coverLetters.length >= 3) break;

  //     const formData = new FormData();
  //     formData.append("coverLetter", file);

  //     try {
  //       const response = await axios.put(
  //         `${API_BASE_URL}updateCoverLetter`,
  //         formData,
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );

  //       if (response.status === 200) {
  //         setCoverLetters((prev) => [
  //           ...prev,
  //           {
  //             name: file.name,
  //             url: response.data.coverLetterUrl, // ✅ backend returns this
  //             _id: String(response.data.coverLetterId || Date.now()), // always string
  //           },
  //         ]);
  //         await fetchProfile();
  //         toast.success("Cover letter uploaded successfully!", {
  //           autoClose: 2000,
  //           theme: "colored",
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Upload cover letter error:", error);
  //       toast.error("Failed to upload cover letter", {
  //         autoClose: 2000,
  //         theme: "colored",
  //       });
  //     }
  //   }
  // };
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
          { headers: { Authorization: `Bearer ${token}` } }
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

  // const handleUploadCv = async (e) => {
  //   const files = e.target.files;
  //   if (!files.length) return;

  //   // ✅ Validation: max 3 CVs allowed
  //   if (cvFiles.length >= 3) {
  //     toast.error("You can upload only up to 3 CVs. Please delete one first.", {
  //       autoClose: 2000,
  //       theme: "colored",
  //     });
  //     return;
  //   }

  //   const token = localStorage.getItem("token");

  //   for (let file of files) {
  //     if (cvFiles.length >= 3) break; // ✅ stop if already 3

  //     const formData = new FormData();
  //     formData.append("resume", file);

  //     try {
  //       const response = await axios.put(
  //         `${API_BASE_URL}updateResumeUrl`,
  //         formData,
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );

  //       if (response.status === 200) {
  //         setCvFiles((prev) => [
  //           ...prev,
  //           {
  //             name: file.name,
  //             url: response.data.resumeUrl,
  //             _id: String(response.data.resumeId || Date.now()), // ✅ always string
  //           },
  //         ]);
  //         await fetchProfile();

  //         toast.success("CV uploaded successfully!", {
  //           autoClose: 2000,
  //           theme: "colored",
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Upload CV error:", error);
  //       toast.error("Failed to upload CV", {
  //         autoClose: 2000,
  //         theme: "colored",
  //       });
  //     }
  //   }
  // };
  const handleDeleteCoverLetter = async (clId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}DeleteCoverLetter`,
        { coverLetterId: String(clId) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
        }
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
      eligibleToWork: profileData.careerGoals?.eligibleToWork || false,
      salaryAmount: profileData.careerGoals?.salaryAmount || "",
      salaryType: profileData.careerGoals?.salaryType || "Hourly",
      salaryCurrency: profileData.careerGoals?.salaryCurrency || "EUR",
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
      if (!careerGoalsData.desiredJobTitle?.trim()) {
        toast.error("Please enter a Desired Job Title", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (!careerGoalsData.employmentType) {
        toast.error("Please select a Job Type", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      if (!careerGoalsData.occupationType) {
        toast.error("Please select a Desired Occupation Type", {
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
          }
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

      // if (
      //   !careerGoalsData.salaryAmount ||
      //   isNaN(careerGoalsData.salaryAmount)
      // ) {
      //   toast.error("Please enter a valid Salary Amount", {
      //     autoClose: 2000,
      //     theme: "colored",
      //   });
      //   return;
      // }

      if (!careerGoalsData.lookingForJob) {
        toast.error("Please select a job opportunity", {
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }
      const token = localStorage.getItem("token");

      // ✅ Map form keys -> API keys
      const payload = {
        DesiredJobTitle: careerGoalsData.desiredJobTitle,
        DesiredEmploymentType: careerGoalsData.employmentType,
        DesiredOccupationType: careerGoalsData.occupationType,
        MinimumDesiredSalary: {
          amount: careerGoalsData.salaryAmount,
          currency: careerGoalsData.salaryCurrency,
          type: careerGoalsData.salaryType,
        },
        jobSearchStatus: careerGoalsData.lookingForJob,
        eligibleToWorkInFrance: careerGoalsData.eligibleToWork,
      };

      // const payload = {
      //   career_goals: {
      //     DesiredJobTitle: careerGoalsData.desiredJobTitle,
      //     DesiredEmploymentType: careerGoalsData.employmentType,
      //     DesiredOccupationType: careerGoalsData.occupationType,
      //     MinimumDesiredSalary: {
      //       amount: careerGoalsData.salaryAmount,
      //       currency: careerGoalsData.salaryCurrency,
      //       type: careerGoalsData.salaryType,
      //     },
      //     jobSearchStatus: careerGoalsData.lookingForJob,
      //   },

      //   // ✅ MUST BE OUTSIDE
      //   eligibleToWorkInFrance: careerGoalsData.eligibleToWork,
      // };

      const response = await axios.put(
        `${API_BASE_URL}updateCareerGoals`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
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
          },
          eligibleToWorkInFrance: payload.eligibleToWorkInFrance,
        }));

        setCheckStatus((prev) => ({ ...prev, careerGoals: 1 }));
        setEditMode(false);

        toast.success(
          profileData.career_goals
            ? "Career Goals updated successfully!"
            : "Career Goals added successfully!",
          { autoClose: 2000, theme: "colored" }
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
          `${API_BASE_URL}searchCities?key=${citySearch}`
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
        }
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
        setEditMode(false);

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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const updatedEducationList = educationForm.education_id
          ? educationList.map((edu) =>
              edu._id === educationForm.education_id
                ? { ...edu, ...educationForm }
                : edu
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
          { autoClose: 2000, theme: "colored" }
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setEducationList((prev) =>
          prev.filter((edu) => edu._id !== education_id)
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
      today.getDate()
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
        }
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
          autoClose: 2000,
          theme: "colored",
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
        }
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
        }
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
        }
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

        // ✅ Success toast
        toast.success(
          response.data.message || "About role updated successfully!",
          {
            autoClose: 2000,
            theme: "colored",
          }
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
        }
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
        yearOfExperience,
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

      // ✅ Experience validation
      if (
        !yearOfExperience ||
        isNaN(yearOfExperience) ||
        yearOfExperience <= 0
      ) {
        toast.error("Please enter valid Years of Experience", {
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

      // if (Number.isNaN(Number(salaryAmount)) || Number(salaryAmount) <= 0) {
      //   toast.error("Please enter valid Salary Amount", { theme: "colored" });
      //   return;
      // }

      if (!salaryType) {
        toast.error("Please select Payroll Frequency", { theme: "colored" });
        return;
      }

      // ✅ Clean Description — only send if not empty
      const cleanDescription =
        Description && Description.trim() !== ""
          ? Description.trim()
          : undefined;

      // ✅ Construct Payload (remove empty fields)
      const payload = {
        workHistory_id: workExperienceData.workHistory_id || undefined,
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        startDate,
        endDate: currentlyWorkingHere ? undefined : endDate || undefined,
        yearOfExperience,
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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
              (exp) => exp._id !== experience_id
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
      toast.error("Failed to update portfolio links", {
        position: "top-right",
        autoClose: 2000,
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
        }
      );

      if (response.status === 200) {
        toast.success(
          `Profile visibility updated to ${newValue ? "Visible" : "Hidden"}`,
          { autoClose: 2000, theme: "colored" }
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        // ✅ Update profileData state
        const updatedCertificates = formData.certificate_id
          ? profileData.certificates.map((c) =>
              c._id === formData.certificate_id ? { ...c, ...formData } : c
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
        setEditMode(false);

        // reset form
        setFormData({ certificate_id: "", title: "", issueDate: "" });
        await fetchProfile();
        toast.success(
          formData.certificate_id
            ? "Certificate updated successfully!"
            : "Certificate added successfully!",
          { autoClose: 2000, theme: "colored" }
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        // ✅ Remove deleted certificate from state
        setProfileData((prev) => ({
          ...prev,
          certificates: prev.certificates.filter(
            (c) => c._id !== certificate_id
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
    if (!newSkill.trim()) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}updateSkills`,
        { skills: [...skills, newSkill.trim()] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setSkills(res.data.skills); // API should return updated skills
        setNewSkill("");
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setSkills((prev) => prev.filter((s) => s !== skill));
        toast.success("Skill deleted successfully!", { theme: "colored" });
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill", { theme: "colored" });
    }
  };
  const cleanImageUrl = (url) => {
    console.log(url);
    if (!url) return "";

    // ✅ If local dashboard asset → return as-is (NO API_IMAGE_URL)
    if (url.startsWith("assets/images/dashboard/")) {
      return url;
    }

    // ✅ If URL wrongly contains "/uploads/https"
    if (url.includes("uploads/https")) {
      return url.substring(url.indexOf("https"));
    }

    // ✅ External URL (Google, GitHub, etc.)
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // ✅ Local uploaded image → prepend API base URL
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

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
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
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>My Account</h3>
              <div className="candidates-detail-main-area">
                <div className="candidates-img-detail-info">
                  <div className="candidates-img-info">
                    {/* Candidate Image */}
                    {isLoadingJobs ? (
                      <JobListLoader />
                    ) : (
                      <img
                        src={cleanImageUrl(image)}
                        alt="Candidate"
                        crossorigin="anonymous"
                      />
                    )}
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    {/* Edit icon */}
                    <div
                      className="img-edit-icon"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <i className="fas fa-pencil-alt" />
                    </div>
                  </div>
                  <div className="candidates-details-info">
                    <h3>
                      <strong>Name:</strong> {profileData.first_name}{" "}
                      {profileData.last_name}
                    </h3>

                    <h3>
                      <strong>Position:</strong> {profileData.position}
                    </h3>
                    <h3>
                      <strong>Email:</strong> {formatEmail(profileData.email)}
                    </h3>

                    <h3>
                      <strong>Contact:</strong> {profileData.phone}
                    </h3>
                    <h3>
                      <strong>Address:</strong> {profileData.city}
                    </h3>
                  </div>
                </div>
                <div className="profile-visibility-info-area">
                  <span className="visibility-icon-content">
                    <i className="fa-regular fa-eye" />{" "}
                    {profileVisible ? "Visible" : "Hidden"}
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={profileVisible}
                      onChange={handleToggleVisibility}
                    />
                    <span className="slider round" />
                  </label>
                  <h6
                    style={{
                      "font-weight": "500",
                      "font-size": "13px",
                      "margin-top": "10px",
                    }}
                  >
                    {profileVisible
                      ? "Your profile is visible to employers and recruiters!"
                      : "Make your profile information visible to employers and recruiters and get more job offers!"}
                  </h6>
                  <div className="candidate-personal-info-cv-linkedin-upload-btn">
                    <div className="candidate-personal-info-upload-cv-btn">
                      <a
                        href="#"
                        className="default-btn btn"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowModal(true);
                        }}
                      >
                        <i className="fa-solid fa-file" />
                        CV Auto Extractor
                      </a>
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
                                      e.currentTarget.classList.add(
                                        "drag-active"
                                      );
                                    }}
                                    onDragLeave={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      e.currentTarget.classList.remove(
                                        "drag-active"
                                      );
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      e.currentTarget.classList.remove(
                                        "drag-active"
                                      );

                                      const droppedFiles = e.dataTransfer.files;
                                      if (
                                        droppedFiles &&
                                        droppedFiles.length > 0
                                      ) {
                                        // ✅ Reuse your existing handler
                                        const fakeEvent = {
                                          target: { files: droppedFiles },
                                        };
                                        handleFileChange1(fakeEvent);
                                      }
                                    }}
                                  >
                                    <label
                                      htmlFor="file-upload"
                                      className="fw-bold"
                                    >
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
                      {/* Modal */}
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
                              <h5
                                className="modal-title"
                                id="exampleModalLabel"
                              >
                                Upload CV
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              />
                            </div>
                            <div className="modal-body">
                              <div className="form-group">
                                <div className="custom-file-upload text-center">
                                  <label>
                                    {" "}
                                    Upload Your File (PDF/DOC/DOCX)
                                  </label>

                                  {/* Hidden File Input */}
                                  <input
                                    type="file"
                                    id="file-upload"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                      handleUploadCv(e);

                                      // Close modal after upload
                                      const modalEl =
                                        document.getElementById("exampleModal");
                                      const modal =
                                        window.bootstrap.Modal.getInstance(
                                          modalEl
                                        );
                                      modal.hide();
                                    }}
                                    required
                                  />

                                  {/* Clickable + Drag & Drop Area */}
                                  <div
                                    className="file-text cursor-pointer border-primary p-3 rounded"
                                    onClick={() =>
                                      document
                                        .getElementById("file-upload")
                                        .click()
                                    }
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      e.currentTarget.style.backgroundColor =
                                        "#f1f9ff"; // light blue shade
                                      e.currentTarget.style.border =
                                        "2px dashed #007bff";
                                    }}
                                    onDragLeave={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      e.currentTarget.style.backgroundColor =
                                        "transparent";
                                      e.currentTarget.style.border =
                                        "1px solid #007bff";
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      e.currentTarget.style.backgroundColor =
                                        "transparent";
                                      e.currentTarget.style.border =
                                        "1px solid #007bff";

                                      const files = e.dataTransfer.files;
                                      if (files && files.length > 0) {
                                        const fakeEvent = { target: { files } };
                                        handleUploadCv(fakeEvent);

                                        // Close modal after drop
                                        const modalEl =
                                          document.getElementById(
                                            "exampleModal"
                                          );
                                        const modal =
                                          window.bootstrap.Modal.getInstance(
                                            modalEl
                                          );
                                        modal.hide();
                                      }
                                    }}
                                    style={{
                                      cursor: "pointer",

                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    <i
                                      className="fas fa-cloud-upload-alt"
                                      style={{
                                        fontSize: "30px",
                                        color: "#007bff",
                                      }}
                                    />
                                    <br />
                                    <label style={{ cursor: "pointer" }}>
                                      Click to Upload or drag &amp; drop
                                    </label>
                                  </div>

                                  <div className="invalid-feedback mt-2">
                                    Please select a file.
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="candidate-profile-detail-info">
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingOne">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Personal Details</h3>
                        {checkStatus.personalDetails === 0 ? (
                          <i
                            className="fa-solid fa-plus"
                            onClick={() => {
                              setPersonalDetails({
                                firstName: "",
                                lastName: "",
                                email: "",
                                phone: "",
                                countryCode: "",
                                birthYear: "",
                                gender: "",
                                city: "",
                                nationality: "",
                              }); // empty for new
                              setEditPersonal(true);

                              const collapseElement =
                                document.getElementById("collapseOne"); // ✅ FIXED
                              if (
                                collapseElement &&
                                !collapseElement.classList.contains("show")
                              ) {
                                new window.bootstrap.Collapse(collapseElement, {
                                  toggle: true,
                                });
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <i
                            className="fas fa-pencil-alt"
                            onClick={() => {
                              // pre-fill form with existing data

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
                                  : "", // ✅ formats to "2025-08-29"
                                gender: profileData?.gender || "",
                                city: profileData?.city || "",
                                nationality: profileData?.Nationality || "",
                              });

                              setEditPersonal(true);

                              const collapseElement =
                                document.getElementById("collapseOne"); // ✅ FIXED
                              if (
                                collapseElement &&
                                !collapseElement.classList.contains("show")
                              ) {
                                new window.bootstrap.Collapse(collapseElement, {
                                  toggle: true,
                                });
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </div>
                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="false"
                        aria-controls="collapseOne"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        {editPersonal || checkStatus.personalDetails === 0 ? (
                          <div className="profile-form-content from-all-input">
                            <div className="profile-form">
                              <form>
                                <div className="row">
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>First Name</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Enter Your First Name"
                                        value={personalDetails.firstName}
                                        onChange={(e) =>
                                          setPersonalDetails({
                                            ...personalDetails,
                                            firstName: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Last Name</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Enter Your Last Name"
                                        value={personalDetails.lastName}
                                        onChange={(e) =>
                                          setPersonalDetails({
                                            ...personalDetails,
                                            lastName: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Email (cannot change)</label>
                                      <input
                                        className="form-control"
                                        placeholder="Email"
                                        type="email"
                                        readOnly
                                        value={personalDetails.email}
                                        onChange={(e) =>
                                          setPersonalDetails({
                                            ...personalDetails,
                                            email: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div
                                    className="col-lg-6 col-md-12"
                                    ref={containerRef}
                                    style={{ position: "relative" }}
                                  >
                                    <div className="form-group">
                                      <label>Country code</label>

                                      <Select
                                        options={countryOptions}
                                        placeholder="Select country code"
                                        isSearchable={true}
                                        value={countryOptions.find(
                                          (opt) =>
                                            String(opt.value) ===
                                            personalDetails.countryCode
                                        )}
                                        onChange={(selected) => {
                                          setPersonalDetails((prev) => ({
                                            ...prev,
                                            countryCode: String(selected.value), // ✅ FIX HERE
                                          }));
                                        }}
                                        styles={{
                                          control: (base) => ({
                                            ...base,
                                            height: "45px",
                                            borderColor: "#ced4da",
                                          }),
                                        }}
                                      />
                                    </div>

                                    {open && (
                                      <ul
                                        className="list-group"
                                        style={{
                                          position: "absolute",
                                          width: "100%",
                                          maxHeight: "250px",
                                          overflowY: "auto",
                                          zIndex: 9999,
                                        }}
                                      >
                                        {filteredCountries.length > 0 ? (
                                          filteredCountries.map((c) => (
                                            <li
                                              key={c._id}
                                              className="list-group-item list-group-item-action d-flex align-items-center"
                                              onClick={() => handleSelect(c)}
                                              style={{ cursor: "pointer" }}
                                            >
                                              {c.emoji?.toUpperCase()} +
                                              {c.phonecode} {c.name}
                                            </li>
                                          ))
                                        ) : (
                                          <li className="list-group-item text-muted text-center">
                                            No country code found
                                          </li>
                                        )}
                                      </ul>
                                    )}
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Phone Number</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Enter Your Phone Number"
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
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Year Of Birth</label>
                                      <input
                                        className="form-control"
                                        type="date"
                                        max={
                                          new Date(
                                            new Date().setFullYear(
                                              new Date().getFullYear() - 18
                                            )
                                          )
                                            .toISOString()
                                            .split("T")[0]
                                        }
                                        value={personalDetails.birthYear}
                                        onChange={(e) =>
                                          setPersonalDetails({
                                            ...personalDetails,
                                            birthYear: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Gender Identity</label>
                                      <select
                                        className="form-control"
                                        value={personalDetails.gender}
                                        placeholder="Enter your gender identity"
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
                                  </div>

                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Country</label>
                                      <select
                                        className="form-select form-control"
                                        value={personalDetails.nationality}
                                        onChange={(e) =>
                                          setPersonalDetails({
                                            ...personalDetails,
                                            nationality: e.target.value,
                                          })
                                        }
                                      >
                                        <option value="">Select Country</option>
                                        {countries?.length > 0 &&
                                          countries.map((country, idx) => (
                                            <option
                                              key={idx}
                                              value={country.name || country}
                                            >
                                              {country.name || country}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group position-relative">
                                      <label>City</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Enter city"
                                        name="city"
                                        value={personalDetails.city}
                                        onChange={handleCitySearch}
                                        autoComplete="off"
                                      />

                                      {/* Suggestions Dropdown */}
                                      {loading && (
                                        <div className="suggestion-box">
                                          Searching...
                                        </div>
                                      )}
                                      {!loading &&
                                        citySuggestions?.length > 0 && (
                                          <ul
                                            className="list-group position-absolute w-100"
                                            style={{
                                              zIndex: 1000,
                                              maxHeight: "200px",
                                              overflowY: "auto",
                                            }}
                                          >
                                            {citySuggestions?.map((city) => (
                                              <li
                                                key={city._id}
                                                className="list-group-item list-group-item-action"
                                                onClick={() =>
                                                  handleSelectCity(city)
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
                                </div>
                                <div className="save-cancel-btn-info">
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={handleSavePersonal}
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={() => setEditPersonal(false)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        ) : (
                          <div className="user-all-detail-info-main">
                            <div className="user-all-details-info">
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>First name</label>
                                    <p>{profileData.first_name || "N/A"}</p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Last name</label>
                                    <p>{profileData.last_name || "N/A"}</p>
                                  </div>
                                </div>
                                <div className="divder-line-info" />
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Email (cannot change)</label>
                                    <p>{profileData.email || "N/A"}</p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Country Code</label>
                                    <p>
                                      <p>
                                        +{profileData?.countryCode || "N/A"}
                                      </p>
                                    </p>
                                  </div>
                                </div>

                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Phone number</label>
                                    <p>{profileData?.phone || "N/A"}</p>
                                  </div>
                                </div>
                                <div className="divder-line-info" />
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Year of birth</label>
                                    <p>
                                      {profileData.date_of_birth
                                        ? new Date(profileData.date_of_birth)
                                            .toISOString()
                                            .split("T")[0]
                                        : "N/A"}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Gender Identity</label>
                                    <p>{profileData.gender || "N/A"}</p>
                                  </div>
                                </div>

                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Country</label>
                                    <p>{profileData.Nationality || "N/A"}</p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>City</label>
                                    <p>{profileData.city || "N/A"}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="accordion" id="professionalSummary">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingTwo">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Professional Summary</h3>

                        {/* ✅ Show icon conditionally */}
                        {checkStatus.professionalSummary === 0 ? (
                          <i
                            className="fa-solid fa-plus"
                            onClick={() => {
                              setSummary(""); // empty for new
                              setEditMode(true);

                              const collapseElement =
                                document.getElementById("collapseTwo");
                              if (
                                collapseElement &&
                                !collapseElement.classList.contains("show")
                              ) {
                                new window.bootstrap.Collapse(collapseElement, {
                                  toggle: true,
                                });
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <i
                            className="fas fa-pencil-alt"
                            onClick={() => {
                              // pre-fill textarea with existing summary
                              setSummary(
                                profileData?.professionalSummary || ""
                              );
                              setEditMode(true);

                              // expand accordion
                              const collapseElement =
                                document.getElementById("collapseTwo");
                              if (
                                collapseElement &&
                                !collapseElement.classList.contains("show")
                              ) {
                                new window.bootstrap.Collapse(collapseElement, {
                                  toggle: true,
                                });
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </div>

                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="true"
                        aria-controls="collapseTwo"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>

                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#professionalSummary"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        {editMode || checkStatus.professionalSummary === 0 ? (
                          <div className="profile-form-content from-all-input">
                            <div className="profile-form">
                              <form>
                                <div className="row">
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>Professional Summary</label>
                                      <textarea
                                        className="form-control"
                                        placeholder="Write Brief Bio Or Introduction"
                                        rows={7}
                                        value={summary}
                                        onChange={(e) =>
                                          setSummary(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="save-cancel-btn-info">
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={handleSave}
                                  >
                                    Save
                                  </button>
                                  {/* <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={() => {
                                      setEditMode(false);
                                    }}
                                  >
                                    Cancel
                                  </button> */}
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={() => {
                                      setEditMode(false);

                                      // also collapse the accordion manually
                                      const collapseElement =
                                        document.getElementById("collapseTwo");
                                      if (
                                        collapseElement &&
                                        collapseElement.classList.contains(
                                          "show"
                                        )
                                      ) {
                                        new window.bootstrap.Collapse(
                                          collapseElement,
                                          { toggle: true }
                                        );
                                      }
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        ) : (
                          /* ✅ Otherwise show user info */
                          <div className="user-all-detail-info-main">
                            <div className="user-all-details-info">
                              <div className="row">
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>Professional Summary</label>
                                    <p>
                                      {profileData?.professionalSummary ||
                                        "No professional summary added yet."}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion" id="coveLatter">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingFour">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>My CVs</h3>
                      </div>
                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="true"
                        aria-controls="collapseFour"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>

                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFour"
                    data-bs-parent="#myCvs"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        <div className="profile-form">
                          <form>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                {/* ✅ CV LIST */}
                                {cvFiles.length > 0 ? (
                                  cvFiles.map((cv, index) => {
                                    // Case 1: API response object → has `_id` + `url`
                                    // Case 2: Newly uploaded file → has `name` but no `url`
                                    const fileUrl =
                                      typeof cv === "string"
                                        ? `${API_IMAGE_URL}${cv}`
                                        : cv?.url
                                        ? `${API_IMAGE_URL}${cv.url}`
                                        : null;

                                    const fileName =
                                      typeof cv === "string"
                                        ? decodeURIComponent(
                                            cv.split("/").pop()
                                          )
                                        : cv?.url
                                        ? decodeURIComponent(
                                            cv.url.split("/").pop()
                                          )
                                        : cv?.name || "Unknown file";

                                    return (
                                      <div
                                        key={cv._id || index}
                                        className="upload-download-dlt-cv d-flex justify-content-between align-items-center mb-2"
                                      >
                                        {/* File name */}
                                        <div className="upload-cv-info-area">
                                          <p>
                                            <i className="fas fa-file-alt" />{" "}
                                            {fileName}
                                          </p>
                                        </div>

                                        {/* 3-dot menu */}
                                        <div className="download-dlt-cv position-relative">
                                          <i
                                            className="fas fa-ellipsis-v"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              setMenuOpenId(
                                                menuOpenId === (cv._id || index)
                                                  ? null
                                                  : cv._id || index
                                              )
                                            }
                                          />
                                          {menuOpenId === (cv._id || index) && (
                                            <div className="download-edit-info">
                                              <ul>
                                                {fileUrl && (
                                                  <li
                                                    onClick={() =>
                                                      window.open(
                                                        fileUrl,
                                                        "_blank"
                                                      )
                                                    }
                                                  >
                                                    <i className="fa-solid fa-arrow-down" />{" "}
                                                    Download
                                                  </li>
                                                )}
                                                <li
                                                  onClick={() =>
                                                    handleDeleteCv(
                                                      cv._id || index
                                                    )
                                                  }
                                                >
                                                  <i className="fa-solid fa-trash" />{" "}
                                                  Delete
                                                </li>
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p
                                    className="text-center"
                                    style={{ padding: "2px" }}
                                  >
                                    No CVs uploaded yet.
                                  </p>
                                )}

                                {/* ✅ Upload Input */}
                                {/* ✅ Upload Input */}
                                <div className="upload-cv-area mt-3">
                                  <input
                                    type="file"
                                    name="resume"
                                    accept=".pdf, .doc, .docx"
                                    multiple
                                    onChange={handleUploadCv}
                                    disabled={cvFiles.length >= 3} // 🚫 disable when limit reached
                                  />
                                  {cvFiles.length >= 3 && (
                                    <p className="text-danger mt-2">
                                      You can upload up to 3 CVs. To upload a
                                      new CV, delete an existing one.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion" id="coveLatter">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingFour">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Cover Letter</h3>
                      </div>
                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour1"
                        aria-expanded="true"
                        aria-controls="collapseFour1"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>

                  <div
                    id="collapseFour1"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFour"
                    data-bs-parent="#coveLatter"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        <div className="profile-form">
                          <form>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                {/* ✅ CV LIST */}
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
                                        ? decodeURIComponent(
                                            cl.split("/").pop()
                                          )
                                        : cl?.url
                                        ? decodeURIComponent(
                                            cl.url.split("/").pop()
                                          )
                                        : cl?.name || "Unknown file";

                                    return (
                                      <div
                                        key={cl._id || index}
                                        className="upload-download-dlt-cv d-flex justify-content-between align-items-center mb-2"
                                      >
                                        <div className="upload-cv-info-area">
                                          <p>
                                            <i className="fas fa-file-alt" />{" "}
                                            {fileName}
                                          </p>
                                        </div>

                                        <div className="download-dlt-cv position-relative">
                                          <i
                                            className="fas fa-ellipsis-v"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              setMenuOpenIdCL(
                                                menuOpenIdCL ===
                                                  (cl._id || index)
                                                  ? null
                                                  : cl._id || index
                                              )
                                            }
                                          />
                                          {menuOpenIdCL ===
                                            (cl._id || index) && (
                                            <div className="download-edit-info">
                                              <ul>
                                                {fileUrl && (
                                                  <li
                                                    onClick={() =>
                                                      window.open(
                                                        fileUrl,
                                                        "_blank"
                                                      )
                                                    }
                                                  >
                                                    <i className="fa-solid fa-arrow-down" />{" "}
                                                    Download
                                                  </li>
                                                )}
                                                <li
                                                  onClick={() =>
                                                    handleDeleteCoverLetter(
                                                      cl._id || index
                                                    )
                                                  }
                                                >
                                                  <i className="fa-solid fa-trash" />{" "}
                                                  Delete
                                                </li>
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p
                                    className="text-center"
                                    style={{ padding: "2px" }}
                                  >
                                    No Cover Letters uploaded yet.
                                  </p>
                                )}

                                {/* ✅ Upload Input */}
                                <div className="upload-cv-area mt-3">
                                  <input
                                    type="file"
                                    name="coverLetter"
                                    accept=".pdf, .doc, .docx"
                                    multiple
                                    onChange={handleUploadCoverLetter}
                                    disabled={coverLetters.length >= 3}
                                  />
                                  {coverLetters.length >= 3 && (
                                    <p className="text-danger mt-2">
                                      You can upload up to 3 Cover Letters. To
                                      upload a new one, delete an existing one.
                                    </p>
                                  )}
                                </div>

                                {/* ✅ Upload Input */}
                                {/* ✅ Upload Input */}
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion" id="accordionCareerGoals">
                {" "}
                {/* ✅ unique parent ID */}
                <div className="accordion-item">
                  <div className="accordion-header" id="headingCareerGoals">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Career Goals</h3>
                        {checkStatus.careerGoals === 0 ? (
                          <i
                            className="fa-solid fa-plus"
                            onClick={() => {
                              setCareerGoalsData({
                                desiredJobTitle: "",
                                employmentType: "",
                                occupationType: "",
                                salaryAmount: "",
                                salaryCurrency: "MAD",
                                salaryType: "Hourly",
                                lookingForJob: "",
                                eligibleToWork: false,
                              });
                              setEditMode(true);

                              const collapseElement = document.getElementById(
                                "collapseCareerGoals"
                              );
                              if (
                                collapseElement &&
                                !collapseElement.classList.contains("show")
                              ) {
                                new window.bootstrap.Collapse(collapseElement, {
                                  toggle: true,
                                });
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <i
                            className="fas fa-pencil-alt"
                            onClick={() => {
                              setCareerGoalsData({
                                desiredJobTitle:
                                  profileData.career_goals?.DesiredJobTitle ||
                                  "",
                                employmentType:
                                  profileData.career_goals
                                    ?.DesiredEmploymentType || "",
                                occupationType:
                                  profileData.career_goals
                                    ?.DesiredOccupationType || "",
                                salaryAmount:
                                  profileData.career_goals?.MinimumDesiredSalary
                                    ?.amount || "",
                                salaryCurrency:
                                  profileData.career_goals?.MinimumDesiredSalary
                                    ?.currency || "EUR",
                                salaryType:
                                  profileData.career_goals?.MinimumDesiredSalary
                                    ?.type || "Hourly",
                                lookingForJob:
                                  profileData.career_goals?.jobSearchStatus ||
                                  "",
                                eligibleToWork:
                                  profileData.eligibleToWorkInFrance ?? false,
                              });
                              setEditMode(true);

                              const collapseElement = document.getElementById(
                                "collapseCareerGoals"
                              );
                              if (
                                collapseElement &&
                                !collapseElement.classList.contains("show")
                              ) {
                                new window.bootstrap.Collapse(collapseElement, {
                                  toggle: true,
                                });
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </div>

                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseCareerGoals"
                        aria-expanded="false"
                        aria-controls="collapseCareerGoals"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>

                  <div
                    id="collapseCareerGoals"
                    className="accordion-collapse collapse" // ✅ 'collapse' only, no 'show'
                    aria-labelledby="headingCareerGoals"
                    data-bs-parent="#accordionCareerGoals"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        {editMode || checkStatus.careerGoals === 0 ? (
                          <div className="profile-form-content from-all-input">
                            <div className="profile-form">
                              <form>
                                <div className="row">
                                  {/* Desired Job Title */}
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>Desired Job Title</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="desiredJobTitle"
                                        value={careerGoalsData.desiredJobTitle}
                                        onChange={handleCareerGoalsChange}
                                        placeholder="Desired Job Title"
                                      />
                                    </div>
                                  </div>

                                  {/* Employment Type */}
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Job Type</label>
                                      <select
                                        className="form-select form-control"
                                        name="employmentType"
                                        value={careerGoalsData.employmentType}
                                        onChange={handleCareerGoalsChange}
                                      >
                                        <option value="">
                                          Select Employment Type
                                        </option>

                                        {jobTypes?.map((job) => (
                                          <option
                                            key={job._id}
                                            value={job.name}
                                          >
                                            {job.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  {/* Occupation Type */}
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Desired Occupation Type</label>
                                      <select
                                        className="form-select form-control"
                                        name="occupationType"
                                        value={careerGoalsData.occupationType}
                                        onChange={handleCareerGoalsChange}
                                      >
                                        <option value="">
                                          Select Occupation Type
                                        </option>

                                        {occupationTypes?.map((item) => (
                                          <option
                                            key={item._id}
                                            value={item.name}
                                          >
                                            {item.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  {/* Eligible to work */}
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Other Preferences</label>
                                      <div className="currently-working-here">
                                        <input
                                          type="checkbox"
                                          id="eligibleToWork"
                                          name="eligibleToWork"
                                          className="mb-2"
                                          checked={
                                            careerGoalsData.eligibleToWork
                                          }
                                          onChange={handleCareerGoalsChange}
                                        />
                                        <label htmlFor="eligibleToWork">
                                          I am eligible to work in France
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Salary */}
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>
                                        Minimum Desired Salary (Gross)
                                      </label>
                                      <div className="form-group mb-2">
                                        {[
                                          "Hourly",
                                          "Daily",
                                          "Monthly",
                                          "Yearly",
                                        ].map((type) => (
                                          <span key={type} className="me-2">
                                            <input
                                              type="radio"
                                              id={type}
                                              name="salaryType"
                                              value={type}
                                              checked={
                                                careerGoalsData.salaryType ===
                                                type
                                              }
                                              onChange={handleCareerGoalsChange}
                                            />
                                            &nbsp;
                                            <label htmlFor={type}>{type}</label>
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-3 col-md-6">
                                    <div className="form-group">
                                      <select
                                        className="form-select form-control"
                                        name="salaryCurrency"
                                        value={careerGoalsData.salaryCurrency}
                                        onChange={handleCareerGoalsChange}
                                      >
                                        <option value="MAD">MAD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="USD">USD</option>
                                        <option value="JPY">JPY</option>
                                        <option value="GBP">GBP</option>
                                        <option value="AUD">AUD</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="col-lg-9 col-md-9">
                                    <div className="form-group">
                                      <input
                                        type="number"
                                        className="form-control mb-2"
                                        placeholder="Enter your gross minimum desired salary"
                                        name="salaryAmount"
                                        value={careerGoalsData.salaryAmount}
                                        onChange={handleCareerGoalsChange}
                                      />
                                    </div>
                                  </div>

                                  {/* Looking for job */}
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>
                                        Looking for a new job opportunity?
                                      </label>
                                      <div className="form-group">
                                        <input
                                          type="radio"
                                          id="immediate"
                                          name="lookingForJob"
                                          value="Yes, I need one as soon as possible"
                                          checked={
                                            careerGoalsData.lookingForJob ===
                                            "Yes, I need one as soon as possible"
                                          }
                                          onChange={handleCareerGoalsChange}
                                        />
                                        &nbsp;
                                        <label htmlFor="immediate">
                                          Yes, I need one as soon as possible
                                        </label>
                                        <input
                                          type="radio"
                                          id="open"
                                          name="lookingForJob"
                                          value="Open to the right opportunity"
                                          checked={
                                            careerGoalsData.lookingForJob ===
                                            "Open to the right opportunity"
                                          }
                                          onChange={handleCareerGoalsChange}
                                          className="ms-2"
                                        />
                                        &nbsp;
                                        <label htmlFor="open">
                                          Open to the right opportunity
                                        </label>
                                        <input
                                          type="radio"
                                          id="no"
                                          name="lookingForJob"
                                          value="No, I'm not looking"
                                          checked={
                                            careerGoalsData.lookingForJob ===
                                            "No, I'm not looking"
                                          }
                                          onChange={handleCareerGoalsChange}
                                          className="ms-2"
                                        />
                                        &nbsp;
                                        <label htmlFor="no">
                                          No, I'm not looking
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Save/Cancel Buttons */}
                                <div className="save-cancel-btn-info mt-3">
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={handleSaveGoals}
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={() => setEditMode(false)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        ) : (
                          // Display Existing Career Goals
                          <div className="user-all-detail-info-main">
                            <div className="user-all-details-info">
                              <div className="row">
                                <div className="col-lg-4 col-md-6">
                                  <div className="form-group">
                                    <label>Desired Job Title</label>
                                    <p>
                                      {profileData.career_goals
                                        ?.DesiredJobTitle || "-"}
                                    </p>
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6">
                                  <div className="form-group">
                                    <label>Job Type</label>
                                    <p>
                                      {profileData.career_goals
                                        ?.DesiredEmploymentType || "-"}
                                    </p>
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6">
                                  <div className="form-group">
                                    <label>Desired Occupation Type</label>
                                    <p>
                                      {profileData.career_goals
                                        ?.DesiredOccupationType || "-"}
                                    </p>
                                  </div>
                                </div>

                                <div className="divder-line-info" />

                                <div className="col-lg-4 col-md-6">
                                  <div className="form-group">
                                    <label>Eligible to work in</label>
                                    <p>
                                      {profileData.eligibleToWorkInFrance
                                        ? "France"
                                        : "-"}
                                    </p>
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6">
                                  <div className="form-group">
                                    <label>
                                      Minimum Desired Salary (Gross)
                                    </label>
                                    <p>
                                      {profileData.career_goals
                                        ?.MinimumDesiredSalary
                                        ? `${profileData.career_goals.MinimumDesiredSalary.currency} ${profileData.career_goals.MinimumDesiredSalary.amount} / ${profileData.career_goals.MinimumDesiredSalary.type}`
                                        : "-"}
                                    </p>
                                  </div>
                                </div>

                                <div className="col-lg-4 col-md-6">
                                  <div className="form-group">
                                    <label>
                                      Looking for a new job opportunity?
                                    </label>
                                    <p>
                                      {" "}
                                      {profileData.career_goals
                                        ?.jobSearchStatus || "-"}{" "}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion" id="yourRole">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingSix">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>About your role</h3>
                        {checkStatus.aboutRole === 0 ? (
                          <i
                            className="fa-solid fa-plus"
                            onClick={() => {
                              setAboutRole({
                                jobTitle: "",
                                yearsOfExperience: "",
                                jobCategory: "",
                              });
                              setEditAboutRole(true);

                              const collapseElement =
                                document.getElementById("collapseSix");
                              if (
                                collapseElement &&
                                !collapseElement.classList.contains("show")
                              ) {
                                new window.bootstrap.Collapse(collapseElement, {
                                  toggle: true,
                                });
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <i
                            className="fas fa-pencil-alt"
                            onClick={() => {
                              setAboutRole({
                                jobTitle:
                                  profileData?.aboutRole?.jobTitle || "",
                                yearsOfExperience:
                                  profileData?.aboutRole?.yearOfExperience ||
                                  "",
                                jobCategory:
                                  profileData?.aboutRole?.jobCategory || "",
                              });
                              setEditAboutRole(true);

                              const collapseElement =
                                document.getElementById("collapseSix");
                              if (
                                collapseElement &&
                                !collapseElement.classList.contains("show")
                              ) {
                                new window.bootstrap.Collapse(collapseElement, {
                                  toggle: true,
                                });
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </div>
                      <span
                        className="ms-auto accordion-icon-toggle collapsed" // ✅ keep 'collapsed'
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseSix"
                        aria-expanded="false" // ✅ should be false when closed
                        aria-controls="collapseSix"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>
                  <div
                    id="collapseSix"
                    className="accordion-collapse collapse" // ✅ note: 'collapse' only, not 'show'
                    aria-labelledby="headingSix"
                    data-bs-parent="#yourRole"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        {editAboutRole || checkStatus.aboutRole === 0 ? (
                          <div className="profile-form-content from-all-input">
                            <div className="profile-form">
                              <form>
                                <div className="row">
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Job Title</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Job Title"
                                        value={aboutRole.jobTitle}
                                        onChange={(e) =>
                                          setAboutRole({
                                            ...aboutRole,
                                            jobTitle: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Years of experience</label>
                                      <input
                                        className="form-control"
                                        type="number"
                                        placeholder="Years of Experience"
                                        value={aboutRole.yearsOfExperience}
                                        onChange={(e) =>
                                          setAboutRole({
                                            ...aboutRole,
                                            yearsOfExperience: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Job Category</label>
                                      <select
                                        className="form-select form-control"
                                        value={aboutRole.jobCategory}
                                        onChange={(e) =>
                                          setAboutRole({
                                            ...aboutRole,
                                            jobCategory: e.target.value,
                                          })
                                        }
                                      >
                                        <option value="">
                                          Select Job Category
                                        </option>

                                        {/* ✅ Map dynamic categories from API */}
                                        {categoryList?.map((category) => (
                                          <option
                                            key={category._id}
                                            value={category.name}
                                          >
                                            {category.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="save-cancel-btn-info">
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={handleSaveAboutRole}
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={() => setEditAboutRole(false)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        ) : (
                          <div className="user-all-detail-info-main">
                            <div className="user-all-details-info">
                              <div className="row">
                                <div className="col-lg-4 col-md-6">
                                  <div className="form-group">
                                    <label>Job Title</label>
                                    <p>
                                      {profileData?.aboutRole?.jobTitle ||
                                        "Not provided"}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form-group">
                                    <label>Years of experience</label>
                                    <p>
                                      {profileData?.aboutRole
                                        ?.yearOfExperience || "Not provided"}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="form-group">
                                    <label>Job category</label>
                                    <p>
                                      {profileData?.aboutRole?.jobCategory ||
                                        "Not provided"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion" id="accordionWorkExperience">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingSeven">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Work Experience</h3>

                        {/* ✅ Always show only Add button */}
                        <i
                          className="fa-solid fa-plus"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setWorkExperienceData({
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
                            setEditMode(true);

                            // Open collapse when adding
                            const collapseElement =
                              document.getElementById("collapseSeven");
                            if (
                              collapseElement &&
                              !collapseElement.classList.contains("show")
                            ) {
                              new window.bootstrap.Collapse(collapseElement, {
                                toggle: true,
                              });
                            }
                          }}
                        />
                      </div>

                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseSeven"
                        aria-expanded="true"
                        aria-controls="collapseSeven"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>

                  <div
                    id="collapseSeven"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingSeven"
                    data-bs-parent="#accordionWorkExperience"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        <div className="profile-form-content from-all-input">
                          <div className="profile-form">
                            {editMode ? (
                              /* ✅ FORM SECTION */
                              <form>
                                <div className="row">
                                  {/* Job Title */}
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Job Title</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        name="jobTitle"
                                        value={workExperienceData.jobTitle}
                                        onChange={handleChangeOfWork}
                                      />
                                    </div>
                                  </div>

                                  {/* Years of Experience */}
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Years of Experience</label>
                                      <input
                                        className="form-control"
                                        type="number"
                                        name="yearOfExperience"
                                        value={
                                          workExperienceData.yearOfExperience
                                        }
                                        onChange={handleChangeOfWork}
                                      />
                                    </div>
                                  </div>

                                  {/* Company Name */}
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>Company Name</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        name="companyName"
                                        value={workExperienceData.companyName}
                                        onChange={handleChangeOfWork}
                                      />
                                    </div>
                                  </div>
                                  <div className="currently-working-here">
                                    <input
                                      type="checkbox"
                                      id="CurrentlyWorking"
                                      name="currentlyWorkingHereEmp"
                                      checked={
                                        workExperienceData.currentlyWorkingHereEmp
                                      }
                                      onChange={handleChangeOfWork}
                                    />
                                    <label htmlFor="CurrentlyWorking">
                                      &nbsp;Keep my current employer anonymous
                                    </label>
                                  </div>
                                  {/* Start / End Date */}
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Start Date</label>
                                      <input
                                        className="form-control"
                                        type="date"
                                        name="startDate"
                                        value={workExperienceData.startDate}
                                        onChange={handleChangeOfWork}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>End Date</label>
                                      <input
                                        className="form-control"
                                        type="date"
                                        name="endDate"
                                        value={workExperienceData.endDate}
                                        onChange={handleChangeOfWork}
                                        disabled={
                                          workExperienceData.currentlyWorkingHere
                                        }
                                      />
                                    </div>
                                  </div>

                                  {/* Checkbox */}
                                  <div className="currently-working-here">
                                    <input
                                      type="checkbox"
                                      id="CurrentlyWorking"
                                      name="currentlyWorkingHere"
                                      checked={
                                        workExperienceData.currentlyWorkingHere
                                      }
                                      onChange={handleChangeOfWork}
                                    />
                                    <label htmlFor="CurrentlyWorking">
                                      &nbsp; I Am Currently Working Here
                                    </label>
                                  </div>

                                  {/* Achievements */}
                                  <div className="col-lg-12">
                                    <div className="form-group">
                                      <label>Achievements</label>
                                      <textarea
                                        className="form-control"
                                        name="Description"
                                        value={workExperienceData.Description}
                                        onChange={handleChangeOfWork}
                                        rows={7}
                                      />
                                    </div>
                                  </div>

                                  {/* Employment Type */}
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>Employment Type</label>

                                      <select
                                        className="form-select form-control"
                                        name="EmploymentType"
                                        value={
                                          workExperienceData.EmploymentType ||
                                          ""
                                        }
                                        onChange={handleChangeOfWork}
                                      >
                                        <option value="">
                                          Select employment type
                                        </option>

                                        {jobTypes?.map((job) => (
                                          <option
                                            key={job._id}
                                            value={job.name}
                                          >
                                            {job.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  {/* Work Location */}
                                  {/* <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>Work Location</label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        name="workLocation"
                                        value={workExperienceData.workLocation}
                                        onChange={handleChangeOfWork}
                                      />
                                    </div>
                                  </div> */}
                                  {/* Work Location with Auto Search */}
                                  <div className="col-lg-12 col-md-12">
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
                                        <div className="suggestion-box">
                                          Searching...
                                        </div>
                                      )}
                                      {!loading &&
                                        citySuggestions.length > 0 && (
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

                                  {/* Salary */}
                                  <div className="col-lg-2 col-md-2">
                                    <div className="form-group">
                                      <label>Currency</label>
                                      <select
                                        className="form-select form-control"
                                        name="salaryCurrency"
                                        value={
                                          workExperienceData.salaryCurrency
                                        }
                                        onChange={handleChangeOfWork}
                                      >
                                        <option value="MAD"> MAD</option>

                                        <option value="USD">USD</option>

                                        <option value="EUR">EUR</option>
                                        <option value="JPY">JPY</option>
                                        <option value="GBP">GBP</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Salary Amount</label>
                                      <input
                                        className="form-control"
                                        type="number"
                                        name="salaryAmount"
                                        value={workExperienceData.salaryAmount}
                                        onChange={handleChangeOfWork}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-md-4">
                                    <div className="form-group">
                                      <label>Payroll Frequency</label>
                                      <select
                                        className="form-select form-control"
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
                                  </div>
                                </div>

                                <div className="save-cancel-btn-info">
                                  <button
                                    type="button"
                                    onClick={handleSaveWorkExperience}
                                    className="default-btn btn"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditMode(false)}
                                    className="default-btn btn"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              /* ✅ LIST VIEW SECTION (Multiple Items) */

                              <div className="user-all-detail-info-main">
                                {profileData?.workHistory &&
                                profileData.workHistory.length > 0 ? (
                                  profileData?.workHistory?.map(
                                    (exp, index) => (
                                      <div
                                        key={index}
                                        className="user-all-details-info"
                                      >
                                        {/* ✏️ Edit button */}
                                        <div className="work-exprinace-edit">
                                          <i
                                            className="fas fa-pencil-alt"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                              setWorkExperienceData({
                                                workHistory_id: exp._id || "",
                                                companyName:
                                                  exp.companyName || "",
                                                jobTitle: exp.jobTitle || "",
                                                startDate:
                                                  exp.startDate?.split(
                                                    "T"
                                                  )[0] || "",
                                                endDate:
                                                  exp.endDate?.split("T")[0] ||
                                                  "",
                                                yearOfExperience:
                                                  exp.yearOfExperience || "",
                                                currentlyWorkingHere:
                                                  exp.currentlyWorkingHere ||
                                                  false,
                                                currentlyWorkingHereEmp:
                                                  exp.keep_employer_anonymous ||
                                                  false,

                                                Description:
                                                  exp.Description || "",
                                                EmploymentType:
                                                  exp.EmploymentType || "",
                                                workLocation:
                                                  exp.workLocation || "",
                                                salaryAmount:
                                                  exp.currentSalary?.amount ||
                                                  "",
                                                salaryCurrency:
                                                  exp.currentSalary?.currency ||
                                                  "USD",
                                                salaryType:
                                                  exp.currentSalary
                                                    ?.payrollFrequency ||
                                                  "Monthly",
                                              });
                                              setEditMode(true);

                                              const collapseElement =
                                                document.getElementById(
                                                  "collapseSeven"
                                                );
                                              if (
                                                collapseElement &&
                                                !collapseElement.classList.contains(
                                                  "show"
                                                )
                                              ) {
                                                new window.bootstrap.Collapse(
                                                  collapseElement,
                                                  { toggle: true }
                                                );
                                              }
                                            }}
                                          />
                                          <i
                                            className="fas fa-trash ms-2"
                                            style={{
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              handleDeleteWorkExperience(
                                                exp._id
                                              )
                                            }
                                          />
                                        </div>

                                        {/* Work experience display */}
                                        <div className="row">
                                          <div className="col-lg-12 col-md-12">
                                            <div className="form-group">
                                              <label>{exp.jobTitle}</label>
                                              <p>
                                                {exp.startDate?.split("T")[0]} -{" "}
                                                {exp.currentlyWorkingHere
                                                  ? "Present"
                                                  : exp.endDate?.split("T")[0]}
                                              </p>
                                              <p>
                                                <i className="fa-regular fa-building" />{" "}
                                                {exp.companyName}
                                              </p>
                                              <p>{exp.EmploymentType}</p>
                                              <label>Years of Experience</label>
                                              <p>{exp.yearOfExperience}</p>
                                            </div>
                                            <div className="divder-line-info" />
                                          </div>

                                          <div className="col-lg-12 col-md-12">
                                            <div className="form-group">
                                              <label>Achievements</label>
                                              <p>{exp.Description}</p>
                                            </div>
                                            <div className="form-group">
                                              <label>Work Location</label>
                                              <p>{exp.workLocation}</p>
                                            </div>
                                            <div className="divder-line-info" />
                                          </div>

                                          <div className="col-lg-12 col-md-12">
                                            <div className="form-group">
                                              <label>Salary</label>
                                              <p>
                                                {exp.currentSalary?.currency}{" "}
                                                {exp.currentSalary?.amount}
                                              </p>
                                              <label>Payroll frequency</label>
                                              <p>
                                                {
                                                  exp.currentSalary
                                                    ?.payrollFrequency
                                                }
                                              </p>
                                            </div>
                                          </div>
                                          <div className="divder-line-info-otherCompany" />
                                        </div>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <p className="text-muted">
                                    No work experience added yet.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion" id="educationDetail">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingEducation">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Education</h3>
                        {/* Add new education */}
                        <i
                          className="fa-solid fa-plus"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setEducationForm({
                              education_id: "",
                              degree: "",
                              University: "",
                              startDate: "",
                              endDate: "",
                              currentlyStudyingHere: false,
                            });
                            setIsEditing(true);

                            const collapseElement =
                              document.getElementById("collapseEducation");
                            if (
                              collapseElement &&
                              !collapseElement.classList.contains("show")
                            ) {
                              new window.bootstrap.Collapse(collapseElement, {
                                toggle: true,
                              });
                            }
                          }}
                        />
                      </div>

                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseEducation"
                        aria-expanded="true"
                        aria-controls="collapseEducation"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>

                  <div
                    id="collapseEducation"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingEducation"
                    data-bs-parent="#educationDetail"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        {isEditing ? (
                          // ✅ Education form
                          <div className="profile-form-content from-all-input">
                            <div className="profile-form">
                              <form>
                                <div className="row">
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Degree</label>
                                      <select
                                        className="form-select form-control"
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
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>University</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter University"
                                        name="University"
                                        value={educationForm.University}
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Start Date</label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        name="startDate"
                                        value={educationForm.startDate}
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>End Date</label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        name="endDate"
                                        value={educationForm.endDate}
                                        onChange={handleInputChange}
                                        disabled={
                                          educationForm.currentlyStudyingHere
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="currently-working-here">
                                  <input
                                    type="checkbox"
                                    id="studying"
                                    name="currentlyStudyingHere"
                                    checked={
                                      educationForm.currentlyStudyingHere
                                    }
                                    onChange={handleInputChange}
                                  />
                                  <label htmlFor="studying">
                                    I am currently studying here
                                  </label>
                                </div>

                                <div className="save-cancel-btn-info">
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={handleSaveEducation}
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={() => {
                                      setIsEditing(false);
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
                                </div>
                              </form>
                            </div>
                          </div>
                        ) : (
                          // ✅ Education list
                          <div className="user-all-detail-info-main">
                            {educationList.length > 0 ? (
                              educationList.map((edu) => (
                                <div
                                  key={edu._id}
                                  className="user-all-details-info"
                                >
                                  {" "}
                                  <div className="work-exprinace-edit">
                                    <i
                                      className="fas fa-pencil-alt"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        setEducationForm({
                                          education_id: edu._id,
                                          degree: edu.degree,
                                          University: edu.University,
                                          startDate: edu.startDate?.slice(
                                            0,
                                            10
                                          ),
                                          endDate: edu.endDate?.slice(0, 10),
                                          currentlyStudyingHere:
                                            edu.currentlyStudyingHere,
                                        });
                                        setIsEditing(true);
                                        const collapseElement =
                                          document.getElementById(
                                            "collapseEducation"
                                          );
                                        if (
                                          collapseElement &&
                                          !collapseElement.classList.contains(
                                            "show"
                                          )
                                        ) {
                                          new window.bootstrap.Collapse(
                                            collapseElement,
                                            { toggle: true }
                                          );
                                        }
                                      }}
                                    />
                                    <i
                                      className="fas fa-trash ms-2"
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleDeleteEducation(edu._id)
                                      }
                                    />
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                      <div className="form-group">
                                        <label>Degree</label>
                                        <p>{edu.degree}</p>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="form-group">
                                        <label>University</label>
                                        <p>{edu.University}</p>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="form-group">
                                        <label>Start Date</label>
                                        <p>{edu.startDate?.slice(0, 10)}</p>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                      <div className="form-group">
                                        <label>End Date</label>
                                        <p>
                                          {edu.currentlyStudyingHere
                                            ? "Present"
                                            : edu.endDate?.slice(0, 10)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="divder-line-info" />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-center m-2">
                                No education details added yet.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion" id="skillsTechnologies">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingNine">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Skills &amp; Technologies</h3>
                      </div>
                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseNine"
                        aria-expanded="true"
                        aria-controls="collapseNine"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>

                  <div
                    id="collapseNine"
                    className="accordion-collapse collapse " // ✅ Always open
                    aria-labelledby="headingNine"
                    data-bs-parent="#skillsTechnologies"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        <div className="profile-form skills-technologies-info">
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="enter-skill-info">
                                <div className="form-group">
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter Skills"
                                    value={newSkill}
                                    onChange={(e) =>
                                      setNewSkill(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="skill-btn-info">
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={handleAddSkill}
                                  >
                                    Add Skills
                                  </button>
                                </div>
                              </div>

                              {/* ✅ Skills List */}
                              <div className="enter-skill-tag-info">
                                <ul>
                                  {skills?.length > 0 ? (
                                    skills?.map((skill, index) => (
                                      <li key={index}>
                                        {skill}{" "}
                                        <i
                                          className="fa-solid fa-xmark"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleDeleteSkill(skill)
                                          }
                                        />
                                      </li>
                                    ))
                                  ) : (
                                    <p>No skills added yet.</p>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion" id="languagesDetail">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingLanguages">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Languages</h3>
                        <i
                          className="fa-solid fa-plus"
                          style={{ cursor: "pointer" }}
                          onClick={openAddForm}
                        />
                      </div>
                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseLanguages"
                        aria-expanded="true"
                        aria-controls="collapseLanguages"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>

                  <div
                    id="collapseLanguages"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingLanguages"
                    data-bs-parent="#languagesDetail"
                  >
                    <div className="accordion-body">
                      {editMode ? (
                        <div className="profile-form-content from-all-input">
                          <div className="profile-form">
                            <form>
                              <div className="form-group">
                                <label>Language</label>
                                <select
                                  className="form-select form-control"
                                  name="language"
                                  value={languageForm.language}
                                  onChange={(e) =>
                                    setLanguageForm((p) => ({
                                      ...p,
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

                              <div className="language-acitve-inactive-info d-flex flex-wrap mt-3">
                                {PROFICIENCY_LEVELS.map((lvl) => (
                                  <div
                                    key={lvl.code}
                                    className={`language-select-info ${
                                      languageForm.proficiency === lvl.code
                                        ? "active"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      setLanguageForm((p) => ({
                                        ...p,
                                        proficiency: lvl.code,
                                      }))
                                    }
                                  >
                                    <h6>{lvl.label}</h6>
                                    <p>{lvl.code}</p>
                                  </div>
                                ))}
                              </div>

                              <div className="save-cancel-btn-info mt-3">
                                <button
                                  type="button"
                                  className="default-btn btn me-2"
                                  onClick={handleSaveLanguage}
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  className="default-btn btn"
                                  onClick={() => setEditMode(false)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      ) : (
                        <div className="user-all-detail-info-main">
                          {userLanguages.length > 0 ? (
                            userLanguages.map((lang) => (
                              <div
                                key={lang._id}
                                className="user-all-details-info"
                              >
                                <div className="work-exprinace-edit">
                                  <i
                                    className="fas fa-pencil-alt"
                                    onClick={() => openEditForm(lang)}
                                  />
                                  <i
                                    className="fas fa-trash ms-2"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleDeleteLanguage(lang._id)
                                    }
                                  />
                                </div>
                                <div className="form-group">
                                  <label>{lang.language}</label>
                                  <p>{lang.proficiency}</p>
                                </div>
                                <div className="divder-line-info" />
                              </div>
                            ))
                          ) : (
                            <p className="text-center ">
                              No languages added yet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion" id="certificatesDetail">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingCertificates">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Certificates</h3>

                        {/* ✅ Always show only the plus icon */}
                        <i
                          className="fa-solid fa-plus"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setFormData({
                              certificate_id: "",
                              title: "",
                              issueDate: "",
                            });
                            setEditMode(true);

                            const collapseElement = document.getElementById(
                              "collapseCertificates"
                            );
                            if (
                              collapseElement &&
                              !collapseElement.classList.contains("show")
                            ) {
                              new window.bootstrap.Collapse(collapseElement, {
                                toggle: true,
                              });
                            }
                          }}
                        />
                      </div>

                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseCertificates"
                        aria-expanded="true"
                        aria-controls="collapseCertificates"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>

                  <div
                    id="collapseCertificates"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingCertificates"
                    data-bs-parent="#candidateCertificates"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        {editMode ? (
                          <div className="profile-form-content from-all-input">
                            <div className="profile-form">
                              <form>
                                <div className="row">
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Certificate Title</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Certificate Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Issue Date</label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        name="issueDate"
                                        value={formData.issueDate}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="save-cancel-btn-info">
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={handleSaveCertificate}
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={() => setEditMode(false)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        ) : (
                          <div className="user-all-detail-info-main">
                            {profileData.certificates?.length > 0 ? (
                              profileData.certificates.map((cert) => (
                                <div
                                  key={cert._id}
                                  className="user-all-details-info"
                                >
                                  {/* ✏️ Edit button only inside certificate card */}
                                  <div className="work-exprinace-edit">
                                    <i
                                      className="fas fa-pencil-alt"
                                      onClick={() => {
                                        setFormData({
                                          certificate_id: cert._id,
                                          title: cert.title,
                                          issueDate: cert.issueDate.slice(
                                            0,
                                            10
                                          ),
                                        });
                                        setEditMode(true);

                                        const collapseElement =
                                          document.getElementById(
                                            "collapseCertificates"
                                          );
                                        if (
                                          collapseElement &&
                                          !collapseElement.classList.contains(
                                            "show"
                                          )
                                        ) {
                                          new window.bootstrap.Collapse(
                                            collapseElement,
                                            {
                                              toggle: true,
                                            }
                                          );
                                        }
                                      }}
                                      style={{ cursor: "pointer" }}
                                    />
                                    <i
                                      className="fas fa-trash ms-2"
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleDeleteCertificate(cert._id)
                                      }
                                    />
                                  </div>

                                  <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                      <div className="form-group">
                                        <label>{cert.title}</label>
                                        <p>
                                          Issue Date:{" "}
                                          {cert?.issueDate?.slice(0, 10)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-center">
                                No certificates added yet.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion" id="portfolioLinks">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingTwelve">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>LinkedIn/Portfolio Links</h3>

                        {checkStatus.links === 0 ? (
                          <i
                            className="fa-solid fa-plus"
                            onClick={() => {
                              // open with empty fields
                              setPortfolioLinks({
                                personalWebsite: "",
                                github: "",
                                linkedin: "",
                              });
                              setEditPortfolioLinks(true);

                              const collapseElement =
                                document.getElementById("collapseTwelve");
                              if (
                                collapseElement &&
                                !collapseElement.classList.contains("show")
                              ) {
                                new window.bootstrap.Collapse(collapseElement, {
                                  toggle: true,
                                });
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <i
                            className="fas fa-pencil-alt"
                            onClick={() => {
                              // pre-fill with saved API values
                              setPortfolioLinks({
                                personalWebsite:
                                  profileData?.links?.portfolio || "",
                                github: profileData?.links?.github || "",
                                linkedin: profileData?.links?.linkedin || "",
                              });
                              setEditPortfolioLinks(true);

                              const collapseElement =
                                document.getElementById("collapseTwelve");
                              if (
                                collapseElement &&
                                !collapseElement.classList.contains("show")
                              ) {
                                new window.bootstrap.Collapse(collapseElement, {
                                  toggle: true,
                                });
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </div>
                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwelve"
                        aria-expanded="true"
                        aria-controls="collapseTwelve"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>
                  <div
                    id="collapseTwelve"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwelve"
                    data-bs-parent="#portfolioLinks"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        {editPortfolioLinks || checkStatus.links === 0 ? (
                          <div className="profile-form-content from-all-input">
                            <div className="profile-form">
                              <form>
                                <div className="row">
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label> Personal website</label>
                                      <input
                                        className="form-control"
                                        type="url"
                                        placeholder="Add personal website"
                                        value={portfolioLinks.personalWebsite}
                                        onChange={(e) =>
                                          setPortfolioLinks({
                                            ...portfolioLinks,
                                            personalWebsite: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>GitHub</label>
                                      <input
                                        className="form-control"
                                        type="url"
                                        placeholder="GitHub"
                                        value={portfolioLinks.github}
                                        onChange={(e) =>
                                          setPortfolioLinks({
                                            ...portfolioLinks,
                                            github: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>LinkedIn</label>
                                      <input
                                        className="form-control"
                                        type="url"
                                        placeholder="LinkedIn"
                                        value={portfolioLinks.linkedin}
                                        onChange={(e) =>
                                          setPortfolioLinks({
                                            ...portfolioLinks,
                                            linkedin: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="save-cancel-btn-info">
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={handleSavePortfolioLinks}
                                  >
                                    Save
                                  </button>
                                  {/* <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={() => {
                                      setPortfolioLinks({
                                        personalWebsite:
                                          profileData?.portfolioLinks
                                            ?.personalWebsite || "",
                                        github:
                                          profileData?.portfolioLinks?.github ||
                                          "",
                                        linkedin:
                                          profileData?.portfolioLinks
                                            ?.linkedin || "",
                                      });
                                      setEditPortfolioLinks(false);
                                    }}
                                  >
                                    Cancel
                                  </button> */}
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={() => {
                                      // reset state
                                      setPortfolioLinks({
                                        personalWebsite:
                                          profileData?.links?.portfolio || "",
                                        github:
                                          profileData?.links?.github || "",
                                        linkedin:
                                          profileData?.links?.linkedin || "",
                                      });
                                      setEditPortfolioLinks(false);

                                      // ✅ also close accordion if open
                                      const collapseElement =
                                        document.getElementById(
                                          "collapseTwelve"
                                        );
                                      if (
                                        collapseElement &&
                                        collapseElement.classList.contains(
                                          "show"
                                        )
                                      ) {
                                        const collapseInstance =
                                          window.bootstrap.Collapse.getInstance(
                                            collapseElement
                                          );
                                        if (collapseInstance) {
                                          collapseInstance.hide(); // close it
                                        }
                                      }
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        ) : (
                          <div className="user-all-detail-info-main">
                            <div className="user-all-details-info">
                              <div className="row">
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>Add personal website</label>
                                    <p>
                                      {profileData?.links?.portfolio ? (
                                        <a
                                          href={profileData?.links?.portfolio}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {profileData?.links?.portfolio}
                                        </a>
                                      ) : (
                                        "N/A"
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="divder-line-info" />
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>GitHub</label>
                                    <p>
                                      {profileData?.links?.github ? (
                                        <a
                                          href={profileData?.links?.github}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {profileData?.links?.github}
                                        </a>
                                      ) : (
                                        "N/A"
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="divder-line-info" />
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>LinkedIn</label>
                                    <p>
                                      {profileData?.links?.linkedin ? (
                                        <a
                                          href={profileData?.links?.linkedin}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {profileData?.links?.linkedin}
                                        </a>
                                      ) : (
                                        "N/A"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="candidate-blank-form-detail-edit-info">
                <div className="profile-form-content delete-account-info">
                  <div className="input-info-edit-area">
                    <h3>Delete Account</h3>
                  </div>
                  <div className="profile-form">
                    <form>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="delete-account">
                            <p>
                              If you want to permanently delete your account,
                              <span>
                                <a
                                  herf="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModaldlt"
                                >
                                  click here.
                                </a>
                              </span>
                            </p>
                          </div>
                          {/* Modal */}
                          <div
                            className="modal fade"
                            id="exampleModaldlt"
                            tabIndex={-1}
                            aria-labelledby="exampleModaldlt"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5
                                    className="modal-title"
                                    id="exampleModaldlt"
                                  >
                                    Delete Account
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  />
                                </div>
                                <div className="modal-body">
                                  <div className="candidate-personal-dlt-details">
                                    <div className="candidate-personal-dlt-details-heading">
                                      <h4>We are sorry to see you go!</h4>
                                      <p>
                                        Tell us why you would like to delete
                                        your account.
                                      </p>
                                    </div>
                                    <p>
                                      Please select your favorite Web language:
                                    </p>
                                    <ul>
                                      {[
                                        "I never got a job interview",
                                        "I have a privacy concern",
                                        "I have a duplicate account",
                                        "I'm getting too many emails",
                                        "Other reason",
                                      ].map((r, idx) => (
                                        <li key={idx}>
                                          <input
                                            type="radio"
                                            name="reason"
                                            value={r}
                                            onChange={(e) =>
                                              setReason(e.target.value)
                                            }
                                          />
                                          <label>{r}</label>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="form-group">
                                      <label>Comments</label>
                                      <textarea
                                        className="form-control"
                                        placeholder="write the reason here...."
                                        rows={3}
                                        value={comments}
                                        onChange={(e) =>
                                          setComments(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="delete-account-popup-btn modal-footer">
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={handleDelete}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
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
    </>
  );
}

export default CandidateProfile;
