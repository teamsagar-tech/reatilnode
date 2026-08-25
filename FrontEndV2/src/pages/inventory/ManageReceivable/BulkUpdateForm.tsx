import React, { useState, useEffect } from 'react';

export default function BulkUpdateForm({ products, goBack }: { products: any[], goBack: () => void }) {

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goBack]);

  const handleFieldKeyDown = (e: React.KeyboardEvent, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
      } else {
        // End of form, simulate save
        const confirmSave = window.confirm("Save changes? (Y/N)");
        if (confirmSave) {
          alert("Products updated successfully!");
          goBack();
        }
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('field-0')?.focus();
    }, 100);
  }, []);

  const formFields = [
    'Item Name', 'Design No', 'Brand', 'Category', 'Sub Category', 'Style', 'MRP', 'Sell Rate', 'Purchase Rate', 'Work Cost'
  ];

  return (
    <div className='flex flex-col h-full bg-[#fcfaf2] p-4'>
      <div className='bg-blue-100 border border-blue-300 p-2 text-[12px] font-bold text-blue-900 mb-4'>
        Updating {products.length} selected product(s). Only fields with values entered will be overwritten.
      </div>

      <div className='flex flex-col gap-2'>
        {formFields.map((label, i) => (
          <div key={label} className="flex items-center mb-1">
            <div className="w-[180px] text-slate-800 font-bold text-[12px] text-right pr-2">
              {label}
            </div>
            <div className="flex-1">
              <input
                type="text"
                id={`field-${i}`}
                className="w-[300px] bg-[#e0efeb] border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                value={formData[label] || ''}
                onChange={(e) => setFormData({ ...formData, [label]: e.target.value })}
                onKeyDown={(e) => handleFieldKeyDown(e, `field-${i + 1}`)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className='mt-8 text-[11px] text-slate-500 italic'>
        Press Enter on the last field to save, or Esc to cancel.
      </div>
    </div>
  );
}
