import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 min-h-0 p-2 sm:p-4 lg:p-4 overflow-y-auto">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
