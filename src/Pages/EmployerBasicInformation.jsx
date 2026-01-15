import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "../utils/axiosInstance"

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
import Select from "react-select";
import Swal from "sweetalert2";
const EmployerBasicInformation = () => {
  const [formData, setFormData] = useState({
    brand_name: "",
    industry: "",
    number_of_employees: "",
    phone_number: "",
    country_code: "",
    company_address: "",
    city: "",
    region: "",
    Country: "",
  });
  const [industries, setIndustries] = useState([]);
  const [mapUrl, setMapUrl] = useState("");

  const [countries, setCountries] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleCitySearch = async (e) => {
    const value = e.target.value;
    handleChange(e); // update formData.company_address

    if (!value.trim()) {
      setCitySuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}searchCities`, {
        params: { key: value },
      });

      if (res.data?.success && Array.isArray(res.data.cities)) {
        setCitySuggestions(res.data.cities);
      } else {
        setCitySuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCitySuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Set default location — Noida
    setMapUrl(
      "https://www.google.com/maps?q=28.522404036526275,77.23701088488971&z=15&output=embed"
    );
  }, []);
  const handleSelectCity = (city) => {
    setFormData((prev) => ({
      ...prev,
      company_address: `${city.name}, ${city.state_name}, ${city.country_name}`,

      region: city.state_name,
      Country: city.country_name,
      latitude: city.latitude,
      longitude: city.longitude,
    }));

    // Simpler map URL
    const mapSrc = `https://www.google.com/maps?q=${city.latitude},${city.longitude}&z=15&output=embed`;
    setMapUrl(mapSrc);

    setCitySuggestions([]);
  };
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}get/countries`);
        if (res.data && Array.isArray(res.data.countries)) {
          let filtered = res.data.countries.filter(
            (c) => c.name?.toLowerCase() !== "western sahara"
          );

          const morocco = filtered.find(
            (c) =>
              String(c.phonecode) === "212" ||
              c.name?.toLowerCase() === "morocco"
          );

          if (morocco) {
            filtered = [
              morocco,
              ...filtered.filter((c) => c._id !== morocco._id),
            ];
          }

          setCountries(filtered);
        } else {
          console.error("Countries data is not an array", res.data);
          setCountries([]);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([]);
      }
    };
    fetchCountries();
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // make sure we treat countryCode as string and handle empty case
  const term = (countryCode || "").toString().toLowerCase();
  const filteredCountries = countries.filter((c) => {
    const name = (c.name || "").toLowerCase();
    const phone = (c.phonecode || "").toString();
    const iso2 = (c.iso2 || "").toLowerCase();

    return name.includes(term) || phone.includes(term) || iso2.includes(term);
  });

  const handleSelect = (c) => {
    const formatted = `${c.emoji.toUpperCase()} +${c.phonecode} ${c.name}`;
    setCountryCode(formatted); // input shows exact format
    setFormData((prev) => ({
      ...prev,
      country_code: String(c.phonecode),
    }));
    setOpen(false);
  };

  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     try {
  //       const res = await axios.get(`${API_BASE_URL}get/countries`);
  //       if (res.data && Array.isArray(res.data.countries)) {
  //         setCountries(res.data.countries);
  //       } else {
  //         console.error("Countries data is not an array", res.data);
  //         setCountries([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching countries:", error);
  //       setCountries([]);
  //     }
  //   };
  //   fetchCountries();
  // }, []);
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}getIndustries`);
        if (res.data && Array.isArray(res.data.industries)) {
          setIndustries(res.data.industries);
        } else {
          console.error("Industries data is not an array", res.data);
          setIndustries([]); // fallback
        }
      } catch (error) {
        console.error("Error fetching industries:", error);
        setIndustries([]); // fallback
      }
    };
    fetchIndustries();
  }, []);

  const options = countries.map((country) => ({
    value: country.phonecode,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={`https://flagcdn.com/w20/${country.iso2.toLowerCase()}.png`}
          alt={country.name}
          style={{ marginRight: 8, borderRadius: 4 }}
        />
        {country.emoji} +{country.phonecode} {country.name}
      </div>
    ),
  }));

  const validateRecruiterForm = () => {
    const fieldLabels = {
      brand_name: "Company name",
      industry: "Industry",
      number_of_employees: "Number of employees",
      phone_number: "Phone number",
      country_code: "Country code",
      company_address: "Company address",
      city: "City",
      region: "Region",
      Country: "Country",
    };
    const requiredFields = [
      "brand_name",
      // "vat",
      "industry",
      "number_of_employees",
      "phone_number",
      "country_code",
      "company_address",
      "city",
      "region",
      "Country",
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        const message = `${fieldLabels[field]} is required`;
        toast.error(message);
        return false;
      }
    }

    if (isNaN(formData.phone_number)) {
      toast.error("Phone number must be numeric");
      return false;
    }

    if (isNaN(formData.country_code)) {
      toast.error("Country code must be numeric");
      return false;
    }

    // if (isNaN(formData.number_of_employees)) {
    //   toast.error("Number of employees must be numeric");
    //   return false;
    // }

    return true;
  };

  const handleCreateRecruiterProfile = async () => {
    if (!validateRecruiterForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const updatedFormData = {
        ...formData,
        city: formData.company_address, // send company_address as city
        company_address: formData.city, // send city as company_address
      };
      const response = await axios.post(
        `${API_BASE_URL}company/profile`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        // ⭐ CLEAN & PROPER SWEETALERT MESSAGE
        await Swal.fire({
          title: "Registration Successful!",
          text: "Your approval request has been submitted to the admin. You will be notified once approved.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });

        navigate("/");
        return;
      } else {
        toast.error(response.data?.message || "Failed to create profile");
      }
    } catch (error) {
      console.error("Create Recruiter Profile error:", error);
      if (Array.isArray(error.response?.data?.errors)) {
        error.response.data.errors.forEach((errMsg) => toast.error(errMsg));
      } else {
        toast.error(
          error.response?.data?.message ||
            "Profile creation failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/recruiter/profile",
        formData
      );
      console.log("API Response:", res.data);
      navigate("/employer-dashboard");
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const navigate = useNavigate();
  const employerLoginPage = () => {
    navigate("/employer-dashboard");
  };
  const countryOptions = countries.map((c) => ({
    value: c.phonecode, // numeric value to save
    label: `${c.emoji} +${c.phonecode} ${c.name}`,
  }));

  return (
    <>
      <ToastContainer />
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
                  <h2>Employer Basic Info</h2>
                  <ul>
                    <li class="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Employer Basic Info</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="employer-profile-basic-info-area">
        <div className="employer-profile-basic-info-heading">
          <div className="section-title">
            <h2>
              Employer Profile <label className="oragneColor">Basic Info</label>{" "}
            </h2>
            <p>
              These fields are mandatory before you publish a job post.
              <br />
              You can change them, if needed, anytime.
            </p>
          </div>
        </div>
        <div className="employer-profile-basic-info-form">
          <div className="container">
            <div className="employer-personal-info-area">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Company Name"
                      name="brand_name"
                      value={formData.brand_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Industry</label>
                    <select
                      className="form-select form-control"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                    >
                      <option value="">Select Industry</option>
                      {industries.map((ind) => (
                        <option key={ind._id} value={ind._id}>
                          {ind.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Number of Employees</label>
                    <select
                      className="form-select form-control"
                      name="number_of_employees"
                      value={formData.number_of_employees}
                      onChange={handleChange}
                    >
                      <option value="">Select Number Of Employees</option>
                      <option value="1-15">1-15</option>
                      <option value="16-50">16-50</option>
                      <option value="51-100">51-100</option>
                      <option value="100-150">100-150</option>
                    </select>
                  </div>
                </div>

                {/* <div className="col-lg-3 col-md-12">
                  <div className="form-group">
                    <label>Country code</label>
                    <select
                      className="form-select form-control"
                      name="country_code"
                      value={formData.country_code}
                      onChange={handleChange}
                    >
                      <option value="">Select Country Code</option>
                      {countries.map((country) => (
                        <option key={country._id} value={country.phonecode}>
                          {country.emoji} +{country.phonecode} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div> */}

                <div
                  className="col-lg-6 col-md-12"
                  ref={containerRef}
                  style={{ position: "relative" }}
                >
                  <div className="form-group">
                    <label>Country code</label>

                    <Select
                      options={countryOptions}
                      placeholder="Select country code"
                      isSearchable={true}
                      onChange={(selected) => {
                        setFormData((prev) => ({
                          ...prev,
                          country_code: String(selected.value),
                        }));
                      }}
                      styles={{
                        control: (base) => ({
                          ...base,
                          height: "45px",
                          borderColor: "#ced4da",
                        }),
                      }}
                    />
                  </div>

                  {open && (
                    <ul
                      className="list-group"
                      style={{
                        position: "absolute",
                        width: "100%",
                        maxHeight: "250px",
                        overflowY: "auto",
                        zIndex: 9999,
                      }}
                    >
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((c) => (
                          <li
                            key={c._id}
                            className="list-group-item list-group-item-action d-flex align-items-center"
                            onClick={() => handleSelect(c)}
                            style={{ cursor: "pointer" }}
                          >
                            {c.emoji?.toUpperCase()} +{c.phonecode} {c.name}
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item text-muted text-center">
                          No country code found
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="col-lg-6 col-md-12">
                  <div className="form-group">
                    <label>Phone number</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Phone number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="form-group position-relative">
                    <label>City</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Street Address"
                      name="company_address"
                      value={formData.company_address}
                      onChange={handleCitySearch}
                      autoComplete="off"
                    />
                    {/* Suggestions Dropdown */}
                    {loading && (
                      <div className="suggestion-box">Searching...</div>
                    )}
                    {!loading && citySuggestions.length > 0 && (
                      <ul
                        className="list-group position-absolute w-100"
                        style={{
                          zIndex: 1000,
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {citySuggestions.map((city) => (
                          <li
                            key={city._id}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSelectCity(city)}
                            style={{ cursor: "pointer" }}
                          >
                            {city.name}, {city.state_name}, {city.country_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>State</label> (auto-generated from location, or edit
                    manually):
                    <input
                      className="form-control"
                      type="text"
                      name="region"
                      placeholder="State"
                      value={formData.region}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Country</label> (auto-generated from location, or
                    edit manually):
                    <input
                      className="form-control"
                      type="text"
                      name="Country"
                      placeholder="Country"
                      value={formData.Country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Street Address</label>
                    <textarea
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      rows={3} // optional: controls textarea height
                      placeholder="Enter street address"
                    ></textarea>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Our Map Location</label>
                    <div className="employer-our-map-location">
                      {mapUrl ? (
                        <iframe
                          src={mapUrl}
                          width="100%"
                          height={500}
                          style={{ border: "0" }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      ) : (
                        <p>No location selected</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="employer-personal-info-btn">
                  <button
                    type="button"
                    className="default-btn btn"
                    onClick={handleCreateRecruiterProfile}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EmployerBasicInformation;
