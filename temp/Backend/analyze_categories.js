const { MongoClient } = require('mongodb');

async function analyze() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = client.db('RsDB_Archive');
    
    // First, map category names to their codes
    const cats = await db.collection('Category').find({}).toArray();
    
    const getCatCodes = (keywords) => {
      return cats.filter(c => keywords.some(kw => c.CategoryName.toLowerCase().includes(kw.toLowerCase())))
                 .map(c => c.CategoryCode);
    };

    const sareeCodes = getCatCodes(['saree', 'jari border', 'silk']);
    const readywearCodes = getCatCodes(['readywear', 'readymade']);
    // Wait, let's also check departments for innerwear just in case
    const depts = await db.collection('SectionMF').find({}).toArray(); // section might be department
    
    const innerwearCodes = getCatCodes(['innerwear', 'inner wear', 'lingerie', 'undergarment', 'bra', 'panty', 'mens under', 'womens under']);
    // If not in category, might be something else, let's just use what we find.

    console.log("Found Saree Category Codes:", sareeCodes);
    console.log("Found Readywear Category Codes:", readywearCodes);
    console.log("Found Innerwear Category Codes:", innerwearCodes);

    // Fetch a sample item for each
    const getSampleItem = async (codes, categoryName) => {
      if (codes.length === 0) return { error: `No category codes found for ${categoryName}` };
      
      // Get an item
      const item = await db.collection('Items').findOne({ CategoryCode: { $in: codes } });
      // If we find an item, let's also find a GRDetail for it to see transaction fields
      let detail = null;
      if (item) {
        detail = await db.collection('GRDetails').findOne({ ItemCode: item.ItemCode });
      }
      return { item, detail };
    };

    const sareeSample = await getSampleItem(sareeCodes, "Saree");
    const readywearSample = await getSampleItem(readywearCodes, "Readywear");
    const innerwearSample = await getSampleItem(innerwearCodes, "Innerwear");

    const output = {
      Saree: sareeSample,
      Readywear: readywearSample,
      Innerwear: innerwearSample
    };

    console.log(JSON.stringify(output, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

analyze();
