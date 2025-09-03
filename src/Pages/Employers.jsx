import React from "react";
import { Link } from "react-router-dom";

const companiesData = [
  {
    logo: "assets/images/partner-logo/partner-logo-2.png",
    img: "assets/images/company/company-img-1.jpg",
    name: "Hauts De Seine Department",
    location: "Levallois-Perret",
    size: "1000 - 20000",
    role: "Technicien support VIP Anglais",
    link: "companies-details.html",
  },
  {
    logo: "assets/images/partner-logo/partner-logo-2.png",
    img: "assets/images/company/company-img-1.jpg",
    name: "Hauts De Seine Department",
    location: "Levallois-Perret",
    size: "1000 - 20000",
    role: "Technicien support VIP Anglais",
    link: "companies-details.html",
  },
  {
    logo: "assets/images/partner-logo/partner-logo-2.png",
    img: "assets/images/company/company-img-1.jpg",
    name: "Hauts De Seine Department",
    location: "Levallois-Perret",
    size: "1000 - 20000",
    role: "Technicien support VIP Anglais",
    link: "companies-details.html",
  },
  // You can add more companies here
];

const Employers = () => {
  return (
    <>
      <section className="inner-banners-info-area">
        <div className="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="breadcrumb Img"
          />
        </div>
        <div className="inner-banners-title-info">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="inner-page-banner-title">
                  <h2>Companies</h2>
                  <ul>
                    <li className="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Companies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="companies-list-filter-info-area">
        <div className="container">
          <div className="row">
            {/* Sidebar Filter */}
            <div className="col-lg-3 col-sm-3">
              <div className="job-filter-main-info">
                <div className="job-filter-heading-area">
                  <h4>
                    <Link to="/jobs">
                      <i className="fa-regular fa-file"></i> Job offers
                    </Link>
                  </h4>
                </div>
                <div className="divder-line-info"></div>
                <div className="job-filter-heading-area job-filter-cancel-heading">
                  <h4>
                    <i className="fa-regular fa-building"></i> Companies
                  </h4>
                </div>
                <div className="divder-line-info"></div>

                <div className="job-filter-search-area">
                  <div className="job-filter-heading-cancel">
                    <div className="job-filter-heading">
                      <h4>
                        <i className="fas fa-building"></i> Industry Sector
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
                      <option defaultValue="">Select Industry</option>
                      <option value="1">Agriculture</option>
                      <option value="2">Air Transport</option>
                      <option value="3">Automotive</option>
                      <option value="4">Biotechnology</option>
                      <option value="5">Chemicals</option>
                      <option value="6">Construction</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Companies List */}
            <div className="col-lg-9 col-md-9">
              <div className="available-company-list-info">
                <div className="available-company-heading">
                  <h4>
                    <i className="fa-solid fa-building"></i>{" "}
                    {companiesData.length} companies available
                  </h4>
                </div>

                <div className="available-company-list-area">
                  <div className="row">
                    {companiesData.map((company, index) => (
                      <div className="col-lg-4 col-md-4" key={index}>
                        <div className="available-company-box-info">
                          <div className="available-company-logo">
                            <img src={company.logo} alt={company.name} />
                          </div>
                          <div className="available-company-img">
                            <img src={company.img} alt={company.name} />
                          </div>
                          <div className="available-company-content">
                            <h4>{company.name}</h4>
                            <ul>
                              <li>
                                <i className="fa-solid fa-location-dot"></i>
                                {company.location}
                              </li>
                              <li>
                                <i className="fa-solid fa-user"></i>
                                {company.size}
                              </li>
                              <li>
                                <i className="fa-solid fa-globe"></i>
                                {company.role}
                              </li>
                            </ul>
                          </div>
                          <div className="available-company-btn">
                            <Link
                              to={`/companies-details`}
                              className="default-btn btn"
                            >
                              View Company
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
