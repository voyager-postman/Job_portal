import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { handleRateLimitError } from "./apiRateLimitHandler";
import { handleSessionExpired } from "./authInterceptor";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (handleRateLimitError(error)) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;

    if (status === 401) {
      handleSessionExpired();
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
