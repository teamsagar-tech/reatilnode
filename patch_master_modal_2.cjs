const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/MasterCreationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix InputRow to accept id and onBlur
const targetInputRow = `const InputRow = ({ label, value, onChange, placeholder = "", width = "flex-1", onKeyDown }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">{label}</div>
    <input 
      className={\`\${width} bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800\`}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder}
      autoComplete="new-password"
      onKeyDown={onKeyDown || ((e) => {`;

const replacementInputRow = `const InputRow = ({ label, value, onChange, placeholder = "", width = "flex-1", onKeyDown, onBlur, id }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">{label}</div>
    <input 
      id={id}
      className={\`\${width} bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800\`}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      onBlur={onBlur}
      placeholder={placeholder}
      autoComplete="new-password"
      onKeyDown={onKeyDown || ((e) => {`;

if (content.includes(targetInputRow)) {
    content = content.replace(targetInputRow, replacementInputRow);
    console.log("Patched InputRow");
}

// 2. Fix HSN InputRow call
const targetHsn = `<InputRow id="hsn-input" label="HSN/SAC" value={extra2} onChange={handleHsnChange} onKeyDown={handleHsnKeyDown} />`;
const replacementHsn = `<InputRow id="hsn-input" label="HSN/SAC" value={extra2} onChange={handleHsnChange} onKeyDown={handleHsnKeyDown} onBlur={() => setTimeout(() => { setHsnSuggestions([]); setFocusedIndex(-1); }, 200)} />`;

if (content.includes(targetHsn)) {
    content = content.replace(targetHsn, replacementHsn);
    console.log("Patched HSN InputRow");
}

// 3. Add Escape handler with capture: true
const targetEscape = `// Window Escape listener moved to parent (PurchaseInvoice.tsx) to prevent event bubbling conflicts`;
const replacementEscape = `useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown, true);
    }
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);`;

if (content.includes(targetEscape)) {
    content = content.replace(targetEscape, replacementEscape);
    console.log("Patched Escape listener");
}

fs.writeFileSync(file, content);
