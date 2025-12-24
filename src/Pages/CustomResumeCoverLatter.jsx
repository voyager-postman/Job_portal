import React from "react";
import { Link } from "react-router-dom";

const CustomResumeCoverLatter = () => {
  return (
    <>
      <div className="page-banner-area bg-f0f4fc">
        <div className="container">
          <div className="page-banner-content">
            <h1>Custom Resume Cover Letter</h1>
            <ul>
              <li>
                <a href="index-2.html">Home</a>
              </li>
              <li>Custom Resume Cover Letter</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="custom-resume-cover-letter-job-seeker-info">
        <div className="container">
          <div className="row">
            <div className="custom-resume-cover-letter-heading">
              <h4>Edit profile details</h4>
            </div>
          </div>
          <div className="row">
            <div className="custom-resume-cover-letter-candidate-detail">
              <div className="custom-resume-cover-letter-candidates-img-detail-info">
                <div className="custom-resume-cover-letter-candidates-img-info">
                  <img
                    src="assets/images/dashboard/dashboard-img-5.jpg"
                    alt="Image"
                  />
                  <div className="custom-resume-cover-letter-img-edit-icon">
                    <i className="fas fa-pencil-alt" />
                  </div>
                </div>
                <div className="custom-resume-cover-letter-candidates-details-info">
                  <h3>
                    <strong>Name:</strong> Andy Smith
                  </h3>
                  <h3>
                    <strong>Position:</strong> Website Desginer
                  </h3>
                  <h3>
                    <strong>Email:</strong> andysmith@gmail.com
                  </h3>
                  <h3>
                    <strong>Contact:</strong> +567 908 234 875
                  </h3>
                  <h3>
                    <strong>Address:</strong> New York, USA
                  </h3>
                </div>
              </div>
              <div className="custom-resume-cover-letter-website-promotion">
                <ul>
                  <li>
                    <i className="fa-regular fa-clock" />
                    Get Hired Faster
                  </li>
                  <li>
                    <i className="fa-solid fa-signal" />
                    Attract more job offers
                  </li>
                  <li>
                    <i className="fa-regular fa-star" />
                    Get offers by Top Employers
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>Personal Details</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-user-detail-info">
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>First name</h4>
                    <p>Jhama</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Last name</h4>
                    <p>Kumari</p>
                  </div>
                  <div className="custom-resume-cover-user-edit">
                    <i className="fas fa-pencil-alt" />
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Email</h4>
                    <p>mobappssolutions142@gmail.com</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Phone number</h4>
                    <p>9874563214</p>
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Year of birth</h4>
                    <p>2025</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Gender Identity</h4>
                    <p>Male</p>
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>City</h4>
                    <p>Noida</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Nationality</h4>
                    <p>India</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="custom-resume-cover-letter-input-field-info-area">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Jhama"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Kumari"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="hello@gmail.com"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder={9874563214}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Year Of Birth</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="1-8-2025"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Gender Identity</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Male"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>City</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default2 select example"
                    >
                      <option selected>Noida</option>
                      <option value={1}>Mau</option>
                      <option value={2}>Kanpur</option>
                      <option value={3}>Muradabad</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Nationality</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default2 select example"
                    >
                      <option selected>India</option>
                      <option value={1}>USA</option>
                      <option value={2}>UK</option>
                      <option value={3}>Paris</option>
                    </select>
                  </div>
                </div>
                <div className="custom-resume-cover-letter-save-cancel-btn">
                  <span className="default-btn btn">Save</span>
                  <span className="default-btn btn">Cancel</span>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>My CVs</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-letter-upload-cv">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="upload-download-dlt-cv">
                        <div className="upload-cv-info-area">
                          <p>
                            <i className="fas fa-file-alt" /> Workscope For Job
                            Portal Platform like docx
                          </p>
                        </div>
                        <div className="download-dlt-cv">
                          <i className="fas fa-ellipsis-v" />
                          <div className="download-edit-info">
                            <ul>
                              <li>
                                <i className="fa-solid fa-arrow-down" />{" "}
                                Download
                              </li>
                              <li>
                                <i className="fa-solid fa-trash" /> Delete
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="upload-cv-area">
                        <input
                          type="file"
                          name="avatar"
                          accept=".pdf, .doc, .docx"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>Career Goals</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-user-detail-info">
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Desired Job Title</h4>
                    <p>Website designer</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Desired Employment Type</h4>
                    <p>Permanent contract</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Desired Occupation Type</h4>
                    <p>Full-time</p>
                  </div>
                  <div className="custom-resume-cover-user-edit">
                    <i className="fas fa-pencil-alt" />
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Minimum Desired Salary (Gross)</h4>
                    <p>€25 / Hourly</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="resume-cover-letter-divder-line-info" />
            <div className="custom-resume-cover-letter-input-field-info-area">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Desired Job Title</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Desired Job Title"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Desired Employment Type</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default2 select example"
                    >
                      <option selected>Select Employment Type</option>
                      <option value={1}>Full-time</option>
                      <option value={2}>Part-time</option>
                      <option value={3}>Contract</option>
                      <option value={2}>Temporary</option>
                      <option value={3}>Apprenticeship</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Desired Occupation Type</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default2 select example"
                    >
                      <option value={3}>Select Occupation Type</option>
                      <option selected>Skills and Interests</option>
                      <option value={1}>Industry</option>
                      <option value={2}>Healthcare</option>
                      <option value={3}>Technology</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Minimum Desired Salary (Gross)</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Minimum Desired Salary (Gross)"
                    />
                  </div>
                </div>
                <div className="custom-resume-cover-letter-save-cancel-btn">
                  <span className="default-btn btn">Save</span>
                  <span className="default-btn btn">Cancel</span>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>About your role</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-user-detail-info">
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Job Title</h4>
                    <p>Website designer</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Years of experience</h4>
                    <p>8</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Job category</h4>
                    <p>Web Development</p>
                  </div>
                  <div className="custom-resume-cover-user-edit">
                    <i className="fas fa-pencil-alt" />
                    {/* onclick="toggleBox('personal_info','box1')"  */}
                  </div>
                </div>
              </div>
            </div>
            <div className="resume-cover-letter-divder-line-info" />
            <div className="custom-resume-cover-letter-input-field-info-area">
              {/* id="box1" style="display: none" */}
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Job Title"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Years of experience</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Years of experience"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Job category</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default2 select example"
                    >
                      <option selected>Digital</option>
                      <option value={1}>Website Desgin</option>
                      <option value={2}>Php</option>
                      <option value={3}>Testing</option>
                      <option value={4}>Team Leader</option>
                    </select>
                  </div>
                </div>
                <div className="custom-resume-cover-letter-save-cancel-btn">
                  <span className="default-btn btn">Save</span>
                  <span className="default-btn btn">Cancel</span>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>Work Experience</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-user-detail-info">
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Website designer</h4>
                    <p>Jun 2017 - Dec 2020</p>
                    <p>Marvel Studios</p>
                    <p>New York, NY</p>
                    <p>Full Time</p>
                  </div>
                  <div className="custom-resume-cover-user-edit">
                    <i className="fas fa-pencil-alt" />
                    {/* onclick="toggleBox('personal_info','box1')"  */}
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Description</h4>
                    <p>
                      Led digital campaigns that increased client engagement by
                      35% year-over-year
                    </p>
                    <p>
                      Managed a $250K annual advertising budget with a focus on
                      ROI optimization
                    </p>
                    <p>
                      Implemented SEO/SEM strategies that improved organic
                      search rankings by 60
                    </p>
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Salary</h4>
                    <p>2000</p>
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Payroll frequency</h4>
                    <p>Monthly</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="resume-cover-letter-divder-line-info" />
            <div className="custom-resume-cover-letter-input-field-info-area">
              {/* id="box1" style="display: none" */}
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Job Title"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Company Name"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="Start Date"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="Start Date"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <div className="currently-working-here">
                      <input
                        type="checkbox"
                        id="CurrentlyWorking"
                        name="CurrentlyWorking"
                        defaultValue="Currently Working"
                      />
                      <label htmlFor="vehicle1">
                        {" "}
                        I Am Currently Working Here
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Write a few words about your role, responsibilities and achievements."
                      rows={3}
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Employment Type</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default2 select example"
                    >
                      <option selected>Choose</option>
                      <option value={1}>Part Time</option>
                      <option value={2}>Full Time</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Work Location</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default2 select example"
                    >
                      <option selected>Choose</option>
                      <option value={1}>Development</option>
                      <option value={2}>Information IT</option>
                      <option value={3}>Corporate Job</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3">
                  <div className="form-group">
                    <label>Position Salary</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default2 select example"
                    >
                      <option selected>EUR</option>
                      <option value={1}>USD</option>
                      <option value={2}>JPY</option>
                      <option value={3}>GBP</option>
                      <option value={3}>AUD</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-9 col-md-9">
                  <div className="form-group">
                    <label>Enter Salary</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Salary"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <select
                      className="form-select form-control"
                      aria-label="Default2 select example"
                    >
                      <option selected>Select payroll frequency</option>
                      <option value={1}>Weekly</option>
                      <option value={2}>Monthly</option>
                    </select>
                  </div>
                </div>
                <div className="custom-resume-cover-letter-save-cancel-btn">
                  <span className="default-btn btn">Save</span>
                  <span className="default-btn btn">Cancel</span>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>Education</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-user-detail-info">
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Schools</h4>
                    <p>
                      12<sup>th</sup>
                    </p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>School Name</h4>
                    <p>University of Oxford</p>
                  </div>
                  <div className="custom-resume-cover-user-edit">
                    <i className="fas fa-pencil-alt" />
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Start Date</h4>
                    <p>02 / 2025</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>End Date</h4>
                    <p>02 / 2045</p>
                  </div>
                </div>
                <div className="resume-cover-letter-divder-line-info" />
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Degree</h4>
                    <p>2025</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>End Date</h4>
                    <p>02 / 2045</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="custom-resume-cover-letter-input-field-info-area">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>School</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="School"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>School Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Kumari"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="Start Date"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="End Date"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Degree</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Degree"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>University</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="University Name"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="Start Date"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      className="form-control"
                      type="date"
                      placeholder="End Date"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <input
                      type="checkbox"
                      id="studying"
                      name="CurrentlyWorking"
                      defaultValue="studying"
                    />
                    <label htmlFor="vehicle1">
                      {" "}
                      I am currently studying here.
                    </label>
                  </div>
                </div>
                <div className="custom-resume-cover-letter-save-cancel-btn">
                  <span className="default-btn btn">Save</span>
                  <span className="default-btn btn">Cancel</span>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>Skills &amp; Technologies</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-letter-add-skill">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="enter-skill-info">
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="url"
                            placeholder="Enter Skills"
                          />
                        </div>
                        <div className="skill-btn-info">
                          <a href="#" className="default-btn btn">
                            Add Skills
                          </a>
                        </div>
                      </div>
                      <div className="enter-skill-tag-info">
                        <ul>
                          <li>
                            Technologies <i className="fa-solid fa-xmark" />
                          </li>
                          <li>
                            Skills <i className="fa-solid fa-xmark" />
                          </li>
                          <li>
                            Website Designer <i className="fa-solid fa-xmark" />
                          </li>
                          <li>
                            Digtial Marketing{" "}
                            <i className="fa-solid fa-xmark" />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>Languages</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-user-detail-info">
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>Hindi</h4>
                    <p>Native / Bilingual (C2)</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>English</h4>
                    <p>Basic (A1 / A2)</p>
                  </div>
                  <div className="custom-resume-cover-user-edit">
                    <i className="fas fa-pencil-alt" />
                    {/* onclick="toggleBox('personal_info','box1')"  */}
                  </div>
                </div>
              </div>
            </div>
            <div className="resume-cover-letter-divder-line-info" />
            <div className="custom-resume-cover-letter-input-field-info-area">
              {/* id="box1" style="display: none" */}
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default2 select example"
                    >
                      <option selected>Brazil</option>
                      <option value={1}>USA</option>
                      <option value={2}>Italy</option>
                      <option value={3}>UK</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Language skills</label>
                    <select
                      className="form-select form-control"
                      aria-label="Default2 select example"
                    >
                      <option selected>Basic (A1/A2)</option>
                      <option value={1}>Limited working (B1)</option>
                      <option value={2}>Professional working (B2)</option>
                      <option value={3}>Full professional (C1)</option>
                      <option value={3}>Native / Bilingual (C2)</option>
                    </select>
                  </div>
                </div>
                <div className="custom-resume-cover-letter-save-cancel-btn">
                  <span className="default-btn btn">Save</span>
                  <span className="default-btn btn">Cancel</span>
                </div>
              </div>
            </div>
          </div>
          <div className="custom-resume-cover-letter-detail-info">
            <div className="row">
              <div className="custom-resume-cover-letter-heading">
                <h4>Certificates</h4>
              </div>
              <div className="resume-cover-letter-divder-line-info" />
              <div className="custom-resume-cover-user-detail-info">
                <div className="custom-resume-cover-job-seeker-info">
                  <div className="custom-resume-cover-job-seeker">
                    <h4>B.com</h4>
                    <p>Issue Date: 2052</p>
                  </div>
                  <div className="custom-resume-cover-job-seeker">
                    <h4>B.Tech</h4>
                    <p>Issue Date: 2024</p>
                  </div>
                  <div className="custom-resume-cover-user-edit">
                    <i className="fas fa-pencil-alt" />
                  </div>
                </div>
              </div>
            </div>
            <div className="resume-cover-letter-divder-line-info" />
            <div className="custom-resume-cover-letter-input-field-info-area">
              {/* id="box1" style="display: none" */}
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Certificate title</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Certificate title"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Issue Date</label>
                    <input
                      className="form-control"
                      type="url"
                      placeholder="YYYY"
                    />
                  </div>
                </div>
                <div className="custom-resume-cover-letter-save-cancel-btn">
                  <span className="default-btn btn">Save</span>
                  <span className="default-btn btn">Cancel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomResumeCoverLatter;
