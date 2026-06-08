import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { TbMessages } from "react-icons/tb";
import { useDebounce, SEARCH_DEBOUNCE_MS } from "../hooks/useDebounce";
import {
  getApplicantCoverLetterUrl,
  getApplicantCvSource,
  openApplicationFile,
} from "../utils/applicationDocuments";

function ApplicantsDetails() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const jobId = location.state?.jobId;
  const jobTags = location.state?.tags || [];
  const [candidateList, setCandidateList] = useState([]);
  const [candidateListSummary, setCandidateListSummary] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // you can change to 20, 50 etc.
  const [searchInput, setSearchInput] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [atsData, setAtsData] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [levels, setLevels] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const debouncedLocationSearch = useDebounce(
    locationSearchTerm,
    SEARCH_DEBOUNCE_MS,
  );
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newApplicationStatus, setNewApplicationStatus] = useState("");
  const [candidateCount, setCandidateCount] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    skills: "",
    education: "",
    experienceLevel: "",
    salaryRange: "",
  });

  const degreeOptions = [
    "High School",
    "Secondary School",
    "Higher Secondary",
    "Certificate",
    "Diploma",
    "Associate Degree",
    "Bachelor Degree",
    "Master’s Degree",
    "Doctorate (PhD)",
    "Post Doctorate",
    "Professional Degree",
  ];

  const fetchCandidates = async (status = "") => {
    let query = [];

    query.push(`page=${page}`);
    query.push(`limit=${limit}`);

    if (status) query.push(`status=${status}`);
    if (filters.search) query.push(`search=${filters.search}`);
    if (filters.location) query.push(`location=${filters.location}`);
    if (filters.skills) query.push(`skills=${filters.skills}`);
    if (filters.education) query.push(`education=${filters.education}`);
    if (filters.experienceLevel)
      query.push(`experienceLevel=${filters.experienceLevel}`);
    if (filters.salaryRange) query.push(`salaryRange=${filters.salaryRange}`);

    const queryString = `?${query.join("&")}`;

    const res = await fetch(
      `${API_BASE_URL}getApplicantsByJob/${jobId}${queryString}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = await res.json();

    setCandidateList(data.applicants || []);
    setCandidateListSummary(data.summary || {});
    setTotalPages(data.totalPages || 1);

    if (data.applicants?.length > 0) {
      fetchApplicantDetails(data.applicants[0]._id);
    } else {
      setSelectedCandidate(null);
    }
  };
  useEffect(() => {
    fetch(`${API_BASE_URL}getActiveSalaryRangeList`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setSalaryRanges(data.data);
        }
      })
      .catch((err) => console.log("Error:", err));
  }, []);

  const fetchCandidates2 = async () => {
    let query = [];

    query.push(`page=${page}`);
    query.push(`limit=${limit}`);

    const queryString = `?${query.join("&")}`;
    const res = await fetch(
      `${API_BASE_URL}getApplicantsByJob/${jobId}${queryString}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await res.json();
    console.log("Candidate Count Data:-", data.summary);
    setCandidateCount(data.summary || {});
    setTotalPages(data.totalPages || 1);
  };

  useEffect(() => {
    fetchCandidates2();
  }, [page]);
  const fetchATSScore = async (jobId, applicationId) => {
    if (!jobId || !applicationId) return;

    try {
      const res = await axios.get(
        `${API_BASE_URL}ats-score/${jobId}/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data?.success) {
        setAtsData(res.data); // ✅ store full response
      }
    } catch (error) {
      console.error("ATS Score Error:", error);
      setAtsData(null);
    }
  };
  useEffect(() => {
    if (searchInput === "") {
      setPage(1);
      setFilters((prev) => ({ ...prev, search: "" }));
    }
  }, [searchInput]);

  useEffect(() => {
    fetchSalaryRanges();
  }, []);

  const fetchSalaryRanges = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getActiveSalaryRangeList`);
      if (res.data.success) {
        setSalaryRanges(res.data.data); // ✅ data[] from API
      }
    } catch (error) {
      console.error("Error fetching salary ranges:", error);
    }
  };

  useEffect(() => {
    fetchExperienceLevels();
  }, []);

  useEffect(() => {
    fetchCandidates(selectedStatus);
    fetchCandidates2();
  }, [page, selectedStatus]);

  const fetchExperienceLevels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getActiveSeniorityLevelList`);

      if (res.data.success) {
        setLevels(res.data.levels); // ⭐ API sends levels[]
      }
    } catch (error) {
      console.error("Error fetching experience levels:", error);
    }
  };

  useEffect(() => {
    fetchEducationList();
  }, []);

  const handleStatusUpdate = async (e) => {
    const value = e.target.value;
    setNewApplicationStatus(value);

    try {
      const res = await axios.post(
        `${API_BASE_URL}updateApplicationStatus`,
        {
          jobId: selectedCandidate?.jobId, // From useLocation()
          applicationId: selectedCandidate?._id,
          newStatus: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Status Updated", res.data);
      toast.success(`Candidate status updated to ${value}`, {
        position: "top-right",
        autoClose: 3000,
      });
      fetchCandidates2();
      fetchCandidates();
      // Refresh candidate details
      fetchApplicantDetails(selectedCandidate?.userInfo?._id);
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  const fetchEducationList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getActiveJobTypeList`);

      if (res.data.success) {
        setJobTypes(res.data.jobTypes); // ⭐ using jobTypes[]
      }
    } catch (error) {
      console.error("Error fetching education types:", error);
    }
  };

  const handleLocationSearch = (e) => {
    setLocationSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (!debouncedLocationSearch.trim()) {
      setLocationSuggestions([]);
      return undefined;
    }

    const fetchLocationSuggestions = async () => {
      try {
        setIsLocationLoading(true);
        const res = await axios.get(`${API_BASE_URL}searchCities`, {
          params: { key: debouncedLocationSearch },
        });

        if (res.data?.success && Array.isArray(res.data.cities)) {
          setLocationSuggestions(res.data.cities);
        } else {
          setLocationSuggestions([]);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
        setLocationSuggestions([]);
      } finally {
        setIsLocationLoading(false);
      }
    };

    fetchLocationSuggestions();
  }, [debouncedLocationSearch]);

  const getLabelStyle = (rating) => {
    switch (rating) {
      case 5:
        return { backgroundColor: "#16a34a", color: "#fff" }; // green
      case 4:
        return { backgroundColor: "#22c55e", color: "#fff" };
      case 3:
        return { backgroundColor: "#facc15", color: "#000" }; // yellow
      case 2:
        return { backgroundColor: "#fb923c", color: "#fff" }; // orange
      case 1:
      default:
        return { backgroundColor: "#f70b0b", color: "#fff" }; // red
    }
  };

  const handleSelectLocation = (city) => {
    setSelectedLocation(city);
    setLocationSearchTerm(city.name);
    setLocationSuggestions([]);

    setFilters((prev) => ({
      ...prev,
      location: city.name,
    }));
  };

  useEffect(() => {
    if (filters.location) {
      fetchCandidates(); // now always uses updated filter value
    }
  }, [filters.location]);

  const handleSortChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    fetchCandidates(status); // 🔥 Fetch filtered list
  };

  // Fetch Full Details of Single Applicant
  const fetchApplicantDetails = async (applicationId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}applicant/details/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      setSelectedCandidate(data.applicant);
      setNewApplicationStatus(data.applicant.status || "");
      fetchATSScore(data.applicant.jobId, data.applicant._id);
    } catch (err) {
      console.error("Details Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchCandidates(selectedStatus); // load with current filter
    }
  }, [jobId]);

  const handleBookmark = async (candidateId, jobId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}bookmark/candidate`,
        { candidateId, jobId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Show message from backend
      toast.success(res.data.message);
      fetchCandidates();
    } catch (err) {
      console.error("Error bookmarking candidate:", err);

      // If backend sends error message
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to bookmark candidate!");
      }
    }
  };

  const getResumeUrl = () => getApplicantCvSource(selectedCandidate);
  const handleClearLocation = () => {
    setLocationSearchTerm("");
    setSelectedLocation(null);
    setLocationSuggestions([]);

    setFilters((prev) => ({
      ...prev,
      location: "",
    }));
  };

  const renderStars = (rating) => {
    const totalStars = 5;

    return (
      <span>
        {Array.from({ length: totalStars }).map((_, index) => {
          const starNumber = index + 1;

          return (
            <i
              key={index}
              className={
                starNumber <= rating ? "fa-solid fa-star" : "fa-regular fa-star"
              }
              apply-applicant-profile-details
              style={{
                color: starNumber <= rating ? "#fbbf24" : "#d1d5db",
                marginRight: "4px",
              }}
            />
          );
        })}
      </span>
    );
  };
  useEffect(() => {
    fetchCandidates(selectedStatus);
  }, [filters]);

  return (
    <>
      <ToastContainer />

      <section className="inner-breadcrumb-main-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="breadcrumb-main-list-area">
                <h4>Applicant Details</h4>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <Link to="/employer-dashboard">Dashboard</Link>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <Link to="/all-applicants-list" state={{ showAllJobs: true }}>
                      Applicant Management
                    </Link>
                    <i className="fa-solid fa-angle-right"></i>
                  </li>
                  <li>Applicant Details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="employer-candidate-info-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              {selectedCandidate ? (
                <>
                  {/* ================= HEADER SECTION ================= */}
                  <div className="apply-applicant-profile-details">
                    <div className="employer-candidate-detail-new-info">
                      <div className="employer-candidate-img-content-info">
                        <div className="employer-candidate-img-info">
                          <img
                            crossOrigin="anonymous"
                            src={
                              selectedCandidate?.userInfo?.profileImage
                                ? selectedCandidate.userInfo.profileImage.startsWith(
                                    "http",
                                  )
                                  ? selectedCandidate.userInfo.profileImage // external URL → use directly
                                  : `${API_IMAGE_URL}${selectedCandidate.userInfo.profileImage}` // local uploads
                                : "assets/images/userIcon.png"
                            }
                            alt="Image"
                          />
                        </div>

                        <div className="employers-condidate-content">
                          <h3>
                            <strong>Name:</strong>{" "}
                            {selectedCandidate?.userInfo?.first_name}{" "}
                            {selectedCandidate?.userInfo?.last_name}
                          </h3>

                          <h3>
                            <strong>Position:</strong>{" "}
                            {selectedCandidate?.profile?.aboutRole?.jobTitle ||
                              "N/A"}
                          </h3>

                          <h3>
                            <strong>Email:</strong>{" "}
                            {selectedCandidate?.userInfo?.email}
                          </h3>

                          <h3>
                            <strong>Contact:</strong>{" "}
                            {selectedCandidate?.userInfo?.phone}
                          </h3>

                          <h3>
                            <strong>Address:</strong>{" "}
                            {selectedCandidate?.userInfo?.city}
                          </h3>
                          <h3>
                            <strong>ATS Rating:</strong>{" "}
                            {atsData ? renderStars(atsData.rating) : "-"}
                          </h3>

                          <h3>
                            <strong>Tag:</strong>{" "}
                            {atsData ? (
                              <span
                                style={{
                                  ...getLabelStyle(atsData.rating),
                                  padding: "2px 5px",
                                  borderRadius: "5px",
                                  fontSize: "10px",
                                  fontWeight: "700",
                                  display: "inline-block",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {atsData.label}
                              </span>
                            ) : (
                              "N/A"
                            )}
                          </h3>
                          <h3
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <strong>ATS Score:</strong>

                            <div
                              style={{ width: 30, height: 30, fontWeight: 700 }}
                            >
                              <CircularProgressbar
                                value={atsData?.atsPercentage || 0}
                                text={`${atsData?.atsPercentage || 0}%`}
                                styles={buildStyles({
                                  textSize: "33px",
                                  pathColor:
                                    atsData?.atsPercentage >= 75
                                      ? "#16a34a"
                                      : atsData?.atsPercentage >= 40
                                        ? "#facc15"
                                        : "#ef4444",
                                  textColor: "#111",
                                  trailColor: "#e5e7eb",
                                  fontWeight: 700,
                                })}
                              />
                            </div>
                          </h3>

                          {/* <h3
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <strong></strong>
                            <span
                              style={{
                                padding: "2px 5px",
                                borderRadius: "5px",
                                fontSize: "10px",
                                fontWeight: "700",
                                display: "inline-block",
                                letterSpacing: "0.5px",
                                background: "#f05a1c",
                                color: "#fff",
                              }}
                            >
                              <Link
                                to="/messaging-system"
                                state={{ jobId: selectedCandidate.jobId }}
                                style={{
                                  color: "#fff",
                                }}
                              >
                                Send Message
                              </Link>
                            </span>
                          </h3> */}
                          {/* <span>
                            <Link
                              to="/messaging-system"
                              state={{ jobId: selectedCandidate.jobId }}
                              style={{
                                border: "none",
                                backgroundColor: "#f35c1b",
                                color: "#fff",
                                borderRadius: "10px",
                                padding: "5px 10px",
                                fontWeight: "600",
                                marginBottom: "10px",
                              }}
                            >
                              💬 Send Message
                            </Link>
                          </span> */}
                        </div>
                      </div>
                      <div className="employer-candidate-dcv-icons">
                        <div className="employer-candidate-dcv-btn">
                          <a
                            href="#"
                            className="default-btn btn"
                            onClick={(e) => {
                              e.preventDefault();
                              const fileUrl = getResumeUrl();

                              if (!fileUrl) {
                                toast.error("No resume uploaded");
                                return;
                              }

                              openApplicationFile(fileUrl, () =>
                                toast.error("No resume uploaded"),
                              );
                            }}
                          >
                            Download CV
                          </a>{" "}
                        </div>

                        <div className="employer-candidate-icon-info">
                          <ul>
                            {/* LinkedIn */}
                            <li>
                              <a
                                href={
                                  selectedCandidate?.profile?.links?.linkedin ||
                                  "#"
                                }
                                target="_blank"
                                onClick={(e) => {
                                  if (
                                    !selectedCandidate?.profile?.links?.linkedin
                                  ) {
                                    e.preventDefault();
                                    toast.info("LinkedIn link not available");
                                  }
                                  e.stopPropagation(); // prevent parent click
                                }}
                              >
                                <i className="fa-brands fa-linkedin-in" />
                              </a>
                            </li>

                            {/* GitHub */}
                            <li>
                              <a
                                href={
                                  selectedCandidate?.profile?.links?.github ||
                                  "#"
                                }
                                target="_blank"
                                onClick={(e) => {
                                  if (
                                    !selectedCandidate?.profile?.links?.github
                                  ) {
                                    e.preventDefault();
                                    toast.info("GitHub link not available");
                                  }
                                  e.stopPropagation();
                                }}
                              >
                                <i className="fa-brands fa-github" />
                              </a>
                            </li>

                            {/* Portfolio */}
                            <li>
                              <a
                                href={
                                  selectedCandidate?.profile?.links
                                    ?.portfolio || "#"
                                }
                                target="_blank"
                                onClick={(e) => {
                                  if (
                                    !selectedCandidate?.profile?.links
                                      ?.portfolio
                                  ) {
                                    e.preventDefault();
                                    toast.info("Portfolio link not available");
                                  }
                                  e.stopPropagation();
                                }}
                              >
                                <i className="fa-solid fa-globe" />
                              </a>
                            </li>
                            {/* <li>
                              <Link
                                to="/messaging-system"
                                state={{ jobId: selectedCandidate.jobId }}
                              >
                                <i>
                                  <TbMessages />
                                </i>
                              </Link>
                            </li> */}
                          </ul>
                        </div>

                        <div className="new-reviewed-interviewed-rejected-hired">
                          <select
                            className="form-select form-control"
                            aria-label="Default select example"
                            value={newApplicationStatus}
                            onChange={handleStatusUpdate}
                          >
                            <option value="Applied">New</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Hired">Hired</option>
                          </select>
                        </div>
                        <div className="employer-candidate-dcv-btn mt-4">
                          <Link
                            to="/messaging-system"
                            // className="default-btn btn"
                            state={{ jobId: selectedCandidate.jobId }}
                            style={{
                              padding: "3px 3px",
                              borderRadius: "5px",
                              fontSize: "10px",
                              fontWeight: "700",
                              display: "inline-block",
                              letterSpacing: "0.5px",
                              background: "#f05a1c",
                              color: "#fff",
                            }}
                          >
                            <i
                              style={{
                                fontWeight: "800",
                                fontSize: "15px",
                              }}
                            >
                              <TbMessages />
                            </i>{" "}
                           Send Message
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ================= PROFESSIONAL SUMMARY ================= */}
                  <div className="employer-candidate-detail-info-area">
                    <div className="employer-candidate-cv-heading">
                      <h3>About Role</h3>
                    </div>

                    <div className="employer-candidate-cv-details">
                      <h5>Job Title</h5>
                      <p>
                        {selectedCandidate?.profile?.aboutRole?.jobTitle ||
                          "NA"}
                      </p>

                      <h5>Years of experience</h5>
                      <p>
                        {selectedCandidate?.profile?.aboutRole
                          ?.yearOfExperience || "NA"}
                      </p>

                      <h5>Job category</h5>
                      <p>
                        {selectedCandidate?.profile?.aboutRole?.jobCategory ||
                          "NA"}
                      </p>
                    </div>

                    <div className="candidate-profile-divider-line" />

                    {/* ================= CAREER GOALS ================= */}
                    <div className="employer-candidate-cv-heading">
                      <h3>Career Goals</h3>
                    </div>

                    <div className="employer-candidate-cv-details">
                      <h5>Desired Job Title</h5>
                      <p>
                        {selectedCandidate?.profile?.career_goals
                          ?.DesiredJobTitle || "NA"}
                      </p>

                      <h5>Desired Employment Type</h5>
                      <p>
                        {selectedCandidate?.profile?.career_goals
                          ?.DesiredEmploymentType || "NA"}
                      </p>

                      <h5>Desired Occupation Type</h5>
                      <p>
                        {selectedCandidate?.profile?.career_goals
                          ?.DesiredOccupationType || "NA"}
                      </p>

                      <h5>Minimum Desired Salary</h5>
                      <p>
                        {selectedCandidate?.profile?.career_goals
                          ?.MinimumDesiredSalary?.amount || "NA"}{" "}
                        {selectedCandidate?.profile?.career_goals
                          ?.MinimumDesiredSalary?.currency || "NA"}{" "}
                        /{" "}
                        {selectedCandidate?.profile?.career_goals
                          ?.MinimumDesiredSalary?.type || "NA"}
                      </p>

                      <h5>Job Search Status</h5>
                      <p>
                        {selectedCandidate?.profile?.career_goals
                          ?.jobSearchStatus || "NA"}
                      </p>
                    </div>

                    <div className="candidate-profile-divider-line" />

                    {/* ================= SKILLS ================= */}
                    <div className="employer-candidate-cv-heading">
                      <h3>Skills</h3>
                    </div>
                    <div className="employer-candidate-profile-skill-info">
                      <ul>
                        {selectedCandidate?.profile?.skills?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="candidate-profile-divider-line" />

                    {/* ================= EDUCATION ================= */}
                    <div className="employer-candidate-cv-heading">
                      <h3>Education</h3>
                    </div>
                    {selectedCandidate?.profile?.education?.map((edu) => (
                      <div
                        key={edu._id}
                        className="employer-candidate-cv-details"
                      >
                        <h5>Degree</h5>
                        <p>{edu.degree || "NA"}</p>

                        <h5>University</h5>
                        <p>{edu.University || "NA"}</p>

                        <h5>Start Date</h5>
                        <p>{new Date(edu.startDate).toLocaleDateString()}</p>

                        <h5>End Date</h5>
                        <p>
                          {edu.currentlyStudyingHere
                            ? "Currently Studying"
                            : new Date(edu.endDate).toLocaleDateString()}
                        </p>

                        <div className="candidate-profile-divider-line" />
                      </div>
                    ))}

                    {/* ================= WORK HISTORY ================= */}
                    <div className="employer-candidate-cv-heading">
                      <h3>Experience</h3>
                    </div>

                    {selectedCandidate?.profile?.workHistory?.map((work) => (
                      <div
                        key={work._id}
                        className="employer-candidate-cv-details"
                      >
                        <h5>{work.jobTitle || "NA"}</h5>
                        <p>
                          {new Date(work.startDate).toLocaleDateString()} -{" "}
                          {work.currentlyWorkingHere
                            ? "Present"
                            : new Date(work.endDate).toLocaleDateString()}
                        </p>

                        <h5>{work.companyName || "NA"}</h5>
                        <p>{work.workLocation || "NA"}</p>

                        <h5>Salary</h5>
                        <p>
                          {work.currentSalary?.amount}{" "}
                          {work.currentSalary?.currency}
                        </p>
                        <h5>Payroll frequency</h5>
                        <p>{work.currentSalary?.payrollFrequency || "NA"}</p>

                        <div className="candidate-profile-divider-line" />
                      </div>
                    ))}

                    {/* ================= LANGUAGES ================= */}
                    <div className="employer-candidate-cv-heading">
                      <h3>Languages</h3>
                    </div>

                    {selectedCandidate?.profile?.languages?.map((lang) => (
                      <div
                        key={lang._id}
                        className="employer-candidate-cv-details"
                      >
                        <h5>{lang.language || "NA"}</h5>
                        <p>{lang.proficiency || "NA"}</p>
                      </div>
                    ))}

                    <div className="candidate-profile-divider-line" />

                    {/* ================= CERTIFICATES ================= */}
                    <div className="employer-candidate-cv-heading">
                      <h3>Certificates</h3>
                    </div>

                    {selectedCandidate?.profile?.certificates?.map((cer) => (
                      <div
                        key={cer._id}
                        className="employer-candidate-cv-details"
                      >
                        <h5>{cer.title || "NA"}</h5>
                        <p>
                          Issue Date:{" "}
                          {new Date(cer.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="candidate-empty-state">
                  <h3 className="text-center">Loading...</h3>
                  <p className="text-center">
                    Candidate information is on the way.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ApplicantsDetails;
