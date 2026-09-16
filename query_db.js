const mysql = require('mysql2/promise');
require('dotenv').config({ path: '/var/www/RetailNodeV2/backend/.env' });

async function run() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'retailnode_db'
        });

        const [rows] = await connection.execute("SELECT id, name, tax_percent, firm_id FROM HSNSACs WHERE name = '621210'");
        console.log(JSON.stringify(rows, null, 2));
        
        // Remove duplicates and keep only the oldest one
        if (rows.length > 1) {
             const minId = Math.min(...rows.map(r => r.id));
             console.log("Keeping minId:", minId, "deleting others.");
             await connection.execute("DELETE FROM HSNSACs WHERE name = '621210' AND id != ?", [minId]);
        }
        await connection.end();
    } catch (err) {
        console.error(err);
    }
}
run();
