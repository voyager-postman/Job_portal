import axios from "axios";
import React, { useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";

function CandidateProfile() {
   const token = localStorage.getItem("token");
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
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE_URL}candidate/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Profile data:", res.data);
        setProfileData(res.data.profile); // ✅ set API response into state
        setCheckStatus(res.data.sectionStatus);
      } catch (error) {
        console.error("Error fetching candidate profile:", error);
      }
    };

    fetchProfile();
  }, []);
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
        `${API_BASE_URL}/DeleteAccount`,
        { reason, comments },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Account deleted:", res.data);

      // ✅ Close modal after success
      const modal = document.getElementById("exampleModaldlt");
      const modalInstance = window.bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      toast.success("Your account has been deleted successfully!");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account.");
    }
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

      const response = await axios.put(
        `${API_BASE_URL}updateCareerGoals`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setProfileData((prev) => ({
          ...prev,
          career_goals: payload, // ✅ keep consistent with API
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
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSavePersonal = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        firstname: personalDetails.firstName,
        lastname: personalDetails.lastName,
        dateOfBirth: personalDetails.birthYear,
        gender: personalDetails.gender,
        nationality: personalDetails.nationality || "",
        city: personalDetails.city || "",
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
        }));

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
    setWorkExperienceData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🚀 Save function (fixed key: workHistory)
  const handleSaveWorkExperience = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        workHistory_id: workExperienceData.workHistory_id || undefined,
        companyName: workExperienceData.companyName,
        jobTitle: workExperienceData.jobTitle,
        startDate: workExperienceData.startDate,
        endDate: workExperienceData.endDate,
        yearOfExperience: workExperienceData.yearOfExperience,
        currentlyWorkingHere: workExperienceData.currentlyWorkingHere,
        Description: workExperienceData.Description,
        EmploymentType: workExperienceData.EmploymentType,
        workLocation: workExperienceData.workLocation,
        currentSalary: {
          payrollFrequency: workExperienceData.salaryType,
          amount: workExperienceData.salaryAmount,
          currency: workExperienceData.salaryCurrency,
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}updateWorkHistory`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const updatedWorkHistory = response.data.workHistory; // ✅ get updated array from API

        setProfileData((prev) => ({
          ...prev,
          workHistory: updatedWorkHistory, // ✅ replace with API response
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
      toast.error("Failed to save work experience", { theme: "colored" });
    }
  };

  const handleSavePortfolioLinks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}updateLinks`,
        {
          portfolio: portfolioLinks.personalWebsite,
          github: portfolioLinks.github,
          linkedin: portfolioLinks.linkedin,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const updatedLinks = {
          portfolio: response.data?.portfolio || portfolioLinks.personalWebsite,
          github: response.data?.github || portfolioLinks.github,
          linkedin: response.data?.linkedin || portfolioLinks.linkedin,
        };

        // ✅ update local state
        setPortfolioLinks({
          personalWebsite: updatedLinks.portfolio,
          github: updatedLinks.github,
          linkedin: updatedLinks.linkedin,
        });

        // ✅ also update profileData so it reflects instantly
        setProfileData((prev) => ({
          ...prev,
          links: updatedLinks,
        }));

        // ✅ mark section completed
        setCheckStatus((prev) => ({ ...prev, links: 1 }));

        // ✅ exit edit mode
        setEditPortfolioLinks(false);

        // ✅ success toast
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
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
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
                    <img
                      src="assets/images/dashboard/dashboard-img-5.jpg"
                      alt="Image"
                    />
                    <div className="img-edit-icon">
                      <i className="fas fa-pencil-alt" />
                    </div>
                  </div>
                  <div className="candidates-details-info">
                    <h3>
                      <strong>Name:</strong> {profileData.first_name}{" "}
                      {profileData.last_name}
                    </h3>
                    <h3>
                      <strong>Position:</strong>Website Desginer
                    </h3>
                    <h3>
                      <strong>Position:</strong> {profileData.position}
                    </h3>
                    <h3>
                      <strong>Email:</strong> {profileData.email}
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
                    <i className="fa-regular fa-eye" /> Profile Visibility
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={profileVisible}
                      onChange={handleToggleVisibility}
                    />
                    <span className="slider round" />
                  </label>

                  <div className="candidate-personal-info-cv-linkedin-upload-btn">
                    <div className="candidate-personal-info-upload-cv-btn">
                      <a
                        href="#"
                        className="default-btn btn"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        <i className="fa-solid fa-file" />
                        Upload CV
                      </a>
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
                                <div className="custom-file-upload">
                                  <label>Upload Your File (PDF/JPG/PNG)</label>
                                  <input
                                    type="file"
                                    id="file-upload"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    required
                                  />
                                  <div className="file-text">
                                    <i className="fas fa-cloud-upload-alt" />
                                    <br />
                                    <label>
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
                    <div className="candidate-personal-info-upload-content-linkedin">
                      <a
                        href="https://www.linkedin.com/login"
                        target="_blank"
                        className="default-btn btn"
                      >
                        <i className="fa-brands fa-linkedin-in" />
                        LinkedIn
                      </a>
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
                    className="accordion-collapse show"
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
                                      <label>Email</label>
                                      <input
                                        className="form-control"
                                        placeholder="Email"
                                        type="email"
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
                                        placeholder="YYYY"
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
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Nationality</label>
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
                                        <option value="">
                                          Select Nationality
                                        </option>
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
                                    <label>Email</label>
                                    <p>{profileData.email || "N/A"}</p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Phone number</label>
                                    <p>{profileData.phone || "N/A"}</p>
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
                                    <label>City</label>
                                    <p>{profileData.city || "N/A"}</p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Nationality</label>
                                    <p>{profileData.Nationality || "N/A"}</p>
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
                    className="accordion-collapse collapse show"
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
                                  <button
                                    type="button"
                                    className="default-btn btn"
                                    onClick={() => {
                                      setEditMode(false);
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

              <div className="accordion" id="myCvs">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingFour">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>My CVs</h3>
                        <i className="fa-solid fa-plus" />
                        <i className="fas fa-pencil-alt" />
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
                                <div className="upload-download-dlt-cv">
                                  <div className="upload-cv-info-area">
                                    <p>
                                      <i className="fas fa-file-alt" />{" "}
                                      Workscope For Job Portal Platform like
                                      docx
                                    </p>
                                  </div>
                                  <div className="download-dlt-cv">
                                    <i className="fas fa-ellipsis-v" />
                                    <div className="download-edit-info">
                                      <ul>
                                        <li>
                                          <i className="fa-solid fa-arrow-down" />{" "}
                                          Download
                                        </li>
                                        <li>
                                          <i className="fa-solid fa-trash" />{" "}
                                          Delete
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <div className="upload-cv-area">
                                  <input
                                    type="file"
                                    name="avatar"
                                    accept=".pdf, .doc, .docx"
                                  />
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
              <div className="accordion" id="careerGoals">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingCareerGoals">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Career Goals</h3>
                        {checkStatus.careerGoals === 0 ? (
                          <i
                            className="fa-solid fa-plus"
                            onClick={() => {
                              // clear for new entry
                              setCareerGoalsData({
                                desiredJobTitle: "",
                                employmentType: "",
                                occupationType: "",
                                salaryAmount: "",
                                salaryCurrency: "EUR",
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
                              // ✅ Map API keys to form keys
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
                                  profileData.career_goals
                                    ?.eligibleToWorkInFrance || false,
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
                        aria-expanded="true"
                        aria-controls="collapseCareerGoals"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>

                  <div
                    id="collapseCareerGoals"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingCareerGoals"
                    data-bs-parent="#careerGoals"
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
                                      <label>Desired Employment Type</label>
                                      <select
                                        className="form-select form-control"
                                        name="employmentType"
                                        value={careerGoalsData.employmentType}
                                        onChange={handleCareerGoalsChange}
                                      >
                                        <option value="">
                                          Select Employment Type
                                        </option>
                                        <option value="Full-time">
                                          Full-time
                                        </option>
                                        <option value="Part-time">
                                          Part-time
                                        </option>
                                        <option value="Contract">
                                          Contract
                                        </option>
                                        <option value="Temporary">
                                          Temporary
                                        </option>
                                        <option value="Apprenticeship">
                                          Apprenticeship
                                        </option>
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
                                        <option value="Full-time">
                                          Full-time
                                        </option>
                                        <option value="Part-time">
                                          Part-time
                                        </option>
                                        <option value="Full-time/Part-time">
                                          Full-time/Part-time
                                        </option>
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

                                      <div className="col-lg-3 col-md-6">
                                        <div className="form-group">
                                          <select
                                            className="form-select form-control"
                                            name="salaryCurrency"
                                            value={
                                              careerGoalsData.salaryCurrency
                                            }
                                            onChange={handleCareerGoalsChange}
                                          >
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
                                    <label>Desired Employment Type</label>
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
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseSix"
                        aria-expanded="true"
                        aria-controls="collapseSix"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>
                  <div
                    id="collapseSix"
                    className="accordion-collapse collapse"
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
              <div className="accordion" id="workExperience">
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
                              Description: "",
                              EmploymentType: "",
                              workLocation: "",
                              salaryAmount: "",
                              salaryCurrency: "USD",
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
                    data-bs-parent="#workExperience"
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
                                        type="text"
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
                                      I Am Currently Working Here
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
                                          workExperienceData.EmploymentType
                                        }
                                        onChange={handleChangeOfWork}
                                      >
                                        <option value="">
                                          Select employment type
                                        </option>
                                        <option value="Full-time">
                                          Full-time
                                        </option>
                                        <option value="Part-time">
                                          Part-time
                                        </option>
                                        <option value="Contract">
                                          Contract / Freelance / Self-employed
                                        </option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Work Location */}
                                  <div className="col-lg-12 col-md-12">
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
                                        type="text"
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
                                {profileData?.workHistory?.map((exp, index) => (
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
                                            companyName: exp.companyName || "",
                                            jobTitle: exp.jobTitle || "",
                                            startDate:
                                              exp.startDate?.split("T")[0] ||
                                              "",
                                            endDate:
                                              exp.endDate?.split("T")[0] || "",
                                            yearOfExperience:
                                              exp.yearOfExperience || "",
                                            currentlyWorkingHere:
                                              exp.currentlyWorkingHere || false,
                                            Description: exp.Description || "",
                                            EmploymentType:
                                              exp.EmploymentType || "",
                                            workLocation:
                                              exp.workLocation || "",
                                            salaryAmount:
                                              exp.currentSalary?.amount || "",
                                            salaryCurrency:
                                              exp.currentSalary?.currency ||
                                              "USD",
                                            salaryType:
                                              exp.currentSalary
                                                ?.payrollFrequency || "Monthly",
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
                                        </div>
                                        <div className="divder-line-info" />
                                      </div>

                                      <div className="col-lg-12 col-md-12">
                                        <div className="form-group">
                                          <label>Achievements</label>
                                          <p>{exp.Description}</p>
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
                                    </div>
                                  </div>
                                ))}
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
                  <div className="accordion-header" id="headingEight">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Education</h3>
                        <i className="fa-solid fa-plus" />
                        <i className="fas fa-pencil-alt" />
                      </div>
                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseEight"
                        aria-expanded="true"
                        aria-controls="collapseEight"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>
                  <div
                    id="collapseEight"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingEight"
                    data-bs-parent="#educationDetail"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        <div className="profile-form not-add-detail">
                          <form>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="not-add-detail-info">
                                  <h5>You haven’t yet added any education.</h5>
                                  <i className="fa-solid fa-user-graduate" />
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className="profile-form-content from-all-input">
                          <div className="profile-form">
                            <form>
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>School</label>
                                    <input
                                      className="form-control"
                                      type="url"
                                      placeholder="School"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>School Name</label>
                                    <input
                                      className="form-control"
                                      type="url"
                                      placeholder="School Name"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                      className="form-control"
                                      type="date"
                                      placeholder
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                      className="form-control"
                                      type="date"
                                      placeholder
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Degree</label>
                                    <input
                                      className="form-control"
                                      type="url"
                                      placeholder="Degree"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>University</label>
                                    <input
                                      className="form-control"
                                      type="url"
                                      placeholder="University"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                      className="form-control"
                                      type="date"
                                      placeholder
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                      className="form-control"
                                      type="date"
                                      placeholder
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="currently-working-here">
                                <input
                                  type="checkbox"
                                  id="studying"
                                  name="CurrentlyWorking"
                                  defaultValue="studying"
                                />
                                <label htmlFor="vehicle1">
                                  {" "}
                                  I am currently studying here.
                                </label>
                              </div>
                              <div className="save-cancel-btn-info">
                                <a href="#" className="default-btn btn">
                                  Save
                                </a>
                                <a href="#" className="default-btn btn">
                                  Cancel
                                </a>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div className="user-all-detail-info-main">
                          <div className="user-all-details-info">
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>Schools</label>
                                  <p>
                                    12<sup>th</sup>
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>School Name</label>
                                  <p>University of Oxford</p>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>Start Date</label>
                                  <p>02 / 2025</p>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>End Date</label>
                                  <p>02 / 2045</p>
                                </div>
                              </div>
                              <div className="divder-line-info" />
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>Degree</label>
                                  <p>B.tech</p>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>University</label>
                                  <p>University of Oxford</p>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>Start Date</label>
                                  <p>02 / 2025</p>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>End Date</label>
                                  <p>02 / 2045</p>
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
              <div className="accordion" id="skillsTechnologies">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingNine">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Skills &amp; Technologies</h3>
                        <i className="fa-solid fa-plus" />
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
                    className="accordion-collapse collapse show" // ✅ Always open
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
                  <div className="accordion-header" id="headingTen">
                    <div className="accordion-button collapsed" type="button">
                      <div className="input-info-edit-area">
                        <h3>Languages</h3>
                        <i className="fa-solid fa-plus" />
                        <i className="fas fa-pencil-alt" />
                      </div>
                      <span
                        className="ms-auto accordion-icon-toggle collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTen"
                        aria-expanded="true"
                        aria-controls="collapseTen"
                      >
                        <i className="fa-solid fa-angle-up" />
                        <i className="fa-solid fa-angle-down" />
                      </span>
                    </div>
                  </div>
                  <div
                    id="collapseTen"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTen"
                    data-bs-parent="#languagesDetail"
                  >
                    <div className="accordion-body">
                      <div className="candidate-blank-form-detail-edit-info">
                        <div className="profile-form not-add-detail">
                          <form>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="not-add-detail-info">
                                  <h5>You haven’t yet added any languages.</h5>
                                  <i className="fa-solid fa-language" />
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className="profile-form-content from-all-input">
                          <div className="profile-form">
                            <form>
                              <div className="row">
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>Language</label>
                                    <select
                                      className="form-select form-control"
                                      aria-label="Default2 select example"
                                    >
                                      <option selected>Brazil</option>
                                      <option value={1}>USA</option>
                                      <option value={2}>Italy</option>
                                      <option value={3}>UK</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Basic</label>
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="Basic (A1 / A2)"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Limited Working</label>
                                    <input
                                      className="form-control"
                                      type="url"
                                      placeholder="Limited Working (B1)"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Professinal</label>
                                    <input
                                      className="form-control"
                                      type="url"
                                      placeholder="Professinal (B2)"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Full Projessional</label>
                                    <input
                                      className="form-control"
                                      type="url"
                                      placeholder="Full Projessional (C1)"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Full Professional</label>
                                    <input
                                      className="form-control"
                                      type="url"
                                      placeholder="Full Professional (C1)"
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="form-group">
                                    <label>Native/Bilingual</label>
                                    <input
                                      className="form-control"
                                      type="url"
                                      placeholder="Native/Bilingual"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="save-cancel-btn-info">
                                <a href="#" className="default-btn btn">
                                  Save
                                </a>
                                <a href="#" className="default-btn btn">
                                  Cancel
                                </a>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div className="user-all-detail-info-main">
                          <div className="user-all-details-info">
                            <div className="work-exprinace-edit">
                              <i className="fas fa-pencil-alt" />
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Hindi</label>
                                  <p>Native / Bilingual (C2)</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="divder-line-info" />
                          <div className="user-all-details-info">
                            <div className="work-exprinace-edit">
                              <i className="fas fa-pencil-alt" />
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>English</label>
                                  <p>Basic (A1 / A2)</p>
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
                    className="accordion-collapse show"
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
                                  <div
                                    className="work-exprinace-edit"
                                    onClick={() => {
                                      setFormData({
                                        certificate_id: cert._id,
                                        title: cert.title,
                                        issueDate: cert.issueDate.slice(0, 10),
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
                                  >
                                    <i className="fas fa-pencil-alt" />
                                  </div>

                                  <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                      <div className="form-group">
                                        <label>{cert.title}</label>
                                        <p>
                                          Issue Date:{" "}
                                          {cert.issueDate.slice(0, 10)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>No certificates added yet.</p>
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
                    className="accordion-collapse show"
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
                                      <label>Add personal website</label>
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
                                  <button
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
