import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../Url/Url";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import TemplateOne from "./templates/TemplateOne";
import TemplateTwo from "./templates/TemplateTwo";

const ResumeBuilder = () => {
  const { t } = useTranslation("global");
  const [loading, setLoading] = useState(true);
  const [incomplete, setIncomplete] = useState(false);
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
      setResumeData({
        personal: response.data.profile,
        skills: response.data.profile.skills || [],
        education: response.data.profile.education || [],
        experience: response.data.profile.workHistory || [],
        certificates: response.data.profile.certificates || [],
        languages: response.data.profile.languages || [],
        summary: response.data.profile.summary || "",
      });

      setIncomplete(!response.data.profile);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <h2>{t("header.Loading")}</h2>;

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

const BuilderScreen = ({ resumeData, template, setTemplate }) => {
  const { t } = useTranslation("global");
  return (
    <div>
      <div className="manage-jobs-box">
        <div className="p-4">
          <h3 className="mb-2">{t("resume.choose_template")}</h3>
          <button
            onClick={() => setTemplate("template1")}
            className="default-btn btn"
          >
            {t("resume.template_one")}
          </button>
          <button
            onClick={() => setTemplate("template2")}
            style={{ marginLeft: 10 }}
            className="default-btn btn"
          >
            {t("resume.template_two")}
          </button>
          <DownloadButtons />
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

const DownloadButtons = ({ data }) => {
  const { t } = useTranslation("global");
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
                new TextRun(data?.personal?.name || ""),
                new TextRun("\n"),
                new TextRun(data?.summary || ""),
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
        {t("resume.download_pdf")}
      </button>
      <button
        style={{ marginLeft: 10 }}
        onClick={downloadDocx}
        className="default-btn btn"
      >
        {t("resume.download_docx")}
      </button>
    </>
  );
};

export default ResumeBuilder;
