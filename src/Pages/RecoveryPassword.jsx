import React from "react";
import { Link } from "react-router-dom";

function RecoveryPassword() {
  return (
    <>
      <section class="inner-banners-info-area">
        <div class="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="breadcrumb Img"
          />
        </div>
        <div class="inner-banners-title-info">
          <div class="container">
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="inner-page-banner-title">
                  <h2>Recover Password</h2>
                  <ul>
                    <li class="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Recover Password</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="password-area ptb-100">
        <div className="container">
          <div className="password">
            <div class="company-logo-info-area">
              <img
                src="/jobPortal/assets/images/logo/connect-work-ma-login.png"
                class="main-logo"
                alt="logo"
              />
            </div>
            <h3>Forgot Password</h3>
            <div className="form-group">
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Username Or Email Address*"
              />
            </div>
            <button type="submit" className="default-btn btn">
              Reset Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecoveryPassword;
