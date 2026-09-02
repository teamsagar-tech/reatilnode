import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MultiAttributeModal from '../../components/inventory/MultiAttributeModal';
import PartyModal from '../../components/inventory/PartyModal';
import MasterCreationModal from '../../components/inventory/MasterCreationModal';
import SearchableDropdown from '../../components/SearchableDropdown';
import * as XLSX from 'xlsx';



export default function PurchaseInvoice() {
  const navigate = useNavigate();
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? 'Option' : 'Alt';

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
    transporter: '',
    lrNo: '',
    bale: '',
    billNo: '',
    billDate: new Date().toISOString().split('T')[0],
    receiveDate: new Date().toISOString().split('T')[0],
    totalQuantity: '',
    billAmount: '',
    gstOn: 'items' as 'items' | 'total',
    designNo: false,
    colourNo: false,
    showSize: false,
    showLocation: false,
    showPurchaseDiscount: false,
    showMarkdown: false
  });

  const [products, setProducts] = useState<any[]>([
    { id: 1, item_id: null, item: '', brand_id: null, brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 },
    { id: 1, item: '', brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 },
  ]);

  const [activeSuggestionRow, setActiveSuggestionRow] = useState<number | null>(null);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  
  const handleSaveInvoice = () => {
    alert('Purchase Invoice Saved Successfully!');
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

        let errors: any[] = [];
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
            'ADAT %': 'commissionPercent',
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
                       const d = parts[0].length === 4 ? `${parts[0]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}` : `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
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
          }).filter(p => (p.item !== undefined && p.item !== null && String(p.item).trim() !== '') || Number(p.qty) > 0);

          if (errors.length > 0) {
              setImportErrors(errors);
          }

          if (hasDesign) newInvoiceData.designNo = true;
          if (hasColour) newInvoiceData.colourNo = true;
          if (hasSize) newInvoiceData.showSize = true;
          if (hasMarkdown) newInvoiceData.showMarkdown = true;
          if (hasDisc) newInvoiceData.showPurchaseDiscount = true;

          setInvoiceData(newInvoiceData);
          setProducts(importedProducts.length > 0 ? importedProducts : [{ id: Date.now(), item_id: null, item: '', hsn: '', brand_id: null, brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }]);
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
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [masterModal, setMasterModal] = useState<{ type: 'brand' | 'size' | 'item' | 'hsn', initialValue: string, rowIndex: number } | null>(null);

  const [showPurchaserDropdown, setShowPurchaserDropdown] = useState(false);
  const [purchaserIndex, setPurchaserIndex] = useState(0);

  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [supplierIndex, setSupplierIndex] = useState(0);

  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);
  const [brandSuggestionIndex, setBrandSuggestionIndex] = useState(0);
  const [activeBrandRow, setActiveBrandRow] = useState<number | null>(null);
  
  const [availableHsns, setAvailableHsns] = useState<any[]>([]);
  const [hsnSuggestionIndex, setHsnSuggestionIndex] = useState(0);
  const [activeHsnRow, setActiveHsnRow] = useState<number | null>(null);
  
  const [locations, setLocations] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Fetch Items
    fetch('https://api.retailnode.in/api/items', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAvailableItems(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Fetch Brands
    fetch('https://api.retailnode.in/api/masters/brand', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAvailableBrands(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Fetch Locations
    fetch('https://api.retailnode.in/api/masters/generic/Locations', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setLocations(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Fetch Vendors
    fetch('https://api.retailnode.in/api/vendors', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setVendors(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Fetch Purchasers
    fetch('https://api.retailnode.in/api/users/purchasers', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setActiveUsers(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Fetch HSNs
    fetch('https://api.retailnode.in/api/masters/generic/hsnsacs', {
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
        else if (showSupplierDropdown) setShowSupplierDropdown(false);
        else if (showPurchaserDropdown) setShowPurchaserDropdown(false);
        else if (activeSuggestionRow !== null) setActiveSuggestionRow(null);
        else if (activeHsnRow !== null) setActiveHsnRow(null);
        else navigate('/dashboard');
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
  }, [showSupplierDropdown, showPurchaserDropdown, activeSuggestionRow, showPartyModal, navigate]);


  const handleInvoiceChange = (field: string, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const updateProduct = (index: number, field: string, value: any) => {
    setProducts(prev => {
      const newProducts = [...prev];
      newProducts[index] = { ...newProducts[index], [field]: value };
      return newProducts;
    });
  };

  const addProduct = () => {
    setProducts([...products, { id: Date.now(), item: '', hsn: '', brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }]);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };



  const handleHeaderKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById(nextFieldId)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, field: string) => {
    const fields = ['brand', 'item', 'hsn', 'qty', 'rate', 'disc', 'mrp'];
    const currentFieldIndex = fields.indexOf(field);

    if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')) {
      e.preventDefault();
      if (['brand', 'size', 'item', 'gst'].includes(field)) {
        setMasterModal({ 
          type: field === 'gst' ? 'hsn' : field as any,
          initialValue: e.currentTarget.value || '',
          rowIndex: index
        });
      }
      return;
    }

    if (field === 'brand' && activeBrandRow === index) {
      const query = (products[index].brand || '').toLowerCase();
      const filtered = availableBrands.filter(b => (b.name || '').toLowerCase().startsWith(query)).slice(0, 8);
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setBrandSuggestionIndex(prev => Math.min(prev + 1, filtered.length - 1));
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setBrandSuggestionIndex(prev => Math.max(prev - 1, 0));
        return;
      } else if (e.key === 'Enter' && filtered.length > 0) {
        e.preventDefault();
        const selected = filtered[brandSuggestionIndex];
        const newProducts = [...products];
        newProducts[index] = { ...newProducts[index], brand_id: selected.id, brand: selected.name || '' };
        setProducts(newProducts);
        setActiveBrandRow(null);
        document.getElementById(`row-${index}-item`)?.focus();
        return;
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
      } else if (e.key === 'Enter' && filtered.length > 0) {
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
        document.getElementById(`row-${index}-qty`)?.focus();
        return;
      }
    }

    if (field === 'item' && activeSuggestionRow === index) {
      const query = products[index].item.toLowerCase();
      const rowBrandId = products[index].brand_id;
      const rowBrandName = (products[index].brand || '').toLowerCase();
      const filtered = availableItems.filter(s => {
        const textMatch = (s.name || s.item_name || '').toLowerCase().includes(query);
        if (rowBrandId) return textMatch && s.brand_id === rowBrandId;
        if (rowBrandName) return textMatch && (s.brand || '').toLowerCase() === rowBrandName;
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
      } else if (e.key === 'Enter' && filtered.length > 0) {
        e.preventDefault();
        const selected = filtered[suggestionIndex];
        const newProducts = [...products];
        newProducts[index] = { ...newProducts[index], item_id: selected.id, item: selected.name || selected.item_name, brand_id: selected.brand_id || null, brand: selected.brand || '', rate: selected.purchase_price || selected.rate || newProducts[index].rate || '' };
        setProducts(newProducts);
        setActiveSuggestionRow(null);
        document.getElementById(`row-${index}-qty`)?.focus();
        return;
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
            document.getElementById(`row-${index + 1}-item`)?.focus();
          }, 10);
        } else {
          document.getElementById(`row-${index + 1}-item`)?.focus();
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


  const handleCreateMissingMaster = async (err: any) => {
    setIsCreating(true);
    try {
      if (err.type === 'brand') {
        const res = await fetch('https://api.retailnode.in/api/masters/brand', {
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

        const res = await fetch('https://api.retailnode.in/api/items', {
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

  // Commission
  const calcCommission = invoiceData.commissionPercent > 0
    ? (afterDiscount * invoiceData.commissionPercent / 100)
    : invoiceData.commissionAmount;
  const afterCommission = afterDiscount - calcCommission;

  // Tax
  let tax = 0;
  if (invoiceData.gstOn === 'items') {
    tax = products.reduce((acc, p) => {
      const lineAmount = (p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100);
      return acc + (lineAmount * (p.gst || 0) / 100);
    }, 0);
  } else {
    tax = afterCommission * (invoiceData.taxPercent || 0) / 100;
  }

  const priceAfterTax = afterCommission + tax;
  const finalAmount = priceAfterTax + (invoiceData.charges || 0) + (invoiceData.roundOff || 0);

  return (
    <>
      <Helmet>
        <title>Purchase Voucher | RetailNode ERP</title>
      </Helmet>
      
      {/* RetailNode Main Background */}
      <div className="flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full">
        <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="hidden" />
        
        

        
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
                          options={activeUsers}
                          displayKey="name"
                          className="border border-slate-500 bg-white px-1 w-full focus:outline-none focus:border-black focus:bg-[#ffffe0]"
                          width="100%"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="w-[100px] text-slate-800 font-bold mr-2">Transporter :</span>
                    <input type="text" id="input-transporter" value={invoiceData.transporter} onChange={e => setInvoiceData({...invoiceData, transporter: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-lrNo')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                  </div>

                  <div className="flex items-center">
                    <span className="w-[100px] text-slate-800 font-bold mr-2">L R No :</span>
                    <input type="text" id="input-lrNo" value={invoiceData.lrNo} onChange={e => setInvoiceData({...invoiceData, lrNo: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-bale')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
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
                      <input type="text" value="27AADCA1234F1Z9" readOnly className="border border-slate-300 bg-slate-100 px-1 flex-1 focus:outline-none font-mono text-slate-600" />
                    </div>
                  </div>

                  {/* Row 2: Bill No, Date, Receive Date */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-1">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Bill No :</span>
                      <input type="text" id="input-billNo" value={invoiceData.billNo} onChange={e => setInvoiceData({...invoiceData, billNo: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-billDate')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                    </div>
                    <div className="flex items-center flex-[1.5]">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Bill Date :</span>
                      <input type="date" id="input-billDate" value={invoiceData.billDate} onChange={e => setInvoiceData({...invoiceData, billDate: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-receiveDate')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                    </div>
                    <div className="flex items-center flex-[1.5]">
                      <span className="w-[100px] text-slate-800 font-bold mr-2">Receive Date :</span>
                      <input type="date" id="input-receiveDate" value={invoiceData.receiveDate} onChange={e => setInvoiceData({...invoiceData, receiveDate: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-totalQty')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
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
                      <select id="input-gstOn" value={invoiceData.gstOn} onChange={e => setInvoiceData({...invoiceData, gstOn: e.target.value as any})} onKeyDown={e => handleHeaderKeyDown(e, 'row-0-item')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]">
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
                      <label className="flex items-center gap-1 cursor-pointer text-indigo-700">
                         <input type="checkbox" checked={invoiceData.showLocation} onChange={e => setInvoiceData({...invoiceData, showLocation: e.target.checked})} className="accent-indigo-600" /> Location
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
                      <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">Quantity</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Rate</th>
                      {invoiceData.showPurchaseDiscount && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Disc%</th>}
                      {invoiceData.showMarkdown && <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">MRP</th>}
                      {invoiceData.gstOn === 'items' && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">GST%</th>}
                      <th className="px-1 py-1 w-[100px] text-center">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, index) => (
                      <tr key={item.id} className="text-[13px] border-b border-slate-300">
                        <td className="border-r border-slate-300 px-1 py-[2px] text-center font-bold text-slate-500">{index + 1}</td>
                        <td className="border-r border-slate-300 px-1 py-[2px] relative">
                          <input id={`row-${index}-brand`} type="text" value={item.brand} onChange={e => { updateProduct(index, 'brand', e.target.value); setBrandSuggestionIndex(0); }} onFocus={(e) => handleBrandFocus(e, index)} onBlur={handleBrandBlur} onKeyDown={(e) => handleKeyDown(e, index, 'brand')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" autoComplete="off" />
                          {activeBrandRow === index && (
                            <div className="absolute top-full left-0 mt-0 bg-white border-2 border-black z-50 w-[200px] shadow-md max-h-[150px] overflow-y-auto">
                              {availableBrands.filter(b => (b.name || '').toLowerCase().startsWith((products[index].brand || '').toLowerCase())).slice(0, 8).map((suggestion, sIdx) => (
                                <div key={suggestion.id} className={`px-2 py-1 flex justify-between cursor-pointer ${sIdx === brandSuggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => {
                                  const newProducts = [...products];
                                  newProducts[index] = { ...newProducts[index], brand_id: suggestion.id, brand: suggestion.name || '' };
                                  setProducts(newProducts);
                                  setActiveBrandRow(null);
                                  document.getElementById(`row-${index}-item`)?.focus();
                                }}>
                                  <span>{suggestion.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="border-r border-slate-300 px-1 py-[2px] relative">
                          <input id={`row-${index}-item`} type="text" value={item.item} onChange={e => { updateProduct(index, 'item', e.target.value); setSuggestionIndex(0); }} onFocus={(e) => handleItemFocus(e, index)} onBlur={handleItemBlur} onKeyDown={(e) => handleKeyDown(e, index, 'item')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" autoComplete="off" />
                          {activeSuggestionRow === index && (
                            <div className="absolute top-full left-0 mt-0 bg-white border-2 border-black z-50 w-[300px] shadow-md max-h-[150px] overflow-y-auto">
                              {availableItems.filter(s => {
                              const q = (products[index].item || '').toLowerCase();
                              const textMatch = (s.name || s.item_name || '').toLowerCase().includes(q);
                              const bId = products[index].brand_id;
                              const bName = (products[index].brand || '').toLowerCase();
                              if (bId) return textMatch && s.brand_id === bId;
                              if (bName) return textMatch && (s.brand || '').toLowerCase() === bName;
                              return textMatch;
                            }).slice(0, 8).map((suggestion, sIdx) => (
                                <div key={suggestion.id} className={`px-2 py-1 flex justify-between cursor-pointer ${sIdx === suggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => {
                                  const newProducts = [...products];
                                  newProducts[index] = { ...newProducts[index], item: suggestion.name || suggestion.item_name, brand: suggestion.brand || '', rate: suggestion.purchase_price || suggestion.rate || '' };
                                  setProducts(newProducts);
                                  setActiveSuggestionRow(null);
                                  document.getElementById(`row-${index}-qty`)?.focus();
                                }}>
                                  <span>{suggestion.name || suggestion.item_name} <span className="text-[10px] text-slate-500 font-normal ml-2">{suggestion.type || suggestion.item_type}</span></span>
                                  <span className="text-slate-600">Stock: {suggestion.stock || 0}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="border-r border-slate-300 px-1 py-[2px] relative">
                          <input id={`row-${index}-hsn`} type="text" value={item.hsn || ''} onChange={e => { updateProduct(index, 'hsn', e.target.value); setHsnSuggestionIndex(0); }} onFocus={(e) => handleHsnFocus(e, index)} onBlur={handleHsnBlur} onKeyDown={(e) => handleKeyDown(e, index, 'hsn')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" autoComplete="off" />
                          {activeHsnRow === index && (
                            <div className="absolute top-full left-0 mt-0 bg-white border-2 border-black z-50 w-[300px] shadow-md max-h-[150px] overflow-y-auto">
                              {availableHsns.filter(s => (s.name || '').toLowerCase().startsWith((products[index].hsn || '').toLowerCase())).slice(0, 8).map((suggestion, sIdx) => (
                                <div key={suggestion.id} className={`px-2 py-1 flex flex-col cursor-pointer ${sIdx === hsnSuggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => {
                                  const newProducts = [...products];
                                  newProducts[index] = { 
                                    ...newProducts[index], 
                                    hsn: suggestion.name || '', 
                                    gst: suggestion.tax_percent !== undefined ? suggestion.tax_percent : (newProducts[index].gst || 0) 
                                  };
                                  setProducts(newProducts);
                                  setActiveHsnRow(null);
                                  document.getElementById(`row-${index}-qty`)?.focus();
                                }}>
                                  <span className="text-[11px]"><span className="font-bold text-[#1b5e58]">{suggestion.name}</span> - {suggestion.description} ({suggestion.tax_percent !== undefined ? suggestion.tax_percent : 0}%)</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        {invoiceData.designNo && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-design`} type="text" value={item.design} onChange={e => updateProduct(index, 'design', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'design')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" />
                          </td>
                        )}
                        {invoiceData.colourNo && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-colour`} type="text" value={item.colour} onChange={e => updateProduct(index, 'colour', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'colour')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" />
                          </td>
                        )}
                        {invoiceData.showSize && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-size`} type="text" value={item.size} onChange={e => updateProduct(index, 'size', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'size')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 font-bold text-center" />
                          </td>
                        )}
                        <td className="border-r border-slate-300 px-1 py-[2px]">
                          <input 
                            id={`row-${index}-qty`} 
                            type="number" 
                            value={item.qty} 
                            onChange={e => updateProduct(index, 'qty', e.target.value)} 
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
                                if (invoiceData.showSize || invoiceData.designNo || invoiceData.colourNo || invoiceData.showLocation) {
                                  setActiveModalRow(index);
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
                          <input id={`row-${index}-rate`} type="number" value={item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'rate')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
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
          <div className="w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]">
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

             <button 
               onClick={handleSaveInvoice}
               className="flex flex-row items-center px-2 py-1 bg-[#ffe000] border border-[#d6bc00] hover:bg-[#e6c900] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] mb-2 w-full"
             >
                 <span className="font-bold text-black text-[11px] w-[25px] underline">S</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#d6bc00] pl-1 ml-1">Save</span>
             </button>
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

      <PartyModal 
        isOpen={showPartyModal}
        onClose={() => setShowPartyModal(false)}
        initialPartyName={invoiceData.supplier}
        onSave={(newParty) => {
          setVendors(prev => [...prev, newParty]);
          handleInvoiceChange('supplier', newParty.name);
          setShowPartyModal(false);
          setImportErrors(prev => prev.filter(e => !(e.type === 'vendor' && (e.vendor || '').toLowerCase() === (newParty.name || '').toLowerCase())));
          setTimeout(() => {
            document.getElementById('input-billNo')?.focus();
          }, 100);
        }}
      />

      <MasterCreationModal 
        isOpen={masterModal !== null}
        onClose={() => setMasterModal(null)}
        masterType={masterModal?.type || null}
        initialValue={masterModal?.initialValue || ''}
        onSave={(type, data) => {
           console.log(`Created new master of type ${type}:`, data);
           if (masterModal) {
             const { type: savedType, rowIndex } = masterModal;
             const fieldMap: any = { hsn: 'hsn', brand: 'brand', item: 'item', size: 'size' };
             const field = fieldMap[savedType];
             if (field) {
               updateProduct(rowIndex, field, data.name);
               // Move focus to next field
               const fields = ['brand', 'item', 'hsn', 'qty', 'rate', 'disc', 'mrp'];
               const currentFieldIndex = fields.indexOf(field);
               setTimeout(() => {
                 if (currentFieldIndex < fields.length - 1) {
                   document.getElementById(`row-${rowIndex}-${fields[currentFieldIndex + 1]}`)?.focus();
                 }
               }, 100);
             }
           }
           setMasterModal(null);
           // In a real implementation, we would POST to the backend and then set the local input value
        }}
      />
    </>
  );
}
