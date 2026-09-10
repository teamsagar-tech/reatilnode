import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    
    // Auto remove
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, toast.duration || 3000);
    }
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// Helper functions for easy import
export const toast = {
  success: (message: string, title?: string, duration?: number) => useToastStore.getState().addToast({ type: 'success', message, title, duration }),
  error: (message: string, title?: string, duration?: number) => useToastStore.getState().addToast({ type: 'error', message, title, duration }),
  warning: (message: string, title?: string, duration?: number) => useToastStore.getState().addToast({ type: 'warning', message, title, duration }),
  info: (message: string, title?: string, duration?: number) => useToastStore.getState().addToast({ type: 'info', message, title, duration }),
};
