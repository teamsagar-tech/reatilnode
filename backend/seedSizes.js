const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'retailnode_db'
});

async function seed() {
  const firm_id = 1;
  const sizes = [];
  
  for (let i = 1; i <= 16; i++) sizes.push(i.toString());
  for (let i = 18; i <= 44; i += 2) sizes.push(i.toString());
  
  for (const size of sizes) {
    try {
      await pool.execute(
        'INSERT INTO Sizes (firm_id, name, description, is_active) VALUES (?, ?, ?, ?)',
        [firm_id, size, `Size ${size}`, true]
      );
      console.log(`Inserted size ${size}`);
    } catch (e) {
      console.log(`Error inserting ${size}:`, e.message);
    }
  }
  process.exit(0);
}

seed();
