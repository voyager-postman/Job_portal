# Job Portal Workscope vs Current Frontend — Gap Analysis

**Reference:** Workscope For Job Portal Platform like lesjeudis  
**Project:** React Job Portal Frontend  
**Date:** 31 July 2026  

## Legend

| Mark | Meaning |
|------|---------|
| ✅ Hua | UI/page present in this frontend |
| ⚠️ Partial | Partially done / incomplete vs workscope |
| ❌ Nahi | Not found in this frontend |
| **FE** | Frontend |
| **BE** | Backend |
| **Both** | Both sides needed |

> Status is based on UI presence in this React codebase. Backend may live in a separate repo; some features may work on BE even if FE UI is missing (or vice versa).

---

## 1. Job Seeker (Candidate)

| Feature | Status | Side | Notes |
|--------|--------|------|-------|
| Register / Login (email-password) | ✅ | Both | Login, Register pages |
| Social login (Google / GitHub / LinkedIn) | ✅ | Both | Header + EmployerLogin |
| Two-factor authentication (2FA) | ❌ | Both | Phase 2 in workscope |
| GDPR consent / privacy settings UI | ⚠️ | Both | Privacy page exists; full consent/settings weak |
| Profile: personal, experience, education, skills | ✅ | Both | CandidateProfile |
| Multiple CV / cover letter upload | ✅ | Both | Profile + apply flow |
| Portfolio / LinkedIn / GitHub links | ✅ | Both | Profile links |
| Profile public / private visibility | ✅ | Both | updateProfileVisibility |
| Resume parse → auto-fill profile | ✅ | Both | parsedResume in profile |
| LinkedIn profile auto-import | ⚠️ | Both | Login exists; full import unclear |
| Job search + multi filters | ✅ | Both | JobSearch, JobList |
| Map view of jobs | ❌ | FE (+ maps API) | Optional in workscope |
| Job alerts (keyword / location / type) | ✅ | Both | JobAlert |
| Alert frequency daily / weekly | ✅ | Both | Frequency options |
| Alert real-time frequency | ⚠️ | BE mainly | Daily/Weekly visible |
| Alert channel email / in-app | ✅ | Both | JobAlert options |
| Resume builder + templates | ✅ | Both | ResumeBuilder + templates |
| One-click apply + custom CV/cover | ✅ | Both | Apply modal |
| Application status tracking | ✅ | Both | ManagesJobApplication |
| Withdraw application | ✅ | Both | withdrawJobApplication |
| Show expired applied jobs | ✅ | Both | Expired / Withdrawn statuses |
| Dashboard (applied, saved, messages, interviews) | ✅ | Both | CandidateDashboard |
| Activity timeline | ✅ | Both | ActivityTimeline |
| Save / bookmark jobs | ✅ | Both | savedJob |
| Saved jobs folders / categories | ❌ | Both | Saved list exists; folders mainly for employer candidate bookmarks |
| In-app messaging | ✅ | Both | ChatMassageSystem |
| Email notification on new message | ⚠️ | BE | UI badge/toast; email queue is BE |
| Skill assessments + certificates | ✅ | Both | Assessment pages |
| Upcoming interviews + Google Calendar sync | ❌ | Both | Interview count may show; Calendar = Phase 2 |
| Cookie consent banner | ❌ | FE (+ BE config) | Mentioned in workscope |
| Delete my data / right to be forgotten UI | ❌ | Both | Included in workscope; UI not found |

---

## 2. Employer / Recruiter

