import sys

new_rule = """
## 10. Tally-Style Escape Navigation & Global Dialogs
- **Rule:** On all data entry forms (masters, vouchers, etc.), if the user presses the `Escape` key (or clicks a "Quit" button), the system MUST check if any unsaved data has been entered.
- **Rule:** If data is entered, you MUST intercept the navigation and prompt the user with a confirmation dialog (e.g., "Quit: Yes or No?") using the global `confirmDialog` from `useConfirmStore`.
- **Rule:** If the form is completely blank, `Escape` should back out instantly without prompting to save time.
- **Rule:** The global `ConfirmDialog` MUST always support `Y` (or `Enter`) to confirm and `N` (or `Escape`) to cancel, to maintain Tally-like fast keyboard operability.
"""

with open('.agents/AGENTS.md', 'a') as f:
    f.write(new_rule)
