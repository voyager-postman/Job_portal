import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";

function RecoveryPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state?.role || "jobseeker";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("email"); // email | reset

  // STEP 1: SEND OTP
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE_URL}forgotPassword`, { email });

      toast.success(res.data.message || "OTP sent successfully");
      setStep("reset");
    } catch (error) {
      const message = error.response?.data?.message;

      if (message?.toLowerCase().includes("google")) {
        toast.info(
          "This account was created using Google. Please login with Google.",
        );
      } else {
        toast.error(message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP");
    }

    if (!newPassword) {
      return toast.error("New password is required");
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE_URL}resetPassword`, {
        email,
        otp,
        newPassword,
      });

      toast.success(res.data.message || "Password reset successful");

      // ✅ Role based redirect
      setTimeout(() => {
        if (role === "employer") {
          navigate("/jobPortal/employer-login");
        } else {
          navigate("/jobPortal/login");
        }
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
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
                    <h3>Forgot Password</h3>

                    {step === "email" && (
                      <form onSubmit={handleForgotPassword}>
                        <h6>Enter your email to receive OTP</h6>

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

                        <button className="default-btn btn" disabled={loading}>
                          {loading ? "Sending..." : "Send OTP"}
                        </button>
                      </form>
                    )}

                    {step === "reset" && (
                      <form onSubmit={handleResetPassword}>
                        <h6>Enter 6-digit OTP and new password</h6>

                        {/* ✅ OTP INPUT */}
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

                        <div className="form-group">
                          <label>New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>

                        <button className="default-btn btn" disabled={loading}>
                          {loading ? "Resetting..." : "Reset Password"}
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
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default RecoveryPassword;
