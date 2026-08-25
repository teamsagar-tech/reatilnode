---
name: compact-page-styling
description: Guidelines and instructions for creating or updating pages to match the standard compact, data-dense VRP/Frost UI styling.
---

# Compact Page Styling Skill

This skill should be used whenever you are asked to "update a page", "fix page styles", or "make a page compact" in the `retailnode` project frontend. It ensures all master and report pages share a consistent, high-density layout.

## 1. Overall Page Layout
Pages should use the full viewport height to maximize data visibility without the entire page scrolling.

```jsx
// ❌ Avoid standard full-page padding
<div className="p-4 relative">...</div>

// ✅ Use viewport-constrained layout
<div className="w-full h-[calc(100vh-48px)] p-2 bg-gray-50 flex flex-col gap-2 overflow-hidden">
  {/* Header & Filter Bar */}
  {/* Data Table Container */}
</div>
```

## 2. Top Header Bar
The top bar should be compact with a blue bottom border.

```jsx
<div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-600 pb-1 shrink-0">
  <div className="flex items-center gap-2">
    {/* Use lucide-react ArrowLeft inside a ghost button for navigation */}
    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigate(-1)}>
      <ArrowLeft className="w-4 h-4 text-blue-900" />
    </Button>
    {/* Page Title OR Entity Count */}
    <h1 className="text-sm font-bold text-blue-900 uppercase tracking-wider">
      {customers.length} CUSTOMERS
    </h1>
  </div>
  
  <div className="flex items-center gap-1 ml-auto">
    {/* Primary Action Button */}
    <Button size="sm" className="h-7 text-xs">
      <Plus className="mr-1 h-3 w-3" /> Create New
    </Button>
    {/* Export Button (Ghost/Outline) */}
    <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] uppercase font-bold text-blue-900 border-blue-200 hover:bg-blue-50">
      <Download className="w-3 h-3 mr-1" /> EXPORT
    </Button>
    {/* Fullscreen Button */}
    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-900 hover:bg-blue-50">
      <Maximize2 className="w-3 h-3" />
    </Button>
  </div>
</div>
```

## 3. Filter Section (Optional)
If the page has search or filters, wrap them in a floating white card.

```jsx
<div className="flex flex-wrap items-center gap-3 p-2 bg-white border rounded shadow-sm relative z-50 shrink-0">
  <div className="flex items-center gap-2 w-full sm:w-auto">
    <div className="relative w-full sm:w-80">
      <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search..."
        className="pl-8 h-8 text-xs w-full"
      />
    </div>
  </div>
</div>
```

## 4. The Table Container
The table should be placed inside a flex-1 container that handles its own scrolling.

```jsx
<div className="flex-1 bg-white border shadow-sm rounded-md overflow-hidden flex flex-col min-h-0">
  <div className="flex-1 overflow-x-auto overflow-y-auto">
    {/* Table Goes Here */}
  </div>
</div>
```

## 5. Table Component & Headers
**CRITICAL**: Do NOT use the `<Table>` component from `ui/table` wrapper as it adds its own `overflow-x-auto` div that breaks vertical `sticky` headers. Use a native `<table>` tag instead.

```jsx
// ❌ Don't use shadcn Table
<Table className="...">...</Table>

// ✅ Use native table element, but keep Shadcn TableHeader/TableHead/TableBody components
<table className="min-w-[1500px] w-full text-[11px] sm:text-xs caption-bottom">
  <TableHeader className="sticky top-0 z-10 bg-[#f8f9fa] shadow-sm">
    <TableRow className="hover:bg-[#f8f9fa]">
      <TableHead className="w-12 text-center h-8 px-2 font-bold text-gray-700 border-r border-gray-200">#</TableHead>
      <TableHead className="h-8 px-2 font-bold text-gray-700 border-r border-gray-200">
        <div className="flex items-center">
          Title Case Header
          <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />
        </div>
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {/* Rows */}
  </TableBody>
</table>
```

## 6. Table Rows and Cells
Ensure cells are formatted correctly based on their data type.

```jsx
<TableRow className="even:bg-[#f8fafc] hover:bg-blue-50/70 border-b border-gray-100">
  {/* Index Number */}
  <TableCell className="text-center text-gray-500 py-1.5 px-2 border-r border-gray-100">{index + 1}</TableCell>
  
  {/* Standard Text (Uppercase) */}
  <TableCell className="font-bold uppercase text-gray-800 py-1.5 px-2 border-r border-gray-100">{item.name}</TableCell>
  
  {/* Numeric/Monetary (Right aligned, monospaced) */}
  <TableCell className="py-1.5 px-2 border-r border-gray-100 text-right font-mono">
    {formatNumber(item.amount)}
  </TableCell>

  {/* Actions */}
  <TableCell className="py-1.5 px-2 text-center">
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]">
        <Pencil className="w-3 h-3 mr-1" /> Edit
      </Button>
      <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] text-red-600 hover:text-red-700">
        <Trash2 className="w-3 h-3 mr-1" /> Delete
      </Button>
    </div>
  </TableCell>
</TableRow>
```

## 7. Keyboard Shortcuts & Navigation
When building new main screens:
1. Ensure the UI respects the standard F1-F7 shortcuts if building high-frequency data entry forms.
2. Rely on global event listeners for `Option/Alt` and `Command` (macOS) combinations instead of capturing local keydown events that might prevent global navigation.
