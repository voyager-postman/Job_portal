import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../Url/Url";
function RecoveryPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("email"); // email | otp

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE_URL}forgotPassword`, {
        email,
      });

      toast.success(res.data.message || "OTP sent successfully");
      setStep("otp"); // 👈 move to OTP screen
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("OTP is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:4000/api/verify-otp", {
        email,
        otp,
      });

      toast.success(res.data.message || "OTP verified");

      // 👉 Redirect to reset password page
      // navigate("/reset-password", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="forgot-password-info-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 p-0">
              <div className="password-area">
                <div className="company-logo-info-area">
                  <img
                    src="assets/images/logo/connect-work-ma-login.png"
                    className="main-logo"
                    alt="logo"
                  />
                </div>
                <div className="container">
                  <div className="password">
                    <h3>Forgot Password</h3>

                    {step === "email" && (
                      <form onSubmit={handleForgotPassword}>
                        <h6>Enter your email to reset your password</h6>

                        <div className="form-group">
                          <label>Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        <div className="forgot-password-btn">
                          <button
                            type="submit"
                            className="default-btn btn"
                            disabled={loading}
                          >
                            {loading ? "Sending..." : "Reset Now"}
                          </button>
                        </div>
                      </form>
                    )}

                    {step === "otp" && (
                      <form onSubmit={handleVerifyOtp}>
                        <h6>Enter OTP sent to {email}</h6>

                        <div className="form-group">
                          <label>OTP</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                        </div>

                        <div className="forgot-password-btn">
                          <button
                            type="submit"
                            className="default-btn btn"
                            disabled={loading}
                          >
                            {loading ? "Verifying..." : "Verify OTP"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 p-0">
              <div className="login-img-info-area">
                <img
                  src="assets/images/company/book-appointment-orignal.png"
                  alt="register-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default RecoveryPassword;
