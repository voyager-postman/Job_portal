import React from "react";
import { API_IMAGE_URL } from "../../Url/Url";

const TemplateThird = ({ data }) => {
  if (!data) return null;
  const personal = data.personal || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];
  const certificates = data.certificates || [];

  return (
    <>
      {/* <!--Third Resume Template Design start here --> */}
      <section className="third-resume-template-main-area">
        <div className="container">
          <div className="row">
            <div className="third-resume-template-top-area">
              <div className="third-resume-template-Img">
                <img
                  crossOrigin="anonymous"
                  src={
                    personal?.profileImage
                      ? personal?.profileImage.startsWith("http")
                        ? personal?.profileImage
                        : `${API_IMAGE_URL}${personal?.profileImage}`
                      : "assets/images/freelancers/freelancers-img-1.jpg"
                  }
                  alt="Profile"
                />
              </div>
              <div className="third-resume-template-text">
                <h4>
                  {personal.first_name} {personal.last_name}
                </h4>
                <h4>{personal?.career_goals?.DesiredJobTitle}</h4>
              </div>
            </div>

            <div className="third-resume-all-summary-area">
              <div className="third-resume-summary-info-area">
                <div className="third-resume-summary-content">
                  <h4>Professional Summary</h4>
                  <div className="second-resume-content-area">
                    <p>{personal.professionalSummary}</p>
                  </div>
                </div>
                <div className="third-resume-summary-content">
                  <h4>Career Goals</h4>
                  <div className="third-resume-content-area">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="third-resume-summary-other">
                          <h5>Desired Job Title</h5>
                          <p>{personal?.career_goals?.DesiredJobTitle}</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="third-resume-summary-other">
                          <h5>Employment Type</h5>
                          <p>{personal?.career_goals?.DesiredEmploymentType}</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="third-resume-summary-other">
                          <h5>Occupation Type</h5>
                          <p>{personal?.career_goals?.DesiredOccupationType}</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="third-resume-summary-other">
                          <h5>Eligible to Work In</h5>
                          <p>{personal?.eligibleToWorkInFrance === true ? "Yes" : "No"}</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="third-resume-summary-other">
                          <h5>Minimum Salary</h5>
                          <p>
                            {" "}
                            {
                              personal?.career_goals?.MinimumDesiredSalary
                                ?.currency
                            }{" "}
                            –{" "}
                            {
                              personal?.career_goals?.MinimumDesiredSalary
                                ?.amount
                            }{" "}
                            /{" "}
                            {personal?.career_goals?.MinimumDesiredSalary?.type}
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="third-resume-summary-other">
                          <h5>Job Availability</h5>
                          <p>{personal?.career_goals?.jobSearchStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="third-resume-summary-content">
                  <h4>About Your Role</h4>
                  <div className="third-resume-content-area">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="third-resume-summary-other">
                          <h5>Job Title</h5>
                          <p>{personal?.aboutRole?.jobTitle}</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="third-resume-summary-other">
                          <h5>Years of Experience</h5>
                          <p>{personal?.aboutRole?.yearOfExperience}</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="third-resume-summary-other">
                          <h5>Job Category</h5>
                          <p>{personal?.aboutRole?.jobCategory}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="third-resume-summary-content">
                  <h4>Work Experience</h4>
                  <div className="third-resume-content-area">
                    {experience.map((exp) => (
                      <>
                        <div className="row">
                          <div className="col-lg-8 col-md-6">
                            <div className="third-resume-summary-other">
                              <h5>{exp.jobTitle}</h5>
                              <h6>{exp.companyName}</h6>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="third-resume-summary-other">
                              <p>
                                {new Date(exp.startDate).toLocaleDateString()} –
                                {exp.currentlyWorkingHere
                                  ? "Present"
                                  : new Date(exp.endDate).toLocaleDateString()}
                              </p>
                              <p>{exp.workLocation}</p>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="third-resume-summary-other">
                              <p>{exp?.Description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="third-resume-summary-divder-line"></div>
                      </>
                    ))}
                  </div>
                </div>
                <div className="third-resume-summary-content">
                  <h4>Skills & Technologies</h4>
                  <div className="third-resume-content-area">
                    <div className="row">
                      {skills.map((skill) => (
                        <div className="col-lg-6 col-md-6">
                          <div className="third-resume-summary-other">
                            <p>{skill}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="third-resume-box-card-main-bg">
                {/* <div className="third-resume-box-card-bg">
                  <div className="third-resume-summary-content">
                    <h4>Skills & Technologies</h4>
                    <div className="third-resume-content-area">
                      <div className="row">
                        {skills.map((skill) => (
                          <div className="col-lg-3 col-md-6">
                            <div className="third-resume-summary-other">
                              <p>{skill}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="third-resume-box-card-bg">
                  <div className="third-resume-summary-content">
                    <h4>Education</h4>
                    <div className="third-resume-content-area">
                      <div className="row">
                        {education.map((educ) => (
                          <div className="col-lg-4 col-md-6" key={educ._id}>
                            <div className="third-resume-summary-other">
                              <h5>Degree</h5>
                              <p>{educ.degree}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="third-resume-box-card-bg">
                  <div className="third-resume-summary-content">
                    <h4>Languages</h4>
                    {languages.map((language) => (
                      <div
                        className="third-resume-summary-other"
                        key={language._id}
                      >
                        <p>
                          <strong>{language.language}:</strong>{" "}
                          {language.proficiency}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="third-resume-box-card-bg">
                  <div className="third-resume-summary-content">
                    <h4>Certificates</h4>
                    {certificates.map((certificate) => (
                      <div
                        className="third-resume-summary-other"
                        key={certificate._id}
                      >
                        <h5>{certificate.title}</h5>
                        <p>
                          Issue Date:{" "}
                          {new Date(certificate.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="third-resume-box-card-bg">
                  <div className="third-resume-summary-content">
                    <h4>LinkedIn / Portfolio</h4>
                    <div className="third-resume-summary-other">
                      <p>
                        <strong>Website:</strong>
                        <a
                          href={personal?.links?.portfolio}
                          target="_blank"
                          style={{
                            wordWrap: "break-word",
                          }}
                        >
                          {personal?.links?.portfolio}
                        </a>
                      </p>
                      <p>
                        <strong>GitHub:</strong>
                        <a
                          href={personal?.links?.github}
                          target="_blank"
                          style={{
                            wordWrap: "break-word",
                          }}
                        >
                          {personal?.links?.github}
                        </a>
                      </p>
                      <p>
                        <strong>LinkedIn:</strong>
                        <a
                          href={personal?.links?.linkedin}
                          target="_blank"
                          style={{
                            wordWrap: "break-word",
                          }}
                        >
                          {personal?.links?.linkedin}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="third-resume-box-card-bg">
                  <div className="third-resume-summary-content">
                    <h4>Contact</h4>
                    <div className="third-resume-summary-contact">
                      <p>
                        <i className="fa-solid fa-phone"></i>{" "}
                        {personal.phone || " +91 9885252855"}
                      </p>
                      <p
                        style={{
                          wordWrap: "break-word",
                        }}
                      >
                        <i className="fa-solid fa-envelope"></i>
                        {personal.email}
                      </p>
                      <p>
                        <i className="fa-solid fa-location-dot"></i>{" "}
                        {personal.city || "Brooklyn, NY 11249"}
                      </p>
                      <p>
                        <i className="fa-solid fa-globe"></i>{" "}
                        {personal.Nationality || "United States"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!--Third Resume Template Design end here --> */}
    </>
  );
};

export default TemplateThird;
