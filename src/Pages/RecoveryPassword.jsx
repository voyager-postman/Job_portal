import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { useTranslation } from "react-i18next";

function RecoveryPassword() {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || "jobseeker";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("email");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) return toast.error(t("recovery.email_required"));

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}forgotPassword`, { email });
      toast.success(res.data.message || t("recovery.otp_sent"));
      setStep("reset");
    } catch (error) {
      const message = error.response?.data?.message;
      if (message?.toLowerCase().includes("google")) {
        toast.info(t("recovery.google_account_message"));
      } else {
        toast.error(message || t("header.something_wrong"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return toast.error(t("recovery.valid_otp_required"));
    }
    if (!newPassword) {
      return toast.error(t("recovery.new_password_required"));
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}resetPassword`, {
        email,
        otp,
        newPassword,
      });
      toast.success(res.data.message || t("recovery.password_reset_success"));
      setTimeout(() => {
        if (role === "employer") {
          navigate("/employer-login");
        } else {
          navigate("/login");
        }
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || t("recovery.invalid_otp"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="forgot-password-info-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 p-0">
              <div className="password-area">
                <div className="container">
                  <div className="password">
                    <h1>{t("recovery.forgot_password_title")}</h1>

                    {step === "email" && (
                      <form onSubmit={handleForgotPassword}>
                        <p className="form-section-lead">{t("recovery.enter_email_otp")}</p>
                        <div className="form-group">
                          <label>{t("header.email_address")}</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder={t("header.email_address")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <button className="default-btn btn" disabled={loading}>
                          {loading
                            ? t("recovery.sending_otp")
                            : t("recovery.send_otp")}
                        </button>
                      </form>
                    )}

                    {step === "reset" && (
                      <form onSubmit={handleResetPassword}>
                        <p className="form-section-lead">{t("recovery.enter_otp_new_password")}</p>
                        <div className="otp-container">
                          <OtpInput
                            value={otp}
                            onChange={(value) => {
                              if (/^\d{0,6}$/.test(value)) {
                                setOtp(value);
                              }
                            }}
                            numInputs={6}
                            isInputNum
                            shouldAutoFocus
                            renderSeparator={<span className="otp-gap" />}
                            renderInput={(props) => (
                              <input {...props} className="otp-box" />
                            )}
                          />
                        </div>
                        <div className="form-group mt-2">
                          <label>{t("recovery.new_password")}</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder={t("recovery.new_password")}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <button className="default-btn btn" disabled={loading}>
                          {loading
                            ? t("recovery.resetting")
                            : t("recovery.reset_password")}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 p-0">
              <img
                src="assets/images/company/book-appointment-orignal.png"
                alt="reset"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default RecoveryPassword;
