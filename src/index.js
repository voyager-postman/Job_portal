import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./responsive.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ⬅ moved here
import "./i18n";
import { HelmetProvider } from "react-helmet-async";
import { installPublicApiSanitizer } from "./utils/publicApiSanitizer";
import { installApiRateLimitHandler } from "./utils/apiRateLimitHandler";
import { installCredentialSecurity } from "./utils/credentialSecurity";
import { installAuthInterceptor } from "./utils/authInterceptor";
import { installLoadingInterceptor } from "./utils/loadingInterceptor";
import { clearStaleJwtForCookieAuth } from "./utils/apiHeaders";

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

reportWebVitals();
