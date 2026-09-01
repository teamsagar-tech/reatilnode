import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import SuperAdminDashboard from './superadmin/SuperAdminDashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse((sessionStorage.getItem('user') || localStorage.getItem('user')) || '{}');
  const [showFirmSwitcher, setShowFirmSwitcher] = useState(false);
  const [firmSwitcherIndex, setFirmSwitcherIndex] = useState(0);
  
  if (user.role === 'superadmin') {
    return <SuperAdminDashboard />;
  }

  // Define the Tally-style menu hierarchy
  const allMenuData = {
    title: "Gateway of RetailNode",
    items: [
      {
        title: "Master",
        hotkey: "M",
        fKey: "F1",
        children: {
          title: "Master Menu",
          items: [
            {
              title: "Inventory Masters",
              hotkey: "I",
              children: {
                title: "Inventory Masters",
                items: [
                  { title: "Item", hotkey: "I", to: "/masters/item" },
                  { title: "Brand", hotkey: "B", to: "/masters/brand" },
                  { title: "Category", hotkey: "C", to: "/masters/category" },
                  { title: "Sub Category", hotkey: "S", to: "/masters/subcategory" },
                  { title: "Department", hotkey: "D", to: "/masters/department" },
                  { title: "Section", hotkey: "E", to: "/masters/section" },
                  { title: "Style", hotkey: "T", to: "/masters/style" },
                  { title: "Sub Style", hotkey: "Y", to: "/masters/substyle" },
                  { title: "Size", hotkey: "Z", to: "/masters/size" },
                  { title: "Color", hotkey: "O", to: "/masters/color" },
                  { title: "Material", hotkey: "M", to: "/masters/material" }
                ]
              }
            },
            {
              title: "Accounting Masters",
              hotkey: "A",
              children: {
                title: "Accounting Masters",
                items: [
                  { title: "Party", hotkey: "P", to: "/masters/party" },
                  { title: "Customer", hotkey: "C", to: "/masters/customer" },
                  { title: "Transporter", hotkey: "T", to: "/masters/transporter" },
                  { title: "Hundekari", hotkey: "H", to: "/masters/hundekari" },
                  { title: "Commission", hotkey: "M", to: "/masters/commission" },
                  { title: "HSN Master", hotkey: "N", to: "/masters/hsnsac" }
                ]
              }
            },
            {
              title: "Company Masters",
              hotkey: "C",
              children: {
                title: "Company Masters",
                items: [
                  { title: "Location", hotkey: "L", to: "/masters/location" },
                  { title: "Firm", hotkey: "F", to: "/masters/firm" }
                ]
              }
            }
          ]
        }
      },
      {
        title: "Purchase",
        hotkey: "P",
        fKey: "F2",
        children: {
          title: "Purchase Menu",
          items: [
            { title: "Purchase Order", hotkey: "O", to: "/purchase-order" },
            {
              title: "Purchase Invoice",
              hotkey: "I",
              children: {
                title: "Purchase Invoice",
                items: [
                  { title: "Purchase Invoice Entry", hotkey: "E", to: "/purchase-invoice" },
                  { title: "Purchase Invoice List", hotkey: "L", to: "/purchase/invoice/purchase-invoice-list" },
                  { title: "CSV Purchase Invoice", hotkey: "C", to: "/purchase/invoice/csvpurchase-invoice" }
                ]
              }
            },
            { title: "LR", hotkey: "L", to: "/lrs" },
            { title: "Transport Payment", hotkey: "T", to: "/purchase/transport-payment" },
            { title: "Hundekari Payment", hotkey: "H", to: "/purchase/hundekari-payment" },
            {
              title: "Purchase Return",
              hotkey: "R",
              children: {
                title: "Purchase Return",
                items: [
                  { title: "Purchase Return List", hotkey: "L", to: "/purchase/returns/purchase-return" },
                  { title: "Manual Purchase Return", hotkey: "M", to: "/purchase/returns/manual-purchase-return" },
                  { title: "Debit Note View", hotkey: "D", to: "/purchase/returns/debit-note-page" },
                  { title: "Return Challan View", hotkey: "V", to: "/purchase/returns/return-challan-page" }
                ]
              }
            }
          ]
        }
      },
      {
        title: "Sale",
        hotkey: "S",
        fKey: "F3",
        children: {
          title: "Sale Menu",
          items: [
            { title: "POS", hotkey: "P", to: "/sales/pointofsales" },
            { title: "Sales Drafts", hotkey: "D", to: "/sales/drafts/sales-drafts" },
            {
              title: "Sales Return",
              hotkey: "R",
              children: {
                title: "Sales Return",
                items: [
                  { title: "Sales Return List", hotkey: "L", to: "/sales/returns/sales-return" },
                  { title: "All Sales Returns", hotkey: "A", to: "/sales/returns/all-sales-return" },
                  { title: "Quick Sell Return", hotkey: "Q", to: "/sales/returns/quick-sell-return" }
                ]
              }
            },
            { title: "Manage Receivable", hotkey: "M", to: "/manage-receivable" },
            {
              title: "Approvals",
              hotkey: "A",
              children: {
                title: "Approvals",
                items: [
                  { title: "Price Approval Queue", hotkey: "P", to: "/sales/approvals/price-approval-queue" },
                  { title: "Credit Approval Queue", hotkey: "C", to: "/sales/approvals/credit-approval-queue" }
                ]
              }
            },
            { title: "Advance Receipts", hotkey: "V", to: "/sales/receipts/advance-receipt-page" }
          ]
        }
      },
      {
        title: "Logistics",
        hotkey: "L",
        fKey: "F4",
        children: {
          title: "Logistics Menu",
          items: [
            { title: "LR Pending", hotkey: "P", to: "/logistics/lrpending/lrpending-list" },
            { title: "Inward Overview", hotkey: "O", to: "/logistics/inward/inward-overview" },
            { title: "Inward Scanning", hotkey: "S", to: "/logistics/inward/inward-scanning" },
            { title: "Bulk Transit In", hotkey: "B", to: "/logistics/inward/bulk-transit-in" },
            { title: "View In Transit Invoice", hotkey: "V", to: "/logistics/invoices/view-in-transit-invoice" },
            { title: "View Barcoded Invoice", hotkey: "C", to: "/logistics/invoices/view-barcoded-invoice" }
          ]
        }
      },
      {
        title: "Inventory",
        hotkey: "I",
        fKey: "F5",
        children: {
          title: "Inventory Menu",
          items: [
            { title: "Verify Stock", hotkey: "V", to: "/inventory/verification/verify-stock" },
            { title: "Verify Stock History", hotkey: "H", to: "/inventory/verification/verify-stock-history" },
            { title: "Label Print", hotkey: "L", to: "/inventory/barcodes/label-print-page" },
            { title: "Bulk Label Print", hotkey: "B", to: "/inventory/barcodes/bulk-label-print" },
            { title: "Barcoded Products", hotkey: "P", to: "/inventory/barcodes/barcoded-products" },
            { title: "Barcodes Search", hotkey: "S", to: "/inventory/barcodes/barcodes-search" }
          ]
        }
      },
      {
        title: "Human Resources",
        hotkey: "H",
        fKey: "F6",
        children: {
          title: "HR Menu",
          items: [
            { title: "Attendance Entry", hotkey: "A", to: "/hr/attendance/attendance-entry" },
            { title: "Shift Master", hotkey: "S", to: "/hr/attendance/shift-master" },
            { title: "User Shifts", hotkey: "U", to: "/hr/attendance/user-shifts" },
            { title: "Salary Management", hotkey: "M", to: "/hr/payroll/salary-management" },
            { title: "Payroll Run", hotkey: "P", to: "/hr/payroll/payroll" },
            { title: "Expense Entries", hotkey: "E", to: "/hr/payroll/expense-entries" },
            { title: "Expense Dashboard", hotkey: "D", to: "/hr/payroll/expense-dashboard" }
          ]
        }
      },
      {
        title: "Settings",
        hotkey: "T",
        fKey: "F7",
        children: {
          title: "Settings Menu",
          items: [
            { title: "User Master", hotkey: "U", to: "/settings/users/user-master" },
            { title: "Roles", hotkey: "R", to: "/settings/users/roles" },
            { title: "System Config", hotkey: "C", to: "/settings/system/system-config" },
            { title: "Audit Log", hotkey: "A", to: "/settings/system/audit-log" },
            { title: "Vendor Payment Status", hotkey: "V", to: "/settings/portals/vendor-payment-status" },
            { title: "Vendor PO Tracker", hotkey: "P", to: "/settings/portals/admin-vendor-potracker" }
          ]
        }
      },
      {
        title: "Reports",
        hotkey: "R",
        fKey: "F8",
        children: {
          title: "Reports Menu",
          items: [
            {
              title: "Sales Reports",
              hotkey: "S",
              children: {
                title: "Sales Reports",
                items: [
                  { title: "HSN Sales", hotkey: "H", to: "/reports/sales/hsnsales-report" },
                  { title: "Department Sales", hotkey: "D", to: "/reports/sales/department-sales-report" },
                  { title: "Salesman Performance", hotkey: "P", to: "/reports/sales/salesman-performance-report" }
                ]
              }
            },
            {
              title: "Purchase Reports",
              hotkey: "P",
              children: {
                title: "Purchase Reports",
                items: [
                  { title: "PO Register", hotkey: "O", to: "/reports/purchase/poregister" },
                  { title: "Supplier Summary", hotkey: "S", to: "/reports/purchase/supplier-summary" },
                  { title: "Party Performance", hotkey: "A", to: "/reports/purchase/party-performance" }
                ]
              }
            },
            {
              title: "Inventory Reports",
              hotkey: "I",
              children: {
                title: "Inventory Reports",
                items: [
                  { title: "Current Stock", hotkey: "C", to: "/reports/inventory/current-stock" },
                  { title: "Category Stock", hotkey: "A", to: "/reports/inventory/category-stock" },
                  { title: "Stock Ageing", hotkey: "G", to: "/reports/inventory/stock-ageing" },
                  { title: "In-Transit Stock", hotkey: "T", to: "/reports/inventory/in-transit-stock" }
                ]
              }
            },
            {
              title: "Compliance Reports",
              hotkey: "C",
              children: {
                title: "Compliance Reports",
                items: [
                  { title: "GSTR Report", hotkey: "G", to: "/reports/compliance/gstr-report" },
                  { title: "E-Invoice Report", hotkey: "E", to: "/reports/compliance/einvoice-report" },
                  { title: "Daily Registers", hotkey: "D", to: "/reports/compliance/daily-registers" }
                ]
              }
            }
          ]
        }
      },
      { title: "Assistant", hotkey: "A", fKey: "F9", action: "open-chatbot" },
      { title: "Switch Firm", hotkey: "W", fKey: "F10", action: "switch-firm" },
      { section: "Quit" },
      { title: "Quit", hotkey: "Q", to: "quit" }
    ]
  };

  const [menuStack, setMenuStack] = useState([allMenuData]);

  useEffect(() => {
    try {
      const savedPath = sessionStorage.getItem('dashboardMenuPath');
      if (savedPath) {
        const titles = JSON.parse(savedPath);
        if (titles.length > 0 && titles[0] === "Gateway of RetailNode") {
          let currentLevel = allMenuData;
          const newStack = [currentLevel];
          for (let i = 1; i < titles.length; i++) {
            const nextLevel = currentLevel.items.find((item: any) => item.children && item.children.title === titles[i]);
            if (nextLevel) {
              currentLevel = nextLevel.children;
              newStack.push(currentLevel);
            } else {
              break;
            }
          }
          setMenuStack(newStack);
        }
      }
    } catch (e) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sessionStorage.setItem('dashboardMenuPath', JSON.stringify(menuStack.map(m => m.title)));
  }, [menuStack]);

  const currentMenu = menuStack[menuStack.length - 1];
  
  const focusableItems = currentMenu.items.filter((item: any) => !item.section);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [currentMenu]);

  const handleAction = (item: any) => {
    if (item.action === 'open-chatbot') {
      window.dispatchEvent(new CustomEvent('open-chatbot'));
      return;
    }
    if (item.action === 'switch-firm') {
      setShowFirmSwitcher(true);
      return;
    }
    if (item.children) {
      setMenuStack(prev => [...prev, item.children]);
    } else if (item.to) {
      if (item.to === 'quit') {
        if (menuStack.length > 1) {
          setMenuStack(prev => prev.slice(0, -1));
        } else {
          // root quit
        }
      } else {
        navigate(item.to);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFirmSwitcher) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setShowFirmSwitcher(false);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFirmSwitcherIndex(prev => Math.min(prev + 1, (user.available_firms || []).length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFirmSwitcherIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const target = (user.available_firms || [])[firmSwitcherIndex];
          if (target) handleSwitchFirm(target.firm_id);
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % focusableItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + focusableItems.length) % focusableItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (focusableItems[selectedIndex]) {
          handleAction(focusableItems[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (menuStack.length > 1) {
          setMenuStack(prev => prev.slice(0, -1));
        }
      } else if (e.key === "F10") {
        e.preventDefault();
        setShowFirmSwitcher(true);
      } else {
        const key = e.key.toUpperCase();
        const item = focusableItems.find((i: any) => i.hotkey && i.hotkey.toUpperCase() === key);
        if (item) {
          e.preventDefault();
          handleAction(item);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusableItems, selectedIndex, menuStack, showFirmSwitcher, firmSwitcherIndex]);

  const handleSwitchFirm = async (firmId: number) => {
    try {
      const res = await fetch('https://api.retailnode.in/api/auth/switch-firm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ firm_id: firmId })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload();
      } else {
        alert('Failed to switch firm');
      }
    } catch (err) {
      console.error(err);
      alert('Error switching firm');
    }
  };

  const renderTitle = (title: string, hotkey: string, isSelected: boolean) => {
    if (!hotkey) return <span>{title}</span>;
    const parts = title.split(new RegExp(`(${hotkey})`, 'i'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toUpperCase() === hotkey.toUpperCase() ? 
          <span key={i} className={`font-bold ${isSelected ? 'text-black' : 'text-red-600'}`}>{part}</span> : 
          <span key={i} className={isSelected ? 'text-black font-semibold' : 'text-slate-900 font-medium'}>{part}</span>
        )}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>RetailNode Dashboard</title>
      </Helmet>
      {/* RetailNode Main Background */}
      <div className="flex flex-col h-screen font-sans text-[14px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full">
        
        

        {/* Main Content Area */}
        <div className="flex flex-1 p-1 gap-1 overflow-hidden h-full">
          {/* Main Left+Center Container */}
          <div className="flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex overflow-hidden shadow-inner">
            
            {/* Left Panel - Company Info */}
            <div className="flex-1 flex flex-col border-r-2 border-[#81a09d] hidden md:flex bg-[#fcfaf2]">
              <div className="flex border-b-2 border-[#81a09d]">
                <div className="flex-1 p-2 border-r-2 border-[#81a09d] text-center font-bold text-black">
                  Current Period
                  <div className="text-black font-normal mt-1">1-Apr-2026 to 31-Mar-2027</div>
                </div>
                <div className="flex-1 p-2 text-center font-bold text-black">
                  Current Date
                  <div className="text-black font-normal mt-1">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}</div>
                </div>
              </div>
              
              <div className="flex-1 p-2">
                <div className="flex justify-between font-bold text-black border-b border-[#81a09d] pb-1 mb-2">
                  <div className="w-1/2">Name of Company</div>
                  <div className="w-1/2 text-right">Date of Last Entry</div>
                </div>
                <div className="flex justify-between font-bold text-black px-1 py-1">
                  <div className="w-1/2 cursor-pointer hover:bg-yellow-200" onClick={() => setShowFirmSwitcher(true)}>
                    {user.available_firms?.find((f: any) => f.firm_id === user.firm_id)?.firm_name || 'RetailNode V2 System'}
                  </div>
                  <div className="w-1/2 text-right font-normal italic">No Vouchers Entered</div>
                </div>
              </div>
            </div>

            {/* Right Panel - Dynamic Menu */}
            <div className="w-full md:w-[45%] lg:w-[35%] bg-[#eef5ed] flex flex-col relative border-l-2 border-white shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)]">
              <div className="bg-[#1b5e58] text-center py-1 text-white font-bold tracking-wide">
                {currentMenu.title}
              </div>
              
              {menuStack.length > 1 && (
                <div className="px-2 py-1 bg-[#d5e8d4] border-b border-[#81a09d] text-xs text-black font-medium flex items-center">
                  <button onClick={() => setMenuStack(prev => prev.slice(0, -1))} className="hover:text-red-700 transition-colors flex items-center gap-1">
                    &larr; Back (Esc)
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto outline-none py-2 px-1" tabIndex={0} ref={menuRef}>
                {currentMenu.items.map((item: any, idx: number) => {
                  if (item.section) {
                    return (
                      <div key={`sec-${idx}`} className="text-center font-bold text-black mt-2 mb-1 text-sm tracking-wide border-b border-black mx-4 italic">
                        {item.section}
                      </div>
                    );
                  }

                  const isFocused = focusableItems.findIndex((i: any) => i.title === item.title) === selectedIndex;

                  return (
                    <div
                      key={item.title}
                      onMouseEnter={() => setSelectedIndex(focusableItems.findIndex((i: any) => i.title === item.title))}
                      onClick={() => handleAction(item)}
                      className={`cursor-pointer px-4 py-1 mx-2 flex items-center justify-between transition-colors ${
                        isFocused ? "bg-[#ffe000] text-black font-bold" : "text-black"
                      }`}
                    >
                      <div className="flex items-center w-full justify-between">
                        {renderTitle(item.title, item.hotkey, isFocused)}
                        {item.children && <span className="text-black text-[10px]">&#9654;</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Action Sidebar (F-keys) */}
          <div className="w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]">
             {[
               { key: "F1", label: "Master" },
               { key: "F2", label: "Purchase" },
               { key: "F3", label: "Sale" },
               { key: "F4", label: "Logistics" },
               { key: "F5", label: "Inventory" },
               { key: "F6", label: "HR" },
               { key: "F7", label: "Settings" },
               { key: "F8", label: "Reports" },
               { key: "F9", label: "Assistant" },
               { key: "F10", label: "Switch Firm" },
             ].map((f) => {
               const targetItem = allMenuData.items.find((i: any) => i.fKey === f.key);
               
               return (
                 <button 
                   key={f.key} 
                   onClick={() => {
                     if (targetItem) {
                       setMenuStack([allMenuData]);
                       setTimeout(() => handleAction(targetItem), 0);
                     }
                   }}
                   className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
                 >
                   <span className="font-bold text-black text-xs w-[25px]">{f.key}</span>
                   <span className="text-black text-xs font-medium border-l border-[#a3c3be] pl-1 ml-1">{f.label}</span>
                 </button>
               );
             })}
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
               onClick={() => {
                  if (menuStack.length > 1) {
                    setMenuStack(prev => prev.slice(0, -1));
                  } else {
                    if (window.confirm("Are you sure you want to log out?")) {
                      sessionStorage.clear();
                      localStorage.clear();
                      window.location.href = '/login';
                    }
                  }
               }}
               className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
             >
                 <span className="font-bold text-black text-xs w-[25px] underline">Q</span>
                 <span className="text-black text-xs font-medium border-l border-[#a3c3be] pl-1 ml-1">{menuStack.length > 1 ? "Quit" : "Log Out"}</span>
             </button>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]">
          <div className="font-medium tracking-wide">RetailNode Main</div>
          <div className="flex gap-6">
            <span>Version: 1.0</span>
          </div>
        </div>
      </div>
      
      {sessionStorage.getItem('isImpersonating') === 'true' && (
        <div className="fixed bottom-10 left-4 z-[9999] bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-rose-600/30 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col">
            <span className="font-bold text-sm">SuperAdmin Active</span>
            <span className="text-[11px] opacity-90">Impersonating Mode</span>
          </div>
          <button 
            onClick={() => {
              sessionStorage.clear();
              window.location.href = '/dashboard';
            }}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-white/10"
          >
            Exit Mode
          </button>
        </div>
      )}

      {showFirmSwitcher && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[#eef5ed] border-2 border-[#81a09d] p-4 w-[400px] shadow-2xl">
            <h2 className="text-center font-bold text-[#1b5e58] text-[16px] mb-4 border-b border-[#a3c3be] pb-2 uppercase">Select Company</h2>
            <div className="flex flex-col max-h-[300px] overflow-y-auto bg-white border border-[#a3c3be]">
              {(user.available_firms || []).map((f: any, idx: number) => (
                <div 
                  key={f.firm_id}
                  onClick={() => handleSwitchFirm(f.firm_id)}
                  onMouseEnter={() => setFirmSwitcherIndex(idx)}
                  className={`px-4 py-2 cursor-pointer font-bold flex justify-between ${
                    idx === firmSwitcherIndex ? "bg-[#ffe000] text-black" : "text-[#1b5e58] hover:bg-[#f3f9f4]"
                  }`}
                >
                  <span>{f.firm_name}</span>
                  {f.firm_id === user.firm_id && <span className="text-[10px] bg-[#1b5e58] text-white px-1 rounded-sm uppercase">Active</span>}
                </div>
              ))}
            </div>
            <div className="text-center text-[10px] mt-2 font-bold text-slate-500">Use ↑ ↓ arrows to select, Enter to confirm, Esc to cancel</div>
          </div>
        </div>
      )}
    </>
  );
}
