import axios from "axios";
import { sanitizePublicApiResponse } from "./sanitizePublicCompany";

let installed = false;

/**
 * Strips private company fields from known public API responses before
 * any page component reads response.data.
 */
export function installPublicApiSanitizer() {
  if (installed) {
    return;
  }

  axios.interceptors.response.use((response) => {
    const requestUrl = response.config?.url || "";
    response.data = sanitizePublicApiResponse(requestUrl, response.data);
    return response;
  });

  installed = true;
}
