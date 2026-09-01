import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
  const userStr = (sessionStorage.getItem('user') || localStorage.getItem('user'));
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
