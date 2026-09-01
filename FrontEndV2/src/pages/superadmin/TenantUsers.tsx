import { useState, useEffect } from "react";
import { ArrowLeft, Users as UsersIcon, Settings, ShieldAlert, Save, LogIn, Key } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Roles from "../settings/Users/Roles";

interface User {
  id: number;
  name: string;
  email: string | null;
  mobile_no: string | null;
  role: string;
  role_id?: number | null;
  is_totp_enabled: number;
  created_at: string;
}


const AVAILABLE_MODULES = [
  {
    id: 'masters',
    label: 'Masters',
    submodules: [
      {
        id: 'inventory',
        label: 'Inventory Masters',
        pages: [
          { id: 'itemMaster', label: 'Item Master' },
          { id: 'brandMaster', label: 'Brand Master' },
          { id: 'categoryMaster', label: 'Category Master' },
          { id: 'subCategory', label: 'SubCategory' },
          { id: 'department', label: 'Department' },
          { id: 'section', label: 'Section' },
          { id: 'style', label: 'Style' },
          { id: 'subStyle', label: 'Sub-Style' },
          { id: 'designMaster', label: 'Design Master' },
          { id: 'sizeMaster', label: 'Size Master' },
          { id: 'colorMaster', label: 'Color Master' },
          { id: 'material', label: 'Material' },
          { id: 'hsnSac', label: 'HSN/SAC' }
        ]
      },
      {
        id: 'accounting',
        label: 'Accounting Masters',
        pages: [
          { id: 'partyMaster', label: 'Party Master' },
          { id: 'customerMaster', label: 'Customer Master' },
          { id: 'transporter', label: 'Transporter' },
          { id: 'hundekari', label: 'Hundekari' },
          { id: 'commission', label: 'Commission' }
        ]
      },
      {
        id: 'config',
        label: 'Configuration',
        pages: [
          { id: 'locationMaster', label: 'Location Master' },
          { id: 'chargesType', label: 'Charges Type' },
          { id: 'itemPercentage', label: 'Item Percentage' }
        ]
      }
    ]
  },
  {
    id: 'inventory',
    label: 'Inventory',
    submodules: [
      {
        id: 'basic',
        label: 'Basic',
        pages: [
          { id: 'stockTransfer', label: 'Stock Transfer' }
        ]
      },
      {
        id: 'advance',
        label: 'Advanced',
        pages: [
          { id: 'purchaseInvoice', label: 'Purchase Invoice' }
        ]
      }
    ]
  },
  {
    id: 'sales',
    label: 'Sales',
    submodules: [
      {
        id: 'basic',
        label: 'Basic',
        pages: [
          { id: 'pos', label: 'POS' },
          { id: 'drafts', label: 'Drafts' },
          { id: 'receipts', label: 'Receipts' }
        ]
      },
      {
        id: 'advance',
        label: 'Advanced',
        pages: [
          { id: 'salesReturn', label: 'Sales Return' },
          { id: 'approvals', label: 'Approvals' }
        ]
      }
    ]
  },
  {
    id: 'purchase',
    label: 'Purchase',
    submodules: [
      {
        id: 'basic',
        label: 'Basic',
        pages: [
          { id: 'purchaseOrder', label: 'Purchase Order' },
          { id: 'purchaseInvoiceList', label: 'Purchase Invoice List' }
        ]
      },
      {
        id: 'advance',
        label: 'Advanced',
        pages: [
          { id: 'csvPurchase', label: 'CSV Purchase' },
          { id: 'transportPayment', label: 'Transport Payment' },
          { id: 'returns', label: 'Returns' }
        ]
      }
    ]
  },
  {
    id: 'logistics',
    label: 'Logistics',
    submodules: [
      {
        id: 'basic',
        label: 'Basic',
        pages: [
          { id: 'lrPending', label: 'LR Pending' },
          { id: 'inwardOverview', label: 'Inward Overview' }
        ]
      },
      {
        id: 'advance',
        label: 'Advanced',
        pages: [
          { id: 'inwardScanning', label: 'Inward Scanning' },
          { id: 'bulkTransit', label: 'Bulk Transit In' }
        ]
      }
    ]
  }
];

