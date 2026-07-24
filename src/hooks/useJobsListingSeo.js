import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PUBLIC_PAGE_SEO } from "../config/publicPageSeo";
import {
  fetchPublicJobsListingSeo,
  normalizeJsonLdList,
  normalizeKeywords,
} from "../utils/jobsListingSeoApi";
import {
  buildBreadcrumbSchema,
  buildJobCanonicalUrl,
  buildJobPostingSchema,
} from "../utils/seo";

const buildFallbackJsonLd = (fallback, breadcrumbSchema, jobList = []) => [
  ...(fallback.jsonLd || []),
  breadcrumbSchema,
  ...(jobList || [])
    .map((job) => buildJobPostingSchema(job, buildJobCanonicalUrl(job)))
    .filter(Boolean),
];

export const buildJobsListingSeoViewModel = ({
  seoData,
  fallback,
  t,
  pageNumber,
  jobsCanonical,
  paginationPrev,
  paginationNext,
  jobList = [],
}) => {
  const metaTags = seoData?.metaTags;
  const hasDynamicMeta = Boolean(metaTags?.title || metaTags?.description);
  const fallbackTitle = t("seo.pages.jobs.title", { defaultValue: fallback.title });
  const fallbackDescription = t("seo.pages.jobs.description", {
    defaultValue: fallback.description,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: t("header.home"), path: "/" },
    { name: t("header.jobs"), path: "/jobs" },
  ]);
  const apiJsonLd = normalizeJsonLdList(seoData?.jsonLd);
  const jsonLd =
    apiJsonLd.length > 0
      ? [...apiJsonLd, breadcrumbSchema]
      : buildFallbackJsonLd(fallback, breadcrumbSchema, jobList);

  const sharedPagination = {
    paginationPrev,
    paginationNext,
  };

  if (!hasDynamicMeta) {
    return {
      pageTitle: fallbackTitle,
      pageDescription: fallbackDescription,
      hasDynamicMeta: false,
      pageSeoProps: {
        title: fallbackTitle,
        description: fallbackDescription,
        canonical: jobsCanonical,
        image: fallback.image,
        ogType: fallback.ogType,
        robots: fallback.robots || "index, follow",
        jsonLd,
        ...sharedPagination,
      },
    };
  }

  const pageTitle = metaTags.title || fallbackTitle;
  const pageDescription = metaTags.description || fallbackDescription;
  const pageCanonical =
    pageNumber > 1 ? jobsCanonical : metaTags.canonicalUrl || jobsCanonical;

  return {
    pageTitle,
    pageDescription,
    hasDynamicMeta: true,
    pageSeoProps: {
      title: pageTitle,
      description: pageDescription,
      canonical: pageCanonical,
      image: metaTags.ogImage || fallback.image,
      ogTitle: metaTags.ogTitle,
      ogDescription: metaTags.ogDescription,
      ogType: fallback.ogType,
      robots: metaTags.robots || "index, follow",
      keywords: normalizeKeywords(metaTags.keywords),
      jsonLd,
      ...sharedPagination,
    },
  };
};

export function useJobsListingSeo({
  pageNumber,
  jobsCanonical,
  paginationPrev,
  paginationNext,
  jobList,
}) {
  const { t } = useTranslation("global");
  const [seoData, setSeoData] = useState(null);
  const fallback = PUBLIC_PAGE_SEO["/jobs"];

  useEffect(() => {
    let active = true;

    fetchPublicJobsListingSeo()
      .then((res) => {
        if (!active) return;
        setSeoData(res.data?.data || null);
      })
      .catch(() => {
        if (!active) return;
        setSeoData(null);
      });

    return () => {
      active = false;
    };
  }, []);

  return useMemo(
    () =>
      buildJobsListingSeoViewModel({
        seoData,
        fallback,
        t,
        pageNumber,
        jobsCanonical,
        paginationPrev,
        paginationNext,
        jobList,
      }),
    [
      seoData,
      fallback,
      t,
      pageNumber,
      jobsCanonical,
      paginationPrev,
      paginationNext,
      jobList,
    ],
  );
}
