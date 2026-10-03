const db = require('./config/db');

async function createTables() {
    try {
        console.log("Creating PushSubscriptions table...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS PushSubscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                endpoint VARCHAR(512) NOT NULL UNIQUE,
                p256dh VARCHAR(255) NOT NULL,
                auth VARCHAR(255) NOT NULL,
                device_info VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (user_id)
            )
        `);

        console.log("Creating InAppNotifications table...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS InAppNotifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firm_id INT NOT NULL,
                user_id INT NULL,
                role_id INT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                link_url VARCHAR(255) NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (firm_id),
                INDEX (user_id),
                INDEX (role_id)
            )
        `);

        console.log("Tables created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error creating tables:", err);
        process.exit(1);
    }
}

createTables();
