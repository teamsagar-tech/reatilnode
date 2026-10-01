/**
 * Field-Level Permissions Config
 * Defines which fields are hidden from specific roles for a given module.
 * 
 * Format:
 * module_name: {
 *    role_name: ['field_to_hide1', 'field_to_hide2']
 * }
 */
const fieldPermissions = {
  inventory: {
    cashier: ['cost_price', 'supplier_id', 'profit_margin']
  }
};

module.exports = fieldPermissions;
