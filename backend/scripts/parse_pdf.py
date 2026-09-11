import sys
import json
import re

try:
    import pdfplumber
except ImportError:
    print(json.dumps({"error": "pdfplumber is not installed on the system. Please run 'pip3 install pdfplumber pandas'."}))
    sys.exit(1)

def parse_pdf(file_path):
    records = []
    try:
        with pdfplumber.open(file_path) as pdf:
            current_item = None
            
            for page in pdf.pages:
                tables = page.extract_tables()
                if not tables:
                    continue
                    
                for table in tables:
                    for row in table:
                        cleaned_row = [str(cell).strip().replace('\n', ' ') if cell is not None else "" for cell in row]
                        
                        # Skip header rows
                        if cleaned_row[0] == 'Sr. No.' or cleaned_row[1] == 'Quality No':
                            continue
                            
                        # Check if it's an Item Name header (first column has text, second is empty)
                        if cleaned_row[0] and not cleaned_row[1]:
                            current_item = cleaned_row[0]
                            continue
                        
                        # It's a data row if it has a Quality No
                        if len(cleaned_row) > 1 and cleaned_row[1]:
                            design_no = cleaned_row[1]
                            shades_raw = cleaned_row[3] if len(cleaned_row) > 3 else ""
                            # Replace multiple spaces with a comma for shades
                            shades = re.sub(r'\s+', ', ', shades_raw.strip())
                            purchase_price = cleaned_row[5] if len(cleaned_row) > 5 else "0.00"
                            sales_price = cleaned_row[7] if len(cleaned_row) > 7 else "0.00"
                            
                            records.append({
                                "itemName": current_item,
                                "designNo": design_no,
                                "shades": shades,
                                "purchasePrice": purchase_price,
                                "salesPrice": sales_price
                            })
        print(json.dumps({"success": True, "records": records}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided."}))
        sys.exit(1)
    parse_pdf(sys.argv[1])
