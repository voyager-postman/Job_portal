import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
import Select from "react-select";
import Swal from "sweetalert2";
import { useDebounce, SEARCH_DEBOUNCE_MS } from "../hooks/useDebounce";
import { useTranslation } from "react-i18next";

const EmployerBasicInformation = () => {
  const { t } = useTranslation("global");
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
  const [countryCode, setCountryCode] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const debouncedCompanyAddress = useDebounce(
    formData.company_address,
    SEARCH_DEBOUNCE_MS,
  );

  const fieldLabels = {
    brand_name: t("profile.company_name"),
    industry: t("profile.industry"),
    number_of_employees: t("profile.number_of_employees"),
    phone_number: t("profile.phone_number"),
    country_code: t("profile.country_code"),
    company_address: t("profile.street_address"),
    city: t("profile.city"),
    region: t("profile.state"),
    Country: t("profile.country"),
  };

  const handleCitySearch = (e) => {
    handleChange(e);
  };

  useEffect(() => {
    if (!debouncedCompanyAddress.trim()) {
      setCitySuggestions([]);
      return undefined;
    }

    const fetchCitySuggestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}searchCities`, {
          params: { key: debouncedCompanyAddress },
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

    fetchCitySuggestions();
  }, [debouncedCompanyAddress]);

  useEffect(() => {
    setMapUrl(
      "https://www.google.com/maps?q=28.522404036526275,77.23701088488971&z=15&output=embed",
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
            (c) => c.name?.toLowerCase() !== "western sahara",
          );

          const morocco = filtered.find(
            (c) =>
              String(c.phonecode) === "212" ||
              c.name?.toLowerCase() === "morocco",
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

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const term = (countryCode || "").toString().toLowerCase();
  const filteredCountries = countries.filter((c) => {
    const name = (c.name || "").toLowerCase();
    const phone = (c.phonecode || "").toString();
    const iso2 = (c.iso2 || "").toLowerCase();

    return name.includes(term) || phone.includes(term) || iso2.includes(term);
  });

  const handleSelect = (c) => {
    const formatted = `${c.emoji.toUpperCase()} +${c.phonecode} ${c.name}`;
    setCountryCode(formatted);
    setFormData((prev) => ({
      ...prev,
      country_code: String(c.phonecode),
    }));
    setOpen(false);
  };

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}getIndustries`);
        if (res.data && Array.isArray(res.data.industries)) {
          setIndustries(res.data.industries);
        } else {
          console.error("Industries data is not an array", res.data);
          setIndustries([]);
        }
      } catch (error) {
        console.error("Error fetching industries:", error);
        setIndustries([]);
      }
    };
    fetchIndustries();
  }, []);

  const validateRecruiterForm = () => {
    const requiredFields = [
      "brand_name",
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
        toast.error(t("profile.field_required", { field: fieldLabels[field] }));
        return false;
      }
    }

    if (isNaN(formData.phone_number)) {
      toast.error(t("profile.phone_must_be_numeric"));
      return false;
    }

    if (isNaN(formData.country_code)) {
      toast.error(t("profile.country_code_must_be_numeric"));
      return false;
    }

    return true;
  };

  const handleCreateRecruiterProfile = async () => {
    if (!validateRecruiterForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const updatedFormData = {
        ...formData,
        city: formData.company_address,
        company_address: formData.city,
      };
      const response = await axios.post(
        `${API_BASE_URL}company/profile`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        await Swal.fire({
          title: t("profile.registration_successful"),
          text: t("profile.approval_submitted"),
          icon: "success",
          confirmButtonText: t("header.ok"),
          confirmButtonColor: "#3085d6",
        });
        localStorage.clear();
        navigate("/");
        return;
      } else {
        toast.error(response.data?.message || t("profile.failed_create_profile"));
      }
    } catch (error) {
      console.error("Create Recruiter Profile error:", error);
      if (Array.isArray(error.response?.data?.errors)) {
        error.response.data.errors.forEach((errMsg) => toast.error(errMsg));
      } else {
        toast.error(
          error.response?.data?.message || t("profile.profile_creation_failed"),
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

  const navigate = useNavigate();
  const countryOptions = countries.map((c) => ({
    value: c.phonecode,
    label: `${c.emoji} +${c.phonecode} ${c.name}`,
  }));

  return (
    <>
      <ToastContainer />
      <section class="inner-banners-info-area">
        <div class="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt={t("profile.breadcrumb_img")}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div class="inner-banners-title-info">
          <div class="container">
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="inner-page-banner-title">
                  <h1>{t("profile.employer_basic_info")}</h1>
                  <ul>
                    <li class="menu-divide-arrow">
                      <Link to="/">{t("header.home")}</Link>
                    </li>
                    <li>{t("profile.employer_basic_info")}</li>
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
              {t("profile.employer_profile")}{" "}
              <label className="oragneColor">{t("profile.basic_info")}</label>{" "}
            </h2>
            <p style={{ whiteSpace: "pre-line" }}>
              {t("profile.basic_info_mandatory_hint")}
            </p>
          </div>
        </div>
        <div className="employer-profile-basic-info-form">
          <div className="container">
            <div className="employer-personal-info-area">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>{t("profile.company_name")}</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder={t("profile.company_name")}
                      name="brand_name"
                      value={formData.brand_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>{t("profile.industry")}</label>
                    <select
                      className="form-select form-control"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                    >
                      <option value="">{t("profile.select_industry")}</option>
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
                    <label>{t("profile.number_of_employees")}</label>
                    <select
                      className="form-select form-control"
                      name="number_of_employees"
                      value={formData.number_of_employees}
                      onChange={handleChange}
                    >
                      <option value="">{t("profile.select_number_of_employees")}</option>
                      <option value="1-15">1-15</option>
                      <option value="16-50">16-50</option>
                      <option value="51-100">51-100</option>
                      <option value="100-150">100-150</option>
                    </select>
                  </div>
                </div>

                <div
                  className="col-lg-6 col-md-12"
                  ref={containerRef}
                  style={{ position: "relative" }}
                >
                  <div className="form-group">
                    <label>{t("profile.country_code")}</label>

                    <Select
                      options={countryOptions}
                      placeholder={t("profile.select_country_code")}
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
                          {t("profile.no_country_code_found")}
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="col-lg-6 col-md-12">
                  <div className="form-group">
                    <label>{t("profile.phone_number")}</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder={t("profile.phone_number")}
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="form-group position-relative">
                    <label>{t("profile.city")}</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder={t("profile.street_address")}
                      name="company_address"
                      value={formData.company_address}
                      onChange={handleCitySearch}
                      autoComplete="off"
                    />
                    {loading && (
                      <div className="suggestion-box">{t("profile.searching")}</div>
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
                    <label>{t("profile.state")}</label> {t("profile.state_auto_hint")}
                    <input
                      className="form-control"
                      type="text"
                      name="region"
                      placeholder={t("profile.state")}
                      value={formData.region}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{t("profile.country")}</label> {t("profile.country_auto_hint")}
                    <input
                      className="form-control"
                      type="text"
                      name="Country"
                      placeholder={t("profile.country")}
                      value={formData.Country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>{t("profile.street_address")}</label>
                    <textarea
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      rows={3}
                      placeholder={t("profile.enter_street_address")}
                    ></textarea>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>{t("profile.our_map_location")}</label>
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
                        <p>{t("profile.no_location_selected")}</p>
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
                    {loading ? t("profile.submitting") : t("profile.submit")}
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
