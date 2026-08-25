import { Bell, Search, Settings, LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Inventory", icon: Package, path: "/inventory" },
    { name: "Sales", icon: ShoppingCart, path: "/sales" },
    { name: "Customers", icon: Users, path: "/customers" },
  ];

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
      
      {/* Logo & Navigation */}
      <div className="flex items-center gap-8 h-full">
        <Link to="/dashboard" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 mr-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-1.5 rounded-lg shadow-md shadow-indigo-500/30 flex items-center justify-center font-black text-xs tracking-tighter">RN.</div>
          <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight hidden sm:block">RetailNode</span>
        </Link>
        
        {/* Horizontal Menu */}
        <nav className="hidden md:flex h-full items-center gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 h-full px-4 border-b-2 transition-all duration-300 text-sm font-bold ${
                  active 
                    ? "border-indigo-600 text-indigo-700 bg-indigo-50/50" 
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'scale-110 text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Right Side Actions */}
      <div className="flex items-center gap-5">
        
        {/* Global Search */}
        <div className="hidden lg:block relative group w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-1.5 bg-slate-50/80 border border-slate-200 rounded-lg leading-5 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-xs font-medium transition-all duration-300 shadow-sm"
            placeholder="Search..."
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">⌘K</span>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300 relative group">
            <Bell className="w-4 h-4 group-hover:animate-pulse" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </button>
        </div>
        
        {/* Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 -my-1.5 rounded-xl transition-all duration-300 border border-transparent hover:border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-200/50 shadow-inner">
            AK
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-700 leading-none mb-1">Arjun</p>
            <p className="text-[10px] font-medium text-slate-500 leading-none">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
