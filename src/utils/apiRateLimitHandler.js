import axios from "axios";
import { toast } from "react-toastify";

export const RATE_LIMIT_ERROR = {
  success: false,
  message: "Too many requests. Please slow down.",
  code: "RATE_LIMIT",
};

const RATE_LIMIT_TOAST_ID = "api-rate-limit";
const TOAST_COOLDOWN_MS = 3000;

let installed = false;
let lastToastAt = 0;

export function isRateLimitError(error) {
  const status = error?.response?.status;
  const data = error?.response?.data;

  return (
    status === 429 ||
    data?.code === RATE_LIMIT_ERROR.code ||
    (data?.success === false && data?.code === RATE_LIMIT_ERROR.code)
  );
}

export function isRateLimitResponse(data, status) {
  return (
    status === 429 ||
    data?.code === RATE_LIMIT_ERROR.code ||
    (data?.success === false && data?.code === RATE_LIMIT_ERROR.code)
  );
}

export function getRateLimitMessage(error) {
  return error?.response?.data?.message || RATE_LIMIT_ERROR.message;
}

function showRateLimitToast(message) {
  const now = Date.now();
  if (now - lastToastAt < TOAST_COOLDOWN_MS) {
    return;
  }

  lastToastAt = now;
  toast.warning(message || RATE_LIMIT_ERROR.message, {
    toastId: RATE_LIMIT_TOAST_ID,
  });
}

export function handleRateLimitError(error) {
  if (!isRateLimitError(error)) {
    return false;
  }

  showRateLimitToast(getRateLimitMessage(error));
  error.__rateLimitToastShown = true;
  return true;
}

export function attachRateLimitInterceptor(instance) {
  instance.interceptors.response.use(
    (response) => {
      if (isRateLimitResponse(response?.data, response?.status)) {
        showRateLimitToast(
          response?.data?.message || RATE_LIMIT_ERROR.message,
        );
      }
      return response;
    },
    (error) => {
      handleRateLimitError(error);
      return Promise.reject(error);
    },
  );
}

export function installApiRateLimitHandler() {
  if (installed) {
    return;
  }

  attachRateLimitInterceptor(axios);
  installed = true;
}
