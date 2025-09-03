import React from "react";
import { Link } from "react-router-dom";
function EmployerCandinateList() {
  return (
    <>
      <section class="inner-banners-info-area">
        <div class="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="breadcrumb Img"
          />
        </div>
        <div class="inner-banners-title-info">
          <div class="container">
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="inner-page-banner-title">
                  <h2>Candidates Listing</h2>
                  <ul>
                    <li class="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Candidates Listing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="employer-candidate-filter-info-area">
        <div className="container">
          <div className="row">
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
            <div className="col-lg-2 col-sm-6">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Search By Keyword</h3>
                  <form>
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Keywords / Job Title"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-sm-6">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Skills</h3>
                  <form>
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Choose A Skills</option>
                        <option value={1}>Digital</option>
                        <option value={2}>Design</option>
                        <option value={3}>Developer</option>
                        <option value={4}>Front End</option>
                        <option value={5}>Microsoft Excel</option>
                        <option value={6}>Telemarketing</option>
                        <option value={7}>Account</option>
                        <option value={8}>Finance</option>
                        <option value={9}>Marketing</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-sm-6">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Experience level</h3>
                  <form>
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Choose Experience level</option>
                        <option value={1}>Fresher</option>
                        <option value={1}>0 - 2 Years</option>
                        <option value={2}>2 - 4 Years</option>
                        <option value={3}>5 - 7 Years</option>
                        <option value={4}>8 - 10 Years</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-sm-6">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Education</h3>
                  <form>
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Choose Education</option>
                        <option value={1}>Certified</option>
                        <option value={2}>Diploma</option>
                        <option value={3}>Associate Degree</option>
                        <option value={4}>Bachelor Degree</option>
                        <option value={4}>Master’s Degree</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-sm-6">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Location</h3>
                  <form>
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Choose Location</option>
                        <option value={1}>California, US</option>
                        <option value={2}>London, UK</option>
                        <option value={3}>Dubai, UAE</option>
                        <option value={4}>New York, US</option>
                        <option value={5}>Milan, Italy</option>
                        <option value={5}>Washington, US</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-sm-6">
              <div className="employer-candidate-filter-box">
                <div className="single-sidebar-widget keyword">
                  <h3>Salary Range</h3>
                  <form>
                    <div className="form-group">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Choose Salary Range</option>
                        <option value={1}>$1200 - $1400</option>
                        <option value={2}>$400 - $600</option>
                        <option value={3}>$1000 - $1200</option>
                        <option value={4}>$800 - $1000</option>
                        <option value={5}>$600 - $800</option>
                        <option value={5}>$1200 - $1400</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-sm-12">
              <div className="employer-candidate-number-counting">
                <div className="employer-candidate-number">
                  <h4>Candidats (158574)</h4>
                </div>
                <div className="employer-candidate-profile-count">
                  <ul>
                    <li>(0) Profiles favorited</li>
                    <li>(0) Spread profile</li>
                    <li>(0) Profiles Viewed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="employer-candidate-info-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-sm-4">
              <div className="employer-candidate-card-filter-info">
                <form>
                  <div className="form-group">
                    <select
                      className="form-select form-control"
                      aria-label="Default select example"
                    >
                      <option selected>Sort by: Relevance</option>
                      <option value={1}>Sort by: New Candidate</option>
                      <option value={2}>Sort by: Old Candidate</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="employer-candidate-card-info">
                <div className="candidate-list-info single-freelancer-card">
                  <div className="row align-items-center">
                    <div className="col-lg-4">
                      <div className="freelancer-img">
                    <Link to="/candidates-profile-details">
                          <img
                            src="assets/images/freelancers/freelancers-img-1.jpg"
                            alt="Image"
                          />
                   </Link>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="freelancer-content">
                       <Link to="/candidates-profile-details">
                          <h3>Jequline Fenda</h3>
                                         </Link>

                        <span>IT Developer</span>
                        <div className="info">
                          <ul>
                            <li>
                              <i className="fa-solid fa-file" /> 5 Years
                            </li>
                            <li>
                              <i className="fa-solid fa-money-bill" />$ 2000
                            </li>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Washington DC, US
                            </li>
                            <li>
                              <i className="fa-solid fa-graduation-cap" />
                              Master’s Degree
                            </li>
                            <li>
                              <i className="fa-solid fa-gear" />
                              <span className="candidate-active">Active</span>
                            </li>
                          </ul>
                        </div>
                        <div className="candidate-list-bookmark">
                          <i className="fa-regular fa-heart" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="candidate-list-info single-freelancer-card">
                  <div className="row align-items-center">
                    <div className="col-lg-4">
                      <div className="freelancer-img">
                       <Link to="/candidates-profile-details">
                          <img
                            src="assets/images/freelancers/freelancers-img-16.jpg"
                            alt="Image"
                          />
                      </Link>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="freelancer-content">
                       <Link to="/candidates-profile-details">
                          <h3>Jequline Fenda</h3>
                       </Link>
                        <span>IT Developer</span>
                        <div className="info">
                          <ul>
                            <li>
                              <i className="fa-solid fa-file" /> 5 Years
                            </li>
                            <li>
                              <i className="fa-solid fa-money-bill" />$ 2000
                            </li>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Washington DC, US
                            </li>
                            <li>
                              <i className="fa-solid fa-graduation-cap" />
                              Master’s Degree
                            </li>
                            <li>
                              <i className="fa-solid fa-gear" />
                              <span className="candidate-inactive">
                                inactive
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="candidate-list-bookmark">
                          <i className="fa-regular fa-heart" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="candidate-list-info single-freelancer-card">
                  <div className="row align-items-center">
                    <div className="col-lg-4">
                      <div className="freelancer-img">
                      <Link to="/candidates-profile-details">
                          <img
                            src="assets/images/freelancers/freelancers-img-2.jpg"
                            alt="Image"
                          />
                     </Link>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="freelancer-content">
                        <Link to="/candidates-profile-details">
                          <h3>Jequline Fenda</h3>
                       </Link>
                        <span>IT Developer</span>
                        <div className="info">
                          <ul>
                            <li>
                              <i className="fa-solid fa-file" /> 5 Years
                            </li>
                            <li>
                              <i className="fa-solid fa-money-bill" />$ 2000
                            </li>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Washington DC, US
                            </li>
                            <li>
                              <i className="fa-solid fa-graduation-cap" />
                              Master’s Degree
                            </li>
                            <li>
                              <i className="fa-solid fa-gear" />
                              <span className="candidate-inactive">
                                inactive
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="candidate-list-bookmark">
                          <i className="fa-regular fa-heart" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="candidate-list-info single-freelancer-card">
                  <div className="row align-items-center">
                    <div className="col-lg-4">
                      <div className="freelancer-img">
                       <Link to="/candidates-profile-details">
                          <img
                            src="assets/images/freelancers/freelancers-img-3.jpg"
                            alt="Image"
                          />
                       </Link>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="freelancer-content">
                       <Link to="/candidates-profile-details">
                          <h3>Jequline Fenda</h3>
                       </Link>
                        <span>IT Developer</span>
                        <div className="info">
                          <ul>
                            <li>
                              <i className="fa-solid fa-file" /> 5 Years
                            </li>
                            <li>
                              <i className="fa-solid fa-money-bill" />$ 2000
                            </li>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Washington DC, US
                            </li>
                            <li>
                              <i className="fa-solid fa-graduation-cap" />
                              Master’s Degree
                            </li>
                            <li>
                              <i className="fa-solid fa-gear" />
                              <span className="candidate-inactive">
                                Inactive
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="candidate-list-bookmark">
                          <i className="fa-regular fa-heart" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="candidate-list-info single-freelancer-card">
                  <div className="row align-items-center">
                    <div className="col-lg-4">
                      <div className="freelancer-img">
                       <Link to="/candidates-profile-details">
                          <img
                            src="assets/images/freelancers/freelancers-img-3.jpg"
                            alt="Image"
                          />
                      </Link>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="freelancer-content">
                       <Link to="/candidates-profile-details">
                          <h3>Jequline Fenda</h3>
                        </Link>
                        <span>IT Developer</span>
                        <div className="info">
                          <ul>
                            <li>
                              <i className="fa-solid fa-file" /> 5 Years
                            </li>
                            <li>
                              <i className="fa-solid fa-money-bill" />$ 2000
                            </li>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Washington DC, US
                            </li>
                            <li>
                              <i className="fa-solid fa-graduation-cap" />
                              Master’s Degree
                            </li>
                            <li>
                              <i className="fa-solid fa-gear" />
                              <span className="candidate-inactive">
                                Inactive
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="candidate-list-bookmark">
                          <i className="fa-regular fa-heart" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="candidate-list-info single-freelancer-card">
                  <div className="row align-items-center">
                    <div className="col-lg-4">
                      <div className="freelancer-img">
                       <Link to="/candidates-profile-details">
                          <img
                            src="assets/images/freelancers/freelancers-img-3.jpg"
                            alt="Image"
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="freelancer-content">
                       <Link to="/candidates-profile-details">
                          <h3>Jequline Fenda</h3>
                        </Link>
                        <span>IT Developer</span>
                        <div className="info">
                          <ul>
                            <li>
                              <i className="fa-solid fa-file" /> 5 Years
                            </li>
                            <li>
                              <i className="fa-solid fa-money-bill" />$ 2000
                            </li>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Washington DC, US
                            </li>
                            <li>
                              <i className="fa-solid fa-graduation-cap" />
                              Master’s Degree
                            </li>
                            <li>
                              <i className="fa-solid fa-gear" />
                              <span className="candidate-inactive">
                                Inactive
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="candidate-list-bookmark">
                          <i className="fa-regular fa-heart" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="candidate-list-info single-freelancer-card">
                  <div className="row align-items-center">
                    <div className="col-lg-4">
                      <div className="freelancer-img">
                       <Link to="/candidates-profile-details">
                          <img
                            src="assets/images/freelancers/freelancers-img-3.jpg"
                            alt="Image"
                          />
                         </Link>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="freelancer-content">
                       <Link to="/candidates-profile-details">
                          <h3>Jequline Fenda</h3>
                       </Link>
                        <span>IT Developer</span>
                        <div className="info">
                          <ul>
                            <li>
                              <i className="fa-solid fa-file" /> 5 Years
                            </li>
                            <li>
                              <i className="fa-solid fa-money-bill" />$ 2000
                            </li>
                            <li>
                              <i className="fa-solid fa-location-dot" />
                              Washington DC, US
                            </li>
                            <li>
                              <i className="fa-solid fa-graduation-cap" />
                              Master’s Degree
                            </li>
                            <li>
                              <i className="fa-solid fa-gear" />
                              <span className="candidate-inactive">
                                Inactive
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="candidate-list-bookmark">
                          <i className="fa-regular fa-heart" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="employer-candidate-pagination-info">
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <a className="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">
                          <i className="fa-solid fa-angle-left" />
                        </span>
                        <span className="sr-only">Previous</span>
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link active" href="#">
                        1
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        2
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        3
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        4
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        5
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        ...
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        3369825
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">
                          <i className="fa-solid fa-angle-right" />
                        </span>
                        <span className="sr-only">Next</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="col-lg-8 col-sm-8">
              <div className="employer-candidate-alert-profiles">
                <a href="#" className="default-btn btn">
                  <i className="fa-solid fa-bell" /> Alert Profiles
                </a>
              </div>
              <div className="employer-candidate-detail-new-info">
                <div className="employer-candidate-img-content-info">
                  <div className="employer-candidate-img-info">
                    <img
                      src="assets/images/freelancers/freelancers-img-1.jpg"
                      alt="Image"
                    />
                  </div>
                  <div className="employers-condidate-content">
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
                <div className="employer-candidate-dcv-icons">
                  <div className="employer-candidate-dcv-btn">
                    <a href="#" className="default-btn btn">
                      Download CV
                    </a>
                  </div>
                  <div className="employer-candidate-icon-info">
                    <ul>
                      <li>
                        <a href="#" target="_blank">
                          <i className="fa-regular fa-heart" />
                        </a>
                      </li>
                      <li>
                        <a href="https://in.linkedin.com/" target="_blank">
                          <i className="fa-brands fa-linkedin-in" />
                        </a>
                      </li>
                      <li>
                        <a href="https://x.com/" target="_blank">
                          <i className="fa-brands fa-x-twitter" />
                        </a>
                      </li>
                      <li>
                        <a href="mailto:andysmith@gmail.com">
                          <i className="fa-solid fa-envelope" />
                        </a>
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <i className="fa-solid fa-share" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="employer-candidate-detail-info-area">
                <div className="employer-candidate-cv-heading">
                  <h3>Professional Summary</h3>
                </div>
                <div className="employer-candidate-cv-details">
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
                <div className="employer-candidate-cv-heading">
                  <h3>Career Goals</h3>
                </div>
                <div className="employer-candidate-cv-details">
                  <h5>Desired Job Title</h5>
                  <p>Website Designer</p>
                  <h5>Desired Employment Type</h5>
                  <p>Permanent contract</p>
                  <h5>Desired Occupation Type</h5>
                  <p>Full-time</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="employer-candidate-cv-heading">
                  <h3>Other Preferences</h3>
                </div>
                <div className="employer-candidate-cv-details">
                  <h5>Eligible to work in</h5>
                  <p>France</p>
                  <h5>Minimum Desired Salary (Gross)</h5>
                  <p>€1,000 / Monthly</p>
                  <h5>Looking for a new job opportunity?</h5>
                  <p>Open to the right opportunity</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="employer-candidate-cv-heading">
                  <h3>About your role</h3>
                </div>
                <div className="employer-candidate-cv-details">
                  <h5>Job Title</h5>
                  <p>Website Designer</p>
                  <h5>Years of experience</h5>
                  <p>3 Years</p>
                  <h5>Job category</h5>
                  <p>Software Engineering / Web Development</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="employer-candidate-cv-heading">
                  <h3>Experience</h3>
                </div>
                <div className="employer-candidate-cv-details">
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
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="employer-candidate-cv-heading">
                  <h3>Position Salary(Gross)</h3>
                </div>
                <div className="employer-candidate-cv-details">
                  <h5>Salary</h5>
                  <p>$ 2000</p>
                  <h5>Payroll frequency</h5>
                  <p>Monthly</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="employer-candidate-cv-heading">
                  <h3>Education</h3>
                </div>
                <div className="employer-candidate-cv-details">
                  <h5>Degree</h5>
                  <p>B.Tech</p>
                  <h5>University</h5>
                  <p>IGNU</p>
                  <h5>Start Date</h5>
                  <p>05 / 2020</p>
                  <h5>End Date</h5>
                  <p>Until now</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="employer-candidate-cv-heading">
                  <h3>Skills</h3>
                </div>
                <div className="employer-candidate-profile-skill-info">
                  <ul>
                    <li>PHP</li>
                    <li>PYTHON</li>
                    <li>ANDROID</li>
                    <li>SEO</li>
                    <li>DIGITAL MARKETING</li>
                    <li>WEBSITE DESIGN</li>
                  </ul>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="employer-candidate-cv-heading">
                  <h3>Languages</h3>
                </div>
                <div className="employer-candidate-cv-details">
                  <h5>French</h5>
                  <p>Native / Bilingual (C2)</p>
                  <h5>English</h5>
                  <p>Basic (A1 / A2)</p>
                </div>
                <div className="candidate-profile-divider-line" />
                <div className="employer-candidate-cv-heading">
                  <h3>Certificates</h3>
                </div>
                <div className="employer-candidate-cv-details">
                  <h5>B.Tech</h5>
                  <p>Issue Date: 2025</p>
                  <h5>BCA</h5>
                  <p>Issue Date: 2021</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EmployerCandinateList;
