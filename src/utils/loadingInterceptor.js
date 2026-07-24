import axios from "axios";
import axiosInstance from "./axiosInstance";
import api from "../Services/axios";

let installed = false;
let loadingCallbacks = {
  start: () => {},
  stop: () => {},
};

export const setLoadingCallbacks = (start, stop) => {
  loadingCallbacks = {
    start: typeof start === "function" ? start : () => {},
    stop: typeof stop === "function" ? stop : () => {},
  };
};

const shouldSkipLoader = (config = {}) => {
  if (config?.skipGlobalLoader === true) {
    return true;
  }

  const url = String(config?.url || config?.baseURL || "");
  return /\/company\/purchase-pack\b|\/purchase-CompanyAddOn\b/i.test(url);
};

const attachLoadingInterceptor = (instance) => {
  instance.interceptors.request.use((config) => {
    if (!shouldSkipLoader(config)) {
      loadingCallbacks.start();
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      if (!shouldSkipLoader(response.config)) {
        loadingCallbacks.stop();
      }
      return response;
    },
    (error) => {
      if (!shouldSkipLoader(error?.config)) {
        loadingCallbacks.stop();
      }
      return Promise.reject(error);
    },
  );
};

export const installLoadingInterceptor = () => {
  if (installed) {
    return;
  }

  attachLoadingInterceptor(axios);
  attachLoadingInterceptor(axiosInstance);
  attachLoadingInterceptor(api);

  installed = true;
};
