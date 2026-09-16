const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `  }, [showSupplierDropdown, showPurchaserDropdown, activeSuggestionRow, showPartyModal, showTransporterModal, navigate]);`;

const replacement = `  }, [showSupplierDropdown, showPurchaserDropdown, activeSuggestionRow, showPartyModal, showTransporterModal, navigate, activeHsnRow, activeSizeRow, activeBrandRow, activeDesignRow, activeColourRow, activeSizeMatrixRow, masterModal, masterCreationState.isOpen]);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Patched deps');
} else {
  console.log('Target not found');
}
