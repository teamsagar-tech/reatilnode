const fs = require('fs');
const filePath = 'FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace the importErrors state definition
if (!content.includes("const [importErrors, setImportErrors]")) {
  content = content.replace("const [locations, setLocations] = useState<any[]>([]);", "const [locations, setLocations] = useState<any[]>([]);\n  const [importErrors, setImportErrors] = useState<any[]>([]);\n  const [isCreating, setIsCreating] = useState(false);");
}

// 2. Update the products structure in the initial state to include IDs
content = content.replace(
  "const [products, setProducts] = useState<any[]>([",
  "const [products, setProducts] = useState<any[]>([\n    { id: 1, item_id: null, item: '', brand_id: null, brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 },"
);
content = content.replace(
  "{ id: Date.now(), item: '', hsn: '', brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }",
  "{ id: Date.now(), item_id: null, item: '', hsn: '', brand_id: null, brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }"
);

// 3. Update the handleImport logic to validate and map IDs
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
          let errors: any[] = [];
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

            let brand_id = null;
            if (brand) {
                const matchedBrand = availableBrands.find(b => (b.name || '').toLowerCase() === brand.toLowerCase());
                if (matchedBrand) {
                    brand_id = matchedBrand.id;
                } else {
                    if (!errors.find(e => e.type === 'brand' && e.brand === brand)) {
                        errors.push({ idx: idx + 1, item, brand, hsn, rate, mrp, gst, type: 'brand' });
                    }
                }
            }

            let item_id = null;
            if (item) {
                const matchedItem = availableItems.find(i => (i.name || i.item_name || '').toLowerCase() === item.toLowerCase());
                if (matchedItem) {
                    item_id = matchedItem.id;
                } else {
                    errors.push({ idx: idx + 1, item, brand, hsn, rate, mrp, gst, type: 'item' });
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

// 4. Inject handler functions BEFORE subtotal calculation
const functionLogic = `
  const handleCreateMissingMaster = async (err: any) => {
    setIsCreating(true);
    try {
      if (err.type === 'brand') {
        const res = await fetch('https://api.retailnode.in/api/masters/brand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
          body: JSON.stringify({ name: err.brand, description: err.brand })
        });
        if (res.ok) {
          const newBrand = await res.json();
          const updatedBrands = [...availableBrands, { id: newBrand.id || newBrand.insertId, name: err.brand }];
          setAvailableBrands(updatedBrands);
          setImportErrors(prev => prev.filter(e => !(e.type === 'brand' && e.brand === err.brand)));
          setProducts(prev => prev.map(p => p.brand === err.brand ? { ...p, brand_id: newBrand.id || newBrand.insertId } : p));
        } else {
          alert('Failed to create brand ' + err.brand);
        }
      } else if (err.type === 'item') {
        let bId = null;
        if (err.brand) {
           const match = availableBrands.find(b => b.name.toLowerCase() === err.brand.toLowerCase());
           if (match) bId = match.id;
        }

        const res = await fetch('https://api.retailnode.in/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
          body: JSON.stringify({
            name: err.item,
            brand_id: bId,
            category_id: null,
            hsn_code: err.hsn,
            tax_percent: err.gst
          })
        });
        
        if (res.ok) {
          const newItem = await res.json();
          const createdId = newItem.id || newItem.insertId;
          setAvailableItems(prev => [...prev, { id: createdId, name: err.item, item_name: err.item, brand: err.brand, brand_id: bId }]);
          setImportErrors(prev => prev.filter(e => !(e.type === 'item' && e.item === err.item)));
          setProducts(prev => prev.map(p => p.item === err.item ? { ...p, item_id: createdId } : p));
        } else {
          alert('Failed to create item ' + err.item);
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error creating ' + err.type);
    }
    setIsCreating(false);
  };

  const handleCreateAllMissing = async () => {
    setIsCreating(true);
    const brandErrors = importErrors.filter(e => e.type === 'brand');
    for (const bErr of brandErrors) {
       await handleCreateMissingMaster(bErr);
    }
    const itemErrors = importErrors.filter(e => e.type === 'item');
    for (const iErr of itemErrors) {
       await handleCreateMissingMaster(iErr);
    }
    setIsCreating(false);
  };

`;

content = content.replace("  const subtotal = products.reduce(", functionLogic + "\  const subtotal = products.reduce(");


// 5. Add the Modal UI inside the return block
const modalUI = `
      {/* Import Validation Errors Modal */}
      {importErrors.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow-lg flex flex-col w-[800px] max-h-[80vh] overflow-hidden border-2 border-red-500">
            <div className="bg-red-600 text-white font-bold p-3 flex justify-between items-center shrink-0">
              <span>Import Validation Errors - Resolution Hub</span>
              <button onClick={() => setImportErrors([])} className="text-white hover:text-red-200 text-xl font-bold">&times;</button>
            </div>
            
            <div className="p-4 flex justify-between items-center bg-red-50 shrink-0 border-b">
              <p className="font-semibold text-red-800">The following records from your Excel file do not exist in your database.</p>
              <button 
                onClick={handleCreateAllMissing} 
                disabled={isCreating}
                className="bg-green-600 text-white px-3 py-1 rounded font-bold hover:bg-green-700 disabled:opacity-50 cursor-pointer"
              >
                {isCreating ? 'Creating...' : 'Create All Missing Masters'}
              </button>
            </div>

            <div className="overflow-y-auto flex-1 text-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 sticky top-0">
                  <tr className="border-b font-bold text-slate-700 text-[12px]">
                    <th className="p-2">Row</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Brand/HSN</th>
                    <th className="p-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {importErrors.map((err, i) => (
                    <tr key={i} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 text-slate-500">{err.idx}</td>
                      <td className="p-2 font-bold text-red-600 uppercase text-[10px]">{err.type}</td>
                      <td className="p-2 font-bold">{err.type === 'item' ? err.item : err.brand}</td>
                      <td className="p-2 text-xs text-slate-600">
                        {err.type === 'item' ? \`Brand: \${err.brand || '-'} | HSN: \${err.hsn}\` : '-'}
                      </td>
                      <td className="p-2 text-right">
                        <button 
                          onClick={() => handleCreateMissingMaster(err)} 
                          disabled={isCreating}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-[11px] font-bold hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                        >
                          Create {err.type}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(
  "{/* Main Content Area */}",
  modalUI + "\n        {/* Main Content Area */}"
);


// 6. Fix the selection from dropdown manually to update item_id as well
content = content.replace(
  "newProducts[index] = { ...newProducts[index], item: selected.name || selected.item_name, brand: selected.brand || '', rate: selected.purchase_price || selected.rate || '' };",
  "newProducts[index] = { ...newProducts[index], item_id: selected.id, item: selected.name || selected.item_name, brand_id: selected.brand_id || null, brand: selected.brand || '', rate: selected.purchase_price || selected.rate || '' };"
);

content = content.replace(
  "newProducts[index] = { ...newProducts[index], brand: suggestion.name || '' };",
  "newProducts[index] = { ...newProducts[index], brand_id: suggestion.id, brand: suggestion.name || '' };"
);

fs.writeFileSync(filePath, content, 'utf8');
