require('dotenv').config({ path: 'Backend/.env' });
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'retailnode_db'
  });

  try {
    await connection.query('ALTER TABLE Parties ADD COLUMN invoice_config JSON NULL;');
    console.log('Successfully added invoice_config to Parties table.');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Column already exists, skipping.');
    } else {
      console.error('Error:', error);
    }
  } finally {
    await connection.end();
  }
}
run();
