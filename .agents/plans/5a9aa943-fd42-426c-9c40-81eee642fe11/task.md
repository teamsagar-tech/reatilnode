# Purchase Invoice UI Optimization Tasks

- `[/]` Research API `items` response to ensure `category_name` or `category_id` is available for categorization logic.
- `[ ]` Update `PurchaseInvoice.tsx` product state/grid logic to support row-level categorization.
- `[ ]` Implement `isFieldRequired(category, field)` logic.
- `[ ]` Rewrite `onKeyDown` navigation in the grid to skip disabled fields correctly.
- `[ ]` Auto-trigger `MultiAttributeModal` for Innerwear/Readywear on Item selection.
- `[ ]` Remove global `showMarkdown`, `showSize`, `showPurchaseDiscount` toggles and use auto-derived column visibility.
- `[ ]` Test rendering and payload structure.
