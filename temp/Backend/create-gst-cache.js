const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  try {
    console.log("Connected to DB");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS GstCache (
        gstin VARCHAR(15) PRIMARY KEY,
        raw_data JSON NOT NULL,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Successfully created GstCache table");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await connection.end();
  }
}

run();
