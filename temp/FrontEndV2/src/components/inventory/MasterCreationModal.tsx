import React, { useState, useEffect, useRef } from 'react';
import { X, Save } from 'lucide-react';

interface MasterCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: string, data: any) => void;
  masterType: 'brand' | 'size' | 'sizegroup' | 'item' | 'hsn' | 'partycategory' | 'partysubcategory' | null;
  initialValue?: string;
  initialBrand?: string;
  initialBrandId?: number | null;
  parentId?: number | null;
  editId?: number | string | null;
  initialExtra2?: string;
  initialExtra3?: string;
  initialHsn?: string;
  initialGst?: string;
  initialId?: number | null;
}

const InputRow = ({ label, value, onChange, placeholder = "", width = "flex-1", onKeyDown, onBlur, id }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">{label}</div>
    <input autoComplete="off"  
      id={id}
      className={`${width} bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800`}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      onBlur={onBlur}
      placeholder={placeholder}
      autoComplete="off"
      onKeyDown={onKeyDown || ((e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const form = e.currentTarget.closest('form');
          if (form) {
            // Select all inputs, and specifically the submit button (skip cancel)
            const inputs = Array.from(form.querySelectorAll('input, button[type="submit"]'));
            const index = inputs.indexOf(e.currentTarget as any);
            if (index > -1 && index < inputs.length - 1) {
              (inputs[index + 1] as HTMLElement).focus();
            }
          }
        }
      })}
    />
  </div>
);

