const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) walk(dirPath, callback);
    else if (dirPath.endsWith('.tsx')) callback(dirPath);
  });
};

walk('./FrontEndV2/src/pages/masters', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');

  if (!content.includes('Reset')) return;
  if (content.includes('ConfirmModal')) return; // Already refactored

  console.log(`Refactoring ${filePath}`);

  // Split content by "<button"
  const parts = content.split('<button');
  let targetPartIndex = -1;
  let originalOnClick = null;

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const buttonCloseIdx = part.indexOf('</button>');
    if (buttonCloseIdx !== -1) {
      const buttonContent = part.substring(0, buttonCloseIdx);
      if (buttonContent.includes('Reset') && !buttonContent.includes('Create New')) {
        targetPartIndex = i;
        const onClickMatch = buttonContent.match(/onClick=\{([\s\S]+?)\}\s*(?:className|tabIndex|>)/);
        if (onClickMatch) {
          originalOnClick = onClickMatch[1];
        }
        break;
      }
    }
  }

  if (targetPartIndex !== -1) {
    // 1. Add imports
    if (!content.includes("import ConfirmModal")) {
      const importMatch = content.match(/import .* from .*/g);
      if (importMatch) {
        const lastImport = importMatch[importMatch.length - 1];
        const relPath = filePath.split('pages/masters/')[1].split('/').length === 1 ? '../../' : '../../../';
        content = content.replace(lastImport, `${lastImport}\nimport ConfirmModal from '${relPath}components/ui/ConfirmModal';`);
      }
    }

    // 2. Add state
    const componentMatch = content.match(/export default function [A-Za-z0-9_]+\([^)]*\) {/);
    if (componentMatch && !content.includes('showResetConfirm')) {
      content = content.replace(componentMatch[0], `${componentMatch[0]}\n  const [showResetConfirm, setShowResetConfirm] = useState(false);`);
    }

    // 3. Replace the target button
    const oldPart = parts[targetPartIndex];
    const buttonCloseIdx = oldPart.indexOf('</button>');
    const afterButton = oldPart.substring(buttonCloseIdx + 9);
    
    parts[targetPartIndex] = ` \n                      type="button"\n                      onClick={() => setShowResetConfirm(true)} \n                      tabIndex={-1}\n                      className='bg-red-50 border border-red-300 px-6 py-1 text-red-700 font-bold hover:bg-red-100 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] outline-none focus:bg-red-200'\n                    >\n                      Reset\n                    </button>${afterButton}`;

    content = parts.join('<button');

    // 4. Inject ConfirmModal near the end of the return statement
    if (!content.includes('<ConfirmModal')) {
      const lastDivIdx = content.lastIndexOf('</div>');
      if (lastDivIdx !== -1) {
        let resetLogic = originalOnClick;
        if (!resetLogic || resetLogic.trim() === '') {
           resetLogic = `() => { window.location.reload(); }`;
        } else {
           if (!resetLogic.trim().startsWith('()') && !resetLogic.trim().startsWith('function')) {
              resetLogic = `() => { ${resetLogic} }`;
           }
        }

        const confirmModalJSX = `
        <ConfirmModal
          isOpen={showResetConfirm}
          title="Reset Form?"
          message="Are you sure you want to clear all data? This cannot be undone."
          type="warning"
          onConfirm={() => {
            const resetFn = ${resetLogic};
            resetFn();
            setShowResetConfirm(false);
          }}
          onCancel={() => setShowResetConfirm(false)}
        />
        `;
        content = content.substring(0, lastDivIdx) + confirmModalJSX + content.substring(lastDivIdx);
      }
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  }
});
