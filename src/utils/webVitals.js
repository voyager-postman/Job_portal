/**
 * Core Web Vitals helpers — questionnaire points 86–89.
 * FCP < 1.8s | LCP < 2.5s | CLS < 0.1 | TBT < 300ms
 */

export const WEB_VITALS_TARGETS = {
  FCP: 1800,
  LCP: 2500,
  CLS: 0.1,
  /** FID/INP field proxy */
  FID: 100,
  TTFB: 800,
  /** Lighthouse lab metric; approximated via Long Tasks in the field */
  TBT: 300,
};

export const isMetricWithinTarget = (name, value) => {
  const target = WEB_VITALS_TARGETS[name];
  if (target == null || value == null || Number.isNaN(Number(value))) {
    return null;
  }
  return Number(value) <= target;
};

const storeMetric = (entry) => {
  if (typeof window === "undefined") return;
  window.__CW_WEB_VITALS__ = window.__CW_WEB_VITALS__ || {};
  window.__CW_WEB_VITALS__[entry.name] = entry;
};

const logMetric = (entry) => {
  if (process.env.NODE_ENV !== "development") return;

  const { name, value, withinTarget: within, target } = entry;
  const label =
    within === null
      ? name
      : within
        ? `${name} OK`
        : `${name} OVER TARGET`;
  const unit = name === "CLS" ? "" : "ms";
  const detail =
    target != null
      ? `${value}${unit} (target ≤ ${target}${unit})`
      : `${value}${unit}`;

  // eslint-disable-next-line no-console
  console[within === false ? "warn" : "info"](`[WebVitals] ${label}: ${detail}`);
};

/**
 * Logs vitals and stores snapshot on window.__CW_WEB_VITALS__ for QA.
 */
export const handleWebVital = (metric) => {
  if (!metric || !metric.name) return;

  const name = metric.name;
  const value =
    name === "CLS"
      ? Number(metric.value)
      : Math.round(Number(metric.value));
  const within = isMetricWithinTarget(name, value);
  const target = WEB_VITALS_TARGETS[name];

  const entry = {
    name,
    value,
    rating: metric.rating,
    target,
    withinTarget: within,
    id: metric.id,
    navigationType: metric.navigationType,
    at: new Date().toISOString(),
  };

  storeMetric(entry);
  logMetric(entry);

  // Dev helper: which nodes shifted (point 88 debugging)
  if (
    process.env.NODE_ENV === "development" &&
    name === "CLS" &&
    Array.isArray(metric.entries) &&
    metric.entries.length
  ) {
    const top = metric.entries
      .slice()
      .sort((a, b) => (b.value || 0) - (a.value || 0))
      .slice(0, 5)
      .map((e) => ({
        value: e.value,
        sources: (e.sources || []).map((s) => {
          const node = s?.node;
          if (!node) return "(unknown)";
          const cls =
            typeof node.className === "string"
              ? node.className
              : node.getAttribute?.("class") ||
                node.className?.baseVal ||
                "";
          return [node.tagName, node.id, cls].filter(Boolean).join(".");
        }),
      }));
    // eslint-disable-next-line no-console
    console.info("[WebVitals] CLS sources (top):", JSON.stringify(top, null, 2));
  }
};

/**
 * Approximate Total Blocking Time from Long Tasks (point 89).
 *
 * - No buffered history (avoids counting React bootstrap / CRA dev overhead).
 * - Starts after first paint; stops at load + 1s.
 * - Production build + Lighthouse is the authoritative TBT check.
 */
export const startTbtApproximation = () => {
  if (
    typeof window === "undefined" ||
    typeof PerformanceObserver === "undefined"
  ) {
    return () => {};
  }

  let tbtMs = 0;
  let observer;
  let stopped = false;
  let measuring = false;

  const publish = (final = false) => {
    const value = Math.round(tbtMs);
    const entryPayload = {
      name: "TBT",
      value,
      rating: value <= WEB_VITALS_TARGETS.TBT ? "good" : "needs-improvement",
      target: WEB_VITALS_TARGETS.TBT,
      withinTarget: isMetricWithinTarget("TBT", value),
      approximated: true,
      window: "post-paint-until-load+1s",
      final,
      note:
        process.env.NODE_ENV === "development"
          ? "Dev mode inflates TBT; verify with production build + Lighthouse"
          : undefined,
      at: new Date().toISOString(),
    };
    storeMetric(entryPayload);
    if (process.env.NODE_ENV === "development") {
      logMetric(entryPayload);
    }
  };

  const stop = () => {
    if (stopped) return;
    stopped = true;
    measuring = false;
    try {
      observer?.disconnect();
    } catch {
      /* ignore */
    }
    publish(true);
  };

  const startMeasuring = () => {
    if (stopped || measuring) return;
    measuring = true;

    try {
      observer = new PerformanceObserver((list) => {
        if (stopped) return;
        list.getEntries().forEach((entry) => {
          const blocking = Math.max(0, entry.duration - 50);
          if (blocking > 0) {
            tbtMs += blocking;
            publish(false);
          }
        });
      });
      observer.observe({ type: "longtask", buffered: false });
    } catch {
      return;
    }

    const armStop = () => window.setTimeout(stop, 1000);
    if (document.readyState === "complete") {
      armStop();
    } else {
      window.addEventListener("load", armStop, { once: true });
    }
    window.setTimeout(stop, 8000);
  };

  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => {
      requestAnimationFrame(startMeasuring);
    });
  } else {
    window.setTimeout(startMeasuring, 0);
  }

  return stop;
};
