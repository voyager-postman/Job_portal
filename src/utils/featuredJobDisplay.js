export const FEATURED_LOCATIONS = {
  HOMEPAGE: "Homepage",
  SEARCH_RESULTS: "SearchResults",
  HIGHLIGHTED: "Highlighted",
};

const FEATURED_LOCATION_LABELS = {
  Homepage: "Homepage",
  SearchResults: "Search Results",
  Highlighted: "Highlighted",
};

const LOCATION_ALIASES = {
  homepage: FEATURED_LOCATIONS.HOMEPAGE,
  home: FEATURED_LOCATIONS.HOMEPAGE,
  home_page: FEATURED_LOCATIONS.HOMEPAGE,
  homepagevisibility: FEATURED_LOCATIONS.HOMEPAGE,
  searchresults: FEATURED_LOCATIONS.SEARCH_RESULTS,
  search_results: FEATURED_LOCATIONS.SEARCH_RESULTS,
  search: FEATURED_LOCATIONS.SEARCH_RESULTS,
  searchresult: FEATURED_LOCATIONS.SEARCH_RESULTS,
  highlighted: FEATURED_LOCATIONS.HIGHLIGHTED,
  highlightedlistings: FEATURED_LOCATIONS.HIGHLIGHTED,
  highlighted_listing: FEATURED_LOCATIONS.HIGHLIGHTED,
  listings: FEATURED_LOCATIONS.HIGHLIGHTED,
};

const canonicalizeLocation = (value) => {
  if (value == null) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  if (FEATURED_LOCATION_LABELS[raw]) return raw;

  const compact = raw.toLowerCase().replace(/[\s_-]+/g, "");
  return LOCATION_ALIASES[compact] || null;
};

/** Normalise API location values into canonical pack location keys. */
export const normalizeFeaturedLocations = (locations) => {
  const source = Array.isArray(locations)
    ? locations
    : typeof locations === "string"
      ? locations.split(/[,|]/)
      : [];

  const unique = [];

  source.forEach((item) => {
    const canonical = canonicalizeLocation(item);
    if (canonical && !unique.includes(canonical)) {
      unique.push(canonical);
    }
  });

  return unique;
};

export const formatFeaturedLocationLabels = (locations = []) => {
  const normalized = normalizeFeaturedLocations(locations);
  if (normalized.length === 0) return "";

  return normalized
    .map((location) => FEATURED_LOCATION_LABELS[location] || location)
    .join(", ");
};

export const getFeaturedJobsUsedCount = (featuredJobsUsed) => {
  if (Array.isArray(featuredJobsUsed)) return featuredJobsUsed.length;
  return Number(featuredJobsUsed) || 0;
};

export const getActiveFeaturedJobsCount = (features = {}) =>
  Number(
    features.activeFeaturedJobs ??
      features.activeFeaturedJobsCount ??
      getFeaturedJobsUsedCount(features.activeFeaturedJobIds),
  ) || 0;

const isExplicitlyTrue = (value) =>
  value === true || value === 1 || value === "1" || value === "true";

/** Only true when pack explicitly enables Company Profile Highlight. */
export const isCompanyProfileHighlightEnabled = (packOrFeatures = {}) => {
  const features = packOrFeatures?.features || {};
  const candidates = [
    packOrFeatures?.companyProfileHighlightEnabled,
    features.companyProfileHighlightEnabled,
    packOrFeatures?.hasProfileHighlight,
    features.hasProfileHighlight,
    packOrFeatures?.companyProfileHighlight,
    features.companyProfileHighlight,
    packOrFeatures?.profileHighlightEnabled,
    features.profileHighlightEnabled,
    packOrFeatures?.enableCompanyProfileHighlight,
    features.enableCompanyProfileHighlight,
  ];

  // Prefer first defined value (null/undefined skip); show only when that value is true
  for (const value of candidates) {
    if (value === undefined || value === null) continue;
    return isExplicitlyTrue(value);
  }

  return false;
};

export const normalizePackFeaturedInfo = (pack) => {
  const features = pack?.features || {};

  const featuredJobLocations = normalizeFeaturedLocations(
    features.featuredJobLocations ?? pack?.featuredJobLocations,
  );

  return {
    ...features,
    featuredJobsAvailable: Boolean(
      features.featuredJobsAvailable ?? pack?.featuredJobsAvailable,
    ),
    maxFeaturedJobs: Number(
      features.maxFeaturedJobs ?? pack?.maxFeaturedJobs ?? 0,
    ),
    maxActiveFeaturedJobs: Number(
      features.maxActiveFeaturedJobs ?? pack?.maxActiveFeaturedJobs ?? 0,
    ),
    featuredJobsUsed:
      features.featuredJobsUsed ?? pack?.featuredJobsUsed ?? 0,
    activeFeaturedJobs: getActiveFeaturedJobsCount({
      ...features,
      ...pack,
    }),
    featuredJobDurationDays: Number(
      features.featuredJobDurationDays ??
        pack?.featuredJobDurationDays ??
        0,
    ),
    featuredJobLocations,
    searchBoostScore: Number(
      features.searchBoostScore ?? pack?.searchBoostScore ?? 1,
    ) || 1,
    companyProfileHighlightEnabled: isCompanyProfileHighlightEnabled(pack),
  };
};

