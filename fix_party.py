import re
filepath = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/accounting/PartyMaster.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# 1. Add import if not exists
if 'useMasterApi' not in content:
    content = content.replace("import { Search } from 'lucide-react';", "import { Search } from 'lucide-react';\nimport { useMasterApi } from '../../../hooks/useMasterApi';")

# 2. Add API hooks and remove dummy sampleData
dummy_data_block = """  const sampleData = [
    { id: 1, name: 'Ramesh Enterprises', gstin: '27AADCB2230M1Z2', state: 'Maharashtra', balance: '1,50,000 Dr' },
    { id: 2, name: 'Gupta Traders', gstin: '24BBXPT1122K1Z9', state: 'Gujarat', balance: '45,000 Cr' },
    { id: 3, name: 'Fashion Hub', gstin: '07CCAPT9988L1Z1', state: 'Delhi', balance: '0' },
  ];"""

api_hooks = """  const { data: sampleData, fetchList, saveRecord } = useMasterApi('masters/party');
  useEffect(() => { fetchList(); }, [fetchList]);"""

content = content.replace(dummy_data_block, api_hooks)

# 3. Update table rendering for party_name instead of name
content = content.replace('{row.name}', '{row.party_name}')
content = content.replace('{row.balance}', '{row.balance || "0"}')

# 4. Connect Save buttons and Keyboard Shortcut Ctrl+A
save_button_old = """onClick={() => {
                        alert('Party Saved Successfully!');
                        setMode('list');
                      }}"""
save_button_new = """onClick={async () => {
                        const payload = { ...formData, categories };
                        const res = await saveRecord(payload);
                        if (res.success) {
                           setMode('list');
                        }
                      }}"""
content = content.replace(save_button_old, save_button_new)

shortcut_old = """alert('Party Saved Successfully!');
        setMode('list');"""
shortcut_new = """saveRecord({ ...formData, categories }).then(r => { if(r.success) setMode('list'); });"""
content = content.replace(shortcut_old, shortcut_new)

with open(filepath, 'w') as f:
    f.write(content)

