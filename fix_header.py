import re

with open('FrontEnd/src/components/layout/Header.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'import { LayoutDashboard, Package, ShoppingCart, Users, Settings, ChevronDown, Search, Bell } from "lucide-react";',
    'import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, ChevronDown, Search, Bell } from "lucide-react";'
)

content = content.replace(
    '''  const user = JSON.parse((sessionStorage.getItem('user') || localStorage.getItem('user')) || '{}');
  const isSuperAdmin = user.role === 'superadmin';
  const displayedMenuItems = isSuperAdmin ''',
    '''  const user = JSON.parse((sessionStorage.getItem('user') || localStorage.getItem('user')) || '{}');
  const isSuperAdmin = user.role === 'superadmin';
  const isImpersonating = sessionStorage.getItem('isImpersonating') === 'true';

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/login';
  };

  const exitImpersonation = () => {
    sessionStorage.clear();
    window.location.href = '/dashboard';
  };

  const displayedMenuItems = isSuperAdmin '''
)

content = content.replace(
    '''<header className="h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-6 h-full">''',
    '''<header className="h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-2 sm:px-6 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2 xl:gap-6 h-full">'''
)

content = content.replace(
    '''<span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight hidden sm:block">RetailNode</span>''',
    '''<span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight hidden 2xl:block">RetailNode</span>'''
)

content = content.replace(
    '''className={`flex items-center gap-2 px-3 py-2 mx-1 rounded-lg transition-colors text-[13px] font-bold ${''',
    '''className={`flex items-center gap-1.5 xl:gap-2 px-2 py-2 mx-0.5 xl:mx-1 rounded-lg transition-colors text-[11px] xl:text-[13px] font-bold ${'''
)

content = content.replace(
    '''<Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />''',
    '''<Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />'''
)

content = content.replace(
    '''<div className="hidden xl:block relative group w-64">''',
    '''<div className="hidden 2xl:block relative group w-56">'''
)

content = content.replace(
    '''<div className="flex items-center gap-3 border-l border-slate-200 pl-4 sm:pl-5 cursor-pointer hover:bg-slate-50 p-1.5 -my-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-200/50 shadow-inner uppercase">
            {(user.name || "S").substring(0, 2)}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-slate-700 leading-none mb-1 capitalize">{user.name || "System Admin"}</p>
            <p className="text-xs font-medium text-slate-500 leading-none capitalize">{user.role || "Admin"}</p>
          </div>
        </div>
      </div>
    </header>''',
    '''<div className="flex items-center gap-3 border-l border-slate-200 pl-4 sm:pl-5 p-1.5 -my-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-200/50 shadow-inner uppercase">
            {(user.name || "S").substring(0, 2)}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-slate-700 leading-none mb-1 capitalize">{user.name || "System Admin"}</p>
            <p className="text-xs font-medium text-slate-500 leading-none capitalize">{user.role || "Admin"}</p>
          </div>
          <button 
            onClick={handleLogout}
            title="Logout"
            className="ml-2 text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isImpersonating && (
        <div className="fixed bottom-4 left-4 z-[9999] bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-rose-600/30 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col">
            <span className="font-bold text-sm">SuperAdmin Active</span>
            <span className="text-[11px] opacity-90">Impersonating: <strong className="capitalize">{user.name}</strong></span>
          </div>
          <button 
            onClick={exitImpersonation}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-white/10"
          >
            Exit Mode
          </button>
        </div>
      )}
    </header>'''
)

with open('FrontEnd/src/components/layout/Header.tsx', 'w') as f:
    f.write(content)
