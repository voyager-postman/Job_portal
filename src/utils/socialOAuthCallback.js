import axios from "axios";
import { API_BASE_URL, API_IMAGE_URL } from "../Url/Url";
import {
  USE_COOKIE_AUTH,
  persistLoginSession,
  getPostLoginPath,
  getRequestConfig,
} from "./apiHeaders";
import {
  resolveEmployerCompanyId,
  toVerifiedByAdminStorage,
} from "./employerVerification";
const DEFAULT_JOBSEEKER_IMG = "/jobPortal/assets/images/dashboard/images.png";
const DEFAULT_COMPANY_IMG = "/jobPortal/assets/images/dashboard/images1.png";

const parseBooleanParam = (params, ...keys) =>
  keys.some((key) => params.get(key) === "true");

export const consumeSocialOAuthCallback = (search = "") => {
  const queryParams = new URLSearchParams(search);
  const success = queryParams.get("success");

  if (!success) {
    return null;
  }

  if (success === "false") {
    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return {
      error: queryParams.get("message") || "Login failed",
    };
  }

  if (success !== "true") {
    return null;
  }

  const token = queryParams.get("token");
  const role = queryParams.get("role");
  const email = queryParams.get("email");

  if (!role || !email) {
    return null;
  }

  if (!USE_COOKIE_AUTH && !token) {
    return null;
  }

  const name = queryParams.get("name") || "";
  const avatar = queryParams.get("avatar");
  const companyId = queryParams.get("companyId");
  const userId =
    queryParams.get("userId") ||
    queryParams.get("id") ||
    queryParams.get("_id") ||
    "";

  const is_completed = parseBooleanParam(
    queryParams,
    "is_completed",
    "isVerified",
  );
  const verifiedByAdmin = parseBooleanParam(
    queryParams,
    "verifiedByAdmin",
    "isVerifiedByAdmin",
  );

  const [first_name = "", last_name = ""] = name.split(" ");

  const user = {
    id: userId || undefined,
    _id: userId || undefined,
    email,
    role,
    first_name,
    last_name,
    is_completed,
    verifiedByAdmin,
    companyId: companyId || undefined,
  };

  const defaultProfileImage =
    role === "Company" || role === "Recruiter"
      ? DEFAULT_COMPANY_IMG
      : DEFAULT_JOBSEEKER_IMG;

  persistLoginSession({
    token,
    user,
    extras: {
      verifiedByAdmin: toVerifiedByAdminStorage(verifiedByAdmin),
      companyId,
      profileImage: avatar || defaultProfileImage,
    },
  });

  if (typeof window !== "undefined") {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const blockedUnverified =
    role === "Company" && is_completed && !verifiedByAdmin;

  return {
    persisted: true,
    user,
    role,
    redirectPath: getPostLoginPath(user),
    blockedUnverified,
  };
};

const resolveProfileImageUrl = (profileImg, fallback) => {
  if (!profileImg || profileImg.trim() === "") {
    return fallback;
  }

  return profileImg.startsWith("http")
    ? profileImg
    : `${API_IMAGE_URL}${profileImg}`;
};

export const enrichSocialLoginProfile = async (role) => {
  try {
    if (role === "JobSeeker") {
      const profileRes = await axios.get(
        `${API_BASE_URL}candidate/profile`,
        getRequestConfig(),
      );
      const profileData = profileRes.data?.profile;
      const profileImg = profileData?.profileImage;
      const fallback = DEFAULT_JOBSEEKER_IMG;

      localStorage.setItem(
        "profileImage",
        resolveProfileImageUrl(profileImg, fallback),
      );

      if (profileData?.first_name) {
        localStorage.setItem("first_name", profileData.first_name);
      }
      if (profileData?.last_name) {
        localStorage.setItem("last_name", profileData.last_name);
      }
      if (profileData?._id || profileData?.id) {
        localStorage.setItem("user_id", profileData._id || profileData.id);
      }

      return profileData;
    }

    if (role === "Company" || role === "Recruiter") {
      const companyId = resolveEmployerCompanyId();
      if (!companyId) {
        localStorage.setItem("profileImage", DEFAULT_COMPANY_IMG);
        return null;
      }

      const response = await axios.get(
        `${API_BASE_URL}GetCompanyDetails/${companyId}`,
        getRequestConfig(),
      );
      const company = response.data?.company;

      if (company?._id) {
        localStorage.setItem("companyId", company._id);
      }

      localStorage.setItem(
        "verifiedByAdmin",
        toVerifiedByAdminStorage(company?.verifiedByAdmin),
      );

      const logo = company?.logo;
      localStorage.setItem(
        "profileImage",
        resolveProfileImageUrl(logo, DEFAULT_COMPANY_IMG),
      );

      return company;
    }
  } catch (error) {
    console.error("Social login profile sync failed:", error);
  }

  return null;
};
