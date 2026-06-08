import axios from "axios";
import { redactSensitiveData } from "./secureCredentials";

const AUTH_PATH_PATTERN =
  /\/(user\/login|user\/register|register\/company|change-password)\/?$/i;

let installed = false;

const getRequestUrl = (config) => {
  const requestUrl = config?.url || "";

  if (/^https?:\/\//i.test(requestUrl)) {
    return requestUrl;
  }

  const base = (config?.baseURL || "").replace(/\/$/, "");
  const path = requestUrl.startsWith("/") ? requestUrl : `/${requestUrl}`;
  return `${base}${path}`;
};

const isAuthRequest = (config) => AUTH_PATH_PATTERN.test(getRequestUrl(config));

const isInsecureAbsoluteUrl = (url) => {
  try {
    return new URL(url).protocol === "http:";
  } catch {
    return false;
  }
};

export const installCredentialSecurity = () => {
  if (installed) {
    return;
  }

  axios.interceptors.request.use((config) => {
    const requestUrl = getRequestUrl(config);

    if (
      isAuthRequest(config) &&
      isInsecureAbsoluteUrl(requestUrl) &&
      process.env.NODE_ENV === "production"
    ) {
      return Promise.reject(
        Object.assign(new Error("INSECURE_AUTH_REQUEST_BLOCKED"), {
          code: "INSECURE_API_TRANSPORT",
        }),
      );
    }

    if (config?.data && isAuthRequest(config)) {
      config.redactedAuthPayload = redactSensitiveData(config.data);
    }

    return config;
  });

  installed = true;
};
