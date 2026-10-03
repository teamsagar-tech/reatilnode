import os
import re

broken_files = [
    '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/accounting/PartyMaster.tsx',
    '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/inventory/BrandMaster.tsx',
    '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/inventory/CategoryMaster.tsx'
]

for filepath in broken_files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove all usages of <SectionTitle>...</SectionTitle>
    new_content = re.sub(r'<SectionTitle>.*?</SectionTitle>', '', content, flags=re.DOTALL)
    
    with open(filepath, 'w') as f:
        f.write(new_content)
    
    print(f"Fixed TS error in {os.path.basename(filepath)}")

