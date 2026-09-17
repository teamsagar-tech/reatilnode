import sys
with open('FrontEndV2/src/components/ui/ConfirmDialog.tsx', 'r') as f:
    content = f.read()

content = content.replace("import React, { useEffect } from 'react';\nimport { useConfirmStore } from '../../store/useConfirmStore';\n\nimport { useEffect } from 'react';", "import React, { useEffect } from 'react';\nimport { useConfirmStore } from '../../store/useConfirmStore';")

# Add the UI text markers
content = content.replace("{cancelText}", "{cancelText} (N)")
content = content.replace("{confirmText}", "{confirmText} (Y)")

with open('FrontEndV2/src/components/ui/ConfirmDialog.tsx', 'w') as f:
    f.write(content)
