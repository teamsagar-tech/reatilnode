const db = require('../config/db');

// Allowed list mapping URL paths to DB Tables
const allowedMasters = {
  hundekaris: 'Hundekaris',
  transporters: 'Transporters',
  commissions: 'Commissions',
  itempercentages: 'ItemPercentages',
  chargestypes: 'ChargesTypes',
  locations: 'Locations',
  departments: 'Departments',
  sizes: 'Sizes',
  colors: 'Colors',
  materials: 'Materials',
  styles: 'Styles',
  designs: 'Designs',
  sections: 'Sections',
  subcategories: 'SubCategories',
  substyles: 'SubStyles',
  hsnsacs: 'HSNSACs'
};

const getTableName = (type) => {
  if (!type) return null;
  return allowedMasters[type.toLowerCase()];
};

exports.getAll = async (req, res) => {
  const tableName = getTableName(req.params.type);
  if (!tableName) return res.status(400).json({ error: 'Invalid master type' });

  const { search } = req.query;

  try {
    let query = `SELECT * FROM ${tableName} WHERE firm_id = ?`;
    let params = [req.firm_id];

    if (search) {
      query += ` AND name LIKE ?`;
      params.push(`${search}%`);
    }

    if (tableName === 'HSNSACs' && !search) {
      query += ` LIMIT 200`;
    } else if (tableName === 'HSNSACs' && search) {
      query += ` LIMIT 100`;
    }

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching ${tableName}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getById = async (req, res) => {
  const tableName = getTableName(req.params.type);
  if (!tableName) return res.status(400).json({ error: 'Invalid master type' });

  try {
    const [rows] = await db.execute(`SELECT * FROM ${tableName} WHERE firm_id = ? AND id = ?`, [req.firm_id, req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching ${tableName}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.create = async (req, res) => {
  const tableName = getTableName(req.params.type);
  if (!tableName) return res.status(400).json({ error: 'Invalid master type' });

  const { name, description, is_active, tax_percent } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    let query = `INSERT INTO ${tableName} (firm_id, name, description, is_active) VALUES (?, ?, ?, ?)`;
    let params = [req.firm_id, name, description || null, is_active !== undefined ? is_active : true];

    if (tableName === 'HSNSACs' && tax_percent !== undefined) {
      query = `INSERT INTO ${tableName} (firm_id, name, description, is_active, tax_percent) VALUES (?, ?, ?, ?, ?)`;
      params.push(tax_percent || 0);
    }

    const [result] = await db.execute(query, params);
    res.status(201).json({ message: 'Created successfully', id: result.insertId });
  } catch (error) {
    console.error(`Error creating ${tableName}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  const tableName = getTableName(req.params.type);
  if (!tableName) return res.status(400).json({ error: 'Invalid master type' });

  const { name, description, is_active, tax_percent } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    let query = `UPDATE ${tableName} SET name=?, description=?, is_active=? WHERE id=? AND firm_id=?`;
    let params = [name, description || null, is_active !== undefined ? is_active : true, req.params.id, req.firm_id];

    if (tableName === 'HSNSACs' && tax_percent !== undefined) {
      query = `UPDATE ${tableName} SET name=?, description=?, is_active=?, tax_percent=? WHERE id=? AND firm_id=?`;
      params = [name, description || null, is_active !== undefined ? is_active : true, tax_percent || 0, req.params.id, req.firm_id];
    }

    const [result] = await db.execute(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    console.error(`Error updating ${tableName}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.delete = async (req, res) => {
  const tableName = getTableName(req.params.type);
  if (!tableName) return res.status(400).json({ error: 'Invalid master type' });

  try {
    const [result] = await db.execute(`DELETE FROM ${tableName} WHERE id=? AND firm_id=?`, [req.params.id, req.firm_id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(`Error deleting ${tableName}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
