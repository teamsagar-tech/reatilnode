import re

with open("FrontEndV2/src/pages/masters/accounting/PartyMaster.tsx", "r") as f:
    master_code = f.read()

with open("FrontEndV2/src/components/inventory/PartyModal.tsx", "r") as f:
    modal_code = f.read()

# Extract the layout block from PartyModal.tsx
modal_match = re.search(r'          \{/\* Top Row \*/\}(.*?)        </div>\n        \n        \{/\* Footer \*/\}', modal_code, re.DOTALL)
if not modal_match:
    print("Could not find modal layout block")
    # let's try another regex
    modal_match = re.search(r'          \{/\* Top Row \*/\}(.*?)(?=        </div>\n\s*\{/\* Footer \*/\})', modal_code, re.DOTALL)
    if not modal_match:
        print("Still could not find modal layout block")
        exit(1)

modal_layout = "          {/* Top Row */}" + modal_match.group(1)

# Extract the action buttons block from PartyMaster.tsx so we can append it
master_actions_match = re.search(r'                  \{/\* Action Buttons \*/\}(.*?)                  </div>', master_code, re.DOTALL)
master_actions = master_actions_match.group(0) if master_actions_match else ""

# The new layout content
new_layout = f"""                  <div className='flex flex-1 flex-col gap-4 overflow-y-auto pb-4 custom-scrollbar pr-2'>
{modal_layout}                  </div>
{master_actions}"""

# Find the block to replace in PartyMaster.tsx
master_replace_match = re.search(r'                  <div className=\'flex flex-1 gap-6 overflow-hidden\'>(.*?)                  </div>\n                  \n                  \{/\* Action Buttons \*/\}(.*?)                  </div>', master_code, re.DOTALL)

if not master_replace_match:
    print("Could not find master layout block to replace")
    exit(1)

# Perform replacement for the layout
master_code = master_code[:master_replace_match.start()] + new_layout + master_code[master_replace_match.end():]

# Hacky but effective replacement for contacts initialization
master_code = master_code.replace("gstRawData: null as any\n  });", "gstRawData: null as any,\n    contacts: []\n  });")
master_code = master_code.replace("gstRawData: null\n          });", "gstRawData: null,\n            contacts: []\n          });")
master_code = master_code.replace("gstRawData: null\n        });", "gstRawData: null,\n          contacts: []\n        });")
master_code = master_code.replace("gstRawData: row.gst_raw_data && typeof row.gst_raw_data === 'string' && row.gst_raw_data.trim().startsWith('{') ? JSON.parse(row.gst_raw_data) : null\n            });", "gstRawData: row.gst_raw_data && typeof row.gst_raw_data === 'string' && row.gst_raw_data.trim().startsWith('{') ? JSON.parse(row.gst_raw_data) : null,\n              contacts: []\n            });")
master_code = master_code.replace("gstRawData: null\n                        });", "gstRawData: null,\n                          contacts: []\n                        });")


with open("FrontEndV2/src/pages/masters/accounting/PartyMaster.tsx", "w") as f:
    f.write(master_code)

print("Updated PartyMaster.tsx successfully.")
