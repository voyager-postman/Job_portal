import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  SITE,
  absoluteUrl,
  buildPageTitle,
  resolveImageUrl,
} from "../utils/seo";

const normalizeJsonLd = (jsonLd) => {
  if (!jsonLd) return [];
  const list = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  return list.filter(Boolean);
};

function PageSEO({
  title,
  description = SITE.defaultDescription,
  canonical,
  image,
  ogType = "website",
  robots = "index, follow",
  keywords,
  jsonLd,
  ogTitle,
  ogDescription,
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  paginationPrev,
  paginationNext,
}) {
  const { i18n } = useTranslation("global");
  const pageTitle = buildPageTitle(title);
  const canonicalUrl = canonical ? absoluteUrl(canonical) : undefined;
  const ogImage = resolveImageUrl(image || SITE.defaultImage);
  const metaOgTitle = ogTitle || pageTitle;
  const metaOgDescription = ogDescription || description;
  const schemas = normalizeJsonLd(jsonLd);
  const currentLang = i18n.language?.split("-")[0] || "en";
  const alternateLang = currentLang === "fr" ? "en" : "fr";
  const canonicalPath = canonical || "/";
  const prevUrl = paginationPrev ? absoluteUrl(paginationPrev) : undefined;
  const nextUrl = paginationNext ? absoluteUrl(paginationNext) : undefined;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <link
        rel="alternate"
        hrefLang={currentLang}
        href={absoluteUrl(canonicalPath)}
      />
      <link
        rel="alternate"
        hrefLang={alternateLang}
        href={absoluteUrl(canonicalPath)}
      />
      <link rel="alternate" hrefLang="x-default" href={absoluteUrl(canonicalPath)} />
      {prevUrl && <link rel="prev" href={prevUrl} />}
      {nextUrl && <link rel="next" href={nextUrl} />}

      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:title" content={metaOgTitle} />
      <meta property="og:description" content={metaOgDescription} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={metaOgTitle} />
      <meta property="og:image:width" content={String(SITE.ogImageWidth)} />
      <meta property="og:image:height" content={String(SITE.ogImageHeight)} />

      <meta name="twitter:card" content={SITE.twitterCard} />
      {SITE.twitterSite ? (
        <meta name="twitter:site" content={SITE.twitterSite} />
      ) : null}
      <meta name="twitter:title" content={metaOgTitle} />
      <meta name="twitter:description" content={metaOgDescription} />
      <meta name="twitter:image" content={ogImage} />

      {articlePublishedTime && (
        <meta
          property="article:published_time"
          content={articlePublishedTime}
        />
      )}
      {articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}

      {schemas.map((schema, index) => (
        <script key={`json-ld-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export default PageSEO;
