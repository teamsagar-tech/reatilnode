const db = require('./backend/config/db');
(async () => {
  try {
    const [rows] = await db.execute('SELECT * FROM Items ORDER BY id DESC LIMIT 5');
    console.log(JSON.stringify(rows, null, 2));
  } catch (e) {
    console.error(e);
  }
  process.exit();
})();
