import {
  SITE,
  absoluteUrl,
  buildOrganizationSchema,
  buildWebSiteSchema,
  resolveImageUrl,
} from "../utils/seo";

const bannerImage = resolveImageUrl("/assets/images/banner/inner-banner-img.jpg");

export const PUBLIC_PAGE_SEO = {
  "/": {
    title: SITE.tagline,
    description: SITE.defaultDescription,
    ogType: "website",
    jsonLd: [buildWebSiteSchema(), buildOrganizationSchema()],
  },
  "/about-us": {
    title: "About Us",
    description:
      "Learn about Connect Work.ma, our mission, and how we help job seekers and employers connect across Morocco.",
    image: bannerImage,
    ogType: "website",
    jsonLd: [
      buildOrganizationSchema({
        description:
          "Job portal connecting job seekers with top companies across Morocco.",
      }),
    ],
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "Read the Connect Work.ma privacy policy to understand how we collect, use, and protect your data.",
    image: bannerImage,
    ogType: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Privacy Policy",
        url: absoluteUrl("/privacy-policy"),
        description: "Privacy policy for Connect Work.ma users.",
      },
    ],
  },
  "/terms-condition": {
    title: "Terms and Conditions",
    description:
      "Review the terms and conditions for using Connect Work.ma as a job seeker or employer.",
    image: bannerImage,
    ogType: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Terms and Conditions",
        url: absoluteUrl("/terms-condition"),
        description: "Terms and conditions for Connect Work.ma.",
      },
    ],
  },
  "/jobs": {
    title: "Browse Jobs",
    description:
      "Search and apply for the latest job openings across industries and locations in Morocco.",
    image: bannerImage,
    ogType: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Job Listings",
        url: absoluteUrl("/jobs"),
        description: "Latest job openings on Connect Work.ma.",
      },
    ],
  },
  "/blog": {
    title: "Blog",
    description:
      "Read the latest job tips, career advice, and hiring insights from Connect Work.ma.",
    image: bannerImage,
    ogType: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Connect Work.ma Blog",
        url: absoluteUrl("/blog"),
        description: "Latest job tips and hiring insights.",
      },
    ],
  },
  "/employer-home": {
    title: "For Employers",
    description:
      "Post jobs, manage applicants, and hire top talent with Connect Work.ma employer solutions.",
    image: bannerImage,
    ogType: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Employer Home",
        url: absoluteUrl("/employer-home"),
        description: "Hiring solutions for employers on Connect Work.ma.",
      },
    ],
  },
  "/employer-basic-info": {
    title: "Employer Registration",
    description:
      "Get started as an employer on Connect Work.ma and begin posting jobs to reach qualified candidates.",
    image: bannerImage,
    ogType: "website",
    robots: "noindex, nofollow",
  },
  "/custom-resume-cover-letter": {
    title: "Resume & Cover Letter Services",
    description:
      "Professional resume and cover letter services to help you stand out to employers.",
    image: bannerImage,
    ogType: "website",
  },
  "/company-details": {
    title: "Company Details",
    description:
      "Explore company profiles, culture, and open roles on Connect Work.ma.",
    image: bannerImage,
    ogType: "website",
    robots: "noindex, follow",
  },
  "/add-plan": {
    title: "Subscription Plans",
    description:
      "Choose an employer subscription plan on Connect Work.ma to post jobs and access hiring tools.",
    image: bannerImage,
    ogType: "website",
  },
  "/add-on-pack": {
    title: "Add-On Packs",
    description:
      "Boost your hiring with add-on credit packs and premium features on Connect Work.ma.",
    image: bannerImage,
    ogType: "website",
  },
  "/companies-list": {
    title: "Search Companies",
    description:
      "Search and discover companies hiring on Connect Work.ma.",
    image: bannerImage,
    ogType: "website",
    robots: "noindex, follow",
    canonical: "/companies",
  },
  "/contact-us": {
    title: "Contact Us",
    description:
      "Contact Connect Work.ma for job-related queries, support, or business inquiries.",
    image: bannerImage,
    ogType: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Us",
        url: absoluteUrl("/contact-us"),
        description:
          "Contact Connect Work.ma for support, inquiries, and assistance.",
      },
    ],
  },
};
