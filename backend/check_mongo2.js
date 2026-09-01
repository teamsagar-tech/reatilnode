const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const cols = await client.db('RsDB_Archive').listCollections().toArray();
    console.log("Collections in RsDB_Archive:", cols.map(c => c.name).join(', '));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
check();
