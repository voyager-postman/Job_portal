import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { useLocation, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
function JobDetailsForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const job = location.state?.job || {};
  console.log("job from state:", job);
  // const jobId = job?._id;
  const Title = job?.jobTitle;
  console.log("Job Title:-", Title);
  const [loading, setLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [mapUrl, setMapUrl] = useState("");
  // ✅ Job data passed from previous page
  const jobFromState = location.state?.jobData || {};

  // ---- Initialize once with either state job or empty
  const [formData, setFormData] = useState(() => ({
    jobTitle: jobFromState.jobTitle || "",
    jobCategory: jobFromState.jobCategory || "",
    minimumLevel: jobFromState.minimumLevel || "",
    employmentType: jobFromState.employmentType || "",
    remote: jobFromState.remote || "",
    jobAddress: jobFromState.jobAddress || "",
    city: jobFromState.city || "",
    region: jobFromState.region || "",
    Country: jobFromState.Country || "",
    shortDescription: jobFromState.shortDescription || "",
    tags: jobFromState.tags || [],
    jobDescription: jobFromState.jobDescription || "",
    enableExternalApply: jobFromState.enableExternalApply || false,
    confidentialJobPost: jobFromState.confidentialJobPost || false,
    referenceId: jobFromState.referenceId || "",
    enableEmailNotification: jobFromState.enableEmailNotification || false,
    ExternalApplyLink: jobFromState.ExternalApplyLink || "",
    minSalary: jobFromState.minSalary || "",
    maxSalary: jobFromState.maxSalary || "",
    coverPhoto: null,
    coverPhotoPreview: null,
  }));

  // ✅ Fill form if job is passed from state
  // useEffect(() => {
  //   if (jobFromState._id) {
  //     setFormData({
  //       jobTitle: jobFromState.jobTitle || "",
  //       jobCategory: jobFromState.jobCategory || "",
  //       minimumLevel: jobFromState.minimumLevel || "",
  //       employmentType: jobFromState.employmentType || "",
  //       remote: jobFromState.remote || "",
  //       jobAddress: jobFromState.jobAddress || "",
  //       city: jobFromState.city || "",
  //       region: jobFromState.region || "",
  //       Country: jobFromState.Country || "",
  //       shortDescription: jobFromState.shortDescription || "",
  //       tags: jobFromState.tags || [],
  //       jobDescription: jobFromState.jobDescription || "",
  //       enableExternalApply: jobFromState.enableExternalApply || false,
  //       confidentialJobPost: jobFromState.confidentialJobPost || false,
  //       referenceId: jobFromState.referenceId || "",
  //       enableEmailNotification: jobFromState.enableEmailNotification || false,
  //       ExternalApplyLink: jobFromState.ExternalApplyLink || "",
  //       minSalary: jobFromState.minSalary || "",
  //       maxSalary: jobFromState.maxSalary || "",
  //       coverPhoto: null,
  //     });
  //   }
  // }, [jobFromState]);

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
        })
        .catch((err) => console.error("Failed to fetch job:", err));
    }
  }, [id, jobFromState._id]);

  const handleCitySearch = async (e) => {
    const value = e.target.value;
    handleChange(e);

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
      company_address: `${city.name}, ${city.state_name}, ${city.country_name}`,
      city: city.name,
      region: city.state_name,
      Country: city.country_name,
      latitude: city.latitude,
      longitude: city.longitude,
    }));

    // Simpler map URL
    const mapSrc = `https://www.google.com/maps?q=${city.latitude},${city.longitude}&z=15&output=embed`;
    setMapUrl(mapSrc);
    setCitySuggestions([]);
  };

  const { jobTitle, jobCategory } = location.state || {};
  console.log(">>>>>>>>>>>>>>>>>>", location);
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

  const [jobCoverPhoto, setJobCoverPhoto] = useState(null);

  // ✅ handle input change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => {
      if (type === "checkbox") {
        return { ...prev, [name]: checked };
      } else if (type === "file") {
        const file = files[0];
        if (file && file.size > 2 * 1024 * 1024) {
          alert("File size exceeds 2 MB limit");
          return prev; // don't update if invalid
        }
        return {
          ...prev,
          [name]: file,
          coverPhotoPreview: file ? URL.createObjectURL(file) : null, // ✅ store preview
        };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const [tagInput, setTagInput] = useState("");
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() !== "") {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  // ✅ handle tags (comma separated input OR add/remove logic)
  const validateForm = () => {
    if (!formData.minimumLevel) return "Minimum Level is required";
    if (!formData.employmentType) return "Employment Type is required";
    if (!formData.jobDescription) return "Job description is required";
    if (!formData.shortDescription) return "Short Job Description is required";
    if (!formData.minSalary) return "Minimum salary is required";
    if (!formData.maxSalary) return "Maximum salary is required";

    // Optional: Validate file
    if (formData.coverPhoto && formData.coverPhoto.size > 2 * 1024 * 1024) {
      return "Cover photo must be less than 2MB";
    }
    return null; // ✅ no error
  };

  const handlePublishJob = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("job_id", id || jobFromState._id);
      formDataToSend.append("jobTitle", formData.jobTitle);
      formDataToSend.append("jobCategory", formData.jobCategory);
      formDataToSend.append("minimumLevel", formData.minimumLevel);
      formDataToSend.append("employmentType", formData.employmentType);
      formDataToSend.append("remote", formData.remote);
      formDataToSend.append("jobAddress", formData.jobAddress);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("region", formData.region);
      formDataToSend.append("country", formData.Country);
      formDataToSend.append("shortDescription", formData.shortDescription);
      formDataToSend.append("tags", JSON.stringify(formData.tags));
      formDataToSend.append("jobDescription", formData.jobDescription);
      formDataToSend.append(
        "enableExternalApply",
        formData.enableExternalApply
      );
      formDataToSend.append("ExternalApplyLink", formData.ExternalApplyLink);
      formDataToSend.append(
        "confidentialJobPost",
        formData.confidentialJobPost
      );
      formDataToSend.append("referenceId", formData.referenceId);
      formDataToSend.append(
        "enableEmailNotification",
        formData.enableEmailNotification
      );
      formDataToSend.append("minSalary", formData.minSalary);
      formDataToSend.append("maxSalary", formData.maxSalary);

      if (formData.coverPhoto) {
        formDataToSend.append("jobCoverPhoto", formData.coverPhoto);
      }

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

      console.log("Job Created:", response.data);
      toast.success(response.data.message);

      // ✅ Redirect to jobs with jobTitle & jobCategory
      navigate("/your-job-posts", {
        state: {
          jobTitle: formData.jobTitle,
          jobCategory: formData.jobCategory,
        },
      });
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Please try again.");
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
                <Link to="/employer-dashboard">Home </Link>
              </li>

              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
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
                    Job Branding
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
              <h3>{Title}</h3>
              <i className="fas fa-pencil-alt" />
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
                            <label>
                              Minimum level{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                              name="minimumLevel"
                              value={formData.minimumLevel}
                              onChange={handleChange}
                              required
                            >
                              <option value="" disabled>
                                Select minimum level
                              </option>
                              <option value="No experience / No degree">
                                No experience / No degree
                              </option>
                              <option value="Entry / Junior">
                                Entry / Junior
                              </option>
                              <option value="Mid-level">Mid-level</option>
                              <option value="Senior">Senior</option>
                              <option value="C-level / Executive">
                                C-level / Executive
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>
                              Employment Type{" "}
                              <span className="text-danger">*</span>
                            </label>

                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                              name="employmentType"
                              value={formData.employmentType}
                              onChange={handleChange}
                              required
                            >
                              <option value="" disabled>
                                Select employment type
                              </option>
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Full-time / Part-time">
                                Full-time / Part-time
                              </option>
                              <option value="Contract / Freelance / Self-employed">
                                Contract / Freelance / Self-employed
                              </option>
                              <option value="Internship / Apprenticeship">
                                Internship / Apprenticeship
                              </option>
                              <option value="Seasonal">Seasonal</option>
                              <option value="Volunteer">Volunteer</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>
                              Remote <span className="text-danger">*</span>
                            </label>

                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                              name="remote"
                              value={formData.remote}
                              onChange={handleChange}
                              required
                            >
                              <option value="" disabled>
                                Select remote type
                              </option>
                              <option value="Fully remote">Fully remote</option>
                              <option value="Partialy-remote">
                                Partialy-remote
                              </option>
                              <option value="Full-time / Part-time">
                                Temporarily remote
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
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
                        </div>

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
                                <option value={list.name} key={list._id}>
                                  {list.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>City</label> (auto-generated from location):
                            <span className="text-danger">*</span>
                            <input
                              className="form-control"
                              type="text"
                              name="city"
                              value={formData.city}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>State</label> (auto-generated from location):
                            <span className="text-danger">*</span>
                            <input
                              className="form-control"
                              type="text"
                              name="region"
                              value={formData.region}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Country</label> (auto-generated from
                            location):
                            <span className="text-danger">*</span>
                            <input
                              className="form-control"
                              type="text"
                              name="Country"
                              value={formData.Country}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Our Map Location</label>
                            <span className="text-danger">*</span>
                            {mapUrl ? (
                              <iframe
                                src={mapUrl}
                                width="100%"
                                height={500}
                                style={{ border: "0" }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                              />
                            ) : (
                              <p>No location selected</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="job-description-box-info">
                  <h3>
                    Short Description <span className="text-danger">*</span>
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
                    <form>
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
                    </form>
                  </div>
                </div>

                <div className="job-description-box-info">
                  <h3>
                    Job Description <span className="text-danger">*</span>
                  </h3>

                  <div className="form-group">
                    <textarea
                      className="form-control"
                      placeholder="Enter a description for this job post"
                      rows={10}
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
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
                          <span className="text-danger">*</span>
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
                          <span className="text-danger">*</span>
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
                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>
                      Brand your job post <span className="text-danger">*</span>
                    </h3>

                    <span className="heading-small-description">
                      Branded job post are more attractive to job seekers. Add a
                      cover photo for just +€ 250.
                    </span>
                  </div>

                  <div className="job-option-branding-attchment">
                    <div className="form-group">
                      <div
                        className="custom-file-upload"
                        onClick={() =>
                          document.getElementById("file-upload").click()
                        } // ✅ Click entire area
                        style={{
                          cursor: "pointer",
                          border: "2px dashed #007bff",
                          padding: "20px",
                          textAlign: "center",
                          borderRadius: "6px",
                          background: "#f8fcff",
                        }}
                      >
                        {/* Hidden input */}
                        <input
                          type="file"
                          id="file-upload"
                          name="coverPhoto"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleChange}
                          style={{ display: "none" }}
                        />

                        {/* If file uploaded, show preview */}
                        {formData.coverPhoto ? (
                          <div className="file-preview mt-2">
                            {formData.coverPhoto ? (
                              <div className="file-preview mt-2">
                                {formData.coverPhoto.type.startsWith(
                                  "image/"
                                ) ? (
                                  <img
                                    src={formData.coverPhotoPreview} // ✅ now works
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
                </div>

                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>Remove similar job posts</h3>

                    <span className="heading-small-description">
                      Remove similar job posts from other companies so that we
                      only present job posts from your company with +€ 360
                    </span>
                  </div>

                  <div className="job-option-branding-content-switch">
                    <div className="job-option-branding-content">
                      <p>Enable removal of relevant jobs</p>
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
                          {formData.city || "Not provided"}
                          <br />
                          {formData.region || "Not provided"},{" "}
                          {formData.Country || "Not provided"}
                        </p>
                      </div>
                      <div className="job-post-other-info">
                        <div className="minimum-level-remote">
                          <h4>Minimum level</h4>
                          <p>{formData.minimumLevel || "Not provided"}</p>
                          <div className="divder-space-line" />
                          <h4>Location</h4>
                          <p>{formData.city || "Not provided"}</p>
                        </div>
                        <div className="employment-type-job-category">
                          <h4>Employment type</h4>
                          <p>{formData.employmentType || "Not provided"}</p>
                          <div className="divder-space-line" />
                          <h4>Job category</h4>
                          <p>{formData.jobCategory || "Not provided"}</p>
                        </div>
                      </div>

                      <div className="job-cart-short-description-info">
                        <h4>Job Short Description</h4>
                        <p>{formData.shortDescription || "Not provided"}</p>
                      </div>
                      <div className="job-cart-long-description-info">
                        <h4>Job Description</h4>
                        <p>{formData.jobDescription || "Not provided"}</p>
                      </div>
                      <div className="job-create-form-back-next-info">
                        <div className="job-create-form-back-next-btn">
                          <a
                            href="job-listing.html"
                            className="default-btn btn"
                          >
                            Save Draft
                          </a>
                        </div>
                        <div className="job-create-form-back-next-btn">
                          <button
                            onClick={handlePublishJob}
                            className="default-btn btn"
                          >
                            Publish Job
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="job-payment-detail-box-info">

                    <div className="job-payment-detail-info">

                      <h4>Payment details</h4>

                    </div>

                    <div className="job-payment-text-price">

                      <div className="job-payment-text">

                        <h5>Standard post</h5>

                      </div>

                      <div className="job-payment-price">

                        <h5>€750</h5>

                      </div>

                    </div>

                    <div className="job-payment-text-price">

                      <div className="job-payment-text">

                        <h5>Cover photo</h5>

                      </div>

                      <div className="job-payment-price">

                        <h5>€250</h5>

                      </div>

                    </div>

                    <div className="job-payment-text-price">

                      <div className="job-payment-text">

                        <h5>Remove similar job posts</h5>

                      </div>

                      <div className="job-payment-price">

                        <h5>€360</h5>

                      </div>

                    </div>

                    <div className="job-payment-divider" />

                    <div className="job-payment-text-price">

                      <div className="job-payment-text">

                        <h2>Summary (ex. VAT)</h2>

                      </div>

                      <div className="job-payment-price">

                        <h2>€1360</h2>

                      </div>

                    </div>

                    <div className="job-payment-divider" />

                    <div className="job-payment-text-price">

                      <div className="job-payment-text">

                        <h2>VAT 20%</h2>

                      </div>

                      <div className="job-payment-price">

                        <h2>€272</h2>

                      </div>

                    </div>

                    <div className="job-payment-divider" />

                    <div className="job-payment-text-price">

                      <div className="job-payment-text">

                        <h2>Total</h2>

                      </div>

                      <div className="job-payment-price">

                        <h2>€1632</h2>

                      </div>

                    </div>

                    <div className="job-payment-divider" />

                    <div className="pay-publish-later-btn">

                      <Link to="/your-job-posts" className="default-btn btn">

                        Pay and publish

                      </Link>

                    </div>

                    <div className="job-payment-divider" />

                    <div className="pay-publish-later-btn">

                      <Link to="/your-job-posts" className="default-btn btn">

                        Pay Now, Publish later

                      </Link>

                    </div>

                    <div className="job-payment-divider" />

                    <div className="job-payment-content-info">

                      <p>

                        By clicking the "Pay and publish" or "Pay now, publish

                        later", I agree to the Terms and Conditions &amp;

                        Privacy Policy

                      </p>

                    </div>

                  </div> */}
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
