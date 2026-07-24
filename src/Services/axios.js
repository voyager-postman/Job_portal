import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { handleRateLimitError } from "../utils/apiRateLimitHandler";
import { handleSessionExpired } from "../utils/authInterceptor";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (handleRateLimitError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const message = error.response?.data?.message;
    const code = error.response?.data?.code;

    const isUnauthorized =
      status === 401 &&
      (code === "TOKEN_EXPIRED" ||
        message?.toLowerCase().includes("session expired"));

    const isForbidden =
      status === 403 && message?.toLowerCase().includes("insufficient role");

    if (isUnauthorized) {
      handleSessionExpired({ silent: true });
    } else if (isForbidden) {
      // Role errors are handled by the global auth interceptor.
    }

    return Promise.reject(error);
  },
);

export default api;
