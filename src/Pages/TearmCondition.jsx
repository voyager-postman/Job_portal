import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "../utils/axiosInstance"; // path based on your folder structure
import Spinner from "../Conponets/Spinner"; // optional
import { useAuth } from "../context/AuthContext"; // adjust path
import ReCAPTCHA from "react-google-recaptcha";

import { API_BASE_URL } from "../Url/Url";
function TearmCondition() {
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
                    <h2>Terms &amp; Condition</h2>
                    <p>
                      This Terms &amp; Conditions was last updated on November
                      1, 2025.
                    </p>
                  </div>
                  <div className="terms-condition-privacy-policy-heading-discription">
                    <p>
                      Welcome to <strong>Connect Work.ma</strong> (“we,” “our,”
                      or “us”). These Terms &amp; Conditions (“Terms”) govern
                      your access to and use of our job portal, including our
                      website, mobile application, and any related services
                      (collectively, the “Platform”).
                    </p>
                    <p>
                      By using or accessing the Platform, you (“User”) agree to
                      comply with and be bound by these Terms. Please read them
                      carefully before using our services.
                    </p>
                  </div>
                  <div className="terms-condition-privacy-policy-discription-info">
                    <h4>1. Acceptance of Terms</h4>
                    <p>
                      By registering or using our Platform, you agree to be
                      legally bound by these Terms. If you do not agree, please
                      discontinue using the Platform immediately.
                    </p>
                    <h4>2. Definitions</h4>
                    <ul>
                      <li>
                        <strong>Job Seeker:</strong> Any individual who uses the
                        Platform to search for or apply to job opportunities.
                      </li>
                      <li>
                        <strong>Employer:</strong> Any company, organization, or
                        individual who posts job listings or searches for
                        candidates.
                      </li>
                      <li>
                        <strong>User:</strong> Refers collectively to both Job
                        Seekers and Employers who access or use the Platform.
                      </li>
                    </ul>
                    <h4>3. Eligibility</h4>
                    <p>
                      To use this Platform, you must be at least 18 years of age
                      and capable of entering into legally binding agreements.
                      By using our services, you represent that you meet these
                      requirements.
                    </p>
                    <h4>4. Account Registration</h4>
                    <ul>
                      <li>
                        All Users must register an account to access full
                        features of the Platform.
                      </li>
                      <li>
                        You must provide accurate, current, and complete
                        information during registration.
                      </li>
                      <li>
                        You are responsible for maintaining the confidentiality
                        of your account credentials.
                      </li>
                      <li>
                        You agree to notify us immediately of any unauthorized
                        use of your account.
                      </li>
                    </ul>
                    <h4>5. Services Provided</h4>
                    <p>
                      Our Platform connects Job Seekers and Employers for
                      recruitment purposes by offering:
                    </p>
                    <ul>
                      <li>Job search and application tools.</li>
                      <li>Resume upload and management features.</li>
                      <li>
                        Job posting and candidate search tools for Employers.
                      </li>
                    </ul>
                    <p>We do not guarantee employment or hiring results.</p>
                    <h4>6. Terms for Job Seekers</h4>
                    <ul>
                      <li>
                        Provide truthful and updated personal, educational, and
                        professional information.
                      </li>
                      <li>Apply only for genuine job opportunities.</li>
                      <li>
                        Refrain from submitting false or misleading
                        applications.
                      </li>
                    </ul>
                    <p>
                      We do not guarantee that Employers will contact or hire
                      Job Seekers.
                    </p>
                    <h4>7. Terms for Employers</h4>
                    <ul>
                      <li>
                        Post only genuine, lawful, and non-discriminatory job
                        listings.
                      </li>
                      <li>
                        Use candidate data solely for recruitment purposes.
                      </li>
                      <li>
                        Refrain from sharing or selling candidate data to third
                        parties.
                      </li>
                      <li>
                        Ensure compliance with all applicable employment and
                        data protection laws.
                      </li>
                    </ul>
                    <h4>8. Prohibited Activities</h4>
                    <ul>
                      <li>
                        Use the Platform for illegal, fraudulent, or unethical
                        purposes.
                      </li>
                      <li>
                        Post or distribute false, misleading, or offensive
                        content.
                      </li>
                      <li>
                        Interfere with the operation or security of the
                        Platform.
                      </li>
                      <li>
                        Collect information from other Users without consent.
                      </li>
                    </ul>
                    <h4>9. Fees and Payments</h4>
                    <ul>
                      <li>
                        Certain services or premium features may require
                        payment.
                      </li>
                      <li>All fees will be clearly stated before purchase.</li>
                      <li>
                        Payments are non-refundable unless otherwise stated.
                      </li>
                      <li>
                        You agree to provide valid payment information and
                        authorize us to process charges.
                      </li>
                    </ul>
                    <h4>10. Data Protection and Privacy</h4>
                    <p>
                      We respect your privacy. All personal data collected on
                      the Platform is governed by our{" "}
                      <strong>[Privacy Policy]</strong>, which outlines how we
                      collect, store, and use your information in compliance
                      with data protection laws.
                    </p>
                    <h4>11. Intellectual Property Rights</h4>
                    <p>
                      All content on the Platform—including text, graphics,
                      logos, and software—is owned or licensed by{" "}
                      <strong>[Your Job Portal Name]</strong>. Users may not
                      reproduce, modify, or distribute any content without prior
                      written consent.
                    </p>
                    <h4>12. Disclaimer of Warranties</h4>
                    <p>
                      The Platform is provided on an “as is” and “as available”
                      basis. We make no warranties, express or implied, about:
                    </p>
                    <ul>
                      <li>
                        The accuracy or reliability of job listings or candidate
                        profiles.
                      </li>
                      <li>
                        The suitability, quality, or availability of employment
                        opportunities.
                      </li>
                    </ul>
                    <p>Use of the Platform is at your own risk.</p>
                    <h4>13. Limitation of Liability</h4>
                    <p>
                      <strong>[Your Job Portal Name]</strong> will not be liable
                      for:
                    </p>
                    <ul>
                      <li>
                        Any loss or damage arising from the use of the Platform.
                      </li>
                      <li>Any hiring or employment outcomes.</li>
                      <li>
                        Any unauthorized access to or alteration of your data.
                      </li>
                    </ul>
                    <p>
                      Our total liability shall not exceed the amount paid by
                      you (if any) for using our services.
                    </p>
                    <h4>14. Suspension and Termination</h4>
                    <p>
                      We reserve the right to suspend or terminate any account
                      without prior notice if:
                    </p>
                    <ul>
                      <li>You violate these Terms.</li>
                      <li>
                        You engage in fraudulent, abusive, or illegal activity.
                      </li>
                    </ul>
                    <p>
                      Upon termination, your right to use the Platform will
                      cease immediately.
                    </p>
                    <h4>15. Changes to Terms</h4>
                    <p>
                      We may revise these Terms periodically. Updated versions
                      will be posted on this page with a new “Last Updated”
                      date. Continued use of the Platform indicates acceptance
                      of the revised Terms.
                    </p>
                    <h4>16. Governing Law</h4>
                    <p>
                      These Terms shall be governed by and construed in
                      accordance with the laws of{" "}
                      <strong>[Insert Country/State]</strong>. Any disputes will
                      be subject to the exclusive jurisdiction of the courts
                      located in <strong>[Insert Location]</strong>.
                    </p>
                    <h4>17. Contact Information</h4>
                    <p>
                      If you have any questions about these Terms, please
                      contact us:
                    </p>
                    <ul>
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

export default TearmCondition;
