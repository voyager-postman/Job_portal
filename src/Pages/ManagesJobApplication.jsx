import { Link } from "react-router-dom";
function ManagesJobApplication() {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Manage Job Application</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" />
                Manage Job Application
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* mannage Job application section start here */}
          <section className="mannage-job-application-tab">
            <div className="company-detail-tab-info">
              {/* Nav tabs */}
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item ">
                  <a
                    className="nav-link active"
                    data-bs-toggle="tab"
                    href="#menu1"
                  >
                    Applications
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#menu2">
                    Saved Jobs{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#menu3">
                    Job Alerts
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#menu4">
                    Companies
                  </a>
                </li>
              </ul>
            </div>
          </section>
          <section className="mannage-job-application-tab-description">
            {/* Tab panes */}
            <div className="tab-content">
              <div id="menu1" className="tab-pane active">
                <div className="candiate-mannage-job-no-application">
                  <h5>You have not yet submitted an application.</h5>
                  {/* <h4>Find the jobs that suit you best and apply now</h4> */}
                  {/* <i className="fa-solid fa-file" /> */}
                  <div className="candiate-mannage-job-start-btn">
                    <a href="SearchJobList.html" className="default-btn btn">
                      Start Now
                    </a>
                  </div>
                </div>
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
                          aria-label="Default select example"
                        >
                          <option selected>Filter</option>
                          <option value={1}>Java</option>
                          <option value={2}>Python</option>
                          <option value={3}>React</option>
                          <option value={2}>Python</option>
                          <option value={3}>React</option>
                        </select>
                      </div>
                
                   
                  <div className="available-job-posts-box">
                    <div className="available-job-company-name-save-job">
                      <div className="available-job-company-name">
                        <a href="job-details.html">
                          <h4>
                            <img src="assets/images/icon/icon-26.png" /> Alibaba
                            Cloud
                          </h4>
                        </a>
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
                                <h4
                                  className="modal-title"
                                  id="exampleModalLabel"
                                >
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
                                    With respect to the jobseeker experience, we
                                    would like to know why you are withdrawing
                                    your application.
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
                                    <label htmlFor="css">
                                      Applied by mistake
                                    </label>
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
                                      I understand that my personal data might
                                      have already been processed by the
                                      Employer of this job post.
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
                                  The reason of your withdrawal will only be
                                  visible to LesJeudis team for research
                                  purposes and no Employer will be notified.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a href="job-details.html">
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
                        </ul>
                      </div>
                    </a>
                  </div>
                  <div className="available-job-posts-box">
                    <div className="available-job-company-name-save-job">
                      <div className="available-job-company-name">
                        <a href="job-details.html">
                          <h4>
                            <img src="assets/images/icon/icon-26.png" /> Alibaba
                            Cloud
                          </h4>
                        </a>
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
                                <h4
                                  className="modal-title"
                                  id="exampleModalLabel"
                                >
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
                                    With respect to the jobseeker experience, we
                                    would like to know why you are withdrawing
                                    your application.
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
                                    <label htmlFor="css">
                                      Applied by mistake
                                    </label>
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
                                      I understand that my personal data might
                                      have already been processed by the
                                      Employer of this job post.
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
                                  The reason of your withdrawal will only be
                                  visible to LesJeudis team for research
                                  purposes and no Employer will be notified.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a href="job-details.html">
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
                        </ul>
                      </div>
                    </a>
                  </div>
                  <div className="available-job-posts-box">
                    <div className="available-job-company-name-save-job">
                      <div className="available-job-company-name">
                        <a href="job-details.html">
                          <h4>
                            <img src="assets/images/icon/icon-26.png" /> Alibaba
                            Cloud
                          </h4>
                        </a>
                      </div>
                      <div className="available-job-applied-withdraw">
                        <div className="job-applied-details">
                          <h5>
                            <i className="fa-solid fa-square-check" />
                           Viewed
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
                                <h4
                                  className="modal-title"
                                  id="exampleModalLabel"
                                >
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
                                    With respect to the jobseeker experience, we
                                    would like to know why you are withdrawing
                                    your application.
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
                                    <label htmlFor="css">
                                      Applied by mistake
                                    </label>
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
                                      I understand that my personal data might
                                      have already been processed by the
                                      Employer of this job post.
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
                                  The reason of your withdrawal will only be
                                  visible to LesJeudis team for research
                                  purposes and no Employer will be notified.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a href="job-details.html">
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
                        </ul>
                      </div>
                    </a>
                  </div>
                  <div className="available-job-posts-box">
                    <div className="available-job-company-name-save-job">
                      <div className="available-job-company-name">
                        <a href="job-details.html">
                          <h4>
                            <img src="assets/images/icon/icon-26.png" /> Alibaba
                            Cloud
                          </h4>
                        </a>
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
                                <h4
                                  className="modal-title"
                                  id="exampleModalLabel"
                                >
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
                                    With respect to the jobseeker experience, we
                                    would like to know why you are withdrawing
                                    your application.
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
                                    <label htmlFor="css">
                                      Applied by mistake
                                    </label>
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
                                      I understand that my personal data might
                                      have already been processed by the
                                      Employer of this job post.
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
                                  The reason of your withdrawal will only be
                                  visible to LesJeudis team for research
                                  purposes and no Employer will be notified.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a href="job-details.html">
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
                        </ul>
                      </div>
                    </a>
                  </div>
                </div>
                 
              </div>
              <div id="menu2" className="tab-pane fade">
                <div className="my-applications-heading-info">
                  <h2>Saved job</h2>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum
                  </p>
                </div>
                <div className="mannage-job-application-saved-job">
                  <div className="available-job-posts-box">
                    <a href="job-details.html">
                      <div className="available-job-company-name-save-job">
                        <div className="available-job-company-name">
                          <h4>
                            <img src="assets/images/icon/icon-26.png" /> Alibaba
                            Cloud
                          </h4>
                        </div>
                        <div className="available-job-save-job">
                          <i className="fa-solid fa-heart" />
                        </div>
                      </div>
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
                        </ul>
                      </div>
                    </a>
                  </div>
                  <div className="available-job-posts-box">
                    <a href="job-details.html">
                      <div className="available-job-company-name-save-job">
                        <div className="available-job-company-name">
                          <h4>
                            <img src="assets/images/icon/icon-26.png" /> Alibaba
                            Cloud
                          </h4>
                        </div>
                        <div className="available-job-save-job">
                          <i className="fa-solid fa-heart" />
                        </div>
                      </div>
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
                        </ul>
                      </div>
                    </a>
                  </div>
                  <div className="available-job-posts-box">
                    <a href="job-details.html">
                      <div className="available-job-company-name-save-job">
                        <div className="available-job-company-name">
                          <h4>
                            <img src="assets/images/icon/icon-26.png" /> Alibaba
                            Cloud
                          </h4>
                        </div>
                        <div className="available-job-save-job">
                          <i className="fa-solid fa-heart" />
                        </div>
                      </div>
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
                        </ul>
                      </div>
                    </a>
                  </div>
                  <div className="available-job-posts-box">
                    <a href="job-details.html">
                      <div className="available-job-company-name-save-job">
                        <div className="available-job-company-name">
                          <h4>
                            <img src="assets/images/icon/icon-26.png" /> Alibaba
                            Cloud
                          </h4>
                        </div>
                        <div className="available-job-save-job">
                          <i className="fa-solid fa-heart" />
                        </div>
                      </div>
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
                        </ul>
                      </div>
                    </a>
                  </div>
                  <div className="available-job-posts-box">
                    <a href="job-details.html">
                      <div className="available-job-company-name-save-job">
                        <div className="available-job-company-name">
                          <h4>
                            <img src="assets/images/icon/icon-26.png" /> Alibaba
                            Cloud
                          </h4>
                        </div>
                        <div className="available-job-save-job">
                          <i className="fa-solid fa-heart" />
                        </div>
                      </div>
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
                        </ul>
                      </div>
                    </a>
                  </div>
                  <div className="available-job-posts-box">
                    <a href="job-details.html">
                      <div className="available-job-company-name-save-job">
                        <div className="available-job-company-name">
                          <h4>
                            <img src="assets/images/icon/icon-26.png" /> Alibaba
                            Cloud
                          </h4>
                        </div>
                        <div className="available-job-save-job">
                          <i className="fa-solid fa-heart" />
                        </div>
                      </div>
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
                        </ul>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div id="menu3" className="tab-pane fade">
                <div className="my-applications-heading-info">
                  <h2>Job Alerts</h2>
                  <p>
                    Receive email notification for your Saved Searches, so you
                    don’t miss any new job posts!
                  </p>
                </div>
                <div className="mannage-job-application-notification">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Job Notification</th>
                        <th>Status</th>
                        <th>Notify Me</th>
                        <th>View</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>1</th>
                        <td>
                          <div className="mannage-notification-job-application">
                            <a href="job-details.html">
                              <div className="available-job-posts-box">
                                <div className="available-job-company-name-save-job">
                                  <div className="available-job-company-name">
                                    <h4>
                                      <img src="assets/images/icon/icon-26.png" />{" "}
                                      Alibaba Cloud
                                    </h4>
                                  </div>
                                  {/* <div class="available-job-save-job">
                  <i class="fa-regular fa-heart"></i> 
                  </div> */}
                                </div>
                                <div className="available-job-type-details">
                                  <h5>
                                    Alibaba Cloud-Facility Operation
                                    Manager-Paris, France
                                  </h5>
                                  <ul>
                                    <li>
                                      <i className="fa-regular fa-calendar" /> 3
                                      hours ago
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-file" /> 5
                                      Years
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-user" /> Full
                                      time
                                    </li>
                                    <li>
                                      <i className="fa-solid fa-location-dot" />{" "}
                                      Paris
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-file" />{" "}
                                      Information Systems / Networks
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-status">
                            <label className="switch">
                              <input type="checkbox" defaultChecked />
                              <span className="slider round" />
                            </label>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon-popup-modal">
                            <div className="mannage-job-notification-icon">
                              <a
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                              >
                                <i className="fa-solid fa-pencil" />
                              </a>
                            </div>
                            {/* Modal */}
                            <div
                              className="modal fade"
                              id="staticBackdrop"
                              data-bs-backdrop="static"
                              data-bs-keyboard="false"
                              tabIndex={-1}
                              aria-labelledby="staticBackdropLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h1
                                      className="modal-title fs-5"
                                      id="staticBackdropLabel"
                                    >
                                      Job Alerts
                                    </h1>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    />
                                  </div>
                                  <div className="modal-body">
                                    <div className="mannage-job-notification-info">
                                      <h5>Job alert setting</h5>
                                      <span>
                                        <input
                                          type="radio"
                                          id="html"
                                          name="fav_language"
                                          defaultValue="HTML"
                                        />
                                        <label htmlFor="html">1 Day</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="css"
                                          name="fav_language"
                                          defaultValue="CSS"
                                        />
                                        <label htmlFor="css">3 Days</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">Week</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">
                                          Month
                                        </label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">
                                          Just save
                                        </label>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="default-btn btn"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon">
                            <a href="job-details.html">
                              <i className="fa-solid fa-eye" />
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon">
                            <i className="fa-solid fa-trash" />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>2</th>
                        <td>
                          <div className="mannage-notification-job-application">
                            <a href="job-details.html">
                              <div className="available-job-posts-box">
                                <div className="available-job-company-name-save-job">
                                  <div className="available-job-company-name">
                                    <h4>
                                      <img src="assets/images/icon/icon-26.png" />{" "}
                                      Alibaba Cloud
                                    </h4>
                                  </div>
                                  {/* <div class="available-job-save-job">
                  <i class="fa-regular fa-heart"></i> 
                  </div> */}
                                </div>
                                <div className="available-job-type-details">
                                  <h5>
                                    Alibaba Cloud-Facility Operation
                                    Manager-Paris, France
                                  </h5>
                                  <ul>
                                    <li>
                                      <i className="fa-regular fa-calendar" /> 3
                                      hours ago
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-file" /> 5
                                      Years
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-user" /> Full
                                      time
                                    </li>
                                    <li>
                                      <i className="fa-solid fa-location-dot" />{" "}
                                      Paris
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-file" />{" "}
                                      Information Systems / Networks
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-status">
                            <label className="switch">
                              <input type="checkbox" defaultChecked />
                              <span className="slider round" />
                            </label>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon-popup-modal">
                            <div className="mannage-job-notification-icon">
                              <a
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                              >
                                <i className="fa-solid fa-pencil" />
                              </a>
                            </div>
                            {/* Modal */}
                            <div
                              className="modal fade"
                              id="staticBackdrop"
                              data-bs-backdrop="static"
                              data-bs-keyboard="false"
                              tabIndex={-1}
                              aria-labelledby="staticBackdropLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h1
                                      className="modal-title fs-5"
                                      id="staticBackdropLabel"
                                    >
                                      Job Alerts
                                    </h1>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    />
                                  </div>
                                  <div className="modal-body">
                                    <div className="mannage-job-notification-info">
                                      <h5>Job alert setting</h5>
                                      <span>
                                        <input
                                          type="radio"
                                          id="html"
                                          name="fav_language"
                                          defaultValue="HTML"
                                        />
                                        <label htmlFor="html">1 Day</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="css"
                                          name="fav_language"
                                          defaultValue="CSS"
                                        />
                                        <label htmlFor="css">3 Days</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">Week</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">
                                          Month
                                        </label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">
                                          Just save
                                        </label>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="default-btn btn"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon">
                            <a href="job-details.html">
                              <i className="fa-solid fa-eye" />
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon">
                            <i className="fa-solid fa-trash" />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>3</th>
                        <td>
                          <div className="mannage-notification-job-application">
                            <a href="job-details.html">
                              <div className="available-job-posts-box">
                                <div className="available-job-company-name-save-job">
                                  <div className="available-job-company-name">
                                    <h4>
                                      <img src="assets/images/icon/icon-26.png" />{" "}
                                      Alibaba Cloud
                                    </h4>
                                  </div>
                                  {/* <div class="available-job-save-job">
                  <i class="fa-regular fa-heart"></i> 
                  </div> */}
                                </div>
                                <div className="available-job-type-details">
                                  <h5>
                                    Alibaba Cloud-Facility Operation
                                    Manager-Paris, France
                                  </h5>
                                  <ul>
                                    <li>
                                      <i className="fa-regular fa-calendar" /> 3
                                      hours ago
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-file" /> 5
                                      Years
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-user" /> Full
                                      time
                                    </li>
                                    <li>
                                      <i className="fa-solid fa-location-dot" />{" "}
                                      Paris
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-file" />{" "}
                                      Information Systems / Networks
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-status">
                            <label className="switch">
                              <input type="checkbox" defaultChecked />
                              <span className="slider round" />
                            </label>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon-popup-modal">
                            <div className="mannage-job-notification-icon">
                              <a
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                              >
                                <i className="fa-solid fa-pencil" />
                              </a>
                            </div>
                            {/* Modal */}
                            <div
                              className="modal fade"
                              id="staticBackdrop"
                              data-bs-backdrop="static"
                              data-bs-keyboard="false"
                              tabIndex={-1}
                              aria-labelledby="staticBackdropLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h1
                                      className="modal-title fs-5"
                                      id="staticBackdropLabel"
                                    >
                                      Job Alerts
                                    </h1>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    />
                                  </div>
                                  <div className="modal-body">
                                    <div className="mannage-job-notification-info">
                                      <h5>Job alert setting</h5>
                                      <span>
                                        <input
                                          type="radio"
                                          id="html"
                                          name="fav_language"
                                          defaultValue="HTML"
                                        />
                                        <label htmlFor="html">1 Day</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="css"
                                          name="fav_language"
                                          defaultValue="CSS"
                                        />
                                        <label htmlFor="css">3 Days</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">Week</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">
                                          Month
                                        </label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">
                                          Just save
                                        </label>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="default-btn btn"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon">
                            <a href="job-details.html">
                              <i className="fa-solid fa-eye" />
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon">
                            <i className="fa-solid fa-trash" />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>4</th>
                        <td>
                          <div className="mannage-notification-job-application">
                            <a href="job-details.html">
                              <div className="available-job-posts-box">
                                <div className="available-job-company-name-save-job">
                                  <div className="available-job-company-name">
                                    <h4>
                                      <img src="assets/images/icon/icon-26.png" />{" "}
                                      Alibaba Cloud
                                    </h4>
                                  </div>
                                  {/* <div class="available-job-save-job">
                  <i class="fa-regular fa-heart"></i> 
                  </div> */}
                                </div>
                                <div className="available-job-type-details">
                                  <h5>
                                    Alibaba Cloud-Facility Operation
                                    Manager-Paris, France
                                  </h5>
                                  <ul>
                                    <li>
                                      <i className="fa-regular fa-calendar" /> 3
                                      hours ago
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-file" /> 5
                                      Years
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-user" /> Full
                                      time
                                    </li>
                                    <li>
                                      <i className="fa-solid fa-location-dot" />{" "}
                                      Paris
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-file" />{" "}
                                      Information Systems / Networks
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-status">
                            <label className="switch">
                              <input type="checkbox" defaultChecked />
                              <span className="slider round" />
                            </label>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon-popup-modal">
                            <div className="mannage-job-notification-icon">
                              <a
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                              >
                                <i className="fa-solid fa-pencil" />
                              </a>
                            </div>
                            {/* Modal */}
                            <div
                              className="modal fade"
                              id="staticBackdrop"
                              data-bs-backdrop="static"
                              data-bs-keyboard="false"
                              tabIndex={-1}
                              aria-labelledby="staticBackdropLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h1
                                      className="modal-title fs-5"
                                      id="staticBackdropLabel"
                                    >
                                      Job Alerts
                                    </h1>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    />
                                  </div>
                                  <div className="modal-body">
                                    <div className="mannage-job-notification-info">
                                      <h5>Job alert setting</h5>
                                      <span>
                                        <input
                                          type="radio"
                                          id="html"
                                          name="fav_language"
                                          defaultValue="HTML"
                                        />
                                        <label htmlFor="html">1 Day</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="css"
                                          name="fav_language"
                                          defaultValue="CSS"
                                        />
                                        <label htmlFor="css">3 Days</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">Week</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">
                                          Month
                                        </label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">
                                          Just save
                                        </label>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="default-btn btn"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon">
                            <a href="job-details.html">
                              <i className="fa-solid fa-eye" />
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon">
                            <i className="fa-solid fa-trash" />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>5</th>
                        <td>
                          <div className="mannage-notification-job-application">
                            <a href="job-details.html">
                              <div className="available-job-posts-box">
                                <div className="available-job-company-name-save-job">
                                  <div className="available-job-company-name">
                                    <h4>
                                      <img src="assets/images/icon/icon-26.png" />{" "}
                                      Alibaba Cloud
                                    </h4>
                                  </div>
                                  {/* <div class="available-job-save-job">
                  <i class="fa-regular fa-heart"></i> 
                  </div> */}
                                </div>
                                <div className="available-job-type-details">
                                  <h5>
                                    Alibaba Cloud-Facility Operation
                                    Manager-Paris, France
                                  </h5>
                                  <ul>
                                    <li>
                                      <i className="fa-regular fa-calendar" /> 3
                                      hours ago
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-file" /> 5
                                      Years
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-user" /> Full
                                      time
                                    </li>
                                    <li>
                                      <i className="fa-solid fa-location-dot" />{" "}
                                      Paris
                                    </li>
                                    <li>
                                      <i className="fa-regular fa-file" />{" "}
                                      Information Systems / Networks
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-status">
                            <label className="switch">
                              <input type="checkbox" defaultChecked />
                              <span className="slider round" />
                            </label>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon-popup-modal">
                            <div className="mannage-job-notification-icon">
                              <a
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                              >
                                <i className="fa-solid fa-pencil" />
                              </a>
                            </div>
                            {/* Modal */}
                            <div
                              className="modal fade"
                              id="staticBackdrop"
                              data-bs-backdrop="static"
                              data-bs-keyboard="false"
                              tabIndex={-1}
                              aria-labelledby="staticBackdropLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h1
                                      className="modal-title fs-5"
                                      id="staticBackdropLabel"
                                    >
                                      Job Alerts
                                    </h1>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    />
                                  </div>
                                  <div className="modal-body">
                                    <div className="mannage-job-notification-info">
                                      <h5>Job alert setting</h5>
                                      <span>
                                        <input
                                          type="radio"
                                          id="html"
                                          name="fav_language"
                                          defaultValue="HTML"
                                        />
                                        <label htmlFor="html">1 Day</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="css"
                                          name="fav_language"
                                          defaultValue="CSS"
                                        />
                                        <label htmlFor="css">3 Days</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">Week</label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">
                                          Month
                                        </label>
                                      </span>
                                      <span>
                                        <input
                                          type="radio"
                                          id="javascript"
                                          name="fav_language"
                                          defaultValue="JavaScript"
                                        />
                                        <label htmlFor="javascript">
                                          Just save
                                        </label>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="default-btn btn"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon">
                            <a href="job-details.html">
                              <i className="fa-solid fa-eye" />
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="mannage-job-notification-icon">
                            <i className="fa-solid fa-trash" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div id="menu4" className="tab-pane fade">
                <div className="my-applications-heading-info">
                  <h2>Companies List</h2>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum
                  </p>
                </div>
                <div className="mannage-job-notification-companies-list">
                  <div className="row">
                    <div className="col-lg-4 col-md-4">
                      <div className="available-company-box-info">
                        <div className="available-company-logo">
                          <img src="assets/images/partner-logo/partner-logo-2.png" />
                        </div>
                        <div className="available-company-img">
                          <img src="assets/images/company/company-img-1.jpg" />
                        </div>
                        <div className="available-company-content">
                          <h4>Hauts De Seine Department</h4>
                          <ul>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Levallois-Perret
                            </li>
                            <li>
                              <i className="fa-solid fa-user" />
                              1000 - 20000
                            </li>
                            <li>
                              <i className="fa-solid fa-globe" />
                              Technicien support VIP Anglais
                            </li>
                          </ul>
                        </div>
                        <div className="available-company-btn">
                          <Link
                            to={`/companies-details`}
                            className="default-btn btn"
                          >
                            View the Company
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                      <div className="available-company-box-info">
                        <div className="available-company-logo">
                          <img src="assets/images/partner-logo/partner-logo-2.png" />
                        </div>
                        <div className="available-company-img">
                          <img src="assets/images/company/company-img-1.jpg" />
                        </div>
                        <div className="available-company-content">
                          <h4>Hauts De Seine Department</h4>
                          <ul>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Levallois-Perret
                            </li>
                            <li>
                              <i className="fa-solid fa-user" />
                              1000 - 20000
                            </li>
                            <li>
                              <i className="fa-solid fa-globe" />
                              Technicien support VIP Anglais
                            </li>
                          </ul>
                        </div>
                        <div className="available-company-btn">
                          <a
                            href="companies-details.html"
                            className="default-btn btn"
                          >
                            View the Company
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                      <div className="available-company-box-info">
                        <div className="available-company-logo">
                          <img src="assets/images/partner-logo/partner-logo-2.png" />
                        </div>
                        <div className="available-company-img">
                          <img src="assets/images/company/company-img-1.jpg" />
                        </div>
                        <div className="available-company-content">
                          <h4>Hauts De Seine Department</h4>
                          <ul>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Levallois-Perret
                            </li>
                            <li>
                              <i className="fa-solid fa-user" />
                              1000 - 20000
                            </li>
                            <li>
                              <i className="fa-solid fa-globe" />
                              Technicien support VIP Anglais
                            </li>
                          </ul>
                        </div>
                        <div className="available-company-btn">
                          <a
                            href="companies-details.html"
                            className="default-btn btn"
                          >
                            View the Company
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
