import os
import glob
import re

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Extract the header block
    # It starts with {/* Top Header */} and ends with </div> just before <div className='flex flex-1 gap-4 overflow-hidden'>
    
    match = re.search(r'\{\/\* Top Header \*\/\}\s*<div className="flex items-center justify-between mb-4">\s*<div className="flex items-end gap-3">(.*?)</div>\s*</div>', content, flags=re.DOTALL)
    if not match:
        continue
    
    header_content = match.group(1).strip()
    
    # We want to remove the top header completely
    new_content = re.sub(r'\{\/\* Top Header \*\/\}\s*<div className="flex items-center justify-between mb-4">\s*<div className="flex items-end gap-3">.*?</div>\s*</div>', '', content, flags=re.DOTALL)
    
    # Now we need to insert the header inside the inner card.
    # We will put it right at the top of: <div className='p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col'>
    
    # Wait, the user specifically said "move before searchbar".
    # In list mode, the search bar is here: <div className='flex justify-between items-center mb-4'>
    # We should replace that flex container to hold the title AND the search bar AND the button.
    
    # Let's insert the title right before the search bar in the 'list' mode:
    # From:
    # <div className='flex justify-between items-center mb-4'>
    #   <div className="relative w-full max-w-sm group">
    
    # To:
    # <div className='flex justify-between items-center mb-6'>
    #   <div className="flex items-end gap-3">
    #     {header_content_for_list}
    #   </div>
    #   <div className="flex items-center gap-4">
    #     <div className="relative w-full max-w-sm group">
    
    # What about 'create' mode? We need the title there too.
    # In create mode, it starts with <div className='flex flex-col h-full overflow-hidden'>
    # We can just put a header at the top of the p-4 container before the {mode === 'list'} check!
    
    # Yes! Let's insert it right after <div className='p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col'>
    # <div className="flex items-end gap-3 mb-6">
    #   {header_content}
    # </div>
    
    insertion_str = f"""
              <div className="flex items-end gap-3 mb-6">
                {header_content}
              </div>
"""
    
    new_content = new_content.replace("<div className='p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col'>", "<div className='p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col'>" + insertion_str)
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Moved header in {os.path.basename(filepath)}")

