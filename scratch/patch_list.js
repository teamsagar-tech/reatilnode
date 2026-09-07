const fs = require('fs');

let content = fs.readFileSync('FrontEndV2/src/pages/purchase/Invoice/PurchaseInvoiceList.tsx', 'utf8');

// Find the hardcoded invoices array
const searchStr = `const [invoices] = useState([`;
const startIdx = content.indexOf(searchStr);

if (startIdx !== -1) {
    const endStr = `  ]);`;
    const endIdx = content.indexOf(endStr, startIdx) + endStr.length;

    const replacement = `  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.retailnode.in/api/purchase-invoices', {
      headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` }
    })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        const mappedData = data.map(inv => ({
          id: inv.id,
          grn: inv.grn_no || '',
          recvDt: inv.receive_date ? new Date(inv.receive_date).toLocaleDateString('en-GB') : '',
          billNo: inv.bill_no || '',
          billDate: inv.bill_date ? new Date(inv.bill_date).toLocaleDateString('en-GB') : '',
          partyName: inv.vendor_name || '',
          state: '',
          verified: '',
          valueDiff: '',
          totalAmt: (inv.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          discount: '',
          addChgs: '',
          taxableAmt: (inv.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          gstPercent: '',
          cgstAmt: inv.gst_amount ? (inv.gst_amount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '',
          sgstAmt: inv.gst_amount ? (inv.gst_amount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '',
          igstAmt: '',
          addLess: '',
          rOff: '',
          netAmount: (inv.net_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          userName: 'ADMIN',
          items: [],
          ledgers: []
        }));
        setInvoices(mappedData);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);`;

    content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
    fs.writeFileSync('FrontEndV2/src/pages/purchase/Invoice/PurchaseInvoiceList.tsx', content);
    console.log("Successfully patched PurchaseInvoiceList.tsx");
} else {
    console.log("Could not find hardcoded invoices array to replace");
}
