export const isVerifiedByAdmin = (value) => {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }

  return false;
};

export const toVerifiedByAdminStorage = (value) =>
  isVerifiedByAdmin(value) ? "true" : "false";

export const readVerifiedByAdminFromStorage = () =>
  isVerifiedByAdmin(localStorage.getItem("verifiedByAdmin"));

export const resolveEmployerCompanyId = () => {
  const storedCompanyId = localStorage.getItem("companyId");
  if (storedCompanyId && storedCompanyId !== "null" && storedCompanyId !== "undefined") {
    return storedCompanyId;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.companyId || user?.company?._id || null;
  } catch {
    return null;
  }
};
