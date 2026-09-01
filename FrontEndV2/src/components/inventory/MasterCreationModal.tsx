import React, { useState, useEffect, useRef } from 'react';
import { X, Save } from 'lucide-react';

interface MasterCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: string, data: any) => void;
  masterType: 'brand' | 'size' | 'item' | 'hsn' | null;
  initialValue?: string;
}

const InputRow = ({ label, value, onChange, placeholder = "", width = "flex-1", onKeyDown }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">{label}</div>
    <input 
      className={`${width} bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800`}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder}
      autoComplete="new-password"
      onKeyDown={onKeyDown || ((e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const form = e.currentTarget.closest('form');
          if (form) {
            const inputs = Array.from(form.querySelectorAll('input, button'));
            const index = inputs.indexOf(e.currentTarget);
            if (index > -1 && index < inputs.length - 1) {
              (inputs[index + 1] as HTMLElement).focus();
            }
          }
        }
      })}
    />
  </div>
);

export default function MasterCreationModal({ isOpen, onClose, onSave, masterType, initialValue = '' }: MasterCreationModalProps) {
  const [name, setName] = useState('');
  const [extra1, setExtra1] = useState('');
  const [extra2, setExtra2] = useState('');
  
  // Auto-suggest state for HSN
  const [hsnSuggestions, setHsnSuggestions] = useState<any[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const autofillTimeoutRef = useRef<any>(null);
  
  const firstInputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusedIndex >= 0 && suggestionListRef.current) {
      const activeEl = suggestionListRef.current.children[focusedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  useEffect(() => {
    if (isOpen) {
      setName(initialValue || '');
      setExtra1('');
      setExtra2('');
      setHsnSuggestions([]);
      setFocusedIndex(-1);
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, masterType, initialValue]);

  const handleHsnChange = (val: string) => {
    setExtra2(val);
    setFocusedIndex(-1);
    
    if (autofillTimeoutRef.current) {
      clearTimeout(autofillTimeoutRef.current);
    }
    
    if (val.length >= 2) {
      autofillTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`https://api.retailnode.in/api/gst/search-hsn-catalog?query=${encodeURIComponent(val)}`, {
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
          
          // Move focus to save button or next field
          setTimeout(() => {
            const form = document.querySelector('form');
            if (form) {
              const inputs = Array.from(form.querySelectorAll('input, button'));
              const index = inputs.indexOf(e.currentTarget);
              if (index > -1 && index < inputs.length - 1) {
                (inputs[index + 1] as HTMLElement).focus();
              }
            }
          }, 10);
        }
      } else if (e.key === 'Escape') {
        setHsnSuggestions([]);
        setFocusedIndex(-1);
      }
    } else {
      if (e.key === 'Enter') {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (form) {
          const inputs = Array.from(form.querySelectorAll('input, button'));
          const index = inputs.indexOf(e.currentTarget);
          if (index > -1 && index < inputs.length - 1) {
            (inputs[index + 1] as HTMLElement).focus();
          }
        }
      }
    }
  };

  const handleSave = async () => {
    if (!name) return;
    
    let data: any = { name };
    let endpoint = '';
    
    if (masterType === 'item') {
      data = { name, brand: extra1, hsn: extra2 };
      endpoint = 'https://api.retailnode.in/api/items';
    } else if (masterType === 'hsn') {
      data = { name, description: extra1 };
      endpoint = 'https://api.retailnode.in/api/masters/generic/hsnsacs';
    } else if (masterType === 'brand') {
      endpoint = 'https://api.retailnode.in/api/masters/brand';
    } else if (masterType === 'size') {
      endpoint = 'https://api.retailnode.in/api/masters/generic/sizes';
    }

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
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
          alert(errText);
          return;
        }
      }
    } catch (err) {
      console.error('Error creating master:', err);
      alert('Network error while creating master data');
      return;
    }

    onSave(masterType || '', data);
  };

  if (!isOpen || !masterType) return null;

  const getTitle = () => {
    switch (masterType) {
      case 'brand': return 'Brand Creation';
      case 'size': return 'Size Creation';
      case 'item': return 'Item Creation';
      case 'hsn': return 'HSN/SAC Creation';
      default: return 'Master Creation';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-[#e0efeb] border-2 border-[#1b5e58] shadow-[4px_4px_0px_rgba(0,0,0,0.2)] w-[500px] flex flex-col overflow-visible">
        
        {/* Header */}
        <div className="bg-[#1b5e58] text-white px-2 py-1 flex justify-between items-center shrink-0 border-b border-[#1b5e58]">
          <h2 className="text-[13px] font-bold tracking-tight">{getTitle()}</h2>
          <button onClick={onClose} className="p-0.5 hover:bg-[#12423d] transition-colors" tabIndex={-1}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Form Area */}
        <form className="p-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          
          <div className="flex items-center mb-[2px]">
            <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Name</div>
            <input 
              ref={firstInputRef}
              className={`flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800`}
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              autoComplete="new-password"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const form = e.currentTarget.closest('form');
                  if (form) {
                    const inputs = Array.from(form.querySelectorAll('input, button'));
                    const index = inputs.indexOf(e.currentTarget);
                    if (index > -1 && index < inputs.length - 1) {
                      (inputs[index + 1] as HTMLElement).focus();
                    }
                  }
                }
              }}
            />
          </div>

          {masterType === 'item' && (
            <>
              <InputRow label="Brand Name" value={extra1} onChange={setExtra1} />
              <div className="relative">
                <InputRow label="HSN/SAC" value={extra2} onChange={handleHsnChange} onKeyDown={handleHsnKeyDown} />
                {hsnSuggestions.length > 0 && (
                  <div ref={suggestionListRef} className="absolute left-[118px] top-[100%] z-50 w-[450px] bg-white border border-slate-400 shadow-xl max-h-[250px] overflow-y-auto">
                    {hsnSuggestions.map((s, idx) => (
                      <div 
                        key={idx} 
                        className={`px-2 py-1.5 text-[11px] cursor-pointer border-b border-slate-200 flex gap-2 items-start ${focusedIndex === idx ? 'bg-[#ffffe0]' : 'hover:bg-slate-50'}`}
                        onClick={() => {
                          setExtra2(s.code);
                          setHsnSuggestions([]);
                          setFocusedIndex(-1);
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
            </>
          )}

          {masterType === 'hsn' && (
            <InputRow label="Description" value={extra1} onChange={setExtra1} />
          )}

          <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-[#a3c3be]">
            <button 
              onClick={onClose}
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
