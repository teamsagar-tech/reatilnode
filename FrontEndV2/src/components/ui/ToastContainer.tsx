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
          success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          error: 'bg-red-50 text-red-800 border-red-200',
          warning: 'bg-amber-50 text-amber-800 border-amber-200',
          info: 'bg-blue-50 text-blue-800 border-blue-200',
        }[t.type];

        const iconColors = {
          success: 'text-emerald-500',
          error: 'text-red-500',
          warning: 'text-amber-500',
          info: 'text-blue-500',
        }[t.type];

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 w-[350px] bg-white border rounded-lg shadow-lg animate-in slide-in-from-right-8 fade-in duration-300 ${colors}`}
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColors}`} />
            <div className="flex-1">
              {t.title && <h4 className="text-sm font-bold mb-0.5">{t.title}</h4>}
              <p className="text-xs font-medium opacity-90">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
