# RetailNode Architecture Plan: System-Wide Audit Logging & Soft Deletion

This document outlines the architectural approach to solving two major enterprise requirements: preserving user data integrity upon deletion and implementing a comprehensive 360-degree action log.

## 1. User Deletion & Data Integrity (The "Soft Delete" Strategy)
**Problem:** In an ERP system, you cannot permanently delete (hard-delete) a user from the database using `DELETE FROM users WHERE id = ?`. If you do, any foreign keys linked to that user (like `created_by` on Invoices, Items, or Payments) will either break or orphan the data.
**Solution:** We will implement **Soft Deletion**.
- **Database Change:** We add an `is_active` (BOOLEAN, default TRUE) and `deleted_at` (TIMESTAMP, default NULL) column to the `Users` and `TenantUsers` tables.
- **Backend Change:** When the Superadmin clicks "Delete", the API will instead execute an `UPDATE` statement setting `is_active = 0` and `deleted_at = NOW()`. 
- **Auth Guard:** The login middleware will automatically reject any login attempts from users where `is_active = 0`.
- **Result:** The user loses all access permanently, but their historical data additions remain perfectly intact and traceable.

## 2. 360-Degree Action & Audit Logging
To track every interaction (IP address, login time, page views, and data manipulation), we need a centralized logging pipeline that captures both frontend navigation and backend API interactions.

### A. Database Schema: `ActionLogs`
We will create a new table strictly bound to multi-tenancy rules:
```sql
CREATE TABLE ActionLogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firm_id INT NOT NULL, -- Strict Tenant Isolation
    user_id INT NOT NULL,
    action_type ENUM('LOGIN', 'PAGE_VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT') NOT NULL,
    module VARCHAR(100) NOT NULL, -- e.g., 'ItemMaster', 'SalesInvoice'
    description TEXT, -- Human-readable: "User updated Item #5 (Solapur - shop)"
    ip_address VARCHAR(45), -- Supports IPv4 and IPv6
    payload JSON, -- Snapshot of the data that was changed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (firm_id) REFERENCES Firms(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
```

### B. Backend Implementation (The Logging Service)
1. **Middleware approach:** We will create a utility function `logAction(req, type, module, desc, payload)`.
2. **Login Tracking:** Inside `authController.js`, upon successful token generation, we will call `logAction` extracting `req.ip`.
3. **CRUD Tracking:** Inside `genericMasterController.js` and custom controllers, whenever an `INSERT` or `UPDATE` is successful, we will log the exact JSON `req.body` that was saved.

### C. Frontend Implementation (Page View Tracking)
1. **React Router Tracker:** We will create a global hook (e.g., `useAuditTracker.ts`) placed inside the main `App.tsx` or `Layout` component.
2. Every time the user navigates (detecting changes in `location.pathname`), the frontend will fire a lightweight, non-blocking `POST` request to `/api/logs/track-page`.
3. This ensures that even if they just open a page and read data without clicking "Save", we have a chronological log of them viewing that specific Master or Report page.

## 3. Superadmin View (The Log Dashboard)
- We will build a new page under the Superadmin / Admin configuration hub called **"Audit Logs"**.
- This page will feature a high-density data table displaying a chronological feed of all actions, filterable by User, Date Range, Module, and Action Type.

---
### Next Steps
If you approve this architectural approach, I will begin implementing this in stages:
1. Update the `Users` table for Soft Deletion and fix the delete API.
2. Create the `ActionLogs` table and the backend logging service.
3. Implement the React Router tracking hook.
4. Build the UI to view these logs.
