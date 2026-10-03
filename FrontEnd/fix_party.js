const fs = require('fs');
let content = fs.readFileSync('src/pages/masters/accounting/PartyMaster.tsx', 'utf8');

// Fix duplicate invoiceConfig at line 511
content = content.replace(/contacts: \[\],\n    invoiceConfig: \{ designNo: false, colourNo: false, showSize: false, showPurchaseDiscount: false, showMarkdown: false \}/g, 'contacts: []');

// Fix missing contacts in setFormData at line 571-580
content = content.replace(/invoiceConfig: row\.invoice_config \? \(typeof row\.invoice_config === 'string' \? JSON\.parse\(row\.invoice_config\) : row\.invoice_config\) : \{ designNo: false, colourNo: false, showSize: false, showPurchaseDiscount: false, showMarkdown: false \}\n                            \}\);/g, `invoiceConfig: row.invoice_config ? (typeof row.invoice_config === 'string' ? JSON.parse(row.invoice_config) : row.invoice_config) : { designNo: false, colourNo: false, showSize: false, showPurchaseDiscount: false, showMarkdown: false },\n                              contacts: []\n                            });`);

// Fix contacts never type at line 806 by explicitly typing the initial state of formData
content = content.replace(/contacts: \[\]\,/g, 'contacts: [] as any[],');
content = content.replace(/contacts: \[\]\n/g, 'contacts: [] as any[]\n');

// Revert my earlier change for masterModal to use 'any' so it satisfies the strict literal types of MasterCreationModal
content = content.replace(/const \[masterModal, setMasterModal\] = useState<\{type: string, initialValue: string, parentId\?: number\} \| null>\(null\);/g, 'const [masterModal, setMasterModal] = useState<any>(null);');

fs.writeFileSync('src/pages/masters/accounting/PartyMaster.tsx', content);

// Fix MasterCreationModal.tsx
let modalContent = fs.readFileSync('src/components/inventory/MasterCreationModal.tsx', 'utf8');
modalContent = modalContent.replace(/masterType: 'brand' \| 'size' \| 'sizegroup' \| 'item' \| 'hsn' \| 'partycategory' \| 'partysubcategory' \| null;/g, "masterType: 'brand' | 'size' | 'sizegroup' | 'item' | 'hsn' | 'partycategory' | 'partysubcategory' | 'sizeset' | 'design' | 'colour' | null;");
modalContent = modalContent.replace(/<button onClick=\{onClose\} tabIndex=\{-1\} className="p-0.5 hover:bg-\[#12423d\] transition-colors" tabIndex=\{-1\}>/g, '<button onClick={onClose} tabIndex={-1} className="p-0.5 hover:bg-[#12423d] transition-colors">');
modalContent = modalContent.replace(/autoComplete="off"\s+autoComplete="off"/g, 'autoComplete="off"'); // naive replace if they are next to each other
fs.writeFileSync('src/components/inventory/MasterCreationModal.tsx', modalContent);

