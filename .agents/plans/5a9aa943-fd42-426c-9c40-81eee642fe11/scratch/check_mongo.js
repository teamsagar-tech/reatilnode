const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = client.db('RsDB_Archive');
    console.log("Collections in RsDB_Archive:");
    const cols = await db.listCollections().toArray();
    console.log(cols.map(c => c.name));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
check();
