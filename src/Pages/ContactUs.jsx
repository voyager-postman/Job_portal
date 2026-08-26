import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import PageSEO from "../components/PageSEO";
import { absoluteUrl } from "../utils/seo";
import "./ContactUs.css";

const buildMapEmbedUrl = (location) => {
  const lat = location?.lat;
  const lng = location?.lng;
  const address = location?.address?.trim();

  if (lat != null && lng != null && lat !== "" && lng !== "") {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  if (address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
  }

  return "";
};

function ContactUs() {
  const { t, i18n } = useTranslation("global");
  const [contactData, setContactData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject: "",
    agree: false,
  });

  // ✅ Get Contact Info
  const getContactInfo = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}getContactUs`);

      if (res.data.success) {
        setContactData(res.data.data);
      }
    } catch (error) {
      console.error("Contact info error:", error);
    }
  };

  useEffect(() => {
    getContactInfo();
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      toast.error(t("header.fill_all_fields"));
      return;
    }

    if (!formData.agree) {
      toast.warning(t("header.agree_terms"));
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}sendContactMessage`,
        formData,
      );

      if (res.data.success) {
        toast.success(t("header.message_sent"));

        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          subject: "",
          agree: false,
        });
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(t("header.something_wrong"));
    }
  };
  const mapEmbedUrl = buildMapEmbedUrl(contactData.location);

  return (
    <>
      <PageSEO
        title={t("seo.pages.contact-us.title", { defaultValue: "Contact Us" })}
        description={t("seo.pages.contact-us.description", {
          defaultValue:
            "Contact Connect Work.ma for job-related queries, support, or business inquiries.",
        })}
        canonical="/contact-us"
        image="/assets/images/banner/inner-banner-img.jpg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Us",
          url: absoluteUrl("/contact-us"),
          description:
            "Contact Connect Work.ma for support, inquiries, and assistance.",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: contactData.phones?.[0] || undefined,
            contactType: "customer support",
            email: contactData.emails?.[0] || undefined,
            areaServed: "MA",
            availableLanguage: ["English", "French"],
          },
        }}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <section className="inner-banners-info-area">
        <div className="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt={t("header.contactUs")}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="inner-banners-title-info">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="inner-page-banner-title">
                  <h1>{t("header.contactUs")}</h1>
                  <ul>
                    <li className="menu-divide-arrow">
                      <Link to="/">{t("header.home")}</Link>
                    </li>
                    <li>{t("header.contactUs")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="contact-us-area pt-100 pb-70">
        <div className="container">
          <div className="row contact-us-layout">
            <div className="col-lg-4">
              <div className="contact-info-stack">
              <div className="single-contact-info-box">
                <div className="info-content">
                  <div className="icon">
                    <i className="fa-solid fa-location-dot" />
                  </div>
                  <h3>{t("header.our_location")}</h3>
                  <span>{contactData.location?.address}</span>
                </div>
              </div>
              <div className="single-contact-info-box">
                <div className="info-content">
                  <div className="icon">
                    <i className="fa-solid fa-envelope" />
                  </div>
                  <h3>{t("header.email_us")}</h3>
                  {contactData.emails?.map((e, i) => (
                    <a key={i} href={`mailto:${e}`}>
                      {e}
                    </a>
                  ))}
                </div>
              </div>
              <div className="single-contact-info-box">
                <div className="info-content">
                  <div className="icon">
                    <i className="fa-solid fa-phone" />
                  </div>
                  <h3>{t("header.phone")}</h3>
                  {contactData.phones?.map((p, i) => (
                    <a key={i} href={`tel:${p}`}>
                      {p}
                    </a>
                  ))}
                </div>
              </div>
              <div
                className="single-contact-info-box"
                style={{
                  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                  color: "#fff",
                }}
              >
                <div className="info-content">
                  <div
                    className="icon"
                    style={{ background: "#fff", color: "#1e3c72" }}
                  >
                    <i className="fa-solid fa-headset" />
                  </div>
                  <h3 style={{ color: "#fff" }}>Help Desk & Tickets</h3>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "0.85rem",
                      marginBottom: "10px",
                    }}
                  >
                    Raise a support ticket or track existing requests
                  </p>
                  <Link
                    to="/support-tickets"
                    className="btn btn-sm btn-light"
                    style={{ fontWeight: "bold", color: "#1e3c72" }}
                  >
                    Go to Support Tickets &rarr;
                  </Link>
                </div>
              </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="contact-map">
                {mapEmbedUrl ? (
                  <iframe
                    title={t("header.our_location")}
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <div className="contact-map-fallback">
                    {t("header.map_unavailable", {
                      defaultValue: "Map location is not available right now.",
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-form-area pb-100">
        <div className="container">
          <div className="section-title">
            <span>{t("header.send_message")} </span>
            <h2>{contactData.sendMessageSection?.heading}</h2>
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6 col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      id="contact-name"
                      placeholder={t("header.name")}
                      aria-label={t("header.name")}
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      id="contact-email"
                      placeholder={t("header.email")}
                      aria-label={t("header.email")}
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="phone"
                      id="contact-phone"
                      placeholder={t("header.phone")}
                      aria-label={t("header.phone")}
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="subject"
                      placeholder={t("header.subject")}
                      className="form-control"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <textarea
                      name="message"
                      placeholder={t("header.message")}
                      className="form-control"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                    />
                    <div className="help-block with-errors" />
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="contact-agree"
                      name="agree"
                      className="form-check-input"
                      checked={formData.agree}
                      onChange={handleChange}
                    />

                    <label className="form-check-label" htmlFor="contact-agree">
                      {t("header.I_agree_to_the")}{" "}
                      <Link to="/terms-condition">{t("header.terms")}</Link>{" "}
                      {t("header.and")}{" "}
                      <Link to="/privacy-policy">
                        {t("header.privacy_policy")}
                      </Link>
                    </label>
                    <div className="help-block with-errors gridCheck-error" />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <button type="submit" className="default-btn">
                    <span> {t("header.send_message")}</span>
                  </button>
                  <div id="msgSubmit" className="h3 text-center hidden" />
                  <div className="clearfix" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
