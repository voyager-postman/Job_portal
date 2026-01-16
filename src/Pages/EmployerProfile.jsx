// import axios from "../Services/axios";
import axios from "axios"

import { Link, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useAuth } from "../context/AuthContext";
function EmployerProfile() {
  const { updateProfileImage } = useAuth();

  const [careerDetail, setCareerDetail] = useState("");
  const [isCareerUpdating, setIsCareerUpdating] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [fileName1, setFileName1] = useState("No file selected");
  const [preview, setPreview] = useState("assets/images/company/dummy-img.png");
  const [preview1, setPreview1] = useState(
    "assets/images/company/dummy-img.png"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideos, setIsUploadingVideos] = useState(false);
  const [activeTab, setActiveTab] = useState("menu1");
  const [videos, setVideos] = useState([]); // new videos selected
  const [existingVideos, setExistingVideos] = useState([]); // from API
  const [formData, setFormData] = useState({
    brand_name: "",
    industry: "",
    number_of_employees: "",
    phone_number: "",
    country_code: "",
    company_address: "",
    aboutCompany: "",
    city: "",
    region: "",
    Country: "",
  });

  const [socialLinks, setSocialLinks] = useState({
    website: "",
    linkedin: "",
    facebook: "",
    twitter: "",
    instagram: "",
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
          // ✅ 1. Filter out Western Sahara
          let filtered = res.data.countries.filter(
            (c) => c.name.toLowerCase() !== "western sahara"
          );

          // ✅ 2. Find Morocco (+212)
          const morocco = filtered.find(
            (c) => c.phonecode === "212" || c.name.toLowerCase() === "morocco"
          );

          // ✅ 3. If Morocco exists, move it to the top
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
      // "vat",
      "industry",
      "number_of_employees",
      "phone_number",
      "country_code",
      "company_address",
      "aboutCompany",
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

    return true;
  };
  const fetchCompanyDetails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const companyId = user?.companyId;

      if (!companyId) {
        toast.error("Company ID not found!");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}GetCompanyById/${companyId}`
      );

      if (response.data.success && response.data.company) {
        const data = response.data.company;
        const photos = response.data.company.photos || [];
        setExistingPhotos(
          photos.map((p) => ({
            id: p._id,
            preview: `${API_IMAGE_URL}${p.url}`, // full URL
          }))
        );
        const vids = response.data.company.videos || [];
        setExistingVideos(
          vids.map((v) => ({
            id: v._id,
            preview: `${API_IMAGE_URL}${v.url}`, // full path
          }))
        );
        // Split companyAddress into city, region, country
        let city = "",
          region = "",
          country = "";
        if (data.companyAddress) {
          const parts = data.city.split(",").map((p) => p.trim());
          city = parts[0] || "";
          region = parts[1] || "";
          country = parts[2] || "";
        }
        if (data.logo) {
          setPreview(`${API_IMAGE_URL}${data.logo}`);
        }
        if (data?.links) {
          setSocialLinks({
            website: data.links.officialWebsite || "",
            linkedin: data.links.linkedin || "",
            facebook: data.links.facebook || "",
            twitter: data.links.twitter || "",
            instagram: data.links.instagram || "",
          });
        }
        if (data.coverPhoto) {
          setPreview1(`${API_IMAGE_URL}${data.coverPhoto}`);
        } else {
          setPreview("assets/images/company/dummy-img.png");
        }
        // ✅ Map backend fields → frontend formData
        setFormData({
          brand_name: data?.brandName || "",
          industry: data?.industry_id || "",
          number_of_employees: data?.numberOfEmployees || "",
          phone_number: data?.phone?.number || "",
          country_code: data?.phone?.countryCode || "",
          company_address: data?.city || "",
          aboutCompany: data?.aboutCompany || "",
          city: data?.companyAddress || "",
          region,
          Country: country,
          latitude: data?.latitude || "",
          longitude: data?.longitude || "",
        });

        // ✅ Set Google Map URL if lat/lon exist
        if (data?.latitude && data?.longitude) {
          setMapUrl(
            `https://www.google.com/maps?q=${data.latitude},${data.longitude}&z=15&output=embed`
          );
        }

        // ✅ Set logo preview
        if (data?.logo) {
          setPreview(`${API_IMAGE_URL}${data.logo}`);
        }

        // ✅ Set career detail
        if (data?.careerDetail) {
          setCareerDetail(data.careerDetail);
        }
      } else {
        toast.error("Failed to fetch company details");
      }
    } catch (error) {
      console.error("GetCompanyDetails Error:", error);
      toast.error("Error fetching company details");
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  // const handleCreateRecruiterProfile = async () => {
  //   if (!validateRecruiterForm()) return;

  //   setLoading(true);

  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.post(
  //       `${API_BASE_URL}company/profile`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       const { userDetails } = response.data;
  //       localStorage.setItem("user", JSON.stringify(userDetails));
  //       localStorage.setItem("user_id", userDetails._id);
  //       localStorage.setItem("user_email", userDetails.email);
  //       localStorage.setItem("user_role", userDetails.role);
  //       localStorage.setItem("first_name", userDetails.first_name);
  //       localStorage.setItem("last_name", userDetails.last_name);
  //       localStorage.setItem("is_completed", userDetails?.is_completed);
  //       fetchCompanyDetails();
  //       toast.success(" Profile Update Successfully!");
  //       // // Navigate or reset form
  //       // navigate("/employer-dashboard");
  //       setActiveTab("menu2");
  //     } else {
  //       toast.error(response.data?.message || "Failed to profile Update");
  //     }
  //   } catch (error) {
  //     console.error("profile Update  error:", error);
  //     if (Array.isArray(error.response?.data?.errors)) {
  //       error.response.data.errors.forEach((errMsg) => toast.error(errMsg));
  //     } else {
  //       toast.error(
  //         error.response?.data?.message ||
  //           "profile Update failed. Please try again."
  //       );
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleCreateRecruiterProfile = async () => {
    if (!validateRecruiterForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // ✅ Swap `city` and `company_address` before sending
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
        const { userDetails } = response.data;
        localStorage.setItem("user", JSON.stringify(userDetails));
        localStorage.setItem("user_id", userDetails._id);
        localStorage.setItem("user_email", userDetails.email);
        localStorage.setItem("user_role", userDetails.role);
        localStorage.setItem("first_name", userDetails.first_name);
        localStorage.setItem("last_name", userDetails.last_name);
        localStorage.setItem("is_completed", userDetails?.is_completed);
        fetchCompanyDetails();
        toast.success("Profile Updated Successfully!");
        setActiveTab("menu2");
      } else {
        toast.error(response.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      if (Array.isArray(error.response?.data?.errors)) {
        error.response.data.errors.forEach((errMsg) => toast.error(errMsg));
      } else {
        toast.error(
          error.response?.data?.message ||
            "Profile update failed. Please try again."
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
  const handleSubmitMultipleImage = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.info("No new images to upload");
      return;
    }

    try {
      setIsUploading(true); // start loader

      const user = JSON.parse(localStorage.getItem("user"));
      const companyId = user?.companyId;
      const token = localStorage.getItem("token");

      const formData = new FormData();
      images.forEach((img) => formData.append("photos", img.file));
      formData.append("companyId", companyId);

      const res = await axios.post(
        `${API_BASE_URL}updateCompanyPhotos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        fetchCompanyDetails();
        toast.success("Photos uploaded successfully!");
        setImages([]); // clear newly selected
        setActiveTab("menu4");
      } else {
        toast.error(res.data.message || "Failed to upload photos");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false); // stop loader
    }
  };

  // const handleSubmitMultipleImage = async (e) => {
  //   e.preventDefault();
  //   if (images.length === 0) {
  //     toast.info("No new images to upload");
  //     return;
  //   }

  //   try {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     const companyId = user?.companyId;
  //     const token = localStorage.getItem("token");

  //     const formData = new FormData();
  //     images.forEach((img) => formData.append("photos", img.file));
  //     formData.append("companyId", companyId);

  //     const res = await axios.post(
  //       `${API_BASE_URL}updateCompanyPhotos`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (res.data.success) {
  //       fetchCompanyDetails();

  //       toast.success("Photos uploaded successfully!");
  //       // const photos = res?.data?.photos || [];
  //       // setExistingPhotos(
  //       //   photos?.map((p) => ({
  //       //     id: p._id,
  //       //     preview: `${API_IMAGE_URL}${p.url}`,
  //       //   }))
  //       // );
  //       setImages([]); // clear newly selected
  //     } else {
  //       toast.error(res.data.message || "Failed to upload photos");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Upload failed");
  //   }
  // };

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
  // Handle video selection
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);

    const newVideos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setVideos((prev) => [...prev, ...newVideos]);
  };

  // ✅ Remove selected video (not uploaded yet)
  const handleRemoveVideo = (id, isExisting = false) => {
    if (isExisting) {
      const deleteVideo = async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.post(
            `${API_BASE_URL}deleteCompanyVideo/${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setExistingVideos((prev) => prev.filter((vid) => vid.id !== id));
          fetchCompanyDetails();
          toast.success("Video deleted successfully!");
        } catch (err) {
          console.error("Delete video error:", err);
          toast.error("Failed to delete video");
        }
      };
      deleteVideo();
    } else {
      setVideos((prev) => prev.filter((vid) => vid.id !== id));
    }
  };
  const handleRemoveExistingVideo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const companyId = user?.companyId;

      await axios.post(
        `${API_BASE_URL}deleteCompanyVideo`,
        { companyId, videoId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExistingVideos((prev) => prev.filter((v) => v.id !== id));
      toast.success("Video deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete video");
    }
  };

  // Submit videos
  // const handleSubmitVideo = async (e) => {
  //   e.preventDefault();
  //   if (videos.length === 0) {
  //     toast.info("No new videos to upload");
  //     return;
  //   }

  //   try {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     const companyId = user?.companyId;
  //     const token = localStorage.getItem("token");

  //     const formData = new FormData();
  //     videos.forEach((vid) => formData.append("videos", vid.file));
  //     formData.append("companyId", companyId);

  //     const res = await axios.post(
  //       `${API_BASE_URL}updateCompanyVideos`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (res.data.success) {
  //       fetchCompanyDetails();
  //       toast.success("Videos uploaded successfully!");
  //       // const vids = res?.data?.videos || [];
  //       // setExistingVideos(
  //       //   vids.map((v) => ({
  //       //     id: v._id,
  //       //     preview: `${API_IMAGE_URL}${v.url}`,
  //       //   }))
  //       // );
  //       setVideos([]); // clear selected videos
  //     } else {
  //       toast.error(res.data.message || "Failed to upload videos");
  //     }
  //   } catch (err) {
  //     console.error("Upload video error:", err);
  //     toast.error("Upload failed");
  //   }
  // };
  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    if (videos.length === 0) {
      toast.info("No new videos to upload");
      return;
    }

    try {
      setIsUploadingVideos(true); // start loader

      const user = JSON.parse(localStorage.getItem("user"));
      const companyId = user?.companyId;
      const token = localStorage.getItem("token");

      const formData = new FormData();
      videos.forEach((vid) => formData.append("videos", vid.file));
      formData.append("companyId", companyId);

      const res = await axios.post(
        `${API_BASE_URL}updateCompanyVideos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        fetchCompanyDetails();
        toast.success("Videos uploaded successfully!");
        setVideos([]); // clear selected videos
        setActiveTab("menu5");
      } else {
        toast.error(res.data.message || "Failed to upload videos");
      }
    } catch (err) {
      console.error("Upload video error:", err);
      toast.error("Upload failed");
    } finally {
      setIsUploadingVideos(false); // stop loader
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file)); // show selected image immediately
    setFileName(file.name);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const companyId = user?.companyId;
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("logo", file);
      formData.append("companyId", companyId);

      const res = await axios.post(
        `${API_BASE_URL}updateCompanyLogo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const logoUrl = `${API_IMAGE_URL}${res.data.logo}`;
        console.log(logoUrl);
        updateProfileImage(logoUrl);
        setPreview(logoUrl);
        fetchCompanyDetails();
        // toast.success("Logo updated successfully!");
        toast.success("Logo updated successfully!", {
          containerId: "verify-email-toast",
          autoClose: 2000,
        });
        // Update preview with server image if returned
        // if (res.data.logo) setPreview(`${API_IMAGE_URL}${res.data.logo}`);
      } else {
        toast.error(res.data.message || "Failed to upload logo");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload logo");
    }
  };

    const handleFileChangeCoverImage = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setPreview1(URL.createObjectURL(file)); // show selected image immediately
      setFileName1(file.name);

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const companyId = user?.companyId;
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("coverPhoto", file);
        formData.append("companyId", companyId);

        const res = await axios.post(
          `${API_BASE_URL}updateCompanyCoverPhoto
  `,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          fetchCompanyDetails();
          toast.success("Cover Photo updated successfully!", {
            containerId: "verify-email-toast",
            autoClose: 2000,
          });
        } else {
          toast.error(res.data.message || "Failed to upload Cover Photo");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to upload Cover Photo");
      }
    };
  const [images, setImages] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]); // photos from API
  // Handle file selection
  const handleFileChangeMultiple = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9), // unique temporary id
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  // Remove image
  const handleRemove = (id, isExisting = false) => {
    if (isExisting) {
      const deletePhoto = async () => {
        try {
          const token = localStorage.getItem("token");

          // ✅ Call API using photoId in URL
          await axios.post(
            `${API_BASE_URL}deleteCompanyPhoto/${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // ✅ Remove from local state after success
          setExistingPhotos((prev) => prev.filter((img) => img._id !== id));
          fetchCompanyDetails();
          toast.success("Photo deleted successfully!");
        } catch (err) {
          console.error("Delete photo error:", err);
          toast.error("Failed to delete photo");
        }
      };

      deletePhoto();
    } else {
      // ✅ For newly added (not yet uploaded) images
      setImages((prev) => prev.filter((img) => img.id !== id));
    }
  };

  // Submit (demo: just logs)
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Submitting images:", images);

  //   // Example: send with FormData
  //   const formData = new FormData();
  //   images.forEach((img) => formData.append("officePhotos", img.file));

  //   // axios.post('/api/upload', formData)
  // };
  const handleUpdateCareerDetail = async () => {
    if (!careerDetail.trim()) {
      toast.error("Please enter career details");
      return;
    }

    setIsCareerUpdating(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}updateCareerDetail`,
        { careerDetail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        fetchCompanyDetails();
        toast.success("Career detail updated successfully!");
        setActiveTab("menu3");
      } else {
        toast.error(response.data.message || "Failed to update career detail");
      }
    } catch (error) {
      console.error("Update Career Detail error:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsCareerUpdating(false);
    }
  };
  const handleChangeOfSocial = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form to API
  const handleSubmitOfSocial = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();

    try {
      // ✅ Adjust keys to match API parameters
      const payload = {
        officialWebsite: socialLinks.website,
        linkedin: socialLinks.linkedin,
        facebook: socialLinks.facebook,
        twitter: socialLinks.twitter,
        instagram: socialLinks.instagram,
      };

      const response = await axios.post(
        `${API_BASE_URL}updateCompanyLinks`, // ✅ Ensure no newline or missing slash
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);
      fetchCompanyDetails();
      toast.success("Social links submitted successfully!");
      navigate("/employer-dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit social links");
    }
  };

  return (
    <>
      <ToastContainer
        containerId="verify-email-toast"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Employer Profile</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">Home </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Employer Profile
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area">
            <div className="profile-form-content">
              {/* <h3>Employer Profile</h3> */}
              <div className="company-profile-management-info">
                {/* Nav Tabs */}
                <div className="company-profile-management-tab">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "menu1" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("menu1")}
                        data-bs-toggle="tab"
                      >
                        Company Profile
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "menu2" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("menu2")}
                      >
                        Career Details
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "menu3" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("menu3")}
                      >
                        Office photos
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "menu4" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("menu4")}
                      >
                        Office videos
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={`nav-link ${
                          activeTab === "menu5" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("menu5")}
                      >
                        Links
                      </a>
                    </li>
                  </ul>
                </div>
                {/* Tab Panes */}
                <div className="company-profile-management-input-form">
                  <div className="tab-content">
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu1" ? "show active" : ""
                      }`}
                      id="menu1"
                      role="tabpanel"
                    >
                      <div className="profile-form">
                        <form>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Company name</label>
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
                                <label>Upload company Logo</label>
                                <div className="upload-company-info-area">
                                  <div className="upload-company-img-preview">
                                    <img
                                      crossorigin="anonymous"
                                      src={preview}
                                      className="main-logo"
                                      alt="Image Preview"
                                    />
                                  </div>
                                  <div className="upload-company-input">
                                    <input
                                      type="file"
                                      id="imageInput"
                                      accept="image/*"
                                      onChange={handleFileChange}
                                      style={{ display: "none" }} // keep hidden if using custom button
                                    />
                                  </div>
                                  <div className="upload-company-file-name">
                                    <span className="file-name">
                                      {fileName}
                                    </span>
                                  </div>
                                  <div className="upload-company-file-btn">
                                    <label
                                      htmlFor="imageInput"
                                      className="custom-upload default-btn btn"
                                    >
                                      Choose Img
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Upload Cover Photo</label>
                                <div className="upload-company-info-area">
                                  <div className="upload-company-img-preview">
                                    <img
                                      crossOrigin="anonymous"
                                      src={preview1}
                                      className="main-logo"
                                      alt="Image Preview"
                                    />
                                  </div>
                                  <div className="upload-company-input">
                                    <input
                                      type="file"
                                      id="imageInput1"
                                      accept="image/*"
                                      onChange={handleFileChangeCoverImage}
                                      style={{ display: "none" }} // keep hidden if using custom button
                                    />
                                  </div>
                                  <div className="upload-company-file-name">
                                    <span className="file-name">
                                      {fileName1}
                                    </span>
                                  </div>
                                  <div className="upload-company-file-btn">
                                    <label
                                      htmlFor="imageInput1"
                                      className="custom-upload default-btn btn"
                                    >
                                      Choose Img
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
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
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Number of Employees</label>
                                <select
                                  className="form-select form-control"
                                  name="number_of_employees"
                                  value={formData.number_of_employees}
                                  onChange={handleChange}
                                >
                                  <option value="">
                                    Select Number Of Employees
                                  </option>
                                  <option value="1-15">1-15</option>
                                  <option value="16-50">16-50</option>
                                  <option value="51-100">51-100</option>
                                  <option value="100-150">100-150</option>
                                </select>
                              </div>
                            </div>
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
                                    <option
                                      key={country._id}
                                      value={country.phonecode}
                                    >
                                      {country.emoji} +{country.phonecode}{" "}
                                      {country.name}
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
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
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
                                {loading && (
                                  <div className="suggestion-box">
                                    Searching...
                                  </div>
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
                                        {city.name}, {city.state_name},{" "}
                                        {city.country_name}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>

                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>State</label> (auto-generated from
                                location, or edit manually):
                                <input
                                  className="form-control"
                                  type="text"
                                  name="region"
                                  value={formData.region}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Country</label> (auto-generated from
                                location, or edit manually):
                                <input
                                  className="form-control"
                                  type="text"
                                  name="Country"
                                  value={formData.Country}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label> Street Address</label>
                                <textarea
                                  className="form-control"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleChange}
                                  rows={3}
                                  placeholder="Enter street address"
                                ></textarea>
                              </div>
                            </div>
                            {/* <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>About the company</label>
                                <textarea
                                  className="form-control"
                                  placeholder="About the company here.."
                                  name="aboutCompany"
                                  value={formData.aboutCompany}
                                  onChange={handleChange}
                                  rows={4}
                                />
                              </div>
                            </div> */}
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>About the Company</label>
                                <CKEditor
                                  editor={ClassicEditor}
                                  data={formData.aboutCompany}
                                  onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setFormData((prev) => ({
                                      ...prev,
                                      aboutCompany: data,
                                    }));
                                  }}
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
                        </form>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu2" ? "show active" : ""
                      }`}
                      id="menu2"
                      role="tabpanel"
                    >
                      <div className="profile-form">
                        {/*                                <h4>Career Details</h4> */}
                        <form>
                          <div className="row">
                            {/* <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Career Details</label>
                                <textarea
                                  className="form-control"
                                  placeholder="Write career details here..."
                                  rows={7}
                                  value={careerDetail}
                                  onChange={(e) =>
                                    setCareerDetail(e.target.value)
                                  }
                                />
                              </div>
                            </div> */}
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Career Details</label>
                                <CKEditor
                                  editor={ClassicEditor}
                                  data={careerDetail}
                                  onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setCareerDetail(data);
                                  }}
                                />
                              </div>
                            </div>

                            <div className="employer-personal-info-btn">
                              <button
                                className="default-btn btn"
                                onClick={handleUpdateCareerDetail}
                                disabled={isCareerUpdating}
                              >
                                {isCareerUpdating
                                  ? "Updating..."
                                  : "Update Career Detail"}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu3" ? "show active" : ""
                      }`}
                      id="menu3"
                      role="tabpanel"
                    >
                      <div className="profile-form">
                        <form>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <div className="upload-company-info-area">
                                  <div className="upload-company-input">
                                    <input
                                      type="file"
                                      id="officePhotos"
                                      accept="image/*"
                                      multiple
                                      onChange={handleFileChangeMultiple}
                                      style={{ display: "none" }}
                                    />
                                  </div>
                                  <div className="upload-company-file-name">
                                    <span className="file-name">
                                      {images.length > 0
                                        ? `${images.length} file(s) selected`
                                        : "No file selected"}
                                    </span>
                                  </div>
                                  <div className="upload-company-file-btn">
                                    <label
                                      htmlFor="officePhotos"
                                      className="custom-upload default-btn btn"
                                    >
                                      Choose Images
                                    </label>
                                  </div>
                                </div>

                                <div className="office-photos-upload-info">
                                  {/* <input
                                    type="file"
                                    id="officePhotos"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChangeMultiple}
                                    style={{ display: "none" }}
                                  />
                                  <label
                                    htmlFor="officePhotos"
                                    className="Custom-Upload default-btn btn"
                                  >
                                    Choose Images
                                  </label> */}
                                  <div className="preview-container mt-3 d-flex flex-wrap">
                                    {images.map((img) => (
                                      <div
                                        key={img.id}
                                        style={{
                                          position: "relative",
                                          margin: "5px",
                                        }}
                                      >
                                        <img
                                          crossorigin="anonymous"
                                          src={img.preview}
                                          alt="preview"
                                          width={100}
                                          height={100}
                                          style={{
                                            objectFit: "cover",
                                            borderRadius: "5px",
                                          }}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => handleRemove(img.id)}
                                          style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            color: "#fff",
                                            background: "#0066cc",
                                            borderRadius: "4px",
                                            padding: "0 3px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="employer-personal-info-btn">
                                <button
                                  onClick={handleSubmitMultipleImage}
                                  className="default-btn btn"
                                  disabled={isUploading}
                                >
                                  {isUploading ? "Uploading..." : "Submit"}{" "}
                                </button>
                              </div>

                              {/* Office photos after submit (you can reuse same images state) */}
                              <div className="office-photos-info-area mt-4">
                                {/* <h4>Office photos</h4> */}
                                <div className="preview-container d-flex flex-wrap">
                                  {/* Existing photos */}
                                  {existingPhotos.map((img) => (
                                    <div
                                      key={img.id}
                                      style={{
                                        position: "relative",
                                        margin: "5px",
                                      }}
                                    >
                                      <img
                                        crossorigin="anonymous"
                                        src={img.preview}
                                        alt="existing"
                                        width={100}
                                        height={100}
                                        style={{
                                          objectFit: "cover",
                                          borderRadius: "5px",
                                        }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemove(img.id, true)
                                        }
                                        style={{
                                          position: "absolute",
                                          top: 0,
                                          right: 0,
                                          color: "#fff",
                                          background: "#0066cc",
                                          borderRadius: "4px",
                                          padding: "0 3px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu4" ? "show active" : ""
                      }`}
                      id="menu4"
                      role="tabpanel"
                    >
                      <div className="profile-form">
                        <form>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <div className="upload-company-info-area">
                                  <div className="upload-company-input">
                                    <input
                                      type="file"
                                      id="officeVideos"
                                      accept="video/*"
                                      multiple
                                      onChange={handleVideoChange}
                                      style={{ display: "none" }}
                                    />
                                  </div>
                                  <div className="upload-company-file-name">
                                    <span className="file-name">
                                      {videos.length > 0
                                        ? `${videos.length} file(s) selected`
                                        : "No file selected"}
                                    </span>
                                  </div>
                                  <div className="upload-company-file-btn">
                                    <label
                                      htmlFor="officeVideos"
                                      className="custom-upload default-btn btn"
                                    >
                                      Choose Videos
                                    </label>
                                  </div>
                                </div>
                                <div className="office-video-upload-info">
                                  {/* Preview before submit */}
                                  <div className="preview-container mt-3 d-flex flex-wrap">
                                    {videos.map((vid) => (
                                      <div
                                        key={vid.id}
                                        style={{
                                          position: "relative",
                                          marginRight: "10px",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        <video
                                          crossorigin="anonymous"
                                          src={vid.preview}
                                          width={150}
                                          height={100}
                                          controls
                                          style={{
                                            borderRadius: "5px",
                                            objectFit: "cover",
                                            background: "#000",
                                          }}
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveVideo(vid.id)
                                          }
                                          style={{
                                            top: "2px",
                                            right: "2px",
                                            color: "#fff",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            lineHeight: "14px",
                                            position: "absolute",
                                            background: "#0066cc",
                                            borderRadius: "4px",
                                            padding: "0px 3px 2px 3px",
                                          }}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Submit button */}
                              <div className="employer-personal-info-btn">
                                <button
                                  onClick={handleSubmitVideo}
                                  className="default-btn btn"
                                  disabled={isUploadingVideos} // disable while uploading
                                >
                                  {isUploadingVideos
                                    ? "Uploading..."
                                    : "Submit"}{" "}
                                  {/* show loader */}
                                </button>
                              </div>

                              {/* Display existing videos (after upload) */}
                              <div className="office-photos-info-area mt-4">
                                {/* <h4>Office videos</h4> */}
                                <div className="preview-container d-flex flex-wrap">
                                  {/* {existingVideos.map((vid) => (
                                    <video
                                      crossorigin="anonymous"
                                      key={vid.id}
                                      src={vid.preview}
                                      width={180}
                                      height={120}
                                      controls
                                      style={{
                                        borderRadius: "5px",
                                        marginRight: "10px",
                                        marginBottom: "10px",
                                        background: "#000",
                                      }}
                                    />
                                  ))} */}
                                  {existingVideos.map((vid) => (
                                    <div
                                      key={vid.id}
                                      style={{
                                        position: "relative",
                                        marginRight: "10px",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      <video
                                        crossorigin="anonymous"
                                        src={vid.preview}
                                        width={150}
                                        height={100}
                                        controls
                                        style={{
                                          borderRadius: "5px",
                                          objectFit: "cover",
                                          background: "#000",
                                        }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveVideo(vid.id, true)
                                        }
                                        style={{
                                          top: "2px",
                                          right: "2px",
                                          color: "#fff",
                                          cursor: "pointer",
                                          fontSize: "20px",
                                          lineHeight: "14px",
                                          position: "absolute",
                                          background: "#0066cc",
                                          borderRadius: "4px",
                                          padding: "0px 3px 2px 3px",
                                        }}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu5" ? "show active" : ""
                      }`}
                      id="menu5"
                      role="tabpanel"
                    >
                      <div className="profile-form">
                        {/* <h4>Links</h4> */}
                        <p>Links to official website, LinkedIn, etc</p>
                        <form onSubmit={handleSubmitOfSocial}>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Official website</label>
                                <input
                                  className="form-control"
                                  type="url"
                                  placeholder="www.connectwork.ma"
                                  name="website"
                                  value={socialLinks.website}
                                  onChange={handleChangeOfSocial}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Linkedin</label>
                                <input
                                  className="form-control"
                                  type="url"
                                  placeholder="www.linkedin.com"
                                  name="linkedin"
                                  value={socialLinks.linkedin}
                                  onChange={handleChangeOfSocial}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Facebook</label>
                                <input
                                  className="form-control"
                                  type="url"
                                  placeholder="www.facebook.com"
                                  name="facebook"
                                  value={socialLinks.facebook}
                                  onChange={handleChangeOfSocial}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Twitter</label>
                                <input
                                  className="form-control"
                                  type="url"
                                  placeholder="www.twitter.com"
                                  name="twitter"
                                  value={socialLinks.twitter}
                                  onChange={handleChangeOfSocial}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Instagram</label>
                                <input
                                  className="form-control"
                                  type="url"
                                  placeholder="www.instagram.com"
                                  name="instagram"
                                  value={socialLinks.instagram}
                                  onChange={handleChangeOfSocial}
                                />
                              </div>
                            </div>
                            <div className="employer-personal-info-btn">
                              <button type="submit" className="default-btn btn">
                                Submit
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*End My Profile Area*/}
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

export default EmployerProfile;
