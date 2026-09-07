const { pool } = require('../config/db');

exports.getPrintableBatch = async (req, res) => {
  try {
    const { batchId, autoprint, isVerticalLayout: verticalParam, firmId } = req.body || {};

    if (!batchId) return res.status(400).send('batchId is required');

    const isVerticalLayout = verticalParam !== false && verticalParam !== 'false';
    const effectiveFirmId = req.firm_id; // Using strict middleware firm_id

    const [products] = await pool.query(`
      SELECT p.*, 
             b.brand_name, 
             c.category_name, 
             s.size_name, 
             st.style_name, 
             co.color_name, 
             d.department_name
      FROM Products p
      LEFT JOIN Brands b ON p.brand_id = b.id
      LEFT JOIN Categories c ON p.category_id = c.id
      LEFT JOIN Sizes s ON p.size_id = s.id
      LEFT JOIN Styles st ON p.style_id = st.id
      LEFT JOIN Colors co ON p.color_id = co.id
      LEFT JOIN Departments d ON p.department_id = d.id
      WHERE p.firm_id = ? AND p.batch = ?
    `, [effectiveFirmId, String(batchId)]);

    if (products.length === 0) {
      return res.status(404).send('No products found for this batch');
    }

    // HTML layout generation would typically happen on the frontend now,
    // but if the legacy approach generated raw HTML from the backend, we should just return JSON
    // for the new React FrontEndV2 to render.
    
    // In RetailNodeV2, the frontend LabelPrintPage component handles rendering.
    res.json({ success: true, products, batchId, isVerticalLayout });
  } catch (err) {
    console.error('getPrintableBatch error:', err);
    return res.status(500).send('Internal server error');
  }
};

exports.getLabelPrintSettings = async (req, res) => {
  try {
    const effectiveFirmId = req.firm_id;
    const [settings] = await pool.query('SELECT * FROM LabelPrintSettings WHERE firm_id = ?', [effectiveFirmId]);
    
    if (settings.length > 0) {
      res.json({ success: true, data: settings[0] });
    } else {
      res.json({ success: true, data: { round: false, add_disc: false, lock_mrp: false, lock_sale_rate: false, is_multi_sequence: false } });
    }
  } catch (err) {
    console.error('getLabelPrintSettings error:', err);
    return res.status(500).send('Internal server error');
  }
};
