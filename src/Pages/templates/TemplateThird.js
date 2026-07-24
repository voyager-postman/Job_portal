import React from "react";
import { API_IMAGE_URL } from "../../Url/Url";
import { useTranslation } from "react-i18next";
import "./TemplateOne.css";

const TemplateThird = ({ data }) => {
  const { t } = useTranslation("global");
  if (!data) return null;
  const personal = data.personal || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];
  const certificates = data.certificates || [];

  const fullName = `${personal.first_name || ""} ${personal.last_name || ""}`.trim();
  const profileImage = personal?.profileImage
    ? personal?.profileImage.startsWith("http")
      ? personal?.profileImage
      : `${API_IMAGE_URL}${personal?.profileImage}`
    : "assets/images/freelancers/freelancers-img-1.jpg";

  return (
    <section className="professional-two-page-template template-variant-three">
      <div className="resume-page-sheet">
        <header className="resume-page-header">
          <img crossOrigin="anonymous" src={profileImage} alt="Profile" />
          <div>
            <h2>{fullName || "Candidate Name"}</h2>
            <h4>{personal?.career_goals?.DesiredJobTitle || "Professional Title"}</h4>
            <p>{personal.professionalSummary || "Professional summary not available."}</p>
          </div>
        </header>

        <div className="resume-page-grid">
          <aside>
            <div className="resume-block">
              <h5>{t("resume.contact")}</h5>
              <p>{personal.phone || "-"}</p>
              <p>{personal.email || "-"}</p>
              <p>{personal.city || "-"}</p>
              <p>{personal.Nationality || "-"}</p>
            </div>
            <div className="resume-block">
              <h5>{t("resume.skills_technologies")}</h5>
              <ul>
                {skills.map((skill, index) => (
                  <li key={`${skill}-${index}`}>{skill}</li>
                ))}
              </ul>
            </div>
          </aside>

          <main>
            <div className="resume-block">
              <h5>{t("header.Work_Experience")}</h5>
              {experience.map((exp, index) => (
                <div className="resume-item" key={`${exp.companyName}-${index}`}>
                  <h6>{exp.jobTitle || "Role"}</h6>
                  <p>{exp.companyName || "-"}</p>
                  <span>
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : "-"} -{" "}
                    {exp.currentlyWorkingHere
                      ? "Present"
                      : exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString()
                      : "-"}
                  </span>
                  <p>{exp.Description || "-"}</p>
                </div>
              ))}
            </div>

            <div className="resume-block">
              <h5>{t("resume.education")}</h5>
              {education.map((educ, index) => (
                <div className="resume-item" key={`${educ.University}-${index}`}>
                  <h6>{educ.degree || "-"}</h6>
                  <p>{educ.University || "-"}</p>
                  <span>
                    {educ.startDate ? new Date(educ.startDate).toLocaleDateString() : "-"} -{" "}
                    {educ.endDate ? new Date(educ.endDate).toLocaleDateString() : "-"}
                  </span>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      <div className="resume-page-sheet">
        <div className="resume-block">
          <h5>{t("resume.language_skills")}</h5>
          <ul>
            {languages.map((language, index) => (
              <li key={`${language.language}-${index}`}>
                {language.language}: {language.proficiency}
              </li>
            ))}
          </ul>
        </div>

        <div className="resume-block">
          <h5>Career Goals</h5>
          <div className="resume-meta-grid">
            <p>
              <strong>Desired Job Title:</strong>{" "}
              {personal?.career_goals?.DesiredJobTitle || "-"}
            </p>
            <p>
              <strong>Employment Type:</strong>{" "}
              {personal?.career_goals?.DesiredEmploymentType || "-"}
            </p>
            <p>
              <strong>Occupation Type:</strong>{" "}
              {personal?.career_goals?.DesiredOccupationType || "-"}
            </p>
            <p>
              <strong>Job Availability:</strong>{" "}
              {personal?.career_goals?.jobSearchStatus || "-"}
            </p>
          </div>
        </div>

        <div className="resume-block">
          <h5>Certificates</h5>
          {certificates.length ? (
            certificates.map((certificate, index) => (
              <div className="resume-item" key={`${certificate.title}-${index}`}>
                <h6>{certificate.title || "-"}</h6>
                <span>
                  {certificate.issueDate
                    ? new Date(certificate.issueDate).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            ))
          ) : (
            <p>No certificates added.</p>
          )}
        </div>

        <div className="resume-block">
          <h5>Professional Links</h5>
          <p>{personal?.links?.linkedin || "-"}</p>
          <p>{personal?.links?.github || "-"}</p>
          <p>{personal?.links?.portfolio || "-"}</p>
        </div>
      </div>
    </section>
  );
};

export default TemplateThird;
