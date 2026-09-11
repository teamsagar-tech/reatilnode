import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown from '../../components/SearchableDropdown';
import { useGlobalKeyboard } from '../../hooks/useGlobalKeyboard';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="font-bold text-[#1b5e58] text-[12px] border-b border-[#a3c3be] mb-2 mt-2 pb-1 uppercase tracking-wider bg-[#eef5ed] px-1">
      {children}
    </div>
);

export default function PriceListImport() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedBrandName, setSelectedBrandName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importStats, setImportStats] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bind global keyboard
  useGlobalKeyboard();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/brand`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setBrands(Array.isArray(data) ? data : []))
    .catch(console.error);
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a PDF file.');
      return;
    }
    
    // In RetailNode, typically an item should have a brand, but if it doesn't, that's okay.
    // If brand_id is null, it imports globally without brand restriction.

    setIsLoading(true);
    setImportStats(null);

    const formData = new FormData();
    formData.append('file', file);
    if (selectedBrandId) {
      formData.append('brand_id', selectedBrandId.toString());
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/inventory/import-pricelist`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        setImportStats(data.stats);
        alert('Price List imported successfully!');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        alert(data.error || 'Failed to import price list');
        console.error(data.details);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during import.');
      setIsLoading(false);
    }
  };

  // Tally Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      }
      if (e.altKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        handleImport();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, selectedBrandId, handleImport]);

  return (
    <>
      <Helmet>
        <title>Import Price List | RetailNode ERP</title>
      </Helmet>

      <div className="flex flex-col h-screen font-sans text-[13px] selection:bg-[#ffffe0] overflow-hidden bg-[#e0efeb]">
        {/* TOP HEADER */}
        <div className="bg-[#1b5e58] text-white flex justify-between items-center px-4 py-1 shrink-0 shadow-md z-10 border-b-2 border-[#13423e]">
          <div className="font-bold text-[14px] tracking-wide flex items-center gap-2">
             <span>PDF PRICE LIST IMPORT</span>
          </div>
          <button onClick={() => navigate(-1)} className="text-white hover:text-[#ffffe0] font-bold text-xs uppercase tracking-wider">
            [Esc] Quit
          </button>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-1 overflow-hidden relative">
          
          <div className="flex-1 flex flex-col items-center pt-[5vh] bg-[#eef5ed] overflow-y-auto">
            <div className="w-[800px] border-2 border-[#1b5e58] shadow-[0_4px_12px_rgba(0,0,0,0.1)] bg-white flex flex-col">
              
              <div className="bg-[#1b5e58] text-white font-bold p-1 px-3 text-center border-b border-[#a3c3be] shadow-inner text-[14px] uppercase tracking-widest">
                Upload Master Price List
              </div>

              <div className="flex flex-1">
                 {/* Left Panel */}
                 <div className="flex-1 border-r border-[#a3c3be] p-4 flex flex-col bg-[#fdfdfd]">
                    <SectionTitle>Import Configuration</SectionTitle>
                    
                    <div className="flex items-center mb-[2px]">
                      <div className="w-[140px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">
                        Target Brand
                      </div>
                      <div className="flex-1">
                        <SearchableDropdown
                          options={brands.map(b => ({ id: b.id, name: b.name }))}
                          value={selectedBrandName}
                          onChange={(val) => {
                            setSelectedBrandName(val);
                            const found = brands.find(b => b.name === val);
                            if (found) setSelectedBrandId(found.id);
                            else setSelectedBrandId(null);
                          }}
                          onSelect={(option) => {
                            setSelectedBrandName(option.name);
                            setSelectedBrandId(option.id);
                          }}
                          placeholder="Select Brand (Optional)"
                          width="w-full"
                          autoFocus={true}
                        />
                      </div>
                    </div>

                    <div className="flex items-center mb-[2px] mt-4">
                      <div className="w-[140px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">
                        Select PDF File
                      </div>
                      <div className="flex-1">
                         <input 
                           type="file" 
                           accept=".pdf" 
                           ref={fileInputRef}
                           onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                           className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 w-full"
                         />
                      </div>
                    </div>

                    <div className="mt-8 text-center text-[11px] text-slate-600 border border-slate-300 p-2 bg-slate-50">
                        <p><strong>Note:</strong> The system automatically extracts Item Names, Design Numbers, Colors (Shades), Ex-Mill, and Retail Prices.</p>
                    </div>

                 </div>
                 
                 {/* Right Panel (Stats) */}
                 <div className="flex-1 p-4 flex flex-col bg-white">
                    <SectionTitle>Import Status</SectionTitle>

                    {isLoading ? (
                       <div className="flex-1 flex items-center justify-center text-blue-800 font-bold">
                          Parsing PDF and updating Masters... please wait.
                       </div>
                    ) : importStats ? (
                       <div className="flex flex-col gap-2 mt-4 text-[12px]">
                          <div className="flex justify-between border-b pb-1">
                            <span className="font-bold text-slate-700">New Items Created:</span>
                            <span className="font-bold text-green-700">{importStats.itemsAdded}</span>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="font-bold text-slate-700">Items Updated:</span>
                            <span className="font-bold text-[#1b5e58]">{importStats.itemsUpdated}</span>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="font-bold text-slate-700">New Designs Registered:</span>
                            <span className="font-bold text-blue-700">{importStats.designsAdded}</span>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="font-bold text-slate-700">New Colors Registered:</span>
                            <span className="font-bold text-purple-700">{importStats.colorsAdded}</span>
                          </div>
                       </div>
                    ) : (
                       <div className="flex-1 flex items-center justify-center text-slate-400 font-bold italic text-center px-4">
                          Upload a PDF file to view extraction statistics.
                       </div>
                    )}
                 </div>
              </div>

              {/* Action Bar */}
              <div className="bg-[#c8d9d5] border-t border-[#a3c3be] p-2 flex justify-end gap-4 shadow-sm shrink-0">
                <button 
                  onClick={handleImport}
                  disabled={isLoading}
                  className={`bg-blue-800 text-white font-bold px-6 py-1 rounded-sm shadow-[2px_2px_0_rgba(255,255,255,1)] hover:bg-blue-900 uppercase tracking-widest text-xs border border-blue-900 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  [Alt+I] Import
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="bg-[#1b5e58] text-[#ffffe0] px-4 py-1 text-[11px] flex justify-between items-center shrink-0 font-bold tracking-wider z-10 border-t-2 border-[#13423e]">
          <div>Version 2.0 | RetailNode</div>
          <div className="flex gap-4 text-[#a3c3be]">
            <span><span className="text-[#ffffe0]">Alt+I</span>: Import</span>
            <span><span className="text-[#ffffe0]">Esc</span>: Quit</span>
          </div>
          <div>Master Synchronization</div>
        </div>
      </div>
    </>
  );
}
