import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { getRequestConfig } from "./apiHeaders";

export const EMPTY_GLOBAL_SEO = {
  siteName: "Job Portal",
  siteUrl: "",
  titleTemplate: "%s | Job Portal",
  defaultTitle: "Job Portal - Find Top Tech, Remote & Full-time Jobs",
  defaultDescription:
    "Discover thousands of curated job vacancies from top hiring companies worldwide. Apply directly with one click.",
  defaultKeywords: [
    "jobs",
    "careers",
    "hiring",
    "recruitment",
    "employment",
    "remote jobs",
  ],
  defaultOgImage: "",
  defaultRobots: "index, follow",
  canonicalBaseUrl: "",
  verificationTags: {
    google: "",
    bing: "",
    yandex: "",
  },
  analytics: {
    googleAnalyticsId: "",
    googleTagManagerId: "",
    metaPixelId: "",
  },
  sitemapUrl: "",
  robotsUrl: "",
};

/**
 * Normalizes raw API response from /api/public/seo/global into safe structure
 */
export const normalizeGlobalSeoConfig = (raw = {}) => {
  const data = raw?.data || raw || {};

  const defaultKeywords = Array.isArray(data.defaultKeywords)
    ? data.defaultKeywords
    : typeof data.defaultKeywords === "string"
    ? data.defaultKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : EMPTY_GLOBAL_SEO.defaultKeywords;

  return {
    siteName: data.siteName || EMPTY_GLOBAL_SEO.siteName,
    siteUrl: data.siteUrl || EMPTY_GLOBAL_SEO.siteUrl,
    titleTemplate: data.titleTemplate || EMPTY_GLOBAL_SEO.titleTemplate,
    defaultTitle: data.defaultTitle || EMPTY_GLOBAL_SEO.defaultTitle,
    defaultDescription:
      data.defaultDescription || EMPTY_GLOBAL_SEO.defaultDescription,
    defaultKeywords,
    defaultOgImage: data.defaultOgImage || EMPTY_GLOBAL_SEO.defaultOgImage,
    defaultRobots: data.defaultRobots || EMPTY_GLOBAL_SEO.defaultRobots,
    canonicalBaseUrl:
      data.canonicalBaseUrl || EMPTY_GLOBAL_SEO.canonicalBaseUrl,
    verificationTags: {
      google:
        data.verificationTags?.google || data.googleSiteVerification || "",
      bing: data.verificationTags?.bing || data.bingSiteVerification || "",
      yandex: data.verificationTags?.yandex || data.yandexVerification || "",
    },
    analytics: {
      googleAnalyticsId:
        data.analytics?.googleAnalyticsId || data.googleAnalyticsId || "",
      googleTagManagerId:
        data.analytics?.googleTagManagerId || data.googleTagManagerId || "",
      metaPixelId: data.analytics?.metaPixelId || data.metaPixelId || "",
    },
    sitemapUrl: data.sitemapUrl || "",
    robotsUrl: data.robotsUrl || "",
  };
};

/**
 * Formats a given page title using the global titleTemplate.
 * E.g., formatTitleWithTemplate("Software Engineer", "%s | Job Portal", "Job Portal")
 * -> "Software Engineer | Job Portal"
 */
export const formatTitleWithTemplate = (
  pageTitle,
  titleTemplate = "%s | Job Portal",
  defaultTitle = "Job Portal"
) => {
  if (!pageTitle || !String(pageTitle).trim()) {
    return defaultTitle;
  }
  const cleanTitle = String(pageTitle).trim();
  if (titleTemplate && titleTemplate.includes("%s")) {
    return titleTemplate.replace("%s", cleanTitle);
  }
  return `${cleanTitle} - ${defaultTitle}`;
};

/**
 * Public Global SEO API Endpoint
 * GET /api/public/seo/global
 */
export const fetchPublicGlobalSeoConfig = async () => {
  return axios.get(`${API_BASE_URL}public/seo/global`);
};

/**
 * Admin: Fetch Full Global SEO Config API
 * GET /api/admin/seo/global
 */
export const fetchAdminGlobalSeoConfig = async () => {
  return axios.get(`${API_BASE_URL}admin/seo/global`, getRequestConfig());
};

/**
 * Admin: Update Global SEO Config API
 * POST /api/admin/seo/global
 */
export const updateAdminGlobalSeoConfig = async (payload, ogImageFile = null) => {
  if (ogImageFile) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, val]) => {
      if (typeof val === "object" && val !== null && !(val instanceof File)) {
        formData.append(key, JSON.stringify(val));
      } else {
        formData.append(key, val);
      }
    });
    formData.append("defaultOgImage", ogImageFile);

    return axios.post(`${API_BASE_URL}admin/seo/global`, formData, {
      ...getRequestConfig(),
      headers: {
        ...getRequestConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  return axios.post(`${API_BASE_URL}admin/seo/global`, payload, getRequestConfig());
};
