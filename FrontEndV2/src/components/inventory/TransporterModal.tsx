import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TransporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTransporter: any) => void;
  initialTransporterName?: string;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#eef5ed] text-[#1b5e58] font-bold text-[11px] px-2 py-1 mb-1 border-b border-[#a3c3be] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]">
    {children}
  </div>
);

const InputRow = ({ label, value, onChange, placeholder = "", width = "flex-1" }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">{label}</div>
    <input 
      className={`${width} bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800`}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder}
      autoComplete="new-password"
    />
  </div>
);

export default function TransporterModal({ isOpen, onClose, onSave, initialTransporterName = '' }: TransporterModalProps) {
  const [formData, setFormData] = useState({
    transporter_name: initialTransporterName,
    mobile: '',
    email: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        transporter_name: initialTransporterName || '',
        mobile: '',
        email: ''
      });
    }
  }, [isOpen, initialTransporterName]);

  const handleSave = async () => {
    if (!formData.transporter_name) {
      alert("Transporter Name is required");
      return;
    }
    
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/transporters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        // Return the newly created item or constructed item
        onSave({
          id: data.insertId || data.id || Math.random(),
          transporter_name: formData.transporter_name,
          mobile: formData.mobile,
          email: formData.email
        });
      } else {
        alert(data.message || "Failed to create transporter");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving transporter");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col shadow-2xl w-[400px]">
        {/* Header */}
        <div className="bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between items-center">
          <div>Create New Transporter</div>
          <button onClick={onClose} className="hover:text-red-300">
            <X size={16} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-2 bg-[#f4f7f4] flex-1">
          <SectionTitle>Basic Info</SectionTitle>
          <div className="bg-white border border-[#a3c3be] p-2 mb-2 shadow-sm">
            <InputRow label="Transporter Name" value={formData.transporter_name} onChange={(v: string) => setFormData({...formData, transporter_name: v})} />
            <InputRow label="Mobile" value={formData.mobile} onChange={(v: string) => setFormData({...formData, mobile: v})} />
            <InputRow label="Email" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#eef5ed] border-t border-[#a3c3be] px-2 py-1 flex justify-end gap-2">
          <button onClick={onClose} className="bg-slate-200 border border-slate-400 px-4 py-1 text-xs font-bold text-slate-700 hover:bg-slate-300">
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading} className="bg-[#1b5e58] border border-[#12423d] px-4 py-1 text-xs font-bold text-white hover:bg-[#12423d] disabled:opacity-50">
            {loading ? 'Saving...' : 'Save (Alt+S)'}
          </button>
        </div>
      </div>
    </div>
  );
}
