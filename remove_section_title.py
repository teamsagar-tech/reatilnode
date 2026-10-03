import os
import glob

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Remove the <SectionTitle>Master Information</SectionTitle> usage
    new_content = content.replace('<SectionTitle>Master Information</SectionTitle>', '')
    
    # Also remove the definition if it exists
    # const SectionTitle = ({ children }: { children: React.ReactNode }) => ( ... );
    # This might span multiple lines
    import re
    definition_pattern = r'const SectionTitle = \(\{ children \}: \{ children: React\.ReactNode \}\) => \(\s*<div.*?>\s*\{children\}\s*</div>\s*\);'
    new_content = re.sub(definition_pattern, '', new_content, flags=re.DOTALL)
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Removed SectionTitle from {os.path.basename(filepath)}")

