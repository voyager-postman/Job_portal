import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import axios from "axios";
import Switch from "@mui/material/Switch";
import { ToastContainer, toast } from "react-toastify";
// import { Modal } from "bootstrap";
const categories = [
  "Information systems / Networks",
  "Software Engineering / Web Development",
  "DevOps / Cloud",
  "Project / Product Management",
  "Data / Big data",
  "Cyber security / IT Security",
  "Quality Assurance",
  "UI / UX Design",
  "IT Consulting",
  "Information Technology Management",
];

const label = { inputProps: { "aria-label": "Size switch demo" } };
function MyProfile() {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
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
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isActive, setIsActive] = useState(false);

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
      selectedCategory: categories[index],
    }));
  };

  const handleEligibilityClick = (value) => {
    setFormData((prev) => ({
      ...prev,
      eligibleInFrance: value,
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
    if (!formData.city) {
      toast.error("City is required.");
      return false;
    }
    // if (!formData.jobTitle?.trim()) {
    //   toast.error("Job title is required.");
    //   return false;
    // }
    // if (!formData.experience?.trim()) {
    //   toast.error("Experience is required.");
    //   return false;
    // }
    // if (!formData.employmentType) {
    //   toast.error("Employment type is required.");
    //   return false;
    // }
    // if (!formData.occupationType) {
    //   toast.error("Occupation type is required.");
    //   return false;
    // }
    // if (!formData.salaryType) {
    //   toast.error("Salary type is required.");
    //   return false;
    // }
    // if (!formData.salaryAmount?.trim()) {
    //   toast.error("Salary amount is required.");
    //   return false;
    // }
    // if (!formData.selectedCategory) {
    //   toast.error("Job category is required.");
    //   return false;
    // }
    // if (!formData.eligibleInFrance) {
    //   toast.error("Eligibility to work in France is required.");
    //   return false;
    // }

    return true;
  };

  const candidateLogin = async () => {
    if (!validate()) return;

    const data = new FormData();
    data.append("firstname", formData.firstName);
    data.append("lastname", formData.lastName);
    data.append("city", formData.city);
    data.append("jobTitle", formData.jobTitle);
    data.append("yearOfExprerience", formData.experience);
    data.append("jobCategory", formData.selectedCategory);
    data.append("DesiredEmploymentType", formData.employmentType);
    data.append("DesiredOccupationType", formData.occupationType);
    data.append(
      "MinimumDesiredSalary",
      JSON.stringify({
        type: formData.salaryType || "Yearly",
        amount: formData.salaryAmount,
        currency: "EUR",
      })
    );
    const isEligible = formData.eligibleInFrance?.toLowerCase() === "yes";
    data.append("eligibleToWorkInFrance", JSON.stringify(isEligible));

    data.append("resume", formData.attachment);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}createCandidateProfile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  // const uploadResume = async () => {
  //   const data = new FormData();
  //   data.append("resume", formData.attachment);

  //   try {
  //     const res = await axios.post(`${API_BASE_URL}extractResume`, data);

  //     toast.success("Resume uploaded successfully!");

  //     // Close modal programmatically
  //     const modalElement = document.getElementById("exampleModal");
  //     const modalInstance =
  //       Modal.getInstance(modalElement) || new Modal(modalElement);
  //     modalInstance.hide();

  //     // Optional: Reset file input or form data
  //     // setFormData({ ...formData, attachment: null });
  //     // setFile(null);
  //   } catch (err) {
  //     console.error("Error:", err.response?.data || err.message);
  //     toast.error("Failed to upload resume. Try again.");
  //   }
  // };
  const uploadResume = async () => {
    const data = new FormData();
    data.append("resume", formData.attachment);

    try {
      const res = await axios.post(`${API_BASE_URL}extractResume`, data);

      if (res.data.success && res.data.data) {
        setShowModal(false);
        toast.success("Resume uploaded successfully!");

        const extracted = res.data.data;

        // Map API response to form fields
        setFormData((prev) => ({
          ...prev,
          firstName: extracted.firstName || "",
          lastName: extracted.lastName || "",
          city: extracted.city || "",
          jobTitle: extracted.jobTitle || "",
          experience: extracted.experience || "",
          employmentType: extracted.employmentType || "",
          occupationType: extracted.occupationType || "",
          salaryType: extracted.desiredSalaryType || "",
          salaryAmount: extracted.desiredSalaryAmount || "",
          eligibleInFrance: extracted.eligibleToWorkInFrance ? "Yes" : "No",
          selectedCategory: extracted.jobCategory || "",
        }));

        // Close modal
        // const modalElement = document.getElementById("exampleModal");
        // const modalInstance =
        //   Modal.getInstance(modalElement) || new Modal(modalElement);
        // modalInstance.hide();
      } else {
        toast.error("Upload succeeded but data extraction failed.");
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error("Failed to upload resume. Try again.");
    }
  };
  return (
    <>
      <ToastContainer />
      {/* <div className="page-banner-area bg-f0f4fc">
        <div className="container">
          <div className="page-banner-content">
            <h1>Profile Basic Info</h1>
            <ul>
              <li>
                <a href="index.html">Home</a>
              </li>
              <li>Profile Basic Info</li>
            </ul>
          </div>
        </div>
      </div> */}
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
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt.
            </p>
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
                                    <div className="custom-file-upload">
                                      <label
                                        htmlFor="file-upload"
                                        className="fw-bold"
                                      >
                                        Upload Your File (PDF/JPG/PNG)
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
                                        className="file-text"
                                      >
                                        <i className="fas fa-cloud-upload-alt" />
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
                        <a
                          href="https://www.linkedin.com/login"
                          target="_blank"
                          className="default-btn btn"
                        >
                          <i className="fa-brands fa-linkedin-in" />
                          Import from LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="personal-info-area">
                <div class="personal-info-heading-toggle">
                  <h3 class="heading-bottom-line">Basic Information</h3>
                  <div class="manual-input-acitve-deactive toggle-atv-dtv-btn">
                    <Switch {...label} />
                    {/* <span
                      onClick={handleToggle}
                      className={`toggle-atv-dtv-btn ${
                        isActive ? "active" : "deactive"
                      }`}
                    >
                      {isActive ? "Active" : "Deactive"}
                    </span> */}
                  </div>
                  {/* <div class="manual-input-acitve-deactive">
                    <span id="toggleButton" class="toggle-atv-dtv-btn deactive">
                      Deactive
                    </span>
                  </div> */}
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>First name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>City</label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="">Select City</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Agra">Agra</option>
                        <option value="Noida">Noida</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="personal-info-area">
                <h3 className="heading-bottom-line">Work Experience</h3>
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Job Title</label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="Job Title"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Years of experience</label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Years of experience"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="personal-info-area">
                <h3 className="heading-bottom-line">Job Category</h3>
                <div className="job-category-tags">
                  <ul id="JobCategory">
                    {categories.map((category, index) => (
                      <li
                        key={index}
                        className={
                          activeIndex === index ? "active" : "inactive"
                        }
                        onClick={() => handleCategoryClick(index)}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Desired Employment Type</label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="Permanent contract">
                        Permanent contract
                      </option>
                      <option value="Fixed term contract">
                        Fixed term contract
                      </option>
                      <option value="Interim">Interim</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Apprenticeship">Apprenticeship</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Desired Occupation Type</label>
                    <select
                      name="occupationType"
                      value={formData.occupationType}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">Select Occupation Type</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <p>Minimum Desired Salary (Gross)</p>
                    <input
                      type="radio"
                      id="Hourly"
                      name="salaryType"
                      value="Hourly"
                      checked={formData.salaryType === "Hourly"}
                      onChange={handleChange}
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
                    />
                    &nbsp; <label htmlFor="Yearly">Yearly</label>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Please Enter Your Desired Salary</label>
                  <input
                    type="text"
                    name="salaryAmount"
                    value={formData.salaryAmount}
                    onChange={handleChange}
                    placeholder="Enter Desired Salary"
                    className="form-control"
                  />
                </div>
              </div>
              {/* <div className="personal-info-area">
                <h3 className="heading-bottom-line">
                  I Am Eligible To Work In France
                </h3>
                <div className="location-select-option">
                  <ul id="LocationSelect">
                    {["Yes", "No"].map((option) => (
                      <li
                        key={option}
                        className={
                          formData.eligibleInFrance === option
                            ? "active"
                            : "inactive"
                        }
                        onClick={() => handleEligibilityClick(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}
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
