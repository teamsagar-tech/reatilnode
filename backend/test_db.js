const db = require('./config/db');
(async () => {
    const [rows] = await db.execute('SELECT id, firm_id, name, is_active FROM Sizes LIMIT 5');
    console.log("Sizes rows:", rows);
    process.exit();
})();
