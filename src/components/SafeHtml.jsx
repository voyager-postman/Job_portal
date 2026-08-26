import React from "react";
import { decodeAndSanitizeHtml, sanitizeHtml } from "../utils/sanitizeHtml";

/**
 * Renders untrusted HTML safely via DOMPurify.
 * Prefer plain React text nodes when HTML is not required.
 */
function SafeHtml({
  html,
  as: Component = "div",
  className,
  decode = false,
  fallback = null,
  ...rest
}) {
  const cleaned = decode
    ? decodeAndSanitizeHtml(html)
    : sanitizeHtml(html);

  if (!cleaned) {
    if (fallback == null) return null;
    if (typeof fallback === "string") {
      return <Component className={className} {...rest}>{fallback}</Component>;
    }
    return fallback;
  }

  return (
    <Component
      className={className}
      {...rest}
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  );
}

export default SafeHtml;
