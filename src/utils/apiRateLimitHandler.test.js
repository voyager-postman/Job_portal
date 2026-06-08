jest.mock("axios", () => ({
  interceptors: {
    response: {
      use: jest.fn(),
    },
  },
}));

jest.mock("react-toastify", () => ({
  toast: {
    warning: jest.fn(),
    error: jest.fn(),
  },
}));

import {
  formatRetryAfterMessage,
  getRateLimitMessage,
  handleThrottledApiResponse,
  IP_BANNED_ERROR,
  isRateLimitError,
  isThrottledApiResponse,
  RATE_LIMIT_ERROR,
} from "./apiRateLimitHandler";

describe("apiRateLimitHandler", () => {
  it("detects HTTP 429 responses", () => {
    expect(isThrottledApiResponse({}, 429)).toBe(true);
  });

  it("detects IP_BANNED 403 responses", () => {
    const payload = {
      success: false,
      message: IP_BANNED_ERROR.message,
      code: IP_BANNED_ERROR.code,
      retryAfter: 1791,
    };

    expect(isThrottledApiResponse(payload, 403)).toBe(true);
    expect(
      isRateLimitError({
        response: { status: 403, data: payload },
      }),
    ).toBe(true);
  });

  it("detects RATE_LIMIT API codes", () => {
    const payload = {
      success: false,
      message: RATE_LIMIT_ERROR.message,
      code: RATE_LIMIT_ERROR.code,
    };

    expect(isThrottledApiResponse(payload, 200)).toBe(true);
  });

  it("ignores unrelated 403 responses", () => {
    expect(
      isThrottledApiResponse(
        { success: false, message: "Insufficient role", code: "FORBIDDEN" },
        403,
      ),
    ).toBe(false);
  });

  it("appends retryAfter guidance to the toast message", () => {
    const message = getRateLimitMessage({
      message: IP_BANNED_ERROR.message,
      code: IP_BANNED_ERROR.code,
      retryAfter: 1791,
    });

    expect(message).toContain("Try again in");
    expect(formatRetryAfterMessage(45)).toBe(" Try again in 45 seconds.");
    expect(formatRetryAfterMessage(120)).toBe(" Try again in 2 minutes.");
  });

  it("handles throttled fetch-style payloads", () => {
    const shown = handleThrottledApiResponse(
      {
        success: false,
        message: IP_BANNED_ERROR.message,
        code: IP_BANNED_ERROR.code,
        retryAfter: 60,
      },
      403,
    );

    expect(shown).toBe(true);
  });
});
