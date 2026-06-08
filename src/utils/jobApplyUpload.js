import axios from "axios";
import { API_BASE_URL } from "../Url/Url";

export const MAX_APPLY_FILE_SIZE = 2 * 1024 * 1024;

export const fetchCandidateApplyDocuments = async (token) => {
  if (!token) {
    return { resumeList: [], coverLetterList: [] };
  }

  try {
    const res = await axios.get(`${API_BASE_URL}candidate/profile`, {
      headers: { Authorization: `Bearer ${token}` },
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

export const uploadCvToProfile = async (file, token) => {
  const formData = new FormData();
  formData.append("resume", file);
  const response = await axios.put(`${API_BASE_URL}updateResumeUrl`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return {
    name: file.name,
    url: response.data.resumeUrl,
    _id: String(response.data.resumeId || Date.now()),
  };
};

export const uploadCoverLetterToProfile = async (file, token) => {
  const formData = new FormData();
  formData.append("coverLetter", file);
  const response = await axios.put(
    `${API_BASE_URL}updateCoverLetter`,
    formData,
    { headers: { Authorization: `Bearer ${token}` } },
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
