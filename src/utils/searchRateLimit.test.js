import {
  checkSearchRateLimit,
  resetSearchRateLimit,
  getAnonymousClientId,
} from "./searchRateLimit";

const TEST_CLIENT = "test-client-rate-limit";

describe("searchRateLimit", () => {
  beforeEach(() => {
    localStorage.clear();
    resetSearchRateLimit(undefined, TEST_CLIENT);
  });

  it("blocks after maxRequests within the window", () => {
    const options = {
      maxRequests: 5,
      windowMs: 60_000,
      clientId: TEST_CLIENT,
    };

    for (let i = 0; i < 5; i += 1) {
      const result = checkSearchRateLimit("employers-test", options);
      expect(result.allowed).toBe(true);
    }

    const blocked = checkSearchRateLimit("employers-test", options);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("persists limits in localStorage for the same client id", () => {
    const options = {
      maxRequests: 2,
      windowMs: 60_000,
      clientId: TEST_CLIENT,
    };

    checkSearchRateLimit("persist-test", options);
    checkSearchRateLimit("persist-test", options);

    const blocked = checkSearchRateLimit("persist-test", options);
    expect(blocked.allowed).toBe(false);

    expect(localStorage.getItem("jp_anonymous_client_id")).toBeNull();
    getAnonymousClientId();
    expect(localStorage.getItem("jp_anonymous_client_id")).toBeTruthy();
  });
});
