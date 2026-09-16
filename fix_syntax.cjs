const fs = require('fs');
let file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `handleKeyDown(e, index, 'qty');
                              }
                            className="w-full`,
  `handleKeyDown(e, index, 'qty');
                              }
                            }}
                            className="w-full`
);

const tdIssue = `                        <td className="border-r border-slate-300 px-1 py-[2px]">\n{!invoiceData.showMarkdown && (\n                          <td className="border-r border-slate-300 px-1 py-[2px]">\n                            <input id={\`row-\${index}-rate\`}`;
const fixTd = `{!invoiceData.showMarkdown && (\n                          <td className="border-r border-slate-300 px-1 py-[2px]">\n                            <input id={\`row-\${index}-rate\`}`;

if (content.includes(tdIssue)) {
  content = content.replace(tdIssue, fixTd);
  console.log("Fixed TD issue!");
} else {
  console.log("Could not find TD issue string.");
}

fs.writeFileSync(file, content);
