import axios from "axios";
import { API_BASE_URL } from "../Url/Url";

/** Extract a job slug from a redirect location or slug field. */
export const resolveRedirectSlug = (locationOrSlug) => {
  if (!locationOrSlug) return null;
  const value = String(locationOrSlug).trim();
  if (!value) return null;

  // Full URL or path: /job/:slug or /job-details/:slug
  const pathMatch = value.match(/\/(?:job|job-details)\/([^/?#]+)/i);
  if (pathMatch?.[1]) {
    return decodeURIComponent(pathMatch[1]);
  }

  // Bare slug (no slashes)
  if (!value.includes("/")) {
    return decodeURIComponent(value);
  }

  // Fallback: last path segment
  try {
    const pathname = value.startsWith("http")
      ? new URL(value).pathname
      : value;
    const segment = pathname.split("/").filter(Boolean).pop();
    return segment ? decodeURIComponent(segment) : null;
  } catch {
    return null;
  }
};

export const fetchJobRecord = async (slugOrId, token) => {
  if (!slugOrId) {
    throw new Error("Job identifier is required");
  }

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const encoded = encodeURIComponent(slugOrId);
  const endpoints = [
    `${API_BASE_URL}getJobBySlug/${encoded}`,
    `${API_BASE_URL}getJobById/${encoded}`,
  ];

  let lastError;
  for (const url of endpoints) {
    try {
      const res = await axios.get(url, {
        headers,
        // Do not auto-follow HTTP 301 so the SPA can rewrite the URL.
        maxRedirects: 0,
        validateStatus: (status) => status === 200 || status === 301,
      });

      if (res.status === 301 || res.data?.redirect) {
        const location = res.data?.location || res.data?.slug;
        const slug = resolveRedirectSlug(location);
        if (slug) {
          return { redirect: true, slug, location };
        }
      }

      const payload = res.data?.data ?? res.data?.job ?? null;
      if (payload) {
        return payload;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Job not found");
};
