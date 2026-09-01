const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = client.db('RsDB_Archive');
    
    const invoiceSample = await db.collection('InvoiceDetails').findOne();
    console.log("InvoiceDetails sample:", JSON.stringify(invoiceSample, null, 2));
    
    const grSample = await db.collection('GrDetails').findOne();
    console.log("GrDetails sample:", JSON.stringify(grSample, null, 2));

    const itemSample = await db.collection('Items').findOne();
    console.log("Items sample:", JSON.stringify(itemSample, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
check();
