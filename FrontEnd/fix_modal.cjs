const fs = require('fs');
let modalContent = fs.readFileSync('/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/components/inventory/MasterCreationModal.tsx', 'utf8');

modalContent = modalContent.replace(/masterType: 'brand' \| 'size' \| 'sizegroup' \| 'item' \| 'hsn' \| 'partycategory' \| 'partysubcategory' \| null;/g, "masterType: 'brand' | 'size' | 'sizegroup' | 'item' | 'hsn' | 'partycategory' | 'partysubcategory' | 'sizeset' | 'design' | 'colour' | null;");
modalContent = modalContent.replace(/<button onClick=\{onClose\} tabIndex=\{-1\} className="p-0.5 hover:bg-\[#12423d\] transition-colors" tabIndex=\{-1\}>/g, '<button onClick={onClose} tabIndex={-1} className="p-0.5 hover:bg-[#12423d] transition-colors">');
modalContent = modalContent.replace(/autoComplete="off"\s*autoComplete="off"/g, 'autoComplete="off"'); 

fs.writeFileSync('/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/components/inventory/MasterCreationModal.tsx', modalContent);
