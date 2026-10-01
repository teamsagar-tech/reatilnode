const { MongoClient } = require('mongodb');
const pool = require('../config/db');

const MONGO_URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'vrp_db';

async function migrateData() {
  let mongoClient;
  let mysqlConn;
  
  try {
    console.log('Connecting to MongoDB...');
    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const db = mongoClient.db(DB_NAME);
    
    console.log('Connecting to MySQL...');
    mysqlConn = await pool.getConnection();

    let [firms] = await mysqlConn.query('SELECT id FROM Firms LIMIT 1');
    let defaultFirmId;
    if (firms.length === 0) {
      console.log('No Firms found. Creating default firm...');
      const [res] = await mysqlConn.query(`INSERT INTO Firms (firm_name, email, mobile) VALUES ('Default Firm', 'admin@example.com', '9999999999')`);
      defaultFirmId = res.insertId;
    } else {
      defaultFirmId = firms[0].id;
    }
    console.log(`Using Firm ID: ${defaultFirmId} as default.`);

    console.log('Extracting Full Products from MongoDB (kalambproducts)...');
    const mongoProducts = await db.collection('kalambproducts').find({}).limit(5000).toArray();
    console.log(`Found ${mongoProducts.length} products to migrate.`);
    
    await mysqlConn.query('DELETE FROM Products'); 
    console.log('Wiped old MySQL Products to ensure a clean slate with deep data.');

    let insertedCount = 0;
    
    for (const p of mongoProducts) {
      // Map basic legacy fields
      const barcode = p.barcode || `MIG-${p._id}`;
      const name = p.productName || p.itemName || 'Migrated Product';
      const mrp = p.mrp || p.MRP || p.saleRate || 0;
      const vrp = p.vrpRate || p.VRP || p.purchaseRate || 0;
      const qty = p.quantity || 1;
      const isSold = p.isSold ? 1 : 0;
      const batch = p.batch || null;
      const discount = p.discountPercent || p.discount || 0;
      
      // Deep financial fields mapped directly from MongoDB Schema
      const purchaseRate = p.purchaseRate || 0;
      const netRate = p.netRate || 0;
      const gst = p.gst || 0;
      const commType = p.commissionType || null;
      const commVal = p.commissionValue || 0;
      const mrCommType = p.mrCommissionType || null;
      const mrCommVal = p.mrCommissionValue || 0;
      const boxId = p.boxId || null;
      const unitType = p.unitType || 'Pcs';
      
      try {
        await mysqlConn.query(`
          INSERT INTO Products (
            firm_id, barcode, product_name, mrp, vrp_rate, quantity, is_sold, batch, discount,
            purchase_rate, net_rate, gst, 
            commission_type, commission_value, mr_commission_type, mr_commission_value,
            box_id, unit_type
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          defaultFirmId, barcode, name, mrp, vrp, qty, isSold, batch, discount,
          purchaseRate, netRate, gst,
          commType, commVal, mrCommType, mrCommVal,
          boxId, unitType
        ]);
        insertedCount++;
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') {
           console.error(`Failed to insert product ${barcode}:`, err.message);
        }
      }
    }
    
    console.log(`Successfully mapped and inserted ${insertedCount} Deep Data products into MySQL!`);

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    if (mongoClient) await mongoClient.close();
    if (mysqlConn) mysqlConn.release();
    process.exit(0);
  }
}

migrateData();
