import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { getRequestConfig } from "./apiHeaders";

const adminConfig = () => getRequestConfig();

export const EMPTY_JOBS_LISTING_SEO = {
  isActive: true,
  title: "",
  description: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  canonicalUrl: "",
  robots: "index, follow",
  ogImage: "",
  enableItemListSchema: true,
  maxJobsInSchema: 20,
  defaultJobsListUrl: "",
};

const toKeywordString = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value || "";
};

export const normalizeKeywords = (keywords) => {
  const value = toKeywordString(keywords);
  return value || undefined;
};

export const normalizeJsonLdList = (jsonLd) => {
  if (!jsonLd) return [];
  const list = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  return list.filter(Boolean);
};

export const normalizeJobsListingSeoConfig = (raw = {}) => {
  const data = raw?.data || raw || {};
  const metaTags = data.metaTags || {};
  const jsonLd = data.jsonLd || {};

  return {
    ...EMPTY_JOBS_LISTING_SEO,
    isActive: data.isActive ?? true,
    title: metaTags.title || data.title || "",
    description: metaTags.description || data.description || "",
    keywords: toKeywordString(metaTags.keywords ?? data.keywords),
    ogTitle: metaTags.ogTitle || data.ogTitle || "",
    ogDescription: metaTags.ogDescription || data.ogDescription || "",
    canonicalUrl: metaTags.canonicalUrl || data.canonicalUrl || "",
    robots: metaTags.robots || data.robots || "index, follow",
    ogImage: metaTags.ogImage || data.ogImage || "",
    enableItemListSchema:
      jsonLd.enableItemListSchema ?? data.enableItemListSchema ?? true,
    maxJobsInSchema: jsonLd.maxJobsInSchema ?? data.maxJobsInSchema ?? 20,
    defaultJobsListUrl: data.defaultJobsListUrl || "",
  };
};

export const buildJobsListingSeoFormData = (form, files = {}) => {
  const fd = new FormData();

  fd.append("isActive", String(Boolean(form.isActive)));
  fd.append("title", form.title || "");
  fd.append("description", form.description || "");
  fd.append("keywords", form.keywords || "");
  fd.append("ogTitle", form.ogTitle || "");
  fd.append("ogDescription", form.ogDescription || "");
  fd.append("canonicalUrl", form.canonicalUrl || "");
  fd.append("robots", form.robots || "index, follow");
  fd.append(
    "enableItemListSchema",
    String(Boolean(form.enableItemListSchema)),
  );
  fd.append("maxJobsInSchema", String(Number(form.maxJobsInSchema) || 20));

  if (files.ogImage) fd.append("ogImage", files.ogImage);

  return fd;
};

export const fetchJobsListingSeoConfig = () =>
  axios.get(`${API_BASE_URL}getJobsListingSeoConfig`, adminConfig());

export const updateJobsListingSeoConfig = (form, files = {}) =>
  axios.post(
    `${API_BASE_URL}updateJobsListingSeoConfig`,
    buildJobsListingSeoFormData(form, files),
    adminConfig(),
  );

export const fetchPublicJobsListingSeo = () =>
  axios.get(`${API_BASE_URL}public/jobsListingSeo`, {
    skipGlobalLoader: true,
  });
