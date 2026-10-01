const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Vendors WHERE firm_id = ?', [req.firm_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Vendors WHERE firm_id = ? AND id = ?', [req.firm_id, req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Vendor not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.create = async (req, res) => {
  const { 
    name, mobile, email, gst_no, billing_address, opening_balance, tally_guid,
    pan_number, state, state_code, short_name, type, 
    address_line1, address_line2, address_line3, pincode, city, taluka, district,
    contact_person, contact_person2, mobile_number2, contact_person3, mobile_number3,
    account_name, bank_name, account_number, ifsc_code, branch, account_type, categories, gst_raw_data 
  } = req.body;

  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const [result] = await db.execute(
      `INSERT INTO Vendors (
        firm_id, name, mobile, email, gst_no, billing_address, opening_balance, tally_guid,
        pan_number, state, state_code, short_name, type, 
        address_line1, address_line2, address_line3, pincode, city, taluka, district,
        contact_person, contact_person2, mobile_number2, contact_person3, mobile_number3,
        account_name, bank_name, account_number, ifsc_code, branch, account_type, categories, gst_raw_data
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      [
        req.firm_id, name, mobile || null, email || null, gst_no || null, billing_address || null, opening_balance || 0, tally_guid || null,
        pan_number || null, state || null, state_code || null, short_name || null, type || null,
        address_line1 || null, address_line2 || null, address_line3 || null, pincode || null, city || null, taluka || null, district || null,
        contact_person || null, contact_person2 || null, mobile_number2 || null, contact_person3 || null, mobile_number3 || null,
        account_name || null, bank_name || null, account_number || null, ifsc_code || null, branch || null, account_type || null, 
        categories ? JSON.stringify(categories) : null,
        gst_raw_data ? JSON.stringify(gst_raw_data) : null
      ]
    );
    res.status(201).json({ message: 'Vendor created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: error.message, sqlMessage: error.sqlMessage });
  }
};

exports.update = async (req, res) => {
  const { 
    name, mobile, email, gst_no, billing_address, opening_balance, tally_guid,
    pan_number, state, state_code, short_name, type, 
    address_line1, address_line2, address_line3, pincode, city, taluka, district,
    contact_person, contact_person2, mobile_number2, contact_person3, mobile_number3,
    account_name, bank_name, account_number, ifsc_code, branch, account_type, categories, gst_raw_data 
  } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE Vendors SET 
        name=?, mobile=?, email=?, gst_no=?, billing_address=?, opening_balance=?, tally_guid=?,
        pan_number=?, state=?, state_code=?, short_name=?, type=?, 
        address_line1=?, address_line2=?, address_line3=?, pincode=?, city=?, taluka=?, district=?,
        contact_person=?, contact_person2=?, mobile_number2=?, contact_person3=?, mobile_number3=?,
        account_name=?, bank_name=?, account_number=?, ifsc_code=?, branch=?, account_type=?, categories=?, gst_raw_data=?
      WHERE id=? AND firm_id=?`,
      [
        name, mobile || null, email || null, gst_no || null, billing_address || null, opening_balance || 0, tally_guid || null,
        pan_number || null, state || null, state_code || null, short_name || null, type || null,
        address_line1 || null, address_line2 || null, address_line3 || null, pincode || null, city || null, taluka || null, district || null,
        contact_person || null, contact_person2 || null, mobile_number2 || null, contact_person3 || null, mobile_number3 || null,
        account_name || null, bank_name || null, account_number || null, ifsc_code || null, branch || null, account_type || null, 
        categories ? JSON.stringify(categories) : null,
        gst_raw_data ? JSON.stringify(gst_raw_data) : null,
        req.params.id, req.firm_id
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ message: 'Vendor updated successfully' });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Vendors WHERE id=? AND firm_id=?', [req.params.id, req.firm_id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
