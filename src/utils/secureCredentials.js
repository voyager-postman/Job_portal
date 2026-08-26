import { API_BASE_URL } from "../Url/Url";
import {
  encryptPasswordForTransport,
  isPasswordEncryptionEnabled,
} from "./passwordEncryption";

export const SENSITIVE_AUTH_FIELDS = [
  "password",
  "oldPassword",
  "newPassword",
  "confirmPassword",
];

const LOCAL_API_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export const redactSensitiveData = (value) => {
  if (value == null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(redactSensitiveData);
  }

  if (typeof value !== "object") {
    return value;
  }

  if (value instanceof FormData) {
    const redacted = {};
    value.forEach((fieldValue, key) => {
      redacted[key] = SENSITIVE_AUTH_FIELDS.includes(key)
        ? "[REDACTED]"
        : fieldValue;
    });
    return redacted;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, fieldValue]) => [
      key,
      SENSITIVE_AUTH_FIELDS.includes(key)
        ? "[REDACTED]"
        : redactSensitiveData(fieldValue),
    ]),
  );
};

const decodePemToArrayBuffer = (pem) => {
  const normalized = pem
    .trim()
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\s/g, "");

  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
};

const bytesToBase64 = (bytes) => {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const isLocalOrPrivateHost = (hostname = "") => {
  if (!hostname) return false;
  if (LOCAL_API_HOSTS.has(hostname)) return true;
  if (
    hostname.endsWith(".local") ||
    hostname.endsWith(".test") ||
    hostname.endsWith(".internal")
  ) {
    return true;
  }
  // IPv4 private/loopback ranges
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
  if (/^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
  return false;
};

export const isSecureApiUrl = (apiBaseUrl = API_BASE_URL) => {
  try {
    const { protocol, hostname } = new URL(apiBaseUrl);
    if (protocol === "https:") {
      return true;
    }

    if (
      protocol === "http:" &&
      (isLocalOrPrivateHost(hostname) ||
        process.env.NODE_ENV === "development" ||
        process.env.REACT_APP_ALLOW_INSECURE_AUTH === "true")
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export const assertSecureApiTransport = (apiBaseUrl = API_BASE_URL) => {
  if (isSecureApiUrl(apiBaseUrl)) {
    return;
  }

  throw new Error("INSECURE_API_TRANSPORT");
};

export const usesClientPasswordEncryption = () =>
  isPasswordEncryptionEnabled() ||
  Boolean(process.env.REACT_APP_LOGIN_PUBLIC_KEY_PEM?.trim());

export const encryptPasswordWithRsaOaep = async (plainPassword, publicKeyPem) => {
  if (!window.crypto?.subtle) {
    throw new Error("PASSWORD_ENCRYPTION_UNAVAILABLE");
  }

  const publicKey = await window.crypto.subtle.importKey(
    "spki",
    decodePemToArrayBuffer(publicKeyPem),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    new TextEncoder().encode(plainPassword),
  );

  return bytesToBase64(new Uint8Array(encrypted));
};

export const preparePasswordField = async (plainPassword) => {
  const publicKeyPem = process.env.REACT_APP_LOGIN_PUBLIC_KEY_PEM?.trim();

  if (publicKeyPem) {
    const encryptedPassword = await encryptPasswordWithRsaOaep(
      plainPassword,
      publicKeyPem,
    );
    return { password: encryptedPassword };
  }

  const encryptedPassword = await encryptPasswordForTransport(plainPassword);
  return { password: encryptedPassword };
};

export const preparePasswordFields = async (fields) => {
  const result = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value == null || value === "") {
      continue;
    }

    if (!SENSITIVE_AUTH_FIELDS.includes(key)) {
      result[key] = value;
      continue;
    }

    const prepared = await preparePasswordField(value);
    result[key] = prepared.password;
  }

  return result;
};

export const getInsecureTransportMessage = () =>
  "Secure HTTPS is required to send login credentials. Please contact support.";
