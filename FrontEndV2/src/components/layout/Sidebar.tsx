import { ShieldAlert,  Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  
  const userStr = (sessionStorage.getItem('user') || localStorage.getItem('user'));
  const user = userStr ? JSON.parse(userStr) : null;
  const modules = user?.firm_modules || {};
  const perms = user?.user_permissions || modules; // Fallback to firm modules if no user specific perms

  const check = (mod) => {
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
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 border-r border-slate-800 hidden md:flex shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="bg-primary text-white p-1.5 rounded font-black text-sm leading-none tracking-tighter">RN.</div>
          <span className="text-xl font-black text-white tracking-tight">RetailNode</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                active 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link 
          to="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </Link>
      </div>
    </aside>
  );
}
