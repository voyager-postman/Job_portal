import { API_IMAGE_URL } from "../Url/Url";

const normalizeBaseUrl = (url = "") => String(url).trim().replace(/\/+$/, "");

const resolveSiteBaseUrl = () => {
  const fromEnv = normalizeBaseUrl(process.env.REACT_APP_SITE_URL || "");
  if (fromEnv) return fromEnv;

  if (typeof window !== "undefined" && window.location?.origin) {
    const origin = normalizeBaseUrl(window.location.origin);
    const firstSegment = window.location.pathname
      .split("/")
      .filter(Boolean)[0];
    return firstSegment === "jobPortal" ? `${origin}/jobPortal` : origin;
  }

  return "https://connectwork.ma";
};

const siteUsesJobPortalPrefix = () => {
  const base = normalizeBaseUrl(SITE?.baseUrl || resolveSiteBaseUrl());
  if (/\/jobPortal\/?$/i.test(base)) {
    return true;
  }

  if (typeof window !== "undefined") {
    return window.location.pathname.split("/").filter(Boolean)[0] === "jobPortal";
  }

  return false;
};

const LEGACY_JOB_PATH = /\/job-details\/([^/?#]+)/i;
const CANONICAL_JOB_PATH = /\/job\/([^/?#]+)/i;

export const getJobSlug = (job) => {
  if (!job) return null;
  const details = job.jobDetails || job;
  return (
    job.slug ||
    details.slug ||
    job._id ||
    details._id ||
    job.id ||
    null
  );
};

export const getJobRecordId = (job) => {
  if (!job) return null;
  const details = job.jobDetails || job;
  return job._id || details._id || job.id || null;
};

export const buildJobCanonicalPath = (jobOrSlug) => {
  const slug =
    typeof jobOrSlug === "string" ? jobOrSlug : getJobSlug(jobOrSlug);
  return slug ? `/job/${slug}` : null;
};

export const buildJobCanonicalUrl = (jobOrSlug) => {
  const path = buildJobCanonicalPath(jobOrSlug);
  return path ? absoluteUrl(path) : null;
};

export const normalizeJobAbsoluteUrl = (url, job) => {
  if (!url) {
    return buildJobCanonicalUrl(job);
  }

  const value = String(url);
  const legacyMatch = value.match(LEGACY_JOB_PATH);
  if (legacyMatch) {
    const slug = job ? getJobSlug(job) : legacyMatch[1];
    return buildJobCanonicalUrl(slug || legacyMatch[1]);
  }

  const canonicalMatch = value.match(CANONICAL_JOB_PATH);
  if (canonicalMatch) {
    return buildJobCanonicalUrl(canonicalMatch[1]);
  }

  return value;
};

export const SITE = {
  name: "Connect Work.ma",
  tagline: "Find Jobs and Hire Talent",
  baseUrl: resolveSiteBaseUrl(),
  defaultImage: "/assets/images/logoBg.png",
  defaultDescription:
    "Find jobs, explore companies, and connect with hiring teams on Connect Work.ma.",
  locale: "en_US",
  twitterCard: "summary_large_image",
  twitterSite: "@connectworkma",
  ogImageWidth: 1200,
  ogImageHeight: 630,
};

const EMPLOYMENT_TYPE_MAP = {
  "full time": "FULL_TIME",
  fulltime: "FULL_TIME",
  "full-time": "FULL_TIME",
  "part time": "PART_TIME",
  parttime: "PART_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  contractor: "CONTRACTOR",
  temporary: "TEMPORARY",
  temp: "TEMPORARY",
  intern: "INTERN",
  internship: "INTERN",
  volunteer: "VOLUNTEER",
  "per diem": "PER_DIEM",
  other: "OTHER",
};

export const formatIsoDate = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

export const mapEmploymentType = (value) => {
  if (!value) return undefined;

  const values = Array.isArray(value) ? value : [value];
  const mapped = values
    .map((item) => {
      const normalized = String(item).trim().toLowerCase();
      if (EMPLOYMENT_TYPE_MAP[normalized]) {
        return EMPLOYMENT_TYPE_MAP[normalized];
      }
      const upper = String(item).trim().toUpperCase().replace(/\s+/g, "_");
      const allowed = new Set([
        "FULL_TIME",
        "PART_TIME",
        "CONTRACTOR",
        "TEMPORARY",
        "INTERN",
        "VOLUNTEER",
        "PER_DIEM",
        "OTHER",
      ]);
      return allowed.has(upper) ? upper : undefined;
    })
    .filter(Boolean);

  return mapped.length === 1 ? mapped[0] : mapped.length ? mapped : undefined;
};

export const buildBreadcrumbSchema = (items = []) => {
  const list = (items || []).filter((item) => item?.name && item?.path);
  if (!list.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
};

export const NOINDEX_PATHS = new Set([
  "/login",
  "/register",
  "/recovery-password",
  "/forgot-password",
  "/verify-otp",
  "/employer-register",
  "/employer-login",
  "/email-verification",
  "/verification",
  "/account-verified",
  "/verified-cancel",
  "/payment-success",
  "/payment-failed",
  "/checkout",
  "/start-test",
  "/apply-test",
  "/test-result",
  "/profile-basic-info",
  "/candidate-profile",
  "/resume-builder",
  "/employer-dashboard",
  "/skill-assessments-tests",
  "/certificates-scores",
  "/job-alert",
  "/activity-timeline",
  "/application-management",
  "/applied-jobs-list",
  "/chat-messaging-system",
  "/job-details-list",
  "/candidate-dashboard",
  "/manage-job-application",
  "/your-job-posts",
  "/employer-wallet",
  "/setting",
  "/manage-applicants",
  "/bookmark-candidate",
  "/candidates-search",
  "/all-applicants-list",
  "/create-recruiters",
  "/create-assessment",
  "/request-plan",
  "/manage-recruiter",
  "/manage-assessment",
  "/messaging-system",
  "/company-profile",
  "/assessment-details",
  "/change-password",
  "/candidates-details",
  "/job-search",
  "/job-details-form",
  "/view-invoice",
  "/applied-candidate-list",
  "/applicants-details",
]);

export const RESERVED_SINGLE_SEGMENT_PATHS = new Set([
  "login",
  "register",
  "recovery-password",
  "forgot-password",
  "verify-otp",
  "employer-register",
  "employer-login",
  "email-verification",
  "verification",
  "account-verified",
  "verified-cancel",
  "contact-us",
  "privacy-policy",
  "terms-condition",
  "companies",
  "faq",
  "applied-candidate-list",
  "applicants-details",
  "about-us",
  "blog",
  "payment-success",
  "payment-failed",
  "employer-home",
  "employer-basic-info",
  "jobs",
  "custom-resume-cover-letter",
  "company-details",
  "add-plan",
  "add-on-pack",
  "companies-list",
  "job",
  "job-details",
  "blogDetails",
]);

export const DYNAMIC_SEO_PATTERNS = [
  /^\/job\/.+/,
  /^\/blogDetails\/.+/,
  /^\/faq\/.+/,
];

export const stripHtml = (html, maxLength = 160) => {
  if (!html) return "";
  const text = String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!maxLength || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}…`;
};

const resolveUploadPhotoUrl = (imagePath) => {
  const value = String(imagePath || "").trim();
  if (!value) return null;

  let filename = null;

  if (/^https?:\/\//i.test(value)) {
    const patterns = [
      /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/jobPortal\/photos\/(.+)$/i,
      /^https?:\/\/[^/]+\/job_portal\/uploads\/photos\/(.+)$/i,
      /^https?:\/\/yoursite\.com\/uploads\/photos\/(.+)$/i,
      /^https?:\/\/[^/]+\/jobPortal\/uploads\/photos\/(.+)$/i,
      /^https?:\/\/[^/]+\/uploads\/photos\/(.+)$/i,
      /^https?:\/\/[^/]+\/jobPortal\/photos\/(.+)$/i,
    ];

    for (const pattern of patterns) {
      const match = value.match(pattern);
      if (match) {
        filename = match[1];
        break;
      }
    }
  } else {
    const relativePatterns = [
      /^\/?photos\/(.+)$/i,
      /^\/?uploads\/photos\/(.+)$/i,
    ];

    for (const pattern of relativePatterns) {
      const match = value.match(pattern);
      if (match) {
        filename = match[1];
        break;
      }
    }
  }

  if (!filename) return null;

  const cleanFilename = String(filename).replace(/^\/+/, "");
  return `${API_IMAGE_URL}photos/${cleanFilename}`;
};

export const resolveImageUrl = (imagePath) => {
  if (!imagePath) return absoluteUrl(SITE.defaultImage);

  const uploadPhotoUrl = resolveUploadPhotoUrl(imagePath);
  if (uploadPhotoUrl) return uploadPhotoUrl;

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (imagePath.startsWith("/jobPortal/")) {
    return `${SITE.baseUrl.replace(/\/jobPortal$/, "")}${imagePath}`;
  }
  if (imagePath.startsWith("/")) {
    return `${SITE.baseUrl}${imagePath.replace(/^\/jobPortal/, "")}`;
  }
  return `${API_IMAGE_URL}${imagePath}`;
};

export const absoluteUrl = (path = "/") => {
  if (!path) return SITE.baseUrl;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return normalizeJobAbsoluteUrl(path);
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  const origin = normalizeBaseUrl(SITE.baseUrl).replace(/\/jobPortal\/?$/i, "");
  const withPrefix =
    siteUsesJobPortalPrefix() && !normalized.startsWith("/jobPortal")
      ? `/jobPortal${normalized === "/" ? "" : normalized}`
      : normalized;

  return `${origin}${withPrefix}`;
};

export const normalizeJsonLdSchemas = (jsonLd, jobs = []) => {
  const list = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  const jobById = new Map();

  jobs.forEach((job) => {
    const key = getJobRecordId(job);
    if (key) {
      jobById.set(String(key), job);
    }
  });

  return list
    .map((schema) => {
      if (!schema || schema["@type"] !== "JobPosting") {
        return schema;
      }

      const matched =
        schema.identifier != null
          ? jobById.get(String(schema.identifier))
          : null;
      const canonical = buildJobCanonicalUrl(matched || schema.identifier);

      if (!canonical) {
        return null;
      }

      return {
        ...schema,
        url: normalizeJobAbsoluteUrl(schema.url, matched) || canonical,
        identifier: getJobSlug(matched) || schema.identifier,
      };
    })
    .filter(Boolean);
};

export const buildHomePageJsonLd = ({
  apiJsonLd,
  jobs = [],
  fallback = [],
  includeJobPosting = true,
}) => {
  const apiList = Array.isArray(apiJsonLd) ? apiJsonLd : apiJsonLd ? [apiJsonLd] : [];
  const nonJobSchemas = apiList.filter((schema) => schema?.["@type"] !== "JobPosting");
  const baseSchemas = nonJobSchemas.length ? nonJobSchemas : fallback;
  const sanitizedBase = normalizeJsonLdSchemas(baseSchemas, jobs);

  if (!includeJobPosting) {
    return sanitizedBase;
  }

  const jobSchemas = jobs
    .map((job) => buildJobPostingSchema(job, buildJobCanonicalUrl(job)))
    .filter(Boolean);

  return [...sanitizedBase, ...jobSchemas];
};

export const buildPageTitle = (title) => {
  if (!title) return `${SITE.name} | ${SITE.tagline}`;
  if (title.includes(SITE.name)) return title;
  return `${title} | ${SITE.name}`;
};

export const buildWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: absoluteUrl("/"),
  description: SITE.defaultDescription,
  potentialAction: {
    "@type": "SearchAction",
    target: `${absoluteUrl("/jobs")}?keywords={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const buildOrganizationSchema = (overrides = {}) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: absoluteUrl("/"),
  logo: resolveImageUrl(SITE.defaultImage),
  description: SITE.defaultDescription,
  ...overrides,
});

export const buildJobPostingSchema = (job, canonicalUrl) => {
  const details = job?.jobDetails || job;
  if (!details) return null;

  const cities = Array.isArray(details.city)
    ? details.city
    : details.city
      ? [details.city]
      : [];
  const locationName =
    cities.join(", ") || details.companyId?.city || "Morocco";

  const employmentType = mapEmploymentType(details.employmentType);
  const isRemote =
    details.remote === true ||
    details.workMode === "remote" ||
    (Array.isArray(details.jobType) &&
      details.jobType.some((type) => String(type).toLowerCase().includes("remote")));

  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: details.jobTitle,
    description: stripHtml(
      details.shortDescription || details.jobDescription,
      5000,
    ),
    datePosted: formatIsoDate(details.createdAt),
    validThrough: formatIsoDate(details.expiryDate),
    employmentType,
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: details.companyId?.brandName || SITE.name,
      sameAs: details.companyId?.website || undefined,
      logo: details.companyId?.logo
        ? resolveImageUrl(details.companyId.logo)
        : undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: locationName,
        addressCountry: "MA",
      },
    },
    url: canonicalUrl || buildJobCanonicalUrl(job),
    identifier: {
      "@type": "PropertyValue",
      name: SITE.name,
      value: getJobSlug(job) || details._id || job?._id,
    },
  };

  if (isRemote) {
    schema.jobLocationType = "TELECOMMUTE";
    schema.applicantLocationRequirements = {
      "@type": "Country",
      name: "Morocco",
    };
  }

  const minSalary = details.privatJobDetails?.minSalary;
  const maxSalary = details.privatJobDetails?.maxSalary;
  if (minSalary || maxSalary) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "MAD",
      value: {
        "@type": "QuantitativeValue",
        minValue: minSalary || undefined,
        maxValue: maxSalary || undefined,
        unitText: "MONTH",
      },
    };
  }

  return schema;
};

