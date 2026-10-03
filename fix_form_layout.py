import os
import glob
import re

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

new_component = """const InputGroup = ({ label, id, value, onChange, nextId, width = 'w-full', type = 'text', placeholder = '', autoFocus = false }: any) => (
    <div className="flex flex-col gap-1.5 mb-5 group">
      <label htmlFor={id} className="text-xs font-bold text-slate-600 uppercase tracking-wider group-focus-within:text-indigo-600 transition-colors">{label}</label>
      <input 
        id={id}
        autoFocus={autoFocus}
        type={type} 
        className={`bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-800 rounded-lg shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all hover:border-slate-300 ${width}`}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if(nextId && handleFieldKeyDown) handleFieldKeyDown(e, nextId) }}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
    </div>
  );"""

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Find the old InputRow definition
    # It starts with `const InputRow = ({ label` and ends with `  );`
    row_pattern = r'const InputRow = \(\{.*?\).*?\(\s*<div className="flex items-center mb-1\.5.*?\</div>\s*</div>\s*\);'
    
    # Alternatively, just a rough multi-line replace
    match = re.search(r'const InputRow = \(\{.*?=> \(\s*<div.*?</div>\s*</div>\s*\);', content, flags=re.DOTALL)
    
    if match:
        new_content = content.replace(match.group(0), new_component)
        # Rename usages
        new_content = new_content.replace('<InputRow', '<InputGroup')
        
        # Also change the grid layout to a real modern grid instead of stacked blocks
        # Let's replace the column container wrapping the inputs:
        # <div className="flex-1 flex flex-col gap-1 overflow-y-auto pb-4 custom-scrollbar">
        new_content = new_content.replace(
            '<div className="flex-1 flex flex-col gap-1 overflow-y-auto pb-4 custom-scrollbar">',
            '<div className="flex-1 overflow-y-auto pb-4 custom-scrollbar pr-2">\n                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">'
        )
        
        # But wait, SectionTitle shouldn't be inside the grid!
        # This is too complex for string replace on grid. I will just stick to changing the InputRow to InputGroup.
        
        # Revert the grid change attempt
        new_content = new_content.replace(
            '<div className="flex-1 overflow-y-auto pb-4 custom-scrollbar pr-2">\n                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">',
            '<div className="flex-1 flex flex-col gap-1 overflow-y-auto pb-4 custom-scrollbar">'
        )
        
        if content != new_content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Modernized form in {os.path.basename(filepath)}")

