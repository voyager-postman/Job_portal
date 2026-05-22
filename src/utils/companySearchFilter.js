const getCompanyFromItem = (item) => item?.companyId || item;

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .trim();

export const companyMatchesSearch = (item, companyTerm, locationTerm) => {
  const company = getCompanyFromItem(item);
  if (!company) return false;

  const brandName = normalize(company.brandName);
  const slug = normalize(company.slug);
  const industry = normalize(company.industry?.name);
  const city = normalize(company.city);
  const country = normalize(company.country);
  const about = normalize(company.aboutCompany?.replace(/<[^>]*>/g, ""));

  const companyOk =
    !companyTerm ||
    brandName.includes(companyTerm) ||
    slug.includes(companyTerm) ||
    industry.includes(companyTerm) ||
    about.includes(companyTerm);

  const locationOk =
    !locationTerm ||
    city.includes(locationTerm) ||
    country.includes(locationTerm);

  return companyOk && locationOk;
};

export const dedupeCompanyItems = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const id = item?.companyId?._id || item?._id;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

export const filterCompanySearchResults = (
  items = [],
  companySearch = "",
  locationSearch = "",
) => {
  const companyTerm = normalize(companySearch);
  const locationTerm = normalize(locationSearch);

  if (!companyTerm && !locationTerm) {
    return dedupeCompanyItems(items);
  }

  return dedupeCompanyItems(items).filter((item) =>
    companyMatchesSearch(item, companyTerm, locationTerm),
  );
};
