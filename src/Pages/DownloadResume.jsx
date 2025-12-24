import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import HTMLDocx from "html-docx-js/dist/html-docx";
import { saveAs } from "file-saver";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell
} from "docx";

const DownloadResume = () => {
  const downloadPDF = async () => {
    const element = document.querySelector(".resume-preview");
    const canvas = await html2canvas(element);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("resume.pdf");
  };

// const downloadDOCX = () => {
//   const element = document.querySelector(".resume-preview");
//   if (!element) return;

//   const html = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="UTF-8" />
//         <style>
//           @page { size: A4; margin: 20mm; }
//           body { font-family: Calibri, Arial; font-size: 11pt; }
//           table { width: 100%; border-collapse: collapse; }
//         </style>
//       </head>
//       <body>
//         ${element.outerHTML}
//       </body>
//     </html>
//   `;

//   const blob = HTMLDocx.asBlob(html);
//   saveAs(blob, "resume.docx");
// };


  return (
    <>
      <div className="manage-jobs-box">
        <div className="p-4">
          <button onClick={downloadPDF} className="default-btn btn">
            Download PDF{" "}
          </button>
          {/* <button
            onClick={downloadDOCX}
            style={{ marginLeft: 10 }}
            className="default-btn btn"
          >
            Download DOCX
          </button> */}
        </div>
      </div>
    </>
  );
};

export default DownloadResume;