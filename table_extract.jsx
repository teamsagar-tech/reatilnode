                <table className="w-full text-left border-collapse relative">
                  <thead className="sticky top-0 bg-[#eef5ed] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                    <tr className="border-b-2 border-black text-slate-900 font-bold text-[12px]">
                      <th className="px-1 py-1 border-r border-slate-300 w-8 text-center">#</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[100px] text-center">Brand</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[200px] text-center">Name of Item</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">HSN/SAC</th>
                      {invoiceData.designNo && <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Design</th>}
                      {invoiceData.colourNo && <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Colour</th>}
                      {invoiceData.showSize && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Size</th>}
                      <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">Quantity</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Rate</th>
                      {invoiceData.showPurchaseDiscount && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Disc%</th>}
                      {invoiceData.showMarkdown && <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">MRP</th>}
                      {invoiceData.gstOn === 'items' && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">GST%</th>}
                      <th className="px-1 py-1 w-[100px] text-center">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, index) => (
                      <tr key={item.id} className="text-[13px] border-b border-slate-300">
                        <td className="border-r border-slate-300 px-1 py-[2px] text-center font-bold text-slate-500">{index + 1}</td>
                        <td className="border-r border-slate-300 px-1 py-[2px] relative">
                          <input id={`row-${index}-brand`} type="text" value={item.brand} onChange={e => { updateProduct(index, 'brand', e.target.value); setBrandSuggestionIndex(0); }} onFocus={(e) => handleBrandFocus(e, index)} onBlur={handleBrandBlur} onKeyDown={(e) => handleKeyDown(e, index, 'brand')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" autoComplete="off" />
                          {activeBrandRow === index && (
                            <div className="absolute top-full left-0 mt-0 bg-white border-2 border-black z-50 w-[200px] shadow-md max-h-[150px] overflow-y-auto">
                              {availableBrands.filter(b => (b.name || '').toLowerCase().startsWith((products[index].brand || '').toLowerCase())).slice(0, 8).map((suggestion, sIdx) => (
                                <div key={suggestion.id} className={`px-2 py-1 flex justify-between cursor-pointer ${sIdx === brandSuggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => {
                                  const newProducts = [...products];
                                  newProducts[index] = { ...newProducts[index], brand_id: suggestion.id, brand: suggestion.name || '' };
                                  setProducts(newProducts);
                                  setActiveBrandRow(null);
                                  document.getElementById(`row-${index}-item`)?.focus();
                                }}>
                                  <span>{suggestion.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="border-r border-slate-300 px-1 py-[2px] relative">
                          <input id={`row-${index}-item`} type="text" value={item.item} onChange={e => { updateProduct(index, 'item', e.target.value); setSuggestionIndex(0); }} onFocus={(e) => handleItemFocus(e, index)} onBlur={handleItemBlur} onKeyDown={(e) => handleKeyDown(e, index, 'item')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" autoComplete="off" />
                          {activeSuggestionRow === index && (
                            <div className="absolute top-full left-0 mt-0 bg-white border-2 border-black z-50 w-[300px] shadow-md max-h-[150px] overflow-y-auto">
                              {availableItems.filter(s => {
                              const q = (products[index].item || '').toLowerCase();
                              const textMatch = (s.name || s.item_name || '').toLowerCase().includes(q);
                              const bId = products[index].brand_id;
                              const bName = (products[index].brand || '').toLowerCase();
                              if (bId) return textMatch && s.brand_id === bId;
                              if (bName) return textMatch && (s.brand || '').toLowerCase() === bName;
                              return textMatch;
                            }).slice(0, 8).map((suggestion, sIdx) => (
                                <div key={suggestion.id} className={`px-2 py-1 flex justify-between cursor-pointer ${sIdx === suggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => {
                                  const newProducts = [...products];
                                  newProducts[index] = { ...newProducts[index], item: suggestion.name || suggestion.item_name, brand: suggestion.brand || '', rate: suggestion.purchase_price || suggestion.rate || '' };
                                  setProducts(newProducts);
                                  setActiveSuggestionRow(null);
                                  document.getElementById(`row-${index}-qty`)?.focus();
                                }}>
                                  <span>{suggestion.name || suggestion.item_name} <span className="text-[10px] text-slate-500 font-normal ml-2">{suggestion.type || suggestion.item_type}</span></span>
                                  <span className="text-slate-600">Stock: {suggestion.stock || 0}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="border-r border-slate-300 px-1 py-[2px] relative">
                          <input id={`row-${index}-hsn`} type="text" value={item.hsn || ''} onChange={e => { updateProduct(index, 'hsn', e.target.value); setHsnSuggestionIndex(0); }} onFocus={(e) => handleHsnFocus(e, index)} onBlur={handleHsnBlur} onKeyDown={(e) => handleKeyDown(e, index, 'hsn')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" autoComplete="off" />
                          {activeHsnRow === index && (
                            <div className="absolute top-full left-0 mt-0 bg-white border-2 border-black z-50 w-[300px] shadow-md max-h-[150px] overflow-y-auto">
                              {availableHsns.filter(s => (s.name || '').toLowerCase().startsWith((products[index].hsn || '').toLowerCase())).slice(0, 8).map((suggestion, sIdx) => (
                                <div key={suggestion.id} className={`px-2 py-1 flex flex-col cursor-pointer ${sIdx === hsnSuggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => {
                                  const newProducts = [...products];
                                  newProducts[index] = { 
                                    ...newProducts[index], 
                                    hsn: suggestion.name || '', 
                                    gst: suggestion.tax_percent !== undefined ? suggestion.tax_percent : (newProducts[index].gst || 0) 
                                  };
                                  setProducts(newProducts);
                                  setActiveHsnRow(null);
                                  document.getElementById(`row-${index}-qty`)?.focus();
                                }}>
                                  <span className="text-[11px]"><span className="font-bold text-[#1b5e58]">{suggestion.name}</span> - {suggestion.description} ({suggestion.tax_percent !== undefined ? suggestion.tax_percent : 0}%)</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        {invoiceData.designNo && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-design`} type="text" value={item.design} onChange={e => updateProduct(index, 'design', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'design')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" />
                          </td>
                        )}
                        {invoiceData.colourNo && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-colour`} type="text" value={item.colour} onChange={e => updateProduct(index, 'colour', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'colour')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" />
                          </td>
                        )}
                        {invoiceData.showSize && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-size`} type="text" value={item.size} onChange={e => updateProduct(index, 'size', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'size')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 font-bold text-center" />
                          </td>
                        )}
                        <td className="border-r border-slate-300 px-1 py-[2px]">
                          <input 
                            id={`row-${index}-qty`} 
                            type="number" 
                            value={item.qty} 
                            onChange={e => updateProduct(index, 'qty', e.target.value)} 
                            onKeyDown={(e) => {
                              if (e.altKey && e.code === 'KeyX') {
                                e.preventDefault();
                                e.stopPropagation();
                                setInvoiceData(prev => ({ ...prev, showSize: true }));
                                setActiveModalRow(index);
                              } else if (e.altKey && e.code === 'KeyZ') {
                                e.preventDefault();
                                e.stopPropagation();
                                setInvoiceData(prev => ({ ...prev, designNo: true }));
                                setActiveModalRow(index);
                              } else if (e.altKey && e.code === 'KeyL') {
                                e.preventDefault();
                                e.stopPropagation();
                                setInvoiceData(prev => ({ ...prev, showLocation: true }));
                                setActiveModalRow(index);
                              } else if (e.key === 'Enter') {
                                e.preventDefault();
                                if (invoiceData.showSize || invoiceData.designNo || invoiceData.colourNo || invoiceData.showLocation) {
                                  setActiveModalRow(index);
                                } else {
                                  handleKeyDown(e, index, 'qty');
                                }
                              } else {
                                handleKeyDown(e, index, 'qty');
                              }
                            }} 
                            className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" 
                          />
                        </td>
                        <td className="border-r border-slate-300 px-1 py-[2px]">
                          <input id={`row-${index}-rate`} type="number" value={item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'rate')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                        </td>
                        {invoiceData.showPurchaseDiscount && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-disc`} type="number" value={item.disc || ''} onChange={e => updateProduct(index, 'disc', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'disc')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        {invoiceData.showMarkdown && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-mrp`} type="number" value={item.mrp || ''} onChange={e => updateProduct(index, 'mrp', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'mrp')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        {invoiceData.gstOn === 'items' && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-gst`} type="number" value={item.gst || ''} onChange={e => updateProduct(index, 'gst', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'gst')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        <td className="px-1 py-[2px]">
                          <input type="text" value={((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0) * (1 - (item.disc || 0)/100)).toFixed(2)} readOnly className="w-full bg-transparent focus:outline-none px-1 text-right font-bold" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
