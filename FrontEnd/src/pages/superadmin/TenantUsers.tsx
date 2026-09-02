import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users as UsersIcon, Settings, ShieldAlert, Save, LogIn, Key } from "lucide-react";
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

const renderModuleConfig = (stateObj: any, setStateFunc: any, isFirmLevel: any, allowedModules: any = null) => {
  return (
    <div className="space-y-4">
      {AVAILABLE_MODULES.map(mod => {
        // If user-level editing, check if firm has it enabled
        if (!isFirmLevel && allowedModules && !allowedModules[mod.id]?.enabled) return null;
        
        const modState = stateObj[mod.id] || {};
        
        return (
          <div key={mod.id} className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <input 
                type="checkbox" 
                checked={modState.enabled !== false} 
                onChange={(e) => setStateFunc({...stateObj, [mod.id]: {...modState, enabled: e.target.checked}})} 
                className="w-4 h-4 rounded border-slate-300" 
              />
              <span className="font-bold text-slate-800">{mod.label} Module</span>
            </div>
            
            {modState.enabled !== false && (
              <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {mod.submodules.map(sub => {
                  const subState = modState[sub.id] || {};
                  
                  return (
                    <div key={sub.id}>
                      <div className="flex items-center gap-2 mb-2">
                        <input 
                          type="checkbox" 
                          checked={subState.enabled !== false} 
                          onChange={(e) => setStateFunc({...stateObj, [mod.id]: {...modState, [sub.id]: {...subState, enabled: e.target.checked}}})} 
                          className="w-4 h-4 rounded border-slate-300" 
                        />
                        <span className="font-bold text-slate-700 text-sm">{sub.label}</span>
                      </div>
                      
                      {subState.enabled !== false && (
                        <div className="pl-6 space-y-2">
                          {sub.pages.map(page => {
                            const pagesState = subState.pages || {};
                            return (
                              <label key={page.id} className="flex items-center gap-2 text-sm text-slate-600">
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
    // Ideally fetch the user's current override, for now start empty
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
      setUsers(users.map(u => {
        if (u.id !== userId) return u;
        let newRoleId: number | null = null;
        let newRoleName = u.role;
        if (roleId === 'admin' || roleId === 'user' || roleId === 'superadmin') {
          newRoleName = roleId;
        } else {
          newRoleId = parseInt(roleId, 10);
          newRoleName = roles.find(r => r.id === newRoleId)?.name || u.role;
        }
        return { ...u, role_id: newRoleId, role: newRoleName };
      }));
  
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
        <title>Tenant Users | RetailNode</title>
      </Helmet>
      
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to={isSuperAdmin ? "/superadmin" : "/dashboard"} className="p-2 bg-white hover:bg-slate-50 text-slate-500 rounded-full shadow-sm border border-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                <UsersIcon className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tenant Management (#{id})</h1>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1 ml-14">Manage users and deep page-level access.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl font-medium">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200 mt-6">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Users List
          </button>
          {isSuperAdmin && (
            <>
              <button 
                onClick={() => setActiveTab('modules')}
                className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'modules' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Firm Module Access
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('roles')}
                className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'roles' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Firm Roles
                </div>
              </button>
            </>
          )}
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                    <th className="px-6 py-4 font-semibold">User ID</th>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium">Loading users...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium">No users found.</td></tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">#{user.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                        <td className="px-6 py-4 font-medium text-slate-600">{user.email || '-'}</td>
                        <td className="px-6 py-4">
                          
                          <select 
                            className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded-full outline-none cursor-pointer"
                            value={user.role_id || user.role || ''}
                            onChange={(e) => assignRole(user.id, e.target.value)}
                          >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <optgroup label="Custom Roles">
                              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </optgroup>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button onClick={() => handleEditUser(user)} className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800">
                              <Settings className="w-3 h-3" /> Edit
                            </button>
                            <button onClick={() => setPasswordUser(user)} className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800">
                              <Key className="w-3 h-3" /> Password
                            </button>
                            <button onClick={() => handleImpersonate(user.id)} className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800">
                              <LogIn className="w-3 h-3" /> Login As
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'modules' && isSuperAdmin && (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Firm Page-Level Access</h3>
                <p className="text-sm text-slate-500">Configure exact pages this firm is allowed to access.</p>
              </div>
              <button 
                onClick={saveModules}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Modules"}
              </button>
            </div>

            <div className="space-y-4">
              {renderModuleConfig(firmModules, setFirmModules, true)}
            </div>
          </div>
        )}

        {activeTab === 'roles' && isSuperAdmin && (
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden p-6">
             <Roles firmId={id} firmModules={firmModules} />
          </div>
        )}


        {/* Edit User Permissions Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Edit Permissions: {editingUser.name}</h3>
                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">Close</button>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                <p className="text-sm text-slate-600 font-medium">Configure page-level access for this specific user. Only modules enabled for your Firm are available.</p>
              </div>
              

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                <h4 className="font-bold text-slate-800 text-sm mb-2">Temporary Override (Optional)</h4>
                <p className="text-xs text-slate-600 mb-2">If set, these exact permissions will fully replace the user's role until this time expires. Leave blank for a permanent override.</p>
                <input 
                  type="datetime-local" 
                  value={overrideExpiresAt} 
                  onChange={(e) => setOverrideExpiresAt(e.target.value)} 
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto p-1">
                {renderModuleConfig(userPermissions, setUserPermissions, false, firmModules)}
              </div>
              
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button onClick={() => setEditingUser(null)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={saveUserPermissions} disabled={saving} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : "Save User Access"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {passwordUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Change Password: {passwordUser.name}</h3>
                <button onClick={() => { setPasswordUser(null); setNewPassword(""); }} className="text-slate-400 hover:text-slate-600">Close</button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="Enter new password"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button onClick={() => { setPasswordUser(null); setNewPassword(""); }} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleChangePassword} disabled={saving} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50">
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
