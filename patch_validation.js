const fs = require('fs');
const filePath = 'FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state for import errors
const errorState = `
  const [importErrors, setImportErrors] = useState<string[]>([]);
`;

content = content.replace("const [locations, setLocations] = useState<any[]>([]);", "const [locations, setLocations] = useState<any[]>([]);\n" + errorState);

// 2. Update the products structure in the initial state to include IDs
content = content.replace(
  "const [products, setProducts] = useState<any[]>([",
  "const [products, setProducts] = useState<any[]>([\n    { id: 1, item_id: null, item: '', brand_id: null, brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 },"
);
// replace the one with Date.now() too
content = content.replace(
  "{ id: Date.now(), item: '', hsn: '', brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }",
  "{ id: Date.now(), item_id: null, item: '', hsn: '', brand_id: null, brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }"
);

// 3. Update the handleImport logic to validate and map IDs
// Look for where we process `importedProducts = data.map`
const oldMappingLogic = `
          const importedProducts = data.map((row: any, idx) => {
            const getVal = (keys: string[]) => {
              for (const k of keys) {
                if (row[k] !== undefined && row[k] !== '') return row[k];
              }
              return '';
            };

            const item = getVal(['Product Desc.', 'ITEM', 'Product Name']);
            const qty = parseFloat(getVal(['Qty', 'QTY', 'PCS', 'Quantity'])) || 0;
            const rate = parseFloat(getVal(['Rate', 'RATE', 'PRATE'])) || 0;
            const hsn = getVal(['HSN', 'HSN/SAC']).toString();
            const brand = getVal(['BRAND', 'Brand']);
            const design = getVal(['Design', 'DESIGN']);
            const colour = getVal(['Color', 'Colour', 'COLOR', 'COLOUR']);
            const size = getVal(['Size', 'SIZE']).toString();
            const mrp = parseFloat(getVal(['Mrp', 'MRP'])) || 0;
            const gst = parseFloat(getVal(['GST %', 'GSTPERC', 'Tax %'])) || 0;
            const disc = parseFloat(getVal(['Dis%', 'DISC %'])) || 0;
            
            if (design) hasDesign = true;
            if (colour) hasColour = true;
            if (size) hasSize = true;
            if (mrp) hasMarkdown = true;
            if (disc) hasDisc = true;

            return {
              id: Date.now() + idx,
              item,
              hsn,
              brand,
              qty: qty.toString(),
              rate: rate.toString(),
              disc,
              gst,
              design,
              colour,
              size,
              mrp
            };
          }).filter(p => p.item || Number(p.qty) > 0);
`;

const newMappingLogic = `
          let errors: string[] = [];
          const importedProducts = data.map((row: any, idx) => {
            const getVal = (keys: string[]) => {
              for (const k of keys) {
                if (row[k] !== undefined && row[k] !== '') return row[k];
              }
              return '';
            };

            const item = getVal(['Product Desc.', 'ITEM', 'Product Name']);
            const qty = parseFloat(getVal(['Qty', 'QTY', 'PCS', 'Quantity'])) || 0;
            const rate = parseFloat(getVal(['Rate', 'RATE', 'PRATE'])) || 0;
            const hsn = getVal(['HSN', 'HSN/SAC']).toString();
            const brand = getVal(['BRAND', 'Brand']);
            const design = getVal(['Design', 'DESIGN']);
            const colour = getVal(['Color', 'Colour', 'COLOR', 'COLOUR']);
            const size = getVal(['Size', 'SIZE']).toString();
            const mrp = parseFloat(getVal(['Mrp', 'MRP'])) || 0;
            const gst = parseFloat(getVal(['GST %', 'GSTPERC', 'Tax %'])) || 0;
            const disc = parseFloat(getVal(['Dis%', 'DISC %'])) || 0;
            
            if (design) hasDesign = true;
            if (colour) hasColour = true;
            if (size) hasSize = true;
            if (mrp) hasMarkdown = true;
            if (disc) hasDisc = true;

            let item_id = null;
            if (item) {
                const matchedItem = availableItems.find(i => (i.name || i.item_name || '').toLowerCase() === item.toLowerCase());
                if (matchedItem) {
                    item_id = matchedItem.id;
                } else {
                    errors.push(\`Row \${idx + 1}: Item '\${item}' not found in Master Database.\`);
                }
            }

            let brand_id = null;
            if (brand) {
                const matchedBrand = availableBrands.find(b => (b.name || '').toLowerCase() === brand.toLowerCase());
                if (matchedBrand) {
                    brand_id = matchedBrand.id;
                } else {
                    errors.push(\`Row \${idx + 1}: Brand '\${brand}' not found in Master Database.\`);
                }
            }

            return {
              id: Date.now() + idx,
              item_id,
              item,
              hsn,
              brand_id,
              brand,
              qty: qty.toString(),
              rate: rate.toString(),
              disc,
              gst,
              design,
              colour,
              size,
              mrp
            };
          }).filter(p => p.item || Number(p.qty) > 0);

          if (errors.length > 0) {
              setImportErrors(errors);
          }
`;

content = content.replace(oldMappingLogic, newMappingLogic);

// 4. Update UI to render the modal if importErrors length > 0
const modalUI = `
      {/* Import Validation Errors Modal */}
      {importErrors.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow-lg flex flex-col w-[500px] max-h-[80vh] overflow-hidden border-2 border-red-500">
            <div className="bg-red-600 text-white font-bold p-3 flex justify-between items-center shrink-0">
              <span>Import Validation Errors</span>
              <button onClick={() => setImportErrors([])} className="text-white hover:text-red-200 text-xl font-bold">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 text-sm text-slate-800">
              <p className="mb-3 font-semibold">The following records from your Excel file could not be mapped to existing database masters. Please create them first.</p>
              <ul className="list-disc pl-5 space-y-1">
                {importErrors.map((err, i) => <li key={i} className="text-red-600">{err}</li>)}
              </ul>
            </div>
            <div className="p-3 border-t bg-gray-50 flex justify-end shrink-0">
              <button onClick={() => setImportErrors([])} className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700">Acknowledge</button>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(
  "{/* Main Content Area */}",
  modalUI + "\n        {/* Main Content Area */}"
);


// 5. Fix the selection from dropdown manually to update item_id as well
// When a user selects an item from the autocomplete dropdown:
content = content.replace(
  "newProducts[index] = { ...newProducts[index], item: selected.name || selected.item_name, brand: selected.brand || '', rate: selected.purchase_price || selected.rate || '' };",
  "newProducts[index] = { ...newProducts[index], item_id: selected.id, item: selected.name || selected.item_name, brand_id: selected.brand_id || null, brand: selected.brand || '', rate: selected.purchase_price || selected.rate || '' };"
);

// When a user selects a brand from dropdown:
content = content.replace(
  "newProducts[index] = { ...newProducts[index], brand: suggestion.name || '' };",
  "newProducts[index] = { ...newProducts[index], brand_id: suggestion.id, brand: suggestion.name || '' };"
);


fs.writeFileSync(filePath, content, 'utf8');
