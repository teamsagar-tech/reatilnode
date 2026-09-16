const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/SearchableDropdown.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '  displayKey?: string;',
  '  displayKey?: string;\n  valueKey?: string;'
);
code = code.replace(
  '  displayKey = \'name\', searchKeys, renderOption, onSelect, width = \'350px\', onNotFound',
  '  displayKey = \'name\', valueKey, searchKeys, renderOption, onSelect, width = \'350px\', onNotFound'
);
code = code.replace(
  "const val = typeof selected === 'string' ? selected : selected[displayKey];",
  "const val = typeof selected === 'string' ? selected : (valueKey ? selected[valueKey] : selected[displayKey]);"
);
code = code.replace(
  "const val = typeof opt === 'string' ? opt : opt[displayKey];",
  "const val = typeof opt === 'string' ? opt : (valueKey ? opt[valueKey] : opt[displayKey]);"
);
// Also fix the displayed value in the input field. If `value` passed is an ID, we want to show the NAME in the input field!
// Wait! If value is an ID, the input `<input value={value} .../>` will show the ID instead of the name!
// Let's modify the input value rendering:
code = code.replace(
  '        value={value}',
  '        value={(() => {\n          if (typeof value === "string" && valueKey && options.length > 0) {\n            const found = options.find(o => o && o[valueKey] == value);\n            if (found) return found[displayKey] || value;\n          }\n          return value;\n        })()}'
);
// Wait, when the user TYPES in the input, `onChange` is called with the raw string!
// onChange={e => { onChange(e.target.value); setActiveIndex(0); setOpen(true); }}
// This means the `onChange` is overloaded. It receives raw search string during typing, and actual value when selected.
// If the parent component expects `onChange` to ALWAYS receive ID, then typing will break because it sends search string instead of ID.
// Ah, `SearchableDropdown` is inherently a ComboBox (where value is both the search term and the selected item).

fs.writeFileSync(file, code);
