import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, LogIn, ArrowRight, Activity, Eye, EyeOff } from 'lucide-react';

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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-100/40 blur-3xl" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-100/40 blur-3xl" />
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
          <div className="flex justify-center mb-6 items-center gap-3">
             <img src="/logo.svg" alt="RetailNode Logo" className="w-16 h-16 drop-shadow-md" />
             <h2 className="text-4xl font-black tracking-tight text-slate-800">
               Retail<span className="text-sky-500">Node</span>
             </h2>
          </div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 font-medium">
            Or contact your admin for access
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
          <div className="bg-white/70 backdrop-blur-xl py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200/60">
            <form className="space-y-6" onSubmit={handleLogin}>
              
              {error && (
                <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-md">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-rose-700 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-slate-900">
                  Username / Mobile / Email
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="username"
                    required
                    disabled={loading}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-xl border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-white/50 transition-shadow font-medium"
                    placeholder="Enter username, mobile or email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold leading-6 text-slate-900">
                  Password
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-white/50 transition-shadow font-medium tracking-wider"
                    placeholder={showPassword ? "password" : "••••••••"}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 font-medium">
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full justify-center rounded-xl bg-emerald-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="text-center mt-8 space-y-2">
            <p className="text-xs font-semibold text-slate-400">
              © {new Date().getFullYear()} RetailNode. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 text-xs font-medium text-slate-500">
              <a href="/privacy-policy" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
