/** Helpers for GET /credit-status purchasedPack / welcomePack display */

export const isCreditValueUnlimited = (value) => Number(value) === -1;

/** Unlimited job/CV credits — isUnlimited flag or -1 credit values */
export const hasUnlimitedCredits = (pack) =>
  pack?.isUnlimited === true ||
  isCreditValueUnlimited(pack?.jobCreditsTotal) ||
  isCreditValueUnlimited(pack?.jobCreditsRemaining) ||
  isCreditValueUnlimited(pack?.profileCreditsTotal) ||
  isCreditValueUnlimited(pack?.profileCreditsRemaining);

/** Unlimited validity / no expiry */
export const hasNoPackExpiry = (pack) => pack?.cancelExpiry === true;

export const getPackExpiryDate = (pack, fallback = null) =>
  pack?.endDate ||
  pack?.expiresAt ||
  fallback?.endDate ||
  fallback?.expiresAt ||
  null;

export const getPackDaysLeft = (pack) => {
  if (hasNoPackExpiry(pack)) return null;

  if (pack?.daysLeft != null && pack.daysLeft !== "") {
    const parsed = Number(pack.daysLeft);
    if (Number.isFinite(parsed)) return parsed;
  }

  const expiry = getPackExpiryDate(pack);
  if (!expiry) return null;

  const end = new Date(expiry).getTime();
  if (!Number.isFinite(end)) return null;

  const msLeft = end - Date.now();
  if (msLeft <= 0) return 0;
  return Math.ceil(msLeft / (1000 * 60 * 60 * 24));
};

export const formatCreditAmount = (value, { compact = false } = {}) => {
  if (isCreditValueUnlimited(value)) {
    return compact ? "∞" : "Unlimited";
  }
  return value ?? 0;
};
