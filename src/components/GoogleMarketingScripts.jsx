import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { fetchPublicGoogleMarketingConfig } from "../utils/googleMarketingApi";

const GTM_SCRIPT_ID = "google-tag-manager-script";
const GTM_NOSCRIPT_ID = "google-tag-manager-noscript";
const GA_SCRIPT_ID = "google-analytics-gtag-script";
const GA_INLINE_ID = "google-analytics-gtag-inline";

const removeElementById = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.remove();
  }
};

const injectGtm = (containerId) => {
  if (!containerId || document.getElementById(GTM_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = GTM_SCRIPT_ID;
  script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${containerId}');`;
  document.head.appendChild(script);

  if (!document.getElementById(GTM_NOSCRIPT_ID)) {
    const noscript = document.createElement("noscript");
    noscript.id = GTM_NOSCRIPT_ID;
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);
  }
};

const injectGa4 = (measurementId) => {
  if (!measurementId || document.getElementById(GA_SCRIPT_ID)) {
    return;
  }

  const gtagScript = document.createElement("script");
  gtagScript.id = GA_SCRIPT_ID;
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(gtagScript);

  const inlineScript = document.createElement("script");
  inlineScript.id = GA_INLINE_ID;
  inlineScript.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}');`;
  document.head.appendChild(inlineScript);
};

function GoogleMarketingScripts() {
  const [searchConsoleCode, setSearchConsoleCode] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadMarketingConfig = async () => {
      try {
        const res = await fetchPublicGoogleMarketingConfig();
        if (cancelled) {
          return;
        }

        const data = res.data?.data || res.data || {};
        const gtm = data.googleTagManager || data.gtm;
        const ga = data.googleAnalytics || data.ga;
        const gsc = data.googleSearchConsole || data.searchConsole;

        if (gtm?.containerId) {
          injectGtm(gtm.containerId);
        }

        if (ga?.measurementId) {
          injectGa4(ga.measurementId);
        }

        if (gsc?.verificationCode) {
          setSearchConsoleCode(gsc.verificationCode);
        }
      } catch (error) {
        console.error("Failed to load Google marketing config:", error);
      }
    };

    loadMarketingConfig();

    return () => {
      cancelled = true;
      removeElementById(GTM_SCRIPT_ID);
      removeElementById(GTM_NOSCRIPT_ID);
      removeElementById(GA_SCRIPT_ID);
      removeElementById(GA_INLINE_ID);
    };
  }, []);

  if (!searchConsoleCode) {
    return null;
  }

  return (
    <Helmet>
      <meta name="google-site-verification" content={searchConsoleCode} />
    </Helmet>
  );
}

export default GoogleMarketingScripts;
