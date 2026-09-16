import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function isTokenExpired(token: string | null) {
  if (!token) return true;
  try {
    const payloadBase64Url = token.split('.')[1];
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedJson = atob(payloadBase64);
    const decoded = JSON.parse(decodedJson);
    const exp = decoded.exp;
    if (!exp) return false;
    const now = Date.now() / 1000;
    return exp < now;
  } catch (e) {
    return true;
  }
}

export default function ProtectedRoute() {
  const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
  const userStr = (sessionStorage.getItem('user') || localStorage.getItem('user'));
  
  if (!token || !userStr || isTokenExpired(token)) {
    if (token) {
      sessionStorage.clear();
      localStorage.clear();
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
