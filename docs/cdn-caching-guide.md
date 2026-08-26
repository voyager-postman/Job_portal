# Point 112 / Task 18-2: CDN Caching Configuration Guide

## Architecture Overview
CDN caching is enabled **ONLY on the Public Website (Jobseeker / Visitor Portal)** to maximize performance and SEO crawl efficiency while completely bypassing private portals.

| Scope | CDN Caching Status | Reason |
| :--- | :--- | :--- |
| **Public Website** |  **Enabled** | Static legal pages, marketing, SEO metadata, sitemaps, and images are safe to cache globally at edge nodes. |
| **Admin & Recruiter Panels** | ❌ **Bypassed (No Cache)** | Private, authenticated data (applicant resumes, financial balances, candidate scores, recruiter analytics) must never be cached. |

---

## 1. Backend Origin Cache-Control Headers

The backend issues the following cache directives:

| Endpoint | Cache-Control Header | Edge CDN Behavior |
| :--- | :--- | :--- |
| **Sitemap & Robots** (`/sitemap.xml`, `/robots.txt`) | `public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600` | CDN caches for **24 hours**, background revalidates. |
| **Static Legal & Marketing** (`/getAboutUs`, `/getTerms`, `/getPrivacyPolicy`, `/getContactUs`) | `public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600` | CDN caches for **24 hours**. |
| **Public SEO Configs** (`/public/seo/global`, `/public/homePageSeo`, `/public/jobsListingSeo`) | `public, max-age=1800, s-maxage=3600, stale-while-revalidate=600` | CDN caches for **1 hour**. |
| **Job SEO Endpoint** (`/public/seo/job/:job_id`) | `public, max-age=300, s-maxage=600, stale-while-revalidate=300` | Short cache (**5–10 mins**) so expiration updates propagate rapidly. |
| **Uploaded Media & Logos** (`/uploads/*`) | `public, max-age=31536000, immutable` | Cached for **1 year** (immutable). |

---

## 2. Cloudflare Page Rules / Cache Rules Setup

If deploying behind Cloudflare CDN:

### Rule 1: Bypass Private / Authenticated Routes (High Priority)
* **URL Pattern**: `*yourdomain.com/api/admin/*`
* **URL Pattern**: `*yourdomain.com/api/recruiter/*`
* **URL Pattern**: `*yourdomain.com/api/auth/*`
* **Settings**:
  - **Cache Level**: `Bypass`
  - **Disable Apps / Rocket Loader**: (Optional for admin dashboards)

### Rule 2: Long-Term Cache for Static Uploads & Assets
* **URL Pattern**: `*yourdomain.com/uploads/*`
* **URL Pattern**: `*yourdomain.com/static/*`
* **Settings**:
  - **Cache Level**: `Cache Everything`
  - **Edge Cache TTL**: `1 month` to `1 year` (respect origin `s-maxage`)

### Rule 3: Respect Origin Headers for Public API Endpoints
* **URL Pattern**: `*yourdomain.com/api/public/*`
* **URL Pattern**: `*yourdomain.com/sitemap.xml`
* **URL Pattern**: `*yourdomain.com/robots.txt`
* **Settings**:
  - **Cache Level**: `Standard` / `Respect Existing Headers` (Origin Cache-Control)

---

## 3. Nginx Reverse Proxy Configuration Example

```nginx
# 1. Bypass cache for private authenticated endpoints
location ~* ^/(api/admin|api/recruiter|api/auth) {
    proxy_pass http://backend_upstream;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate" always;
}

# 2. Immutable Cache for Uploads & Media
location /uploads/ {
    alias /var/www/job_portal/uploads/;
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
}

# 3. Static Web Assets (JS/CSS bundles)
location /static/ {
    alias /var/www/job_portal/frontend/build/static/;
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
}

# 4. Public API endpoints - respect backend Cache-Control
location /api/ {
    proxy_pass http://backend_upstream;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_ignore_headers Set-Cookie; # Ensures public cached responses aren't blocked by cookies
}

# 5. SPA index.html - Revalidate immediately
location / {
    root /var/www/job_portal/frontend/build;
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "public, max-age=0, must-revalidate";
}
```

---

## 4. Frontend Client-Side Optimization (React SPA)
1. **No Authorization tokens sent to public static endpoints** in `src/utils/apiHeaders.js` so that CDN / browser caches are shared and not fragmented by user JWT.
2. **`_headers` and `vercel.json`** configured to serve static assets with `max-age=31536000, immutable` and `index.html` with `max-age=0, must-revalidate`.
