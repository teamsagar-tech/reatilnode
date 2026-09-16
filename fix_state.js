const fs = require('fs');
const path = require('path');

const files = [
'FrontEndV2/src/pages/masters/accounting/HundekariMaster.tsx',
'FrontEndV2/src/pages/masters/accounting/TransporterMaster.tsx',
'FrontEndV2/src/pages/masters/accounting/CommissionMaster.tsx',
'FrontEndV2/src/pages/masters/accounting/PartyMaster.tsx',
'FrontEndV2/src/pages/masters/accounting/CustomerMaster.tsx',
'FrontEndV2/src/pages/masters/config/ItemPercentageMaster.tsx',
'FrontEndV2/src/pages/masters/config/ChargesTypeMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/DepartmentMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/SizeMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/ColorMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/MaterialMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/StyleMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/SectionMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/SubCategoryMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/CategoryMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/ItemMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/SubStyleMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/DesignMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/HSNSACMaster.tsx',
'FrontEndV2/src/pages/masters/inventory/BrandMaster.tsx',
'FrontEndV2/src/pages/masters/company/FirmMaster.tsx',
'FrontEndV2/src/pages/masters/company/LocationMaster.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<ConfirmModal') && !content.includes('showResetConfirm, setShowResetConfirm')) {
    // Find the first useState declaration inside the component
    const useStatematch = content.match(/const \[.*\] = useState/);
    if (useStatematch) {
      const idx = useStatematch.index;
      content = content.slice(0, idx) + 'const [showResetConfirm, setShowResetConfirm] = useState(false);\n  ' + content.slice(idx);
      fs.writeFileSync(file, content);
      console.log('Fixed', file);
    }
  }
}
