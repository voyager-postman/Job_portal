import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance"
import { API_BASE_URL } from "../Url/Url";
import TemplateOne from "./templates/TemplateOne";
import TemplateTwo from "./templates/TemplateTwo";
import TemplateThird from "./templates/TemplateThird";
import TemplateSelector from "./TemplateSelector";
import DownloadResume from "./DownloadResume";

const ResumeBuilder = () => {
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
      // !response.data.profile.education?.length ||
      // !response.data.profile.workHistory?.length ||
      // !response.data.profile.skills?.length;

      setIncomplete(isIncomplete);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <h2>Loading...</h2>;

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
          {/* Breadcrumb Area */}
          <div className="breadcrumb-area">
            <h1>Resume Builder</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link to="/"> Home </Link>
              </li>
              <li className="item">
                <Link to="/candidate-dashboard">
                  <i className="fa-solid fa-angle-right" /> Dashboard
                </Link>
              </li>
              <li className="item">
                <i className="fa-solid fa-angle-right" /> Resume Builder
              </li>
            </ol>
          </div>
          <div>
            {/* Step 1 & 2 – Show Template Selector */}
            {!selectedTemplate && (
              <TemplateSelector setTemplate={setSelectedTemplate} />
            )}
          </div>
          {/* Step 3–5 – Preview + Edit + Download */}

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
};

const ProfileIncomplete = () => {
  return (
    <div style={{ padding: 20, background: "#ffe5e5", borderRadius: 10 }}>
      <h2>Complete your profile to build your resume</h2>

      <ul>
        <li>Personal Info</li>
        <li>Experience</li>
        <li>Education</li>
        <li>Skills</li>
      </ul>

      <button
        style={{ padding: 10, background: "black", color: "white" }}
        onClick={() => (window.location.href = "/profile")}
      >
        Go to Profile
      </button>
    </div>
  );
};

export default ResumeBuilder;