const renderModuleConfigV2 = (stateObj: any, setStateFunc: any, isFirmLevel: any, allowedModules: any = null) => {
  return (
    <div className="space-y-4">
      {AVAILABLE_MODULES.map(mod => {
        if (!isFirmLevel && allowedModules && !allowedModules[mod.id]?.enabled) return null;
        const modState = stateObj[mod.id] || {};
        
        return (
          <div key={mod.id} className="bg-[#fcfcd9] border border-[#a29471] p-3">
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-[#a29471]">
              <input 
                type="checkbox" 
                checked={modState.enabled !== false} 
                onChange={(e) => setStateFunc({...stateObj, [mod.id]: {...modState, enabled: e.target.checked}})} 
                className="rounded" 
              />
              <span className="text-[14px] font-bold">{mod.label} Module</span>
            </div>
            
            {modState.enabled !== false && (
              <div className="pl-6 flex flex-wrap gap-12 text-[13px]">
                {mod.submodules.map(sub => {
                  const subState = modState[sub.id] || {};
                  return (
                    <div key={sub.id}>
                      <label className="flex items-center gap-1 font-bold mb-2">
                        <input 
                          type="checkbox" 
                          checked={subState.enabled !== false} 
                          onChange={(e) => setStateFunc({...stateObj, [mod.id]: {...modState, [sub.id]: {...subState, enabled: e.target.checked}}})} 
                        /> 
                        {sub.label}
                      </label>
                      {subState.enabled !== false && (
                        <div className="pl-6 flex flex-col gap-1 text-[12px]">
                          {sub.pages.map(page => {
                            const pagesState = subState.pages || {};
                            return (
                              <label key={page.id} className="flex items-center gap-1">
                                <input 
                                  type="checkbox" 
                                  checked={pagesState[page.id] !== false} 
                                  onChange={(e) => setStateFunc({
                                    ...stateObj, 
                                    [mod.id]: {
                                      ...modState, 
                                      [sub.id]: {
                                        ...subState, 
                                        pages: {
                                          ...pagesState, 
                                          [page.id]: e.target.checked
                                        }
                                      }
                                    }
                                  })} 
                                /> 
                                {page.label}
                              </label>
                            );
                          })}
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
    </div>
  );
};

export default function TenantUsers() {
  const { id } = useParams<{ id: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'users' | 'modules' | 'roles'>('users');
  
  const [firmModules, setFirmModules] = useState<any>({
    inventory: { enabled: true, basic: { enabled: true, pages: { itemMaster: true, categoryMaster: true } }, advance: { enabled: false, pages: { barcode: false, stockTransfer: false } } },
    sales: { enabled: true, basic: { enabled: true, pages: { pos: true } }, advance: { enabled: true, pages: { salesReturn: true, drafts: true } } }
  });
  const [saving, setSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<any>({});
  const [overrideExpiresAt, setOverrideExpiresAt] = useState<string>('');
  
  const [passwordUser, setPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  
  const handleEditUser = async (user: User) => {
    setEditingUser(user);
    setUserPermissions({});
    setOverrideExpiresAt('');
  };
  
  const saveUserPermissions = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${editingUser.id}/permissions`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: userPermissions, expires_at: overrideExpiresAt || null })
      });
      if (!res.ok) throw new Error("Failed to save user permissions");
      alert("User permissions saved");
      setEditingUser(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };
  
  const handleChangePassword = async () => {
    if (!passwordUser || !newPassword) return;
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${passwordUser.id}/password`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword })
      });
      if (!res.ok) throw new Error("Failed to change password");
      alert("Password updated successfully");
      setPasswordUser(null);
      setNewPassword("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const currentUserStr = (sessionStorage.getItem('user') || localStorage.getItem('user'));
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const isSuperAdmin = currentUser?.role === 'superadmin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
        
        // Fetch Users
        const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/firms/${id}/users`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        const usersData = await usersRes.json();
        setUsers(usersData);


        // Fetch Roles
        const rolesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/roles${isSuperAdmin ? `?firm_id=${id}` : ''}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          setRoles(rolesData);
        }

        // Fetch Firm Modules (if Superadmin)
        if (isSuperAdmin) {
          const firmRes = await fetch(`${import.meta.env.VITE_API_URL}/api/firms/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (firmRes.ok) {
            const firmData = await firmRes.json();
            if (firmData.modules) {
              setFirmModules(firmData.modules);
            }
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isSuperAdmin]);


  const assignRole = async (userId: number, roleId: string) => {
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      // Actually we don't have an endpoint for just assigning role to a user.
      // Assuming a generic user update or just an alert for now.
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ role_id: roleId })
      });
      if (!res.ok) throw new Error("Failed to update role");
      // Update local state to reflect change
      setUsers(users.map(u => u.id === userId ? { ...u, role_id: parseInt(roleId, 10) || null, role: roles.find(r => r.id === parseInt(roleId, 10))?.name || u.role } : u));
  
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleImpersonate = async (userId: number) => {
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/impersonate/${userId}`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Failed to impersonate user");
      
      const data = await res.json();
      
      // Open new tab
      const url = new URL('/impersonate-auth', window.location.origin);
      url.searchParams.set('token', data.token);
      url.searchParams.set('user', encodeURIComponent(JSON.stringify(data.user)));
      window.open(url.toString(), '_blank');
      
    } catch (err: any) {
      alert(err.message);
    }
  };

  const saveModules = async () => {
    setSaving(true);
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/firms/${id}/modules`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ modules: firmModules })
      });
      if (!res.ok) throw new Error("Failed to save modules");
      alert("Firm modules updated successfully");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Tenant Management | RetailNode</title>
      </Helmet>
      
      <div className="p-4 h-full bg-[#fcfaf2]">
        <div className="flex items-center justify-between mb-4">
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
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 font-bold text-sm mb-4">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1 border-2 border-[#12423d] font-bold text-sm shadow-[2px_2px_0_rgba(0,0,0,0.2)] transition-all ${activeTab === 'users' ? 'bg-[#1b5e58] text-white' : 'bg-[#e0efeb] text-[#1b5e58]'}`}
          >
            Users List
          </button>
          {isSuperAdmin && (
            <>
              <button 
                onClick={() => setActiveTab('modules')}
                className={`px-4 py-1 border-2 border-[#12423d] font-bold text-sm shadow-[2px_2px_0_rgba(0,0,0,0.2)] transition-all ${activeTab === 'modules' ? 'bg-[#1b5e58] text-white' : 'bg-[#e0efeb] text-[#1b5e58]'}`}
              >
                Firm Module Access
              </button>
              <button 
                onClick={() => setActiveTab('roles')}
                className={`px-4 py-1 border-2 border-[#12423d] font-bold text-sm shadow-[2px_2px_0_rgba(0,0,0,0.2)] transition-all ${activeTab === 'roles' ? 'bg-[#1b5e58] text-white' : 'bg-[#e0efeb] text-[#1b5e58]'}`}
              >
                Firm Roles
              </button>
            </>
          )}
        </div>

        {activeTab === 'users' && (
          <div className="bg-[#eef5ed] border-2 border-[#12423d] shadow-[4px_4px_10px_rgba(0,0,0,0.4)]">
            <div className="bg-[#1b5e58] text-white px-4 py-2 font-bold text-sm border-b-2 border-[#12423d] flex justify-between items-center tracking-wide">
              <span>User Management</span>
            </div>
            <div className="p-3">
              <div className="border border-[#a3c3be] bg-white max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-[#e0efeb] sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 font-bold text-[#1b5e58] border-b-2 border-r border-[#a3c3be] w-16 text-center">ID</th>
                      <th className="px-4 py-2 font-bold text-[#1b5e58] border-b-2 border-r border-[#a3c3be]">Name</th>
                      <th className="px-4 py-2 font-bold text-[#1b5e58] border-b-2 border-r border-[#a3c3be]">Email</th>
                      <th className="px-4 py-2 font-bold text-[#1b5e58] border-b-2 border-r border-[#a3c3be]">Role</th>
                      <th className="px-4 py-2 font-bold text-[#1b5e58] border-b-2 border-[#a3c3be]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500 font-bold bg-[#fcfaf2]">Loading...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500 font-bold bg-[#fcfaf2]">No records found.</td></tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-[#e0efeb] transition-colors border-b border-[#a3c3be] last:border-0">
                          <td className="px-4 py-2 font-bold text-slate-900 border-r border-[#a3c3be] w-16 text-center">{user.id}</td>
                          <td className="px-4 py-2 font-bold text-[#1b5e58] border-r border-[#a3c3be]">{user.name}</td>
                          <td className="px-4 py-2 text-slate-800 font-medium border-r border-[#a3c3be]">{user.email || '-'}</td>
                          
                          <td className="px-4 py-2 font-bold text-slate-800 border-r border-[#a3c3be] uppercase text-xs">
                            <select 
                              className="bg-transparent border-b border-[#1b5e58] outline-none cursor-pointer"
                              value={user.role_id || ''}
                              onChange={(e) => assignRole(user.id, e.target.value)}
                            >
                              <option value="">{user.role}</option>
                              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-2 text-center text-xs font-bold text-[#1b5e58] flex justify-center gap-3">
                            <span onClick={() => handleEditUser(user)} className="underline cursor-pointer hover:text-[#12423d] flex items-center gap-1">
                              <Settings className="w-3 h-3" /> Edit
                            </span>
                            <span onClick={() => setPasswordUser(user)} className="underline cursor-pointer hover:text-[#12423d] flex items-center gap-1">
                              <Key className="w-3 h-3" /> Password
                            </span>
                            <span onClick={() => handleImpersonate(user.id)} className="underline cursor-pointer hover:text-[#12423d] flex items-center gap-1">
                              <LogIn className="w-3 h-3" /> Login As
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modules' && isSuperAdmin && (
          <div className="bg-[#eef5ed] border-2 border-[#12423d] shadow-[4px_4px_10px_rgba(0,0,0,0.4)]">
            <div className="bg-[#1b5e58] text-white px-4 py-2 font-bold text-sm border-b-2 border-[#12423d] flex justify-between items-center tracking-wide">
              <span>Firm Page-Level Access</span>
              <button onClick={saveModules} disabled={saving} className="bg-[#e0efeb] text-[#1b5e58] px-3 py-0.5 text-xs uppercase tracking-widest border border-[#a3c3be] hover:bg-white disabled:opacity-50">
                {saving ? "Saving..." : "Save Modules"}
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {renderModuleConfigV2(firmModules, setFirmModules, true)}
            </div>
          </div>
        )}

        {activeTab === 'roles' && isSuperAdmin && (
          <div className="bg-[#eef5ed] border-2 border-[#12423d] shadow-[4px_4px_10px_rgba(0,0,0,0.4)] p-4">
             <Roles firmId={id} firmModules={firmModules} />
          </div>
        )}


        {/* Edit User Permissions Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#eef5ed] border-2 border-[#12423d] shadow-[4px_4px_0_rgba(0,0,0,0.4)] w-full max-w-lg">
              <div className="bg-[#1b5e58] text-white px-4 py-2 font-bold text-sm border-b-2 border-[#12423d] flex justify-between items-center">
                <span>Edit User: {editingUser.name}</span>
                <button onClick={() => setEditingUser(null)} className="text-white hover:text-red-300">X</button>
              </div>
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">

                <div className="bg-[#fcfcd9] border border-[#a29471] p-3 mb-4">
                  <div className="text-xs font-bold text-[#1b5e58] mb-2">Temporary Override (Optional)</div>
                  <input 
                    type="datetime-local" 
                    value={overrideExpiresAt} 
                    onChange={(e) => setOverrideExpiresAt(e.target.value)} 
                    className="w-full px-2 py-1 border border-[#a29471] text-xs font-bold"
                  />
                  <div className="text-[10px] text-slate-600 mt-1">If set, these exact permissions will fully replace the user's role until this time expires. Leave blank for a permanent override.</div>
                </div>

                {renderModuleConfigV2(userPermissions, setUserPermissions, false, firmModules)}
              </div>
              <div className="p-3 border-t-2 border-[#12423d] bg-[#e0efeb] flex justify-end gap-2">
                <button onClick={() => setEditingUser(null)} className="px-4 py-1.5 bg-white text-[#1b5e58] border border-[#1b5e58] font-bold text-xs uppercase tracking-wider hover:bg-slate-50">Cancel</button>
                <button onClick={saveUserPermissions} disabled={saving} className="px-4 py-1.5 bg-[#1b5e58] text-white border border-[#12423d] font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0_rgba(0,0,0,0.2)] hover:bg-[#12423d] disabled:opacity-50">
                  {saving ? "Saving..." : "Save Access"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {passwordUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#eef5ed] border-2 border-[#12423d] shadow-[4px_4px_0_rgba(0,0,0,0.4)] w-full max-w-sm">
              <div className="bg-[#1b5e58] text-white px-4 py-2 font-bold text-sm border-b-2 border-[#12423d] flex justify-between items-center">
                <span>Change Password: {passwordUser.name}</span>
                <button onClick={() => { setPasswordUser(null); setNewPassword(""); }} className="text-white hover:text-red-300">X</button>
              </div>
              <div className="p-4">
                <div className="text-xs font-bold text-[#1b5e58] mb-2">New Password</div>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#a29471] text-sm font-bold bg-white outline-none focus:border-[#1b5e58]"
                  placeholder="Enter new password"
                />
              </div>
              <div className="p-3 border-t-2 border-[#12423d] bg-[#e0efeb] flex justify-end gap-2">
                <button onClick={() => { setPasswordUser(null); setNewPassword(""); }} className="px-4 py-1.5 bg-white text-[#1b5e58] border border-[#1b5e58] font-bold text-xs uppercase tracking-wider hover:bg-slate-50">Cancel</button>
                <button onClick={handleChangePassword} disabled={saving} className="px-4 py-1.5 bg-[#1b5e58] text-white border border-[#12423d] font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0_rgba(0,0,0,0.2)] hover:bg-[#12423d] disabled:opacity-50">
                  {saving ? "Saving..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
