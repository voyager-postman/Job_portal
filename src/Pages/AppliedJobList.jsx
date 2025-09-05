import { Link } from "react-router-dom";
function AppliedJobList() {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Applied jobs List</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="#">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Applied jobs List
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Applied jobs list start here */}
          <section className="applied-jobs-list-info">
            <div className="application-management-filter-info">
              <h5>Applied jobs List</h5>
            </div>
            <div className="applied-jobs-search-box-info">
              <div className="employer-candidate-search-box">
                <div className="employer-candidate-input-icon">
                  <div className="employer-candidate-icon">
                    <i className="fa-solid fa-briefcase" />
                  </div>
                  <div className="employer-candidate-input-area">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search By: Keywords, Job Title"
                    />
                  </div>
                </div>
                <div className="employer-candidate-btn-area">
                  <a href="#" className="default-btn btn">
                    Find
                  </a>
                </div>
              </div>
            </div>
            <div className="available-job-posts-box">
              <div className="available-job-company-name-save-job">
                <div className="available-job-company-name">
                  <a href="comapny-details-info.html">
                    <h4>
                      <img src="assets/images/icon/icon-26.png" /> Alibaba Cloud
                    </h4>
                  </a>
                </div>
                <div className="available-job-save-job">
                  <a href="https://www.linkedin.com/login" target="_blank">
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
                      <i className="fa-regular fa-file" /> Information Systems /
                      Networks
                    </li>
                  </ul>
                </div>
              </a>
              <div className="total-applicants-info">
                <Link to="/application-management">
                  <p>Applicants: 100</p>
                </Link>
              </div>
            </div>
            <div className="available-job-posts-box">
              <div className="available-job-company-name-save-job">
                <div className="available-job-company-name">
                  <a href="comapny-details-info.html">
                    <h4>
                      <img src="assets/images/icon/icon-1.png" />
                      Cloud Alibaba
                    </h4>
                  </a>
                </div>
                <div className="available-job-save-job">
                  <a href="https://www.linkedin.com/login" target="_blank">
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
                      <i className="fa-regular fa-file" /> Information Systems /
                      Networks
                    </li>
                  </ul>
                </div>
              </a>
              <div className="total-applicants-info">
                <Link to="/application-management">
                  <p>Applicants: 100</p>
                </Link>
              </div>
            </div>
            <div className="available-job-posts-box">
              <div className="available-job-company-name-save-job">
                <div className="available-job-company-name">
                  <a href="comapny-details-info.html">
                    <h4>
                      <img src="assets/images/icon/icon-2.png" />
                      Cloud Alibaba
                    </h4>
                  </a>
                </div>
                <div className="available-job-save-job">
                  <a href="https://www.linkedin.com/login" target="_blank">
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
                      <i className="fa-regular fa-file" /> Information Systems /
                      Networks
                    </li>
                  </ul>
                </div>
              </a>
              <div className="total-applicants-info">
                <Link to="/application-management">
                  <p>Applicants: 100</p>
                </Link>
              </div>
            </div>
            <div className="available-job-posts-box">
              <div className="available-job-company-name-save-job">
                <div className="available-job-company-name">
                  <a href="comapny-details-info.html">
                    <h4>
                      <img src="assets/images/icon/icon-4.png" />
                      Cloud Alibaba
                    </h4>
                  </a>
                </div>
                <div className="available-job-save-job">
                  <a href="https://www.linkedin.com/login" target="_blank">
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
                      <i className="fa-regular fa-file" /> Information Systems /
                      Networks
                    </li>
                  </ul>
                </div>
              </a>
              <div className="total-applicants-info">
                <Link to="/application-management">
                  <p>Applicants: 100</p>
                </Link>
              </div>
            </div>
            <div className="available-job-posts-box">
              <div className="available-job-company-name-save-job">
                <div className="available-job-company-name">
                  <a href="comapny-details-info.html">
                    <h4>
                      <img src="assets/images/icon/icon-5.png" />
                      Cloud Alibaba
                    </h4>
                  </a>
                </div>
                <div className="available-job-save-job">
                  <a href="https://www.linkedin.com/login" target="_blank">
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
                      <i className="fa-regular fa-file" /> Information Systems /
                      Networks
                    </li>
                  </ul>
                </div>
              </a>
              <div className="total-applicants-info">
                <Link to="/application-management">
                  <p>Applicants: 100</p>
                </Link>
              </div>
            </div>
          </section>
          {/* Applied jobs list end here */}
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

export default AppliedJobList;
