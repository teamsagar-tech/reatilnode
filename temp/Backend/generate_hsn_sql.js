const { MongoClient } = require('mongodb');
const fs = require('fs');

async function check() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = client.db('RsDB_Archive');
    
    console.log("Fetching HSNMF...");
    const cursor = db.collection('HSNMF').find({});
    
    let sql = 'USE retailnode_db;\n';
    sql += 'DELETE FROM HSNSACs WHERE firm_id = 1;\n'; // Clear existing just in case
    
    let batch = [];
    
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (!doc.HSNCode) continue;
      
      const code = String(doc.HSNCode).replace(/'/g, "''");
      const desc = doc.HSNDesc ? String(doc.HSNDesc).replace(/'/g, "''") : '';
      
      batch.push(`(1, '${code}', '${desc}', 1, 0)`);
      
      if (batch.length === 1000) {
        sql += `INSERT INTO HSNSACs (firm_id, name, description, is_active, tax_percent) VALUES ${batch.join(',')};\n`;
        batch = [];
      }
    }
    
    if (batch.length > 0) {
      sql += `INSERT INTO HSNSACs (firm_id, name, description, is_active, tax_percent) VALUES ${batch.join(',')};\n`;
    }
    
    fs.writeFileSync('hsn_dump.sql', sql);
    console.log("Wrote hsn_dump.sql");

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
check();
