import axios from "axios";
import React, { useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";

function CandidateProfile() {
  const [profileData, setProfileData] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(
    profileData || profileData.aboutRole || profileData.career_goals
  );
  const [isProfessional, setIsProfessional] = useState(false);
  const [isGoal, setIsGoal] = useState(false);
  const [isRole, setIsRole] = useState(false);
  const [isExperience, setIsExperience] = useState(false);
  const [isEducation, setIsEducation] = useState(false);
  const [isLanguage, setIsLanguage] = useState(false);
  const [isCertificates, setIsCertificates] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const faqItems = document.querySelectorAll(
      ".candidate-blank-form-detail-edit-info"
    );

    faqItems.forEach((item) => {
      item.classList.add("active");
      const question = item.querySelector(".profile-form-content");
      question?.addEventListener("click", () => {
        item.classList.toggle("active");
      });
    });

    return () => {
      faqItems.forEach((item) => {
        const question = item.querySelector(".profile-form-content");
        question?.removeEventListener("click", () => {});
      });
    };
  }, []);

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}candidate/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(response.data.profile);
    } catch (error) {
      console.error(
        "Error Fetching Data:",
        error.response?.data || error.response,
        error
      );
      toast.error("Failed to create profile. Try again.");
    }
  };

  const handleEditClick = () => {
    setFormData(profileData);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };
  const handleProClick = () => {
    setFormData(profileData);
    setIsProfessional(true);
  };

  const handleProCancel = () => {
    setIsProfessional(false);
  };

  const handleGoalClick = () => {
    setFormData(profileData || profileData.career_goals);
    setIsGoal(true);
  };

  const handleGoalCancel = () => {
    setIsGoal(false);
  };

  const handleRoleClick = () => {
    setFormData(profileData.aboutRole);
    setIsRole(true);
  };

  const handleRoleCancel = () => {
    setIsRole(false);
  };

  const handleExperienceClick = () => {
    setFormData(profileData);
    setIsExperience(true);
  };

  const handleExperienceCancel = () => {
    setIsExperience(false);
  };

  const handleEducationClick = () => {
    setFormData(profileData);
    setIsEducation(true);
  };

  const handleEducationCancel = () => {
    setIsEducation(false);
  };

  const handleLanguageClick = () => {
    setFormData(profileData);
    setIsLanguage(true);
  };

  const handleLanguageCancel = () => {
    setIsLanguage(false);
  };

  const handleCertificatesClick = () => {
    setFormData(profileData);
    setIsCertificates(true);
  };

  const handleCertificatesCancel = () => {
    setIsCertificates(false);
  };

  const handleLinkClick = () => {
    setIsLink(true);
    setFormData(profileData);
  };

  const handleLinkCancel = () => {
    setIsLink(false);
  };

  // Profile update api
  const handleSaveClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        firstname: formData.first_name || "",
        lastname: formData.last_name || "",
        dateOfBirth: formData.date_of_birth || "",
        gender: formData.gender || "",
        nationality: formData.Nationality || "",
        city: formData.city || "",
        phone: formData.phone || "",
      };

      const response = await axios.put(
        `${API_BASE_URL}updatePersonalDetails`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile Details Updated Successfully");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // summary update api
  const handleProSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        professionalSummary: formData.professionalSummary || "",
      };
      const response = await axios.post(
        `${API_BASE_URL}updateProfessionalSummary`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Professional Summary Updated");
        setIsProfessional(false);
      } else {
        toast.error("Failed to Post Professional Summary Data.");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      toast.error(error.response?.data?.message || error);
    } finally {
      setLoading(false);
    }
  };

  // resume update api
  const handleResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error("Please select a file first.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const response = await axios.put(
        `${API_BASE_URL}updateResumeUrl`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Resume Updated Successfully");
        setProfileData((prev) => ({
          ...prev,
          resumeUrl: response.data.data.resumeUrl,
        }));
      } else {
        toast.error("Failed to update resume.");
      }
    } catch (error) {
      console.error("Resume Error:", error.response?.data || error);
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // goal update api
  const handleGoal = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        DesiredJobTitle: formData.DesiredJobTitle,
        DesiredEmploymentType: formData.DesiredEmploymentType,
        DesiredOccupationType: formData.DesiredOccupationType,
        MinimumDesiredSalary: {
          currency: formData.salaryCurrency,
          amount: Number(formData.MinimumDesiredSalary),
          type: formData.salaryType,
        },
        jobSearchStatus: formData.jobSearchStatus,
        eligibleToWorkInFrance: formData.eligibleToWorkInFrance,
      };

      const response = await axios.put(
        `${API_BASE_URL}updateCareerGoals`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Career Goal Details Updated Successfully");
        setIsGoal(false);
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Links update api
  const handleLink = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        linkedin: formData.linkedin || "",
        github: formData.github || "",
        portfolio: formData.portfolio || "",
      };

      const response = await axios.post(`${API_BASE_URL}updateLinks`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Links Update Successfully");
        setIsLink(false);
      } else {
        toast.error("Failed to Update Links");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      toast.error(error.response?.data?.message || error);
    } finally {
      setLoading(false);
    }
  };

  // Certificates Add api
  const handleCertificates = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: formData.title || "",
        issueDate: formData.issueDate || "",
      };
      const response = await axios.post(
        `${API_BASE_URL}updateCertificates`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Certificates Added Successfully");
        setIsCertificates(false);
      } else {
        toast.error("Failed to Add Certificates");
      }
    } catch (error) {
      console.error("Add Certificates error:", error.response?.data || error);
      toast.error(error.response?.data?.message || error);
    } finally {
      setLoading(false);
    }
  };

  // About Role Logic
  const handleRole = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        jobTitle: formData.jobTitle || "",
        yearOfExperience: formData.yearOfExperience || "",
        jobCategory: formData.jobCategory || "",
      };

      const response = await axios.put(
        `${API_BASE_URL}updateAboutRole`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("About Role Updated Successfully");
        setIsRole(false);
      } else {
        toast.error("Failed to update Role.");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      toast.error("Something went wrong, Try Again");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

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
                      src="/jobPortal/assets/images/dashboard/dashboard-img-5.jpg"
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
                    <input type="checkbox" defaultChecked />
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
            <div className="candidate-blank-form-detail-edit-info active">
              <div className="profile-form-content">
                <div className="input-info-edit-area">
                  <h3>Personal Details</h3>
                  {!isEditing && (
                    <i
                      className="fas fa-pencil-alt"
                      style={{ cursor: "pointer" }}
                      onClick={handleEditClick}
                    />
                  )}
                </div>
                <div className="accordian-open-close-btn">
                  <i className="fa-solid fa-angle-up" />
                  <i className="fa-solid fa-angle-down" />
                </div>
              </div>
              {isEditing && (
                <div className="profile-form-content">
                  <div className="profile-form">
                    <form>
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="not-add-detail-info">
                            <h5>You haven’t yet added any Personal Details.</h5>
                            <i className="fa-solid fa-user" />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="profile-form">
                    <form onSubmit={handleSaveClick}>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>First Name</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="First Name"
                              name="first_name"
                              value={formData.first_name || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Last Name</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Last Name"
                              name="last_name"
                              value={formData.last_name || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Email</label>
                            <input
                              disabled
                              className="form-control"
                              type="text"
                              placeholder="hello@gmail.com"
                              name="email"
                              value={formData.email || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Phone Number</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Phone Number"
                              name="phone"
                              value={formData.phone || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Year Of Birth</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Year Of Birth"
                              name="date_of_birth"
                              value={formData.date_of_birth || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Gender Identity</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Gender Identity"
                              name="gender"
                              value={formData.gender || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Nationality</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Nationality"
                              name="Nationality"
                              value={formData.Nationality || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>City</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="City"
                              name="city"
                              value={formData.city || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="save-cancel-btn-info">
                        <button className="default-btn btn">
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="default-btn btn"
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {!isEditing && (
                <div className="user-all-detail-info-main">
                  <div className="user-all-details-info">
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>First name</label>
                          <p>{profileData.first_name}</p>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Last name</label>
                          <p>{profileData.last_name}</p>
                        </div>
                      </div>
                      <div className="divder-line-info" />
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Email</label>
                          <p>{profileData.email}</p>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Phone number</label>
                          <p>{profileData.phone}</p>
                        </div>
                      </div>
                      <div className="divder-line-info" />
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Year of birth</label>
                          <p>{profileData.date_of_birth}</p>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Gender Identity</label>
                          <p>{profileData.gender}</p>
                        </div>
                      </div>
                      <div class="divder-line-info"></div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>City</label>
                          <p>{profileData.city}</p>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Nationality</label>
                          <p>{profileData.Nationality}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="candidate-blank-form-detail-edit-info active">
              <div className="profile-form-content">
                <div className="input-info-edit-area">
                  <h3>Professional Summary</h3>
                  {!isProfessional && (
                    <i
                      className="fa-solid fa-plus"
                      style={{ cursor: "pointer" }}
                      onClick={handleProClick}
                    />
                  )}
                </div>
                <div className="accordian-open-close-btn">
                  <i className="fa-solid fa-angle-up" />
                  <i className="fa-solid fa-angle-down" />
                </div>
                {/* <div className="profile-form">
                  <form>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="not-add-detail-info">
                          <h5>
                            You haven’t yet added any Professional Summary.
                          </h5>
                          <i className="fa-solid fa-user" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div> */}
              </div>
              {isProfessional && (
                <div className="profile-form-content">
                  <div className="profile-form">
                    <form onSubmit={handleProSave}>
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Professional Summary</label>
                            <textarea
                              className="form-control"
                              placeholder="Write Brief Bio Or Introduction"
                              rows={7}
                              name="professionalSummary"
                              value={formData.professionalSummary}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="save-cancel-btn-info">
                        <button className="default-btn btn">
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="default-btn btn"
                          onClick={handleProCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {!isProfessional && (
                <div className="user-all-detail-info-main">
                  <div className="user-all-details-info">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Professional Summary</label>
                          <p>{profileData.professionalSummary}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* CV Code */}
            <div className="candidate-blank-form-detail-edit-info">
              <div className="profile-form-content">
                <div className="input-info-edit-area">
                  <h3>My CVs</h3>
                </div>
                <div className="accordian-open-close-btn">
                  <i className="fa-solid fa-angle-up" />
                  <i className="fa-solid fa-angle-down" />
                </div>
                <div className="profile-form">
                  <form onSubmit={handleResume}>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="upload-download-dlt-cv">
                          <div className="upload-cv-info-area">
                            <p>
                              <i className="fas fa-file-alt" />{" "}
                              {profileData.resumeUrl}
                            </p>
                          </div>
                          <div className="download-dlt-cv">
                            <i
                              className="fas fa-ellipsis-v"
                              onClick={() => setShowList((prev) => !prev)}
                            />
                            <div className="download-edit-info">
                              {showList && (
                                <ul>
                                  <li>
                                    <i className="fa-solid fa-arrow-down" />{" "}
                                    Download
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-trash" /> Delete
                                  </li>
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="upload-cv-area">
                          <input
                            type="file"
                            name="resume"
                            accept=".pdf, .doc, .docx"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* Career Goals */}
            <div className="candidate-blank-form-detail-edit-info">
              <div className="profile-form-content">
                <div className="input-info-edit-area">
                  <h3>Career Goals</h3>
                  {!isGoal && (
                    <i
                      className="fas fa-pencil-alt"
                      style={{ cursor: "pointer" }}
                      onClick={handleGoalClick}
                    />
                  )}
                </div>
                <div className="accordian-open-close-btn">
                  <i className="fa-solid fa-angle-up" />
                  <i className="fa-solid fa-angle-down" />
                </div>
                {/* <div className="profile-form">
                  <form>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="not-add-detail-info">
                          <h5>You haven’t yet added any Career Goals.</h5>
                          <i className="fa-solid fa-bullseye" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div> */}
              </div>
              {isGoal && (
                <div className="profile-form-content">
                  <div className="profile-form">
                    <form onSubmit={handleGoal}>
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Desired Job Title</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Desired Job Title"
                              name="DesiredJobTitle"
                              value={formData.DesiredJobTitle}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Desired Employment Type</label>
                            <select
                              className="form-select form-control"
                              name="DesiredEmploymentType"
                              value={formData.DesiredEmploymentType}
                              onChange={handleChange}
                            >
                              <option value="">Select Employment Type</option>
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Contract">Contract</option>
                              <option value="Temporary">Temporary</option>
                              <option value="Apprenticeship">
                                Apprenticeship
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Desired Occupation Type</label>
                            <select
                              className="form-select form-control"
                              name="DesiredOccupationType"
                              value={formData.DesiredOccupationType}
                              onChange={handleChange}
                            >
                              <option value="">Select Occupation Type</option>
                              <option value="Skills and Interests">
                                Skills and Interests
                              </option>
                              <option value="Industry">Industry</option>
                              <option value="Healthcare">Healthcare</option>
                              <option value="Technology">Technology</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Other Preferences</label>
                            <div className="currently-working-here">
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="eligibleToWorkInFrance"
                                checked={formData.eligibleToWorkInFrance}
                                onChange={handleChange}
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                I am eligible to work in France
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Minimum Desired Salary (Gross)</label>
                            <div className="form-group">
                              <input
                                type="radio"
                                id="hourly"
                                name="salaryType"
                                value="Hourly"
                                checked={formData.salaryType === "Hourly"}
                                onChange={handleChange}
                              />
                              &nbsp; <label htmlFor="hourly">Hourly</label>
                              &nbsp;{" "}
                              <input
                                type="radio"
                                id="daily"
                                name="salaryType"
                                value="Daily"
                                checked={formData.salaryType === "Daily"}
                                onChange={handleChange}
                              />
                              &nbsp; <label htmlFor="daily">Daily</label>
                              &nbsp;{" "}
                              <input
                                type="radio"
                                id="monthly"
                                name="salaryType"
                                value="Monthly"
                                checked={formData.salaryType === "Monthly"}
                                onChange={handleChange}
                              />
                              &nbsp; <label htmlFor="monthly">Monthly</label>
                              <input
                                type="radio"
                                id="yearly"
                                name="salaryType"
                                value="Yearly"
                                checked={formData.salaryType === "Yearly"}
                                onChange={handleChange}
                              />
                              &nbsp; <label htmlFor="yearly">Yearly</label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="form-group">
                            <select
                              className="form-select form-control"
                              name="salaryCurrency"
                              value={formData.salaryCurrency}
                              onChange={handleChange}
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
                              className="form-control"
                              type="number"
                              name="MinimumDesiredSalary"
                              value={formData.MinimumDesiredSalary}
                              onChange={handleChange}
                              placeholder="Enter your gross minimum desired salary"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Looking for a new job opportunity?</label>
                            <div className="form-group">
                              <input
                                type="radio"
                                name="jobSearchStatus"
                                value="Yes, I need one as soon as possible"
                                checked={
                                  formData.jobSearchStatus ===
                                  "Yes, I need one as soon as possible"
                                }
                                onChange={handleChange}
                              />
                              &nbsp;{" "}
                              <label htmlFor="hourly">
                                Yes, I need one as soon as possible
                              </label>
                              &nbsp;{" "}
                              <input
                                type="radio"
                                name="jobSearchStatus"
                                value="Open to the right opportunity"
                                checked={
                                  formData.jobSearchStatus ===
                                  "Open to the right opportunity"
                                }
                                onChange={handleChange}
                              />
                              &nbsp;{" "}
                              <label htmlFor="daily">
                                Open to the right opportunity
                              </label>
                              &nbsp;{" "}
                              <input
                                type="radio"
                                name="jobSearchStatus"
                                value="No, I'm not looking"
                                checked={
                                  formData.jobSearchStatus ===
                                  "No, I'm not looking"
                                }
                                onChange={handleChange}
                              />
                              &nbsp;{" "}
                              <label htmlFor="monthly">
                                No, I'm not looking
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="save-cancel-btn-info">
                        <button className="default-btn btn">
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="default-btn btn"
                          onClick={handleGoalCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {!isGoal && (
                <div className="user-all-detail-info-main">
                  <div className="user-all-details-info">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label>Desired Job Title</label>
                          <p>{profileData?.career_goals?.DesiredJobTitle}</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label>Desired Employment Type</label>
                          <p>
                            {profileData?.career_goals?.DesiredEmploymentType}
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label>Desired Occupation Type</label>
                          <p>
                            {profileData?.career_goals?.DesiredOccupationType}
                          </p>
                        </div>
                      </div>
                      <div className="divder-line-info" />
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label>Eligible to work in France</label>
                          <p>{profileData.eligibleToWorkInFrance}</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label>Minimum Desired Salary (Gross)</label>
                          <p>
                            €
                            {
                              profileData?.career_goals?.MinimumDesiredSalary
                                ?.amount
                            }{" "}
                            /{" "}
                            {
                              profileData?.career_goals?.MinimumDesiredSalary
                                ?.type
                            }
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label>Looking for a new job opportunity?</label>
                          <p>
                            {profileData?.career_goals?.jobSearchStatus || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* About Role */}
            <div className="candidate-blank-form-detail-edit-info">
              <div className="profile-form-content">
                <div className="input-info-edit-area">
                  <h3>About your role</h3>
                  {!isRole && (
                    <i
                      className="fas fa-pencil-alt"
                      style={{ cursor: "pointer" }}
                      onClick={handleRoleClick}
                    />
                  )}
                </div>
                <div class="accordian-open-close-btn">
                  <i class="fa-solid fa-angle-up"></i>
                  <i class="fa-solid fa-angle-down"></i>
                </div>
                {/* <div className="profile-form">
                  <form>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="not-add-detail-info">
                          <h5>You haven’t yet added any About your role.</h5>
                          <i className="fa-solid fa-users-gear" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div> */}
              </div>
              {isRole && (
                <div className="profile-form-content">
                  <div className="profile-form">
                    <form onSubmit={handleRole}>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Job Title</label>
                            <input
                              className="form-control"
                              type="text"
                              name="jobTitle"
                              placeholder="Job Title"
                              value={formData.jobTitle}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Years of experience</label>
                            <input
                              className="form-control"
                              type="number"
                              name="yearOfExperience"
                              placeholder="Years of Experience"
                              value={formData.yearOfExperience}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Job category</label>
                            <select
                              className="form-select form-control"
                              name="jobCategory"
                              value={formData.jobCategory}
                              onChange={handleChange}
                            >
                              <option value="">Select a category</option>
                              <option value="Digital">Digital</option>
                              <option value="Website Desgin">
                                Website Desgin
                              </option>
                              <option value="Php">Php</option>
                              <option value="Testing">Testing</option>
                              <option value="Team Leader">Team Leader</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="save-cancel-btn-info">
                        <button className="default-btn btn" type="submit">
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          className="default-btn btn"
                          onClick={handleRoleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {!isRole && (
                <div className="user-all-detail-info-main">
                  <div className="user-all-details-info">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label>Job Title</label>
                          <p>{profileData?.aboutRole?.jobTitle}</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label>Years of experience</label>
                          <p>{profileData?.aboutRole?.yearOfExperience}</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label>Job category</label>
                          <p>{profileData?.aboutRole?.jobCategory}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Work Experience */}
            <div className="candidate-blank-form-detail-edit-info">
              <div className="profile-form-content">
                <div className="input-info-edit-area">
                  <h3>Work Experience</h3>
                  {!isExperience && (
                    <i
                      className="fa-solid fa-plus"
                      style={{ cursor: "pointer" }}
                      onClick={handleExperienceClick}
                    />
                  )}
                </div>
                <div className="accordian-open-close-btn">
                  <i className="fa-solid fa-angle-up" />
                  <i className="fa-solid fa-angle-down" />
                </div>
                {/* <div className="profile-form">
                  <form>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="not-add-detail-info">
                          <h5>You haven’t yet added any Work Experience.</h5>
                          <i className="fa-solid fa-briefcase" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div> */}
              </div>
              {isExperience && (
                <div className="profile-form-content">
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
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Position</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Position"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Company Name</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Company Name"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Start Date</label>
                            <input
                              className="form-control"
                              type="date"
                              placeholder="Start Date"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>End Date</label>
                            <input
                              className="form-control"
                              type="date"
                              placeholder="End Date"
                            />
                          </div>
                        </div>
                        <div className="currently-working-here">
                          <input
                            type="checkbox"
                            id="CurrentlyWorking"
                            name="CurrentlyWorking"
                            defaultValue="Currently Working"
                          />
                          <label htmlFor="vehicle1">
                            {" "}
                            I Am Currently Working Here
                          </label>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label>Achievements</label>
                            <textarea
                              className="form-control"
                              placeholder="Write here about your achievements"
                              rows={7}
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Employment Type</label>
                            <select
                              className="form-select form-control"
                              aria-label="Default2 select example"
                            >
                              <option selected>Choose</option>
                              <option value={1}>Development</option>
                              <option value={2}>Information IT</option>
                              <option value={3}>Corporate Job</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Work Location</label>
                            <select
                              className="form-select form-control"
                              aria-label="Default2 select example"
                            >
                              <option selected>Choose</option>
                              <option value={1}>Development</option>
                              <option value={2}>Information IT</option>
                              <option value={3}>Corporate Job</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group-salary">
                            <label>Position Salary</label>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-2">
                          <div className="form-group">
                            <select
                              className="form-select form-control"
                              aria-label="Default2 select example"
                            >
                              <option selected>EUR</option>
                              <option value={1}>Development</option>
                              <option value={2}>Information IT</option>
                              <option value={3}>Corporate Job</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-10 col-md-10">
                          <div className="form-group">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter Salary"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <select
                              className="form-select form-control"
                              aria-label="Default2 select example"
                            >
                              <option selected>Select payroll frequency</option>
                              <option value={1}>Weekly</option>
                              <option value={2}>Monthly</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="save-cancel-btn-info">
                        <button className="default-btn btn">
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="default-btn btn"
                          onClick={handleExperienceCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {!isExperience && (
                <div className="user-all-detail-info-main">
                  <div className="user-all-details-info">
                    <div className="work-exprinace-edit">
                      <i className="fas fa-pencil-alt" />
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Wordpress Designer</label>
                          <p>Feb 2502 - May 2025</p>
                          <p>
                            <i className="fa-regular fa-building" /> Sell India
                            LTD
                          </p>
                          <p>Full-time</p>
                        </div>
                        <div className="divder-line-info" />
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Achievements</label>
                          <p>
                            You're good to go! We’ve transferred your personal
                            details and qualifications from your CV to your
                            profile to save you time. Check it out!
                          </p>
                        </div>
                        <div className="divder-line-info" />
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Salary</label>
                          <p>2025 ₹</p>
                          <label>Payroll frequency</label>
                          <p>Monthly</p>
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
                          <label>Wordpress Designer</label>
                          <p>Feb 2502 - May 2025</p>
                          <p>
                            <i className="fa-regular fa-building" /> Sell India
                            LTD
                          </p>
                          <p>Full-time</p>
                        </div>
                        <div className="divder-line-info" />
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Achievements</label>
                          <p>
                            You're good to go! We’ve transferred your personal
                            details and qualifications from your CV to your
                            profile to save you time. Check it out!
                          </p>
                        </div>
                        <div className="divder-line-info" />
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Salary</label>
                          <p>2025 ₹</p>
                          <label>Payroll frequency</label>
                          <p>Monthly</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Education */}
            <div className="candidate-blank-form-detail-edit-info">
              <div className="profile-form-content">
                <div className="input-info-edit-area">
                  <h3>Education</h3>
                  {!isEducation && (
                    <i
                      className="fa-solid fa-plus"
                      style={{ cursor: "pointer" }}
                      onClick={handleEducationClick}
                    />
                  )}
                </div>
                <div className="accordian-open-close-btn">
                  <i className="fa-solid fa-angle-up" />
                  <i className="fa-solid fa-angle-down" />
                </div>
                {/* <div className="profile-form">
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
                </div> */}
              </div>
              {isEducation && (
                <div className="profile-form-content">
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
                        <button className="default-btn btn">
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="default-btn btn"
                          onClick={handleEducationCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {!isEducation && (
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
              )}
            </div>
            {/* Skills & Technology */}
            <div className="candidate-blank-form-detail-edit-info">
              <div className="profile-form-content">
                <div className="input-info-edit-area">
                  <h3>Skills &amp; Technologies</h3>
                </div>
                <div className="accordian-open-close-btn">
                  <i className="fa-solid fa-angle-up" />
                  <i className="fa-solid fa-angle-down" />
                </div>
                <div className="profile-form">
                  <form>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="enter-skill-info">
                          <div className="form-group">
                            <input
                              className="form-control"
                              type="url"
                              placeholder="Enter Skills"
                            />
                          </div>
                          <div className="skill-btn-info">
                            <a href="#" className="default-btn btn">
                              Add Skills
                            </a>
                          </div>
                        </div>
                        <div className="enter-skill-tag-info">
                          <ul>
                            <li>
                              Technologies <i className="fa-solid fa-xmark" />
                            </li>
                            <li>
                              Skills <i className="fa-solid fa-xmark" />
                            </li>
                            <li>
                              Website Designer{" "}
                              <i className="fa-solid fa-xmark" />
                            </li>
                            <li>
                              Digtial Marketing{" "}
                              <i className="fa-solid fa-xmark" />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* language */}
            <div className="candidate-blank-form-detail-edit-info">
              <div className="profile-form-content">
                <div className="input-info-edit-area">
                  <h3>Languages</h3>
                  {!isLanguage && (
                    <i
                      className="fa-solid fa-plus"
                      style={{ cursor: "pointer" }}
                      onClick={handleLanguageClick}
                    />
                  )}
                </div>
                <div className="accordian-open-close-btn">
                  <i className="fa-solid fa-angle-up" />
                  <i className="fa-solid fa-angle-down" />
                </div>
                {/* <div className="profile-form">
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
                </div> */}
              </div>
              {isLanguage && (
                <div className="profile-form-content">
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
                        <button className="default-btn btn">
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="default-btn btn"
                          onClick={handleLanguageCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {!isLanguage && (
                <div className="user-all-detail-info-main">
                  {profileData?.languages?.map((lang) => (
                    <div className="user-all-details-info">
                      <div className="work-exprinace-edit">
                        <i className="fas fa-pencil-alt" />
                      </div>
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>{lang.language}</label>
                            <p>{lang.proficiency}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="divder-line-info" />
                </div>
              )}
            </div>
            {/* Certificate */}
            <div className="candidate-blank-form-detail-edit-info">
              <div className="profile-form-content">
                <div className="input-info-edit-area">
                  <h3>Certificates</h3>
                  {!isCertificates && (
                    <i
                      className="fa-solid fa-plus"
                      style={{ cursor: "pointer" }}
                      onClick={handleCertificatesClick}
                    />
                  )}
                </div>
                <div className="accordian-open-close-btn">
                  <i className="fa-solid fa-angle-up" />
                  <i className="fa-solid fa-angle-down" />
                </div>

                {isCertificates && (
                  <div className="profile-form">
                    <form onSubmit={handleCertificates}>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Certificate Title</label>
                            <input
                              className="form-control"
                              type="text"
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
                              className="form-control"
                              type="number"
                              placeholder="YYYY"
                              name="issueDate"
                              value={formData.issueDate}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="save-cancel-btn-info">
                        <button className="default-btn btn">
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="default-btn btn"
                          style={{ cursor: "pointer" }}
                          onClick={handleCertificatesCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              {!isCertificates && (
                <div className="user-all-detail-info-main">
                  {profileData?.certificates?.map((certificate, index) => (
                    <div className="user-all-details-info" key={index}>
                      <div
                        className="work-exprinace-edit"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fas fa-pencil-alt" />
                      </div>
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>{certificate.title}</label>
                            <p>
                              Issue Date:{" "}
                              {certificate.issueDate
                                ? new Date(
                                    certificate.issueDate
                                  ).toLocaleDateString()
                                : "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="divder-line-info" />
                </div>
              )}
            </div>
            {/* Links */}
            <div className="candidate-blank-form-detail-edit-info">
              <div className="profile-form-content">
                <div className="input-info-edit-area">
                  <h3>LinkedIn/Portfolio Links</h3>
                  {!isLink && (
                    <i
                      className="fas fa-pencil-alt"
                      style={{ cursor: "pointer" }}
                      onClick={handleLinkClick}
                    />
                  )}
                </div>
                <div className="accordian-open-close-btn">
                  <i className="fa-solid fa-angle-up" />
                  <i className="fa-solid fa-angle-down" />
                </div>
                {/* <div className="profile-form">
                  <form>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="not-add-detail-info">
                          <h5>
                            You haven’t yet added any LinkedIn/Portfolio Links
                          </h5>
                          <i className="fa-solid fa-user" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div> */}
              </div>
              {isLink && (
                <div className="profile-form-content">
                  <div className="profile-form">
                    <form onSubmit={handleLink}>
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Add personal website</label>
                            <input
                              className="form-control"
                              type="url"
                              placeholder="Add personal website"
                              name="portfolio"
                              value={formData.portfolio}
                              onChange={handleChange}
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
                              name="github"
                              value={formData.github}
                              onChange={handleChange}
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
                              name="linkedin"
                              value={formData.linkedin}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="save-cancel-btn-info">
                        <button className="default-btn btn">
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="default-btn btn"
                          onClick={handleLinkCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {!isLink && (
                <div className="user-all-detail-info-main">
                  <div className="user-all-details-info">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Add personal website</label>
                          <p>
                            <a href="#" target="_blank">
                              {profileData?.links?.portfolio}
                            </a>
                          </p>
                        </div>
                      </div>
                      <div className="divder-line-info" />
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>GitHub</label>
                          <p>
                            <a href="#" target="_blank">
                              {profileData?.links?.github}
                            </a>
                          </p>
                        </div>
                      </div>
                      <div className="divder-line-info" />
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>LinkedIn</label>
                          <p>
                            <a href="#" target="_blank">
                              {profileData?.links?.linkedin}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-form-content">
              <h3>Delete Account</h3>
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
                              <h5 className="modal-title" id="exampleModaldlt">
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
                                    Tell us why you would like to delete your
                                    account.
                                  </p>
                                </div>
                                <p>Please select your favorite Web language:</p>
                                <ul>
                                  <li>
                                    <input
                                      type="radio"
                                      id="html"
                                      name="fav_language"
                                      defaultValue="HTML"
                                    />
                                    <label htmlFor="html">
                                      I never got a job interview
                                    </label>
                                  </li>
                                  <li>
                                    <input
                                      type="radio"
                                      id="css"
                                      name="fav_language"
                                      defaultValue="CSS"
                                    />
                                    <label htmlFor="css">
                                      I have a privacy concern
                                    </label>
                                  </li>
                                  <li>
                                    <input
                                      type="radio"
                                      id="javascript"
                                      name="fav_language"
                                      defaultValue="JavaScript"
                                    />
                                    <label htmlFor="javascript">
                                      I have a duplicate account
                                    </label>
                                  </li>
                                  <li>
                                    <input
                                      type="radio"
                                      id="javascript"
                                      name="fav_language"
                                      defaultValue="JavaScript"
                                    />
                                    <label htmlFor="javascript">
                                      I'm getting too many emails
                                    </label>
                                  </li>
                                  <li>
                                    <input
                                      type="radio"
                                      id="javascript"
                                      name="fav_language"
                                      defaultValue="JavaScript"
                                    />
                                    <label htmlFor="javascript">
                                      Other reason
                                    </label>
                                  </li>
                                </ul>
                                <div className="form-group">
                                  <label>Comments</label>
                                  <textarea
                                    className="form-control"
                                    placeholder="write the reason here...."
                                    rows={3}
                                    defaultValue={""}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="delete-account-popup-btn modal-footer">
                              <button type="button" className="default-btn btn">
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
            {/*End My Profile Area*/}
            <div className="copy-right-area bg-f0f4fc">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="copyright-left-content">
                    <p>
                      {" "}
                      <span className="copy">© </span>
                      <span id="year" />
                      <span className="template-name">
                        {" "}
                        Connect Work.ma{" "}
                      </span>{" "}
                      All Rights Reserved
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
      </div>
    </>
  );
}

export default CandidateProfile;
