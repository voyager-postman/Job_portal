import {
  isSecureApiUrl,
  redactSensitiveData,
  usesClientPasswordEncryption,
} from "./secureCredentials";

describe("secureCredentials", () => {
  it("redacts password-related fields", () => {
    expect(
      redactSensitiveData({
        email: "user@example.com",
        password: "secret",
        oldPassword: "old",
        newPassword: "new",
        confirmPassword: "new",
      }),
    ).toEqual({
      email: "user@example.com",
      password: "[REDACTED]",
      oldPassword: "[REDACTED]",
      newPassword: "[REDACTED]",
      confirmPassword: "[REDACTED]",
    });
  });

  it("allows https api bases", () => {
    expect(isSecureApiUrl("https://sisccltd.com/job_portal/api/")).toBe(true);
  });

  it("allows local LAN http api bases", () => {
    expect(isSecureApiUrl("http://192.168.1.112:4000/api/")).toBe(true);
    expect(isSecureApiUrl("http://localhost:4000/api/")).toBe(true);
  });

  it("blocks remote http api bases outside development", () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    expect(isSecureApiUrl("http://example.com/api/")).toBe(false);

    process.env.NODE_ENV = previousNodeEnv;
  });

  it("reports client encryption enabled by default", () => {
    expect(usesClientPasswordEncryption()).toBe(true);
  });
});
