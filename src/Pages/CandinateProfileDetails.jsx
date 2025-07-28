import React from "react";
import { Link } from "react-router-dom";
function CandinateProfileDetails() {
  return (
    <>
      <div className="candidates-details-banner-area candidate-banner-info bg-f0f4fc">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-8">
              <div className="candidates-details-left-content">
                <div className="candidates-img">
                  <img
                    src="assets/images/candidate-img/candidate1.jpg"
                    alt="Image"
                  />
                </div>
                <div className="candidates-content">
                  <div className="candidate-profile-details-info">
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
              </div>
            </div>
            <div className="col-lg-5 col-md-4">
              <div className="candidate-profile-dcv-btn">
                <a href="#" className="default-btn btn">
                  Download CV
                </a>
              </div>
              <div className="candidates-share-content">
                <h4>Social Media</h4>
                <ul>
                  <li>
                    <a
                      href="https://itdevelopmentservices.com/jobPortal/"
                      target="_blank"
                    >
                      <i className="fa-solid fa-globe" />
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/" target="_blank">
                      <i className="fa-brands fa-github" />
                    </a>
                  </li>
                  <li>
                    <a href="https://in.linkedin.com/" target="_blank">
                      <i className="fa-brands fa-linkedin-in" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="candidates-details-area pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="candidates-details-content">
                <div className="about-content candidate-profile-summary">
                  <h3>Professional Summary</h3>
                  <p>
                    A talented professional with an academic background in IT
                    and proven commercial development experience as C++
                    developer since 1999. Has a sound knowledge of the software
                    development life cycle. Was involved in more than 140
                    software development outsourcing projects.
                  </p>
                  <p>
                    Programming Languages: C/C++, .NET C++, Python, Bash, Shell,
                    PERL, Python, Angular, React, Node.js, Vue.js, Gatsby,
                    Regular expressions Active-script.
                  </p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="candidate-profile-detail-info candidate-profile-summary">
                  <h3>Career Goals</h3>
                  <h5>Desired Job Title</h5>
                  <p>Website Designer</p>
                  <h5>Desired Employment Type</h5>
                  <p>Permanent contract</p>
                  <h5>Desired Occupation Type</h5>
                  <p>Full-time</p>
                  <div className="candidate-profile-divider-line" />
                  <h3>Other Preferences</h3>
                  <h5>Eligible to work in</h5>
                  <p>France</p>
                  <h5>Minimum Desired Salary (Gross)</h5>
                  <p>€1,000 / Monthly</p>
                  <h5>Looking for a new job opportunity?</h5>
                  <p>Open to the right opportunity</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="candidate-profile-detail-info candidate-profile-summary">
                  <h3>About your role</h3>
                  <h5>Job Title</h5>
                  <p>Website Designer</p>
                  <h5>Years of experience</h5>
                  <p>3 Years</p>
                  <h5>Job category</h5>
                  <p>Software Engineering / Web Development</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="works-experience candidate-profile-summary">
                  <h3>Experience</h3>
                  <h5>Website Designer</h5>
                  <p>Feb 2020 - Until now</p>
                  <h5>Agriculture PVT LTD</h5>
                  <p>United States, TN, Cordova, Frence Creek Cv S Full-time</p>
                  <h5>Description</h5>
                  <p>
                    We are a dynamic agricultural products, farming, and service
                    company committed to meeting the diverse needs of farmers,
                    wholesale markets, traders, exportersWe are a dynamic
                    agricultural products, farming, and service company
                    committed to meeting the diverse needs of farmers, wholesale
                    markets, traders, exportersWe are a dynamic agricultural
                    products, farming, and service company committed to meeting
                    the diverse needs of farmers, wholesale markets, traders,
                    exporters
                  </p>
                  <h3>Position Salary(Gross)</h3>
                  <h5>Salary</h5>
                  <p>2000 $</p>
                  <h5>Payroll frequency</h5>
                  <p>Monthly</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="education candidate-profile-summary">
                  <h3>Education</h3>
                  <h5>Degree</h5>
                  <p>B.Tech</p>
                  <h5>University</h5>
                  <p>IGNU</p>
                  <h5>Start Date</h5>
                  <p>05 / 2020</p>
                  <h5>End Date</h5>
                  <p>Until now</p>
                </div>
                <div className="skill-content candidate-profile-summary">
                  <h3>Skills</h3>
                  <div className="candidate-profile-skill-info">
                    <ul>
                      <li>PHP</li>
                      <li>PYTHON</li>
                      <li>ANDROID</li>
                      <li>SEO</li>
                      <li>DIGITAL MARKETING</li>
                      <li>WEBSITE DESIGN</li>
                    </ul>
                  </div>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="languages candidate-profile-summary">
                  <h3>Languages</h3>
                  <h5>French</h5>
                  <p>Native / Bilingual (C2)</p>
                  <h5>English</h5>
                  <p>Basic (A1 / A2)</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="languages candidate-profile-summary">
                  <h3>Certificates</h3>
                  <h5>B.Tech</h5>
                  <p>Issue Date: 2025</p>
                  <h5>BCA</h5>
                  <p>Issue Date: 2021</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="candidate-profile-review-heading">
                  <h3>Reviews</h3>
                </div>
                <div className="comment-detail-main-area">
                  <div className="user-img-main-area">
                    <img
                      src="assets/images/candidate-img/comment.png"
                      alt="user img"
                    />
                  </div>
                  <div className="user-content-main-area">
                    <h5>John Deo</h5>
                    <h6>July 18, 2020 at 12:25 PM</h6>
                    <p>
                      Businesses and individuals across India with tools to
                      participate in the huge digital supply chain opportunity
                      of the future. Over 5000 businesses have already partnered
                      with Delhivery and have access to our infrastructure and
                      technology.
                    </p>
                  </div>
                </div>
                <div className="comment-detail-main-area">
                  <div className="user-img-main-area">
                    <img
                      src="assets/images/candidate-img/comment.png"
                      alt="user img"
                    />
                  </div>
                  <div className="user-content-main-area">
                    <h5>John Deo</h5>
                    <h6>July 18, 2020 at 12:25 PM</h6>
                    <p>
                      Businesses and individuals across India with tools to
                      participate in the huge digital supply chain opportunity
                      of the future. Over 5000 businesses have already partnered
                      with Delhivery and have access to our infrastructure and
                      technology.
                    </p>
                  </div>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="add-review">
                  <h3>Add Review</h3>
                  <div className="review-form">
                    <form>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Name"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <input
                              className="form-control"
                              type="email"
                              placeholder="Email"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group">
                            <textarea
                              className="form-control"
                              placeholder="Write Message"
                              rows={6}
                              defaultValue={""}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="candidate-profile-submit-btn">
                        <button type="submit" className="default-btn btn">
                          Submit A Review
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="sidebar">
                <div className="candidate-profile-summary single-sidebar-widget job-overview">
                  <h3>Candidate Informations</h3>
                  <ul>
                    <li>
                      <span>Experience :</span>3 Years
                    </li>
                    <li>
                      <span>Current salary :</span>$2000
                    </li>
                    <li>
                      <span>Education level :</span>Master Degree
                    </li>
                    <li>
                      <span>Year of birth : </span>2000
                    </li>
                    <li>
                      <span>Job Location :</span>New York, USA
                    </li>
                    <li>
                      <span>Job category :</span>Software engineering
                    </li>
                    <li>
                      <span>Gender :</span>Male
                    </li>
                    <li>
                      <span>Language :</span>English, German
                    </li>
                  </ul>
                </div>
                <div className="candidate-profile-summary single-sidebar-widget download">
                  <a href="#" className="default-btn btn">
                    Download CV
                  </a>
                </div>
              </div>
              <div className="candidate-profile-summary contact-candidate-info">
                <h3>Contact Candidate</h3>
                <div className="contact-candidate-form">
                  <form>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Name"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="email"
                            placeholder="Email"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="number"
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <input
                            className="form-control"
                            type="subject"
                            placeholder="Subject"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <textarea
                            className="form-control"
                            placeholder="Write Message"
                            rows={3}
                            defaultValue={""}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="candidate-profile-submit-btn">
                      <button type="submit" className="default-btn btn">
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CandinateProfileDetails;
