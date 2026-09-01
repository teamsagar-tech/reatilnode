with open('FrontEnd/src/components/layout/Header.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Inventory", icon: Package, path: "/inventory" },
    { name: "Sales", icon: ShoppingCart, path: "/sales" },
    { name: "Customers", icon: Users, path: "/customers" },
  ];

  const user = JSON.parse((sessionStorage.getItem('user') || localStorage.getItem('user')) || '{}');
  const isImpersonating = sessionStorage.getItem('isImpersonating') === 'true';''',
    '''  const user = JSON.parse((sessionStorage.getItem('user') || localStorage.getItem('user')) || '{}');
  const isImpersonating = sessionStorage.getItem('isImpersonating') === 'true';

  const modules = user?.firm_modules || {};
  const perms = user?.user_permissions || modules;

  const check = (mod: string) => {
    if (modules[mod]?.enabled === false) return false;
    if (perms[mod]?.enabled === false) return false;
    return true;
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", show: true },
    { name: "Inventory", icon: Package, path: "/inventory", show: check('inventory') },
    { name: "Sales", icon: ShoppingCart, path: "/sales", show: check('sales') },
    { name: "Purchase", icon: ShoppingCart, path: "/purchase", show: check('purchase') },
    { name: "Customers", icon: Users, path: "/customers", show: true },
    { name: "Settings", icon: Settings, path: "/settings", show: true },
    { name: "Support", icon: Settings, path: "/support/tickets", show: true },
  ].filter(item => item.show);'''
)

with open('FrontEnd/src/components/layout/Header.tsx', 'w') as f:
    f.write(content)
