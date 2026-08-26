import jsPDF from "jspdf";
import { saveAs } from "file-saver";

const escapeCsv = (value) => {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const toCsv = (rows) =>
  rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");

const stamp = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
};

const formatPeriodLabel = ({ filter, startDate, endDate }) => {
  if (filter === "custom" && startDate && endDate) {
    const s = startDate.toISOString?.().split("T")[0] || String(startDate);
    const e = endDate.toISOString?.().split("T")[0] || String(endDate);
    return `Custom (${s} to ${e})`;
  }
  return String(filter || "week");
};

/**
 * Builds structured sections for recruiter dashboard KPI export.
 */
export const buildDashboardReportSections = ({
  stats,
  jobs = [],
  companyName = "",
  filter = "week",
  startDate,
  endDate,
}) => {
  const overview = stats?.overview || {};
  const ats = stats?.atsFlow || {};
  const funnel = stats?.funnel || {};
  const performance = stats?.performance || {};
  const period = formatPeriodLabel({ filter, startDate, endDate });

  const meta = [
    ["Report", "Employer Dashboard KPIs"],
    ["Company", companyName || "-"],
    ["Period", period],
    ["Generated At", new Date().toLocaleString()],
  ];

  const overviewRows = [
    ["Metric", "Value"],
    ["Total Jobs", overview.totalJobs ?? 0],
    ["Jobs % Change", overview.jobsPercentage ?? 0],
    ["Total Applicants", overview.totalApplicants ?? 0],
    ["Applicants % Change", overview.applicantsPercentage ?? 0],
  ];

  const atsRows = [
    ["ATS Stage", "Count"],
    ["New", ats.New ?? 0],
    ["Preselected", ats.Preselected ?? 0],
    ["Contacted", ats.Contacted ?? 0],
    ["HR Interview", ats.HRInterview ?? 0],
    ["Tech Interview", ats.TechInterview ?? 0],
    ["Offered", ats.Offered ?? 0],
    ["Hired", ats.Hired ?? 0],
    ["Rejected", ats.Rejected ?? 0],
  ];

  const funnelRows = [
    ["Pipeline Step", "Count"],
    ["Views", funnel.uniqueViews ?? 0],
    ["Clicks", funnel.uniqueClicks ?? 0],
    ["Applied", funnel.applied ?? 0],
    ["Hired", funnel.hired ?? 0],
  ];

  const labels = performance.labels || [];
  const views = performance.views || [];
  const applications = performance.applications || [];
  const performanceRows = [
    ["Date / Label", "Views", "Applications"],
    ...labels.map((label, i) => [
      label,
      views[i] ?? 0,
      applications[i] ?? 0,
    ]),
  ];

  const jobRows = [
    ["S.No", "Job Title", "Location", "Employment Type", "Views"],
    ...jobs.map((job, index) => [
      index + 1,
      job?.jobTitle || job?.title || "-",
      Array.isArray(job?.city)
        ? job.city.join(", ")
        : job?.location || job?.city || "-",
      Array.isArray(job?.employmentType)
        ? job.employmentType.map((x) => x?.name || x).join(", ")
        : job?.employmentType?.name || job?.employmentType || "-",
      job?.uniqueViews ?? job?.views ?? job?.totalUniqueViews ?? 0,
    ]),
  ];

  return {
    fileBase: `dashboard_report_${stamp()}`,
    period,
    companyName,
    meta,
    sections: [
      { title: "Overview", rows: overviewRows },
      { title: "ATS Flow Stats", rows: atsRows },
      { title: "Recruitment Pipeline", rows: funnelRows },
      { title: "Job Views vs Applications", rows: performanceRows },
      { title: "Job Overview", rows: jobRows },
    ],
  };
};

export const exportDashboardCsv = (report) => {
  const blocks = [
    ...report.meta.map((row) => row.join(",")),
    "",
    ...report.sections.flatMap((section) => [
      section.title,
      toCsv(section.rows),
      "",
    ]),
  ];
  const blob = new Blob(["\uFEFF" + blocks.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  saveAs(blob, `${report.fileBase}.csv`);
};

export const exportDashboardExcel = (report) => {
  const tableHtml = report.sections
    .map((section) => {
      const body = section.rows
        .map((row, rowIndex) => {
          const cells = row
            .map((value) => {
              const tag = rowIndex === 0 ? "th" : "td";
              return `<${tag}>${String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")}</${tag}>`;
            })
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");
      return `<h3>${section.title}</h3><table border="1">${body}</table><br/>`;
    })
    .join("");

  const metaHtml = report.meta
    .map(
      ([k, v]) =>
        `<tr><td><b>${k}</b></td><td>${String(v ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</td></tr>`,
    )
    .join("");

  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8" /></head>
<body>
  <h2>Employer Dashboard Report</h2>
  <table border="1">${metaHtml}</table>
  <br/>
  ${tableHtml}
</body>
</html>`;

  const blob = new Blob(["\uFEFF" + html], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  saveAs(blob, `${report.fileBase}.xls`);
};

export const exportDashboardPdf = (report) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const margin = 14;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  let y = 16;

  const ensureSpace = (needed = 8) => {
    if (y + needed > pdf.internal.pageSize.getHeight() - 14) {
      pdf.addPage();
      y = 16;
    }
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Employer Dashboard Report", margin, y);
  y += 8;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  report.meta.forEach(([key, value]) => {
    ensureSpace(6);
    pdf.text(`${key}: ${value}`, margin, y);
    y += 6;
  });
  y += 4;

  report.sections.forEach((section) => {
    ensureSpace(10);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(section.title, margin, y);
    y += 6;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);

    section.rows.forEach((row) => {
      const line = row.map((cell) => String(cell ?? "")).join(" | ");
      const wrapped = pdf.splitTextToSize(line, maxWidth);
      ensureSpace(wrapped.length * 4.5 + 2);
      pdf.text(wrapped, margin, y);
      y += wrapped.length * 4.5 + 1;
    });
    y += 4;
  });

  pdf.save(`${report.fileBase}.pdf`);
};
