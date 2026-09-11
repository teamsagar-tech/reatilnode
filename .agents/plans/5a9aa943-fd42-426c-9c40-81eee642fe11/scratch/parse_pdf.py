import pdfplumber
import pandas as pd
import re

pdf_path = '/Users/ratan/Downloads/RetailNodeV2/sample/WS26 PRICE LIST.pdf'

records = []

# Headers to detect
# Quality No, UC, Shades, DP, Ex-Mill, Wholesale, Retail

with pdfplumber.open(pdf_path) as pdf:
    current_item = None
    
    for i, page in enumerate(pdf.pages):
        tables = page.extract_tables()
        if not tables:
            continue
            
        for table in tables:
            for row in table:
                # Clean up the row (remove None and strip whitespace)
                cleaned_row = [str(cell).strip().replace('\n', ' ') if cell is not None else "" for cell in row]
                
                # Check if this row is just an item header (e.g. "LINEAR SYMPHONY")
                # Usually it spans across multiple columns or has text in the first column and empty in others
                # But wait, looking at the table structure, "LINEAR SYMPHONY" might just be in the first column.
                # Let's see the structure.
                
                # We need to print a few rows to see how pdfplumber parses it.
                print(cleaned_row)
