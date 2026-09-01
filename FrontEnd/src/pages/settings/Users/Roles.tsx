import { useState, useEffect } from "react";
import { ShieldAlert, Plus, Edit2, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

const AVAILABLE_MODULES = [
  { id: 'inventory', label: 'Inventory', submodules: [ { id: 'basic', label: 'Basic', pages: [ { id: 'itemMaster', label: 'Item Master' }, { id: 'categoryMaster', label: 'Category Master' }, { id: 'brandMaster', label: 'Brand Master' }, { id: 'subCategory', label: 'SubCategory' }, { id: 'department', label: 'Department' } ] }, { id: 'advance', label: 'Advanced', pages: [ { id: 'stockTransfer', label: 'Stock Transfer' }, { id: 'purchaseInvoice', label: 'Purchase Invoice' } ] } ] },
  { id: 'sales', label: 'Sales', submodules: [ { id: 'basic', label: 'Basic', pages: [ { id: 'pos', label: 'POS' }, { id: 'drafts', label: 'Drafts' }, { id: 'receipts', label: 'Receipts' } ] }, { id: 'advance', label: 'Advanced', pages: [ { id: 'salesReturn', label: 'Sales Return' }, { id: 'approvals', label: 'Approvals' } ] } ] },
  { id: 'purchase', label: 'Purchase', submodules: [ { id: 'basic', label: 'Basic', pages: [ { id: 'purchaseOrder', label: 'Purchase Order' }, { id: 'purchaseInvoiceList', label: 'Purchase Invoice List' } ] }, { id: 'advance', label: 'Advanced', pages: [ { id: 'csvPurchase', label: 'CSV Purchase' }, { id: 'transportPayment', label: 'Transport Payment' }, { id: 'returns', label: 'Returns' } ] } ] },
  { id: 'logistics', label: 'Logistics', submodules: [ { id: 'basic', label: 'Basic', pages: [ { id: 'lrPending', label: 'LR Pending' }, { id: 'inwardOverview', label: 'Inward Overview' } ] }, { id: 'advance', label: 'Advanced', pages: [ { id: 'inwardScanning', label: 'Inward Scanning' }, { id: 'bulkTransit', label: 'Bulk Transit In' } ] } ] }
];

export default function Roles({ firmId, firmModules: propFirmModules }: { firmId?: string, firmModules?: any }) {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [roleName, setRoleName] = useState("");
  const [rolePermissions, setRolePermissions] = useState<any>({});
  const [saving, setSaving] = useState(false);
  
  const currentUserStr = (sessionStorage.getItem('user') || localStorage.getItem('user'));
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const firmModules = propFirmModules || currentUser?.firm_modules || {};

  const fetchRoles = async () => {
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/roles${firmId ? `?firm_id=${firmId}` : ''}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setRoles(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSave = async () => {
    if (!roleName.trim()) return alert("Role name is required");
    setSaving(true);
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const url = editingRole?.id 
        ? `${import.meta.env.VITE_API_URL}/api/roles/${editingRole.id}`
        : `${import.meta.env.VITE_API_URL}/api/roles`;
        
      const res = await fetch(url, {
        method: editingRole?.id ? "PUT" : "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: roleName, permissions: rolePermissions, firm_id: firmId })
      });
      
      if (!res.ok) throw new Error("Failed to save role");
      setEditingRole(null);
      fetchRoles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const openNewModal = () => {
    setRoleName("");
    setRolePermissions({});
    setEditingRole({ id: null });
  };

  const openEditModal = (role: any) => {
    setRoleName(role.name);
    setRolePermissions(role.permissions || {});
    setEditingRole(role);
  };

  const renderModuleConfig = (stateObj: any, setStateFunc: any, allowedModules: any) => {
    return (
      <div className="space-y-4">
        {AVAILABLE_MODULES.map(mod => {
          if (!allowedModules[mod.id]?.enabled) return null;
          const modState = stateObj[mod.id] || {};
          
          return (
            <div key={mod.id} className="border border-slate-200 rounded-xl p-4 bg-white">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <input type="checkbox" checked={modState.enabled !== false} onChange={(e) => setStateFunc({...stateObj, [mod.id]: {...modState, enabled: e.target.checked}})} className="w-4 h-4 rounded border-slate-300" />
                <span className="font-bold text-slate-800">{mod.label} Module</span>
              </div>
              
              {modState.enabled !== false && (
                <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mod.submodules.map(sub => {
                    const subState = modState[sub.id] || {};
                    return (
                      <div key={sub.id}>
                        <div className="flex items-center gap-2 mb-2">
                          <input type="checkbox" checked={subState.enabled !== false} onChange={(e) => setStateFunc({...stateObj, [mod.id]: {...modState, [sub.id]: {...subState, enabled: e.target.checked}}})} className="w-4 h-4 rounded border-slate-300" />
                          <span className="font-bold text-slate-700 text-sm">{sub.label}</span>
                        </div>
                        {subState.enabled !== false && (
                          <div className="pl-6 space-y-2">
                            {sub.pages.map(page => {
                              const pagesState = subState.pages || {};
                              return (
                                <label key={page.id} className="flex items-center gap-2 text-sm text-slate-600">
                                  <input type="checkbox" checked={pagesState[page.id] !== false} onChange={(e) => setStateFunc({...stateObj, [mod.id]: {...modState, [sub.id]: {...subState, pages: {...pagesState, [page.id]: e.target.checked}}}})} /> {page.label}
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

  return (
    <>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl"><ShieldAlert className="w-6 h-6" /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Roles & Permissions</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">Create custom roles and assign deep access controls.</p>
            </div>
          </div>
          <button onClick={openNewModal} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm shadow-indigo-200">
            <Plus className="w-4 h-4" /> Create Role
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-semibold">Role Name</th>
                <th className="px-6 py-4 font-semibold w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-400 font-medium">Loading roles...</td></tr>
              ) : roles.length === 0 ? (
                <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-400 font-medium">No custom roles found.</td></tr>
              ) : (
                roles.map(role => (
                  <tr key={role.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{role.name}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => openEditModal(role)} className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800"><Edit2 className="w-4 h-4" /> Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {editingRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-xl font-bold text-slate-800">{editingRole.id ? 'Edit Role' : 'Create Role'}</h3>
                <button onClick={() => setEditingRole(null)} className="text-slate-400 hover:text-slate-600">Close</button>
              </div>
              
              <div className="mb-4 shrink-0">
                <label className="block text-sm font-bold text-slate-700 mb-1">Role Name</label>
                <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g. Cashier" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none" />
              </div>
              
              <div className="flex-1 overflow-y-auto p-1 mb-6">
                <h4 className="text-sm font-bold text-slate-700 mb-3">Role Permissions</h4>
                {renderModuleConfig(rolePermissions, setRolePermissions, firmModules)}
              </div>
              
              <div className="shrink-0 pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button onClick={() => setEditingRole(null)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : "Save Role"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
