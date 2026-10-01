# Product Models — Location & Type Guide

## Overview

There are **two separate product models** in this codebase, each representing a different physical context:

| Model           | File                           | Represents          |
| --------------- | ------------------------------ | ------------------- |
| `Product`       | `src/models/Products.js`       | **Warehouse** stock |
| `BranchProduct` | `src/models/BranchProduct.js`  | **Shop** stock      |

The correct model to query is determined by the **Location type** (`'warehouse'` or `'shop'`).

---

## Location Model (`src/models/Location.js`)

Each location has a `type` field:

```
type: { type: String, enum: ['warehouse', 'shop'], required: true }
```

- `'warehouse'` → the location is a warehouse → use `Product` model
- `'shop'` → the location is a shop → use `BranchProduct` model.

Locations are firm-scoped (`firmId`). Multiple warehouses or shops can exist per firm (e.g., Warehouse A, Warehouse B, Kalamb Shop).

---

## Product Model (Warehouse) — `Products.js`

### Location Fields

This model has **two** location fields:

| Field             | Purpose                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `location`        | **Intended destination** — where the product is _supposed_ to go (e.g., a shop). Set at invoice/purchase time.             |
| `currentLocation` | **Actual physical location** — where the product _currently is_ (e.g., Warehouse A). Set during label print / inward scan. |

### Why `currentLocation` Matters

A product can be received at Warehouse A but be _intended_ for Kalamb Shop:

- `location` = `<Kalamb Shop ObjectId>`
- `currentLocation` = `<Warehouse A ObjectId>`

**When filtering products by warehouse, always use `currentLocation`, NOT `location`.**

Using `location` would return wrong results — it would give you products destined _for_ the warehouse, not products _currently at_ the warehouse.

### Correct Query (Warehouse)

```js
Product.findOne({
  barcode,
  isSold: false,
  firmId: req.firmId,
  currentLocation: locationId, // ← physical location filter
});
```

---

## BranchProduct Model (Shop) — `BranchProducts.js`

### Location Fields

This model has only **one** location field:

| Field      | Purpose                                   |
| ---------- | ----------------------------------------- |
| `location` | The shop location this product belongs to |

No `currentLocation` exists here — shop products are always where they are.

### Correct Query (Shop)

```js
BranchProduct.findOne({
  barcode,
  isSold: false,
  firmId: req.firmId,
  location: locationId, // ← only one location field
});
```

---

## How to Resolve Which Model to Use

### Step 1 — Resolve `locationId`

```js
// Full-access users can pass locationId in body
// Normal users → use their assigned location from the auth middleware

const locationId = req.user.hasFullAccess
  ? req.body.locationId || req.user.location
  : req.user.location;
```

### Step 2 — Look up the Location document

```js
const locationDoc = await Location.findById(locationId).select("type").lean();
```

### Step 3 — Pick the correct model and field

```js
if (locationDoc.type === 'warehouse') {
  // Query Product with currentLocation
  await Product.findOne({ ..., currentLocation: locationId })
} else if (locationDoc.type === 'shop') {
  // Query BranchProduct with location
  await BranchProduct.findOne({ ..., location: locationId })
}
```

---

## Access Control Summary

| User Type            | firmId                                                           | locationId                                                     |
| -------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| **Normal user**      | Fixed from `user.firmId` (middleware)                            | Fixed from `user.location` (middleware)                        |
| **Full-access user** | Can override via `req.body.firmId` (handled by `authMiddleware`) | Can override via `req.body.locationId` (handled in controller) |

Full-access users get Firm + Location selectors on the frontend to choose which firm and which location to operate on.

---

## Summary of Rules

1. **Location type = `'warehouse'`** → use `Product` model, filter by `currentLocation`
2. **Location type = `'shop'`** → `Product` records move into the `BranchProduct` model and are marked with `productSource: 'BranchProduct'` (to distinguish them from original `Product` records during reports).
3. **Never filter Warehouse products by `location`** — it represents intended destination, not physical position
4. **Multiple warehouses** (A, B, etc.) are separate Location documents with different `_id`s — filtering by `currentLocation` correctly isolates each one
5. **Backend resolves everything** for normal users — no extra payload needed from frontend
