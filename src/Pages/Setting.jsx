import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axiosInstance"
const Setting = () => {
  const [activeTab, setActiveTab] = useState("menu1");
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  };

  return (
    <>
      <section className="job-card-list-info-area">
        <div className="container">
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>Setting</h3>
              <div className="company-profile-management-info">
                {/* Nav Tabs */}
                <div className="company-profile-management-tab">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "menu1" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("menu1")}
                        data-bs-toggle="tab"
                      >
                        Employer Profile
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "menu2" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("menu2")}
                      >
                        Change Password
                      </a>
                    </li>
                  </ul>
                </div>
                {/* Tab Panes */}
                <div className="company-profile-management-input-form">
                  <div className="tab-content">
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu1" ? "show active" : ""
                      }`}
                      id="menu1"
                      role="tabpanel"
                    >
                      <div className="profile-form">
                        <form>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Name</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Enter Name"
                                  name="name"
                                  // value={formData.brand_name}
                                  // onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Email</label>
                                <input
                                  className="form-control"
                                  type="email"
                                  placeholder="Enter Email"
                                  name="email"
                                  // value={formData.brand_name}
                                  // onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  placeholder="Enter Phone Number"
                                  name="phone"
                                  // value={formData.brand_name}
                                  // onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Profile Photo</label>
                                <div className="upload-company-info-area">
                                  <div className="upload-company-img-preview">
                                    <img
                                      crossorigin="anonymous"
                                      src="/jobPortal/assets/images/logo.png"
                                      className="main-logo"
                                      alt="Image Preview"
                                    />
                                  </div>
                                  <div className="upload-company-input">
                                    <input
                                      type="file"
                                      id="imageInput"
                                      accept="image/*"
                                      placeholder="Upload image"
                                      // onChange={handleFileChange}
                                      // style={{ display: "none" }}
                                    />
                                  </div>
                                  <div className="upload-company-file-name">
                                    <span className="file-name">
                                      No Selected Photo
                                    </span>
                                  </div>
                                  <div className="upload-company-file-btn">
                                    <label
                                      htmlFor="imageInput"
                                      className="custom-upload default-btn btn"
                                    >
                                      Choose Img
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="employer-personal-info-btn">
                                <button
                                  // onClick={handleSubmitMultipleImage}
                                  className="default-btn btn"
                                  // disabled={isUploading}
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu2" ? "show active" : ""
                      }`}
                      id="menu2"
                      role="tabpanel"
                    >
                      <div className="profile-form">
                        <form>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Enter New Password</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Enter New Password"
                                  name="new_password"
                                  // value={formData.brand_name}
                                  // onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Enter Confirm Password</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Enter Confirm Password"
                                  name="confirm_password"
                                  // value={formData.brand_name}
                                  // onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="employer-personal-info-btn">
                              <button
                                // onClick={handleSubmitMultipleImage}
                                className="default-btn btn"
                                // disabled={isUploading}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Setting;
