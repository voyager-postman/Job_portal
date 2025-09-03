import React from "react";
import { Link } from "react-router-dom";

function CreateRecruiters() {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Create Recruiters</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Create Recruiters
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>Create Recruiters</h3>
              <div className="profile-form">
                <form>
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>First name</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="First name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Last name</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Password</label>
                        <input
                          className="form-control"
                          type="password"
                          placeholder="Password"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group">
                        <label>Position</label>
                        <input
                          className="form-control"
                          type="password"
                          placeholder="Position"
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
                  </div>
                  <div className="create-recruiters-btn">
                    <button type="submit" className="default-btn btn">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/*End My Profile Area*/}
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
    </>
  );
}

export default CreateRecruiters;
