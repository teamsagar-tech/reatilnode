import os

filepath = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/masters/inventory/SubCategoryMaster.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# Update handleSaveSubCategory JSON stringify payload
content = content.replace(
    'body: JSON.stringify({ name: formData.name, description: formData.description, parent_id: formData.parent_id })',
    'body: JSON.stringify({ name: formData.name, description: formData.description, parent_id: formData.parent_id, hsn_code: formData.hsn_code, tax_percent: parseFloat(formData.tax_percent) || 0 })'
)

# Update row onClick payload
content = content.replace(
    """                            setFormData({
                                name: row.name,
                                description: row.description || '',
                                parent_id: row.parent_id || ''
                              });""",
    """                            setFormData({
                                name: row.name,
                                description: row.description || '',
                                parent_id: row.parent_id || '',
                                hsn_code: row.hsn_code || '',
                                tax_percent: row.tax_percent || ''
                              });"""
)

# Update row Enter payload
content = content.replace(
    """            setFormData({
              name: row.name,
              description: row.description || '',
              parent_id: row.parent_id || ''
            });""",
    """            setFormData({
              name: row.name,
              description: row.description || '',
              parent_id: row.parent_id || '',
              hsn_code: row.hsn_code || '',
              tax_percent: row.tax_percent || ''
            });"""
)

# Insert the input rows
content = content.replace(
    """                    <SelectRow id="input-parent_id" label="Parent Category" value={formData.parent_id} onChange={(v: string) => setFormData({...formData, parent_id: v})} options={categories} />
                    <InputRow label="Description" value={formData.description} onChange={(v: string) => setFormData({...formData, description: v})} />""",
    """                    <SelectRow id="input-parent_id" label="Parent Category" value={formData.parent_id} onChange={(v: string) => setFormData({...formData, parent_id: v})} options={categories} />
                    <InputRow label="Description" value={formData.description} onChange={(v: string) => setFormData({...formData, description: v})} />
                    <InputRow label="Default HSN Code" value={formData.hsn_code} onChange={(v: string) => setFormData({...formData, hsn_code: v})} />
                    <InputRow type="number" label="Default Tax %" value={formData.tax_percent} onChange={(v: string) => setFormData({...formData, tax_percent: v})} />"""
)

with open(filepath, 'w') as f:
    f.write(content)

print("Updated SubCategoryMaster.tsx")
