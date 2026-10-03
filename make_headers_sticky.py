import glob

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

for path in files:
    with open(path, 'r') as f:
        file_content = f.read()
    
    # We look for <thead className='bg-slate-50 border-b border-slate-200'>
    # And replace with <thead className='bg-slate-50 border-b border-slate-200 sticky top-0 z-10'>
    
    # Just to be safe, replace common patterns
    if "thead className='bg-slate-50 border-b border-slate-200'" in file_content:
        file_content = file_content.replace(
            "thead className='bg-slate-50 border-b border-slate-200'",
            "thead className='bg-slate-50 border-b border-slate-200 sticky top-0 z-10'"
        )
    elif 'thead className="bg-slate-50 border-b border-slate-200"' in file_content:
         file_content = file_content.replace(
            'thead className="bg-slate-50 border-b border-slate-200"',
            'thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10"'
        )
        
    with open(path, 'w') as f:
        f.write(file_content)

print("Headers made sticky.")
