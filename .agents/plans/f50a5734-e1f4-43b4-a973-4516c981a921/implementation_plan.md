# Restoring Size Master UI

The `SizeMaster` UI from your screenshot was lost, likely because it was never committed to the `FrontEndV2` repository before a production build was pushed, overwriting the server's version with the standard boilerplate.

I will recreate the exact UI from your screenshot perfectly, while also ensuring it complies with all our global accessibility and keyboard rules.

## Proposed Changes

### `FrontEndV2/src/pages/masters/inventory/SizeMaster.tsx`
- **Rebuild List View**: I will build the split-layout UI shown in the screenshot:
  - **Top Section ("List of Sizes")**: Will fetch size groups and filter out primary scales (`INCH`, `SIZE`, `CM`, `NUMBER`). It will render the scale name in a green badge on the left, and map through the `sizes` array to display them as individual pill/badges in a row next to it.
  - **Bottom Section ("List of Size Sets")**: Will display a table of all remaining size groups (like `S-L`), showing the `Group Name` and `Sizes in Set`.
  - **Buttons**: Add the `Create New (Alt/Opt+C)` button at the top, and a `Manage Size Sets` button in the lower section that routes to `/masters/sizeset`.
- **Create Mode**: When `Create New` is clicked, it will switch to the standard "Tally-style" master creation form (with `InputRow` and `SectionTitle`) so users can create individual sizes.
- **Keyboard & Accessibility**: 
  - `Escape` to go back to the list/dashboard.
  - `Alt+C` to trigger Create Mode.
  - `Ctrl+A` to Save.
  - Modal interference protection for global keyboard shortcuts.

## Open Questions

1. When a user clicks **"Create New"**, should it create an individual Size (using the `/api/masters/generic/sizes` API), or should it create a new Size Group/Scale? I will default to creating a standard individual size, as Size Sets are managed via the "Manage Size Sets" button. Let me know if you prefer a different behavior.

Please approve this plan and I will build this UI immediately.
