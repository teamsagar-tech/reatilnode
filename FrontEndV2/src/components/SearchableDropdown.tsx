import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface SearchableDropdownProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  options: any[];
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  displayKey?: string;
  renderOption?: (option: any, isSelected: boolean) => React.ReactNode;
  onSelect?: (option: any) => void;
  width?: string;
  onNotFound?: (value: string) => void;
}

export default function SearchableDropdown({
  id, value, onChange, onKeyDown, options, placeholder, className, autoFocus,
  displayKey = 'name', renderOption, onSelect, width = '350px', onNotFound
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter(o => {
    const str = typeof o === 'string' ? o : o[displayKey];
    return (str || '').toLowerCase().includes((value || '').toLowerCase());
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, filtered.length - 1));
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
        return;
      } else if (e.key === 'Enter' && filtered.length > 0) {
        e.preventDefault();
        const selected = filtered[activeIndex];
        const val = typeof selected === 'string' ? selected : selected[displayKey];
        onChange(val);
        if (onSelect) onSelect(selected);
        setOpen(false);
        if (onKeyDown) {
           setTimeout(() => onKeyDown(e), 10);
        }
        return;
      } else if (e.key === 'Enter' && filtered.length === 0) {
        e.preventDefault();
        setOpen(false);
        if (onNotFound && value.trim() !== '') {
          onNotFound(value);
        } else if (onKeyDown) {
          onKeyDown(e);
        }
        return;
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
    }
    
    if (onKeyDown) {
       onKeyDown(e);
    }
  };

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <input
        id={id}
        type="text"
        className={className}
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        onFocus={e => {
          e.target.select();
          setOpen(true);
          setActiveIndex(0);
        }}
        onBlur={e => {
          // Small timeout to allow click events on dropdown options to fire first
          setTimeout(() => {
            if (open && filtered.length === 0 && value.trim() !== '' && onNotFound) {
              onNotFound(value);
            }
          }, 150);
        }}
        autoFocus={autoFocus}
        placeholder={placeholder}
        autoComplete="off"
      />
      {open && (
        <div 
          className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden"
          style={{ width: width }}
        >
          <div className="max-h-[200px] overflow-y-auto text-left font-normal">
            {filtered.map((opt, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <div
                  key={idx}
                  className={`px-3 py-2 text-xs cursor-pointer border-b border-slate-50 last:border-0 transition-colors ${isSelected ? 'bg-[#e0efeb]' : 'hover:bg-slate-50'}`}
                  onClick={() => {
                    const val = typeof opt === 'string' ? opt : opt[displayKey];
                    onChange(val);
                    if (onSelect) onSelect(opt);
                    setOpen(false);
                    if (onKeyDown) {
                       onKeyDown({ key: 'Enter', preventDefault: () => {} } as any);
                    }
                  }}
                >
                  {renderOption ? renderOption(opt, isSelected) : (typeof opt === 'string' ? opt : opt[displayKey])}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs text-slate-500 text-center italic">No matching results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const renderSupplierOption = (supplier: any, isSelected: boolean) => (
  <>
    <div className="flex justify-between items-center mb-1">
      <span className="font-semibold text-slate-800">{supplier.name}</span>
      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 rounded border border-slate-200">{supplier.state}</span>
    </div>
    <div className="flex items-center gap-1.5 mt-0.5">
      <div className="text-[10px] text-slate-500">
        GST: <span className="font-mono text-slate-700">{supplier.gst}</span>
      </div>
      {supplier.gstStatus === 'Active' ? (
        <span className="flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1 py-0.5 rounded text-[8px]"><CheckCircle2 className="w-2.5 h-2.5" /> ACTIVE</span>
      ) : (
        <span className="flex items-center gap-0.5 text-red-600 font-bold bg-red-50 border border-red-100 px-1 py-0.5 rounded text-[8px]"><AlertCircle className="w-2.5 h-2.5" /> {supplier.gstStatus?.toUpperCase() || 'SUSPENDED'}</span>
      )}
    </div>
  </>
);
