const fs = require('fs');
let mmFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/MasterCreationModal.tsx';
let mmContent = fs.readFileSync(mmFile, 'utf8');

const oldInit = `      setExtra2('');
      setHsnSuggestions([]);
      setFocusedIndex(-1);
      setSubmitError('');
      setTimeout(() => {`;
      
const newInit = `      setExtra2(initialHsn || '');
      setExtra3(initialGst || '');
      setHsnSuggestions([]);
      setFocusedIndex(-1);
      setSubmitError('');
      setTimeout(() => {`;

mmContent = mmContent.replace(oldInit, newInit);

fs.writeFileSync(mmFile, mmContent);
console.log("Patched MasterCreationModal init!");
