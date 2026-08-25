---
trigger: when asked to create, style, update, or fix the layout of a frontend page or table
description: Enforces the compact, data-dense page layout used in the retailnode/frost project
---

# Compact Page Styling Rule

When instructed to create a new page, restyle an existing page, or modify a table layout on the frontend, you MUST follow the guidelines defined in the `compact-page-styling` skill.

**Before making any styling changes to tables or page layouts**, you must read the skill instructions located at:
`file:///Users/ratan/Downloads/frost-pivot/.agent/skills/compact-page-styling/SKILL.md`

## Key Requirements:
1. **Full Viewport Height**: Remove any standard `p-4` or generic padding that causes whole-page scrolling. Use `h-[calc(100vh-48px)] flex flex-col`.
2. **Compact Header & Filters**: Use `text-[10px]` to `text-xs` sizing, small inputs, and high-density buttons.
3. **Scrollable Table Container**: The table MUST be inside a `flex-1 overflow-auto` container so only the table data scrolls.
4. **Native Table Tags for Sticky Headers**: Do NOT use the Shadcn UI `<Table>` component for data-heavy pages. It wraps the table in an `overflow-x-auto` div that breaks vertical `sticky top-0` headers. You must use `<table className="w-full">` instead, while still utilizing the `TableHeader`, `TableBody`, and `TableCell` components.
5. **Data Formatting**: Use Monospace fonts (`font-mono`) and right-alignment for numeric columns. Use uppercase for short textual strings. Use compact Action buttons inside the table rows.
