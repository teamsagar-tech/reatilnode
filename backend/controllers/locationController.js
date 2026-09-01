const db = require('../config/db');

exports.getAllLocations = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, description, is_active, settings FROM Locations WHERE firm_id = ? ORDER BY id DESC',
      [req.firm_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createLocation = async (req, res) => {
  const { name, description, settings } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Location name is required' });
  }

  try {
    // Check for duplicates
    const [existing] = await db.execute(
      'SELECT id FROM Locations WHERE LOWER(name) = LOWER(?) AND firm_id = ?',
      [name, req.firm_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Location with this name already exists' });
    }

    const [result] = await db.execute(
      'INSERT INTO Locations (firm_id, name, description, is_active, settings) VALUES (?, ?, ?, 1, ?)',
      [req.firm_id, name, description || null, settings ? JSON.stringify(settings) : null]
    );

    res.status(201).json({ id: result.insertId, name, description, is_active: 1, settings });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name, description, is_active, settings } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Location name is required' });
  }

  try {
    // Check for duplicates excluding current id
    const [existing] = await db.execute(
      'SELECT id FROM Locations WHERE LOWER(name) = LOWER(?) AND firm_id = ? AND id != ?',
      [name, req.firm_id, id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Another location with this name already exists' });
    }

    const [result] = await db.execute(
      'UPDATE Locations SET name = ?, description = ?, is_active = ?, settings = ? WHERE id = ? AND firm_id = ?',
      [name, description || null, is_active !== undefined ? is_active : 1, settings ? JSON.stringify(settings) : null, id, req.firm_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Location not found or unauthorized' });
    }

    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      'DELETE FROM Locations WHERE id = ? AND firm_id = ?',
      [id, req.firm_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Location not found or unauthorized' });
    }

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'Cannot delete location as it is in use.' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
