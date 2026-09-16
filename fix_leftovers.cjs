const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove handleGenerateGrid
const hggRegex = /const handleGenerateGrid = \(\) => {[\s\S]*?};\n/m;
content = content.replace(hggRegex, '');

// Remove the useEffect that depends on baseRate
const useEffectRegex = /useEffect\(\(\) => {[\s\S]*?}, \[baseRate, rateStep, baseMrp, mrpStep, selectedGroupId\]\);\n/m;
content = content.replace(useEffectRegex, '');

// Fix fetch timeout
const fetchTimeoutRegex = /generateGrid\(match, '', '0', '', '0', 'base-rate'\);/m;
content = content.replace(fetchTimeoutRegex, `if (initialMatrixData && initialMatrixData.length > 0) {
              setMatrixData(initialMatrixData);
            } else {
              generateGrid(match, '', '', '', '', 'first-qty');
            }`);

fs.writeFileSync(file, content);
console.log("Fixed leftovers");
