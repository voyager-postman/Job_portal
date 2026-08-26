import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Spinner from "../Conponets/Spinner"; // optional
import { useAuth } from "../context/AuthContext"; // adjust path
import ReCAPTCHA from "react-google-recaptcha";

import { API_BASE_URL } from "../Url/Url";
import { useTranslation } from "react-i18next";
import SafeHtml from "../components/SafeHtml";

function PrivecyPolicy() {
  const { t, i18n } = useTranslation("global");
  const [email, setEmail] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false); // ✅ state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privacyData, setPrivacyData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}getPrivacyPolicy`);

        if (res.data.success) {
          setPrivacyData(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPrivacy();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      i18n.language?.startsWith("fr") ? "fr-FR" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  return (
    <>
      <ToastContainer />
      <div>
        {/*Start Page Banner Area*/}
        <section className="inner-banners-info-area">
          <div className="inner-banners-img-area">
            <img
              src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
              alt={t("legal.privacy_title")}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="inner-banners-title-info">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="inner-page-banner-title">
                    <h1>{t("legal.privacy_title")}</h1>
                    <ul>
                      <li className="menu-divide-arrow">
                        <Link to="/">{t("header.home")}</Link>
                      </li>
                      <li>{t("legal.privacy_title")}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*Privacy Policy section start here*/}
        <section className="terms-condition-privacy-policy-info">
          <div className="terms-condition-privacy-policy">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="terms-condition-privacy-policy-heading">
                    <h2>{privacyData?.title}</h2>
                    <p>
                      {t("legal.last_updated_privacy")}{" "}
                      {privacyData?.publishDate &&
                        formatDate(privacyData.publishDate)}
                      .
                    </p>
                  </div>
                  <SafeHtml
                    className="terms-condition-privacy-policy-discription-info"
                    html={privacyData?.content}
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

export default PrivecyPolicy;
