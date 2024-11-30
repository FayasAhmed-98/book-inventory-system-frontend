import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  role: string;
  redirectTo: string;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ role, redirectTo, children }) => {
  const { user } = useAuth();

  // Check if the user is authenticated and has the correct role
  if (!user) {
    // If the user is not authenticated, redirect to login
    return <Navigate to={redirectTo} />;
  }

  // Check if the user's role matches the required role
  if (user.role !== role) {
    // If the user's role doesn't match, redirect to a default page
    return <Navigate to={redirectTo} />;
  }

  // If authenticated and role matches, render the children (protected route content)
  return <>{children}</>;
};

export default PrivateRoute;
