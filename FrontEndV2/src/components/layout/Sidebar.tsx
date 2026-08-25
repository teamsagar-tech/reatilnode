import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Inventory", icon: Package, path: "/inventory" },
    { name: "Sales", icon: ShoppingCart, path: "/sales" },
    { name: "Customers", icon: Users, path: "/customers" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

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
