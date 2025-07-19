import { Link } from "react-router-dom";

function EmployerHomePage() {
  return (
    <>
      <section className="employer-slider-info-area">
        <div
          id="carouselExampleCaptions"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to={0}
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            />
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to={1}
              aria-label="Slide 2"
            />
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to={2}
              aria-label="Slide 3"
            />
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="/jobPortal/assets/images/slider/NewSlider1.jpg"
                className="d-block w-100"
                alt="..."
              />
              <div className="carousel-caption d-none d-md-block">
                <h2>Find &amp; Hire Experts for any Job</h2>
                <p>
                  Some representative placeholder content for the first slide.
                </p>
                <Link to="/employer-register" className="default-btn btn">
                  Get Start
                </Link>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="/jobPortal/assets/images/slider/NewSlider2.jpg"
                className="d-block w-100"
                alt="..."
              />
              <div className="carousel-caption d-none d-md-block">
                <h2>Recruitment And Consultation Solutions</h2>
                <p>
                  Some representative placeholder content for the second slide.
                </p>
                <a href="contact.html" className="default-btn btn">
                  Contact Us
                </a>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="/jobPortal/assets/images/slider/NewSlider3.jpg"
                className="d-block w-100"
                alt="..."
              />
              <div className="carousel-caption d-none d-md-block">
                <h2>Innovative Solutions For Your HR Needs</h2>
                <p>
                  Some representative placeholder content for the third slide.
                </p>
                <a href="contact.html" className="default-btn btn">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>
      <section className="employer-home-first-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="employer-home-first-section-img">
                <img src="/jobPortal/assets/images/employer-home/home-first-section-img.jpg" />
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="section-title">
                <h2>
                  Find The Right Employees{" "}
                  <label className="oragneColor">Easily &amp; Quickly</label>
                </h2>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore eu fugiat
                  nulla pariatur. Excepteur sint occaecat cupidatat non
                  proident, sunt in culpa qui officia deserunt mollit anim id
                  est laborum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="employer-home-second-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="section-title">
                <h2>
                  Globally Recruitment And{" "}
                  <label className="oragneColor">Consultation Solutions</label>
                </h2>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore eu fugiat
                  nulla pariatur. Excepteur sint occaecat cupidatat non
                  proident, sunt in culpa qui officia deserunt mollit anim id
                  est laborum.
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="employer-home-second-section-img">
                <img src="/jobPortal/assets/images/employer-home/new-home-second-section-img.png" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="employer-home-third-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="section-title">
                <h2>
                  Steps Of Recruitment{" "}
                  <label className="oragneColor">Process</label>
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3">
              <div className="employer-home-category-card">
                <div className="icon">
                  <i className="far fa-id-card" />
                </div>
                <h3>Identifying The Needs</h3>
                <p>Hear from industry leading HR professionals and solution</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3">
              <div className="employer-home-category-card">
                <div className="icon">
                  <i className="far fa-file-alt" />
                </div>
                <h3>Preparing A Job Description</h3>
                <p>
                  Access to all of your candidate responses and against global
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3">
              <div className="employer-home-category-card">
                <div className="icon">
                  <i className="fas fa-search" />
                </div>
                <h3>Find A Talented Candidate</h3>
                <p>
                  Companies are backing up their strategic decisions with inform
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3">
              <div className="employer-home-category-card">
                <div className="icon">
                  <i className="far fa-user" />
                </div>
                <h3>Screening And Shortlisting</h3>
                <p>
                  Make smart decisions with our guide to solution and service
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="employer-home-fourth-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="employer-home-fourth-section-img">
                <img src="/jobPortal/assets/images/employer-home/home-first-section-img.jpg" />
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="section-title">
                <h2>
                  Solving Recruitment Using Technology{" "}
                  <label className="oragneColor"> Volume Hiring</label>
                </h2>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the
                </p>
              </div>
              <div className="employer-home-fourth-box">
                <div className="employer-home-fourth-icon">
                  <i className="fa-regular fa-user" />
                </div>
                <div className="employer-home-fourth-box-content">
                  <h4>Sourcing the Best</h4>
                  <p>
                    Stay tuned for regular updates and valuable insights from
                    our team of staffing experts.
                  </p>
                </div>
              </div>
              <div className="employer-home-fourth-box">
                <div className="employer-home-fourth-icon">
                  <i className="fa-regular fa-circle-user" />
                </div>
                <div className="employer-home-fourth-box-content">
                  <h4>Volume Hiring</h4>
                  <p>
                    Stay tuned for regular updates and valuable insights from
                    our team of staffing experts.
                  </p>
                </div>
              </div>
              <div className="employer-home-fourth-bottom-content">
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EmployerHomePage;
