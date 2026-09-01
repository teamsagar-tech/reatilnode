import { useState, useEffect } from "react";
import { ShieldAlert, Plus, Edit2 } from "lucide-react";
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

  const renderModuleConfigV2 = (stateObj: any, setStateFunc: any, allowedModules: any) => {
    return (
      <div className="space-y-4">
        {AVAILABLE_MODULES.map(mod => {
          if (!allowedModules[mod.id]?.enabled) return null;
          const modState = stateObj[mod.id] || {};
          
          return (
            <div key={mod.id} className="bg-[#fcfcd9] border border-[#a29471] p-3">
              <div className="flex items-center gap-2 mb-3 pb-1 border-b border-[#a29471]">
                <input type="checkbox" checked={modState.enabled !== false} onChange={(e) => setStateFunc({...stateObj, [mod.id]: {...modState, enabled: e.target.checked}})} className="rounded" />
                <span className="text-[14px] font-bold">{mod.label} Module</span>
              </div>
              
              {modState.enabled !== false && (
                <div className="pl-6 flex flex-wrap gap-12 text-[13px]">
                  {mod.submodules.map(sub => {
                    const subState = modState[sub.id] || {};
                    return (
                      <div key={sub.id}>
                        <label className="flex items-center gap-1 font-bold mb-2">
                          <input type="checkbox" checked={subState.enabled !== false} onChange={(e) => setStateFunc({...stateObj, [mod.id]: {...modState, [sub.id]: {...subState, enabled: e.target.checked}}})} /> {sub.label}
                        </label>
                        {subState.enabled !== false && (
                          <div className="pl-6 flex flex-col gap-1 text-[12px]">
                            {sub.pages.map(page => {
                              const pagesState = subState.pages || {};
                              return (
                                <label key={page.id} className="flex items-center gap-1">
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
      
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#12423d] pb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#1b5e58]" />
            <h1 className="text-xl font-bold text-[#1b5e58]">Roles & Permissions</h1>
          </div>
          <button onClick={openNewModal} className="flex items-center gap-2 px-4 py-1.5 bg-[#1b5e58] text-white border border-[#12423d] font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0_rgba(0,0,0,0.2)] hover:bg-[#12423d]">
            <Plus className="w-4 h-4" /> Create Role
          </button>
        </div>

        <div className="bg-[#eef5ed] border-2 border-[#12423d] shadow-[4px_4px_0_rgba(0,0,0,0.4)]">
          <div className="bg-[#1b5e58] text-white px-4 py-2 font-bold text-sm border-b-2 border-[#12423d]">
            Active Roles
          </div>
          <div className="p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfcd9] border-b-2 border-[#a29471]">
                  <th className="px-4 py-2 font-bold text-slate-800 text-xs uppercase">Role Name</th>
                  <th className="px-4 py-2 font-bold text-slate-800 text-xs uppercase w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={2} className="px-4 py-4 text-center text-xs font-bold text-slate-500">Loading...</td></tr>
                ) : roles.length === 0 ? (
                  <tr><td colSpan={2} className="px-4 py-4 text-center text-xs font-bold text-slate-500">No custom roles found.</td></tr>
                ) : (
                  roles.map(role => (
                    <tr key={role.id} className="border-b border-slate-200 hover:bg-[#e0efeb]">
                      <td className="px-4 py-3 font-bold text-[#1b5e58] text-sm">{role.name}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => openEditModal(role)} className="text-xs font-bold text-[#1b5e58] underline">Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {editingRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#eef5ed] border-2 border-[#12423d] shadow-[4px_4px_0_rgba(0,0,0,0.4)] w-full max-w-3xl max-h-[90vh] flex flex-col">
              <div className="bg-[#1b5e58] text-white px-4 py-2 font-bold text-sm border-b-2 border-[#12423d] flex justify-between items-center shrink-0">
                <span>{editingRole.id ? 'Edit Role' : 'Create Role'}</span>
                <button onClick={() => setEditingRole(null)} className="text-white hover:text-red-300">X</button>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                <div className="bg-white border border-[#a3c3be] p-3">
                  <label className="block text-xs font-bold text-[#1b5e58] mb-1">Role Name</label>
                  <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g. Cashier" className="w-full px-3 py-1.5 border border-[#1b5e58] text-sm font-bold" />
                </div>
                
                <div>
                  <div className="text-xs font-bold text-[#1b5e58] mb-2 uppercase tracking-wide">Role Permissions</div>
                  {renderModuleConfigV2(rolePermissions, setRolePermissions, firmModules)}
                </div>
              </div>
              
              <div className="p-3 border-t-2 border-[#12423d] bg-[#e0efeb] flex justify-end gap-2 shrink-0">
                <button onClick={() => setEditingRole(null)} className="px-4 py-1.5 bg-white text-[#1b5e58] border border-[#1b5e58] font-bold text-xs uppercase tracking-wider hover:bg-slate-50">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-1.5 bg-[#1b5e58] text-white border border-[#12423d] font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0_rgba(0,0,0,0.2)] hover:bg-[#12423d] disabled:opacity-50">
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
