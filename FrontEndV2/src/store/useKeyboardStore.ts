import { create } from 'zustand';

export type ShortcutCallback = (e: KeyboardEvent) => void;

interface ShortcutRegistration {
  id: string;
  keys: string; // e.g., 'Alt+S', 'Escape', 'Enter'
  callback: ShortcutCallback;
  context?: string; // Optional: restrict to a specific context
  priority?: number; // Higher priority runs first
}

interface KeyboardState {
  activeContext: string;
  shortcuts: ShortcutRegistration[];
  savedFocusElement: HTMLElement | null;
  
  // Actions
  setActiveContext: (context: string) => void;
  registerShortcut: (shortcut: ShortcutRegistration) => void;
  unregisterShortcut: (id: string) => void;
  getShortcutsForKey: (keys: string, currentContext?: string) => ShortcutRegistration[];
  saveFocus: () => void;
  restoreFocus: () => void;
}

export const useKeyboardStore = create<KeyboardState>((set, get) => ({
  activeContext: 'global',
  shortcuts: [],
  savedFocusElement: null,

  setActiveContext: (context) => set({ activeContext: context }),

  registerShortcut: (shortcut) => 
    set((state) => ({
      shortcuts: [...state.shortcuts.filter(s => s.id !== shortcut.id), shortcut]
    })),

  unregisterShortcut: (id) =>
    set((state) => ({
      shortcuts: state.shortcuts.filter((s) => s.id !== id)
    })),

  getShortcutsForKey: (keys, currentContext) => {
    const { shortcuts, activeContext } = get();
    const contextToUse = currentContext || activeContext;
    
    return shortcuts
      .filter(s => s.keys.toLowerCase() === keys.toLowerCase())
      .filter(s => !s.context || s.context === 'global' || s.context === contextToUse)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  },

  saveFocus: () => {
    set({ savedFocusElement: document.activeElement as HTMLElement });
  },

  restoreFocus: () => {
    const { savedFocusElement } = get();
    if (savedFocusElement && typeof savedFocusElement.focus === 'function') {
      // Small timeout ensures modal DOM cleanup has finished and original DOM is ready
      setTimeout(() => {
        savedFocusElement.focus();
      }, 0);
    }
    set({ savedFocusElement: null });
  }
}));
