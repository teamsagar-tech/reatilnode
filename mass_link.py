import os
import glob
import re

# 1. Overwrite useMasterApi.ts
api_hook = """import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

export function useMasterApi(urlPath: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchList = useCallback(async (searchQuery = '') => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/${urlPath}`;
      if (searchQuery) url += `?search=${encodeURIComponent(searchQuery)}`;
      
      const res = await fetch(url, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error(`Failed to fetch ${urlPath}:`, error);
    } finally {
      setLoading(false);
    }
  }, [urlPath]);

  const saveRecord = async (payload: any, id?: string | number) => {
    try {
      // Auto-map legacy frontend keys to backend 'name' schema
      const finalPayload = { ...payload };
      if (!finalPayload.name) {
        const nameKey = Object.keys(finalPayload).find(k => k.toLowerCase().endsWith('name'));
        if (nameKey) finalPayload.name = finalPayload[nameKey];
        // fallback if no nameKey found but there's a title or something
        if (!finalPayload.name && Object.keys(finalPayload).length > 0) {
            finalPayload.name = finalPayload[Object.keys(finalPayload)[0]];
        }
      }

      const url = id 
        ? `${API_URL}/api/${urlPath}/${id}`
        : `${API_URL}/api/${urlPath}`;
      
      const res = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(finalPayload)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
      
      await fetchList();
      return { success: true };
    } catch (error: any) {
      alert(error.message || 'Error saving record');
      return { success: false, error };
    }
  };

  return { data, loading, fetchList, saveRecord };
}
"""
with open('/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/hooks/useMasterApi.ts', 'w') as f:
    f.write(api_hook)

# 2. Patch all master files
base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

# Map filenames to backend routes
route_map = {
    'BrandMaster.tsx': 'brands',
    'CategoryMaster.tsx': 'categories',
    'ColorMaster.tsx': 'masters/colors',
    'DepartmentMaster.tsx': 'masters/departments',
    'DesignMaster.tsx': 'masters/designs',
    'LocationMaster.tsx': 'masters/locations',
    'MaterialMaster.tsx': 'masters/materials',
    'SectionMaster.tsx': 'masters/sections',
    'SizeMaster.tsx': 'masters/sizes',
    'StyleMaster.tsx': 'masters/styles',
    'SubCategoryMaster.tsx': 'masters/subcategories',
    'SubStyleMaster.tsx': 'masters/substyles',
    'ChargesTypeMaster.tsx': 'masters/chargestypes',
    'CommissionMaster.tsx': 'masters/commissions',
    'HundekariMaster.tsx': 'masters/hundekaris',
    'ItemPercentageMaster.tsx': 'masters/itempercentages',
    'TransporterMaster.tsx': 'masters/transporters',
    'HSNSACMaster.tsx': 'masters/hsnsacs',
    'SizeGroupMaster.tsx': 'masters/sizesets'
}

for filepath in files:
    filename = os.path.basename(filepath)
    if filename not in route_map:
        continue
        
    api_path = route_map[filename]
    
    with open(filepath, 'r') as f:
        content = f.read()
        
    if "useMasterApi" in content:
        continue
        
    # Inject import
    import_statement = "import { useMasterApi } from '../../../hooks/useMasterApi';\n"
    if 'inventory' in filepath:
        import_statement = "import { useMasterApi } from '../../../hooks/useMasterApi';\n"
    
    lines = content.split('\n')
    last_import = 0
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import = i
            
    lines.insert(last_import + 1, import_statement)
    content = '\n'.join(lines)
    
    # Replace dummy data
    # const sampleData = [...]
    sample_data_pattern = r'const sampleData = \[.*?\];'
    
    hook_injection = f"const {{ data: sampleData, fetchList, saveRecord }} = useMasterApi('{api_path}');\n  useEffect(() => {{ fetchList(); }}, [fetchList]);"
    content = re.sub(sample_data_pattern, hook_injection, content, flags=re.DOTALL)
    
    # Replace save button click
    # onClick={() => { alert('Saved Successfully!'); setMode('list'); }}
    # OR onClick={() => { alert('Saved Successfully!'); setMode('list'); }} (might have formatting)
    save_pattern = r"onClick=\{\(\) => \{\s*alert\('Saved Successfully!'\);\s*setMode\('list'\);\s*\}\}"
    new_save = "onClick={async () => { const res = await saveRecord(formData); if(res.success) { setFormData({}); setMode('list'); } }}"
    content = re.sub(save_pattern, new_save, content)
    
    # Replace table mapping keys for generic rendering
    # { id: 1, name: 'Sample 1', details: '100', status: 'Active' },
    # Our data will have { id, name, description, is_active }
    # So we should update row rendering.
    # row.name -> row.name, row.details -> row.description, row.status -> row.is_active ? 'Active' : 'Inactive'
    content = content.replace("row.details", "row.description || '-'")
    content = content.replace("row.status === 'Active'", "row.is_active")
    content = content.replace("{row.status}", "{row.is_active ? 'Active' : 'Inactive'}")

    # Fix the handleFieldKeyDown missing error if it was injected with alert
    enter_save_pattern = r"alert\('Saved Successfully!'\);\s*setMode\('list'\);"
    content = re.sub(enter_save_pattern, "saveRecord(formData).then(r => { if(r.success) { setFormData({}); setMode('list'); } });", content)

    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Wired up {filename}")

