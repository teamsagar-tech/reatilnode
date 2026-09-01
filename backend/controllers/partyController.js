const db = require('../config/db');

exports.getAllParties = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM Parties WHERE firm_id = ? ORDER BY id DESC',
      [req.firm_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching parties:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createParty = async (req, res) => {
  const {
    gstin, panNumber, state, stateCode, partyName, shortName, type,
    line1, line2, line3, pincode, city, taluka, district,
    contactPerson, email, mobileNumber, mobileNumber2, mobileNumber3, contactNumber2, contactNumber3,
    accountName, bankName, accountNumber, ifsc, branch, bankAccountType, gstRawData,
    categories, brands
  } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO Parties (
        firm_id, gstin, pan_number, state, state_code, party_name, short_name, party_type,
        line1, line2, line3, pincode, city, taluka, district,
        contact_person, email, mobile_number1, mobile_number2, mobile_number3, contact_number2, contact_number3,
        account_name, bank_name, account_number, ifsc, branch, bank_account_type, gst_raw_data, categories, brands
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.firm_id,
        gstin || null,
        panNumber || null,
        state || null,
        stateCode || null,
        partyName,
        shortName || null,
        type || 'Sundry Debtor (Customer)',
        line1 || null,
        line2 || null,
        line3 || null,
        pincode || null,
        city || null,
        taluka || null,
        district || null,
        contactPerson || null,
        email || null,
        mobileNumber || null,
        mobileNumber2 || null,
        mobileNumber3 || null,
        contactNumber2 || null,
        contactNumber3 || null,
        accountName || null,
        bankName || null,
        accountNumber || null,
        ifsc || null,
        branch || null,
        bankAccountType || null,
        gstRawData ? JSON.stringify(gstRawData) : null,
        categories ? JSON.stringify(categories) : null,
        brands ? JSON.stringify(brands) : null
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Party created successfully' });
  } catch (error) {
    console.error('Error creating party:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateParty = async (req, res) => {
  const { id } = req.params;
  const {
    gstin, panNumber, state, stateCode, partyName, shortName, type,
    line1, line2, line3, pincode, city, taluka, district,
    contactPerson, email, mobileNumber, mobileNumber2, mobileNumber3, contactNumber2, contactNumber3,
    accountName, bankName, accountNumber, ifsc, branch, bankAccountType, gstRawData,
    categories, brands
  } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE Parties SET
        gstin = ?, pan_number = ?, state = ?, state_code = ?, party_name = ?, short_name = ?, party_type = ?,
        line1 = ?, line2 = ?, line3 = ?, pincode = ?, city = ?, taluka = ?, district = ?,
        contact_person = ?, email = ?, mobile_number1 = ?, mobile_number2 = ?, mobile_number3 = ?, contact_number2 = ?, contact_number3 = ?,
        account_name = ?, bank_name = ?, account_number = ?, ifsc = ?, branch = ?, bank_account_type = ?, gst_raw_data = ?,
        categories = ?, brands = ?
       WHERE id = ? AND firm_id = ?`,
      [
        gstin || null,
        panNumber || null,
        state || null,
        stateCode || null,
        partyName,
        shortName || null,
        type || 'Sundry Debtor (Customer)',
        line1 || null,
        line2 || null,
        line3 || null,
        pincode || null,
        city || null,
        taluka || null,
        district || null,
        contactPerson || null,
        email || null,
        mobileNumber || null,
        mobileNumber2 || null,
        mobileNumber3 || null,
        contactNumber2 || null,
        contactNumber3 || null,
        accountName || null,
        bankName || null,
        accountNumber || null,
        ifsc || null,
        branch || null,
        bankAccountType || null,
        gstRawData ? JSON.stringify(gstRawData) : null,
        categories ? JSON.stringify(categories) : null,
        brands ? JSON.stringify(brands) : null,
        id,
        req.firm_id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Party not found or unauthorized' });
    }

    res.json({ message: 'Party updated successfully' });
  } catch (error) {
    console.error('Error updating party:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
