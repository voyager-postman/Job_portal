import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../Url/Url";
import TemplateOne from "./templates/TemplateOne";
import TemplateTwo from "./templates/TemplateTwo";
import TemplateThird from "./templates/TemplateThird";
import TemplateSelector from "./TemplateSelector";
import DownloadResume from "./DownloadResume";

const ResumeBuilder = () => {
  const { t } = useTranslation("global");
  const [loading, setLoading] = useState(true);
  const [incomplete, setIncomplete] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}candidate/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setResumeData({
        personal: response.data.profile,
        skills: response.data.profile.skills || [],
        links: response.data.profile.links || [],
        education: response.data.profile.education || [],
        experience: response.data.profile.workHistory || [],
        certificates: response.data.profile.certificates || [],
        languages: response.data.profile.languages || [],
        summary: response.data.profile.summary || "",
      });

      const isIncomplete = !response.data.profile;

      setIncomplete(isIncomplete);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <h2>{t("header.Loading")}</h2>;

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "t1":
        return <TemplateOne data={resumeData} />;
      case "t2":
        return <TemplateTwo data={resumeData} />;
      case "t3":
        return <TemplateThird data={resumeData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="main-dashboard-content d-flex flex-column">
        <div className="responsive-content">
          <div className="breadcrumb-area">
            <h1>{t("sidebar.resume_builder")}</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/"> {t("header.home")} </Link>
              </li>
              <li className="item">
                <Link to="/candidate-dashboard">
                  <i className="fa-solid fa-angle-right" /> {t("header.dashboard")}
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> {t("sidebar.resume_builder")}
              </li>
            </ol>
          </div>
          <div>
            {!selectedTemplate && (
              <TemplateSelector setTemplate={setSelectedTemplate} />
            )}
          </div>

          {selectedTemplate && (
            <>
              <div className="manage-jobs-box">
                <DownloadResume />
              </div>
              <div
                style={{ display: "flex", gap: 20 }}
                className="manage-jobs-box"
              >
                <div className="resume-preview" style={{ width: "100%" }}>
                  {renderTemplate()}
                </div>
              </div>
            </>
          )}

          <div className="copy-right-area bg-f0f4fc">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="copyright-left-content">
                  <p>
                    {" "}
                    <span className="copy">© </span>
                    <span id="year" />
                    <span className="template-name"> {t("header.Connect_Work")} </span>{" "}
                    {t("header.All_Rights_Reserved")}
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="copyright-right-content">
                  <p>
                    {t("header.Designed_By")}{" "}
                    <a href="https://hibootstrap.com/" target="_blank">
                      {t("header.Webnmobapps_Solution_Pvt_Ltd")}
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
};

const ProfileIncomplete = () => {
  const { t } = useTranslation("global");
  return (
    <div style={{ padding: 20, background: "#ffe5e5", borderRadius: 10 }}>
      <h2>{t("resume.complete_profile_title")}</h2>

      <ul>
        <li>{t("resume.personal_info")}</li>
        <li>{t("resume.experience")}</li>
        <li>{t("resume.education")}</li>
        <li>{t("resume.skills")}</li>
      </ul>

      <button
        style={{ padding: 10, background: "black", color: "white" }}
        onClick={() => (window.location.href = "/profile")}
      >
        {t("resume.go_to_profile")}
      </button>
    </div>
  );
};

export default ResumeBuilder;