export const hasFeaturedJobsFeature = (info = {}) =>
  Boolean(info.featuredJobsAvailable) &&
  (Number(info.maxFeaturedJobs) > 0 ||
    Number(info.maxActiveFeaturedJobs) > 0);

export const isJobFeaturedOnHomepage = (job) =>
  Boolean(job?.enableHomePageVisibility ?? job?.isFeatured ?? job?.badge);

export const isJobHighlightedInListing = (job) =>
  Boolean(
    job?.enableHighlightedListing ??
      job?.enableHighlightedJob ??
      job?.isHighlighted ??
      job?.isFeatured,
  );

export const hasFeaturedLocation = (locations, location) =>
  normalizeFeaturedLocations(locations).includes(location);

export const getFeaturedLocationBenefits = (locations, t) => {
  const normalized = normalizeFeaturedLocations(locations);
  const benefits = [];

  if (normalized.includes(FEATURED_LOCATIONS.HOMEPAGE)) {
    benefits.push(t("jobs.featured_homepage"));
  }
  if (normalized.includes(FEATURED_LOCATIONS.SEARCH_RESULTS)) {
    benefits.push(t("jobs.featured_search"));
  }
  if (normalized.includes(FEATURED_LOCATIONS.HIGHLIGHTED)) {
    benefits.push(t("jobs.featured_listings"));
  }

  return benefits;
};

export const SEARCH_BOOST_OPTIONS = [
  { value: 1, label: "x1 — Standard priority" },
  { value: 2, label: "x2 — Higher priority" },
  { value: 3, label: "x3 — Highest priority" },
];

export const formatSearchBoostScore = (score) => {
  const value = Number(score) || 1;
  return `x${value}`;
};

/** Admin-style label: "x3 — Highest priority" */
export const formatSearchBoostLabel = (score) => {
  const value = Number(score) || 1;
  const option = SEARCH_BOOST_OPTIONS.find((item) => item.value === value);
  return option?.label || `x${value}`;
};

/**
 * Pack-driven featured benefit lines for UI (form + payment details).
 * Only includes locations / boost / company profile / duration that the pack grants.
 */
export const getFeaturedPackBenefitItems = (creditInfo = {}, t) => {
  const locations = normalizeFeaturedLocations(
    creditInfo.featuredJobLocations,
  );
  const locationBenefits = getFeaturedLocationBenefits(locations, t);
  const items = [...locationBenefits];
  const searchBoostScore = Number(creditInfo.searchBoostScore) || 1;
  const durationDays = Number(creditInfo.featuredJobDurationDays) || 0;
  const showSearchBoost =
    searchBoostScore > 1 &&
    locations.includes(FEATURED_LOCATIONS.SEARCH_RESULTS);
  const showCompanyProfileHighlight =
    isCompanyProfileHighlightEnabled(creditInfo);
  const locationLabels = formatFeaturedLocationLabels(locations);

  if (showSearchBoost) {
    items.push(
      t("jobs.featured_search_boost", {
        boost: formatSearchBoostLabel(searchBoostScore),
      }),
    );
  }

  if (showCompanyProfileHighlight) {
    items.push(t("jobs.featured_company_profile"));
  }

  if (durationDays > 0) {
    items.push(
      t("jobs.featured_duration_note", {
        days: durationDays,
      }),
    );
  }

  return {
    locations,
    locationLabels,
    items,
    locationBenefits,
    showSearchBoost,
    searchBoostScore,
    showCompanyProfileHighlight,
    durationDays,
  };
};

export const canEnableFeaturedJob = (creditInfo, isCurrentlyFeatured) => {
  if (!creditInfo?.featuredJobsAvailable) {
    return { allowed: false, reason: "no_featured_pack" };
  }

  if (isCurrentlyFeatured) {
    return { allowed: true };
  }

  const used = getFeaturedJobsUsedCount(creditInfo.featuredJobsUsed);
  const remainingLifetime = creditInfo.maxFeaturedJobs - used;

  if (creditInfo.maxFeaturedJobs > 0 && remainingLifetime <= 0) {
    return { allowed: false, reason: "lifetime_limit" };
  }

  const activeCount = getActiveFeaturedJobsCount(creditInfo);

  if (
    creditInfo.maxActiveFeaturedJobs > 0 &&
    activeCount >= creditInfo.maxActiveFeaturedJobs
  ) {
    return { allowed: false, reason: "active_limit" };
  }

  return { allowed: true };
};

export const getFeaturedLimitMessage = (reason, t, creditInfo = {}) => {
  if (reason === "lifetime_limit") {
    return t("jobs.featured_lifetime_limit", {
      max: creditInfo.maxFeaturedJobs,
    });
  }
  if (reason === "active_limit") {
    return t("jobs.featured_active_limit", {
      max: creditInfo.maxActiveFeaturedJobs,
    });
  }
  return t("jobs.featured_not_available");
};
