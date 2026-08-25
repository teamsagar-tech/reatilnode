const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { firmName, userName, email, password } = req.body;

  if (!firmName || !userName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Create Firm
    const [firmResult] = await connection.execute(
      'INSERT INTO Firms (name) VALUES (?)',
      [firmName]
    );
    const firmId = firmResult.insertId;

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create initial Admin user for this firm
    const [userResult] = await connection.execute(
      'INSERT INTO Users (firm_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [firmId, userName, email, hashedPassword, 'admin']
    );

    await connection.commit();
    connection.release();

    res.status(201).json({ 
      message: 'Firm and User registered successfully',
      firmId,
      userId: userResult.insertId
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('Registration error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT id, firm_id, name, email, password, role, role_id FROM Users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT payload (must include firm_id for tenant isolation)
    const payload = {
      id: user.id,
      firm_id: user.firm_id,
      role: user.role,
      role_id: user.role_id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        firm_id: user.firm_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
