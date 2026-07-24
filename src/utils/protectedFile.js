import { API_BASE_URL } from "../Url/Url";
import {
  getFetchAuthOptions,
  getUserToken,
  hasAuthSession,
  isAuthReady,
} from "./apiHeaders";
import { handleSessionExpired } from "./authInterceptor";

export const PROTECTED_FILE_ERRORS = {
  LOGIN_REQUIRED: "LOGIN_REQUIRED",
  NOT_ALLOWED: "NOT_ALLOWED",
  RATE_LIMIT: "RATE_LIMIT",
  NOT_FOUND: "NOT_FOUND",
  DOWNLOAD_FAILED: "DOWNLOAD_FAILED",
};

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

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

const stripOrigin = (path) =>
  path.toLowerCase().replace(/^https?:\/\/[^/]+/i, "");

const getProtectedFileKind = (path, preferredKind = "auto") => {
  if (preferredKind === "resumes" || preferredKind === "coverLetters") {
    return preferredKind;
  }

  const lower = stripOrigin(path).replace(/^\//, "");
  if (
    lower.startsWith("coverletters/") ||
    lower.includes("/coverletters/") ||
    lower.includes("/api/files/coverletters/")
  ) {
    return "coverLetters";
  }
  return "resumes";
};

export const isProtectedDocumentPath = (value) => {
  const path = normalizeDocumentValue(value);
  if (!path) return false;

  const lower = stripOrigin(path).replace(/^\//, "");

  if (!lower.includes("/") && /\.(pdf|doc|docx)$/i.test(lower)) {
    return true;
  }

  return (
    lower.startsWith("resumes/") ||
    lower.startsWith("coverletters/") ||
    lower.includes("/resumes/") ||
    lower.includes("/coverletters/") ||
    lower.includes("/api/files/resumes/") ||
    lower.includes("/api/files/coverletters/")
  );
};

export const toProtectedFileUrl = (value, preferredKind = "auto") => {
  const path = normalizeDocumentValue(value);
  if (!path) return null;

  const withoutOrigin = path.replace(/^https?:\/\/[^/]+/i, "");
  const normalized = withoutOrigin.startsWith("/job_portal/")
    ? withoutOrigin.replace(/^\/job_portal/, "")
    : withoutOrigin;

  if (
    normalized.includes("/api/files/resumes/") ||
    normalized.includes("/api/files/coverLetters/")
  ) {
    const apiPath = normalized.startsWith("/api/")
      ? normalized
      : `/${normalized}`;
    return `${API_ORIGIN}${apiPath}`;
  }

  if (!isProtectedDocumentPath(path) && preferredKind === "auto") {
    return null;
  }

  const filename = decodeURIComponent(
    (normalized.split("/").pop() || path.split("/").pop() || "").split("?")[0],
  );
  if (!filename) return null;

  const kind = getProtectedFileKind(path, preferredKind);
  return `${API_BASE_URL}files/${kind}/${filename}`;
};

const buildFullUrl = (apiUrl) => {
  if (/^https?:\/\//i.test(apiUrl)) return apiUrl;

  if (apiUrl.startsWith("/job_portal/")) {
    const host = API_ORIGIN.match(/^(https?:\/\/[^/]+)/)?.[1] || "";
    return `${host}${apiUrl}`;
  }

  if (apiUrl.startsWith("/api/")) {
    return `${API_ORIGIN}${apiUrl}`;
  }

  const base = API_ORIGIN;
  return `${base}${apiUrl.startsWith("/") ? apiUrl : `/${apiUrl}`}`;
};

export const getProtectedFileErrorMessage = (error, context = "recruiter") => {
  if (error?.apiMessage) {
    return error.apiMessage;
  }

  switch (error?.message) {
    case PROTECTED_FILE_ERRORS.NOT_ALLOWED:
      return context === "recruiter"
        ? "Unlock this candidate to view resume"
        : "You do not have permission to view this file";
    case PROTECTED_FILE_ERRORS.RATE_LIMIT:
      return "Too many downloads. Try again in 15 minutes.";
    case PROTECTED_FILE_ERRORS.LOGIN_REQUIRED:
      return "Please login to download this file";
    case PROTECTED_FILE_ERRORS.NOT_FOUND:
      return "File not found";
    default:
      return "Failed to download file";
  }
};

const createProtectedFileError = (code, apiMessage) => {
  const err = new Error(code);
  if (apiMessage) {
    err.apiMessage = apiMessage;
  }
  return err;
};

const readApiErrorMessage = async (response) => {
  try {
    const data = await response.clone().json();
    return data?.message || data?.error || null;
  } catch {
    return null;
  }
};

export async function openProtectedFile(apiUrl, token, options = {}) {
  const { onError, redirectOn401 = true } = options;

  if (!apiUrl) {
    const err = new Error(PROTECTED_FILE_ERRORS.DOWNLOAD_FAILED);
    onError?.(err);
    throw err;
  }

  const authToken = token || getUserToken();
  if (!authToken && !hasAuthSession()) {
    const err = new Error(PROTECTED_FILE_ERRORS.LOGIN_REQUIRED);
    onError?.(err);
    if (redirectOn401) {
      window.location.href = "/jobPortal";
    }
    throw err;
  }

  const fullUrl = buildFullUrl(apiUrl);
  const fetchOptions = getFetchAuthOptions(
    authToken ? { Authorization: `Bearer ${authToken}` } : {},
  );
  const res = await fetch(fullUrl, fetchOptions);

  if (res.status === 401) {
    const err = new Error(PROTECTED_FILE_ERRORS.LOGIN_REQUIRED);
    onError?.(err);
    if (redirectOn401 && isAuthReady()) {
      handleSessionExpired();
    } else if (redirectOn401) {
      window.location.href = "/jobPortal";
    }
    throw err;
  }

  if (res.status === 403) {
    const err = new Error(PROTECTED_FILE_ERRORS.NOT_ALLOWED);
    onError?.(err);
    throw err;
  }

  if (res.status === 429) {
    const err = new Error(PROTECTED_FILE_ERRORS.RATE_LIMIT);
    onError?.(err);
    throw err;
  }

  if (res.status === 404) {
    const apiMessage = (await readApiErrorMessage(res)) || "File not found";
    const err = createProtectedFileError(
      PROTECTED_FILE_ERRORS.NOT_FOUND,
      apiMessage,
    );
    onError?.(err);
    throw err;
  }

  if (!res.ok) {
    const apiMessage = await readApiErrorMessage(res);
    const err = createProtectedFileError(
      PROTECTED_FILE_ERRORS.DOWNLOAD_FAILED,
      apiMessage,
    );
    onError?.(err);
    throw err;
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  window.open(objectUrl, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export async function openProtectedDocument(
  value,
  { token, toast, context = "recruiter", fileKind = "auto", onMissing } = {},
) {
  const authToken = token || localStorage.getItem("token");
  const url = toProtectedFileUrl(value, fileKind);

  if (!url) {
    onMissing?.();
    return false;
  }

  try {
    await openProtectedFile(url, authToken);
    return true;
  } catch (error) {
    if (toast) {
      toast.error(getProtectedFileErrorMessage(error, context));
    }
    return false;
  }
}
