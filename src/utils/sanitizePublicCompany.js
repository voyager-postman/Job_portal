const PUBLIC_COMPANY_FIELDS = new Set([
  "_id",
  "slug",
  "brandName",
  "logo",
  "coverPhoto",
  "city",
  "country",
  "aboutCompany",
  "industries",
  "industry",
  "numberOfEmployees",
]);

const PUBLIC_INDUSTRY_FIELDS = new Set(["_id", "name"]);

const PUBLIC_SECTION_KEYS = [
  "justJoinedUs",
  "companiesOfMoment",
  "partnerCompanies",
];

const PRIVATE_COMPANY_FIELDS = new Set([
  "email",
  "password",
  "registrationToken",
  "resetPasswordToken",
  "otp",
  "token",
  "refreshToken",
  "apiKey",
  "secret",
]);

const PUBLIC_COMPANY_DETAIL_FIELDS = new Set([
  ...PUBLIC_COMPANY_FIELDS,
  "phone",
  "links",
  "aboutPremium",
  "photos",
  "videos",
  "careerDetail",
  "jobs",
  "status",
  "isVerified",
]);

/**
 * Whitelist-only sanitizer for company objects on public listing pages.
 * Strips account identifiers (email, phone, tokens, etc.) before data
 * enters React state. The API must also omit PII — the Network tab still
 * shows the raw HTTP response until the backend is fixed.
 */
function pickPublicCompanyFields(company, allowedFields) {
  if (!company || typeof company !== "object") {
    return company;
  }

  const sanitized = {};

  allowedFields.forEach((field) => {
    if (!(field in company)) {
      return;
    }

    if (field === "industry" && company.industry) {
      sanitized.industry = {};
      PUBLIC_INDUSTRY_FIELDS.forEach((industryField) => {
        if (company.industry[industryField] !== undefined) {
          sanitized.industry[industryField] = company.industry[industryField];
        }
      });
      return;
    }

    sanitized[field] = company[field];
  });

  PRIVATE_COMPANY_FIELDS.forEach((field) => {
    delete sanitized[field];
  });

  return sanitized;
}

export function sanitizePublicCompany(company) {
  return pickPublicCompanyFields(company, PUBLIC_COMPANY_FIELDS);
}

export function sanitizePublicCompanyDetail(company) {
  return pickPublicCompanyFields(company, PUBLIC_COMPANY_DETAIL_FIELDS);
}

export function sanitizePublicCompanyListItem(item) {
  if (!item || typeof item !== "object") {
    return item;
  }

  const sanitized = {};

  if (item.companyId) {
    sanitized.companyId = sanitizePublicCompany(item.companyId);
  }

  if (typeof item.jobCount === "number") {
    sanitized.jobCount = item.jobCount;
  } else if (Array.isArray(item.jobList)) {
    sanitized.jobCount = item.jobList.length;
  }

  if (item.isHighlighted) {
    sanitized.isHighlighted = item.isHighlighted;
  }

  return sanitized;
}

function sanitizeCompanySections(sections) {
  if (!sections || typeof sections !== "object") {
    return sections;
  }

  const sanitized = { ...sections };
  PUBLIC_SECTION_KEYS.forEach((sectionKey) => {
    if (Array.isArray(sections[sectionKey])) {
      sanitized[sectionKey] = sections[sectionKey].map(
        sanitizePublicCompanyListItem,
      );
    }
  });
  return sanitized;
}

export function sanitizeHomePagePayload(homeData) {
  if (!homeData || typeof homeData !== "object") {
    return homeData;
  }

  if (!homeData.sections) {
    return homeData;
  }

  return {
    ...homeData,
    sections: sanitizeCompanySections(homeData.sections),
  };
}

export function sanitizeGetHomePageResponse(responseData) {
  if (!responseData || typeof responseData !== "object") {
    return responseData;
  }

  if (!responseData.data) {
    return responseData;
  }

  return {
    ...responseData,
    data: sanitizeHomePagePayload(responseData.data),
  };
}

export function sanitizeCompanyDetailResponse(responseData) {
  if (!responseData || typeof responseData !== "object") {
    return responseData;
  }

  if (!responseData.company) {
    return responseData;
  }

  return {
    ...responseData,
    company: sanitizePublicCompanyDetail(responseData.company),
  };
}

export function sanitizeCompanyListApiResponse(data) {
  if (!data || typeof data !== "object") {
    return data;
  }

  const sanitized = { ...data };

  if (Array.isArray(data.companies)) {
    sanitized.companies = data.companies.map(sanitizePublicCompanyListItem);
  }

  if (data.sections && typeof data.sections === "object") {
    sanitized.sections = sanitizeCompanySections(data.sections);
  }

  return sanitized;
}

export function sanitizePublicApiResponse(url = "", responseData) {
  const normalizedUrl = String(url).toLowerCase();

  if (normalizedUrl.includes("getcompanydetailslist")) {
    return sanitizeCompanyListApiResponse(responseData);
  }

  if (normalizedUrl.includes("getcompanydetailslistslider")) {
    return sanitizeCompanyListApiResponse(responseData);
  }

  if (normalizedUrl.includes("gethomepage")) {
    return sanitizeGetHomePageResponse(responseData);
  }

  if (normalizedUrl.includes("getcompanydetails/")) {
    return sanitizeCompanyDetailResponse(responseData);
  }

  return responseData;
}
