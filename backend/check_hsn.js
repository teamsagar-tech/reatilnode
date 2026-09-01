const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = client.db('RsDB_Archive');
    const sample = await db.collection('HSNMF').findOne();
    console.log("Sample HSNMF document:", JSON.stringify(sample, null, 2));
    
    // Check if there are any flags indicating purchase or sales
    const count = await db.collection('HSNMF').countDocuments();
    console.log("Total HSNs:", count);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
check();
