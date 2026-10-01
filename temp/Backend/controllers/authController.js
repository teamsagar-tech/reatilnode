const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');

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
      'INSERT INTO Users (firm_id, name, email, password, role, auth_provider) VALUES (?, ?, ?, ?, ?, ?)',
      [firmId, userName, email, hashedPassword, 'admin', 'local']
    );
    const userId = userResult.insertId;

    // 4. Add user to UserFirms mapping table
    await connection.execute(
      'INSERT INTO UserFirms (user_id, firm_id, role) VALUES (?, ?, ?)',
      [userId, firmId, 'admin']
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
      `SELECT u.id, u.firm_id, u.name, u.email, u.mobile_no, u.password, u.role, u.role_id, 
              u.is_totp_enabled, u.failed_login_attempts, u.locked_until, u.permissions_override, u.override_expires_at,
              f.is_active AS firm_active, f.modules AS firm_modules,
              r.permissions AS role_permissions
       FROM Users u
       LEFT JOIN Firms f ON u.firm_id = f.id
       LEFT JOIN Roles r ON u.role_id = r.id
       WHERE u.email = ? OR u.name = ? OR u.mobile_no = ?`,
      [email, email, email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    if (user.role !== 'superadmin' && user.firm_active === 0) {
      return res.status(403).json({ error: 'Your firm has been suspended. Please contact support.' });
    }

    // Check account lockout
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(403).json({ error: `Account locked. Try again after ${user.locked_until}` });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      // Increment failed attempts
      let attempts = (user.failed_login_attempts || 0) + 1;
      let lockedUntil = null;
      if (attempts >= 5) {
        // Lock for 15 minutes
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await db.execute('UPDATE Users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?', [attempts, lockedUntil, user.id]);
      
      return res.status(401).json({ error: attempts >= 5 ? 'Account locked due to too many failed attempts' : 'Invalid credentials' });
    }

    // Reset failed attempts on success
    await db.execute('UPDATE Users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?', [user.id]);

    // If TOTP is enabled, require second factor
    if (user.is_totp_enabled) {
      return res.json({
        message: 'TOTP required',
        requires_totp: true,
        email: user.email
      });
    }

    // Calculate RBAC permissions
    let final_user_permissions = user.role_permissions || {};

    if (user.permissions_override) {
      if (!user.override_expires_at || new Date(user.override_expires_at) > new Date()) {
        final_user_permissions = user.permissions_override;
      }
    }

    const payload = {
      id: user.id,
      firm_id: user.firm_id,
      role: user.role,
      role_id: user.role_id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

    // Fetch available firms for this user
    const [availableFirms] = await db.execute(
      `SELECT uf.firm_id, f.name as firm_name, uf.role, uf.role_id 
       FROM UserFirms uf 
       JOIN Firms f ON uf.firm_id = f.id 
       WHERE uf.user_id = ? AND uf.is_active = 1 AND f.is_active = 1`,
      [user.id]
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        firm_id: user.firm_id,
        firm_modules: user.firm_modules,
        user_permissions: final_user_permissions,
        available_firms: availableFirms
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==========================================
// TOTP (Google Authenticator) Features
// ==========================================

exports.setupTotp = async (req, res) => {
  const userId = req.user.id; // From authMiddleware
  
  try {
    const secret = speakeasy.generateSecret({ length: 20, name: `RetailNode (${req.user.email})` });
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Save secret to user
    await db.execute('UPDATE Users SET totp_secret = ?, is_totp_enabled = ? WHERE id = ?', [secret.base32, true, userId]);

    res.json({
      message: 'TOTP setup successful',
      qrCodeUrl: qrCodeUrl,
      secret: secret.base32
    });
  } catch (error) {
    console.error('TOTP Setup Error:', error);
    res.status(500).json({ error: 'Failed to setup TOTP' });
  }
};

exports.loginTotp = async (req, res) => {
  const { email, token } = req.body;

  try {
    const [rows] = await db.execute('SELECT id, firm_id, name, email, role, role_id, totp_secret, is_totp_enabled FROM Users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    
    const user = rows[0];
    if (!user.is_totp_enabled) return res.status(400).json({ error: 'TOTP not enabled for this user' });

    const verified = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: 'base32',
      token: token,
      window: 1 // Allow 30 seconds drift
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid TOTP code' });
    }

    const payload = {
      id: user.id,
      firm_id: user.firm_id,
      role: user.role,
      role_id: user.role_id
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

    res.json({
      message: 'TOTP Login successful',
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        firm_id: user.firm_id
      }
    });

  } catch (error) {
    console.error('TOTP Verify Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==========================================
// Mobile OTP Features
// ==========================================

exports.sendOtp = async (req, res) => {
  const { mobileNo } = req.body;
  if (!mobileNo) return res.status(400).json({ error: 'Mobile number is required' });

  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await db.execute('INSERT INTO OtpVerification (mobile_no, otp, expires_at) VALUES (?, ?, ?)', [mobileNo, otp, expiresAt]);

    // Integrate with waba.mpocket.in
    // Example:
    // await fetch('https://waba.mpocket.in/api/v1/send', { method: 'POST', body: JSON.stringify({ to: mobileNo, text: `Your OTP is ${otp}` }) });
    console.log(`Sending OTP ${otp} to ${mobileNo} via waba.mpocket.in`);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { mobileNo, otp } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM OtpVerification WHERE mobile_no = ? AND otp = ? ORDER BY created_at DESC LIMIT 1', [mobileNo, otp]);
    
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid OTP' });
    if (new Date(rows[0].expires_at) < new Date()) return res.status(400).json({ error: 'OTP expired' });

    // Check if user exists with this mobile number
    const [users] = await db.execute('SELECT id, firm_id, name, email, role, role_id FROM Users WHERE mobile_no = ?', [mobileNo]);
    
    if (users.length === 0) {
      // User needs to be registered or linked to an email
      return res.status(404).json({ error: 'User not found. Please register or link your email first.' });
    }

    const user = users[0];
    const payload = {
      id: user.id,
      firm_id: user.firm_id,
      role: user.role,
      role_id: user.role_id
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

    // Clean up used OTP
    await db.execute('DELETE FROM OtpVerification WHERE mobile_no = ?', [mobileNo]);

    res.json({
      message: 'OTP Login successful',
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        firm_id: user.firm_id
      }
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==========================================
// SuperAdmin Impersonation Features
// ==========================================

exports.impersonateUser = async (req, res) => {
  const targetUserId = req.params.userId;
  
  if (!targetUserId) {
    return res.status(400).json({ error: 'Target User ID is required' });
  }
  
  try {
    const [rows] = await db.execute(
      `SELECT u.id, u.firm_id, u.name, u.email, u.mobile_no, u.role, u.role_id, 
              u.permissions_override, u.override_expires_at,
              f.is_active AS firm_active, f.modules AS firm_modules,
              r.permissions AS role_permissions
       FROM Users u
       LEFT JOIN Firms f ON u.firm_id = f.id
       LEFT JOIN Roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [targetUserId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];

    if (user.role !== 'superadmin' && user.firm_active === 0) {
      return res.status(403).json({ error: 'Target firm has been suspended.' });
    }

    // Calculate RBAC permissions
    let final_user_permissions = user.role_permissions || {};

    if (user.permissions_override) {
      if (!user.override_expires_at || new Date(user.override_expires_at) > new Date()) {
        final_user_permissions = user.permissions_override;
      }
    }

    // Generate JWT
    const payload = {
      id: user.id,
      firm_id: user.firm_id,
      role: user.role,
      role_id: user.role_id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

    res.json({
      message: 'Impersonation successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        firm_id: user.firm_id,
        firm_modules: user.firm_modules,
        user_permissions: final_user_permissions
      }
    });
  } catch (error) {
    console.error('Impersonation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.switchFirm = async (req, res) => {
  const { target_firm_id } = req.body;
  const user_id = req.user.id; // current verified user from authenticateToken

  if (!target_firm_id) {
    return res.status(400).json({ error: 'Target firm ID is required' });
  }

  try {
    // Verify user has access to target firm
    const [accessRows] = await db.execute(
      `SELECT uf.role, uf.role_id, f.is_active AS firm_active, f.modules AS firm_modules,
              r.permissions AS role_permissions
       FROM UserFirms uf
       JOIN Firms f ON uf.firm_id = f.id
       LEFT JOIN Roles r ON uf.role_id = r.id
       WHERE uf.user_id = ? AND uf.firm_id = ? AND uf.is_active = 1`,
      [user_id, target_firm_id]
    );

    if (accessRows.length === 0) {
      return res.status(403).json({ error: 'You do not have access to this firm' });
    }

    const firmAccess = accessRows[0];
    if (firmAccess.firm_active === 0 && firmAccess.role !== 'superadmin') {
      return res.status(403).json({ error: 'This firm has been suspended' });
    }

    // Update Users table default firm to make next login easier? (Optional)
    await db.execute('UPDATE Users SET firm_id = ?, role = ?, role_id = ? WHERE id = ?', 
      [target_firm_id, firmAccess.role, firmAccess.role_id, user_id]);

    const payload = {
      id: user_id,
      firm_id: target_firm_id,
      role: firmAccess.role,
      role_id: firmAccess.role_id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

    // Fetch user details for response
    const [userRows] = await db.execute('SELECT name, email, permissions_override, override_expires_at FROM Users WHERE id = ?', [user_id]);
    const user = userRows[0];

    let final_user_permissions = firmAccess.role_permissions || {};
    if (user.permissions_override) {
      if (!user.override_expires_at || new Date(user.override_expires_at) > new Date()) {
        final_user_permissions = user.permissions_override;
      }
    }

    res.json({
      message: 'Switched firm successfully',
      token,
      user: {
        id: user_id,
        name: user.name,
        email: user.email,
        role: firmAccess.role,
        firm_id: target_firm_id,
        firm_modules: firmAccess.firm_modules,
        user_permissions: final_user_permissions
      }
    });

  } catch (error) {
    console.error('Switch Firm Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
