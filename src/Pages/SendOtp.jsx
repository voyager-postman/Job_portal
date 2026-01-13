import React from "react";
import { Link } from "react-router-dom";

function SendOtp() {
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
                    <h3>Verify OTP</h3>
                    <form>
                      <h6>
                        Enter the OTP sent to your registered email address
                      </h6>

                      <div className="form-group">
                        <label>OTP</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter OTP"
                          maxLength="6"
                        />
                      </div>

                      <div className="forgot-password-btn">
                        <button type="submit" className="default-btn btn">
                          Verify OTP
                        </button>
                      </div>

                      <div className="text-center mt-3">
                        <p>
                          Didn’t receive OTP?{" "}
                          <Link to="/forgot-password">Resend</Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 p-0">
              <div className="login-img-info-area">
                <img
                  src="assets/images/company/book-appointment-orignal.png"
                  alt="otp-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SendOtp;
