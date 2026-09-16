const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4/g, 
    'grid-cols-2 lg:grid-cols-4');
  
  // Also change the default input width to w-[200px] instead of w-[250px] to ensure 4 columns fit on smaller screens
  content = content.replace(/w-\[250px\]/g, 'w-[200px]');
  
  fs.writeFileSync(filePath, content);
}

updateFile('src/pages/masters/accounting/PartyMaster.tsx');
updateFile('src/components/inventory/PartyModal.tsx');
console.log("Forced 4 columns and resized inputs to 200px");
