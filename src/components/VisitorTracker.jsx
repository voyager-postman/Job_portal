import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  getPageTypeFromPath,
  trackVisitorPage,
  extractUtmParameters,
} from "../utils/visitorTracker";

const VisitorTracker = () => {
  const location = useLocation();
  const lastTrackedKeyRef = useRef("");

  useEffect(() => {
    const currentPath = location.pathname + location.search;

    // Save any UTM query params into sessionStorage if present on this route
    if (location.search) {
      extractUtmParameters(location.search);
    }

    const pageType = getPageTypeFromPath(location.pathname);
    if (!pageType) {
      return;
    }

    const trackingKey = `${pageType}:${currentPath}`;
    if (lastTrackedKeyRef.current === trackingKey) {
      return;
    }
    lastTrackedKeyRef.current = trackingKey;

    trackVisitorPage(pageType, currentPath);
  }, [location.pathname, location.search]);

  return null;
};

export default VisitorTracker;
