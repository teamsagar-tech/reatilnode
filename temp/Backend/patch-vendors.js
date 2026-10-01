const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  try {
    const alterQuery = `
      ALTER TABLE Vendors 
      ADD COLUMN pan_number VARCHAR(50) NULL,
      ADD COLUMN state VARCHAR(100) NULL,
      ADD COLUMN state_code VARCHAR(10) NULL,
      ADD COLUMN short_name VARCHAR(100) NULL,
      ADD COLUMN type VARCHAR(50) NULL,
      ADD COLUMN address_line1 VARCHAR(255) NULL,
      ADD COLUMN address_line2 VARCHAR(255) NULL,
      ADD COLUMN address_line3 VARCHAR(255) NULL,
      ADD COLUMN pincode VARCHAR(20) NULL,
      ADD COLUMN city VARCHAR(100) NULL,
      ADD COLUMN taluka VARCHAR(100) NULL,
      ADD COLUMN district VARCHAR(100) NULL,
      ADD COLUMN contact_person VARCHAR(100) NULL,
      ADD COLUMN contact_person2 VARCHAR(100) NULL,
      ADD COLUMN mobile_number2 VARCHAR(20) NULL,
      ADD COLUMN contact_person3 VARCHAR(100) NULL,
      ADD COLUMN mobile_number3 VARCHAR(20) NULL,
      ADD COLUMN account_name VARCHAR(100) NULL,
      ADD COLUMN bank_name VARCHAR(100) NULL,
      ADD COLUMN account_number VARCHAR(50) NULL,
      ADD COLUMN ifsc_code VARCHAR(50) NULL,
      ADD COLUMN branch VARCHAR(100) NULL,
      ADD COLUMN account_type VARCHAR(50) NULL,
      ADD COLUMN categories JSON NULL,
      ADD COLUMN gst_raw_data JSON NULL
    `;
    await db.query(alterQuery);
    console.log("Successfully altered Vendors table");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Columns already exist, skipping...");
    } else {
      console.error(err);
    }
  } finally {
    await db.end();
  }
}
run();
