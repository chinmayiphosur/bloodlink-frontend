// frontend/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  // While loading auth state → avoid wrong redirects
  if (loading) return null;

  // Not logged in → login page
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but wrong role → send to THEIR dashboard (NOT "/")
  if (roles && !roles.includes(user.role)) {
    if (user.role === "donor") return <Navigate to="/donor" replace />;
    if (user.role === "hospital") return <Navigate to="/hospital" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
