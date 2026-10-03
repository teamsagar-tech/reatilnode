import React from 'react';

export const SectionTitle = ({ children, icon: Icon }: any) => (
    <div className="flex items-center gap-2 font-extrabold text-slate-700 text-[11px] mb-3 pb-1 border-b-2 border-slate-100 uppercase tracking-widest mt-2">
      {Icon && (
        <div className="p-1 bg-indigo-50 text-indigo-600 rounded-md">
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}
      {children}
    </div>
  );

export const InputRow = ({ label, id, value, onChange, nextId, width = 'w-full', type = 'text', placeholder = '', autoFocus = false }: any) => (
    <div className="flex flex-col gap-[2px] mb-2.5 group">
      <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">{label}</label>
      <input 
        id={id}
        autoFocus={autoFocus}
        type={type} 
        className={`bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all hover:border-slate-300 ${width}`}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {}}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
    </div>
  );
