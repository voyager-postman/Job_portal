import { createContext, useContext, useState, useEffect } from "react";
import { postUserLogout } from "../utils/authApi";
import { clearAuthStorage, hasAuthSession, isAuthReady } from "../utils/apiHeaders";
import { AUTH_SESSION_EXPIRED_EVENT, resetSessionExpiredState } from "../utils/authInterceptor";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );
  const DEFAULT_JOBSEEKER_IMG = "/jobPortal/assets/images/dashboard/images.png";

  const DEFAULT_COMPANY_IMG = "/jobPortal/assets/images/dashboard/images1.png";

  const user_role = localStorage.getItem("user_role");
  // "JobSeeker" | "Company"

  const getRoleDefaultImage = (role) => {
    return role === "Company" ? DEFAULT_COMPANY_IMG : DEFAULT_JOBSEEKER_IMG;
  };

  const getSafeProfileImage = (img) => {
    if (!img || img === "null" || img === "undefined") {
      return getRoleDefaultImage(user_role);
    }
    return img;
  };

  const [profileImage, setProfileImage] = useState(() =>
    getSafeProfileImage(localStorage.getItem("profileImage")),
  );

  const [firstName, setFirstName] = useState(
    localStorage.getItem("first_name") || "",
  );
  const [lastName, setLastName] = useState(
    localStorage.getItem("last_name") || "",
  );

  useEffect(() => {
    const syncSession = () => {
      if (hasAuthSession() || isAuthReady()) {
        setIsLoggedIn(true);
      }
    };

    const onSessionExpired = () => {
      setIsLoggedIn(false);
      setProfileImage(getRoleDefaultImage(user_role));
      setFirstName("");
      setLastName("");
    };

    syncSession();
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
    window.addEventListener("storage", syncSession);

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
      window.removeEventListener("storage", syncSession);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      setProfileImage(
        getSafeProfileImage(localStorage.getItem("profileImage")),
      );

      setFirstName(localStorage.getItem("first_name") || "");
      setLastName(localStorage.getItem("last_name") || "");
    }
  }, [isLoggedIn]);

  const login = () => {
    resetSessionExpiredState();
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);

    const img = localStorage.getItem("profileImage");
    setProfileImage(getSafeProfileImage(img));

    setFirstName(localStorage.getItem("first_name") || "");
    setLastName(localStorage.getItem("last_name") || "");
  };

  const logout = async () => {
    try {
      await postUserLogout();
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    clearAuthStorage();
    setProfileImage(getRoleDefaultImage(user_role));
    setFirstName("");
    setLastName("");
    setIsLoggedIn(false);
  };

  const updateProfileImage = (url) => {
    localStorage.setItem("profileImage", url);
    setProfileImage(url);
  };

  const updateName = (first, last) => {
    localStorage.setItem("first_name", first);
    localStorage.setItem("last_name", last);
    setFirstName(first);
    setLastName(last);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        profileImage,
        firstName,
        lastName,
        updateProfileImage,
        updateName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
