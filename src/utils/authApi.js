import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { getAuthHeaders } from "./apiHeaders";
import {
  assertSecureApiTransport,
  getInsecureTransportMessage,
  preparePasswordField,
  preparePasswordFields,
} from "./secureCredentials";

const AUTH_AXIOS_CONFIG = { withCredentials: true };

const buildAuthError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const securePost = async (url, body, config = {}) => {
  try {
    assertSecureApiTransport();
  } catch {
    throw buildAuthError("INSECURE_API_TRANSPORT", getInsecureTransportMessage());
  }

  return axios.post(url, body, { ...AUTH_AXIOS_CONFIG, ...config });
};

const securePut = async (url, body, config = {}) => {
  try {
    assertSecureApiTransport();
  } catch {
    throw buildAuthError("INSECURE_API_TRANSPORT", getInsecureTransportMessage());
  }

  return axios.put(url, body, { ...AUTH_AXIOS_CONFIG, ...config });
};

export const postUserLogin = async ({ email, password, role }) => {
  const passwordField = await preparePasswordField(password);
  const body = {
    email,
    ...passwordField,
  };

  if (role) {
    body.role = role;
  }

  return securePost(`${API_BASE_URL}user/login`, body);
};

export const postUserRegister = async ({ email, password, ...rest }) => {
  const passwordField = await preparePasswordField(password);

  return securePost(`${API_BASE_URL}user/register`, {
    email,
    ...passwordField,
    ...rest,
  });
};

export const postCompanyRegister = async ({ email, password, ...rest }) => {
  const passwordField = await preparePasswordField(password);

  return securePost(`${API_BASE_URL}register/company`, {
    email,
    ...passwordField,
    ...rest,
  });
};

export const postUserLogout = async () =>
  securePost(`${API_BASE_URL}user/logout`, {});

export const putChangePassword = async ({
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  const passwordFields = await preparePasswordFields({
    oldPassword,
    newPassword,
    confirmPassword,
  });

  return securePut(`${API_BASE_URL}/change-password`, passwordFields, {
    headers: getAuthHeaders(),
  });
};

export const isInsecureTransportError = (error) =>
  error?.code === "INSECURE_API_TRANSPORT";
