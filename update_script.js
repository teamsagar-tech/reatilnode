const fs = require('fs');
const filePath = 'FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add xlsx import
content = content.replace("import SearchableDropdown from '../../components/SearchableDropdown';", "import SearchableDropdown from '../../components/SearchableDropdown';\nimport * as XLSX from 'xlsx';");

// 2. Add hidden file input ref and handler
const handlerCode = `
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
          // Extract header level fields from the first row
          const firstRow: any = data[0];
          
          let newInvoiceData = { ...invoiceData };
          
          const headerMap: Record<string, keyof typeof invoiceData> = {
            'INVNO': 'billNo',
            'Doc No.': 'billNo',
            'INVDATE': 'billDate',
            'Date': 'billDate',
            'LRNO': 'lrNo',
            'TRANSPORT': 'transporter',
            'ADAT %': 'commissionPercent'
          };
          
          for (const [key, value] of Object.entries(firstRow)) {
            const trimmedKey = key.trim();
            if (headerMap[trimmedKey] && value) {
                // If it's a date, we might need to parse DD/MM/YYYY to YYYY-MM-DD
                if (headerMap[trimmedKey] === 'billDate' && typeof value === 'string') {
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
          }).filter(p => p.item || p.qty > 0);

          if (hasDesign) newInvoiceData.designNo = true;
          if (hasColour) newInvoiceData.colourNo = true;
          if (hasSize) newInvoiceData.showSize = true;
          if (hasMarkdown) newInvoiceData.showMarkdown = true;
          if (hasDisc) newInvoiceData.showPurchaseDiscount = true;

          setInvoiceData(newInvoiceData);
          setProducts(importedProducts.length > 0 ? importedProducts : [{ id: Date.now(), item: '', hsn: '', brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }]);
        }
      } catch (err) {
        console.error('Error parsing file:', err);
        alert('Failed to parse the file. Ensure it is a valid Excel or CSV.');
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };
`;

content = content.replace("const [suggestionIndex, setSuggestionIndex] = useState<number>(0);", "const [suggestionIndex, setSuggestionIndex] = useState<number>(0);\n" + handlerCode);

// 3. Update keyboard listener to support Alt+I
content = content.replace("} else if (e.code === 'KeyM') {", "} else if (e.code === 'KeyI') {\n          e.preventDefault();\n          fileInputRef.current?.click();\n        } else if (e.code === 'KeyM') {");

// 4. Add the Import UI button and file input in the Top Form (Left Panel or Right Sidebar)
// Let's add it near the top left title or in the left panel.
const inputElement = `<input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="hidden" />`;

// Let's add the button to the header
content = content.replace(
  '<div className="text-yellow-300">Purchase</div>',
  '<div className="flex gap-4 items-center"><button onClick={() => fileInputRef.current?.click()} className="bg-yellow-400 text-black px-2 py-0.5 rounded text-xs hover:bg-yellow-500 transition-colors">Import (Alt+I)</button><div className="text-yellow-300">Purchase</div></div>'
);

// add the hidden input right below <div className="flex flex-col h-screen...
content = content.replace(
  '<div className="flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full">',
  '<div className="flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full">\n        ' + inputElement
);

fs.writeFileSync(filePath, content, 'utf8');
