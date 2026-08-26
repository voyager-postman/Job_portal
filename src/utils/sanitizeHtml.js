import DOMPurify from "dompurify";

/** Allowed tags for rich job/company descriptions from the editor. */
const RICH_TEXT_CONFIG = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "link", "meta", "base"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitize untrusted HTML before rendering with dangerouslySetInnerHTML.
 * Returns an empty string for null/undefined/non-string input.
 */
export function sanitizeHtml(dirty, config = RICH_TEXT_CONFIG) {
  if (dirty == null || dirty === "") return "";
  const html = typeof dirty === "string" ? dirty : String(dirty);
  return DOMPurify.sanitize(html, config);
}

/**
 * Decode common HTML entities (e.g. double-encoded CKEditor content), then sanitize.
 */
export function decodeAndSanitizeHtml(dirty) {
  if (dirty == null || dirty === "") return "";
  let html = typeof dirty === "string" ? dirty : String(dirty);

  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    html = textarea.value;
    // Second pass for double-encoded content
    textarea.innerHTML = html;
    html = textarea.value;
  }

  return sanitizeHtml(html);
}
