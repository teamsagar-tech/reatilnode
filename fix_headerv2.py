import re

with open('FrontEndV2/src/components/layout/Header.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'import { Bell, LayoutDashboard, Package, ShoppingCart, Users, Settings, ChevronDown } from "lucide-react";',
    'import { Bell, LayoutDashboard, Package, ShoppingCart, Users, Settings, ChevronDown, LogOut } from "lucide-react";'
)

content = content.replace(
    '''  const menuItems = [''',
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

  const menuItems = ['''
)

content = content.replace(
    '''        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 sm:pl-6 cursor-pointer hover:bg-slate-50 p-1.5 -my-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            AK
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-slate-700 leading-none mb-1">Arjun Kapoor</p>
            <p className="text-xs text-slate-500 leading-none">Admin</p>
          </div>
        </div>
      </div>
    </header>''',
    '''        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 sm:pl-6 p-1.5 -my-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
            {(user.name || "A").substring(0, 2)}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-slate-700 leading-none mb-1 capitalize">{user.name || "Admin"}</p>
            <p className="text-xs text-slate-500 leading-none capitalize">{user.role || "Admin"}</p>
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

with open('FrontEndV2/src/components/layout/Header.tsx', 'w') as f:
    f.write(content)
