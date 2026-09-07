const fs = require('fs');
let content = fs.readFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'utf8');

// 1. Add importQueue state
const stateInsertIdx = content.indexOf(`  const [importErrors, setImportErrors] = useState<any[]>([]);`);
const stateReplacement = `  const [importQueue, setImportQueue] = useState<any[][]>([]);
  const [importErrors, setImportErrors] = useState<any[]>([]);`;
content = content.substring(0, stateInsertIdx) + stateReplacement + content.substring(stateInsertIdx + `  const [importErrors, setImportErrors] = useState<any[]>([]);`.length);

// 2. Wrap processing logic into a function
const processLogicStartIdx = content.indexOf(`        let errors: any[] = [];
        if (data.length > 0) {
          // Extract header level fields from the first row`);

const handleImportStartIdx = content.indexOf(`  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {`);
const handleImportEndStr = `      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };`;
const handleImportEndIdx = content.indexOf(handleImportEndStr) + handleImportEndStr.length;

let handleImportContent = content.substring(handleImportStartIdx, handleImportEndIdx);

const newProcessFunc = `  const processInvoiceGroup = (groupData: any[]) => {
    let errors: any[] = [];
    if (groupData.length > 0) {
      // Extract header level fields from the first row
      const firstRow: any = groupData[0];
      
      let newInvoiceData = { ...invoiceData };
      
      const headerMap: Record<string, keyof typeof invoiceData> = {
        'INVNO': 'billNo',
        'Doc No.': 'billNo',
        'INVDATE': 'billDate',
        'Date': 'billDate',
        'LRNO': 'lrNo',
        'TRANSPORT': 'transporter',
        'ADAT %': 'commissionPercent',
        'DISC %': 'discountPercent',
        'DISC AMT': 'discountAmount',
        'SALESPERSON': 'purchaser',
        'SUPPLIER': 'supplier',
        'PARTY': 'supplier'
      };
      
      for (const [key, value] of Object.entries(firstRow)) {
        const trimmedKey = key.trim();
        if (headerMap[trimmedKey] && value) {
            // If it's a date, we might need to parse DD/MM/YYYY to YYYY-MM-DD
            if (headerMap[trimmedKey] === 'purchaser' && typeof value === 'string') {
                const matchedUser = activeUsers.find((u: any) => 
                    value.toLowerCase().includes((u.name || '').toLowerCase()) || 
                    (u.name || '').toLowerCase().includes(value.toLowerCase())
                );
                if (matchedUser) {
                    (newInvoiceData as any)[headerMap[trimmedKey]] = matchedUser.name;
                } else {
                    (newInvoiceData as any)[headerMap[trimmedKey]] = value;
                }
            } else if (headerMap[trimmedKey] === 'supplier' && typeof value === 'string') {
                // Prevent PARTY from overwriting an already established SUPPLIER
                if (trimmedKey === 'PARTY' && (newInvoiceData as any)['supplier']) {
                    // Skip mapping PARTY because we already mapped SUPPLIER
                } else {
                    const matchedVendor = vendors.find((v: any) => 
                        value.toLowerCase().includes((v.name || '').toLowerCase()) || 
                        (v.name || '').toLowerCase().includes(value.toLowerCase())
                    );
                    if (matchedVendor) {
                        (newInvoiceData as any)[headerMap[trimmedKey]] = matchedVendor.name;
                    } else {
                        if (trimmedKey !== 'PARTY') {
                            errors.push({ idx: 1, type: 'vendor', vendor: value });
                        }
                        (newInvoiceData as any)[headerMap[trimmedKey]] = value; // Keep it so they can see what it was
                    }
                }
            } else if (headerMap[trimmedKey] === 'billDate' && typeof value === 'string') {
                const parts = value.split(/[/-]/);
                if (parts.length === 3) {
                   const d = parts[0].length === 4 ? \`\${parts[0]}-\${parts[1].padStart(2,'0')}-\${parts[2].padStart(2,'0')}\` : \`\${parts[2]}-\${parts[1].padStart(2,'0')}-\${parts[0].padStart(2,'0')}\`;
                   newInvoiceData.billDate = d;
                   newInvoiceData.receiveDate = d;
                }
            } else {
                (newInvoiceData as any)[headerMap[trimmedKey]] = value;
            }
        }
      }

      let hasDesign = false;
      let hasColour = false;
      let hasSize = false;
      let hasMarkdown = false;
      let hasDisc = false;

      const importedProducts = groupData.map((row: any, idx) => {
        const getVal = (keys: string[]) => {
          for (const k of keys) {
            if (row[k] !== undefined && row[k] !== '') return row[k];
          }
          return '';
        };

        const itemRaw = getVal(['Product Desc.', 'ITEM', 'Product Name']);
        const item = itemRaw !== undefined && itemRaw !== null ? String(itemRaw) : '';
        
        let qty = parseFloat(getVal(['Qty', 'QTY', 'Quantity']) as string);
        if (isNaN(qty) || qty === 0) {
            qty = parseFloat(getVal(['PCS', 'Pcs']) as string) || 0;
        }

        const rate = parseFloat(getVal(['Rate', 'RATE', 'PRATE']) as string) || 0;
        const hsn = getVal(['HSN', 'HSN/SAC']).toString();
        
        const brandRaw = getVal(['BRAND', 'Brand']);
        const brand = brandRaw !== undefined && brandRaw !== null ? String(brandRaw) : '';
        const design = getVal(['Design', 'DESIGN']) as string;
        const colour = getVal(['Color', 'Colour', 'COLOR', 'COLOUR']) as string;
        const size = getVal(['Size', 'SIZE']).toString();
        const mrp = parseFloat(getVal(['Mrp', 'MRP']) as string) || 0;
        const gst = parseFloat(getVal(['GST %', 'GSTPERC', 'Tax %']) as string) || 0;
        const disc = parseFloat(getVal(['Dis%', 'DISC %']) as string) || 0;
        
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
      }).filter(p => (p.item !== undefined && p.item !== null && String(p.item).trim() !== ''));

      if (errors.length > 0) {
          setImportErrors(errors);
      }

      if (hasDesign) newInvoiceData.designNo = true;
      if (hasColour) newInvoiceData.colourNo = true;
      if (hasSize) newInvoiceData.showSize = true;
      if (hasMarkdown) newInvoiceData.showMarkdown = true;
      if (hasDisc) newInvoiceData.showPurchaseDiscount = true;

      setInvoiceData(newInvoiceData);
      
      const finalProducts = importedProducts.length > 0 
        ? importedProducts.filter(p => p.item && p.item.toString().trim() !== '') 
        : [{ id: Date.now(), item_id: null, item: '', hsn: '', brand_id: null, brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }];
        
      setProducts(finalProducts.length > 0 ? finalProducts : [{ id: Date.now(), item_id: null, item: '', hsn: '', brand_id: null, brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }]);
    }
  };

  const loadNextInQueue = () => {
    if (importQueue.length > 0) {
        processInvoiceGroup(importQueue[0]);
        setImportQueue(prev => prev.slice(1));
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (data.length > 0) {
            const getValStr = (row: any, keys: string[]) => {
                for (const k of keys) {
                    if (row[k] !== undefined && row[k] !== '') return String(row[k]);
                }
                return '';
            };
            const grouped: Record<string, any[]> = {};
            let unassignedCount = 0;
            for (const row of (data as any[])) {
                const invno = getValStr(row, ['INVNO', 'Doc No.']);
                const key = invno || \`UNASSIGNED_\${++unassignedCount}\`;
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(row);
            }
            const groups = Object.values(grouped);
            
            if (groups.length > 0) {
                processInvoiceGroup(groups[0]);
                if (groups.length > 1) {
                    setImportQueue(groups.slice(1));
                }
            }
        }
      } catch (err) {
        console.error('Error parsing file:', err);
        alert('Failed to parse the file. Ensure it is a valid Excel or CSV.');
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };`;

