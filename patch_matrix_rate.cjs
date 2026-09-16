const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetBaseRate = `<input id="base-rate-input" type="number" value={baseRate}`;
const replacementBaseRate = `<input id="base-rate-input" type="number" step="0.01" value={baseRate}`;

const targetRateInput = `<input
                                      id={\`rate-input-\${idx}\`}
                                      type="number"
                                      value={col.rate}`;
const replacementRateInput = `<input
                                      id={\`rate-input-\${idx}\`}
                                      type="number"
                                      step="0.01"
                                      value={col.rate !== undefined && col.rate !== null && col.rate !== '' ? Number(col.rate).toFixed(2) : ''}`;

if (content.includes(targetBaseRate)) {
  content = content.replace(targetBaseRate, replacementBaseRate);
  console.log('Patched baseRate');
}
if (content.includes(targetRateInput)) {
  content = content.replace(targetRateInput, replacementRateInput);
  console.log('Patched col.rate');
} else {
  // try regex
  const rx = /<input\s+id={`rate-input-\${idx}`}\s+type="number"\s+value={col\.rate}/;
  if (rx.test(content)) {
    content = content.replace(rx, `<input id={\`rate-input-\${idx}\`} type="number" step="0.01" value={col.rate !== undefined && col.rate !== null && col.rate !== '' ? Number(col.rate).toFixed(2) : ''}`);
    console.log('Patched col.rate via regex');
  } else {
      console.log('Did not find col.rate');
  }
}

fs.writeFileSync(file, content);
