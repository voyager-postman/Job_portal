import { Link } from "react-router-dom";

function CandidateDashboard() {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Dashboard</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="#">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* candidate mannage Job application section start here */}
          <section className="candidate-dashboard-info-area">
            <div className="candidate-dashboard-box-info">
              <div className="candidate-dashboard-box">
                <div className="row">
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <Link to="/manage-job-application?tab=applications">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i className="fa-solid fa-file" />
                        </div>
                        <div className="box-content">
                          <h4>Application</h4>
                          <h5>100</h5>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <Link to="/manage-job-application?tab=saved-jobs">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i className="fa-solid fa-heart" />
                        </div>
                        <div className="box-content">
                          <h4>Saved Jobs</h4>
                          <h5>10</h5>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <Link to="/manage-job-application?tab=job-alerts">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i className="fa-solid fa-bell" />
                        </div>
                        <div className="box-content">
                          <h4>Job Alerts</h4>
                          <h5>5</h5>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <Link to="/chat-messaging-system">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i class="fa-solid fa-comment-dots"></i>
                        </div>
                        <div className="box-content">
                          <h4>Recruiter Messages </h4>
                          <h5>5</h5>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <a href="#">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i class="fa-solid fa-clipboard-question"></i>
                        </div>
                        <div className="box-content">
                          <h4>Upcoming interviews </h4>
                          <h5>5</h5>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <Link to="/activity-timeline">
                      {" "}
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="box-content">
                          <h4>User Log</h4>
                          <h5>5</h5>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* candidate mannage Job application end here*/}
          {/* candidate Complete profile section start here */}
          <section className="candidate-complete-info-area">
            <div className="candidate-complete-info-box">
              <div className="candidate-complete-progress-info">
                <h4>Complete your profile and get better matches</h4>
                <div className="candidate-complete-progress-bar">
                  <ul>
                    <li className="active" />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                  </ul>
                  <div className="candidate-complete-progress-circle-main-area">
                    <div className="candidate-complete-progress-circle">
                      <div className="candidate-complete-circel-icon">
                        <i className="fa-solid fa-check" />
                      </div>
                      <div className="candidate-complete-circel-icon">
                        <i className="fa-solid fa-check" />
                      </div>
                      <div className="candidate-complete-circel-icon">
                        <i className="fa-solid fa-check" />
                      </div>
                      {/* <div className="candidate-complete-circel-icon">
                        <i className="fa-solid fa-check" />
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="candidate-complete-percent-btn">
                <h4>Profile strength: 0%</h4>
                <Link to="/candidate-profile" className="default-btn btn">
                  Complete Profile
                </Link>
              </div>
            </div>
          </section>
          {/* candidate Complete profile section end here */}
          {/* dashboard recent job posts  section start here */}
          <section className="dashboard-heading-job-profile-info">
            <div className="dashboard-heading-info-area">
              <h2>Job Hiring Now</h2>
              <h4>Recently added jobs compatible with your profile</h4>
            </div>
            <div className="dashboard-job-post-profile-area">
              <div className="row">
                <div className="col-lg-8 col-md-6">
                  <div className="dashboard-recent-job-post-info">
                    <div className="available-job-posts-box">
                      <div className="available-job-company-name-save-job">
                        <div className="available-job-company-name">
                          <Link to="/job-details">
                            <h4>
                              <img
                                src="assets/images/icon/icon-25.png"
                                alt="logo"
                              />{" "}
                              Alibaba Cloud
                            </h4>
                          </Link>
                        </div>
                        <div className="available-job-save-job">
                          <i className="fa-regular fa-heart" />
                          <a
                            href="https://www.linkedin.com/login"
                            target="_blank"
                          >
                            <i className="fa-brands fa-linkedin-in" />
                          </a>
                          <a href="https://www.facebook.com/" target="_blank">
                            <i className="fa-brands fa-facebook-f" />
                          </a>
                          <a href="https://web.whatsapp.com/" target="_blank">
                            <i className="fa-brands fa-whatsapp" />
                          </a>
                        </div>
                      </div>
                      <Link to="/job-details">
                        <div className="available-job-type-details">
                          <h5>
                            Alibaba Cloud-Facility Operation Manager-Paris,
                            France
                          </h5>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley
                          </p>
                          <ul>
                            <li>
                              <i className="fa-regular fa-calendar" /> 3 hours
                              ago
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
                              Systems
                            </li>
                            <li>
                              <i class="fa-solid fa-users"></i> Available:3
                            </li>
                          </ul>
                        </div>
                      </Link>
                      <div className="available-job-type-apply-btn">
                        <Link
                          to="/job-details" // 👈 route defined in your React Router
                          className="apply-btn-info default-btn btn"
                        >
                          Apply
                        </Link>
                      </div>
                    </div>
                    <div className="available-job-posts-box">
                      <div className="available-job-company-name-save-job">
                        <div className="available-job-company-name">
                          <Link to="/job-details">
                            <h4>
                              <img
                                src="assets/images/icon/icon-2.png"
                                alt="logo"
                              />{" "}
                              Xceed IT Solutions
                            </h4>
                          </Link>
                        </div>
                        <div className="available-job-save-job">
                          <i className="fa-regular fa-heart" />
                          <a
                            href="https://www.linkedin.com/login"
                            target="_blank"
                          >
                            <i className="fa-brands fa-linkedin-in" />
                          </a>
                          <a href="https://www.facebook.com/" target="_blank">
                            <i className="fa-brands fa-facebook-f" />
                          </a>
                          <a href="https://web.whatsapp.com/" target="_blank">
                            <i className="fa-brands fa-whatsapp" />
                          </a>
                        </div>
                      </div>
                      <Link to="/job-details">
                        <div className="available-job-type-details">
                          <h5>Web Designer(CSS-HTML)</h5>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley
                          </p>
                          <ul>
                            <li>
                              <i className="fa-regular fa-calendar" /> 3 hours
                              ago
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
                              Systems
                            </li>
                            <li>
                              <i class="fa-solid fa-users"></i> Available:3
                            </li>
                          </ul>
                        </div>
                      </Link>
                      <div className="available-job-type-apply-btn">
                        <Link
                          to="/job-details" // 👈 route defined in your React Router
                          className="apply-btn-info default-btn btn"
                        >
                          Apply
                        </Link>
                      </div>
                    </div>
                    <div className="available-job-posts-box">
                      <div className="available-job-company-name-save-job">
                        <div className="available-job-company-name">
                          <Link to="/job-details">
                            <h4>
                              <img
                                src="assets/images/icon/icon-4.png"
                                alt="logo"
                              />{" "}
                              INVA Business Solution
                            </h4>
                          </Link>
                        </div>
                        <div className="available-job-save-job">
                          <i className="fa-regular fa-heart" />
                          <a
                            href="https://www.linkedin.com/login"
                            target="_blank"
                          >
                            <i className="fa-brands fa-linkedin-in" />
                          </a>
                          <a href="https://www.facebook.com/" target="_blank">
                            <i className="fa-brands fa-facebook-f" />
                          </a>
                          <a href="https://web.whatsapp.com/" target="_blank">
                            <i className="fa-brands fa-whatsapp" />
                          </a>
                        </div>
                      </div>
                      <Link to="/job-details">
                        <div className="available-job-type-details">
                          <h5>Accounting &amp; Bank Financial Course</h5>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley
                          </p>
                          <ul>
                            <li>
                              <i className="fa-regular fa-calendar" /> 3 hours
                              ago
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
                              Systems
                            </li>
                            <li>
                              <i class="fa-solid fa-users"></i> Available:3
                            </li>
                          </ul>
                        </div>
                      </Link>
                      <div className="available-job-type-apply-btn">
                        <Link
                          to="/job-details" // 👈 route defined in your React Router
                          className="apply-btn-info default-btn btn"
                        >
                          Apply
                        </Link>
                      </div>
                    </div>
                    <div className="available-job-posts-box">
                      <div className="available-job-company-name-save-job">
                        <div className="available-job-company-name">
                          <Link to="/job-details">
                            {" "}
                            <h4>
                              <img
                                src="assets/images/icon/icon-5.png"
                                alt="logo"
                              />{" "}
                              Bamigos VR LLP
                            </h4>
                          </Link>
                        </div>
                        <div className="available-job-save-job">
                          <i className="fa-regular fa-heart" />
                          <a
                            href="https://www.linkedin.com/login"
                            target="_blank"
                          >
                            <i className="fa-brands fa-linkedin-in" />
                          </a>
                          <a href="https://www.facebook.com/" target="_blank">
                            <i className="fa-brands fa-facebook-f" />
                          </a>
                          <a href="https://web.whatsapp.com/" target="_blank">
                            <i className="fa-brands fa-whatsapp" />
                          </a>
                        </div>
                      </div>
                      <Link to="/job-details">
                        <div className="available-job-type-details">
                          <h5>
                            UI/UX Designer – Games &amp; Interactive Software
                          </h5>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley
                          </p>
                          <ul>
                            <li>
                              <i className="fa-regular fa-calendar" /> 3 hours
                              ago
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
                              Systems
                            </li>
                            <li>
                              <i class="fa-solid fa-users"></i> Available:3
                            </li>
                          </ul>
                        </div>
                      </Link>
                      <div className="available-job-type-apply-btn">
                        <Link
                          to="/job-details" // 👈 route defined in your React Router
                          className="apply-btn-info default-btn btn"
                        >
                          Apply
                        </Link>
                      </div>
                    </div>
                    <div className="available-job-posts-box">
                      <div className="available-job-company-name-save-job">
                        <div className="available-job-company-name">
                          <Link to="/job-details">
                            <h4>
                              <img
                                src="assets/images/icon/icon-6.png"
                                alt="logo"
                              />{" "}
                              Aksum Trademart Pvt Ltd
                            </h4>
                          </Link>
                        </div>
                        <div className="available-job-save-job">
                          <i className="fa-regular fa-heart" />
                          <a
                            href="https://www.linkedin.com/login"
                            target="_blank"
                          >
                            <i className="fa-brands fa-linkedin-in" />
                          </a>
                          <a href="https://www.facebook.com/" target="_blank">
                            <i className="fa-brands fa-facebook-f" />
                          </a>
                          <a href="https://web.whatsapp.com/" target="_blank">
                            <i className="fa-brands fa-whatsapp" />
                          </a>
                        </div>
                      </div>
                      <Link to="/job-details">
                        <div className="available-job-type-details">
                          <h5>MBA Finance Fresher</h5>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley
                          </p>
                          <ul>
                            <li>
                              <i className="fa-regular fa-calendar" /> 3 hours
                              ago
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
                              Systems
                            </li>
                            <li>
                              <i class="fa-solid fa-users"></i> Available:3
                            </li>
                          </ul>
                        </div>
                      </Link>
                      <div className="available-job-type-apply-btn">
                        <Link
                          to="/job-details" // 👈 route defined in your React Router
                          className="apply-btn-info default-btn btn"
                        >
                          Apply
                        </Link>
                      </div>
                    </div>
                    <div className="available-job-posts-box">
                      <div className="available-job-company-name-save-job">
                        <div className="available-job-company-name">
                          <Link to="/job-details">
                            <h4>
                              <img
                                src="assets/images/icon/icon-4.png"
                                alt="logo"
                              />{" "}
                              INVA Business Solution
                            </h4>
                          </Link>
                        </div>
                        <div className="available-job-save-job">
                          <i className="fa-regular fa-heart" />
                          <a
                            href="https://www.linkedin.com/login"
                            target="_blank"
                          >
                            <i className="fa-brands fa-linkedin-in" />
                          </a>
                          <a href="https://www.facebook.com/" target="_blank">
                            <i className="fa-brands fa-facebook-f" />
                          </a>
                          <a href="https://web.whatsapp.com/" target="_blank">
                            <i className="fa-brands fa-whatsapp" />
                          </a>
                        </div>
                      </div>
                      <Link to="/job-details">
                        <div className="available-job-type-details">
                          <h5>Accounting &amp; Bank Financial Course</h5>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley
                          </p>
                          <ul>
                            <li>
                              <i className="fa-regular fa-calendar" /> 3 hours
                              ago
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
                              Systems
                            </li>
                            <li>
                              <i class="fa-solid fa-users"></i> Available:3
                            </li>
                          </ul>
                        </div>
                      </Link>
                      <div className="available-job-type-apply-btn">
                        <Link
                          to="/job-details" // 👈 route defined in your React Router
                          className="apply-btn-info default-btn btn"
                        >
                          Apply
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="dashboard-profile-visibility-other-info">
                    <div className="dashboard-profile-visibility-hide">
                      <div className="dashboard-profile-visibility">
                        <h4>Profile Visibility</h4>
                        <span>
                          <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider round" />
                          </label>
                          <span>Visible</span>
                        </span>
                      </div>
                      <div className="dashboard-profile-visibility-content">
                        <p>
                          Employers can now see your profile. Keep it updated,
                          show who you are and offers will be on the way!
                        </p>
                      </div>
                    </div>
                    {/* <div className="dashboard-profile-visibility-hide">
                      <div className="dashboard-profile-visibility">
                        <h4>Profile Visibility</h4>
                        <span>
                          <label className="switch">
                            <input type="checkbox" />
                            <span className="slider round" />
                          </label>
                          <span>Hidden</span>
                        </span>
                      </div>
                      <div className="dashboard-profile-visibility-content">
                        <p>
                          Profile Visibility Hidden Make your profile visible to
                          employers looking for your qualifications and get job
                          interviews directly!
                        </p>
                      </div>
                    </div> */}
                    <div className="dashboard-other-detail-info">
                      <ul>
                        <li>
                          <i className="fa-solid fa-calendar-days" /> Browse
                          fresh job listings daily
                        </li>
                        <li>
                          <i className="fa-solid fa-heart" /> Save and organize
                          your top picks
                        </li>
                        <li>
                          <i className="fa-solid fa-bell" /> Get instant email
                          alerts for new opportunities
                        </li>
                        <li>
                          <i className="fa-solid fa-building" /> Follow your
                          dream companies for updates
                        </li>
                        <li>
                          <i className="fa-solid fa-file" /> Apply quickly with
                          your saved resume
                        </li>
                        <li>
                          <i className="fa-solid fa-signal" /> Stay on top of
                          your job search with ease
                        </li>
                      </ul>
                    </div>
                    <div className="recent-notifications-box">
                      <h3>Recruiter Messages</h3>
                      <ul>
                        <li>
                          <div className="icon">
                            <i className="flaticon-portfolio" />
                          </div>
                          <span>Tyrone Lowe</span> Applied For A Job{" "}
                          <strong>Software Engineer</strong>
                          <button
                            type="button"
                            className="close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="flaticon-portfolio" />
                          </div>
                          <span>Kaedyn Fraser</span> Applied For A Job{" "}
                          <strong>Web Developer</strong>
                          <button
                            type="button"
                            className="close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="flaticon-portfolio" />
                          </div>
                          <span>Harold Adams</span> Applied For A Job{" "}
                          <strong>Technical Architect</strong>
                          <button
                            type="button"
                            className="close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="flaticon-portfolio" />
                          </div>
                          <span>Joshua Mcnair</span> Applied For A Job{" "}
                          <strong>UI Designer</strong>
                          <button
                            type="button"
                            className="close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="flaticon-portfolio" />
                          </div>
                          <span>Kathryn Mcgee</span> Applied For A Job{" "}
                          <strong>Senior Product Designer</strong>
                          <button
                            type="button"
                            className="close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="flaticon-portfolio" />
                          </div>
                          <span>Kaedyn Fraser</span> Applied For A Job{" "}
                          <strong>Product Designer</strong>
                          <button
                            type="button"
                            className="close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="flaticon-portfolio" />
                          </div>
                          <span>Dianna Smiley</span> Applied For A Job{" "}
                          <strong>Android Developer</strong>
                          <button
                            type="button"
                            className="close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="flaticon-portfolio" />
                          </div>
                          <span>Micheal Murphy</span> Applied For A Job{" "}
                          <strong>Digital Marketer</strong>
                          <button
                            type="button"
                            className="close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* dashboard recent job posts  section end here */}
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

export default CandidateDashboard;
