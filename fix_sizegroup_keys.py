filepath = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/inventory/SizeGroupMaster.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# Fix table rendering
content = content.replace('{row.name}', '{row.group_name}')
content = content.replace('{row.size_scale || \'-\'}', '{row.sizes ? JSON.parse(row.sizes).join(", ") : "-"}')

# Fix inputs
content = content.replace('formData.name', 'formData.groupName')
content = content.replace('name: v', 'groupName: v')
content = content.replace('formData.size_scale', 'formData.sizes')
content = content.replace('size_scale: v', 'sizes: v.split(",").map((s: string) => s.trim())')

with open(filepath, 'w') as f:
    f.write(content)
