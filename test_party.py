import re
filepath = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/accounting/PartyMaster.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Add selectedIndex
if 'const [selectedIndex, setSelectedIndex] = useState(0);' not in content:
    content = content.replace(
        "const [searchQuery, setSearchQuery] = useState('');",
        "const [searchQuery, setSearchQuery] = useState('');\n  const [selectedIndex, setSelectedIndex] = useState(0);"
    )

# Add keyboard navigation
kb_old = """      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC') && mode === 'list') {"""
kb_new = """      } else if (mode === 'list' && e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(s => Math.min(s + 1, (sampleData?.length || 1) - 1));
      } else if (mode === 'list' && e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(s => Math.max(s - 1, 0));
      } else if (mode === 'list' && e.key === 'Enter') {
        e.preventDefault();
        if (sampleData && sampleData[selectedIndex]) {
          setFormData(sampleData[selectedIndex]);
          setMode('create');
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC') && mode === 'list') {"""
if "e.key === 'ArrowDown'" not in content:
    content = content.replace(kb_old, kb_new)

# Update map signature
content = content.replace('sampleData.map((row) => (', 'sampleData.map((row, index) => (')

# Update tr attributes
tr_old = "className='text-xs bg-white hover:bg-indigo-50/30 cursor-pointer transition-colors group'"
tr_new = "onDoubleClick={() => { setFormData(row); setMode('create'); }}\n                            className={`text-xs cursor-pointer transition-colors group ${selectedIndex === index ? 'bg-amber-50/60 border-l-[3px] border-amber-400' : 'bg-white hover:bg-slate-50'}`}"
if 'onDoubleClick' not in content:
    content = content.replace(tr_old, tr_new)

with open(filepath, 'w') as f:
    f.write(content)
