import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import InvoicesView from './InvoicesView';
import BatchesView from './BatchesView';
import ProductsView from './ProductsView';
import BulkUpdateForm from './BulkUpdateForm';

type ViewState = 'invoices' | 'batches' | 'products' | 'bulkUpdate';

export default function ManageReceivable() {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<ViewState>('invoices');

  // Selection State
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const goBack = () => {
    if (viewState === 'bulkUpdate') setViewState('products');
    else if (viewState === 'products') setViewState('invoices');
    else navigate('/dashboard');
  };

  const handleInvoiceSelect = (invoice: any) => {
    // When Enter is pressed on an invoice, focus should jump to Batches Table
    // Actually the user will just press Tab or we can do a focus management, but for now they can see it below.
    // If we wanted to jump, we'd focus BatchesView.
  };

  const handleBatchSelect = (batch: any) => {
    setSelectedBatch(batch);
    setViewState('products');
  };

  const handleProductsUpdate = (products: any[]) => {
    setSelectedProducts(products);
    setViewState('bulkUpdate');
  };

  return (
    <>
      <Helmet>
        <title>Manage Receivables | RetailNode ERP</title>
      </Helmet>
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        

        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
              <div>
                {viewState === 'invoices' && 'Manage Receivables'}
                {viewState === 'batches' && `Invoice: ${selectedInvoice?.billNo} | Batches`}
                {viewState === 'products' && `Batch: ${selectedBatch?.batchId} | Products`}
                {viewState === 'bulkUpdate' && 'Bulk Update Products'}
              </div>
              <div className='text-yellow-300'>Receivables</div>
            </div>

            <div className='p-0 flex-1 overflow-hidden flex flex-col'>
              {viewState === 'invoices' && (
                <div className='flex flex-col h-full'>
                  <div className='h-1/2 flex flex-col border-b-[4px] border-[#1b5e58] overflow-hidden'>
                    <InvoicesView onSelect={handleInvoiceSelect} onFocusChange={(inv) => setSelectedInvoice(inv)} goBack={goBack} />
                  </div>
                  <div className='h-1/2 flex flex-col overflow-hidden'>
                    {selectedInvoice ? (
                      <BatchesView invoice={selectedInvoice} onSelect={handleBatchSelect} goBack={() => { }} />
                    ) : (
                      <div className='flex items-center justify-center h-full text-slate-500 font-bold'>
                        Select an invoice above to view batches
                      </div>
                    )}
                  </div>
                </div>
              )}
              {viewState === 'products' && (
                <ProductsView batch={selectedBatch} onBulkUpdate={handleProductsUpdate} goBack={goBack} />
              )}
              {viewState === 'bulkUpdate' && (
                <BulkUpdateForm products={selectedProducts} goBack={goBack} />
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
            {[
              { key: 'F1', label: 'Help' },
              { key: 'F2', label: 'Date' },
              { key: 'F4', label: 'Filter' },
              { key: 'F5', label: 'Search' },
            ].map((f) => (
              <button
                key={f.key}
                className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
              >
                <span className='font-bold text-black text-[11px] w-[25px]'>{f.key}</span>
                <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>{f.label}</span>
              </button>
            ))}
            <div className='flex-1' />
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
              onClick={() => navigate('/dashboard')}
              className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
            >
              <span className='font-bold text-black text-[11px] w-[25px] underline'>Q</span>
              <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d] shrink-0'>
          <div className='font-medium tracking-wide'>Manage Receivables</div>
          <div className='font-bold text-[#a3c3be] tracking-wide'>&copy; RetailNode. &amp; V R Pawar</div>
        </div>
      </div>
    </>
  );
}
