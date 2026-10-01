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
    await connection.execute(`ALTER TABLE Vendors ADD COLUMN gst_raw_data JSON NULL`);
    console.log("Successfully added gst_raw_data column to Vendors table");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists");
    } else {
      console.error("Error:", err);
    }
  } finally {
    await connection.end();
  }
}

run();
