const fs = require('fs');
let content = fs.readFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'utf8');

const anchor = `  const finalAmount = priceAfterTax + (invoiceData.charges || 0) + (invoiceData.roundOff || 0);`;

const autoRoundOffCode = `
  // Auto-calculate Round Off to match Bill Amount (if small diff) or round to nearest integer
  useEffect(() => {
    const computedFinal = priceAfterTax + (invoiceData.charges || 0);
    
    if (invoiceData.billAmount) {
      const target = parseFloat(invoiceData.billAmount);
      const diff = target - computedFinal;
      
      // If difference is small (< 10), auto-adjust round off to match exactly
      if (Math.abs(diff) > 0 && Math.abs(diff) < 10) {
         if (Number((invoiceData.roundOff || 0).toFixed(2)) !== Number(diff.toFixed(2))) {
            setInvoiceData(prev => ({ ...prev, roundOff: Number(diff.toFixed(2)) }));
         }
      }
    } else {
       // Auto-round to nearest whole number if no specific bill amount is targeted
       const nearest = Math.round(computedFinal);
       const diff = nearest - computedFinal;
       if (Math.abs(diff) > 0 && Math.abs(diff) < 1) { // Normal round off is always < 1
           if (Number((invoiceData.roundOff || 0).toFixed(2)) !== Number(diff.toFixed(2))) {
               setInvoiceData(prev => ({ ...prev, roundOff: Number(diff.toFixed(2)) }));
           }
       }
    }
  }, [priceAfterTax, invoiceData.charges, invoiceData.billAmount, invoiceData.roundOff]);
`;

content = content.replace(anchor, anchor + '\n' + autoRoundOffCode);
fs.writeFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', content);
console.log("Added Auto Round Off");
