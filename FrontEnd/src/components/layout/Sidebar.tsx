import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  
  const userStr = (sessionStorage.getItem('user') || localStorage.getItem('user'));
  const user = userStr ? JSON.parse(userStr) : null;
  const modules = user?.firm_modules || {};
  const perms = user?.user_permissions || modules; // Fallback to firm modules if no user specific perms

  const check = (mod: string) => {
    if (modules[mod]?.enabled === false) return false;
    if (perms[mod]?.enabled === false) return false;
    return true;
  };

  // Build menu conditionally
  let menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", show: true },
    { name: "Inventory", icon: Package, path: "/inventory", show: check('inventory') },
    { name: "Sales", icon: ShoppingCart, path: "/sales", show: check('sales') },
    { name: "Purchase", icon: ShoppingCart, path: "/purchase", show: check('purchase') },
    { name: "Customers", icon: Users, path: "/customers", show: true },
    { name: "Settings", icon: Settings, path: "/settings", show: true },
    { name: "Support", icon: Settings, path: "/support/tickets", show: true },
  ].filter(item => item.show);

  return (
    <aside className="w-64 flex flex-col h-screen sticky top-0 hidden md:flex shrink-0 border-r border-slate-200/50 bg-white/60 backdrop-blur-xl">
      <div className="h-20 flex items-center px-6 relative">
        <Link to="/dashboard" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center font-black text-sm tracking-tighter">RN.</div>
          <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">RetailNode</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <div className="px-2 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Main Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-semibold relative overflow-hidden group ${
                active 
                  ? "text-indigo-600 shadow-sm shadow-indigo-100 bg-white border border-indigo-50/50" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/80"
              }`}
            >
              {active && (
                <div className="absolute inset-0 bg-indigo-50/40 w-full h-full" />
              )}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />
              )}
              <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 mt-auto">
        <Link 
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/80 group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <span>Log out</span>
        </Link>
      </div>
    </aside>
  );
}
