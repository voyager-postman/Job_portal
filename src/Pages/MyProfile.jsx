import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import axios from "axios";
import Switch from "@mui/material/Switch";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // adjust path
import { useLocation } from "react-router-dom";
import "./MyProfileMordern.css";
const label = { inputProps: { "aria-label": "Size switch demo" } };
function MyProfile() {
  const containerId = "page-a-toast";
  const { login } = useAuth();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [occupationTypes, setOccupationTypes] = useState([]);
  const [isManualEnabled, setIsManualEnabled] = useState(false);
  // values: "resume" | "linkedin" | null
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    County: "",
    jobTitle: "",
    experience: "",
    employmentType: "",
    occupationType: "",
    salaryType: "",
    salaryAmount: "",
    eligibleInFrance: "Yes",
    selectedCategory: "",
    attachment: null,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
  });
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [category, setCategory] = useState([]);
  useEffect(() => {
    if (isExtracting) {
      setProgress(0);
      setAnalysisComplete(false);

      let value = 0;

      const interval = setInterval(() => {
        value += Math.floor(Math.random() * 3) + 1; // random progress

        if (value >= 100) {
          value = 100;
          clearInterval(interval);

          setAnalysisComplete(true);

          // wait 2 sec then navigate
          setTimeout(() => {
            // navigate("/jobPortal/profile-basic-info");
            navigate("/profile-basic-info");
          }, 2000);
        }

        setProgress(value);
      }, 120);

      return () => clearInterval(interval);
    }
  }, [isExtracting]);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}get/countries`);

        if (response.status === 200) {
          let countryList = [];

          if (Array.isArray(response.data)) {
            countryList = response.data;
          } else if (Array.isArray(response.data.countries)) {
            countryList = response.data.countries;
          }

          // ✅ Move Morocco to top
          const moroccoIndex = countryList.findIndex(
            (c) =>
              c.name?.toLowerCase() === "morocco" ||
              c.code?.toUpperCase() === "MA",
          );

          if (moroccoIndex > -1) {
            const [morocco] = countryList.splice(moroccoIndex, 1);
            countryList.unshift(morocco);
          }

          setCountries(countryList);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([]);
      }
    };

    fetchCountries();
  }, []);

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
    const fetchJobCategory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}getJobCategory`);
        // console.log(response.data.jobCategories);
        setCategory(response.data.jobCategories);
      } catch (error) {
        console.error("Fetching Job Category List:", error);
      }
    };
    fetchJobCategory();
  }, []);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleFileChange = (e) => {
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
      setFormData((prev) => ({
        ...prev,
        attachment: selectedFile,
      }));
    }
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "Prénom obligatoire";
      toast.error("First name is required.", {
        containerId,
      });
      isValid = false;
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Nom obligatoire";
      toast.error("Last name is required.", {
        containerId,
      });
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const createCandidateProfile = async (autoData = null) => {
    const data = new FormData();

    const payload = autoData || formData;

    data.append("firstname", payload.firstName);
    data.append("lastname", payload.lastName);
    data.append("city", payload.city);
    data.append("County", payload.County);
    data.append("jobTitle", payload.jobTitle);
    data.append("yearOfExprerience", payload.experience);
    data.append("jobCategory", payload.selectedCategory);
    data.append("DesiredEmploymentType", payload.employmentType);
    data.append("DesiredOccupationType", payload.occupationType);

    if (payload.salaryType || payload.salaryAmount) {
      data.append(
        "MinimumDesiredSalary",
        JSON.stringify({
          type: payload.salaryType || "Yearly",
          amount: payload.salaryAmount || "",
          currency: "MAD",
        }),
      );
    }

    const isEligible = payload.eligibleInFrance?.toLowerCase() === "yes";
    data.append("eligibleToWorkInFrance", JSON.stringify(isEligible));

    if (payload.attachment) {
      data.append("resume", payload.attachment);
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}createCandidateProfile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const { userDetails } = response.data;

        localStorage.setItem("user", JSON.stringify(userDetails));
        localStorage.setItem("user_id", userDetails._id);
        localStorage.setItem("user_email", userDetails.email);
        localStorage.setItem("user_role", userDetails.role);
        localStorage.setItem("first_name", userDetails.first_name);
        localStorage.setItem("last_name", userDetails.last_name);
        localStorage.setItem("is_completed", userDetails?.is_completed);

        login(); // auth context
        navigate("/candidate-profile");
      }
    } catch (err) {
      console.error("Auto profile creation failed:", err);
      toast.error("Failed to create profile automatically.");
    }
  };

  const candidateLogin = async () => {
    if (!validate()) return;
    createCandidateProfile();
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const uploadResume = async () => {
    const userId = localStorage.getItem("extract_id");
    const file = formData?.attachment;

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

        const autoProfileData = {
          firstName: data?.name?.first || "",
          lastName: data?.name?.last || "",
          city: data?.location?.city || "",
          County: data?.location?.country || "",
          jobTitle:
            data?.workExperience?.[0]?.occupation?.jobTitleNormalized ||
            data?.workExperience?.[0]?.jobTitle ||
            "",
          experience: data?.totalYearsExperience
            ? String(data.totalYearsExperience)
            : "",
          employmentType: "",
          occupationType: data?.profession || "",
          salaryType: "",
          salaryAmount: "",
          eligibleInFrance: "Yes",
          selectedCategory: "",
          attachment: formData.attachment, // 👈 important
        };

        setFormData(autoProfileData);

        setIsUploading(false);
        setIsExtracting(false);
        setShowModal(false);

        toast.success("Resume extracted successfully!");

        // 🚀 AUTO CREATE PROFILE + REDIRECT
        createCandidateProfile(autoProfileData);
      }
    } catch (err) {
      console.error("Extraction Error:", err);
      setIsUploading(false);
      setIsExtracting(false);
      toast.error("Error fetching resume data.");
    }
  };

  const importFromLinkedIn = () => {
    try {
      window.location.assign(
        "https://sisccltd.com/job_portal/api/linkedin/parse",
      );
    } catch (err) {
      console.error(err);
      toast.error("LinkedIn redirect failed");
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log(params);
    const success = params.get("success");
    const message = params.get("message");

    // ✅ SUCCESS CASE
    if (success === "true") {
      const extracted = {
        email: params.get("email"),
        firstName: params.get("first_name"),
        lastName: params.get("last_name"),
        name: params.get("name"),
        country: params.get("country"),
        avatar: params.get("avatar"),
      };

      setFormData((prev) => ({
        ...prev,
        firstName: extracted.firstName || "",
        lastName: extracted.lastName || "",
        city: extracted.country || "",
        jobTitle: "",
        experience: "",
        employmentType: "",
        occupationType: "",
        salaryType: "",
        salaryAmount: "",
        eligibleInFrance: "No",
        selectedCategory: "",
      }));

      toast.success("LinkedIn profile imported successfully!", {
        containerId,
      });
    }

    // ❌ FAILURE CASE
    if (success === "false") {
      toast.error(message || "LinkedIn profile fetch failed", {
        containerId,
      });
    }
  }, [location.search]);

  return (
    <>
      <ToastContainer
        containerId={containerId}
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
      />
      <div className="modern-profile-basic-container">
        <div className="modern-quick-start-card">
          <div className="ai-powered-badge">
            <i className="fa-solid fa-wand-magic-sparkles" />
            AI Powered
          </div>
          <div className="card-ai-header">
            <h2>Quick Start</h2>
            <p>
              Experience the power of AI. Let us build your professional profile
              instantly from your CV or LinkedIn.
            </p>
          </div>
          <form className="ai-form-minimal">
            <div className="row">
              <div className="col-md-6 mb-3">
                <div
                  className={`modern-input-group ${errors.firstName ? "input-error" : ""}`}
                >
                  <input
                    id="firstName"
                    placeholder=" "
                    required
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <label htmlFor="firstName">First Name *</label>

                  {errors.firstName && (
                    <span className="error-text">{errors.firstName}</span>
                  )}
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div
                  className={`modern-input-group ${errors.lastName ? "input-error" : ""}`}
                >
                  <input
                    id="lastName"
                    placeholder=" "
                    required
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <label htmlFor="lastName">Last Name *</label>

                  {errors.lastName && (
                    <span className="error-text">{errors.lastName}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="ai-actions-grid">
              <button
                type="button"
                className="modern-ai-btn btn-resume"
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                <i className="fa-solid fa-wand-magic-sparkles" />
                AI Resume Scan
              </button>
              <button
                type="button"
                className="modern-ai-btn btn-linkedin"
                onClick={importFromLinkedIn}
              >
                <i className="fa-brands fa-linkedin" />
                LinkedIn AI Sync
              </button>
            </div>
            <div className="skip-action-container">
              <div className="btn-skip-modern" onClick={candidateLogin}>
                Continue to Manual Setup{" "}
                <i className="fa-solid fa-arrow-right" />
              </div>
            </div>
          </form>
        </div>
      </div>
      {showModal && (
        <div
          className="modal show d-block modern-ai-modal"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content position-relative">
              {/* HEADER */}
              <div className="ai-modal-header border-0 pb-0">
                <i className="fa-solid fa-wand-magic-sparkles header-ai-icon" />
                <h5>AI Resume Scanner</h5>

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFile(null);
                    setFormData((prev) => ({
                      ...prev,
                      attachment: null,
                    }));
                  }}
                  className="btn-close position-absolute top-0 end-0 m-3"
                />
              </div>

              {/* BODY */}
              <div className="modal-body p-4">
                <div className="form-group mb-0">
                  <div
                    className="ai-drop-zone"
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
                        const fakeEvent = {
                          target: { files: droppedFiles },
                        };
                        handleFileChange(fakeEvent);
                      }
                    }}
                  >
                    <div className="scanning-line" />

                    <label
                      htmlFor="file-upload"
                      className="file-text cursor-pointer mb-0"
                    >
                      <i className="fas fa-cloud-upload-alt" />
                      <br />

                      <span
                        className="fw-bold text-dark d-block mb-1"
                        style={{ fontSize: "1.1rem" }}
                      >
                        Drop your CV here
                      </span>

                      <span className="text-muted small">
                        Support for PDF, DOC, DOCX (Max 2MB)
                      </span>
                    </label>

                    <input
                      id="file-upload"
                      accept=".pdf,.doc,.docx"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    {/* ERROR */}
                    {error && (
                      <div className="text-danger small mt-2">{error}</div>
                    )}

                    {/* FILE NAME */}
                    {file && (
                      <div className="text-success small mt-2">
                        Selected: {file.name}
                      </div>
                    )}
                  </div>

                  {/* BUTTON */}
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      className="modern-ai-btn btn-resume w-100"
                      onClick={uploadResume}
                      disabled={!file || isUploading || isExtracting}
                    >
                      {isUploading || isExtracting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          {isUploading
                            ? "Uploading..."
                            : "Extracting Resume..."}
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-wand-magic-sparkles me-2" />
                          Start AI Extraction
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {(isUploading || isExtracting) && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center ai-extract-loader">
                  <div className="text-center w-100 px-4">
                    <div className="ai-pulse-ring">
                      <i className="fa-solid fa-wand-magic-sparkles" />
                    </div>

                    <h4 className="ai-analysis-title">DEEP AI ANALYSIS</h4>

                    <div
                      className="ai-progress-container"
                      style={{ maxWidth: "300px", margin: "0 auto" }}
                    >
                      <div
                        className="ai-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {!analysisComplete ? (
                      <p
                        className="fw-bold mb-3"
                        style={{ color: "#1e293b", fontSize: "1rem" }}
                      >
                        {isUploading
                          ? `Uploading Resume... ${progress}%`
                          : `Processing Intel: ${progress}%`}
                      </p>
                    ) : (
                      <p
                        className="fw-bold mb-3"
                        style={{ color: "#1e293b", fontSize: "1rem" }}
                      >
                        Analysis Complete! Synchronizing...
                      </p>
                    )}
                  </div>
                </div>
              )}
              {/* LOADER OVERLAY */}
              {/* {(isUploading || isExtracting) && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center ai-extract-loader">
                  <div className="text-center w-100 px-4">
                    <div className="ai-pulse-ring">
                      <i className="fa-solid fa-wand-magic-sparkles" />
                    </div>

                    <h4 className="ai-analysis-title">DEEP AI ANALYSIS</h4>

                    <div
                      className="ai-progress-container"
                      style={{ maxWidth: "300px", margin: "0 auto" }}
                    >
                      <div
                        className="ai-progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    {!analysisComplete ? (
                      <p
                        className="fw-bold mb-3"
                        style={{ color: "#1e293b", fontSize: "1rem" }}
                      >
                        {isUploading
                          ? "Uploading Resume..."
                          : `Processing Intel: ${progress}%`}
                      </p>
                    ) : (
                      <p
                        className="fw-bold mb-3"
                        style={{ color: "#1e293b", fontSize: "1rem" }}
                      >
                        Analysis Complete! Synchronizing...
                      </p>
                    )}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyProfile;
