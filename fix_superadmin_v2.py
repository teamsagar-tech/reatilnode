with open('FrontEndV2/src/pages/superadmin/SuperAdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''        <div className="bg-[#1b5e58] text-white font-bold px-4 py-2 border-b-2 border-[#12423d] flex justify-between items-center shadow-sm">
          <span>SuperAdmin Portal - Global Tenant Management</span>
        </div>''',
    '''        <div className="bg-[#1b5e58] text-white font-bold px-4 py-2 border-b-2 border-[#12423d] flex justify-between items-center shadow-sm">
          <span>SuperAdmin Portal - Global Tenant Management</span>
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to log out?")) {
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = '/login';
              }
            }}
            className="text-white hover:text-red-300 transition-colors text-sm underline"
          >
            Log Out
          </button>
        </div>'''
)

with open('FrontEndV2/src/pages/superadmin/SuperAdminDashboard.tsx', 'w') as f:
    f.write(content)
