import os
import glob
import re

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove the entire <div className="flex gap-2"> ... </div> block containing <kbd> tags
    # Since regex with multiline can be tricky, I will use a regex that matches the block exactly
    new_content = re.sub(r'<div className="flex gap-2">\s*<kbd.*?</kbd>\s*\{mode === \'list\'.*?</kbd>\s*\)\s*\}\s*</div>', '', content, flags=re.DOTALL)
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Removed keyboard icons from {os.path.basename(filepath)}")

