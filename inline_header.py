import os
import glob
import re

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Pattern to match the existing block:
    # <div className="flex items-end gap-3 mb-6">
    #   <h1 ...>{mode === 'list' ? '...' : '...'}</h1>
    #   <span ...>|</span>
    #   <p ...>...</p>
    # </div>
    # {mode === 'list' ? (
    #   <>
    #     <div className='flex justify-between items-center mb-4'>
    #       <div className="relative w-full max-w-sm group">
    #         <Search ... />
    #         <input ... />
    #       </div>
    #       <button ...>
    #         Create New (Alt+C)
    #       </button>
    #     </div>
    
    # We will build a regex to capture the h1, span, p, Search, input, button elements exactly
    
    # Let's write a python script to just find this exact block of code and replace it with the new layout
    
    # Search regex
    match = re.search(r'<div className="flex items-end gap-3 mb-6">(.*?</div>)\s*\{mode === \'list\' \? \(\s*<>\s*<div className=\'flex justify-between items-center mb-4\'>(.*?)</div>', content, flags=re.DOTALL)
    if not match:
        continue
        
    title_block = match.group(1).strip()
    search_button_block = match.group(2).strip()
    
    # title block contains h1, span, p
    # search_button_block contains <div className="relative..."><Search.../><input.../></div> <button...>...</button>
    
    new_block = f"""<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-end gap-3 shrink-0">
                  {title_block}
                </div>
                
                {{mode === 'list' && (
                  <div className='flex items-center gap-4 flex-1 justify-end'>
                    {search_button_block}
                  </div>
                )}}
              </div>
              
              {{mode === 'list' ? (
                <>"""
    
    # Replace the old string with the new string
    old_str = f'<div className="flex items-end gap-3 mb-6">\n                {title_block}\n              </div>\n              {{mode === \'list\' ? (\n                <>\n                  <div className=\'flex justify-between items-center mb-4\'>\n                    {search_button_block}\n                  </div>'
    
    # A more robust replace using the original matched substring
    full_match_str = match.group(0)
    new_content = content.replace(full_match_str, new_block)
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Inlined header for {os.path.basename(filepath)}")

