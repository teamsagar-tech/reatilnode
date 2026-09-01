import React, { type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

interface PremiumVoucherTemplateProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  onSave?: () => void;
  onBack?: () => void;
  maxWidth?: string;
}

export default function PremiumVoucherTemplate({
  title,
  subtitle = 'RetailNode Module',
  icon,
  children,
  onSave,
  onBack,
  maxWidth = 'max-w-7xl',
}: PremiumVoucherTemplateProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleSave = () => {
    if (onSave) onSave();
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-6rem)] font-sans selection:bg-indigo-100 w-full mx-auto ${maxWidth}`}>
      <Helmet>
        <title>{title} | RetailNode</title>
      </Helmet>
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             {icon && (
               <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                 {icon}
               </div>
             )}
             {title}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">{subtitle}</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleBack} 
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-500 font-bold">ESC</kbd> 
            Back
          </button>
          
          <button 
            onClick={handleSave}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 border border-indigo-700 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <kbd className="px-2 py-0.5 rounded bg-indigo-500 border border-indigo-500 text-[10px] text-indigo-100 font-bold">CTRL+S</kbd> 
            Save
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-4 overflow-hidden flex-1'>
        {children}
      </div>
    </div>
  );
}
