const db = require('../config/db');

exports.getLogs = async (req, res) => {
  try {
    const firm_id = req.user.role === 'superadmin' ? (req.query.firm_id || 1) : req.firm_id;
    
    // Optional filters
    const { user_id, action_type, module_name, start_date, end_date } = req.query;
    
    let query = `
      SELECT al.*, u.name as user_name, u.email as user_email
      FROM ActionLogs al
      JOIN Users u ON al.user_id = u.id
      WHERE al.firm_id = ?
    `;
    const params = [firm_id];

    if (user_id) {
      query += ' AND al.user_id = ?';
      params.push(user_id);
    }
    if (action_type) {
      query += ' AND al.action_type = ?';
      params.push(action_type);
    }
    if (module_name) {
      query += ' AND al.module = ?';
      params.push(module_name);
    }
    if (start_date) {
      query += ' AND al.created_at >= ?';
      params.push(start_date);
    }
    if (end_date) {
      query += ' AND al.created_at <= ?';
      params.push(end_date);
    }

    query += ' ORDER BY al.created_at DESC LIMIT 500';

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
