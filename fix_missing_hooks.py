import re

def fix_file(filepath, api_path):
    with open(filepath, 'r') as f:
        content = f.read()

    # Add import if missing
    if 'useMasterApi' not in content:
        content = content.replace("import { Search } from 'lucide-react';", "import { Search } from 'lucide-react';\nimport { useMasterApi } from '../../../hooks/useMasterApi';")
        # Just in case Search isn't there
        if 'useMasterApi' not in content:
            content = content.replace("import { Helmet }", "import { useMasterApi } from '../../../hooks/useMasterApi';\nimport { Helmet }")

    # Add the hook
    if 'const { data: sampleData' not in content:
        insert_point = 'const [selectedIndex, setSelectedIndex] = useState(0);\n'
        hook_code = f"  const {{ data: sampleData, fetchList, saveRecord }} = useMasterApi('{api_path}');\n  useEffect(() => {{ fetchList(); }}, [fetchList]);\n"
        content = content.replace(insert_point, insert_point + hook_code)

    # Make formData any
    content = content.replace('const [formData, setFormData] = useState({', 'const [formData, setFormData] = useState<any>({')
    
    # Save buttons
    save_button_old = "alert('Saved Successfully!');\n                        setMode('list');"
    save_button_new = "const res = await saveRecord(formData);\n                        if(res.success) { setFormData({}); setMode('list'); }"
    content = content.replace(save_button_old, save_button_new)
    
    # Check save shortcut
    shortcut_old = "alert('Saved Successfully!');\n        setMode('list');"
    shortcut_new = "saveRecord(formData).then(r => { if(r.success) { setFormData({}); setMode('list'); } });"
    content = content.replace(shortcut_old, shortcut_new)

    with open(filepath, 'w') as f:
        f.write(content)

fix_file('/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/inventory/ItemMaster.tsx', 'masters/item')
fix_file('/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/accounting/CustomerMaster.tsx', 'masters/customer')

print("Fixed missing useMasterApi hooks in ItemMaster and CustomerMaster.")
