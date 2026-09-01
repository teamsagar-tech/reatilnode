const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    console.log("Connected to local Mongo!");
    const dbs = await client.db().admin().listDatabases();
    console.log("Databases:", dbs.databases.map(d => d.name));
    
    if (dbs.databases.find(d => d.name === 'rsdb_archive')) {
      console.log("\nFound rsdb_archive. Collections:");
      const cols = await client.db('rsdb_archive').listCollections().toArray();
      console.log(cols.map(c => c.name));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
check();
