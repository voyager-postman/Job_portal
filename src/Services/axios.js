import axios from "axios";
import { handleRateLimitError } from "../utils/apiRateLimitHandler";

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_role");
      localStorage.removeItem("profileImage");
      //  DELAY ONLY HERE
      setTimeout(() => {
        window.location.href = "/jobPortal";
      }, 2000); // 1.5 sec delay
    }

    return Promise.reject(error);
  }
);

export default api;
