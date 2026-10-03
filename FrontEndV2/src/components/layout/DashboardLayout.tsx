import { Outlet } from "react-router-dom";
import React, { useEffect } from 'react';
import Header from "./Header";
// @ts-ignore
import { subscribeToWebPush } from "../../utils/pushSubscription";

export default function DashboardLayout() {
  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      subscribeToWebPush(token);
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
