import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Spinner from "../Conponets/Spinner"; // optional
import { useAuth } from "../context/AuthContext"; // adjust path
import ReCAPTCHA from "react-google-recaptcha";
import { API_BASE_URL } from "../Url/Url";
function TearmCondition() {
  const [loading, setLoading] = useState(false);
  const [termsData, setTermsData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}getTerms`);

        if (res.data.success) {
          setTermsData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
      }
    };

    fetchTerms();
  }, []);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <>
      <ToastContainer />
      <div>
        {/*Start Page Banner Area*/}
        <section className="inner-banners-info-area">
          <div className="inner-banners-img-area">
            <img
              src="assets/images/banner/inner-banner-img.jpg"
              alt="breadcrumb Img"
            />
          </div>
          <div className="inner-banners-title-info">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="inner-page-banner-title">
                    <h2>Terms &amp; Condition</h2>
                    <ul>
                      <li className="menu-divide-arrow">
                        <a href="index.html">Home</a>
                      </li>
                      <li>Terms &amp; Condition</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*terms condition section start here*/}
        <section className="terms-condition-privacy-policy-info">
          <div className="terms-condition-privacy-policy">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="terms-condition-privacy-policy-heading">
                    <h2>{termsData?.title}</h2>
                    <p>
                      This Terms & Conditions was last updated on{" "}
                      {termsData?.publishDate &&
                        formatDate(termsData.publishDate)}
                      .
                    </p>
                  </div>
                  <div
                    className="terms-condition-privacy-policy-discription-info"
                    dangerouslySetInnerHTML={{
                      __html: termsData?.content || "",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default TearmCondition;
