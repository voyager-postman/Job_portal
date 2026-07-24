import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { getAuthHeaders, isAuthReady } from "./apiHeaders";
import {
  MAX_DOCUMENT_SIZE_BYTES,
  validateDocumentFile,
} from "./fileUploadLimits";

export const MAX_APPLY_FILE_SIZE = MAX_DOCUMENT_SIZE_BYTES;

const assertValidDocument = (file, t) => {
  const result = validateDocumentFile(file, t);
  if (!result.ok) {
    const error = new Error(result.message || "FILE_TOO_LARGE");
    error.code = "FILE_TOO_LARGE";
    throw error;
  }
};

export const fetchCandidateApplyDocuments = async () => {
  if (!isAuthReady()) {
    return { resumeList: [], coverLetterList: [] };
  }

  const role = localStorage.getItem("user_role");
  if (role !== "JobSeeker") {
    return { resumeList: [], coverLetterList: [] };
  }

  try {
    const res = await axios.get(`${API_BASE_URL}candidate/profile`, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    const profile = res.data?.profile || {};
    return {
      resumeList: profile.resumeUrls || [],
      coverLetterList: profile.coverLetter || [],
    };
  } catch {
    return { resumeList: [], coverLetterList: [] };
  }
};

export const uploadCvToProfile = async (file, t) => {
  assertValidDocument(file, t);
  const formData = new FormData();
  formData.append("resume", file);
  const response = await axios.put(`${API_BASE_URL}updateResumeUrl`, formData, {
    withCredentials: true,
    headers: getAuthHeaders(),
  });
  return {
    name: file.name,
    url: response.data.resumeUrl,
    _id: String(response.data.resumeId || Date.now()),
  };
};

export const uploadCoverLetterToProfile = async (file, t) => {
  assertValidDocument(file, t);
  const formData = new FormData();
  formData.append("coverLetter", file);
  const response = await axios.put(
    `${API_BASE_URL}updateCoverLetter`,
    formData,
    {
      withCredentials: true,
      headers: getAuthHeaders(),
    },
  );
  return {
    name: file.name,
    url: response.data.coverLetterUrl,
    _id: String(response.data.coverLetterId || Date.now()),
  };
};

export const appendApplyDocumentsToFormData = (
  formData,
  {
    selectedResumeUrl,
    selectedCoverLetterUrl,
    selectedCustomFile,
  },
) => {
  if (selectedResumeUrl) {
    formData.append("cv", selectedResumeUrl);
  }
  if (selectedCoverLetterUrl) {
    formData.append("coverLetter", selectedCoverLetterUrl);
  }
  if (selectedCustomFile) {
    formData.append("customResume", selectedCustomFile);
  }
};
