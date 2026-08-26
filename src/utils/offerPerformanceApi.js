import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { getRequestConfig } from "./apiHeaders";

/**
 * Recruiter Offer Performance Analytics API (Metric 11-3)
 * Fetches clicks, applications, abandonment count/rate, click-to-apply rate,
 * monthly trends, and per-job breakdown for recruiter jobs.
 *
 * @param {Object} params Query parameters
 * @param {string} [params.jobId] Optional single job ID filter
 * @param {number|string} [params.year] Target year (e.g. 2026)
 * @param {number|string} [params.month] Target month (1 to 12)
 * @param {string} [params.startDate] Start date (YYYY-MM-DD)
 * @param {string} [params.endDate] End date (YYYY-MM-DD)
 * @param {string} [params.status] Job status filter ('published' | 'expired' | 'all')
 * @param {number|string} [params.page] Page number for job list pagination
 * @param {number|string} [params.limit] Page size limit for job list pagination
 * @param {string} [params.sortBy] Sort field ('clicks' | 'applications' | 'abandonmentRate' | 'clickToApplyRate' | 'views')
 * @param {string} [params.sortOrder] Sort direction ('desc' | 'asc')
 */
export const getRecruiterOfferPerformanceAnalytics = async (params = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}recruiter/analytics/offer-performance${queryString ? `?${queryString}` : ""}`;

  return axios.get(url, getRequestConfig());
};

/**
 * Metric 11-3 Helper: Calculate Abandonment Count
 * Formula: max(0, totalClicks - totalApplications)
 */
export const calculateAbandonmentCount = (totalClicks = 0, totalApplications = 0) => {
  const clicks = Number(totalClicks) || 0;
  const apps = Number(totalApplications) || 0;
  return Math.max(0, clicks - apps);
};

/**
 * Metric 11-3 Helper: Calculate Abandonment Rate (%)
 * Formula: ((totalClicks - totalApplications) / totalClicks) * 100
 */
export const calculateAbandonmentRate = (totalClicks = 0, totalApplications = 0) => {
  const clicks = Number(totalClicks) || 0;
  if (clicks <= 0) return 0;
  const apps = Number(totalApplications) || 0;
  const abandoned = Math.max(0, clicks - apps);
  return Number(((abandoned / clicks) * 100).toFixed(2));
};

/**
 * Metric 11-3 Helper: Calculate Click-to-Apply Rate (%)
 * Formula: (totalApplications / totalClicks) * 100
 */
export const calculateClickToApplyRate = (totalClicks = 0, totalApplications = 0) => {
  const clicks = Number(totalClicks) || 0;
  if (clicks <= 0) return 0;
  const apps = Number(totalApplications) || 0;
  return Number(((apps / clicks) * 100).toFixed(2));
};

/**
 * Metric 11-3 Helper: Calculate View-to-Click Rate (%)
 * Formula: (totalClicks / totalViews) * 100
 */
export const calculateViewToClickRate = (totalViews = 0, totalClicks = 0) => {
  const views = Number(totalViews) || 0;
  if (views <= 0) return 0;
  const clicks = Number(totalClicks) || 0;
  return Number(((clicks / views) * 100).toFixed(2));
};
