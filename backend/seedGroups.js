const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'retailnode_db'
});

async function run() {
  const firm_id = 1;
  
  const inches = [];
  for (let i = 1; i <= 16; i++) inches.push(i.toString());
  for (let i = 18; i <= 48; i += 2) inches.push(i.toString());
  
  const sizes = ['ES', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  
  const cms = [];
  for (let i = 60; i <= 135; i += 5) cms.push(i.toString());

  async function upsert(name, group) {
    // try to update first
    const [res] = await pool.execute(
      'UPDATE Sizes SET size_group = ?, description = ? WHERE firm_id = ? AND name = ?',
      [group, name, firm_id, name]
    );
    if (res.affectedRows === 0) {
      await pool.execute(
        'INSERT INTO Sizes (firm_id, name, description, is_active, size_group) VALUES (?, ?, ?, ?, ?)',
        [firm_id, name, name, true, group]
      );
    }
  }

  for (const x of inches) await upsert(x, 'Inch');
  for (const x of sizes) await upsert(x, 'Size');
  for (const x of cms) await upsert(x, 'CM');
  
  console.log("Done seeding groups.");
  process.exit(0);
}

run();
