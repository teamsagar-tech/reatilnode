import os
import re

files_to_fix = [
    'CategoryMaster.tsx',
    'SubCategoryMaster.tsx',
    'DepartmentMaster.tsx',
    'SectionMaster.tsx',
    'StyleMaster.tsx',
    'ColorMaster.tsx',
    'MaterialMaster.tsx'
]

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/masters/inventory'

for filename in files_to_fix:
    filepath = os.path.join(base_dir, filename)
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()

    # The issue was that the python script prepended the components to the file, but didn't successfully remove them from inside the function in some cases due to indentation differences.
    # We can use regex to remove any declaration of SectionTitle, InputRow, SelectRow that occurs AFTER 'export default function'.
    
    parts = content.split('export default function')
    if len(parts) == 2:
        top_part = parts[0]
        bottom_part = parts[1]
        
        # Remove SectionTitle
        bottom_part = re.sub(r'\s*const SectionTitle = \(\{ children \}: \{ children: React\.ReactNode \}\) => \([\s\S]*?</div>\s*\);', '', bottom_part)
        
        # Remove InputRow
        bottom_part = re.sub(r'\s*const InputRow = \(\{.*?\}: any\) => \([\s\S]*?</div>\s*\);', '', bottom_part)
        
        # Remove SelectRow
        bottom_part = re.sub(r'\s*const SelectRow = \(\{.*?\}: any\) => \([\s\S]*?</div>\s*\);', '', bottom_part)
        
        content = top_part + 'export default function' + bottom_part

    with open(filepath, 'w') as f:
        f.write(content)

print("Done")
