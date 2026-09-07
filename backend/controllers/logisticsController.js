const { pool } = require('../config/db');

exports.getTransporters = async (req, res) => {
  try {
    const firmId = req.firm_id;
    const [rows] = await pool.query('SELECT * FROM Transporters WHERE firm_id = ? ORDER BY id DESC', [firmId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching transporters:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createTransporter = async (req, res) => {
  try {
    const firmId = req.firm_id;
    const { transporter_name, mobile, email } = req.body;
    
    if (!transporter_name) {
      return res.status(400).json({ success: false, message: 'Transporter name is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO Transporters (firm_id, transporter_name, mobile, email) VALUES (?, ?, ?, ?)',
      [firmId, transporter_name, mobile, email]
    );

    res.json({ success: true, message: 'Transporter created successfully', data: { id: result.insertId } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Transporter with this Mobile/Email already exists' });
    }
    console.error('Error creating transporter:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getHundekaris = async (req, res) => {
  try {
    const firmId = req.firm_id;
    const [rows] = await pool.query('SELECT * FROM Hundekari WHERE firm_id = ? ORDER BY id DESC', [firmId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching hundekaris:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createHundekari = async (req, res) => {
  try {
    const firmId = req.firm_id;
    const { hundekari_name, mobile, email } = req.body;

    if (!hundekari_name) {
      return res.status(400).json({ success: false, message: 'Hundekari name is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO Hundekari (firm_id, hundekari_name, mobile, email) VALUES (?, ?, ?, ?)',
      [firmId, hundekari_name, mobile, email]
    );

    res.json({ success: true, message: 'Hundekari created successfully', data: { id: result.insertId } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Hundekari with this Mobile/Email already exists' });
    }
    console.error('Error creating hundekari:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getUnlinkedLRs = async (req, res) => {
  try {
    const firmId = req.firm_id;
    const [rows] = await pool.query(`
      SELECT ulr.*, t.transporter_name, h.hundekari_name 
      FROM Unlinked_LRs ulr
      LEFT JOIN Transporters t ON ulr.transporter_id = t.id
      LEFT JOIN Hundekari h ON ulr.hundekari_id = h.id
      WHERE ulr.firm_id = ? 
      ORDER BY ulr.id DESC
    `, [firmId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching unlinked LRs:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createUnlinkedLR = async (req, res) => {
  try {
    const firmId = req.firm_id;
    const { transporter_id, hundekari_id, lr_no, bale, inward_at_location_id, lr_inward_date } = req.body;

    if (!transporter_id || !hundekari_id || !lr_no || !bale || !inward_at_location_id || !lr_inward_date) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const [result] = await pool.query(
      'INSERT INTO Unlinked_LRs (firm_id, transporter_id, hundekari_id, lr_no, bale, inward_at_location_id, lr_inward_date, inwarded_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [firmId, transporter_id, hundekari_id, lr_no, bale, inward_at_location_id, lr_inward_date, req.user?.id || null]
    );

    res.json({ success: true, message: 'LR inwarded successfully', data: { id: result.insertId } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'This LR Number is already inwarded for this firm' });
    }
    console.error('Error creating unlinked LR:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


exports.getPendingLRs = async (req, res) => {
  try {
    const [rows] = await db.execute(`
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
    `, [req.firm_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pending LRs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
