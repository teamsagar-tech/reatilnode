const db = require('../config/db');
const { sendEmailNotification } = require('../services/notificationService');

exports.updateUserPermissions = async (req, res) => {
  const { id } = req.params;
  const { permissions, expires_at } = req.body;

  try {
    if (req.user.role !== 'superadmin') {
      const [userRows] = await db.execute('SELECT firm_id FROM Users WHERE id = ?', [id]);
      if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });
      if (userRows[0].firm_id !== req.user.firm_id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    await db.execute('UPDATE Users SET permissions_override = ?, override_expires_at = ? WHERE id = ?', [
      permissions ? JSON.stringify(permissions) : null,
      expires_at ? new Date(expires_at) : null,
      id
    ]);
    res.json({ message: 'User permissions override updated successfully' });
  } catch (error) {
    console.error('Error updating user permissions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role_id } = req.body;

  try {
    if (req.user.role !== 'superadmin') {
      const [userRows] = await db.execute('SELECT firm_id FROM Users WHERE id = ?', [id]);
      if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });
      if (userRows[0].firm_id !== req.user.firm_id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    
    if (role_id === 'admin' || role_id === 'user') {
      // Revert to built-in role
      await db.execute('UPDATE Users SET role = ?, role_id = NULL WHERE id = ?', [role_id, id]);
    } else {
      // Assign custom role_id, set base role to 'user'
      await db.execute('UPDATE Users SET role = "user", role_id = ? WHERE id = ?', [role_id || null, id]);
    }

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const bcrypt = require('bcrypt');

exports.updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    if (req.user.role !== 'superadmin') {
      const [userRows] = await db.execute('SELECT firm_id FROM Users WHERE id = ?', [id]);
      if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });
      if (userRows[0].firm_id !== req.user.firm_id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('UPDATE Users SET password = ? WHERE id = ?', [hashedPassword, id]);
    res.json({ message: 'User password updated successfully' });
  } catch (error) {
    console.error('Error updating user password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPurchasers = async (req, res) => {
  try {
    const firm_id = req.user.firm_id;
    if (!firm_id && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Firm context missing' });
    }
    
    // For superadmin without firm context, they can pass firm_id in query (fallback)
    const targetFirm = firm_id || req.query.firm_id || 1; // Default to 1 (VRP) for superadmin if not provided

    const [users] = await db.execute(`
      SELECT DISTINCT u.id, u.email, u.name, u.employee_id
      FROM Users u
      LEFT JOIN RolePermissions rp ON u.role_id = rp.role_id AND rp.module_name = 'purchaseInvoice'
      WHERE u.firm_id = ? AND (u.role = 'admin' OR rp.can_write = 1)
    `, [targetFirm]);

    res.json(users);
  } catch (error) {
    console.error('Error fetching purchasers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, mobile_no, role, role_id, password, employee_id, locations } = req.body;
  const firm_id = req.firm_id;
  try {
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const bcrypt = require('bcrypt');
    
    // Auto-generate dummy email/password if not provided (for floor staff/laborers who don't log in)
    const finalEmail = email ? email.trim() : `emp_${firm_id}_${employee_id || Date.now()}@internal.local`;
    const finalPassword = password || `dummy_${Date.now()}`;
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    const [result] = await db.execute(
      'INSERT INTO Users (name, email, mobile_no, role, role_id, password, firm_id, employee_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, finalEmail, mobile_no || null, role || 'user', role_id || null, hashedPassword, firm_id, employee_id || null]
    );

    const userId = result.insertId;

    if (role !== 'admin' && locations && Array.isArray(locations)) {
      for (const locId of locations) {
        await db.execute('INSERT IGNORE INTO UserLocations (user_id, location_id) VALUES (?, ?)', [userId, locId]);
      }
    }

    // Generate and send OTP for email verification (if it's a real email)
    if (email && !email.includes('@internal.local')) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      await db.execute(
        'INSERT INTO OtpVerification (mobile_no, otp, expires_at) VALUES (?, ?, ?)',
        [email.trim(), otp, expiresAt]
      );

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #0f172a;">Welcome to RetailNode!</h2>
          <p style="color: #334155; line-height: 1.6;">Hello ${name},</p>
          <p style="color: #334155; line-height: 1.6;">Your account has been created successfully. To verify your email address, please use the following OTP:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #4338ca; letter-spacing: 4px;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">This OTP is valid for 1 hour.</p>
        </div>
      `;
      
      sendEmailNotification(email.trim(), 'Verify Your RetailNode Account', htmlContent).catch(err => {
        console.error('Failed to send welcome OTP email:', err);
      });
    }

    res.status(201).json({ id: userId, message: 'User created successfully. Verification OTP sent if applicable.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile_no, role, role_id, employee_id, locations } = req.body;
  const firm_id = req.firm_id;
  try {
    if (req.user.role !== 'superadmin') {
      const [userRows] = await db.execute('SELECT firm_id FROM Users WHERE id = ?', [id]);
      if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });
      if (userRows[0].firm_id !== firm_id) return res.status(403).json({ error: 'Forbidden' });
    }

    const [currentUser] = await db.execute('SELECT email FROM Users WHERE id = ?', [id]);
    const finalEmail = email ? email.trim() : (currentUser.length > 0 ? currentUser[0].email : `emp_${firm_id}_${employee_id || Date.now()}@internal.local`);

    await db.execute(
      'UPDATE Users SET name = ?, email = ?, mobile_no = ?, role = ?, role_id = ?, employee_id = ? WHERE id = ?',
      [name, finalEmail, mobile_no || null, role || 'user', role_id || null, employee_id || null, id]
    );

    if (role !== 'admin') {
      await db.execute('DELETE FROM UserLocations WHERE user_id = ?', [id]);
      if (locations && Array.isArray(locations)) {
        for (const locId of locations) {
          await db.execute('INSERT IGNORE INTO UserLocations (user_id, location_id) VALUES (?, ?)', [id, locId]);
        }
      }
    } else {
      // If upgraded to admin, clear location restrictions
      await db.execute('DELETE FROM UserLocations WHERE user_id = ?', [id]);
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUsers = async (req, res) => {
  const firm_id = req.firm_id;
  try {
    const [users] = await db.execute('SELECT id, name, email, mobile_no, role, role_id, employee_id, created_at FROM Users WHERE firm_id = ?', [firm_id]);
    
    // Fetch assigned locations for users
    const [userLocs] = await db.execute('SELECT ul.user_id, ul.location_id FROM UserLocations ul JOIN Users u ON ul.user_id = u.id WHERE u.firm_id = ?', [firm_id]);
    
    const locMap = {};
    userLocs.forEach(ul => {
      if (!locMap[ul.user_id]) locMap[ul.user_id] = [];
      locMap[ul.user_id].push(ul.location_id);
    });

    const mappedUsers = users.map(u => ({
      ...u,
      locations: locMap[u.id] || []
    }));

    res.json(mappedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role !== 'superadmin') {
      const [userRows] = await db.execute('SELECT firm_id FROM Users WHERE id = ?', [id]);
      if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });
      if (userRows[0].firm_id !== req.user.firm_id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }
    
    // Soft Delete Implementation
    await db.execute('UPDATE Users SET is_active = 0, deleted_at = NOW() WHERE id = ?', [id]);
    await db.execute('UPDATE TenantUsers SET is_active = 0, deleted_at = NOW() WHERE user_id = ?', [id]).catch(() => {});
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

  try {
    const [rows] = await db.execute(
      'SELECT * FROM OtpVerification WHERE mobile_no = ? AND otp = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [email.trim(), otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark email as verified
    await db.execute('UPDATE Users SET email_verified = TRUE WHERE email = ?', [email.trim()]);
    
    // Cleanup OTP
    await db.execute('DELETE FROM OtpVerification WHERE id = ?', [rows[0].id]);

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.updateUserStatus = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can change user status' });
    }

    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      return res.status(400).json({ error: 'is_active is required' });
    }

    // Verify firm access if not superadmin
    if (req.user.role !== 'superadmin') {
      const [userRows] = await db.execute('SELECT firm_id FROM Users WHERE id = ?', [id]);
      if (userRows.length === 0 || userRows[0].firm_id !== req.user.firm_id) {
        return res.status(403).json({ error: 'Unauthorized to modify this user' });
      }
    }

    await db.execute('UPDATE Users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);
    res.json({ message: 'User status updated successfully' });
  } catch (err) {
    console.error('Error updating user status:', err);
    res.status(500).json({ error: 'Server error while updating user status' });
  }
};
