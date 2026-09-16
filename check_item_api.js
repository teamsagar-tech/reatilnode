const axios = require('axios');
async function run() {
    // just test query via db since it's easier
    const mysql = require('mysql2/promise');
    require('dotenv').config({ path: '/var/www/RetailNodeV2/backend/.env' });
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'retailnode_db'
    });
    
    // the api is /api/items which probably joins brands
    const [rows] = await connection.execute(`
      SELECT Items.*, Brands.name as brand_name 
      FROM Items 
      LEFT JOIN Brands ON Items.brand_id = Brands.id 
      LIMIT 1
    `);
    console.log(JSON.stringify(rows[0], null, 2));
    await connection.end();
}
run();
