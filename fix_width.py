import os
import glob
import re

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We want to find the main container. In our recent templates it is:
    # className='flex flex-col h-[calc(100vh-6rem)] font-sans selection:bg-indigo-100 w-full max-w-[1400px] mx-auto'
    
    # We will just replace 'max-w-[1400px] mx-auto' with 'px-2'
    new_content = content.replace('max-w-[1400px] mx-auto', 'px-2')
    new_content = new_content.replace('max-w-6xl mx-auto', 'px-2 w-full')
    new_content = new_content.replace('max-w-7xl mx-auto', 'px-2 w-full')
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed width in {os.path.basename(filepath)}")

