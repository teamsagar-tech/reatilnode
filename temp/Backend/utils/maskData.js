const fieldPermissions = require('../config/fieldPermissions');

/**
 * Strips sensitive fields from the data object based on the user's role and module.
 * 
 * @param {Object} data - The raw data object fetched from the DB
 * @param {string} moduleName - The module (e.g., 'inventory')
 * @param {string} roleName - The name of the user's role (e.g., 'cashier')
 * @returns {Object} The masked data object safe to send to the frontend
 */
const maskData = (data, moduleName, roleName) => {
  // If the user is a super admin, they see everything
  if (roleName === 'admin') return data;

  const hiddenFields = fieldPermissions[moduleName]?.[roleName];
  
  // If no restrictions exist for this role/module, return data as-is
  if (!hiddenFields || hiddenFields.length === 0) return data;

  // Clone object to avoid mutating original
  const maskedData = { ...data };
  
  // Strip out the hidden fields
  hiddenFields.forEach(field => {
    delete maskedData[field];
  });

  return maskedData;
};

module.exports = maskData;
