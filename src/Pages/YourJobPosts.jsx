import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Typography, Card, Divider, Box } from "@mui/material";
import { API_IMAGE_URL } from "../Url/Url";

function YourJobPosts() {
  const navigate = useNavigate();
  // const [isPost, setIsPost] = useState("");
  const [cateroryList, setCategoryList] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [activeStatus, setActiveStatus] = useState("published");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewData, setViewData] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [countryList, setCountryList] = useState([]);

  const handleCreate = async () => {
    if (!jobTitle || !jobCategory) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const tempTitle = jobTitle;
      const tempCategory = jobCategory;

      const response = await axios.post(
        `${API_BASE_URL}createJob`,
        { jobTitle: tempTitle, jobCategory: tempCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Job Created:", response.data);
      const createdJob = response.data.job;
      toast.success("Job created successfully!");

      // Clear inputs AFTER successful navigation
      setJobTitle("");
      setJobCategory("");

      const modalElement = document.getElementById("exampleModal");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();

      // If you want to copy the draft here:
      // await copyDraft(createdJob._id, tempTitle, tempCategory);

      navigate(`/job-details-form/${createdJob._id}`, {
        state: { jobData: createdJob },
      });
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.classList.contains("menu-icon")) {
        const parent = e.target.closest(".job-short-detail-box");
        if (!parent) return;
        const thisMenu = parent.querySelector(".job-short-detail-crud-menu");
        document
          .querySelectorAll(".job-short-detail-crud-menu")
          .forEach((menu) => {
            if (menu !== thisMenu) {
              menu.classList.remove("show");
            }
          });
        if (thisMenu) {
          thisMenu.classList.toggle("show");
        }
      } else {
        document
          .querySelectorAll(".job-short-detail-crud-menu")
          .forEach((menu) => menu.classList.remove("show"));
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

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
      setCountryList(response.data.countries || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };
  useEffect(() => {
    fetchCountryList();
  }, []);

  // Fetch jobs based on status
  const fetchJobs = async (status) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}getRecruiterJobList?status=${status}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs(res.data.jobs || []);
      console.log(res.data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryList();
    fetchJobs(activeStatus);
  }, [activeStatus]);

  const getEmptyMessage = () => {
    switch (activeStatus) {
      case "published":
        return "There Are No Published Job Posts.";
      case "draft":
        return "There Are No Draft Job Posts.";
      case "expired":
        return "There Are No Expired Job Posts.";
      case "unpublished":
        return "There Are No Unpublished Job Posts.";
      case "archived":
        return "There Are No Archived Job Posts.";
      case "all":
      default:
        return "No Jobs Found.";
    }
  };

  const jobUpdate = (job) => {
    navigate(`/job-details-form/${job._id}`, {
      state: { jobData: job },
    });
  };

  const copyDraft = async (id, title, category) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to log in first.");
        return;
      }

      const data = {
        jobTitle: title,
        jobCategory: category,
      };
      console.log("Job title:-", title);
      console.log("Job Category:-", category);
      const response = await axios.post(
        `${API_BASE_URL}jobs/${id}/copy-as-draft`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // ✅ Show success message
      toast.success(response.data?.message || "Draft copied successfully!");
      setMenuOpen(false);
      fetchJobs(activeStatus);
    } catch (error) {
      console.error("Copy Draft Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to copy draft. Try again."
      );
    }
  };

  const archiveData = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to log in first.");
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}jobs/${id}/archived`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // ✅ Show success message
      toast.success(response.data?.message || "Archived Job successfully!");
      setMenuOpen(false);
      fetchJobs(activeStatus);
    } catch (error) {
      console.error("Archived Job Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to Archived Job. Try again."
      );
    }
  };

  const handleViewOpen = () => setViewOpen(true);
  const handleViewClose = () => setViewOpen(false);

  // Handle Particular Data
  const handleView = (id) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}getJobById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setViewData(response.data.data);
        console.log(response.data.data);
        handleViewOpen();
        setMenuOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Your Job Posts</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  {" "}
                  <i className="fa-solid fa-angle-right" /> Dashboard{" "}
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Your Job Posts
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* employer dashboard  start here */}
          <section className="employer-dashboard-info-area">
            <div className="employer-dashboard-common-heading">
              <h2>Job Post Dashboard</h2>
            </div>
            <div className="employer-dashboard-box">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <a
                    className={`${activeStatus === "all" ? "active" : ""}`}
                    onClick={() => setActiveStatus("all")}
                  >
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fas fa-tasks"></i>
                      </div>
                      <div className="employer-box-content">
                        <h4>All Jobs Posted</h4>
                        <h5>30</h5>
                        <p>
                          <i className="fa-solid fa-arrow-up" /> 60% this week
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-md-4 mb-3">
                  <a
                    className={`${
                      activeStatus === "published" ? "active" : ""
                    }`}
                    onClick={() => setActiveStatus("published")}
                  >
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fa-solid fa-upload"></i>
                      </div>
                      <div className="employer-box-content">
                        <h4>Published Jobs</h4>
                        <h5>5</h5>
                        <p>
                          <i className="fa-solid fa-arrow-up" /> 50% this week
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-md-4 mb-3">
                  <a
                    className={`${activeStatus === "draft" ? "active" : ""}`}
                    onClick={() => setActiveStatus("draft")}
                  >
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fa-solid fa-pencil"></i>
                      </div>
                      <div className="employer-box-content">
                        <h4>Draft Job </h4>
                        <h5>1000</h5>
                        <p>
                          <i className="fa-solid fa-arrow-up" /> 15% this week
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-md-4 mb-3">
                  <a
                    className={`${activeStatus === "archived" ? "active" : ""}`}
                    onClick={() => setActiveStatus("archived")}
                  >
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fas fa-archive"></i>
                      </div>
                      <div className="employer-box-content">
                        <h4>Archived Job</h4>
                        <h5>0</h5>
                        <p>
                          <i className="fa-solid fa-arrow-up" /> 10% this week
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-md-4 mb-3">
                  <a
                    className={`${
                      activeStatus === "unpublished" ? "active" : ""
                    }`}
                    onClick={() => setActiveStatus("unpublished")}
                  >
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fas fa-file-word"></i>
                      </div>
                      <div className="employer-box-content">
                        <h4>Unpublished Job</h4>
                        <h5>0</h5>
                        <p>
                          <i className="fa-solid fa-arrow-up" /> 10% this week
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-md-4 mb-3">
                  <a
                    className={`${activeStatus === "expired" ? "active" : ""}`}
                    onClick={() => setActiveStatus("expired")}
                  >
                    <div className="employer-dashboard-box-icon-content">
                      <div className="employer-box-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="employer-box-content">
                        <h4>Expired Job</h4>
                        <h5>0</h5>
                        <p>
                          <i className="fa-solid fa-arrow-up" /> 10% this week
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>
          {/* employer dashboard end here */}
          {/* Your Job Posts Info*/}
          <div className="your-job-post-main-info">
            <div className="row">
              <div className="col-lg-3 col-sm-3">
                <div className="your-job-post-side-menu">
                  <div className="your-job-post-side-heading">
                    <ul className="nav nav-tabs" role="tablist">
                      <li
                        className="nav-item"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <a className="nav-link">
                          <i className="fa-solid fa-plus"></i> Create job
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/* Create Job Modal  */}
                  <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Create a job offer
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>
                        <div className="modal-body">
                          <div >
                            <div className="form-group">
                              <label>Job Title</label>
                              <span className="text-danger">*</span>
                              <input
                                className="form-control"
                                type="text"
                                placeholder="Job Title"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label>Job Category</label>
                              <span className="text-danger">*</span>
                              <select
                                className="form-select form-control"
                                value={jobCategory}
                                onChange={(e) => setJobCategory(e.target.value)}
                              >
                                <option value="">Select Category</option>
                                {cateroryList.map((list) => (
                                  <option value={list._id} key={list._id}>
                                    {list.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer text-center">
                          <button
                            type="button"
                            className="default-btn btn"
                            data-bs-dismiss="modal"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleCreate}
                            className="default-btn btn"
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeStatus === "all" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("all")}
                      >
                        <i className="fas fa-tasks"></i> All
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeStatus === "published" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("published")}
                      >
                        <i className="fa-solid fa-upload"></i> Published
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeStatus === "draft" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("draft")}
                      >
                        <i className="fa-solid fa-pencil"></i> Draft
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeStatus === "expired" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("expired")}
                      >
                        <i className="fas fa-calendar-alt"></i> Expired
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeStatus === "unpublished" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("unpublished")}
                      >
                        <i className="fas fa-file-word"></i> Unpublished
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeStatus === "archived" ? "active" : ""
                        }`}
                        onClick={() => setActiveStatus("archived")}
                      >
                        <i className="fas fa-archive"></i> Archived
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-9 col-md-9">
                <div className="your-job-post-detail-info">
                  <div className="tab-content">
                    {loading ? (
                      <p>Loading jobs...</p>
                    ) : jobs.length === 0 ? (
                      <div className="job-post-info-heading text-center">
                        <h2
                          style={{
                            alignItems: "center",
                          }}
                        >
                          {getEmptyMessage()}
                        </h2>
                      </div>
                    ) : (
                      jobs.map((job) => (
                        <div className="job-short-detail-box">
                          <div className="job-short-heading-crud">
                            <div className="job-short-detail-heading">
                              <h4>{job.jobTitle}</h4>
                            </div>
                            <span
                              style={{
                                padding: "5px 10px",
                                backgroundColor: "#f0f5f7",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                setMenuOpen((prev) =>
                                  prev === job._id ? null : job._id
                                )
                              }
                              className="job-short-detail-crud-info"
                            >
                              <i className=" fa-solid fa-ellipsis-vertical menu-icon "></i>
                            </span>

                            {menuOpen === job._id && (
                              <div className="job-short-detail-crud-menu">
                                <ul>
                                  <li onClick={() => jobUpdate(job)}>
                                    <i className="fa-solid fa-pencil cursor-pointer"></i>{" "}
                                    Edit
                                  </li>
                                  <li onClick={() => handleView(job._id)}>
                                    <i className="fa-regular fa-eye"></i>
                                    Preview
                                  </li>
                                  <li
                                    onClick={() =>
                                      copyDraft(
                                        job._id,
                                        job.jobTitle,
                                        job.jobCategory
                                      )
                                    }
                                  >
                                    <i
                                      className="fa-solid fa-file cursor-pointer"
                                      title="Copy as draft"
                                    ></i>{" "}
                                    Copy as draft
                                  </li>

                                  <li onClick={() => archiveData(job._id)}>
                                    <i className="fa-solid fa-box-archive cursor-pointer"></i>
                                    Archive
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="job-short-detail-tags">
                            <ul>
                              <li>
                                <i className="fa-solid fa-location-dot"></i>{" "}
                                {job.city?.join(", ") || "Not provided"}
                              </li>
                              <li>
                                <i className="fa-solid fa-calendar-days"></i>{" "}
                                {new Date(job.createdAt).toLocaleDateString()}
                              </li>
                              <li>
                                <i className="fa-solid fa-file-invoice"></i>{" "}
                                {job.employmentType?.name || "Not provided"}
                              </li>
                              <li>
                                <i className="fa-solid fa-user-plus"></i>{" "}
                                {job.remote || "Not provided"}
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))
                    )}
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

      {/* Modal for View Particular data */}
      <Modal open={viewOpen} onClose={handleViewClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            overflowY: "scroll",
            overflowX: "hidden",
            border: "2px solid none",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Job Details
          </Typography>

          <Box sx={{ mb: 3 }}>
            <div>
              <img
                src={
                  viewData?.jobDetails?.JobCoverPhoto
                    ? `${API_IMAGE_URL}${viewData?.jobDetails?.JobCoverPhoto}`
                    : "assets/images/dashboard/images1.png"
                }
                crossorigin="anonymous"
                alt="logo"
                style={{
                  width: "100px",
                  maxHeight: "100px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            </div>
          </Box>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography>
              <strong>Job Title:</strong>{" "}
              {viewData?.jobDetails?.jobTitle || "Not Provided"}
            </Typography>
            <Typography>
              <strong>Job Category:</strong>{" "}
              {viewData?.jobDetails?.jobCategory?.name || "Not Provided"}
            </Typography>
            <Typography>
              <strong>Employment Type:</strong>{" "}
              {viewData?.jobDetails?.employmentType || "Not Provided"}
            </Typography>
            <Typography>
              <strong>Minimum Level:</strong>{" "}
              {viewData?.jobDetails?.minimumLevel || "Not Provided"}
            </Typography>
            <Typography>
              <strong>Remote Type:</strong>{" "}
              {viewData?.jobDetails?.remote || "Not Provided"}
            </Typography>
            <Typography>
              <strong>Reference Id:</strong>{" "}
              {viewData?.jobDetails?.referenceId || "Not Provided"}
            </Typography>
            <Typography>
              <strong>City:</strong>
              {viewData?.jobDetails?.city?.join(",") == null
                ? viewData?.jobDetails?.companyId?.city?.join(",")
                : viewData.jobDetails.city?.join(", ") || "Not Provided"}
            </Typography>
            {/* <Typography>
              <strong>Region:</strong>
              {viewData?.jobDetails?.region == null
                ? viewData?.jobDetails?.companyId?.region
                : viewData.jobDetails.region || "null"}
            </Typography> */}
            <Typography>
              <p>
                <strong>Country:</strong>{" "}
                {countryList.find(
                  (country) => country._id === viewData?.jobDetails?.country
                )?.name || "Not provided"}
              </p>

              {/* {viewData?.jobDetails?.country == null
                ? viewData?.jobDetails?.companyId?.country
                : viewData.jobDetails.country || "null"} */}
            </Typography>
            <Typography>
              <strong>Status:</strong>{" "}
              {viewData?.jobDetails?.status || "Not Provided"}
            </Typography>
            <Typography>
              <strong>Enable External Apply:</strong>{" "}
              {viewData?.jobDetails?.enableExternalApply ? "Yes" : "No"}
            </Typography>
            {viewData?.jobDetails?.enableExternalApply && (
              <Typography>
                <strong>External Apply Link:</strong>{" "}
                {viewData?.jobDetails?.ExternalApplyLink || "Not Provided"}
              </Typography>
            )}
            <Typography>
              <strong>Confidential JobPost:</strong>{" "}
              {viewData?.jobDetails?.confidentialJobPost ? "Yes" : "No"}
            </Typography>
            <Typography>
              <strong>Enable Email Notification:</strong>{" "}
              {viewData?.jobDetails?.enableEmailNotification ? "Yes" : "No"}
            </Typography>
            <Typography>
              <strong>Enable Relevant Job:</strong>{" "}
              {viewData?.jobDetails?.enableRemovalRelevantJobs ? "Yes" : "No"}
            </Typography>
            <Typography>
              <strong>Min Salary:</strong>{" "}
              {viewData?.jobDetails?.privatJobDetails?.minSalary}
            </Typography>
            <Typography>
              <strong>Max Salary:</strong>{" "}
              {viewData?.jobDetails?.privatJobDetails?.maxSalary}
            </Typography>
            <Typography>
              <strong>Tags:</strong>
            </Typography>
            <ul>
              {viewData?.jobDetails?.tags?.map((item, index) => (
                <li key={index}>
                  <Typography>{item}</Typography>
                </li>
              ))}
            </ul>
            <Typography>
              <strong>Short Description:</strong>{" "}
              {viewData?.jobDetails?.shortDescription || "null"}
            </Typography>
            <Typography>
              <strong>Job Description:</strong>{" "}
              <p
                dangerouslySetInnerHTML={{
                  __html: viewData?.jobDetails?.jobDescription,
                }}
              />
              {/* {viewData?.jobDetails?.jobDescription || "null"} */}
            </Typography>
          </Card>

          {/* Close Button */}
          <Box textAlign="right" mt={3}>
            <button className="default-btn btn" onClick={handleViewClose}>
              Close
            </button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default YourJobPosts;
