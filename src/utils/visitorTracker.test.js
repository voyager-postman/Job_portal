import {
  getStoredVisitorId,
  setStoredVisitorId,
  getDeviceType,
  getBrowserName,
  extractUtmParameters,
  getPageTypeFromPath,
  trackVisitorPage,
  trackVisitorApi,
  VISITOR_ID_KEY,
} from "./visitorTracker";

import axios from "axios";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
  post: jest.fn(),
}));

describe("visitorTracker utility", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test("getStoredVisitorId and setStoredVisitorId manage localStorage correctly", () => {
    expect(getStoredVisitorId()).toBe("");
    setStoredVisitorId("vis_12345");
    expect(localStorage.getItem(VISITOR_ID_KEY)).toBe("vis_12345");
    expect(getStoredVisitorId()).toBe("vis_12345");
  });

  test("getPageTypeFromPath maps paths accurately", () => {
    expect(getPageTypeFromPath("/")).toBe("home");
    expect(getPageTypeFromPath("/jobs")).toBe("jobs");
    expect(getPageTypeFromPath("/job/software-engineer")).toBe("job_detail");
    expect(getPageTypeFromPath("/register")).toBe("candidate_register");
    expect(getPageTypeFromPath("/candidate/profile")).toBe("candidate_landing");
    expect(getPageTypeFromPath("/employer-home")).toBe("company_landing");
    expect(getPageTypeFromPath("/unknown-page-xyz")).toBe("other");
  });

  test("extractUtmParameters parses query string and caches in sessionStorage", () => {
    const query = "?utm_source=linkedin&utm_medium=cpc&utm_campaign=hiring2026";
    const utm = extractUtmParameters(query);

    expect(utm.utmSource).toBe("linkedin");
    expect(utm.utmMedium).toBe("cpc");
    expect(utm.utmCampaign).toBe("hiring2026");
    expect(sessionStorage.getItem("utm_source")).toBe("linkedin");
  });

  test("getDeviceType returns a valid device string", () => {
    const device = getDeviceType();
    expect(["Desktop", "Mobile", "Tablet"]).toContain(device);
  });

  test("getBrowserName returns a valid browser string", () => {
    const browser = getBrowserName();
    expect(typeof browser).toBe("string");
    expect(browser.length).toBeGreaterThan(0);
  });

  test("trackVisitorPage sends API request and updates visitorId in localStorage", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        data: { visitorId: "vis_abc987", isNew: true },
      },
    });

    const result = await trackVisitorPage("candidate_landing", "/register");

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post.mock.calls[0][1]).toMatchObject({
      path: "/register",
      pageType: "candidate_landing",
    });
    expect(result.success).toBe(true);
    expect(getStoredVisitorId()).toBe("vis_abc987");
  });
});
