import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "../utils/axiosInstance"

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
  const handleCopy = async (e, url) => {
    e.preventDefault();

    if (!url) {
      toast.error("Link not available yet");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Copy failed");
    }
  };
  const isSelectionMade = () => {
    return (
      (selectedType === "resume" && selectedId) ||
      (selectedType === "cover" && selectedId) ||
      (selectedType === "custom" && selectedCustomFile)
    );
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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
      const file = fileInputRef.current?.files?.[0];

      // ✅ FILE REQUIRED
      if (!file) {
        toast.error("Please select a resume file.", {
          autoClose: 2000,
          theme: "colored",
        });
        setIsApplying(false);
        return;
      }

      // ✅ FILE SIZE CHECK (THIS FIXES YOUR ISSUE)
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Uploaded file is too large. Max size is 2MB.", {
          autoClose: 2000,
          theme: "colored",
        });
        setIsApplying(false);
        return; // ⛔ STOP — DO NOT HIT API
      }

      formData.append("customResume", file);
    }

    formData.append("jobId", jobId);

    try {
      const res = await axios.post(`${API_BASE_URL}applyJob`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message || "Applied successfully!");
      if (id) {
        fetchJobDetails();
      }

      const modal = document.getElementById("exampleModal");
      if (modal) {
        const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
        bootstrapModal?.hide();
      }
    } catch (error) {
      console.error("Apply job error:", error);

      // 🔒 BACKUP SAFETY (in case proxy still throws 413)
      if (error?.response?.status === 413 || error?.message?.includes("413")) {
        toast.error("Uploaded file is too large. Max size is 2MB.", {
          autoClose: 2000,
          theme: "colored",
        });
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsApplying(false); // 🔥 Stop loader
    }
  };

  // const handleApplyJob = async () => {
  //   if (!jobId) {
  //     console.error("❌ jobId is missing");
  //     return;
  //   }

  //   setIsApplying(true); // 🔥 Start loader

  //   const formData = new FormData();

  //   if (selectedType === "resume") {
  //     formData.append("cv", selectedId);
  //   }

  //   if (selectedType === "cover") {
  //     formData.append("coverLetter", selectedId);
  //   }

  //   if (selectedType === "custom") {
  //     formData.append("customResume", fileInputRef.current.files[0]);
  //   }

  //   formData.append("jobId", jobId);

  //   try {
  //     const res = await axios.post(`${API_BASE_URL}applyJob`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     fetchJobDetails();
  //     toast.success(res.data.message || "Applied successfully!");

  //     const modal = document.getElementById("exampleModal");
  //     if (modal) {
  //       const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
  //       bootstrapModal?.hide();
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Something went wrong!");
  //   } finally {
  //     setIsApplying(false); // 🔥 Stop loader
  //   }
  // };
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

        if (id) {
          fetchJobDetails();
        }

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
                          onClick={(e) => handleCopy(e, linkUrl)}
                          style={{
                            cursor: linkUrl ? "pointer" : "not-allowed",
                          }}
                          title={linkUrl ? "Copy link" : "Link not available"}
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
                  </div>
                </div>
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
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Apply now
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                      {/* NOTE: use className, not class */}
                      <div className="modal-body">
                        <div className="job-apply-defult-resume-custom-resume">
                          {/* RESUME LIST - inline hide */}
                          <div
                            className="job-apply-custom-resume-info-area"
                            style={{
                              display:
                                Array.isArray(resumeList) &&
                                resumeList.length > 0
                                  ? "block"
                                  : "none",
                            }}
                          >
                            {Array.isArray(resumeList) &&
                              resumeList.map((resume) => {
                                const fileName = getFileName(resume.url);
                                return (
                                  <div
                                    key={resume._id}
                                    className={
                                      "job-apply-custom-resume-info " +
                                      (selectedType === "resume" &&
                                      selectedId === resume.url
                                        ? "active"
                                        : "")
                                    }
                                    onClick={() =>
                                      handleSelect("resume", resume.url)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <span className="file-name-text">
                                      <i className="fa-solid fa-file" />{" "}
                                      {fileName}
                                    </span>

                                    {selectedType === "resume" &&
                                      selectedId === resume.url && (
                                        <i className="fa-solid fa-circle-check selected-check-icon" />
                                      )}
                                  </div>
                                );
                              })}
                          </div>

                          {/* OR DIVIDER for resume - inline hide */}
                          <div
                            className="defult-resume-custom-resume-divder-line"
                            style={{
                              display:
                                Array.isArray(resumeList) &&
                                resumeList.length > 0
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <h4>or</h4>
                          </div>

                          {/* COVER LETTER LIST - inline hide */}
                          <div
                            className="job-apply-custom-resume-info-area"
                            style={{
                              display:
                                Array.isArray(coverLetterList) &&
                                coverLetterList.length > 0
                                  ? "block"
                                  : "none",
                            }}
                          >
                            {Array.isArray(coverLetterList) &&
                              coverLetterList.map((cover) => {
                                const fileName = getFileName(cover.url);
                                return (
                                  <div
                                    key={cover._id}
                                    className={
                                      "job-apply-custom-resume-info " +
                                      (selectedType === "cover" &&
                                      selectedId === cover.url
                                        ? "active"
                                        : "")
                                    }
                                    onClick={() =>
                                      handleSelect("cover", cover.url)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <span className="file-name-text">
                                      <i className="fa-solid fa-file" />{" "}
                                      {fileName}
                                    </span>

                                    {selectedType === "cover" &&
                                      selectedId === cover.url && (
                                        <i className="fa-solid fa-circle-check selected-check-icon" />
                                      )}
                                  </div>
                                );
                              })}
                          </div>

                          {/* OR DIVIDER for cover - inline hide */}
                          <div
                            className="defult-resume-custom-resume-divder-line"
                            style={{
                              display:
                                Array.isArray(coverLetterList) &&
                                coverLetterList.length > 0
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <h4>or</h4>
                          </div>

                          {/* CUSTOM FILE SECTION (show only if user uploaded file or always show upload button) */}
                          <div
                            className="job-apply-custom-resume-info-area"
                            style={{ display: "block" }}
                          >
                            {/* Show selected custom file if exists */}
                            <div
                              style={{
                                display: selectedCustomFile ? "block" : "none",
                              }}
                            >
                              <div
                                className={
                                  "job-apply-custom-resume-info " +
                                  (selectedType === "custom" ? "active" : "")
                                }
                                onClick={() =>
                                  selectedCustomFile && handleSelect("custom")
                                }
                                style={{
                                  cursor: selectedCustomFile
                                    ? "pointer"
                                    : "default",
                                }}
                              >
                                <span className="file-name-text">
                                  <i className="fa-solid fa-file" />{" "}
                                  {selectedCustomFile
                                    ? selectedCustomFile.name
                                    : ""}
                                </span>

                                {selectedType === "custom" && (
                                  <i className="fa-solid fa-circle-check selected-check-icon" />
                                )}
                              </div>
                            </div>

                            {/* Upload Button — prevent default and open file input */}
                            <div
                              className="job-apply-custom-resume-cover-letter-btn"
                              style={{ marginTop: 12 }}
                            >
                              <a
                                href="#"
                                className="default-btn btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // ensure fileInputRef.current exists
                                  if (fileInputRef && fileInputRef.current)
                                    fileInputRef.current.click();
                                }}
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

                          {/* Divider before apply button (always keep in DOM) */}
                          <div
                            className="defult-resume-custom-resume-divder"
                            style={{ marginTop: 16 }}
                          />

                          {/* APPLY BUTTON - always present */}
                          <div
                            className="job-apply-defult-resume-btn"
                            style={{ marginTop: 12 }}
                          >
                            <button
                              className="default-btn btn w-100"
                              onClick={handleApplyJob}
                              disabled={isApplying || !isSelectionMade()}
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
                      </div>{" "}
                      {/* .modal-body */}
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

                    <p className="active_link">
                      {Array.isArray(job?.jobDetails?.city) &&
                      job.jobDetails.city.length > 0
                        ? job.jobDetails.city.join(", ")
                        : job?.jobDetails?.companyId?.city || "N/A"}
                    </p>
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
                        {job?.jobDetails?.minimumLevel?.name || "N/A"}
                      </p>
                    </Link>
                  </div>
                  <div className="job-details-tag-box">
                    <h4>
                      <i className="fa-solid fa-user" />
                      Type of contract
                    </h4>
                    <p className="active_link">
                      {job?.jobDetails?.employmentType?.name || "N/A"}
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
                      {job?.jobDetails?.employmentType?.name || "Full time"}
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
                <div className="similar-jobs-section mt-3">
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
                              {item?.employmentType?.name || "Full Time"}
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
                          {item?.isApplied ? (
                            <button className="default-btn btn">
                              {item?.applicationStatus}
                            </button>
                          ) : (
                            <button
                              className="default-btn btn"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                              onClick={() => setJobId(item._id)}
                            >
                              Apply Now
                            </button>
                          )}
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
