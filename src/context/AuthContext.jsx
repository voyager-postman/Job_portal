import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") ||
      "/jobPortal/assets/images/dashboard/images1.png"
  );

  const [firstName, setFirstName] = useState(
    localStorage.getItem("first_name") || ""
  );

  const [lastName, setLastName] = useState(
    localStorage.getItem("last_name") || ""
  );

  // 🔥 Load stored data when user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      const storedImage = localStorage.getItem("profileImage");
      if (storedImage) setProfileImage(storedImage);

      const storedFirst = localStorage.getItem("first_name");
      if (storedFirst) setFirstName(storedFirst);

      const storedLast = localStorage.getItem("last_name");
      if (storedLast) setLastName(storedLast);
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
