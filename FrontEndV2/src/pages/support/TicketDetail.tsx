import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Send, Clock, User, AlertCircle } from "lucide-react";

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = JSON.parse((sessionStorage.getItem('user') || localStorage.getItem('user')) || "{}");

  const fetchData = async () => {
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      
      // Fetch ticket details (from list endpoint filtered by ID)
      const tRes = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!tRes.ok) throw new Error("Failed to fetch ticket");
      const tickets = await tRes.json();
      const currentTicket = tickets.find((t: any) => t.id === parseInt(id || '0'));
      if (!currentTicket) throw new Error("Ticket not found");
      setTicket(currentTicket);

      // Fetch messages
      const mRes = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!mRes.ok) throw new Error("Failed to fetch messages");
      const msgs = await mRes.json();
      setMessages(msgs);
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    
    setSending(true);
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${id}/messages`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: reply })
      });
      if (!res.ok) throw new Error("Failed to send reply");
      
      setReply("");
      fetchData(); // Refresh messages and ticket status
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      const token = (sessionStorage.getItem('token') || localStorage.getItem('token'));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${id}/status`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      setTicket({ ...ticket, status });
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-6 h-full bg-[#fcfaf2] font-bold text-[#1b5e58]">Loading ticket details...</div>;
  if (error) return <div className="p-6 h-full bg-[#fcfaf2] font-bold text-red-600">{error}</div>;
  if (!ticket) return null;

  return (
    <>
      <Helmet>
        <title>Ticket #{ticket.id} | RetailNode</title>
      </Helmet>
      
      <div className="p-6 h-full bg-[#fcfaf2] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link to="/support/tickets" className="p-2 bg-[#e0efeb] text-[#1b5e58] border border-[#a3c3be] hover:bg-[#1b5e58] hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-[#1b5e58] tracking-tight">#{ticket.id} - {ticket.subject}</h1>
              <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1"><User className="w-3 h-3"/> {ticket.creator_name || 'User'}</span>
                <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {ticket.priority}</span>
                <span className="px-2 py-0.5 border border-slate-300 bg-white">{ticket.ticket_type.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-[#1b5e58] uppercase">Status:</label>
            <select 
              value={ticket.status}
              onChange={(e) => updateStatus(e.target.value)}
              className={`px-3 py-1.5 font-bold text-sm border-2 shadow-[2px_2px_0_rgba(0,0,0,0.2)] outline-none cursor-pointer ${
                ticket.status === 'Open' ? 'bg-amber-100 text-amber-700 border-amber-300' : 
                ticket.status === 'Resolved' ? 'bg-green-100 text-green-700 border-green-300' : 
                'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 bg-white border-2 border-[#12423d] shadow-[4px_4px_10px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto bg-[#eef5ed] space-y-4">
            {messages.map((msg, idx) => {
              const isMine = msg.sender_id === currentUser.id;
              return (
                <div key={idx} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className="text-[10px] font-bold text-slate-500 mb-1 ml-1 mr-1 uppercase">
                    {msg.sender_name || 'System'}
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 text-sm font-medium shadow-sm border-2 ${
                    isMine 
                      ? 'bg-[#1b5e58] text-white border-[#12423d] rounded-tl-xl rounded-tr-xl rounded-bl-xl' 
                      : 'bg-white text-slate-800 border-[#a3c3be] rounded-tl-xl rounded-tr-xl rounded-br-xl'
                  }`}>
                    {msg.message}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-1 ml-1 mr-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 bg-white border-t-2 border-[#12423d]">
            <form onSubmit={handleReply} className="flex gap-2">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 px-4 py-2 bg-[#fcfaf2] border border-[#a3c3be] focus:outline-none focus:border-[#1b5e58] font-medium text-sm"
              />
              <button 
                type="submit" 
                disabled={sending || !reply.trim()}
                className="px-6 py-2 bg-[#1b5e58] text-white border-2 border-[#12423d] font-bold shadow-[2px_2px_0_rgba(0,0,0,0.2)] hover:bg-[#12423d] disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                {sending ? "Sending..." : "Reply"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
