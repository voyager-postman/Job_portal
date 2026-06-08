export const getFileName = (file) => {
  if (!file) return "";
  if (file.name) return file.name;
  const url = typeof file === "string" ? file : file.url;
  if (!url) return "Unknown file";
  return decodeURIComponent(url.split("/").pop());
};

export const isGeneratedFileName = (name) =>
  /^\d{10,}-/.test(name) || /^\d+\.(pdf|doc|docx)$/i.test(name);

export const getDisplayFileName = (file, index, type) => {
  const raw = getFileName(file);
  if (!isGeneratedFileName(raw)) return raw;
  const ext = raw.split(".").pop();
  const label = type === "resume" ? "CV" : "Cover Letter";
  return `${label} ${index + 1}.${ext}`;
};

export const getFileIconClass = (name) => {
  const lower = (name || "").toLowerCase();
  if (lower.endsWith(".pdf")) return "fa-solid fa-file-pdf pdf";
  if (lower.endsWith(".doc") || lower.endsWith(".docx"))
    return "fa-solid fa-file-word doc";
  return "fa-solid fa-file";
};

/** CV required, or optional combined custom file. Cover letter is optional. */
export const canApplySelection = ({
  selectedCustomFile,
  selectedResumeUrl,
}) =>
  !!(selectedCustomFile || selectedResumeUrl);
