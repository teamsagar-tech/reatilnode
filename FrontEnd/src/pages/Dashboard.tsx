import { Helmet } from 'react-helmet-async';
import { Package, ShoppingCart, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { name: 'Total Revenue', value: '₹1,24,500', change: '+12.5%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Total Orders', value: '342', change: '+5.2%', icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Active Customers', value: '1,423', change: '+18.1%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Products Sold', value: '2,104', change: '-2.4%', icon: Package, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  return (
    <>
      <Helmet>
        <title>RetailNode | Dashboard</title>
      </Helmet>
      
      <div className='flex flex-col h-[calc(100vh-6rem)] font-sans w-full max-w-7xl mx-auto'>
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Overview</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Welcome back, Arjun! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              System Status: Online
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${stat.change.startsWith('+') ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-slate-500 font-semibold text-sm mb-1">{stat.name}</h3>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All</button>
            </div>
            <div className="p-6 flex-1 flex items-center justify-center text-slate-400 font-medium bg-slate-50/50">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Chart data will appear here</p>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 ring-4 ring-indigo-50" />
                  <div>
                    <p className="text-sm font-bold text-slate-700">New order #INV-2026-{i}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
