describe("Jobseeker Report Job API & Payload validation", () => {
  const ALLOWED_REASONS = [
    "Scam / Fraud",
    "Inappropriate content",
    "Fake company",
    "Discriminatory",
    "Misleading salary",
    "Expired job",
    "Other",
  ];

  const buildReportPayload = ({ reason, details = "", email = "" }) => {
    if (!ALLOWED_REASONS.includes(reason)) {
      throw new Error(`Invalid report reason: ${reason}`);
    }
    return {
      reason,
      details: details.trim(),
      email: email.trim(),
    };
  };

  test("validates and formats valid report payload", () => {
    const payload = buildReportPayload({
      reason: "Scam / Fraud",
      details: "They asked for an upfront payment.",
      email: "candidate@example.com",
    });

    expect(payload.reason).toBe("Scam / Fraud");
    expect(payload.details).toBe("They asked for an upfront payment.");
    expect(payload.email).toBe("candidate@example.com");
  });

  test("allows all 7 specified reasons", () => {
    ALLOWED_REASONS.forEach((reason) => {
      const payload = buildReportPayload({ reason });
      expect(payload.reason).toBe(reason);
    });
  });

  test("throws error for unsupported reason", () => {
    expect(() => {
      buildReportPayload({ reason: "Unrecognized Reason" });
    }).toThrow("Invalid report reason");
  });
});
