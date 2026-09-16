const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldFieldsLogic1 = `    fields.push('qty', 'rate');
    
    if (showDiscCol) fields.push('disc');
    if (showMRPCol) fields.push('mrp');
    if (invoiceData.gstOn === 'items') fields.push('gst');`;

const newFieldsLogic1 = `    if (invoiceData.showMarkdown) {
      fields.push('qty', 'mrp');
      if (showDiscCol) fields.push('disc');
      fields.push('rate');
      if (invoiceData.gstOn === 'items') fields.push('gst');
      fields.push('sales_rate');
    } else {
      fields.push('qty', 'rate');
      if (showDiscCol) fields.push('disc');
      if (showMRPCol) fields.push('mrp');
      if (invoiceData.gstOn === 'items') fields.push('gst');
    }`;

content = content.replace(oldFieldsLogic1, newFieldsLogic1);

const oldFieldsLogic2 = `                                        fields.push('qty', 'rate');
                                        if (isAnyRowNotSaree || invoiceData.showPurchaseDiscount) fields.push('disc');
                                        if (isAnyRowReadywear || isAnyRowInnerwear || invoiceData.showMarkdown) fields.push('mrp');
                                        if (invoiceData.gstOn === 'items') fields.push('gst');`;

const newFieldsLogic2 = `                                        const showDiscCol2 = isAnyRowNotSaree || invoiceData.showPurchaseDiscount;
                                        const showMRPCol2 = isAnyRowReadywear || isAnyRowInnerwear || invoiceData.showMarkdown;
                                        if (invoiceData.showMarkdown) {
                                          fields.push('qty', 'mrp');
                                          if (showDiscCol2) fields.push('disc');
                                          fields.push('rate');
                                          if (invoiceData.gstOn === 'items') fields.push('gst');
                                          fields.push('sales_rate');
                                        } else {
                                          fields.push('qty', 'rate');
                                          if (showDiscCol2) fields.push('disc');
                                          if (showMRPCol2) fields.push('mrp');
                                          if (invoiceData.gstOn === 'items') fields.push('gst');
                                        }`;
                                        
content = content.replace(oldFieldsLogic2, newFieldsLogic2);

const oldFieldsLogic3 = `               fields.push('qty', 'rate');
               
               if (showDiscCol) fields.push('disc');
               if (showMRPCol) fields.push('mrp');
               if (invoiceData.gstOn === 'items') fields.push('gst');`;
               
const newFieldsLogic3 = `               if (invoiceData.showMarkdown) {
                 fields.push('qty', 'mrp');
                 if (showDiscCol) fields.push('disc');
                 fields.push('rate');
                 if (invoiceData.gstOn === 'items') fields.push('gst');
                 fields.push('sales_rate');
               } else {
                 fields.push('qty', 'rate');
                 if (showDiscCol) fields.push('disc');
                 if (showMRPCol) fields.push('mrp');
                 if (invoiceData.gstOn === 'items') fields.push('gst');
               }`;

content = content.replace(oldFieldsLogic3, newFieldsLogic3);

fs.writeFileSync(file, content);
console.log("Updated fields logic");
