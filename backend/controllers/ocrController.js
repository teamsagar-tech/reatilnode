const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.scanImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const engine = req.body.engine || 'openai'; // default to openai if not provided
  const filePath = req.file.path;
  const scriptPath = path.join(__dirname, '../scripts/ocr_vision.py');

  execFile('python3', [scriptPath, engine, filePath], { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout, stderr) => {
    // Clean up uploaded image
    fs.unlink(filePath, (err) => { if (err) console.error("Failed to delete temp file:", err); });

    if (error) {
      console.error('Python Script Error:', error);
      return res.status(500).json({ error: 'Failed to process image', details: stderr || error.message });
    }

    try {
      const output = JSON.parse(stdout);
      if (!output.success) {
        return res.status(500).json({ error: output.error || 'Failed to extract text' });
      }
      
      res.json({
        message: 'Image OCR completed',
        engine: output.engine,
        items: output.parsed_items
      });
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw stdout:', stdout);
      res.status(500).json({ error: 'Invalid response from AI script', details: parseError.message });
    }
  });
};
