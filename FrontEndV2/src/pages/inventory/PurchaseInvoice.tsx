import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MultiAttributeModal from '../../components/inventory/MultiAttributeModal';
import SizeAllocationModal from '../../components/inventory/SizeAllocationModal';
import PartyModal from '../../components/inventory/PartyModal';
import TransporterModal from '../../components/inventory/TransporterModal';
import MasterCreationModal from '../../components/inventory/MasterCreationModal';
import SearchableDropdown from '../../components/SearchableDropdown';
import * as XLSX from 'xlsx';

export default function PurchaseInvoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? 'Option' : 'Alt';

  const [isReadOnly, setIsReadOnly] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState<number | null>(null);

  const [invoiceData, setInvoiceData] = useState({
    invoiceDate: new Date().toISOString().split('T')[0],
    supplier: '',
    firm: '',
    location: '',
    purchaser: '',
    requireBoxPacking: false,
    taxType: 'CGST_SGST' as 'IGST' | 'CGST_SGST',
    discountPercent: 0,
    discountAmount: 0,
    commissionPercent: 0,
    commissionAmount: 0,
    taxPercent: 18,
    charges: 0,
    roundOff: 0,
    orderNo: '',
    otherChargesType: '+' as '+' | '-',
    otherChargesAmount: 0,
    transporter: '',
    lrNo: '',
    bale: '',
    billNo: '',
    billDate: new Date().toISOString().split('T')[0],
    receiveDate: '',
    totalQuantity: '',
    billAmount: '',
    poNo: '',
    narration: '',
    paymentTerms: '',
    gstOn: 'items' as 'items' | 'bill',
    designNo: false,
    colourNo: false,
    showSize: true,
    showCutSize: false,
    showLocation: true,
    showPurchaseDiscount: false,
    showMarkdown: false
  });

  const [products, setProducts] = useState<any[]>([
    { id: 1, item_id: null, item: '', brand_id: null, brand: '', qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0, attributes: [] }
  ]);
  const [cuts, setCuts] = useState<any[]>([]);

  useEffect(() => {
    const id = location.state?.invoiceId;
    if (id) {
      setEditInvoiceId(id);
      if (location.state?.mode === 'view') {
        setIsReadOnly(true);
      }
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/purchase-invoices/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => {
         if (!data.error) {
           setInvoiceData(prev => ({
             ...prev,
             billNo: data.bill_no || '',
             billDate: data.bill_date ? data.bill_date.split('T')[0] : '',
             receiveDate: data.receive_date ? data.receive_date.split('T')[0] : '',
             supplier: data.vendor_name || '',
             billAmount: data.total_amount || '',
             discountPercent: Number(data.discount_percent) || 0,
             discountAmount: Number(data.discount_amount) || 0,
             commissionPercent: Number(data.commission_percent) || 0,
             commissionAmount: Number(data.commission_amount) || 0,
             lrNo: data.lr_no || '',
             transporter: data.transporter || '',
             bale: data.bales || '',
             narration: data.narration || ''
           }));
           if (data.items && data.items.length > 0) {
             const mappedProducts = data.items.map((item: any, idx: number) => {
               let sizeStr = '';
               let colorStr = '';
               let designStr = '';
               
               if (item.attributes && item.attributes.length === 1) {
                 sizeStr = item.attributes[0].size_name || '';
                 colorStr = item.attributes[0].color_name || '';
                 designStr = item.attributes[0].design_name || '';
               } else if (item.attributes && item.attributes.length > 1) {
                 sizeStr = 'Multi';
                 colorStr = 'Multi';
                 designStr = 'Multi';
               }

               return {
                 id: Date.now() + idx,
                 item_id: item.item_id,
                 item: item.item_name || '',
                 hsn: item.hsn_code || '',
                 brand_id: item.brand_id,
                 brand: item.brand_name || '', 
                 qty: item.total_qty || '',
                 rate: item.purchase_rate || '',
                 disc: 0, 
                 gst: item.gst_percent || 0,
                 mrp: item.mrp || 0,
                 size: sizeStr,
                 colour: colorStr,
                 design: designStr,
                 attributes: item.attributes ? item.attributes.map((a: any) => ({
                   size: a.size_name || '',
                   size_id: a.size_id || null,
                   color: a.color_name || '',
                   color_id: a.color_id || null,
                   design: a.design_name || '',
                   design_id: a.design_id || null,
                   qty: a.qty || 0,
                   barcode: a.barcode || ''
                 })) : []
               };
             });
             setProducts(mappedProducts);
           }
         }
      })
      .catch(console.error);
    }
  }, [location.state]);

  const [activeSuggestionRow, setActiveSuggestionRow] = useState<number | null>(null);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  
  const handleSaveInvoice = async () => {
    if (!invoiceData.supplier) {
      alert('Party is required');
      return;
    }
    
    const matchedVendor = vendors.find(v => (v.name || '').toLowerCase() === (invoiceData.supplier || '').toLowerCase());
    if (!matchedVendor) {
      alert('Invalid Party selected. Please ensure the Party exists.');
      return;
    }

    const subtotal = products.reduce((acc: any, p: any) => acc + ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100)), 0);
    const taxableAmount = subtotal;
    const calcDiscount = invoiceData.discountPercent > 0 
      ? (taxableAmount * invoiceData.discountPercent / 100) 
      : invoiceData.discountAmount;
    const afterDiscount = taxableAmount - calcDiscount;
    const calcCommission = invoiceData.commissionPercent > 0
      ? (afterDiscount * invoiceData.commissionPercent / 100)
      : invoiceData.commissionAmount;
    const afterCommission = afterDiscount + calcCommission;
    let tax = 0;
    if (invoiceData.gstOn === 'items') {
      const ratio = subtotal > 0 ? (afterCommission / subtotal) : 1;
      tax = products.reduce((acc: any, p: any) => {
        const lineAmount = (p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100);
        const lineTaxable = lineAmount * ratio;
        return acc + (lineTaxable * (p.gst || 0) / 100);
      }, 0);
    } else {
      tax = afterCommission * (invoiceData.taxPercent || 0) / 100;
    }
    const otherCharges = (invoiceData.otherChargesType === '-' ? -1 : 1) * invoiceData.otherChargesAmount;
    const grandTotal = Math.round(afterCommission + tax + otherCharges);

    const payload = {
      vendor_id: matchedVendor.id,
      bill_no: invoiceData.billNo,
      bill_date: invoiceData.billDate || null,
      receive_date: invoiceData.receiveDate || null,
      total_amount: taxableAmount || 0,
      discount_percent: invoiceData.discountPercent || 0,
      discount_amount: calcDiscount || 0,
      commission_percent: invoiceData.commissionPercent || 0,
      commission_amount: calcCommission || 0,
      gst_amount: tax || 0,
      net_amount: grandTotal || 0,
      lr_no: invoiceData.lrNo || null,
      transporter: invoiceData.transporter || null,
      bales: Number(invoiceData.bale) || null,
      narration: invoiceData.narration || '',
      items: products.filter((p: any) => p.item_id).map((p: any) => ({
        item_id: p.item_id,
        category_id: null,
        brand_id: p.brand_id || null,
        purchase_rate: Number(p.rate) || 0,
        mrp: Number(p.mrp) || 0,
        total_qty: Number(p.qty) || 0,
        gst_percent: Number(p.gst) || 0,
        gst_amount: 0,
        total_amount: (Number(p.rate) * Number(p.qty)) || 0,
        attributes: p.attributes || []
      }))
    };

    if (payload.items.length === 0) {
      alert('At least one valid item is required to save. Debug payload: ' + JSON.stringify(products.map(p => ({ item: p.item, item_id: p.item_id, brand: p.brand, brand_id: p.brand_id }))));
      return;
    }

    try {
      const url = editInvoiceId 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/purchase-invoices/${editInvoiceId}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/purchase-invoices`;
        
      const res = await fetch(url, {
        method: editInvoiceId ? 'PUT' : 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save invoice');
      }

      alert(`Purchase Invoice Saved Successfully! GRN No: ${data.grn_no}`);
      if (importQueue.length > 0) {
        loadNextInQueue();
      } else {
        // Clear form if no queue
        setInvoiceData({
            supplier: '', billNo: '', billDate: new Date().toISOString().split('T')[0], receiveDate: new Date().toISOString().split('T')[0],
            totalQuantity: '', billAmount: '', showLocation: false,
            designNo: false, colourNo: false, showSize: false, showPurchaseDiscount: false, showMarkdown: false,
            poNo: '', orderBy: '', transporter: '', lrNo: '', bale: '', narration: '',
            discountPercent: 0, discountAmount: 0, commissionPercent: 0, 
            cgstPercent: 'Auto', sgstPercent: 'Auto', otherCharges: 0, purchaser: ''
        });
        setProducts([{ id: Date.now(), item_id: null, item: '', hsn: '', brand_id: null, brand: '', qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }]);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'An error occurred while saving the invoice.');
    }
  };

  const processInvoiceGroup = (groupData: any[]) => {
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
            } else if (headerMap[trimmedKey] === 'billDate') {
                let dStr = '';
                if (typeof value === 'number') {
                    const date = new Date(Math.round((value - 25569) * 86400 * 1000));
                    dStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                } else if (typeof value === 'string') {
                    const parts = value.split(/[/-]/);
                    if (parts.length === 3) {
                       dStr = parts[0].length === 4 ? `${parts[0]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}` : `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
                    }
                }
                if (dStr) {
                   newInvoiceData.billDate = dStr;
                   newInvoiceData.receiveDate = dStr;
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
      }).filter(p => {
          const hasItem = p.item && String(p.item).trim() !== '';
          const hasBrand = p.brand && String(p.brand).trim() !== '';
          const hasQty = parseFloat(p.qty) > 0;
          const hasRate = parseFloat(p.rate) > 0;
          return hasItem || hasBrand || hasQty || hasRate;
      });

      if (errors.length > 0) {
          setImportErrors(errors);
      }

      if (hasDesign) newInvoiceData.designNo = true;
      if (hasColour) newInvoiceData.colourNo = true;
      if (hasSize) newInvoiceData.showSize = true;
      if (hasMarkdown) newInvoiceData.showMarkdown = true;
      if (hasDisc) newInvoiceData.showPurchaseDiscount = true;

      // Calculate Total Qty and Bill Amount from CSV rows
      let sumQty = 0;
      let sumAmt = 0;
      for (const p of importedProducts) {
          sumQty += parseFloat(p.qty) || 0;
      }
      for (const row of groupData) {
          const getVal = (keys: string[]) => {
            for (const k of keys) {
              if (row[k] !== undefined && row[k] !== '') return row[k];
            }
            return '';
          };
          sumAmt += parseFloat(getVal(['NET AMT', 'Net Amount', 'Amount']) as string) || 0;
      }
      if (sumQty > 0) newInvoiceData.totalQuantity = sumQty.toString();
      if (sumAmt > 0) newInvoiceData.billAmount = sumAmt.toFixed(2);

      setInvoiceData(newInvoiceData);
      
      const finalProducts = importedProducts.length > 0 
        ? importedProducts
        : [{ id: Date.now(), item_id: null, item: '', hsn: '', brand_id: null, brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }];
        
      setProducts(finalProducts);
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
    setSkippedCount(0);

    const reader = new FileReader();
    reader.onload = async (evt) => {
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
                const key = invno || `UNASSIGNED_${++unassignedCount}`;
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(row);
            }
            let groups = Object.values(grouped);
            
            // Check which invoices already exist
            const checkPayload = groups.map(g => {
                const firstRow = g[0];
                const bill_no = getValStr(firstRow, ['INVNO', 'Doc No.']);
                const supplierName = getValStr(firstRow, ['SUPPLIER', 'PARTY']);
                const matchedVendor = vendors.find(v => (v.name || '').toLowerCase() === supplierName.toLowerCase());
                return {
                    bill_no,
                    vendor_id: matchedVendor ? matchedVendor.id : null
                };
            }).filter(p => p.bill_no && p.vendor_id);
            
            if (checkPayload.length > 0) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/purchase-invoices/check-bulk`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ invoices: checkPayload })
                    });
                    if (res.ok) {
                        const { existing } = await res.json();
                        if (existing && existing.length > 0) {
                            const existingKeys = new Set(existing.map((e: any) => `${e.vendor_id}_${e.bill_no}`));
                            const originalLength = groups.length;
                            groups = groups.filter(g => {
                                const firstRow = g[0];
                                const bill_no = getValStr(firstRow, ['INVNO', 'Doc No.']);
                                const supplierName = getValStr(firstRow, ['SUPPLIER', 'PARTY']);
                                const matchedVendor = vendors.find(v => (v.name || '').toLowerCase() === supplierName.toLowerCase());
                                if (matchedVendor && bill_no) {
                                    if (existingKeys.has(`${matchedVendor.id}_${bill_no}`)) return false;
                                }
                                return true;
                            });
                            const skipped = originalLength - groups.length;
                            if (skipped > 0) {
                                setSkippedCount(skipped);
                            }
                        }
                    }
                } catch(e) {
                    console.error("Error checking bulk existing", e);
                }
            }
            
            if (groups.length > 0) {
                processInvoiceGroup(groups[0]);
                if (groups.length > 1) {
                    setImportQueue(groups.slice(1));
                }
            } else {
                alert('No new invoices to import (all invoices in the CSV were already saved).');
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
  };


  // Multi-Attribute Modal State
  const [activeModalRow, setActiveModalRow] = useState<number | null>(null);
  const [activeSizeMatrixRow, setActiveSizeMatrixRow] = useState<number | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [showTransporterModal, setShowTransporterModal] = useState(false);
  const [masterModal, setMasterModal] = useState<{ type: 'brand' | 'size' | 'item' | 'hsn' | 'design' | 'colour', initialValue: string, rowIndex: number, initialBrand?: string, initialBrandId?: number | null } | null>(null);
  const [masterCreationState, setMasterCreationState] = useState<{isOpen: boolean; type: string; initialValue: string; category?: string; subcategory?: string}>({
      isOpen: false, type: '', initialValue: ''
  });

  const [showPurchaserDropdown, setShowPurchaserDropdown] = useState(false);
  const [purchaserIndex, setPurchaserIndex] = useState(0);

  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [supplierIndex, setSupplierIndex] = useState(0);

  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);
  const [brandSuggestionIndex, setBrandSuggestionIndex] = useState(0);
  const [activeBrandRow, setActiveBrandRow] = useState<number | null>(null);
  
  const [availableHsns, setAvailableHsns] = useState<any[]>([]);
  const [hsnSuggestionIndex, setHsnSuggestionIndex] = useState(0);
  const [activeHsnRow, setActiveHsnRow] = useState<number | null>(null);

  const [availableDesigns, setAvailableDesigns] = useState<any[]>([]);
  const [designSuggestionIndex, setDesignSuggestionIndex] = useState(0);
  const [activeDesignRow, setActiveDesignRow] = useState<number | null>(null);

  const [availableColours, setAvailableColours] = useState<any[]>([]);
  const [colourSuggestionIndex, setColourSuggestionIndex] = useState(0);
  const [activeColourRow, setActiveColourRow] = useState<number | null>(null);
  
  const [locations, setLocations] = useState<any[]>([]);
  const [importQueue, setImportQueue] = useState<any[][]>([]);
  const [skippedCount, setSkippedCount] = useState(0);
  const [importErrors, setImportErrors] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Fetch Items
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/items`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAvailableItems(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Fetch Designs
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/designs`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAvailableDesigns(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Fetch Colours
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/colors`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAvailableColours(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Fetch Brands
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/brand`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAvailableBrands(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Fetch Locations
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/Locations`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setLocations(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Fetch Vendors (from Parties)
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/party`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        const parties = Array.isArray(data) ? data : (data.data || []);
        const mappedVendors = parties.map((p: any) => ({
          ...p,
          name: p.party_name
        }));
        setVendors(mappedVendors);
      })
      .catch(err => console.error("Error fetching parties as vendors:", err));

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/transporters`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setTransporters(Array.isArray(data) ? data : (data.data || [])))
      .catch(err => console.error("Error fetching transporters:", err));

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/cut`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setCuts(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching cuts:", err));

    // Fetch Purchasers
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/purchasers`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setActiveUsers(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Fetch HSNs
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/hsnsacs`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAvailableHsns(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Auto-focus first field
    setTimeout(() => {
      document.getElementById('input-orderNo')?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showPartyModal) setShowPartyModal(false);
        else if (showTransporterModal) setShowTransporterModal(false);
        else if (masterCreationState.isOpen) setMasterCreationState({ ...masterCreationState, isOpen: false });
        else if (showSupplierDropdown) setShowSupplierDropdown(false);
        else if (showPurchaserDropdown) setShowPurchaserDropdown(false);
        else if (activeSuggestionRow !== null) setActiveSuggestionRow(null);
        else if (activeHsnRow !== null) setActiveHsnRow(null);
        else navigate(-1);
      }
      
      if (e.altKey) {
        if (e.code === 'KeyS') {
          e.preventDefault();
          console.log('Submit Order');
        } else if (e.code === 'KeyD') {
          e.preventDefault();
          console.log('Save Draft');
        } else if (e.code === 'KeyB') {
          e.preventDefault();
          setInvoiceData(prev => ({ ...prev, requireBoxPacking: !prev.requireBoxPacking }));
        } else if (e.code === 'KeyZ') {
          e.preventDefault();
          setInvoiceData(prev => ({ ...prev, designNo: !prev.designNo }));
        } else if (e.code === 'KeyX') {
          e.preventDefault();
          setInvoiceData(prev => ({ ...prev, showSize: !prev.showSize }));
        } else if (e.code === 'KeyL') {
          e.preventDefault();
          setInvoiceData(prev => ({ ...prev, showLocation: !prev.showLocation }));
        } else if (e.code === 'KeyV') {
          e.preventDefault();
          setInvoiceData(prev => ({ ...prev, showPurchaseDiscount: !prev.showPurchaseDiscount }));
        } else if (e.code === 'KeyI') {
          e.preventDefault();
          fileInputRef.current?.click();
        } else if (e.code === 'KeyM') {
          e.preventDefault();
          setInvoiceData(prev => ({ ...prev, showMarkdown: !prev.showMarkdown }));
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showSupplierDropdown, showPurchaserDropdown, activeSuggestionRow, showPartyModal, showTransporterModal, navigate]);


  const handleInvoiceChange = (field: string, value: any) => {
    setInvoiceData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'supplier') {
        const matchedVendor = vendors.find(v => (v.name || '').toLowerCase() === (value || '').toLowerCase());
        if (matchedVendor) {
           let catString = '';
           if (typeof matchedVendor.categories === 'string') {
              catString = matchedVendor.categories.toLowerCase();
           } else if (Array.isArray(matchedVendor.categories)) {
              catString = JSON.stringify(matchedVendor.categories).toLowerCase();
           }
           if (catString.includes('suit') || catString.includes('shirt')) {
              next.designNo = true;
              next.colourNo = true;
              next.showSize = false;
              next.showCutSize = true;
           } else if (catString.includes('ready')) {
              next.showSize = true;
              next.showCutSize = false;
           }
        }
      }
      return next;
    });
  };

  const updateProduct = (index: number, field: string, value: any) => {
    setProducts(prev => {
      const newProducts = [...prev];
      newProducts[index] = { ...newProducts[index], [field]: value };
      return newProducts;
    });
  };

  const addProduct = () => {
    setProducts([...products, { id: Date.now(), item: '', hsn: '', brand: '', qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }]);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };

  const fetchLastRate = async (itemId: number, index: number) => {
    const matchedVendor = vendors.find(v => (v.name || '').toLowerCase() === (invoiceData.supplier || '').toLowerCase());
    if (!matchedVendor || !itemId) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/purchase-invoices/last-rate?vendor_id=${matchedVendor.id}&item_id=${itemId}`, {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.rate) {
          setProducts(prev => {
             const newP = [...prev];
             newP[index] = { ...newP[index], last_rate: data.rate };
             return newP;
          });
        }
      }
    } catch (e) {
      console.error('Error fetching last rate:', e);
    }
  };

  const handleLRNoBlur = async () => {
    if (invoiceData.transporter && invoiceData.lrNo) {
      const matchedTransporter = transporters.find(t => (t.name || '').toLowerCase() === invoiceData.transporter.toLowerCase());
      if (matchedTransporter && matchedTransporter.id) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/purchase-invoices/check-lr?transporter_id=${matchedTransporter.id}&lr_no=${encodeURIComponent(invoiceData.lrNo)}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.exists) {
              alert(`Warning: LR No ${invoiceData.lrNo} already exists for this transporter in invoice ${data.invoice_number}!`);
            }
          }
        } catch (err) {
          console.error('Error checking LR No:', err);
        }
      }
    }
  };

  const handleHeaderKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById(nextFieldId)?.focus();
    }
  };

  
  const getVendorBrandConfig = () => {
    const matchedVendor = vendors.find(v => (v.name || '').toLowerCase() === (invoiceData.supplier || '').toLowerCase());
    if (!matchedVendor) return { isSingle: false, allowedBrands: null };
    
    let vendorBrands = [];
    try {
      vendorBrands = typeof matchedVendor.brands === 'string' ? JSON.parse(matchedVendor.brands) : (matchedVendor.brands || []);
    } catch(e) {}
    
    // Map to objects if they are strings, but the schema seems to save an array of strings? Or array of objects {name}? 
    // In partyController it saves the JSON. Let's extract names.
    const allowedBrandNames = vendorBrands.map(b => typeof b === 'string' ? b : b.name).filter(Boolean);
    
    return {
      isSingle: matchedVendor.brand_type === 'Single',
      allowedBrands: allowedBrandNames.length > 0 ? allowedBrandNames : null
    };
  };

  const { isSingle: isSingleBrandVendor, allowedBrands: vendorAllowedBrands } = getVendorBrandConfig();

  // Determine if a single brand is already locked in (for Single Brand parties)
  const lockedBrand = isSingleBrandVendor ? (products.find(p => p.brand)?.brand || null) : null;


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, field: string) => {
    const fields = ['brand', 'item', 'hsn'];
    if (invoiceData.designNo) fields.push('design');
    if (invoiceData.colourNo) fields.push('colour');
    if (invoiceData.showSize) fields.push('size');
    fields.push('qty', 'rate');
    if (invoiceData.showPurchaseDiscount) fields.push('disc');
    if (invoiceData.showMarkdown) fields.push('mrp');
    if (invoiceData.gstOn === 'items') fields.push('gst');

    const currentFieldIndex = fields.indexOf(field);

    if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')) {
      e.preventDefault();
      if (['brand', 'size', 'item', 'gst', 'hsn', 'design', 'colour'].includes(field)) {
        if (field === 'brand' && vendorAllowedBrands !== null) {
          alert('This party has specific brands assigned. You cannot create a new brand on the fly.');
          return;
        }
        if (field === 'item' && vendorAllowedBrands !== null) {
          alert('This party has specific allowed brands. You cannot create a new item on the fly.');
          return;
        }
        setMasterModal({ 
          type: field === 'gst' ? 'hsn' : field as any,
          initialValue: e.currentTarget.value || '',
          rowIndex: index,
          initialBrand: field === 'item' ? products[index].brand : undefined,
          initialBrandId: field === 'item' ? products[index].brand_id : undefined
        });
      }
      return;
    }

    if (field === 'brand' && activeBrandRow === index) {
      const query = (products[index].brand || '').toLowerCase();
      let baseBrands = availableBrands;
      if (vendorAllowedBrands !== null) {
        baseBrands = baseBrands.filter(b => vendorAllowedBrands.some(vb => vb.toLowerCase() === (b.name || '').toLowerCase()));
      }
      if (isSingleBrandVendor && lockedBrand) {
        baseBrands = baseBrands.filter(b => b.name === lockedBrand);
      }
      const filtered = baseBrands.filter(b => (b.name || '').toLowerCase().startsWith(query)).slice(0, 8);
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setBrandSuggestionIndex(prev => Math.min(prev + 1, filtered.length - 1));
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setBrandSuggestionIndex(prev => Math.max(prev - 1, 0));
        return;
      } else if (e.key === 'Enter' || ((e.key === 'Tab' || e.key === 'ArrowRight') && query.trim() !== '')) {
        if (filtered.length > 0) {
          e.preventDefault();
          const selected = filtered[brandSuggestionIndex];
          const newProducts = [...products];
          newProducts[index] = { ...newProducts[index], brand_id: selected.id, brand: selected.name || '' };
          setProducts(newProducts);
          setActiveBrandRow(null);
          document.getElementById(`row-${index}-item`)?.focus();
          return;
        } else if (query.trim() !== '' && vendorAllowedBrands === null) {
          e.preventDefault();
          setMasterModal({ 
            type: 'brand',
            initialValue: e.currentTarget.value || '',
            rowIndex: index
          });
          return;
        }
      }
    }

    if (field === 'hsn' && activeHsnRow === index) {
      const query = (products[index].hsn || '').toLowerCase();
      const filtered = availableHsns.filter(s => (s.name || '').toLowerCase().startsWith(query)).slice(0, 8);
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHsnSuggestionIndex(prev => Math.min(prev + 1, filtered.length - 1));
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHsnSuggestionIndex(prev => Math.max(prev - 1, 0));
        return;
      } else if (e.key === 'Enter' || ((e.key === 'Tab' || e.key === 'ArrowRight') && query.trim() !== '')) {
        if (filtered.length > 0) {
          e.preventDefault();
          const selected = filtered[hsnSuggestionIndex];
          const newProducts = [...products];
          newProducts[index] = { 
            ...newProducts[index], 
            hsn: selected.name || '', 
            gst: selected.tax_percent !== undefined ? selected.tax_percent : (newProducts[index].gst || 0) 
          };
          setProducts(newProducts);
          setActiveHsnRow(null);
          const nextField = fields[fields.indexOf('hsn') + 1];
          if (nextField) {
            document.getElementById(`row-${index}-${nextField}`)?.focus();
          }
          return;
        } else if (query.trim() !== '') {
          e.preventDefault();
          setMasterModal({ 
            type: 'hsn',
            initialValue: e.currentTarget.value || '',
            rowIndex: index
          });
          return;
        }
      }
    }

    if (field === 'design' && activeDesignRow === index) {
      const query = (products[index].design || '').toLowerCase();
      const filtered = availableDesigns.filter(s => (s.name || '').toLowerCase().startsWith(query)).slice(0, 8);
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setDesignSuggestionIndex(prev => Math.min(prev + 1, filtered.length - 1));
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setDesignSuggestionIndex(prev => Math.max(prev - 1, 0));
        return;
      } else if (e.key === 'Enter' || ((e.key === 'Tab' || e.key === 'ArrowRight') && query.trim() !== '')) {
        if (filtered.length > 0) {
          e.preventDefault();
          const selected = filtered[designSuggestionIndex];
          const newProducts = [...products];
          newProducts[index] = { 
            ...newProducts[index], 
            design: selected.name || ''
          };
          setProducts(newProducts);
          setActiveDesignRow(null);
          const nextField = fields[fields.indexOf('design') + 1];
          if (nextField) {
            document.getElementById(`row-${index}-${nextField}`)?.focus();
          }
          return;
        } else if (query.trim() !== '') {
          e.preventDefault();
          setMasterModal({ 
            type: 'design',
            initialValue: e.currentTarget.value || '',
            rowIndex: index
          });
          return;
        }
      }
    }

    if (field === 'colour' && activeColourRow === index) {
      const query = (products[index].colour || '').toLowerCase();
      const filtered = availableColours.filter(s => (s.name || '').toLowerCase().startsWith(query)).slice(0, 8);
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setColourSuggestionIndex(prev => Math.min(prev + 1, filtered.length - 1));
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setColourSuggestionIndex(prev => Math.max(prev - 1, 0));
        return;
      } else if (e.key === 'Enter' || ((e.key === 'Tab' || e.key === 'ArrowRight') && query.trim() !== '')) {
        if (filtered.length > 0) {
          e.preventDefault();
          const selected = filtered[colourSuggestionIndex];
          const newProducts = [...products];
          newProducts[index] = { 
            ...newProducts[index], 
            colour: selected.name || ''
          };
          setProducts(newProducts);
          setActiveColourRow(null);
          const nextField = fields[fields.indexOf('colour') + 1];
          if (nextField) {
            document.getElementById(`row-${index}-${nextField}`)?.focus();
          }
          return;
        } else if (query.trim() !== '') {
          e.preventDefault();
          setMasterModal({ 
            type: 'colour',
            initialValue: e.currentTarget.value || '',
            rowIndex: index
          });
          return;
        }
      }
    }

    if (field === 'item' && activeSuggestionRow === index) {
      const query = products[index].item.toLowerCase();
      const rowBrandId = products[index].brand_id;
      const rowBrandName = (products[index].brand || '').toLowerCase();
      const filtered = availableItems.filter(s => {
        const textMatch = (s.name || s.item_name || '').toLowerCase().includes(query);
        if (rowBrandId) return textMatch && String(s.brand_id) === String(rowBrandId);
        if (vendorAllowedBrands !== null) {
           const isAllowed = vendorAllowedBrands.some(vb => vb.toLowerCase() === (s.brand || '').toLowerCase());
           return textMatch && isAllowed;
        }
        return textMatch;
      }).slice(0, 8);
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex(prev => Math.min(prev + 1, filtered.length - 1));
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex(prev => Math.max(prev - 1, 0));
        return;
      } else if (e.key === 'Enter' || ((e.key === 'Tab' || e.key === 'ArrowRight') && query.trim() !== '')) {
        if (filtered.length > 0) {
          e.preventDefault();
          const selected = filtered[suggestionIndex];
          const newProducts = [...products];
          newProducts[index] = { 
            ...newProducts[index], 
            item_id: selected.id, 
            item: selected.name || selected.item_name, 
            brand_id: selected.brand_id || null, 
            brand: selected.brand || newProducts[index].brand || '', 
            rate: selected.purchase_price || selected.rate || newProducts[index].rate || '',
            hsn: selected.hsn_code || selected.hsn || newProducts[index].hsn || '',
            gst: selected.tax_percent !== undefined ? selected.tax_percent : (newProducts[index].gst || 0)
          };
          setProducts(newProducts);
          setActiveSuggestionRow(null);
          
          fetchLastRate(selected.id, index);
          
          const nextField = fields[fields.indexOf('item') + 1];
          if (nextField) {
            setTimeout(() => {
              document.getElementById(`row-${index}-${nextField}`)?.focus();
            }, 10);
          }
          return;
        } else if (query.trim() !== '' && vendorAllowedBrands === null) {
          e.preventDefault();
          setMasterModal({ 
            type: 'item',
            initialValue: e.currentTarget.value || '',
            rowIndex: index,
            initialBrand: products[index].brand,
            initialBrandId: products[index].brand_id
          });
          return;
        }
      }
    }

    if (e.key === 'Enter' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentFieldIndex < fields.length - 1 && document.getElementById(`row-${index}-${fields[currentFieldIndex + 1]}`)) {
        document.getElementById(`row-${index}-${fields[currentFieldIndex + 1]}`)?.focus();
      } else {
        if (index === products.length - 1) {
          addProduct();
          setTimeout(() => {
            document.getElementById(`row-${index + 1}-brand`)?.focus();
          }, 10);
        } else {
          document.getElementById(`row-${index + 1}-brand`)?.focus();
        }
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentFieldIndex > 0 && document.getElementById(`row-${index}-${fields[currentFieldIndex - 1]}`)) {
        e.preventDefault();
        document.getElementById(`row-${index}-${fields[currentFieldIndex - 1]}`)?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      if (index > 0) {
        e.preventDefault();
        document.getElementById(`row-${index - 1}-${field}`)?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      if (index < products.length - 1) {
        e.preventDefault();
        document.getElementById(`row-${index + 1}-${field}`)?.focus();
      }
    }
  };

  const handleItemFocus = (e: React.FocusEvent<HTMLInputElement>, index: number) => {
    e.target.select();
    setActiveSuggestionRow(index);
    setSuggestionIndex(0);
  };

  const handleItemBlur = () => {
    setTimeout(() => setActiveSuggestionRow(null), 200);
  };

  const handleBrandFocus = (e: React.FocusEvent<HTMLInputElement>, index: number) => {
    e.target.select();
    setActiveBrandRow(index);
    setBrandSuggestionIndex(0);
  };

  const handleBrandBlur = () => {
    setTimeout(() => setActiveBrandRow(null), 200);
  };

  const handleHsnFocus = (e: React.FocusEvent<HTMLInputElement>, index: number) => {
    e.target.select();
    setActiveHsnRow(index);
    setHsnSuggestionIndex(0);
  };

  const handleHsnBlur = () => {
    setTimeout(() => setActiveHsnRow(null), 200);
  };

  const handleDesignFocus = (e: React.FocusEvent<HTMLInputElement>, index: number) => {
    e.target.select();
    setActiveDesignRow(index);
    setDesignSuggestionIndex(0);
  };

  const handleDesignBlur = () => {
    setTimeout(() => setActiveDesignRow(null), 200);
  };

  const handleColourFocus = (e: React.FocusEvent<HTMLInputElement>, index: number) => {
    e.target.select();
    setActiveColourRow(index);
    setColourSuggestionIndex(0);
  };

  const handleColourBlur = () => {
    setTimeout(() => setActiveColourRow(null), 200);
  };

  const handleCreateMissingMaster = async (err: any) => {
    setIsCreating(true);
    try {
      if (err.type === 'brand') {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/brand`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
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

        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
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
      } else if (err.type === 'vendor') {
        setShowPartyModal(true);
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

  const subtotal = products.reduce((acc, p) => acc + ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100)), 0);
  const totalQty = products.reduce((acc, p) => acc + (parseFloat(p.qty) || 0), 0);
  
  const taxableAmount = subtotal;
  
  // Discount
  const calcDiscount = invoiceData.discountPercent > 0 
    ? (taxableAmount * invoiceData.discountPercent / 100) 
    : invoiceData.discountAmount;
  const afterDiscount = taxableAmount - calcDiscount;

  // Commission (ADAT is usually added to the cost)
  const calcCommission = invoiceData.commissionPercent > 0
    ? (afterDiscount * invoiceData.commissionPercent / 100)
    : invoiceData.commissionAmount;
  const afterCommission = afterDiscount + calcCommission;

  // Tax
  let tax = 0;
  if (invoiceData.gstOn === 'items') {
    const ratio = subtotal > 0 ? (afterCommission / subtotal) : 1;
    tax = products.reduce((acc, p) => {
      const lineAmount = (p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100);
      const lineTaxable = lineAmount * ratio;
      return acc + (lineTaxable * (p.gst || 0) / 100);
    }, 0);
  } else {
    tax = afterCommission * (invoiceData.taxPercent || 0) / 100;
  }

  const priceAfterTax = afterCommission + tax;
  const finalAmount = priceAfterTax + (invoiceData.charges || 0) + (invoiceData.roundOff || 0);

  // Auto-calculate Round Off to match Bill Amount (if small diff) or round to nearest integer
  useEffect(() => {
    const computedFinal = priceAfterTax + (invoiceData.charges || 0);
    
    if (invoiceData.billAmount) {
      const target = parseFloat(invoiceData.billAmount);
      const diff = target - computedFinal;
      
      // If difference is small (< 10), auto-adjust round off to match exactly
      if (Math.abs(diff) > 0 && Math.abs(diff) < 10) {
         if (Number((invoiceData.roundOff || 0).toFixed(2)) !== Number(diff.toFixed(2))) {
            setInvoiceData(prev => ({ ...prev, roundOff: Number(diff.toFixed(2)) }));
         }
      }
    } else {
       // Auto-round to nearest whole number if no specific bill amount is targeted
       const nearest = Math.round(computedFinal);
       const diff = nearest - computedFinal;
       if (Math.abs(diff) > 0 && Math.abs(diff) < 1) { // Normal round off is always < 1
           if (Number((invoiceData.roundOff || 0).toFixed(2)) !== Number(diff.toFixed(2))) {
               setInvoiceData(prev => ({ ...prev, roundOff: Number(diff.toFixed(2)) }));
           }
       }
    }
  }, [priceAfterTax, invoiceData.charges, invoiceData.billAmount, invoiceData.roundOff]);


  return (
    <>
      <Helmet>
        <title>Purchase Voucher | RetailNode ERP</title>
      </Helmet>
      
      {/* RetailNode Main Background */}
      <div className={`flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full ${isReadOnly ? 'pointer-events-none opacity-85' : ''}`}>
        <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="hidden" />
        
        {importQueue.length > 0 && (
          <div className="bg-[#fff599] border-b-2 border-yellow-500 text-black px-4 py-2 font-bold flex justify-between items-center shadow-md z-40 shrink-0">
            <span>Import Queue: {importQueue.length} more invoice(s) waiting to be loaded from the imported file. {skippedCount > 0 && <span className="text-red-700 ml-2">(Automatically skipped {skippedCount} already-saved invoice(s))</span>}</span>
            <button onClick={loadNextInQueue} className="bg-black text-white px-3 py-1 text-xs uppercase tracking-widest hover:bg-slate-800 shadow-[2px_2px_0_rgba(255,255,255,1)]">Skip & Load Next</button>
          </div>
        )}

        
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
                      <td className="p-2 font-bold">{err.type === 'item' ? err.item : (err.type === 'vendor' ? err.vendor : err.brand)}</td>
                      <td className="p-2 text-xs text-slate-600">
                        {err.type === 'item' ? `Brand: ${err.brand || '-'} | HSN: ${err.hsn}` : '-'}
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

        {/* Main Content Area */}
        <div className="flex flex-1 p-1 gap-1 overflow-hidden h-full">
          
          {/* Main Voucher Container */}
          <div className="flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative">
            
            {/* Voucher Header / Title */}
            <div className="bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0">
               <div>Accounting Voucher Creation</div>
               <div className="flex gap-4 items-center"><button onClick={() => fileInputRef.current?.click()} className="bg-yellow-400 text-black px-2 py-0.5 rounded text-xs hover:bg-yellow-500 transition-colors">Import (Alt+I)</button><div className="text-yellow-300">Purchase</div></div>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto">
              
              {/* Voucher Top Form */}
              <div className="p-2 border-b-2 border-black flex gap-4">
                
                {/* Left Panel */}
                <div className="w-[35%] flex flex-col gap-1 pr-4 border-r-2 border-[#81a09d]">
                  
                  <div className="flex items-center">
                    <span className="w-[100px] text-slate-800 font-bold mr-2">P.O. No :</span>
                    <input type="text" id="input-orderNo" value={invoiceData.orderNo} onChange={e => setInvoiceData({...invoiceData, orderNo: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-purchaser')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center flex-1 relative">
                      <span className="w-[100px] text-slate-800 font-bold mr-2">Order By :</span>
                      <div className="relative flex-1">
                        <SearchableDropdown
                          id="input-purchaser"
                          value={invoiceData.purchaser}
                          onChange={val => handleInvoiceChange('purchaser', val)}
                          onKeyDown={e => handleHeaderKeyDown(e, 'input-transporter')}
                          onSelect={opt => {
                            setTimeout(() => document.getElementById('input-transporter')?.focus(), 10);
                          }}
                          renderOption={(opt: any, isSelected: boolean) => (
                            <div className="flex justify-between items-center">
                              <span>{opt.name}</span>
                              {opt.employee_id && <span className="text-[10px] bg-slate-200 px-1 rounded text-slate-600 font-mono">ID: {opt.employee_id}</span>}
                            </div>
                          )}
                          options={activeUsers}
                          displayKey="name"
                          searchKeys={['name', 'employee_id']}
                          className="border border-slate-500 bg-white px-1 w-full focus:outline-none focus:border-black focus:bg-[#ffffe0]"
                          width="100%"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="w-[100px] text-slate-800 font-bold mr-2">Transporter :</span>
                    <div className="relative flex-1">
                      <SearchableDropdown
                        id="input-transporter"
                        value={invoiceData.transporter}
                        onChange={val => handleInvoiceChange('transporter', val)}
                        onNotFound={() => setShowTransporterModal(true)}
                        onKeyDown={e => {
                          if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')) {
                            e.preventDefault();
                            setShowTransporterModal(true);
                          } else {
                            handleHeaderKeyDown(e, 'input-lrNo');
                          }
                        }}
                        onSelect={opt => {
                          setTimeout(() => document.getElementById('input-lrNo')?.focus(), 10);
                        }}
                        options={transporters}
                        displayKey="name"
                        className="border border-slate-500 bg-white px-1 w-full focus:outline-none focus:border-black focus:bg-[#ffffe0]"
                        width="100%"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    {invoiceData.transporter.trim().toUpperCase() === 'HAND' ? (
                      <>
                        <span className="w-[100px] text-slate-800 font-bold mr-2">Receiver :</span>
                        <div className="relative flex-1">
                          <SearchableDropdown
                            id="input-lrNo"
                            value={invoiceData.lrNo}
                            onChange={val => setInvoiceData({...invoiceData, lrNo: val})}
                            onKeyDown={e => handleHeaderKeyDown(e, 'input-bale')}
                            onSelect={opt => {
                              setTimeout(() => document.getElementById('input-bale')?.focus(), 10);
                            }}
                            renderOption={(opt: any, isSelected: boolean) => (
                              <div className="flex justify-between items-center">
                                <span>{opt.name}</span>
                                {opt.employee_id && <span className="text-[10px] bg-slate-200 px-1 rounded text-slate-600 font-mono">ID: {opt.employee_id}</span>}
                              </div>
                            )}
                            options={activeUsers}
                            displayKey="name"
                            searchKeys={['name', 'employee_id']}
                            className="border border-slate-500 bg-white px-1 w-full focus:outline-none focus:border-black focus:bg-[#ffffe0]"
                            width="100%"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="w-[100px] text-slate-800 font-bold mr-2">L R No :</span>
                        <input type="text" id="input-lrNo" value={invoiceData.lrNo} onBlur={handleLRNoBlur} onChange={e => setInvoiceData({...invoiceData, lrNo: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-bale')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                      </>
                    )}
                  </div>

                  <div className="flex items-center">
                    <span className="w-[100px] text-slate-800 font-bold mr-2">Bale :</span>
                    <input type="text" id="input-bale" value={invoiceData.bale} onChange={e => setInvoiceData({...invoiceData, bale: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-supplier')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                  </div>

                </div>

                {/* Right Panel */}
                <div className="w-[65%] flex flex-col gap-2">
                  
                  {/* Row 1: Party */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-1 relative">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Party :</span>
                      <div className="relative flex-1">
                        <SearchableDropdown
                          id="input-supplier"
                          value={invoiceData.supplier}
                          onChange={val => handleInvoiceChange('supplier', val)}
                          onNotFound={() => setShowPartyModal(true)}
                          onKeyDown={e => {
                            if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')) {
                              e.preventDefault();
                              setShowPartyModal(true);
                            } else {
                              handleHeaderKeyDown(e, 'input-billNo');
                            }
                          }}
                          onSelect={opt => {
                            if (opt?.state !== 'Maharashtra') {
                              handleInvoiceChange('taxType', 'IGST');
                            } else {
                              handleInvoiceChange('taxType', 'CGST_SGST');
                            }
                            setTimeout(() => document.getElementById('input-billNo')?.focus(), 10);
                          }}
                          options={vendors}
                          displayKey="name"
                          className="border border-slate-500 bg-white px-1 w-full focus:outline-none focus:border-black focus:bg-[#ffffe0] font-bold"
                          width="100%"
                        />
                      </div>
                    </div>
                    <div className="flex items-center w-[250px]">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Party GSTIN:</span>
                      <input type="text" value={vendors.find(v => (v.name || '').toLowerCase() === (invoiceData.supplier || '').toLowerCase())?.gstin || vendors.find(v => (v.name || '').toLowerCase() === (invoiceData.supplier || '').toLowerCase())?.gst || vendors.find(v => (v.name || '').toLowerCase() === (invoiceData.supplier || '').toLowerCase())?.gstin_no || ""} readOnly className="border border-slate-300 bg-slate-100 px-1 flex-1 focus:outline-none font-mono text-slate-600" />
                    </div>
                  </div>

                  {/* Row 2: Bill No, Date */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-1">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Bill No :</span>
                      <input type="text" id="input-billNo" value={invoiceData.billNo} onChange={e => setInvoiceData({...invoiceData, billNo: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-billDate')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                    </div>
                    <div className="flex items-center flex-1">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Bill Date :</span>
                      <input type="date" id="input-billDate" value={invoiceData.billDate} onChange={e => setInvoiceData({...invoiceData, billDate: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-totalQty')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                    </div>
                  </div>

                  {/* Row 3: Total Qty, Amount, GST On */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-1">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Total Qty :</span>
                      <input type="number" id="input-totalQty" value={invoiceData.totalQuantity} onChange={e => setInvoiceData({...invoiceData, totalQuantity: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-billAmount')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                    </div>
                    <div className="flex items-center flex-[1.5]">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Bill Amount :</span>
                      <input type="number" id="input-billAmount" value={invoiceData.billAmount} onChange={e => setInvoiceData({...invoiceData, billAmount: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-gstOn')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                    </div>
                    <div className="flex items-center flex-[1.5]">
                      <span className="w-[100px] text-slate-800 font-bold mr-2">GST On :</span>
                      <select id="input-gstOn" value={invoiceData.gstOn} onChange={e => setInvoiceData({...invoiceData, gstOn: e.target.value as any})} onKeyDown={e => handleHeaderKeyDown(e, 'row-0-brand')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]">
                        <option value="total">Entire Invoice</option>
                        <option value="items">Individual Line Items</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Toggles and Firm/Location */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-300">
                    <div className="flex items-center gap-4 text-[11px] font-bold">
                      <label className="flex items-center gap-1 cursor-pointer">
                         <input type="checkbox" checked={invoiceData.designNo} onChange={e => setInvoiceData({...invoiceData, designNo: e.target.checked})} className="accent-[#1b5e58]" /> Design No
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                         <input type="checkbox" checked={invoiceData.colourNo} onChange={e => setInvoiceData({...invoiceData, colourNo: e.target.checked})} className="accent-[#1b5e58]" /> Colour No
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                         <input type="checkbox" checked={invoiceData.showSize} onChange={e => setInvoiceData({...invoiceData, showSize: e.target.checked})} className="accent-[#1b5e58]" /> Size
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                         <input type="checkbox" checked={invoiceData.showPurchaseDiscount} onChange={e => setInvoiceData({...invoiceData, showPurchaseDiscount: e.target.checked})} className="accent-[#1b5e58]" /> Discount %
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                         <input type="checkbox" checked={invoiceData.showMarkdown} onChange={e => setInvoiceData({...invoiceData, showMarkdown: e.target.checked})} className="accent-[#1b5e58]" /> MRP Markdown
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <select value={invoiceData.firm} onChange={e => handleInvoiceChange('firm', e.target.value)} className="border border-slate-500 bg-white px-1 text-xs font-bold focus:outline-none focus:border-black focus:bg-[#ffffe0]">
                        <option value="1">VRP</option>
                      </select>
                      <select value={invoiceData.location} onChange={e => handleInvoiceChange('location', e.target.value)} className="border border-slate-500 bg-white px-1 text-xs font-bold focus:outline-none focus:border-black focus:bg-[#ffffe0]">
                        <option value="">Select Location</option>
                        {locations.map((loc: any) => (
                          <option key={loc.id} value={loc.name}>{loc.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              {/* Items Table */}
              <div className="flex-1 border-b-2 border-black flex flex-col bg-[#fcfaf2]">
                <table className="w-full text-left border-collapse relative">
                  <thead className="sticky top-0 bg-[#eef5ed] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                    <tr className="border-b-2 border-black text-slate-900 font-bold text-[12px]">
                      <th className="px-1 py-1 border-r border-slate-300 w-8 text-center">#</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[100px] text-center">Brand</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[200px] text-center">Name of Item</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">HSN/SAC</th>
                      {invoiceData.designNo && <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Design</th>}
                      {invoiceData.colourNo && <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Colour</th>}
                      {invoiceData.showSize && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Size</th>}
                      {invoiceData.showCutSize && <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">Cut Size</th>}
                      {invoiceData.showCutSize && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Pieces</th>}
                      <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">Quantity</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Rate</th>
                      {invoiceData.showPurchaseDiscount && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Disc%</th>}
                      {invoiceData.showMarkdown && <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">MRP</th>}
                      {invoiceData.gstOn === 'items' && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">GST%</th>}
                      <th className="px-1 py-1 w-[100px] text-center">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter((item, index) => item.item || Number(item.qty) > 0 || index === products.length - 1).map((item, index) => (
                      <tr key={item.id} className="text-[13px] border-b border-slate-300">
                        <td className="border-r border-slate-300 px-1 py-[2px] text-center font-bold text-slate-500">{index + 1}</td>
                        <td className="border-r border-slate-300 px-1 py-[2px] relative">
                          <input id={`row-${index}-brand`} type="text" value={item.brand} onChange={e => { updateProduct(index, 'brand', e.target.value); setBrandSuggestionIndex(0); }} onFocus={(e) => handleBrandFocus(e, index)} onBlur={handleBrandBlur} onKeyDown={(e) => handleKeyDown(e, index, 'brand')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" autoComplete="off" />
                          {activeBrandRow === index && (
                            <div className="absolute top-full left-0 mt-0 bg-white border-2 border-black z-50 w-[200px] shadow-md max-h-[150px] overflow-y-auto">
                              {(() => {
                                const query = (products[index].brand || '').toLowerCase();
                                
                                // Filter based on selected party
                                let filteredBrands = availableBrands;
                                if (vendorAllowedBrands !== null) {
                                  filteredBrands = filteredBrands.filter(b => vendorAllowedBrands.some(vb => vb.toLowerCase() === (b.name || '').toLowerCase()));
                                }
                                if (isSingleBrandVendor && lockedBrand) {
                                  filteredBrands = filteredBrands.filter(b => b.name === lockedBrand);
                                }

                                const filtered = filteredBrands.filter(b => (b.name || '').toLowerCase().startsWith(query)).slice(0, 8);
                                if (filtered.length > 0) {
                                  return filtered.map((suggestion, sIdx) => (
                                    <div key={suggestion.id} className={`px-2 py-1 flex justify-between cursor-pointer ${sIdx === brandSuggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => {
                                      const newProducts = [...products];
                                      newProducts[index] = { ...newProducts[index], brand_id: suggestion.id, brand: suggestion.name || '' };
                                      setProducts(newProducts);
                                      setActiveBrandRow(null);
                                      document.getElementById(`row-${index}-item`)?.focus();
                                    }}>
                                      <span>{suggestion.name}</span>
                                    </div>
                                  ));
                                } else if (products[index].brand && vendorAllowedBrands === null) {
                                  return (
                                    <div className="px-2 py-2 text-[11px] text-slate-500 italic bg-white">
                                      Press <span className="font-bold text-black">Alt+C</span> to create "{products[index].brand}"
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          )}
                        </td>
                        <td className="border-r border-slate-300 px-1 py-[2px] relative">
                          <input id={`row-${index}-item`} type="text" value={item.item} onChange={e => { updateProduct(index, 'item', e.target.value); setSuggestionIndex(0); }} onFocus={(e) => handleItemFocus(e, index)} onBlur={handleItemBlur} onKeyDown={(e) => handleKeyDown(e, index, 'item')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" autoComplete="off" />
                          {activeSuggestionRow === index && (
                            <div className="absolute top-full left-0 mt-0 bg-white border-2 border-black z-50 w-[300px] shadow-md max-h-[150px] overflow-y-auto">
                              {(() => {
                                const q = (products[index].item || '').toLowerCase();
                                const filtered = availableItems.filter(s => {
                                  const textMatch = (s.name || s.item_name || '').toLowerCase().includes(q);
                                  const bId = products[index].brand_id;
                                  if (bId) return textMatch && String(s.brand_id) === String(bId);
                                  if (vendorAllowedBrands !== null) {
                                     const isAllowed = vendorAllowedBrands.some(vb => vb.toLowerCase() === (s.brand || '').toLowerCase());
                                     return textMatch && isAllowed;
                                  }
                                  return textMatch;
                                }).slice(0, 8);
                                if (filtered.length > 0) {
                                  return filtered.map((suggestion, sIdx) => (
                                    <div key={suggestion.id} className={`px-2 py-1 flex justify-between cursor-pointer ${sIdx === suggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => {
                                      const newProducts = [...products];
                                      newProducts[index] = { 
                                        ...newProducts[index], 
                                        item_id: suggestion.id,
                                        item: suggestion.name || suggestion.item_name, 
                                        brand_id: suggestion.brand_id || null,
                                        brand: suggestion.brand || newProducts[index].brand || '', 
                                        rate: suggestion.purchase_price || suggestion.rate || newProducts[index].rate || '',
                                        hsn: suggestion.hsn_code || suggestion.hsn || newProducts[index].hsn || '',
                                        gst: suggestion.tax_percent !== undefined ? suggestion.tax_percent : (newProducts[index].gst || 0)
                                      };
                                      setProducts(newProducts);
                                      setActiveSuggestionRow(null);
                                      setTimeout(() => {
                                        document.getElementById(`row-${index}-hsn`)?.focus();
                                      }, 10);
                                    }}>
                                      <span>{suggestion.name || suggestion.item_name} <span className="text-[10px] text-slate-500 font-normal ml-2">{suggestion.type || suggestion.item_type}</span></span>
                                      <span className="text-slate-600">Stock: {suggestion.stock || 0}</span>
                                    </div>
                                  ));
                                } else if (products[index].item && vendorAllowedBrands === null) {
                                  return (
                                    <div className="px-2 py-2 text-[11px] text-slate-500 italic bg-white">
                                      Press <span className="font-bold text-black">Alt+C</span> to create "{products[index].item}" in {products[index].brand || 'Brand'}
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          )}
                        </td>
                        <td className="border-r border-slate-300 px-1 py-[2px] relative">
                          <input id={`row-${index}-hsn`} type="text" value={item.hsn || ''} onChange={e => { updateProduct(index, 'hsn', e.target.value); setHsnSuggestionIndex(0); }} onFocus={(e) => handleHsnFocus(e, index)} onBlur={handleHsnBlur} onKeyDown={(e) => handleKeyDown(e, index, 'hsn')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" autoComplete="off" />
                          {activeHsnRow === index && (
                            <div className="absolute top-full left-0 mt-0 bg-white border-2 border-black z-50 w-[300px] shadow-md max-h-[150px] overflow-y-auto">
                              {(() => {
                                const query = (products[index].hsn || '').toLowerCase();
                                const filtered = availableHsns.filter(s => (s.name || '').toLowerCase().startsWith(query)).slice(0, 8);
                                if (filtered.length > 0) {
                                  return filtered.map((suggestion, sIdx) => (
                                    <div key={suggestion.id} className={`px-2 py-1 flex flex-col cursor-pointer ${sIdx === hsnSuggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => {
                                      const newProducts = [...products];
                                      newProducts[index] = { 
                                        ...newProducts[index], 
                                        hsn: suggestion.name || '', 
                                        gst: suggestion.tax_percent !== undefined ? suggestion.tax_percent : (newProducts[index].gst || 0) 
                                      };
                                      setProducts(newProducts);
                                      setActiveHsnRow(null);
                                      let nextF = 'qty';
                                      if (invoiceData.showSize) nextF = 'size';
                                      if (invoiceData.colourNo) nextF = 'colour';
                                      if (invoiceData.designNo) nextF = 'design';
                                      setTimeout(() => {
                                        document.getElementById(`row-${index}-${nextF}`)?.focus();
                                      }, 10);
                                    }}>
                                      <span className="text-[11px]"><span className="font-bold text-[#1b5e58]">{suggestion.name}</span> - {suggestion.description} ({suggestion.tax_percent !== undefined ? suggestion.tax_percent : 0}%)</span>
                                    </div>
                                  ));
                                } else if (products[index].hsn) {
                                  return (
                                    <div className="px-2 py-2 text-[11px] text-slate-500 italic bg-white">
                                      Press <span className="font-bold text-black">Alt+C</span> to create "{products[index].hsn}"
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          )}
                        </td>
                        {invoiceData.designNo && (
                          <td className="border-r border-slate-300 px-1 py-[2px] relative">
                            <input id={`row-${index}-design`} type="text" value={item.design} onChange={e => { updateProduct(index, 'design', e.target.value); setDesignSuggestionIndex(0); }} onFocus={(e) => handleDesignFocus(e, index)} onBlur={handleDesignBlur} onKeyDown={(e) => handleKeyDown(e, index, 'design')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" autoComplete="off" />
                            {activeDesignRow === index && (
                              <div className="absolute top-full left-0 mt-0 bg-white border-2 border-black z-50 w-[200px] shadow-md max-h-[150px] overflow-y-auto">
                                {(() => {
                                  const query = (products[index].design || '').toLowerCase();
                                  const filtered = availableDesigns.filter(s => (s.name || '').toLowerCase().startsWith(query)).slice(0, 8);
                                  if (filtered.length > 0) {
                                    return filtered.map((suggestion, sIdx) => (
                                      <div key={suggestion.id} className={`px-2 py-1 cursor-pointer ${sIdx === designSuggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => {
                                        const newProducts = [...products];
                                        newProducts[index] = { ...newProducts[index], design: suggestion.name || '' };
                                        setProducts(newProducts);
                                        setActiveDesignRow(null);
                                        let nextF = 'qty';
                                        if (invoiceData.colourNo) nextF = 'colour';
                                        setTimeout(() => {
                                          document.getElementById(`row-${index}-${nextF}`)?.focus();
                                        }, 10);
                                      }}>
                                        <span className="text-[11px] font-bold text-[#1b5e58]">{suggestion.name}</span>
                                      </div>
                                    ));
                                  } else if (products[index].design) {
                                    return (
                                      <div className="px-2 py-2 text-[11px] text-slate-500 italic bg-white">
                                        Press <span className="font-bold text-black">Alt+C</span> to create "{products[index].design}"
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            )}
                          </td>
                        )}
                        {invoiceData.colourNo && (
                          <td className="border-r border-slate-300 px-1 py-[2px] relative">
                            <input id={`row-${index}-colour`} type="text" value={item.colour} onChange={e => { updateProduct(index, 'colour', e.target.value); setColourSuggestionIndex(0); }} onFocus={(e) => handleColourFocus(e, index)} onBlur={handleColourBlur} onKeyDown={(e) => handleKeyDown(e, index, 'colour')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" autoComplete="off" />
                            {activeColourRow === index && (
                              <div className="absolute top-full left-0 mt-0 bg-white border-2 border-black z-50 w-[200px] shadow-md max-h-[150px] overflow-y-auto">
                                {(() => {
                                  const query = (products[index].colour || '').toLowerCase();
                                  const filtered = availableColours.filter(s => (s.name || '').toLowerCase().startsWith(query)).slice(0, 8);
                                  if (filtered.length > 0) {
                                    return filtered.map((suggestion, sIdx) => (
                                      <div key={suggestion.id} className={`px-2 py-1 cursor-pointer ${sIdx === colourSuggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => {
                                        const newProducts = [...products];
                                        newProducts[index] = { ...newProducts[index], colour: suggestion.name || '' };
                                        setProducts(newProducts);
                                        setActiveColourRow(null);
                                        let nextF = 'qty';
                                        setTimeout(() => {
                                          document.getElementById(`row-${index}-${nextF}`)?.focus();
                                        }, 10);
                                      }}>
                                        <span className="text-[11px] font-bold text-[#1b5e58]">{suggestion.name}</span>
                                      </div>
                                    ));
                                  } else if (products[index].colour) {
                                    return (
                                      <div className="px-2 py-2 text-[11px] text-slate-500 italic bg-white">
                                        Press <span className="font-bold text-black">Alt+C</span> to create "{products[index].colour}"
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            )}
                          </td>
                        )}
                        {invoiceData.showSize && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-size`} type="text" value={item.size} onChange={e => updateProduct(index, 'size', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'size')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 font-bold text-center" />
                          </td>
                        )}
                        {invoiceData.showCutSize && (
                          <>
                            <td className="border-r border-slate-300 px-1 py-[2px]">
                              <input list={`cuts-list`} id={`row-${index}-cut_size`} type="number" step="0.01" value={item.cut_size} onChange={e => {
                                const cutSize = e.target.value;
                                const qty = parseFloat(item.qty) || 0;
                                const pieces = (cutSize && qty) ? Math.floor(qty / parseFloat(cutSize)) : '';
                                setProducts(prev => {
                                  const newP = [...prev];
                                  newP[index] = { ...newP[index], cut_size: cutSize, pieces: pieces };
                                  return newP;
                                });
                              }} onKeyDown={(e) => handleKeyDown(e, index, 'cut_size')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-center" />
                            </td>
                            <td className="border-r border-slate-300 px-1 py-[2px] bg-slate-100">
                              <input type="number" value={item.pieces} readOnly className="w-full bg-transparent outline-none px-1 text-center text-slate-500 font-bold" />
                            </td>
                          </>
                        )}
                        <td className="border-r border-slate-300 px-1 py-[2px]">
                          <input 
                            id={`row-${index}-qty`} 
                            type="number" 
                            value={item.qty} 
                            onChange={e => {
                                const qty = e.target.value;
                                const cutSize = parseFloat(item.cut_size);
                                const pieces = (cutSize && qty) ? Math.floor(parseFloat(qty) / cutSize) : '';
                                setProducts(prev => {
                                  const newP = [...prev];
                                  newP[index] = { ...newP[index], qty: qty, pieces: pieces };
                                  return newP;
                                });
                            }} 
                            onKeyDown={(e) => {
                              if (e.altKey && e.code === 'KeyX') {
                                e.preventDefault();
                                e.stopPropagation();
                                setInvoiceData(prev => ({ ...prev, showSize: true }));
                                setActiveModalRow(index);
                              } else if (e.altKey && e.code === 'KeyZ') {
                                e.preventDefault();
                                e.stopPropagation();
                                setInvoiceData(prev => ({ ...prev, designNo: true }));
                                setActiveModalRow(index);
                              } else if (e.altKey && e.code === 'KeyS') {
        e.preventDefault();
        e.stopPropagation();
        handleSaveInvoice();
      } else if (e.altKey && e.code === 'KeyL') {
                                e.preventDefault();
                                e.stopPropagation();
                                setInvoiceData(prev => ({ ...prev, showLocation: true }));
                                setActiveModalRow(index);
                              } else if (e.key === 'Enter') {
                                e.preventDefault();
                                if (item.item) {
                                  setActiveSizeMatrixRow(index);
                                } else {
                                  handleKeyDown(e, index, 'qty');
                                }
                              } else {
                                handleKeyDown(e, index, 'qty');
                              }
                            }} 
                            className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" 
                          />
                        </td>
                        <td className="border-r border-slate-300 px-1 py-[2px]">
                          <input id={`row-${index}-rate`} type="number" value={item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'rate')} className={`w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold ${item.last_rate ? (parseFloat(item.rate) > item.last_rate ? 'text-red-600 bg-red-50' : parseFloat(item.rate) < item.last_rate ? 'text-green-600 bg-green-50' : '') : ''}`} title={item.last_rate ? `Last Rate: ₹${item.last_rate}` : ''} />
                        </td>
                        {invoiceData.showPurchaseDiscount && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-disc`} type="number" value={item.disc || ''} onChange={e => updateProduct(index, 'disc', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'disc')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        {invoiceData.showMarkdown && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-mrp`} type="number" value={item.mrp || ''} onChange={e => updateProduct(index, 'mrp', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'mrp')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        {invoiceData.gstOn === 'items' && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-gst`} type="number" value={item.gst || ''} onChange={e => updateProduct(index, 'gst', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'gst')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        <td className="px-1 py-[2px]">
                          <input type="text" value={((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0) * (1 - (item.disc || 0)/100)).toFixed(2)} readOnly className="w-full bg-transparent focus:outline-none px-1 text-right font-bold" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Two-Part Footer: Narration (Left) and Detailed Totals (Right) */}
              <div className="flex border-b-2 border-black bg-[#fcfaf2] shrink-0">
                
                {/* Left Part: Narration */}
                <div className="w-[60%] border-r-2 border-[#81a09d] p-2 flex flex-col justify-end">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-800 font-bold text-[11px]">Narration:</span>
                    <textarea 
                      className="border border-slate-500 bg-white px-1 py-0.5 w-full focus:outline-none focus:border-black focus:bg-[#ffffe0] italic resize-none text-[11px]" 
                      rows={2}
                    ></textarea>
                  </div>
                </div>

                {/* Right Part: Totals Table */}
                <div className="w-[40%] flex flex-col font-bold text-[11px] text-slate-800 leading-tight">
                  
                  {/* Taxable Amount */}
                  <div className="flex border-b border-slate-300">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0">Taxable Amount</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center">—</div>
                    <div className="w-[35%] px-1 py-0 text-right">{taxableAmount.toFixed(2)}</div>
                  </div>

                  {/* Discount */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Discount %</div>
                    <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                      <input type="number" value={invoiceData.discountPercent || ''} onChange={e => handleInvoiceChange('discountPercent', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-center" />
                    </div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" value={invoiceData.discountPercent > 0 ? Number(calcDiscount.toFixed(2)) : (invoiceData.discountAmount || '')} onChange={e => handleInvoiceChange('discountAmount', parseFloat(e.target.value) || 0)} readOnly={invoiceData.discountPercent > 0} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>

                  {/* After Discount */}
                  <div className="flex border-b border-slate-300">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0">After Discount</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center">—</div>
                    <div className="w-[35%] px-1 py-0 text-right">{afterDiscount.toFixed(2)}</div>
                  </div>

                  {/* Commission */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Commission %</div>
                    <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                      <input type="number" value={invoiceData.commissionPercent || ''} onChange={e => handleInvoiceChange('commissionPercent', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-center" />
                    </div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" value={invoiceData.commissionPercent > 0 ? Number(calcCommission.toFixed(2)) : (invoiceData.commissionAmount || '')} onChange={e => handleInvoiceChange('commissionAmount', parseFloat(e.target.value) || 0)} readOnly={invoiceData.commissionPercent > 0} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>

                  {/* After Commission */}
                  <div className="flex border-b border-slate-300">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0">After Commission</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center">—</div>
                    <div className="w-[35%] px-1 py-0 text-right">{afterCommission.toFixed(2)}</div>
                  </div>

                  {/* IGST / CGST / SGST */}
                  {invoiceData.taxType === 'IGST' ? (
                    <div className="flex border-b border-slate-300 bg-white">
                      <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">IGST %</div>
                      <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                        {invoiceData.gstOn === 'total' ? (
                          <input type="number" value={invoiceData.taxPercent || ''} onChange={e => handleInvoiceChange('taxPercent', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-center" />
                        ) : (
                          <div className="text-center text-slate-500 font-normal">Auto</div>
                        )}
                      </div>
                      <div className="w-[35%] px-1 py-0 text-right bg-[#fcfaf2]">{tax.toFixed(2)}</div>
                    </div>
                  ) : (
                    <>
                      <div className="flex border-b border-slate-300 bg-white">
                        <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">CGST %</div>
                        <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                          {invoiceData.gstOn === 'total' ? (
                            <input type="number" value={(invoiceData.taxPercent || 0)/2} readOnly className="w-full bg-transparent px-1 text-center text-slate-500 font-normal outline-none" />
                          ) : (
                            <div className="text-center text-slate-500 font-normal">Auto</div>
                          )}
                        </div>
                        <div className="w-[35%] px-1 py-0 text-right bg-[#fcfaf2]">{(tax/2).toFixed(2)}</div>
                      </div>
                      <div className="flex border-b border-slate-300 bg-white">
                        <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">SGST %</div>
                        <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                          {invoiceData.gstOn === 'total' ? (
                            <input type="number" value={(invoiceData.taxPercent || 0)/2} readOnly className="w-full bg-transparent px-1 text-center text-slate-500 font-normal outline-none" />
                          ) : (
                            <div className="text-center text-slate-500 font-normal">Auto</div>
                          )}
                        </div>
                        <div className="w-[35%] px-1 py-0 text-right bg-[#fcfaf2]">{(tax/2).toFixed(2)}</div>
                      </div>
                    </>
                  )}

                  {/* Price After Tax */}
                  <div className="flex border-b border-slate-300">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0">Price After Tax</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center">—</div>
                    <div className="w-[35%] px-1 py-0 text-right">{priceAfterTax.toFixed(2)}</div>
                  </div>

                  {/* Other Charges */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Other Charges</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center text-blue-600 bg-[#fcfaf2]">—</div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" value={invoiceData.charges || ''} onChange={e => handleInvoiceChange('charges', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>

                  {/* Round Off */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Round Off</div>
                    <div className="w-[20%] border-r border-slate-300 px-0 py-0"></div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" value={invoiceData.roundOff || ''} onChange={e => handleInvoiceChange('roundOff', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>

                  {/* Final Amount */}
                  <div className="flex bg-[#ffffe0] border-t border-black">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-[2px]">Total Qty: {totalQty.toFixed(2)}</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-[2px]">Final Amount</div>
                    <div className="w-[35%] px-1 py-[2px] text-right text-[12px]">{finalAmount.toFixed(2)}</div>
                  </div>

                </div>
              </div>
              
            </div>
          </div>

          {/* Right Action Sidebar (F-keys) */}
          <div className="w-[120px] pointer-events-auto flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]">
             {[
               { key: "F1", label: "Help" },
               { key: "F2", label: "Date" },
               { key: "F3", label: "Company" },
               { key: "F4", label: "Contra" },
               { key: "F5", label: "Payment" },
               { key: "F6", label: "Receipt" },
               { key: "F7", label: "Journal" },
               { key: "F8", label: "Sales" },
               { key: "F9", label: "Purchase" },
             ].map((f) => (
               <button 
                 key={f.key} 
                 className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
               >
                 <span className="font-bold text-black text-[11px] w-[25px]">{f.key}</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">{f.label}</span>
               </button>
             ))}
             <div className="flex-1" />
             <div className="flex flex-col items-center justify-center p-2 mb-2 border-t border-[#a3c3be] mx-2 pt-4">
               <svg width="64" height="64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="100" cy="100" r="86" fill="transparent" stroke="#1b5e58" strokeWidth="14" />
                 <circle cx="14" cy="100" r="8" fill="transparent" stroke="#1b5e58" strokeWidth="5" />
                 <circle cx="186" cy="100" r="8" fill="transparent" stroke="#1b5e58" strokeWidth="5" />
                 <text x="100" y="100" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="72" textAnchor="middle" dominantBaseline="central">
                   <tspan fill="#12423d">RN</tspan><tspan fill="#1b5e58">.</tspan>
                 </text>
               </svg>
               <span className="font-extrabold text-[13px] text-[#12423d] mt-2 uppercase tracking-widest text-center">RetailNode</span>
             </div>

             {isReadOnly ? (
               <button 
                 onClick={() => setIsReadOnly(false)}
                 className="flex flex-row items-center px-2 py-1 bg-blue-500 border border-blue-600 hover:bg-blue-600 text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] mb-2 w-full text-white"
               >
                   <span className="font-bold text-[11px] w-[25px] underline">E</span>
                   <span className="text-[11px] font-medium border-l border-blue-600 pl-1 ml-1">Edit</span>
               </button>
             ) : (
               <button 
                 onClick={handleSaveInvoice}
                 className="flex flex-row items-center px-2 py-1 bg-[#ffe000] border border-[#d6bc00] hover:bg-[#e6c900] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] mb-2 w-full"
               >
                   <span className="font-bold text-black text-[11px] w-[25px] underline">S</span>
                   <span className="text-black text-[11px] font-medium border-l border-[#d6bc00] pl-1 ml-1">Save</span>
               </button>
             )}
             <button 
               onClick={() => navigate('/dashboard')}
               className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] w-full"
             >
                 <span className="font-bold text-black text-[11px] w-[25px] underline">Q</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Quit</span>
             </button>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]">
          <div className="font-medium tracking-wide flex gap-4">
            <span>Purchase Voucher</span>
            <span className="text-[#a4d4cc]">
              Shortcuts: <strong>{modKey}+S</strong> (Save) | <strong>{modKey}+Z</strong> (Design) | <strong>{modKey}+C</strong> (Colour) | <strong>{modKey}+X</strong> (Size) | <strong>{modKey}+L</strong> (Location) | <strong>{modKey}+V</strong> (Discount) | <strong>{modKey}+M</strong> (Markdown)
            </span>
          </div>
          <div className="flex gap-6">
            <span>Version: 1.0</span>
          </div>
        </div>
      </div>

      <MultiAttributeModal 
        isOpen={activeModalRow !== null}
        onClose={() => setActiveModalRow(null)}
        item={activeModalRow !== null ? products[activeModalRow] : null}
        showSize={invoiceData.showSize}
        showColour={invoiceData.colourNo}
        showDesign={invoiceData.designNo}
        showLocation={invoiceData.showLocation}
        availableLocations={locations.map((loc: any) => loc.name)}
        onSave={(attributes, totalQty) => {
          if (activeModalRow !== null) {
            updateProduct(activeModalRow, 'qty', totalQty);
            updateProduct(activeModalRow, 'attributes', attributes);
          }
          setActiveModalRow(null);
          // Focus next field
          setTimeout(() => {
            if (activeModalRow !== null) {
              document.getElementById(`row-${activeModalRow}-rate`)?.focus();
            }
          }, 100);
        }}
      />

      <SizeAllocationModal
        isOpen={activeSizeMatrixRow !== null}
        onClose={() => setActiveSizeMatrixRow(null)}
        itemName={activeSizeMatrixRow !== null ? products[activeSizeMatrixRow].item : ''}
        brandId={activeSizeMatrixRow !== null ? products[activeSizeMatrixRow].brand_id : ''}
        onSave={(allocatedSizes, summaryInfo) => {
          if (activeSizeMatrixRow !== null) {
            updateProduct(activeSizeMatrixRow, 'qty', summaryInfo.totalQty);
            updateProduct(activeSizeMatrixRow, 'rate', summaryInfo.avgRate);
            updateProduct(activeSizeMatrixRow, 'size', summaryInfo.sizeDisplay);
            updateProduct(activeSizeMatrixRow, 'matrixData', allocatedSizes);
            
            if (activeSizeMatrixRow === products.length - 1) {
               setProducts([...products, { id: Date.now(), item: '', brand: '', qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }]);
            }
          }
          setActiveSizeMatrixRow(null);
        }}
      />

      <PartyModal 
        isOpen={showPartyModal}
        onClose={() => setShowPartyModal(false)}
        initialPartyName={invoiceData.supplier}
        editPartyData={vendors.find(v => (v.name || '').toLowerCase() === (invoiceData.supplier || '').toLowerCase())}
        availableBrands={availableBrands}
        onSave={(newParty) => {
          setVendors(prev => {
            const existingIdx = prev.findIndex(p => p.id === newParty.id);
            if (existingIdx >= 0) {
              const updated = [...prev];
              updated[existingIdx] = newParty;
              return updated;
            }
            return [...prev, newParty];
          });
          handleInvoiceChange('supplier', newParty.name);
          setShowPartyModal(false);
          setImportErrors(prev => prev.filter(e => !(e.type === 'vendor' && (e.vendor || '').toLowerCase() === (newParty.name || '').toLowerCase())));
          setTimeout(() => {
            document.getElementById('input-billNo')?.focus();
          }, 100);
        }}
      />

      <TransporterModal 
        isOpen={showTransporterModal}
        onClose={() => setShowTransporterModal(false)}
        initialTransporterName={invoiceData.transporter}
        onSave={(newTransporter) => {
          setTransporters(prev => [...prev, newTransporter]);
          handleInvoiceChange('transporter', newTransporter.name);
          setShowTransporterModal(false);
          setTimeout(() => {
            document.getElementById('input-lrNo')?.focus();
          }, 100);
        }}
      />

      <MasterCreationModal 
        isOpen={masterModal !== null}
        onClose={() => setMasterModal(null)}
        masterType={masterModal?.type || null}
        initialValue={masterModal?.initialValue || ''}
        initialBrand={masterModal?.initialBrand}
        initialBrandId={masterModal?.initialBrandId}
        onSave={(type, data) => {
           console.log(`Created new master of type ${type}:`, data);
           if (masterModal) {
             const { type: savedType, rowIndex } = masterModal;
             const fieldMap: any = { hsn: 'hsn', brand: 'brand', item: 'item', size: 'size', design: 'design', colour: 'colour' };
             const field = fieldMap[savedType];
             if (savedType === 'item') {
               setAvailableItems(prev => [...prev, { id: data.id, name: data.name, item_name: data.name, brand: data.brand, brand_id: data.brand_id || null }]);
               setProducts(prev => {
                 const newP = [...prev];
                 newP[rowIndex] = { 
                   ...newP[rowIndex], 
                   item: data.name, 
                   item_id: data.id || newP[rowIndex].item_id, 
                   brand: data.brand || newP[rowIndex].brand, 
                   hsn: data.hsn || newP[rowIndex].hsn 
                 };
                 return newP;
               });
             } else if (savedType === 'hsn') {
               setAvailableHsns(prev => [...prev, { name: data.name, tax_percent: data.tax_percent }]);
               setProducts(prev => {
                 const newP = [...prev];
                 newP[rowIndex] = {
                   ...newP[rowIndex],
                   hsn: data.name,
                   gst: data.tax_percent !== undefined ? data.tax_percent : (newP[rowIndex].gst || 0)
                 };
                 return newP;
               });
             } else if (savedType === 'brand') {
               setAvailableBrands(prev => [...prev, { id: data.id, name: data.name }]);
               setProducts(prev => {
                 const newP = [...prev];
                 newP[rowIndex] = {
                   ...newP[rowIndex],
                   brand: data.name,
                   brand_id: data.id || newP[rowIndex].brand_id
                 };
                 return newP;
               });
             } else if (savedType === 'design') {
               setAvailableDesigns(prev => [...prev, { id: data.id || Date.now(), name: data.name }]);
               setProducts(prev => {
                 const newP = [...prev];
                 newP[rowIndex] = {
                   ...newP[rowIndex],
                   design: data.name
                 };
                 return newP;
               });
             } else if (savedType === 'colour') {
               setAvailableColours(prev => [...prev, { id: data.id || Date.now(), name: data.name }]);
               setProducts(prev => {
                 const newP = [...prev];
                 newP[rowIndex] = {
                   ...newP[rowIndex],
                   colour: data.name
                 };
                 return newP;
               });
             } else if (field) {
               updateProduct(rowIndex, field, data.name);
             }
               // Move focus to next field
               const fields = ['brand', 'item', 'hsn', 'qty', 'rate', 'disc', 'mrp'];
               const currentFieldIndex = fields.indexOf(field);
               setTimeout(() => {
                 if (currentFieldIndex > -1 && currentFieldIndex < fields.length - 1) {
                   document.getElementById(`row-${rowIndex}-${fields[currentFieldIndex + 1]}`)?.focus();
                 } else {
                   document.getElementById(`row-${rowIndex}-qty`)?.focus();
                 }
               }, 100);
           }
           setMasterModal(null);
           // In a real implementation, we would POST to the backend and then set the local input value
        }}
      />
      <datalist id="cuts-list">
        {cuts.map(cut => (
          <option key={cut.id} value={cut.cut_size}>{cut.cut_name}</option>
        ))}
      </datalist>
    </>
  );
}
