import { API_IMAGE_URL } from "../Url/Url";

const PUBLIC_PREFIX = (process.env.PUBLIC_URL || "/jobPortal").replace(/\/$/, "");

export const DEFAULT_COMPANY_LOGO = `${PUBLIC_PREFIX}/assets/images/dashboard/images1.png`;
export const DEFAULT_USER_AVATAR = `${PUBLIC_PREFIX}/assets/images/userIcon.png`;
export const DEFAULT_USER_ICON = `${PUBLIC_PREFIX}/assets/images/userIcon.png`;

/**
 * High-quality landscape covers for the job hero (1600×700).
 * Local job-img-* assets are ~600–850px and look soft when stretched.
 */
const HIGH_QUALITY_DEFAULT_COVERS = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&h=700&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&h=700&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&h=700&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&h=700&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&h=700&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&h=700&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&h=700&q=80",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&h=700&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&h=700&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&h=700&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&h=700&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&h=700&q=80",
];

export const DEFAULT_JOB_COVER = HIGH_QUALITY_DEFAULT_COVERS[0];

const normalizeCoverPath = (path) => {
  if (path == null) return null;
  if (typeof path !== "string") return path || null;
  const trimmed = path.trim();
  return trimmed || null;
};

const hashSeed = (seed) =>
  String(seed || "")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

/**
 * Stable "random" default cover per job/company id so the section
 * is never empty and the image does not flicker across re-renders.
 */
export const getDeterministicDefaultCover = (seed) => {
  if (!seed) return DEFAULT_JOB_COVER;
  const imgIndex = hashSeed(seed) % HIGH_QUALITY_DEFAULT_COVERS.length;
  return HIGH_QUALITY_DEFAULT_COVERS[imgIndex];
};

export const resolveMediaUrl = (path) => {
  const normalized = normalizeCoverPath(path);
  if (!normalized) return null;

  let clean = normalized.replace(/\\/g, "/").trim();

  if (clean.includes("uploads/https")) {
    clean = clean.substring(clean.indexOf("https"));
  } else if (clean.includes("uploads/http")) {
    clean = clean.substring(clean.indexOf("http"));
  }

  // Handle local public asset paths
  if (clean.startsWith("/jobPortal/") || clean.startsWith("/assets/") || clean.startsWith("assets/")) {
    const withoutPrefix = clean.replace(/^\/?(jobPortal\/)?/, "");
    return `${PUBLIC_PREFIX}/${withoutPrefix}`;
  }

  if (/^https?:\/\//i.test(clean)) {
    const isJobPortalUpload =
      clean.includes("/job_portal/") ||
      clean.includes("/uploads/") ||
      clean.includes("192.168.1.112") ||
      clean.includes("localhost");

    if (!isJobPortalUpload) {
      return clean;
    }
  }

  let relativePath = clean;

  relativePath = relativePath.replace(/^https?:\/\/[^/]+/i, "");
  relativePath = relativePath.replace(/^\/job_portal/i, "");

  while (/^\/?uploads(\/|$)/i.test(relativePath)) {
    relativePath = relativePath.replace(/^\/?uploads\/?/i, "");
  }

  relativePath = relativePath.replace(/^\/+/, "");

  if (!relativePath) return null;

  const base = (API_IMAGE_URL || "").endsWith("/")
    ? API_IMAGE_URL
    : `${API_IMAGE_URL}/`;

  return `${base}${relativePath}`;
};

export const resolveCompanyLogoUrl = (logo) => {
  if (!logo) return DEFAULT_COMPANY_LOGO;
  if (logo === DEFAULT_COMPANY_LOGO) return logo;
  return resolveMediaUrl(logo) || DEFAULT_COMPANY_LOGO;
};

/** Resolve logo path from job payloads across list APIs (getAllJob, RecentAddedJobList, etc.). */
export const getJobCompanyLogoPath = (job = {}) =>
  job.logo ||
  job.companyLogo ||
  job.companyId?.logo ||
  job.company?.logo ||
  job.jobDetails?.companyId?.logo ||
  null;

export const resolveJobCompanyLogoUrl = (job) =>
  resolveCompanyLogoUrl(getJobCompanyLogoPath(job));

/**
 * Resolve job-offer background/cover image path (sync).
 * Prefer the company cover photo; otherwise use a deterministic default.
 */
export const resolveJobCoverUrl = (source, seed) => {
  const company =
    source?.jobDetails?.companyId ||
    source?.companyId ||
    source?.company ||
    source;

  const coverPath =
    normalizeCoverPath(company?.coverPhoto) ||
    normalizeCoverPath(source?.companyCoverPhoto) ||
    normalizeCoverPath(source?.jobDetails?.companyCoverPhoto) ||
    normalizeCoverPath(source?.jobCoverPhoto) ||
    normalizeCoverPath(source?.JobCoverPhoto) ||
    normalizeCoverPath(source?.jobDetails?.jobCoverPhoto) ||
    normalizeCoverPath(source?.jobDetails?.JobCoverPhoto) ||
    null;

  if (coverPath) {
    return resolveMediaUrl(coverPath) || getDeterministicDefaultCover(seed);
  }

  const fallbackSeed =
    seed ||
    source?.jobDetails?._id ||
    source?._id ||
    company?._id ||
    null;

  return getDeterministicDefaultCover(fallbackSeed);
};

/** Wide hero banners look wrong with portrait headshots. */
export const isPortraitCover = (width, height) => {
  if (!width || !height) return false;
  return height > width;
};

export const preloadCoverImage = (url) =>
  new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error("Missing cover url"));
      return;
    }

    const img = new Image();
    if (String(url).startsWith("http")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () =>
      resolve({
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    img.onerror = () => reject(new Error(`Failed to load cover: ${url}`));
    img.src = url;
  });

/**
 * Resolve + preload the final hero URL so the UI never flashes a wrong image.
 * Portraits and broken remote covers fall back to a high-quality default.
 */
export const resolveHeroCoverUrl = async (source, seed) => {
  const fallback = getDeterministicDefaultCover(
    seed ||
      source?.jobDetails?._id ||
      source?._id ||
      source?.jobDetails?.companyId?._id ||
      null,
  );
  const candidate = resolveJobCoverUrl(source, seed);

  const tryLoad = async (url) => {
    const loaded = await preloadCoverImage(url);
    if (isPortraitCover(loaded.width, loaded.height)) {
      return null;
    }
    return loaded.url;
  };

  if (candidate && candidate !== fallback) {
    try {
      const ready = await tryLoad(candidate);
      if (ready) return ready;
    } catch {
      // fall through to default
    }
  }

  try {
    const ready = await tryLoad(fallback);
    if (ready) return ready;
  } catch {
    // ignore
  }

  return fallback;
};

export const resolveUserAvatarUrl = (photo) => {
  if (!photo) return DEFAULT_USER_ICON;
  if (photo === DEFAULT_USER_ICON || photo === DEFAULT_USER_AVATAR) return photo;
  return resolveMediaUrl(photo) || DEFAULT_USER_ICON;
};

export const handleUserAvatarError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = DEFAULT_USER_ICON;
};

export const handleCompanyLogoError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = DEFAULT_COMPANY_LOGO;
};

export const handleJobCoverError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = DEFAULT_JOB_COVER;
};
