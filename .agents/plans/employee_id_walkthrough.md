# Walkthrough: Employee ID and User Series Management

I have fully implemented the Employee ID feature and User Series management across the application, allowing firms to manage employee numbers and automatically search users by their assigned ID.

## 1. Database Schema
- Added `employee_id` to the `Users` table (Local & Production).
- Created the `UserSeries` table to manage reserved series ranges for different groups (e.g. Admins, First Floor).

## 2. User Master Page
- Created the **User Master** page at `Settings > Users`.
- The page follows the standard Tally-style layout with a list view and creation forms.
- **Features included:**
  - View a list of all existing users and their assigned Employee IDs.
  - View a list of Employee ID Series and their reserved ranges (e.g., 1-100, 101-200).
  - Create new Users with a specific Employee ID.
  - Create new ID Series with a name, start number, and end number.

## 3. Order By Auto-Selection
- Modified the **SearchableDropdown** component to support a new `searchKeys` property, allowing filtering by multiple fields.
- Applied `searchKeys={['name', 'employee_id']}` to the **Order By** dropdown in the Purchase Invoice page.
- Now, when a user types "7" in the dropdown, the system will filter for the employee who has ID "7" and automatically select them when the user hits Enter.
- Enhanced the UI of the dropdown to visually display the Employee ID alongside the employee's name for clarity.

## 4. Backend & Deployment
- Created all the necessary backend routes (`POST /api/users`, `GET /api/user-series`, etc.) for managing Users and Series.
- Deployed the frontend and backend updates to the production server (162.19.81.108) and restarted the application.

### Next Steps
You can navigate to **Settings > Users** in the application to start creating Employee ID Series and assigning them to new users. Open **Purchase Invoice** and test searching the *Order By* field by inputting the assigned ID!
