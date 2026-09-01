import os

filepath = '/Users/ratan/Downloads/RetailNodeV2/backend/controllers/genericMasterController.js'

with open(filepath, 'r') as f:
    content = f.read()

# Replace the create logic
content = content.replace(
    'const { name, description, is_active } = req.body;',
    'const { name, description, is_active, hsn_code, tax_percent } = req.body;'
)
content = content.replace(
    "'INSERT INTO ${tableName} (firm_id, name, description, is_active) VALUES (?, ?, ?, ?)',\n      [req.firm_id, name, description || null, is_active !== undefined ? is_active : true]",
    "'INSERT INTO ${tableName} (firm_id, name, description, is_active' + ((tableName === 'SubCategories' || tableName === 'HSNSACs') ? ', hsn_code, tax_percent' : '') + ') VALUES (?, ?, ?, ?' + ((tableName === 'SubCategories' || tableName === 'HSNSACs') ? ', ?, ?' : '') + ')',\n      ((tableName === 'SubCategories' || tableName === 'HSNSACs') ? [req.firm_id, name, description || null, is_active !== undefined ? is_active : true, hsn_code || null, tax_percent || null] : [req.firm_id, name, description || null, is_active !== undefined ? is_active : true])"
)

# Replace the update logic
content = content.replace(
    "'UPDATE ${tableName} SET name=?, description=?, is_active=? WHERE id=? AND firm_id=?',\n      [name, description || null, is_active !== undefined ? is_active : true, req.params.id, req.firm_id]",
    "'UPDATE ${tableName} SET name=?, description=?, is_active=?' + ((tableName === 'SubCategories' || tableName === 'HSNSACs') ? ', hsn_code=?, tax_percent=?' : '') + ' WHERE id=? AND firm_id=?',\n      ((tableName === 'SubCategories' || tableName === 'HSNSACs') ? [name, description || null, is_active !== undefined ? is_active : true, hsn_code || null, tax_percent || null, req.params.id, req.firm_id] : [name, description || null, is_active !== undefined ? is_active : true, req.params.id, req.firm_id])"
)

with open(filepath, 'w') as f:
    f.write(content)

print("Updated genericMasterController.js")
