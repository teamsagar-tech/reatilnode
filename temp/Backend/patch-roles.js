const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true
  });

  try {
    const alterQuery = `
      INSERT IGNORE INTO Roles (id, firm_id, name) VALUES (2, 1, 'Purchase Manager');
      INSERT IGNORE INTO RolePermissions (id, role_id, module_name, can_read, can_write, can_delete) VALUES (3, 2, 'purchaseInvoice', 1, 1, 0);
    `;
    await db.query(alterQuery);
    console.log("Successfully seeded Roles and RolePermissions table");
  } catch (err) {
    console.error(err);
  } finally {
    await db.end();
  }
}
run();
