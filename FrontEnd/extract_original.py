import json
import os

files_to_restore = [
    'BrandMaster.tsx',
    'CategoryMaster.tsx',
    'ItemMaster.tsx',
    'PartyMaster.tsx'
]

transcript_files = [
    '/Users/ratan/.gemini/antigravity-ide/brain/0f64484a-a0b6-4f7e-a32d-f703e68df95f/.system_generated/logs/transcript_full.jsonl',
    '/Users/ratan/.gemini/antigravity-ide/brain/288226f2-dde0-4049-b945-71973cdb9893/.system_generated/logs/transcript_full.jsonl'
]

originals = {}

for tf in transcript_files:
    if not os.path.exists(tf): continue
    with open(tf, 'r') as f:
        for line in f:
            try:
                data = json.loads(line)
                if 'tool_calls' in data:
                    for call in data['tool_calls']:
                        if call.get('name') == 'default_api:replace_file_content':
                            args = call.get('arguments', {})
                            target = args.get('TargetFile', '')
                            for base in files_to_restore:
                                if target.endswith(base):
                                    if base not in originals:
                                        originals[base] = args.get('TargetContent', '')
                                        print(f"Found original for {base}")
            except Exception as e:
                pass

for base, content in originals.items():
    if content:
        with open(f"/tmp/original_{base}", "w") as f:
            f.write(content)
