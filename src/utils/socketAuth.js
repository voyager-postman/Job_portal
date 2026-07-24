import { io } from "socket.io-client";
import { USE_COOKIE_AUTH, resolveAuthToken } from "./apiHeaders";

export const SOCKET_SERVER_URL =
  process.env.REACT_APP_SOCKET_URL?.trim() || "https://sisccltd.com";

export const getSocketConnectOptions = () => {
  const options = {
    path: "/job_portal/socket.io",
    withCredentials: true,
    transports: ["websocket", "polling"],
  };

  // auth.token only for local dev — production authenticates via HTTP-only cookie
  if (!USE_COOKIE_AUTH) {
    const token = resolveAuthToken(
      localStorage.getItem("token"),
      localStorage.getItem("adminToken"),
      localStorage.getItem("admin_token"),
    );

    if (token) {
      options.auth = { token };
    }
  }

  return options;
};

export const connectSocket = () =>
  io(SOCKET_SERVER_URL, getSocketConnectOptions());
