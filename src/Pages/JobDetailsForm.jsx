import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";

function JobDetailsForm() {
  useEffect(() => {
    // Next button
    const nextButtons = document.querySelectorAll(".next-tab-btn");
    nextButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const currentPane = e.target.closest(".tab-pane");
        if (!currentPane) return;

        const nextPane = currentPane.nextElementSibling;
        if (!nextPane) return;

        const nextTabLink = document.querySelector(
          `.nav-link[href="#${nextPane.id}"]`
        );
        if (nextTabLink) {
          const tab = new window.bootstrap.Tab(nextTabLink);
          tab.show();
        }
      });
    });

    // Back button
    const backButtons = document.querySelectorAll(".back-tab-btn");
    backButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const currentPane = e.target.closest(".tab-pane");
        if (!currentPane) return;

        const prevPane = currentPane.previousElementSibling;
        if (!prevPane) return;

        const prevTabLink = document.querySelector(
          `.nav-link[href="#${prevPane.id}"]`
        );
        if (prevTabLink) {
          const tab = new window.bootstrap.Tab(prevTabLink);
          tab.show();
        }
      });
    });
  }, []);

  const [categoryList, setCategoryList] = useState([]);

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}getJobCategory`);
      console.log(response.data.jobCategories);
      setCategoryList(response.data.jobCategories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Job Details Form</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Job Details Form
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/* Your Job Posts Info*/}
          <div className="job-details-form-info">
            <div className="job-details-form-tabs">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    data-bs-toggle="tab"
                    href="#menu1"
                  >
                    Details
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#menu2">
                    Options
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#menu3">
                    Job Branding
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#menu4">
                    Publish
                  </a>
                </li>
              </ul>
            </div>
            <div className="input-info-edit-area job-details-seprate-heading">
              <h3>Testing</h3>
              <i className="fas fa-pencil-alt" />
            </div>
            <div className="tab-content">
              <div id="menu1" className="tab-pane fade show active">
                <div className="job-details-form-area">
                  <div className="job-details-form-heading">
                    <h3>Job Details</h3>
                  </div>
                  <form>
                    <div className="job-details-input-form-info">
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Minimum level</label>
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                            >
                              <option selected>Select a minimum level</option>
                              <option value={1}>
                                No experience / No degree
                              </option>
                              <option value={2}>Entry / Junior</option>
                              <option value={3}>Mid-level</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Employment Type</label>
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                            >
                              <option selected>Select a employment type</option>
                              <option value={1}>
                                No experience / No degree
                              </option>
                              <option value={2}>Entry / Junior</option>
                              <option value={3}>Mid-level</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Remote</label>
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                            >
                              <option selected>No remote options</option>
                              <option value={1}>Fully remote</option>
                              <option value={2}>Partially remote</option>
                              <option value={3}>Temporarily remote</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <label>Job category</label>
                            <select
                              className="form-select form-control"
                              aria-label="Default select example"
                            >
                              <option selected>Choose A Category</option>
                              {categoryList.map((list) => (
                                <option value={list.name} key={list._id}>
                                  {list.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="user-all-detail-info-main">
                      <div className="input-info-edit-area job-details-input-heading">
                        <h3>Job Post Address</h3>
                        <i className="fas fa-pencil-alt" />
                      </div>
                      <div className="user-all-details-info job-post-address-info">
                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>Street Address</label>
                              <p>A -3 Sec 59</p>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>City</label>
                              <p>Noida</p>
                            </div>
                          </div>
                          <div className="divder-line-info" />
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>State</label>
                              <p>Uttar Pradesh</p>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>Country</label>
                              <p>India</p>
                            </div>
                          </div>
                          <div className="divder-line-info" />
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Short description</label>
                              <br />
                              <span className="short-description-info">
                                The short description will be shown when your
                                job post is loaded on the Job Seeker homepage.
                                (max 255 characters)
                              </span>
                              <textarea
                                className="form-control"
                                placeholder="Short description"
                                rows={7}
                                defaultValue={""}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="post-job-form-info-area">
                  <div className="input-info-edit-area form-heading-info">
                    <h3>Tags</h3>
                    <span className="heading-small-description">
                      Add tags to your job post. This will help it appear in as
                      many relevant job posts as possible.
                    </span>
                  </div>
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
                            <br />
                            <ul>
                              <li>
                                Technologies <i className="fa-solid fa-xmark" />
                              </li>
                              <li>
                                Skills <i className="fa-solid fa-xmark" />
                              </li>
                              <li>
                                Website Designer{" "}
                                <i className="fa-solid fa-xmark" />
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
                <div className="job-description-box-info">
                  <h3>Job Description</h3>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      placeholder="Enter a description for this job post"
                      rows={10}
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div className="post-job-next-btn-info">
                  <a href="#" className="btn default-btn next-tab-btn">
                    Next
                  </a>
                </div>
              </div>
              <div id="menu2" className="tab-pane fade">
                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>External Apply</h3>
                    <span className="heading-small-description">
                      Add tags to your job post. This will help it appear in as
                      many relevant job posts as possible.
                    </span>
                  </div>
                  <div className="job-option-branding-content-switch">
                    <div className="job-option-branding-content">
                      <p>Enable external apply</p>
                    </div>
                    <div className="job-option-branding-switch">
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>Confidential job post</h3>
                    <span className="heading-small-description">
                      Enable this option to hide your company details from the
                      job post. (Anonymous Company)
                    </span>
                  </div>
                  <div className="job-option-branding-content-switch">
                    <div className="job-option-branding-content">
                      <p>Enable confidential post</p>
                    </div>
                    <div className="job-option-branding-switch">
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>Reference ID</h3>
                    <span className="heading-small-description">
                      You can give your job post a unique Reference ID. This can
                      help you distinguish it and find it easier.
                    </span>
                  </div>
                  <div className="job-option-branding-input-box">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="e.g. PROD3913"
                      />
                    </div>
                  </div>
                </div>
                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>Email notification</h3>
                    <span className="heading-small-description">
                      We can notify you via email when you receive a new
                      application for this job post.
                    </span>
                  </div>
                  <div className="job-option-branding-content-switch">
                    <div className="job-option-branding-content">
                      <p>Enable / Disable</p>
                    </div>
                    <div className="job-option-branding-switch">
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>Private job details</h3>
                    <span className="heading-small-description">
                      Private job details are non-visible to job seekers that
                      see your job post.
                    </span>
                  </div>
                  <div className="job-option-branding-input-box">
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Min salary (Gross)</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter the minimum salary (€)"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label>Max salary (Gross)</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter the maximum salary (€)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="job-create-form-back-next-info">
                  <div className="job-create-form-back-next-btn">
                    <a href="#" className="default-btn btn back-tab-btn">
                      Back
                    </a>
                  </div>
                  <div className="job-create-form-back-next-btn">
                    <a href="#" className="btn default-btn next-tab-btn">
                      Next
                    </a>
                  </div>
                </div>
              </div>
              <div id="menu3" className="tab-pane fade">
                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>Brand your job post</h3>
                    <span className="heading-small-description">
                      Branded job post are more attractive to job seekers. Add a
                      cover photo for just +€ 250.
                    </span>
                  </div>
                  <div className="job-option-branding-attchment">
                    <div className="form-group">
                      <div className="custom-file-upload">
                        <label>
                          Drag &amp; Drop your Photo or click to upload one
                        </label>
                        <input
                          type="file"
                          id="file-upload"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                        <div className="file-text">
                          <i className="fas fa-cloud-upload-alt" />
                          <br />
                          <label>
                            File types supported: PNG, JPEG | Max file size: 2
                            MB | Recommended dimensions: 1536 x 432 px
                          </label>
                        </div>
                        <div className="invalid-feedback mt-2">
                          Please select a file.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="job-option-branding-disclaimer">
                    <h5>Disclaimer</h5>
                    <p>
                      Please review our best practices before you upload a cover
                      photo.
                    </p>
                    <p>
                      Find them on our FAQ page:
                      <a href="https://itdevelopmentservices.com/design_website/jobPortal/">
                        https://itdevelopmentservices.com/design_website/jobPortal/
                      </a>
                    </p>
                  </div>
                </div>
                <div className="job-option-branding-input-area">
                  <div className="job-option-branding-heading">
                    <h3>Remove similar job posts</h3>
                    <span className="heading-small-description">
                      Remove similar job posts from other companies so that we
                      only present job posts from your company with +€ 360
                    </span>
                  </div>
                  <div className="job-option-branding-content-switch">
                    <div className="job-option-branding-content">
                      <p>Enable removal of relevant jobs</p>
                    </div>
                    <div className="job-option-branding-switch">
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="job-create-form-back-next-info">
                  <div className="job-create-form-back-next-btn">
                    <a href="#" className="default-btn btn back-tab-btn">
                      Back
                    </a>
                  </div>
                  <div className="job-create-form-back-next-btn">
                    <a href="#" className="btn default-btn next-tab-btn">
                      Next
                    </a>
                  </div>
                </div>
              </div>
              <div id="menu4" className="tab-pane fade">
                <div className="publish-job-payment-details">
                  <div className="job-detail-cart-info">
                    <div className="publish-job-date-heading">
                      <h4>
                        Your job post will be active for 30 days once you
                        publish it.
                      </h4>
                    </div>
                    <div className="job-detail-in-cart-info">
                      <div className="input-info-edit-area cart-job-detail-edit">
                        <h3>Job post review</h3>
                        <i className="fas fa-pencil-alt" />
                      </div>
                      <div className="job-post-address-info">
                        <h4>Job post address</h4>
                        <p>
                          Sector 59, Noida,
                          <br />
                          Uttar Pradesh, India
                        </p>
                      </div>
                      <div className="job-post-other-info">
                        <div className="minimum-level-remote">
                          <h4>Minimum level</h4>
                          <p>C-level / Executive</p>
                          <div className="divder-space-line" />
                          <h4>Remote</h4>
                          <p>No remote options</p>
                        </div>
                        <div className="employment-type-job-category">
                          <h4>Employment type</h4>
                          <p>Full-time</p>
                          <div className="divder-space-line" />
                          <h4>Job category</h4>
                          <p>Information systems / Networks</p>
                        </div>
                      </div>
                      <div className="job-cart-short-description-info">
                        <h4>Job category</h4>
                        <p>
                          The short description will be shown when your job post
                          is loaded on the Job Seeker homepage.
                        </p>
                      </div>
                      <div className="job-cart-long-description-info">
                        <h4>Job Description</h4>
                        <p>
                          The short description will be shown when your job post
                          is loaded on the Job Seeker homepage. The short
                          description will be shown when your job post is loaded
                          on the Job Seeker homepage. The short description will
                          be shown when your job post is loaded on the Job
                          Seeker homepage.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="job-payment-detail-box-info">
                    <div className="job-payment-detail-info">
                      <h4>Payment details</h4>
                    </div>
                    <div className="job-payment-text-price">
                      <div className="job-payment-text">
                        <h5>Standard post</h5>
                      </div>
                      <div className="job-payment-price">
                        <h5>€750</h5>
                      </div>
                    </div>
                    <div className="job-payment-text-price">
                      <div className="job-payment-text">
                        <h5>Cover photo</h5>
                      </div>
                      <div className="job-payment-price">
                        <h5>€250</h5>
                      </div>
                    </div>
                    <div className="job-payment-text-price">
                      <div className="job-payment-text">
                        <h5>Remove similar job posts</h5>
                      </div>
                      <div className="job-payment-price">
                        <h5>€360</h5>
                      </div>
                    </div>
                    <div className="job-payment-divider" />
                    <div className="job-payment-text-price">
                      <div className="job-payment-text">
                        <h2>Summary (ex. VAT)</h2>
                      </div>
                      <div className="job-payment-price">
                        <h2>€1360</h2>
                      </div>
                    </div>
                    <div className="job-payment-divider" />
                    <div className="job-payment-text-price">
                      <div className="job-payment-text">
                        <h2>VAT 20%</h2>
                      </div>
                      <div className="job-payment-price">
                        <h2>€272</h2>
                      </div>
                    </div>
                    <div className="job-payment-divider" />
                    <div className="job-payment-text-price">
                      <div className="job-payment-text">
                        <h2>Total</h2>
                      </div>
                      <div className="job-payment-price">
                        <h2>€1632</h2>
                      </div>
                    </div>
                    <div className="job-payment-divider" />
                    <div className="pay-publish-later-btn">
                      <Link to="/your-job-posts" className="default-btn btn">
                        Pay and publish
                      </Link>
                    </div>
                    <div className="job-payment-divider" />
                    <div className="pay-publish-later-btn">
                      <Link to="/your-job-posts" className="default-btn btn">
                        Pay Now, Publish later
                      </Link>
                    </div>
                    <div className="job-payment-divider" />
                    <div className="job-payment-content-info">
                      <p>
                        By clicking the "Pay and publish" or "Pay now, publish
                        later", I agree to the Terms and Conditions &amp;
                        Privacy Policy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Your Job Posts Info */}
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

export default JobDetailsForm;
