const db = require('../config/db');

/**
 * Enterprise Audit Logger
 * @param {number} firm_id - Tenant Firm ID
 * @param {number} user_id - User ID performing the action
 * @param {string} action_type - 'LOGIN', 'PAGE_VIEW', 'CREATE', 'UPDATE', 'DELETE'
 * @param {string} module_name - Module/Page name
 * @param {string} description - Human readable description
 * @param {string} ip_address - IP of the user
 * @param {object} payload - JSON payload of changes
 */
const logAction = async (firm_id, user_id, action_type, module_name, description, ip_address, payload = {}) => {
  if (!firm_id || !user_id) return; // Silent fail if context missing

  try {
    await db.execute(
      `INSERT INTO ActionLogs (firm_id, user_id, action_type, module, description, ip_address, payload) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [firm_id, user_id, action_type, module_name, description, ip_address, JSON.stringify(payload)]
    );
  } catch (error) {
    console.error('[AUDIT_LOG_ERROR] Failed to save action log:', error);
  }
};

module.exports = { logAction };
