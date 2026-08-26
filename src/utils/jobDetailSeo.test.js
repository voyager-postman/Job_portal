import { isJobExpired, resolveJobSeoData, buildJobPostingSchema } from "./seo";

describe("Job Details SEO & Expiration Helpers (Point 113)", () => {
  describe("isJobExpired", () => {
    test("returns true when job.seo.isExpired is true", () => {
      const job = {
        seo: { isExpired: true, isIndexable: false },
        jobDetails: { status: "published" },
      };
      expect(isJobExpired(job)).toBe(true);
    });

    test("returns false when job.seo.isExpired is false and expiresAt is in future", () => {
      const future = new Date(Date.now() + 86400000 * 30).toISOString();
      const job = {
        seo: { isExpired: false, isIndexable: true },
        jobDetails: { status: "published", expiresAt: future },
      };
      expect(isJobExpired(job)).toBe(false);
    });

    test("returns true when jobDetails.status is 'expired'", () => {
      const job = {
        jobDetails: { status: "expired" },
      };
      expect(isJobExpired(job)).toBe(true);
    });

    test("returns true when expiresAt date has passed", () => {
      const past = new Date(Date.now() - 86400000).toISOString();
      const job = {
        jobDetails: { status: "published", expiresAt: past },
      };
      expect(isJobExpired(job)).toBe(true);
    });

    test("returns false when job is active and expiresAt is in future", () => {
      const future = new Date(Date.now() + 86400000 * 10).toISOString();
      const job = {
        jobDetails: { status: "published", expiresAt: future },
      };
      expect(isJobExpired(job)).toBe(false);
    });
  });

  describe("resolveJobSeoData", () => {
    test("sets robots to 'noindex, follow' and isIndexable to false for expired job", () => {
      const expiredJob = {
        jobDetails: {
          _id: "job123",
          jobTitle: "Expired React Dev",
          status: "expired",
          expiresAt: "2026-01-01T00:00:00.000Z",
          slug: "expired-react-dev",
        },
        seo: {
          isExpired: true,
          isIndexable: false,
          robots: "noindex, follow",
          metaTags: {
            title: "Expired React Dev | TechCorp",
            description: "Expired job description",
            canonicalUrl: "https://connectwork.ma/job/expired-react-dev",
            robots: "noindex, follow",
          },
        },
      };

      const result = resolveJobSeoData(expiredJob, "Fallback Title", "/job/fallback");

      expect(result.isExpired).toBe(true);
      expect(result.isIndexable).toBe(false);
      expect(result.robots).toBe("noindex, follow");
      expect(result.title).toBe("Expired React Dev | TechCorp");
      expect(result.description).toBe("Expired job description");
      expect(result.canonical).toBe("https://connectwork.ma/job/expired-react-dev");
    });

    test("sets robots to 'index, follow' and isIndexable to true for active job", () => {
      const future = new Date(Date.now() + 86400000 * 30).toISOString();
      const activeJob = {
        jobDetails: {
          _id: "job456",
          jobTitle: "Senior Fullstack Engineer",
          status: "published",
          expiresAt: future,
          slug: "senior-fullstack-engineer",
        },
        seo: {
          isExpired: false,
          isIndexable: true,
          robots: "index, follow",
          metaTags: {
            title: "Senior Fullstack Engineer | TechCorp",
            description: "Active job description",
            canonicalUrl: "https://connectwork.ma/job/senior-fullstack-engineer",
            robots: "index, follow",
          },
        },
      };

      const result = resolveJobSeoData(activeJob, "Fallback Title", "/job/fallback");

      expect(result.isExpired).toBe(false);
      expect(result.isIndexable).toBe(true);
      expect(result.robots).toBe("index, follow");
      expect(result.title).toBe("Senior Fullstack Engineer | TechCorp");
      expect(result.description).toBe("Active job description");
    });

    test("uses provided seo.jsonLd when available", () => {
      const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: "Senior Fullstack Engineer",
        validThrough: "2026-09-16T09:37:40.228Z",
      };

      const jobWithJsonLd = {
        jobDetails: { _id: "job789", jobTitle: "Senior Fullstack Engineer" },
        seo: {
          isExpired: false,
          jsonLd: jsonLdData,
        },
      };

      const result = resolveJobSeoData(jobWithJsonLd);
      expect(result.jsonLd).toEqual(jsonLdData);
    });

    test("buildJobPostingSchema supports validThrough from expiresAt", () => {
      const job = {
        jobDetails: {
          _id: "job999",
          jobTitle: "Software Architect",
          expiresAt: "2026-12-31T23:59:59.000Z",
          shortDescription: "Build scalable systems",
        },
      };

      const schema = buildJobPostingSchema(job, "https://connectwork.ma/job/software-architect");
      expect(schema["@type"]).toBe("JobPosting");
      expect(schema.title).toBe("Software Architect");
      expect(schema.validThrough).toBe("2026-12-31T23:59:59.000Z");
    });
  });
});
