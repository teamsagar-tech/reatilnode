const db = require('../config/db');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.importPriceList = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  const { brand_id } = req.body;
  const filePath = req.file.path;
  const scriptPath = path.join(__dirname, '../scripts/parse_pdf.py');

  // We assume python3 and pdfplumber are installed and available
  execFile('python3', [scriptPath, filePath], { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout, stderr) => {
    // Delete temp file after execution
    fs.unlink(filePath, (err) => { if (err) console.error("Failed to delete temp file:", err); });

    if (error) {
      console.error('Python Script Error:', error);
      return res.status(500).json({ error: 'Failed to process PDF', details: stderr || error.message });
    }

    try {
      const output = JSON.parse(stdout);
      if (!output.success) {
        return res.status(500).json({ error: output.error || 'Failed to parse PDF' });
      }

      const records = output.records;
      if (!records || records.length === 0) {
        return res.status(400).json({ error: 'No data found in PDF' });
      }

      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Fetch existing Items, Designs, Colors to avoid duplicates
        const [existingItems] = await connection.execute('SELECT id, name FROM Items WHERE firm_id = ?', [req.firm_id]);
        const itemMap = new Map(existingItems.map(i => [i.name.toLowerCase(), i.id]));

        const [existingDesigns] = await connection.execute('SELECT id, name FROM Designs WHERE firm_id = ?', [req.firm_id]);
        const designMap = new Map(existingDesigns.map(d => [d.name.toLowerCase(), d.id]));

        const [existingColors] = await connection.execute('SELECT id, name FROM Colors WHERE firm_id = ?', [req.firm_id]);
        const colorMap = new Map(existingColors.map(c => [c.name.toLowerCase(), c.id]));

        let itemsAdded = 0;
        let itemsUpdated = 0;
        let designsAdded = 0;
        let colorsAdded = 0;

        for (const record of records) {
          const { itemName, designNo, shades, purchasePrice, salesPrice } = record;
          
          if (!itemName) continue;

          // 1. Process Item
          const itemKey = itemName.toLowerCase();
          if (!itemMap.has(itemKey)) {
            const [itemResult] = await connection.execute(
              `INSERT INTO Items (firm_id, name, cost_price, selling_price, brand_id) VALUES (?, ?, ?, ?, ?)`,
              [req.firm_id, itemName, parseFloat(purchasePrice) || 0, parseFloat(salesPrice) || 0, brand_id || null]
            );
            itemMap.set(itemKey, itemResult.insertId);
            itemsAdded++;
          } else {
            // Update prices if item already exists
            await connection.execute(
              `UPDATE Items SET cost_price = ?, selling_price = ? WHERE id = ?`,
              [parseFloat(purchasePrice) || 0, parseFloat(salesPrice) || 0, itemMap.get(itemKey)]
            );
            itemsUpdated++;
          }

          // 2. Process Design
          if (designNo) {
            const designKey = designNo.toLowerCase();
            if (!designMap.has(designKey)) {
              const [designResult] = await connection.execute(
                `INSERT INTO Designs (firm_id, name) VALUES (?, ?)`,
                [req.firm_id, designNo]
              );
              designMap.set(designKey, designResult.insertId);
              designsAdded++;
            }
          }

          // 3. Process Colors (Shades)
          if (shades) {
            const colorList = shades.split(',').map(s => s.trim()).filter(Boolean);
            for (const colorName of colorList) {
              const colorKey = colorName.toLowerCase();
              if (!colorMap.has(colorKey)) {
                const [colorResult] = await connection.execute(
                  `INSERT INTO Colors (firm_id, name) VALUES (?, ?)`,
                  [req.firm_id, colorName]
                );
                colorMap.set(colorKey, colorResult.insertId);
                colorsAdded++;
              }
            }
          }
        }

        await connection.commit();
        connection.release();

        res.json({
          message: 'Price list imported successfully',
          stats: {
            itemsAdded,
            itemsUpdated,
            designsAdded,
            colorsAdded
          }
        });

      } catch (dbError) {
        await connection.rollback();
        connection.release();
        console.error('Database Transaction Error:', dbError);
        res.status(500).json({ error: 'Database transaction failed', details: dbError.message });
      }

    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      res.status(500).json({ error: 'Invalid response from parser', details: parseError.message });
    }
  });
};
