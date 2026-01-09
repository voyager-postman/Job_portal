import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "../Services/axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";

function CompanyDetailsPage() {
  const location = useLocation();
  const token = localStorage.getItem("token"); // 🔹 assuming JWT is stored here
  const fileInputRef = useRef(null);
  const [jobId, setJobId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [resumeList, setResumeList] = useState([]);

  const [coverLetterList, setCoverLetterList] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCustomFile, setSelectedCustomFile] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { companyId } = location.state || {}; // 👈 receive the ID here
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedJobId, setCopiedJobId] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const getCompanyDetails = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}GetCompanyDetails/${companyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompany(res?.data?.company);
      console.log(res.data?.company);
    } catch (error) {
      console.error("Error fetching company details:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (companyId) getCompanyDetails();
  }, [companyId]);
  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // Optionally decode twice if double-encoded
  const decodedHtml = decodeHtml(decodeHtml(company?.aboutCompany || ""));
  function decodeHtml1(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
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

  // Double decode for escaped HTML
  const decodedHtml1 = decodeHtml1(decodeHtml1(company?.careerDetail || ""));
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

        if (companyId) getCompanyDetails();
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
  const handleLinkClick = (e) => {
    e.preventDefault(); // prevent navigation
    fileInputRef.current.click(); // open file dialog
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
      if (companyId) getCompanyDetails();

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
  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // ✅ Decode the careerDetail content
  const decodedCareerDetail = decodeHtml(
    decodeHtml(company?.careerDetail || "")
  );
  const handleCopy = async (e, linkUrl, jobId) => {
    console.log(linkUrl);
    e.preventDefault();

    // ❌ No link case
    if (!linkUrl) {
      toast.error("Link not available", {
        autoClose: 1500,
        theme: "colored",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(linkUrl);
      setCopiedJobId(jobId);

      // reset after 2 sec
      setTimeout(() => setCopiedJobId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="company-detail-info-area">
        <div className="container">
          <div className="row">
            <div className="company-img-short-detail">
              <div className="company-img-info">
                {/* <img src="assets/images/company/company-img-1.jpg" /> */}
                <img
                  crossorigin="anonymous"
                  src={
                    company?.coverPhoto
                      ? `${API_IMAGE_URL}${company.coverPhoto}` // Replace API_IMAGE_URL with your base URL
                      : "assets/images/company/company-img-1.jpg" // default image
                  }
                  alt={company?.name || "Company cover photo"}
                />
              </div>
              <div className="company-short-detail-info">
                <div className="company-short-detail-img">
                  <img
                    crossorigin="anonymous"
                    src={
                      company?.logo
                        ? `${API_IMAGE_URL}${company?.logo}` // Replace API_IMAGE_URL with your base URL
                        : "assets/images/logo.png" // default image
                    }
                    alt={company?.name || "Company Logo"}
                  />
                </div>
                <div className="company-about-short-detail">
                  <h4>{company?.brandName}</h4>
                  <div className="subscribe-best-employer-btn">
                    <span className="subscribe-btn default-btn btn">
                      + Subscribe
                    </span>
                    <span>
                      <div className="best-employer-btn">
                        <i className="fa-solid fa-award" /> Best Employer
                      </div>
                    </span>
                  </div>
                  <ul>
                    <li>
                      <i className="fa-solid fa-user" />
                      {company?.numberOfEmployees}
                    </li>
                    <li>
                      <i className="fa-solid fa-globe" />
                      Services
                    </li>
                    <li>
                      <a
                        href={
                          company?.links?.officialWebsite
                            ? company.links.officialWebsite
                            : "http://itdevelopmentservices.com/jobPortal/"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square" />{" "}
                        Visit the company website
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="company-detail-tab-description-info">
              <div className="company-detail-tab-info">
                {/* Nav tabs */}
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link active"
                      data-bs-toggle="tab"
                      href="#menu1"
                      aria-selected="true"
                      role="tab"
                    >
                      About the company{" "}
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu2"
                      aria-selected="false"
                      tabIndex={-1}
                      role="tab"
                    >
                      Current openings
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu3"
                      aria-selected="false"
                      tabIndex={-1}
                      role="tab"
                    >
                      Office photos
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu4"
                      aria-selected="false"
                      tabIndex={-1}
                      role="tab"
                    >
                      Office videos
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu5"
                      aria-selected="false"
                      tabIndex={-1}
                      role="tab"
                    >
                      Career Details
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      data-bs-toggle="tab"
                      href="#menu6"
                      aria-selected="false"
                      tabIndex={-1}
                      role="tab"
                    >
                      Links
                    </a>
                  </li>
                </ul>
              </div>
              <div className="company-detail-tab-description">
                {/* Tab panes */}
                <div className="tab-content">
                  <div id="menu1" className="tab-pane active" role="tabpanel">
                    <h5>Company Information</h5>
                    <div className="company-profile-detail-info">
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-building-columns" />
                          Company Name
                        </h4>
                        <p>{company?.brandName || "N/A"}</p>
                      </div>
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-gear" />
                          Industry
                        </h4>
                        <p>{company?.industries || "N/A"}</p>
                      </div>
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-user" />
                          Number of Employees
                        </h4>
                        <p>{company?.numberOfEmployees || "N/A"}</p>
                      </div>
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-phone" />
                          Phone number
                        </h4>
                        <p>
                          +{company?.phone?.countryCode}{" "}
                          {company?.phone?.number}
                        </p>
                      </div>
                    </div>
                    <div className="company-profile-detail-info">
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-address-card" />
                          Street Address
                        </h4>
                        <p>{company?.companyAddress || "N/A"}</p>
                      </div>
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-city" />
                          City
                        </h4>
                        <p>{company?.city || "N/A"}</p>
                      </div>
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-map-location-dot" />
                          State
                        </h4>
                        <p>{company?.region || "N/A"}</p>
                      </div>
                      <div className="company-profile-detail-box">
                        <h4>
                          <i className="fa-solid fa-globe" />
                          Country
                        </h4>
                        <p>{company?.Country || "N/A"}</p>
                      </div>
                    </div>
                    <div
                      className="company-profile-description"
                      dangerouslySetInnerHTML={{ __html: decodedHtml }}
                    />
                  </div>
                  <div id="menu2" className="tab-pane fade" role="tabpanel">
                    <h5>Current openings</h5>
                    {company?.jobs?.length > 0 ? (
                      company.jobs.map((job) => (
                        <div className="company-detail-job-box">
                          <Link
                            key={job._id}
                            to={`/job-details/${job._id}`} // ✅ Pass ID in URL
                            className="job-link"
                          >
                            <div className="company-detail-card">
                              <h4>{job.jobTitle || "N/A"}</h4>
                              <ul>
                                <li>
                                  <i className="fa-solid fa-location-dot" />
                                  {job.city?.length
                                    ? job.city.join(", ")
                                    : "N/A"}
                                </li>
                                <li>
                                  <i className="fa-solid fa-calendar-days" />
                                  {new Date(job.createdAt).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </li>
                                <li>
                                  <i className="fa-solid fa-signal" />
                                  {job.minimumLevel?.name || "N/A"}
                                </li>
                                <li>
                                  <i className="fa-solid fa-user" />
                                  {job?.employmentType?.name || "N/A"}
                                </li>
                              </ul>
                            </div>
                          </Link>
                          <div className="company-detail-apply-link-save-btn">
                            <div className="company-detail-apply-btn">
                              {job?.isApplied ? (
                                <button className="default-btn btn">
                                  {job?.applicationStatus}
                                </button>
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
                              )}
                              {/* Button trigger modal */}
                              {/* <a
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#ApplyQuickly"
                                className="default-btn btn"
                              >
                                Apply Quickly
                              </a> */}
                              {/* Modal */}
                              {/* <div
                                className="modal fade"
                                id="ApplyQuickly"
                                data-bs-backdrop="static"
                                data-bs-keyboard="false"
                                tabIndex={-1}
                                aria-labelledby="ApplyQuicklyLabel"
                                aria-hidden="true"
                              >
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id="staticBackdropLabel"
                                      >
                                        Apply Now
                                      </h1>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      />
                                    </div>
                                    <div className="modal-body">
                                      <div className="company-detail-show-upload">
                                        <div className="company-detail-doc-tyep">
                                          <h4>
                                            <i className="fa-solid fa-circle-check" />
                                            Resume Name, pdf,doc
                                          </h4>
                                        </div>
                                        <div className="company-detail-download-edit">
                                          <i className="fa-solid fa-ellipsis-vertical" />
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
                                      <div className="company-detail-attechment-info">
                                        &nbsp; &nbsp; &nbsp; &nbsp;{" "}
                                        <div className="control-label-file-up">
                                          <i className="fa-solid fa-arrow-up-from-bracket" />{" "}
                                          Upload CV
                                          <input
                                            type="file"
                                            id="attach"
                                            className="optional-inputfile"
                                            name="attach"
                                            accept=".pdf, .doc, .docx"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="company-detail modal-footer">
                                      <a href="#" className="default-btn btn">
                                        Apply
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div> */}
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
                                              const fileName = getFileName(
                                                resume.url
                                              );
                                              return (
                                                <div
                                                  key={resume._id}
                                                  className={
                                                    "job-apply-custom-resume-info " +
                                                    (selectedType ===
                                                      "resume" &&
                                                    selectedId === resume.url
                                                      ? "active"
                                                      : "")
                                                  }
                                                  onClick={() =>
                                                    handleSelect(
                                                      "resume",
                                                      resume.url
                                                    )
                                                  }
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  <span className="file-name-text">
                                                    <i className="fa-solid fa-file" />{" "}
                                                    {fileName}
                                                  </span>

                                                  {selectedType === "resume" &&
                                                    selectedId ===
                                                      resume.url && (
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
                                              const fileName = getFileName(
                                                cover.url
                                              );
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
                                                    handleSelect(
                                                      "cover",
                                                      cover.url
                                                    )
                                                  }
                                                  style={{ cursor: "pointer" }}
                                                >
                                                  <span className="file-name-text">
                                                    <i className="fa-solid fa-file" />{" "}
                                                    {fileName}
                                                  </span>

                                                  {selectedType === "cover" &&
                                                    selectedId ===
                                                      cover.url && (
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
                                              display: selectedCustomFile
                                                ? "block"
                                                : "none",
                                            }}
                                          >
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
                                                if (
                                                  fileInputRef &&
                                                  fileInputRef.current
                                                )
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
                                            disabled={
                                              isApplying || !isSelectionMade()
                                            }
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
                            <div className="company-detail-link-save-icon">
                              <ul>
                                <li style={{ position: "relative" }}>
                                  <a
                                    href="#"
                                    onClick={(e) =>
                                      handleCopy(e, job?.link, job?._id)
                                    }
                                    style={{
                                      cursor: job?.link
                                        ? "pointer"
                                        : "not-allowed",
                                    }}
                                    title={
                                      !job?.link
                                        ? "Link not available"
                                        : copiedJobId === job?._id
                                        ? "Copied!"
                                        : "Copy link"
                                    }
                                  >
                                    {job?.link ? (
                                      <i className="fa-solid fa-link" />
                                    ) : (
                                      <span style={{ fontWeight: "bold" }}>
                                        N
                                      </span>
                                    )}
                                  </a>

                                  {/* Show "Copied!" only for this job */}
                                  {copiedJobId === job._id && (
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
                                      job.isSaved ? "solid" : "regular"
                                    } fa-heart`}
                                    style={{
                                      cursor: "pointer",
                                      color: job.isSaved ? "#fb761a" : "#fff",
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSaveJob(job._id);
                                    }}
                                  />
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No jobs available</p>
                    )}
                  </div>
                  <div id="menu3" className="tab-pane fade" role="tabpanel">
                    <div className="company-detail-third-tab">
                      <h5>Office Photos</h5>
                      <div className="row">
                        {/* <div className="col-lg-3 col-md-4">
                          <div className="company-office-photos-box">
                            <img src="assets/images/company/company-img-1.jpg" />
                          </div>
                        </div> */}
                        {company?.photos?.length > 0 ? (
                          company.photos.map((photo) => (
                            <div className="col-lg-3 col-md-4" key={photo._id}>
                              <div className="company-office-photos-box">
                                <img
                                  crossorigin="anonymous"
                                  src={`${API_IMAGE_URL}${photo.url}`}
                                  alt="Office"
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No photos available</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div id="menu4" className="tab-pane fade" role="tabpanel">
                    <div className="company-detail-fourth-tab">
                      <h5>Office Videos</h5>
                      <div className="row">
                        {company?.videos?.length > 0 ? (
                          company.videos.map((video) => (
                            <div className="col-lg-3 col-md-4">
                              <div className="company-office-video-box">
                                <video
                                  crossorigin="anonymous"
                                  width="100%"
                                  height={150}
                                  controls
                                >
                                  <source
                                    crossorigin="anonymous"
                                    src={`${API_IMAGE_URL}${video.url}`}
                                    type="video/mp4"
                                  />
                                </video>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No videos available</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div id="menu5" className="tab-pane fade" role="tabpanel">
                    <div className="company-detail-fifth-tab">
                      <h5>Career Details</h5>

                      {decodedCareerDetail?.trim() ? (
                        <div
                          className="company-career-detail"
                          dangerouslySetInnerHTML={{
                            __html: decodedCareerDetail,
                          }}
                        />
                      ) : (
                        <p className="text-muted">No Career Details</p>
                      )}
                    </div>

                    <div
                      className="career-detail-display"
                      dangerouslySetInnerHTML={{ __html: decodedHtml1 }}
                    />
                  </div>
                  <div id="menu6" className="tab-pane fade" role="tabpanel">
                    <div className="company-detail-sixth-tab">
                      <h5>Links</h5>
                      <div className="company-detail-official-website">
                        <h4>
                          <i className="fa-solid fa-globe" />{" "}
                          {company?.brandName}
                        </h4>
                        <h5>
                          {company?.links?.officialWebsite ? (
                            <a
                              href={company.links.officialWebsite}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {company.links.officialWebsite}
                            </a>
                          ) : (
                            <span className="text-muted">
                              No website available
                            </span>
                          )}
                        </h5>
                      </div>
                      <div className="company-detail-social-link">
                        <div className="company-detail-social-box">
                          <h4>
                            <i className="fa-brands fa-linkedin" /> Linkedin
                          </h4>
                          {company?.links?.linkedin ? (
                            <a
                              href={company.links.linkedin}
                              target="_blank"
                              rel="noreferrer"
                            >
                              https://www.instagram.com/
                            </a>
                          ) : (
                            <span className="text-muted">No LinkedIn link</span>
                          )}
                        </div>
                        <div className="company-detail-social-box">
                          <h4>
                            <i className="fa-brands fa-facebook-f" /> facebook
                          </h4>
                          {company?.links?.facebook ? (
                            <a
                              href={company.links.facebook}
                              target="_blank"
                              rel="noreferrer"
                            >
                              https://www.facebook.com/
                            </a>
                          ) : (
                            <span className="text-muted">No Facebook link</span>
                          )}
                        </div>
                        <div className="company-detail-social-box">
                          <h4>
                            <i className="fa-brands fa-instagram" /> Instagram
                          </h4>
                          {company?.links?.instagram ? (
                            <a
                              href={company.links.instagram}
                              target="_blank"
                              rel="noreferrer"
                            >
                              https://www.instagram.com/
                            </a>
                          ) : (
                            <span className="text-muted">
                              No Instagram link
                            </span>
                          )}
                        </div>
                        <div className="company-detail-social-box">
                          <h4>
                            <i className="fa-brands fa-x-twitter" /> Twitter
                          </h4>
                          {company?.links?.twitter ? (
                            <a
                              href={company.links.twitter}
                              target="_blank"
                              rel="noreferrer"
                            >
                              https://www.twitter.com/
                            </a>
                          ) : (
                            <span className="text-muted">No Twitter link</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CompanyDetailsPage;
