import os
import re

files_to_fix = [
    'BrandMaster.tsx',
    '../accounting/PartyMaster.tsx'
]

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/masters/inventory'

for filename in files_to_fix:
    filepath = os.path.normpath(os.path.join(base_dir, filename))
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()

    parts = content.split('export default function')
    if len(parts) == 2:
        top_part = parts[0]
        bottom_part = parts[1]
        
        extracted_components = "\n"

        # Find SectionTitle
        section_title_match = re.search(r'\s*const SectionTitle = \(\{ children \}: \{ children: React\.ReactNode \}\) => \([\s\S]*?</div>\s*\);', bottom_part)
        if section_title_match:
            extracted_components += section_title_match.group(0).strip() + "\n\n"
            bottom_part = bottom_part.replace(section_title_match.group(0), "")

        # Find InputRow
        input_row_match = re.search(r'\s*const InputRow = \(\{.*?\}: any\) => \([\s\S]*?</div>\s*\);', bottom_part)
        if input_row_match:
            extracted_components += input_row_match.group(0).strip() + "\n\n"
            bottom_part = bottom_part.replace(input_row_match.group(0), "")

        # Find SelectRow
        select_row_match = re.search(r'\s*const SelectRow = \(\{.*?\}: any\) => \([\s\S]*?</div>\s*\);', bottom_part)
        if select_row_match:
            extracted_components += select_row_match.group(0).strip() + "\n\n"
            bottom_part = bottom_part.replace(select_row_match.group(0), "")

        # There is a generic row in PartyMaster maybe?
        
        content = top_part + extracted_components + 'export default function' + bottom_part

    with open(filepath, 'w') as f:
        f.write(content)

print("Done")
