const fs = require('fs');

let content = fs.readFileSync('src/pages/masters/accounting/PartyMaster.tsx', 'utf-8');

// Replace the flex wrappers with grid wrappers
content = content.replace(/<div className="w-full flex flex-row flex-wrap gap-x-8 gap-y-2">/g, 
  `<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-2">`);

// Wait, the SectionTitle is currently INSIDE this wrapper!
// If SectionTitle is inside the grid, it will just take ONE cell of the grid!
// To make it span the full grid, it needs `col-span-full`!
content = content.replace(/<SectionTitle>/g, `<div className="col-span-full"><SectionTitle>`);
content = content.replace(/<\/SectionTitle>/g, `</SectionTitle></div>`);

// Let's check where SectionTitle is used:
// <SectionTitle>Legal Information</SectionTitle>
// My replacement will change this to:
// <div className="col-span-full"><SectionTitle>Legal Information</SectionTitle></div>
// This is perfect!

fs.writeFileSync('src/pages/masters/accounting/PartyMaster.tsx', content);
console.log("Applied grid layout");