export const buildCompanyOrganizationSchema = (company, canonicalUrl) => {
  if (!company) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.brandName || company.companyName,
    url: canonicalUrl,
    logo: company.logo ? resolveImageUrl(company.logo) : undefined,
    description: stripHtml(company.aboutCompany, 500),
    address: company.city
      ? {
          "@type": "PostalAddress",
          addressLocality: company.city,
          addressCountry: "MA",
        }
      : undefined,
    sameAs: company.website || undefined,
  };
};

export const buildBlogPostingSchema = (blog, canonicalUrl) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: blog.title,
  image: resolveImageUrl(blog.bannerImage),
  author: {
    "@type": "Person",
    name: blog.authorName || SITE.name,
  },
  datePublished: blog.publishDate || blog.createdAt,
  description: stripHtml(blog.content),
  mainEntityOfPage: canonicalUrl,
  url: canonicalUrl,
});

export const buildFaqPageSchema = (faqs, pageUrl) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: (faqs || []).map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: stripHtml(faq.answer, 2000),
    },
  })),
  url: pageUrl,
});

export const isDynamicSeoRoute = (pathname) =>
  DYNAMIC_SEO_PATTERNS.some((pattern) => pattern.test(pathname));

export const isCompanySlugRoute = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 1) return false;
  return !RESERVED_SINGLE_SEGMENT_PATHS.has(segments[0]);
};
