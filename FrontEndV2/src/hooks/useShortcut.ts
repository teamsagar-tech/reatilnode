import { useEffect, useId } from 'react';
import { useKeyboardStore, ShortcutCallback } from '../store/useKeyboardStore';

interface UseShortcutOptions {
  keys: string;
  callback: ShortcutCallback;
  context?: string;
  priority?: number;
  preventDefault?: boolean;
}

export function useShortcut({
  keys,
  callback,
  context,
  priority = 0,
  preventDefault = true
}: UseShortcutOptions) {
  const id = useId();
  const registerShortcut = useKeyboardStore((state) => state.registerShortcut);
  const unregisterShortcut = useKeyboardStore((state) => state.unregisterShortcut);

  useEffect(() => {
    const wrappedCallback: ShortcutCallback = (e) => {
      if (preventDefault) {
        e.preventDefault();
      }
      callback(e);
    };

    registerShortcut({
      id,
      keys,
      callback: wrappedCallback,
      context,
      priority,
    });

    return () => {
      unregisterShortcut(id);
    };
  }, [id, keys, callback, context, priority, preventDefault, registerShortcut, unregisterShortcut]);
}
