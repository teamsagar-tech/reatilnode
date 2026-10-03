import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { subscribeToWebPush } from "../../utils/pushSubscription";

export default function DashboardLayout() {
  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      subscribeToWebPush(token);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans" style={{ backgroundColor: '#e2efd9' }}>
      <main className="flex-1 min-h-0 w-full flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
