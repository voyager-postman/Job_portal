import axios from "axios";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { useLocation, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useTheme } from "@mui/material/styles";

function JobDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const job = location.state?.job || {};
  console.log("job from state:", job);
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const Title = job?.jobTitle;
  const Category = job?.jobCategory;
  console.log("Job Title:-", Title);
  console.log("Job Category:-", Category);
  const debounceTimer = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [cityList, setCityList] = useState([]);
  const [seniorityLevels, setSeniorityLevels] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  // ✅ Job data passed from previous page
  const jobFromState = location.state?.jobData || {};
  console.log(jobFromState);
  // ---- Initialize once with either state job or empty
  const [formData, setFormData] = useState(() => ({
    jobTitle: jobFromState.jobTitle || "",
    jobCategory: jobFromState.jobCategory || "",
    minimumLevel: jobFromState.minimumLevel?._id || "",
    employmentType: jobFromState.employmentType?._id || "",
    remote: jobFromState.remote || "",
    jobAddress: jobFromState.jobAddress || "",
    availablePosts: jobFromState.availablePosts || "",
    //cities: [], // 👈 this holds multiple cities    cities: Array.isArray(jobFromState.cities) ? jobFromState.cities : [], // ✅ always array    cityInput: "", // ✅ temp input for adding multiple cities
    city: Array.isArray(jobFromState.city) ? jobFromState.city : [],
    cities: Array.isArray(jobFromState.cities) ? jobFromState.cities : [], // single source of truth
    region: jobFromState.region || "",
    Country: jobFromState.country || "",
    shortDescription: jobFromState.shortDescription || "",
    tags: jobFromState.tags || [],
    jobDescription: jobFromState.jobDescription || "",
    enableExternalApply: jobFromState.enableExternalApply || false,
    confidentialJobPost: jobFromState.confidentialJobPost || false,
    referenceId: jobFromState.referenceId || "",
    enableEmailNotification: jobFromState.enableEmailNotification || false,
    ExternalApplyLink: jobFromState.ExternalApplyLink || "",
    minSalary: jobFromState?.privatJobDetails?.minSalary || "",
    maxSalary: jobFromState?.privatJobDetails?.maxSalary || "",
    coverPhoto: null,
    coverPhotoPreview: null,
    availableJobs: "",
  }));
  const [selectedCities, setSelectedCities] = useState(
    Array.isArray(jobFromState.city) ? jobFromState.city : []
  );

  // ---- Fetch if page was refreshed (no state) but we have an id
  useEffect(() => {
    if (!jobFromState._id && id) {
      const token = localStorage.getItem("token");
      axios
        .get(`${API_BASE_URL}getJobById/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const job = res.data.data;
          setFormData((prev) => ({
            ...prev,
            jobTitle: job.jobTitle || "",
            jobCategory: job.jobCategory || "",
            minimumLevel: job.minimumLevel || "",
            employmentType: job.employmentType || "",
            remote: job.remote || "",
            jobAddress: job.jobAddress || "",
            city: job.city || "",
            region: job.region || "",
            Country: job.country || "",
            shortDescription: job.shortDescription || "",
            tags: job.tags || [],
            jobDescription: job.jobDescription || "",
            enableExternalApply: job.enableExternalApply || false,
            confidentialJobPost: job.confidentialJobPost || false,
            referenceId: job.referenceId || "",
            enableEmailNotification: job.enableEmailNotification || false,
            ExternalApplyLink: job.ExternalApplyLink || "",
            minSalary: job?.privatJobDetails?.minSalary || "",
            maxSalary: job?.privatJobDetails?.maxSalary || "",
            coverPhoto: null,
          }));
          console.log("Job Details Data:", res.data.data);
        })
        .catch((err) => console.error("Failed to fetch job:", err));
    }
  }, [id, jobFromState._id]);

  useEffect(() => {
    const fetchSeniorityLevels = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}getActiveSeniorityLevelList`
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

  const handleCountryChange = async (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const countryId = selectedOption.getAttribute("data-id"); // ✅ numeric id
    const countryObjectId = e.target.value; // ✅ _id (mongo id)

    // Update form data
    setFormData((prev) => {
      const updated = { ...prev, Country: countryObjectId };

      // ✅ Auto-save with _id
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        handlePublishJob(updated, false); // sends _id
      }, 500);

      return updated;
    });

    // ✅ Fetch cities using `country.id`
    if (countryId) {
      fetchCitiesByCountry(countryId);
    }
  };

  const handleSeniorityChange = (e) => {
    const id = e.target.value;

    setFormData((prev) => {
      const updated = { ...prev, minimumLevel: id };

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        handlePublishJob(updated, false);
      }, 500);

      return updated;
    });
  };

  const [showCityOptions, setShowCityOptions] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");

  const filteredCities = cityList.filter((city) =>
    city.name.toLowerCase().includes(citySearchTerm.toLowerCase())
  );

  // Toggle select/unselect
  const toggleCity = (cityName) => {
    setSelectedCities((prev) => {
      const updated = prev.includes(cityName)
        ? prev.filter((c) => c !== cityName)
        : [...prev, cityName];

      setFormData((prevForm) => ({
        ...prevForm,
        cities: updated, // unified key
      }));

      return updated;
    });
  };

  // Remove individual tag
  const handleRemoveCity = (cityName) => {
    const updated = selectedCities.filter((c) => c !== cityName);
    setSelectedCities(updated);
    setFormData((prev) => ({
      ...prev,
      city: updated, // FIXED here
    }));
  };

  // Close dropdown when clicked outside
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
          `.nav-link[href="#${nextPane.id}"]`
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
          `.nav-link[href="#${prevPane.id}"]`
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

  const [tagInput, setTagInput] = useState("");
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() !== "") {
      const updatedFormData = {
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      };
      setFormData(updatedFormData);
      setTagInput("");
      handlePublishJob(updatedFormData, false);
    }
  };

  const handleRemoveTag = (tag) => {
    const updatedFormData = {
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    };
    setFormData(updatedFormData);
    handlePublishJob(updatedFormData, false);
  };

  const handleChange = async (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => {
      let updated = { ...prev };

      if (type === "checkbox") {
        updated[name] = checked;
      } else if (type === "file") {
        const file = files[0];
        if (file && file.size > 2 * 1024 * 1024) {
          alert("File size exceeds 2 MB limit");
          return prev;
        }
        updated[name] = file;
        updated.coverPhotoPreview = file ? URL.createObjectURL(file) : null;
      } else {
        updated[name] = value;
      }

      // ✅ Clear error on change
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

      // ✅ If Country changes → Fetch cities
      if (name === "Country" && value) {
        fetchCitiesByCountry(value);
      }

      // ✅ Debounce auto-save (updateJob)
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        handlePublishJob(updated, false);
      }, 1000);

      return updated;
    });
  };
  const fetchCitiesByCountry = async (countryId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}getCitiesByCountry?countryId=${countryId}`
      );
      const cities = response.data?.cities || [];
      setCityList(cities);

      // ✅ If editing, keep previously selected cities (if they still exist in the list)
      if (jobFromState?.cities?.length) {
        const validCities = jobFromState.cities.filter((cityName) =>
          cities.some((c) => c.name === cityName)
        );
        setSelectedCities(validCities);
        setFormData((prev) => ({ ...prev, cities: validCities }));
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
        (c) => c._id === jobFromState.country
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

  const handleSave = () => {
    setIsEditing(false);
  };

  const handlePublishJob = async (data = formData, isPublish = false) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("job_id", id || jobFromState._id);
      formDataToSend.append("jobTitle", data.jobTitle || "");
      formDataToSend.append("jobCategory", data.jobCategory || "");
      formDataToSend.append("minimumLevel", data.minimumLevel || "");
      formDataToSend.append("employmentType", data.employmentType || "");
      formDataToSend.append("remote", data.remote || "");
      formDataToSend.append("jobAddress", data.jobAddress || "");
      // formDataToSend.append("cities", JSON.stringify(data.cities || []));
      formDataToSend.append("city", JSON.stringify(data.cities || []));
      formDataToSend.append("region", data.region || "");
      formDataToSend.append("country", data.Country || "");
      formDataToSend.append("shortDescription", data.shortDescription || "");
      formDataToSend.append("tags", JSON.stringify(data.tags || []));
      formDataToSend.append("jobDescription", data.jobDescription || "");
      formDataToSend.append("enableExternalApply", data.enableExternalApply);
      formDataToSend.append("ExternalApplyLink", data.ExternalApplyLink || "");
      formDataToSend.append("confidentialJobPost", data.confidentialJobPost);
      formDataToSend.append("referenceId", data.referenceId || "");
      formDataToSend.append(
        "enableEmailNotification",
        data.enableEmailNotification
      );
      formDataToSend.append("availablePosts", data.availablePosts || "");
      formDataToSend.append("minSalary", data.minSalary || "");
      formDataToSend.append("maxSalary", data.maxSalary || "");

      // ✅ Add "status" key ONLY when Publish button is clicked
      if (isPublish) formDataToSend.append("status", "published");

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
        }
      );

      console.log("✅ Job Updated:", response.data);
      // ✅ If published, navigate to "your-job-posts"
      if (isPublish) {
        navigate("/your-job-posts", {
          state: {
            jobTitle: data.jobTitle,
            jobCategory: data.jobCategory,
          },
        });
      }
    } catch (error) {
      console.error("❌ Error creating job:", error.response || error);
    }
  };
  // Add new city to list

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
                <i className="fa-solid fa-angle-right" /> Job Details Form
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}

          {/* Your Job Posts Info*/}
          <div className="job-details-form-info">
            <div className="job-details-form-tabs">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    data-bs-toggle="tab"
                    href="#menu1"
                  >
                    Details
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#menu2">
                    Options
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#menu3">
                    Job Promotion
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#menu4">
                    Publish
                  </a>
                </li>
              </ul>
            </div>

            <div className="input-info-edit-area job-details-seprate-heading">
              {!isEditing ? (
                <>
                  <h3>{formData.jobTitle}</h3>
                  <i
                    className="fas fa-pencil-alt"
                    onClick={() => setIsEditing(true)}
                  />
                </>
              ) : (
                <>
                  <div className="col-lg-10 col-md-10 mt-2">
                    <div className="form-group">
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
                  <div>
                    <button
                      className="default-btn btn mx-4"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="tab-content">
              <div id="menu1" className="tab-pane fade show active">
                <div className="job-details-form-area">
                  <div className="job-details-form-heading">
                    <h3>Job Details</h3>
                  </div>

                  <form>
                    <div className="job-details-input-form-info">
                      <div className="row">
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
                            <label>Employment Type </label>

                            <select
                              className="form-select form-control"
                              name="employmentType"
                              value={formData.employmentType}
                              onChange={handleChange}
                            >
                              <option value="" disabled>
                                Select employment type
                              </option>

                              {jobTypes.length > 0 ? (
                                jobTypes.map((type) => (
                                  <option key={type._id} value={type._id}>
                                    {type.name}
                                  </option>
                                ))
                              ) : (
                                <option disabled>Loading job types...</option>
                              )}
                            </select>
                          </div>
                        </div>
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
                            <label>Street Address</label>
                            <span className="text-danger">*</span>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Street Address"
                              name="company_address"
                              value={formData.company_address}
                              onChange={handleCitySearch}
                              autoComplete="off"
                            />
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
                        </div> */}

                        <div className="col-lg-6 col-md-6">
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
                                            city.name
                                          )
                                            ? "#007bff"
                                            : "transparent",
                                          color: selectedCities.includes(
                                            city.name
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
                  <h3>
                    Short Description
                    {/* <span className="text-danger">*</span> */}
                  </h3>

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
                            />
                          </div>

                          <div className="skill-btn-info">
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
                  <h3>
                    Job Description
                    {/* <span className="text-danger">*</span> */}
                  </h3>

                  <div className="form-group">
                    {/* <textarea
                      className="form-control"
                      placeholder="Enter a description for this job post"
                      rows={10}
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                    /> */}
                    <CKEditor
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
                    />
                  </div>
                </div>

                <div className="post-job-next-btn-info">
                  <a href="#" className="btn default-btn next-tab-btn">
                    Next
                  </a>
                </div>
              </div>

              <div id="menu2" className="tab-pane fade">
                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>External Apply</h3>
                    <span className="heading-small-description">
                      Add tags to your job post. This will help it appear in as
                      many relevant job posts as possible.
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
                          className="form-control"
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
                    <h3>Confidential job post</h3>

                    <span className="heading-small-description">
                      Enable this option to hide your company details from the
                      job post. (Anonymous Company)
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
                      You can give your job post a unique Reference ID. This can
                      help you distinguish it and find it easier.
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
                    <label>Number of Available Jobs </label>
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
                      Private job details are non-visible to job seekers that
                      see your job post.
                    </span>
                  </div>
                  <div className="job-option-branding-input-box">
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Min salary (Gross)</label>
                          {/* <span className="text-danger">*</span> */}
                          <input
                            className="form-control"
                            type="text"
                            name="minSalary"
                            placeholder="Enter the minimum salary (€)"
                            value={formData.minSalary}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Max salary (Gross)</label>
                          {/* <span className="text-danger">*</span> */}
                          <input
                            className="form-control"
                            type="text"
                            name="maxSalary"
                            placeholder="Enter the maximum salary (€)"
                            value={formData.maxSalary}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="job-create-form-back-next-info">
                  <div className="job-create-form-back-next-btn">
                    <a href="#" className="default-btn btn back-tab-btn">
                      Back
                    </a>
                  </div>

                  <div className="job-create-form-back-next-btn">
                    <a href="#" className="btn default-btn next-tab-btn">
                      Next
                    </a>
                  </div>
                </div>
              </div>

              <div id="menu3" className="tab-pane fade">
                {/* <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>
                      Job Promotion
                    </h3>

                    <span className="heading-small-description">
                      Job Promotion post are more attractive to job seekers. Add
                      a cover photo for just +€ 250.
                    </span>
                  </div>

                  <div className="job-option-branding-attchment">
                    <div className="form-group">
                      <div
                        className="custom-file-upload"
                        onClick={() =>
                          document.getElementById("file-upload").click()
                        } 
                        style={{
                          cursor: "pointer",
                          border: "2px dashed #007bff",
                          padding: "20px",
                          textAlign: "center",
                          borderRadius: "6px",
                          background: "#f8fcff",
                        }}
                      >
                        <input
                          type="file"
                          id="file-upload"
                          name="coverPhoto"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleChange}
                          style={{ display: "none" }}
                        />

                        {formData.coverPhoto ? (
                          <div className="file-preview mt-2">
                            {formData.coverPhoto ? (
                              <div className="file-preview mt-2">
                                {formData.coverPhoto.type.startsWith(
                                  "image/"
                                ) ? (
                                  <img
                                    src={formData.coverPhotoPreview} 
                                    alt="Preview"
                                    style={{
                                      width: "200px",
                                      height: "auto",
                                      borderRadius: "8px",
                                    }}
                                  />
                                ) : (
                                  <p>
                                    <i className="fas fa-file" />{" "}
                                    {formData.coverPhoto.name}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="file-text"> ... </div>
                            )}
                          </div>
                        ) : (
                          <div className="file-text">
                            <i
                              className="fas fa-cloud-upload-alt"
                              style={{ fontSize: "40px", color: "#007bff" }}
                            />
                            <br />
                            <label style={{ fontWeight: "bold" }}>
                              Drag &amp; Drop your Photo or click to upload one
                            </label>
                            <p
                              style={{
                                fontSize: "13px",
                                marginTop: "6px",
                                color: "#666",
                              }}
                            >
                              File types supported: PNG, JPEG | Max file size: 2
                              MB | Recommended dimensions: 1536 x 432 px
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="job-option-branding-disclaimer">
                    <h5>Disclaimer</h5>
                    <p>
                      Please review our best practices before you upload a cover
                      photo.
                    </p>
                    <p>
                      Find them on our FAQ page:
                      <a href="https://itdevelopmentservices.com/design_website/jobPortal/">
                        https://itdevelopmentservices.com/design_website/jobPortal/
                      </a>
                    </p>
                  </div>
                </div> */}

                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>Featured Job</h3>

                    <span className="heading-small-description">
                      Priority placement — this job will appear at the top of
                      the job list. +€ 220
                    </span>
                  </div>

                  <div className="job-option-branding-content-switch">
                    <div className="job-option-branding-content">
                      <p>Enable Featured Job</p>
                    </div>

                    <div className="job-option-branding-switch">
                      <label className="switch">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleChange}
                        />
                        <span className="slider round" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>Highlighted Job</h3>

                    <span className="heading-small-description">
                      Visual emphasis with a colored background or badge to
                      attract more attention. +€ 150
                    </span>
                  </div>

                  <div className="job-option-branding-content-switch">
                    <div className="job-option-branding-content">
                      <p>Enable Highlighted Job</p>
                    </div>

                    <div className="job-option-branding-switch">
                      <label className="switch">
                        <input
                          type="checkbox"
                          name="isHighlighted"
                          checked={formData.isHighlighted}
                          onChange={handleChange}
                        />
                        <span className="slider round" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>Home Page visibility</h3>

                    <span className="heading-small-description">
                      Job posts from other companies so that we only present job
                      posts from your company with +€ 360
                    </span>
                  </div>

                  <div className="job-option-branding-content-switch">
                    <div className="job-option-branding-content">
                      <p>Enable Home Page Visibility jobs</p>
                    </div>

                    <div className="job-option-branding-switch">
                      <label className="switch">
                        <input
                          type="checkbox"
                          name="removeSimilarJobs"
                          checked={formData.removeSimilarJobs}
                          onChange={handleChange}
                        />
                        <span className="slider round" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="job-create-form-back-next-info">
                  <div className="job-create-form-back-next-btn">
                    <a href="#" className="default-btn btn back-tab-btn">
                      Back
                    </a>
                  </div>

                  <div className="job-create-form-back-next-btn">
                    <a href="#" className="btn default-btn next-tab-btn">
                      Next
                    </a>
                  </div>
                </div>
              </div>

              <div id="menu4" className="tab-pane fade">
                <div className="publish-job-payment-details">
                  <div className="job-detail-cart-info">
                    <div className="publish-job-date-heading">
                      <h4>
                        Your job post will be active for 30 days once you
                        publish it.
                      </h4>
                    </div>

                    <div className="job-detail-in-cart-info">
                      <div className="input-info-edit-area cart-job-detail-edit">
                        <h3>Job post review</h3>
                        <i className="fas fa-pencil-alt" />
                      </div>
                      <div className="job-post-address-info">
                        <h4>Job post address</h4>
                        <p>
                          {formData.city?.join(", ") || "Not provided"}
                          <br />
                          {/* {formData.region || "Not provided"},{" "} */}
                          {countryList.find(
                            (country) => country._id === formData.Country
                          )?.name || "Not provided"}
                        </p>
                      </div>
                      <div className="job-post-other-info">
                        <div className="minimum-level-remote">
                          <h4>Minimum level</h4>
                          <p>
                            {seniorityLevels.find(
                              (level) => level._id === formData.minimumLevel
                            )?.name || "Not provided"}
                          </p>
                          <div className="divder-space-line" />
                          <h4>Location</h4>
                          <p>
                            {countryList.find(
                              (country) => country._id === formData.Country
                            )?.name || "Not provided"}
                          </p>
                        </div>
                        <div className="employment-type-job-category">
                          <h4>Employment type</h4>
                          <p>
                            {jobTypes.find(
                              (type) => type._id === formData.employmentType
                            )?.name || "Not provided"}
                          </p>
                          <div className="divder-space-line" />
                          <h4>Job category</h4>
                          <p>
                            {categoryList.find(
                              (cat) => cat._id === formData.jobCategory
                            )?.name || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="job-cart-short-description-info">
                        <h4>Job Short Description</h4>
                        <p>{formData.shortDescription || "Not provided"}</p>
                      </div>
                      <div className="job-cart-long-description-info">
                        <h4>Job Description</h4>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: formData.jobDescription,
                          }}
                        ></p>
                      </div>
                      <div className="job-create-form-back-next-info">
                        <div className="job-create-form-back-next-btn">
                          <button
                            // onClick={handlePublishJob}
                            className="default-btn btn"
                          >
                            Pay & Publish Now
                          </button>
                        </div>
                        <div className="job-create-form-back-next-btn">
                          <button
                            onClick={() => handlePublishJob(formData, true)}
                            className="default-btn btn"
                          >
                            Publish Job
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Job Posts Info */}
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
