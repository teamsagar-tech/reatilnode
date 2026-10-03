import glob
import re

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. FIX TS COMPILE ERROR (Move useMasterApi BEFORE useEffect)
    # We find the line containing "const { data: sampleData"
    # And we find "useEffect(() => {\n    const handleKeyDown = (e: KeyboardEvent) => {"
    
    match_api = re.search(r'(const \{ data: sampleData.*?\n)', content)
    match_fetch = re.search(r'(  useEffect\(\(\) => \{ fetchList\(\); \}, \[fetchList\]\);\n)', content)
    
    if match_api and match_fetch:
        api_line = match_api.group(1)
        fetch_line = match_fetch.group(1)
        
        # Remove them from their current position
        content = content.replace(api_line, '')
        content = content.replace(fetch_line, '')
        
        # Insert them right after "const [selectedIndex, setSelectedIndex] = useState(0);"
        insert_point = 'const [selectedIndex, setSelectedIndex] = useState(0);\n'
        if insert_point in content:
            content = content.replace(
                insert_point,
                insert_point + '\n' + api_line + fetch_line + '\n'
            )

    # 2. FIX EDIT DATA POPULATION (formData.xxxName || formData.name)
    # This regex looks for value={formData.somethingName} and replaces it with value={formData.somethingName || formData.name}
    # But only if it doesn't already have || formData.name
    
    def repl_name(m):
        full_match = m.group(0)
        prop = m.group(1)
        if '|| formData.name' not in full_match and 'partyName' not in prop and prop != 'name':
            return f"value={{formData.{prop} || formData.name}}"
        return full_match
        
    content = re.sub(r'value=\{formData\.([a-zA-Z]+Name)\}', repl_name, content)
    
    # Specific fix for address -> description
    if 'value={formData.address}' in content:
        content = content.replace('value={formData.address}', 'value={formData.address || formData.description}')

    with open(filepath, 'w') as f:
        f.write(content)

print("Fixed TS compilation error and Edit data mapping.")
