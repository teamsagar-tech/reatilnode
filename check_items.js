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

        const [rows] = await connection.execute("SELECT * FROM Items WHERE brand_id = (SELECT id FROM Brands WHERE name = 'ALISHAN') LIMIT 1");
        console.log(JSON.stringify(rows[0], null, 2));
        await connection.end();
    } catch (err) {
        console.error(err);
    }
}
run();
