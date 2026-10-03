import glob

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Look for the Reset button
    # It usually looks like: className='...'>\n                      Reset\n                    </button>
    # Let's just find the exact string ">Reset</button>" or ">\n                      Reset\n                    </button>"
    # Or just find the Reset button by its common class and inject tabIndex={-1}

    # Since it's React, it could be >Reset</button> or >\n  Reset\n</button>
    if '>Reset<' in content.replace(' ', '').replace('\n', ''):
        # We can safely add tabIndex={-1} to the button that has "Reset" inside it.
        # A simple string replace on the Reset button:
        # We look for `<button \n                      onClick={() => setFormData({`
        # Actually it's easier to use a regex to inject tabIndex={-1} into the Reset button.
        pass

import re
for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Find the button that contains 'Reset'
    # Pattern: <button (.*?)>\s*Reset\s*</button>
    # We want to insert tabIndex={-1} before the >
    
    def repl(m):
        attrs = m.group(1)
        if 'tabIndex' not in attrs:
            return f"<button tabIndex={{ -1 }} {attrs}>Reset</button>"
        return m.group(0)

    # Note: re.sub might be tricky if there's nested elements. But Reset button is usually simple.
    # Let's try replacing `>Reset</button>` with `tabIndex={-1}>Reset</button>`?
    # No, we need to add it to the opening tag.
    
    # Let's just look for `className='bg-white border border-slate-200 px-6 py-2 text-slate-600 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-xs'`
    # Because that is the standard reset button class used everywhere.
    
    class_str1 = "className='bg-white border border-slate-200 px-6 py-2 text-slate-600 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-xs'"
    class_str2 = 'className="bg-white border border-slate-200 px-6 py-2 text-slate-600 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-xs"'
    
    if class_str1 in content and 'tabIndex={-1}' not in content:
        content = content.replace(class_str1, f"tabIndex={{ -1 }} {class_str1}")
    elif class_str2 in content and 'tabIndex={-1}' not in content:
        content = content.replace(class_str2, f"tabIndex={{ -1 }} {class_str2}")
        
    with open(filepath, 'w') as f:
        f.write(content)

print("Added tabIndex={-1} to Reset buttons.")
