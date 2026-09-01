import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumReportTemplate from '../../../components/layout/PremiumReportTemplate';
import { FileWarning } from 'lucide-react';

export default function DebitNotePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      } else if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <PremiumReportTemplate
      title="Debit Note Preview"
      subtitle="RetailNode ERP • Document No: DN-26-001"
      icon={<FileWarning className="w-6 h-6" />}
      onPrint={() => window.print()}
      maxWidth="max-w-[900px]"
    >
      <div className="flex-1 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm overflow-y-auto print:overflow-visible print:border-none print:shadow-none print:bg-white custom-scrollbar">
         
         {/* Printable Area - A4 Size Simulation */}
         <div className='w-full max-w-[800px] mx-auto bg-white p-8 sm:p-12 min-h-[1122px] print:w-full print:max-w-none print:min-h-0 print:p-0'>
            
            {/* Header */}
            <div className='text-center border-b-2 border-slate-800 pb-6 mb-8'>
              <h1 className='text-3xl font-black uppercase tracking-widest text-slate-800 mb-2'>Debit Note</h1>
              <h2 className='text-xl font-bold text-slate-700'>RetailNode Default Firm</h2>
              <p className="text-slate-600 mt-1 font-medium">123 Business Road, Tech City, State - 400001</p>
              <p className="text-slate-600 font-bold mt-1">GSTIN: <span className="font-medium">27AABCU9603R1ZX</span></p>
            </div>

            {/* Addresses and Info */}
            <div className='flex justify-between mb-8'>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl w-[45%] print:bg-white print:border-slate-300 print:rounded-none">
                <p className='font-bold text-slate-500 text-xs uppercase tracking-wider mb-2'>To (Supplier)</p>
                <p className='font-bold text-lg text-slate-800'>Supplier Name</p>
                <p className="text-slate-600 mt-1">Supplier Address Line 1</p>
                <p className="text-slate-600">City, State - 123456</p>
                <p className="text-slate-600 font-bold mt-2">GSTIN: <span className="font-medium">27XYZ123456</span></p>
              </div>
              <div className='text-right flex flex-col justify-center'>
                <div className="mb-2"><span className='font-bold text-slate-500 uppercase tracking-wider text-xs mr-2'>Debit Note No:</span> <span className="font-bold text-slate-800 text-lg">DN-26-001</span></div>
                <div className="mb-2"><span className='font-bold text-slate-500 uppercase tracking-wider text-xs mr-2'>Date:</span> <span className="font-bold text-slate-800">20-Aug-2026</span></div>
                <div><span className='font-bold text-slate-500 uppercase tracking-wider text-xs mr-2'>Ref PR:</span> <span className="font-bold text-slate-800">PR-26-001</span></div>
              </div>
            </div>

            {/* Items Table */}
            <table className='w-full border-collapse mb-8'>
              <thead>
                <tr className='bg-slate-100 border-y-2 border-slate-800 print:bg-white'>
                  <th className='px-4 py-3 text-center text-xs font-black text-slate-700 uppercase tracking-wider w-12'>Sr</th>
                  <th className='px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider'>Description of Goods</th>
                  <th className='px-4 py-3 text-center text-xs font-black text-slate-700 uppercase tracking-wider w-24'>HSN/SAC</th>
                  <th className='px-4 py-3 text-center text-xs font-black text-slate-700 uppercase tracking-wider w-24'>Qty</th>
                  <th className='px-4 py-3 text-right text-xs font-black text-slate-700 uppercase tracking-wider w-28'>Rate</th>
                  <th className='px-4 py-3 text-right text-xs font-black text-slate-700 uppercase tracking-wider w-32'>Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 border-b-2 border-slate-800">
                <tr>
                  <td className='px-4 py-4 text-center font-bold text-slate-500'>1</td>
                  <td className='px-4 py-4 font-bold text-slate-800'>Sample Defective Product A</td>
                  <td className='px-4 py-4 text-center text-slate-600'>6109</td>
                  <td className='px-4 py-4 text-center font-bold text-slate-700'>10 PCS</td>
                  <td className='px-4 py-4 text-right text-slate-600'>500.00</td>
                  <td className='px-4 py-4 text-right font-bold text-slate-800'>5,000.00</td>
                </tr>
                <tr>
                  <td className='px-4 py-4 text-center font-bold text-slate-500'>2</td>
                  <td className='px-4 py-4 font-bold text-slate-800'>Sample Defective Product B</td>
                  <td className='px-4 py-4 text-center text-slate-600'>6109</td>
                  <td className='px-4 py-4 text-center font-bold text-slate-700'>5 PCS</td>
                  <td className='px-4 py-4 text-right text-slate-600'>1,500.00</td>
                  <td className='px-4 py-4 text-right font-bold text-slate-800'>7,500.00</td>
                </tr>
                {/* Tax Rows */}
                <tr className="bg-slate-50 print:bg-white">
                  <td colSpan={5} className='px-4 py-3 text-right font-bold text-slate-600'>Total Taxable Amount</td>
                  <td className='px-4 py-3 text-right font-black text-slate-800'>12,500.00</td>
                </tr>
                <tr className="bg-slate-50 print:bg-white">
                  <td colSpan={5} className='px-4 py-2 text-right font-medium text-slate-500'>CGST @ 2.5%</td>
                  <td className='px-4 py-2 text-right text-slate-700'>312.50</td>
                </tr>
                <tr className="bg-slate-50 print:bg-white">
                  <td colSpan={5} className='px-4 py-2 text-right font-medium text-slate-500'>SGST @ 2.5%</td>
                  <td className='px-4 py-2 text-right text-slate-700'>312.50</td>
                </tr>
                <tr className="bg-indigo-50 border-t-2 border-slate-800 print:bg-white">
                  <td colSpan={5} className='px-4 py-4 text-right font-black text-indigo-900 text-lg print:text-slate-900'>Grand Total</td>
                  <td className='px-4 py-4 text-right font-black text-indigo-900 text-xl print:text-slate-900'>₹ 13,125.00</td>
                </tr>
              </tbody>
            </table>

            <div className='mb-12 bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-white print:border-none print:p-0'>
              <p className='font-bold text-xs text-slate-500 uppercase tracking-wider mb-1'>Amount Chargeable (in words)</p>
              <p className='italic font-bold text-slate-800 text-lg'>INR Thirteen Thousand One Hundred Twenty Five Only</p>
            </div>

            <div className='flex justify-between items-end mt-24 pt-8 border-t-2 border-slate-200'>
              <div className='text-center'>
                <p className='font-bold text-slate-400'>Receiver's Signature</p>
              </div>
              <div className='text-center flex flex-col items-center'>
                <p className='font-black text-slate-800 mb-16 uppercase tracking-wider text-sm'>For RetailNode Default Firm</p>
                <p className='font-bold text-slate-400'>Authorised Signatory</p>
              </div>
            </div>

         </div>
         
      </div>
    </PremiumReportTemplate>
  );
}
