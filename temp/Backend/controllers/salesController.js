const { pool } = require('../config/db');

exports.scanProduct = async (req, res) => {
  try {
    const { barcode } = req.params;
    const effectiveFirmId = req.firm_id;

    if (!barcode) {
      return res.status(400).json({ success: false, message: 'Barcode is required' });
    }

    // Strict multi-tenant query to fetch product by barcode
    const [products] = await pool.query(`
      SELECT p.id as product_id, p.product_name, p.barcode, p.mrp, p.vrp_rate, p.quantity, p.is_sold,
             c.category_name, b.brand_name
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      LEFT JOIN Brands b ON p.brand_id = b.id
      WHERE p.firm_id = ? AND p.barcode = ?
    `, [effectiveFirmId, barcode]);

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = products[0];
    if (product.is_sold) {
      return res.status(400).json({ success: false, message: 'Product is already sold' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('scanProduct error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSalesBill = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { 
      customer_id, 
      salesman_id, 
      items, 
      totals, 
      payments, 
      remark 
    } = req.body;
    
    const effectiveFirmId = req.firm_id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in cart' });
    }

    await connection.beginTransaction();

    // 1. Generate Bill No
    const [counts] = await connection.query('SELECT COUNT(*) as count FROM SalesBills WHERE firm_id = ?', [effectiveFirmId]);
    const nextId = counts[0].count + 1;
    const billNo = `INV-${Date.now().toString().slice(-4)}-${nextId}`; // Mock sequence generation

    // 2. Insert SalesBill
    const [billResult] = await connection.query(`
      INSERT INTO SalesBills (
        firm_id, bill_no, date, customer_id, salesman_id, created_by_user_id,
        total_quantity, mrp_total, final_amount,
        cash_amount, upi_amount, card_amount, remark,
        is_credit_sale, credit_amount
      ) VALUES (?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      effectiveFirmId, billNo, customer_id || null, salesman_id || null, req.user?.id || null,
      totals.qty, totals.mrp, totals.final,
      payments?.cash || 0, payments?.upi || 0, payments?.card || 0, remark || '',
      payments?.credit > 0 ? 1 : 0, payments?.credit || 0
    ]);

    const salesBillId = billResult.insertId;

    // 3. Insert SaleLineItems & Update Products
    for (const item of items) {
      await connection.query(`
        INSERT INTO SaleLineItems (
          firm_id, sales_bill_id, product_id, barcode, quantity, vrp_rate, sale_rate, final_amount,
          commission_amount, mr_commission_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        effectiveFirmId, salesBillId, item.product_id, item.barcode, item.qty, item.vrp_rate, item.sale_rate, item.final_amount,
        item.commission_amount || 0, item.mr_commission_amount || 0
      ]);

      // Mark product as sold
      await connection.query(`
        UPDATE Products SET is_sold = 1, sold_bill_id = ? WHERE id = ? AND firm_id = ?
      `, [salesBillId, item.product_id, effectiveFirmId]);
    }

    // Post to Customer Ledger (Debit Amount for Udhaar)
    if (payments?.credit > 0 && customer_id) {
      // Get current balance
      const [custRows] = await connection.query('SELECT current_balance FROM Customers WHERE id = ?', [customer_id]);
      const current_balance = custRows[0]?.current_balance || 0;
      const new_balance = Number(current_balance) + Number(payments.credit);

      await connection.query(`
        INSERT INTO PartyLedgers 
         (firm_id, party_type, party_id, transaction_date, voucher_type, voucher_no, debit_amount, running_balance, created_by_user_id) 
         VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?, ?)
      `, [effectiveFirmId, 'Customer', customer_id, 'Sales Bill', billNo, payments.credit, new_balance, req.user?.id || null]);

      await connection.query('UPDATE Customers SET current_balance = ? WHERE id = ?', [new_balance, customer_id]);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Sales bill created successfully',
      data: { bill_no: billNo, id: salesBillId }
    });

  } catch (error) {
    await connection.rollback();
    console.error('createSalesBill error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};
