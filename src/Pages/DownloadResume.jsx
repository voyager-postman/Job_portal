import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const DownloadResume = () => {
  const downloadPDF = async () => {
    const element = document.querySelector(".resume-preview");
    const canvas = await html2canvas(element);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("resume.pdf");
  };

  const downloadDOCX = () => {
    const doc = new Document({
      sections: [
        {
          children: [new Paragraph("Resume Export Example")],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "resume.docx");
    });
  };

  return (
    <>
      <div className="manage-jobs-box">
        <div className="p-4">
          <button onClick={downloadPDF} className="default-btn btn">
            Download PDF{" "}
          </button>
          <button
            onClick={downloadDOCX}
            style={{ marginLeft: 10 }}
            className="default-btn btn"
          >
            Download DOCX
          </button>
        </div>
      </div>
    </>
  );
};

export default DownloadResume;
