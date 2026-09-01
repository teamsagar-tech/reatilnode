# RetailNodeV2 Backend Development Guide

Welcome to the RetailNodeV2 backend development guide. This document serves as the absolute single source of truth for developing APIs in this project.

## 1. Core Architecture Principles

RetailNode is a highly scalable Enterprise SaaS application. We enforce **Strict Tenant Isolation**.
- **Tech Stack:** Node.js, Express, MySQL 8+ (via `mysql2/promise` with connection pools).
- **No MongoDB:** Stick strictly to relational data for integrity.
- **No Heavy ORMs:** Use raw SQL queries or lightweight query builders for optimal performance at scale (1000+ firms).
- **Tenant Isolation:** EVERY table (except global configuration or auth tables like `Firms`, `Users`, `Roles`) MUST have a `firm_id` column.
- **Query Mandatory Check:** EVERY query (SELECT, INSERT, UPDATE, DELETE) MUST include a check for `firm_id = ?`.

## 2. Directory Structure

- `/backend/routes/`: Express route definitions.
- `/backend/controllers/`: Core business logic and database queries.
- `/backend/middleware/`: 
  - `authMiddleware.js`: Verifies JWT and injects `req.user`.
  - `tenantMiddleware.js`: Verifies user belongs to the active firm and injects `req.firm_id`.
  - `rbacMiddleware.js`: Enforces role-based access control.
- `/backend/utils/`: Utility functions (e.g., `maskData.js` for Field-Level Security).
- `/backend/database/`: Database connection pool and schema scripts.

## 3. Step-by-Step API Creation

When creating a new API endpoint, follow these exact steps:

### Step 1: Define the Route
Always attach the required middlewares in this specific order:
1. `authenticateToken`
2. `tenantMiddleware`
3. `requirePermission('module_name', 'action')`

```javascript
// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');
const itemController = require('../controllers/itemController');

// Example: Get all items (requires 'inventory' read permission)
router.get(
  '/', 
  authenticateToken, 
  tenantMiddleware, 
  requirePermission('inventory', 'read'), 
  itemController.getItems
);

module.exports = router;
```

### Step 2: Write the Controller (Querying Data)
You MUST extract `firm_id` from `req.firm_id`. NEVER trust `firm_id` sent in the request body from the client.
Always use parameterized queries (`?`) to prevent SQL Injection.

```javascript
// controllers/itemController.js
const pool = require('../database/db');

exports.getItems = async (req, res) => {
  try {
    const firm_id = req.firm_id; // Injected by tenantMiddleware

    // MUST include firm_id = ? in every query
    const [rows] = await pool.query(
      'SELECT * FROM Items WHERE firm_id = ?',
      [firm_id]
    );

    // Apply Field-Level Security before sending response
    const { maskData } = require('../utils/maskData');
    const maskedData = rows.map(row => maskData(row, 'inventory', req.user.role));

    res.status(200).json(maskedData);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
```

### Step 3: Enforcing Field-Level Security
Certain roles (e.g., Cashier) should not see sensitive data (e.g., `cost_price` of an item). The `maskData` utility automatically strips restricted fields based on `/config/fieldPermissions.js`. Always map your API responses through this function before sending.

## 4. Database Best Practices

- **Transactions:** For multi-table operations (e.g., creating a Sales Invoice and updating Inventory Ledgers), you MUST use a database transaction.
```javascript
const connection = await pool.getConnection();
try {
  await connection.beginTransaction();
  // ... queries using connection.query()
  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
}
```
- **Dates & Times:** Store dates in UTC or standardized formats.

## 5. Development History
Always refer to `/HISTORY.md` to see recent major changes. When you implement a new major feature or route, you MUST append a summary to `HISTORY.md`.

---
*Following this guide ensures our backend remains secure, highly scalable, and properly isolated across thousands of tenant firms.*
