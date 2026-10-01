import React, { useState } from 'react';
import { Upload, FileImage, Loader2 } from 'lucide-react';

export default function OCRTest() {
  const [file, setFile] = useState<File | null>(null);
  const [engine, setEngine] = useState<'gemini' | 'openai'>('gemini');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('engine', engine);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/purchase-invoices/ocr-test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scan image');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">OCR Tesseract Prototype</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-slate-200">
        <h2 className="text-lg font-semibold mb-4 text-slate-700">Upload Invoice Image (JPEG/PNG)</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <select 
            value={engine} 
            onChange={(e) => setEngine(e.target.value as 'gemini' | 'openai')}
            className="border-slate-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm font-medium p-2"
          >
            <option value="gemini">Google Gemini 1.5 Pro</option>
            <option value="openai">OpenAI GPT-4o</option>
          </select>

          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary/10 file:text-primary
              hover:file:bg-primary/20 cursor-pointer"
          />
          <button
            onClick={handleScan}
            disabled={!file || loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white whitespace-nowrap
              ${!file || loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Scan with AI Vision
          </button>
        </div>
        {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">{error}</div>}
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 text-slate-700">Raw AI JSON Output</h2>
            <pre className="bg-slate-50 p-4 rounded text-sm text-slate-600 overflow-x-auto whitespace-pre-wrap border border-slate-200 max-h-[500px] overflow-y-auto">
              {JSON.stringify(result.items, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 text-slate-700">Structured AI Output</h2>
            {result.items && result.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 font-medium">Item Name</th>
                      <th className="px-4 py-2 font-medium">Qty</th>
                      <th className="px-4 py-2 font-medium">Price</th>
                      <th className="px-4 py-2 font-medium">HSN</th>
                      <th className="px-4 py-2 font-medium">Design</th>
                      <th className="px-4 py-2 font-medium">Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.items.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{item.item_name}</td>
                        <td className="px-4 py-3 text-slate-500">{item.qty}</td>
                        <td className="px-4 py-3 text-slate-500">{item.price}</td>
                        <td className="px-4 py-3 text-slate-500">{item.hsn}</td>
                        <td className="px-4 py-3 text-slate-500">{item.design_no}</td>
                        <td className="px-4 py-3 text-slate-500">{item.color}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded text-slate-500 text-center border border-slate-200">
                No items were detected by the naive parser.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
