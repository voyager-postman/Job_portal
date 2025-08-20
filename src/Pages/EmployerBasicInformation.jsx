import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
import Select from "react-select";
const EmployerBasicInformation = () => {
  const [formData, setFormData] = useState({
    brand_name: "",
    vat: "",
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
  const [citySuggestions, setCitySuggestions] = useState([]);
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
      city: city.name,
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

  const fetchCities = async (key) => {
    try {
      const res = await axios.get(`${API_BASE_URL}searchCities`, {
        params: { key },
      });
      if (res.data && Array.isArray(res.data.cities)) {
        setCitySuggestions(res.data.cities);
      } else {
        setCitySuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCitySuggestions([]);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}get/countries`);
        if (res.data && Array.isArray(res.data.countries)) {
          setCountries(res.data.countries);
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
    const requiredFields = [
      "brand_name",
      "vat",
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
        toast.error(`${field.replace(/_/g, " ")} is required`);
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
      const response = await axios.post(
        `${API_BASE_URL}recruiter/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const { userDetails } = response.data;
        localStorage.setItem("user", JSON.stringify(userDetails));
        localStorage.setItem("user_id", userDetails._id);
        localStorage.setItem("user_email", userDetails.email);
        localStorage.setItem("user_role", userDetails.role);
        localStorage.setItem("first_name", userDetails.first_name);
        localStorage.setItem("last_name", userDetails.last_name);

        toast.success("Recruiter profile created successfully!");
        // Navigate or reset form
        navigate("/employer-dashboard");
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
      {/* <div className="page-banner-area bg-f0f4fc">
        <div className="container">
          <div className="page-banner-content">
            <h1>Employer Basic Info</h1>
            <ul>
              <li>
                <a href="index.html">Home</a>
              </li>
              <li>Employer Basic Info</li>
            </ul>
          </div>
        </div>
      </div> */}
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
                    <label>Brand name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Brand name"
                      name="brand_name"
                      value={formData.brand_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>VAT</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="VAT"
                      name="vat"
                      value={formData.vat}
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
                {/* Country Code */}
                <div className="col-lg-3 col-md-12">
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
                </div>

                <div className="col-lg-9 col-md-12">
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
                {/* <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Street Address"
                    />
                  </div>
                </div> */}
                <div className="col-lg-6 col-md-6">
                  <div className="form-group position-relative">
                    <label>Street Address</label>
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
                {/* City */}
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      className="form-control"
                      type="text"
                      name="city"
                      value={formData.city}
                      readOnly
                    />
                  </div>
                </div>

                {/* State */}
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>State</label>
                    <input
                      className="form-control"
                      type="text"
                      name="region"
                      value={formData.region}
                      readOnly
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      className="form-control"
                      type="text"
                      name="Country"
                      value={formData.Country}
                      readOnly
                    />
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
