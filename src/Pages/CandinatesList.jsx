import React from "react";
import { Link } from "react-router-dom";
function CandinatesList() {
  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Candidates Listing</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/employer-dashboard">Home </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Candidates Listing
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start Candidates Listing Area*/}
          <div className="candidate-listing-area">
            <div className="container">
              <div className="row">
                <div className="col-lg-3">
                  <div className="sidebar candidate-list-filter">
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
                    <div className="single-sidebar-widget skills">
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
                    <div className="single-sidebar-widget">
                      <h3>Experience level</h3>
                      <div className="candidate-list-select-filter">
                        <ul>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1">0 - 2 Years</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1">2 - 4 Years</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1">5 - 7 Years</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1">8 - 10 Years</label>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="single-sidebar-widget">
                      <h3>Education</h3>
                      <div className="candidate-list-select-filter">
                        <ul>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1">Certified</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1">Diploma</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1">Associate Degree</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1">Bachelor Degree</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1">Master’s Degree</label>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="single-sidebar-widget location-style2">
                      <h3>Location</h3>
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Choose a location</option>
                        <option value={1}>California, US</option>
                        <option value={2}>London, UK</option>
                        <option value={3}>Dubai, UAE</option>
                        <option value={4}>New York, US</option>
                        <option value={5}>Milan, Italy</option>
                        <option value={5}>Washington, US</option>
                      </select>
                      {/* <p>Radius around selected destination</p>
                          <div class="range-slider-area">
                              <div class="area-range-slider"></div>
                              <div class="input-outer">
                                  <div class="amount-outer"><span class="area-amount"></span>km</div>
                              </div>
                              <div class="okm">
                                  <span>0 km</span>
                              </div>
                          </div> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="search-job-top-content">
                    <div className="row align-items-center">
                      <div className="col-lg-6 col-md-4">
                        <div className="shoing-content">
                          <span>Showing 1 – 6 of 145 results</span>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-8">
                        <div className="candidate-list-short-info shorting-content">
                          <div className="row">
                            <div className="col-6">
                              <select
                                className="form-select form-control"
                                aria-label="Default select example"
                              >
                                <option selected>06 Per Pages</option>
                                <option value={1}>01</option>
                                <option value={2}>02</option>
                                <option value={3}>03</option>
                                <option value={4}>04</option>
                                <option value={5}>05</option>
                                <option value={6}>06</option>
                              </select>
                            </div>
                            <div className="col-6">
                              <select
                                className="form-select form-control"
                                aria-label="Default select example"
                              >
                                <option selected>Short By</option>
                                <option value={1}>01</option>
                                <option value={2}>02</option>
                                <option value={3}>03</option>
                                <option value={4}>04</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className="col-lg-6 col-sm-6 aos-init aos-animate"
                      data-aos="fade-up"
                      data-aos-duration={1200}
                      data-aos-delay={200}
                    >
                      <div className="candidate-list-info single-freelancer-card">
                        <div className="row align-items-center">
                          <Link to="/candidates-profile-details"></Link>
                          <div className="col-lg-4">
                            <div className="freelancer-img">
                              <a href="candidates-profile-details.html">
                                <img
                                  src="assets/images/freelancers/freelancers-img-1.jpg"
                                  alt="Image"
                                />
                              </a>
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
                                    <i className="fa-solid fa-money-bill" />$
                                    2000
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
                                    <span className="candidate-active">
                                      Active
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
                    <div
                      className="col-lg-6 col-sm-6 aos-init aos-animate"
                      data-aos="fade-up"
                      data-aos-duration={1200}
                      data-aos-delay={400}
                    >
                      <div className="candidate-list-info single-freelancer-card">
                        <div className="row align-items-center">
                          <div className="col-lg-4">
                            <div className="freelancer-img">
                              <a href="candidates-profile-details.html">
                                <img
                                  src="assets/images/freelancers/freelancers-img-2.jpg"
                                  alt="Image"
                                />
                              </a>
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
                                    <i className="fa-solid fa-money-bill" />$
                                    2000
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
                    </div>
                    <div
                      className="col-lg-6 col-sm-6 aos-init aos-animate"
                      data-aos="fade-up"
                      data-aos-duration={1200}
                      data-aos-delay={600}
                    >
                      <div className="candidate-list-info single-freelancer-card">
                        <div className="row align-items-center">
                          <div className="col-lg-4">
                            <div className="freelancer-img">
                              <a href="candidates-details.html">
                                <img
                                  src="assets/images/freelancers/freelancers-img-3.jpg"
                                  alt="Image"
                                />
                              </a>
                            </div>
                          </div>
                          <div className="col-lg-8">
                            <div className="freelancer-content">
                              <a href="candidates-details.html">
                                <h3>Jequline Fenda</h3>
                              </a>
                              <span>IT Developer</span>
                              <div className="info">
                                <ul>
                                  <li>
                                    <i className="fa-solid fa-file" /> 5 Years
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-money-bill" />$
                                    2000
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
                    <div
                      className="col-lg-6 col-sm-6 aos-init aos-animate"
                      data-aos="fade-up"
                      data-aos-duration={1200}
                      data-aos-delay={800}
                    >
                      <div className="candidate-list-info single-freelancer-card">
                        <div className="row align-items-center">
                          <div className="col-lg-4">
                            <div className="freelancer-img">
                              <a href="candidates-details.html">
                                <img
                                  src="assets/images/freelancers/freelancers-img-4.jpg"
                                  alt="Image"
                                />
                              </a>
                            </div>
                          </div>
                          <div className="col-lg-8">
                            <div className="freelancer-content">
                              <a href="candidates-details.html">
                                <h3>Jequline Fenda</h3>
                              </a>
                              <span>IT Developer</span>
                              <div className="info">
                                <ul>
                                  <li>
                                    <i className="fa-solid fa-file" /> 5 Years
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-money-bill" />$
                                    2000
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
                                    <span className="candidate-active">
                                      Active
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
                    <div
                      className="col-lg-6 col-sm-6 aos-init aos-animate"
                      data-aos="fade-up"
                      data-aos-duration={1200}
                      data-aos-delay={200}
                    >
                      <div className="candidate-list-info single-freelancer-card">
                        <div className="row align-items-center">
                          <div className="col-lg-4">
                            <div className="freelancer-img">
                              <a href="candidates-details.html">
                                <img
                                  src="assets/images/freelancers/freelancers-img-6.jpg"
                                  alt="Image"
                                />
                              </a>
                            </div>
                          </div>
                          <div className="col-lg-8">
                            <div className="freelancer-content">
                              <a href="candidates-details.html">
                                <h3>Jequline Fenda</h3>
                              </a>
                              <span>IT Developer</span>
                              <div className="info">
                                <ul>
                                  <li>
                                    <i className="fa-solid fa-file" /> 5 Years
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-money-bill" />$
                                    2000
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
                                    <span className="candidate-active">
                                      Active
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
                    <div
                      className="col-lg-6 col-sm-6 aos-init aos-animate"
                      data-aos="fade-up"
                      data-aos-duration={1200}
                      data-aos-delay={400}
                    >
                      <div className="candidate-list-info single-freelancer-card">
                        <div className="row align-items-center">
                          <div className="col-lg-4">
                            <div className="freelancer-img">
                              <a href="candidates-details.html">
                                <img
                                  src="assets/images/freelancers/freelancers-img-5.jpg"
                                  alt="Image"
                                />
                              </a>
                            </div>
                          </div>
                          <div className="col-lg-8">
                            <div className="freelancer-content">
                              <a href="candidates-details.html">
                                <h3>Jequline Fenda</h3>
                              </a>
                              <span>IT Developer</span>
                              <div className="info">
                                <ul>
                                  <li>
                                    <i className="fa-solid fa-file" /> 5 Years
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-money-bill" />$
                                    2000
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
                    </div>
                    <div
                      className="col-lg-6 col-sm-6 aos-init"
                      data-aos="fade-up"
                      data-aos-duration={1200}
                      data-aos-delay={600}
                    >
                      <div className="candidate-list-info single-freelancer-card">
                        <div className="row align-items-center">
                          <div className="col-lg-4">
                            <div className="freelancer-img">
                              <a href="candidates-details.html">
                                <img
                                  src="assets/images/freelancers/freelancers-img-15.jpg"
                                  alt="Image"
                                />
                              </a>
                            </div>
                          </div>
                          <div className="col-lg-8">
                            <div className="freelancer-content">
                              <a href="candidates-details.html">
                                <h3>Jequline Fenda</h3>
                              </a>
                              <span>IT Developer</span>
                              <div className="info">
                                <ul>
                                  <li>
                                    <i className="fa-solid fa-file" /> 5 Years
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-money-bill" />$
                                    2000
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
                                    <span className="candidate-active">
                                      Active
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
                    <div
                      className="col-lg-6 col-sm-6 aos-init"
                      data-aos="fade-up"
                      data-aos-duration={1200}
                      data-aos-delay={600}
                    >
                      <div className="candidate-list-info single-freelancer-card">
                        <div className="row align-items-center">
                          <div className="col-lg-4">
                            <div className="freelancer-img">
                              <a href="candidates-details.html">
                                <img
                                  src="assets/images/freelancers/freelancers-img-16.jpg"
                                  alt="Image"
                                />
                              </a>
                            </div>
                          </div>
                          <div className="col-lg-8">
                            <div className="freelancer-content">
                              <a href="candidates-details.html">
                                <h3>Jequline Fenda</h3>
                              </a>
                              <span>IT Developer</span>
                              <div className="info">
                                <ul>
                                  <li>
                                    <i className="fa-solid fa-file" /> 5 Years
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-money-bill" />$
                                    2000
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
                    </div>
                    <div
                      className="col-lg-6 col-sm-6 aos-init"
                      data-aos="fade-up"
                      data-aos-duration={1200}
                      data-aos-delay={600}
                    >
                      <div className="candidate-list-info single-freelancer-card">
                        <div className="row align-items-center">
                          <div className="col-lg-4">
                            <div className="freelancer-img">
                              <a href="candidates-details.html">
                                <img
                                  src="assets/images/freelancers/freelancers-img-17.jpg"
                                  alt="Image"
                                />
                              </a>
                            </div>
                          </div>
                          <div className="col-lg-8">
                            <div className="freelancer-content">
                              <a href="candidates-details.html">
                                <h3>Jequline Fenda</h3>
                              </a>
                              <span>IT Developer</span>
                              <div className="info">
                                <ul>
                                  <li>
                                    <i className="fa-solid fa-file" /> 5 Years
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-money-bill" />$
                                    2000
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
                                    <span className="candidate-active">
                                      Active
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
                    <div
                      className="col-lg-6 col-sm-6 aos-init"
                      data-aos="fade-up"
                      data-aos-duration={1200}
                      data-aos-delay={600}
                    >
                      <div className="candidate-list-info single-freelancer-card">
                        <div className="row align-items-center">
                          <div className="col-lg-4">
                            <div className="freelancer-img">
                              <a href="candidates-details.html">
                                <img
                                  src="assets/images/freelancers/freelancers-img-18.jpg"
                                  alt="Image"
                                />
                              </a>
                            </div>
                          </div>
                          <div className="col-lg-8">
                            <div className="freelancer-content">
                              <a href="candidates-details.html">
                                <h3>Jequline Fenda</h3>
                              </a>
                              <span>IT Developer</span>
                              <div className="info">
                                <ul>
                                  <li>
                                    <i className="fa-solid fa-file" /> 5 Years
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-money-bill" />$
                                    2000
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
                    </div>
                  </div>
                  <div className="paginations mb-30">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fa-solid fa-angle-left" />
                        </a>
                      </li>
                      <li>
                        <a className="active" href="candidates.html">
                          1
                        </a>
                      </li>
                      <li>
                        <a href="#">2</a>
                      </li>
                      <li>
                        <a href="#">3</a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa-solid fa-angle-right" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*End Candidates Listing Area*/}
          {/*End Bookmark Jobs Area*/}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name"> Jaba. </span> All Rights
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

export default CandinatesList;
