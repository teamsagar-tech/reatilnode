import pdfplumber
import pandas as pd
import re

pdf_path = '/Users/ratan/Downloads/RetailNodeV2/sample/WS26 PRICE LIST.pdf'
out_path = '/Users/ratan/.gemini/antigravity-ide/brain/5a9aa943-fd42-426c-9c40-81eee642fe11/parsed_price_list.csv'

records = []

with pdfplumber.open(pdf_path) as pdf:
    current_item = None
    
    for i, page in enumerate(pdf.pages):
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
                    purchase_price = cleaned_row[5] if len(cleaned_row) > 5 else ""
                    sales_price = cleaned_row[7] if len(cleaned_row) > 7 else ""
                    
                    records.append({
                        "Item Name": current_item,
                        "Design No": design_no,
                        "Colour (Shades)": shades,
                        "Purchase Price (Ex-Mill)": purchase_price,
                        "Sales Price (Retail)": sales_price
                    })

df = pd.DataFrame(records)
df.to_csv(out_path, index=False)
print(f"Successfully wrote {len(records)} records to {out_path}")
