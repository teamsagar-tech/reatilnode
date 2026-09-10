const mysql = require('mysql2/promise');
require('dotenv').config({ path: '/var/www/RetailNodeV2/backend/.env' });

const cmSizes = ['40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95', '100', '105', '110', '115', '120', '125', '130', '135'];
const inchSizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48'];
const sizeSizes = ['ES', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

async function run() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const firm_id = 1;

  async function seedSet(setName, sizes) {
    // Insert or update SizeSets
    const [sgRows] = await db.query('SELECT id FROM SizeSets WHERE firm_id = ? AND name = ?', [firm_id, setName]);
    const sizesJson = JSON.stringify(sizes);
    if (sgRows.length === 0) {
      await db.query('INSERT INTO SizeSets (firm_id, name, size_scale, sizes_list, is_active) VALUES (?, ?, ?, ?, 1)', [firm_id, setName, setName, sizesJson]);
    } else {
      await db.query('UPDATE SizeSets SET sizes_list = ? WHERE id = ?', [sizesJson, sgRows[0].id]);
    }
  }

  await seedSet('CM', cmSizes);
  await seedSet('Inch', inchSizes);
  await seedSet('Size', sizeSizes);

  console.log('SizeSets seeding complete.');
  process.exit(0);
}

run().catch(console.error);
