import os
import glob
import re

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We want to find the header div and replace it
    # Pattern to match:
    # <div>
    #   <h1 className="text-2xl font-black text-slate-800 tracking-tight">...</h1>
    #   <p className="text-sm font-medium text-slate-500">...</p>
    # </div>
    
    # Let's replace the first <div> inside the top header with a flex container
    # The header is immediately after {/* Top Header */} and <div className="flex items-center justify-between mb-4">
    
    # A safe replacement:
    new_content = content.replace(
        '<div>\n            <h1 className="text-2xl font-black',
        '<div className="flex items-end gap-3">\n            <h1 className="text-2xl font-black'
    )
    
    # We also need to add the separator if we want, or just let them sit next to each other
    new_content = new_content.replace(
        '</h1>\n            <p className="text-sm font-medium',
        '</h1>\n            <span className="text-slate-300 font-light mb-1">|</span>\n            <p className="text-sm font-medium'
    )
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed header layout in {os.path.basename(filepath)}")

