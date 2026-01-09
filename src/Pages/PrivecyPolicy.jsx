import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "../Services/axios";
import Spinner from "../Conponets/Spinner"; // optional
import { useAuth } from "../context/AuthContext"; // adjust path
import ReCAPTCHA from "react-google-recaptcha";

import { API_BASE_URL } from "../Url/Url";
function PrivecyPolicy() {
  const [email, setEmail] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false); // ✅ state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match");
      return false;
    }

    // Validate captcha
    if (!captchaVerified) {
      toast.error("Please verify the captcha!");
      return false;
    }

    // Validate terms & conditions
    if (!agree) {
      toast.error("You must accept the terms and conditions");
      return false;
    }

    return true; // All validations passed
  };

  // const handleRegister = async () => {
  //   if (!validateForm()) return;

  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}user/register`, {
  //       email,
  //       password,
  //     });

  //     if (response.status === 200 && response.data.success) {
  //       const { token, user } = response.data;

  //       localStorage.setItem("token", token);

  //       toast.success("Registration successful!");
  //       login();
  //       navigate("/profile-basic-info");
  //     } else {
  //       toast.error("Something went wrong, please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Register error:", error);
  //     toast.error(
  //       error.response?.data?.message || "Registration failed. Try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}user/register`, {
        email,
        password,
      });

      if (response.status === 200 && response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);

        toast.success("Registration successful!");
        login();

        // ✅ Navigate to verification page and pass email
        navigate("/verification", { state: { email, showToast: true } });
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error(
        error.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
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
                    <h2>Privacy Policy</h2>
                    <ul>
                      <li className="menu-divide-arrow">
                        <a href="index.html">Home</a>
                      </li>
                      <li>Privacy Policy</li>
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
                    <h2>Privacy Policy</h2>
                    <p>
                      This Privacy Policy was last updated on November 1, 2025.
                    </p>
                  </div>
                  <div className="terms-condition-privacy-policy-heading-discription">
                    <p>
                      Welcome to <strong>Connect Work.ma</strong> ("we", "our",
                      "us"). Your privacy is very important to us. This Privacy
                      Policy explains how we collect, use, and protect your
                      personal information when you use our website{" "}
                      <a href="[Website URL]">[Website URL]</a> and related
                      services (collectively, the “Service”).
                    </p>
                  </div>
                  <div className="terms-condition-privacy-policy-discription-info">
                    <h4>1. Information We Collect</h4>
                    <p>
                      We may collect the following types of information when you
                      use our job portal:
                    </p>
                    <ul>
                      <li>
                        <strong>Personal Information:</strong> such as your
                        name, email address, phone number, and contact details
                        when you create an account or apply for jobs.
                      </li>
                      <li>
                        <strong>Professional Information:</strong> including
                        your resume, educational qualifications, skills,
                        employment history, and references.
                      </li>
                      <li>
                        <strong>Account Information:</strong> such as username,
                        password, and preferences.
                      </li>
                      <li>
                        <strong>Usage Data:</strong> including IP address,
                        browser type, device information, and pages visited.
                      </li>
                      <li>
                        <strong>Cookies and Tracking:</strong> We use cookies
                        and similar technologies to enhance user experience and
                        analyze traffic.
                      </li>
                    </ul>
                    <h4>2. How We Use Your Information</h4>
                    <p>We may use your information to:</p>
                    <ul>
                      <li>Provide and improve our job portal services.</li>
                      <li>Match job seekers with potential employers.</li>
                      <li>
                        Send job alerts, updates, and marketing communications
                        (you can opt out anytime).
                      </li>
                      <li>Maintain and secure your account.</li>
                      <li>
                        Comply with legal obligations and resolve disputes.
                      </li>
                    </ul>
                    <h4>3. Sharing of Information</h4>
                    <p>
                      We may share your information in the following
                      circumstances:
                    </p>
                    <ul>
                      <li>
                        With employers and recruiters when you apply for a job
                        or make your profile visible.
                      </li>
                      <li>
                        With third-party service providers who assist in
                        operating the website or business.
                      </li>
                      <li>
                        When required by law or to protect our legal rights.
                      </li>
                    </ul>
                    <h4>4. Data Retention</h4>
                    <p>
                      We retain your personal information only for as long as
                      necessary to provide our services and fulfill the purposes
                      described in this policy, unless a longer retention period
                      is required by law.
                    </p>
                    <h4>5. Your Rights and Choices</h4>
                    <p>
                      Depending on your location, you may have rights regarding
                      your personal data, including:
                    </p>
                    <ul>
                      <li>Accessing or correcting your data.</li>
                      <li>Requesting deletion of your account or data.</li>
                      <li>Opting out of marketing communications.</li>
                      <li>Restricting or objecting to data processing.</li>
                    </ul>
                    <p>
                      To exercise these rights, contact us at{" "}
                      <a href="mailto:[Your Contact Email]">
                        [Your Contact Email]
                      </a>
                      .
                    </p>
                    <h4>6. Data Security</h4>
                    <p>
                      We use appropriate technical and organizational measures
                      to protect your personal data from unauthorized access,
                      disclosure, alteration, or destruction. However, no system
                      is completely secure, and we cannot guarantee absolute
                      security.
                    </p>
                    <h4>7. Cookies</h4>
                    <p>
                      Our website uses cookies to improve functionality and user
                      experience. You can manage your cookie preferences through
                      your browser settings.
                    </p>
                    <h4>8. Third-Party Links</h4>
                    <p>
                      Our website may contain links to third-party websites. We
                      are not responsible for the privacy practices or content
                      of those sites.
                    </p>
                    <h4>9. Children’s Privacy</h4>
                    <p>
                      Our services are not intended for individuals under 16
                      years of age. We do not knowingly collect personal data
                      from children.
                    </p>
                    <h4>10. Changes to This Privacy Policy</h4>
                    <p>
                      We may update this Privacy Policy from time to time. Any
                      changes will be posted on this page with an updated
                      revision date. Continued use of the site after changes
                      constitutes acceptance of the revised policy.
                    </p>
                    <h4>11. Contact Us</h4>
                    <p>
                      If you have any questions or concerns about this Privacy
                      Policy, please contact us at:
                    </p>
                    <ul>
                      <li>
                        <strong>Connect Work.ma</strong>
                      </li>
                      <li>
                        <strong>Email:</strong> info@companyname.com
                      </li>
                      <li>
                        <strong>Phone:</strong> (+226) 25 34 12 18
                      </li>
                      <li>
                        <strong>Address:</strong> 2976 sunrise road las vegas
                      </li>
                    </ul>
                  </div>
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
