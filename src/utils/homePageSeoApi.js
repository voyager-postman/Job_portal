import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { getRequestConfig } from "./apiHeaders";

const adminConfig = () => getRequestConfig();

const EMPTY_ADDRESS = {
  streetAddress: "",
  addressLocality: "",
  addressRegion: "",
  postalCode: "",
  addressCountry: "",
};

export const EMPTY_HOME_PAGE_SEO = {
  isActive: true,
  title: "",
  description: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  canonicalUrl: "",
  robots: "index, follow",
  ogImage: "",
  enableWebsiteSchema: true,
  enableOrganizationSchema: true,
  enableJobPostingSchema: true,
  website: {
    name: "",
    url: "",
    description: "",
    searchUrl: "",
  },
  organization: {
    name: "",
    url: "",
    logo: "",
    description: "",
    email: "",
    phone: "",
    address: { ...EMPTY_ADDRESS },
    sameAs: "",
  },
};

const toKeywordString = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value || "";
};

const toSameAsString = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value || "";
};

export const normalizeHomePageSeoConfig = (raw = {}) => {
  const data = raw?.data || raw || {};
  const metaTags = data.metaTags || {};
  const jsonLd = data.jsonLd || {};
  const organization = jsonLd.organization || data.organization || {};

  return {
    ...EMPTY_HOME_PAGE_SEO,
    isActive: data.isActive ?? true,
    title: metaTags.title || data.title || "",
    description: metaTags.description || data.description || "",
    keywords: toKeywordString(metaTags.keywords ?? data.keywords),
    ogTitle: metaTags.ogTitle || data.ogTitle || "",
    ogDescription: metaTags.ogDescription || data.ogDescription || "",
    canonicalUrl: metaTags.canonicalUrl || data.canonicalUrl || "",
    robots: metaTags.robots || data.robots || "index, follow",
    ogImage: metaTags.ogImage || data.ogImage || "",
    enableWebsiteSchema: jsonLd.enableWebsiteSchema ?? data.enableWebsiteSchema ?? true,
    enableOrganizationSchema:
      jsonLd.enableOrganizationSchema ?? data.enableOrganizationSchema ?? true,
    enableJobPostingSchema:
      jsonLd.enableJobPostingSchema ?? data.enableJobPostingSchema ?? true,
    website: {
      ...EMPTY_HOME_PAGE_SEO.website,
      ...(jsonLd.website || data.website || {}),
    },
    organization: {
      ...EMPTY_HOME_PAGE_SEO.organization,
      ...organization,
      address: {
        ...EMPTY_ADDRESS,
        ...(organization.address || {}),
      },
      sameAs: toSameAsString(organization.sameAs),
    },
  };
};

export const buildHomePageSeoFormData = (form, files = {}) => {
  const fd = new FormData();

  fd.append("isActive", String(Boolean(form.isActive)));
  fd.append("title", form.title || "");
  fd.append("description", form.description || "");
  fd.append("keywords", form.keywords || "");
  fd.append("ogTitle", form.ogTitle || "");
  fd.append("ogDescription", form.ogDescription || "");
  fd.append("canonicalUrl", form.canonicalUrl || "");
  fd.append("robots", form.robots || "index, follow");
  fd.append("enableWebsiteSchema", String(Boolean(form.enableWebsiteSchema)));
  fd.append(
    "enableOrganizationSchema",
    String(Boolean(form.enableOrganizationSchema)),
  );
  fd.append(
    "enableJobPostingSchema",
    String(Boolean(form.enableJobPostingSchema)),
  );
  fd.append("website", JSON.stringify(form.website || {}));
  fd.append(
    "organization",
    JSON.stringify({
      ...form.organization,
      sameAs: (form.organization?.sameAs || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }),
  );

  if (files.ogImage) fd.append("ogImage", files.ogImage);
  if (files.organizationLogo) fd.append("organizationLogo", files.organizationLogo);

  return fd;
};

export const fetchHomePageSeoConfig = () =>
  axios.get(`${API_BASE_URL}getHomePageSeoConfig`, adminConfig());

export const updateHomePageSeoConfig = (form, files = {}) =>
  axios.post(
    `${API_BASE_URL}updateHomePageSeoConfig`,
    buildHomePageSeoFormData(form, files),
    adminConfig(),
  );

export const fetchPublicHomePageSeo = () =>
  axios.get(`${API_BASE_URL}public/homePageSeo`);
