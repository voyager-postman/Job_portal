import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn } = useAuth();
  const userRole = localStorage.getItem("user_role");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && allowedRoles && !allowedRoles.includes(userRole)) {
      toast.error("You are not authorized to access this page!");
      navigate("/");
    }
  }, [isLoggedIn, allowedRoles, userRole, navigate]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return null; // ⛔ prevent rendering before redirect
  }

  return children;
};

export default PrivateRoute;
