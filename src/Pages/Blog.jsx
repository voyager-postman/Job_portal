import React from "react";
import { Link } from "react-router-dom";
function Blog() {
  return (
    <>
      <div>
        {/*Start Page Banner Area*/}
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
                    <h2>Blog</h2>
                    <ul>
                      <li class="menu-divide-arrow">
                        <Link to="/">Home</Link>
                      </li>
                        <li>Blog List</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <div className="page-banner-area bg-f0f4fc">
            
          <div className="container">
            
            <div className="page-banner-content">
              <h1>Blog</h1>
              <ul>
                <li>
                  <Link to="index-2.html">Home</Link >
                </li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
        </div> */}
        {/*End Page Banner Area*/}
        {/*Start Blog Area*/}
        <div className="blog-area ptb-100">
          <div className="container">
            <div className="row">
              <div
                className="col-lg-4 col-md-6 aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration={1200}
                data-aos-delay={200}
              >
                <div className="single-blog-card">
                  <div className="blog-img">
                    <Link to="/blogDetails">
                      <img
                        src="assets/images/blog/blog-img-1.jpg"
                        alt="Image"
                      />
                    </Link>
                  </div>
                  <div className="blog-content">
                    <div className="info-list">
                      <ul>
                        <li>
                          <i className="fa-solid fa-user" />
                          <Link to="#">Andrew Lawson</Link>
                        </li>
                        <li>
                          <i className="fa-solid fa-calendar-days" /> Feb 12,
                          2024
                        </li>
                      </ul>
                    </div>
                    <h2>
                      <Link to="/blogDetails">
                        The Internet Is A Job Seeker Most Crucial Success
                      </Link>
                    </h2>
                    <p>
                      Lorem ipsum dolor sit amet, constetur adipiscing elit, sed
                      do eiusmod tempor incididunt.
                    </p>
                    <div className="blog-btn-info-area">
                      <Link
                        href="/blogDetails"
                        className="read-more default-btn btn"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-4 col-md-6 aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration={1200}
                data-aos-delay={400}
              >
                <div className="single-blog-card">
                  <div className="blog-img">
                    <Link to="/blogDetails">
                      <img
                        src="assets/images/blog/blog-img-2.jpg"
                        alt="Image"
                      />
                    </Link>
                  </div>
                  <div className="blog-content">
                    <div className="info-list">
                      <ul>
                        <li>
                          <i className="fa-solid fa-user" />
                          <Link to="#">Andrew Lawson</Link>
                        </li>
                        <li>
                          <i className="fa-solid fa-calendar-days" /> Feb 12,
                          2024
                        </li>
                      </ul>
                    </div>
                    <h2>
                      <Link to="/blogDetails">
                        Today From Connecting With Potential Employers
                      </Link>
                    </h2>
                    <p>
                      Lorem ipsum dolor sit amet, constetur adipiscing elit, sed
                      do eiusmod tempor incididunt.
                    </p>
                    <div className="blog-btn-info-area">
                      <Link
                        href="/blogDetails"
                        className="read-more default-btn btn"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-4 col-md-6 aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration={1200}
                data-aos-delay={400}
              >
                <div className="single-blog-card">
                  <div className="blog-img">
                    <Link to="/blogDetails">
                      <img
                        src="assets/images/blog/blog-img-6.jpg"
                        alt="Image"
                      />
                    </Link>
                  </div>
                  <div className="blog-content">
                    <div className="info-list">
                      <ul>
                        <li>
                          <i className="fa-solid fa-user" />
                          <Link to="#">Andrew Lawson</Link>
                        </li>
                        <li>
                          <i className="fa-solid fa-calendar-days" /> Feb 12,
                          2024
                        </li>
                      </ul>
                    </div>
                    <h2>
                      <Link to="/blogDetails">
                        Today From Connecting With Potential Employers
                      </Link>
                    </h2>
                    <p>
                      Lorem ipsum dolor sit amet, constetur adipiscing elit, sed
                      do eiusmod tempor incididunt.
                    </p>
                    <div className="blog-btn-info-area">
                      <Link
                        href="/blogDetails"
                        className="read-more default-btn btn"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-4 col-md-6 aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration={1200}
                data-aos-delay={200}
              >
                <div className="single-blog-card">
                  <div className="blog-img">
                    <Link to="/blogDetails">
                      <img
                        src="assets/images/blog/blog-img-1.jpg"
                        alt="Image"
                      />
                    </Link>
                  </div>
                  <div className="blog-content">
                    <div className="info-list">
                      <ul>
                        <li>
                          <i className="fa-solid fa-user" />
                          <Link to="#">Andrew Lawson</Link>
                        </li>
                        <li>
                          <i className="fa-solid fa-calendar-days" /> Feb 12,
                          2024
                        </li>
                      </ul>
                    </div>
                    <h2>
                      <Link to="/blogDetails">
                        The Internet Is A Job Seeker Most Crucial Success
                      </Link>
                    </h2>
                    <p>
                      Lorem ipsum dolor sit amet, constetur adipiscing elit, sed
                      do eiusmod tempor incididunt.
                    </p>
                    <div className="blog-btn-info-area">
                      <Link
                        href="/blogDetails"
                        className="read-more default-btn btn"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-4 col-md-6 aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration={1200}
                data-aos-delay={400}
              >
                <div className="single-blog-card">
                  <div className="blog-img">
                    <Link to="/blogDetails">
                      <img
                        src="assets/images/blog/blog-img-2.jpg"
                        alt="Image"
                      />
                    </Link>
                  </div>
                  <div className="blog-content">
                    <div className="info-list">
                      <ul>
                        <li>
                          <i className="fa-solid fa-user" />
                          <Link to="#">Andrew Lawson</Link>
                        </li>
                        <li>
                          <i className="fa-solid fa-calendar-days" /> Feb 12,
                          2024
                        </li>
                      </ul>
                    </div>
                    <h2>
                      <Link to="/blogDetails">
                        Today From Connecting With Potential Employers
                      </Link>
                    </h2>
                    <p>
                      Lorem ipsum dolor sit amet, constetur adipiscing elit, sed
                      do eiusmod tempor incididunt.
                    </p>
                    <div className="blog-btn-info-area">
                      <Link
                        href="/blogDetails"
                        className="read-more default-btn btn"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-4 col-md-6 aos-init aos-animate"
                data-aos="fade-up"
                data-aos-duration={1200}
                data-aos-delay={400}
              >
                <div className="single-blog-card">
                  <div className="blog-img">
                    <Link to="/blogDetails">
                      <img
                        src="assets/images/blog/blog-img-6.jpg"
                        alt="Image"
                      />
                    </Link>
                  </div>
                  <div className="blog-content">
                    <div className="info-list">
                      <ul>
                        <li>
                          <i className="fa-solid fa-user" />
                          <Link to="#">Andrew Lawson</Link>
                        </li>
                        <li>
                          <i className="fa-solid fa-calendar-days" /> Feb 12,
                          2024
                        </li>
                      </ul>
                    </div>
                    <h2>
                      <Link to="/blogDetails">
                        Today From Connecting With Potential Employers
                      </Link>
                    </h2>
                    <p>
                      Lorem ipsum dolor sit amet, constetur adipiscing elit, sed
                      do eiusmod tempor incididunt.
                    </p>
                    <div className="blog-btn-info-area">
                      <Link
                        href="/blogDetails"
                        className="read-more default-btn btn"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="paginations">
              <ul>
                <li>
                  <Link to="#">
                    <i className="fa-solid fa-angle-left" />
                  </Link>
                </li>
                <li>
                  <Link className="active" to="/blogDetails">
                    1
                  </Link>
                </li>
                <li>
                  <Link to="#">2</Link>
                </li>
                <li>
                  <Link to="#">3</Link>
                </li>
                <li>
                  <Link to="#">
                    <i className="fa-solid fa-angle-right" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;
