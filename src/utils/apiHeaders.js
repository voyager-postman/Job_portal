// Auth mode:
// - Production → HTTP-only cookie (primary)
// - Local npm start → Bearer token from login response (cookies do not work cross-origin from localhost)

export const USE_COOKIE_AUTH =
  process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_USE_COOKIE_AUTH !== "false";

export const extractLoginToken = (data = {}) =>
  data.token ||
  data.accessToken ||
  data.access_token ||
  data.authToken ||
  data.jwt ||
  data.data?.token ||
  null;

export const isValidAuthToken = (token) =>
  Boolean(token) &&
  String(token).trim() !== "" &&
  String(token) !== "undefined" &&
  String(token) !== "null";

export const resolveAuthToken = (...candidates) => {
  for (const candidate of candidates) {
    if (isValidAuthToken(candidate)) {
      return String(candidate).trim();
    }
  }
  return null;
};

export const AUTH_STORAGE_KEYS = [
  "token",
  "user",
  "isLoggedIn",
  "first_name",
  "last_name",
  "department",
  "user_id",
  "user_email",
  "user_role",
  "profileImage",
  "adminToken",
  "admin_token",
  "companyId",
  "verifiedByAdmin",
  "is_completed",
  "extract_id",
];

export const hasAuthSession = () =>
  localStorage.getItem("isLoggedIn") === "true";

export const isAuthReady = () =>
  hasAuthSession() || Boolean(localStorage.getItem("token"));

export const persistAuthToken = (token) => {
  const resolvedToken = resolveAuthToken(token);

  if (resolvedToken) {
    localStorage.setItem("token", resolvedToken);
    return;
  }

  if (USE_COOKIE_AUTH) {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin_token");
  }
};

export const persistLoginSession = ({ token, user, extras = {}, data = null }) => {
  if (!user) {
    return false;
  }

  const resolvedToken = token || extractLoginToken(data || {});
  persistAuthToken(resolvedToken);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("user_id", user.id || user._id || "");
  localStorage.setItem("user_email", user.email || "");
  localStorage.setItem("user_role", user.role || "");
  localStorage.setItem("first_name", user.first_name || "");
  localStorage.setItem("last_name", user.last_name || "");
  localStorage.setItem("department", user.department || "");
  localStorage.setItem(
    "is_completed",
    user.is_completed != null ? String(user.is_completed) : "",
  );
  localStorage.setItem("isLoggedIn", "true");

  Object.entries(extras).forEach(([key, value]) => {
    if (value != null && value !== "") {
      localStorage.setItem(key, String(value));
    }
  });

  return true;
};

export const resolveEmployerLoginUser = (data = {}) => {
  const { user: loginUser, company } = data;

  if (loginUser) {
    return loginUser;
  }

  if (!company) {
    return null;
  }

  return {
    id: company.recruiterId || company._id,
    email: company.email,
    role: "Company",
    companyId: company.companyId || company._id,
    is_completed: true,
    verifiedByAdmin: company.verifiedByAdmin,
    company,
  };
};

export const isLoginResponseValid = (data = {}) =>
  Boolean(data.user || data.company);

export const getPostLoginPath = (user = {}) => {
  const role = user.role;
  const completed = user.is_completed;

  if (completed) {
    if (role === "Recruiter" || role === "Company") {
      return "/employer-dashboard";
    }
    return "/candidate-profile";
  }

  if (role === "Recruiter" || role === "Company") {
    return "/employer-basic-info";
  }

  return "/profile-basic-info";
};

