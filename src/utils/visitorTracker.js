import axios from "axios";
import { API_BASE_URL } from "../Url/Url";

export const VISITOR_ID_KEY = "visitorId";
export const VISITOR_ID_ALT_KEY = "visitor_id";

export const getStoredVisitorId = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return "";
  }
  return (
    localStorage.getItem(VISITOR_ID_KEY) ||
    localStorage.getItem(VISITOR_ID_ALT_KEY) ||
    ""
  );
};

export const setStoredVisitorId = (visitorId) => {
  if (typeof window === "undefined" || !window.localStorage || !visitorId) {
    return;
  }
  localStorage.setItem(VISITOR_ID_KEY, visitorId);
  localStorage.setItem(VISITOR_ID_ALT_KEY, visitorId);
};

export const getDeviceType = () => {
  if (typeof window === "undefined" || !navigator) {
    return "Desktop";
  }
  const ua = navigator.userAgent || "";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua,
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
};

export const getBrowserName = () => {
  if (typeof window === "undefined" || !navigator) {
    return "Chrome";
  }
  const ua = navigator.userAgent || "";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("OPR/") || ua.includes("Opera/")) return "Opera";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  return "Chrome";
};

export const extractUtmParameters = (searchString = "") => {
  const params = new URLSearchParams(
    searchString || (typeof window !== "undefined" ? window.location.search : ""),
  );

  const utmSource =
    params.get("utm_source") || params.get("utmSource") || "";
  const utmMedium =
    params.get("utm_medium") || params.get("utmMedium") || "";
  const utmCampaign =
    params.get("utm_campaign") || params.get("utmCampaign") || "";

  if (typeof window !== "undefined" && window.sessionStorage) {
    if (utmSource) sessionStorage.setItem("utm_source", utmSource);
    if (utmMedium) sessionStorage.setItem("utm_medium", utmMedium);
    if (utmCampaign) sessionStorage.setItem("utm_campaign", utmCampaign);
  }

  const cachedSource =
    utmSource ||
    (typeof window !== "undefined" && window.sessionStorage
      ? sessionStorage.getItem("utm_source") || ""
      : "");
  const cachedMedium =
    utmMedium ||
    (typeof window !== "undefined" && window.sessionStorage
      ? sessionStorage.getItem("utm_medium") || ""
      : "");
  const cachedCampaign =
    utmCampaign ||
    (typeof window !== "undefined" && window.sessionStorage
      ? sessionStorage.getItem("utm_campaign") || ""
      : "");

  return {
    utmSource: cachedSource,
    utmMedium: cachedMedium,
    utmCampaign: cachedCampaign,
  };
};

export const getReferrer = () => {
  if (typeof window === "undefined") return "";
  const ref = document.referrer || "";

  if (ref && window.sessionStorage) {
    try {
      const refUrl = new URL(ref);
      if (refUrl.origin !== window.location.origin) {
        sessionStorage.setItem("initial_referrer", ref);
      }
    } catch {
      // Ignore invalid URL
    }
  }

  const cachedRef =
    window.sessionStorage ? sessionStorage.getItem("initial_referrer") : "";
  return ref || cachedRef || "";
};

export const getPageTypeFromPath = (pathname = "") => {
  const path = (pathname || "").toLowerCase();

  if (!path || path === "/" || path === "/home") {
    return "home";
  }

  if (path === "/jobs" || path.startsWith("/job-search")) {
    return "jobs";
  }

  if (
    path.startsWith("/job/") ||
    path.startsWith("/job-details") ||
    path.startsWith("/applicants-details")
  ) {
    return "job_detail";
  }

  if (
    path === "/register" ||
    path === "/candidate-register" ||
    path.startsWith("/candidate-register")
  ) {
    return "candidate_register";
  }

  if (
    path === "/login" ||
    path.startsWith("/candidate") ||
    path === "/profile-basic-info" ||
    path === "/resume-builder"
  ) {
    return "candidate_landing";
  }

  if (
    path === "/employer-home" ||
    path === "/companies" ||
    path === "/employer-register" ||
    path === "/employer-login" ||
    path === "/company-details" ||
    path.startsWith("/company")
  ) {
    return "company_landing";
  }

  return "other";
};

export const trackVisitorApi = async (payload) => {
  return axios.post(`${API_BASE_URL}public/track-visitor`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const trackVisitorPage = async (pageType, customPath) => {
  try {
    const existingId = getStoredVisitorId();
    const path =
      customPath ||
      (typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "/");

    const utm = extractUtmParameters();
    const referrer = getReferrer();
    const device = getDeviceType();
    const browser = getBrowserName();

    const payload = {
      visitorId: existingId || undefined,
      path,
      pageType,
      referrer,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      device,
      browser,
    };

    const response = await trackVisitorApi(payload);

    if (response?.data?.success) {
      const returnedId =
        response.data?.data?.visitorId || response.data?.visitorId;
      if (returnedId) {
        setStoredVisitorId(returnedId);
      }
    }

    return response?.data;
  } catch (error) {
    console.error("Failed to track visitor:", error);
    return null;
  }
};
