const fs = require('fs');
let mmFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/MasterCreationModal.tsx';
let mmContent = fs.readFileSync(mmFile, 'utf8');

const oldCheck = `    if (name) {
      const normalized = name.toLowerCase().replace(/\\s+/g, '');
      if (existingNames.includes(normalized)) {
        setSubmitError(\`Record '\${name}' already exists.\`);
      } else {
        setSubmitError('');
      }
    } else {
      setSubmitError('');
    }`;

const newCheck = `    if (name) {
      const normalized = name.toLowerCase().replace(/\\s+/g, '');
      if (existingNames.includes(normalized) && !initialId) {
        setSubmitError(\`Record '\${name}' already exists.\`);
      } else {
        setSubmitError('');
      }
    } else {
      setSubmitError('');
    }`;

mmContent = mmContent.replace(oldCheck, newCheck);

// Also handle the save block if submitError is set? Wait, if submitError is not blocking saving right now, maybe I should add a block?
const oldSave = `  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name) return;`;

const newSave = `  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name || submitError) return;`;
    
mmContent = mmContent.replace(oldSave, newSave);

fs.writeFileSync(mmFile, mmContent);
console.log("Patched MasterCreationModal error check!");
