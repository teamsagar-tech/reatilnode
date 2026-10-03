const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log("Starting Migration...");

        // 1. Add is_active and deleted_at to Users table
        try {
            await pool.query("ALTER TABLE Users ADD COLUMN is_active BOOLEAN DEFAULT TRUE");
            await pool.query("ALTER TABLE Users ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL");
            console.log("✅ Added is_active to Users");
        } catch (e) {
            console.log("ℹ️ Users table already has is_active or error:", e.message);
        }

        // 2. Add is_active and deleted_at to TenantUsers table
        try {
            await pool.query("ALTER TABLE TenantUsers ADD COLUMN is_active BOOLEAN DEFAULT TRUE");
            await pool.query("ALTER TABLE TenantUsers ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL");
            console.log("✅ Added is_active to TenantUsers");
        } catch (e) {
            console.log("ℹ️ TenantUsers table already has is_active or error:", e.message);
        }

        // 3. Create ActionLogs table
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ActionLogs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firm_id INT NOT NULL,
            user_id INT NOT NULL,
            action_type ENUM('LOGIN', 'PAGE_VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT') NOT NULL,
            module VARCHAR(100) NOT NULL,
            description TEXT,
            ip_address VARCHAR(45),
            payload JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (firm_id) REFERENCES Firms(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
        );`;
        await pool.query(createTableQuery);
        console.log("✅ Created ActionLogs table");

        console.log("🎉 Migration Complete!");
    } catch (e) {
        console.error("❌ Migration failed:", e);
    } finally {
        pool.end();
    }
}

migrate();
