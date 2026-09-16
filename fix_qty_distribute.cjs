const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldLogic = `    setMatrixData(prev => {
      return sizesArray.map((size: string, index: number) => {
        const existing = prev?.find(m => m.size === size.trim());
        return {
          size: size.trim(),
          qty: existing ? existing.qty : '',
          rate: baseR + (rateS * index),
          mrp: baseM + (mrpS * index),
        };
      });
    });`;

const newLogic = `    setMatrixData(prev => {
      // Check if we already have non-empty quantities in this size set
      const hasAnyExistingQty = sizesArray.some(s => {
        const existing = prev?.find(m => m.size === s.trim());
        return existing && existing.qty && parseFloat(existing.qty) > 0;
      });

      let baseQty = 0;
      let remainderQty = 0;
      
      if (!hasAnyExistingQty && expectedTotalQty && expectedTotalQty > 0 && sizesArray.length > 0) {
        baseQty = Math.floor(expectedTotalQty / sizesArray.length);
        remainderQty = expectedTotalQty % sizesArray.length;
      }

      return sizesArray.map((size: string, index: number) => {
        const existing = prev?.find(m => m.size === size.trim());
        let assignedQty = existing ? existing.qty : '';
        
        if (!hasAnyExistingQty && expectedTotalQty && expectedTotalQty > 0) {
           const qtyForThisSize = baseQty + (index < remainderQty ? 1 : 0);
           if (qtyForThisSize > 0) {
               assignedQty = qtyForThisSize.toString();
           }
        }
        
        return {
          size: size.trim(),
          qty: assignedQty,
          rate: baseR + (rateS * index),
          mrp: baseM + (mrpS * index),
        };
      });
    });`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(file, content);
console.log("Fixed qty distribution!");
