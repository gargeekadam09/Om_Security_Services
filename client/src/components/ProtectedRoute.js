import React from 'react';
import { isLoggedIn, isAdmin } from '../services/authService';

const ProtectedRoute = ({ 
  component: Component, 
  adminOnly = false,
  user, 
  ...rest 
}) => {
  // Check if user is logged in
  const authenticated = isLoggedIn();
  
  // For admin routes, also check if user is admin
  const authorized = adminOnly ? authenticated && isAdmin() : authenticated;
  
  if (!authenticated) {
    // Not logged in, redirect to login page
    return <div>Please log in to access this page</div>;
  }
  
  if (adminOnly && !isAdmin()) {
    // Not admin, show access denied
    return <div>Access denied. Admin privileges required</div>;
  }
  
  // If authorized, render the component
  return <Component user={user} {...rest} />;
};

export default ProtectedRoute;