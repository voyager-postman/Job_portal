// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(
//     localStorage.getItem("isSidebarVisible") === "1"
//   );

//   const login = () => {
//     localStorage.setItem("isSidebarVisible", "1");
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     localStorage.removeItem("isSidebarVisible");
//     setIsLoggedIn(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
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

  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);

    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) setProfileImage(storedImage);

    const storedFirst = localStorage.getItem("first_name");
    if (storedFirst) setFirstName(storedFirst);

    const storedLast = localStorage.getItem("last_name");
    if (storedLast) setLastName(storedLast);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    setProfileImage("/jobPortal/assets/images/dashboard/images1.png");
    setFirstName("");
    setLastName("");
    setIsLoggedIn(false);
  };

  const updateProfileImage = (url) => {
    setProfileImage(url);
    localStorage.setItem("profileImage", url);
  };

  const updateName = (first, last) => {
    setFirstName(first);
    setLastName(last);
    localStorage.setItem("first_name", first);
    localStorage.setItem("last_name", last);
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
