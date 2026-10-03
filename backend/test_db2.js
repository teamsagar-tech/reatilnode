const db = require('./config/db');
(async () => {
    const [rows] = await db.execute('SELECT * FROM SizeSets LIMIT 5');
    console.log("SizeSets rows:", rows);
    process.exit();
})();
