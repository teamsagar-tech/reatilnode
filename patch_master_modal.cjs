const fs = require('fs');

// Patch PurchaseInvoice.tsx
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

piContent = piContent.replace(
  /initialBrandId\?: number \| null \} \| null>\(null\);/g,
  `initialBrandId?: number | null, initialHsn?: string, initialGst?: string, initialId?: number | null } | null>(null);`
);

piContent = piContent.replace(
  /initialBrandId: field === 'item' \? products\[index\]\.brand_id : undefined\n\s*\}\);/g,
  `initialBrandId: field === 'item' ? products[index].brand_id : undefined,\n          initialHsn: field === 'item' ? products[index].hsn : undefined,\n          initialGst: field === 'item' && products[index].gst ? String(products[index].gst) : undefined,\n          initialId: field === 'item' ? products[index].item_id : undefined\n        });`
);

piContent = piContent.replace(
  /initialBrandId: fbId\n\s*\}\);/g,
  `initialBrandId: fbId,\n            initialHsn: products[index].hsn,\n            initialGst: products[index].gst ? String(products[index].gst) : undefined,\n            initialId: products[index].item_id\n          });`
);

piContent = piContent.replace(
  /initialBrandId=\{masterModal\?\.initialBrandId\}\n\s*onSave/g,
  `initialBrandId={masterModal?.initialBrandId}\n        initialHsn={masterModal?.initialHsn}\n        initialGst={masterModal?.initialGst}\n        initialId={masterModal?.initialId}\n        onSave`
);

fs.writeFileSync(piFile, piContent);

// Patch MasterCreationModal.tsx
let mmFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/MasterCreationModal.tsx';
let mmContent = fs.readFileSync(mmFile, 'utf8');

mmContent = mmContent.replace(
  /initialBrandId\?: number \| null;\n\s*parentId\?: number \| null;\n\}/g,
  `initialBrandId?: number | null;\n  parentId?: number | null;\n  initialHsn?: string;\n  initialGst?: string;\n  initialId?: number | null;\n}`
);

mmContent = mmContent.replace(
  /export default function MasterCreationModal\(\{\s*isOpen,\s*onClose,\s*onSave,\s*masterType,\s*initialValue = '',\s*initialBrand,\s*initialBrandId,\s*parentId\s*\}\s*:\s*MasterCreationModalProps\)\s*\{/g,
  `export default function MasterCreationModal({ isOpen, onClose, onSave, masterType, initialValue = '', initialBrand, initialBrandId, parentId, initialHsn, initialGst, initialId }: MasterCreationModalProps) {`
);

mmContent = mmContent.replace(
  /setExtra2\(''\);\n\s*setHsnSuggestions\(\[\]\);\n\s*setFocusedIndex\(-1\);\n\s*setSubmitError\(''\);\n\s*setExtra3\(''\);\n\s*setSelectedSizes\(\[\]\);/g,
  `setExtra2(initialHsn || '');\n      setHsnSuggestions([]);\n      setFocusedIndex(-1);\n      setSubmitError('');\n      setExtra3(initialGst || '');\n      setSelectedSizes([]);`
);

const fetchCall = `    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',`;
const newFetchCall = `    try {
      if (endpoint) {
        const method = initialId ? 'PUT' : 'POST';
        const url = initialId ? \`\${endpoint}/\${initialId}\` : endpoint;
        const response = await fetch(url, {
          method,`;

mmContent = mmContent.replace(fetchCall, newFetchCall);

fs.writeFileSync(mmFile, mmContent);

console.log("Patched MasterCreationModal and PurchaseInvoice!");
