import React from "react";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import axios from "../Services/axios";
import moment from "moment";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";

function JobDetailsList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [jobList, setJobList] = useState([]);
  const [totalJobData, setTotalJobData] = useState({});

  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    keywords: "",
    location: "",
    category: "",
  });

  // ✅ Fetch categories
  const getCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getJobCategory`);
      console.log(res);
      setCategories(res.data.jobCategories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ✅ Fetch jobs
  const getAllJobList = async (limit = 10, page = 1) => {
    try {
      const res = await axios.get(`${API_BASE_URL}getAllJob`, {
        params: {
          limit,
          page,
          keywords: filters.keywords,
          location: filters.location,
          category: filters.category,
        },
      });

      setJobList(res.data?.jobs?.jobs || []);
      setTotalJobData(res.data?.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // ✅ Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    getAllJobList(10, 1);
  };

  useEffect(() => {
    getCategories();
    getAllJobList(10, 1);
  }, []);

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Search Job Keywords</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/candidate-dashboard">Home </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Search Job Keywords
              </li>
            </ol>
          </div>

          <section className="job-card-list-info-area">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-sm-12">
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
                              <i className="flaticon-portfolio"></i>
                            </div>
                          </div>
                          <div className="col-lg-3 col-sm-6">
                            <div className="form-group">
                              <input
                                className="form-control"
                                type="text"
                                placeholder="City Or Postcode"
                              />
                              <i className="flaticon-location"></i>
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6">
                            <div className="form-group style">
                              <select
                                className="form-select form-control"
                                aria-label="Default select example"
                              >
                                <option selected="">Chpoose A Category</option>
                                <option value="1">Development</option>
                                <option value="2">Information IT</option>
                                <option value="3">Corporate Job</option>
                              </select>
                              <i className="flaticon-list"></i>
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
                </div>
                <div className="col-lg-12 col-sm-12">
                  <div className="job-card-list-filter-info">
                    <div className="row">
                      <div className="col-lg-3 col-sm-3">
                        <div className="job-filter-main-info">
                          <div className="job-filter-heading-area">
                            <h4>
                              <a href="SearchJobList.html" className="active">
                                <i className="fa-regular fa-file"></i> Job
                                offers
                              </a>
                            </h4>
                          </div>
                          <div className="job-filter-heading-area">
                            <h4>
                              <a href="companies-list.html">
                                <i className="fa-regular fa-building"></i>{" "}
                                Companies
                              </a>
                            </h4>
                          </div>
                          <div className="divder-line-info"></div>
                          <div className="job-filter-search-area">
                            <div className="job-filter-heading-cancel">
                              <div className="job-filter-heading">
                                <h4>
                                  <i className="fa-solid fa-gear"></i> Job
                                  category
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
                                <option selected="">Select Job Category</option>
                                <option value="1">Java</option>
                                <option value="2">Python</option>
                                <option value="3">React</option>
                                <option value="2">Python</option>
                                <option value="3">React</option>
                              </select>
                            </div>
                          </div>
                          <div className="divder-line-info"></div>
                          <div className="job-filter-search-area">
                            <div className="job-filter-heading-cancel">
                              <div className="job-filter-heading">
                                <h4>
                                  <i className="fa-solid fa-gear"></i> Job Type
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
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> Full Time</label>
                                </li>
                                <li>
                                  <input
                                    type="checkbox"
                                    id="OtherPreferences"
                                    name="OtherPreferences"
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> Part Time</label>
                                </li>
                                <li>
                                  <input
                                    type="checkbox"
                                    id="OtherPreferences"
                                    name="OtherPreferences"
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> Freelance</label>
                                </li>
                                <li>
                                  <input
                                    type="checkbox"
                                    id="OtherPreferences"
                                    name="OtherPreferences"
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> Internship</label>
                                </li>
                                <li>
                                  <input
                                    type="checkbox"
                                    id="OtherPreferences"
                                    name="OtherPreferences"
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> Remote</label>
                                </li>
                                <li>
                                  <input
                                    type="checkbox"
                                    id="OtherPreferences"
                                    name="OtherPreferences"
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> Hybrid Jobs</label>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="divder-line-info"></div>
                          <div className="job-filter-search-area">
                            <div className="job-filter-heading-cancel">
                              <div className="job-filter-heading">
                                <h4>
                                  <i className="fa-solid fa-location-dot"></i>{" "}
                                  Location
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
                                <option selected="">Select Job Location</option>
                                <option value="1">India</option>
                                <option value="2">USA</option>
                                <option value="3">Paris</option>
                                <option value="4">Germany</option>
                                <option value="2">Spain</option>
                                <option value="3">Mau</option>
                              </select>
                            </div>
                          </div>
                          <div className="divder-line-info"></div>
                          <div className="job-filter-search-area">
                            <div className="job-filter-heading-cancel">
                              <div className="job-filter-heading">
                                <h4>
                                  <i className="fas fa-signal"></i> Experience
                                  Level
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
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> 0 - 2 Years</label>
                                </li>
                                <li>
                                  <input
                                    type="checkbox"
                                    id="OtherPreferences"
                                    name="OtherPreferences"
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> 2 - 4 Years</label>
                                </li>
                                <li>
                                  <input
                                    type="checkbox"
                                    id="OtherPreferences"
                                    name="OtherPreferences"
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> 5 - 7 Years</label>
                                </li>
                                <li>
                                  <input
                                    type="checkbox"
                                    id="OtherPreferences"
                                    name="OtherPreferences"
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> 8 - 10 Years</label>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="divder-line-info"></div>
                          <div className="job-filter-search-area">
                            <div className="job-filter-heading-cancel">
                              <div className="job-filter-heading">
                                <h4>
                                  <i className="fas fa-money-bill-alt"></i>{" "}
                                  Salary Range
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
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> 0 to $100</label>
                                </li>
                                <li>
                                  <input
                                    type="checkbox"
                                    id="OtherPreferences"
                                    name="OtherPreferences"
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> $ 101 to $ 150</label>
                                </li>
                                <li>
                                  <input
                                    type="checkbox"
                                    id="OtherPreferences"
                                    name="OtherPreferences"
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> $ 151 to $ 200</label>
                                </li>
                                <li>
                                  <input
                                    type="checkbox"
                                    id="OtherPreferences"
                                    name="OtherPreferences"
                                    value="Other Preferences"
                                  />
                                  <label for="vehicle1"> $ 201 to $ 250</label>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="divder-line-info"></div>
                          <div className="job-filter-search-area">
                            <div className="job-filter-heading-cancel">
                              <div className="job-filter-heading">
                                <h4>
                                  <i className="fas fa-building"></i> Industry
                                  Sector
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
                                <option selected="">Select Industry</option>
                                <option value="1">Agriculture</option>
                                <option value="2">Air Transport</option>
                                <option value="3">Automotive</option>
                                <option value="4">Biotechnology</option>
                                <option value="2">Chemicals</option>
                                <option value="3">Construction</option>
                              </select>
                            </div>
                          </div>
                          <div className="divder-line-info"></div>
                          <div className="job-filter-search-area">
                            <div className="job-filter-heading-cancel">
                              <div className="job-filter-heading">
                                <h4>
                                  <i className="fas fa-building"></i> Company
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
                                <option selected="">Select Company</option>
                                <option value="1">Agriculture</option>
                                <option value="2">Air Transport</option>
                                <option value="3">Automotive</option>
                                <option value="4">Biotechnology</option>
                                <option value="2">Chemicals</option>
                                <option value="3">Construction</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-9 col-md-9">
                        <div className="available-job-posts-info">
                          <div className="available-job-posts-heading">
                            <h4>
                              <i className="fa-regular fa-file"></i> 6905
                              available job posts
                            </h4>
                            <div className="job-alert-tag-btn">
                              <span>
                                Call Center / Customer Service{" "}
                                <i className="fa-solid fa-xmark"></i>
                              </span>
                              <a
                                href="#"
                                className="default-btn btn"
                                id="toggleAlertBtn"
                              >
                                <i className="fa-solid fa-bell"></i>Set Alert
                              </a>
                              <a href="#" className="default-btn btn">
                                <i className="fa-solid fa-circle-check"></i>
                                Notification created
                              </a>
                            </div>
                            <div
                              className="job-alert-condittion-list"
                              id="alertOptions"
                            >
                              <h4>Notify me every</h4>
                              <div className="job-alert-condittion-select">
                                <span>
                                  <input
                                    type="radio"
                                    id="html"
                                    name="fav_language"
                                    value="HTML"
                                  />
                                  <label for="html">1 Day</label>
                                </span>
                                <span>
                                  <input
                                    type="radio"
                                    id="css"
                                    name="fav_language"
                                    value="CSS"
                                  />
                                  <label for="css">3 Days</label>
                                </span>
                                <span>
                                  <input
                                    type="radio"
                                    id="javascript"
                                    name="fav_language"
                                    value="JavaScript"
                                  />
                                  <label for="javascript">Week</label>
                                </span>
                                <span>
                                  <input
                                    type="radio"
                                    id="javascript"
                                    name="fav_language"
                                    value="JavaScript"
                                  />
                                  <label for="javascript">Month</label>
                                </span>
                                <span>
                                  <input
                                    type="radio"
                                    id="javascript"
                                    name="fav_language"
                                    value="JavaScript"
                                  />
                                  <label for="javascript">Just save</label>
                                </span>
                                <div className="job-alert-create-cancel-btn">
                                  <a href="#" className="default-btn btn">
                                    <i className="fa-solid fa-bell"></i>Create
                                    Alert
                                  </a>
                                  <a href="#" className="default-btn btn">
                                    <i className="fa-solid fa-circle-check"></i>
                                    Cancel Alert
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Link to="/job-details">
                            <div className="available-job-posts-box">
                              <div className="available-job-company-name-save-job">
                                <div className="available-job-company-name">
                                  <h4>
                                    <i className="fa-solid fa-building"></i>{" "}
                                    Alibaba Cloud
                                  </h4>
                                </div>
                                <div className="available-job-save-job">
                                  <i className="fa-regular fa-heart"></i>
                                  <a
                                    href="https://www.linkedin.com/login"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-linkedin-in"></i>
                                  </a>
                                  <a
                                    href="https://www.facebook.com/"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-facebook-f"></i>
                                  </a>
                                  <a
                                    href="https://web.whatsapp.com/"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-whatsapp"></i>
                                  </a>
                                </div>
                              </div>
                              <div className="available-job-type-details">
                                <h5>
                                  Alibaba Cloud-Facility Operation
                                  Manager-Paris, France
                                </h5>
                                <ul>
                                  <li>
                                    <i className="fa-regular fa-calendar"></i> 3
                                    hours ago
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file"></i> 5
                                    Years
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-user"></i> Full
                                    time
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-location-dot"></i>{" "}
                                    Paris
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file"></i>{" "}
                                    Information Systems / Networks
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Link>

                          <Link to="/job-details">
                            <div className="available-job-posts-box">
                              <div className="available-job-company-name-save-job">
                                <div className="available-job-company-name">
                                  <h4>
                                    <i className="fa-solid fa-building"></i>{" "}
                                    Alibaba Cloud
                                  </h4>
                                </div>
                                <div className="available-job-save-job">
                                  <i className="fa-regular fa-heart"></i>
                                  <a
                                    href="https://www.linkedin.com/login"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-linkedin-in"></i>
                                  </a>
                                  <a
                                    href="https://www.facebook.com/"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-facebook-f"></i>
                                  </a>
                                  <a
                                    href="https://web.whatsapp.com/"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-whatsapp"></i>
                                  </a>
                                </div>
                              </div>
                              <div className="available-job-type-details">
                                <h5>
                                  Alibaba Cloud-Facility Operation
                                  Manager-Paris, France
                                </h5>
                                <ul>
                                  <li>
                                    <i className="fa-regular fa-calendar"></i> 3
                                    hours ago
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file"></i> 5
                                    Years
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-user"></i> Full
                                    time
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-location-dot"></i>{" "}
                                    Paris
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file"></i>{" "}
                                    Information Systems / Networks
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Link>

                          <Link to="/job-details">
                            <div className="available-job-posts-box">
                              <div className="available-job-company-name-save-job">
                                <div className="available-job-company-name">
                                  <h4>
                                    <i className="fa-solid fa-building"></i>{" "}
                                    Alibaba Cloud
                                  </h4>
                                </div>
                                <div className="available-job-save-job">
                                  <i className="fa-regular fa-heart"></i>
                                  <a
                                    href="https://www.linkedin.com/login"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-linkedin-in"></i>
                                  </a>
                                  <a
                                    href="https://www.facebook.com/"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-facebook-f"></i>
                                  </a>
                                  <a
                                    href="https://web.whatsapp.com/"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-whatsapp"></i>
                                  </a>
                                </div>
                              </div>
                              <div className="available-job-type-details">
                                <h5>
                                  Alibaba Cloud-Facility Operation
                                  Manager-Paris, France
                                </h5>
                                <ul>
                                  <li>
                                    <i className="fa-regular fa-calendar"></i> 3
                                    hours ago
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file"></i> 5
                                    Years
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-user"></i> Full
                                    time
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-location-dot"></i>{" "}
                                    Paris
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file"></i>{" "}
                                    Information Systems / Networks
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Link>

                          <Link to="/job-details">
                            <div className="available-job-posts-box">
                              <div className="available-job-company-name-save-job">
                                <div className="available-job-company-name">
                                  <h4>
                                    <i className="fa-solid fa-building"></i>{" "}
                                    Alibaba Cloud
                                  </h4>
                                </div>
                                <div className="available-job-save-job">
                                  <i className="fa-regular fa-heart"></i>
                                  <a
                                    href="https://www.linkedin.com/login"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-linkedin-in"></i>
                                  </a>
                                  <a
                                    href="https://www.facebook.com/"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-facebook-f"></i>
                                  </a>
                                  <a
                                    href="https://web.whatsapp.com/"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-whatsapp"></i>
                                  </a>
                                </div>
                              </div>
                              <div className="available-job-type-details">
                                <h5>
                                  Alibaba Cloud-Facility Operation
                                  Manager-Paris, France
                                </h5>
                                <ul>
                                  <li>
                                    <i className="fa-regular fa-calendar"></i> 3
                                    hours ago
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file"></i> 5
                                    Years
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-user"></i> Full
                                    time
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-location-dot"></i>{" "}
                                    Paris
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file"></i>{" "}
                                    Information Systems / Networks
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Link>

                          <Link to="/job-details">
                            <div className="available-job-posts-box">
                              <div className="available-job-company-name-save-job">
                                <div className="available-job-company-name">
                                  <h4>
                                    <i className="fa-solid fa-building"></i>{" "}
                                    Alibaba Cloud
                                  </h4>
                                </div>
                                <div className="available-job-save-job">
                                  <i className="fa-regular fa-heart"></i>
                                  <a
                                    href="https://www.linkedin.com/login"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-linkedin-in"></i>
                                  </a>
                                  <a
                                    href="https://www.facebook.com/"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-facebook-f"></i>
                                  </a>
                                  <a
                                    href="https://web.whatsapp.com/"
                                    target="_blank"
                                  >
                                    <i className="fa-brands fa-whatsapp"></i>
                                  </a>
                                </div>
                              </div>
                              <div className="available-job-type-details">
                                <h5>
                                  Alibaba Cloud-Facility Operation
                                  Manager-Paris, France
                                </h5>
                                <ul>
                                  <li>
                                    <i className="fa-regular fa-calendar"></i> 3
                                    hours ago
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file"></i> 5
                                    Years
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-user"></i> Full
                                    time
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-location-dot"></i>{" "}
                                    Paris
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file"></i>{" "}
                                    Information Systems / Networks
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

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
      {/* <Outlet /> */}
    </>
  );
}

export default JobDetailsList;
