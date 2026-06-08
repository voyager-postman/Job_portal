import { API_BASE_URL } from "../Url/Url";

export const ENCRYPTION_PREFIX = "enc:v1:";
const ENCRYPTION_ENABLED =
  process.env.REACT_APP_PASSWORD_ENCRYPTION_ENABLED !== "false";

const getTextEncoder = () => new TextEncoder();
const getTextDecoder = () => new TextDecoder();

const bytesToBase64 = (bytes) => {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const base64ToBytes = (base64) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

export const getPasswordEncryptionSecret = () => {
  const fromEnv = process.env.REACT_APP_PASSWORD_ENCRYPTION_SECRET?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  try {
    const { hostname } = new URL(API_BASE_URL);
    return `connectwork-jobportal-v1-${hostname}`;
  } catch {
    return "connectwork-jobportal-v1-default";
  }
};

export const isPasswordEncryptionEnabled = () => ENCRYPTION_ENABLED;

export const isEncryptedPasswordPayload = (value) =>
  typeof value === "string" && value.startsWith(ENCRYPTION_PREFIX);

const importAesKey = async (secret) => {
  const digest = await window.crypto.subtle.digest(
    "SHA-256",
    getTextEncoder().encode(secret),
  );

  return window.crypto.subtle.importKey(
    "raw",
    digest,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
};

export const encryptPasswordForTransport = async (plainPassword) => {
  if (!plainPassword || !isPasswordEncryptionEnabled()) {
    return plainPassword;
  }

  if (!window.crypto?.subtle) {
    throw new Error("PASSWORD_ENCRYPTION_UNAVAILABLE");
  }

  const key = await importAesKey(getPasswordEncryptionSecret());
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    getTextEncoder().encode(plainPassword),
  );

  const encryptedBytes = new Uint8Array(encrypted);
  const payload = new Uint8Array(iv.length + encryptedBytes.length);
  payload.set(iv, 0);
  payload.set(encryptedBytes, iv.length);

  return `${ENCRYPTION_PREFIX}${bytesToBase64(payload)}`;
};

export const decryptPasswordFromTransport = async (encryptedValue) => {
  if (!isEncryptedPasswordPayload(encryptedValue)) {
    return encryptedValue;
  }

  if (!window.crypto?.subtle) {
    throw new Error("PASSWORD_ENCRYPTION_UNAVAILABLE");
  }

  const key = await importAesKey(getPasswordEncryptionSecret());
  const payload = base64ToBytes(encryptedValue.slice(ENCRYPTION_PREFIX.length));
  const iv = payload.slice(0, 12);
  const ciphertext = payload.slice(12);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );

  return getTextDecoder().decode(decrypted);
};
