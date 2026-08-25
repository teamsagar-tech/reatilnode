---
description: Architecture rules and standards for the RetailNode Node.js MySQL backend
---

# RetailNode Backend Architecture Rules

When working on the `/backend` folder, you MUST adhere to the following architecture rules.

## 1. Multi-Tenancy (SaaS Isolation)
This is a SaaS product. We use a **Shared Database, Shared Schema** multi-tenancy model.
- **Rule**: Every single table (except for global tables like `Firms` and `Users` themselves if designed that way) MUST have a `firm_id` column.
- **Rule**: EVERY MySQL query (SELECT, INSERT, UPDATE, DELETE) MUST include `firm_id = ?` in its `WHERE` clause or insert payload.
- **Rule**: Never trust the client to provide the `firm_id`. Always extract it from `req.firm_id` which is populated by the `tenantMiddleware` after authenticating the JWT token.

## 2. MySQL and mysql2/promise
- We use the `mysql2/promise` library with connection pooling.
- Import the pool from `../config/db.js` (or similar relative path).
- ALWAYS use parameterized queries `(?)` to prevent SQL injection.
- Do NOT use an ORM like Sequelize unless explicitly instructed. Raw queries or lightweight query builders are preferred for performance.

## 3. Middleware & Auth
- All protected routes must use `authMiddleware` to verify the JWT token and set `req.user`.
- All tenant-specific routes must use `tenantMiddleware` to extract `req.user.firm_id` and set it to `req.firm_id`.

## 4. Error Handling
- Use standard `try...catch` blocks in controllers.
- Send consistent JSON error responses: `res.status(500).json({ error: "Message" })`.

## 5. Folder Structure
- `config/` - Database and other configuration
- `controllers/` - Route handlers (business logic)
- `middleware/` - Express middleware (Auth, Tenant isolation)
- `routes/` - Express route definitions
- `database/` - SQL initialization scripts and migrations
