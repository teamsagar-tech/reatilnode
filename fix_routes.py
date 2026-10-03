import os
import glob
import re

# We will just replace useMasterApi('old_wrong_route') with useMasterApi('correct_route')
route_map = {
    'BrandMaster.tsx': ('brands', 'masters/brand'),
    'CategoryMaster.tsx': ('categories', 'masters/category'),
    'ColorMaster.tsx': ('masters/colors', 'masters/generic/colors'),
    'DepartmentMaster.tsx': ('masters/departments', 'masters/generic/departments'),
    'DesignMaster.tsx': ('masters/designs', 'masters/generic/designs'),
    'LocationMaster.tsx': ('masters/locations', 'masters/generic/locations'),
    'MaterialMaster.tsx': ('masters/materials', 'masters/generic/materials'),
    'SectionMaster.tsx': ('masters/sections', 'masters/generic/sections'),
    'SizeMaster.tsx': ('masters/sizes', 'masters/generic/sizes'),
    'StyleMaster.tsx': ('masters/styles', 'masters/generic/styles'),
    'SubCategoryMaster.tsx': ('masters/subcategories', 'masters/generic/subcategories'),
    'SubStyleMaster.tsx': ('masters/substyles', 'masters/generic/substyles'),
    'ChargesTypeMaster.tsx': ('masters/chargestypes', 'masters/generic/chargestypes'),
    'CommissionMaster.tsx': ('masters/commissions', 'masters/generic/commissions'),
    'HundekariMaster.tsx': ('masters/hundekaris', 'masters/generic/hundekaris'),
    'ItemPercentageMaster.tsx': ('masters/itempercentages', 'masters/generic/itempercentages'),
    'TransporterMaster.tsx': ('masters/transporters', 'masters/generic/transporters'),
    'HSNSACMaster.tsx': ('masters/hsnsacs', 'masters/generic/hsnsacs'),
    'SizeGroupMaster.tsx': ('masters/sizesets', 'masters/size-groups')
}

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

for filepath in files:
    filename = os.path.basename(filepath)
    if filename not in route_map:
        continue
        
    old_route, new_route = route_map[filename]
    
    with open(filepath, 'r') as f:
        content = f.read()
        
    # Replace useMasterApi('old_route')
    pattern = f"useMasterApi\\('{old_route}'\\)"
    replacement = f"useMasterApi('{new_route}')"
    
    # Also if somehow they were already changed
    if replacement not in content:
        content = re.sub(pattern, replacement, content)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed {filename} to use {new_route}")

