import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { getRequestConfig } from "../utils/apiHeaders";

/**
 * Fetch Recruiter Job List with filters (Point 3)
 * Endpoint: GET /api/getRecruiterJobList
 */
export const fetchRecruiterJobs = async ({
  page = 1,
  limit = 10,
  status = "all",
  search = "",
  jobType = "",
  recruiterId = "",
  startDate = "",
  endDate = "",
  sort = "newest",
} = {}) => {
  const params = {
    page,
    limit,
    status,
    search,
    jobType,
    recruiterId,
    startDate,
    endDate,
    sort,
  };

  // Clean empty params
  Object.keys(params).forEach((key) => {
    if (params[key] === "" || params[key] === null || params[key] === undefined) {
      delete params[key];
    }
  });

  const res = await axios.get(
    `${API_BASE_URL}getRecruiterJobList`,
    getRequestConfig({ params })
  );
  return res.data;
};

/**
 * Fetch Recruiter KPI Dashboard Stats (Point 4)
 * Endpoint: GET /api/recruiter/dashboardStats
 */
export const fetchRecruiterKPIs = async ({
  filter = "week",
  jobType = "",
  recruiterId = "",
  startDate = "",
  endDate = "",
} = {}) => {
  const params = {
    filter,
    jobType,
    recruiterId,
    startDate,
    endDate,
  };

  // Clean empty params
  Object.keys(params).forEach((key) => {
    if (params[key] === "" || params[key] === null || params[key] === undefined) {
      delete params[key];
    }
  });

  const res = await axios.get(
    `${API_BASE_URL}recruiter/dashboardStats`,
    getRequestConfig({ params })
  );
  return res.data;
};

/**
 * Fetch Active Job Types for filter dropdowns (Point 5)
 * Endpoint: GET /api/getActiveJobTypeList
 */
export const fetchActiveJobTypes = async () => {
  const res = await axios.get(`${API_BASE_URL}getActiveJobTypeList`);
  return res.data?.data || [];
};

/**
 * Report / Flag a Job Posting (Candidate / JobSeeker Feature)
 * Endpoint: POST /api/jobs/:jobId/report
 */
export const reportJobPosting = async (jobId, { reason, details = "", email = "" } = {}) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.post(
    `${API_BASE_URL}jobs/${jobId}/report`,
    { reason, details, email },
    { headers }
  );
  return res.data;
};

/**
 * Get Direct Download URL for Job Resumes ZIP (with token query param support)
 */
export const getJobResumesZipUrl = (jobId, { status = "", includeCoverLetters = false } = {}) => {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (includeCoverLetters) params.append("includeCoverLetters", "true");
  if (token) params.append("token", token);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return `${API_BASE_URL}recruiter/jobs/${jobId}/download-resumes-zip${qs}`;
};

/**
 * Bulk Resume ZIP Download for Recruiter / Company
 * Supports credit verification (403 CANDIDATES_NOT_UNLOCKED error parsing)
 * Endpoint: GET /api/recruiter/jobs/:jobId/download-resumes-zip (all/filtered)
 *           POST /api/recruiter/jobs/:jobId/download-resumes-zip (selected applicationIds)
 */
export const downloadJobResumesZip = async (
  jobId,
  {
    status = "",
    applicationIds = [],
    includeCoverLetters = false,
    jobTitle = "",
  } = {}
) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    let response;
    if (applicationIds && applicationIds.length > 0) {
      response = await axios.post(
        `${API_BASE_URL}recruiter/jobs/${jobId}/download-resumes-zip`,
        { applicationIds, includeCoverLetters, status },
        { headers, responseType: "blob" }
      );
    } else {
      const params = {};
      if (status) params.status = status;
      if (includeCoverLetters) params.includeCoverLetters = true;

      response = await axios.get(
        `${API_BASE_URL}recruiter/jobs/${jobId}/download-resumes-zip`,
        { headers, params, responseType: "blob" }
      );
    }

    // Extract filename or create clean default
    let filename = `Resumes_${(jobTitle || jobId).toString().replace(/[^a-zA-Z0-9_-]/g, "_")}.zip`;
    const disposition = response.headers?.["content-disposition"];
    if (disposition && disposition.includes("filename=")) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, "");
      }
    }

    const blob = new Blob([response.data], { type: "application/zip" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return { success: true, filename };
  } catch (error) {
    // Parse blob error response if returned by backend (e.g. 403 CANDIDATES_NOT_UNLOCKED)
    if (error.response?.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        const parsed = JSON.parse(errorText);
        error.parsedData = parsed;
        if (parsed?.message) {
          error.customMessage = parsed.message;
        }
        if (parsed?.code) {
          error.errorCode = parsed.code;
        }
      } catch (parseErr) {
        // Blob is not JSON
      }
    } else if (error.response?.data) {
      error.parsedData = error.response.data;
      error.customMessage = error.response.data.message;
      error.errorCode = error.response.data.code;
    }

    throw error;
  }
};



