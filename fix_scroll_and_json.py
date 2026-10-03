import glob

# 1. Fix SizeGroupMaster JSON crash
filepath = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/inventory/SizeGroupMaster.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Replace the dangerous JSON.parse
old_json = '{row.sizes ? JSON.parse(row.sizes).join(", ") : "-"}'
new_json = '{row.sizes ? (Array.isArray(row.sizes) ? row.sizes.join(", ") : (typeof row.sizes === "string" ? (row.sizes.startsWith("[") ? JSON.parse(row.sizes).join(", ") : row.sizes) : "-")) : "-"}'
content = content.replace(old_json, new_json)
with open(filepath, 'w') as f:
    f.write(content)

# 2. Fix scrollbars on all tables
base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

for path in files:
    with open(path, 'r') as f:
        file_content = f.read()
    
    # We look for the div wrapping the table:
    # <div className="border border-slate-200 rounded-xl overflow-hidden flex-1">
    # And change it to overflow-y-auto custom-scrollbar
    
    if '<div className="border border-slate-200 rounded-xl overflow-hidden flex-1">' in file_content:
        file_content = file_content.replace(
            '<div className="border border-slate-200 rounded-xl overflow-hidden flex-1">',
            '<div className="border border-slate-200 rounded-xl overflow-y-auto custom-scrollbar flex-1">'
        )
        with open(path, 'w') as f:
            f.write(file_content)

print("Fixed SizeGroupMaster JSON and added scrollbars.")
