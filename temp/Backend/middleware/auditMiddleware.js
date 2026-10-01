const db = require('../config/db');

exports.auditMiddleware = (req, res, next) => {
  // We want to log the request *after* it finishes to capture the status code
  res.on('finish', async () => {
    try {
      const firmId = req.firm_id || null;
      const userId = req.user ? req.user.id : null;
      const method = req.method;
      const endpoint = req.originalUrl || req.url;
      const statusCode = res.statusCode;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';
      
      // Mask sensitive payload fields
      let payload = null;
      if (req.body && Object.keys(req.body).length > 0) {
        const maskedBody = { ...req.body };
        ['password', 'totp', 'otp', 'token'].forEach(key => {
          if (maskedBody[key]) maskedBody[key] = '***MASKED***';
        });
        payload = JSON.stringify(maskedBody);
      }

      await db.execute(
        'INSERT INTO ApiAuditLogs (firm_id, user_id, method, endpoint, request_payload, ip_address, user_agent, status_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [firmId, userId, method, endpoint, payload, ipAddress, userAgent, statusCode]
      );
    } catch (error) {
      console.error('Audit Logging Error:', error);
      // We don't block the response since it's already finished, just log the error
    }
  });

  next();
};
