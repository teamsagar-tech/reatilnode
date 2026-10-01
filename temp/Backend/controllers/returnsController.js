const { pool } = require('../config/db');

exports.processSalesReturn = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { customer_id, items, total_refund_amount, remark } = req.body;
    const effectiveFirmId = req.firm_id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided for return' });
    }

    await connection.beginTransaction();

    // Generate Return No
    const [counts] = await connection.query('SELECT COUNT(*) as count FROM SalesReturns WHERE firm_id = ?', [effectiveFirmId]);
    const nextId = counts[0].count + 1;
    const returnNo = `SR-${Date.now().toString().slice(-4)}-${nextId}`; 

    const [returnResult] = await connection.query(`
      INSERT INTO SalesReturns (
        firm_id, return_no, customer_id, total_refund_amount, remark, created_by_user_id,
        total_commission_reversed, total_coupon_discount_reversed, loyalty_points_debited
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      effectiveFirmId, returnNo, customer_id || null, total_refund_amount, remark, req.user?.id || null,
      req.body.total_commission_reversed || 0, req.body.total_coupon_discount_reversed || 0, req.body.loyalty_points_debited || 0
    ]);

    const returnId = returnResult.insertId;

    for (const item of items) {
      await connection.query(`
        INSERT INTO SalesReturnItems (
          firm_id, sales_return_id, product_id, barcode, refund_amount, returned_commission
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        effectiveFirmId, returnId, item.product_id, item.barcode, item.refund_amount,
        item.returned_commission || 0
      ]);

      // Flip the product status back to available
      await connection.query(`
        UPDATE Products SET is_sold = 0, is_returned = 1, sold_bill_id = NULL 
        WHERE id = ? AND firm_id = ?
      `, [item.product_id, effectiveFirmId]);
    }

    await connection.commit();
    res.status(201).json({ success: true, message: 'Sales return processed', data: { return_no: returnNo } });

  } catch (error) {
    await connection.rollback();
    console.error('processSalesReturn error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

exports.processPurchaseReturn = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { party_id, items, total_debit_amount, remark } = req.body;
    const effectiveFirmId = req.firm_id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided for return' });
    }

    await connection.beginTransaction();

    const [counts] = await connection.query('SELECT COUNT(*) as count FROM PurchaseReturns WHERE firm_id = ?', [effectiveFirmId]);
    const nextId = counts[0].count + 1;
    const debitNoteNo = `DN-${Date.now().toString().slice(-4)}-${nextId}`; 

    const [returnResult] = await connection.query(`
      INSERT INTO PurchaseReturns (firm_id, debit_note_no, party_id, total_debit_amount, remark, created_by_user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [effectiveFirmId, debitNoteNo, party_id || null, total_debit_amount, remark, req.user?.id || null]);

    const returnId = returnResult.insertId;

    for (const item of items) {
      await connection.query(`
        INSERT INTO PurchaseReturnItems (firm_id, purchase_return_id, product_id, barcode, debit_amount)
        VALUES (?, ?, ?, ?, ?)
      `, [effectiveFirmId, returnId, item.product_id, item.barcode, item.debit_amount]);

      // Soft delete or mark as returned to vendor
      await connection.query(`
        UPDATE Products SET is_returned = 1, current_stock = 0 
        WHERE id = ? AND firm_id = ?
      `, [item.product_id, effectiveFirmId]);
    }

    await connection.commit();
    res.status(201).json({ success: true, message: 'Purchase return processed', data: { debit_note_no: debitNoteNo } });

  } catch (error) {
    await connection.rollback();
    console.error('processPurchaseReturn error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};
