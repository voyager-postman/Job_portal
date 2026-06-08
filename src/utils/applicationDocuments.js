import { toast } from "react-toastify";
import { API_IMAGE_URL } from "../Url/Url";
import {
  isProtectedDocumentPath,
  openProtectedDocument,
} from "./protectedFile";

const normalizeDocumentValue = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (typeof value === "object") {
    if (value.url) return normalizeDocumentValue(value.url);
    if (value.path) return normalizeDocumentValue(value.path);
  }

  return null;
};

export const resolveApplicationFileUrl = (value) => {
  const path = normalizeDocumentValue(value);
  if (!path) return null;

  if (/^https?:\/\//i.test(path)) return path;

  const base = (API_IMAGE_URL || "").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

export const getApplicantCvUrl = (applicant) => {
  if (!applicant) return null;

  const cv = resolveApplicationFileUrl(applicant.cv);
  if (cv) return cv;

  return resolveApplicationFileUrl(applicant.customResume);
};

export const getApplicantCvSource = (applicant) => {
  if (!applicant) return null;
  return applicant.cv || applicant.customResume || null;
};

const documentPathKey = (value) => {
  const path = normalizeDocumentValue(value);
  if (!path) return null;

  const withoutQuery = path.split("?")[0].toLowerCase();

  try {
    return new URL(withoutQuery, "http://local").pathname;
  } catch {
    return withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  }
};

const collectCoverLetterEntries = (coverLetter) => {
  if (coverLetter == null) return [];
  if (Array.isArray(coverLetter)) return coverLetter;
  return [coverLetter];
};

export const getApplicantCoverLetterUrl = (applicant) => {
  if (!applicant) return null;

  const cvPathKey =
    documentPathKey(applicant.cv) ||
    documentPathKey(applicant.customResume);

  const entries = collectCoverLetterEntries(applicant.coverLetter);

  for (let i = entries.length - 1; i >= 0; i -= 1) {
    const entry = entries[i];
    const url = resolveApplicationFileUrl(entry);
    if (!url) continue;

    const coverPathKey = documentPathKey(entry);
    if (cvPathKey && coverPathKey && coverPathKey === cvPathKey) {
      continue;
    }

    return url;
  }

  return null;
};

export const hasApplicantCoverLetter = (applicant) =>
  Boolean(getApplicantCoverLetterUrl(applicant));

export const getApplicantCoverLetterSource = (applicant) => {
  if (!applicant) return null;

  const cvPathKey =
    documentPathKey(applicant.cv) ||
    documentPathKey(applicant.customResume);

  const entries = collectCoverLetterEntries(applicant.coverLetter);

  for (let i = entries.length - 1; i >= 0; i -= 1) {
    const entry = entries[i];
    if (!normalizeDocumentValue(entry)) continue;

    const coverPathKey = documentPathKey(entry);
    if (cvPathKey && coverPathKey && coverPathKey === cvPathKey) {
      continue;
    }

    return entry;
  }

  return null;
};

export const hasApplicantCoverLetterSource = (applicant) =>
  Boolean(getApplicantCoverLetterSource(applicant));

export const getCandidateCoverLetterSource = (candidate) => {
  const entries = collectCoverLetterEntries(candidate?.coverLetter);
  if (entries.length === 0) return null;

  const latest = entries[entries.length - 1];
  return latest?.url || latest;
};

export const getApplicationFileName = (value, fallback = "Document") => {
  const path = normalizeDocumentValue(value);
  if (!path) return fallback;

  try {
    const rawName = decodeURIComponent(path.split("/").pop() || "");
    if (!rawName) return fallback;

    if (/^\d{10,}-/.test(rawName) || /^\d+\.(pdf|doc|docx)$/i.test(rawName)) {
      return fallback;
    }

    return rawName;
  } catch {
    return fallback;
  }
};

export const openApplicationFile = async (
  value,
  onMissing,
  { fileKind = "resumes" } = {},
) => {
  if (!value) {
    onMissing?.();
    return;
  }

  const path = normalizeDocumentValue(value);

  if (isProtectedDocumentPath(path)) {
    await openProtectedDocument(value, {
      onMissing,
      toast,
      context: "recruiter",
      fileKind,
    });
    return;
  }

  const url = resolveApplicationFileUrl(value);
  if (!url) {
    onMissing?.();
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};
