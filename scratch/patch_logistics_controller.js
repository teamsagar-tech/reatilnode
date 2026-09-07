const fs = require('fs');
const path = '/Users/ratan/Downloads/RetailNodeV2/backend/controllers/logisticsController.js';
let code = fs.readFileSync(path, 'utf8');

code += `

exports.getPendingLRs = async (req, res) => {
  try {
    const [rows] = await db.execute(\`
      SELECT 
        p.id, 
        p.lr_no as lrNo, 
        p.grn_no as grn, 
        p.lr_status as status, 
        v.name as partyName, 
        p.bill_no as billNo, 
        p.transporter, 
        p.bales, 
        DATE_FORMAT(p.bill_date, '%Y-%m-%d') as billDate
      FROM PurchaseInvoices p
      LEFT JOIN Vendors v ON p.vendor_id = v.id
      WHERE p.firm_id = ? AND p.lr_status = 'LR PENDING'
      ORDER BY p.created_at DESC
    \`, [req.firm_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pending LRs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
`;

fs.writeFileSync(path, code);
console.log('Patched logisticsController.js');
