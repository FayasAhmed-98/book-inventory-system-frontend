// PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  role: string; // Expected role (e.g., "ADMIN" or "USER")
  redirectTo: string; // Path to redirect if conditions are not met
  children: React.ReactNode; // Protected component
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ role, redirectTo, children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    console.log("No token found, redirecting to login.");
    return <Navigate to={redirectTo} replace />;
  }

  if (userRole !== role) {
    console.log(`Role mismatch: expected ${role}, got ${userRole}`);
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
