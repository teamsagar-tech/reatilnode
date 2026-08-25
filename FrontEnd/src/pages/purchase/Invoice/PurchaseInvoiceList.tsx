import React from "react";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown from '../../../components/SearchableDropdown';

export default function PurchaseInvoiceList() {
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDetailed, setIsDetailed] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: '2026-04-01',
    toDate: '2027-03-31',
    party: '',
    firm: '',
    location: '',
  });

  const [colWidths, setColWidths] = useState({
    grn: 70,
    recvDt: 80,
    billNo: 70,
    billDate: 80,
    partyName: 200,
    state: 100,
    verified: 70,
    valueDiff: 70,
    totalAmt: 100,
    discount: 70,
    addChgs: 70,
    taxableAmt: 100,
    gstPercent: 50,
    cgstAmt: 90,
    sgstAmt: 90,
    igstAmt: 90,
    addLess: 70,
    rOff: 50,
    netAmount: 110,
    userName: 80,
  });

  const handleResize = (colId: keyof typeof colWidths, newWidth: number) => {
    setColWidths(prev => ({
      ...prev,
      [colId]: newWidth
    }));
  };

  const ResizableHeader = ({ colId, title, className, minWidth = 40 }: { colId: keyof typeof colWidths, title: string, className?: string, minWidth?: number }) => {
    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = colWidths[colId];

      const onMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = Math.max(minWidth, startWidth + (moveEvent.clientX - startX));
        handleResize(colId, newWidth);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = 'default';
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'col-resize';
    };

    return (
      <th 
        className={`relative px-2 py-1 border-r border-slate-300 select-none ${className}`} 
        style={{ width: colWidths[colId], minWidth: colWidths[colId], maxWidth: colWidths[colId] }}
      >
        <span className="truncate block w-full text-[11px] leading-tight" title={title}>{title}</span>
        <div 
          className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-[#1b5e58] z-10 opacity-50"
          onMouseDown={handleMouseDown}
        />
      </th>
    );
  };

  const [invoices] = useState([
    { 
      id: 1, grn: '135939', recvDt: '29-Jul-26', billNo: '82474', billDate: '24-Jul-26', 
      partyName: 'MEENAKSHI SILK KENDRA-(TI', state: 'Karnataka', verified: '', valueDiff: '', 
      totalAmt: '57,440.00', discount: '', addChgs: '', taxableAmt: '57,440.00', 
      gstPercent: '5', cgstAmt: '2,872.00', sgstAmt: '', igstAmt: '', addLess: '', rOff: '', 
      netAmount: '60,312.00', userName: 'SHWETA',
      items: [
        { name: 'Red Cotton Shirt', qty: '100 pcs', rate: '1000.00', amount: '100,000.00' },
        { name: 'Blue Denim Jeans', qty: '50 pcs', rate: '1000.00', amount: '50,000.00' }
      ],
      ledgers: [
        { name: 'Purchase A/c', amount: '127,118.64' },
        { name: 'CGST @ 9%', amount: '11,440.68' },
        { name: 'SGST @ 9%', amount: '11,440.68' }
      ]
    },
    { 
      id: 2, grn: '135940', recvDt: '29-Jul-26', billNo: '82475', billDate: '24-Jul-26', 
      partyName: 'MEENAKSHI SILK KENDRA-(TI', state: 'Karnataka', verified: '', valueDiff: '', 
      totalAmt: '57,440.00', discount: '', addChgs: '', taxableAmt: '57,440.00', 
      gstPercent: '5', cgstAmt: '2,872.00', sgstAmt: '', igstAmt: '', addLess: '', rOff: '', 
      netAmount: '60,312.00', userName: 'SHWETA',
      items: [
        { name: 'Silk Saree', qty: '10 pcs', rate: '4100.00', amount: '41,000.00' }
      ],
      ledgers: [
        { name: 'Purchase A/c', amount: '41,000.00' },
        { name: 'IGST @ 5%', amount: '2,050.00' },
        { name: 'Freight Charges', amount: '2,150.00' }
      ]
    },
    { 
      id: 3, grn: '135777', recvDt: '24-Jul-26', billNo: '74', billDate: '24-Jul-26', 
      partyName: 'MOHD.IKHALAS MUSSADDI-(', state: 'Madhya P', verified: '', valueDiff: '', 
      totalAmt: '51,300.00', discount: '', addChgs: '', taxableAmt: '51,300.00', 
      gstPercent: '5', cgstAmt: '2,565.00', sgstAmt: '', igstAmt: '', addLess: '', rOff: '', 
      netAmount: '53,865.00', userName: 'SHWETA',
      items: [
        { name: 'Leather Jacket', qty: '20 pcs', rate: '3500.00', amount: '70,000.00' },
        { name: 'Winter Gloves', qty: '50 pcs', rate: '150.00', amount: '7,500.00' }
      ],
      ledgers: [
        { name: 'Purchase A/c', amount: '77,500.00' },
        { name: 'CGST @ 6%', amount: '4,650.00' },
        { name: 'SGST @ 6%', amount: '4,650.00' },
        { name: 'Discount Received', amount: '-2,700.00' },
        { name: 'Packaging Charges', amount: '5,400.00' }
      ]
    },
  ]);

  const calcTotal = (field: keyof typeof invoices[0]) => {
    return invoices.reduce((sum, inv) => {
      const strVal = String(inv[field] || '0').replace(/,/g, '');
      const val = parseFloat(strVal);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  };
  
  const fmt = (val: number) => val === 0 ? '' : val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  useEffect(() => {
    if (listRef.current) {
      listRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < invoices.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      } else if (e.key === 'F1') {
        e.preventDefault();
        setIsDetailed(prev => !prev);
      } else if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        navigate('/purchase-invoice');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, invoices.length]);

  return (
    <>
      <Helmet>
        <title>Purchase Invoice List | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Purchase Invoice Register</div>
               <div className='text-yellow-300'>RetailNode ERP</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
               
               {/* Filters / Header Info */}
               <div className='flex flex-row flex-wrap items-center gap-3 mb-2 bg-white border border-slate-400 p-2 shadow-sm'>
                  <div className="flex items-center">
                    <div className="text-slate-800 font-bold text-[11px] text-right pr-1">From</div>
                    <input 
                      type="date"
                      className="w-[100px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={filters.fromDate}
                      onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="text-slate-800 font-bold text-[11px] text-right pr-1">To</div>
                    <input 
                      type="date"
                      className="w-[100px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={filters.toDate}
                      onChange={(e) => setFilters({...filters, toDate: e.target.value})}
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="text-slate-800 font-bold text-[11px] text-right pr-1">Firm</div>
                    <SearchableDropdown
                      id="filter-firm"
                      className="w-[100px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={filters.firm}
                      onChange={(val) => setFilters({...filters, firm: val})}
                      options={['All', 'RetailNode Default Firm', 'Branch Office 1']}
                      placeholder="All Firms"
                      width="150px"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="text-slate-800 font-bold text-[11px] text-right pr-1">Location</div>
                    <SearchableDropdown
                      id="filter-location"
                      className="w-[100px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={filters.location}
                      onChange={(val) => setFilters({...filters, location: val})}
                      options={['All', 'Main Godown', 'Store Front']}
                      placeholder="All Locations"
                      width="150px"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="text-slate-800 font-bold text-[11px] text-right pr-1">Party A/c</div>
                    <SearchableDropdown
                      id="filter-party"
                      className="w-[180px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={filters.party}
                      onChange={(val) => setFilters({...filters, party: val})}
                      options={['All', 'Supplier A', 'Vendor XYZ', 'Global Traders']}
                      placeholder="All Parties"
                      width="200px"
                    />
                  </div>
                  
                  <div className="ml-auto flex gap-2">
                    <button className="bg-[#1b5e58] text-white px-3 py-1 font-bold text-[11px] hover:bg-[#12423d] shadow-[2px_2px_0_rgba(0,0,0,1)]">Search</button>
                    <button className="border border-[#1b5e58] text-[#1b5e58] px-3 py-1 font-bold text-[11px] hover:bg-slate-100 shadow-[2px_2px_0_rgba(0,0,0,0.1)]">Clear</button>
                  </div>
               </div>

               <div className='flex justify-between items-center mb-1'>
                 <div className='font-bold text-slate-800 text-[14px] underline decoration-slate-400 underline-offset-4'>
                   List of Purchase Invoices
                 </div>
               </div>

               {/* Table Area - Added overflow-x-auto for horizontal scroll */}
               <div 
                 className='flex-1 border border-slate-400 bg-white overflow-auto outline-none flex flex-col'
                 tabIndex={0}
                 ref={listRef}
               >
                 <table className='text-left border-collapse min-h-full' style={{ tableLayout: 'fixed', minWidth: '100%' }}>
                   <thead className='bg-[#eef5ed] sticky top-0 shadow-sm z-20'>
                     <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[11px]'>
                       <ResizableHeader colId="grn" title="GRN" />
                       <ResizableHeader colId="recvDt" title="RecvDt" />
                       <ResizableHeader colId="billNo" title="Bill No" />
                       <ResizableHeader colId="billDate" title="Bill Date" />
                       <ResizableHeader colId="partyName" title="Party Name" />
                       <ResizableHeader colId="state" title="State" />
                       <ResizableHeader colId="verified" title="Verified" />
                       <ResizableHeader colId="valueDiff" title="ValueDiff" />
                       <ResizableHeader colId="totalAmt" title="Total Amt" className="text-right" />
                       <ResizableHeader colId="discount" title="Discount" className="text-right" />
                       <ResizableHeader colId="addChgs" title="Add Chgs" className="text-right" />
                       <ResizableHeader colId="taxableAmt" title="Taxable Amt" className="text-right" />
                       <ResizableHeader colId="gstPercent" title="GST%" className="text-center" />
                       <ResizableHeader colId="cgstAmt" title="CGST Amt" className="text-right" />
                       <ResizableHeader colId="sgstAmt" title="SGST Amt" className="text-right" />
                       <ResizableHeader colId="igstAmt" title="IGST Amt" className="text-right" />
                       <ResizableHeader colId="addLess" title="Add/Less" className="text-right" />
                       <ResizableHeader colId="rOff" title="R.Off" className="text-right" />
                       <ResizableHeader colId="netAmount" title="Net Amount" className="text-right" />
                       <ResizableHeader colId="userName" title="User Name" />
                     </tr>
                   </thead>
                   <tbody>
                     {invoices.length > 0 ? invoices.map((inv, idx) => (
                       <React.Fragment key={inv.id}>
                         <tr 
                           onClick={() => setSelectedIndex(idx)}
                           className={`cursor-pointer ${selectedIndex === idx ? 'bg-[#ffe000] text-black font-bold' : (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]')}`}
                         >
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.grn}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.recvDt}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.billNo}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.billDate}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.partyName}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.state}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.verified}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.valueDiff}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap text-right ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.totalAmt}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap text-right ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.discount}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap text-right ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.addChgs}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap text-right ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.taxableAmt}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap text-center ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.gstPercent}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap text-right ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.cgstAmt}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap text-right ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.sgstAmt}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap text-right ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.igstAmt}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap text-right ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.addLess}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap text-right ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.rOff}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap text-right font-bold ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.netAmount}</td>
                           <td className={`px-2 py-1 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap ${selectedIndex === idx ? 'border-r-black' : ''}`}>{inv.userName}</td>
                         </tr>
                         {isDetailed && (
                           <>
                             {inv.items?.map((item, itemIdx) => (
                               <tr key={`${inv.id}-item-${itemIdx}`} className={`text-[11px] ${selectedIndex === idx ? 'bg-[#fff599] text-black' : 'bg-[#fcfaf2]'} border-b border-slate-200 border-dashed`}>
                                 <td colSpan={4} className="px-2 py-[2px] border-r border-slate-300 border-dashed"></td>
                                 <td colSpan={4} className="px-2 py-[2px] border-r border-slate-300 border-dashed pl-8 text-[#1b5e58] italic font-medium">
                                   {item.name}
                                   <span className="ml-4 text-slate-500">{item.qty} @ {item.rate}</span>
                                 </td>
                                 <td colSpan={10} className="px-2 py-[2px] border-r border-slate-300 border-dashed"></td>
                                 <td className="px-2 py-[2px] text-right italic text-slate-600 border-r border-slate-300 border-dashed">{item.amount}</td>
                                 <td className="px-2 py-[2px]"></td>
                               </tr>
                             ))}
                             {inv.ledgers?.map((ledger, ledgerIdx) => (
                               <tr key={`${inv.id}-ledger-${ledgerIdx}`} className={`text-[11px] ${selectedIndex === idx ? 'bg-[#fff599] text-black' : 'bg-[#fcfaf2]'} border-b border-slate-200`}>
                                 <td colSpan={4} className="px-2 py-[2px] border-r border-slate-300"></td>
                                 <td colSpan={4} className="px-2 py-[2px] border-r border-slate-300 pl-6 text-slate-800 font-medium">
                                   {ledger.name}
                                 </td>
                                 <td colSpan={10} className="px-2 py-[2px] border-r border-slate-300 text-center text-slate-500"></td>
                                 <td className="px-2 py-[2px] text-right text-slate-800 font-medium border-r border-slate-300">{ledger.amount}</td>
                                 <td className="px-2 py-[2px]"></td>
                               </tr>
                             ))}
                           </>
                         )}
                       </React.Fragment>
                     )) : (
                       <tr>
                         <td colSpan={20} className="text-center py-4 font-bold text-slate-500 italic">
                           No Invoices found for this period
                         </td>
                       </tr>
                     )}
                     <tr className="h-full">
                       <td colSpan={20} className="border-none"></td>
                     </tr>
                   </tbody>
                   <tfoot className="sticky bottom-0 bg-[#eef5ed] shadow-[0_-1px_3px_rgba(0,0,0,0.1)] z-10 border-t-2 border-slate-400">
                     <tr className="font-bold text-slate-900 text-[12px]">
                       <td colSpan={8} className="px-2 py-1 text-right border-r border-slate-300">Grand Total:</td>
                       <td className="px-2 py-1 text-right border-r border-slate-300">{fmt(calcTotal('totalAmt'))}</td>
                       <td className="px-2 py-1 text-right border-r border-slate-300">{fmt(calcTotal('discount'))}</td>
                       <td className="px-2 py-1 text-right border-r border-slate-300">{fmt(calcTotal('addChgs'))}</td>
                       <td className="px-2 py-1 text-right border-r border-slate-300">{fmt(calcTotal('taxableAmt'))}</td>
                       <td className="px-2 py-1 text-right border-r border-slate-300"></td>
                       <td className="px-2 py-1 text-right border-r border-slate-300">{fmt(calcTotal('cgstAmt'))}</td>
                       <td className="px-2 py-1 text-right border-r border-slate-300">{fmt(calcTotal('sgstAmt'))}</td>
                       <td className="px-2 py-1 text-right border-r border-slate-300">{fmt(calcTotal('igstAmt'))}</td>
                       <td className="px-2 py-1 text-right border-r border-slate-300">{fmt(calcTotal('addLess'))}</td>
                       <td className="px-2 py-1 text-right border-r border-slate-300">{fmt(calcTotal('rOff'))}</td>
                       <td className="px-2 py-1 text-right border-r border-slate-300 text-[#1b5e58]">{fmt(calcTotal('netAmount'))}</td>
                       <td></td>
                     </tr>
                   </tfoot>
                 </table>
               </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb] shrink-0'>
             {[
               { key: 'F1', label: isDetailed ? 'Condensed' : 'Detailed', action: () => setIsDetailed(!isDetailed) },
               { key: 'F2', label: 'Period' },
               { key: 'F4', label: 'GRN Type' },
               { key: 'Alt+C', label: 'Create', to: '/purchase-invoice' },
             ].map((f) => (
               <button 
                 key={f.key} 
                 onClick={() => f.action ? f.action() : (f.to ? navigate(f.to) : null)}
                 className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
               >
                 <span className='font-bold text-black text-[11px] w-[35px]'>{f.key}</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>{f.label}</span>
               </button>
             ))}
             <div className='flex-1' />
             <button 
               onClick={() => navigate(-1)}
               className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
             >
                 <span className='font-bold text-black text-[11px] w-[35px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>Purchase Invoice List</div>
        </div>
      </div>
    </>
  );
}
