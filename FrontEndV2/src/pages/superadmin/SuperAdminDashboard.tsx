import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
      
      <div className="flex flex-col h-[calc(100vh-6rem)] font-sans text-[14px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full">
        {/* Header */}
        <div className="bg-[#1b5e58] text-white font-bold px-4 py-2 border-b-2 border-[#12423d] flex justify-between items-center shadow-sm">
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
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 p-2 gap-2 overflow-hidden h-full">
          {/* Main Container */}
          <div className="flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative">
            <div className="p-4 border-b border-[#81a09d] flex justify-between items-center bg-[#eef5ed]">
              <div>
                <h1 className="text-xl font-bold text-[#12423d] tracking-wide">Tenants List</h1>
                <p className="text-xs font-bold text-slate-500 mt-1">Manage global system settings and tenants across the entire SaaS infrastructure.</p>
              </div>
              <button
                onClick={openAddModal}
                className="px-4 py-1.5 bg-[#1b5e58] hover:bg-[#12423d] text-white border-2 border-[#12423d] font-bold text-sm shadow-[2px_2px_0_rgba(0,0,0,0.2)] active:translate-y-px active:translate-x-px active:shadow-[1px_1px_0_rgba(0,0,0,0.2)] transition-all"
              >
                + Add New Tenant (Alt+A)
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left text-sm border border-[#a3c3be]">
                <thead className="bg-[#eef5ed] border-b-2 border-[#a3c3be] sticky top-0">
                  <tr>
                    <th className="px-4 py-2 font-bold text-[#12423d] border-r border-[#a3c3be]">Firm ID</th>
                    <th className="px-4 py-2 font-bold text-[#12423d] border-r border-[#a3c3be]">Company Name</th>
                    <th className="px-4 py-2 font-bold text-[#12423d] border-r border-[#a3c3be]">Email</th>
                    <th className="px-4 py-2 font-bold text-[#12423d] border-r border-[#a3c3be]">Valid Till</th>
                    <th className="px-4 py-2 font-bold text-[#12423d] border-r border-[#a3c3be]">Created At</th>
                    <th className="px-4 py-2 font-bold text-[#12423d]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#a3c3be] bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-500 font-bold italic">Loading tenants...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-red-600 font-bold">{error}</td>
                    </tr>
                  ) : firms.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-500 font-bold italic">No tenants found.</td>
                    </tr>
                  ) : (
                    firms.map((firm) => (
                      <tr key={firm.id} className="hover:bg-[#e0efeb] transition-colors cursor-pointer">
                        <td className="px-4 py-2 font-bold text-slate-900 border-r border-[#a3c3be] w-16 text-center">{firm.id}</td>
                        <td className="px-4 py-2 font-bold text-[#1b5e58] border-r border-[#a3c3be]">
                          <div className="flex items-center gap-2">
                            <Link to={`/superadmin/firms/${firm.id}/users`} className="hover:underline hover:text-teal-900 transition-colors">
                              {firm.name}
                            </Link>
                            {!firm.is_active && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-tight">Suspended</span>
                            )}
                          </div>
                          <div className="text-[10px] font-medium text-slate-500 mt-0.5">Users: {firm.max_users} | Max Firms: {firm.max_firms}</div>
                        </td>
                        <td className="px-4 py-2 text-slate-800 font-medium border-r border-[#a3c3be] w-48">{firm.email || '-'}</td>
                        <td className="px-4 py-2 text-slate-800 font-medium border-r border-[#a3c3be] w-32">
                          {firm.valid_till ? new Date(firm.valid_till).toLocaleDateString() : 'Lifetime'}
                        </td>
                        <td className="px-4 py-2 text-slate-700 font-medium border-r border-[#a3c3be] w-40">{new Date(firm.created_at).toLocaleString()}</td>
                        <td className="px-4 py-2 font-bold w-32">
                          <button 
                            onClick={() => openEditModal(firm)}
                            className="text-[#1b5e58] hover:underline mr-3"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(firm.id)}
                            className={`${firm.is_active ? 'text-red-700' : 'text-emerald-700'} hover:underline`}
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
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#e0efeb] border-2 border-[#12423d] shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="bg-[#1b5e58] text-white px-4 py-2 font-bold flex justify-between items-center text-sm border-b-2 border-[#12423d]">
                <span>{editingFirmId ? "Edit Tenant Details" : "Register New Tenant"}</span>
                <button onClick={closeModal} className="hover:text-red-300">✕</button>
              </div>
              
              <div className="p-4 bg-[#fcfaf2] max-h-[70vh] overflow-y-auto">
                <form onSubmit={handleSaveFirm} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-black text-sm">Company / Firm Name</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={newFirmName}
                      onChange={(e) => setNewFirmName(e.target.value)}
                      className="border border-[#81a09d] p-1.5 focus:bg-white focus:outline-none focus:border-[#12423d] shadow-inner font-medium text-sm"
                      placeholder="Enter the registered company name"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="font-bold text-black text-sm">Email ID</label>
                      <input
                        type="email"
                        value={newFirmEmail}
                        onChange={(e) => setNewFirmEmail(e.target.value)}
                        className="border border-[#81a09d] p-1.5 focus:bg-white focus:outline-none focus:border-[#12423d] shadow-inner font-medium text-sm"
                        placeholder="owner@example.com"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="font-bold text-black text-sm">Mobile No</label>
                      <input
                        type="tel"
                        value={newFirmMobile}
                        onChange={(e) => setNewFirmMobile(e.target.value)}
                        className="border border-[#81a09d] p-1.5 focus:bg-white focus:outline-none focus:border-[#12423d] shadow-inner font-medium text-sm"
                        placeholder="+91..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="font-bold text-black text-sm">Valid Till</label>
                      <input
                        type="date"
                        value={newFirmValidTill}
                        onChange={(e) => setNewFirmValidTill(e.target.value)}
                        className="border border-[#81a09d] p-1.5 focus:bg-white focus:outline-none focus:border-[#12423d] shadow-inner font-medium text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="font-bold text-black text-sm">No of Users</label>
                      <input
                        type="number"
                        min="1"
                        value={newFirmMaxUsers}
                        onChange={(e) => setNewFirmMaxUsers(Number(e.target.value))}
                        className="border border-[#81a09d] p-1.5 focus:bg-white focus:outline-none focus:border-[#12423d] shadow-inner font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-black text-sm">No of Firms Allowed</label>
                    <input
                      type="number"
                      min="1"
                      value={newFirmMaxFirms}
                      onChange={(e) => setNewFirmMaxFirms(Number(e.target.value))}
                      className="border border-[#81a09d] p-1.5 focus:bg-white focus:outline-none focus:border-[#12423d] shadow-inner font-medium text-sm"
                      placeholder="e.g. 1"
                    />
                  </div>
                  
                  <div className="pt-3 flex justify-end gap-3 mt-2 border-t border-[#a3c3be]">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-1.5 bg-[#e0efeb] border border-[#a3c3be] text-black hover:bg-[#c9e1dd] font-bold text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addingFirm}
                      className="px-4 py-1.5 bg-[#1b5e58] hover:bg-[#12423d] text-white border-2 border-[#12423d] font-bold text-sm shadow-[2px_2px_0_rgba(0,0,0,0.2)] disabled:opacity-50"
                    >
                      {addingFirm ? "Creating..." : "Save (Enter)"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
