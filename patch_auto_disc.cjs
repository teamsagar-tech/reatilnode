const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

// 1. Patch updateProduct for backwards calculation if user edits Rate directly
const oldMarkdownCheck = `      if (invoiceData.showMarkdown && (field === 'mrp' || field === 'disc' || field === 'disc2')) {
        const mrp = parseFloat(prod.mrp) || 0;
        
        if (field === 'mrp' || field === 'disc') {
          const disc = parseFloat(prod.disc) || 0;
          if (mrp > 0) {
            prod.rate = (mrp * (1 - (disc / 100))).toFixed(2);
          }
        }`;

const newMarkdownCheck = `      if (invoiceData.showMarkdown && field === 'rate') {
        const mrp = parseFloat(prod.mrp) || 0;
        const rate = parseFloat(prod.rate) || 0;
        if (mrp > 0 && rate >= 0) {
          prod.disc = (((mrp - rate) / mrp) * 100).toFixed(2);
        }
      }

      if (invoiceData.showMarkdown && (field === 'mrp' || field === 'disc' || field === 'disc2')) {
        const mrp = parseFloat(prod.mrp) || 0;
        
        if (field === 'mrp' || field === 'disc') {
          const disc = parseFloat(prod.disc) || 0;
          if (mrp > 0) {
            prod.rate = (mrp * (1 - (disc / 100))).toFixed(2);
          }
        }`;

piContent = piContent.replace(oldMarkdownCheck, newMarkdownCheck);

// 2. Patch SizeAllocationModal onSave in PurchaseInvoice.tsx
const oldMatrixSave = `              newProducts[activeSizeMatrixRow] = {
                ...newProducts[activeSizeMatrixRow],
                qty: summaryInfo.totalQty,
                rate: summaryInfo.avgRate,
                mrp: summaryInfo.avgMrp || 0,
                size: summaryInfo.sizeDisplay,
                matrixData: allocatedSizes,
                size_group_id: summaryInfo.size_group_id
              };`;

const newMatrixSave = `              let calculatedDisc = newProducts[activeSizeMatrixRow].disc;
              if (invoiceData.showMarkdown && summaryInfo.avgMrp > 0 && summaryInfo.avgRate >= 0) {
                 calculatedDisc = (((summaryInfo.avgMrp - summaryInfo.avgRate) / summaryInfo.avgMrp) * 100).toFixed(2);
              }
              
              newProducts[activeSizeMatrixRow] = {
                ...newProducts[activeSizeMatrixRow],
                qty: summaryInfo.totalQty,
                rate: summaryInfo.avgRate,
                mrp: summaryInfo.avgMrp || 0,
                disc: calculatedDisc,
                size: summaryInfo.sizeDisplay,
                matrixData: allocatedSizes,
                size_group_id: summaryInfo.size_group_id
              };`;

piContent = piContent.replace(oldMatrixSave, newMatrixSave);

fs.writeFileSync(piFile, piContent);
console.log("Patched auto discount calculation!");
