import { confirmDialog } from '../store/useConfirmStore';
import { toast } from '../store/useToastStore';
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
    title: "Gateway of OneVastra",
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
                  { title: "Taxonomy", hotkey: "T", to: "/masters/taxonomy" },

                  { title: "Category", hotkey: "Y", to: "/masters/category" },
                  { title: "Sub Category", hotkey: "S", to: "/masters/subcategory" },

                  { title: "Style", hotkey: "T", to: "/masters/style" },

                  { title: "Size", hotkey: "Z", to: "/masters/size" },
                  { title: "Size Sets", hotkey: "T", to: "/masters/sizeset" },
                  { title: "Color", hotkey: "O", to: "/masters/color" },

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

                  { title: "Transporter", hotkey: "T", to: "/masters/transporter" },
                  { title: "Hundekari", hotkey: "H", to: "/masters/hundekari" },

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
                  { title: "Firm", hotkey: "F", to: "/masters/firm" },
                  { title: "User Master", hotkey: "U", to: "/settings/users/user-master" }
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

            {
              title: "Purchase Invoice",
              hotkey: "I",
              children: {
                title: "Purchase Invoice",
                items: [
                  { title: "Purchase Invoice Entry", hotkey: "E", to: "/purchase-invoice" },
                  { title: "Purchase Invoice List", hotkey: "L", to: "/purchase/invoice/purchase-invoice-list" },

                ]
              }
            },
            { title: "LR", hotkey: "L", to: "/lrs" },
            { title: "Transport Payment", hotkey: "T", to: "/purchase/transport-payment" },
            { title: "Hundekari Payment", hotkey: "H", to: "/purchase/hundekari-payment" },

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

          ]
        }
      },

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
        if (titles.length > 0 && titles[0] === "Gateway of OneVastra") {
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

  const handleAction = async (item: any) => {
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
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        navigate(item.to);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/switch-firm`, {
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
        toast.error('Failed to switch firm');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error switching firm');
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
        <title>OneVastra Dashboard</title>
      </Helmet>
      {/* OneVastra Main Background */}
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
                  <div className="w-1/2 cursor-pointer hover:bg-yellow-200" onClick={async () => setShowFirmSwitcher(true)}>
                    {user.available_firms?.find((f: any) => f.firm_id === user.firm_id)?.firm_name || 'OneVastra V2 System'}
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
                  <button onClick={async () => setMenuStack(prev => prev.slice(0, -1))} className="hover:text-red-700 transition-colors flex items-center gap-1">
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
                      onClick={async () => handleAction(item)}
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

          </div>

        {/* Bottom Status Bar */}
        <div className="bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]">
          <div className="font-medium tracking-wide">OneVastra Main</div>
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
            onClick={async () => {
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
                  onClick={async () => handleSwitchFirm(f.firm_id)}
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
