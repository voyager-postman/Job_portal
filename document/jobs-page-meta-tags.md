# 3) How can we change the meta tags on this page? (DONE)

**Page:** https://itdevelopmentservices.com/jobPortal/jobs  
**Route:** `/jobs`  
**Component:** `src/Pages/JobList.jsx`

---

## How to Update Meta Tags (Title & Description) for the Jobs Page

The Meta Title and Meta Description for the Jobs page can be updated from the following configuration files.

### 1. English Meta Tags

**File:** `src/translation/en/global.json`

Locate the `seo.pages.jobs` object and update the `title` and `description` values:

```json
"seo": {
  "pages": {
    "jobs": {
      "title": "Your New English Page Title",
      "description": "Your new English meta description."
    }
  }
}
```

### 2. French Meta Tags

**File:** `src/translation/fr/global.json`

Locate the `seo.pages.jobs` object and update the `title` and `description` values:

```json
"seo": {
  "pages": {
    "jobs": {
      "title": "Your New French Page Title",
      "description": "Your new French meta description."
    }
  }
}
```

### 3. Default / Fallback SEO Configuration

**File:** `src/config/publicPageSeo.js`

Locate the `/jobs` configuration inside the `PUBLIC_PAGE_SEO` object and update the values as required:

```js
"/jobs": {
  title: "Your Default Page Title",
  description: "Your default meta description.",
  image: bannerImage,
  ogType: "website"
}
```

This fallback is used when a translation key is missing. The Jobs page reads it like this:

```js
t("seo.pages.jobs.title", { defaultValue: jobsSeo.title })
t("seo.pages.jobs.description", { defaultValue: jobsSeo.description })
```

---

## How It Works

1. `JobList.jsx` loads English/French text from `seo.pages.jobs`.
2. If a translation is missing, it falls back to `PUBLIC_PAGE_SEO["/jobs"]` in `publicPageSeo.js`.
3. `PageSEO` writes the values into the HTML `<head>` (`<title>`, meta description, Open Graph, Twitter tags).
4. The browser title is automatically formatted as:  
   `Your Title | Connect Work.ma`

---

## Notes

- English and French translation files are used to generate localized SEO meta tags.
- The correct translation key path is **`seo.pages.jobs`** (not `seo.jobs`).
- `publicPageSeo.js` provides the default (fallback) SEO configuration.
- Updating `seo.pages.jobs.title` also updates the page **H1** heading on `/jobs` (same translation key).
- After updating these files, rebuild/redeploy the app so the new Meta Title and Meta Description appear on the live page.
- No additional code changes are required for normal title/description updates.
