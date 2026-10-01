import { create } from 'zustand';

interface ConfirmState {
  isOpen: boolean;
  message: string;
  title?: string;
  confirmText: string;
  cancelText: string;
  resolvePromise: ((value: boolean) => void) | null;
}

interface ConfirmStore extends ConfirmState {
  open: (options: { message: string; title?: string; confirmText?: string; cancelText?: string }) => Promise<boolean>;
  confirm: () => void;
  cancel: () => void;
}

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  isOpen: false,
  message: '',
  title: 'Confirm',
  confirmText: 'Yes',
  cancelText: 'No',
  resolvePromise: null,

  open: (options) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        message: options.message,
        title: options.title || 'Confirm',
        confirmText: options.confirmText || 'Yes',
        cancelText: options.cancelText || 'No',
        resolvePromise: resolve,
      });
    });
  },

  confirm: () => {
    const { resolvePromise } = get();
    if (resolvePromise) resolvePromise(true);
    set({ isOpen: false, resolvePromise: null });
  },

  cancel: () => {
    const { resolvePromise } = get();
    if (resolvePromise) resolvePromise(false);
    set({ isOpen: false, resolvePromise: null });
  },
}));

export const confirmDialog = (message: string, title?: string, confirmText?: string, cancelText?: string) => {
  return useConfirmStore.getState().open({ message, title, confirmText, cancelText });
};
