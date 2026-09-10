const db = require('../config/db');

exports.getTransporters = async (req, res) => {
  try {
    const firmId = req.firm_id;
    const [rows] = await db.query('SELECT * FROM Transporters WHERE firm_id = ? ORDER BY id DESC', [firmId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching transporters:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createTransporter = async (req, res) => {
  try {
    const firmId = req.firm_id;
    const name = req.body.name || req.body.transporter_name;
    const description = req.body.description || req.body.mobile || req.body.email ? `Mobile: ${req.body.mobile || ''}, Email: ${req.body.email || ''}` : '';
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Transporter name is required' });
    }

    const [result] = await db.query(
      'INSERT INTO Transporters (firm_id, name, description) VALUES (?, ?, ?)',
      [firmId, name, description]
    );

    res.json({ success: true, message: 'Transporter created successfully', data: { id: result.insertId, name } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Transporter already exists' });
    }
    console.error('Error creating transporter:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getHundekaris = async (req, res) => {
  try {
    const firmId = req.firm_id;
    const [rows] = await db.query('SELECT * FROM Hundekari WHERE firm_id = ? ORDER BY id DESC', [firmId]);
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

    const [result] = await db.query(
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
    const [rows] = await db.query(`
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

    const [result] = await db.query(
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

exports.createBulkUnlinkedLR = async (req, res) => {
  try {
    const firmId = req.firm_id;
    const { transporter_id, hundekari_id, inward_at_location_id, lr_inward_date, lrRows } = req.body;

    if (!transporter_id || !hundekari_id || !inward_at_location_id || !lr_inward_date || !Array.isArray(lrRows) || lrRows.length === 0) {
      return res.status(400).json({ success: false, message: 'All header fields and at least one LR row must be provided' });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      for (const row of lrRows) {
        if (!row.lr_no || !row.received_bales) continue;

        await connection.query(
          'INSERT INTO Unlinked_LRs (firm_id, transporter_id, hundekari_id, lr_no, bale, inward_at_location_id, lr_inward_date, inwarded_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [firmId, transporter_id, hundekari_id, row.lr_no, row.received_bales, inward_at_location_id, lr_inward_date, req.user?.id || null]
        );
      }
      await connection.commit();
      connection.release();
      res.json({ success: true, message: 'Bulk LRs inwarded successfully' });
    } catch (err) {
      await connection.rollback();
      connection.release();
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'One or more LR Numbers are already inwarded for this firm' });
      }
      throw err;
    }
  } catch (error) {
    console.error('Error creating bulk unlinked LRs:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.verifyLRBales = async (req, res) => {
  try {
    const { lr_no } = req.body;
    if (!lr_no) {
      return res.status(400).json({ error: 'LR No is required' });
    }

    const [rows] = await db.query(
      `SELECT p.id, p.bales 
       FROM PurchaseInvoices p 
       WHERE p.firm_id = ? AND p.lr_no = ? AND p.lr_status = 'LR PENDING' 
       ORDER BY p.created_at DESC LIMIT 1`,
      [req.firm_id, lr_no]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: 'LR No not found or already inwarded', expectedBales: null });
    }

    res.json({ success: true, expectedBales: rows[0].bales });
  } catch (error) {
    console.error('Error verifying LR bales:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getPendingLRs = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, 
        IFNULL(p.lr_no, '') as lrNo, 
        IFNULL(p.grn_no, '') as grn, 
        IFNULL(p.lr_status, '') as status, 
        IFNULL(v.name, '') as partyName, 
        IFNULL(p.bill_no, '') as billNo, 
        IFNULL(p.transporter, '') as transporter, 
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
