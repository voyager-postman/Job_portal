import axios from "axios";
import {
  fetchPublicGlobalSeoConfig,
  fetchAdminGlobalSeoConfig,
  updateAdminGlobalSeoConfig,
  normalizeGlobalSeoConfig,
  formatTitleWithTemplate,
  EMPTY_GLOBAL_SEO,
} from "./globalSeoApi";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
  get: jest.fn(),
  post: jest.fn(),
}));

describe("Global SEO Settings (Point 13-1 / Point 3) Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("Title Formatting", () => {
    test("formatTitleWithTemplate replaces %s with page title", () => {
      expect(
        formatTitleWithTemplate("Senior Developer", "%s | TopCareer", "Default")
      ).toBe("Senior Developer | TopCareer");
    });

    test("formatTitleWithTemplate returns defaultTitle when page title is empty", () => {
      expect(
        formatTitleWithTemplate("", "%s | TopCareer", "Default Title")
      ).toBe("Default Title");
      expect(
        formatTitleWithTemplate(null, "%s | TopCareer", "Default Title")
      ).toBe("Default Title");
    });

    test("formatTitleWithTemplate falls back to dash prefix if %s missing", () => {
      expect(
        formatTitleWithTemplate("About Us", "TopCareer Site", "Default")
      ).toBe("About Us - Default");
    });
  });

  describe("Normalization", () => {
    test("normalizeGlobalSeoConfig handles full API response", () => {
      const apiResponse = {
        data: {
          siteName: "TopCareer Portal",
          siteUrl: "https://topcareer.example.com",
          titleTemplate: "%s | TopCareer Portal",
          defaultTitle: "TopCareer - Jobs",
          defaultDescription: "Find remote jobs",
          defaultKeywords: ["jobs", "careers"],
          verificationTags: {
            google: "google-token-123",
            bing: "bing-token-456",
          },
          analytics: {
            googleAnalyticsId: "G-TEST123",
            googleTagManagerId: "GTM-XYZ",
            metaPixelId: "12345",
          },
        },
      };

      const result = normalizeGlobalSeoConfig(apiResponse);
      expect(result.siteName).toBe("TopCareer Portal");
      expect(result.titleTemplate).toBe("%s | TopCareer Portal");
      expect(result.verificationTags.google).toBe("google-token-123");
      expect(result.analytics.googleAnalyticsId).toBe("G-TEST123");
    });

    test("normalizeGlobalSeoConfig falls back cleanly when response is empty", () => {
      const result = normalizeGlobalSeoConfig({});
      expect(result.siteName).toBe(EMPTY_GLOBAL_SEO.siteName);
      expect(result.titleTemplate).toBe(EMPTY_GLOBAL_SEO.titleTemplate);
    });
  });

  describe("API Calls", () => {
    test("fetchPublicGlobalSeoConfig calls GET /api/public/seo/global", async () => {
      axios.get.mockResolvedValueOnce({
        data: { success: true, data: { siteName: "TopCareer Portal" } },
      });

      const res = await fetchPublicGlobalSeoConfig();

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get.mock.calls[0][0]).toContain("public/seo/global");
      expect(res.data.success).toBe(true);
    });

    test("fetchAdminGlobalSeoConfig calls GET /api/admin/seo/global", async () => {
      axios.get.mockResolvedValueOnce({
        data: { success: true, data: { _id: "123" } },
      });

      localStorage.setItem("adminToken", "test_admin_token");
      const res = await fetchAdminGlobalSeoConfig();

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get.mock.calls[0][0]).toContain("admin/seo/global");
      expect(res.data.success).toBe(true);
    });

    test("updateAdminGlobalSeoConfig issues POST /api/admin/seo/global", async () => {
      axios.post.mockResolvedValueOnce({
        data: { success: true, message: "Updated" },
      });

      localStorage.setItem("adminToken", "test_admin_token");
      const res = await updateAdminGlobalSeoConfig({
        siteName: "TopCareer",
      });

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post.mock.calls[0][0]).toContain("admin/seo/global");
      expect(res.data.success).toBe(true);
    });
  });
});
