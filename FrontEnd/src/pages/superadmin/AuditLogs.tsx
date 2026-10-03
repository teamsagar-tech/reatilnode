import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Activity, Search, Filter } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/logs`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Audit Logs | RetailNode</title></Helmet>
      
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/superadmin" className="p-2 bg-white hover:bg-slate-50 text-slate-500 rounded-full shadow-sm border border-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <Activity className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">System Audit Logs</h1>
              </div>
              <p className="text-sm font-medium text-slate-500 mt-1 ml-14">Track every action across the multi-tenant architecture.</p>
            </div>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 w-64"
            />
          </div>
        </div>

        {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">{error}</div>}

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 font-bold">Timestamp</th>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Action</th>
                  <th className="px-6 py-4 font-bold">Module</th>
                  <th className="px-6 py-4 font-bold">Description</th>
                  <th className="px-6 py-4 font-bold">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">Loading logs...</td></tr>
                ) : filteredLogs.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No logs found.</td></tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {log.user_name}
                        <div className="text-xs text-slate-400 font-normal">{log.user_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase ${
                          log.action_type === 'LOGIN' ? 'bg-emerald-100 text-emerald-700' :
                          log.action_type === 'PAGE_VIEW' ? 'bg-blue-100 text-blue-700' :
                          log.action_type === 'DELETE' ? 'bg-rose-100 text-rose-700' :
                          'bg-indigo-100 text-indigo-700'
                        }`}>
                          {log.action_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{log.module}</td>
                      <td className="px-6 py-4 text-slate-600">{log.description || '-'}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.ip_address || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
