// import axios from "../Services/axios";
import axios from "axios";
import { useTranslation } from "react-i18next";

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
import "./Main.css";
import { useDebounce, SEARCH_DEBOUNCE_MS } from "../hooks/useDebounce";
import {getAuthHeaders, getRequestConfig } from "../utils/apiHeaders";
import {
  MAX_IMAGE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
  validateImageFile,
  filterValidImageFiles,
  bytesToMb,
  isFileWithinSizeLimit,
} from "../utils/fileUploadLimits";

function EmployerProfile() {
  const { t } = useTranslation("global");
  const { updateProfileImage } = useAuth();
  const [careerDetail, setCareerDetail] = useState("");
  const [isCareerUpdating, setIsCareerUpdating] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileName1, setFileName1] = useState("");
  const [preview, setPreview] = useState("assets/images/company/dummy-img.png");
  const [preview1, setPreview1] = useState(
    "assets/images/company/dummy-img.png",
  );
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [isSavingYoutube, setIsSavingYoutube] = useState(false);
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
  const [companyProfile, setCompanyProfile] = useState({
    mainTitle: "",
    subtitle: "",
    description1: "",
    description2: "",
    quote: "",
    mediaType: "image",
    mediaImage: "",
    mediaFile: null,
    videoUrl: "",
  });
  const [reviews, setReviews] = useState([]);
  const [missionVision, setMissionVision] = useState({
    mission: "",
    vision: "",
  });
  const [ceoData, setCeoData] = useState({
    name: "",
    title: "CEO",
    photo: "", // preview / old image url
    photoFile: null, // binary file
    message: "",
    videoUrl: "",
  });
  const [teamMembers, setTeamMembers] = useState([]);
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
  const debouncedCompanyAddress = useDebounce(
    formData.company_address,
    SEARCH_DEBOUNCE_MS,
  );

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

  const addMember = () => {
    setTeamMembers((prev) => [
      ...prev,
      {
        fullName: "",
        position: "",
        photo: "",
        photoFile: null,
        shortText: "",
      },
    ]);
  };
  const removeMember = (index) => {
    const updated = [...teamMembers];
    updated.splice(index, 1);
    setTeamMembers(updated);
  };
  const handleChange2 = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };
  const handleImageUpload2 = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file, t);
    if (!validation.ok) {
      toast.error(validation.message, {
        containerId: "verify-email-toast",
      });

      e.target.value = "";
      return;
    }

    const updated = [...teamMembers];

    // ==========================
    // Instant Preview
    // ==========================
    updated[index].photo = URL.createObjectURL(file);
    updated[index].photoFile = file;

    setTeamMembers([...updated]);

    toast.success(t("profile.photo_uploaded"), {
      containerId: "verify-email-toast",
    });

    // ==========================
    // Upload to Server
    // ==========================
    const uploadedUrl = await uploadImageToServer(file);

    if (uploadedUrl) {
      updated[index].photo = uploadedUrl;
      updated[index].photoFile = null;

      setTeamMembers([...updated]);
    }

    e.target.value = "";
  };
  /* Upload Image */
  // const handleImageUpload2 = async (e, index) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const updated = [...teamMembers];

  //   // instant preview
  //   updated[index].photo = URL.createObjectURL(file);
  //   updated[index].photoFile = file;

  //   setTeamMembers([...updated]);

  //   // upload to server
  //   const uploadedUrl = await uploadImageToServer(file);

  //   if (uploadedUrl) {
  //     updated[index].photo = uploadedUrl; // save server path
  //     updated[index].photoFile = null;

  //     setTeamMembers([...updated]);
  //   }
  // };
  const handleMissionChange = (e) => {
    const { name, value } = e.target;

    setMissionVision((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file, t);
    if (!validation.ok) {
      toast.error(validation.message, {
        containerId: "verify-email-toast",
      });

      e.target.value = "";
      return;
    }

    // ==========================
    // Preview + Save File
    // ==========================
    setCeoData((prev) => ({
      ...prev,
      photo: URL.createObjectURL(file),
      photoFile: file,
    }));

    toast.success(t("profile.photo_uploaded"), {
      containerId: "verify-email-toast",
    });

    e.target.value = "";
  };
  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   setCeoData((prev) => ({
  //     ...prev,
  //     photo: URL.createObjectURL(file), // preview only
  //     photoFile: file, // binary file for API
  //   }));
  // };
  useEffect(() => {
    // Set default location — Noida
    setMapUrl(
      "https://www.google.com/maps?q=28.522404036526275,77.23701088488971&z=15&output=embed",
    );
  }, []);
  const addReview = () => {
    setReviews((prev) => [
      ...prev,
      {
        fullName: "",
        role: "",
        photo: "",
        photoFile: null,
        testimonial: "",
      },
    ]);
  };
  const removeReview = (index) => {
    const updated = [...reviews];
    updated.splice(index, 1);
    setReviews(updated);
  };

  /* Input Change */
  const handleChange1 = (index, field, value) => {
    const updated = [...reviews];
    updated[index][field] = value;
    setReviews(updated);
  };
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;

    setCompanyProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  /* Upload Photo */
  // const handlePhotoUpload = async (e, index) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const updated = [...reviews];

  //   // instant preview
  //   updated[index].photo = URL.createObjectURL(file);
  //   setReviews([...updated]);

  //   // upload image
  //   const uploadedUrl = await uploadImageToServer(file);

  //   if (uploadedUrl) {
  //     updated[index].photo = uploadedUrl; // save server path
  //     setReviews([...updated]);
  //   }
  // };
  const handlePhotoUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file, t);
    if (!validation.ok) {
      toast.error(validation.message, {
        containerId: "verify-email-toast",
      });

      e.target.value = "";
      return;
    }

    const updated = [...reviews];

    // ==========================
    // Instant Preview
    // ==========================
    updated[index].photo = URL.createObjectURL(file);
    setReviews([...updated]);

    toast.success(t("profile.photo_uploaded"), {
      containerId: "verify-email-toast",
    });

    // ==========================
    // Upload to Server
    // ==========================
    const uploadedUrl = await uploadImageToServer(file);

    if (uploadedUrl) {
      updated[index].photo = uploadedUrl;
      setReviews([...updated]);
    }

    e.target.value = "";
  };
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
            (c) => c.name.toLowerCase() !== "western sahara",
          );

          // ✅ 2. Find Morocco (+212)
          const morocco = filtered.find(
            (c) => c.phonecode === "212" || c.name.toLowerCase() === "morocco",
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
  function forceApplyCrossOrigin(editor) {
    const domRoot = editor.editing.view.getDomRoot();

    if (!domRoot) return;

    const imgs = domRoot.querySelectorAll("img");

    imgs.forEach((img) => {
      img.setAttribute("crossorigin", "anonymous");
    });
  }
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
          loading="lazy"
          decoding="async"
        />
        {country.emoji} +{country.phonecode} {country.name}
      </div>
    ),
  }));

  /* Image Upload */
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validation = validateImageFile(file, t);
    if (!validation.ok) {
      toast.error(validation.message, {
        containerId: "verify-email-toast",
      });

      e.target.value = "";
      return;
    }

    // Success
    toast.success(t("profile.image_uploaded"), {
      containerId: "verify-email-toast",
    });

    setCompanyProfile((prev) => ({
      ...prev,
      mediaImage: URL.createObjectURL(file),
      mediaImageFile: file,
    }));
  };
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   // Preview + Binary file store
  //   setCompanyProfile((prev) => ({
  //     ...prev,
  //     mediaImage: URL.createObjectURL(file), // preview image
  //     mediaImageFile: file, // original binary file
  //   }));
  // };
  /* Save API */
  // ==============================
  // FRONTEND (React)
  // Save all data + multiple images as FormData
  // ==============================

  // const handleSubmit1 = async () => {
  //   try {
  //     setLoading(true);

  //     const token = localStorage.getItem("token");

  //     const payload = {
  //       mainTitle: companyProfile.mainTitle,
  //       subtitle: companyProfile.subtitle,
  //       description1: companyProfile.description1,
  //       description2: companyProfile.description2,
  //       quote: companyProfile.quote,
  //       mediaType: companyProfile.mediaType,
  //       mediaImage:
  //         companyProfile.mediaType === "image" ? companyProfile.mediaImage : "",

  //       videoUrl:
  //         companyProfile.mediaType === "video" ? companyProfile.videoUrl : "",

  //       mission: missionVision.mission,
  //       vision: missionVision.vision,

  //       leader_name: ceoData.name,
  //       leader_position: ceoData.title,
  //       leader_message: ceoData.message,
  //       leader_interviewVideo: ceoData.videoUrl,
  //       leader_photo: ceoData.photo,

  //       // IMPORTANT
  //       employeeExperience: JSON.stringify(
  //         reviews.map((item) => ({
  //           fullName: item.fullName,
  //           role: item.role,
  //           testimony: item.testimonial,
  //           photo: item.photo,
  //         })),
  //       ),

  //       team: JSON.stringify(
  //         teamMembers.map((item) => ({
  //           fullName: item.fullName,
  //           post: item.position,
  //           testimonial: item.shortText,
  //           photo: item.photo,
  //         })),
  //       ),
  //     };

  //     const res = await axios.post(
  //       `${API_BASE_URL}updateCompanyPremiumSection`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     console.log(res.data);
  //     alert("Updated Successfully");
  //   } catch (error) {
  //     console.log(error.response?.data || error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handleSubmit1 = async () => {
  //   try {
  //     // ===============================
  //     // Validation
  //     // ===============================

  //     if (!companyProfile.mainTitle.trim()) {
  //       return toast.error(t("profile.enter_main_title"), {
  //         containerId: "verify-email-toast",
  //       });
  //     }

  //     if (!companyProfile.subtitle.trim()) {
  //       return toast.error(t("profile.enter_subtitle"), {
  //         containerId: "verify-email-toast",
  //       });
  //     }

  //     if (!companyProfile.description1.trim()) {
  //       return toast.error(t("profile.enter_description_1"), {
  //         containerId: "verify-email-toast",
  //       });
  //     }

  //     if (!companyProfile.description2.trim()) {
  //       return toast.error(t("profile.enter_description_2"), {
  //         containerId: "verify-email-toast",
  //       });
  //     }

  //     if (!companyProfile.quote.trim()) {
  //       return toast.error(t("profile.enter_quote"), {
  //         containerId: "verify-email-toast",
  //       });
  //     }

  //     if (companyProfile.mediaType === "image" && !companyProfile.mediaImage) {
  //       return toast.error(t("profile.upload_image_required"), {
  //         containerId: "verify-email-toast",
  //       });
  //     }

  //     if (
  //       companyProfile.mediaType === "video" &&
  //       !companyProfile.videoUrl.trim()
  //     ) {
  //       return toast.error(t("profile.enter_video_url"), {
  //         containerId: "verify-email-toast",
  //       });
  //     }

  //     setLoading(true);

  //     const token = localStorage.getItem("token");

  //     const payload = {
  //       mainTitle: companyProfile.mainTitle,
  //       subtitle: companyProfile.subtitle,
  //       description1: companyProfile.description1,
  //       description2: companyProfile.description2,
  //       quote: companyProfile.quote,
  //       mediaType: companyProfile.mediaType,
  //       mediaImage:
  //         companyProfile.mediaType === "image" ? companyProfile.mediaImage : "",
  //       videoUrl:
  //         companyProfile.mediaType === "video" ? companyProfile.videoUrl : "",

  //       mission: missionVision.mission,
  //       vision: missionVision.vision,

  //       leader_name: ceoData.name,
  //       leader_position: ceoData.title,
  //       leader_message: ceoData.message,
  //       leader_interviewVideo: ceoData.videoUrl,
  //       leader_photo: ceoData.photo,

  //       employeeExperience: JSON.stringify(
  //         reviews.map((item) => ({
  //           fullName: item.fullName,
  //           role: item.role,
  //           testimony: item.testimonial,
  //           photo: item.photo,
  //         })),
  //       ),

  //       team: JSON.stringify(
  //         teamMembers.map((item) => ({
  //           fullName: item.fullName,
  //           post: item.position,
  //           testimonial: item.shortText,
  //           photo: item.photo,
  //         })),
  //       ),
  //     };

  //     const res = await axios.post(
  //       `${API_BASE_URL}updateCompanyPremiumSection`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     toast.success(t("profile.updated_successfully"), {
  //       containerId: "verify-email-toast",
  //       autoClose: 3000,
  //     });
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || t("header.something_wrong"), {
  //       containerId: "verify-email-toast",
  //       autoClose: 3000,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  function addCrossOriginToImages(editor) {
    const applyAttribute = () => {
      const view = editor.editing.view;
      const domRoot = view.getDomRoot();

      if (!domRoot) return;

      const images = domRoot.querySelectorAll("img");

      images.forEach((img) => {
        img.setAttribute("crossorigin", "anonymous");
      });
    };

    // when editor ready
    editor.on("ready", () => {
      setTimeout(applyAttribute, 200);
    });

    // when typing/uploading/change
    editor.model.document.on("change:data", () => {
      setTimeout(applyAttribute, 100);
    });

    // when api setData()
    editor.data.on("change", () => {
      setTimeout(applyAttribute, 100);
    });
  }
  const uploadImageToServer = async (file) => {
    const validation = validateImageFile(file, t);
    if (!validation.ok) {
      toast.error(validation.message, {
        containerId: "verify-email-toast",
      });
      return "";
    }

    try {
      const data = new FormData();
      data.append("image", file);

      const res = await axios.post(`${API_BASE_URL}upload/Image`, data, {
        headers: getAuthHeaders({
          "Content-Type": "multipart/form-data",
        }),
      });

      return res.data.url; // ✅ correct
    } catch (error) {
      console.log(error);
      return "";
    }
  };
  const handleSubmit1 = async () => {
    try {
      // ===============================
      // Validation
      // ===============================
      if (!companyProfile.mainTitle.trim()) {
        return toast.error(t("profile.enter_main_title"), {
          containerId: "verify-email-toast",
        });
      }

      if (!companyProfile.subtitle.trim()) {
        return toast.error(t("profile.enter_subtitle"), {
          containerId: "verify-email-toast",
        });
      }

      if (!companyProfile.description1.trim()) {
        return toast.error(t("profile.enter_description_1"), {
          containerId: "verify-email-toast",
        });
      }

      if (!companyProfile.description2.trim()) {
        return toast.error(t("profile.enter_description_2"), {
          containerId: "verify-email-toast",
        });
      }

      if (!companyProfile.quote.trim()) {
        return toast.error(t("profile.enter_quote"), {
          containerId: "verify-email-toast",
        });
      }

      if (companyProfile.mediaType === "image" && !companyProfile.mediaImage) {
        return toast.error(t("profile.upload_image_required"), {
          containerId: "verify-email-toast",
        });
      }

      if (
        companyProfile.mediaType === "video" &&
        !companyProfile.videoUrl.trim()
      ) {
        return toast.error(t("profile.enter_video_url"), {
          containerId: "verify-email-toast",
        });
      }

      setLoading(true);

      const token = localStorage.getItem("token");

      // ===============================
      // Use FormData for Image Upload
      // ===============================
      const formData = new FormData();

      formData.append("mainTitle", companyProfile.mainTitle);
      formData.append("subtitle", companyProfile.subtitle);
      formData.append("description1", companyProfile.description1);
      formData.append("description2", companyProfile.description2);
      formData.append("quote", companyProfile.quote);
      formData.append("mediaType", companyProfile.mediaType);

      // Upload Binary Image
      if (
        companyProfile.mediaType === "image" &&
        companyProfile.mediaImageFile
      ) {
        formData.append("mediaImage", companyProfile.mediaImageFile);
      } else {
        formData.append("mediaImage", companyProfile.mediaImage || "");
      }

      // If video selected
      formData.append(
        "videoUrl",
        companyProfile.mediaType === "video" ? companyProfile.videoUrl : "",
      );

      formData.append("mission", missionVision.mission);
      formData.append("vision", missionVision.vision);

      formData.append("leader_name", ceoData.name);
      formData.append("leader_position", ceoData.title);
      formData.append("leader_message", ceoData.message);
      formData.append("leader_interviewVideo", ceoData.videoUrl);

      // CEO Photo Upload
      if (ceoData.photoFile) {
        formData.append("leader_photo", ceoData.photoFile);
      } else {
        formData.append("leader_photo", ceoData.photo || "");
      }

      // Employee Experience
      formData.append(
        "employeeExperience",
        JSON.stringify(
          reviews.map((item) => ({
            fullName: item.fullName,
            role: item.role,
            testimony: item.testimonial,
            photo: item.photo, // now server path saved
          })),
        ),
      );
      // Team Members
      formData.append(
        "team",
        JSON.stringify(
          teamMembers.map((item) => ({
            fullName: item.fullName,
            post: item.position,
            testimonial: item.shortText,
            photo: item.photo,
          })),
        ),
      );

      const res = await axios.post(
        `${API_BASE_URL}updateCompanyPremiumSection`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(t("profile.updated_successfully"), {
        containerId: "verify-email-toast",
        autoClose: 3000,
      });

      fetchCompanyDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || t("header.something_wrong"), {
        containerId: "verify-email-toast",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const TOAST_OPTIONS = {
    containerId: "verify-email-toast",
    autoClose: 3000,
  };
  const isEditorEmpty1 = (html) => {
    if (!html) return true;

    const text = html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim();

    return text.length === 0;
  };

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
        toast.error(`${field.replace(/_/g, " ")} is required`, TOAST_OPTIONS);
        return false;
      }
    }

    // ✅ CKEditor validation
    if (isEditorEmpty1(formData.aboutCompany)) {
      toast.error(t("profile.about_company_required"), TOAST_OPTIONS);
      return false;
    }

    if (isNaN(formData.phone_number)) {
      toast.error(t("profile.phone_must_be_numeric"), TOAST_OPTIONS);
      return false;
    }

    if (isNaN(formData.country_code)) {
      toast.error(t("profile.country_code_must_be_numeric"), TOAST_OPTIONS);
      return false;
    }

    return true;
  };

  // const fetchCompanyDetails = async () => {
  //   try {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     const companyId = user?.companyId;

  //     if (!companyId) {
  //       toast.error(t("profile.company_id_not_found"));
  //       return;
  //     }

  //     const response = await axios.get(
  //       `${API_BASE_URL}GetCompanyById/${companyId}`,
  //     );

  //     if (response.data.success && response.data.company) {
  //       const data = response.data.company;
  //       const photos = response.data.company.photos || [];
  //       setExistingPhotos(
  //         photos.map((p) => ({
  //           id: p._id,
  //           preview: `${API_IMAGE_URL}${p.url}`, // full URL
  //         })),
  //       );
  //       const vids = response.data.company.videos || [];
  //       setExistingVideos(
  //         vids.map((v) => ({
  //           id: v._id,
  //           preview: `${API_IMAGE_URL}${v.url}`, // full path
  //         })),
  //       );
  //       // Split companyAddress into city, region, country
  //       let city = "",
  //         region = "",
  //         country = "";
  //       if (data.companyAddress) {
  //         const parts = data.city.split(",").map((p) => p.trim());
  //         city = parts[0] || "";
  //         region = parts[1] || "";
  //         country = parts[2] || "";
  //       }
  //       if (data.logo) {
  //         setPreview(`${API_IMAGE_URL}${data.logo}`);
  //       }
  //       if (data?.links) {
  //         setSocialLinks({
  //           website: data.links.officialWebsite || "",
  //           linkedin: data.links.linkedin || "",
  //           facebook: data.links.facebook || "",
  //           twitter: data.links.twitter || "",
  //           instagram: data.links.instagram || "",
  //         });
  //       }
  //       if (data.coverPhoto) {
  //         setPreview1(`${API_IMAGE_URL}${data.coverPhoto}`);
  //       } else {
  //         setPreview("assets/images/company/dummy-img.png");
  //       }
  //       // ✅ Map backend fields → frontend formData
  //       setFormData({
  //         brand_name: data?.brandName || "",
  //         industry: data?.industry_id || "",
  //         number_of_employees: data?.numberOfEmployees || "",
  //         phone_number: data?.phone?.number || "",
  //         country_code: data?.phone?.countryCode || "",
  //         company_address: data?.city || "",
  //         aboutCompany: data?.aboutCompany || "",
  //         city: data?.companyAddress || "",
  //         region,
  //         Country: country,
  //         latitude: data?.latitude || "",
  //         longitude: data?.longitude || "",
  //       });

  //       // ✅ Set Google Map URL if lat/lon exist
  //       if (data?.latitude && data?.longitude) {
  //         setMapUrl(
  //           `https://www.google.com/maps?q=${data.latitude},${data.longitude}&z=15&output=embed`,
  //         );
  //       }

  //       // ✅ Set logo preview
  //       if (data?.logo) {
  //         setPreview(`${API_IMAGE_URL}${data.logo}`);
  //       }

  //       // ✅ Set career detail
  //       if (data?.careerDetail) {
  //         setCareerDetail(data.careerDetail);
  //       }
  //     } else {
  //       toast.error("Failed to fetch company details");
  //     }
  //   } catch (error) {
  //     console.error("GetCompanyDetails Error:", error);
  //     toast.error(t("profile.error_fetch_company"));
  //   }
  // };
  // const fetchCompanyDetails = async () => {
  //   try {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     const companyId = user?.companyId;

  //     if (!companyId) {
  //       toast.error(t("profile.company_id_not_found"));
  //       return;
  //     }

  //     const response = await axios.get(
  //       `${API_BASE_URL}GetCompanyById/${companyId}`,
  //     );

  //     if (response.data.success && response.data.company) {
  //       const data = response.data.company;

  //       // ===============================
  //       // YOUR OLD CODE (NO CHANGE)
  //       // ===============================
  //       const photos = response.data.company.photos || [];
  //       setExistingPhotos(
  //         photos.map((p) => ({
  //           id: p._id,
  //           preview: `${API_IMAGE_URL}${p.url}`,
  //         })),
  //       );

  //       const vids = response.data.company.videos || [];
  //       setExistingVideos(
  //         vids.map((v) => ({
  //           id: v._id,
  //           preview: `${API_IMAGE_URL}${v.url}`,
  //         })),
  //       );

  //       let city = "",
  //         region = "",
  //         country = "";

  //       if (data.companyAddress) {
  //         const parts = data.city.split(",").map((p) => p.trim());
  //         city = parts[0] || "";
  //         region = parts[1] || "";
  //         country = parts[2] || "";
  //       }

  //       if (data.logo) {
  //         setPreview(`${API_IMAGE_URL}${data.logo}`);
  //       }

  //       if (data?.links) {
  //         setSocialLinks({
  //           website: data.links.officialWebsite || "",
  //           linkedin: data.links.linkedin || "",
  //           facebook: data.links.facebook || "",
  //           twitter: data.links.twitter || "",
  //           instagram: data.links.instagram || "",
  //         });
  //       }

  //       if (data.coverPhoto) {
  //         setPreview1(`${API_IMAGE_URL}${data.coverPhoto}`);
  //       } else {
  //         setPreview("assets/images/company/dummy-img.png");
  //       }

  //       setFormData({
  //         brand_name: data?.brandName || "",
  //         industry: data?.industry_id || "",
  //         number_of_employees: data?.numberOfEmployees || "",
  //         phone_number: data?.phone?.number || "",
  //         country_code: data?.phone?.countryCode || "",
  //         company_address: data?.city || "",
  //         aboutCompany: data?.aboutCompany || "",
  //         city: data?.companyAddress || "",
  //         region,
  //         Country: country,
  //         latitude: data?.latitude || "",
  //         longitude: data?.longitude || "",
  //       });

  //       if (data?.latitude && data?.longitude) {
  //         setMapUrl(
  //           `https://www.google.com/maps?q=${data.latitude},${data.longitude}&z=15&output=embed`,
  //         );
  //       }

  //       if (data?.careerDetail) {
  //         setCareerDetail(data.careerDetail);
  //       }

  //       // ==========================================
  //       // ONLY ADD THIS PART FOR aboutPremium
  //       // ==========================================
  //       const premium = data.aboutPremium || {};

  //       // About Section
  //       setCompanyProfile({
  //         mainTitle: premium.mainTitle || "",
  //         subtitle: premium.subtitle || "",
  //         description1: premium.description1 || "",
  //         description2: premium.description2 || "",
  //         quote: premium.quote || "",
  //         mediaType: premium.media?.type || "image",
  //         mediaImage: premium.media?.url
  //           ? `${API_IMAGE_URL}${premium.media.url}`
  //           : "",
  //         videoUrl:
  //           premium.media?.type === "video" ? premium.media?.url || "" : "",
  //       });

  //       // Mission Vision
  //       setMissionVision({
  //         mission: premium.mission || "",
  //         vision: premium.vision || "",
  //       });

  //       // CEO Data
  //       setCeoData({
  //         name: premium.leader?.name || "",
  //         title: premium.leader?.position || "",
  //         photo: premium.leader?.photo
  //           ? `${API_IMAGE_URL}${premium.leader.photo}`
  //           : "",
  //         message: premium.leader?.message || "",
  //         videoUrl: premium.leader?.interviewVideo || "",
  //       });

  //       // Reviews
  //       setReviews(
  //         (premium.employeeExperience || []).map((item) => ({
  //           fullName: item.fullName || "",
  //           role: item.role || "",
  //           photo: item.photo?.startsWith("blob:")
  //             ? item.photo
  //             : `${API_IMAGE_URL}${item.photo}`,
  //           testimonial: item.testimony || "",
  //         })),
  //       );

  //       // Team Members
  //       setTeamMembers(
  //         (premium.team || []).map((item) => ({
  //           fullName: item.fullName || "",
  //           position: item.post || "",
  //           photo: item.photo?.startsWith("blob:")
  //             ? item.photo
  //             : `${API_IMAGE_URL}${item.photo}`,
  //           shortText: item.testimonial || "",
  //         })),
  //       );
  //     } else {
  //       toast.error("Failed to fetch company details");
  //     }
  //   } catch (error) {
  //     console.error("GetCompanyDetails Error:", error);
  //     toast.error(t("profile.error_fetch_company"));
  //   }
  // };
  const fetchCompanyDetails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const companyId = user?.companyId;

      if (!companyId) {
        toast.error(t("profile.company_id_not_found"));
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}GetCompanyById/${companyId}`,
      );

      if (response.data.success && response.data.company) {
        const data = response.data.company;

        // ===============================
        // PHOTOS
        // ===============================
        const photos = data.photos || [];
        setExistingPhotos(
          photos.map((p) => ({
            id: p._id,
            preview: `${API_IMAGE_URL}${p.url}`,
          })),
        );

        // ===============================
        // VIDEOS (FIXED)
        // ===============================
        // ADD inside fetchCompanyDetails()
        // because your UI uses youtubeVideos state, NOT existingVideos

        const vids = data.videos || [];

        setYoutubeVideos(
          vids.map((v) => {
            const url = v.url || "";
            let videoId = "";

            // Standard watch URL
            if (url.includes("youtube.com/watch?v=")) {
              videoId = url.split("v=")[1]?.split("&")[0];
            }

            // Short URL
            else if (url.includes("youtu.be/")) {
              videoId = url.split("youtu.be/")[1]?.split("?")[0];
            }

            // Shorts URL
            else if (url.includes("youtube.com/shorts/")) {
              videoId = url.split("shorts/")[1]?.split("?")[0];
            }

            return {
              id: v._id,
              url: url,
              thumbnail: videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : "https://via.placeholder.com/400x250?text=Video",
            };
          }),
        );

        // ===============================
        // OLD CODE CONTINUE SAME
        // ===============================
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
        }

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

        if (data?.latitude && data?.longitude) {
          setMapUrl(
            `https://www.google.com/maps?q=${data.latitude},${data.longitude}&z=15&output=embed`,
          );
        }

        if (data?.careerDetail) {
          setCareerDetail(data.careerDetail);
        }

        // ===============================
        // ABOUT PREMIUM SAME
        // ===============================
        const premium = data.aboutPremium || {};

        setCompanyProfile({
          mainTitle: premium.mainTitle || "",
          subtitle: premium.subtitle || "",
          description1: premium.description1 || "",
          description2: premium.description2 || "",
          quote: premium.quote || "",
          mediaType: premium.media?.type || "image",
          mediaImage:
            premium.media?.type === "image" && premium.media?.url
              ? `${API_IMAGE_URL}${premium.media.url}`
              : "",

          mediaImageFile: null,

          videoUrl:
            premium.media?.type === "video" ? premium.media?.url || "" : "",
        });

        setMissionVision({
          mission: premium.mission || "",
          vision: premium.vision || "",
        });

        setCeoData({
          name: premium.leader?.name || "",
          title: premium.leader?.position || "",
          photo: premium.leader?.photo
            ? `${API_IMAGE_URL}${premium.leader.photo}`
            : "",
          message: premium.leader?.message || "",
          videoUrl: premium.leader?.interviewVideo || "",
        });

        setReviews(
          (premium.employeeExperience || []).map((item) => ({
            fullName: item.fullName || "",
            role: item.role || "",
            photo: item.photo,
            testimonial: item.testimony || "",
          })),
        );

        setTeamMembers(
          (premium.team || []).map((item) => ({
            fullName: item.fullName || "",
            position: item.post || "",
            photo: item.photo,
            shortText: item.testimonial,
          })),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(t("profile.error_fetch_company"));
    }
  };
  useEffect(() => {
    fetchCompanyDetails();
  }, []);

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
        },
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
        toast.success(t("profile.profile_updated_success"), {
          containerId: "verify-email-toast",
          autoClose: 3000,
        });
        setActiveTab("menu2");
      } else {
        toast.error(response.data?.message || t("profile.failed_update_profile"));
      }
    } catch (error) {
      console.error("Profile update error:", error);
      if (Array.isArray(error.response?.data?.errors)) {
        error.response.data.errors.forEach((errMsg) => toast.error(errMsg));
      } else {
        toast.error(
          error.response?.data?.message ||
            t("profile.profile_update_failed"),
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const handleCEOChange = (e) => {
    const { name, value } = e.target;

    setCeoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const MAX_IMAGES = 5; // max images allowed per upload
  const MAX_IMAGE_SIZE_MB = bytesToMb(MAX_IMAGE_SIZE_BYTES);
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  const handleSubmitMultipleImage = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error(t("profile.no_new_images"), {
        containerId: "verify-email-toast",
      });
      return;
    }

    // ✅ Frontend validation
    if (images.length > MAX_IMAGES) {
      toast.error(t("profile.max_images_upload", { max: MAX_IMAGES }), {
        containerId: "verify-email-toast",
      });
      return;
    }

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!ALLOWED_TYPES.includes(img.file.type)) {
        toast.error(t("profile.invalid_file_type", { name: img.file.name }), {
          containerId: "verify-email-toast",
        });
        return;
      }
      if (!isFileWithinSizeLimit(img.file, MAX_IMAGE_SIZE_BYTES)) {
        toast.error(t("profile.file_too_large_named", { name: img.file.name, max: MAX_IMAGE_SIZE_MB }), {
          containerId: "verify-email-toast",
        });
        return;
      }
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
        },
      );

      if (res.data.success) {
        fetchCompanyDetails();
        toast.success(t("profile.photos_uploaded"), {
          containerId: "verify-email-toast",
        });
        setImages([]); // clear newly selected
        setActiveTab("menu4");
      } else {
        toast.error(res.data.message || t("profile.failed_upload_photos"), {
          containerId: "verify-email-toast",
        });
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 413) {
        toast.error(t("profile.files_too_large_upload"), {
          containerId: "verify-email-toast",
        });
      } else {
        toast.error(t("profile.upload_failed_large_file"), {
          containerId: "verify-email-toast",
        });
      }
    } finally {
      setIsUploading(false); // stop loader
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/recruiter/profile",
        formData,
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
    e.target.value = "";

    if (!files.length) return;

    const validVideos = [];

    for (const file of files) {
      if (!file.type?.startsWith("video/")) {
        toast.error(t("profile.invalid_file_type", { name: file.name }), {
          containerId: "verify-email-toast",
        });
        continue;
      }

      if (!isFileWithinSizeLimit(file, MAX_VIDEO_SIZE_BYTES)) {
        toast.error(
          t("profile.file_too_large_named", {
            name: file.name,
            max: MAX_VIDEO_SIZE_MB,
          }),
          { containerId: "verify-email-toast" },
        );
        continue;
      }

      validVideos.push(file);
    }

    if (!validVideos.length) return;

    const newVideos = validVideos.map((file) => ({
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
            getRequestConfig(),
          );

          setExistingVideos((prev) => prev.filter((vid) => vid.id !== id));
          fetchCompanyDetails();
          toast.success(t("profile.video_deleted"), {
            containerId: "verify-email-toast",
          });
        } catch (err) {
          console.error("Delete video error:", err);
          toast.error(t("profile.failed_delete_video"), {
            containerId: "verify-email-toast",
          });
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
        getRequestConfig(),
      );

      setExistingVideos((prev) => prev.filter((v) => v.id !== id));
      toast.success(t("profile.video_deleted"));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(t("profile.failed_delete_video"));
    }
  };

  const MAX_VIDEOS = 2; // max videos per upload
  const MAX_VIDEO_SIZE_MB = bytesToMb(MAX_VIDEO_SIZE_BYTES);

  const handleSubmitVideo = async (e) => {
    e.preventDefault();

    if (videos.length === 0) {
      toast.error(t("profile.no_new_videos"), {
        containerId: "verify-email-toast",
      });
      return;
    }

    // ✅ Frontend validation for number of videos
    if (videos.length > MAX_VIDEOS) {
      toast.error(t("profile.max_videos_upload", { max: MAX_VIDEOS }), {
        containerId: "verify-email-toast",
      });
      return;
    }

    // ✅ Frontend validation for file size
    for (let i = 0; i < videos.length; i++) {
      const vid = videos[i];
      if (!isFileWithinSizeLimit(vid.file, MAX_VIDEO_SIZE_BYTES)) {
        toast.error(
          t("profile.file_too_large_named", {
            name: vid.file.name,
            max: MAX_VIDEO_SIZE_MB,
          }),
          { containerId: "verify-email-toast" },
        );
        return;
      }
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
        },
      );

      if (res.data.success) {
        fetchCompanyDetails();
        toast.success(t("profile.videos_uploaded"), {
          containerId: "verify-email-toast",
        });
        setVideos([]); // clear selected videos
        setActiveTab("menu5");
      } else {
        toast.error(res.data.message || t("profile.failed_upload_videos"), {
          containerId: "verify-email-toast",
        });
      }
    } catch (err) {
      console.error("Upload video error:", err);

      if (err.response?.status === 413) {
        toast.error(t("profile.files_too_large_upload"), {
          containerId: "verify-email-toast",
        });
      } else {
        toast.error(t("profile.upload_failed_large_file"), {
          containerId: "verify-email-toast",
        });
      }
    } finally {
      setIsUploadingVideos(false); // stop loader
    }
  };

  const getYoutubeId = (url) => {
    const regExp =
      /(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([^&?/]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // ===================== ADD VIDEO =====================
  const handleAddYoutubeVideo = () => {
    if (!youtubeUrl.trim()) {
      toast.error(t("profile.valid_youtube_link"), {
        containerId: "verify-email-toast",
      });
      return;
    }

    const videoId = getYoutubeId(youtubeUrl);

    if (!videoId) {
      toast.error(t("profile.valid_youtube_link"), {
        containerId: "verify-email-toast",
      });
      return;
    }

    const alreadyExists = youtubeVideos.some((item) => item.id === videoId);

    if (alreadyExists) {
      toast.warning(t("profile.video_already_added"), {
        containerId: "verify-email-toast",
      });
      return;
    }

    setYoutubeVideos((prev) => [
      ...prev,
      {
        id: videoId,
        url: youtubeUrl,
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      },
    ]);

    setYoutubeUrl("");
  };

  // ===================== REMOVE VIDEO =====================
  // ADD THIS FUNCTION

  const handleRemoveYoutubeVideo = async (videoId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}deleteCompanyVideo/${videoId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(t("profile.video_deleted"), {
          containerId: "verify-email-toast",
        });

        // remove from UI instantly
        setYoutubeVideos((prev) => prev.filter((item) => item.id !== videoId));

        // optional refresh
        fetchCompanyDetails();
      } else {
        toast.error(res.data.message || t("profile.failed_delete_video"), {
          containerId: "verify-email-toast",
        });
      }
    } catch (error) {
      toast.error(t("header.something_wrong"), {
        containerId: "verify-email-toast",
      });
    }
  };

  // ===================== SAVE VIDEO =====================
  // const handleSaveYoutubeVideos = async () => {
  //   try {
  //     setIsSavingYoutube(true);

  //     const token = localStorage.getItem("token");
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     const companyId = user?.companyId;

  //     const payload = {
  //       companyId,
  //       videos: youtubeVideos,
  //     };

  //     const res = await axios.post(
  //       `${API_BASE_URL}updateCompanyVideos`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     if (res.data.success) {
  //       toast.success(t("profile.videos_saved"), {
  //         containerId: "verify-email-toast",
  //       });

  //       fetchCompanyDetails();
  //     } else {
  //       toast.error(res.data.message || t("profile.failed_save_videos"), {
  //         containerId: "verify-email-toast",
  //       });
  //     }
  //   } catch (error) {
  //     toast.error(t("header.something_wrong"), {
  //       containerId: "verify-email-toast",
  //     });
  //   } finally {
  //     setIsSavingYoutube(false);
  //   }
  // };
  // FIXED VERSION
  // only send NEW added urls, not old existing ones

  const handleSaveYoutubeVideos = async () => {
    try {
      if (!youtubeVideos || youtubeVideos.length === 0) {
        return toast.error(t("profile.add_at_least_one_video"), {
          containerId: "verify-email-toast",
        });
      }

      setIsSavingYoutube(true);

      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const companyId = user?.companyId;

      // send only items without mongodb id = newly added
      const newVideos = youtubeVideos
        .filter((item) => !item.id || item.id.toString().length < 20)
        .map((item) => item.url);

      if (newVideos.length === 0) {
        return toast.error(t("profile.no_new_videos_save"), {
          containerId: "verify-email-toast",
        });
      }

      const payload = {
        companyId,
        videos: newVideos,
      };

      const res = await axios.post(
        `${API_BASE_URL}updateCompanyVideos`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(t("profile.videos_saved"), {
          containerId: "verify-email-toast",
        });

        fetchCompanyDetails();
      } else {
        toast.error(res.data.message || t("profile.failed_save_videos"), {
          containerId: "verify-email-toast",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("header.something_wrong"), {
        containerId: "verify-email-toast",
      });
    } finally {
      setIsSavingYoutube(false);
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file, t);
    if (!validation.ok) {
      toast.error(validation.message, {
        containerId: "verify-email-toast",
      });
      e.target.value = "";
      return;
    }

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
        },
      );

      if (res.data.success) {
        const logoUrl = `${API_IMAGE_URL}${res.data.logo}`;
        console.log(logoUrl);
        updateProfileImage(logoUrl);
        setPreview(logoUrl);
        fetchCompanyDetails();
        // toast.success("Logo updated successfully!");
        toast.success(t("profile.logo_updated"), {
          containerId: "verify-email-toast",
          autoClose: 2000,
        });
        // Update preview with server image if returned
        // if (res.data.logo) setPreview(`${API_IMAGE_URL}${res.data.logo}`);
      } else {
        toast.error(res.data.message || t("profile.failed_upload_logo"), {
          containerId: "verify-email-toast",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(t("profile.failed_upload_logo_large"), {
        containerId: "verify-email-toast",
      });
    }
  };

  const handleFileChangeCoverImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file, t);
    if (!validation.ok) {
      toast.error(validation.message, {
        containerId: "verify-email-toast",
      });
      e.target.value = "";
      return;
    }

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
        },
      );

      if (res.data.success) {
        fetchCompanyDetails();
        toast.success(t("profile.cover_updated"), {
          containerId: "verify-email-toast",
          autoClose: 2000,
        });
      } else {
        toast.error(res.data.message || t("profile.failed_upload_cover"), {
          containerId: "verify-email-toast",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(t("profile.failed_upload_cover_large"), {
        containerId: "verify-email-toast",
      });
    }
  };
  const [images, setImages] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]); // photos from API
  // Handle file selection
  const handleFileChangeMultiple = (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";

    if (!files.length) return;

    const validFiles = filterValidImageFiles(files, t, (message) => {
      toast.error(message, { containerId: "verify-email-toast" });
    });

    if (!validFiles.length) return;

    const newImages = validFiles.map((file) => ({
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
            getRequestConfig(),
          );

          // ✅ Remove from local state after success
          setExistingPhotos((prev) => prev.filter((img) => img._id !== id));
          fetchCompanyDetails();
          toast.success(t("profile.photo_deleted"), {
            containerId: "verify-email-toast",
          });
        } catch (err) {
          console.error("Delete photo error:", err);
          toast.error(t("profile.failed_delete_photo"), {
            containerId: "verify-email-toast",
          });
        }
      };

      deletePhoto();
    } else {
      // ✅ For newly added (not yet uploaded) images
      setImages((prev) => prev.filter((img) => img.id !== id));
    }
  };

  const isEditorEmpty = (html) => {
    const text = html
      .replace(/<[^>]*>/g, "") // remove HTML tags
      .replace(/&nbsp;/g, "") // remove non-breaking spaces
      .trim();

    return text.length === 0;
  };

  const handleUpdateCareerDetail = async () => {
    if (isEditorEmpty(careerDetail)) {
      toast.error(t("profile.enter_career_details"));
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
        },
      );

      if (response.data.success) {
        fetchCompanyDetails();
        toast.success(t("profile.career_detail_updated"), {
          containerId: "verify-email-toast",
          autoClose: 3000,
        });
        setActiveTab("menu3");
      } else {
        toast.error(response.data.message || t("profile.failed_update_career"));
      }
    } catch (error) {
      console.error("Update Career Detail error:", error);
      toast.error(
        error.response?.data?.message ||
          t("auth.something_wrong_try_again"),
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
        },
      );

      console.log("Response:", response.data);
      fetchCompanyDetails();
      toast.success(t("profile.social_links_submitted"), {
        containerId: "verify-email-toast",
        autoClose: 3000,
      });
      navigate("/employer-dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || t("profile.failed_submit_social_links");

      toast.error(errorMessage, {
        containerId: "verify-email-toast",
        autoClose: 3000,
      });
    }
  };
  const uploadAdapter = (loader) => {
    return {
      upload: async () => {
        const file = await loader.file;

        const validation = validateImageFile(file, t);
        if (!validation.ok) {
          toast.error(validation.message, {
            containerId: "verify-email-toast",
          });
          throw new Error(validation.message || "File too large");
        }

        const imageUrl = await uploadImageToServer(file);

        if (!imageUrl) {
          throw new Error("Upload failed");
        }

        return {
          default: `${API_IMAGE_URL}${imageUrl}`,
        };
      },
    };
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
            <h1>{t("profile.company_profile")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/">{t("header.home")} </Link>
              </li>
              <li className="item">
                <Link to="/employer-dashboard">
                  <i className="fa-solid fa-angle-right" /> {t("header.dashboard")}
                </Link>
              </li>
              <li className="item">
                <Link to="/company-profile">
                  <i className="fa-solid fa-angle-right" />
                  Company Profile
                </Link>
              </li>
            </ol>
          </div>
          <div class="employer-dashboard-common-heading  pb-3">
            <h2>{t("profile.company_profile")}</h2>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start My Profile Area*/}
          <div className="my-profile-area-profile-page">
            <div className="profile-form-content-profile-page">
              {/* <h3>{t("profile.employer_profile")}</h3> */}
              <div className="company-profile-management-info">
                {/* Nav Tabs */}
                <div className="company-profile-management-tab-profile-page">
                  <div class="profile-form-content-pp">
                    <h3>{t("profile.employer_profile")}</h3>
                    <ul className="nav nav-tabs" role="tablist">
                      <li className="nav-item" role="presentation">
                        <a
                          className={`nav-link ${
                            activeTab === "menu1" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("menu1")}
                          data-bs-toggle="tab"
                        >
                          Company Detail
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
                      <li className="nav-item" role="presentation">
                        <a
                          className={`nav-link ${
                            activeTab === "menu6" ? "active" : ""
                          }`}
                          onClick={() => setActiveTab("menu6")}
                        >
                          Company Profile
                        </a>
                      </li>
                    </ul>
                  </div>
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
                      <div className="profile-form-profile-page">
                        <div class="profile-form-profile-page card-premium-style">
                          <h4 class="section-title">{t("profile.company_detail")}</h4>
                          <form>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group-profile-page">
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
                                  <label>{t("profile.upload_company_logo")}</label>
                                  <div className="upload-company-info-area">
                                    <div className="upload-company-img-preview">
                                      <img
                                        crossorigin="anonymous"
                                        src={preview}
                                        className="main-logo"
                                        alt={t("profile.image_preview")}
                                        loading="lazy"
                                        decoding="async"
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
                                        {fileName || t("profile.no_file_selected")}
                                      </span>
                                    </div>
                                    <div className="upload-company-file-btn">
                                      <label
                                        htmlFor="imageInput"
                                        className="custom-upload default-btn btn"
                                      >
                                        {t("profile.choose_img")}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>{t("profile.upload_cover_photo")}</label>
                                  <div className="upload-company-info-area">
                                    <div className="upload-company-img-preview">
                                      <img
                                        crossOrigin="anonymous"
                                        src={preview1}
                                        className="main-logo"
                                        alt={t("profile.image_preview")}
                                        loading="lazy"
                                        decoding="async"
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
                                        {fileName1 || t("profile.no_file_selected")}
                                      </span>
                                    </div>
                                    <div className="upload-company-file-btn">
                                      <label
                                        htmlFor="imageInput1"
                                        className="custom-upload default-btn btn"
                                      >
                                        {t("profile.choose_img")}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
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
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                  <label>{t("profile.number_of_employees")}</label>
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
                                  <label>{t("profile.country_code")}</label>
                                  <select
                                    className="form-select form-control"
                                    name="country_code"
                                    value={formData.country_code}
                                    onChange={handleChange}
                                  >
                                    <option value="">
                                      Select Country Code
                                    </option>
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
                                  <label>{t("profile.phone_number")}</label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder={t("profile.phone_number")}
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="form-group">
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
                                  <label>{t("profile.state")}</label> {t("profile.state_auto_hint")}
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
                                  <label>{t("profile.country")}</label> {t("profile.country_auto_hint")}
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
                                  <label>{t("profile.about_company")}</label>
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
                                  // disabled={loading}
                                >
                                  {loading ? t("profile.submitting") : t("profile.submit")}
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu2" ? "show active" : ""
                      }`}
                      id="menu2"
                      role="tabpanel"
                    >
                      <div className="profile-form-profile-page">
                        {/*                                <h4>Career Details</h4> */}
                        <div class="profile-form-profile-page card-premium-style">
                          <h4 class="section-title">{t("profile.career_details")}</h4>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>{t("profile.career_details")}</label>
                                <CKEditor
                                  editor={ClassicEditor}
                                  data={careerDetail}
                                  config={{
                                    toolbar: [
                                      "heading",
                                      "|",
                                      "bold",
                                      "italic",
                                      "link",
                                      "bulletedList",
                                      "numberedList",
                                      "|",
                                      "insertTable",
                                      "uploadImage",
                                      "blockQuote",
                                      "undo",
                                      "redo",
                                    ],

                                    extraPlugins: [
                                      function (editor) {
                                        editor.plugins.get(
                                          "FileRepository",
                                        ).createUploadAdapter = (loader) => {
                                          return uploadAdapter(loader);
                                        };

                                        addCrossOriginToImages(editor);
                                      },
                                    ],
                                  }}
                                  // ✅ MOST IMPORTANT
                                  onReady={(editor) => {
                                    addCrossOriginToImages(editor);

                                    // when api data already loaded
                                    setTimeout(() => {
                                      forceApplyCrossOrigin(editor);
                                    }, 300);
                                  }}
                                  onChange={(event, editor) => {
                                    setCareerDetail(editor.getData());
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
                                  ? t("settings.updating")
                                  : t("profile.update_career_detail")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu3" ? "show active" : ""
                      }`}
                      id="menu3"
                      role="tabpanel"
                    >
                      <div className="profile-form-profile-page">
                        <div class="profile-form-profile-page card-premium-style">
                          <h4 class="section-title">{t("profile.office_photos")}</h4>
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
                                          : t("profile.no_file_selected")}
                                      </span>
                                    </div>
                                    <div className="upload-company-file-btn">
                                      <label
                                        htmlFor="officePhotos"
                                        className="custom-upload default-btn btn"
                                      >
                                        {t("profile.choose_images")}
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
                                    {t("profile.choose_images")}
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
                                            loading="lazy"
                                            decoding="async"
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
                                    {isUploading
                                      ? t("profile.uploading")
                                      : t("profile.submit")}{" "}
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
                                          loading="lazy"
                                          decoding="async"
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
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu4" ? "show active" : ""
                      }`}
                      id="menu4"
                      role="tabpanel"
                    >
                      <div className="profile-form-profile-page">
                        <div className="profile-form-profile-page card-premium-style">
                          <h4 className="section-title">{t("profile.office_videos")}</h4>

                          <div className="col-lg-12">
                            <h4
                              className="border-bottom pb-2 mb-4"
                              style={{ color: "rgb(251, 118, 26)" }}
                            >
                              {t("profile.company_youtube_videos")}
                            </h4>

                            {/* ADD URL */}
                            <div className="card shadow-sm border-0 p-4 mb-4 bg-light">
                              <label className="form-label fw-bold">
                                Ajouter un lien YouTube (Standard ou Shorts)
                              </label>

                              <div className="d-flex gap-2">
                                <input
                                  className="form-control"
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  type="text"
                                  value={youtubeUrl}
                                  onChange={(e) =>
                                    setYoutubeUrl(e.target.value)
                                  }
                                />

                                <button
                                  type="button"
                                  onClick={handleAddYoutubeVideo}
                                  className="btn btn-primary px-4"
                                  style={{
                                    backgroundColor: "rgb(251, 118, 26)",
                                    borderColor: "rgb(251, 118, 26)",
                                  }}
                                >
                                  Ajouter
                                </button>
                              </div>

                              <p className="text-muted mt-2 small">
                                <i className="fa-solid fa-circle-info me-1" />
                                Ces vidéos seront affichées dans la galerie
                              </p>
                            </div>

                            {/* LIST */}
                            <div className="youtube-videos-list row">
                              {youtubeVideos.map((item) => (
                                <div className="col-md-4 mb-4" key={item.id}>
                                  <div className="card h-100 shadow-sm border-0 overflow-hidden position-relative">
                                    <img
                                      className="card-img-top"
                                      alt="YouTube Thumbnail"
                                      src={item.thumbnail}
                                      style={{
                                        height: "150px",
                                        objectFit: "cover",
                                      }}
                                      loading="lazy"
                                      decoding="async"
                                    />

                                    <div className="card-body p-3">
                                      <p className="text-truncate small mb-2 text-muted">
                                        {item.url}
                                      </p>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveYoutubeVideo(item.id)
                                        }
                                        className="btn btn-sm btn-outline-danger w-100"
                                      >
                                        <i className="fa-solid fa-trash me-1" />
                                        Supprimer
                                      </button>
                                    </div>

                                    <div className="position-absolute top-0 end-0 m-2">
                                      <span className="badge bg-danger">
                                        YouTube
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* SAVE */}
                            <div className="mt-4 pt-3 border-top">
                              <button
                                type="button"
                                onClick={handleSaveYoutubeVideos}
                                disabled={isSavingYoutube}
                                className="default-btn btn w-100 py-3 shadow-sm"
                                style={{
                                  backgroundColor: "rgb(251, 118, 26)",
                                  borderColor: "rgb(251, 118, 26)",
                                }}
                              >
                                {isSavingYoutube
                                  ? "Saving..."
                                  : "Enregistrer les vidéos"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu5" ? "show active" : ""
                      }`}
                      id="menu5"
                      role="tabpanel"
                    >
                      <div className="profile-form-profile-page">
                        {/* <h4>Links</h4> */}
                        <div class="profile-form-profile-page card-premium-style">
                          <h4 class="section-title">{t("profile.links")}</h4>
                          <form onSubmit={handleSubmitOfSocial}>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>{t("profile.official_website")}</label>
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
                                  <label>{t("profile.linkedin")}</label>
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
                                  <label>{t("profile.facebook")}</label>
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
                                  <label>{t("profile.twitter")}</label>
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
                                  <label>{t("profile.instagram")}</label>
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
                                <button
                                  type="submit"
                                  className="default-btn btn"
                                >
                                  {t("settings.submit")}
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`tab-pane fade ${
                        activeTab === "menu6" ? "show active" : ""
                      }`}
                      id="menu6"
                      role="tabpanel"
                    >
                      <div className="profile-form-profile-page">
                        {/* <h4>Links</h4> */}
                        <div class="profile-form-profile-page card-premium-style">
                          <h4 class="section-title">{t("profile.company_profile")}</h4>
                          <div className="col-lg-12 mb-4">
                            <h4
                              className="border-bottom pb-2"
                              style={{ color: "rgb(251, 118, 26)" }}
                            >
                              À Propos (Section Premium)
                            </h4>

                            <div className="row mt-3">
                              {/* Main Title */}
                              <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">
                                  Titre principal
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="mainTitle"
                                  value={companyProfile.mainTitle || ""}
                                  onChange={handleCompanyChange}
                                />
                              </div>

                              {/* Subtitle */}
                              <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">
                                  Sous-titre / Accroche
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="subtitle"
                                  value={companyProfile.subtitle || ""}
                                  onChange={handleCompanyChange}
                                />
                              </div>

                              {/* Description 1 */}
                              <div className="col-lg-12 mb-3">
                                <label className="form-label fw-bold">
                                  Description Paragraphe 1
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={3}
                                  name="description1"
                                  value={companyProfile.description1 || ""}
                                  onChange={handleCompanyChange}
                                />
                              </div>

                              {/* Description 2 */}
                              <div className="col-lg-12 mb-3">
                                <label className="form-label fw-bold">
                                  Description Paragraphe 2
                                </label>
                                <textarea
                                  className="form-control"
                                  rows={3}
                                  name="description2"
                                  value={companyProfile.description2 || ""}
                                  onChange={handleCompanyChange}
                                />
                              </div>

                              {/* Quote */}
                              <div className="col-md-12 mb-3">
                                <label className="form-label fw-bold">
                                  Citation (Quote)
                                </label>
                                <input
                                  className="form-control"
                                  placeholder="« Notre vocation est... »"
                                  type="text"
                                  name="quote"
                                  value={companyProfile.quote || ""}
                                  onChange={handleCompanyChange}
                                />
                              </div>

                              {/* Media Type */}
                              <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">
                                  Type de média
                                </label>
                                <select
                                  className="form-select"
                                  name="mediaType"
                                  value={companyProfile.mediaType || "image"}
                                  onChange={handleCompanyChange}
                                >
                                  <option value="image">{t("profile.image")}</option>
                                  <option value="video">{t("profile.video_link")}</option>
                                </select>
                              </div>

                              {/* Image Upload */}
                              {companyProfile.mediaType === "image" && (
                                <div className="col-md-8 mb-3">
                                  <label className="form-label fw-bold">
                                    Image de la section
                                  </label>

                                  <div className="d-flex align-items-center gap-2">
                                    <input
                                      id="aboutImageInput"
                                      className="d-none"
                                      accept="image/*"
                                      type="file"
                                      onChange={handleImageChange}
                                    />

                                    <button
                                      type="button"
                                      className="btn btn-outline-secondary btn-sm"
                                      onClick={() =>
                                        document
                                          .getElementById("aboutImageInput")
                                          .click()
                                      }
                                    >
                                      <i className="fa-solid fa-upload me-1" />
                                      Upload Image
                                    </button>

                                    {/* Preview Small UI */}
                                    {companyProfile.mediaImage && (
                                      <div className="ms-2">
                                        <img
                                          crossOrigin="anonymous"
                                          src={companyProfile.mediaImage}
                                          alt="Preview"
                                          style={{
                                            height: "38px",
                                            width: "60px",
                                            borderRadius: "4px",
                                            objectFit: "cover",
                                            border:
                                              "1px solid rgb(221, 221, 221)",
                                          }}
                                          loading="lazy"
                                          decoding="async"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              {/* Video URL */}
                              {companyProfile.mediaType === "video" && (
                                <div className="col-md-8 mb-3">
                                  <label className="form-label fw-bold">
                                    {t("profile.video_link_youtube")}
                                  </label>
                                  <input
                                    className="form-control"
                                    placeholder="https://www.youtube.com/embed/..."
                                    type="text"
                                    name="videoUrl"
                                    value={companyProfile.videoUrl || ""}
                                    onChange={handleCompanyChange}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-lg-12 mb-4">
                            <div className="card-premium-style">
                              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                                <h4
                                  className="mb-0"
                                  style={{ color: "rgb(251, 118, 26)" }}
                                >
                                  L'expérience de nos collaborateurs
                                </h4>

                                <button
                                  type="button"
                                  className="default-btn btn btn-sm py-2 px-3"
                                  onClick={addReview}
                                >
                                  <i className="fa-solid fa-plus me-1" />
                                  Ajouter un avis
                                </button>
                              </div>

                              {/* Default Empty */}
                              {reviews.length === 0 && (
                                <p className="text-muted text-center py-3 bg-light rounded-3">
                                  Aucun témoignage ajouté pour le moment.
                                </p>
                              )}

                              {/* Reviews */}
                              <div className="reviews-list">
                                {reviews.map((item, index) => (
                                  <div
                                    key={index}
                                    className="review-slot-card shadow-sm border p-4 mb-4 bg-white position-relative"
                                  >
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                      <h6 className="mb-0 text-primary">
                                        Collaborateur #{index + 1}
                                      </h6>

                                      <button
                                        type="button"
                                        className="btn btn-sm btn-link text-danger p-0"
                                        onClick={() => removeReview(index)}
                                      >
                                        <i className="fa-solid fa-trash" />
                                        Supprimer
                                      </button>
                                    </div>

                                    <div className="row">
                                      {/* Name */}
                                      <div className="col-md-6 mb-2">
                                        <label className="small fw-bold">
                                          Nom complet
                                        </label>
                                        <input
                                          className="form-control form-control-sm"
                                          type="text"
                                          value={item.fullName}
                                          onChange={(e) =>
                                            handleChange1(
                                              index,
                                              "fullName",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>

                                      {/* Role */}
                                      <div className="col-md-6 mb-2">
                                        <label className="small fw-bold">
                                          Poste / Rôle
                                        </label>
                                        <input
                                          className="form-control form-control-sm"
                                          type="text"
                                          value={item.role}
                                          onChange={(e) =>
                                            handleChange1(
                                              index,
                                              "role",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>

                                      {/* Photo */}
                                      <div className="col-md-12 mb-2">
                                        <label className="small fw-bold">
                                          Photo du collaborateur
                                        </label>

                                        <div className="d-flex align-items-center gap-2">
                                          <input
                                            id={`photo-${index}`}
                                            type="file"
                                            className="d-none"
                                            accept="image/*"
                                            onChange={(e) =>
                                              handlePhotoUpload(e, index)
                                            }
                                          />

                                          <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() =>
                                              document
                                                .getElementById(
                                                  `photo-${index}`,
                                                )
                                                .click()
                                            }
                                          >
                                            <i className="fa-solid fa-camera me-1" />
                                            Upload Photo
                                          </button>

                                          {item.photo && (
                                            <img
                                              alt="Preview"
                                              crossOrigin="anonymous"
                                              src={`${API_IMAGE_URL}${item.photo}`}
                                              style={{
                                                height: "38px",
                                                width: "38px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                border: "1px solid #ddd",
                                              }}
                                              loading="lazy"
                                              decoding="async"
                                            />
                                          )}
                                        </div>
                                      </div>

                                      {/* Testimonial */}
                                      <div className="col-md-12 mb-2">
                                        <label className="small fw-bold">
                                          Témoignage (Texte)
                                        </label>

                                        <textarea
                                          className="form-control form-control-sm"
                                          rows={3}
                                          value={item.testimonial}
                                          onChange={(e) =>
                                            handleChange1(
                                              index,
                                              "testimonial",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 mb-4">
                            <div className="card-premium-style">
                              <h4
                                className="border-bottom pb-2"
                                style={{ color: "rgb(251, 118, 26)" }}
                              >
                                Mission & Vision
                              </h4>

                              <div className="row mt-3">
                                {/* Mission */}
                                <div className="col-md-6 mb-3">
                                  <label className="form-label fw-bold">
                                    Notre Mission
                                  </label>

                                  <textarea
                                    className="form-control"
                                    rows={3}
                                    name="mission"
                                    placeholder="Entrez la mission de l'entreprise..."
                                    value={missionVision.mission}
                                    onChange={handleMissionChange}
                                  />
                                </div>

                                {/* Vision */}
                                <div className="col-md-6 mb-3">
                                  <label className="form-label fw-bold">
                                    Notre Vision
                                  </label>

                                  <textarea
                                    className="form-control"
                                    rows={3}
                                    name="vision"
                                    placeholder="Entrez la vision de l'entreprise..."
                                    value={missionVision.vision}
                                    onChange={handleMissionChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 mb-4">
                            <div className="card-premium-style">
                              <h4
                                className="border-bottom pb-2"
                                style={{ color: "rgb(251, 118, 26)" }}
                              >
                                Mot du Dirigeant
                              </h4>

                              <div className="ceo-message-form p-3">
                                <div className="row">
                                  {/* Name */}
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">
                                      Nom du Dirigeant
                                    </label>

                                    <input
                                      className="form-control"
                                      type="text"
                                      name="name"
                                      value={ceoData.name}
                                      onChange={handleCEOChange}
                                    />
                                  </div>

                                  {/* Title */}
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">
                                      Poste / Titre
                                    </label>

                                    <input
                                      className="form-control"
                                      type="text"
                                      name="title"
                                      value={ceoData.title}
                                      onChange={handleCEOChange}
                                    />
                                  </div>

                                  {/* Photo */}
                                  <div className="col-md-12 mb-3">
                                    <label className="form-label fw-bold">
                                      Photo du Dirigeant
                                    </label>

                                    <div className="d-flex align-items-center gap-2">
                                      <input
                                        id="ceoAvatarInput"
                                        className="d-none"
                                        accept="image/*"
                                        type="file"
                                        onChange={handleImageUpload}
                                      />

                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() =>
                                          document
                                            .getElementById("ceoAvatarInput")
                                            .click()
                                        }
                                      >
                                        <i className="fa-solid fa-upload me-1" />
                                        Upload Photo
                                      </button>

                                      {ceoData.photo && (
                                        <img
                                          crossOrigin="anonymous"
                                          src={ceoData.photo}
                                          alt="CEO"
                                          style={{
                                            width: "45px",
                                            height: "45px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                          }}
                                          loading="lazy"
                                          decoding="async"
                                        />
                                      )}
                                    </div>
                                  </div>

                                  {/* Message */}
                                  <div className="col-md-12 mb-3">
                                    <label className="form-label fw-bold">
                                      Le message / Quote
                                    </label>

                                    <textarea
                                      className="form-control"
                                      rows={4}
                                      placeholder="« Notre mission est... »"
                                      name="message"
                                      value={ceoData.message}
                                      onChange={handleCEOChange}
                                    />
                                  </div>

                                  {/* Video URL */}
                                  <div className="col-md-12 mb-3">
                                    <label className="form-label fw-bold">
                                      {t("profile.video_interview_link")}
                                    </label>

                                    <input
                                      className="form-control"
                                      placeholder="https://www.youtube.com/embed/..."
                                      type="text"
                                      name="videoUrl"
                                      value={ceoData.videoUrl}
                                      onChange={handleCEOChange}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 mb-4">
                            <div className="card-premium-style">
                              {/* Header */}
                              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                                <h4
                                  className="mb-0"
                                  style={{ color: "rgb(251, 118, 26)" }}
                                >
                                  Notre Équipe
                                </h4>

                                <button
                                  type="button"
                                  className="default-btn btn btn-sm py-2 px-3"
                                  onClick={addMember}
                                >
                                  <i className="fa-solid fa-plus me-1" />
                                  Ajouter un membre
                                </button>
                              </div>

                              {/* Empty */}
                              {teamMembers.length === 0 && (
                                <p className="text-muted text-center py-3 bg-light rounded-3">
                                  Aucun membre d'équipe ajouté pour le moment.
                                </p>
                              )}

                              {/* Members */}
                              <div className="team-members-list row">
                                {teamMembers.map((item, index) => (
                                  <div className="col-md-6 mb-3" key={index}>
                                    <div className="team-slot-card shadow-sm border p-4 mb-4 bg-white position-relative rounded-4">
                                      <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h6 className="mb-0 text-primary">
                                          Membre #{index + 1}
                                        </h6>

                                        <button
                                          type="button"
                                          className="btn btn-sm btn-link text-danger p-0"
                                          onClick={() => removeMember(index)}
                                        >
                                          <i className="fa-solid fa-trash" />
                                        </button>
                                      </div>

                                      {/* Name */}
                                      <div className="mb-2">
                                        <label className="small fw-bold">
                                          Nom complet
                                        </label>

                                        <input
                                          className="form-control form-control-sm"
                                          type="text"
                                          value={item.fullName}
                                          onChange={(e) =>
                                            handleChange2(
                                              index,
                                              "fullName",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>

                                      {/* Position */}
                                      <div className="mb-2">
                                        <label className="small fw-bold">
                                          Poste
                                        </label>

                                        <input
                                          className="form-control form-control-sm"
                                          type="text"
                                          value={item.position}
                                          onChange={(e) =>
                                            handleChange2(
                                              index,
                                              "position",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>

                                      {/* Photo */}
                                      <div className="mb-2">
                                        <label className="small fw-bold">
                                          Photo
                                        </label>

                                        <div className="d-flex align-items-center gap-2">
                                          <input
                                            id={`team-avatar-${index}`}
                                            className="d-none"
                                            accept="image/*"
                                            type="file"
                                            onChange={(e) =>
                                              handleImageUpload2(e, index)
                                            }
                                          />

                                          <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() =>
                                              document
                                                .getElementById(
                                                  `team-avatar-${index}`,
                                                )
                                                .click()
                                            }
                                          >
                                            <i className="fa-solid fa-camera me-1" />
                                            Upload
                                          </button>

                                          {item.photo && (
                                            <img
                                              crossOrigin="anonymous"
                                              src={`${API_IMAGE_URL}${item.photo}`}
                                              alt="Preview"
                                              style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                              }}
                                              loading="lazy"
                                              decoding="async"
                                            />
                                          )}
                                        </div>
                                      </div>

                                      {/* Short Text */}
                                      <div className="mb-0">
                                        <label className="small fw-bold">
                                          Témoignage court
                                        </label>

                                        <textarea
                                          className="form-control form-control-sm"
                                          rows={2}
                                          value={item.shortText}
                                          onChange={(e) =>
                                            handleChange2(
                                              index,
                                              "shortText",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 mt-4 text-center">
                            <button
                              type="button"
                              onClick={handleSubmit1}
                              className="default-btn btn px-5 py-3 shadow-lg"
                            >
                              Enregistrer toutes les modifications du profil
                            </button>
                          </div>
                        </div>
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
                    <span className="template-name"> {t("header.Connect_Work")} </span>
                    {t("header.All_Rights_Reserved")}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    {t("header.Designed_By")}{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      {t("header.Webnmobapps_Solution_Pvt_Ltd")}
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
