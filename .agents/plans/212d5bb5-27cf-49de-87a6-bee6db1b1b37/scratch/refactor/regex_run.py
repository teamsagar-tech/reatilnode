import os
import re

files_to_process = [
    "FrontEndV2/src/components/inventory/SizeAllocationModal.tsx",
    "FrontEndV2/src/pages/Dashboard.tsx",
    "FrontEndV2/src/pages/superadmin/TenantUsers.tsx",
    "FrontEndV2/src/pages/superadmin/SuperAdminDashboard.tsx",
    "FrontEndV2/src/pages/inventory/LabelPrintPage.tsx",
    "FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx",
    "FrontEndV2/src/pages/inventory/ManageReceivable/BulkUpdateForm.tsx",
    "FrontEndV2/src/pages/purchase/LRList2.tsx",
    "FrontEndV2/src/pages/purchase/LRList.tsx",
    "FrontEndV2/src/pages/masters/inventory/TaxonomyMaster.tsx",
    "FrontEndV2/src/pages/masters/inventory/SizeSetMaster.tsx"
]

def get_rel_path(from_file, to_file):
    from_dir = os.path.dirname(from_file)
    rel = os.path.relpath(to_file, from_dir)
    if not rel.startswith('.'):
        rel = './' + rel
    return rel.replace('.ts', '')

for filepath in files_to_process:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r') as f:
        content = f.read()

    original_content = content
    needs_toast = False
    needs_confirm = False

    # Replace alert
    def alert_repl(m):
        global needs_toast
        needs_toast = True
        msg = m.group(1)
        lower_msg = msg.lower()
        if "success" in lower_msg or "saved" in lower_msg or "generated" in lower_msg:
            return f"toast.success({msg})"
        elif "error" in lower_msg or "fail" in lower_msg or "cannot" in lower_msg or "required" in lower_msg:
            return f"toast.error({msg})"
        return f"toast.warning({msg})"

    content = re.sub(r'(?:window\.)?alert\((.*?)\)', alert_repl, content)

    # Replace confirm (basic async assumption)
    def confirm_repl(m):
        global needs_confirm
        needs_confirm = True
        msg = m.group(1)
        return f"await confirmDialog({msg})"

    content = re.sub(r'(?:window\.)?confirm\((.*?)\)', confirm_repl, content)

    if content != original_content:
        # Check imports
        if needs_toast and "import { toast }" not in content:
            rel = get_rel_path(filepath, "FrontEndV2/src/store/useToastStore.ts")
            content = f"import {{ toast }} from '{rel}';\n" + content
        if needs_confirm and "import { confirmDialog }" not in content:
            rel = get_rel_path(filepath, "FrontEndV2/src/store/useConfirmStore.ts")
            content = f"import {{ confirmDialog }} from '{rel}';\n" + content
        
        # Super basic fix for async if await confirmDialog is used
        # (This is highly heuristic but works for simple cases)
        if needs_confirm:
            content = re.sub(r'(const \w+ = )(\([^)]*\) => {)', r'\1async \2', content)
            content = re.sub(r'(const \w+ = )(e: any => {)', r'\1async \2', content)
            content = re.sub(r'(onClick=\{)()(\(\) =>)', r'\1async \3', content)

        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Refactored: {filepath}")

