import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination"; // MUI one

function ManagesJobApplication() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedNotify, setSelectedNotify] = useState({});
  const [selected, setSelected] = useState([]);
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // 🔹 new state for filter
  const [companies, setCompanies] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const token = localStorage.getItem("token"); // 🔹 assuming JWT is stored here
  const [jobAlerts, setJobAlerts] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  // const queryParams = new URLSearchParams(location.search);
  // const defaultTab = queryParams.get("tab") || "applications";
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [consent, setConsent] = useState(false);
  const [activeTab, setActiveTab] = useState("applications");
  const handleWithdrawClick = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setReason("");
    setComments("");
    setConsent(false);
  };

  // Handle Withdraw Submit
  const handleWithdrawSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason.");
      return;
    }

    if (!consent) {
      toast.error("Please agree to the consent checkbox.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}withdrawJobApplication`,
        {
          applicationId: selectedApplicationId,
          reason,
          comments,
          consent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Close Bootstrap modal safely
      const modalEl = document.getElementById("exampleModal");
      if (modalEl) {
        const modalInstance =
          window.bootstrap.Modal.getInstance(modalEl) ||
          new window.bootstrap.Modal(modalEl);
        modalInstance.hide();
      }

      toast.success(
        res?.data?.message || "Application withdrawn successfully!",
      );

      if (activeTab === "saved-jobs") {
        fetchSavedJobs();
      } else if (activeTab === "applications") {
        fetchApplications();
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to withdraw application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // read query param ?tab=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/manage-job-application?tab=${tab}`);
  };

  useEffect(() => {
    if (activeTab === "saved-jobs") {
      fetchSavedJobs();
    } else if (activeTab === "applications") {
      fetchApplications();
    }
  }, [activeTab]);
  // 🔹 Initial fetch based on active tab
  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications(statusFilter);
    }
  }, [activeTab]);

  // 🔹 Fetch again whenever filter changes
  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications(statusFilter);
    }
  }, [statusFilter]);

  const handleSaveJob = async (jobId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}savedJob`,
        { job_id: jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("✅ API Response:", res.data);

      if (res.data.success) {
        const { message } = res.data;

        // ✅ Toggle locally without refetch
        // setJobList((prevJobs) =>
        //   prevJobs.map((job) =>
        //     job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        //   )
        // );
        fetchSavedJobs();
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

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}savedJobList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setSavedJobs(res.data.savedJobs || []);
      } else {
        toast.error(res.data.message || "Failed to load saved jobs");
      }
    } catch (error) {
      console.error("❌ Error fetching saved jobs:", error);
      toast.error("Error fetching saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (status = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}getJobSeekerApplications`, {
        headers: { Authorization: `Bearer ${token}` },
        params: status ? { status } : {}, // ✅ pass status only if not empty
      });

      if (res.data.success) {
        setApplications(res.data.applications || []);
      } else {
        toast.error(res.data.message || "Failed to load applications");
      }
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      toast.error("Error fetching applications");
    } finally {
      setLoading(false);
    }
  };

  const getCompanyList = async (
    industryIds = [],
    page = 1,
    limit = pageSize,
  ) => {
    try {
      const params = {
        page,
        limit,
      };

      if (industryIds.length > 0) {
        params.industry = industryIds.join(",");
      }

      const res = await axios.get(`${API_BASE_URL}GetCompanyDetailsList`, {
        params,
      });

      if (res.data.success) {
        setCompanies(res.data);
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
  };

  useEffect(() => {
    const selectedIndustryIds = selected.map((i) => i._id);
    getCompanyList(selectedIndustryIds, pageNumber, pageSize);
  }, [pageNumber, pageSize, selected]);

  const handleViewCompany = (company, from) => {
    navigate("/companies-details", {
      state: { companyId: company, from }, // 👈 send ID as prop-like data
    });
  };

  const totalPages = companies?.totalPages;

  useEffect(() => {
    getCompanyList();
  }, []);

  useEffect(() => {
    if (activeTab === "job-alerts") {
      fetchJobAlerts();
    }
  }, [activeTab]);

  // ✅ Fetch all saved job alerts
  const fetchJobAlerts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}getSavedJobAlert`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setJobAlerts(res.data.savedJobs || []);
      } else {
        toast.error(res.data.message || "Failed to load job alerts");
      }
    } catch (error) {
      console.error("❌ Error fetching job alerts:", error);
      toast.error("Error fetching job alerts");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle status (for switch)
  const handleToggleStatus = async (alertId, newStatus) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}updateJobAlert`,
        {
          alertId,
          status: newStatus,
          // notifyEvery: selectedNotify[alertId] || "", // keep existing if needed
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        toast.success("Alert status updated successfully!");
        // ✅ Update UI
        setJobAlerts((prev) =>
          prev.map((a) =>
            a._id === alertId ? { ...a, status: newStatus } : a,
          ),
        );
      } else {
        toast.error(res.data.message || "Failed to update alert");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating alert");
    }
  };

  const handleUpdateAlert = async (
    alertId,
    notifyEvery = null,
    status = null,
  ) => {
    try {
      const payload = { alertId };
      if (notifyEvery !== null) payload.notifyEvery = notifyEvery;
      if (status !== null) payload.status = status;

      const res = await axios.post(`${API_BASE_URL}updateJobAlert`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const modal = document.getElementById(`editAlertModal-${alertId}`);
        if (modal) {
          const bsModal = window.bootstrap.Modal.getInstance(modal);
          if (bsModal) {
            bsModal.hide();
          }
        }
        toast.success("Job alert updated successfully!");
        fetchJobAlerts();
      } else {
        toast.error(res.data.message || "Failed to update alert");
      }
    } catch (err) {
      console.error("❌ Error updating alert:", err);
      toast.error("Error updating alert");
    }
  };

  // Delete alert
  const handleDeleteAlert = async (alertId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}deleteJobAlert`,
        { alertId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        const modal = document.getElementById(`editAlertModal-${alertId}`);
        if (modal) {
          const bsModal = window.bootstrap.Modal.getInstance(modal);
          if (bsModal) {
            bsModal.hide();
          }
        }
        toast.success("Alert deleted successfully!");
        setJobAlerts((prev) => prev.filter((a) => a._id !== alertId));
      } else {
        toast.error(res.data.message || "Failed to delete alert");
      }
    } catch (err) {
      console.error("❌ Error deleting alert:", err);
      toast.error("Error deleting alert");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Manage Job Application</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/candidate-dashboard">Home </Link>
              </li>
              <li className="item">
                <Link to="/candidate-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <Link to={`/manage-job-application?tab=${activeTab}`}>
                  <i className="fa-solid fa-angle-right" />
                  Manage Job Application
                </Link>
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}

          {/* mannage Job application section start here */}
          <section className="mannage-job-application-tab">
            <div className="company-detail-tab-info">
              {/* Nav tabs */}
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "applications" ? "active" : ""
                    }`}
                    onClick={() => handleTabChange("applications")}
                  >
                    Applications
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "saved-jobs" ? "active" : ""
                    }`}
                    onClick={() => handleTabChange("saved-jobs")}
                  >
                    Saved Jobs
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "job-alerts" ? "active" : ""
                    }`}
                    onClick={() => handleTabChange("job-alerts")}
                  >
                    Job Alerts
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "companies" ? "active" : ""
                    }`}
                    onClick={() => handleTabChange("companies")}
                  >
                    Companies
                  </button>
                </li>
              </ul>
            </div>
          </section>

          <section className="mannage-job-application-tab-description">
            {/* Tab panes */}
            <div className="tab-content">
              {activeTab === "applications" && (
                <div className="mannage-job-application-applied">
                  <div className="my-applications-heading-info">
                    <h2>My Applications</h2>
                    <p>
                      You can only withdraw an application within 48 hours
                      passed since the time you applied.
                    </p>
                  </div>

                  <div className="application-filter">
                    <h4>Check you applied job status</h4>
                    <select
                      className="form-select form-control"
                      aria-label="Filter by status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)} // ✅ update filter
                    >
                      <option value="">All</option>
                      <option value="Applied">Applied</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hired">Hired</option>
                      <option value="Withdrawn">Withdrawn</option>
                    </select>
                  </div>

                  {/* <div className="available-job-posts-box">
                    <div className="available-job-company-name-save-job">
                      <div className="available-job-company-name">
                        <Link to="/job-details">
                          <h4>
                            <img src="assets/images/icon/icon-26.png" /> Alibaba
                            Cloud
                          </h4>
                        </Link>
                      </div>
                      <div className="available-job-applied-withdraw">
                        <div className="job-applied-details">
                          <h5>
                            <i className="fa-solid fa-square-check" />
                            Applied
                          </h5>
                        </div>
                        <div className="job-withdraw-details">
                          <a
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          >
                            <i className="fa-solid fa-square-xmark" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <Link to="/job-details">
                      <div className="available-job-type-details">
                        <h5>
                          Alibaba Cloud-Facility Operation Manager-Paris, France
                        </h5>
                        <ul>
                          <li>
                            <i className="fa-regular fa-calendar" /> 3 hours ago
                          </li>
                          <li>
                            <i className="fa-regular fa-file" /> 5 Years
                          </li>
                          <li>
                            <i className="fa-regular fa-user" /> Full time
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" /> Paris
                          </li>
                          <li>
                            <i className="fa-regular fa-file" /> Information
                            Systems / Networks
                          </li>
                          <li>
                            <i className="fa-solid fa-users" /> Available: 3
                          </li>
                        </ul>
                      </div>
                    </Link>
                  </div> */}

                  {/* Application List */}
                  {applications.length === 0 ? (
                    <p className="text-center py-5 text-gray-500">
                      No applications found.
                    </p>
                  ) : (
                    applications.map((app) => {
                      const job = app?.jobId;
                      const company = job?.companyId;

                      return (
                        <div className="available-job-posts-box" key={app._id}>
                          <div className="available-job-company-name-save-job">
                            <div className="available-job-company-name">
                              <Link
                                to={`/job-details/${job?._id}`}
                                state={{
                                  from: `/manage-job-application?tab=${activeTab}`,
                                }}
                              >
                                <h4>
                                  <img
                                    crossOrigin="anonymous"
                                    src={
                                      company?.logo
                                        ? `${API_IMAGE_URL}${company.logo}`
                                        : "assets/images/dashboard/images1.png"
                                    }
                                    alt={company?.brandName || "Company Logo"}
                                  />{" "}
                                  {company?.brandName || "N/A"}
                                </h4>
                              </Link>
                            </div>

                            <div className="available-job-applied-withdraw">
                              <div className="job-applied-details">
                                <h5>
                                  <i className="fa-solid fa-square-check" />{" "}
                                  {/* {app?.status === "Withdrawn"
                                    ? "Withdrawn"
                                    : "Applied"} */}
                                  {app?.status}
                                </h5>
                              </div>

                              {/* Show Withdraw ONLY if status is Applied */}
                              {app?.status === "Applied" && (
                                <div className="job-withdraw-details">
                                  <a
                                    href="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                    onClick={() => handleWithdrawClick(app._id)}
                                  >
                                    <i className="fa-solid fa-square-xmark" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          <Link
                            to={`/job-details/${job?._id}`}
                            state={{
                              from: `/manage-job-application?tab=${activeTab}`,
                            }}
                          >
                            <div className="available-job-type-details">
                              <h5>
                                {company?.brandName} - {job?.jobTitle}
                              </h5>
                              <ul>
                                <li>
                                  <i className="fa-regular fa-calendar" />{" "}
                                  {moment(job?.createdAt).fromNow()}
                                </li>
                                <li>
                                  <i className="fa-regular fa-user" />{" "}
                                  {job?.employmentType?.name || "N/A"}{" "}
                                </li>
                                <li>
                                  <i className="fa-solid fa-location-dot" />{" "}
                                  {job?.city?.join(", ") || company?.city}
                                </li>
                                <li>
                                  <i className="fa-regular fa-file" />{" "}
                                  {job?.jobCategory?.name || "N/A"}
                                </li>
                                <li>
                                  <i className="fa-solid fa-users" /> Available:{" "}
                                  {job?.availablePosts || 0}
                                </li>
                              </ul>
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  )}
                  {/* <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h4 className="modal-title" id="exampleModalLabel">
                            Withdraw Your Application
                          </h4>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>
                        <div className="modal-body">
                          <div className="job-withdraw-details-from">
                            <h4>Withdraw Your Application</h4>
                            <p>
                              With respect to the jobseeker experience, we would
                              like to know why you are withdrawing your
                              application.
                            </p>
                            <span>
                              <input
                                type="radio"
                                id="html"
                                name="fav_language"
                                defaultValue="HTML"
                              />{" "}
                              <label htmlFor="html">Other reason</label>
                            </span>
                            &nbsp;{" "}
                            <span>
                              <input
                                type="radio"
                                id="css"
                                name="fav_language"
                                defaultValue="CSS"
                              />{" "}
                              <label htmlFor="css">Applied by mistake</label>
                            </span>
                            <h5>Comments</h5>
                            <textarea
                              className="form-control"
                              placeholder="Write Brief Bio Or Introduction"
                              rows={3}
                              defaultValue={""}
                            />
                            <div className="understand-info-area">
                              <input
                                type="checkbox"
                                id="vehicle1"
                                name="vehicle1"
                                defaultValue="Bike"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                I understand that my personal data might have
                                already been processed by the Employer of this
                                job post.
                              </label>
                            </div>
                            <div className="job-withdraw-details-withdraw-cancel-btn">
                              <a href="#" className="default-btn btn">
                                Yes, Withdraw
                              </a>
                              <a href="#" className="default-btn btn">
                                Cancel
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <h5>
                            <i className="fa-solid fa-clock" /> Disclaimer
                          </h5>
                          <p>
                            The reason of your withdrawal will only be visible
                            to LesJeudis team for research purposes and no
                            Employer will be notified.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* Withdraw Modal */}
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
                          <h4 className="modal-title" id="withdrawModalLabel">
                            Withdraw Your Application
                          </h4>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>

                        <div className="modal-body">
                          <div className="job-withdraw-details-from">
                            <p>
                              With respect to the jobseeker experience, we would
                              like to know why you are withdrawing your
                              application.
                            </p>

                            <div>
                              <span>
                                <input
                                  type="radio"
                                  id="reason1"
                                  name="reason"
                                  value="Other reason"
                                  checked={reason === "Other reason"}
                                  onChange={(e) => setReason(e.target.value)}
                                />
                                &nbsp;
                                <label htmlFor="reason1"> Other reason</label>
                              </span>
                              &nbsp;&nbsp;
                              <span>
                                <input
                                  type="radio"
                                  id="reason2"
                                  name="reason"
                                  value="Applied by mistake"
                                  checked={reason === "Applied by mistake"}
                                  onChange={(e) => setReason(e.target.value)}
                                />
                                &nbsp;
                                <label htmlFor="reason2">
                                  {" "}
                                  Applied by mistake
                                </label>
                              </span>
                            </div>

                            <h5>Comments</h5>
                            <textarea
                              className="form-control"
                              placeholder="Write a short note (optional)"
                              rows={3}
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                            />

                            <div className="understand-info-area mt-3">
                              <input
                                type="checkbox"
                                id="consent"
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                              />
                              <label htmlFor="consent" className="ms-2">
                                I understand that my personal data might have
                                already been processed by the Employer of this
                                job post.
                              </label>
                            </div>

                            <div className="job-withdraw-details-withdraw-cancel-btn mt-3">
                              <button
                                onClick={handleWithdrawSubmit}
                                className="default-btn btn btn-danger"
                                disabled={loading}
                              >
                                {loading ? "Withdrawing..." : "Yes, Withdraw"}
                              </button>
                              <button
                                className="default-btn btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="modal-footer">
                          <h5>
                            <i className="fa-solid fa-clock" /> Disclaimer
                          </h5>
                          <p>
                            The reason for your withdrawal will only be visible
                            to our team for research purposes and no Employer
                            will be notified.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "saved-jobs" && (
                <div>
                  <div className="my-applications-heading-info">
                    <h2>Saved job</h2>
                    <p className="text-sm text-gray-400">
                      Browse jobs and save the ones you like to see them here.
                    </p>
                  </div>
                  <div className="mannage-job-application-saved-job">
                    {loading ? (
                      <p className="text-center">Loading saved jobs...</p>
                    ) : savedJobs?.length > 0 ? (
                      savedJobs?.map((job) => {
                        const jobData = job.jobId || job; // some APIs return nested job info
                        return (
                          <div
                            key={jobData._id}
                            className="available-job-posts-box mb-3"
                          >
                            <Link
                              to={`/job-details/${jobData._id}`}
                              state={{
                                from: `/manage-job-application?tab=${activeTab}`,
                              }}
                            >
                              <div className="available-job-company-name-save-job">
                                <div className="available-job-company-name">
                                  <h4>
                                    <img
                                      crossorigin="anonymous"
                                      src={
                                        jobData?.companyId?.logo
                                          ? `${API_IMAGE_URL}${jobData?.companyId?.logo}`
                                          : "assets/images/dashboard/images1.png"
                                      }
                                      alt="Company Logo"
                                    />{" "}
                                    {jobData?.companyId?.brandName ||
                                      "Unknown Company"}
                                  </h4>
                                </div>
                                <div className="available-job-save-job">
                                  <i
                                    className="fa-solid fa-heart"
                                    style={{ color: "red" }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSaveJob(job?.jobId?._id);
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="available-job-type-details">
                                <h5>{jobData?.jobTitle}</h5>
                                <p>{jobData?.shortDescription}</p>
                                <ul>
                                  <li>
                                    <i className="fa-regular fa-calendar" />{" "}
                                    {moment(jobData?.createdAt).fromNow()}
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file" />{" "}
                                    {jobData?.jobCategory?.name || "N/A"}
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-user" />{" "}
                                    {jobData?.employmentType?.name || "N/A"}
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-location-dot" />{" "}
                                    {jobData?.city?.join(", ") ||
                                      jobData?.companyId?.city}
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-users" />{" "}
                                    Available: {jobData?.availablePosts || 0}
                                  </li>
                                </ul>
                              </div>
                            </Link>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center py-5 text-gray-500">
                        No saved jobs found.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "job-alerts" && (
                <div>
                  <div className="my-applications-heading-info">
                    <h2>Job Alerts</h2>
                    <p>
                      Receive email notifications for your saved searches so you
                      don’t miss any new job posts!
                    </p>
                  </div>

                  <div className="mannage-job-application-notification">
                    {loading ? (
                      <p>Loading job alerts...</p>
                    ) : jobAlerts.length === 0 ? (
                      <p className="text-center">No job alerts found.</p>
                    ) : (
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th className="job-notification-info">
                              Job Notification
                            </th>
                            <th>Status</th>
                            <th>Notify Me</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobAlerts.map((alert, index) => (
                            <tr key={alert._id}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="mannage-notification-job-application">
                                  <div className="available-job-posts-box">
                                    <div className="available-job-company-name-save-job">
                                      <div className="available-job-company-name">
                                        <h4>
                                          {/* <Link
                                            to="/job-search"
                                            state={{ alert }}
                                            style={{
                                              textDecoration: "none",
                                              color: "inherit",
                                            }}
                                          > */}
                                          {alert?.alertName || "N/A"}
                                          {/* </Link> */}
                                        </h4>
                                      </div>
                                    </div>
                                    <div className="available-job-type-details">
                                      <p>
                                        {alert?.notifyEvery
                                          ? alert.notifyEvery
                                          : "Not specified"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div className="mannage-job-notification-status">
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={alert.status === "Active"} // ✅ convert string to boolean
                                      onChange={() =>
                                        handleToggleStatus(
                                          alert._id,
                                          alert.status === "Active"
                                            ? "Inactive"
                                            : "Active",
                                        )
                                      }
                                    />
                                    <span className="slider round" />
                                  </label>
                                </div>
                              </td>

                              {/* Inside your table row mapping */}
                              <td>
                                <div className="mannage-job-notification-icon-popup-modal">
                                  <div className="mannage-job-notification-icon">
                                    <a
                                      href="#"
                                      data-bs-toggle="modal"
                                      data-bs-target={`#editAlertModal-${alert._id}`}
                                      onClick={() =>
                                        setSelectedNotify((prev) => ({
                                          ...prev,
                                          [alert._id]:
                                            alert.notifyEvery || "Just save", // prefill
                                        }))
                                      }
                                    >
                                      <i className="fa-solid fa-pencil" />
                                    </a>
                                  </div>

                                  {/* Modal */}
                                  <div
                                    className="modal fade"
                                    id={`editAlertModal-${alert._id}`} // matches the trigger
                                    data-bs-backdrop="static"
                                    data-bs-keyboard="false"
                                    tabIndex={-1}
                                    aria-labelledby={`editAlertLabel-${alert._id}`}
                                    aria-hidden="true"
                                  >
                                    <div className="modal-dialog">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <h1
                                            className="modal-title fs-5"
                                            id={`editAlertLabel-${alert._id}`}
                                          >
                                            Set job alerts notification
                                          </h1>
                                          <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                          />
                                        </div>

                                        <div className="modal-body">
                                          {/*  <div className="mannage-job-notification-info">
                                            {[
                                              "1 day",
                                              "3 days",
                                              "week",
                                              "month",
                                              "Just save",
                                            ].map((freq) => (
                                              <span
                                                key={freq}
                                                style={{ marginRight: "10px" }}
                                              >
                                                <input
                                                  type="radio"
                                                  id={`${freq}-${alert._id}`}
                                                  name={`notify-${alert._id}`}
                                                  value={freq}
                                                  checked={
                                                    selectedNotify[
                                                      alert._id
                                                    ] === freq
                                                  }
                                                  onChange={(e) =>
                                                    setSelectedNotify(
                                                      (prev) => ({
                                                        ...prev,
                                                        [alert._id]:
                                                          e.target.value,
                                                      })
                                                    )
                                                  }
                                                />
                                                <label
                                                  htmlFor={`${freq}-${alert._id}`}
                                                >
                                                  {freq}
                                                </label>
                                              </span>
                                            ))}
                                          </div> */}
                                          <div className="mannage-job-notification-info">
                                            {[
                                              "1 day",
                                              "3 days",
                                              "week",
                                              "month",
                                              "Just save",
                                            ].map((freq) => {
                                              // Capitalize only for display
                                              const labelText =
                                                freq.charAt(0).toUpperCase() +
                                                freq.slice(1);
                                              return (
                                                <span
                                                  key={freq}
                                                  style={{
                                                    marginRight: "10px",
                                                  }}
                                                >
                                                  <input
                                                    type="radio"
                                                    id={`${freq}-${alert._id}`}
                                                    name={`notify-${alert._id}`}
                                                    value={freq} // API value stays same
                                                    checked={
                                                      selectedNotify[
                                                        alert._id
                                                      ] === freq
                                                    }
                                                    onChange={(e) =>
                                                      setSelectedNotify(
                                                        (prev) => ({
                                                          ...prev,
                                                          [alert._id]:
                                                            e.target.value,
                                                        }),
                                                      )
                                                    }
                                                  />
                                                  <label
                                                    htmlFor={`${freq}-${alert._id}`}
                                                  >
                                                    {labelText}
                                                  </label>
                                                </span>
                                              );
                                            })}
                                          </div>
                                        </div>

                                        <div className="modal-footer">
                                          <button
                                            type="button"
                                            className="default-btn btn"
                                            onClick={() =>
                                              handleUpdateAlert(
                                                alert._id,
                                                selectedNotify[alert._id],
                                                alert.status,
                                              )
                                            }
                                          >
                                            Save
                                          </button>
                                          <button
                                            type="button"
                                            className="default-btn btn"
                                            data-bs-dismiss="modal"
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="button"
                                            className="default-btn btn"
                                            onClick={() =>
                                              handleDeleteAlert(alert._id)
                                            }
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "companies" && (
                <div>
                  <div className="my-applications-heading-info">
                    <h2>Company List</h2>
                  </div>
                  <div className="mannage-job-notification-companies-list">
                    <div className="row">
                      {companies?.companies?.length > 0 ? (
                        companies?.companies?.map((item) => {
                          const company = item?.companyId;
                          return (
                            <div
                              className="col-lg-4 col-md-4"
                              key={company?._id}
                            >
                              <div className="available-company-box-info">
                                {/* ✅ Company Logo */}
                                <div className="available-company-logo">
                                  <img
                                    src={
                                      company?.logo
                                        ? `${API_IMAGE_URL}${company?.logo}`
                                        : "/jobPortal/assets/images/partner-logo/partner-logo-2.png"
                                    }
                                    crossorigin="anonymous"
                                    alt={company?.brandName || "Company Logo"}
                                  />
                                </div>

                                {/* ✅ Background/cover image (optional placeholder) */}
                                <div className="available-company-img">
                                  <img
                                    crossorigin="anonymous"
                                    src={
                                      company?.coverPhoto
                                        ? `${API_IMAGE_URL}${company?.coverPhoto}`
                                        : "/jobPortal/assets/images/company/company-img-1.jpg"
                                    }
                                    alt={company?.brandName || "Company Cover"}
                                  />
                                </div>

                                {/* ✅ Company Info */}
                                <div className="available-company-content">
                                  <h4>
                                    {company?.brandName || "Unnamed Company"}
                                  </h4>
                                  <ul>
                                    <li>
                                      <i className="fa-solid fa-location-dot" />{" "}
                                      {company?.city ||
                                        "Location not available"}
                                    </li>
                                    <li>
                                      <i className="fa-solid fa-user" />{" "}
                                      {company?.numberOfEmployees || "N/A"}
                                    </li>
                                    <li>
                                      <i className="fa-solid fa-globe" />{" "}
                                      {company?.industry?.name ||
                                        "Industry not specified"}
                                    </li>
                                  </ul>
                                </div>

                                {/* ✅ View Button */}
                                <div className="available-company-btn">
                                  <button
                                    className="default-btn btn"
                                    onClick={() =>
                                      handleViewCompany(
                                        company?._id,
                                        `/manage-job-application?tab=${activeTab}`,
                                      )
                                    }
                                  >
                                    View Company
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center mt-4">
                          No companies available.
                        </p>
                      )}
                    </div>
                  </div>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mt: 3 }}
                  >
                    <Pagination
                      count={companies?.totalPages || 1}
                      page={pageNumber}
                      onChange={(e, value) => setPageNumber(value)}
                      variant="outlined"
                      shape="rounded"
                      color="secondary"
                      siblingCount={2}
                      boundaryCount={1}
                    />

                    <Select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(e.target.value);
                        setPageNumber(1); // reset to first page
                      }}
                      size="small"
                    >
                      <MenuItem value={15}>15 / page</MenuItem>
                      <MenuItem value={25}>25 / page</MenuItem>
                      <MenuItem value={50}>50 / page</MenuItem>
                      <MenuItem value={100}>100 / page</MenuItem>
                    </Select>
                  </Stack>
                </div>
              )}
            </div>
          </section>
          {/*mannage Job application end here*/}
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

