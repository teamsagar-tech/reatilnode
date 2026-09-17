import sys

with open('FrontEndV2/src/components/ui/ConfirmDialog.tsx', 'r') as f:
    content = f.read()

old_code = """export default function ConfirmDialog() {
  const { isOpen, message, title, confirmText, cancelText, confirm, cancel } = useConfirmStore();

  if (!isOpen) return null;"""

new_code = """import { useEffect } from 'react';

export default function ConfirmDialog() {
  const { isOpen, message, title, confirmText, cancelText, confirm, cancel } = useConfirmStore();

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if they are typing in an input inside some other modal that might have higher z-index (though this is global confirm)
      // But actually, this is global.
      if (e.key.toLowerCase() === 'y' || e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        confirm();
      } else if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        cancel();
      }
    };
    
    // Use capture phase to ensure it runs before other handlers
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, confirm, cancel]);

  if (!isOpen) return null;"""

content = content.replace(old_code, new_code)
# Fix the react import
content = content.replace("import React from 'react';\nimport { useEffect } from 'react';", "import React, { useEffect } from 'react';")
content = content.replace("import React from 'react';\nimport { useConfirmStore", "import React, { useEffect } from 'react';\nimport { useConfirmStore")

with open('FrontEndV2/src/components/ui/ConfirmDialog.tsx', 'w') as f:
    f.write(content)
