const fs = require('fs');
let content = fs.readFileSync('FrontEndV2/src/pages/masters/accounting/PartyMaster.tsx', 'utf-8');

// Add import if not present
if (!content.includes("import { toast } from")) {
    const importMatch = content.match(/import .* from .*/g);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      content = content.replace(lastImport, `${lastImport}\nimport { toast } from '../../../../store/useToastStore';`);
    }
}

// Replace alerts
content = content.replace(/alert\('Party Saved!'\)/g, "toast.success('Party Saved Successfully!', 'Success')");
content = content.replace(/alert\('Failed to save party'\)/g, "toast.error('Failed to save party', 'Error')");
content = content.replace(/alert\('Party Name is required'\)/g, "toast.warning('Party Name is required', 'Validation')");
content = content.replace(/alert\(`Cannot save this Party. The GSTIN status is: \$\{gstStatusError\}`\)/g, "toast.error(`Cannot save this Party. The GSTIN status is: ${gstStatusError}`, 'Validation Error')");
content = content.replace(/alert\('Error saving party'\)/g, "toast.error('Error saving party', 'Error')");
content = content.replace(/alert\('Please select a valid brand or press Alt\+C to create one.'\)/g, "toast.warning('Please select a valid brand or press Alt+C to create one.', 'Validation')");

fs.writeFileSync('FrontEndV2/src/pages/masters/accounting/PartyMaster.tsx', content, 'utf-8');
