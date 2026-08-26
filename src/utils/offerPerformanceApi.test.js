import axios from "axios";
import {
  getRecruiterOfferPerformanceAnalytics,
  calculateAbandonmentCount,
  calculateAbandonmentRate,
  calculateClickToApplyRate,
  calculateViewToClickRate,
} from "./offerPerformanceApi";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  get: jest.fn(),
}));

describe("Offer Performance Analytics (Metric 11-3) Helper Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("Calculations", () => {
    test("calculateAbandonmentCount calculates correctly", () => {
      expect(calculateAbandonmentCount(151, 89)).toBe(62);
      expect(calculateAbandonmentCount(10, 15)).toBe(0); // non-negative clamp
      expect(calculateAbandonmentCount(0, 0)).toBe(0);
    });

    test("calculateAbandonmentRate calculates percentage accurately", () => {
      // (151 - 89) / 151 * 100 = 41.0596... -> 41.06
      expect(calculateAbandonmentRate(151, 89)).toBe(41.06);
      expect(calculateAbandonmentRate(0, 0)).toBe(0);
      expect(calculateAbandonmentRate(100, 100)).toBe(0);
    });

    test("calculateClickToApplyRate calculates percentage accurately", () => {
      // 89 / 151 * 100 = 58.9403... -> 58.94
      expect(calculateClickToApplyRate(151, 89)).toBe(58.94);
      expect(calculateClickToApplyRate(0, 0)).toBe(0);
    });

    test("calculateViewToClickRate calculates percentage accurately", () => {
      // 151 / 2550 * 100 = 5.9215... -> 5.92
      expect(calculateViewToClickRate(2550, 151)).toBe(5.92);
      expect(calculateViewToClickRate(0, 0)).toBe(0);
    });
  });

  describe("API Calls", () => {
    test("getRecruiterOfferPerformanceAnalytics issues GET request with correct URL & query params", async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          success: true,
          metricInfo: { metricCode: "11-3" },
          data: { summary: { totalClicks: 151 } },
        },
      });

      localStorage.setItem("token", "test_recruiter_jwt_token");

      const response = await getRecruiterOfferPerformanceAnalytics({
        year: 2026,
        status: "published",
        page: 1,
        limit: 20,
      });

      expect(axios.get).toHaveBeenCalledTimes(1);
      const calledUrl = axios.get.mock.calls[0][0];
      expect(calledUrl).toContain("recruiter/analytics/offer-performance");
      expect(calledUrl).toContain("year=2026");
      expect(calledUrl).toContain("status=published");
      expect(calledUrl).toContain("page=1");
      expect(calledUrl).toContain("limit=20");
      expect(response.data.success).toBe(true);
    });
  });
});
