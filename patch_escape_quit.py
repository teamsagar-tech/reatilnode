import sys

with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'r') as f:
    content = f.read()

# 1. Update latestState.current hook
old_state_def = """  const latestState = useRef({
    masterModal,
    showPartyModal,
    showTransporterModal,
    showAdditionalChargesModal,
    masterCreationState,
    showSupplierDropdown,
    showPurchaserDropdown,
    activeSuggestionRow,
    activeHsnRow,
    activeSizeMatrixRow,
    isReadOnly,
    invoiceLrStatus,
    handleSaveInvoice
  });"""

new_state_def = """  const latestState = useRef({
    masterModal,
    showPartyModal,
    showTransporterModal,
    showAdditionalChargesModal,
    masterCreationState,
    showSupplierDropdown,
    showPurchaserDropdown,
    activeSuggestionRow,
    activeHsnRow,
    activeSizeMatrixRow,
    isReadOnly,
    invoiceLrStatus,
    handleSaveInvoice,
    products,
    invoiceData
  });"""
content = content.replace(old_state_def, new_state_def)

old_state_effect = """  useEffect(() => {
    latestState.current = {
      masterModal,
      showPartyModal,
      showTransporterModal,
      showAdditionalChargesModal,
      masterCreationState,
      showSupplierDropdown,
      showPurchaserDropdown,
      activeSuggestionRow,
      activeHsnRow,
      activeSizeMatrixRow,
      isReadOnly,
      invoiceLrStatus,
      handleSaveInvoice
    };
  });"""

new_state_effect = """  useEffect(() => {
    latestState.current = {
      masterModal,
      showPartyModal,
      showTransporterModal,
      showAdditionalChargesModal,
      masterCreationState,
      showSupplierDropdown,
      showPurchaserDropdown,
      activeSuggestionRow,
      activeHsnRow,
      activeSizeMatrixRow,
      isReadOnly,
      invoiceLrStatus,
      handleSaveInvoice,
      products,
      invoiceData
    };
  });"""
content = content.replace(old_state_effect, new_state_effect)

# 2. Update Escape handler
old_escape = """        else navigate(-1);
      }
      
      if (e.altKey) {"""

new_escape = """        else {
          const hasData = state.invoiceData.supplier || state.products.some(p => p.item || Number(p.qty) > 0);
          if (hasData) {
            const wantToQuit = await confirmDialog("Quit: Yes or No?");
            if (wantToQuit) navigate('/dashboard');
          } else {
            navigate('/dashboard');
          }
        }
      }
      
      if (e.altKey) {"""

content = content.replace(old_escape, new_escape)

# 3. Update Quit button
old_quit = """             <button 
               onClick={async () => navigate('/dashboard')}
               className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] w-full"
             >
                 <span className="font-bold text-black text-[11px] w-[25px] underline">Q</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Quit</span>
             </button>"""

new_quit = """             <button 
               onClick={async () => {
                 const hasData = invoiceData.supplier || products.some(p => p.item || Number(p.qty) > 0);
                 if (hasData) {
                   const wantToQuit = await confirmDialog("Quit: Yes or No?");
                   if (wantToQuit) navigate('/dashboard');
                 } else {
                   navigate('/dashboard');
                 }
               }}
               className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] w-full"
             >
                 <span className="font-bold text-black text-[11px] w-[25px] underline">Q</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Quit</span>
             </button>"""

content = content.replace(old_quit, new_quit)

with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'w') as f:
    f.write(content)