export const clearAuthStorage = () => {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const clearStaleJwtForCookieAuth = () => {
  if (!USE_COOKIE_AUTH) {
    return;
  }

  ["token", "adminToken", "admin_token"].forEach((key) => {
    const value = localStorage.getItem(key);
    if (!isValidAuthToken(value)) {
      localStorage.removeItem(key);
    }
  });
};

export const isInvalidBearerHeader = (value) =>
  !value || /^Bearer\s+(null|undefined)?$/i.test(String(value));

export const sanitizeAuthHeaders = (headers = {}) => {
  const next = { ...headers };
  const auth = next.Authorization ?? next.authorization;

  if (isInvalidBearerHeader(auth)) {
    delete next.Authorization;
    delete next.authorization;
  }

  return next;
};

export const attachAuthHeader = (headers = {}) => {
  const next = sanitizeAuthHeaders(headers);
  const token = localStorage.getItem("adminToken") ||
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token");

  if (token && !next.Authorization && !next.authorization) {
    next.Authorization = `Bearer ${token}`;
  }

  return next;
};

export const getFetchAuthOptions = (extraHeaders = {}) => ({
  credentials: "include",
  headers: attachAuthHeader(extraHeaders),
});

export const getRequestConfig = (config = {}) => ({
  ...config,
  withCredentials: true,
  headers: attachAuthHeader(config.headers || {}),
});

export const getPaymentRequestConfig = (config = {}) =>
  getRequestConfig({ ...config, skipGlobalLoader: true });

const ADMIN_ROUTE_PATTERNS = [
  /\/addIndustry\b/i,
  /\/industry\//i,
  /\/job-category/i,
  /\/addJobCategory\b/i,
  /\/addJobType\b/i,
  /\/job-type/i,
  /\/addSeniorityLevel\b/i,
  /\/seniority-level/i,
  /\/addSalaryRange\b/i,
  /\/salaryRange/i,
  /\/SalaryRange/i,
  /\/skill-category/i,
  /\/add-question\b/i,
  /\/update-question\//i,
  /\/question-status\//i,
  /\/delete-question\//i,
  /\/upsertCurrency\b/i,
  /\/addRemote\b/i,
  /\/updateRemote\//i,
  /\/toggleRemote\//i,
  /\/deleteRemote\//i,
  /\/addSearchQuotes\b/i,
  /\/updateSearchQuotes\//i,
  /\/deleteSearchQuotes\//i,
  /\/firstSectionHome\b/i,
  /\/secondSectionHome\b/i,
  /\/thirdSectionHome\b/i,
  /\/fourthSectionHome\b/i,
  /\/fifthSectionHome\b/i,
  /\/updateSixthSection\b/i,
  /\/updateSeventhSection\b/i,
  /\/updateEighthSection\b/i,
  /\/updateNinthSection\b/i,
  /\/updateAboutUsFirstSection\b/i,
  /\/updateAboutUsSecondSection\b/i,
  /\/updateContactUs\b/i,
  /\/getContactMessages\b/i,
  /\/updateFooterSection\b/i,
  /\/upsertTerms\b/i,
  /\/upsertPrivacyPolicy\b/i,
  /\/recruiterHome\/sliders\b/i,
  /\/delete\/sliders\//i,
  /\/recruiterHome\/second\b/i,
  /\/recruiterHome\/third\b/i,
  /\/recruiterHome\/fourth\b/i,
  /\/recruiterHome\/fifth\b/i,
  /\/team\/member\//i,
  /\/createBlog\b/i,
  /\/updateBlog\//i,
  /\/toggleBlog\//i,
  /\/googleMarketingConfig\b/i,
  /\/getHomePageSeoConfig\b/i,
  /\/updateHomePageSeoConfig\b/i,
  /\/getJobsListingSeoConfig\b/i,
  /\/updateJobsListingSeoConfig\b/i,
  /\/googleTagManagerConfig\b/i,
  /\/saveGoogleTagManagerConfig\b/i,
  /\/googleAnalyticsConfig\b/i,
  /\/saveGoogleAnalyticsConfig\b/i,
  /\/googleSearchConsoleConfig\b/i,
  /\/saveGoogleSearchConsoleConfig\b/i,
];

const ADMIN_POST_ROUTE_PATTERNS = [/\/faq\b/i];

const PUBLIC_ROUTE_PATTERNS = [
  /\/user\/(login|register)\b/i,
  /\/register\/company\b/i,
  /\/forgotPassword\b/i,
  /\/resetPassword\b/i,
  /\/login-admin\b/i,
  /\/register-admin\b/i,
  /\/google\/login\b/i,
  /\/auth\//i,
  /\/sendContactMessage\b/i,
  /\/public\/googleMarketingConfig\b/i,
  /\/public\/homePageSeo\b/i,
  /\/public\/jobsListingSeo\b/i,
];

const PROTECTED_ROUTE_PATTERNS = [
  ...ADMIN_ROUTE_PATTERNS,
  ...ADMIN_POST_ROUTE_PATTERNS.map((pattern) => ({
    pattern,
    methods: ["post"],
  })),
  /\/get\/notifications\b/i,
  /\/markAllRead\b/i,
  /\/markRead\//i,
  /\/delete\/Notification\//i,
  /\/delete\/AllNotifications\b/i,
  /\/generate-job-description\b/i,
  /\/upload\/Image\b/i,
  /\/getCompanyPurchaseHistory\//i,
  /\/extractResume\//i,
  /\/addMessage\b/i,
  /\/messages\//i,
  /\/chat\//i,
  /\/candidate\/profile\b/i,
  /\/company\/profile\b/i,
  /\/GetCompanyById\//i,
  /\/GetCompanyDetails\//i,
  /\/credit-status\b/i,
  /\/applyJob\b/i,
  /\/updateResumeUrl\b/i,
  /\/updateCoverLetter\b/i,
  /\/savedJob\b/i,
  /\/savedJobList\b/i,
  /\/saveJobAlert\b/i,
  /\/updateJobAlert\b/i,
  /\/deleteJobAlert\b/i,
  /\/getSavedJobAlert\b/i,
  /\/getJobSeekerApplications\b/i,
  /\/withdrawJobApplication\b/i,
  /\/profile\/strength\b/i,
  /\/createJob\b/i,
  /\/updateJob\b/i,
  /\/deleteJob\//i,
  /\/getRecruiterJobList\b/i,
  /\/get\/jobDashboardStats\b/i,
  /\/recruiter\/dashboardStats\b/i,
  /\/getCandidateEngagementInsights\b/i,
  /\/getCompanyJobOverview\b/i,
  /\/getAllApplicantsPerCompany\b/i,
  /\/applicant\/details\//i,
  /\/viewCandidate\//i,
  /\/getCandidateDetails\//i,
  /\/bookmarkCandidate\b/i,
  /\/bookmark\/candidate\b/i,
  /\/getBookmarked\/candidates\b/i,
  /\/getFolderCandidates\b/i,
  /\/getFolders\b/i,
  /\/createBookmarkFolder\b/i,
  /\/removeBookmark\//i,
  /\/getSkillAssessment/i,
  /\/createSkillAssessment\b/i,
  /\/updateSkillAssessment\//i,
  /\/deleteSkillAssessment\//i,
  /\/startAssessment\//i,
  /\/getInterestedCompanies\b/i,
  /\/delete-unavailable-saved-job\//i,
  /\/updateCompany/i,
  /\/deleteCompany/i,
  /\/change-password\b/i,
  /\/request-pack\b/i,
  /\/recharge-track\b/i,
  /\/employer-wallet\b/i,
  /\/createManualRechargeRequest\b/i,
  /\/requestAddOnRecharge\b/i,
  /\/get\/ActiveAddOns\b/i,
  /\/company\/purchase-pack\b/i,
  /\/purchase-CompanyAddOn\b/i,
  /\/active\/packs\b/i,
  /\/packs\/validate\b/i,
  /\/getInvoiceById\//i,
  /\/jobseeker\/activity\b/i,
  /\/resume\/result\//i,
  /\/updateLanguages\b/i,
  /\/updateLinks\b/i,
  /\/getLanguage\b/i,
  /\/getDashboardAnalytics\b/i,
  /\/getJobseekerUnreadChatList\b/i,
  /\/updateProfileVisibility\b/i,
  /\/getQuestionsByCategories\b/i,
  /\/assignAssessmentToJob\b/i,
  /\/files\//i,
];

export const getUserToken = () => localStorage.getItem("token");

export const getAdminToken = () =>
  localStorage.getItem("adminToken") || localStorage.getItem("admin_token");

export const isAdminRoute = (url = "", method = "get") => {
  const normalizedMethod = String(method).toLowerCase();

  if (
    normalizedMethod === "post" &&
    ADMIN_POST_ROUTE_PATTERNS.some((pattern) => pattern.test(url))
  ) {
    return true;
  }

  return ADMIN_ROUTE_PATTERNS.some((pattern) => pattern.test(url));
};

export const isPublicRoute = (url = "") =>
  PUBLIC_ROUTE_PATTERNS.some((pattern) => pattern.test(url));

export const isProtectedRoute = (url = "", method = "get") => {
  if (isPublicRoute(url)) {
    return false;
  }

  const normalizedMethod = String(method).toLowerCase();

  return PROTECTED_ROUTE_PATTERNS.some((entry) => {
    if (entry instanceof RegExp) {
      return entry.test(url);
    }

    return (
      entry.pattern.test(url) &&
      (!entry.methods || entry.methods.includes(normalizedMethod))
    );
  });
};

export const getTokenForRequest = (url = "", method = "get") => {
  if (!isProtectedRoute(url, method)) {
    return null;
  }

  if (isAdminRoute(url, method)) {
    return getAdminToken() || getUserToken();
  }

  return getUserToken();
};

export const shouldSendCredentials = (url = "", method = "get") => {
  if (isPublicRoute(url)) {
    return false;
  }

  if (isProtectedRoute(url, method)) {
    return USE_COOKIE_AUTH ? hasAuthSession() : Boolean(getTokenForRequest(url, method));
  }

  return USE_COOKIE_AUTH && hasAuthSession();
};

export const getAuthHeaders = (extraHeaders = {}, token) => {
  const resolvedToken =
    token ??
    (localStorage.getItem("adminToken") ||
      localStorage.getItem("admin_token") ||
      localStorage.getItem("token"));

  if (!isValidAuthToken(resolvedToken)) {
    return { ...extraHeaders };
  }

  return {
    ...extraHeaders,
    Authorization: `Bearer ${resolvedToken}`,
  };
};

export const getAdminAuthHeaders = (extraHeaders = {}) => {
  const token = getAdminToken() || getUserToken();

  if (!isValidAuthToken(token)) {
    return { ...extraHeaders };
  }

  return {
    ...extraHeaders,
    Authorization: `Bearer ${token}`,
  };
};
