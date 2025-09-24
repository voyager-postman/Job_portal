import React from "react";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
const companyOptions = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
];
const industries = [
  "Agriculture",
  "Air Transport",
  "Automotive",
  "Consulting",
  "Biotechnology",
  "Construction",
  "Chemicals",
  "Consumer Goods and Services",
];

function JobSearch() {
  const wrapperRef = useRef(null);

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
    const [selected, setSelected] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const companyContainerRef = useRef(null);
  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const handleToggleCompany = (company) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
    setCompanySearchTerm("");
  };

  const handleRemoveCompany = (company) => {
    setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
  };

  const handleClearCompanies = () => {
    setSelectedCompanies([]);
    setCompanySearchTerm("");
  };

  const filteredCompanyOptions = companyOptions.filter(
    (company) =>
      company.toLowerCase().includes(companySearchTerm.toLowerCase()) &&
      !selectedCompanies.includes(company)
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        companyContainerRef.current &&
        !companyContainerRef.current.contains(event.target)
      ) {
        setShowCompanyDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [companyContainerRef]);

  const filteredOptions = industries.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

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
  const clearAll = () => {
    setSelected([]);
    setSearch("");
  };
    const removeTag = (value) => {
    setSelected(selected.filter((v) => v !== value));
  };
  const toggleOption = (value) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Search Job List</h1>
            <ol className="breadcrumb">
              <li className="item">
                <a href="dashboard.html">Home </a>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Search Job List
              </li>
            </ol>
          </div>

          <div className="manage-jobs-box">
            <div className="job-listing-search-form job-search-info-area">
              <form onSubmit={handleSubmit}>
                <div className="row g-0">
                  <div className="col-lg-3 col-sm-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Keywords / Job Title"
                        value={filters.keywords}
                        onChange={(e) =>
                          setFilters({ ...filters, keywords: e.target.value })
                        }
                      />
                      <i className="flaticon-portfolio" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="City Or Postcode"
                        value={filters.location}
                        onChange={(e) =>
                          setFilters({ ...filters, location: e.target.value })
                        }
                      />
                      <i className="flaticon-location" />
                    </div>
                  </div>
                  <div className="col-lg-4 col-sm-6">
                    <div className="form-group style">
                      <select
                        className="form-select form-control"
                        value={filters.category}
                        onChange={(e) =>
                          setFilters({ ...filters, category: e.target.value })
                        }
                      >
                        <option value="">Choose A Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <i className="flaticon-list" />
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

          <div className="job-filter-job-list-info">
            <div className="container">
              <div className="row">
                {/* <div className="col-lg-3 col-sm-3">
                  <div className="job-filter-main-info">
                    <div
                      className="job-filter-heading-area job-filter-cancel-heading"
                      onClick={() => navigate("/job-search")}
                      style={{ cursor: "pointer" }}
                    >
                      <h4>
                        <i className="fa-regular fa-file" /> Job offers
                      </h4>
                    </div>
                    <NavLink
                      to="/companies-list"
                      className={({ isActive }) =>
                        `job-filter-heading-area ${isActive ? "active" : ""}`
                      }
                    >
                      <h4>
                        <i className="fa-regular fa-building" /> Companies
                      </h4>
                    </NavLink>

                    <div className="divder-line-info" />
                    <div className="job-filter-search-area">
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fa-solid fa-gear" /> Tech Stack
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
                          <option selected>Select Tech Stack</option>
                          <option value={1}>Java</option>
                          <option value={2}>Python</option>
                          <option value={3}>React</option>
                          <option value={2}>Python</option>
                          <option value={3}>React</option>
                        </select>
                      </div>
                    </div>
                    <div className="divder-line-info" />
                    <div className="job-filter-search-area">
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fa-solid fa-gear" /> Job Type
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
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> Full Time</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> Part Time</label>
                          </li>

                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> Freelance</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> Internship</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> Remote</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> Hybrid Jobs</label>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="divder-line-info" />
                    <div className="job-filter-search-area">
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fa-solid fa-location-dot" /> Location
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
                          <option selected>Select Location</option>
                          <option value={1}>India</option>
                          <option value={2}>USA</option>
                          <option value={3}>Paris</option>
                          <option value={4}>Germany</option>
                          <option value={2}>Spain</option>
                          <option value={3}>Mau</option>
                        </select>
                      </div>
                    </div>
                    <div className="divder-line-info" />
                    <div class="job-filter-search-area">
                      <div class="job-filter-heading-cancel">
                        <div class="job-filter-heading">
                          <h4>
                            <i class="fas fa-signal"></i> Experience Level
                          </h4>
                        </div>
                        <div class="job-filter-cancel-heading">
                          <h4>Clear</h4>
                        </div>
                      </div>
                      <div class="job-filter-select-info">
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
                    <div className="divder-line-info" />
                    <div className="job-filter-search-area">
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fas fa-money-bill-alt" /> Salary Range
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
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> 0 to $100</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> $ 101 to $ 150</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> $ 151 to $ 200</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> $ 201 to $ 250</label>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="divder-line-info" />
                    <div className="job-filter-search-area">
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fas fa-building" /> Industry Sector
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
                          <option selected>Select Industry</option>
                          <option value={1}>Agriculture</option>
                          <option value={2}>Air Transport</option>
                          <option value={3}>Automotive</option>
                          <option value={4}>Biotechnology</option>
                          <option value={2}>Chemicals</option>
                          <option value={3}>Construction</option>
                        </select>
                      </div>
                    </div>
                    <div className="divder-line-info" />
                    <div className="job-filter-search-area">
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fas fa-building" /> Company
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
                          <option selected>Select Company</option>
                          <option value={1}>Agriculture</option>
                          <option value={2}>Air Transport</option>
                          <option value={3}>Automotive</option>
                          <option value={4}>Biotechnology</option>
                          <option value={2}>Chemicals</option>
                          <option value={3}>Construction</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="col-lg-3 col-md-3">
                  <div className="job-filter-main-info">
                    <div className="job-filter-heading-area">
                      <h4>
                        <Link to="/companies-list" className="active">
                          <i className="fa-regular fa-file" /> Job offers
                        </Link>
                      </h4>
                    </div>
                    <div className="job-filter-heading-area">
                      <h4>
                        <Link to="/companies-list">
                          <i className="fa-regular fa-building" /> Companies
                        </Link>
                      </h4>
                    </div>
                    <div className="divder-line-info" />
                    <div className="job-filter-search-area">
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fa-solid fa-gear" /> Tech Stack
                          </h4>
                        </div>
                        <div className="job-filter-cancel-heading">
                          <h4>Clear</h4>
                        </div>
                      </div>
                      <div className="job-filter-select-info">
                        <div className="job-filter-tech-stack">
                          <ul>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                Data / Big data (75)
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                DevOps / Cloud (80)
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                Information systems / Networks (100)
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                Quality Assurance (150)
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                Project / Product Management (120)
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                Software Engineering / Web Development (140)
                              </label>
                            </li>
                          </ul>
                        </div>
                        <div
                          className="job-filter-tech-stack collapse"
                          id="myCollapse1"
                          style={{}}
                        >
                          <div className="job-filter-tech-stack-search-box">
                            <input
                              type="search"
                              className="form-control"
                              id="gsearch"
                              name="gsearch"
                              placeholder="Search"
                            />
                          </div>
                          <ul>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                Data / Big data (140)
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                DevOps / Cloud (150)
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                Information systems / Networks (120)
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                Quality Assurance (110)
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                Project / Product Management (95)
                              </label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                Software Engineering / Web Development (2000)
                              </label>
                            </li>
                          </ul>
                        </div>
                        <div
                          className="show-more-less-btn collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#myCollapse1"
                          aria-expanded="false"
                          aria-controls="myCollapse"
                        >
                          <span className="show-more">
                            Show More{" "}
                            <i
                              className="fa fa-angle-down"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="show-less">
                            Show Less{" "}
                            <i className="fa fa-angle-up" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="divder-line-info" />
                    <div className="job-filter-search-area">
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fa-solid fa-gear" /> Job Type
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
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> Full Time</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> Part Time</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> Freelance</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1">
                              {" "}
                              Internship / Apprenticeship
                            </label>
                          </li>
                        </ul>
                        <div
                          className="job-filter-tech-stack collapse"
                          id="myCollapse2"
                        >
                          <ul>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1"> Volunteer</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1"> Seasonal</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1">
                                {" "}
                                Contract / Freelance / Self-employed
                              </label>
                            </li>
                          </ul>
                        </div>
                        <div
                          className="show-more-less-btn collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#myCollapse2"
                          aria-expanded="false"
                          aria-controls="myCollapse"
                        >
                          <span className="show-more">
                            Show More{" "}
                            <i
                              className="fa fa-angle-down"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="show-less">
                            Show Less{" "}
                            <i className="fa fa-angle-up" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="divder-line-info" />
                    <div className="job-filter-search-area">
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fa-solid fa-location-dot" /> Location
                          </h4>
                        </div>
                        <div className="job-filter-cancel-heading">
                          <h4>Clear</h4>
                        </div>
                      </div>
                      <div className="job-filter-select-info">
                        {/*  <select class="form-select form-control" aria-label="Default select example">
          <option selected="">Select Job Location</option>
          <option value="1">India</option>
          <option value="2">USA</option>
          <option value="3">Paris</option>
          <option value="4">Germany</option>
          <option value="2">Spain</option>
          <option value="3">Mau</option>
      </select> */}
                        <div className="job-filter-select-location">
                          <input
                            className="form-control"
                            type="search"
                            id="locationSearch"
                            placeholder="Search Location"
                          />
                          <div
                            className="dropdown"
                            id="resultsDropdown"
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="divder-line-info" />
                    <div className="job-filter-search-area">
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fas fa-signal" /> Experience Level
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
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> 0 - 2 Years</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> 2 - 4 Years</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> 5 - 7 Years</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> 8 - 10 Years</label>
                          </li>
                        </ul>
                        <div
                          className="job-filter-tech-stack collapse"
                          id="myCollapse3"
                        >
                          <ul>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1"> 11 - 13 Years</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1"> 14 - 16 Years</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1"> 17 - 19 Years</label>
                            </li>
                          </ul>
                        </div>
                        <div
                          className="show-more-less-btn collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#myCollapse3"
                          aria-expanded="false"
                          aria-controls="myCollapse"
                        >
                          <span className="show-more">
                            Show More{" "}
                            <i
                              className="fa fa-angle-down"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="show-less">
                            Show Less{" "}
                            <i className="fa fa-angle-up" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="divder-line-info" />
                    <div className="job-filter-search-area">
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fas fa-money-bill-alt" /> Salary Range
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
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> 0 to $100</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> $100 to $150</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> $150 to $200</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="OtherPreferences"
                              name="OtherPreferences"
                              defaultValue="Other Preferences"
                            />
                            <label htmlFor="vehicle1"> $200 to $250</label>
                          </li>
                        </ul>
                        <div
                          className="job-filter-tech-stack collapse"
                          id="myCollapse4"
                        >
                          <ul>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1"> $250 to $300</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1"> $300 - $350</label>
                            </li>
                            <li>
                              <input
                                type="checkbox"
                                id="OtherPreferences"
                                name="OtherPreferences"
                                defaultValue="Other Preferences"
                              />
                              <label htmlFor="vehicle1"> $350 - $400</label>
                            </li>
                          </ul>
                        </div>
                        <div
                          className="show-more-less-btn collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#myCollapse4"
                          aria-expanded="false"
                          aria-controls="myCollapse"
                        >
                          <span className="show-more">
                            Show More{" "}
                            <i
                              className="fa fa-angle-down"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="show-less">
                            Show Less{" "}
                            <i className="fa fa-angle-up" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="divder-line-info" />
                    <div className="job-filter-search-area" ref={wrapperRef}>
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fas fa-building" /> Industry Sector
                          </h4>
                        </div>
                        <div
                          className="job-filter-cancel-heading"
                          onClick={clearAll}
                        >
                          <h4>Clear</h4>
                        </div>
                      </div>

                      <div className="job-filter-select-info">
                        <div className="multi-select-container">
                          <div
                            className="selected-items"
                            onClick={() => setShowOptions(true)}
                          >
                            {selected.map((val) => (
                              <div key={val} className="tag">
                                <span>{val}</span>
                                <span
                                  className="remove-tag"
                                  onClick={() => removeTag(val)}
                                >
                                  ×
                                </span>
                              </div>
                            ))}
                            <input
                              type="text"
                              placeholder="Select industries..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              onFocus={() => setShowOptions(true)}
                            />
                          </div>

                          {showOptions && (
                            <ul className="options-list">
                              {filteredOptions.map((item) => (
                                <li
                                  key={item}
                                  onClick={() => toggleOption(item)}
                                  className={
                                    selected.includes(item) ? "selected" : ""
                                  }
                                >
                                  {item}
                                  {selected.includes(item) && (
                                    <span className="checkmark">✔</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="divder-line-info" />
                    <div
                      className="job-filter-search-area"
                      ref={companyContainerRef}
                    >
                      <div className="job-filter-heading-cancel">
                        <div className="job-filter-heading">
                          <h4>
                            <i className="fas fa-building" /> Company
                          </h4>
                        </div>
                        <div
                          className="job-filter-cancel-heading"
                          onClick={handleClearCompanies}
                        >
                          <h4>Clear</h4>
                        </div>
                      </div>

                      <div className="job-filter-select-info">
                        <div className="multi-select-container">
                          <div className="selected-items">
                            {selectedCompanies.map((company) => (
                              <div key={company} className="tag">
                                <span>{company}</span>
                                <span
                                  className="remove-tag"
                                  onClick={() => handleRemoveCompany(company)}
                                >
                                  ×
                                </span>
                              </div>
                            ))}
                            <input
                              type="text"
                              placeholder="Search Company..."
                              value={companySearchTerm}
                              onChange={(e) =>
                                setCompanySearchTerm(e.target.value)
                              }
                              onFocus={() => setShowCompanyDropdown(true)}
                            />
                          </div>

                          {showCompanyDropdown && (
                            <ul className="options-list">
                              {filteredCompanyOptions.map((company) => (
                                <li
                                  key={company}
                                  onClick={() => handleToggleCompany(company)}
                                >
                                  {company}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9 col-md-9">
                  <div className="available-job-posts-info">
                    <div className="available-job-posts-heading">
                      <h4>
                        <i className="fa-regular fa-file" />
                        {totalJobData?.total} available job posts
                      </h4>
                    </div>
                    {jobList.length > 0 ? (
                      jobList.map((job) => (
                        <Link to={`/job-details`}>
                          <div className="available-job-posts-box">
                            <div className="available-job-company-name-save-job">
                              <div className="available-job-company-name">
                                <a href="job-details.html">
                                  <h4>
                                    <img
                                      src="assets/images/icon/icon-25.png"
                                      alt="logo"
                                    />{" "}
                                    Alibaba Cloud
                                  </h4>
                                </a>
                              </div>
                              <div className="available-job-save-job">
                                <i className="fa-regular fa-heart" />
                                <a
                                  href="https://www.linkedin.com/login"
                                  target="_blank"
                                >
                                  <i className="fa-brands fa-linkedin-in" />
                                </a>
                                <a
                                  href="https://www.facebook.com/"
                                  target="_blank"
                                >
                                  <i className="fa-brands fa-facebook-f" />
                                </a>
                                <a
                                  href="https://web.whatsapp.com/"
                                  target="_blank"
                                >
                                  <i className="fa-brands fa-whatsapp" />
                                </a>
                              </div>
                            </div>
                            <a href="job-details.html">
                              <div className="available-job-type-details">
                                <h5>
                                  Alibaba Cloud-Facility Operation
                                  Manager-Paris, France
                                </h5>
                                <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry. Lorem Ipsum
                                  has been the industry's standard dummy text
                                  ever since the 1500s, when an unknown printer
                                  took a galley
                                </p>
                                <ul>
                                  <li>
                                    <i className="fa-regular fa-calendar" /> 3
                                    hours ago
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file" /> 5 Years
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-user" /> Full
                                    time
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-location-dot" />{" "}
                                    Paris
                                  </li>
                                  <li>
                                    <i className="fa-regular fa-file" />{" "}
                                    Information Systems
                                  </li>
                                  <li>
                                    <i className="fa-solid fa-users" />{" "}
                                    Available: 3
                                  </li>
                                </ul>
                              </div>
                            </a>
                            <div className="available-job-type-apply-btn">
                              <a
                                href="job-details.html"
                                className="apply-btn-info default-btn btn"
                              >
                                Apply
                              </a>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-center mt-3">No jobs found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
      </div>
    </>
  );
}

export default JobSearch;
