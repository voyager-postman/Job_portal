import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { getRequestConfig } from "./apiHeaders";

const adminConfig = () => getRequestConfig();

export const fetchGoogleMarketingConfig = () =>
  axios.get(`${API_BASE_URL}googleMarketingConfig`, adminConfig());

export const fetchPublicGoogleMarketingConfig = () =>
  axios.get(`${API_BASE_URL}public/googleMarketingConfig`);

export const saveGoogleTagManagerConfig = (payload) =>
  axios.post(`${API_BASE_URL}saveGoogleTagManagerConfig`, payload, adminConfig());

export const toggleGoogleTagManagerStatus = (isActive) =>
  axios.post(
    `${API_BASE_URL}googleTagManagerConfig/status`,
    { isActive },
    adminConfig(),
  );

export const saveGoogleAnalyticsConfig = (payload) =>
  axios.post(`${API_BASE_URL}saveGoogleAnalyticsConfig`, payload, adminConfig());

export const toggleGoogleAnalyticsStatus = (isActive) =>
  axios.post(
    `${API_BASE_URL}googleAnalyticsConfig/status`,
    { isActive },
    adminConfig(),
  );

export const saveGoogleSearchConsoleConfig = (payload) =>
  axios.post(
    `${API_BASE_URL}saveGoogleSearchConsoleConfig`,
    payload,
    adminConfig(),
  );

export const toggleGoogleSearchConsoleStatus = (isActive) =>
  axios.post(
    `${API_BASE_URL}googleSearchConsoleConfig/status`,
    { isActive },
    adminConfig(),
  );
