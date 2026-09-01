import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Building2, Plus, Search, ShieldAlert, Users, Database } from "lucide-react";

interface Firm {
  id: number;
  name: string;
  email: string | null;
  mobile: string | null;
  max_users: number;
  valid_till: string | null;
  max_firms: number;
  is_active: number;
  modules: any;
  created_at: string;
}

export default function SuperAdminDashboard() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [editingFirmId, setEditingFirmId] = useState<number | null>(null);
  const [newFirmName, setNewFirmName] = useState("");
  const [newFirmEmail, setNewFirmEmail] = useState("");
  const [newFirmMobile, setNewFirmMobile] = useState("");
  const [newFirmMaxUsers, setNewFirmMaxUsers] = useState(1);
  const [newFirmValidTill, setNewFirmValidTill] = useState("");
  const [newFirmMaxFirms, setNewFirmMaxFirms] = useState(1);
  const [newFirmModules, setNewFirmModules] = useState({
    inventory: { enabled: true, basic: true, advance: false },
    sales: { enabled: true, basic: true, advance: true },
    purchase: { enabled: true, invoices: true },
    hr: { enabled: false },
    reports: { enabled: true, basic: true, advance: false }
  });
  const [addingFirm, setAddingFirm] = useState(false);

  useEffect(() => {
    fetchFirms();
  }, []);

  const fetchFirms = async () => {
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/firms`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to fetch firms");
      }
      const data = await response.json();
      setFirms(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirmName) return;

    setAddingFirm(true);
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const url = editingFirmId 
        ? `${import.meta.env.VITE_API_URL}/api/firms/${editingFirmId}`
        : `${import.meta.env.VITE_API_URL}/api/firms`;
      
      const method = editingFirmId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: newFirmName,
          email: newFirmEmail,
          mobile: newFirmMobile,
          max_users: newFirmMaxUsers,
          valid_till: newFirmValidTill || null,
          max_firms: newFirmMaxFirms,
          modules: newFirmModules
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingFirmId ? "update" : "create"} firm`);
      }
      
      fetchFirms(); // Reload to get updated list
      closeModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAddingFirm(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    if (!window.confirm("Are you sure you want to change the status of this tenant?")) return;
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/firms/${id}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to change status");
      
      const data = await response.json();
      setFirms(firms.map(f => f.id === id ? { ...f, is_active: data.is_active } : f));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditModal = (firm: Firm) => {
    setEditingFirmId(firm.id);
    setNewFirmName(firm.name);
    setNewFirmEmail(firm.email || "");
    setNewFirmMobile(firm.mobile || "");
    setNewFirmMaxUsers(firm.max_users);
    setNewFirmValidTill(firm.valid_till ? firm.valid_till.split('T')[0] : "");
    setNewFirmMaxFirms(firm.max_firms);
    setNewFirmModules(firm.modules || {
      inventory: { enabled: true, basic: true, advance: false },
      sales: { enabled: true, basic: true, advance: true },
      purchase: { enabled: true, invoices: true },
      hr: { enabled: false },
      reports: { enabled: true, basic: true, advance: false }
    });
    setShowAddModal(true);
  };

  const openAddModal = () => {
    setEditingFirmId(null);
    setNewFirmName("");
    setNewFirmEmail("");
    setNewFirmMobile("");
    setNewFirmMaxUsers(1);
    setNewFirmValidTill("");
    setNewFirmMaxFirms(1);
    setNewFirmModules({
      inventory: { enabled: true, basic: true, advance: false },
      sales: { enabled: true, basic: true, advance: true },
      purchase: { enabled: true, invoices: true },
      hr: { enabled: false },
      reports: { enabled: true, basic: true, advance: false }
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
  };

  return (
    <>
      <Helmet>
        <title>SuperAdmin | RetailNode</title>
      </Helmet>

      <div className="flex flex-col h-[calc(100vh-6rem)] font-sans w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-rose-500" />
              SuperAdmin Portal
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Manage global system settings and tenants across the entire SaaS infrastructure.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm shadow-emerald-600/30 font-bold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Tenant
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-indigo-100">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-slate-500 font-semibold text-sm mb-1">Total Active Tenants</h3>
            <p className="text-3xl font-black text-slate-800 tracking-tight">{firms.length}</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-slate-500 font-semibold text-sm mb-1">Database Shards</h3>
            <p className="text-3xl font-black text-slate-800 tracking-tight">1 (Shared DB)</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-rose-100">
                <ShieldAlert className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <h3 className="text-slate-500 font-semibold text-sm mb-1">System Health</h3>
            <p className="text-xl font-black text-emerald-600 tracking-tight">All Systems Operational</p>
          </div>
        </div>

        {/* Tenants List */}
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden flex-1 min-h-0">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Tenant (Firm) Management</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="Search tenants..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600">Firm ID</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Company Name</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Email</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Valid Till</th>
                  <th className="px-6 py-4 font-bold text-slate-600">Created At</th>
                  <th className="px-6 py-4 font-bold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">Loading tenants...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-rose-500 font-medium">{error}</td>
                  </tr>
                ) : firms.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">No tenants found.</td>
                  </tr>
                ) : (
                  firms.map((firm) => (
                    <tr key={firm.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">#{firm.id}</td>
                      <td className="px-6 py-4 font-bold text-indigo-600">
                        <div className="flex items-center gap-2">
                          <Link to={`/superadmin/firms/${firm.id}/users`} className="hover:underline hover:text-indigo-800 transition-colors">
                            {firm.name}
                          </Link>
                          {!firm.is_active && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">Suspended</span>
                          )}
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 mt-0.5">Users: {firm.max_users} | Max Firms: {firm.max_firms}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{firm.email || '-'}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {firm.valid_till ? new Date(firm.valid_till).toLocaleDateString() : 'Lifetime'}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{new Date(firm.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openEditModal(firm)}
                          className="text-sm font-semibold text-slate-500 hover:text-slate-800 mr-4"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(firm.id)}
                          className={`text-sm font-semibold ${firm.is_active ? 'text-rose-500 hover:text-rose-700' : 'text-emerald-500 hover:text-emerald-700'}`}
                        >
                          {firm.is_active ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Register New Tenant</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
              </div>
              <form onSubmit={handleSaveFirm} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Company / Firm Name</label>
                  <input
                    type="text"
                    required
                    value={newFirmName}
                    onChange={(e) => setNewFirmName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Enter firm name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email ID</label>
                    <input
                      type="email"
                      value={newFirmEmail}
                      onChange={(e) => setNewFirmEmail(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="owner@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Mobile No</label>
                    <input
                      type="tel"
                      value={newFirmMobile}
                      onChange={(e) => setNewFirmMobile(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="+91..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Valid Till</label>
                    <input
                      type="date"
                      value={newFirmValidTill}
                      onChange={(e) => setNewFirmValidTill(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">No of Users Allowed</label>
                    <input
                      type="number"
                      min="1"
                      value={newFirmMaxUsers}
                      onChange={(e) => setNewFirmMaxUsers(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">No of Firms Allowed</label>
                  <input
                    type="number"
                    min="1"
                    value={newFirmMaxFirms}
                    onChange={(e) => setNewFirmMaxFirms(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="e.g. 1"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Single owner can manage multiple firms.</p>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingFirm}
                    className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50"
                  >
                    {addingFirm ? "Creating..." : "Create Tenant"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
