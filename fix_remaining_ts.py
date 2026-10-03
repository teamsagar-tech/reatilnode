import re

# 1. CustomerMaster.tsx
cust_path = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/accounting/CustomerMaster.tsx'
with open(cust_path, 'r') as f:
    content = f.read()

match_dummy = re.search(r'(  const sampleData = \[.*?\];\n)', content, re.DOTALL)
if match_dummy:
    dummy_block = match_dummy.group(1)
    content = content.replace(dummy_block, '')
    insert_point = 'const [selectedIndex, setSelectedIndex] = useState(0);\n'
    content = content.replace(insert_point, insert_point + dummy_block + '\n')
    with open(cust_path, 'w') as f:
        f.write(content)

# 2. ItemMaster.tsx
item_path = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/inventory/ItemMaster.tsx'
with open(item_path, 'r') as f:
    content = f.read()

match_dummy = re.search(r'(  const sampleData = \[.*?\];\n)', content, re.DOTALL)
if match_dummy:
    dummy_block = match_dummy.group(1)
    content = content.replace(dummy_block, '')
    insert_point = 'const [selectedIndex, setSelectedIndex] = useState(0);\n'
    content = content.replace(insert_point, insert_point + dummy_block + '\n')
    with open(item_path, 'w') as f:
        f.write(content)

# 3. PartyMaster.tsx
party_path = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/accounting/PartyMaster.tsx'
with open(party_path, 'r') as f:
    content = f.read()

# Make formData any type
content = content.replace('const [formData, setFormData] = useState({', 'const [formData, setFormData] = useState<any>({')
with open(party_path, 'w') as f:
    f.write(content)

print("Fixed TS compilation errors.")
