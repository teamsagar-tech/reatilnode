const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace initialization
content = content.replace(/const \[rateStep, setRateStep\] = useState\('0'\);/g, "const [rateStep, setRateStep] = useState('');");
content = content.replace(/const \[mrpStep, setMrpStep\] = useState\('0'\);/g, "const [mrpStep, setMrpStep] = useState('');");

// Replace reset
content = content.replace(/setRateStep\('0'\);/g, "setRateStep('');");
content = content.replace(/setMrpStep\('0'\);/g, "setMrpStep('');");

fs.writeFileSync(file, content);
console.log("Patched 0 to empty");
