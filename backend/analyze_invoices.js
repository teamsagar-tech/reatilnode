const { MongoClient } = require('mongodb');
const fs = require('fs');

async function analyzeInvoices() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = client.db('RsDB_Archive');
    
    console.log("Fetching 2000 recent GR (Purchase Invoices)...");
    const grs = await db.collection('GR').find({}).sort({ ReceiveDate: -1 }).limit(2000).toArray();
    
    console.log(`Fetched ${grs.length} invoices. Fetching their details...`);
    const grns = grs.map(gr => gr.GRN);
    
    const details = await db.collection('GRDetails').find({ GRN: { $in: grns } }).toArray();
    console.log(`Fetched ${details.length} line items.`);

    // Fetch related master data to resolve names
    const itemCodes = [...new Set(details.map(d => d.ItemCode))];
    const brandCodes = [...new Set(details.map(d => d.BrandCode))];
    const catCodes = [...new Set(details.map(d => d.CategoryCode))];
    const partyCodes = [...new Set(grs.map(gr => gr.PartyCode))];

    const items = await db.collection('Items').find({ ItemCode: { $in: itemCodes } }).toArray();
    const brands = await db.collection('Brand').find({ BrandCode: { $in: brandCodes } }).toArray();
    const categories = await db.collection('Category').find({ CategoryCode: { $in: catCodes } }).toArray();
    const parties = await db.collection('Party').find({ PartyCode: { $in: partyCodes } }).toArray();

    // Create lookup maps
    const itemMap = new Map(items.map(i => [i.ItemCode, i.ItemName]));
    const brandMap = new Map(brands.map(b => [b.BrandCode, b.BrandName]));
    const catMap = new Map(categories.map(c => [c.CategoryCode, c.CategoryName]));
    const partyMap = new Map(parties.map(p => [p.PartyCode, p.PartyName]));

    // Analysis objects
    let analysis = {
      totalInvoices: grs.length,
      totalItems: details.length,
      totalValue: 0,
      uniqueSuppliers: partyCodes.length,
      topSuppliers: {},
      topBrands: {},
      topCategories: {},
      invoiceTypes: {},
      hsnDistribution: {}
    };

    grs.forEach(gr => {
      analysis.totalValue += gr.BillAmt || 0;
      const supplier = partyMap.get(gr.PartyCode) || `Unknown (${gr.PartyCode})`;
      analysis.topSuppliers[supplier] = (analysis.topSuppliers[supplier] || 0) + 1;
      
      // Attempt to classify invoice types based on size/content
      const invDetails = details.filter(d => d.GRN === gr.GRN);
      let type = "Standard";
      if (invDetails.length > 50) type = "Bulk Order";
      else if (invDetails.length < 5) type = "Small Restock";
      
      analysis.invoiceTypes[type] = (analysis.invoiceTypes[type] || 0) + 1;
    });

    details.forEach(d => {
      const brand = brandMap.get(d.BrandCode) || `Unknown (${d.BrandCode})`;
      const category = catMap.get(d.CategoryCode) || `Unknown (${d.CategoryCode})`;
      const hsn = d.HSNCode || "N/A";
      
      analysis.topBrands[brand] = (analysis.topBrands[brand] || 0) + 1;
      analysis.topCategories[category] = (analysis.topCategories[category] || 0) + 1;
      analysis.hsnDistribution[hsn] = (analysis.hsnDistribution[hsn] || 0) + 1;
    });

    // Sort maps to get top 10
    const getTop10 = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, 10);

    analysis.topSuppliers = getTop10(analysis.topSuppliers);
    analysis.topBrands = getTop10(analysis.topBrands);
    analysis.topCategories = getTop10(analysis.topCategories);
    analysis.hsnDistribution = getTop10(analysis.hsnDistribution);

    fs.writeFileSync('/Users/ratan/.gemini/antigravity-ide/brain/5a9aa943-fd42-426c-9c40-81eee642fe11/scratch/analysis_output.json', JSON.stringify(analysis, null, 2));
    console.log("Analysis saved to analysis_output.json");
    
    // Also save a rich joined sample of 3 invoices for the artifact
    const sampleGRs = grs.slice(0, 3).map(gr => {
      const invDetails = details.filter(d => d.GRN === gr.GRN).map(d => ({
        itemName: itemMap.get(d.ItemCode),
        brand: brandMap.get(d.BrandCode),
        category: catMap.get(d.CategoryCode),
        qty: d.RecvQty,
        rate: d.PurchaseRate,
        hsn: d.HSNCode
      }));
      return {
        invoiceNumber: gr.BillNo,
        supplier: partyMap.get(gr.PartyCode),
        date: gr.ReceiveDate,
        totalAmount: gr.BillAmt,
        items: invDetails
      };
    });
    fs.writeFileSync('/Users/ratan/.gemini/antigravity-ide/brain/5a9aa943-fd42-426c-9c40-81eee642fe11/scratch/sample_invoices.json', JSON.stringify(sampleGRs, null, 2));
    console.log("Sample invoices saved to sample_invoices.json");

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

analyzeInvoices();
