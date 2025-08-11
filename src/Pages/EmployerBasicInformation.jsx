import { Link, useNavigate } from "react-router-dom";
const EmployerBasicInformation = () => {
  const navigate = useNavigate();
  const employerLoginPage = () => {
    navigate("/your-job-posts");
  };

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
                  <h2>Employer Basic Info</h2>
                  <ul>
                    <li class="menu-divide-arrow">
                      <Link to="/">Home</Link>
                    </li>
                    <li>Employer Basic Info</li>
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
            <h1>Employer Basic Info</h1>
            <ul>
              <li>
                <a href="index.html">Home</a>
              </li>
              <li>Employer Basic Info</li>
            </ul>
          </div>
        </div>
      </div> */}
      <section className="employer-profile-basic-info-area">
        <div className="employer-profile-basic-info-heading">
          <div className="section-title">
            <h2>
              Employer Profile <label className="oragneColor">Basic Info</label>{" "}
            </h2>
            <p>
              These fields are mandatory before you publish a job post.
              <br />
              You can change them, if needed, anytime.
            </p>
          </div>
        </div>
        <div className="employer-profile-basic-info-form">
          <div className="container">
            <div className="employer-personal-info-area">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Brand name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Brand name"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>VAT</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="VAT"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Industry</label>
                    <select
                      name="cars"
                      className="form-select form-control"
                      aria-label="Default2 select example"
                      id="Industry"
                    >
                      <option value="volvo">Select Industry</option>
                      <option value="volvo">Automobile Industry</option>
                      <option value="saab">Technology Industry</option>
                      <option value="opel">Healthcare Industry</option>
                      <option value="audi">Financial Services Industry</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Number of Employees</label>
                    <select
                      name="cars"
                      className="form-select form-control"
                      aria-label="Default2 select example"
                      id="Industry"
                    >
                      <option value="volvo">Select Number Of Employees</option>
                      <option value="saab">1-15</option>
                      <option value="opel">16-50</option>
                      <option value="audi">51-100</option>
                      <option value="audi">100-150</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12">
                  <div className="form-group">
                    <label>Country code</label>
                    <select
                      name="cars"
                      className="form-select form-control"
                      aria-label="Default2 select example"
                      id="Industry"
                    >
                      <option value="volvo">Country code</option>
                      <option value="saab">+15</option>
                      <option value="opel">+50</option>
                      <option value="audi">+100</option>
                      <option value="audi">+150</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-9 col-md-12">
                  <div className="form-group">
                    <label>Phone number</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Street Address"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="City"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>State</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Country"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Our Map Location</label>
                    <div className="employer-our-map-location">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224356.85923192592!2d77.23701088488971!3d28.522404036526275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1752211574568!5m2!1sen!2sin"
                        width="100%"
                        height={500}
                        style={{ border: "0" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </div>
                <div className="employer-personal-info-btn">
                  <button
                    type="button"
                    className="default-btn btn"
                    onClick={employerLoginPage}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EmployerBasicInformation;
