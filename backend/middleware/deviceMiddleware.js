const db = require('../config/db');
const crypto = require('crypto');

exports.deviceMiddleware = async (req, res, next) => {
  // Only apply to authenticated users
  if (!req.user) return next();

  try {
    let deviceToken = req.headers['x-device-token'];
    let isNewDevice = false;

    if (!deviceToken) {
      // First login or device not recognized, generate a new one
      deviceToken = crypto.randomUUID();
      isNewDevice = true;
    }

    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (isNewDevice) {
      // Insert new device
      await db.execute(
        'INSERT INTO UserDevices (user_id, device_token, user_agent, ip_address, is_trusted) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, deviceToken, userAgent, ipAddress, true]
      );
      // Send token back to client to store in localStorage/cookie
      res.setHeader('x-device-token', deviceToken);
    } else {
      // Verify existing device
      const [rows] = await db.execute(
        'SELECT is_trusted FROM UserDevices WHERE user_id = ? AND device_token = ?',
        [req.user.id, deviceToken]
      );

      if (rows.length === 0) {
        // Token exists in header but not in DB (invalid or deleted)
        return res.status(403).json({ error: 'Unrecognized or revoked device. Please log in again.' });
      }

      if (!rows[0].is_trusted) {
        return res.status(403).json({ error: 'This device has been blocked by the administrator.' });
      }

      // Update last login
      await db.execute('UPDATE UserDevices SET last_login = CURRENT_TIMESTAMP WHERE user_id = ? AND device_token = ?', [req.user.id, deviceToken]);
    }

    req.deviceToken = deviceToken;
    next();
  } catch (error) {
    console.error('Device Middleware Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
