import os
import re

files_to_fix = [
    'CategoryMaster.tsx',
    'SubCategoryMaster.tsx',
    'DepartmentMaster.tsx',
    'SectionMaster.tsx',
    'StyleMaster.tsx'
]

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/masters/inventory'

for filename in files_to_fix:
    filepath = os.path.join(base_dir, filename)
    with open(filepath, 'r') as f:
        content = f.read()

    # Find SectionTitle definition
    section_title_match = re.search(r'(\s+const SectionTitle = \(\{ children \}: \{ children: React\.ReactNode \}\) => \(\s*<div className="font-bold text-\[\#1b5e58\] text-\[12px\] border-b border-\[\#a3c3be\] mb-2 mt-2 pb-1 uppercase tracking-wider bg-\[\#eef5ed\] px-1">\s*\{children\}\s*</div>\s*\);\n)', content)
    
    # Find InputRow definition
    input_row_match = re.search(r'(\s+const InputRow = \(\{ id, label, value, onChange, width = \'flex-1\', type = \'text\', placeholder = \'\' \}: any\) => \(\s*<div className="flex items-center mb-\[2px\]">\s*<div className="w-\[110px\] text-slate-800 font-bold text-\[11px\] text-right pr-2 leading-tight">\s*\{label\}\s*</div>\s*<input \s*id=\{id\}\s*type=\{type\} \s*className=\{`bg-white border border-slate-400 px-1 py-\[2px\] text-\[12px\] font-bold text-black focus:bg-\[\#ffffe0\] focus:outline-none focus:border-slate-800 \$\{width\}`\}\s*value=\{value \|\| \'\'\}\s*onChange=\{e => onChange\(e\.target\.value\)\}\s*placeholder=\{placeholder\}\s*/>\s*</div>\s*\);\n)', content)
    
    # Find SelectRow definition (if exists)
    select_row_match = re.search(r'(\s+const SelectRow = \(\{ id, label, value, onChange, options, width = \'flex-1\' \}: any\) => \(\s*<div className="flex items-center mb-\[2px\]">\s*<div className="w-\[110px\] text-slate-800 font-bold text-\[11px\] text-right pr-2 leading-tight">\s*\{label\}\s*</div>\s*<select \s*id=\{id\}\s*className=\{`bg-white border border-slate-400 px-1 py-\[2px\] text-\[12px\] font-bold text-black focus:bg-\[\#ffffe0\] focus:outline-none focus:border-slate-800 \$\{width\}`\}\s*value=\{value \|\| \'\'\}\s*onChange=\{e => onChange\(e\.target\.value\)\}\s*>\s*<option value="">Select Parent Category</option>\s*\{options\.map\(\(opt: any\) => \(\s*<option key=\{opt\.id\} value=\{opt\.id\}>\{opt\.name\}</option>\s*\)\)\}\s*</select>\s*</div>\s*\);\n)', content)

    components_str = "\n"
    if section_title_match:
        components_str += section_title_match.group(1).strip() + "\n\n"
        content = content.replace(section_title_match.group(1), "")
    if input_row_match:
        components_str += input_row_match.group(1).strip() + "\n\n"
        content = content.replace(input_row_match.group(1), "")
    if select_row_match:
        components_str += select_row_match.group(1).strip() + "\n\n"
        content = content.replace(select_row_match.group(1), "")

    if components_str != "\n":
        content = content.replace('export default function', components_str + 'export default function')

    with open(filepath, 'w') as f:
        f.write(content)

print("Done")
