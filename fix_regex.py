import os
import glob
import re

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

broken_files = [
    'PartyMaster.tsx',
    'TransporterMaster.tsx',
    'BrandMaster.tsx',
    'CategoryMaster.tsx',
    'ItemMaster.tsx'
]

for filepath in files:
    filename = os.path.basename(filepath)
    if filename not in broken_files:
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()

    # The broken structure looks like:
    # <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
    #   <div className="flex items-end gap-3 shrink-0">
    #     ... (title, span, p) ...
    #   </div>
    # </div>
    # {mode === 'list' && (
    #   <div className='flex items-center gap-4 flex-1 justify-end'>
    #     <div className="relative w-full max-w-sm group">
    #       ... (search input) ...
    #     </div>
    # )}
    # </div>
    # {mode === 'list' ? (
    #   <>
    #     <button ...>...</button>
    #   </div>
    
    # We will use regex to capture the parts and rewrite the block correctly.
    
    # Capture Title Block
    title_match = re.search(r'<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">\s*<div className="flex items-end gap-3 shrink-0">(.*?)</div>\s*</div>', content, flags=re.DOTALL)
    
    # Capture Search Block
    search_match = re.search(r"\{mode === 'list' && \(\s*<div className='flex items-center gap-4 flex-1 justify-end'>\s*<div className=\"relative w-full max-w-sm group\">(.*?)</div>\s*\)\}\s*</div>", content, flags=re.DOTALL)
    
    # Capture Button Block
    button_match = re.search(r"\{mode === 'list' \? \(\s*<>\s*(<button.*?</button>)\s*</div>", content, flags=re.DOTALL)
    
    if title_match and search_match and button_match:
        title_block = title_match.group(1).strip()
        search_block = search_match.group(1).strip()
        button_block = button_match.group(1).strip()
        
        # Now construct the correct block
        correct_block = f"""<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-end gap-3 shrink-0">
                  {title_block}
                </div>
                
                {{mode === 'list' && (
                  <div className='flex items-center gap-4 flex-1 justify-end'>
                    <div className="relative w-full max-w-sm group">
                      {search_block}
                    </div>
                    {button_block}
                  </div>
                )}}
              </div>
              
              {{mode === 'list' ? (
                <>"""
                
        # Find the full match to replace
        # We replace from the start of the title block to the start of the table block
        # Because we used three separate regexes, let's just find the exact text using string slices or a massive regex
        
        full_match = re.search(r'<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">.*?\{mode === \'list\' \? \(\s*<>\s*<button.*?</button>\s*</div>', content, flags=re.DOTALL)
        
        if full_match:
            new_content = content.replace(full_match.group(0), correct_block)
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Fixed broken regex in {filename}")
        else:
            print(f"Could not find full match in {filename}")
    else:
        print(f"Could not find all parts in {filename}")

