import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  // Wait for auth to load localStorage user
  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    // redirect user to their own dashboard
    if (user.role === "donor") return <Navigate to="/donor" replace />;
    if (user.role === "hospital") return <Navigate to="/hospital" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
