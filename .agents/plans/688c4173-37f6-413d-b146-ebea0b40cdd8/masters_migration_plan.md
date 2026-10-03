# Master Modules Migration & Alignment Plan (FrontEnd vs FrontEndV2)

This document outlines all Master pages currently present in the RetailNode system. It highlights the logical and structural differences between the "modern" `FrontEnd` and the "Tally-style" `FrontEndV2`. 

The goal is to migrate all advanced business logic (relational dropdowns, data mapping, connected entities) from `FrontEndV2` into `FrontEnd` while preserving `FrontEnd`'s modern CSS aesthetics.

---

## 1. Inventory Masters

| Master Name | Status | V2 Features Needed in FrontEnd |
|---|---|---|
| **Item Master** | ✅ **Synced** | Added `brandName` & `categoryName` autocomplete (`<datalist>`). Added table column mapping to resolve relational IDs. |
| **Brand Master** | ✅ **Synced** | Replaced `Manufacturer` with `Connected Parties` derived from Party JSON logic. |
| **Category Master** | ✅ **Synced** | Replaced static fields with relational mapping to `Departments`. (Note: `Mapped Cuts` may still need implementation depending on usage). |
| **Color Master** | ✅ **Synced** | Added missing `Description` field to FrontEnd form. |
| **Cut Master** | ✅ **Synced** | Completely implemented `Cut Master` from scratch in modern UI. Created routing, module RBAC, header links, and mapped `cut_name`, `cut_size` to `/api/masters/cut`. |
| **Department Master** | ✅ **Synced** | Confirmed API mappings and form fields. Removed `Sqft` template artifact and replaced with `Description` to perfectly match V2 structure. |
| **Design Master** | ✅ **Synced** | Confirmed functionally identical. Both only require `Design Name` mapping to generic designs endpoint. |
| **HSNSAC Master** | ✅ **Synced** | Migrated the complex `/api/gst/search-hsn-catalog` auto-fetch and suggestion UI to the modern FrontEnd, ensuring it matches V2 exactly while utilizing the new modern form components. |
| **Material Master** | ✅ **Synced** | Added missing `Description` field to perfectly match V2. |
| **Section Master** | ✅ **Synced** | Re-mapped `Sqft` template to `Description` and `Section Name` to `name` to align with V2 generic payload structure. |
| **SizeGroup Master** | ✅ **Synced** | Confirmed functional parity. Uses comma-separated sizes parsing matching the backend payload. |
| **Size Master** | ✅ **Synced** | Confirmed functionally identical. Uses Size Name, Description, Size Group. |
| **SizeSet Master** | ✅ **Synced** | Completely implemented `SizeSet Master` from scratch in modern UI. Created route and hooked up sizes array checkbox logic. |
| **Style Master** | ✅ **Synced** | Added missing `Description` field to FrontEnd form. |
| **SubCategory Master**| ✅ **Synced** | Completely rebuilt. Now correctly fetches Parent Category dropdown and displays children subcategories dynamically. |
| **SubStyle Master** | ✅ **Synced** | Completely rebuilt. Now correctly fetches Parent Style dropdown and displays children substyles dynamically. |
| **Taxonomy Master** | ✅ **Synced** | Ported complex node tree from V2, modernized alert messages to replace unsupported toast/confirmDialog. Fully integrated. |

---

## 2. Accounting & Party Masters

| Master Name | Status | V2 Features Needed in FrontEnd |
|---|---|---|
| **Party Master** | ✅ **Synced** | Completely rewritten. Added complex GST/IFSC/Pincode API logic and "Connected Brands/Categories" mapping arrays. |
| **Customer Master** | ✅ **Synced** | Confirmed functionally identical across both versions (straightforward ledger). |
| **Transporter Master**| ✅ **Synced** | Re-mapped from generic mock endpoint to `logistics/transporters` and matched V2 fields exactly. |
| **Hundekari Master** | ✅ **Synced** | Re-mapped from generic mock endpoint to `logistics/hundekari` and matched V2 fields exactly. |
| **Commission Master** | ✅ **Synced** | Validated. Contains Rule Name, Percentage, and Valid Till in both V2 and modern FrontEnd forms. |

---

## Migration Strategy (Next Steps)

Since V2 has evolved significantly, merging these requires a delicate touch to avoid overwriting the modern layout in `FrontEnd`. The strategy per file is:

1. **State Injection:** Add `useState` and `useEffect` fetches for all related masters (e.g., fetching Brands inside Style Master).
2. **Column Swap:** Update the `<th>` and `<td>` tags in the data table to compute and display relational names instead of raw IDs.
3. **Input Group Upgrade:** Upgrade the modern `InputGroup` components to include `datalistId` and `options` for native HTML5 autocomplete.
4. **Pre-Save Translation:** Modify the `onClick` save handler to resolve text names back into `_id` values before pushing the JSON payload to the backend.

*Please review this plan. If you approve, I can begin executing this migration strategy on the remaining Accounting and Inventory masters.*
