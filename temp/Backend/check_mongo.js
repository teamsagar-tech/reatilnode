const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = client.db('RsDB_Archive');
    
    console.log("--- GR Sample ---");
    const gr = await db.collection('GR').findOne({});
    console.log(JSON.stringify(gr, null, 2));

    console.log("\n--- GRDetails Sample ---");
    const grDetails = await db.collection('GRDetails').findOne({});
    console.log(JSON.stringify(grDetails, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
check();
