import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../Services/axios";
import { API_BASE_URL } from "../Url/Url";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import TemplateOne from "./templates/TemplateOne";
import TemplateTwo from "./templates/TemplateTwo";

const ResumeBuilder = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [incomplete, setIncomplete] = useState(false);
  const [educationList, setEducationList] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [personalDetails, setPersonalDetails] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [template, setTemplate] = useState("template1");

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
          <div style={{ padding: 30 }}>
            {incomplete ? (
              <ProfileIncomplete />
            ) : (
              <BuilderScreen
                resumeData={resumeData}
                setResumeData={setResumeData}
                template={template}
                setTemplate={setTemplate}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// STEP 2 — Incomplete Profile Screen
//
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

//
// STEP 3 — Builder Layout
//
const BuilderScreen = ({
  resumeData,
  setResumeData,
  template,
  setTemplate,
}) => {
  return (
    <div>
      <div className="manage-jobs-box">
        <div className="p-4">
          <h3 className="mb-2">Choose Template</h3>
          <button
            onClick={() => setTemplate("template1")}
            className="default-btn btn"
          >
            Template One
          </button>
          <button
            onClick={() => setTemplate("template2")}
            style={{ marginLeft: 10 }}
            className="default-btn btn"
          >
            Template Two
          </button>
          <DownloadButtons />
          {/* <DownloadButtons data={resumeData} /> */}
        </div>
      </div>

      <div className="manage-jobs-box">
        <div className="job-listing-search-form job-search-info-area">
          {template === "template1" && <TemplateOne data={resumeData} />}
          {template === "template2" && <TemplateTwo data={resumeData} />}
        </div>
      </div>
    </div>
  );
};

//
// STEP 4 — Editor
//
// const ResumeEditor = ({ data, setData }) => {
//   const update = (field, value) => {
//     setData({ ...data, [field]: value });
//   };

//   return (
//     <div style={{ marginBottom: 20 }}>
//       <h2>Edit Resume</h2>

//       <textarea
//         value={data.summary}
//         onChange={(e) => update("summary", e.target.value)}
//         placeholder="Summary"
//         style={{ width: "100%", height: 80 }}
//       />

//       <button
//         onClick={() => update("projectsEnabled", !data.projectsEnabled)}
//         style={{ marginTop: 10 }}
//       >
//         Toggle Projects Section
//       </button>
//     </div>
//   );
// };

//
// STEP 6 — Download PDF + DOCX
//
const DownloadButtons = ({ data }) => {
  const downloadPDF = () => {
    const element = document.querySelector(".resume-preview");

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      pdf.save("resume.pdf");
    });
  };

  const downloadDocx = () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun(data.personal.name),
                new TextRun("\n"),
                new TextRun(data.summary),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "resume.docx");
    });
  };

  return (
    <>
      <button
        style={{ marginLeft: 10 }}
        onClick={downloadPDF}
        className="default-btn btn"
      >
        Download PDF
      </button>
      <button
        style={{ marginLeft: 10 }}
        onClick={downloadDocx}
        className="default-btn btn"
      >
        Download DOCX
      </button>
    </>
  );
};

export default ResumeBuilder;
