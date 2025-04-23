import React from 'react';
import { isLoggedIn, isAdmin } from '../services/authService';

const ProtectedRoute = ({ 
  component: Component, 
  adminOnly = false,
  user, 
  ...rest 
}) => {
  const authenticated = isLoggedIn();
  const authorized = adminOnly ? authenticated && isAdmin() : authenticated;
  
  if (!authenticated) {
    return <div>Please log in to access this page</div>;
  }
  
  if (adminOnly && !isAdmin()) {
    return <div>Access denied. Admin privileges required</div>;
  }
  return <Component user={user} {...rest} />;
};

export default ProtectedRoute;