import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import companyLogo from "../../src/images/images1.png";
function JobDetails() {
  const location = useLocation();
  const userRole = localStorage.getItem("user_role");
  const jobStatus = location.state?.status;

  console.log("Job Status:", jobStatus);
  const token = localStorage.getItem("token"); // 🔹 assuming JWT is stored here
  const { id } = useParams(); // ✅ Get job ID from URL
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(null);
  const fileInputRef = useRef(null);
  const [jobId, setJobId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [resumeList, setResumeList] = useState([]);
  const [coverLetterList, setCoverLetterList] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCustomFile, setSelectedCustomFile] = useState(null);
  const [job, setJob] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");

  const [loading, setLoading] = useState(true);
  console.log(id);
  const fetchJobDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getJobById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJob(res.data?.data || res.data); // Adjust according to your API response
      console.log(res);
      setLinkUrl(res?.data?.link);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);
  console.log(linkUrl);
  const handleSaveJob = async (jobId) => {
    try {
      // 🧠 Step 1: Check if user is logged in
      if (!token) {
        toast.warning("⚠️ Please login first to save jobs!");
        // optionally redirect to login page:
        // navigate("/login");
        return;
      }

      // 🧠 Step 2: Call API
      const res = await axios.post(
        `${API_BASE_URL}savedJob`,
        { job_id: jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ API Response:", res.data);

      // 🧠 Step 3: Handle response
      if (res.data.success) {
        const { message } = res.data;

        // Optional: Optimistic UI update
        // setJobList((prevJobs) =>
        //   prevJobs.map((job) =>
        //     job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        //   )
        // );

        fetchJobDetails();

        if (message.toLowerCase().includes("saved")) {
          toast.success(message + " ❤️");
        } else if (message.toLowerCase().includes("unsaved")) {
          toast.info(message + " 💔");
        } else {
          toast.success(message);
        }
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("❌ Save/Unsave error:", err);
      toast.error(err.response?.data?.message || "Server error. Try again!");
    }
  };
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}candidate/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Resume Data:-", res.data.profile);
        const profile = res.data.profile;
        setResumeList(profile.resumeUrls || []);
        setCoverLetterList(profile.coverLetter || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchResume();
  }, []);
  const handleSelect = (type, id = null) => {
    setSelectedType(type);
    setSelectedId(id);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCustomFile(file);
      setSelectedType("custom");
      setSelectedId(null);
    }
  };
  const getFileName = (url) => {
    return url?.split("/").pop();
  };
  const handleLinkClick = (e) => {
    e.preventDefault(); // prevent navigation
    fileInputRef.current.click(); // open file dialog
  };
  const handleSaveJob1 = async (jobId) => {
    try {
      // 🧠 Step 1: Check if user is logged in
      if (!token) {
        toast.warning("⚠️ Please login first to save jobs!");
        // optionally redirect to login page:
        // navigate("/login");
        return;
      }

      // 🧠 Step 2: Call API
      const res = await axios.post(
        `${API_BASE_URL}savedJob`,
        { job_id: jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ API Response:", res.data);

      // 🧠 Step 3: Handle response
      if (res.data.success) {
        const { message } = res.data;

        // Optional: Optimistic UI update
        // setJobList((prevJobs) =>
        //   prevJobs.map((job) =>
        //     job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        //   )
        // );

        fetchJobDetails();

        if (message.toLowerCase().includes("saved")) {
          toast.success(message + " ❤️");
        } else if (message.toLowerCase().includes("unsaved")) {
          toast.info(message + " 💔");
        } else {
          toast.success(message);
        }
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("❌ Save/Unsave error:", err);
      toast.error(err.response?.data?.message || "Server error. Try again!");
    }
  };
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e) => {
    e.preventDefault(); // stop opening the link
    if (!linkUrl) return;

    try {
      await navigator.clipboard.writeText(linkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };
  const handleApplyJob = async () => {
    if (!jobId) {
      console.error("❌ jobId is missing");
      return;
    }

    setIsApplying(true); // 🔥 Start loader

    const formData = new FormData();

    if (selectedType === "resume") {
      formData.append("cv", selectedId);
    }

    if (selectedType === "cover") {
      formData.append("coverLetter", selectedId);
    }

    if (selectedType === "custom") {
      formData.append("customResume", fileInputRef.current.files[0]);
    }

    formData.append("jobId", jobId);

    try {
      const res = await axios.post(`${API_BASE_URL}applyJob`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchJobDetails();
      toast.success(res.data.message || "Applied successfully!");

      const modal = document.getElementById("exampleModal");
      if (modal) {
        const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
        bootstrapModal?.hide();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsApplying(false); // 🔥 Stop loader
    }
  };
  const handleSaveJob2 = async (jobId) => {
    try {
      // 🧠 Step 1: Check if user is logged in
      if (!token) {
        toast.warning("⚠️ Please login first to save jobs!");
        // optionally redirect to login page:
        // navigate("/login");
        return;
      }

      // 🧠 Step 2: Call API
      const res = await axios.post(
        `${API_BASE_URL}savedJob`,
        { job_id: jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ API Response:", res.data);

      // 🧠 Step 3: Handle response
      if (res.data.success) {
        const { message } = res.data;

        // Optional: Optimistic UI update
        // setJobList((prevJobs) =>
        //   prevJobs.map((job) =>
        //     job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        //   )
        // );

        fetchJobDetails();

        if (message.toLowerCase().includes("saved")) {
          toast.success(message + " ❤️");
        } else if (message.toLowerCase().includes("unsaved")) {
          toast.info(message + " 💔");
        } else {
          toast.success(message);
        }
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("❌ Save/Unsave error:", err);
      toast.error(err.response?.data?.message || "Server error. Try again!");
    }
  };
  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // Optionally decode twice if double-encoded
  const decodedHtml = decodeHtml(
    decodeHtml(job?.jobDetails?.jobDescription || "")
  );
  function decodeHtml1(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // Double decode for escaped HTML
  const decodedHtml1 = decodeHtml1(
    decodeHtml1(job?.jobDetails?.companyId?.aboutCompany || "")
  );
  console.log(job?.jobDetails);
  return (
    <>
      <ToastContainer />
      <section className="job-details-main-info-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="job-details-top-info-area">
                <div className="job-name-company-name">
                  <div className="job-details-job-name">
                    <h2>{job?.jobTitle}</h2>
                    <p>
                      <strong>Company Name: </strong>
                      <Link
                        to={{
                          pathname: "/companies-details",
                        }}
                        state={{ companyId: job?.jobDetails?.companyId?._id }}
                      >
                        {job?.jobDetails?.companyId?.brandName}
                      </Link>
                    </p>
                    <p>
                      <strong>Posted by: </strong>
                    </p>
                  </div>
                  <div className="job-name-company-logo">
                    <img
                      crossOrigin="anonymous"
                      src={
                        job?.jobDetails?.companyId?.logo
                          ? `${API_IMAGE_URL}${job.jobDetails.companyId.logo}`
                          : companyLogo
                      }
                      alt={
                        job?.jobDetails?.companyId?.brandName || "Company Logo"
                      }
                    />

                    {/* <img
                      crossorigin="anonymous"
                      src={`${API_IMAGE_URL}${job?.companyId?.logo}`}
                      alt="logo"
                    /> */}
                  </div>
                </div>
                <div className="job-apply-link-save-btn-info">
                  <div className="job-save-btn">
                    <ul>
                      <li style={{ position: "relative" }}>
                        <a
                          href="#"
                          onClick={handleCopy}
                          style={{ cursor: "pointer" }}
                          title="Copy link"
                        >
                          <i className="fa-solid fa-link" />
                        </a>

                        {/* Small "Copied!" text that fades in/out */}
                        {copied && (
                          <span
                            style={{
                              position: "absolute",
                              top: "-20px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              backgroundColor: "#333",
                              color: "#fff",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              opacity: 0.9,
                            }}
                          >
                            Copied!
                          </span>
                        )}
                      </li>

                      <li>
                        <i
                          className={`fa-${
                            job?.jobDetails?.isSaved ? "solid" : "regular"
                          } fa-heart`}
                          style={{
                            cursor: "pointer",
                            color: job?.jobDetails?.isSaved
                              ? "#fb761a"
                              : "#fff",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveJob2(job?.jobDetails?._id);
                          }}
                        />
                      </li>
                      <li>
                        <a
                          href={
                            job?.jobDetails?.companyId?.links?.linkedin
                              ? job?.jobDetails?.companyId?.links?.linkedin
                              : "https://www.linkedin.com/login"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                      </li>

                      {/* Facebook */}
                      <li>
                        <a
                          href={
                            job?.jobDetails?.companyId?.links?.facebook
                              ? job?.jobDetails?.companyId?.links?.facebook
                              : "https://www.facebook.com/"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-facebook-f"></i>
                        </a>
                      </li>

                      {/* Twitter / X */}
                      <li>
                        <a
                          href={
                            job?.jobDetails?.companyId?.links?.twitter
                              ? job?.jobDetails?.companyId?.links?.twitter
                              : "https://twitter.com/"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-x-twitter"></i>
                        </a>
                      </li>

                      {/* Instagram */}
                      <li>
                        <a
                          href={
                            job?.jobDetails?.companyId?.links?.instagram
                              ? job?.jobDetails?.companyId?.links?.instagram
                              : "https://www.instagram.com/"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="job-apply-btn edit-popup-modal">
                    {job?.jobDetails?.isApplied ? (
                      <div className="default-btn btn">
                        {job?.jobDetails?.applicationStatus}
                      </div>
                    ) : (
                      <a
                        href="#"
                        className="default-btn btn"
                        onClick={(e) => {
                          e.preventDefault();

                          // 🔥 If not logged in, redirect to login page
                          if (userRole !== "JobSeeker") {
                            navigate("/login");
                            return;
                          }

                          // 🔥 If logged in → set jobId
                          setJobId(job?.jobDetails?._id);

                          // 🔥 Open Apply Modal (correct way)
                          const modalEl =
                            document.getElementById("exampleModal");
                          if (modalEl) {
                            const modalInstance = new window.bootstrap.Modal(
                              modalEl
                            );
                            modalInstance.show();
                          }
                        }}
                      >
                        Apply Now
                      </a>
                    )}
                    {/* {jobStatus === "Applied" ? (
                      <a href="#" className="default-btn btn">
                        {jobStatus}
                      </a>
                    ) : (
                      <a
                        href="#"
                        className="default-btn btn"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => setJobId(job._id)} // ✅ set job ID here
                      >
                        Apply Now
                      </a>
                    )} */}
                  </div>
                </div>
                <div className="custom-resume-cover-letter-info">
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
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Apply now
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>
                        <div class="modal-body">
                          <div className="job-apply-defult-resume-custom-resume">
                            <div className="job-apply-custom-resume-info-area">
                              {resumeList.map((resume) => {
                                const fileName = getFileName(resume.url);

                                return (
                                  <div
                                    key={resume._id}
                                    className={
                                      "job-apply-custom-resume-info " +
                                      (selectedType === "resume" &&
                                      selectedId === resume._id
                                        ? "active"
                                        : "")
                                    }
                                    onClick={() =>
                                      handleSelect("resume", resume._id)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    {/* Left side: file icon + filename */}
                                    <span className="file-name-text">
                                      <i className="fa-solid fa-file"></i>
                                      {fileName}
                                    </span>

                                    {/* Right side: check icon */}
                                    {selectedType === "resume" &&
                                      selectedId === resume._id && (
                                        <i className="fa-solid fa-circle-check selected-check-icon"></i>
                                      )}
                                  </div>
                                );
                              })}
                            </div>

                            <div className="defult-resume-custom-resume-divder-line">
                              <h4>or</h4>
                            </div>

                            <div className="job-apply-custom-resume-info-area">
                              {coverLetterList.map((cover) => {
                                const fileName = getFileName(cover.url);

                                return (
                                  <div
                                    key={cover._id}
                                    className={
                                      "job-apply-custom-resume-info " +
                                      (selectedType === "cover" &&
                                      selectedId === cover._id
                                        ? "active"
                                        : "")
                                    }
                                    onClick={() =>
                                      handleSelect("cover", cover._id)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <span className="file-name-text">
                                      <i className="fa-solid fa-file"></i>
                                      {fileName}
                                    </span>

                                    {selectedType === "cover" &&
                                      selectedId === cover._id && (
                                        <i className="fa-solid fa-circle-check selected-check-icon"></i>
                                      )}
                                  </div>
                                );
                              })}
                            </div>

                            <div className="defult-resume-custom-resume-divder-line">
                              <h4>or</h4>
                            </div>

                            <div className="job-apply-custom-resume-info-area">
                              <div className="job-apply-custom-resume-info-area">
                                {selectedCustomFile && (
                                  <div
                                    className={
                                      "job-apply-custom-resume-info " +
                                      (selectedType === "custom"
                                        ? "active"
                                        : "")
                                    }
                                    onClick={() =>
                                      selectedCustomFile &&
                                      handleSelect("custom")
                                    }
                                  >
                                    <span className="file-name-text">
                                      <i className="fa-solid fa-file"></i>
                                      {selectedCustomFile.name}
                                    </span>

                                    {selectedType === "custom" && (
                                      <i className="fa-solid fa-circle-check selected-check-icon"></i>
                                    )}
                                  </div>
                                )}

                                <div className="job-apply-custom-resume-cover-letter-btn">
                                  <a
                                    href="#"
                                    className="default-btn btn"
                                    onClick={handleLinkClick}
                                  >
                                    Custom resume with cover letter
                                  </a>

                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                    style={{ display: "none" }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="defult-resume-custom-resume-divder"></div>

                            <div className="job-apply-defult-resume-btn">
                              <button
                                className="default-btn btn w-100"
                                onClick={handleApplyJob}
                                disabled={isApplying} // 🔥 Disable during API call
                              >
                                {isApplying ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Applying...
                                  </>
                                ) : (
                                  "Apply Now"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="job-details-tag-info-area">
                <div className="job-details-tag-main-area">
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-location-dot" />
                      Place
                    </h4>
                    <Link to="/jobs">
                      <p className="active_link">
                        {job?.jobDetails?.city ||
                          job?.jobDetails?.companyId?.city ||
                          "N/A"}
                      </p>
                    </Link>
                  </div>
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-calendar-days" />
                      Publication date
                    </h4>
                    <p> {moment(job?.jobDetails?.createdAt).fromNow()}</p>
                  </div>
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-signal" />
                      Experience level
                    </h4>
                    <Link to="/jobs">
                      <p className="active_link">
                        {job?.jobDetails?.minimumLevel || "N/A"}
                      </p>
                    </Link>
                  </div>
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-user" />
                      Type of contract
                    </h4>
                    <p className="active_link">
                      {job?.jobDetails?.employmentType || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="job-details-spaceline" />
                <div className="job-details-tag-main-area">
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-gear" /> Job category
                    </h4>
                    <Link to="/jobs">
                      <p className="active_link">
                        {job?.jobDetails?.jobCategory?.name || "N/A"}
                      </p>
                    </Link>
                  </div>
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-briefcase" />
                      Openings
                    </h4>
                    <p>{job?.jobDetails?.availablePosts || "N/A"}</p>
                  </div>

                  {(userRole === "Recruiter" || userRole === "Company") && (
                    <div className="job-details-tag-box">
                      <h4>
                        <i className="fa-solid fa-file" />
                        Applicants
                      </h4>
                      <p>0</p>
                    </div>
                  )}
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-money-bill" />
                      Salary
                    </h4>
                    <p>
                      ${job?.jobDetails?.privatJobDetails?.minSalary}-$
                      {job?.jobDetails?.privatJobDetails?.maxSalary}{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="job-details-role-company-discription">
                <h5>About the role</h5>
                <p>{job?.jobDetails?.shortDescription}</p>

                <h5>Company Description</h5>
                <div dangerouslySetInnerHTML={{ __html: decodedHtml1 }} />
              </div>
              <div className="job-details-job-description">
                <h5>Job Description</h5>
                <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />
              </div>
              {/* <div className="job-details-job-qualifications">
                <h5>Required Qualifications</h5>
                <p>
                  You are at BAC + 3 to BAC + 5 level (Engineering schools, BTS,
                  DUT, DESS, Master).
                </p>
                <p>Your level of English is fluent, both spoken and written.</p>
                <p>
                  You like to stay up to date with new technological
                  developments, and practice regular monitoring.
                </p>
                <p>
                  You have significant experience (at least 3 years) in the
                  technologies of our stack: AWS, Snowflake, python, spark
                  scala, SQL.
                </p>
              </div> */}
              {/* <div className="job-details-job-qualifications">
                <h5>Required Skills</h5>
                <p>
                  Proficiency in front-end technologies (HTML, CSS, JavaScript,
                  React, Angular, or Vue.js).
                </p>
                <p>
                  Experience with back-end development using Node.js, Python,
                  PHP, or Java.
                </p>
                <p>
                  Familiarity with SQL and NoSQL databases (PostgreSQL, MySQL,
                  MongoDB, etc.).
                </p>
                <p>Experience with cloud platforms (AWS, GCP, or Azure).</p>
                <p>
                  Proficiency in version control systems (Git, GitHub, GitLab,
                  etc.).
                </p>
              </div> */}
              <div className="job-details-related-tags">
                <h5>Related Tags</h5>
                {job?.jobDetails?.tags && job?.jobDetails?.tags.length > 0 ? (
                  <ul>
                    {job?.jobDetails?.tags.map((tag, index) => (
                      <li key={index}>{tag}</li> // ✅ dynamically render tag
                    ))}
                  </ul>
                ) : (
                  <p>No related tags found.</p> // ✅ fallback message
                )}
              </div>

              <div className="summary-offer-info-area">
                <div className="summary-offer-post-details">
                  <div className="summary-offer-job-post">
                    <h4>
                      <img
                        crossorigin="anonymous"
                        src={
                          job?.jobDetails?.companyId?.logo
                            ? `${API_IMAGE_URL}${job?.jobDetails?.companyId?.logo}`
                            : companyLogo
                        }
                        alt="logo"
                      />
                      {job?.jobDetails?.companyId?.brandName ||
                        "Unknown Company"}
                    </h4>
                  </div>
                  <div className="summary-offer-save-job">
                    <i
                      className={`fa-${
                        job?.jobDetails?.isSaved ? "solid" : "regular"
                      } fa-heart`}
                      style={{
                        cursor: "pointer",
                        color: job?.jobDetails?.isSaved ? "red" : "#888",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSaveJob1(job?.jobDetails?._id);
                      }}
                    />
                  </div>
                </div>

                <div className="summary-offer-job-short-detail">
                  <h4>
                    {job?.jobDetails?.jobTitle || "Job Title Not Provided"}
                  </h4>
                  <p>
                    {job?.jobDetails?.shortDescription ||
                      "Location not specified"}
                  </p>
                  <ul>
                    <li>
                      <i className="fa-solid fa-location-dot" />{" "}
                      {job?.jobDetails?.companyId?.city ||
                        "Location not specified"}
                    </li>
                    <li>
                      <i className="fa-regular fa-calendar" />{" "}
                      {job?.jobDetails?.createdAt
                        ? moment(job?.jobDetails?.createdAt).fromNow()
                        : "Recently posted"}
                    </li>
                    <li>
                      <i className="fa-regular fa-file" />{" "}
                      {job?.jobDetails?.jobCategory?.name ||
                        "Experience not specified"}
                    </li>
                    <li>
                      <i className="fa-regular fa-user" />{" "}
                      {job?.jobDetails?.employmentType || "Full time"}
                    </li>
                  </ul>

                  <div className="summary-offer-apply-report-btn edit-popup-modal">
                    {job?.jobDetails?.isApplied ? (
                      <div className="default-btn btn">
                        {job?.jobDetails?.applicationStatus}
                      </div>
                    ) : (
                      <a
                        href="#"
                        className="default-btn btn"
                        onClick={(e) => {
                          e.preventDefault();

                          // 🔥 If not logged in, redirect to login page
                          if (userRole !== "JobSeeker") {
                            navigate("/login");
                            return;
                          }

                          // 🔥 If logged in → set jobId
                          setJobId(job?.jobDetails?._id);

                          // 🔥 Open Apply Modal (correct way)
                          const modalEl =
                            document.getElementById("exampleModal");
                          if (modalEl) {
                            const modalInstance = new window.bootstrap.Modal(
                              modalEl
                            );
                            modalInstance.show();
                          }
                        }}
                      >
                        Apply Now
                      </a>
                    )}
                    <a href="#" className="report-btn-info">
                      Report this job
                    </a>
                  </div>
                </div>
              </div>

              {job?.similarJobs?.length > 0 && (
                <div className="similar-jobs-section">
                  <h5>Other job posts you may be interested in</h5>
                  {job.similarJobs.map((item) => (
                    <Link
                      key={item._id}
                      to={`/job-details/${item._id}`} // Pass ID in URL
                      className="job-link"
                    >
                      <div className="available-job-posts-box">
                        {/* Company Name & Logo */}
                        <div className="available-job-company-name-save-job">
                          <div className="available-job-company-name">
                            <h4>
                              <img
                                crossOrigin="anonymous"
                                src={
                                  item?.companyId?.logo
                                    ? `${API_IMAGE_URL}${item.companyId.logo}`
                                    : companyLogo
                                }
                                alt={
                                  item?.companyId?.brandName || "Company Logo"
                                }
                              />

                              {item.companyId?.brandName || "Unknown Company"}
                            </h4>
                          </div>

                          {/* Save Job & Social Icons */}
                          <div className="available-job-save-job">
                            <i
                              className={`fa-${
                                item.isSaved ? "solid" : "regular"
                              } fa-heart`}
                              style={{
                                cursor: "pointer",
                                color: item.isSaved ? "#fb761a" : "#fff",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSaveJob(item._id);
                              }}
                            />
                            <a
                              href="https://www.linkedin.com/login"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fa-brands fa-linkedin-in" />
                            </a>
                            <a
                              href="https://www.facebook.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fa-brands fa-facebook-f" />
                            </a>
                            <a
                              href="https://web.whatsapp.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fa-brands fa-whatsapp" />
                            </a>
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="available-job-type-details">
                          <h5>{item.jobTitle || "Job Title Not Provided"}</h5>
                          <p>
                            {item.shortDescription ||
                              "No description available"}
                          </p>
                          <ul>
                            <li>
                              <i className="fa-regular fa-calendar" />{" "}
                              {item.createdAt
                                ? moment(item.createdAt).fromNow()
                                : "Recently posted"}
                            </li>
                            <li>
                              <i className="fa-regular fa-file" />{" "}
                              {item?.jobCategory?.name ||
                                "Category not specified"}
                            </li>
                            <li>
                              <i className="fa-regular fa-user" />{" "}
                              {item?.employmentType || "Full Time"}
                            </li>
                            <li>
                              <i className="fa-solid fa-location-dot" />{" "}
                              {item.companyId?.city || "Location not specified"}
                            </li>
                            <li>
                              <i className="fa-solid fa-users" /> Available:{" "}
                              {item?.availablePosts || 0}
                            </li>
                          </ul>
                        </div>

                        {/* Apply Button */}
                        <div className="available-job-type-apply-btn">
                          <Link
                            to={`/job-details/${item._id}`}
                            className="apply-btn-info default-btn btn"
                          >
                            {item?.isApplied ? (
                              <button className="default-btn btn">
                                {item?.applicationStatus}
                              </button>
                            ) : (
                              <a
                                href="#"
                                className="default-btn btn"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => setJobId(item._id)} // ✅ set job ID here
                              >
                                Apply Now
                              </a>
                            )}
                          </Link>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default JobDetails;
