import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageSEO from "./PageSEO";
import { PUBLIC_PAGE_SEO } from "../config/publicPageSeo";
import {
  NOINDEX_PATHS,
  SITE,
  isCompanySlugRoute,
  isDynamicSeoRoute,
} from "../utils/seo";

const PAGE_MANAGED_SEO = new Set([
  "/",
  "/contact-us",
  "/companies",
  "/about-us",
  "/company-details",
  "/employer-home",
  "/jobs",
]);

function RouteSEO() {
  const { t } = useTranslation("global");
  const { pathname } = useLocation();

  if (
    isDynamicSeoRoute(pathname) ||
    isCompanySlugRoute(pathname) ||
    PAGE_MANAGED_SEO.has(pathname)
  ) {
    return null;
  }

  if (NOINDEX_PATHS.has(pathname)) {
    return (
      <PageSEO
        title={t("seo.account")}
        description={SITE.defaultDescription}
        canonical={pathname}
        robots="noindex, nofollow"
      />
    );
  }

  const config = PUBLIC_PAGE_SEO[pathname];
  if (!config) {
    return null;
  }

  const seoKey = pathname.replace(/^\//, "").replace(/\//g, "_") || "home";
  const title = t(`seo.pages.${seoKey}.title`, { defaultValue: config.title });
  const description = t(`seo.pages.${seoKey}.description`, {
    defaultValue: config.description,
  });

  return (
    <PageSEO
      title={title}
      description={description}
      canonical={config.canonical || pathname}
      image={config.image}
      ogType={config.ogType}
      robots={config.robots || "index, follow"}
      jsonLd={config.jsonLd}
    />
  );
}

export default RouteSEO;
