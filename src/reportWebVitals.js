import { handleWebVital, startTbtApproximation } from "./utils/webVitals";

const reportWebVitals = (onPerfEntry) => {
  const callback =
    onPerfEntry && onPerfEntry instanceof Function ? onPerfEntry : handleWebVital;

  import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(callback);
    getFID(callback);
    getFCP(callback);
    getLCP(callback);
    getTTFB(callback);
  });

  // Point 89 — approximate TBT via Long Tasks API
  startTbtApproximation();
};

export default reportWebVitals;
