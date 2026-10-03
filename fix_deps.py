import glob

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # The useEffect dependency array is either [navigate, mode] or [navigate, mode, ...]
    if '}, [navigate, mode]);' in content:
        content = content.replace('}, [navigate, mode]);', '}, [navigate, mode, sampleData, selectedIndex]);')
    elif '}, [navigate, mode, sampleData]);' in content:
        content = content.replace('}, [navigate, mode, sampleData]);', '}, [navigate, mode, sampleData, selectedIndex]);')

    with open(filepath, 'w') as f:
        f.write(content)

print("Fixed useEffect dependencies globally.")
