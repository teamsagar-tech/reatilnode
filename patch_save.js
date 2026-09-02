const fs = require('fs');

function patchFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Add handleSaveInvoice function
    const saveFunc = `
  const handleSaveInvoice = () => {
    alert('Purchase Invoice Saved Successfully!');
  };
`;
    // Insert handleSaveInvoice before handleImport
    content = content.replace('const handleImport = (e:', saveFunc + '\n  const handleImport = (e:');

    // Add keyboard shortcut for Save (Alt+S)
    const oldShortcut = `} else if (e.altKey && e.code === 'KeyL') {`;
    const newShortcut = `} else if (e.altKey && e.code === 'KeyS') {
        e.preventDefault();
        e.stopPropagation();
        handleSaveInvoice();
      } else if (e.altKey && e.code === 'KeyL') {`;
    content = content.replace(oldShortcut, newShortcut);

    // Update bottom status bar text to show Alt+S
    const oldStatus = `Shortcuts: <strong>{modKey}+Z</strong> (Design)`;
    const newStatus = `Shortcuts: <strong>{modKey}+S</strong> (Save) | <strong>{modKey}+Z</strong> (Design)`;
    content = content.replace(oldStatus, newStatus);

    // Add Save button to UI (above Quit button)
    const quitButton = `<button 
               onClick={() => navigate('/dashboard')}
               className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
             >`;
             
    const saveButton = `<button 
               onClick={handleSaveInvoice}
               className="flex flex-row items-center px-2 py-1 bg-[#ffe000] border border-[#d6bc00] hover:bg-[#e6c900] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] mb-2 w-full"
             >
                 <span className="font-bold text-black text-[11px] w-[25px] underline">S</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#d6bc00] pl-1 ml-1">Save</span>
             </button>
             <button 
               onClick={() => navigate('/dashboard')}
               className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] w-full"
             >`;
    content = content.replace(quitButton, saveButton);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched Save Button in', filePath);
  }
}

patchFile('FrontEnd/src/pages/inventory/PurchaseInvoice.tsx');
patchFile('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx');
