import axios from "axios";
import { API_BASE_URL } from "../Url/Url";

export const fetchJobRecord = async (slugOrId, token) => {
  if (!slugOrId) {
    throw new Error("Job identifier is required");
  }

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const encoded = encodeURIComponent(slugOrId);
  const endpoints = [
    `${API_BASE_URL}getJobBySlug/${encoded}`,
    `${API_BASE_URL}getJobById/${encoded}`,
  ];

  let lastError;
  for (const url of endpoints) {
    try {
      const res = await axios.get(url, { headers });
      const payload = res.data?.data ?? res.data?.job ?? null;
      if (payload) {
        return payload;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Job not found");
};
