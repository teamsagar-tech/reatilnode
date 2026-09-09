# Standardize Transaction Voucher Design & Update Rules

This plan will refactor the `PurchaseOrder.tsx` UI to perfectly match the standard Tally voucher layout found in `PurchaseInvoice.tsx`. Furthermore, it will update the `retailnode-page-creation` Skill to document this exact layout so future transaction pages follow the same exact structure.

## Proposed Changes

### [MODIFY] `FrontEndV2/src/pages/inventory/PurchaseOrder.tsx`
- **Restructure Page Wrapper**: Implement the `flex flex-1 p-1 gap-1` main wrapper.
- **Add Standard Sidebar**: Add the `w-[120px]` right sidebar containing the standard Tally function keys (`F1 Help`, `F2 Date`, `F3 Company`... `F9 Purchase`).
- **Update Top Grid Layout**: Refactor the header inputs to exactly match the `w-[35%]` / `w-[65%]` split panel design with border separation.
- **Update Footer layout**: Refactor the bottom section to have the specific Two-Part Footer (Narration on left `w-[60%]`, Detailed Totals table on right `w-[40%]`).
- **Add Bottom Status Bar**: Implement the `bg-[#1b5e58]` status bar showing Shortcuts and Version.

### [MODIFY] `retailnode-page-creation` Skill (`/Users/ratan/Downloads/RetailNodeV2/.agents/skills/page-creation/SKILL.md`)
- **Update Documentation**: Add a detailed "Transaction Voucher Standard Layout" section to the Skill document.
- **Enforce Rules**: Specify the exact Tailwind layout structure required for any new Voucher or Transaction page (Main Container + Right Sidebar, Split Top Panel, Two-Part Footer).

## User Review Required
> [!IMPORTANT]  
> Please review the plan above. This will completely overwrite the previous visual structure of the Purchase Order to match the screenshot you provided.

## Open Questions
- Are there any specific function keys (F1-F12) in the right sidebar of `PurchaseOrder.tsx` that need customized actions, or should I just render the static layout for now?

## Verification Plan
1. Launch the `PurchaseOrder.tsx` page and visually compare it to `PurchaseInvoice.tsx` to guarantee pixel-perfect alignment.
2. Verify that the keyboard flow remains intact.
3. Review the updated `SKILL.md` to ensure the rules are clear for future AI generation.
