const { MongoClient } = require('mongodb');

async function analyzeParams() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = client.db('RsDB_Archive');
    
    // Fetch 2000 recent invoices
    console.log("Fetching 2000 recent invoices...");
    const grs = await db.collection('GR').find({}).sort({ ReceiveDate: -1 }).limit(2000).toArray();
    const grns = grs.map(g => g.GRN);
    
    // Fetch all details for these 2000 invoices
    console.log(`Fetching all line items individually for ${grs.length} invoices...`);
    const allDetails = await db.collection('GRDetails').find({ GRN: { $in: grns } }).toArray();
    console.log(`Found ${allDetails.length} individual items to check.`);

    // Group items by category to do per-category parameter analysis
    const categoryGroups = {
      'Saree & Silk': [19, 5, 6, 198, 201, 269, 271, 272, 276, 280, 283, 285, 288, 295, 231],
      'Readywear': [195, 331],
      'Innerwear': [190],
      'Others': [] // Catch-all
    };
    
    const analyzeGroup = (name, codes) => {
      let details;
      if (name === 'Others') {
        const knownCodes = [...categoryGroups['Saree & Silk'], ...categoryGroups['Readywear'], ...categoryGroups['Innerwear']];
        details = allDetails.filter(d => !knownCodes.includes(d.CategoryCode));
      } else {
        details = allDetails.filter(d => codes.includes(d.CategoryCode));
      }

      if (details.length === 0) return { name, count: 0, fields: {} };

      let fieldUsage = {};
      
      details.forEach(doc => {
        Object.entries(doc).forEach(([key, value]) => {
          if (!fieldUsage[key]) {
            fieldUsage[key] = { populated: 0, nonZero: 0, sampleValues: new Set() };
          }
          
          const isPopulated = value !== null && value !== undefined && value !== '';
          const isNonZero = isPopulated && value !== 0 && value !== '0' && value !== 'False' && value !== '0.00';

          if (isPopulated) fieldUsage[key].populated++;
          if (isNonZero) {
            fieldUsage[key].nonZero++;
            if (fieldUsage[key].sampleValues.size < 5) {
               fieldUsage[key].sampleValues.add(String(value));
            }
          }
        });
      });

      const formattedFields = {};
      Object.entries(fieldUsage).forEach(([key, stats]) => {
        if (stats.nonZero > 0 && key !== '_id') {
           formattedFields[key] = {
             utilizationPercent: ((stats.nonZero / details.length) * 100).toFixed(1) + '%',
             samples: Array.from(stats.sampleValues)
           };
        }
      });

      return {
        category: name,
        totalItemsChecked: details.length,
        meaningfulParameters: formattedFields
      };
    };

    const output = Object.keys(categoryGroups).map(name => analyzeGroup(name, categoryGroups[name]));
    
    // Also save to a file so it doesn't clutter terminal
    const fs = require('fs');
    fs.writeFileSync('/Users/ratan/.gemini/antigravity-ide/brain/5a9aa943-fd42-426c-9c40-81eee642fe11/scratch/analyze_2000_params.json', JSON.stringify(output, null, 2));
    console.log("Analysis of 2000 invoices saved to scratch/analyze_2000_params.json");

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

analyzeParams();
