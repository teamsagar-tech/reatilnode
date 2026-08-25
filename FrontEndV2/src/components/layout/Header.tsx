import { Link, useLocation } from "react-router-dom";
import { Bell, LayoutDashboard, Package, ShoppingCart, Users, Settings, ChevronDown } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { 
      name: "Inventory", 
      icon: Package, 
      path: "/inventory",
      submenu: [
        { 
          name: "Stock Levels", 
          path: "/inventory/stock",
          nestedSubmenu: [
            { name: "All Warehouses", path: "/inventory/stock/all" },
            { name: "Main Warehouse", path: "/inventory/stock/main" },
            { name: "Store Fronts", path: "/inventory/stock/stores" },
          ]
        },
        { name: "Products", path: "/products" },
        { name: "Purchase Invoices", path: "/purchase_invoice/new" },
        { name: "Purchase Orders", path: "/purchase_order/new" },
        { name: "Stock Adjustment", path: "/inventory/adjust" },
        { name: "Suppliers", path: "/inventory/suppliers" },
      ]
    },
    { 
      name: "Sales", 
      icon: ShoppingCart, 
      path: "/sales",
      submenu: [
        { name: "Point of Sale (POS)", path: "/sales/pointofsales" },
        { 
          name: "Invoices", 
          path: "/sales/invoices",
          nestedSubmenu: [
            { name: "All Invoices", path: "/sales/invoices/all" },
            { name: "Drafts", path: "/sales/invoices/drafts" },
            { name: "Overdue", path: "/sales/invoices/overdue" },
          ]
        },
        { name: "Quotations", path: "/sales/quotations" },
        { name: "Returns", path: "/sales/returns" },
      ]
    },
    { 
      name: "Customers", 
      icon: Users, 
      path: "/customers",
      submenu: [
        { name: "Retail Customers", path: "/customers/retail" },
        { name: "Wholesale (B2B)", path: "/customers/b2b" },
      ]
    },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        {/* Logo - Increased Size */}
        <Link to="/dashboard" className="flex items-center hover:opacity-90 transition-opacity">
          <img src="/logo.svg" alt="RetailNode" className="h-9 w-auto" />
        </Link>
        
        {/* Desktop Navigation with Multi-level dropdowns */}
        <nav className="hidden lg:flex items-center space-x-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const hasSubmenu = !!item.submenu;
            
            return (
              <div key={item.name} className="relative group/main">
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-semibold ${
                    active 
                      ? "bg-primary/10 text-primary" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                  {hasSubmenu && <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover/main:rotate-180 transition-transform duration-200" />}
                </Link>

                {/* Dropdown Menu (Level 2) */}
                {hasSubmenu && (
                  <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover/main:opacity-100 group-hover/main:visible transition-all duration-200 z-50">
                    <div className="w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 flex flex-col">
                      {item.submenu!.map((subItem) => {
                        const hasNested = !!subItem.nestedSubmenu;
                        return (
                          <div key={subItem.name} className="relative group/sub">
                            <Link
                              to={subItem.path}
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                            >
                              {subItem.name}
                              {hasNested && <ChevronDown className="w-3.5 h-3.5 opacity-50 -rotate-90" />}
                            </Link>

                            {/* Nested Dropdown Menu (Level 3) */}
                            {hasNested && (
                              <div className="absolute left-full top-0 pl-1 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 z-50">
                                <div className="w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 flex flex-col">
                                  {subItem.nestedSubmenu!.map((nestedItem) => (
                                    <Link
                                      key={nestedItem.name}
                                      to={nestedItem.path}
                                      className="px-4 py-2 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                                    >
                                      {nestedItem.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 sm:pl-6 cursor-pointer hover:bg-slate-50 p-1.5 -my-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            AK
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-slate-700 leading-none mb-1">Arjun Kapoor</p>
            <p className="text-xs text-slate-500 leading-none">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
