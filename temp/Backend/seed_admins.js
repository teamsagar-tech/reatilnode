const bcrypt = require('bcrypt');
const db = require('./config/db');

async function seed() {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Super Admin
    const [saFirms] = await connection.execute('SELECT id FROM Firms WHERE name = ?', ['System Admin']);
    let saFirmId;
    if (saFirms.length === 0) {
      const [res] = await connection.execute('INSERT INTO Firms (name) VALUES (?)', ['System Admin']);
      saFirmId = res.insertId;
    } else {
      saFirmId = saFirms[0].id;
    }
    
    const saPassword = await bcrypt.hash('India@1990', 10);
    
    // Check if user exists
    const [existingSa] = await connection.execute('SELECT id FROM Users WHERE email = ?', ['sagar@retailnode.com']);
    if (existingSa.length === 0) {
      await connection.execute(
        'INSERT INTO Users (firm_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [saFirmId, 'Sagar', 'sagar@retailnode.com', saPassword, 'superadmin']
      );
      console.log('Super Admin Sagar created with email sagar@retailnode.com');
    } else {
      console.log('Super Admin Sagar already exists.');
    }

    // 2. VRP Admin
    const [vrpFirms] = await connection.execute('SELECT id FROM Firms WHERE name = ?', ['VRP']);
    let vrpFirmId;
    if (vrpFirms.length === 0) {
      const [res] = await connection.execute('INSERT INTO Firms (name) VALUES (?)', ['VRP']);
      vrpFirmId = res.insertId;
    } else {
      vrpFirmId = vrpFirms[0].id;
    }
    
    const vrpPassword = await bcrypt.hash('vrp@1943', 10);
    
    // Check if user exists
    const [existingVrp] = await connection.execute('SELECT id FROM Users WHERE email = ?', ['vrpadmin@vrp.com']);
    if (existingVrp.length === 0) {
      await connection.execute(
        'INSERT INTO Users (firm_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [vrpFirmId, 'vrpadmin', 'vrpadmin@vrp.com', vrpPassword, 'admin']
      );
      console.log('VRP Admin created with email vrpadmin@vrp.com');
    } else {
      console.log('VRP Admin already exists.');
    }

    await connection.commit();
    console.log('Database seeding successful.');
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error seeding database:', err);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

seed();