export default ManagesJobApplication;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination"; // MUI one
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
const Employers = () => {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const { t, i18n } = useTranslation("global");
  const [companies, setCompanies] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // For searching
  const [options, setOptions] = useState([]); // All industries from API
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // ✅ Fetch Company List (with pagination + filters)
  const getCompanyList = async (
    industryIds = [],
    page = 1,
    limit = pageSize,
  ) => {
    try {
      const params = {
        page,
        limit,
      };

      if (industryIds.length > 0) {
        params.industry = industryIds.join(",");
      }

      const res = await axios.get(`${API_BASE_URL}GetCompanyDetailsList`, {
        params,
      });

      if (res.data.success) {
        setCompanies(res.data);
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
  };

  // ✅ Re-fetch when pagination or filters change
  useEffect(() => {
    const selectedIndustryIds = selected.map((i) => i._id);
    getCompanyList(selectedIndustryIds, pageNumber, pageSize);
  }, [pageNumber, pageSize, selected]);

  const totalPages = companies?.totalPages;
  useEffect(() => {
    getCompanyList();
  }, []);
  const handleViewCompany = (company, from) => {
    navigate(`/${company.slug}`, {
      state: { companyId: company._id, from }, // ✅ keep ID hidden
    });
  };
  const clearAll = () => {
    setSelected([]);
    setSearchTerm("");
    getCompanyList(); // Fetch all companies
  };
  const removeTag = (_id) => {
    const newSelected = selected?.filter((i) => i._id !== _id);
    setSelected(newSelected);

    // Refetch companies based on updated industries
    const selectedIndustryIds = newSelected?.map((i) => i._id);
    getCompanyList(selectedIndustryIds);
  };
  const filteredOptions = options.filter((industry) =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}getIndustries`);
        if (res.data.success && Array.isArray(res.data.industries)) {
          setOptions(res.data.industries);
        }
      } catch (err) {
        console.error("Error fetching industries:", err);
      }
    };
    fetchIndustries();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const toggleOption = (industry) => {
    let newSelected = [];
    if (selected.some((i) => i._id === industry._id)) {
      newSelected = selected.filter((i) => i._id !== industry._id);
    } else {
      newSelected = [...selected, industry];
    }

    setSelected(newSelected);

    // Refetch companies based on updated industries
    const selectedIndustryIds = newSelected.map((i) => i._id);
    getCompanyList(selectedIndustryIds);
  };
  console.log(selected);
  return (
    <>
      <Helmet>
        {/* Basic SEO */}
        <title>Companies | Job Portal</title>
        <meta
          name="description"
          content="Browse top companies, explore industries and find your dream employer."
        />

        <link rel="canonical" href={window.location.href} />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:title" content="Companies | Job Portal" />
        <meta
          property="og:description"
          content="Browse top companies and explore job opportunities."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:image"
          content="/jobPortal/assets/images/banner/inner-banner-img.jpg"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Companies | Job Portal" />
        <meta
          name="twitter:description"
          content="Find companies hiring near you."
        />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Company Listings",
            description: "List of companies available on Job Portal",
            url: window.location.href,
            numberOfItems: companies?.companies?.length || 0,
            itemListElement:
              companies?.companies?.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item?.companyId?.brandName,
                url: `${window.location.origin}/jobPortal/${item?.companyId?.slug}`,
              })) || [],
          })}
        </script>
      </Helmet>
      <section className="inner-banners-info-area">
        <div className="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="breadcrumb Img"
          />
        </div>
        <div className="inner-banners-title-info">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="inner-page-banner-title">
                  <h2>{t("header.companies")}</h2>
                  <ul>
                    <li className="menu-divide-arrow">
                      <Link to="/">{t("header.home")}</Link>
                    </li>
                    <li>{t("header.companies")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="companies-list-filter-info-area">
        <div className="container">
          <div className="row">
            {/* Sidebar Filter */}
            <div className="col-lg-3 col-sm-3">
              <div className="job-filter-main-info">
                <div className="job-filter-heading-area">
                  <h4>
                    <Link to="/jobs">
                      <i className="fa-regular fa-file"></i>
                      {t("header.job_offers")}
                    </Link>
                  </h4>
                </div>
                <div className="divder-line-info"></div>
                <div className="job-filter-heading-area job-filter-cancel-heading">
                  <h4>
                    <Link to="/companies">
                      <i className="fa-regular fa-building"></i>
                      {t("header.companies")}
                    </Link>
                  </h4>
                </div>
                <div className="divder-line-info"></div>

                <div className="job-filter-search-area" ref={wrapperRef}>
                  <div className="job-filter-heading-cancel">
                    <div className="job-filter-heading">
                      <h4>
                        <i className="fas fa-building" />
                        {t("header.industry_sector")}
                      </h4>
                    </div>
                    <div
                      className="job-filter-cancel-heading"
                      onClick={clearAll}
                    >
                      <h4>{t("header.Clear")} </h4>
                    </div>
                  </div>

                  <div className="job-filter-select-info">
                    <div className="multi-select-container">
                      <div
                        className="selected-items"
                        onClick={() => setShowOptions(true)}
                      >
                        {/* Show first 2 selected industries and +X more if any */}
                        {selected?.map((industry) => (
                          <span key={industry?._id} className="tag">
                            {industry?.name}
                            <i
                              className="fa-solid fa-xmark"
                              style={{
                                cursor: "pointer",
                                marginLeft: "6px",
                              }}
                              onClick={() => removeTag(industry._id)}
                            />
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder={t("header.Search_industries")}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onFocus={() => setShowOptions(true)}
                        />
                      </div>

                      {showOptions && (
                        <ul className="options-list">
                          {filteredOptions.length > 0 ? (
                            filteredOptions.map((industry) => (
                              <li
                                key={industry._id}
                                onClick={() => toggleOption(industry)}
                                className={
                                  selected.some((i) => i._id === industry._id)
                                    ? "selected"
                                    : ""
                                }
                              >
                                {industry?.name}
                                {selected.some(
                                  (i) => i._id === industry._id,
                                ) && <span className="checkmark">✔</span>}
                              </li>
                            ))
                          ) : (
                            <li className="no-options">
                              {" "}
                              {t("header.no_industries")}
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Companies List */}
            <div className="col-lg-9 col-md-9">
              <div className="available-company-list-info">
                <div className="available-company-heading">
                  <h4>
                    <i className="fa-solid fa-building" />
                    {companies?.totalCompanies}{" "}
                    {t("header.available_companies")}
                  </h4>
                  <div className="job-alert-tag-btn">
                    <div className="filter-tag-info-area">
                      {selected.length > 0 &&
                        selected.map((industry) => (
                          <span key={industry._id} className="filter-tag">
                            {industry.name}
                            <i
                              className="fa-solid fa-xmark"
                              style={{
                                cursor: "pointer",
                                marginLeft: "6px",
                              }}
                              onClick={() => removeTag(industry._id)}
                            />
                          </span>
                        ))}
                    </div>
                    {/* ✅ Show buttons only if any filter is selected */}
                  </div>
                </div>
                <div className="available-company-list-area">
                  <div className="row">
                    {companies?.companies?.length > 0 ? (
                      companies?.companies?.map((item) => {
                        const company = item?.companyId;
                        return (
                          <div className="col-lg-4 col-md-4" key={company?._id}>
                            <div className="available-company-box-info">
                              {/* ✅ Company Logo */}
                              <div className="available-company-logo">
                                <img
                                  src={
                                    company?.logo
                                      ? `${API_IMAGE_URL}${company?.logo}`
                                      : "/jobPortal/assets/images/partner-logo/partner-logo-2.png"
                                  }
                                  crossorigin="anonymous"
                                  alt={company?.brandName || "Company Logo"}
                                />
                              </div>

                              {/* ✅ Background/cover image (optional placeholder) */}
                              <div className="available-company-img">
                                <img
                                  crossorigin="anonymous"
                                  src={
                                    company?.coverPhoto
                                      ? `${API_IMAGE_URL}${company?.coverPhoto}`
                                      : "/jobPortal/assets/images/company/company-img-1.jpg"
                                  }
                                  alt={company?.brandName || "Company Cover"}
                                />
                              </div>

                              {/* ✅ Company Info */}
                              <div className="available-company-content">
                                <h4>
                                  {company?.brandName || "Unnamed Company"}
                                </h4>
                                <ul>
                                  <li>
                                    <i className="fa-solid fa-location-dot" />{" "}
                                    {company?.city || "Location not available"}
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-user" />{" "}
                                    {company?.numberOfEmployees || "N/A"}
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-globe" />{" "}
                                    {company?.industry?.name ||
                                      "Industry not specified"}
                                  </li>
                                </ul>
                              </div>

                              {/* ✅ View Button */}
                              <div className="available-company-btn">
                                <button
                                  className="default-btn btn"
                                  onClick={() =>
                                    handleViewCompany(company, "/companies")
                                  }
                                >
                                  {t("header.viewCompany")}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center mt-4">
                        {t("header.no_companies")}
                      </p>
                    )}
                  </div>
                </div>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ mt: 3 }}
                >
                  <Pagination
                    count={companies?.totalPages || 1}
                    page={pageNumber}
                    onChange={(e, value) => setPageNumber(value)}
                    variant="outlined"
                    shape="rounded"
                    color="secondary"
                    siblingCount={2}
                    boundaryCount={1}
                  />

                  <Select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(e.target.value);
                      setPageNumber(1); // reset to first page
                    }}
                    size="small"
                  >
                    <MenuItem value={15}>15 / {t("header.page")}</MenuItem>
                    <MenuItem value={25}>25 / {t("header.page")}</MenuItem>
                    <MenuItem value={50}>50 /{t("header.page")}</MenuItem>
                    <MenuItem value={100}>100 /{t("header.page")}</MenuItem>
                  </Select>
                </Stack>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Employers;