| Feature | Status | Side | Notes |
|--------|--------|------|-------|
| Employer register / login + LinkedIn | ✅ | Both | |
| Company profile (logo, about, links) | ✅ | Both | EmployerProfile |
| Office photos / videos | ✅ | Both | Videos / YouTube upload |
| Career page + company slug SEO page | ✅ | Both | `/:companySlug` |
| Job create (title, desc, location, salary, type, tags) | ✅ | Both | JobDetailsForm |
| AI job description generation | ✅ | Both | generateJobDescription |
| Job templates for quicker posting | ⚠️ | Both | Limited / partial |
| Post scheduling | ✅ | Both | scheduleDate / scheduled tab |
| Featured job | ✅ | Both | Featured toggle + credits |
| Highlighted job + Homepage visibility | ⚠️ | Both | Toggles commented in form; listing highlight exists |
| Job post manage (active / draft / expired / scheduled) | ✅ | Both | YourJobPosts |
| Duplicate job | ❌ | Both | Workscope says Yes; UI action not found |
| Job version history / changelog | ❌ | BE mainly | Phase 2 |
| CV database search + filters | ✅ | Both | CandinatesList |
| Bookmark / shortlist + folders | ✅ | Both | Folders + shortlist |
| Download CV (credits) | ✅ | Both | Wallet / credits |
| Applicants list + status pipeline | ✅ | Both | ManagesApplicants |
| Bulk actions (email / status / tagging) | ⚠️ | Both | Status update exists; full bulk email/tag weak |
| Notes / comments on candidates | ❌ | Both | Clear notes UI not found |
| Messaging with candidates | ✅ | Both | MassagingSystem |
| Message templates (interview invite etc.) | ❌ | Both | Not found |
| Interview scheduling requests UI | ❌ | Both | Missing / Phase 2 |
| Auto responses (thank you / reject) | ❌ | BE (+ FE config) | Event-based; no clear UI |
| Recruiter dashboard analytics | ✅ | Both | Views, applicants, response rates |
| KPI filter by period / export PDF-Excel | ⚠️ | Both | Charts exist; export incomplete |
| Multiple recruiters under one company | ✅ | Both | CreateRecruiters, RecruiterLists |
| Bulk ZIP resume download | ❌ | Both | Single download; ZIP not found |
| Interaction log per job (views / clicks) | ⚠️ | Both | Views shown; full event log UI limited |

---

## 3. Admin Panel

> Note: This React app has only limited admin SEO pages (Google Marketing, Home Page SEO, Jobs Listing SEO). Full admin is likely a separate app/backend.

| Feature | Status in this FE | Side |
|--------|-------------------|------|
| Full admin dashboard (users, jobs, payments, reports) | ❌ / separate app | Admin FE + BE |
| Content moderation queue | ❌ here | Admin FE + BE |
| Support tickets / complaints | ❌ here | Admin FE + BE |
| Terms / Privacy CMS update | ❌ here | Admin FE + BE |
| Audit logs UI | ❌ here | Admin FE + BE |
| SEO settings | ⚠️ Partial | FE admin pages + BE |
| Moderator role UI | ❌ here | Admin FE + BE |

---

## 4. SEO / Performance / Infra (Frontend relevant)

| Feature | Status | Side | Notes |
|--------|--------|------|-------|
| Job slug pages `/job/:jobSlug` | ✅ | Both | |
| Company slug pages | ✅ | Both | |
| JobPosting structured data (JSON-LD) | ✅ | FE (+ BE data) | |
| Sitemap generation | ✅ | FE script / BE cron | |
| SSR / SSG | ❌ | Architecture | Current app is CRA CSR (`react-scripts`) |
| Core Web Vitals targets | ✅ | FE mainly | FCP &lt; 1.8s, LCP &lt; 2.5s, CLS &lt; 0.1, TBT &lt; 300ms — implemented + console/`window.__CW_WEB_VITALS__` verified |
| WebP / AVIF / CDN images | ⚠️ | CDN / BE + FE | Infra |
| reCAPTCHA | ✅ | Both | Login / forms |
| Lazy loading pages | ✅ | FE | lazyPages.js |

---

## 5. Missing / Incomplete Frontend Items (Priority)

### High priority (product gaps)

1. Job Map View  
2. Saved jobs folders (candidate side)  
3. Messaging templates + interview scheduling UI  
4. Candidate notes / comments (recruiter)  
5. Bulk ZIP resume download  
6. Duplicate job action  
7. Cookie consent / GDPR settings screen  
8. Delete-my-account / data deletion request UI  
9. Highlighted job + homepage visibility toggles (currently commented)  
10. Full Admin UI (not in this repo)

### Phase 2 (as per workscope)

- 2FA  
- Google Calendar sync  
- Job version history  
- Deep malware scan  
- Advanced alert frequency options  
- Advanced monitoring / security log admin UI  

### Mostly Backend (Frontend only displays)

- Cron / queues / webhooks / Redis / S3 signed URLs / email workers  
- Auto-reject after X days  
- AI matching / scoring engine  
- Audit / security log storage  
- Nightly sitemap cron, 301 redirects on title change  

---

## 6. Summary Verdict

**Already done (most of core product):**  
Auth, profile, search, alerts, apply/withdraw, resume builder, assessments, chat, employer jobs, applicants pipeline, wallet/payments, company/job SEO pages.

**Still missing / weak on frontend:**  
Map view, saved-job folders, message templates, interview scheduling, candidate notes, bulk ZIP download, duplicate job, cookie/GDPR delete-data UI, highlighted/homepage toggles, and full admin panel.
