const loadedHrefs = new Set();

/**
 * Inject a stylesheet once (for CSS kept out of homepage to reduce CLS).
 */
export const loadStylesheet = (href) => {
  if (typeof document === "undefined" || !href || loadedHrefs.has(href)) {
    return;
  }
  loadedHrefs.add(href);
  const existing = document.querySelector(`link[data-cw-href="${href}"]`);
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute("data-cw-href", href);
  document.head.appendChild(link);
};

export const DASHBOARD_STYLES = [
  "/jobPortal/assets/css/dashboard.css",
  "/jobPortal/assets/css/dark.css",
  "/jobPortal/assets/css/muistyle.css",
  "/jobPortal/assets/css/metismenu.min.css",
  "/jobPortal/assets/css/simplebar.min.css",
];

export const EXTRA_UI_STYLES = [
  "/jobPortal/assets/css/meanmenu.css",
  "/jobPortal/assets/css/magnific-popup.min.css",
  "/jobPortal/assets/css/odometer.min.css",
  "/jobPortal/assets/css/aos.css",
];

export const loadDashboardStyles = () => {
  DASHBOARD_STYLES.forEach(loadStylesheet);
};

export const loadExtraUiStyles = () => {
  EXTRA_UI_STYLES.forEach(loadStylesheet);
};
