import React from "react";
import { API_IMAGE_URL } from "../../Url/Url";

const TemplateOne = ({ data }) => {
  if (!data) return null;

  const personal = data.personal || {};
  const experience = data.experience || [];
  const education = data.education || [];
  // const skills = data.skills || [];
  const languages = data.languages || [];
  const certificates = data.certificates || [];

  return (
    <>
      {/* <!-- Second Resume Template Design start here --> */}
      <section className="first-resume-template-area">
        <div className="container">
          <div className="row">
            <div className="resume-template-content-area">
              {/* <!-- LEFT SIDE --> */}
              <div className="second-resume-template-left-side">
                <div className="resume-template-user-Img">
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

                <div className="second-resume-candidate-short-details">
                  <h4>
                    {personal.first_name} {personal.last_name}
                  </h4>
                  <h4>{personal?.career_goals?.DesiredJobTitle}</h4>
                </div>

                <div className="second-resume-candidate-contact">
                  <h4>Contact</h4>
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
                  <p>
                    <i className="fa-brands fa-linkedin"></i>{" "}
                    {personal?.links?.linkedin}
                  </p>
                </div>

                <div className="second-resume-candidate-contact">
                  <h4>Certificates</h4>
                  {certificates.map((certificate) => (
                    <p key={certificate._id}>
                      <i className="fa-solid fa-file"></i> {certificate.title}
                    </p>
                  ))}
                </div>

                <div className="second-resume-candidate-contact">
                  <h4>Languages</h4>
                  {languages.map((language) => (
                    <div key={language._id}>
                      <p>
                        <i className="fa-solid fa-language"></i>{" "}
                        {language.language}: {language.proficiency}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="second-resume-candidate-contact">
                  <h4>LinkedIn / Portfolio</h4>
                  <p
                    style={{
                      wordWrap: "break-word",
                    }}
                  >
                    <i className="fa-brands fa-linkedin"></i>
                    <span>{personal?.links?.linkedin}</span>
                  </p>
                  <p
                    style={{
                      wordWrap: "break-word",
                    }}
                  >
                    <i className="fa-brands fa-github"></i>{" "}
                    <span>{personal?.links?.github}</span>
                  </p>
                  <p
                    style={{
                      wordWrap: "break-word",
                    }}
                  >
                    <i className="fa-solid fa-globe"></i>{" "}
                    <span>{personal?.links?.portfolio}</span>
                  </p>
                </div>
              </div>

              {/* <!-- RIGHT SIDE --> */}
              <div className="second-resume-template-right-side">
                {/* <!-- PROFESSIONAL SUMMARY --> */}
                <div className="resume-template-details">
                  <h4>Professional Summary</h4>
                  <div className="second-resume-template-line"></div>
                  <p>{personal.professionalSummary}</p>
                </div>

                {/* <!-- CAREER GOALS --> */}
                <div className="resume-template-details">
                  <h4>Career Goals</h4>
                  <div className="second-resume-template-line"></div>

                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <h5>Desired Job Title</h5>
                      <p>{personal?.career_goals?.DesiredJobTitle}</p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <h5>Employment Type</h5>
                      <p>{personal?.career_goals?.DesiredEmploymentType}</p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <h5>Occupation Type</h5>
                      <p>{personal?.career_goals?.DesiredOccupationType}</p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <h5>Eligible to Work In</h5>
                      <p>France</p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <h5>Minimum Salary</h5>
                      <p>
                        {personal?.career_goals?.MinimumDesiredSalary?.currency}{" "}
                        – {personal?.career_goals?.MinimumDesiredSalary?.amount}{" "}
                        / {personal?.career_goals?.MinimumDesiredSalary?.type}
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <h5>Job Availability</h5>
                      <p>{personal?.career_goals?.jobSearchStatus}</p>
                    </div>
                  </div>
                </div>

                {/* <!-- ROLE DETAILS --> */}
                <div className="resume-template-details">
                  <h4>About Your Role</h4>
                  <div className="second-resume-template-line"></div>

                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <h5>Job Title</h5>
                      <p>{personal?.aboutRole?.jobTitle}</p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <h5>Years of Experience</h5>
                      <p>{personal?.aboutRole?.yearOfExperience}</p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <h5>Job Category</h5>
                      <p>{personal?.aboutRole?.jobCategory}</p>
                    </div>
                  </div>
                </div>

                {/* <!-- WORK EXPERIENCE --> */}
                <div className="resume-template-details">
                  <h4>Work Experience</h4>
                  <div className="second-resume-template-line"></div>
                  {experience.map((exp, index) => (
                    <div key={index}>
                      <h5>{exp.jobTitle}</h5>
                      <p>
                        {new Date(exp.startDate).toLocaleDateString()} –
                        {exp.currentlyWorkingHere
                          ? "Present"
                          : new Date(exp.endDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Company:</strong>
                        {exp.companyName}
                      </p>
                      <p>
                        <strong>Location:</strong> {exp.workLocation}
                      </p>
                      <p>
                        <strong>Employment Type:</strong> {exp.EmploymentType}
                      </p>
                      <p>
                        <strong>Salary:</strong>
                        {exp?.currentSalary?.currency}{" "}
                        {exp?.currentSalary?.amount}(
                        {exp?.currentSalary?.payrollFrequency})
                      </p>
                      {/* <h5>Description</h5>
                      <p>
                        Dynamic agricultural company serving farmers, exporters,
                        and wholesale markets.
                      </p> */}

                      <h5>Achievements</h5>
                      <p>{exp?.Description}</p>
                    </div>
                  ))}
                </div>

                {/* <!-- EDUCATION --> */}
                <div className="resume-template-details">
                  <h4>Education</h4>
                  <div className="second-resume-template-line"></div>
                  {education.map((educ) => (
                    <div className="row" key={educ._id}>
                      <div className="col-lg-6 col-md-6">
                        <h5>Degree</h5>
                        <p>{educ.degree}</p>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <h5>University</h5>
                        <p>{educ.University}</p>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <h5>Start Date</h5>
                        <p>{new Date(educ.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <h5>End Date</h5>
                        <p>{new Date(educ.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
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

export default TemplateOne;
