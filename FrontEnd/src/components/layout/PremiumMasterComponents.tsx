import React from 'react';

export const SectionTitle = ({ children, icon: Icon }: any) => (
  <div className="flex items-center gap-2 font-black text-slate-800 text-sm mb-5 pb-3 border-b-2 border-slate-100 uppercase tracking-widest mt-2">
    {Icon && (
      <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
        <Icon className="w-4 h-4" />
      </div>
    )}
    {children}
  </div>
);

export const InputRow = ({ label, value, onChange, width = 'w-full', type = 'text', placeholder = '', id = '' }: any) => (
  <div className="flex flex-col gap-1.5 mb-4 group">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-indigo-600 transition-colors">
      {label}
    </label>
    <input 
      id={id}
      type={type} 
      className={`bg-slate-50/50 border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-slate-800 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 ${width}`}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);
