import React from "react";
import Header from "./Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans">
      <Header />
      <main className="flex-1 min-h-0 p-2 sm:p-4 w-full flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
