/**
 * Build-time sitemap generator.
 * Fetches public jobs, companies, and blogs from the API and writes public/sitemap.xml.
 *
 * Env (optional):
 *   REACT_APP_SITE_URL  — e.g. https://itdevelopmentservices.com/jobPortal
 *   REACT_APP_API_URL   — e.g. https://sisccltd.com/job_portal/api/
 */

const fs = require("fs");
const path = require("path");

const SITE_URL = (
  process.env.REACT_APP_SITE_URL || "https://itdevelopmentservices.com/jobPortal"
).replace(/\/+$/, "");

const API_BASE_URL = (() => {
  const fromEnv =
    process.env.REACT_APP_API_URL?.trim() ||
    process.env.REACT_APP_API_BASE_URL?.trim();
  if (fromEnv) {
    return fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`;
  }
  return "https://sisccltd.com/job_portal/api/";
})();

const STATIC_PAGES = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/jobs", changefreq: "daily", priority: "0.9" },
  { loc: "/companies", changefreq: "weekly", priority: "0.8" },
  { loc: "/about-us", changefreq: "monthly", priority: "0.7" },
  { loc: "/contact-us", changefreq: "monthly", priority: "0.7" },
  { loc: "/blog", changefreq: "weekly", priority: "0.7" },
  { loc: "/employer-home", changefreq: "monthly", priority: "0.7" },
  { loc: "/privacy-policy", changefreq: "yearly", priority: "0.4" },
  { loc: "/terms-condition", changefreq: "yearly", priority: "0.4" },
  { loc: "/faq/jobseeker", changefreq: "monthly", priority: "0.5" },
  { loc: "/faq/recruiter", changefreq: "monthly", priority: "0.5" },
  {
    loc: "/custom-resume-cover-letter",
    changefreq: "monthly",
    priority: "0.5",
  },
  { loc: "/add-plan", changefreq: "monthly", priority: "0.5" },
  { loc: "/add-on-pack", changefreq: "monthly", priority: "0.5" },
];

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toAbsolute = (pathname) => {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withPrefix = normalized.startsWith("/jobPortal")
    ? normalized
    : `/jobPortal${normalized === "/" ? "" : normalized}`;
  return `${SITE_URL.replace(/\/jobPortal$/, "")}${withPrefix}`;
};

const getJobSlug = (job) => {
  const details = job?.jobDetails || job;
  return (
    job?.slug ||
    details?.slug ||
    job?._id ||
    details?._id ||
    job?.id ||
    null
  );
};

const getCompanySlug = (entry) => {
  const company = entry?.companyId || entry;
  return company?.slug || company?._id || null;
};

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}

async function fetchAllJobs() {
  const jobs = [];
  const limit = 100;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = `${API_BASE_URL}getAllJob?limit=${limit}&page=${page}`;
    const data = await fetchJson(url);
    const batch = data?.jobs || [];
    jobs.push(...batch);
    totalPages = Number(data?.totalPages) || 1;
    page += 1;
    if (!batch.length) break;
  }

  return jobs;
}

function extractCompaniesFromResponse(data) {
  const list = [];

  if (Array.isArray(data?.companies)) {
    list.push(...data.companies);
  }

  const sections = data?.sections || {};
  ["justJoinedUs", "companiesOfMoment", "partnerCompanies"].forEach((key) => {
    if (Array.isArray(sections[key])) {
      list.push(...sections[key]);
    }
  });

  return list;
}

async function fetchAllCompanies() {
  const companies = [];
  const seen = new Set();
  const limit = 100;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = `${API_BASE_URL}GetCompanyDetailsList?limit=${limit}&page=${page}`;
    const data = await fetchJson(url);
    extractCompaniesFromResponse(data).forEach((entry) => {
      const slug = getCompanySlug(entry);
      if (slug && !seen.has(slug)) {
        seen.add(slug);
        companies.push(entry);
      }
    });
    totalPages = Number(data?.totalPages) || 1;
    page += 1;
    if (!extractCompaniesFromResponse(data).length) break;
  }

  return companies;
}

async function fetchAllBlogs() {
  const blogs = [];
  const limit = 100;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = `${API_BASE_URL}getActiveBlogs?limit=${limit}&page=${page}`;
    const data = await fetchJson(url);
    const batch = data?.data || [];
    blogs.push(...batch);
    totalPages = Number(data?.totalPages) || 1;
    page += 1;
    if (!batch.length) break;
  }

  return blogs;
}

function buildUrlEntry({ loc, changefreq = "weekly", priority = "0.6", lastmod }) {
  const lastmodTag = lastmod
    ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>`
    : "";
  return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
  const urlEntries = new Map();

  STATIC_PAGES.forEach((page) => {
    urlEntries.set(page.loc, {
      loc: toAbsolute(page.loc),
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  try {
    const [jobs, companies, blogs] = await Promise.all([
      fetchAllJobs(),
      fetchAllCompanies(),
      fetchAllBlogs(),
    ]);

    jobs.forEach((job) => {
      const slug = getJobSlug(job);
      if (!slug) return;
      const details = job?.jobDetails || job;
      const lastmod =
        details?.updatedAt || details?.createdAt || undefined;
      urlEntries.set(`/job/${slug}`, {
        loc: toAbsolute(`/job/${slug}`),
        changefreq: "daily",
        priority: "0.8",
        lastmod: lastmod ? new Date(lastmod).toISOString().split("T")[0] : undefined,
      });
    });

    companies.forEach((entry) => {
      const slug = getCompanySlug(entry);
      if (!slug) return;
      urlEntries.set(`/${slug}`, {
        loc: toAbsolute(`/${slug}`),
        changefreq: "weekly",
        priority: "0.7",
      });
    });

    blogs.forEach((blog) => {
      const id = blog?._id || blog?.id;
      if (!id) return;
      const lastmod = blog?.publishDate || blog?.updatedAt || blog?.createdAt;
      urlEntries.set(`/blogDetails/${id}`, {
        loc: toAbsolute(`/blogDetails/${id}`),
        changefreq: "monthly",
        priority: "0.6",
        lastmod: lastmod ? new Date(lastmod).toISOString().split("T")[0] : undefined,
      });
    });

    console.log(
      `Sitemap: ${urlEntries.size} URLs (${jobs.length} jobs, ${companies.length} companies, ${blogs.length} blogs)`,
    );
  } catch (error) {
    console.warn(
      `Sitemap API fetch failed — using static pages only: ${error.message}`,
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urlEntries.values()).map(buildUrlEntry).join("\n")}
</urlset>
`;

  const outputPath = path.join(__dirname, "..", "public", "sitemap.xml");
  fs.writeFileSync(outputPath, xml, "utf8");
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
