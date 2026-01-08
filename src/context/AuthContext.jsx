import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const DEFAULT_PROFILE_IMAGE =
    "/jobPortal/assets/images/dashboard/images1.png";

  const getSafeProfileImage = (img) => {
    if (!img || img === "null" || img === "undefined") {
      return DEFAULT_PROFILE_IMAGE;
    }
    return img;
  };

  const [profileImage, setProfileImage] = useState(() =>
    getSafeProfileImage(localStorage.getItem("profileImage"))
  );

  const [firstName, setFirstName] = useState(
    localStorage.getItem("first_name") || ""
  );
  const [lastName, setLastName] = useState(
    localStorage.getItem("last_name") || ""
  );

  useEffect(() => {
    if (isLoggedIn) {
      setProfileImage(
        getSafeProfileImage(localStorage.getItem("profileImage"))
      );

      setFirstName(localStorage.getItem("first_name") || "");
      setLastName(localStorage.getItem("last_name") || "");
    }
  }, [isLoggedIn]);

  // 🔥 Called after successful login (Google or normal login)
  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);

    // Refresh values from localStorage
    setProfileImage(
      localStorage.getItem("profileImage") ||
        "/jobPortal/assets/images/dashboard/images1.png"
    );

    setFirstName(localStorage.getItem("first_name") || "");
    setLastName(localStorage.getItem("last_name") || "");
  };
  console.log(profileImage);
  // 🔥 Logout function
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    localStorage.removeItem("profileImage");
    setProfileImage("/jobPortal/assets/images/dashboard/images1.png");
    setFirstName("");
    setLastName("");
    setIsLoggedIn(false);
  };

  // 🔥 Update profile image from profile API
  const updateProfileImage = (url) => {
    localStorage.setItem("profileImage", url);
    setProfileImage(url);
  };

  // 🔥 Update names from profile API
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
        login, // Login function available globally
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
