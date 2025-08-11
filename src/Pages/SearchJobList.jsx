function SearchJobList() {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Search Job List</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Search Job List
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
          {/*Jobs filter and job list info Area */}
          <div className="job-filter-job-list-info">
            <div className="row">
              <div className="col-lg-3 col-sm-3">
                <div className="job-filter-main-info">
                  <div className="job-filter-heading-area">
                    <h4>
                      <i className="fa-regular fa-file" /> Job Posts
                    </h4>
                  </div>
                  <div className="job-filter-heading-area">
                    <h4>
                      <i className="fa-regular fa-building" /> Companies
                    </h4>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fa-solid fa-gear" /> Job category
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>Clear</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Select Job Category</option>
                        <option value={1}>Java</option>
                        <option value={2}>Python</option>
                        <option value={3}>React</option>
                        <option value={2}>Python</option>
                        <option value={3}>React</option>
                      </select>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fa-solid fa-gear" /> Job Type
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>Clear</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <ul>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Full Time</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Part Time</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Remote</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Freelance</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Internship</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fa-solid fa-location-dot" /> Location
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>Clear</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Select Job type</option>
                        <option value={1}>India</option>
                        <option value={2}>USA</option>
                        <option value={3}>Paris</option>
                        <option value={4}>Germany</option>
                        <option value={2}>Spain</option>
                        <option value={3}>Mau</option>
                      </select>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fa-solid fa-globe" /> Remote Jobs
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>Clear</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <input
                        type="checkbox"
                        id="OtherPreferences"
                        name="OtherPreferences"
                        defaultValue="Other Preferences"
                      />
                      <label htmlFor="vehicle1"> Remote</label>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fa-solid fa-gear" /> Hybrid Jobs
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>Clear</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <input
                        type="checkbox"
                        id="OtherPreferences"
                        name="OtherPreferences"
                        defaultValue="Other Preferences"
                      />
                      <label htmlFor="vehicle1"> Hybrid Jobs</label>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fas fa-signal" /> Experience Level
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>Clear</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <ul>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Junior</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Mid</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> Senior</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fas fa-money-bill-alt" /> Salary Range
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>Clear</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <ul>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> 0 to $100</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> $ 101 to $ 150</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> $ 151 to $ 200</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id="OtherPreferences"
                            name="OtherPreferences"
                            defaultValue="Other Preferences"
                          />
                          <label htmlFor="vehicle1"> $ 201 to $ 250</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fas fa-building" /> Industry Sector
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>Clear</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Select Industry</option>
                        <option value={1}>Agriculture</option>
                        <option value={2}>Air Transport</option>
                        <option value={3}>Automotive</option>
                        <option value={4}>Biotechnology</option>
                        <option value={2}>Chemicals</option>
                        <option value={3}>Construction</option>
                      </select>
                    </div>
                  </div>
                  <div className="divder-line-info" />
                  <div className="job-filter-search-area">
                    <div className="job-filter-heading-cancel">
                      <div className="job-filter-heading">
                        <h4>
                          <i className="fas fa-building" /> Company
                        </h4>
                      </div>
                      <div className="job-filter-cancel-heading">
                        <h4>Clear</h4>
                      </div>
                    </div>
                    <div className="job-filter-select-info">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Select Company</option>
                        <option value={1}>Agriculture</option>
                        <option value={2}>Air Transport</option>
                        <option value={3}>Automotive</option>
                        <option value={4}>Biotechnology</option>
                        <option value={2}>Chemicals</option>
                        <option value={3}>Construction</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-9">
                <div className="available-job-posts-info">
                  <div className="available-job-posts-heading">
                    <h4>
                      <i className="fa-regular fa-file" /> 6905 available job
                      posts
                    </h4>
                  </div>
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
                </div>
              </div>
            </div>
          </div>
          {/*Jobs filter and job list info Area */}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name"> Jaba.</span> All Rights
                    Reserved
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    Designed By{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      HiBootstrap
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

export default SearchJobList;
