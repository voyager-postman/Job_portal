import { useEffect, useMemo, useState } from "react";

import { useLocation } from "react-router-dom";

import { useTranslation } from "react-i18next";

import axios from "axios";

import PageSEO from "./PageSEO";

import { PUBLIC_PAGE_SEO } from "../config/publicPageSeo";

import { API_BASE_URL } from "../Url/Url";

import { SITE, buildHomePageJsonLd } from "../utils/seo";

import { fetchPublicHomePageSeo } from "../utils/homePageSeoApi";



function HomePageSEO() {

  const { pathname } = useLocation();

  const { t } = useTranslation("global");

  const [seoData, setSeoData] = useState(null);

  const [homeJobs, setHomeJobs] = useState([]);



  useEffect(() => {

    if (pathname !== "/") return undefined;



    let active = true;



    Promise.all([

      fetchPublicHomePageSeo(),

      axios.get(`${API_BASE_URL}getHomePageJobs`, { params: { page: 1 } }),

    ])

      .then(([seoRes, jobsRes]) => {

        if (!active) return;

        setSeoData(seoRes.data?.data || null);

        setHomeJobs(jobsRes.data?.jobs || []);

      })

      .catch(() => {

        if (!active) return;

        setSeoData(null);

        setHomeJobs([]);

      });



    return () => {

      active = false;

    };

  }, [pathname]);



  const fallback = PUBLIC_PAGE_SEO["/"];

  const metaTags = seoData?.metaTags;

  const includeJobPosting =

    seoData?.jsonLd?.enableJobPostingSchema ??

    seoData?.enableJobPostingSchema ??

    true;



  const jsonLd = useMemo(

    () =>

      buildHomePageJsonLd({

        apiJsonLd: seoData?.jsonLd,

        jobs: homeJobs,

        fallback: fallback.jsonLd,

        includeJobPosting,

      }),

    [seoData, homeJobs, fallback.jsonLd, includeJobPosting],

  );



  if (pathname !== "/") {

    return null;

  }



  const fallbackTitle = t("seo.pages.home.title", { defaultValue: fallback.title });

  const fallbackDescription = t("seo.pages.home.description", {

    defaultValue: fallback.description,

  });



  if (!metaTags?.title && !metaTags?.description) {

    return (

      <PageSEO

        title={fallbackTitle}

        description={fallbackDescription}

        canonical="/"

        image={fallback.image}

        ogType={fallback.ogType}

        robots={fallback.robots || "index, follow"}

        jsonLd={jsonLd}

      />

    );

  }



  const keywords = Array.isArray(metaTags.keywords)

    ? metaTags.keywords.join(", ")

    : metaTags.keywords;



  return (

    <PageSEO

      title={metaTags.title || SITE.tagline}

      description={metaTags.description || SITE.defaultDescription}

      canonical={metaTags.canonicalUrl || "/"}

      image={metaTags.ogImage}

      ogTitle={metaTags.ogTitle}

      ogDescription={metaTags.ogDescription}

      robots={metaTags.robots || "index, follow"}

      keywords={keywords}

      jsonLd={jsonLd}

    />

  );

}



export default HomePageSEO;