export default function MasterCreationModal({ isOpen, onClose, onSave, masterType, initialValue = '', initialBrand, initialBrandId, parentId, editId, initialExtra2, initialExtra3, initialHsn, initialGst, initialId }: MasterCreationModalProps) {
  const [name, setName] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [extra1, setExtra1] = useState('');
  const [extra2, setExtra2] = useState('');
  const [extra3, setExtra3] = useState('');
  const [sizeScale, setSizeScale] = useState('Inch');
  
  const [availableScaleSizes, setAvailableScaleSizes] = useState<any[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  // Auto-suggest state for HSN
  const [hsnSuggestions, setHsnSuggestions] = useState<any[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const autofillTimeoutRef = useRef<any>(null);
  
  const firstInputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    if (isOpen && masterType) {
      let endpoint = '';
      if (masterType === 'item') endpoint = '/api/masters/item';
      else if (masterType === 'brand') endpoint = '/api/masters/brand';
      else if (masterType === 'hsn') endpoint = '/api/masters/generic/hsnsacs';
      else if (masterType === 'size' || masterType === 'sizeset') endpoint = '/api/masters/generic/sizesets'; // for size/sizeset we usually check sizesets if it has a hyphen, but let's check sizes AND sizesets
      else if (masterType === 'sizegroup') endpoint = '/api/masters/size-groups';
      else if (masterType === 'partycategory' || masterType === 'partysubcategory') endpoint = '/api/masters/category';

      if (masterType === 'size' || masterType === 'sizeset') {
        Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizes`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }).then(r=>r.json()),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizesets`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }).then(r=>r.json())
        ]).then(([sizes, sizesets]) => {
          const names = [...(Array.isArray(sizes)?sizes:[]), ...(Array.isArray(sizesets)?sizesets:[])].map(d => (d.name || '').toLowerCase().replace(/\s+/g, ''));
          setExistingNames(names);
        }).catch(()=>{});
      } else if (endpoint) {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
           if (Array.isArray(data)) {
             setExistingNames(data.map(d => (d.name || '').toLowerCase().replace(/\s+/g, '')));
           }
        })
        .catch(() => {});
      }
    }
  }, [isOpen, masterType]);

  useEffect(() => {
    if (name) {
      const normalized = name.toLowerCase().replace(/\s+/g, '');
      if (existingNames.includes(normalized) && !initialId && !editId) {
        setSubmitError(`Record '${name}' already exists.`);
      } else {
        setSubmitError('');
      }
    } else {
      setSubmitError('');
    }
  }, [name, existingNames, initialId, editId]);

  useEffect(() => {
    if (isOpen && ['size', 'sizeset', 'sizegroup'].includes(masterType || '')) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizes`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => {
        const matched = data.filter((s: any) => s.size_group === sizeScale);
        matched.sort((a: any, b: any) => parseFloat(a.name) - parseFloat(b.name));
        setAvailableScaleSizes(matched);
      })
      .catch(err => console.error("Error fetching scale sizes", err));
    }
  }, [isOpen, masterType, sizeScale]);

  useEffect(() => {
    if (['size', 'sizeset', 'sizegroup'].includes(masterType || '') && name.includes('-')) {
      const parts = name.split('-');
      if (parts.length === 2) {
        const start = parseFloat(parts[0]);
        const end = parseFloat(parts[1]);
        if (!isNaN(start) && !isNaN(end) && start < end) {
          const autoSelected = availableScaleSizes.filter(s => {
            const val = parseFloat(s.name);
            return !isNaN(val) && val >= start && val <= end;
          }).map(s => s.name);
          setSelectedSizes(autoSelected);
        }
      }
    } else {
      setSelectedSizes([]);
    }
  }, [name, availableScaleSizes, masterType]);

  const handleCheckboxToggle = (sizeName: string) => {
    setSelectedSizes(prev => 
      prev.includes(sizeName) ? prev.filter(s => s !== sizeName) : [...prev, sizeName]
    );
  };
  
  useEffect(() => {
    if (masterType === 'sizegroup') {
      if (selectedSizes.length > 0) {
        setExtra1(selectedSizes.join(', '));
      } else {
        setExtra1('');
      }
    }
  }, [selectedSizes, masterType]);

  useEffect(() => {
    if (focusedIndex >= 0 && suggestionListRef.current) {
      const activeEl = suggestionListRef.current.children[focusedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown, true);
    }
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setName(initialValue || '');
      setExtra1(masterType === 'item' && initialBrand ? initialBrand : '');
      setExtra2(initialExtra2 || initialHsn || '');
      setExtra3(initialExtra3 || initialGst || '');
      setHsnSuggestions([]);
      setFocusedIndex(-1);
      setSubmitError('');
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, masterType, initialValue, initialBrand, initialExtra2, initialExtra3, initialHsn, initialGst]);

  const handleHsnChange = (val: string) => {
    setExtra2(val);
    setFocusedIndex(-1);
    setSubmitError('');
    
    if (autofillTimeoutRef.current) {
      clearTimeout(autofillTimeoutRef.current);
    }
    
    if (val.length >= 2) {
      autofillTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gst/search-hsn-catalog?query=${encodeURIComponent(val)}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.ok) {
            const matches = await res.json();
            setHsnSuggestions(matches);
          }
        } catch (err) {
          console.error('Error fetching HSN', err);
        }
      }, 500);
    } else {
      setHsnSuggestions([]);
      setFocusedIndex(-1);
      setSubmitError('');
    }
  };

  const handleHsnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (hsnSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => (prev < hsnSuggestions.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < hsnSuggestions.length) {
          const s = hsnSuggestions[focusedIndex];
          setExtra2(s.code);
          setHsnSuggestions([]);
          setFocusedIndex(-1);
          setSubmitError('');
          
          // Move focus to save button or next field
          setTimeout(() => {
            const form = document.querySelector('form');
            if (form) {
              const inputs = Array.from(form.querySelectorAll('input, button[type="submit"]'));
              const activeInput = document.getElementById('hsn-input');
              if (activeInput) {
                const index = inputs.indexOf(activeInput);
                if (index > -1 && index < inputs.length - 1) {
                  (inputs[index + 1] as HTMLElement).focus();
                }
              }
            }
          }, 10);
        }
      } else if (e.key === 'Escape') {
        setHsnSuggestions([]);
        setFocusedIndex(-1);
        setSubmitError('');
      }
    } else {
      if (e.key === 'Enter') {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (form) {
          const inputs = Array.from(form.querySelectorAll('input, button[type="submit"]'));
          const index = inputs.indexOf(e.currentTarget as any);
          if (index > -1 && index < inputs.length - 1) {
            (inputs[index + 1] as HTMLElement).focus();
          }
        }
      }
    }
  };

  
  const fetchMatchedSizes = async (rangeName: string, scale: string) => {
    try {
      const parts = rangeName.split('-');
      if (parts.length === 2) {
        const start = parseFloat(parts[0]);
        const end = parseFloat(parts[1]);
        if (!isNaN(start) && !isNaN(end) && start < end) {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizes`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.ok) {
            const allSizes = await res.json();
            const matchedSizes = allSizes.filter((s: any) => {
                if (s.size_group !== scale) return false;
                const val = parseFloat(s.name);
                return !isNaN(val) && val >= start && val <= end;
            });
            matchedSizes.sort((a: any, b: any) => parseFloat(a.name) - parseFloat(b.name));
            const sizesArray = matchedSizes.map((s: any) => s.name);
            if (sizesArray.length > 0) return sizesArray;
          }
        }
      }
    } catch (err) {
      console.error("Error fetching master sizes", err);
    }
    return null;
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name || submitError) return;
    
    let data: any = { name };
    let endpoint = '';
    let method = 'POST';
    
    if (masterType === 'item') {
      const finalBrandId = extra1 === initialBrand ? initialBrandId : null;
      data = { name, brand: extra1, brand_id: finalBrandId, hsn_code: extra2, tax_percent: extra3 ? parseFloat(extra3) : 0 };
      if (editId) {
        endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/items/${editId}`;
        method = 'PUT';
      } else {
        endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/items`;
      }
    } else if (masterType === 'hsn') {
      data = { name, description: extra1, tax_percent: extra3 ? parseFloat(extra3) : 0 };
      endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/hsnsacs`;
    } else if (masterType === 'brand') {
      endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/brand`;
    } else if (masterType === 'size') {
      if (name.includes('-')) {
        let sizesArray = await fetchMatchedSizes(name, sizeScale);
        if (!sizesArray) {
          sizesArray = [];
          const parts = name.split('-');
          if (parts.length === 2) {
            const start = parseInt(parts[0], 10);
            const end = parseInt(parts[1], 10);
            if (!isNaN(start) && !isNaN(end) && start < end) {
              let step = 1;
              if (sizeScale === 'CM') {
                step = (end - start) % 5 === 0 ? 5 : ((end - start) % 2 === 0 ? 2 : 1);
              } else {
                step = (end - start) % 2 === 0 ? 2 : 1;
              }
              for (let i = start; i <= end; i += step) {
                sizesArray.push(i.toString());
              }
            }
          }
        }
        data = { name, size_scale: sizeScale, sizes_list: sizesArray };
        endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizesets`;
      } else {
        endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizes`;
      }
    } else if (masterType === 'sizeset') {
      let sizesArray: any[] = (extra1 || '').split(',').map(s => s.trim()).filter(Boolean);
      if (sizesArray.length === 0 && name.includes('-')) {
        const fetched = await fetchMatchedSizes(name, sizeScale);
        if (fetched) {
           sizesArray = fetched;
        } else {
          const parts = name.split('-');
          if (parts.length === 2) {
            const start = parseInt(parts[0], 10);
            const end = parseInt(parts[1], 10);
            if (!isNaN(start) && !isNaN(end) && start < end) {
              let step = 1;
              if (sizeScale === 'CM') {
                step = (end - start) % 5 === 0 ? 5 : ((end - start) % 2 === 0 ? 2 : 1);
              } else {
                step = (end - start) % 2 === 0 ? 2 : 1;
              }
              for (let i = start; i <= end; i += step) {
                sizesArray.push(i.toString());
              }
            }
          }
        }
      }
      data = { name: name, size_scale: sizeScale, sizes_list: sizesArray };
      endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizesets`;
    } else if (masterType === 'sizegroup') {
      let sizesArray: any[] = (extra1 || '').split(',').map(s => s.trim()).filter(Boolean);
      if (sizesArray.length === 0 && name.includes('-')) {
        const fetched = await fetchMatchedSizes(name, sizeScale);
        if (fetched) {
           sizesArray = fetched;
        } else {
          const parts = name.split('-');
          if (parts.length === 2) {
            const start = parseInt(parts[0], 10);
            const end = parseInt(parts[1], 10);
            if (!isNaN(start) && !isNaN(end) && start < end) {
              let step = 1;
              if (sizeScale === 'CM') {
                step = (end - start) % 5 === 0 ? 5 : ((end - start) % 2 === 0 ? 2 : 1);
              } else {
                step = (end - start) % 2 === 0 ? 2 : 1;
              }
              for (let i = start; i <= end; i += step) {
                sizesArray.push(i.toString());
              }
            }
          }
        }
      }
      data = { groupName: name, size_scale: sizeScale, sizes: sizesArray };
      endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/size-groups`;
    } else if (masterType === 'partycategory') {
      data = { name, parent_id: null };
      endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/category`;
    } else if (masterType === 'partysubcategory') {
      data = { name, parent_id: parentId };
      endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/category`;
    } else if (masterType === 'design') {
      endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/designs`;
    } else if (masterType === 'colour') {
      endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/colors`;
    }

    try {
      if (endpoint) {
        const effId = editId || initialId;
        const reqMethod = method !== 'POST' ? method : (effId ? 'PUT' : 'POST');
        const url = effId && !endpoint.includes(String(effId)) ? `${endpoint}/${effId}` : endpoint;
        const response = await fetch(url, {
          method: reqMethod,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          let errText = 'Failed to create master data';
          try {
            const errData = await response.json();
            if (errData.error) errText = errData.error;
          } catch(e) {}
          setSubmitError(errText);
          return;
        }
        
        try {
          const resData = await response.json();
          if (resData.id) {
            data.id = resData.id;
          } else if (resData.insertId) {
            data.id = resData.insertId;
          } else if (initialId) {
            data.id = initialId;
          }
        } catch(e) {}
      }
    } catch (err) {
      console.error('Error creating master:', err);
      setSubmitError('Network error while creating master data');
      return;
    }

    let actualSavedType = masterType || '';
    if (actualSavedType === 'size' && name.includes('-')) {
      actualSavedType = 'sizeset';
    }

    onSave(actualSavedType, data);
  };

  if (!isOpen || !masterType) return null;

  const getTitle = () => {
    switch (masterType) {
      case 'brand': return 'Brand Creation';
      case 'size': return 'Size Creation';
      case 'item': return 'Item Creation';
      case 'hsn': return 'HSN/SAC Creation';
      case 'sizeset': return 'Size Set Creation';
      case 'sizegroup': return 'Size Group Creation';
      case 'partycategory': return 'Party Category Creation';
      case 'partysubcategory': return 'Party Subcategory Creation';
      case 'design': return 'Design Creation';
      case 'colour': return 'Colour Creation';
      default: return 'Master Creation';
    }
  };

  return (
    <div id="master-creation-modal" className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-[#e0efeb] border-2 border-[#1b5e58] shadow-[4px_4px_0px_rgba(0,0,0,0.2)] w-[500px] flex flex-col overflow-visible">
        
        {/* Header */}
        <div className="bg-[#1b5e58] text-white px-2 py-1 flex justify-between items-center shrink-0 border-b border-[#1b5e58]">
          <h2 className="text-[13px] font-bold tracking-tight">{getTitle()}</h2>
          <button onClick={onClose} tabIndex={-1} className="p-0.5 hover:bg-[#12423d] transition-colors" tabIndex={-1}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Form Area */}
        <form className="p-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          
          <div className="flex items-center mb-[2px]">
            <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Name</div>
            <input autoComplete="off"  
              ref={firstInputRef}
              className={`flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800`}
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const form = e.currentTarget.closest('form');
                  if (form) {
                    const inputs = Array.from(form.querySelectorAll('input, button[type="submit"]'));
                    const index = inputs.indexOf(e.currentTarget);
                    if (index > -1 && index < inputs.length - 1) {
                      (inputs[index + 1] as HTMLElement).focus();
                    }
                  }
                }
              }}
            />
          
          </div>
          {submitError && <div className="text-red-600 text-[11px] font-bold mt-1 text-center bg-red-50 py-1 border border-red-200">{submitError}</div>}

          {masterType === 'item' && (
            <>
              <InputRow label="Brand Name" value={extra1} onChange={setExtra1} />
              <div className="relative">
                <InputRow id="hsn-input" label="HSN/SAC" value={extra2} onChange={handleHsnChange} onKeyDown={handleHsnKeyDown} onBlur={() => setTimeout(() => { setHsnSuggestions([]); setFocusedIndex(-1); }, 200)} />
                {hsnSuggestions.length > 0 && (
                  <div ref={suggestionListRef} className="absolute left-[118px] top-[100%] z-50 w-[450px] bg-white border border-slate-400 shadow-xl max-h-[250px] overflow-y-auto">
                    {hsnSuggestions.map((s, idx) => (
                      <div 
                        key={idx} 
                        className={`px-2 py-1.5 text-[11px] cursor-pointer border-b border-slate-200 flex gap-2 items-start ${focusedIndex === idx ? 'bg-[#ffffe0]' : 'hover:bg-slate-50'}`}
                        onClick={() => {
                          setExtra2(s.code);
                          setExtra3(s.tax_percent !== undefined ? String(s.tax_percent) : '');
                          setHsnSuggestions([]);
                          setFocusedIndex(-1);
      setSubmitError('');
                          setTimeout(() => {
                             const form = document.querySelector('form');
                             if (form) {
                               const inputs = Array.from(form.querySelectorAll('input, button[type="submit"]'));
                               const gstInput = document.getElementById('gst-input');
                               if (gstInput) {
                                 const index = inputs.indexOf(gstInput);
                                 if (index > -1 && index < inputs.length - 1) {
                                   (inputs[index + 1] as HTMLElement).focus(); // focus save button!
                                 }
                               }
                             }
                          }, 10);
                        }}
                      >
                        <span className="w-[60px] font-bold text-[#1b5e58] shrink-0">{s.code}</span>
                        <span className="flex-1 line-clamp-2 leading-tight text-slate-700">{s.description}</span>
                        <span className="w-[40px] text-right font-bold shrink-0">{s.tax_percent !== undefined ? s.tax_percent : 0}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <InputRow id="gst-input" label="GST %" value={extra3} onChange={setExtra3} placeholder="e.g. 5, 12, 18" />
            </>
          )}

          {masterType === 'hsn' && (
            <>
              <InputRow label="Description" value={extra1} onChange={setExtra1} />
              <InputRow label="Tax % (GST)" value={extra3} onChange={setExtra3} />
            </>
          )}

          {['size', 'sizeset', 'sizegroup'].includes(masterType) && (
            <>
              <div className="flex items-center mb-[2px]">
                <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Scale</div>
                <select
                  className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                  value={sizeScale}
                  onChange={(e) => setSizeScale(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const form = e.currentTarget.closest('form');
                      if (form) {
                        const inputs = Array.from(form.querySelectorAll('input, select, button[type="submit"]'));
                        const index = inputs.indexOf(e.currentTarget);
                        if (index > -1 && index < inputs.length - 1) {
                          (inputs[index + 1] as HTMLElement).focus();
                        }
                      }
                    }
                  }}
                >
                  <option value="Inch">Inch</option>
                  <option value="CM">CM</option>
                  <option value="Size">Size (S,M,L)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {availableScaleSizes.length > 0 ? (
                <div className="mt-3 border border-slate-300 p-2 bg-slate-50 max-h-[150px] overflow-y-auto">
                  <div className="text-[10px] font-bold text-slate-600 mb-2">AVAILABLE SIZES IN {sizeScale.toUpperCase()}</div>
                  <div className="flex flex-wrap gap-2">
                    {availableScaleSizes.map(s => (
                      <label key={s.name} className="flex items-center gap-1 text-[11px] font-bold cursor-pointer bg-white px-2 py-1 border border-slate-200 hover:border-slate-400">
                        <input 
                          type="checkbox" 
                          checked={selectedSizes.includes(s.name)}
                          onChange={() => handleCheckboxToggle(s.name)}
                          className="accent-[#1b5e58]"
                        />
                        {s.name}
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <InputRow label="Sizes (Optional, Comma separated)" value={extra1} onChange={setExtra1} placeholder="e.g. 28, 30, 32" />
              )}
            </>
          )}

          <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-[#a3c3be]">
            <button 
              onClick={onClose} tabIndex={-1}
              className="px-3 py-1 bg-white border border-slate-400 text-black font-bold text-[11px] hover:bg-slate-100"
              type="button"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-1 bg-yellow-400 border border-yellow-600 text-black font-bold flex items-center gap-1 text-[11px] hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600 outline-none"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
