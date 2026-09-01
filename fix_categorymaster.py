import os

filepath = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/masters/inventory/CategoryMaster.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# Update handleSaveCategory JSON stringify payload
content = content.replace(
    'body: JSON.stringify({ name: formData.name, description: formData.description })',
    'body: JSON.stringify({ name: formData.name, description: formData.description, hsn_code: formData.hsn_code, tax_percent: parseFloat(formData.tax_percent) || 0 })'
)

# Update row onClick payload
content = content.replace(
    """                            setFormData({
                                name: row.name,
                                description: row.description || ''
                              });""",
    """                            setFormData({
                                name: row.name,
                                description: row.description || '',
                                hsn_code: row.hsn_code || '',
                                tax_percent: row.tax_percent || ''
                              });"""
)

# Update row Enter payload
content = content.replace(
    """            setFormData({
              name: row.name,
              description: row.description || ''
            });""",
    """            setFormData({
              name: row.name,
              description: row.description || '',
              hsn_code: row.hsn_code || '',
              tax_percent: row.tax_percent || ''
            });"""
)

with open(filepath, 'w') as f:
    f.write(content)

print("Updated CategoryMaster.tsx")
