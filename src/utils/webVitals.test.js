import { WEB_VITALS_TARGETS, isMetricWithinTarget } from "./webVitals";

describe("webVitals targets (points 86–89)", () => {
  it("defines FCP / LCP / CLS / TBT targets", () => {
    expect(WEB_VITALS_TARGETS.FCP).toBe(1800);
    expect(WEB_VITALS_TARGETS.LCP).toBe(2500);
    expect(WEB_VITALS_TARGETS.CLS).toBe(0.1);
    expect(WEB_VITALS_TARGETS.TBT).toBe(300);
  });

  it("marks FCP within target when under 1800ms", () => {
    expect(isMetricWithinTarget("FCP", 1200)).toBe(true);
    expect(isMetricWithinTarget("FCP", 1800)).toBe(true);
    expect(isMetricWithinTarget("FCP", 1801)).toBe(false);
  });

  it("marks LCP / CLS / TBT against targets", () => {
    expect(isMetricWithinTarget("LCP", 2400)).toBe(true);
    expect(isMetricWithinTarget("LCP", 2600)).toBe(false);
    expect(isMetricWithinTarget("CLS", 0.05)).toBe(true);
    expect(isMetricWithinTarget("CLS", 0.2)).toBe(false);
    expect(isMetricWithinTarget("TBT", 250)).toBe(true);
    expect(isMetricWithinTarget("TBT", 400)).toBe(false);
  });
});
