const db = require('./config/db');
async function run() {
  const [rows] = await db.query('SHOW TABLES');
  console.log(rows.map(r => Object.values(r)[0]).join(', '));
  process.exit(0);
}
run();
