filepath = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/inventory/SizeMaster.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# Add Size Group column header
content = content.replace('<th className="px-4 py-3">Details</th>', '<th className="px-4 py-3">Details</th>\n                          <th className="px-4 py-3">Size Group</th>')

# Add Size Group column data
content = content.replace('<td className="px-4 py-3 font-semibold text-slate-600">{row.description || \'-\'}</td>', '<td className="px-4 py-3 font-semibold text-slate-600">{row.description || \'-\'}</td>\n                            <td className="px-4 py-3 font-semibold text-slate-600">{row.size_group || \'-\'}</td>')

# Add Size Group input field
old_inputs = """<InputGroup label="Size" id="input-size" nextId="input-sizeName" autoFocus={true} value={formData.size} onChange={(v: string) => setFormData({...formData, size: v})} />
                      <InputGroup label="Size Name" id="input-sizeName" nextId="btn-save" value={formData.sizeName} onChange={(v: string) => setFormData({...formData, sizeName: v})} />"""

new_inputs = """<InputGroup label="Size Name" id="input-sizeName" nextId="input-description" autoFocus={true} value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
                      <InputGroup label="Description" id="input-description" nextId="input-sizeGroup" value={formData.description} onChange={(v: string) => setFormData({...formData, description: v})} />
                      <InputGroup label="Size Group (e.g. Shirts, Pants)" id="input-sizeGroup" nextId="btn-save" value={formData.size_group} onChange={(v: string) => setFormData({...formData, size_group: v})} />"""

content = content.replace(old_inputs, new_inputs)

with open(filepath, 'w') as f:
    f.write(content)