content = content.replace(handleImportContent, newProcessFunc);

// 3. Update handleSaveInvoice to load next if available
const saveInvoiceStartIdx = content.indexOf(`  const handleSaveInvoice = () => {
    alert('Purchase Invoice Saved Successfully!');
  };`);
const saveInvoiceReplacement = `  const handleSaveInvoice = () => {
    alert('Purchase Invoice Saved Successfully!');
    if (importQueue.length > 0) {
      loadNextInQueue();
    }
  };`;
content = content.replace(`  const handleSaveInvoice = () => {
    alert('Purchase Invoice Saved Successfully!');
  };`, saveInvoiceReplacement);

// 4. Add UI banner for queue near top right
const headerTopIdx = content.indexOf(`        {/* Import Verification Banner */}`);
const bannerInsert = `        {importQueue.length > 0 && (
          <div className="bg-[#fff599] border-b-2 border-yellow-500 text-black px-4 py-2 font-bold flex justify-between items-center shadow-md z-40">
            <span>Import Queue: {importQueue.length} more invoice(s) waiting to be loaded from the imported file.</span>
            <button onClick={loadNextInQueue} className="bg-black text-white px-3 py-1 text-xs uppercase tracking-widest hover:bg-slate-800 shadow-[2px_2px_0_rgba(255,255,255,1)]">Skip & Load Next</button>
          </div>
        )}
`;
content = content.substring(0, headerTopIdx) + bannerInsert + content.substring(headerTopIdx);

fs.writeFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', content);
console.log("Successfully refactored PurchaseInvoice.tsx");
