import os
import re

masters_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/masters'

for root, _, files in os.walk(masters_dir):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            modified = False

            # Add id="btn-save" to the Save button if not present
            if 'id="btn-save"' not in content and 'Save (Ctrl+A)' in content:
                # regex to find the button containing Save (Ctrl+A)
                content = re.sub(r'<button([^>]*)>\s*Save \(Ctrl\+A\)\s*</button>', r'<button id="btn-save"\1>\n                      Save (Ctrl+A)\n                    </button>', content, flags=re.MULTILINE)
                modified = True

            # If the file has handleFieldKeyDown but not on the last InputRow
            if 'handleFieldKeyDown' in content:
                # Find all InputRows
                input_rows = list(re.finditer(r'<InputRow[^>]*/>', content))
                if input_rows:
                    last_input = input_rows[-1]
                    last_input_str = last_input.group(0)
                    
                    if 'onKeyDown' not in last_input_str:
                        # Append it
                        new_last_input = last_input_str.replace('/>', 'onKeyDown={(e: any) => handleFieldKeyDown(e, \'btn-save\')} />')
                        content = content[:last_input.start()] + new_last_input + content[last_input.end():]
                        modified = True

            # Write back if modified
            if modified:
                with open(filepath, 'w') as f:
                    f.write(content)
                print(f"Fixed {file}")

