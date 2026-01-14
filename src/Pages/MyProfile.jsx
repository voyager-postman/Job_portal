import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import axios from "../Services/axios";
import Switch from "@mui/material/Switch";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // adjust path
import { useLocation } from "react-router-dom";
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
              c.code?.toUpperCase() === "MA"
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

  useEffect(() => {}, [isManualEnabled]);
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
  // auto-enable if resume or linkedin filled anything

  // FINAL FLAG

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

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  const handleCategoryClick = (index) => {
    setActiveIndex(index);

    setFormData((prev) => ({
      ...prev,
      selectedCategory: category[index].name, // 👈 pass name to API
    }));
  };

  const validate = () => {
    // if (!formData.attachment) {
    //   toast.error("Resume file is required.");
    //   return false;
    // }
    if (!formData.firstName?.trim()) {
      toast.error("First name is required.");
      return false;
    }
    if (!formData.lastName?.trim()) {
      toast.error("Last name is required.");
      return false;
    }
    return true;
  };

  const candidateLogin = async () => {
    if (!validate()) return;
    const data = new FormData();
    data.append("firstname", formData.firstName);
    data.append("lastname", formData.lastName);
    data.append("city", formData.city);
    data.append("County", formData.County);
    data.append("jobTitle", formData.jobTitle);
    data.append("yearOfExprerience", formData.experience);
    data.append("jobCategory", formData.selectedCategory);
    data.append("DesiredEmploymentType", formData.employmentType);
    data.append("DesiredOccupationType", formData.occupationType);

    if (formData.salaryType || formData.salaryAmount) {
      data.append(
        "MinimumDesiredSalary",
        JSON.stringify({
          type: formData.salaryType || "Yearly",
          amount: formData.salaryAmount || "",
          currency: "USD",
        })
      );
    }

    const isEligible = formData.eligibleInFrance?.toLowerCase() === "yes";
    data.append("eligibleToWorkInFrance", JSON.stringify(isEligible));

    data.append("resume", formData.attachment);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}createCandidateProfile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        login(); // set auth context / localStorage
        navigate("/profile-basic-info");
      }
      toast.success("Profile created successfully!", {
        autoClose: 5000,
        theme: "colored",
      });
      navigate("/candidate-profile");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error("Failed to create profile. Try again.");
    }
  };

  const handleCitySearch = async (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, city: value }));

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

  const handleSelectCity = (city) => {
    setFormData((prev) => ({
      ...prev,
      city: city.name,
      state: city.state_name,
      country: city.country_name,
    }));
    setCitySuggestions([]); // ✅ hide dropdown after selecting
  };
  // const uploadResume = async () => {
  //   const data = new FormData();
  //   data.append("resume", formData.attachment);

  //   try {
  //     const res = await axios.post(`${API_BASE_URL}extractResume`, data);

  //     if (res.data.success && res.data.jobId) {
  //       fetchExtractedData(res.data.jobId); // start polling
  //     } else {
  //       toast.error("Upload succeeded but jobId missing.");
  //     }
  //   } catch (err) {
  //     toast.error("Failed to upload resume.");
  //   }
  // };
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const uploadResume = async () => {
    const userId = localStorage.getItem("user_id"); // ✅ get userId
    const file = formData?.attachment;
    if (!userId) {
      toast.error("User not found. Please login again.", {
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    // ✅ File existence check
    if (!file) {
      toast.error("Please select a resume file.", {
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    // ✅ File size validation (prevents 413)
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Uploaded file is too large. Max size is 2MB.", {
        autoClose: 2000,
        theme: "colored",
      });
      return; // ⛔ STOP — do not hit API
    }

    const data = new FormData();
    data.append("resume", file);

    try {
      const res = await axios.post(
        `${API_BASE_URL}extractResume/${userId}`, // ✅ PASS userId
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success && res.data.jobId) {
        fetchExtractedData(res.data.jobId); // start polling
      } else {
        toast.error("Upload succeeded but jobId missing.");
      }
    } catch (err) {
      console.error("Resume upload error:", err);

      // 🔒 Backup 413 handling
      if (err?.response?.status === 413 || err?.message?.includes("413")) {
        toast.error("Uploaded file is too large. Max size is 2MB.", {
          autoClose: 2000,
          theme: "colored",
        });
      } else {
        toast.error("Failed to upload resume.");
      }
    }
  };
  const fetchExtractedData = async (jobId, attempt = 0) => {
    try {
      const res = await axios.get(`${API_BASE_URL}resume/result/${jobId}`);

      const { state, result } = res.data;

      // ⏳ Still processing → retry
      if (state === "active") {
        if (attempt < 10) {
          setTimeout(() => fetchExtractedData(jobId, attempt + 1), 2000);
        } else {
          toast.error("Resume extraction taking too long.");
        }
        return;
      }

      // ❌ Completed but failed
      if (state === "completed" && !result?.success) {
        toast.error("Resume extraction failed.");
        return;
      }

      // ✅ Completed & success
      if (state === "completed" && result?.parsedResume?.data) {
        const data = result.parsedResume.data;

        setFormData((prev) => ({
          ...prev,

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
        }));

        setShowModal(false);
        toast.success("Resume extracted successfully!");
      }
    } catch (err) {
      console.error("Extraction Error:", err.response?.data || err.message);
      toast.error("Error fetching resume data.");
    }
  };

  // const fetchExtractedData = async (jobId, attempt = 0) => {
  //   try {
  //     const res = await axios.get(`${API_BASE_URL}resume/result/${jobId}`);

  //     const { state, result } = res.data;

  //     // ⏳ Still processing → retry
  //     if (state === "active") {
  //       if (attempt < 10) {
  //         setTimeout(() => {
  //           fetchExtractedData(jobId, attempt + 1);
  //         }, 2000); // retry every 2 sec
  //       } else {
  //         toast.error("Resume extraction taking too long.");
  //       }
  //       return;
  //     }

  //     // ❌ Completed but failed
  //     if (state === "completed" && !result?.success) {
  //       toast.error("Resume extraction failed.");
  //       return;
  //     }

  //     // ✅ Success
  //     if (state === "completed" && result?.parsed) {
  //       const extracted = result.parsed;

  //       setFormData((prev) => ({
  //         ...prev,
  //         firstName: extracted.firstName || "",
  //         lastName: extracted.lastName || "",
  //         city: extracted.city || "",
  //         jobTitle: extracted.jobTitle || "",
  //         experience: extracted.totalExperience
  //           ? extracted.totalExperience.split(" ")[0]
  //           : "",
  //         employmentType: extracted.employmentType || "",
  //         occupationType: extracted.occupationType || "",
  //         salaryType: extracted.desiredSalaryType || "",
  //         salaryAmount: extracted.desiredSalaryAmount || "",
  //         eligibleInFrance: extracted.eligibleToWorkInFrance ? "Yes" : "No",
  //         selectedCategory: extracted.jobCategory || "",
  //       }));

  //       setShowModal(false);
  //       toast.success("Resume extracted successfully!");
  //     }
  //   } catch (err) {
  //     console.error("Extraction Error:", err.response?.data || err.message);
  //     toast.error("Error fetching resume data.");
  //   }
  // };
  const importFromLinkedIn = () => {
    try {
      window.location.assign(
        "https://sisccltd.com/job_portal/api/linkedin/parse"
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
      toast.success(message || "LinkedIn profile fetch failed", {
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

      <section class="inner-banners-info-area">
        <div class="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="breadcrumb Img"
          />
        </div>
        <div class="inner-banners-title-info">
          <div class="container">
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="inner-page-banner-title">
                  <h2>Profile Basic Info</h2>
                  <ul>
                    <li class="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Profile Basic Info</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="profile-basic-info-area">
        <div className="profile-basic-info-heading">
          <div className="section-title">
            <h2>
              Please Fill in your Basic &nbsp;
              <label className="oragneColor">Profile Information</label>{" "}
            </h2>
          </div>
        </div>
        <div className="profile-basic-info-form">
          <div className="container">
            <form>
              <div className="personal-info-area">
                <h3 className="heading-bottom-line">Attachments</h3>
                <p>
                  Fill in your information simply by uploading your CV or
                  connecting your LinkedIn account
                </p>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="personal-info-cv-linkedin-upload-btn">
                      <div className="personal-info-upload-cv-btn">
                        <a
                          href="#"
                          className="default-btn btn"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowModal(true);
                          }}
                        >
                          <i className="fa-solid fa-file" />
                          Upload Resume
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
                                      setFormData((prev) => ({
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

                                        const droppedFiles =
                                          e.dataTransfer.files;
                                        if (
                                          droppedFiles &&
                                          droppedFiles.length > 0
                                        ) {
                                          // ✅ Reuse your existing handler
                                          const fakeEvent = {
                                            target: { files: droppedFiles },
                                          };
                                          handleFileChange(fakeEvent);
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
                                        onChange={handleFileChange}
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
                                      >
                                        Upload
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="personal-info-upload-content-linkedin">
                        <button
                          type="button"
                          className="default-btn btn"
                          onClick={importFromLinkedIn}
                        >
                          <i className="fa-brands fa-linkedin-in" /> &nbsp;
                          Import from LinkedIn
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="personal-info-area">
                <div class="personal-info-heading-toggle">
                  <h3 class="heading-bottom-line">Basic Information</h3>
                  <div class="manual-input-acitve-deactive toggle-atv-dtv-btn">
                    <Switch
                      {...label}
                      checked={isManualEnabled}
                      onChange={(e) => setIsManualEnabled(e.target.checked)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>
                        First name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        className="form-control"
                        disabled={!isManualEnabled}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        className="form-control"
                        disabled={!isManualEnabled}
                      />
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>
                        County <span>(optional)</span>
                      </label>
                      <select
                        name="County" // ✅ Important
                        className="form-select form-control"
                        value={formData.County}
                        onChange={handleChange}
                        disabled={!isManualEnabled}
                      >
                        <option value="">Select County</option>
                        {countries?.length > 0 &&
                          countries.map((country, idx) => (
                            <option key={idx} value={country.name || country}>
                              {country.name || country}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group position-relative">
                      <label>
                        City <span>(optional)</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter city"
                        name="city"
                        value={formData.city}
                        onChange={handleCitySearch}
                        autoComplete="off"
                        disabled={!isManualEnabled}
                      />

                      {/* Suggestions Dropdown */}
                      {loading && (
                        <div className="suggestion-box">Searching...</div>
                      )}
                      {!loading && citySuggestions?.length > 0 && (
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
                              onClick={() => handleSelectCity(city)}
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
              </div>

              <div className="personal-info-area">
                <h3 className="heading-bottom-line">
                  Work Experience <span>(optional)</span>
                </h3>
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>
                        Job Title <span>(optional)</span>
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="Job Title"
                        className="form-control"
                        disabled={!isManualEnabled}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>
                        Years of experience <span>(optional)</span>
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Years of experience"
                        className="form-control"
                        disabled={!isManualEnabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="personal-info-area">
                <h3 className="heading-bottom-line">
                  Job Category <span>(optional)</span>
                </h3>
                <div className="job-category-tags">
                  <ul id="JobCategory">
                    {category.map((cate, index) => (
                      <li
                        key={index}
                        className={`${
                          activeIndex === index ? "active" : "inactive"
                        } ${isManualEnabled ? "disabled" : ""}`}
                        onClick={() => {
                          if (!isManualEnabled) return; // 🚫 block click
                          handleCategoryClick(index);
                        }}
                      >
                        {cate.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Job Type <span>(optional)</span>
                    </label>

                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="form-control"
                      disabled={!isManualEnabled}
                    >
                      <option value="">Select Job Type</option>

                      {jobTypes.map((job) => (
                        <option key={job._id} value={job.name}>
                          {job.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Desired Occupation Type <span>(optional)</span>
                    </label>

                    <select
                      name="occupationType"
                      value={formData.occupationType}
                      onChange={handleChange}
                      className="form-control"
                      disabled={!isManualEnabled}
                    >
                      <option value="">Select Occupation Type</option>

                      {occupationTypes.map((item) => (
                        <option key={item._id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <p>
                      Minimum Desired Salary (Gross) <span>(optional)</span>
                    </p>
                    <input
                      type="radio"
                      id="Hourly"
                      name="salaryType"
                      value="Hourly"
                      checked={formData.salaryType === "Hourly"}
                      onChange={handleChange}
                      disabled={!isManualEnabled}
                    />
                    &nbsp; <label htmlFor="Hourly">Hourly</label>
                    &nbsp;{" "}
                    <input
                      type="radio"
                      id="Daily"
                      name="salaryType"
                      value="Daily"
                      checked={formData.salaryType === "Daily"}
                      onChange={handleChange}
                      disabled={!isManualEnabled}
                    />
                    &nbsp; <label htmlFor="Daily">Daily</label>
                    &nbsp;{" "}
                    <input
                      type="radio"
                      id="Monthly"
                      name="salaryType"
                      value="Monthly"
                      checked={formData.salaryType === "Monthly"}
                      onChange={handleChange}
                      disabled={isManualEnabled}
                    />
                    &nbsp; <label htmlFor="Monthly">Monthly</label>
                    &nbsp;{" "}
                    <input
                      type="radio"
                      id="Yearly"
                      name="salaryType"
                      value="Yearly"
                      checked={formData.salaryType === "Yearly"}
                      onChange={handleChange}
                      disabled={!isManualEnabled}
                    />
                    &nbsp; <label htmlFor="Yearly">Yearly</label>
                  </div>
                </div>
              </div>

              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>
                    Please Select Your Desired Salary <span>(optional)</span>
                  </label>

                  <select
                    name="salaryAmount"
                    value={formData.salaryAmount}
                    onChange={handleChange}
                    className="form-control"
                    disabled={!isManualEnabled}
                  >
                    <option value="">Select Desired Salary</option>

                    {salaryRanges.map((item) => (
                      <option key={item._id} value={item.range}>
                        {item.range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="personal-info-btn">
                <a className="default-btn btn" onClick={candidateLogin}>
                  Submit
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default MyProfile;
