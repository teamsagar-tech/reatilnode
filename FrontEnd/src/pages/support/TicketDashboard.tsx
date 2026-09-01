import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Plus, Search, MessageSquare, AlertCircle } from "lucide-react";

export default function TicketDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Ticket Form
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("SaaS_Support");
  const [priority, setPriority] = useState("Medium");
  const [creating, setCreating] = useState(false);

  const currentUser = JSON.parse((sessionStorage.getItem('user') || localStorage.getItem('user')) || "{}");
  const isSuperAdmin = currentUser.role === "superadmin";

  const fetchTickets = async () => {
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch tickets");
      const data = await res.json();
      setTickets(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ticket_type: type,
          subject,
          priority,
          initial_message: message
        })
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      
      setIsModalOpen(false);
      setSubject("");
      setMessage("");
      fetchTickets();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Support Tickets | RetailNode</title>
      </Helmet>
      
      <div className="p-6 h-full bg-[#fcfaf2]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#1b5e58] tracking-tight">Support Tickets</h1>
            <p className="text-sm font-bold text-slate-500 mt-1">Manage your helpdesk and IT requests.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-[#1b5e58] hover:bg-[#12423d] text-white border-2 border-[#12423d] font-bold text-sm shadow-[2px_2px_0_rgba(0,0,0,0.2)] transition-all"
          >
            <Plus className="w-4 h-4" /> Raise Ticket
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border-2 border-red-300 text-red-700 font-bold text-sm mb-6 shadow-sm">
            {error}
          </div>
        )}

        <div className="bg-[#eef5ed] border-2 border-[#12423d] shadow-[4px_4px_10px_rgba(0,0,0,0.4)]">
          <div className="bg-[#1b5e58] text-white px-4 py-3 font-bold text-sm border-b-2 border-[#12423d] flex justify-between items-center tracking-wide">
            <span>Ticket List</span>
          </div>
          
          <div className="p-4">
            <div className="border border-[#a3c3be] bg-white overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-[#e0efeb]">
                  <tr>
                    <th className="px-4 py-3 font-bold text-[#1b5e58] border-b-2 border-r border-[#a3c3be] w-16 text-center">ID</th>
                    <th className="px-4 py-3 font-bold text-[#1b5e58] border-b-2 border-r border-[#a3c3be]">Subject</th>
                    <th className="px-4 py-3 font-bold text-[#1b5e58] border-b-2 border-r border-[#a3c3be]">Type</th>
                    <th className="px-4 py-3 font-bold text-[#1b5e58] border-b-2 border-r border-[#a3c3be]">Status</th>
                    <th className="px-4 py-3 font-bold text-[#1b5e58] border-b-2 border-r border-[#a3c3be]">Priority</th>
                    <th className="px-4 py-3 font-bold text-[#1b5e58] border-b-2 border-[#a3c3be]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-bold bg-[#fcfaf2]">Loading tickets...</td></tr>
                  ) : tickets.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-bold bg-[#fcfaf2]">No tickets found.</td></tr>
                  ) : (
                    tickets.map((ticket: any) => (
                      <tr key={ticket.id} className="hover:bg-[#e0efeb] transition-colors border-b border-[#a3c3be] last:border-0">
                        <td className="px-4 py-3 font-bold text-slate-900 border-r border-[#a3c3be] text-center">#{ticket.id}</td>
                        <td className="px-4 py-3 font-bold text-[#1b5e58] border-r border-[#a3c3be]">{ticket.subject}</td>
                        <td className="px-4 py-3 text-slate-800 font-medium border-r border-[#a3c3be] text-xs uppercase tracking-wider">{ticket.ticket_type.replace('_', ' ')}</td>
                        <td className="px-4 py-3 border-r border-[#a3c3be]">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase border ${ticket.status === 'Open' ? 'bg-amber-100 text-amber-700 border-amber-300' : ticket.status === 'Resolved' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-800 font-medium border-r border-[#a3c3be]">{ticket.priority}</td>
                        <td className="px-4 py-3 text-center">
                          <Link to={`/support/tickets/${ticket.id}`} className="text-xs font-bold text-[#1b5e58] underline hover:text-[#12423d]">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#eef5ed] border-2 border-[#12423d] shadow-[4px_4px_0_rgba(0,0,0,0.4)] w-full max-w-lg">
            <div className="bg-[#1b5e58] text-white px-4 py-2 font-bold text-sm border-b-2 border-[#12423d] flex justify-between items-center">
              <span>Raise New Ticket</span>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-red-300">X</button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1b5e58] uppercase tracking-wider mb-1">Ticket Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#12423d] focus:outline-none focus:ring-2 focus:ring-[#1b5e58] text-sm font-bold"
                >
                  <option value="SaaS_Support">SaaS Support (To Admin)</option>
                  <option value="Internal_Support">Internal Firm Support (HR/IT)</option>
                  <option value="Customer_Support">Customer Support</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#1b5e58] uppercase tracking-wider mb-1">Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#12423d] focus:outline-none focus:ring-2 focus:ring-[#1b5e58] text-sm font-bold"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b5e58] uppercase tracking-wider mb-1">Subject</label>
                <input 
                  type="text" 
                  required
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#12423d] focus:outline-none focus:ring-2 focus:ring-[#1b5e58] text-sm font-bold"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b5e58] uppercase tracking-wider mb-1">Message</label>
                <textarea 
                  required
                  rows={4}
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#12423d] focus:outline-none focus:ring-2 focus:ring-[#1b5e58] text-sm font-bold resize-none"
                  placeholder="Provide detailed information..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white text-[#1b5e58] border border-[#1b5e58] font-bold text-xs uppercase tracking-wider hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="px-5 py-2 bg-[#1b5e58] text-white border border-[#12423d] font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0_rgba(0,0,0,0.2)] hover:bg-[#12423d] disabled:opacity-50">
                  {creating ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
