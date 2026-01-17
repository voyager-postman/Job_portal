import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import HTMLDocx from "html-docx-js/dist/html-docx";
import { saveAs } from "file-saver";

const DownloadResume = () => {
  const downloadPDF = async () => {
    const element = document.querySelector(".resume-preview");
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      scale: 2,
      backgroundColor: '#ffffff'
    });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("resume.pdf");
  };

  return (
    <>
      <div className="manage-jobs-box">
        <div className="p-4">
          <button onClick={downloadPDF} className="default-btn btn">
            Download PDF{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default DownloadResume;
