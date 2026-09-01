import os

filepath = '/Users/ratan/Downloads/RetailNodeV2/backend/controllers/categoryController.js'

with open(filepath, 'r') as f:
    content = f.read()

# Replace the create logic
content = content.replace(
    'const { name, parent_id, description } = req.body;',
    'const { name, parent_id, description, hsn_code, tax_percent } = req.body;'
)
content = content.replace(
    "'INSERT INTO Categories (firm_id, name, parent_id, description) VALUES (?, ?, ?, ?)',\n      [req.firm_id, name, parent_id || null, description || null]",
    "'INSERT INTO Categories (firm_id, name, parent_id, description, hsn_code, tax_percent) VALUES (?, ?, ?, ?, ?, ?)',\n      [req.firm_id, name, parent_id || null, description || null, hsn_code || null, tax_percent || null]"
)

# Replace the update logic
content = content.replace(
    "'UPDATE Categories SET name=?, parent_id=?, description=? WHERE id=? AND firm_id=?',\n      [name, parent_id || null, description || null, req.params.id, req.firm_id]",
    "'UPDATE Categories SET name=?, parent_id=?, description=?, hsn_code=?, tax_percent=? WHERE id=? AND firm_id=?',\n      [name, parent_id || null, description || null, hsn_code || null, tax_percent || null, req.params.id, req.firm_id]"
)

with open(filepath, 'w') as f:
    f.write(content)

print("Updated categoryController.js")
