const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'retailnode_db',
    multipleStatements: true
  });

  try {
    const sqlPath = path.join(__dirname, 'database', '004_additional_masters_schema.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Running 004_additional_masters_schema.sql...');
    await connection.query(sqlScript);
    console.log('Migration successful.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

runMigration();
