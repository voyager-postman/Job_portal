import React from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axiosInstance"

const Faq = () => {
  return (
    <div>
      {/* <!--Start Page Banner Area--> */}
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
                  <h2>FAQ</h2>
                  <ul>
                    <li class="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>FAQ</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!--End Page Banner Area--> */}

      {/* <!--Start Faq Area--> */}
      <div class="faq-area ptb-100">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <div class="faq-img">
                <img src="assets/images/faq-img.png" alt="Image" />
              </div>
            </div>
            <div class="col-lg-6">
              <div class="faq-accordion pl-15">
                <div class="faq-title">
                  <span>FAQ</span>
                  <h2>Freequently Asked Question</h2>
                </div>
                <div class="accordion">
                  <div class="accordion-item">
                    <div class="accordion-title active">
                      <i class="fa-solid fa-plus"></i>
                      What's Your Ideal About Company?
                    </div>

                    <div class="accordion-content show">
                      <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit
                        diam nonummy nibh sed euismod tincidunt ut laoreet
                        dolore magna aliquam erat volutpat ut wisi enim veniam
                        lorem dolore magna aliqua.
                      </p>
                    </div>
                  </div>

                  <div class="accordion-item">
                    <div class="accordion-title">
                      <i class="fa-solid fa-plus"></i>
                      How Can I Unsubscribe From Your Mailing List?
                    </div>

                    <div class="accordion-content">
                      <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit
                        diam nonummy nibh sed euismod tincidunt ut laoreet
                        dolore magna aliquam erat volutpat ut wisi enim veniam
                        lorem dolore magna aliqua.
                      </p>
                    </div>
                  </div>

                  <div class="accordion-item">
                    <div class="accordion-title">
                      <i class="fa-solid fa-plus"></i>
                      Why Should We Hire You?
                    </div>

                    <div class="accordion-content">
                      <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit
                        diam nonummy nibh sed euismod tincidunt ut laoreet
                        dolore magna aliquam erat volutpat ut wisi enim veniam
                        lorem dolore magna aliqua.
                      </p>
                    </div>
                  </div>

                  <div class="accordion-item">
                    <div class="accordion-title">
                      <i class="fa-solid fa-plus"></i>
                      Why Do You Want To Work Here?
                    </div>

                    <div class="accordion-content">
                      <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit
                        diam nonummy nibh sed euismod tincidunt ut laoreet
                        dolore magna aliquam erat volutpat ut wisi enim veniam
                        lorem dolore magna aliqua.
                      </p>
                    </div>
                  </div>

                  <div class="accordion-item">
                    <div class="accordion-title">
                      <i class="fa-solid fa-plus"></i>
                      What Attracted Me To This Company?
                    </div>

                    <div class="accordion-content">
                      <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit
                        diam nonummy nibh sed euismod tincidunt ut laoreet
                        dolore magna aliquam erat volutpat ut wisi enim veniam
                        lorem dolore magna aliqua.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!--End Faq Area--> */}
    </div>
  );
};

export default Faq;