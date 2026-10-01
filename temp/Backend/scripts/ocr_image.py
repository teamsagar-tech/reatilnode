import sys
import json
import pytesseract
from PIL import Image

def parse_image(image_path):
    try:
        img = Image.open(image_path)
        # Extract raw text
        raw_text = pytesseract.image_to_string(img)
        
        # We will attempt a very naive line-by-line parsing to see if we can extract tabular data.
        # This will be extremely fragile as Tesseract is not an LLM.
        lines = raw_text.split('\n')
        
        items = []
        for line in lines:
            line = line.strip()
            # Very naive heuristic: If a line has something that looks like "PCS" and a number, it might be an item row.
            if "PCS" in line.upper() or "Pcs" in line or "%" in line:
                items.append({
                    "raw_line": line,
                    "item_name": line[:30].strip(), # completely arbitrary slice
                    "qty": "Extract Failed",
                    "price": "Extract Failed"
                })

        output = {
            "success": True,
            "raw_text": raw_text,
            "parsed_items": items
        }
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No image path provided"}))
        sys.exit(1)
    parse_image(sys.argv[1])
