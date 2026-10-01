const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = client.db('RsDB_Archive');
    
    // 1. Get unique HSNs from purchases (GRDetails)
    console.log("Fetching distinct HSNs from GRDetails...");
    const purchaseHsns = await db.collection('GRDetails').distinct('HSNCode');
    
    // 2. Get unique HSNs from sales
    console.log("Fetching distinct BarCodeIDs from InvoiceDetails...");
    const salesBarcodes = await db.collection('InvoiceDetails').distinct('BarCodeID');
    
    console.log(`Found ${salesBarcodes.length} distinct BarCodeIDs in Sales. Looking up MasterBarcode...`);
    // MasterBarcode maps BarcodeID -> CategoryCode
    // We can fetch all MasterBarcodes that are in the sales list to get CategoryCodes
    // But since the number might be large, we can just aggregate or fetch all MasterBarcodes
    
    // Fetch all MasterBarcodes mapping BarcodeID -> CategoryCode
    const mbDocs = await db.collection('MasterBarcode').find({ BarcodeID: { $in: salesBarcodes } }, { projection: { BarcodeID: 1, CategoryCode: 1 } }).toArray();
    
    const salesCategoryCodes = [...new Set(mbDocs.map(d => d.CategoryCode))];
    console.log(`Found ${salesCategoryCodes.length} distinct CategoryCodes in Sales. Looking up Category HSNs...`);
    
    // Fetch HSNCode for these CategoryCodes
    const catDocs = await db.collection('Category').find({ CategoryCode: { $in: salesCategoryCodes } }, { projection: { HSNCode: 1 } }).toArray();
    
    const salesHsns = [...new Set(catDocs.map(d => d.HSNCode))];
    
    const purSet = new Set(purchaseHsns.map(String));
    const salSet = new Set(salesHsns.map(String));
    
    const onlyPur = [...purSet].filter(x => !salSet.has(x) && x && x !== "0" && x !== "null");
    const onlySal = [...salSet].filter(x => !purSet.has(x) && x && x !== "0" && x !== "null");
    const both = [...purSet].filter(x => salSet.has(x) && x && x !== "0" && x !== "null");
    
    console.log("\n==============================");
    console.log(`Total Unique Purchase HSNs: ${purchaseHsns.length}`);
    console.log(`Total Unique Sales HSNs: ${salesHsns.length}`);
    console.log("==============================\n");
    
    console.log("HSNs used ONLY in Purchase (Top 10):", onlyPur.slice(0, 10));
    console.log(`Total HSNs ONLY in Purchase: ${onlyPur.length}`);
    
    console.log("\nHSNs used ONLY in Sales (Top 10):", onlySal.slice(0, 10));
    console.log(`Total HSNs ONLY in Sales: ${onlySal.length}`);
    
    console.log("\nHSNs used in BOTH (Top 10):", both.slice(0, 10));
    console.log(`Total HSNs in BOTH: ${both.length}`);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
check();
