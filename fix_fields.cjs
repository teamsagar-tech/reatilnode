const fs = require('fs');
let file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace fields array logic for main handleKeyDown
const regex1 = /fields\.push\('qty', 'rate'\);\n\s*if \(showDiscCol\) fields\.push\('disc'\);\n\s*if \(showMRPCol\) fields\.push\('mrp'\);\n\s*if \(invoiceData\.gstOn === 'items'\) fields\.push\('gst'\);/g;

const repl1 = `fields.push('qty');
    if (invoiceData.showMarkdown) {
       fields.push('mrp', 'disc', 'rate');
       if (invoiceData.gstOn === 'items') fields.push('gst');
       fields.push('mrp_2', 'disc2', 'sale_rate');
    } else {
       fields.push('rate');
       if (showDiscCol) fields.push('disc');
       if (showMRPCol) fields.push('mrp');
       if (invoiceData.gstOn === 'items') fields.push('gst');
    }`;

content = content.replace(regex1, repl1);

// Replace fields array logic for size selection (line ~2147)
const regex2 = /if \(invoiceData\.gstOn === 'items'\) fields\.push\('gst'\);\n\s*if \(isAnyRowReadywear \|\| isAnyRowInnerwear \|\| invoiceData\.showMarkdown\) fields\.push\('mrp'\);\n\s*fields\.push\('qty', 'rate'\);\n\s*if \(isAnyRowNotSaree \|\| invoiceData\.showPurchaseDiscount\) fields\.push\('disc'\);/g;

const repl2 = `fields.push('qty');
                                        if (invoiceData.showMarkdown) {
                                           fields.push('mrp', 'disc', 'rate');
                                           if (invoiceData.gstOn === 'items') fields.push('gst');
                                           fields.push('mrp_2', 'disc2', 'sale_rate');
                                        } else {
                                           fields.push('rate');
                                           if (isAnyRowNotSaree || invoiceData.showPurchaseDiscount) fields.push('disc');
                                           if (isAnyRowReadywear || isAnyRowInnerwear || invoiceData.showMarkdown) fields.push('mrp');
                                           if (invoiceData.gstOn === 'items') fields.push('gst');
                                        }`;

content = content.replace(regex2, repl2);

fs.writeFileSync(file, content);
console.log("SUCCESS: Replaced fields arrays!");
