import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  fetchPublicGlobalSeoConfig,
  normalizeGlobalSeoConfig,
} from "../utils/globalSeoApi";

// Unique DOM IDs for injected scripts
const META_PIXEL_SCRIPT_ID = "global-seo-meta-pixel-script";
const META_PIXEL_NOSCRIPT_ID = "global-seo-meta-pixel-noscript";
const CUSTOM_HEAD_CONTAINER_ID = "global-seo-custom-head-tags";

/** Inject Meta / Facebook Pixel into <head> (idempotent) */
const injectMetaPixel = (pixelId) => {
  if (!pixelId || document.getElementById(META_PIXEL_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = META_PIXEL_SCRIPT_ID;
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);

  if (!document.getElementById(META_PIXEL_NOSCRIPT_ID)) {
    const ns = document.createElement("noscript");
    ns.id = META_PIXEL_NOSCRIPT_ID;
    ns.innerHTML = '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=' + pixelId + '&ev=PageView&noscript=1"/>';
    document.body.insertBefore(ns, document.body.firstChild);
  }
};

/** Inject custom raw head tags string into <head> (idempotent) */
const injectCustomHeadTags = (rawHtml) => {
  if (!rawHtml || !rawHtml.trim()) return;

  const existing = document.getElementById(CUSTOM_HEAD_CONTAINER_ID);
  if (existing) existing.remove();

  const tpl = document.createElement("template");
  tpl.innerHTML = rawHtml.trim();
  const container = document.createElement("div");
  container.id = CUSTOM_HEAD_CONTAINER_ID;
  container.style.display = "none";

  Array.from(tpl.content.childNodes).forEach((node) => {
    const tag = node.nodeName?.toLowerCase();
    if (["script", "meta", "link", "style"].includes(tag)) {
      const cloned = node.cloneNode(true);
      document.head.appendChild(cloned);
    } else {
      container.appendChild(node.cloneNode(true));
    }
  });

  document.head.appendChild(container);
};

const removeById = (id) => {
  const el = document.getElementById(id);
  if (el) el.remove();
};

/**
 * GlobalSeoScripts
 *
 * Fetches the public Global SEO config from the backend and injects:
 *  - Bing webmaster verification meta tag
 *  - Yandex webmaster verification meta tag
 *  - Meta / Facebook Pixel script
 *  - Custom head tags (admin-defined raw HTML)
 *
 * Add this component once in App.js alongside GoogleMarketingScripts.
 */
function GlobalSeoScripts() {
  const [config, setConfig] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const load = async () => {
      try {
        const res = await fetchPublicGlobalSeoConfig();
        if (!mountedRef.current) return;

        const raw = res?.data?.data || res?.data || {};
        const normalized = normalizeGlobalSeoConfig(raw);
        setConfig(normalized);

        if (normalized.analytics?.metaPixelId) {
          injectMetaPixel(normalized.analytics.metaPixelId);
        }

        if (raw.customHeadTags) {
          injectCustomHeadTags(raw.customHeadTags);
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[GlobalSeoScripts] Failed to load global SEO config:", err?.message || err);
        }
      }
    };

    load();

    return () => {
      mountedRef.current = false;
      removeById(META_PIXEL_SCRIPT_ID);
      removeById(META_PIXEL_NOSCRIPT_ID);
      removeById(CUSTOM_HEAD_CONTAINER_ID);
    };
  }, []);

  const bingToken = config?.verificationTags?.bing;
  const yandexToken = config?.verificationTags?.yandex;

  if (!bingToken && !yandexToken) {
    return null;
  }

  return (
    <Helmet>
      {bingToken && (
        <meta name="msvalidate.01" content={bingToken} />
      )}
      {yandexToken && (
        <meta name="yandex-verification" content={yandexToken} />
      )}
    </Helmet>
  );
}

export default GlobalSeoScripts;
