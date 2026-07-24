import axios from "axios";
import { toast } from "react-toastify";
import { handleRateLimitError } from "./apiRateLimitHandler";
import {
  attachAuthHeader,
  clearAuthStorage,
  hasAuthSession,
  isPublicRoute,
  USE_COOKIE_AUTH,
} from "./apiHeaders";

let installed = false;
let sessionExpiredHandled = false;

export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";

const getRequestUrl = (config = {}) => {
  const baseURL = config.baseURL || "";
  const url = config.url || "";

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `${baseURL}${url}`;
};

const applyRequestAuth = (config = {}) => {
  const requestUrl = getRequestUrl(config);
  config.withCredentials = true;

  // Never send a stale Bearer token on login/register — breaks encrypted password auth
  if (isPublicRoute(requestUrl)) {
    const headers = { ...(config.headers || {}) };
    delete headers.Authorization;
    delete headers.authorization;
    config.headers = headers;
    return config;
  }

  config.headers = attachAuthHeader(config.headers || {});
  return config;
};

const isExplicitAuthFailure = (status, message = "", code = "") => {
  if (status === 401) {
    if (USE_COOKIE_AUTH) {
      return /unauthorized|session expired|jwt expired|token expired|invalid token|not authenticated/i.test(
        message,
      );
    }

    return (
      code === "TOKEN_EXPIRED" ||
      /session expired|jwt expired|token expired|invalid token|not authenticated/i.test(
        message,
      )
    );
  }

  if (status === 403) {
    return (
      code === "TOKEN_EXPIRED" ||
      /session expired|jwt expired|token expired|invalid token/i.test(message)
    );
  }

  return false;
};

export const handleSessionExpired = ({ silent = false } = {}) => {
  if (sessionExpiredHandled) {
    return;
  }

  sessionExpiredHandled = true;
  clearAuthStorage();
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));

  if (!silent) {
    toast.error("Session expired. Please login again.");
  }

  setTimeout(() => {
    window.location.href = "/jobPortal/login";
  }, 1000);
};

export const resetSessionExpiredState = () => {
  sessionExpiredHandled = false;
};

export const installAuthInterceptor = () => {
  if (installed) {
    return;
  }

  axios.defaults.withCredentials = true;

  axios.interceptors.request.use((config) => applyRequestAuth(config));

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (handleRateLimitError(error)) {
        return Promise.reject(error);
      }

      const status = error?.response?.status;
      const message = error?.response?.data?.message || "";
      const code = error?.response?.data?.code || "";
      const requestUrl = getRequestUrl(error?.config || {});

      const isAuthenticatedRequest =
        hasAuthSession() && !isPublicRoute(requestUrl);

      const isSessionExpired =
        isAuthenticatedRequest && isExplicitAuthFailure(status, message, code);

      const isForbiddenRole =
        status === 403 &&
        /insufficient role|forbidden|access denied/i.test(message);

      const isRoleSpecificProfileRequest =
        /\/candidate\/profile\b/i.test(requestUrl) ||
        /\/company\/profile\b/i.test(requestUrl);

      if (isSessionExpired) {
        handleSessionExpired();
      } else if (isForbiddenRole && !isRoleSpecificProfileRequest) {
        toast.error(
          message || "You do not have permission to perform this action.",
        );
      }

      return Promise.reject(error);
    },
  );

  installed = true;
};
