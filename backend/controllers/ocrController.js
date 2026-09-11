const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.scanImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const filePath = req.file.path;
  const scriptPath = path.join(__dirname, '../scripts/ocr_image.py');

  // Assuming python3 and pytesseract are available
  execFile('python3', [scriptPath, filePath], { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout, stderr) => {
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
        raw_text: output.raw_text,
        items: output.parsed_items
      });
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw stdout:', stdout);
      res.status(500).json({ error: 'Invalid response from OCR script', details: parseError.message });
    }
  });
};
