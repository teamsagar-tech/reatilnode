# Restoring Size Master UI

- `[x]` Rebuild `SizeMaster.tsx` UI layout
  - `[x]` Fetch size sets from `/api/masters/generic/sizesets` (or `size-groups`)
  - `[x]` Separate `INCH`, `SIZE`, `CM`, `NUMBER` scales from the rest
  - `[x]` Create Top Section: "List of Sizes" with custom badge styling for scales
  - `[x]` Create Bottom Section: "List of Size Sets" with a `SCALE: SIZE` data table
  - `[x]` Add "Manage Size Sets" button linking to `/masters/sizeset`
- `[x]` Rebuild "Create Mode" standard 2-column layout for Size Master
- `[x]` Integrate Global Accessibility & Keyboard Rules
  - `[x]` F5 Delete functionality
  - `[x]` Alt/Opt+C to switch to Create Mode
  - `[x]` Ctrl+A to save
  - `[x]` Modal interference checks inside `handleKeyDown`
- `[x]` Verify component and run build
