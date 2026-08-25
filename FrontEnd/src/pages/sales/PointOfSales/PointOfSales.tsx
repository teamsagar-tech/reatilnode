import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PointOfSalesHeader from './PointOfSalesHeader';
import PointOfSalesTable from './PointOfSalesTable';
import PointOfSalesFooter from './PointOfSalesFooter';
import PointOfSalesSidebar from './PointOfSalesSidebar';

export default function PointOfSales() {
  const navigate = useNavigate();

  // State
  const [cart, setCart] = useState<any[]>([]);
  const [customer, setCustomer] = useState({ name: '', mobile: '' });
  const [token, setToken] = useState('');
  const [salesman, setSalesman] = useState('');

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Main Exit
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate('/dashboard');
      }

      // F-Keys
      if (e.key === 'F1') {
        e.preventDefault();
        console.log('F1: Cash Pay');
      }
      if (e.key === 'F3') {
        e.preventDefault();
        console.log('F3: Card / UPI');
      }
      if (e.key === 'F9') {
        e.preventDefault();
        console.log('F9: Advance');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleBarcodeScan = (barcode: string) => {
    // Mock Product Lookup
    const mockProduct: any = {
      id: Date.now(),
      sr: cart.length + 1,
      sl: '01',
      barcode: barcode,
      category: 'SAREE',
      size: 'FREE',
      gst: 5,
      itemName: 'Sample Product ' + barcode,
      qty: 1,
      mtrs: 0,
      mrp: 1500,
      saleRate: 1200,
      stock: 10,
      cmsn: 0,
      excmn: 0,
      firm: 'V.R.Pawar'
    };

    // Total & Amount are computed
    mockProduct.amount = mockProduct.qty * mockProduct.saleRate;
    mockProduct.total = mockProduct.amount;

    setCart([...cart, mockProduct]);
  };

  return (
    <>
      <Helmet>
        <title>Point of Sales | RetailNode ERP</title>
      </Helmet>

      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        

        {/* Main Interface */}
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>

          {/* Left/Main Column: Header, Table, Footer */}
          <div className='flex-1 flex flex-col min-w-0 border-2 border-[#81a09d] shadow-inner bg-[#fcfaf2] relative overflow-hidden'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
              <div>CASH MEMO</div>
              <div className='text-yellow-300 font-bold'>[ V.R.PAWAR SAREES ]</div>
            </div>

            <PointOfSalesHeader
              token={token} setToken={setToken}
              customer={customer} setCustomer={setCustomer}
              salesman={salesman} setSalesman={setSalesman}
              onScan={handleBarcodeScan}
            />

            <div className='flex-1 overflow-y-auto border-y-2 border-slate-400'>
              <PointOfSalesTable cart={cart} />
            </div>

            <PointOfSalesFooter cart={cart} />
          </div>

          {/* Right Sidebar */}
          <PointOfSalesSidebar />
        </div>

        {/* Global Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d] shrink-0'>
          <div className='font-medium tracking-wide'>F1: Cash | F3: Card | Esc: Exit</div>
          <div className='font-bold text-[#a3c3be] tracking-wide'>&copy; RetailNode. &amp; V R Pawar</div>
        </div>
      </div>
    </>
  );
}
