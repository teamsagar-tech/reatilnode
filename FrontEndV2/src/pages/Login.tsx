import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      
      // Success
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | RetailNode ERP</title>
      </Helmet>
      
      {/* RetailNode Main Background */}
      <div className="flex flex-col h-screen font-sans text-[14px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full">
        
        

        {/* Main Content Area */}
        <div className="flex flex-1 p-1 gap-1 overflow-hidden h-full">
          {/* Main Container */}
          <div className="flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex items-center justify-center overflow-hidden shadow-inner relative">
            
            {/* The Login Modal Box */}
            <div className="w-[400px] bg-[#eef5ed] border-2 border-slate-400 shadow-[2px_2px_5px_rgba(0,0,0,0.3)] relative">
              {/* Modal Header */}
              <div className="bg-[#1b5e58] text-white font-bold text-center py-1 tracking-wider text-sm border-b-2 border-[#12423d]">
                Company Login
              </div>
              
              <div className="p-6">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 text-xs font-bold rounded">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <label className="font-bold text-black text-sm w-1/3">Email / User</label>
                    <input 
                      type="text" 
                      className="w-2/3 border border-slate-500 p-1 px-2 focus:bg-white focus:outline-none focus:border-black shadow-inner" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoFocus
                      disabled={loading}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="font-bold text-black text-sm w-1/3">Password</label>
                    <div className="w-2/3 relative flex items-center">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="w-full border border-slate-500 p-1 px-2 pr-8 focus:bg-white focus:outline-none focus:border-black shadow-inner tracking-widest" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 text-slate-600 hover:text-black focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Hidden submit button to allow Enter key to submit */}
                  <button type="submit" className="hidden" disabled={loading}>Submit</button>

                </form>
              </div>

              {/* Instructions text mimicking RetailNode */}
              <div className="border-t border-[#81a09d] p-2 text-center text-xs font-semibold text-slate-700 italic">
                Press Enter to Login or Esc to Quit
              </div>
            </div>

            {/* Copyright and Policy Links at bottom of the white area */}
            <div className="absolute bottom-4 w-full flex flex-col items-center gap-1 text-xs font-bold text-slate-500">
              <div className="flex gap-4">
                <a href="/privacy-policy" className="hover:text-[#1b5e58] hover:underline">Privacy Policy</a>
                <a href="/terms-of-service" className="hover:text-[#1b5e58] hover:underline">Terms of Service</a>
              </div>
              <div>© {new Date().getFullYear()} RetailNode. All rights reserved.</div>
            </div>
          </div>

          {/* Right Action Sidebar (F-keys) - mostly empty for login, but structure kept */}
          <div className="w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]">
             {/* Just a quit button to match structure */}
             <div className="flex-1" />
             <div className="flex flex-col items-center justify-center p-2 mb-2 border-t border-[#a3c3be] mx-2 pt-4">
               <svg width="64" height="64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="100" cy="100" r="86" fill="transparent" stroke="#1b5e58" strokeWidth="14" />
                 <circle cx="14" cy="100" r="8" fill="transparent" stroke="#1b5e58" strokeWidth="5" />
                 <circle cx="186" cy="100" r="8" fill="transparent" stroke="#1b5e58" strokeWidth="5" />
                 <text x="100" y="100" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="72" textAnchor="middle" dominantBaseline="central">
                   <tspan fill="#12423d">RN</tspan><tspan fill="#1b5e58">.</tspan>
                 </text>
               </svg>
               <span className="font-extrabold text-[13px] text-[#12423d] mt-2 uppercase tracking-widest text-center">RetailNode</span>
             </div>

             <button 
               onClick={() => {}}
               className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
             >
                 <span className="font-bold text-black text-xs w-[25px] underline">Q</span>
                 <span className="text-black text-xs font-medium border-l border-[#a3c3be] pl-1 ml-1">Quit</span>
             </button>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]">
          <div className="font-medium tracking-wide">Login Screen</div>
          <div className="flex gap-6">
            <span>Version: 1.0</span>
          </div>
        </div>
      </div>
    </>
  );
}
