import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ContactUs() {
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
      toast.error("Please fill all fields");
      return;
    }

    if (!formData.agree) {
      toast.warning("Please agree to terms and privacy policy");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}sendContactMessage`,
        formData,
      );

      if (res.data.success) {
        toast.success("Message sent successfully ");

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
      toast.error("Something went wrong");
    }
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
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
                  <h2>Contact Us</h2>
                  <ul>
                    <li class="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Contact Us</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="contact-us-area pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="single-contact-info-box">
                <div className="info-content">
                  <div className="icon">
                    <i className="fa-solid fa-location-dot" />
                  </div>
                  <h3>Our location</h3>
                  <span>{contactData.location?.address}</span>{" "}
                </div>
              </div>
              <div className="single-contact-info-box">
                <div className="info-content">
                  <div className="icon">
                    <i className="fa-solid fa-envelope" />
                  </div>
                  <h3>Email Us</h3>
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
                    <i className="fa-solid fa-envelope" />
                  </div>
                  <h3>Phone</h3>
                  {contactData.phones?.map((p, i) => (
                    <a key={i} href={`tel:${p}`}>
                      {p}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="contact-map">
                <iframe
                  src={`https://maps.google.com/maps?q=${contactData.location?.lat},${contactData.location?.lng}&z=15&output=embed`}
                  style={{ border: "0", width: "100%", height: "400px" }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-form-area pb-100">
        <div className="container">
          <div className="section-title">
            <span>SEND MESSAGE</span>
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
                      placeholder="Name"
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
                      placeholder="Email"
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
                      placeholder="Phone"
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
                      placeholder="Subject"
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
                      placeholder="Message"
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
                      name="agree"
                      className="form-check-input"
                      checked={formData.agree}
                      onChange={handleChange}
                    />

                    <label className="form-check-label" htmlFor="gridCheck">
                      I agree to the <a href="terms-conditions.html">terms</a>{" "}
                      and <a href="privacy-policy.html">privacy policy</a>
                    </label>
                    <div className="help-block with-errors gridCheck-error" />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <button type="submit" className="default-btn">
                    <span>Send Message</span>
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
