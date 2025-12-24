import React from "react";
import { Link } from "react-router-dom";

function RecoveryPassword() {
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
                    <form>
                      <h6>Enter your email to reset your password</h6>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          placeholder="Email Address"
                        />
                      </div>
                      <div className="forgot-password-btn">
                        <button type="submit" className="default-btn btn">
                          Reset Now
                        </button>
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
