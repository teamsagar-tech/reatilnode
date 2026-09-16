const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

const oldModalCode = `        setMasterModal({ 
          type: field === 'gst' ? 'hsn' : field as any,
          initialValue: e.currentTarget.value || '',
          rowIndex: index,
          initialBrand: field === 'item' ? (products[index].brand || (vendorAllowedBrands && vendorAllowedBrands.length === 1 ? vendorAllowedBrands[0] : '')) : undefined,
          initialBrandId: field === 'item' ? products[index].brand_id : undefined,
          initialHsn: field === 'item' ? products[index].hsn : undefined,
          initialGst: field === 'item' && products[index].gst ? String(products[index].gst) : undefined,
          initialId: field === 'item' ? products[index].item_id : undefined
        });`;

const newModalCode = `        let modalInitialId = undefined;
        let extraInitialGst = undefined;
        const val = (e.currentTarget.value || '').trim();
        
        if (field === 'item') {
          modalInitialId = products[index].item_id;
        } else if (field === 'hsn' || field === 'gst') {
          const matched = availableHsns.find(h => String(h.name) === val);
          if (matched) {
            modalInitialId = matched.id;
            extraInitialGst = String(matched.tax_percent || '');
          }
        } else if (field === 'brand') {
          const matched = availableBrands.find(b => String(b.name).toLowerCase() === val.toLowerCase());
          if (matched) modalInitialId = matched.id;
        } else if (field === 'size') {
          const matched = availableSizes.find(s => String(s.name).toLowerCase() === val.toLowerCase());
          if (matched) modalInitialId = matched.id;
        } else if (field === 'design') {
          const matched = availableDesigns.find(d => String(d.name).toLowerCase() === val.toLowerCase());
          if (matched) modalInitialId = matched.id;
        } else if (field === 'colour') {
          const matched = availableColours.find(c => String(c.name).toLowerCase() === val.toLowerCase());
          if (matched) modalInitialId = matched.id;
        }

        setMasterModal({ 
          type: field === 'gst' ? 'hsn' : field as any,
          initialValue: val,
          rowIndex: index,
          initialBrand: field === 'item' ? (products[index].brand || (vendorAllowedBrands && vendorAllowedBrands.length === 1 ? vendorAllowedBrands[0] : '')) : undefined,
          initialBrandId: field === 'item' ? products[index].brand_id : undefined,
          initialHsn: field === 'item' ? products[index].hsn : undefined,
          initialGst: field === 'item' ? (products[index].gst ? String(products[index].gst) : undefined) : extraInitialGst,
          initialId: modalInitialId
        });`;

piContent = piContent.replace(oldModalCode, newModalCode);

fs.writeFileSync(piFile, piContent);
console.log("Patched HSN edit!");
