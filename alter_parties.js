const db = require('./backend/config/db');

(async () => {
  try {
    console.log("Checking DB columns...");
    
    // Add categories column if it doesn't exist
    try {
      await db.execute('ALTER TABLE Parties ADD COLUMN categories JSON');
      console.log("Added categories column");
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log("categories column already exists");
      else throw e;
    }
    
    // Add brands column if it doesn't exist
    try {
      await db.execute('ALTER TABLE Parties ADD COLUMN brands JSON');
      console.log("Added brands column");
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log("brands column already exists");
      else throw e;
    }

    console.log("Success");
  } catch(e) { 
    console.log(e); 
  } finally {
    process.exit(0);
  }
})();
