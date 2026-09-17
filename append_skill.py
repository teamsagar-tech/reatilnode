import sys

new_rule = """
## 5. Tally-Style Escape Navigation & Global Dialogs
- **Escape Key Interception:** On all data entry forms, if the user presses `Escape` (or clicks "Quit"), you MUST check if any unsaved data has been entered.
- **Quit Confirmation:** If data is entered, intercept the navigation and prompt "Quit: Yes or No?" using the global `confirmDialog` from `useConfirmStore`.
- **Fast Exit:** If the form is completely blank, `Escape` should back out instantly without prompting.
- **Global Y/N Hotkeys:** The global `ConfirmDialog` component natively listens for `Y` or `Enter` to confirm, and `N` or `Escape` to cancel. Always ensure these shortcuts are preserved or implemented in any custom dialogs to maintain Tally-like fast keyboard operability.
"""

with open('.agents/skills/form-accessibility/SKILL.md', 'a') as f:
    f.write(new_rule)
