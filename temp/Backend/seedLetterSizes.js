const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'retailnode_db'
});

async function seed() {
  const firm_id = 1;
  const sizes = ['ES', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  
  for (const size of sizes) {
    try {
      await pool.execute(
        'INSERT INTO Sizes (firm_id, name, description, is_active) VALUES (?, ?, ?, ?)',
        [firm_id, size, size, true]
      );
      console.log(`Inserted size ${size}`);
    } catch (e) {
      console.log(`Error inserting ${size}:`, e.message);
    }
  }
  process.exit(0);
}

seed();
