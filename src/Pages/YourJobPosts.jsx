import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";

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

  const handleCreate = async () => {
    if (!jobTitle || !jobCategory) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}createJob`,
        {
          jobTitle: jobTitle,
          jobCategory: jobCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Job Created:", response.data);
      const createdJob = response.data.job;
      toast.success("Job created successfully!");
      // reset form
      setJobTitle("");
      setJobCategory("");
      // close modal manually
      const modalElement = document.getElementById("exampleModal");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      navigate(`/job-details-form/${createdJob._id}`, {
        state: { job: createdJob },
      });
      // navigate("/job-details-form", { state: { job: createdJob } });
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Failed to create job");
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

  const copyDraft = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}jobs/${id}/copy-as-draft`,
        {}
      );
    } catch (error) {
      console.error(error);
    }
  };

  // const handlePostClick = () => {
  //   setIsPost(true);
  // };

  // const handlePostCancel = () => {
  //   setIsPost(false);
  // };

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
                <Link to="/employer-dashboard">Home </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Your Job Posts
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* Start Manage Jobs Area */}
          {/* <div className="manage-jobs-box">
            <div className="job-listing-search-form job-search-info-area">
              <form>
                <div className="row g-0">
                  <div className="col-lg-3 col-sm-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Keywords / Job Title"
                      />
                      <i className="flaticon-portfolio" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="City Or Postcode"
                      />
                      <i className="flaticon-location" />
                    </div>
                  </div>
                  <div className="col-lg-4 col-sm-6">
                    <div className="form-group style">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Choose A Category</option>
                        {cateroryList.map((list) => (
                          <option value={list.name} key={list._id}>
                            {list.name}
                          </option>
                        ))}
                      </select>
                      <i className="flaticon-list" />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6">
                    <div className="search-btn">
                      <button type="submit" className="default-btn btn">
                        Find Jobs
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div> */}
          {/* End Manage Jobs Area */}
          {/* Your Job Posts Info*/}
          <div className="your-job-post-main-info">
            <div className="row">
              <div className="col-lg-3 col-sm-3">
                <div className="your-job-post-side-menu">
                  <div className="your-job-post-side-heading">
                    <h4>
                      <i className="fa-regular fa-file" /> Your Job Posts{" "}
                      <span
                        className="create-job-icon"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        <i
                          className="fa-solid fa-plus"
                          style={{ cursor: "pointer" }}
                        ></i>
                      </span>
                    </h4>
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
                          <div className="post-job-form-info">
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
                                  <option value={list.name} key={list._id}>
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
                            onClick={handleCreate}
                            className="default-btn btn"
                          >
                            Create
                          </button>
                          <button
                            type="button"
                            className="default-btn btn"
                            data-bs-dismiss="modal"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ul className="nav nav-tabs" role="tablist">
                    {/* <li className="nav-item">
                      <a
                        className="nav-link active"
                        data-bs-toggle="tab"
                        href="#menu1"
                      >
                        <i className="fas fa-tasks" /> Create New Job
                      </a>
                    </li> */}

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
                        <h2>{getEmptyMessage()}</h2>
                        <div className="post-job-next-btn">
                          <button
                            className="default-btn btn"
                            onClick={() => setActiveStatus("all")}
                          >
                            All Jobs
                          </button>
                        </div>
                      </div>
                    ) : (
                      jobs.map((job) => (
                        <div className="job-short-detail-box">
                          <div className="job-short-heading-crud">
                            <div className="job-short-detail-heading">
                              <h4>{job.jobTitle}</h4>
                            </div>
                            <div className="job-short-detail-crud-info">
                              <a href="#" className="job-short-crud-btn">
                                <i className="fa-solid fa-pencil"></i> Draft
                              </a>
                              <i
                                className="fa-solid fa-ellipsis-vertical menu-icon"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  setMenuOpen((prev) =>
                                    prev === job._id ? null : job._id
                                  )
                                }
                              ></i>
                            </div>
                            {menuOpen === job._id && (
                              <div className="job-short-detail-crud-menu">
                                <ul>
                                  <li onClick={() => jobUpdate(job)}>
                                    <i className="fa-solid fa-pencil"></i> Edit
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-eye"></i>
                                    Preview
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-file"></i> Copy as
                                    draft
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-box-archive"></i>
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
                                {job.city || "null"}
                              </li>
                              <li>
                                <i className="fa-solid fa-calendar-days"></i>{" "}
                                {new Date(job.createdAt).toLocaleDateString()}
                                {/* {job.createdAt} */}
                              </li>
                              <li>
                                <i className="fa-solid fa-file-invoice"></i>{" "}
                                {job.employmentType || "null"}
                              </li>
                              <li>
                                <i className="fa-solid fa-user-plus"></i>{" "}
                                {job.remote || "null"}
                              </li>
                            </ul>
                          </div>
                        </div>
                      ))
                    )}
                    {/* <div id="menu1" className="tab-pane active">
                      {!isPost && (
                        <div className="job-post-info-heading">
                          <h2>There Are No Created Any Job Posts.</h2>
                          <div className="post-job-next-btn">
                            <a
                              href="#"
                              className="default-btn btn"
                              onClick={handlePostClick}
                            >
                              Create Job
                            </a>
                          </div>
                        </div>
                      )}
                      {isPost && (
                        <>
                          <div className="your-job-posts-form-heading mt-5">
                            <h4>
                              <i className="fa-regular fa-file" /> Create New
                              job post
                            </h4>
                          </div>
                        </>
                      )}
                    </div>
                    <div id="menu2" className="tab-pane fade">
                      <div className="job-post-info-heading">
                        <h2>There Are No Published Job Posts.</h2>
                        <div className="post-job-next-btn">
                          <a href="#" className="default-btn btn">
                            All Jobs
                          </a>
                        </div>
                      </div>
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>

                          <div className="job-short-detail-crud-info">
                            <a href="#" className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil"></i> Draft
                            </a>
                            <i
                              className="fa-solid fa-ellipsis-vertical menu-icon"
                              style={{ cursor: "pointer" }}
                            ></i>
                          </div>

                          <div className="job-short-detail-crud-menu">
                            <ul>
                              <li>
                                <i className="fa-solid fa-pencil"></i> Edit
                              </li>
                              <li>
                                <i className="fa-regular fa-eye"></i> Preview
                              </li>
                              <li>
                                <i className="fa-solid fa-file"></i> Copy as
                                draft
                              </li>
                              <li>
                                <i className="fa-solid fa-box-archive"></i>{" "}
                                Archive
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="job-short-detail-tags">
                          <ul>
                            <li>
                              <i className="fa-solid fa-location-dot"></i>{" "}
                              Germany
                            </li>
                            <li>
                              <i className="fa-solid fa-calendar-days"></i> 11
                              Jul 2025
                            </li>
                            <li>
                              <i className="fa-solid fa-file-invoice"></i> No
                              experience / No degree
                            </li>
                            <li>
                              <i className="fa-solid fa-user-plus"></i> Full
                              Time
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div id="menu3" className="tab-pane fade">
                      <div className="job-post-info-heading">
                        <h2>There Are No Draft Job Posts.</h2>
                        <div className="post-job-next-btn">
                          <a href="#" className="default-btn btn">
                            All Jobs
                          </a>
                        </div>
                      </div>
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>

                          <div className="job-short-detail-crud-info">
                            <a href="#" className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil"></i> Draft
                            </a>
                            <i
                              className="fa-solid fa-ellipsis-vertical menu-icon"
                              style={{ cursor: "pointer" }}
                            ></i>
                          </div>

                          <div className="job-short-detail-crud-menu">
                            <ul>
                              <li>
                                <i className="fa-solid fa-pencil"></i> Edit
                              </li>
                              <li>
                                <i className="fa-regular fa-eye"></i> Preview
                              </li>
                              <li>
                                <i className="fa-solid fa-file"></i> Copy as
                                draft
                              </li>
                              <li>
                                <i className="fa-solid fa-box-archive"></i>{" "}
                                Archive
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="job-short-detail-tags">
                          <ul>
                            <li>
                              <i className="fa-solid fa-location-dot"></i>{" "}
                              Germany
                            </li>
                            <li>
                              <i className="fa-solid fa-calendar-days"></i> 11
                              Jul 2025
                            </li>
                            <li>
                              <i className="fa-solid fa-file-invoice"></i> No
                              experience / No degree
                            </li>
                            <li>
                              <i className="fa-solid fa-user-plus"></i> Full
                              Time
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div id="menu4" className="tab-pane fade">
                      <div className="job-post-info-heading">
                        <h2>There Are No Expired Job Posts.</h2>
                        <div className="post-job-next-btn">
                          <a href="#" className="default-btn btn">
                            All Jobs
                          </a>
                        </div>
                      </div>
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              Expired
                            </a>
                          </div>
                        </div>
                        <div className="job-short-detail-tags">
                          <ul>
                            <li>
                              <i className="fa-solid fa-location-dot" /> Germany
                            </li>
                            <li>
                              <i className="fa-solid fa-calendar-days" /> 11 Jul
                              2025
                            </li>
                            <li>
                              <i className="fa-solid fa-file-invoice" /> No
                              experience / No degree
                            </li>
                            <li>
                              <i className="fa-solid fa-user-plus" /> Full Time
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div id="menu5" className="tab-pane fade">
                      <div className="job-post-info-heading">
                        <h2>There Are No Unpublished Job Posts.</h2>
                        <div className="post-job-next-btn">
                          <a href="#" className="default-btn btn">
                            All Jobs
                          </a>
                        </div>
                      </div>

                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>

                          <div className="job-short-detail-crud-info">
                            <a href="#" className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil"></i> Draft
                            </a>
                            <i
                              className="fa-solid fa-ellipsis-vertical menu-icon"
                              style={{ cursor: "pointer" }}
                            ></i>
                          </div>

                          <div className="job-short-detail-crud-menu">
                            <ul>
                              <li>
                                <i className="fa-solid fa-pencil"></i> Edit
                              </li>
                              <li>
                                <i className="fa-regular fa-eye"></i> Preview
                              </li>
                              <li>
                                <i className="fa-solid fa-file"></i> Copy as
                                draft
                              </li>
                              <li>
                                <i className="fa-solid fa-box-archive"></i>{" "}
                                Archive
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="job-short-detail-tags">
                          <ul>
                            <li>
                              <i className="fa-solid fa-location-dot"></i>{" "}
                              Germany
                            </li>
                            <li>
                              <i className="fa-solid fa-calendar-days"></i> 11
                              Jul 2025
                            </li>
                            <li>
                              <i className="fa-solid fa-file-invoice"></i> No
                              experience / No degree
                            </li>
                            <li>
                              <i className="fa-solid fa-user-plus"></i> Full
                              Time
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div id="menu6" className="tab-pane fade">
                      <div className="job-post-info-heading">
                        <h2>There Are No Archived Job Posts.</h2>
                        <div className="post-job-next-btn">
                          <a href="#" className="default-btn btn">
                            All Jobs
                          </a>
                        </div>
                      </div>
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              <i className="fas fa-archive" /> Archived
                            </a>
                            <i
                              className="fa-solid fa-ellipsis-vertical menu-icon"
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                          <div className="job-short-detail-crud-menu">
                            <ul>
                              <li>
                                <i className="fa-solid fa-pencil" /> Edit
                              </li>
                              <li>
                                <i className="fa-regular fa-eye" /> Preview
                              </li>
                              <li>
                                <i className="fa-solid fa-file" /> Copy as draft
                              </li>
                              <li>
                                <i className="fa-solid fa-box-archive" />{" "}
                                Archive
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="job-short-application-detail-info">
                          <div className="job-short-detail-tags">
                            <ul>
                              <li>
                                <i className="fa-solid fa-location-dot" />{" "}
                                Germany
                              </li>
                              <li>
                                <i className="fa-solid fa-calendar-days" /> 11
                                Jul 2025
                              </li>
                              <li>
                                <i className="fa-solid fa-file-invoice" /> No
                                experience / No degree
                              </li>
                              <li>
                                <i className="fa-solid fa-user-plus" /> Full
                                Time
                              </li>
                            </ul>
                          </div>
                          <div className="job-short-application-detail">
                            <ul>
                              <li>
                                <i className="fa-regular fa-eye" /> 0
                                <div className="tooltip-text-info views bottom-arrow">
                                  <p>Views</p>
                                </div>
                              </li>
                              <li>
                                <i className="fa-solid fa-arrow-up" /> 0
                                <div className="tooltip-text-info clicks bottom-arrow">
                                  <p>Clicks</p>
                                </div>
                              </li>
                              <li>
                                <i className="fa-regular fa-file" /> 0
                                <div className="tooltip-text-info total-applicants-withdrawn bottom-arrow">
                                  <p>Total Applicants: 0</p>
                                  <br />
                                  <p>Withdrawn: 0</p>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="menu7" className="tab-pane fade">
                      <div className="job-post-info-heading">
                        <h2>There Are No All Job Posts.</h2>
                        <div className="post-job-next-btn">
                          <a href="#" className="default-btn btn">
                            All Jobs
                          </a>
                        </div>
                      </div>
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              <i className="fas fa-archive" /> Archived
                            </a>
                            <i
                              className="fa-solid fa-ellipsis-vertical menu-icon"
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                          <div className="job-short-detail-crud-menu">
                            <ul>
                              <li>
                                <i className="fa-solid fa-pencil" /> Edit
                              </li>
                              <li>
                                <i className="fa-regular fa-eye" /> Preview
                              </li>
                              <li>
                                <i className="fa-solid fa-file" /> Copy as draft
                              </li>
                              <li>
                                <i className="fa-solid fa-box-archive" />{" "}
                                Archive
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="job-short-detail-tags">
                          <ul>
                            <li>
                              <i className="fa-solid fa-location-dot" /> Germany
                            </li>
                            <li>
                              <i className="fa-solid fa-calendar-days" /> 11 Jul
                              2025
                            </li>
                            <li>
                              <i className="fa-solid fa-file-invoice" /> No
                              experience / No degree
                            </li>
                            <li>
                              <i className="fa-solid fa-user-plus" /> Full Time
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div> */}
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

export default YourJobPosts;
