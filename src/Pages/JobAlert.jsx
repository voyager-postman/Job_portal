import React from "react";
import { Link } from "react-router-dom";

const JobAlert = () => {
  return (
    <div>
      <div class="main-dashboard-content d-flex flex-column">
        <div class="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Set Job Alerts</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/candidate-dashboard">Home </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Job Alerts
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* <!--job alert section start here--> */}
          <div class="my-profile-area">
            <div class="profile-form-content">
              <h3>Set Alerts</h3>
              <div class="profile-form">
                <form>
                  <div class="row">
                    <div class="col-lg-12 col-md-12">
                      <div class="form-group">
                        <label>Keyword</label>
                        {/* <!-- <div class="set-job-alert-tag">
                    <input type="text" class="form-control" placeholder="Enter Keyword Here....">
                   </div> --> */}
                        <div class="tag-box" id="tagBox">
                          <input
                            type="text"
                            id="tagInput"
                            placeholder="Enter Keyword Here...."
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6 col-md-6">
                      <div class="form-group">
                        <label>Location</label>
                        <select
                          class="form-select form-control"
                          aria-label="Default select example"
                        >
                          <option selected="">Select Location</option>
                          <option selected="">Delhi</option>
                          <option value="1">Bangalore</option>
                          <option value="2">USA</option>
                          <option value="3">Remote</option>
                        </select>
                      </div>
                    </div>

                    <div class="col-lg-6 col-md-6">
                      <div class="form-group">
                        <label>Job Type</label>
                        <select
                          class="form-select form-control"
                          aria-label="Default select example"
                        >
                          <option selected="">Select Job Type</option>
                          <option value="1">Part-time</option>
                          <option value="2">Internship</option>
                          <option value="3">Contract</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-6 col-md-6">
                      <div class="form-group">
                        <label>Delivery Method</label>
                        <select
                          class="form-select form-control"
                          aria-label="Default select example"
                        >
                          <option selected="">Select Delivery Method</option>
                          <option value="1">Emai</option>
                          <option value="2">In-app Notification</option>
                          <option value="3">Emai+In-app Notification</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-6 col-md-6">
                      <div class="form-group frequency-radio-btn">
                        <label>Frequency</label>
                        <div class="form-group">
                          <input
                            type="radio"
                            id="Hourly"
                            name="fav_language"
                            value="Hourly"
                          />
                          <label for="Hourly">Real-time</label>
                          <input
                            type="radio"
                            id="Daily"
                            name="fav_language"
                            value="Daily"
                          />
                          <label for="Daily">Daily</label>
                          <input
                            type="radio"
                            id="Monthly"
                            name="fav_language"
                            value="Monthly"
                          />
                          <label for="Monthly">Weekly</label>
                          <input
                            type="radio"
                            id="Monthly"
                            name="fav_language"
                            value="Monthly"
                          />
                          <label for="Monthly">Monthly</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="set-job-alert-btn">
                    <a href="#" class="default-btn btn">
                      Submit
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* <!--job alert section end here--> */}
        </div>
      </div>
    </div>
  );
};

export default JobAlert;
