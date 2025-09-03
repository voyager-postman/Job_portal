import axios from "axios";
import React, { useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";

import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";

function EmployerProfile() {
  const [fileName, setFileName] = useState("No file selected");
  const [preview, setPreview] = useState("assets/images/company/dummy-img.png");
  const [videos, setVideos] = useState([]);

  // Handle video selection
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);

    const newVideos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9), // unique id
    }));

    setVideos((prev) => [...prev, ...newVideos]);
  };

  // Remove video
  const handleRemoveVideo = (id) => {
    setVideos((prev) => prev.filter((vid) => vid.id !== id));
  };

  // Submit videos
  const handleSubmitVideo = (e) => {
    e.preventDefault();
    console.log("Submitting videos:", videos);

    const formData = new FormData();
    videos.forEach((vid) => formData.append("officeVideos", vid.file));

    // axios.post('/api/upload-videos', formData)
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
    }
  };
  const [images, setImages] = useState([]);

  // Handle file selection
  const handleFileChangeMultiple = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9), // unique id
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  // Remove image
  const handleRemove = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Submit (demo: just logs)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting images:", images);

    // Example: send with FormData
    const formData = new FormData();
    images.forEach((img) => formData.append("officePhotos", img.file));

    // axios.post('/api/upload', formData)
  };

  return (
    <>
      <ToastContainer />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Employer Profile</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Employer Profile
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area">
            <div className="profile-form-content">
              <h3>Employer Profile</h3>
              <div className="company-profile-management-info">
                {/* Nav Tabs */}
                <div className="company-profile-management-tab">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link active"
                        data-bs-toggle="tab"
                        href="#menu1"
                        role="tab"
                        aria-selected="false"
                      >
                        Company Profile
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#menu2"
                        role="tab"
                        aria-selected="false"
                      >
                        Career Details
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#menu3"
                        role="tab"
                        aria-selected="true"
                      >
                        Office photos
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#menu4"
                        role="tab"
                        aria-selected="true"
                      >
                        Office videos
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#menu5"
                        role="tab"
                        aria-selected="false"
                      >
                        Links
                      </a>
                    </li>
                  </ul>
                </div>
                {/* Tab Panes */}
                <div className="company-profile-management-input-form">
                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="menu1"
                      role="tabpanel"
                    >
                      <div className="profile-form">
                        <form>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Company name</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Company name"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Upload company Logo</label>
                                <div className="upload-company-info-area">
                                  <div className="upload-company-img-preview">
                                    <img
                                      src={preview}
                                      className="main-logo"
                                      alt="Image Preview"
                                    />
                                  </div>
                                  <div className="upload-company-input">
                                    <input
                                      type="file"
                                      id="imageInput"
                                      accept="image/*"
                                      onChange={handleFileChange}
                                      style={{ display: "none" }} // keep hidden if using custom button
                                    />
                                  </div>
                                  <div className="upload-company-file-name">
                                    <span className="file-name">
                                      {fileName}
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
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Industry</label>
                                <select
                                  name="cars"
                                  className="form-select form-control"
                                  aria-label="Default2 select example"
                                  id="Industry"
                                >
                                  <option value="volvo">Select Industry</option>
                                  <option value="volvo">
                                    Automobile Industry
                                  </option>
                                  <option value="saab">
                                    Technology Industry
                                  </option>
                                  <option value="opel">
                                    Healthcare Industry
                                  </option>
                                  <option value="audi">
                                    Financial Services Industry
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Number of Employees</label>
                                <select
                                  name="cars"
                                  className="form-select form-control"
                                  aria-label="Default2 select example"
                                  id="Industry"
                                >
                                  <option value="volvo">
                                    Select Number Of Employees
                                  </option>
                                  <option value="saab">1-15</option>
                                  <option value="opel">16-50</option>
                                  <option value="audi">51-100</option>
                                  <option value="audi">100-150</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-12">
                              <div className="form-group">
                                <label>Country code</label>
                                <select
                                  name="cars"
                                  className="form-select form-control"
                                  aria-label="Default2 select example"
                                  id="Industry"
                                >
                                  <option value="volvo">Country code</option>
                                  <option value="saab">+15</option>
                                  <option value="opel">+50</option>
                                  <option value="audi">+100</option>
                                  <option value="audi">+150</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-9 col-md-12">
                              <div className="form-group">
                                <label>Phone number</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Phone number"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Street Address</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Street Address"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>City</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="City"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>State</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="State"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Country</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Country"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>About the company</label>
                                <textarea
                                  className="form-control"
                                  placeholder="About the company here.."
                                  rows={4}
                                  defaultValue={""}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Our Map Location</label>
                                <div className="employer-our-map-location">
                                  <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224356.85923192592!2d77.23701088488971!3d28.522404036526275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1752211574568!5m2!1sen!2sin"
                                    width="100%"
                                    height={500}
                                    style={{ border: "0" }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="employer-personal-info-btn">
                              <a
                                href="YourJobPosts.html"
                                className="default-btn btn"
                              >
                                Submit
                              </a>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="menu2" role="tabpanel">
                      <div className="profile-form">
                        {/*                                <h4>Career Details</h4> */}
                        <form>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Career Details</label>
                                <textarea
                                  className="form-control"
                                  placeholder="Write career Details here.."
                                  rows={7}
                                  defaultValue={""}
                                />
                              </div>
                            </div>
                            <div className="employer-personal-info-btn">
                              <a
                                href="YourJobPosts.html"
                                className="default-btn btn"
                              >
                                Submit
                              </a>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="menu3" role="tabpanel">
                      <div className="profile-form">
                        <form>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <div className="office-photos-upload-info">
                                  {/* File input */}
                                  <input
                                    type="file"
                                    id="officePhotos"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChangeMultiple}
                                    style={{ display: "none" }}
                                  />

                                  {/* Button */}
                                  <label
                                    htmlFor="officePhotos"
                                    className="Custom-Upload default-btn btn"
                                  >
                                    Choose Images
                                  </label>

                                  {/* Preview before submit */}
                                  <div className="preview-container mt-3 d-flex flex-wrap">
                                    {images.map((img) => (
                                      <div
                                        key={img.id}
                                        style={{
                                          position: "relative",
                                          marginRight: "10px",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        <img
                                          src={img.preview}
                                          alt="preview"
                                          width={100}
                                          height={100}
                                          style={{
                                            objectFit: "cover",
                                            borderRadius: "5px",
                                          }}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => handleRemove(img.id)}
                                          style={{
                                            top: "2px",
                                            right: "2px",
                                            color: "#fff",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            lineHeight: "14px",
                                            position: "absolute",
                                            background: "#0066cc",
                                            borderRadius: "4px",
                                            padding: "0px 3px 2px 3px",
                                          }}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Submit button */}
                              <div className="employer-personal-info-btn">
                                <button
                                  onClick={handleSubmit}
                                  className="default-btn btn"
                                >
                                  Submit
                                </button>
                              </div>

                              {/* Office photos after submit (you can reuse same images state) */}
                              <div className="office-photos-info-area mt-4">
                                <h4>Office photos</h4>
                                <div className="preview-container d-flex flex-wrap">
                                  {images.map((img) => (
                                    <img
                                      key={img.id}
                                      src={img.preview}
                                      alt="office"
                                      width={120}
                                      height={120}
                                      style={{
                                        objectFit: "cover",
                                        borderRadius: "5px",
                                        marginRight: "10px",
                                        marginBottom: "10px",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="menu4" role="tabpanel">
                      <div className="profile-form">
                        <form>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <div className="office-video-upload-info">
                                  {/* File input */}
                                  <input
                                    type="file"
                                    id="officeVideos"
                                    accept="video/*"
                                    multiple
                                    onChange={handleVideoChange}
                                    style={{ display: "none" }}
                                  />

                                  {/* Button */}
                                  <label
                                    htmlFor="officeVideos"
                                    className="custom-video-Upload default-btn btn"
                                  >
                                    Choose Videos
                                  </label>

                                  {/* Preview before submit */}
                                  <div className="preview-container mt-3 d-flex flex-wrap">
                                    {videos.map((vid) => (
                                      <div
                                        key={vid.id}
                                        style={{
                                          position: "relative",
                                          marginRight: "10px",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        <video
                                          src={vid.preview}
                                          width={150}
                                          height={100}
                                          controls
                                          style={{
                                            borderRadius: "5px",
                                            objectFit: "cover",
                                            background: "#000",
                                          }}
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveVideo(vid.id)
                                          }
                                          style={{
                                            top: "2px",
                                            right: "2px",
                                            color: "#fff",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            lineHeight: "14px",
                                            position: "absolute",
                                            background: "#0066cc",
                                            borderRadius: "4px",
                                            padding: "0px 3px 2px 3px",
                                          }}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Submit button */}
                              <div className="employer-personal-info-btn">
                                <button
                                  onClick={handleSubmitVideo}
                                  className="default-btn btn"
                                >
                                  Submit
                                </button>
                              </div>

                              {/* Office videos section */}
                              <div className="office-photos-info-area mt-4">
                                <h4>Office videos</h4>
                                <div className="preview-container d-flex flex-wrap">
                                  {videos.map((vid) => (
                                    <video
                                      key={vid.id}
                                      src={vid.preview}
                                      width={180}
                                      height={120}
                                      controls
                                      style={{
                                        borderRadius: "5px",
                                        marginRight: "10px",
                                        marginBottom: "10px",
                                        background: "#000",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="menu5" role="tabpanel">
                      <div className="profile-form">
                        {/* <h4>Links</h4> */}
                        <p>Links to official website, LinkedIn, etc</p>
                        <form>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Official website</label>
                                <input
                                  className="form-control"
                                  type="url"
                                  placeholder="www.connectwork.ma"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Linkedin</label>
                                <input
                                  className="form-control"
                                  type="url"
                                  placeholder="www.linkedin.com"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Facebook</label>
                                <input
                                  className="form-control"
                                  type="url"
                                  placeholder="www.facebook.com"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Twitter</label>
                                <input
                                  className="form-control"
                                  type="url"
                                  placeholder="www.twitter.com"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Instagram</label>
                                <input
                                  className="form-control"
                                  type="url"
                                  placeholder="www.instagram.com"
                                />
                              </div>
                            </div>
                            <div className="employer-personal-info-btn">
                              <a
                                href="YourJobPosts.html"
                                className="default-btn btn"
                              >
                                Submit
                              </a>
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
          {/*End My Profile Area*/}
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

export default EmployerProfile;
