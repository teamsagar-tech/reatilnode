const db = require('../config/db');

exports.getInvoicesForBulk = async (req, res) => {
  try {
    const { partyId, fromDate, toDate, page = 1, limit = 50 } = req.query;
    const effectiveFirmId = req.firm_id;

    let query = `
      SELECT i.id, i.bill_no, i.bill_date, i.grn_no as grn, v.name as party_name 
      FROM PurchaseInvoices i
      LEFT JOIN Vendors v ON i.vendor_id = v.id
      WHERE i.firm_id = ? AND i.lr_status IN ('Delivered', 'By Hand')
    `;
    const params = [effectiveFirmId];

    if (partyId) {
      query += ` AND i.vendor_id = ?`;
      params.push(partyId);
    }
    if (fromDate) {
      query += ` AND i.bill_date >= ?`;
      params.push(fromDate);
    }
    if (toDate) {
      query += ` AND i.bill_date <= ?`;
      params.push(toDate);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` ORDER BY i.bill_date DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [invoices] = await db.execute(query, params);

    res.status(200).json({
      success: true,
      data: {
        invoices,
        pagination: { page: parseInt(page), limit: parseInt(limit) }
      }
    });
  } catch (error) {
    console.error('getInvoicesForBulk error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.previewBulkProducts = async (req, res) => {
  res.status(200).json({
      success: true,
      message: 'Preview generated successfully (Mock)',
      data: { products: [], summary: { total: 0 } }
  });
};

exports.createBulkProducts = async (req, res) => {
  res.status(201).json({
      success: true,
      message: 'Bulk products created (Mock)',
      data: { productsCreated: 0, batchId: 'BATCH-BULK-001' }
  });
};
