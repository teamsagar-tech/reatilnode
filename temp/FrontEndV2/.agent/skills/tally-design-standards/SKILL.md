---
name: tally-design-standards
description: Enforces strict retro Tally ERP 9 UI aesthetics, keyboard-first navigation, and layout standards for the RetailNode FrontEndV2 app.
---

# Tally ERP 9 UI & Keyboard Standards for RetailNode

When working on any frontend components in `FrontEndV2`, you MUST strictly adhere to these design and functional rules:

## 1. Aesthetics & Colors (Retro ERP Theme)
- **Header/Footer/Title bars**: Dark Teal (`#1b5e58`) with white text.
- **Backgrounds**: Mint Green (`#e0efeb`) for main window borders, Cream (`#fcfaf2`) for form areas and tables.
- **Inputs**: Solid white backgrounds, bordered by black or slate. 
- **Focus States (CRITICAL)**: Inputs MUST highlight in Creamy Yellow (`#ffffe0`) with a strong border when focused.
- **Active Menu Items**: Bright Yellow (`#ffe000`) with bold black text.
- **Corners**: Absolutely NO rounded corners (`rounded-none`). The UI should look like a rigid desktop application.

## 2. Keyboard-First Navigation
- **No-Mouse Requirement**: Users must be able to complete their workflow entirely using the keyboard.
- **Enter Key to Advance**: Use `onKeyDown` to capture the `Enter` key and programmatically `focus()` the next logical input field.
- **Arrow Keys**: Use `ArrowUp` and `ArrowDown` to navigate dropdown suggestions or table rows.
- **Escape to Go Back**: The `Escape` key MUST navigate the user back to the previous screen or the main `Dashboard` (Gateway of RetailNode). If a dropdown is open, `Escape` should close the dropdown first before triggering navigation on subsequent presses.
- **Auto-Focus**: The primary/first input field of any screen MUST be auto-focused when the component mounts.
- **Cross-Platform Shortcuts (Mac Support)**:
  - When using `Alt` shortcuts (e.g., `Alt+C`), display labels as `(Alt/Opt+C)`. In JS, ensure you handle Mac's character mapping (e.g., `e.altKey && (e.code === 'KeyC' || e.key.toLowerCase() === 'c' || e.key === 'ç')`).
  - When using `Ctrl` shortcuts (e.g., `Ctrl+A` for Save), display labels as `(Cmd/Ctrl+A)`. In JS, support both `e.ctrlKey` and `e.metaKey` (e.g., `(e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a'`).

## 3. Data Density & Tables
- Maintain extreme compactness.
- Use tight paddings (`px-1`, `py-0` or `py-[1px]`).
- Use dense typography (`text-[11px]` to `text-[13px]`).
- Do not waste vertical or horizontal space. Table headers and summary sections should be compressed.

## 4. Main Menu & Sidebars
- The **Gateway of RetailNode** acts as the central menu hub.
- The **Right Sidebar (F-keys)** must be present on voucher screens, following standard functional mappings (e.g., F1 Help, F2 Date, F4 Contra, F5 Payment, F9 Purchase).
- Ensure consistent layout structures (Header, Main Content Area with Border, Right F-Key Sidebar, Bottom Status Bar).
