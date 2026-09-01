const db = require('../config/db');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');

exports.importPreview = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const vendor_id = req.body.vendor_id;
  const template_id = req.body.template_id;

  try {
    // 1. Fetch Template
    let mapping_config = {};
    if (template_id) {
      const [templates] = await db.execute('SELECT mapping_config FROM ImportTemplates WHERE id = ?', [template_id]);
      if (templates.length > 0) {
        mapping_config = templates[0].mapping_config;
      }
    }

    let parsedData = [];

    // 2. Parse File
    if (req.file.originalname.endsWith('.csv')) {
      const results = [];
      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });
      parsedData = results;
    } else {
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      parsedData = xlsx.utils.sheet_to_json(sheet);
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // 3. Map Data (Stub for Preview)
    const preview = {
      totalRows: parsedData.length,
      sample: parsedData.slice(0, 5),
      message: 'File parsed successfully. Please map the columns.'
    };

    res.json(preview);
  } catch (error) {
    console.error('Import Error:', error);
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to process file' });
  }
};
