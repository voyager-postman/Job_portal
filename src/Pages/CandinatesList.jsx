import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
function CandinatesList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const candidatesPerPage = 6; // ✅ show 6 candidates per page
  const fetchCandidates = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}getCandidateList`,
        {}, // send body if API expects filters, else keep empty
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCandidates(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(currentPage);
  }, [currentPage]);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
                  {/* <div className="row">
                    
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
                  
                  </div> */}
                  <div className="row">
                    {candidates.length > 0 ? (
                      candidates.map((candidate, index) => {
                        // ✅ Declare variables here (not inside JSX)
                        const user = candidate?.userId || {};
                        const role = candidate?.aboutRole || {};

                        return (
                          <div
                            key={candidate._id || index}
                            className="col-lg-6 col-sm-6 aos-init aos-animate"
                            data-aos="fade-up"
                            data-aos-duration={1200}
                            data-aos-delay={200}
                          >
                            <div className="candidate-list-info single-freelancer-card">
                              <Link
                                to="/candidates-profile-details"
                                state={{ userId: user._id }}
                              >
                                <div className="row align-items-center">
                                  <div className="col-lg-4">
                                    <div className="freelancer-img">
                                      <img
                                        src={
                                          user?.profileImage
                                            ? `${API_IMAGE_URL}${user?.profileImage}`
                                            : "assets/images/freelancers/freelancers-img-1.jpg"
                                        }
                                        crossOrigin="anonymous"
                                      />
                                      {/* <img
                                        src="assets/images/freelancers/freelancers-img-1.jpg"
                                        alt="Image"
                                      /> */}
                                    </div>
                                  </div>
                                  <div className="col-lg-8">
                                    <div className="freelancer-content">
                                      <h3>
                                        {`${user.first_name || ""} ${
                                          user.last_name || ""
                                        }`}
                                      </h3>

                                      <span>
                                        {role.jobTitle || "Not specified"}
                                      </span>
                                      <div className="info">
                                        <ul>
                                          <li>
                                            <i className="fa-solid fa-file" />{" "}
                                            {role.yearOfExperience
                                              ? `${role.yearOfExperience} Years`
                                              : "N/A"}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-money-bill" />
                                            {candidate.expectedSalary
                                              ? `$ ${candidate.expectedSalary}`
                                              : "$ 0"}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-location-dot" />
                                            {user.city ||
                                              "Location not available"}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-graduation-cap" />
                                            {candidate.educationLevel ||
                                              "Not specified"}
                                          </li>
                                          <li>
                                            <i className="fa-solid fa-gear" />
                                            <span className="candidate-active">
                                              {candidate.isActive
                                                ? "Active"
                                                : "Inactive"}
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
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>No candidates found.</p>
                    )}
                  </div>
                  {/* <div className="paginations mb-30">
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
                  </div> */}
                  <div className="paginations mb-30">
                    <ul>
                      {/* Previous button */}
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              handlePageChange(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "disabled" : ""}
                        >
                          <i className="fa-solid fa-angle-left" />
                        </a>
                      </li>

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i + 1}>
                          <a
                            href="#"
                            className={currentPage === i + 1 ? "active" : ""}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(i + 1);
                            }}
                          >
                            {i + 1}
                          </a>
                        </li>
                      ))}

                      {/* Next button */}
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              handlePageChange(currentPage + 1);
                          }}
                          className={
                            currentPage === totalPages ? "disabled" : ""
                          }
                        >
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
