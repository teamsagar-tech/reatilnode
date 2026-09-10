# Employee ID & Series Implementation Plan

To allow selecting an "Order By" person using a numeric Employee ID (like "7" for Ratan) and to manage ID series based on departments/floors, we need to introduce new data structures and UI components.

## User Review Required
> [!IMPORTANT]
> Please review where you want the User Creation and Series Management screens to live, and how you want the auto-numbering to work.

## Open Questions
> [!TIP]
> 1. **User Master Location:** Currently, users are managed by the Superadmin in `TenantUsers.tsx`, but there is an empty `UserMaster.tsx` page under Settings. Should we build out the full `UserMaster.tsx` page so Firms can create their own employees and assign them Employee IDs?
> 2. **Auto-Assignment:** When creating an employee, do you want them to pick a Series (e.g., "Admin (1-100)") from a dropdown, and the system automatically assigns the next available number (e.g., "7"), OR will the user manually type "7" and the system just validates it?
> 3. **Search Behavior:** In the Purchase Invoice, if they type "7" and press Enter, it will select Ratan. Should it *only* search by ID, or should it still allow typing "Ratan" by name?

## Proposed Changes

### 1. Database Updates
#### [NEW] Table `UserSeries`
To allow configuring series (1-100, 101-200), we will create a table:
- `id`, `firm_id`
- `series_name` (e.g., "Admin", "First Floor")
- `start_num` (e.g., 1)
- `end_num` (e.g., 100)
- `current_num` (Tracks the latest assigned number)

#### [MODIFY] Table `Users`
- Add column `employee_id VARCHAR(50) UNIQUE` to store "7", "101", etc.

### 2. Backend (API)
#### [NEW] `backend/controllers/userSeriesController.js`
- API routes to Create, Read, Update, and Delete User Series.

#### [MODIFY] `backend/controllers/userController.js`
- Update the `/api/users/purchasers` endpoint to include `employee_id` in the `SELECT` response so the frontend can search by it.
- Update user creation/editing routes to accept and save `employee_id`.

### 3. Frontend (UI)
#### [NEW/MODIFY] `FrontEndV2/src/pages/settings/Users/UserMaster.tsx`
- Build out the User Master screen to allow creating/editing employees.
- Add an input for "Employee ID".
- Add a sub-master/modal to let users define the "Employee ID Series" (Admin 1-100, First Floor 101-200).

#### [MODIFY] `FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx`
- Update the `SearchableDropdown` component for the "Order By" field.
- Add logic so that if the user types a number (e.g. "7"), it searches the `employee_id` field of the `activeUsers` array and automatically selects the matching user.

## Verification Plan
1. Create a Series "Admin" (1-100) in the DB.
2. Assign `employee_id` "7" to the user "Ratan".
3. Open Purchase Invoice.
4. Type "7" in "Order By" and verify it instantly finds and selects Ratan.
