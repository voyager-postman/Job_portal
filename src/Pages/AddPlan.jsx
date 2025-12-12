import React from "react";
import { Link } from "react-router-dom";

const AddPlan = () => {
  return (
    <div>
      {/* <!--Start Page Banner Area--> */}
      <section className="inner-banners-info-area">
        <div className="inner-banners-img-area">
          <img
            src="/jobPortal/assets/images/banner/inner-banner-img.jpg"
            alt="breadcrumb Img"
          />
        </div>
        <div className="inner-banners-title-info">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="inner-page-banner-title">
                  <h2>Add Plan</h2>
                  <ul>
                    <li className="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Add Plan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!--Plan price section start here--> */}
      <section className="plan-price-info-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="section-title">
                <h2>Transparent Pricing Plan For You</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="plan-price-box-info-area">
                <div className="plan-price-heaing-info">
                  <h4>Initial Base Plan</h4>
                  <h5>$ 50 Price</h5>
                </div>
                <div className="plan-price-detail-info">
                  <ul>
                    <li>Job Post Credit: 10 Credits</li>
                    <li>Daily Job Posting Limit: 3</li>
                    <li>CV Viewing Credit: 20 Credits</li>
                    <li>Daily Profile Viewing Limit: 5</li>
                    <li>Valid for 3 months</li>
                  </ul>
                </div>
                <div className="plan-price-btn-info">
                  <a
                    href="https://www.paypal.com/in/home"
                    target="_blank"
                    className="plan-price-btn default-btn btn"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="plan-price-box-info-area">
                <div className="plan-price-heaing-info card-header-orange">
                  <h4>Standard Plus Plan</h4>
                  <h5>$ 60 Price</h5>
                </div>
                <div className="plan-price-detail-info">
                  <ul>
                    <li>Job Post Credit: 20 Credits</li>
                    <li>Daily Job Posting Limit: 5</li>
                    <li>CV Viewing Credit: 30 Credits</li>
                    <li>Daily Profile Viewing Limit: 7</li>
                    <li>Valid for 6 months</li>
                  </ul>
                </div>
                <div className="plan-price-btn-info">
                  <a
                    href="https://www.paypal.com/in/home"
                    target="_blank"
                    className="plan-price-btn default-btn btn"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="plan-price-box-info-area">
                <div className="plan-price-heaing-info card-header-green">
                  <h4>Elite Premium Plan</h4>
                  <h5>$ 70 Price</h5>
                </div>
                <div className="plan-price-detail-info">
                  <ul>
                    <li>Job Post Credit: 30 Credits</li>
                    <li>Daily Job Posting Limit: 7</li>
                    <li>CV Viewing Credit: 40 Credits</li>
                    <li>Daily Profile Viewing Limit: 10</li>
                    <li>Valid for 1 Year</li>
                  </ul>
                </div>
                <div className="plan-price-btn-info">
                  <a
                    href="https://www.paypal.com/in/home"
                    target="_blank"
                    className="plan-price-btn default-btn btn"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!--Plan price section end here--> */}
      {/* <!--End Page Banner Area--> */}
    </div>
  );
};

export default AddPlan;
