with open('FrontEndV2/src/pages/superadmin/TenantUsers.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#1b5e58]">Tenant #{id} Management</h1>
            <p className="text-xs font-bold text-slate-500 mt-1">Manage users and deep page-level access.</p>
          </div>
          <Link to={isSuperAdmin ? "/superadmin" : "/dashboard"} className="px-4 py-1.5 bg-[#1b5e58] hover:bg-[#12423d] text-white border-2 border-[#12423d] font-bold text-sm shadow-[2px_2px_0_rgba(0,0,0,0.2)] transition-all">
            Esc: Back
          </Link>
        </div>''',
    '''        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#1b5e58]">Tenant #{id} Management</h1>
            <p className="text-xs font-bold text-slate-500 mt-1">Manage users and deep page-level access.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to={isSuperAdmin ? "/superadmin" : "/dashboard"} className="px-4 py-1.5 bg-[#1b5e58] hover:bg-[#12423d] text-white border-2 border-[#12423d] font-bold text-sm shadow-[2px_2px_0_rgba(0,0,0,0.2)] transition-all">
              Esc: Back
            </Link>
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to log out?")) {
                  sessionStorage.clear();
                  localStorage.clear();
                  window.location.href = '/login';
                }
              }}
              className="text-[#1b5e58] hover:text-red-600 transition-colors text-sm font-bold underline"
            >
              Log Out
            </button>
          </div>
        </div>'''
)

with open('FrontEndV2/src/pages/superadmin/TenantUsers.tsx', 'w') as f:
    f.write(content)
