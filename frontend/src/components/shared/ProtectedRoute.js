// components/shared/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ element, isAuthenticated }) => {
  const token = Cookies.get('token'); // Get the token from cookies

  // Check if the token exists in cookies or if the user is authenticated
  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return element; // Render the protected element
};

export default ProtectedRoute;
