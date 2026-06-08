import axios from "axios";
import { toast } from "react-toastify";

export const RATE_LIMIT_ERROR = {
  success: false,
  message: "Too many requests. Please slow down.",
  code: "RATE_LIMIT",
};

export const IP_BANNED_ERROR = {
  success: false,
  message: "Your IP has been temporarily blocked due to excessive requests. Try again later.",
  code: "IP_BANNED",
};

const THROTTLED_API_CODES = new Set([
  RATE_LIMIT_ERROR.code,
  IP_BANNED_ERROR.code,
  "TOO_MANY_REQUESTS",
]);

const RATE_LIMIT_TOAST_ID = "api-rate-limit";
const IP_BANNED_TOAST_ID = "api-ip-banned";
const TOAST_COOLDOWN_MS = 3000;

let installed = false;
let lastToastAt = 0;
let nativeFetch = null;

function getResponsePayload(errorOrData) {
  if (errorOrData?.response?.data) {
    return errorOrData.response.data;
  }

  return errorOrData;
}

function getResponseStatus(errorOrData, explicitStatus) {
  if (typeof explicitStatus === "number") {
    return explicitStatus;
  }

  return errorOrData?.response?.status ?? errorOrData?.status;
}

export function formatRetryAfterMessage(retryAfterSeconds) {
  const seconds = Number(retryAfterSeconds);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "";
  }

  if (seconds < 60) {
    return ` Try again in ${seconds} second${seconds === 1 ? "" : "s"}.`;
  }

  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) {
    return ` Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
  }

  const hours = Math.ceil(minutes / 60);
  return ` Try again in ${hours} hour${hours === 1 ? "" : "s"}.`;
}

export function isThrottledApiResponse(data, status) {
  const code = data?.code;

  if (status === 429) {
    return true;
  }

  if (code && THROTTLED_API_CODES.has(code)) {
    return true;
  }

  if (status === 403 && code === IP_BANNED_ERROR.code) {
    return true;
  }

  return data?.success === false && code && THROTTLED_API_CODES.has(code);
}

export function isRateLimitError(error) {
  const data = getResponsePayload(error);
  const status = getResponseStatus(error);

  return isThrottledApiResponse(data, status);
}

export function isRateLimitResponse(data, status) {
  return isThrottledApiResponse(data, status);
}

export function getRateLimitMessage(errorOrData) {
  const data = getResponsePayload(errorOrData);
  const defaultMessage =
    data?.code === IP_BANNED_ERROR.code
      ? IP_BANNED_ERROR.message
      : RATE_LIMIT_ERROR.message;
  const baseMessage = data?.message || defaultMessage;
  const retrySuffix = formatRetryAfterMessage(data?.retryAfter);

  if (!retrySuffix) {
    return baseMessage;
  }

  const cleanedMessage = baseMessage
    .replace(/\s*Try again later\.?\s*$/i, "")
    .trim();

  return `${cleanedMessage}${retrySuffix}`;
}

function getToastId(data) {
  return data?.code === IP_BANNED_ERROR.code
    ? IP_BANNED_TOAST_ID
    : RATE_LIMIT_TOAST_ID;
}

function showRateLimitToast(message, data) {
  const now = Date.now();
  if (now - lastToastAt < TOAST_COOLDOWN_MS) {
    return;
  }

  lastToastAt = now;
  const toastId = getToastId(data);
  const toastFn =
    data?.code === IP_BANNED_ERROR.code ? toast.error : toast.warning;

  toastFn(message || RATE_LIMIT_ERROR.message, { toastId });
}

export function handleRateLimitError(error) {
  if (!isRateLimitError(error)) {
    return false;
  }

  const data = getResponsePayload(error);
  showRateLimitToast(getRateLimitMessage(error), data);
  error.__rateLimitToastShown = true;
  return true;
}

export function handleThrottledApiResponse(data, status) {
  if (!isThrottledApiResponse(data, status)) {
    return false;
  }

  showRateLimitToast(getRateLimitMessage(data), data);
  return true;
}

export function attachRateLimitInterceptor(instance) {
  instance.interceptors.response.use(
    (response) => {
      handleThrottledApiResponse(response?.data, response?.status);
      return response;
    },
    (error) => {
      handleRateLimitError(error);
      return Promise.reject(error);
    },
  );
}

async function inspectFetchResponse(response) {
  const status = response?.status;

  if (status !== 429 && status !== 403) {
    return;
  }

  try {
    const data = await response.clone().json();
    handleThrottledApiResponse(data, status);
  } catch {
    if (status === 429) {
      showRateLimitToast(RATE_LIMIT_ERROR.message, { code: RATE_LIMIT_ERROR.code });
    }
  }
}

export function attachFetchRateLimitHandler() {
  if (typeof window === "undefined" || nativeFetch) {
    return;
  }

  nativeFetch = window.fetch.bind(window);

  window.fetch = async (...args) => {
    const response = await nativeFetch(...args);
    await inspectFetchResponse(response);
    return response;
  };
}

export function installApiRateLimitHandler() {
  if (installed) {
    return;
  }

  attachRateLimitInterceptor(axios);
  attachFetchRateLimitHandler();
  installed = true;
}
