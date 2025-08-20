import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
function EmployerShortListCandinate() {
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Employer shortlist candidates</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/employer-dashboard">Home </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Dashboard
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Employer shortlist
                candidates
              </li>
            </ol>
          </div>
          {/* End Breadcrumb Area */}
          {/*Start Bookmark Jobs Area*/}
          <div className="applied-shorting-content">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-5">
                <div className="employer-shortlist-candidates-heading">
                  <h4>15 Employer shortlist candidates</h4>
                </div>
              </div>
              <div className="col-lg-4 col-md-7">
                <div className="shorting-right-content">
                  <div className="row">
                    <div className="col-6">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>All Jobs</option>
                        <option value={1}>UI/UX Designer</option>
                        <option value={2}>Magento Developer</option>
                        <option value={3}>App Developer</option>
                        <option value={4}>Product Designer</option>
                        <option value={5}>WordPress Developer</option>
                        <option value={6}>Content Writer</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                      >
                        <option selected>Show 20</option>
                        <option value={1}>01</option>
                        <option value={2}>02</option>
                        <option value={3}>03</option>
                        <option value={4}>04</option>
                        <option value={5}>05</option>
                        <option value={6}>06</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div
              className="col-lg-6 col-sm-6"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="candidate-list-info single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <a href="candidates-profile-details.html">
                        <img
                          src="assets/images/freelancers/freelancers-img-1.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="candidates-profile-details.html">
                        <h3>Jequline Fenda</h3>
                      </a>
                      <span>IT Developer</span>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" /> 5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 2000
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            Washington DC, US
                          </li>
                          <li>
                            <i className="fa-solid fa-graduation-cap" />
                            Master’s Degree
                          </li>
                          <li>
                            <i className="fa-solid fa-gear" />
                            <span className="candidate-active">Active</span>
                          </li>
                        </ul>
                      </div>
                      <div className="candidate-list-shortlist-candidates">
                        <i className="fa-solid fa-heart" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 col-sm-6"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="candidate-list-info single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <a href="candidates-profile-details.html">
                        <img
                          src="assets/images/freelancers/freelancers-img-2.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="candidates-profile-details.html">
                        <h3>Jequline Fenda</h3>
                      </a>
                      <span>IT Developer</span>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" /> 5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 2000
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            Washington DC, US
                          </li>
                          <li>
                            <i className="fa-solid fa-graduation-cap" />
                            Master’s Degree
                          </li>
                          <li>
                            <i className="fa-solid fa-gear" />
                            <span className="candidate-inactive">inactive</span>
                          </li>
                        </ul>
                      </div>
                      <div className="candidate-list-shortlist-candidates">
                        <i className="fa-solid fa-heart" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 col-sm-6 aos-init"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={600}
            >
              <div className="candidate-list-info single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <a href="candidates-details.html">
                        <img
                          src="assets/images/freelancers/freelancers-img-3.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="candidates-details.html">
                        <h3>Jequline Fenda</h3>
                      </a>
                      <span>IT Developer</span>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" /> 5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 2000
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            Washington DC, US
                          </li>
                          <li>
                            <i className="fa-solid fa-graduation-cap" />
                            Master’s Degree
                          </li>
                          <li>
                            <i className="fa-solid fa-gear" />
                            <span className="candidate-active">Active</span>
                          </li>
                        </ul>
                      </div>
                      <div className="candidate-list-shortlist-candidates">
                        <i className="fa-solid fa-heart" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 col-sm-6 aos-init"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={800}
            >
              <div className="candidate-list-info single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <a href="candidates-details.html">
                        <img
                          src="assets/images/freelancers/freelancers-img-4.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="candidates-details.html">
                        <h3>Jequline Fenda</h3>
                      </a>
                      <span>IT Developer</span>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" /> 5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 2000
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            Washington DC, US
                          </li>
                          <li>
                            <i className="fa-solid fa-graduation-cap" />
                            Master’s Degree
                          </li>
                          <li>
                            <i className="fa-solid fa-gear" />
                            <span className="candidate-inactive">inactive</span>
                          </li>
                        </ul>
                      </div>
                      <div className="candidate-list-shortlist-candidates">
                        <i className="fa-solid fa-heart" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 col-sm-6 aos-init"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={200}
            >
              <div className="candidate-list-info single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <a href="candidates-details.html">
                        <img
                          src="assets/images/freelancers/freelancers-img-6.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="candidates-details.html">
                        <h3>Jequline Fenda</h3>
                      </a>
                      <span>IT Developer</span>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" /> 5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 2000
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            Washington DC, US
                          </li>
                          <li>
                            <i className="fa-solid fa-graduation-cap" />
                            Master’s Degree
                          </li>
                          <li>
                            <i className="fa-solid fa-gear" />
                            <span className="candidate-active">Active</span>
                          </li>
                        </ul>
                      </div>
                      <div className="candidate-list-shortlist-candidates">
                        <i className="fa-solid fa-heart" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 col-sm-6 aos-init"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={400}
            >
              <div className="candidate-list-info single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <a href="candidates-details.html">
                        <img
                          src="assets/images/freelancers/freelancers-img-5.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="candidates-details.html">
                        <h3>Jequline Fenda</h3>
                      </a>
                      <span>IT Developer</span>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" /> 5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 2000
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            Washington DC, US
                          </li>
                          <li>
                            <i className="fa-solid fa-graduation-cap" />
                            Master’s Degree
                          </li>
                          <li>
                            <i className="fa-solid fa-gear" />
                            <span className="candidate-inactive">inactive</span>
                          </li>
                        </ul>
                      </div>
                      <div className="candidate-list-shortlist-candidates">
                        <i className="fa-solid fa-heart" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 col-sm-6 aos-init"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={600}
            >
              <div className="candidate-list-info single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <a href="candidates-details.html">
                        <img
                          src="assets/images/freelancers/freelancers-img-15.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="candidates-details.html">
                        <h3>Jequline Fenda</h3>
                      </a>
                      <span>IT Developer</span>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" /> 5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 2000
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            Washington DC, US
                          </li>
                          <li>
                            <i className="fa-solid fa-graduation-cap" />
                            Master’s Degree
                          </li>
                          <li>
                            <i className="fa-solid fa-gear" />
                            <span className="candidate-inactive">inactive</span>
                          </li>
                        </ul>
                      </div>
                      <div className="candidate-list-shortlist-candidates">
                        <i className="fa-solid fa-heart" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 col-sm-6 aos-init"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={600}
            >
              <div className="candidate-list-info single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <a href="candidates-details.html">
                        <img
                          src="assets/images/freelancers/freelancers-img-16.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="candidates-details.html">
                        <h3>Jequline Fenda</h3>
                      </a>
                      <span>IT Developer</span>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" /> 5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 2000
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            Washington DC, US
                          </li>
                          <li>
                            <i className="fa-solid fa-graduation-cap" />
                            Master’s Degree
                          </li>
                          <li>
                            <i className="fa-solid fa-gear" />
                            <span className="candidate-active">Active</span>
                          </li>
                        </ul>
                      </div>
                      <div className="candidate-list-shortlist-candidates">
                        <i className="fa-solid fa-heart" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 col-sm-6 aos-init"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={600}
            >
              <div className="candidate-list-info single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <a href="candidates-details.html">
                        <img
                          src="assets/images/freelancers/freelancers-img-17.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="candidates-details.html">
                        <h3>Jequline Fenda</h3>
                      </a>
                      <span>IT Developer</span>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" /> 5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 2000
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            Washington DC, US
                          </li>
                          <li>
                            <i className="fa-solid fa-graduation-cap" />
                            Master’s Degree
                          </li>
                          <li>
                            <i className="fa-solid fa-gear" />
                            <span className="candidate-active">Active</span>
                          </li>
                        </ul>
                      </div>
                      <div className="candidate-list-shortlist-candidates">
                        <i className="fa-solid fa-heart" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-6 col-sm-6 aos-init"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={600}
            >
              <div className="candidate-list-info single-freelancer-card">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="freelancer-img">
                      <a href="candidates-details.html">
                        <img
                          src="assets/images/freelancers/freelancers-img-18.jpg"
                          alt="Image"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="freelancer-content">
                      <a href="candidates-details.html">
                        <h3>Jequline Fenda</h3>
                      </a>
                      <span>IT Developer</span>
                      <div className="info">
                        <ul>
                          <li>
                            <i className="fa-solid fa-file" /> 5 Years
                          </li>
                          <li>
                            <i className="fa-solid fa-money-bill" />$ 2000
                          </li>
                          <li>
                            <i className="fa-solid fa-location-dot" />
                            Washington DC, US
                          </li>
                          <li>
                            <i className="fa-solid fa-graduation-cap" />
                            Master’s Degree
                          </li>
                          <li>
                            <i className="fa-solid fa-gear" />
                            <span className="candidate-inactive">inactive</span>
                          </li>
                        </ul>
                      </div>
                      <div className="candidate-list-shortlist-candidates">
                        <i className="fa-solid fa-heart" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="paginations style2 mb-30">
            <ul>
              <li>
                <a href="#">
                  <i className="fa-solid fa-angle-left" />
                </a>
              </li>
              <li>
                <a className="active" href="applied-jobs.html">
                  1
                </a>
              </li>
              <li>
                <a href="#">2</a>
              </li>
              <li>
                <a href="#">3</a>
              </li>
              <li>
                <a href="#">
                  <i className="fa-solid fa-angle-right" />
                </a>
              </li>
            </ul>
          </div>
          {/*End Bookmark Jobs Area*/}
          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name"> Connect Work.ma </span> All
                    Rights Reserved
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    Designed By{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      Webnmobapps Solution Pvt. Ltd
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployerShortListCandinate;
