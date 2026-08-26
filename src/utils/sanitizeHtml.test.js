import { sanitizeHtml, decodeAndSanitizeHtml } from "./sanitizeHtml";

describe("sanitizeHtml", () => {
  it("strips script tags and event handlers", () => {
    const dirty =
      '<p>Hello</p><script>alert(1)</script><img src=x onerror="alert(1)">';
    const clean = sanitizeHtml(dirty);
    expect(clean).toContain("<p>Hello</p>");
    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("onerror");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeHtml("")).toBe("");
    expect(sanitizeHtml(null)).toBe("");
    expect(sanitizeHtml(undefined)).toBe("");
  });

  it("keeps safe formatting tags", () => {
    const html = "<p><strong>Role</strong></p><ul><li>Duty</li></ul>";
    expect(sanitizeHtml(html)).toContain("<strong>Role</strong>");
    expect(sanitizeHtml(html)).toContain("<li>Duty</li>");
  });
});

describe("decodeAndSanitizeHtml", () => {
  it("decodes entities then sanitizes", () => {
    const dirty = "&lt;p&gt;Safe&lt;/p&gt;&lt;script&gt;alert(1)&lt;/script&gt;";
    const clean = decodeAndSanitizeHtml(dirty);
    expect(clean).toContain("<p>Safe</p>");
    expect(clean).not.toContain("<script");
  });
});
