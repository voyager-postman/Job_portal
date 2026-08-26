import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./responsive.css";
import "./styles/cwVitals.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./i18n";
import { HelmetProvider } from "react-helmet-async";
import { installPublicApiSanitizer } from "./utils/publicApiSanitizer";
import { installApiRateLimitHandler } from "./utils/apiRateLimitHandler";
import { installCredentialSecurity } from "./utils/credentialSecurity";
import { installAuthInterceptor } from "./utils/authInterceptor";
import { installLoadingInterceptor } from "./utils/loadingInterceptor";
import { clearStaleJwtForCookieAuth } from "./utils/apiHeaders";

// Defer carousel CSS until after first paint (FCP/TBT) — not needed for boot shell
import("slick-carousel/slick/slick.css");
import("slick-carousel/slick/slick-theme.css");

clearStaleJwtForCookieAuth();

installPublicApiSanitizer();
installApiRateLimitHandler();
installCredentialSecurity();
installAuthInterceptor();
installLoadingInterceptor();
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HelmetProvider>
    <GoogleOAuthProvider clientId="599915415751-cdp1hjpggjdvu9i49u1suru7fqkquvjr.apps.googleusercontent.com">
      <AuthProvider>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </HelmetProvider>,
);

// Hide fixed boot overlay after first paint of React tree (no document-flow CLS)
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const boot = document.getElementById("cw-boot");
    if (!boot) return;
    boot.classList.add("is-hidden");
    window.setTimeout(() => boot.remove(), 200);
  });
});

reportWebVitals();
