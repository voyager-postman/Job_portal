import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import axios from "axios";

const Faq = () => {
  const { type } = useParams(); // recruiter | jobseeker
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({
    type: "",
    heading: "",
    subHeading: "",
    description: "",
    faqs: [],
  });

  const getFaq = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}faq?type=${type}`);

      if (res.data?.data) {
        setFormData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching FAQ:", error);
    }
  };

  useEffect(() => {
    getFaq();
  }, [type]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      {/* Banner */}
      <section className="inner-banners-info-area">
        <div className="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="breadcrumb Img"
          />
        </div>

        <div className="inner-banners-title-info">
          <div className="container">
            <div className="inner-page-banner-title">
              <h2>{formData.heading}</h2>
              <ul>
                <li className="menu-divide-arrow">
                  <Link to="/">Home</Link>
                </li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="faq-area ptb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="faq-img">
                <img src="/jobPortal/assets/images/faq-img.png" alt="faq" />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="faq-accordion pl-15">
                <div className="faq-title">
                  <span>FAQ</span>
                  <h2>{formData.subHeading}</h2>
                </div>

                <div className="accordion">
                  {formData.faqs?.map((faq, index) => (
                    <div className="accordion-item" key={faq._id}>
                      <div
                        className={`accordion-title ${activeIndex === index ? "active" : ""}`}
                        onClick={() => toggleAccordion(index)}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          className={`fa-solid ${activeIndex === index ? "fa-minus" : "fa-plus"}`}
                        ></i>{" "}
                        {faq.question}
                      </div>

                      {activeIndex === index && (
                        <div className="accordion-content show">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
