import { Bell, Search, Settings, LayoutDashboard, Package, ShoppingCart, Users, LogOut, Database, ChevronDown, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import NotificationBell from "./NotificationBell";

// Menu item typing
type MenuItem = {
  name: string;
  icon?: any;
  path?: string;
  show?: boolean;
  children?: MenuItem[];
};

export default function Header() {
    const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const t = setTimeout(() => setIsNavigating(false), 200);
    return () => clearTimeout(t);
  }, [location.pathname]);
  const isActive = (path?: string) => path && path !== "#" ? location.pathname.startsWith(path) : false;

  const user = JSON.parse((sessionStorage.getItem('user') || localStorage.getItem('user')) || '{}');
  const isImpersonating = sessionStorage.getItem('isImpersonating') === 'true';

  const modules = user?.firm_modules || {};
  const perms = user?.user_permissions || modules;

  const check = (mod: string) => {
    if (modules[mod]?.enabled === false) return false;
    if (perms[mod]?.enabled === false) return false;
    return true;
  };

  const isSuperAdmin = user.role === 'superadmin';

  const menuItems: MenuItem[] = isSuperAdmin 
  ? [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", show: true },
    ].filter(item => item.show)
  : [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", show: true },
      { 
        name: "Masters", 
        icon: Database, 
        path: "/masters", 
        show: check('masters'),
        children: [
          { name: "Hub Overview", path: "/masters" },
          { name: "Inventory Masters", children: [
            { name: "Item Master", path: "/masters/item" },
            { name: "Brand Master", path: "/masters/brand" },
            { name: "Category Master", path: "/masters/category" },
            { name: "Sub-Category", path: "/masters/subcategory" },
            { name: "Department", path: "/masters/department" },
            { name: "Section", path: "/masters/section" },
            { name: "Style", path: "/masters/style" },
            { name: "Sub-Style", path: "/masters/substyle" },
            { name: "Taxonomy Master", path: "/masters/taxonomy" },
            { name: "Design Master", path: "/masters/design" },
            { name: "Size Master", path: "/masters/size" },
            { name: "Size Group", path: "/masters/size-group" },
            { name: "Size Set", path: "/masters/size-sets" },
            { name: "Color Master", path: "/masters/color" },
            { name: "Cut Master", path: "/masters/cut" },
            { name: "Material", path: "/masters/material" },
            { name: "HSN/SAC", path: "/masters/hsnsac" }
          ]},
          { name: "Accounting Masters", children: [
            { name: "Party Master", path: "/masters/party" },
            { name: "Customer Master", path: "/masters/customer" },
            { name: "Transporter", path: "/masters/transporter" },
            { name: "Hundekari", path: "/masters/hundekari" },
            { name: "Commission", path: "/masters/commission" }
          ]},
          { name: "Configuration", children: [
             { name: "Location Master", path: "/masters/location" },
             { name: "Charges Type", path: "/masters/chargestype" },
             { name: "Item Percentage", path: "/masters/itempercentage" }
          ]}
        ]
      },
      { 
        name: "Inventory", 
        icon: Package, 
        path: "/inventory", 
        show: check('inventory'),
        children: [
          { name: "Dashboard", path: "/inventory" },
          { name: "Transactions", children: [
            { name: "Stock Transfer", path: "#" },
            { name: "Inward", path: "#" },
            { name: "Outward", path: "#" }
          ]},
          { name: "Masters", children: [
            { name: "Item Master", path: "/masters/item" },
            { name: "Brand Master", path: "/masters/brand" },
            { name: "Category Master", path: "/masters/category" },
            { name: "Sub-Category", path: "/masters/subcategory" },
            { name: "Department", path: "/masters/department" },
            { name: "Section", path: "/masters/section" },
            { name: "Style", path: "/masters/style" },
            { name: "Sub-Style", path: "/masters/substyle" },
            { name: "Taxonomy Master", path: "/masters/taxonomy" },
            { name: "Design Master", path: "/masters/design" },
            { name: "Size Master", path: "/masters/size" },
            { name: "Size Group", path: "/masters/size-group" },
            { name: "Size Set", path: "/masters/size-sets" },
            { name: "Color Master", path: "/masters/color" },
            { name: "Cut Master", path: "/masters/cut" },
            { name: "Material", path: "/masters/material" },
            { name: "HSN/SAC", path: "/masters/hsnsac" }
          ]},
          { name: "Reports", children: [
            { name: "Current Stock", path: "#" },
            { name: "Stock Ageing", path: "#" }
          ]}
        ]
      },
      { 
        name: "Sales", 
        icon: ShoppingCart, 
        path: "/sales", 
        show: check('sales'),
        children: [
          { name: "Dashboard", path: "/sales" },
          { name: "Transactions", children: [
            { name: "Point of Sale", path: "#" },
            { name: "Sales Invoice", path: "#" },
            { name: "Sales Drafts", path: "/sales/drafts/sales-drafts" }
          ]},
          { name: "Returns & Approvals", children: [
            { name: "Sales Return", path: "#" },
            { name: "Price Approval", path: "#" }
          ]}
        ]
      },
      { 
        name: "Purchase", 
        icon: ShoppingCart, 
        path: "/purchase", 
        show: check('purchase'),
        children: [
          { name: "Dashboard", path: "/purchase" },
          { name: "Transactions", children: [
            { name: "Purchase Order", path: "#" },
            { name: "Purchase Invoice", path: "#" }
          ]},
          { name: "Returns", children: [
            { name: "Debit Note", path: "#" },
            { name: "Return Challan", path: "#" }
          ]}
        ]
      },
      { 
        name: "Accounting", 
        icon: Users, 
        path: "#", 
        show: true,
        children: [
          { name: "Masters", children: [
            { name: "Party Master", path: "/masters/party" },
            { name: "Customer Master", path: "/masters/customer" },
            { name: "Transporter", path: "/masters/transporter" },
            { name: "Hundekari", path: "/masters/hundekari" },
            { name: "Commission", path: "/masters/commission" }
          ]}
        ]
      },
      { 
        name: "Configuration", 
        icon: Settings, 
        path: "/settings", 
        show: true,
        children: [
          { name: "Dashboard", path: "/settings" },
          { name: "Masters", children: [
             { name: "Location Master", path: "/masters/location" },
             { name: "Charges Type", path: "/masters/chargestype" },
             { name: "Item Percentage", path: "/masters/itempercentage" }
          ]}
        ]
      },
      { name: "Support", icon: Settings, path: "/support/tickets", show: true },
    ].filter(item => item.show !== false);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/login';
  };

  const exitImpersonation = () => {
    sessionStorage.clear();
    window.location.href = '/dashboard';
  };

  return (
    <>
      <header className="h-16 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-3 md:px-6 sticky top-0 z-40 shadow-sm w-full max-w-full">
        
        {/* Logo & Navigation */}
        <div className="flex items-center h-full">
          <Link to="/dashboard" className="flex items-center hover:scale-[1.02] transition-transform duration-300 mr-2 md:mr-6 shrink-0">
            <img src="/logo.png" alt="RetailNode" className="h-[40px] w-auto object-contain" />
          </Link>
          
          {/* Horizontal Menu (Level 1) */}
          <nav className="hidden lg:flex h-full items-center gap-0.5 lg:gap-1 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const hasChildren = item.children && item.children.length > 0;
              
              return (
                <div key={item.name} className="group relative h-full flex items-center shrink-0">
                  <Link
                    to={item.path || "#"}
                    className={`flex items-center gap-1.5 h-full px-2 xl:px-3 border-b-2 transition-all duration-300 text-[13px] xl:text-sm font-bold cursor-pointer ${
                      active 
                        ? "border-indigo-600 text-indigo-700 bg-indigo-50/50" 
                        : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${active ? 'scale-110 text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />}
                    <span className="whitespace-nowrap">{item.name}</span>
                    {hasChildren && <ChevronDown className="w-3.5 h-3.5 opacity-50 -ml-1 group-hover:rotate-180 transition-transform duration-300" />}
                  </Link>
                  
                  {/* Level 2 Dropdown */}
                  {hasChildren && (
                    <div className={`absolute top-[calc(100%-2px)] left-0 min-w-[200px] bg-white rounded-xl shadow-lg border border-slate-100 py-2 transition-all duration-200 transform z-50 ${isNavigating ? "hidden" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0"}`}>
                      {item.children!.map((child, idx) => {
                        const hasSubChildren = child.children && child.children.length > 0;
                        return (
                          <div key={idx} className="group/sub relative">
                            <Link
                              to={child.path || "#"}
                              className="flex items-center justify-between px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors w-full text-left"
                            >
                              <span>{child.name}</span>
                              {hasSubChildren && <ChevronRight className="w-4 h-4 opacity-50" />}
                            </Link>
                            
                            {/* Level 3 Flyout */}
                            {hasSubChildren && (
                              <div className={`absolute top-0 left-full ml-1 min-w-[220px] bg-white rounded-xl shadow-xl border border-slate-100 py-2 transition-all duration-200 transform z-50 ${isNavigating ? "hidden" : "opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible -translate-x-2 group-hover/sub:translate-x-0"}`}>
                                {child.children!.map((subChild, subIdx) => (
                                  <Link
                                    key={subIdx}
                                    to={subChild.path || "#"}
                                    className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                  >
                                    {subChild.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0 pl-2">
          
          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300 hidden sm:block">
              <Settings className="w-4 h-4" />
            </button>
            <NotificationBell />
          </div>
          
          {/* Divider */}
          <div className="h-6 w-px bg-slate-200"></div>

          {/* User Profile */}
          <div className="flex items-center gap-2 p-1.5 pr-1 md:pr-3 -my-1.5 rounded-xl transition-all duration-300 border border-transparent shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-200/50 shadow-inner uppercase">
              {(user.name || "S").substring(0, 2)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-700 leading-none mb-1 capitalize whitespace-nowrap">{user.name || "System Admin"}</p>
              <p className="text-[10px] font-medium text-slate-500 leading-none capitalize whitespace-nowrap">{user.role || "Admin"}</p>
            </div>
            
            <button 
              onClick={handleLogout}
              title="Logout"
              className="ml-1 text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Render Impersonation Banner outside header so fixed positioning works correctly relative to viewport */}
      {isImpersonating && (
        <div className="fixed bottom-6 left-6 z-[99999] bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-rose-600/30 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 border border-rose-500/50">
          <div className="flex flex-col">
            <span className="font-bold text-sm">SuperAdmin Active</span>
            <span className="text-[11px] opacity-90">Impersonating: <strong className="capitalize">{user.name}</strong></span>
          </div>
          <button 
            onClick={exitImpersonation}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-white/10 ml-2 shadow-sm"
          >
            Exit Mode
          </button>
        </div>
      )}
    </>
  );
}
