import React, { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination"; // MUI one
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import Slider from "react-slick";
import { ToastContainer, toast } from "react-toastify";
import { useDebounce } from "../hooks/useDebounce";
import {
  checkSearchRateLimit,
  getRateLimitStatus,
} from "../utils/searchRateLimit";
import { filterCompanySearchResults } from "../utils/companySearchFilter";
import { sanitizeCompanyListApiResponse } from "../utils/sanitizePublicCompany";

const SEARCH_DEBOUNCE_MS = 600;
const MIN_SEARCH_LENGTH = 2;
const SEARCH_RATE_LIMIT_KEY = "employers-companies-search";
const BROWSE_RATE_LIMIT_KEY = "employers-companies-browse";
const SEARCH_RATE_LIMIT = { maxRequests: 15, windowMs: 60_000 };
const BROWSE_RATE_LIMIT = { maxRequests: 30, windowMs: 60_000 };

const normalizeSearchQuery = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length < MIN_SEARCH_LENGTH) {
    return "";
  }
  return trimmed;
};

const Employers = () => {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const { t, i18n } = useTranslation("global");
  const [companies, setCompanies] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState([]);
  // States
  const [companySearch, setCompanySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // For searching
  const [options, setOptions] = useState([]); // All industries from API
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [defaultSections, setDefaultSections] = useState({
    justJoinedUs: [],
  });
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [rateLimitBlockedUntil, setRateLimitBlockedUntil] = useState(0);
  const filterKeyRef = useRef("");
  const fetchAbortRef = useRef(null);
  const dropdownRef = useRef(null);
  const debouncedCompanySearch = useDebounce(companySearch, SEARCH_DEBOUNCE_MS);
  const debouncedLocationSearch = useDebounce(
    locationSearch,
    SEARCH_DEBOUNCE_MS,
  );
  const effectiveCompanySearch = normalizeSearchQuery(debouncedCompanySearch);
  const effectiveLocationSearch = normalizeSearchQuery(debouncedLocationSearch);

  const CompaniesSectionLoader = ({ message = "Loading companies..." }) => (
    <div className="col-12">
      <div
        className="text-center py-5"
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="custom-spinner mb-3" role="status" aria-label="Loading" />
        <p className="text-muted mb-0">{message}</p>
      </div>
    </div>
  );

  const JoinedCompaniesLoader = () => (
    <div
      className="d-flex flex-column justify-content-center align-items-center w-100"
      style={{
        minHeight: "150px",
        background: "#fff",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <div className="custom-spinner mb-3" role="status" aria-label="Loading" />
      <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
        Loading companies...
      </p>
    </div>
  );
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const applyRateLimitBlock = (retryAfterMs) => {
    if (!retryAfterMs) {
      return;
    }
    setRateLimitBlockedUntil(Date.now() + retryAfterMs);
  };

  const isRateLimited =
    rateLimitBlockedUntil > Date.now() ||
    getRateLimitStatus(SEARCH_RATE_LIMIT_KEY, SEARCH_RATE_LIMIT).blocked ||
    getRateLimitStatus(BROWSE_RATE_LIMIT_KEY, BROWSE_RATE_LIMIT).blocked;

  useEffect(() => {
    if (!rateLimitBlockedUntil || rateLimitBlockedUntil <= Date.now()) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setRateLimitBlockedUntil(0);
    }, rateLimitBlockedUntil - Date.now());

    return () => clearTimeout(timer);
  }, [rateLimitBlockedUntil]);

  // ✅ Fetch Company List (with pagination + filters)
  const getCompanyList = useCallback(
    async (
      industryIds = [],
      page = 1,
      limit = pageSize,
      search = "",
      location = "",
      signal,
    ) => {
      const normalizedSearch = normalizeSearchQuery(search);
      const normalizedLocation = normalizeSearchQuery(location);
      const isSearchRequest =
        Boolean(normalizedSearch) || Boolean(normalizedLocation);
      const rateKey = isSearchRequest
        ? SEARCH_RATE_LIMIT_KEY
        : BROWSE_RATE_LIMIT_KEY;
      const rateOptions = isSearchRequest
        ? SEARCH_RATE_LIMIT
        : BROWSE_RATE_LIMIT;

      if (rateLimitBlockedUntil > Date.now()) {
        return;
      }

      const rateCheck = checkSearchRateLimit(rateKey, rateOptions);
      if (!rateCheck.allowed) {
        applyRateLimitBlock(rateCheck.retryAfterMs);
        toast.warning(
          `Too many requests. Please wait ${Math.ceil(
            rateCheck.retryAfterMs / 1000,
          )} seconds before trying again.`,
        );
        return;
      }

      setCompaniesLoading(true);
      try {
        const params = {
          page,
          limit,
        };

        if (industryIds.length > 0) {
          params.industry = industryIds.join(",");
        }

        if (normalizedSearch) {
          params.search = normalizedSearch;
        }

        if (normalizedLocation) {
          params.location = normalizedLocation;
        }

        const res = await axios.get(`${API_BASE_URL}GetCompanyDetailsList`, {
          params,
          signal,
        });

        if (res.data.success) {
          const sanitizedData = sanitizeCompanyListApiResponse(res.data);
          setCompanies(sanitizedData);

          const hasActiveFilters =
            industryIds.length > 0 ||
            Boolean(normalizedSearch) ||
            Boolean(normalizedLocation);

          if (!hasActiveFilters && page === 1) {
            setDefaultSections({
              justJoinedUs: sanitizedData?.sections?.justJoinedUs || [],
            });
          }
        }
      } catch (error) {
        if (
          error?.code === "ERR_CANCELED" ||
          error?.name === "CanceledError"
        ) {
          return;
        }
        console.error("Error fetching company list:", error);
      } finally {
        if (!signal?.aborted) {
          setCompaniesLoading(false);
        }
      }
    },
    [pageSize, rateLimitBlockedUntil],
  );

  const isSearchActive =
    Boolean(effectiveCompanySearch) ||
    Boolean(effectiveLocationSearch) ||
    selected.length > 0;

  const joinedCompanies = isSearchActive
    ? defaultSections.justJoinedUs
    : companies?.sections?.justJoinedUs || [];

  const settings = {
    dots: false, // remove bullets
    arrows: false, // remove arrows
    infinite: joinedCompanies?.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const totalPages = companies?.totalPages;

  useEffect(() => {
    const selectedIndustryIds = selected.map((i) => i._id);
    const filterKey = [
      effectiveCompanySearch,
      effectiveLocationSearch,
      selectedIndustryIds.join(","),
    ].join("|");
    const filtersChanged = filterKeyRef.current !== filterKey;
    filterKeyRef.current = filterKey;

    const pageToFetch = filtersChanged ? 1 : pageNumber;
    if (filtersChanged && pageNumber !== 1) {
      setPageNumber(1);
      return;
    }

    if (rateLimitBlockedUntil > Date.now()) {
      return;
    }

    fetchAbortRef.current?.abort();
    const controller = new AbortController();
    fetchAbortRef.current = controller;

    getCompanyList(
      selectedIndustryIds,
      pageToFetch,
      pageSize,
      effectiveCompanySearch,
      effectiveLocationSearch,
      controller.signal,
    );

    return () => controller.abort();
  }, [
    selected,
    pageNumber,
    pageSize,
    effectiveCompanySearch,
    effectiveLocationSearch,
    getCompanyList,
    rateLimitBlockedUntil,
  ]);
  const handleViewCompany = (company, from) => {
    navigate(`/${company.slug}`, {
      state: { companyId: company._id, from }, // ✅ keep ID hidden
    });
  };

  // Updated Clear All
  const clearAll = () => {
    fetchAbortRef.current?.abort();
    filterKeyRef.current = "||";
    setSelected([]);
    setSearchTerm("");
    setCompanySearch("");
    setLocationSearch("");
    setPageNumber(1);
    getCompanyList([], 1, pageSize, "", "");
  };
  const removeTag = (_id) => {
    setSelected(selected?.filter((i) => i._id !== _id));
  };
  const filteredOptions = options.filter((industry) =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
  };

  const companiesOfMoment = companies?.sections?.companiesOfMoment || [];
  const partnerCompanies = companies?.sections?.partnerCompanies || [];

  const getSearchResultsFromResponse = (data) => {
    let results = [];

    if (data?.companies?.length > 0) {
      results = data.companies;
    } else {
      const sections = data?.sections || {};
      results = [
        ...(sections.companiesOfMoment || []),
        ...(sections.partnerCompanies || []),
        ...(sections.justJoinedUs || []),
      ];
    }

    return filterCompanySearchResults(
      results,
      effectiveCompanySearch,
      effectiveLocationSearch,
    );
  };

  const searchResults = isSearchActive
    ? getSearchResultsFromResponse(companies)
    : [];

  const renderPartnerStyleCard = (item, index) => {
    const company = item?.companyId;
    if (!company) return null;

    return (
      <div
        className="col-xl-3 col-lg-4 col-md-6 mb-4"
        key={company?._id || index}
      >
        <div className="premium-company-box h-100">
          <div className="premium-cover">
            <img
              crossOrigin="anonymous"
              src={
                company?.coverPhoto
                  ? `${API_IMAGE_URL}${company?.coverPhoto}`
                  : "/jobPortal/assets/images/company/company-img-1.jpg"
              }
              alt={company?.brandName || "Company Cover"}
            />
            <div className="premium-overlay" />
          </div>

          <div className="premium-content d-flex flex-column h-100">
            <div
              className="premium-logo-container"
              style={{
                width: "100px",
                height: "100px",
                marginTop: "-50px",
              }}
            >
              <img
                crossOrigin="anonymous"
                src={
                  company?.logo
                    ? `${API_IMAGE_URL}${company?.logo}`
                    : "/jobPortal/assets/images/partner-logo/partner-logo-2.png"
                }
                alt={company?.brandName || "Company Logo"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            <h4
              className="premium-title text-truncate"
              title={company?.brandName}
            >
              {company?.brandName}
            </h4>

            <div
              className="premium-details d-flex flex-column mb-3"
              style={{ gap: "10px" }}
            >
              <div className="company-about-box">
                <span
                  style={{
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "4px",
                    color: "#0f172a",
                  }}
                >
                  About the Company
                </span>

                <p
                  className="company-short-description text-muted mb-0"
                  style={{
                    fontSize: "0.85rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "1.4",
                  }}
                >
                  {stripHtml(company?.aboutCompany) ||
                    "No description available"}
                </p>
              </div>

              <div
                className="sector-highlight"
                style={{
                  background: "rgb(240, 245, 247)",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderLeft: "3px solid rgb(0, 102, 204)",
                }}
              >
                <i
                  className="fa-solid fa-layer-group"
                  style={{
                    color: "rgb(0, 102, 204)",
                    fontSize: "0.9rem",
                  }}
                />

                <span
                  style={{
                    fontWeight: "600",
                    color: "rgb(30, 41, 59)",
                    fontSize: "0.85rem",
                  }}
                >
                  {company?.industry?.name || "N/A"}
                </span>
              </div>

              <div
                className="detail-item mt-1 d-flex align-items-center"
                style={{ gap: "8px" }}
              >
                <i
                  className="fa-solid fa-briefcase"
                  style={{ color: "rgb(0, 102, 204)" }}
                />

                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    color: "rgb(51, 51, 51)",
                  }}
                >
                  {item?.jobCount || item?.jobList?.length || 0} offers
                  available
                </span>
              </div>
            </div>

            <button
              className="btn premium-view-btn w-100 mt-auto"
              onClick={() => handleViewCompany(company, "/companies")}
            >
              See Company
              <i className="fa-solid fa-arrow-right ms-2" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Helmet>
        {/* Basic SEO */}
        <title>Companies | Job Portal</title>
        <meta
          name="description"
          content="Browse top companies, explore industries and find your dream employer."
        />

        <link rel="canonical" href={window.location.href} />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:title" content="Companies | Job Portal" />
        <meta
          property="og:description"
          content="Browse top companies and explore job opportunities."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:image"
          content="/jobPortal/assets/images/banner/inner-banner-img.jpg"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Companies | Job Portal" />
        <meta
          name="twitter:description"
          content="Find companies hiring near you."
        />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Company Listings",
            description: "List of companies available on Job Portal",
            url: window.location.href,
            numberOfItems: companies?.companies?.length || 0,
            itemListElement:
              companies?.companies?.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item?.companyId?.brandName,
                url: `${window.location.origin}/jobPortal/${item?.companyId?.slug}`,
              })) || [],
          })}
        </script>
      </Helmet>
      <section
        className="inner-banners-info-area"
        style={{
          height: "180px",
          overflow: "hidden",
          display: "flex",
          "-webkit-align-items": "center",
          "-webkit-box-align": "center",
          "-ms-flex-align": "center",
          "align-items": "center",
          position: "relative",
          "margin-top": "0px",
        }}
      >
        <div
          className="inner-banners-img-area"
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            "z-index": "1",
          }}
        >
          <img
            alt="Banner Img"
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            style={{
              width: "100%",
              height: "100%",
              "object-fit": "cover",
              "object-position": "center center",
              filter: "brightness(0.8)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to right, rgba(0, 102, 204, 0.6), rgba(0, 0, 0, 0.3))",
            }}
          />
        </div>
        <div
          className="inner-banners-title-info w-100"
          style={{ position: "relative", "z-index": "2", bottom: "auto" }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10 text-center">
                <div className="inner-page-banner-title">
                  <h2
                    className="fw-bold text-white mb-3"
                    style={{
                      "font-size": "2.5rem",
                      "-webkit-text-shadow": "rgba(0, 0, 0, 0.5) 0px 2px 10px",
                      "text-shadow": "rgba(0, 0, 0, 0.5) 0px 2px 10px",
                      "letter-spacing": "1px",
                    }}
                  >
                    <font dir="auto" style={{ "vertical-align": "inherit" }}>
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        Our Partner Companies
                      </font>
                    </font>
                  </h2>
                  <ul
                    className="d-inline-flex align-items-center justify-content-center px-4 py-2 rounded-pill shadow-sm m-0"
                    style={{
                      "background-color": "rgba(255, 255, 255, 0.2)",
                      "backdrop-filter": "blur(8px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      "list-style": "none",
                    }}
                  >
                    <li
                      className="menu-divide-arrow"
                      style={{
                        "margin-right": "25px",
                        display: "flex",
                        "-webkit-align-items": "center",
                        "-webkit-box-align": "center",
                        "-ms-flex-align": "center",
                        "align-items": "center",
                      }}
                    >
                      <a
                        className="text-white text-decoration-none fw-medium"
                        href="/jobPortal"
                        style={{
                          display: "flex",
                          "-webkit-align-items": "center",
                          "-webkit-box-align": "center",
                          "-ms-flex-align": "center",
                          "align-items": "center",
                          gap: "8px",
                        }}
                      >
                        <i className="fa-solid fa-house" />
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          <font
                            dir="auto"
                            style={{ "vertical-align": "inherit" }}
                          >
                            Welcome
                          </font>
                        </font>
                      </a>
                    </li>
                    <li
                      className="text-white fw-bold"
                      style={{
                        display: "flex",
                        "-webkit-align-items": "center",
                        "-webkit-box-align": "center",
                        "-ms-flex-align": "center",
                        "align-items": "center",
                      }}
                    >
                      <font dir="auto" style={{ "vertical-align": "inherit" }}>
                        <font
                          dir="auto"
                          style={{ "vertical-align": "inherit" }}
                        >
                          Companies
                        </font>
                      </font>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="companies-list-filter-info-area"
        style={{
          padding: "40px 0px",
          margin: "0px",
          "background-color": "rgb(240, 245, 247)",
        }}
      >
        <div className="container-fluid px-4 px-xl-5">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-11 col-md-12">
              <div className="elegant-sidebar-filter mb-5">
                {isRateLimited && (
                  <div
                    className="alert alert-warning py-2 px-3 mb-3"
                    role="alert"
                  >
                    Too many requests from this browser. Please wait before
                    searching again.
                  </div>
                )}
                <div className="row align-items-start">
                  <div className="col-lg-4 col-md-4 mb-3 mb-lg-0">
                    <h5 className="filter-title mb-3 text-start">
                      Search for a company
                    </h5>

                    <div className="search-company-input">
                      <i className="fa-solid fa-magnifying-glass search-icon" />

                      <input
                        placeholder="Company name..."
                        className="form-control elegant-input"
                        type="text"
                        value={companySearch}
                        disabled={isRateLimited}
                        onChange={(e) => setCompanySearch(e.target.value)}
                      />
                    </div>
                    <small className="text-muted">
                      Type at least {MIN_SEARCH_LENGTH} characters to search
                    </small>
                  </div>
                  <div className="col-lg-4 col-md-4 mb-3 mb-lg-0">
                    <h5 className="filter-title mb-3 text-start">
                      Business sector
                    </h5>

                    <div className="job-filter-select-info">
                      <div
                        ref={dropdownRef}
                        className="multi-select-container position-relative"
                        style={{ margin: "0px" }}
                      >
                        {/* Input Box */}
                        <div
                          className="selected-items elegant-input d-flex align-items-center flex-wrap"
                          style={{
                            minHeight: "45px",
                            padding: "8px 12px",
                            gap: "6px",
                            cursor: "text",
                          }}
                          onClick={() => setShowOptions(true)}
                        >
                          <input
                            placeholder="Field... (Ex: Auditing, Finance, IT...)"
                            className="border-0 bg-transparent flex-grow-1"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowOptions(true)}
                            style={{
                              outline: "none",
                              minWidth: "180px",
                            }}
                          />
                        </div>

                        {/* Dropdown */}
                        {showOptions && (
                          <ul
                            className="options-list mt-2 position-absolute w-100 shadow-sm rounded bg-white"
                            style={{
                              zIndex: "999",
                              maxHeight: "250px",
                              overflowY: "auto",
                            }}
                          >
                            {filteredOptions.length > 0 ? (
                              filteredOptions.map((industry) => {
                                const isSelected = selected.some(
                                  (i) => i._id === industry._id,
                                );

                                return (
                                  <li
                                    key={industry?._id}
                                    onClick={() => toggleOption(industry)}
                                    className={isSelected ? "selected" : ""}
                                    style={{
                                      cursor: "pointer",
                                      padding: "10px 15px",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span>{industry?.name}</span>

                                    {isSelected && (
                                      <span className="checkmark text-primary ms-2">
                                        <i className="fa-solid fa-check" />
                                      </span>
                                    )}
                                  </li>
                                );
                              })
                            ) : (
                              <li
                                className="no-options"
                                style={{ padding: "10px 15px" }}
                              >
                                {t("header.no_industries")}
                              </li>
                            )}
                          </ul>
                        )}

                        {/* Selected Tags */}
                        <div className="mt-3 d-flex flex-wrap gap-2">
                          {selected?.map((industry) => (
                            <span
                              key={industry?._id}
                              className="badge bg-light text-dark border px-3 py-2 rounded-pill d-flex align-items-center"
                              style={{ fontSize: "0.9rem" }}
                            >
                              {industry?.name}

                              <i
                                className="fa-solid fa-circle-xmark ms-2 text-danger"
                                style={{
                                  cursor: "pointer",
                                  fontSize: "1rem",
                                }}
                                onClick={() => removeTag(industry?._id)}
                              />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 mb-3 mb-lg-0">
                    <h5 className="filter-title mb-3 text-start">
                      City or country
                    </h5>

                    <div className="search-company-input">
                      <i className="fa-solid fa-location-dot search-icon" />

                      <input
                        placeholder="Search by city or country..."
                        className="form-control elegant-input"
                        type="text"
                        value={locationSearch}
                        disabled={isRateLimited}
                        onChange={(e) => setLocationSearch(e.target.value)}
                      />
                    </div>
                    <small className="text-muted">
                      Type at least {MIN_SEARCH_LENGTH} characters to search
                    </small>
                  </div>
                </div>
              </div>
              <div className="available-company-list-info">
                <div className="combined-premium-group bg-white p-4 rounded mb-5 shadow-sm">
                  <div className="new-joiners-section mb-5">
                    <div className="row g-4 align-items-stretch">
                      <div className="col-12 pb-0 mb-0">
                        <div className="px-2">
                          <div className="px-2">
                            <div
                              className="section-title text-start m-0"
                              style={{ margin: "0px" }}
                            >
                              <h3
                                className="fw-bold d-inline-block"
                                style={{
                                  color: "rgb(0, 102, 204)",
                                  "font-size": "1.5rem",
                                  "border-bottom":
                                    "2px solid rgb(240, 245, 247)",
                                  "padding-bottom": "10px",
                                }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  <font
                                    dir="auto"
                                    style={{ "vertical-align": "inherit" }}
                                  >
                                    They have just joined us
                                  </font>
                                </font>
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="col-lg-9 d-flex flex-column justify-content-center"
                        style={{
                          backgroundColor: "rgb(255, 102, 0)",
                          padding: "15px",
                          borderRadius: "12px",
                        }}
                      >
                        {companiesLoading && !isSearchActive ? (
                          <JoinedCompaniesLoader />
                        ) : joinedCompanies?.length > 0 ? (
                          <div className="carousel-container px-2 w-100">
                            <div className="slider-container">
                              <Slider {...settings}>
                                {joinedCompanies?.map((item, index) => {
                                  const company = item?.companyId;

                                  return (
                                    <div key={company?._id || index}>
                                      <div className="px-2">
                                        <div
                                          className="new-joiner-card p-2 border rounded"
                                          style={{
                                            background: "#fff",
                                            height: "120px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            handleViewCompany(
                                              company,
                                              "/companies",
                                            )
                                          }
                                        >
                                          <div className="logo-wrapper w-100 h-100 d-flex align-items-center justify-content-center">
                                            <img
                                              alt={company?.brandName}
                                              crossOrigin="anonymous"
                                              className="img-fluid"
                                              src={
                                                company?.logo
                                                  ? `${API_IMAGE_URL}${company?.logo}`
                                                  : "/jobPortal/assets/images/partner-logo/partner-logo-2.png"
                                              }
                                              style={{
                                                width: "120px",
                                                height: "80px",
                                                objectFit: "contain",
                                                transition: "0.3s",
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </Slider>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="d-flex flex-column justify-content-center align-items-center text-center"
                            style={{
                              minHeight: "150px",
                              background: "#fff",
                              borderRadius: "10px",
                              padding: "20px",
                            }}
                          >
                            <i
                              className="fa-solid fa-building-circle-xmark mb-3"
                              style={{
                                fontSize: "45px",
                                color: "#cbd5e1",
                              }}
                            />

                            <h5
                              style={{
                                color: "#475569",
                                fontWeight: "600",
                              }}
                            >
                              No Joined Companies Found
                            </h5>

                            <p
                              style={{
                                color: "#94a3b8",
                                marginBottom: 0,
                                fontSize: "14px",
                              }}
                            >
                              There are currently no newly joined companies
                              available.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="col-lg-3 d-flex">
                        <div
                          className="trust-banner rounded p-4 text-white d-flex align-items-end"
                          style={{
                            background:
                              'linear-gradient(to top, rgba(0, 102, 204, 0.95), rgba(0, 102, 204, 0.4)) center center / cover, url("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80")',
                            width: "100%",
                            "min-height": "200px",
                            "box-shadow": "rgba(0, 102, 204, 0.2) 0px 4px 15px",
                          }}
                        >
                          <h4
                            className="fw-bold mb-0 text-white"
                            style={{
                              "-webkit-text-shadow":
                                "rgba(0, 0, 0, 0.3) 0px 2px 4px",
                              "text-shadow": "rgba(0, 0, 0, 0.3) 0px 2px 4px",
                            }}
                          >
                            <font
                              dir="auto"
                              style={{ "vertical-align": "inherit" }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                Companies that trust us
                              </font>
                            </font>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr
                    className="my-5"
                    style={{
                      "border-top": "1px solid rgb(234, 234, 234)",
                      opacity: "1",
                    }}
                  />
                  {isSearchActive ? (
                    <div className="search-results-section mb-5">
                      <div className="row g-4 mb-4">
                        <div className="col-12 pb-0 mb-0">
                          <div
                            className="section-title text-start m-0"
                            style={{ margin: "0px" }}
                          >
                            <h3
                              className="fw-bold d-inline-block"
                              style={{
                                color: "rgb(0, 102, 204)",
                                "font-size": "1.5rem",
                                "border-bottom": "2px solid rgb(240, 245, 247)",
                                "padding-bottom": "10px",
                              }}
                            >
                              Search Results
                            </h3>
                          </div>
                        </div>
                        <div className="row">
                          {companiesLoading ? (
                            <CompaniesSectionLoader message="Searching companies..." />
                          ) : searchResults?.length > 0 ? (
                            searchResults.map((item, index) =>
                              renderPartnerStyleCard(item, index),
                            )
                          ) : (
                            <div className="col-12">
                              <div
                                className="text-center py-5"
                                style={{
                                  background: "#fff",
                                  borderRadius: "12px",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                <i
                                  className="fa-solid fa-building-circle-xmark mb-3"
                                  style={{
                                    fontSize: "50px",
                                    color: "#cbd5e1",
                                  }}
                                />

                                <h5
                                  style={{
                                    color: "#475569",
                                    fontWeight: "600",
                                  }}
                                >
                                  No Companies Found
                                </h5>

                                <p
                                  style={{
                                    color: "#94a3b8",
                                    marginBottom: 0,
                                  }}
                                >
                                  No companies match your search criteria.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="trending-companies-section mb-2">
                      <div className="row g-4 mb-4">
                        <div className="col-12 pb-0 mb-0">
                          <div
                            className="section-title text-start m-0"
                            style={{ margin: "0px" }}
                          >
                            <h3
                              className="fw-bold d-inline-block"
                              style={{
                                color: "rgb(0, 102, 204)",
                                "font-size": "1.5rem",
                                "border-bottom": "2px solid rgb(240, 245, 247)",
                                "padding-bottom": "10px",
                              }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  Companies of the moment
                                </font>
                              </font>
                            </h3>
                          </div>
                        </div>
                        <div className="row">
                          {companiesLoading ? (
                            <CompaniesSectionLoader />
                          ) : companiesOfMoment?.length > 0 ? (
                            companiesOfMoment.map((item, index) => {
                              const company = item?.companyId;

                              return (
                                <div
                                  className="col-xl-4 col-lg-4 col-md-6 mb-4"
                                  key={company?._id || index}
                                >
                                  <div className="premium-company-box h-100">
                                    {/* Cover Image */}
                                    <div className="premium-cover">
                                      <img
                                        crossOrigin="anonymous"
                                        src={
                                          company?.coverPhoto
                                            ? `${API_IMAGE_URL}${company?.coverPhoto}`
                                            : "/jobPortal/assets/images/company/company-img-1.jpg"
                                        }
                                        alt={
                                          company?.brandName || "Company Cover"
                                        }
                                      />

                                      <div className="premium-overlay" />
                                    </div>

                                    {/* Content */}
                                    <div className="premium-content d-flex flex-column h-100">
                                      {/* Logo */}
                                      <div
                                        className="premium-logo-container"
                                        style={{
                                          width: "200px",
                                          height: "150px",
                                          marginTop: "-75px",
                                        }}
                                      >
                                        <img
                                          crossOrigin="anonymous"
                                          src={
                                            company?.logo
                                              ? `${API_IMAGE_URL}${company?.logo}`
                                              : "/jobPortal/assets/images/partner-logo/partner-logo-2.png"
                                          }
                                          alt={
                                            company?.brandName || "Company Logo"
                                          }
                                          style={{
                                            objectFit: "contain",
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        />
                                      </div>

                                      {/* Company Name */}
                                      <h4
                                        className="premium-title text-truncate"
                                        title={company?.brandName}
                                      >
                                        {company?.brandName}
                                      </h4>

                                      {/* Description + Industry */}
                                      <div
                                        className="premium-details d-flex flex-column mb-3"
                                        style={{ gap: "10px" }}
                                      >
                                        <div className="company-about-box">
                                          <span
                                            style={{
                                              fontWeight: "600",
                                              display: "block",
                                              marginBottom: "4px",
                                              color: "#0f172a",
                                            }}
                                          >
                                            About the Company
                                          </span>

                                          <p
                                            className="company-short-description text-muted mb-0"
                                            style={{
                                              fontSize: "0.85rem",
                                              display: "-webkit-box",
                                              WebkitLineClamp: 2,
                                              WebkitBoxOrient: "vertical",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              lineHeight: "1.4",
                                            }}
                                          >
                                            {stripHtml(company?.aboutCompany) ||
                                              "No description available"}
                                          </p>
                                        </div>

                                        {/* Industry */}
                                        <div
                                          className="sector-highlight"
                                          style={{
                                            background: "rgb(240, 245, 247)",
                                            padding: "6px 12px",
                                            borderRadius: "6px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            borderLeft:
                                              "3px solid rgb(0, 102, 204)",
                                          }}
                                        >
                                          <i
                                            className="fa-solid fa-layer-group"
                                            style={{
                                              color: "rgb(0, 102, 204)",
                                              fontSize: "0.9rem",
                                            }}
                                          />

                                          <span
                                            style={{
                                              fontWeight: "600",
                                              color: "rgb(30, 41, 59)",
                                              fontSize: "0.85rem",
                                            }}
                                          >
                                            {company?.industry?.name || "N/A"}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Footer */}
                                      <div className="d-flex justify-content-between align-items-center mt-auto pt-3">
                                        <span
                                          className="fw-bold px-3 py-1 offers-anim-btn"
                                          onClick={() =>
                                            handleViewCompany(
                                              company,
                                              "/companies",
                                            )
                                          }
                                        >
                                          {item?.jobCount ||
                                            item?.jobList?.length ||
                                            0}{" "}
                                          Offers
                                        </span>

                                        <button
                                          className="btn premium-view-btn px-4"
                                          style={{ width: "auto" }}
                                          onClick={() =>
                                            handleViewCompany(
                                              company,
                                              "/companies",
                                            )
                                          }
                                        >
                                          See
                                          <i className="fa-solid fa-arrow-right ms-2" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="col-12">
                              <div
                                className="text-center py-5"
                                style={{
                                  background: "#fff",
                                  borderRadius: "12px",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                <i
                                  className="fa-solid fa-building-circle-xmark mb-3"
                                  style={{
                                    fontSize: "50px",
                                    color: "#cbd5e1",
                                  }}
                                />

                                <h5
                                  style={{
                                    color: "#475569",
                                    fontWeight: "600",
                                  }}
                                >
                                  No Companies Found
                                </h5>

                                <p
                                  style={{
                                    color: "#94a3b8",
                                    marginBottom: 0,
                                  }}
                                >
                                  There are currently no companies available at
                                  the moment.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {!isSearchActive && (
                  <div className="all-companies-section mb-5">
                    <div className="available-company-list-area">
                      <div className="row premium-companies-grid">
                        <div className="col-12 mb-3">
                          <div
                            className="section-title text-start m-0"
                            style={{ margin: "0px" }}
                          >
                            <h3
                              className="fw-bold d-inline-block"
                              style={{
                                color: "rgb(0, 102, 204)",
                                "font-size": "1.5rem",
                                "border-bottom": "2px solid rgb(240, 245, 247)",
                                "padding-bottom": "10px",
                              }}
                            >
                              <font
                                dir="auto"
                                style={{ "vertical-align": "inherit" }}
                              >
                                <font
                                  dir="auto"
                                  style={{ "vertical-align": "inherit" }}
                                >
                                  Our partner companies
                                </font>
                              </font>
                            </h3>
                          </div>
                        </div>
                        <div className="row">
                          {companiesLoading ? (
                            <CompaniesSectionLoader />
                          ) : partnerCompanies?.length > 0 ? (
                            partnerCompanies.map((item, index) => {
                              const company = item?.companyId;

                              return (
                                <div
                                  className="col-xl-3 col-lg-4 col-md-6 mb-4"
                                  key={company?._id || index}
                                >
                                  <div className="premium-company-box h-100">
                                    {/* Cover */}
                                    <div className="premium-cover">
                                      <img
                                        crossOrigin="anonymous"
                                        src={
                                          company?.coverPhoto
                                            ? `${API_IMAGE_URL}${company?.coverPhoto}`
                                            : "/jobPortal/assets/images/company/company-img-1.jpg"
                                        }
                                        alt={
                                          company?.brandName || "Company Cover"
                                        }
                                      />
                                      <div className="premium-overlay" />
                                    </div>

                                    {/* Content */}
                                    <div className="premium-content d-flex flex-column h-100">
                                      {/* Logo */}
                                      <div
                                        className="premium-logo-container"
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                          marginTop: "-50px",
                                        }}
                                      >
                                        <img
                                          crossOrigin="anonymous"
                                          src={
                                            company?.logo
                                              ? `${API_IMAGE_URL}${company?.logo}`
                                              : "/jobPortal/assets/images/partner-logo/partner-logo-2.png"
                                          }
                                          alt={
                                            company?.brandName || "Company Logo"
                                          }
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                          }}
                                        />
                                      </div>

                                      {/* Company Name */}
                                      <h4
                                        className="premium-title text-truncate"
                                        title={company?.brandName}
                                      >
                                        {company?.brandName}
                                      </h4>

                                      {/* Details */}
                                      <div
                                        className="premium-details d-flex flex-column mb-3"
                                        style={{ gap: "10px" }}
                                      >
                                        {/* Description */}
                                        <div className="company-about-box">
                                          <span
                                            style={{
                                              fontWeight: "600",
                                              display: "block",
                                              marginBottom: "4px",
                                              color: "#0f172a",
                                            }}
                                          >
                                            About the Company
                                          </span>

                                          <p
                                            className="company-short-description text-muted mb-0"
                                            style={{
                                              fontSize: "0.85rem",
                                              display: "-webkit-box",
                                              WebkitLineClamp: 2,
                                              WebkitBoxOrient: "vertical",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              lineHeight: "1.4",
                                            }}
                                          >
                                            {stripHtml(company?.aboutCompany) ||
                                              "No description available"}
                                          </p>
                                        </div>

                                        {/* Industry */}
                                        <div
                                          className="sector-highlight"
                                          style={{
                                            background: "rgb(240, 245, 247)",
                                            padding: "6px 12px",
                                            borderRadius: "6px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            borderLeft:
                                              "3px solid rgb(0, 102, 204)",
                                          }}
                                        >
                                          <i
                                            className="fa-solid fa-layer-group"
                                            style={{
                                              color: "rgb(0, 102, 204)",
                                              fontSize: "0.9rem",
                                            }}
                                          />

                                          <span
                                            style={{
                                              fontWeight: "600",
                                              color: "rgb(30, 41, 59)",
                                              fontSize: "0.85rem",
                                            }}
                                          >
                                            {company?.industry?.name || "N/A"}
                                          </span>
                                        </div>

                                        {/* Offers */}
                                        <div
                                          className="detail-item mt-1 d-flex align-items-center"
                                          style={{ gap: "8px" }}
                                        >
                                          <i
                                            className="fa-solid fa-briefcase"
                                            style={{
                                              color: "rgb(0, 102, 204)",
                                            }}
                                          />

                                          <span
                                            style={{
                                              fontSize: "0.85rem",
                                              fontWeight: "500",
                                              color: "rgb(51, 51, 51)",
                                            }}
                                          >
                                            {item?.jobCount ||
                                              item?.jobList?.length ||
                                              0}{" "}
                                            offers available
                                          </span>
                                        </div>
                                      </div>

                                      {/* Button */}
                                      <button
                                        className="btn premium-view-btn w-100 mt-auto"
                                        onClick={() =>
                                          handleViewCompany(
                                            company,
                                            "/companies",
                                          )
                                        }
                                      >
                                        See Company
                                        <i className="fa-solid fa-arrow-right ms-2" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="col-12">
                              <div
                                className="text-center py-5"
                                style={{
                                  background: "#fff",
                                  borderRadius: "12px",
                                  border: "1px solid #e5e7eb",
                                }}
                              >
                                <i
                                  className="fa-solid fa-building-circle-xmark mb-3"
                                  style={{
                                    fontSize: "50px",
                                    color: "#cbd5e1",
                                  }}
                                />

                                <h5
                                  style={{
                                    color: "#475569",
                                    fontWeight: "600",
                                  }}
                                >
                                  No Partner Companies Found
                                </h5>

                                <p
                                  style={{
                                    color: "#94a3b8",
                                    marginBottom: 0,
                                  }}
                                >
                                  There are currently no partner companies
                                  available.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="MuiStack-root css-14yaqqw">
                  {companiesLoading ? (
                    <div className="d-flex justify-content-center align-items-center py-3">
                      <div
                        className="custom-spinner"
                        role="status"
                        aria-label="Loading pagination"
                      />
                    </div>
                  ) : (
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
                          setPageNumber(1);
                        }}
                        size="small"
                      >
                        <MenuItem value={15}>15 / {t("header.page")}</MenuItem>
                        <MenuItem value={25}>25 / {t("header.page")}</MenuItem>
                        <MenuItem value={50}>50 /{t("header.page")}</MenuItem>
                        <MenuItem value={100}>100 /{t("header.page")}</MenuItem>
                      </Select>
                    </Stack>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Employers;
