const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /if \(match\) {\s*setSelectedGroupId\(match\.id\.toString\(\)\);\s*setSearchText\(match\.name\);\s*\/\/ Need a slight timeout to ensure state is set if generateGrid uses state \(but it doesn't anymore\)\s*setTimeout\(\(\) => {\s*if \(initialMatrixData && initialMatrixData\.length > 0\) {\s*\/\/ already set by isOpen useEffect\s*} else {\s*generateGrid\(match, '', '', '', '', 'first-qty'\);\s*}\s*}, 0\);\s*}/m;

const replacement = `if (match) {
            setSelectedGroupId(match.id.toString());
            setSearchText(match.name);
            // Need a slight timeout to ensure state is set if generateGrid uses state (but it doesn't anymore)
            setTimeout(() => {
              if (initialMatrixData && initialMatrixData.length > 0) {
                 // already set by isOpen useEffect
              } else {
                 generateGrid(match, '', '', '', '', 'first-qty');
              }
            }, 0);
          } else {
            setSearchText(initialSizeSet);
            setSelectedGroupId('');
            setTimeout(() => {
              if (initialMatrixData && initialMatrixData.length > 0) {
                 // already set by isOpen useEffect
              } else {
                 generateGrid({ name: initialSizeSet }, '', '', '', '', 'first-qty');
              }
            }, 0);
          }`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log("Fixed unmatched initialSizeSet!");
} else {
    console.log("Regex didn't match.");
}
