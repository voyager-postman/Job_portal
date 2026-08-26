import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../Url/Url";
import axios from "axios";
import { useTranslation } from "react-i18next";
import PageSEO from "../components/PageSEO";
import { absoluteUrl, buildFaqPageSchema, buildBreadcrumbSchema } from "../utils/seo";

const Faq = () => {
  const { t, i18n } = useTranslation("global");
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
    <>
      <PageSEO
        title={formData.heading || "FAQ"}
        description={
          formData.description ||
          "Frequently asked questions about using Connect Work.ma."
        }
        canonical={`/faq/${type}`}
        image="/assets/images/faq-img.png"
        jsonLd={[
          formData.faqs?.length
            ? buildFaqPageSchema(
                formData.faqs,
                absoluteUrl(`/faq/${type}`),
              )
            : null,
          buildBreadcrumbSchema([
            { name: t("header.home"), path: "/" },
            { name: t("header.FAQ"), path: `/faq/${type}` },
          ]),
        ]}
      />
      <section className="inner-banners-info-area">
        <div className="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt={formData.heading || t("header.FAQ")}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="inner-banners-title-info">
          <div className="container">
            <div className="inner-page-banner-title">
              <h1>{formData.heading}</h1>
              <ul>
                <li className="menu-divide-arrow">
                  <Link to="/">{t("header.home")}</Link>
                </li>
                <li>{t("header.FAQ")}</li>
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
                <img
                  src="/jobPortal/assets/images/faq-img.png"
                  alt={formData.subHeading || t("header.FAQ")}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="faq-accordion pl-15">
                <div className="faq-title">
                  <span>{t("header.FAQ")}</span>
                  <h2>{formData.subHeading}</h2>
                </div>

                <div className="accordion">
                  {formData.faqs?.map((faq, index) => (
                    <div className="accordion-item" key={faq._id}>
                      <h3 className="accordion-title">
                        <button
                          type="button"
                          className={`accordion-trigger ${activeIndex === index ? "active" : ""}`}
                          onClick={() => toggleAccordion(index)}
                          aria-expanded={activeIndex === index}
                        >
                          <i
                            className={`fa-solid ${activeIndex === index ? "fa-minus" : "fa-plus"}`}
                            aria-hidden="true"
                          />{" "}
                          {faq.question}
                        </button>
                      </h3>

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
    </>
  );
};

export default Faq;
