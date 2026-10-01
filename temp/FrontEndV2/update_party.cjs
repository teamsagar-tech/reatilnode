const fs = require('fs');
const files = [
  './src/pages/masters/accounting/PartyMaster.tsx',
  './src/components/inventory/PartyModal.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');

  // Remove state
  code = code.replace("const [activeTab, setActiveTab] = useState('Legal');", "");

  // Remove Tabs Header
  const tabHeaderStart = code.indexOf('{/* Tabs */}');
  const tabHeaderEnd = code.indexOf('{/* Body (Tab Content) */}');
  if (tabHeaderStart !== -1 && tabHeaderEnd !== -1) {
    code = code.substring(0, tabHeaderStart) + code.substring(tabHeaderEnd);
  }

  // Replace wrapper
  code = code.replace("{/* Body (Tab Content) */}", "{/* Body (Row Content) */}");
  code = code.replace('<div className="flex-1 overflow-y-auto p-4 bg-white custom-scrollbar">', 
    '<div className="flex-1 overflow-y-auto p-4 bg-white custom-scrollbar">\n                    <div className="flex flex-row flex-wrap gap-x-8 gap-y-4 items-start pb-10">');

  const tabs = [
    "{activeTab === 'Legal' && (",
    "{activeTab === 'Basic Party' && (",
    "{activeTab === 'Address' && (",
    "{activeTab === 'Contact' && (",
    "{activeTab === 'Bank' && (",
    "{activeTab === 'Brands' && (",
    "{activeTab === 'Categorization' && ("
  ];

  for (const tab of tabs) {
    code = code.replace(tab, "");
  }
  
  // Replace all occurrences of `<div className="w-[450px] flex flex-col gap-1 mx-auto">`
  code = code.replaceAll('<div className="w-[450px] flex flex-col gap-1 mx-auto">', '<div className="w-[400px] flex flex-col gap-1">');
  
  // Replace `)}` that used to close the tabs
  code = code.replace(/\n\s*\)\}\n/g, '\n\n');
  
  // Close the flex container at the end of the tabs section
  const actionBtnsIdx = code.indexOf('{/* Action Buttons */}');
  if (actionBtnsIdx !== -1) {
      code = code.substring(0, actionBtnsIdx) + '</div>\n                  ' + code.substring(actionBtnsIdx);
  }

  fs.writeFileSync(file, code);
  console.log('Updated ' + file);
}
