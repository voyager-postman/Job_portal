const ensureTrailingSlash = (url = "") => (url.endsWith("/") ? url : `${url}/`);

const resolveApiBaseUrl = () => {
  const fromEnv =
    process.env.REACT_APP_API_URL?.trim() ||
    process.env.REACT_APP_API_BASE_URL?.trim();

  if (fromEnv) {
    return ensureTrailingSlash(fromEnv);
  }

  return "https://sisccltd.com/job_portal/api/";
};

const resolveUploadsBaseUrl = (apiBaseUrl) => {
  const fromEnv =
    process.env.REACT_APP_UPLOADS_URL?.trim() ||
    process.env.REACT_APP_API_IMAGE_URL?.trim();

  if (fromEnv) {
    return ensureTrailingSlash(fromEnv);
  }

  return ensureTrailingSlash(apiBaseUrl.replace(/\/api\/?$/i, "/uploads/"));
};

export const API_BASE_URL = resolveApiBaseUrl();
export const API_IMAGE_URL = resolveUploadsBaseUrl(API_BASE_URL);
