function CandidateProfile() {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>My Profile</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> My Profile
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>My Account</h3>
              <div className="candidates-detail-main-area">
                <div className="candidates-img-detail-info">
                  <div className="candidates-img-info">
                    <img
                      src="/jobPortal/assets/images/dashboard/dashboard-img-5.jpg"
                      alt="Image"
                    />
                    <div className="img-edit-icon">
                      <i className="fas fa-pencil-alt" />
                    </div>
                  </div>
                  <div className="candidates-details-info">
                    <h3>
                      <strong>Name:</strong> Andy Smith
                    </h3>
                    <h3>
                      <strong>Position:</strong>Website Desginer
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
                <div className="profile-visibility-info-area">
                  <span className="visibility-icon-content">
                    <i className="fa-regular fa-eye" /> Profile Visibility
                  </span>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round" />
                  </label>
                  <div className="profile-visible-recruiters">
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
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Personal Details</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="not-add-detail-info">
                        <h5>You haven’t yet added any Personal Details.</h5>
                        <i className="fa-solid fa-user" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Personal Details</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>First Name</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="First Name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Last Name</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Last Name"
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
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Year Of Birth</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Year Of Birth"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Gender Identity</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Gender Identity"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="save-cancel-btn-info">
                    <a href="#" className="default-btn btn">
                      Save
                    </a>
                    <a href="#" className="default-btn btn">
                      Cancel
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="user-all-detail-info-main">
              <div className="input-info-edit-area">
                <h3>Personal Details</h3>
                <i className="fas fa-pencil-alt" />
              </div>
              <div className="user-all-details-info">
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>First name</label>
                      <p>Jhama</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Last name</label>
                      <p>Kumari</p>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Email</label>
                      <p>mobappssolutions142@gmail.com</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Phone number</label>
                      <p>9874563214</p>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Year of birth</label>
                      <p>2025</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Gender Identity</label>
                      <p>Male</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Professional Summary</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="not-add-detail-info">
                        <h5>You haven’t yet added any Professional Summary.</h5>
                        <i className="fa-solid fa-user" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Professional Summary</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>Professional Summary</label>
                        <textarea
                          className="form-control"
                          placeholder="Write Brief Bio Or Introduction"
                          rows={7}
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="save-cancel-btn-info">
                    <a href="#" className="default-btn btn">
                      Save
                    </a>
                    <a href="#" className="default-btn btn">
                      Cancel
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="user-all-detail-info-main">
              <div className="input-info-edit-area">
                <h3>Professional Summary</h3>
                <i className="fas fa-pencil-alt" />
              </div>
              <div className="user-all-details-info">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Professional Summary</label>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.
                        It was popularised in the 1960s with the release of
                        Letraset sheets containing Lorem Ipsum passages, and
                        more recently with desktop publishing software like
                        Aldus PageMaker including versions of Lorem Ipsum.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Location Details</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="not-add-detail-info">
                        <h5>You haven’t yet added any Location Details.</h5>
                        <i className="fa-solid fa-location-dot" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Location Details</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
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
                          <option selected>Noida</option>
                          <option value={1}>Mau</option>
                          <option value={2}>Kanpur</option>
                          <option value={3}>Muradabad</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="save-cancel-btn-info">
                    <a href="#" className="default-btn btn">
                      Save
                    </a>
                    <a href="#" className="default-btn btn">
                      Cancel
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="user-all-detail-info-main">
              <div className="input-info-edit-area">
                <h3>Location Details</h3>
                <i className="fas fa-pencil-alt" />
              </div>
              <div className="user-all-details-info">
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>City</label>
                      <p>Noida</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Nationality</label>
                      <p>India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-form-content">
              <h3>My CVs</h3>
              <div className="profile-form">
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
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Career Goals</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="not-add-detail-info">
                        <h5>You haven’t yet added any Career Goals.</h5>
                        <i className="fa-solid fa-bullseye" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Career Goals</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
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
                        <label>Other Preferences</label>
                        <div className="currently-working-here">
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1">
                            {" "}
                            I am eligible to work in France
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Minimum Desired Salary (Gross)</label>
                        <div className="form-group">
                          <input
                            type="radio"
                            id="hourly"
                            name="fav_language"
                            defaultValue="Hourly"
                          />
                          &nbsp; <label htmlFor="hourly">Hourly</label>
                          &nbsp;{" "}
                          <input
                            type="radio"
                            id="daily"
                            name="fav_language"
                            defaultValue="Daily"
                          />
                          &nbsp; <label htmlFor="daily">Daily</label>
                          &nbsp;{" "}
                          <input
                            type="radio"
                            id="monthly"
                            name="fav_language"
                            defaultValue="Monthly"
                          />
                          &nbsp; <label htmlFor="monthly">Monthly</label>
                          <input
                            type="radio"
                            id="yearly"
                            name="fav_language"
                            defaultValue="Yearly"
                          />
                          &nbsp; <label htmlFor="yearly">Yearly</label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <select
                          className="form-select form-control"
                          aria-label="Default2 select example"
                        >
                          <option selected>EUR</option>
                          <option value={1}>USD</option>
                          <option value={2}>JPY</option>
                          <option value={3}>GBP</option>
                          <option value={4}>AUD</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-9 col-md-9">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="number"
                          placeholder="Enter your gross minimum desired salary"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>Looking for a new job opportunity?</label>
                        <div className="form-group">
                          <input
                            type="radio"
                            id="hourly"
                            name="fav_language"
                            defaultValue="Hourly"
                          />
                          &nbsp;{" "}
                          <label htmlFor="hourly">
                            Yes, I need one as soon as possible
                          </label>
                          &nbsp;{" "}
                          <input
                            type="radio"
                            id="daily"
                            name="fav_language"
                            defaultValue="Daily"
                          />
                          &nbsp;{" "}
                          <label htmlFor="daily">
                            Open to the right opportunity
                          </label>
                          &nbsp;{" "}
                          <input
                            type="radio"
                            id="monthly"
                            name="fav_language"
                            defaultValue="Monthly"
                          />
                          &nbsp;{" "}
                          <label htmlFor="monthly">No, I'm not looking</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="save-cancel-btn-info">
                    <a href="#" className="default-btn btn">
                      Save
                    </a>
                    <a href="#" className="default-btn btn">
                      Cancel
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="user-all-detail-info-main">
              <div className="input-info-edit-area">
                <h3>Career Goals</h3>
                <i className="fas fa-pencil-alt" />
              </div>
              <div className="user-all-details-info">
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <label>Desired Job Title</label>
                      <p>Website designer</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <label>Desired Employment Type</label>
                      <p>Permanent contract</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <label>Desired Occupation Type</label>
                      <p>Full-time</p>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <label>Eligible to work in</label>
                      <p>France</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <label>Minimum Desired Salary (Gross)</label>
                      <p>€25 / Hourly</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <label>Looking for a new job opportunity?</label>
                      <p>Yes, I need one as soon as possible</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>About your role</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="not-add-detail-info">
                        <h5>You haven’t yet added any About your role.</h5>
                        <i className="fa-solid fa-users-gear" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>About your role</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Job Title</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="Job Title"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Years of experience</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="Years of Experience"
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
                  </div>
                  <div className="save-cancel-btn-info">
                    <a href="#" className="default-btn btn">
                      Save
                    </a>
                    <a href="#" className="default-btn btn">
                      Cancel
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="user-all-detail-info-main">
              <div className="input-info-edit-area">
                <h3>About your role</h3>
                <i className="fas fa-pencil-alt" />
              </div>
              <div className="user-all-details-info">
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <label>Job Title</label>
                      <p>Website designer</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <label>Years of experience</label>
                      <p>10</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <label>Job category</label>
                      <p>Software Engineering / Web Development</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Work Experience</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="not-add-detail-info">
                        <h5>You haven’t yet added any Work Experience.</h5>
                        <i className="fa-solid fa-briefcase" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Work Experience</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
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
                        <label>Position</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Position"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
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
                          placeholder="End Date"
                        />
                      </div>
                    </div>
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
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>Achievements</label>
                        <textarea
                          className="form-control"
                          placeholder="Write here about your achievements"
                          rows={7}
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>Employment Type</label>
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
                    <div className="col-lg-12 col-md-12">
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
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group-salary">
                        <label>Position Salary</label>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-2">
                      <div className="form-group">
                        <select
                          className="form-select form-control"
                          aria-label="Default2 select example"
                        >
                          <option selected>EUR</option>
                          <option value={1}>Development</option>
                          <option value={2}>Information IT</option>
                          <option value={3}>Corporate Job</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-10 col-md-10">
                      <div className="form-group">
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
                  </div>
                  <div className="save-cancel-btn-info">
                    <a href="#" className="default-btn btn">
                      Save
                    </a>
                    <a href="#" className="default-btn btn">
                      Cancel
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="user-all-detail-info-main">
              <div className="input-info-edit-area">
                <h3>Experience</h3>
              </div>
              <div className="user-all-details-info">
                <div className="work-exprinace-edit">
                  <i className="fas fa-pencil-alt" />
                </div>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Wordpress Designer</label>
                      <p>Feb 2502 - May 2025</p>
                      <p>
                        <i className="fa-regular fa-building" /> Sell India LTD
                      </p>
                      <p>Full-time</p>
                    </div>
                    <div className="divder-line-info" />
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Achievements</label>
                      <p>
                        You're good to go! We’ve transferred your personal
                        details and qualifications from your CV to your profile
                        to save you time. Check it out!
                      </p>
                    </div>
                    <div className="divder-line-info" />
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Salary</label>
                      <p>2025 ₹</p>
                      <label>Payroll frequency</label>
                      <p>Monthly</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="divder-line-info" />
              <div className="user-all-details-info">
                <div className="work-exprinace-edit">
                  <i className="fas fa-pencil-alt" />
                </div>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Wordpress Designer</label>
                      <p>Feb 2502 - May 2025</p>
                      <p>
                        <i className="fa-regular fa-building" /> Sell India LTD
                      </p>
                      <p>Full-time</p>
                    </div>
                    <div className="divder-line-info" />
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Achievements</label>
                      <p>
                        You're good to go! We’ve transferred your personal
                        details and qualifications from your CV to your profile
                        to save you time. Check it out!
                      </p>
                    </div>
                    <div className="divder-line-info" />
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Salary</label>
                      <p>2025 ₹</p>
                      <label>Payroll frequency</label>
                      <p>Monthly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Education</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="not-add-detail-info">
                        <h5>You haven’t yet added any education.</h5>
                        <i className="fa-solid fa-user-graduate" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Education</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>School</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="School"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>School Name</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="School Name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          className="form-control"
                          type="date"
                          placeholder
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          className="form-control"
                          type="date"
                          placeholder
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Degree</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="Degree"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>University</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="University"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          className="form-control"
                          type="date"
                          placeholder
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          className="form-control"
                          type="date"
                          placeholder
                        />
                      </div>
                    </div>
                  </div>
                  <div className="currently-working-here">
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
                  <div className="save-cancel-btn-info">
                    <a href="#" className="default-btn btn">
                      Save
                    </a>
                    <a href="#" className="default-btn btn">
                      Cancel
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="user-all-detail-info-main">
              <div className="input-info-edit-area">
                <h3>Education</h3>
                <i className="fas fa-pencil-alt" />
              </div>
              <div className="user-all-details-info">
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Schools</label>
                      <p>
                        12<sup>th</sup>
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>School Name</label>
                      <p>University of Oxford</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Start Date</label>
                      <p>02 / 2025</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>End Date</label>
                      <p>02 / 2045</p>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Degree</label>
                      <p>B.tech</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>University</label>
                      <p>University of Oxford</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>Start Date</label>
                      <p>02 / 2025</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <label>End Date</label>
                      <p>02 / 2045</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-form-content">
              <h3>Skills &amp; Technologies</h3>
              <div className="profile-form">
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
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Languages</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="not-add-detail-info">
                        <h5>You haven’t yet added any languages.</h5>
                        <i className="fa-solid fa-language" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Languages</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
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
                        <label>Basic</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Basic (A1 / A2)"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Limited Working</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="Limited Working (B1)"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Professinal</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="Professinal (B2)"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Full Projessional</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="Full Projessional (C1)"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Full Professional</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="Full Professional (C1)"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Native/Bilingual</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="Native/Bilingual"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="save-cancel-btn-info">
                    <a href="#" className="default-btn btn">
                      Save
                    </a>
                    <a href="#" className="default-btn btn">
                      Cancel
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="user-all-detail-info-main">
              <div className="input-info-edit-area">
                <h3>Languages</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="user-all-details-info">
                <div className="work-exprinace-edit">
                  <i className="fas fa-pencil-alt" />
                </div>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Hindi</label>
                      <p>Native / Bilingual (C2)</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="divder-line-info" />
              <div className="user-all-details-info">
                <div className="work-exprinace-edit">
                  <i className="fas fa-pencil-alt" />
                </div>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>English</label>
                      <p>Basic (A1 / A2)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>Certificates</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Certificate Title</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Certificate Title"
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
                  </div>
                  <div className="save-cancel-btn-info">
                    <a href="#" className="default-btn btn">
                      Save
                    </a>
                    <a href="#" className="default-btn btn">
                      Cancel
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="user-all-detail-info-main">
              <div className="input-info-edit-area">
                <h3>Certificates</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="user-all-details-info">
                <div className="work-exprinace-edit">
                  <i className="fas fa-pencil-alt" />
                </div>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>B.com</label>
                      <p>Issue Date: 2052</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="divder-line-info" />
              <div className="user-all-details-info">
                <div className="work-exprinace-edit">
                  <i className="fas fa-pencil-alt" />
                </div>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>B.Tech</label>
                      <p>Issue Date: 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>LinkedIn/Portfolio Links</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="not-add-detail-info">
                        <h5>
                          You haven’t yet added any LinkedIn/Portfolio Links
                        </h5>
                        <i className="fa-solid fa-user" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="profile-form-content">
              <div className="input-info-edit-area">
                <h3>LinkedIn/Portfolio Links</h3>
                <i className="fa-solid fa-plus" />
              </div>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>Add personal website</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="Add personal website"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>GitHub</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="GitHub"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>LinkedIn</label>
                        <input
                          className="form-control"
                          type="url"
                          placeholder="LinkedIn"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="save-cancel-btn-info">
                    <a href="#" className="default-btn btn">
                      Save
                    </a>
                    <a href="#" className="default-btn btn">
                      Cancel
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="user-all-detail-info-main">
              <div className="input-info-edit-area">
                <h3>LinkedIn/Portfolio Links</h3>
                <i className="fas fa-pencil-alt" />
              </div>
              <div className="user-all-details-info">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Add personal website</label>
                      <p>
                        <a href="#" target="_blank">
                          https://itdevelopmentservices.com/jobPortal/
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>GitHub</label>
                      <p>
                        <a href="#" target="_blank">
                          https://github.com/
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>LinkedIn</label>
                      <p>
                        <a href="#" target="_blank">
                          https://in.linkedin.com/
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-form-content">
              <h3>Delete Account</h3>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="delete-account">
                        <p>
                          If you want to permanently delete your account,{" "}
                          <span>
                            <a herf="#">click here.</a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/*End My Profile Area*/}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name"> Connect Work.ma </span> All Rights
                    Reserved
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

export default CandidateProfile;
