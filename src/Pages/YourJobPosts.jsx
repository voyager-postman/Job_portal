import { Link } from "react-router-dom";

function YourJobPosts() {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Your Job Posts</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
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
          <div className="manage-jobs-box">
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
                        <option selected>Chpoose A Category</option>
                        <option value={1}>Development</option>
                        <option value={2}>Information IT</option>
                        <option value={3}>Corporate Job</option>
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
          </div>
          {/* End Manage Jobs Area */}
          {/* Your Job Posts Info*/}
          <div className="your-job-post-main-info">
            <div className="row">
              <div className="col-lg-3 col-sm-3">
                <div className="your-job-post-side-menu">
                  <div className="your-job-post-side-heading">
                    <h4>
                      <i className="fa-regular fa-file" /> Your Job Posts
                    </h4>
                  </div>
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        data-bs-toggle="tab"
                        href="#menu1"
                      >
                        <i className="fas fa-tasks" /> Create New Job
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#menu2"
                      >
                        <i className="fa-solid fa-upload" /> Published
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#menu3"
                      >
                        <i className="fa-solid fa-pencil" /> Draft
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#menu4"
                      >
                        <i className="fas fa-calendar-alt" /> Expired
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#menu5"
                      >
                        <i className="fas fa-file-word" /> Unpublished
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#menu6"
                      >
                        <i className="fas fa-archive" /> Archived
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#menu7"
                      >
                        <i className="fas fa-tasks" /> All
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-9 col-md-9">
                <div className="your-job-post-detail-info">
                  <div className="tab-content">
                    <div id="menu1" className="tab-pane active">
                      <div className="job-post-info-heading">
                        <h2>There Are No Created Any Job Posts.</h2>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="post-job-next-btn">
                        <a href="#" className="default-btn btn">
                          Create Job
                        </a>
                      </div>
                      <div className="your-job-posts-form-heading">
                        <h4>
                          <i className="fa-regular fa-file" /> Create New job
                          post
                        </h4>
                      </div>
                      <div className="post-job-form-info">
                        <form>
                          <div className="form-group">
                            <label>Job Title</label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Job Title"
                            />
                          </div>
                          <div className="form-group">
                            <label>Job Category</label>
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                            >
                              <option selected>Select Category</option>
                              <option value={1}>Website Designer</option>
                              <option value={2}>Designer</option>
                              <option value={3}>Agriculture</option>
                            </select>
                          </div>
                          <div className="post-job-next-btn">
                            <Link
                              to="/job-details-form"
                              className="default-btn btn"
                            >
                              Next
                            </Link>
                          </div>
                        </form>
                      </div>
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Draft
                            </a>
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Edit
                            </a>
                            <i className="fa-solid fa-ellipsis-vertical" />
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
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Website Desginer</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Draft
                            </a>
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Edit
                            </a>
                            <i className="fa-solid fa-ellipsis-vertical" />
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
                    <div id="menu2" className="tab-pane fade">
                      <div className="job-post-info-heading">
                        <h2>There Are No Published Job Posts.</h2>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="post-job-next-btn">
                        <a href="#" className="default-btn btn">
                          All Jobs
                        </a>
                      </div>
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Draft
                            </a>
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Edit
                            </a>
                            <i className="fa-solid fa-ellipsis-vertical" />
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
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Draft
                            </a>
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Edit
                            </a>
                            <i className="fa-solid fa-ellipsis-vertical" />
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
                    </div>
                    <div id="menu3" className="tab-pane fade">
                      <div className="job-post-info-heading">
                        <h2>There Are No Draft Job Posts.</h2>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="post-job-next-btn">
                        <a href="#" className="default-btn btn">
                          All Jobs
                        </a>
                      </div>
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Draft
                            </a>
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Edit
                            </a>
                            <i className="fa-solid fa-ellipsis-vertical" />
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
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Draft
                            </a>
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Edit
                            </a>
                            <i className="fa-solid fa-ellipsis-vertical" />
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
                    </div>
                    <div id="menu4" className="tab-pane fade">
                      <div className="job-post-info-heading">
                        <h2>There Are No Expired Job Posts.</h2>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="post-job-next-btn">
                        <a href="#" className="default-btn btn">
                          All Jobs
                        </a>
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
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="post-job-next-btn">
                        <a href="#" className="default-btn btn">
                          All Jobs
                        </a>
                      </div>
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Draft
                            </a>
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Edit
                            </a>
                            <i className="fa-solid fa-ellipsis-vertical" />
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
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Draft
                            </a>
                            <a href className="job-short-crud-btn">
                              <i className="fa-solid fa-pencil" /> Edit
                            </a>
                            <i className="fa-solid fa-ellipsis-vertical" />
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
                    </div>
                    <div id="menu6" className="tab-pane fade">
                      <div className="job-post-info-heading">
                        <h2>There Are No Archived Job Posts.</h2>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="post-job-next-btn">
                        <a href="#" className="default-btn btn">
                          All Jobs
                        </a>
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
                            <i className="fa-solid fa-ellipsis-vertical" />
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
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              <i className="fas fa-archive" /> Archived
                            </a>
                            <i className="fa-solid fa-ellipsis-vertical" />
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
                    </div>
                    <div id="menu7" className="tab-pane fade">
                      <div className="job-post-info-heading">
                        <h2>There Are No All Job Posts.</h2>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="created-job-box-detail-info">
                        <div className="created-job-content-info">
                          <h4>There are no job details</h4>
                        </div>
                        <div className="created-job-crud-info">
                          <i className="fa-solid fa-ellipsis-vertical" />
                        </div>
                      </div>
                      <div className="post-job-next-btn">
                        <a href="#" className="default-btn btn">
                          All Jobs
                        </a>
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
                            <i className="fa-solid fa-ellipsis-vertical" />
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
                      <div className="job-short-detail-box">
                        <div className="job-short-heading-crud">
                          <div className="job-short-detail-heading">
                            <h4>Testing</h4>
                          </div>
                          <div className="job-short-detail-crud-info">
                            <a href className="job-short-crud-btn">
                              <i className="fas fa-archive" /> Archived
                            </a>
                            <i className="fa-solid fa-ellipsis-vertical" />
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
                    </div>
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
