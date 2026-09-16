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

        const [rows] = await connection.execute("SELECT party_name, brand_type, brands FROM Parties WHERE party_name = 'SHREE TRADING COMPANY'");
        console.log(JSON.stringify(rows, null, 2));
        await connection.end();
    } catch (err) {
        console.error(err);
    }
}
run();
