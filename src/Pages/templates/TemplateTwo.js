import React from "react";
import { API_IMAGE_URL } from "../../Url/Url";

const TemplateTwo = ({ data }) => {
  if (!data) return null;

  const personal = data.personal || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];
  const certificates = data.certificates || [];

  return (
    <>
      {/* <!-- Second Resume Template Design start here --> */}
      <section className="second-resume-template-area">
        <div className="container">
          <div className="row">
            <div className="second-resume-all-content-details">
              <div className="row">
                <div className="col-lg-2 col-md-12">
                  <div className="second-resume-top-Img">
                    <img
                      src={
                        personal?.profileImage
                          ? `${API_IMAGE_URL}${personal.profileImage}`
                          : "assets/images/candidate-img/candidate1.jpg"
                      }
                      alt="Profile"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "assets/images/candidate-img/candidate1.jpg";
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-12">
                  <div className="second-resume-info-details">
                    <h4>
                      {personal.first_name} {personal.last_name}
                    </h4>
                    <h4>{personal?.career_goals?.DesiredJobTitle}</h4>
                    <p>
                      <i className="fa-brands fa-linkedin"></i>{" "}
                      {personal?.links?.linkedin}
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12">
                  <div className="second-resume-contact-info">
                    <p>
                      <i className="fa-solid fa-phone"></i>{" "}
                      {personal.phone || " +91 9885252855"}
                    </p>
                    <p>
                      <i className="fa-solid fa-envelope"></i> {personal.email}
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
                <div className="col-lg-12 col-md-12">
                  <div className="second-resume-profesionl-summary-area">
                    <div className="second-resume-all-summary-area">
                      <div className="second-resume-profesionl-summary">
                        <h4>
                          <i className="fa-solid fa-user"></i>Professional
                          Summary
                        </h4>
                        <div className="second-resume-profesionl-summary-content">
                          <p>{personal.professionalSummary}</p>
                        </div>
                      </div>
                      <div className="second-resume-profesionl-summary">
                        <h4>
                          <i className="fa-solid fa-bullseye"></i>Career Goals
                        </h4>
                        <div className="second-resume-profesionl-summary-content">
                          <div className="row">
                            <div className="col-lg-4 col-md-6">
                              <div className="second-resume-summary-other">
                                <h5>Desired Job Title</h5>
                                <p>{personal?.career_goals?.DesiredJobTitle}</p>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="second-resume-summary-other">
                                <h5>Employment Type</h5>
                                <p>
                                  {
                                    personal?.career_goals
                                      ?.DesiredEmploymentType
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="second-resume-summary-other">
                                <h5>Occupation Type</h5>
                                <p>
                                  {
                                    personal?.career_goals
                                      ?.DesiredOccupationType
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="second-resume-summary-other">
                                <h5>Eligible to Work In</h5>
                                <p>France</p>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="second-resume-summary-other">
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
                                  {
                                    personal?.career_goals?.MinimumDesiredSalary
                                      ?.type
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="second-resume-summary-other">
                                <h5>Job Availability</h5>
                                <p>{personal?.career_goals?.jobSearchStatus}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="second-resume-profesionl-summary">
                        <h4>
                          <i className="fa-solid fa-address-card"></i>About Your
                          Role
                        </h4>
                        <div className="second-resume-profesionl-summary-content">
                          <div className="row">
                            <div className="col-lg-4 col-md-6">
                              <div className="second-resume-summary-other">
                                <h5>Job Title</h5>
                                <p>{personal?.aboutRole?.jobTitle}</p>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="second-resume-summary-other">
                                <h5>Years of Experience</h5>
                                <p>{personal?.aboutRole?.yearOfExperience}</p>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="second-resume-summary-other">
                                <h5>Job Category</h5>
                                <p>{personal?.aboutRole?.jobCategory}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="second-resume-profesionl-summary">
                        <h4>
                          <i className="fa-solid fa-briefcase"></i>Work
                          Experience
                        </h4>
                        <div className="second-resume-profesionl-summary-content">
                          {experience.map((exp) => (
                            <div className="second-resume-summary-other">
                              <h5>{exp.jobTitle}</h5>
                              <p>
                                {new Date(exp.startDate).toLocaleDateString()} –
                                {exp.currentlyWorkingHere
                                  ? "Present"
                                  : new Date(exp.endDate).toLocaleDateString()}
                              </p>
                              <p>
                                <strong>Company:</strong> {exp.companyName}
                              </p>
                              <p>
                                <strong>Location:</strong> {exp.workLocation}
                              </p>
                              <p>
                                <strong>Employment Type:</strong>{" "}
                                {exp.EmploymentType}
                              </p>
                              <p>
                                <strong>Salary:</strong>
                                {exp?.currentSalary?.currency}{" "}
                                {exp?.currentSalary?.amount}(
                                {exp?.currentSalary?.payrollFrequency})
                              </p>
                              <h5>Achievements</h5>
                              <p>{exp?.Description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="second-resume-skill-other-summary">
                      <div className="second-resume-profesionl-summary">
                        <h4>
                          <i className="fa-solid fa-address-card"></i>Skills &
                          Technologies
                        </h4>
                        {skills.map((skill) => (
                          <div
                            className="second-resume-profesionl-summary-content"
                            key={skill._id}
                          >
                            <div className="row">
                              <div className="col-lg-3 col-md-6">
                                <div className="second-resume-summary-other">
                                  <p>{skill}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="second-resume-profesionl-summary">
                        <h4>
                          <i className="fa-solid fa-graduation-cap"></i>
                          Education
                        </h4>
                        {education.map((educ) => (
                          <div className="second-resume-profesionl-summary-content">
                            <div className="row" key={educ._id}>
                              <div className="col-lg-6 col-md-6">
                                <div className="second-resume-summary-other">
                                  <h5>Degree</h5>
                                  <p>{educ.degree}</p>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="second-resume-summary-other">
                                  <h5>University</h5>
                                  <p>{educ.University}</p>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="second-resume-summary-other">
                                  <h5>Start Date</h5>
                                  <p>
                                    {new Date(
                                      educ.startDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="second-resume-summary-other">
                                  <h5>End Date</h5>
                                  <p>
                                    {new Date(
                                      educ.endDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="second-resume-profesionl-summary">
                        <h4>
                          <i className="fa-solid fa-language"></i>Languages
                        </h4>
                        <div className="second-resume-profesionl-summary-content">
                          {languages.map((language) => (
                            <div
                              className="second-resume-summary-other"
                              key={language._id}
                            >
                              <p>
                                {language.language}: {language.proficiency}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="second-resume-profesionl-summary">
                        <h4>
                          <i className="fa-solid fa-file"></i>Certificates
                        </h4>

                        <div className="second-resume-profesionl-summary-content">
                          {certificates.map((certificate) => (
                            <div
                              className="second-resume-summary-other"
                              key={certificate._id}
                            >
                              <h5>{certificate.title}</h5>
                              <p>
                                Issue Date:{" "}
                                {new Date(
                                  certificate.issueDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="second-resume-profesionl-summary">
                        <h4>
                          <i className="fa-solid fa-share-nodes"></i>LinkedIn /
                          Portfolio
                        </h4>
                        <div className="second-resume-profesionl-summary-content">
                          <div className="second-resume-summary-other">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!--Second Resume Template Design end here --> */}
    </>
  );
};

export default TemplateTwo;
