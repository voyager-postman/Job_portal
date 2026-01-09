import React, { useEffect, useState, useRef } from "react";
import axios from "../Services/axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination"; // MUI one

function Companies() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [companies, setCompanies] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // For searching
  const [options, setOptions] = useState([]); // All industries from API
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // ✅ Fetch Company List (with pagination + filters)
  const getCompanyList = async (
    industryIds = [],
    page = 1,
    limit = pageSize
  ) => {
    try {
      const params = {
        page,
        limit,
      };

      if (industryIds.length > 0) {
        params.industry = industryIds.join(",");
      }

      const res = await axios.get(`${API_BASE_URL}GetCompanyDetailsList`, {
        params,
      });

      if (res.data.success) {
        setCompanies(res.data);
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
  };

  // ✅ Re-fetch when pagination or filters change
  useEffect(() => {
    const selectedIndustryIds = selected.map((i) => i._id);
    getCompanyList(selectedIndustryIds, pageNumber, pageSize);
  }, [pageNumber, pageSize, selected]);

  const totalPages = companies?.totalPages;
  useEffect(() => {
    getCompanyList();
  }, []);
  const handleViewCompany = (company) => {
    navigate("/companies-details", {
      state: { companyId: company }, // 👈 send ID as prop-like data
    });
  };

  const clearAll = () => {
    setSelected([]);
    setSearchTerm("");
    getCompanyList(); // Fetch all companies
  };
  const removeTag = (_id) => {
    const newSelected = selected?.filter((i) => i._id !== _id);
    setSelected(newSelected);

    // Refetch companies based on updated industries
    const selectedIndustryIds = newSelected?.map((i) => i._id);
    getCompanyList(selectedIndustryIds);
  };
  const filteredOptions = options.filter((industry) =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}getIndustries`);
        if (res.data.success && Array.isArray(res.data.industries)) {
          setOptions(res.data.industries);
        }
      } catch (err) {
        console.error("Error fetching industries:", err);
      }
    };
    fetchIndustries();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const toggleOption = (industry) => {
    let newSelected = [];
    if (selected.some((i) => i._id === industry._id)) {
      newSelected = selected.filter((i) => i._id !== industry._id);
    } else {
      newSelected = [...selected, industry];
    }

    setSelected(newSelected);

    // Refetch companies based on updated industries
    const selectedIndustryIds = newSelected.map((i) => i._id);
    getCompanyList(selectedIndustryIds);
  };
  console.log(selected);
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
                <i className="fa-solid fa-angle-right" /> Companies List
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Jobs filter and job list info Area */}
          <div className="job-filter-job-list-info">
            <div className="row">
              <div className="col-lg-3 col-sm-3">
                <div className="job-filter-main-info">
                  <div className="job-filter-heading-area">
                    <h4>
                      <Link to="/job-search">
                        <i className="fa-regular fa-file" /> Job offers
                      </Link>
                    </h4>
                  </div>

                  <div className="divder-line-info" />
                  <div className="job-filter-heading-area job-filter-cancel-heading">
                    <h4>
                      <i className="fa-regular fa-building" /> Companies
                    </h4>
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
                          {/* Show first 2 selected industries and +X more if any */}
                          {selected?.map((industry) => (
                            <span key={industry?._id} className="tag">
                              {industry?.name}
                              <i
                                className="fa-solid fa-xmark"
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "6px",
                                }}
                                onClick={() => removeTag(industry._id)}
                              />
                            </span>
                          ))}
                          <input
                            type="text"
                            placeholder="Search industries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowOptions(true)}
                          />
                        </div>

                        {showOptions && (
                          <ul className="options-list">
                            {filteredOptions.length > 0 ? (
                              filteredOptions.map((industry) => (
                                <li
                                  key={industry._id}
                                  onClick={() => toggleOption(industry)}
                                  className={
                                    selected.some((i) => i._id === industry._id)
                                      ? "selected"
                                      : ""
                                  }
                                >
                                  {industry?.name}
                                  {selected.some(
                                    (i) => i._id === industry._id
                                  ) && <span className="checkmark">✔</span>}
                                </li>
                              ))
                            ) : (
                              <li className="no-options">
                                No industries found
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-9">
                <div className="available-company-list-info">
                  <div className="available-company-heading">
                    <h4>
                      <i className="fa-solid fa-building" />
                      {companies?.totalCompanies} companies available
                    </h4>
                    <div className="job-alert-tag-btn">
                      <div className="filter-tag-info-area">
                        {selected.length > 0 &&
                          selected.map((industry) => (
                            <span key={industry._id} className="filter-tag">
                              {industry.name}
                              <i
                                className="fa-solid fa-xmark"
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "6px",
                                }}
                                onClick={() => removeTag(industry._id)}
                              />
                            </span>
                          ))}
                      </div>
                      {/* ✅ Show buttons only if any filter is selected */}
                    </div>
                  </div>
                  <div className="available-company-list-area">
                    <div className="row">
                      {companies?.companies?.length > 0 ? (
                        companies?.companies?.map((item) => {
                          const company = item?.companyId;
                          return (
                            <div
                              className="col-lg-4 col-md-4"
                              key={company?._id}
                            >
                              <div className="available-company-box-info">
                                {/* ✅ Company Logo */}
                                <div className="available-company-logo">
                                  <img
                                    src={
                                      company?.logo
                                        ? `${API_IMAGE_URL}${company?.logo}`
                                        : "/jobPortal/assets/images/partner-logo/partner-logo-2.png"
                                    }
                                    crossorigin="anonymous"
                                    alt={company?.brandName || "Company Logo"}
                                  />
                                </div>

                                {/* ✅ Background/cover image (optional placeholder) */}
                                <div className="available-company-img">
                                  <img
                                    crossorigin="anonymous"
                                    src={
                                      company?.coverPhoto
                                        ? `${API_IMAGE_URL}${company?.coverPhoto}`
                                        : "/jobPortal/assets/images/company/company-img-1.jpg"
                                    }
                                    alt={company?.brandName || "Company Cover"}
                                  />
                                </div>

                                {/* ✅ Company Info */}
                                <div className="available-company-content">
                                  <h4>
                                    {company?.brandName || "Unnamed Company"}
                                  </h4>
                                  <ul>
                                    <li>
                                      <i className="fa-solid fa-location-dot" />{" "}
                                      {company?.city ||
                                        "Location not available"}
                                    </li>
                                    <li>
                                      <i className="fa-solid fa-user" />{" "}
                                      {company?.numberOfEmployees || "N/A"}
                                    </li>
                                    <li>
                                      <i className="fa-solid fa-globe" />{" "}
                                      {company?.industry?.name ||
                                        "Industry not specified"}
                                    </li>
                                  </ul>
                                </div>

                                {/* ✅ View Button */}
                                <div className="available-company-btn">
                                  <button
                                    className="default-btn btn"
                                    onClick={() =>
                                      handleViewCompany(company?._id)
                                    }
                                  >
                                    View Company
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center mt-4">
                          No companies available.
                        </p>
                      )}
                    </div>
                  </div>

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mt: 3 }}
                  >
                    <Pagination
                      count={companies?.totalPages || 1}
                      page={pageNumber}
                      onChange={(e, value) => setPageNumber(value)}
                      variant="outlined"
                      shape="rounded"
                      color="secondary"
                      siblingCount={2}
                      boundaryCount={1}
                    />

                    <Select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(e.target.value);
                        setPageNumber(1); // reset to first page
                      }}
                      size="small"
                    >
                      <MenuItem value={15}>15 / page</MenuItem>
                      <MenuItem value={25}>25 / page</MenuItem>
                      <MenuItem value={50}>50 / page</MenuItem>
                      <MenuItem value={100}>100 / page</MenuItem>
                    </Select>
                  </Stack>
                </div>
              </div>
            </div>
          </div>
          {/*Jobs filter and job list info Area */}
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

export default Companies;
