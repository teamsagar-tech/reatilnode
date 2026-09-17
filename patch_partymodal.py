import sys
with open('FrontEndV2/src/components/inventory/PartyModal.tsx', 'r') as f:
    content = f.read()

# 1. Update initial state
content = content.replace(
    "gstRawData: null as any\n  });",
    "gstRawData: null as any,\n    invoiceConfig: { designNo: false, colourNo: false, showSize: false, showPurchaseDiscount: false, showMarkdown: false }\n  });"
)

# 2. Update edit mode mapping
content = content.replace(
    "gstRawData: editPartyData.gst_raw_data ? (typeof editPartyData.gst_raw_data === 'object' ? editPartyData.gst_raw_data : (typeof editPartyData.gst_raw_data === 'string' && editPartyData.gst_raw_data.trim().startsWith('{') ? JSON.parse(editPartyData.gst_raw_data) : null)) : null\n        });",
    "gstRawData: editPartyData.gst_raw_data ? (typeof editPartyData.gst_raw_data === 'object' ? editPartyData.gst_raw_data : (typeof editPartyData.gst_raw_data === 'string' && editPartyData.gst_raw_data.trim().startsWith('{') ? JSON.parse(editPartyData.gst_raw_data) : null)) : null,\n          invoiceConfig: editPartyData.invoice_config ? (typeof editPartyData.invoice_config === 'string' ? JSON.parse(editPartyData.invoice_config) : editPartyData.invoice_config) : { designNo: false, colourNo: false, showSize: false, showPurchaseDiscount: false, showMarkdown: false }\n        });"
)

# 3. Add UI Section
ui_section = """            <div className="mt-2 border border-slate-300 p-2 bg-[#fcfaf2]">
              <h4 className="text-[12px] font-bold text-[#1b5e58] border-b border-slate-300 mb-2 pb-1">Invoice UI Defaults</h4>
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold">
                <label className="flex items-center gap-1 cursor-pointer">
                   <input type="checkbox" checked={formData.invoiceConfig.designNo} onChange={e => setFormData({...formData, invoiceConfig: {...formData.invoiceConfig, designNo: e.target.checked}})} className="accent-[#1b5e58]" /> Design No
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                   <input type="checkbox" checked={formData.invoiceConfig.colourNo} onChange={e => setFormData({...formData, invoiceConfig: {...formData.invoiceConfig, colourNo: e.target.checked}})} className="accent-[#1b5e58]" /> Colour No
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                   <input type="checkbox" checked={formData.invoiceConfig.showSize} onChange={e => setFormData({...formData, invoiceConfig: {...formData.invoiceConfig, showSize: e.target.checked}})} className="accent-[#1b5e58]" /> Size
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                   <input type="checkbox" checked={formData.invoiceConfig.showPurchaseDiscount} onChange={e => setFormData({...formData, invoiceConfig: {...formData.invoiceConfig, showPurchaseDiscount: e.target.checked}})} className="accent-[#1b5e58]" /> Discount %
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                   <input type="checkbox" checked={formData.invoiceConfig.showMarkdown} onChange={e => setFormData({...formData, invoiceConfig: {...formData.invoiceConfig, showMarkdown: e.target.checked}})} className="accent-[#1b5e58]" /> MRP Markdown
                </label>
              </div>
            </div>"""

content = content.replace(
    "                </div>\n              </div>\n              \n              <SectionTitle>Contact Details</SectionTitle>",
    "                </div>\n              </div>\n" + ui_section + "\n              <SectionTitle>Contact Details</SectionTitle>"
)

with open('FrontEndV2/src/components/inventory/PartyModal.tsx', 'w') as f:
    f.write(content)
