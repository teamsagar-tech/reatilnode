const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = client.db('RsDB_Archive');
    
    const grSample = await db.collection('GRDetails').findOne();
    console.log("GRDetails sample:", JSON.stringify(grSample, null, 2));

    const masterBarcodeSample = await db.collection('MasterBarcode').findOne();
    console.log("MasterBarcode sample:", JSON.stringify(masterBarcodeSample, null, 2));
    
    const gstSample = await db.collection('GSTMF').findOne();
    console.log("GSTMF sample:", JSON.stringify(gstSample, null, 2));
    
    const categorySample = await db.collection('Category').findOne();
    console.log("Category sample:", JSON.stringify(categorySample, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
check();
