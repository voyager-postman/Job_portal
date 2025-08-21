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
                    <Link to="/manage-job-application">
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
                    <a href="#">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i className="fa-solid fa-heart" />
                        </div>
                        <div className="box-content">
                          <h4>Saved Jobs</h4>
                          <h5>10</h5>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <a href="#">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i className="fa-solid fa-bell" />
                        </div>
                        <div className="box-content">
                          <h4>Job Alerts</h4>
                          <h5>5</h5>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-lg-4 col-sm-6 mb-4">
                    <a href="#">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i class="fa-solid fa-comment-dots"></i>
                        </div>
                        <div className="box-content">
                          <h4>Recruiter Messages </h4>
                          <h5>5</h5>
                        </div>
                      </div>
                    </a>
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
                    <a href="#">
                      <div className="dashboard-box-icon-content">
                        <div className="box-icon">
                          <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="box-content">
                          <h4>User Log</h4>
                          <h5>5</h5>
                        </div>
                      </div>
                    </a>
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
                    </div>
                  </div>
                </div>
              </div>
              <div className="candidate-complete-percent-btn">
                <h4>Profile strength: 0%</h4>
                <a href="candidate-profile.html" className="default-btn btn">
                  Complete Profile
                </a>
              </div>
            </div>
          </section>
          {/* candidate Complete profile section end here */}
          {/* dashboard recent job posts  section start here */}
          <section className="dashboard-heading-job-profile-info">
            <div className="dashboard-heading-info-area">
              <h2>Jobs hiring now</h2>
              <h4>Most recent job posts</h4>
            </div>
            <div className="dashboard-job-post-profile-area">
              <div className="dashboard-recent-job-post-info">
                <Link to={`/companies-details`}>
                  <div className="available-job-posts-box">
                    <div className="available-job-company-name-save-job">
                      <div className="available-job-company-name">
                        <h4>
                          <i className="fa-solid fa-building" /> Alibaba Cloud
                        </h4>
                      </div>
                      <div className="available-job-save-job">
                        <i className="fa-regular fa-heart" />
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
                  </div>
                </Link>
                <a href="job-details.html">
                  <div className="available-job-posts-box">
                    <div className="available-job-company-name-save-job">
                      <div className="available-job-company-name">
                        <h4>
                          <i className="fa-solid fa-building" /> Alibaba Cloud
                        </h4>
                      </div>
                      <div className="available-job-save-job">
                        <i className="fa-regular fa-heart" />
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
                  </div>
                </a>
                <a href="job-details.html">
                  <div className="available-job-posts-box">
                    <div className="available-job-company-name-save-job">
                      <div className="available-job-company-name">
                        <h4>
                          <i className="fa-solid fa-building" /> Alibaba Cloud
                        </h4>
                      </div>
                      <div className="available-job-save-job">
                        <i className="fa-regular fa-heart" />
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
                  </div>
                </a>
                <a href="job-details.html">
                  <div className="available-job-posts-box">
                    <div className="available-job-company-name-save-job">
                      <div className="available-job-company-name">
                        <h4>
                          <i className="fa-solid fa-building" /> Alibaba Cloud
                        </h4>
                      </div>
                      <div className="available-job-save-job">
                        <i className="fa-regular fa-heart" />
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
                  </div>
                </a>
                <a href="job-details.html">
                  <div className="available-job-posts-box">
                    <div className="available-job-company-name-save-job">
                      <div className="available-job-company-name">
                        <h4>
                          <i className="fa-solid fa-building" /> Alibaba Cloud
                        </h4>
                      </div>
                      <div className="available-job-save-job">
                        <i className="fa-regular fa-heart" />
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
                  </div>
                </a>
                <a href="job-details.html">
                  <div className="available-job-posts-box">
                    <div className="available-job-company-name-save-job">
                      <div className="available-job-company-name">
                        <h4>
                          <i className="fa-solid fa-building" /> Alibaba Cloud
                        </h4>
                      </div>
                      <div className="available-job-save-job">
                        <i className="fa-regular fa-heart" />
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
                  </div>
                </a>
              </div>
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
                      Employers can now see your profile. Keep it updated, show
                      who you are and offers will be on the way!
                    </p>
                  </div>
                </div>
                <div className="dashboard-profile-visibility-hide">
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
                </div>
                <div className="dashboard-other-detail-info">
                  <ul>
                    <li>
                      <i className="fa-solid fa-calendar-days" /> Browse fresh
                      job listings daily
                    </li>
                    <li>
                      <i className="fa-solid fa-heart" /> Save and organize your
                      top picks
                    </li>
                    <li>
                      <i className="fa-solid fa-bell" /> Get instant email
                      alerts for new opportunities
                    </li>
                    <li>
                      <i className="fa-solid fa-building" /> Follow your dream
                      companies for updates
                    </li>
                    <li>
                      <i className="fa-solid fa-file" /> Apply quickly with your
                      saved resume
                    </li>
                    <li>
                      <i className="fa-solid fa-signal" /> Stay on top of your
                      job search with ease
                    </li>
                  </ul>
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