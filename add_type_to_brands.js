const db = require('./backend/config/db');

async function addType() {
  try {
    await db.query(`ALTER TABLE Brands ADD COLUMN type ENUM('Single Brand', 'Multiple Brands') DEFAULT 'Single Brand';`);
    console.log("Column type added to Brands table successfully.");
  } catch(e) {
    console.error("Error or already exists:", e.message);
  } finally {
    process.exit(0);
  }
}
addType();
