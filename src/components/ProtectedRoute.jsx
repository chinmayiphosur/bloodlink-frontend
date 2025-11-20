import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  // Wait for auth to load localStorage user
  if (loading) return null;

  // Debug logging - uncomment for troubleshooting
  // console.log("ProtectedRoute - User:", user);
  // console.log("ProtectedRoute - Required roles:", roles);
  // console.log("ProtectedRoute - User role:", user?.role);
  // console.log("ProtectedRoute - Role check:", roles?.includes(user?.role));

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
