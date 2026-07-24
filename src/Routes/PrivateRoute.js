import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasAuthSession, isAuthReady } from "../utils/apiHeaders";
import { toast } from "react-toastify";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn } = useAuth();
  const userRole = localStorage.getItem("user_role");
  const navigate = useNavigate();
  const authenticated = isLoggedIn || isAuthReady();

  useEffect(() => {
    if (authenticated && allowedRoles && !allowedRoles.includes(userRole)) {
      toast.error("You are not authorized to access this page!");
      navigate("/");
    }
  }, [authenticated, allowedRoles, userRole, navigate]);

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return null;
  }

  return children;
};

export default PrivateRoute;
