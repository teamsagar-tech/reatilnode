import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const Icon = {
          success: CheckCircle2,
          error: XCircle,
          warning: AlertCircle,
          info: Info,
        }[t.type];

        const colors = {
          success: 'bg-emerald-50/90 text-emerald-900 border-emerald-200/50',
          error: 'bg-red-50/90 text-red-900 border-red-200/50',
          warning: 'bg-amber-50/90 text-amber-900 border-amber-200/50',
          info: 'bg-blue-50/90 text-blue-900 border-blue-200/50',
        }[t.type];

        const iconColors = {
          success: 'text-emerald-500 bg-emerald-100',
          error: 'text-red-500 bg-red-100',
          warning: 'text-amber-500 bg-amber-100',
          info: 'text-blue-500 bg-blue-100',
        }[t.type];

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-4 p-4 w-[380px] backdrop-blur-xl border rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-in slide-in-from-right-8 fade-in zoom-in-95 duration-300 ${colors}`}
          >
            <div className={`p-2 rounded-full shrink-0 ${iconColors}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 mt-0.5">
              {t.title && <h4 className="text-[15px] font-bold mb-1 tracking-tight leading-none">{t.title}</h4>}
              <p className="text-[13px] font-semibold opacity-85 leading-tight">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
