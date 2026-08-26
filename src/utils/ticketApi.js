import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { getRequestConfig } from "./apiHeaders";

/**
 * Creates a support ticket (Requirement 14-2).
 * Accessible by guests and authenticated users (JobSeekers, Recruiters).
 *
 * @param {Object} ticketData Payload ({ subject, description, category, priority, name, email, phone })
 * @param {Array<File>} [attachments] Optional file attachments
 */
export const createSupportTicket = async (ticketData = {}, attachments = []) => {
  if (Array.isArray(attachments) && attachments.length > 0) {
    const formData = new FormData();
    Object.entries(ticketData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        formData.append(key, val);
      }
    });

    attachments.forEach((file) => {
      if (file instanceof File) {
        formData.append("attachments", file);
      }
    });

    return axios.post(`${API_BASE_URL}tickets`, formData, {
      ...getRequestConfig(),
      headers: {
        ...getRequestConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  return axios.post(`${API_BASE_URL}tickets`, ticketData, getRequestConfig());
};

/**
 * Fetches the authenticated user's submitted support tickets (Requirement 14-3).
 *
 * @param {Object} [params] Query parameters (page, limit, status, search)
 */
export const fetchMyTickets = async (params = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      queryParams.append(key, val);
    }
  });

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}tickets/my-tickets${queryString ? `?${queryString}` : ""}`;

  return axios.get(url, getRequestConfig());
};

/**
 * Fetches details & public reply thread for a single user ticket (Requirement 14-3).
 *
 * @param {string} ticketId Ticket ID
 */
export const fetchMyTicketById = async (ticketId) => {
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }
  return axios.get(`${API_BASE_URL}tickets/my-tickets/${ticketId}`, getRequestConfig());
};

/**
 * Sends a requester reply to a ticket thread (Requirement 14-3).
 * Reopens resolved tickets back to "Open" automatically.
 *
 * @param {string} ticketId Ticket ID
 * @param {string} message Reply text content
 */
export const replyToMyTicket = async (ticketId, message) => {
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }
  if (!message || !String(message).trim()) {
    throw new Error("Reply message cannot be empty");
  }

  return axios.post(
    `${API_BASE_URL}tickets/my-tickets/${ticketId}/reply`,
    { message: String(message).trim() },
    getRequestConfig()
  );
};

/**
 * Public Guest Ticket Tracker (Requirement 14-3).
 *
 * @param {string} ticketNumber Human readable ticket identifier (e.g., TCK-20260814-7083)
 * @param {string} email Requester email address
 */
export const trackPublicTicket = async (ticketNumber, email) => {
  if (!ticketNumber || !email) {
    throw new Error("Both ticketNumber and email are required for public tracking");
  }

  const queryParams = new URLSearchParams({
    ticketNumber: String(ticketNumber).trim(),
    email: String(email).trim(),
  });

  return axios.get(`${API_BASE_URL}tickets/track?${queryParams.toString()}`);
};
