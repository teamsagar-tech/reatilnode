# Party Master Updates & Dynamic Contacts

This plan covers the requested changes for the Party Master, including architectural changes to support dynamic contacts and several UI/layout improvements.

## User Review Required
> [!IMPORTANT]
> **Dynamic Contacts Storage**: Currently, the database has hardcoded columns for exactly 3 contacts (`contact_person`, `mobile_number1`, `mobile_number2`, etc.). 
> To support dynamic contacts (unlimited contacts with labels like "Office", "Factory"), I propose **adding a new JSON column `contacts`** to the `Parties` database table. This is the cleanest approach for a highly scalable SaaS backend. We will update the UI to allow adding/removing contact rows dynamically. Do you approve this schema change?

## Proposed Changes

### 1. Database Schema (`retailnode_db`)
- **Add JSON Column**: Alter the `Parties` table to include a `contacts` JSON column. 
- The JSON structure will be an array of objects: `[{ type: "Office", name: "John", phone: "9876543210" }, ...]`.

### 2. Backend (`backend/controllers/partyController.js`)
- Update the `createParty` and `updateParty` endpoints to accept a `contacts` array from the frontend.
- Save this array to the new JSON column in the database.

### 3. Frontend UI (`PartyMaster.tsx` & `PartyModal.tsx`)
- **Address Widths**: Double the width of Address Line 1, 2, and 3 inputs (`w-[500px]` or similar).
- **Remove Party Type**: Remove the "Type" dropdown (Sundry Debtor / Creditor) and hardcode the payload to default to `Sundry Creditor (Vendor)` when creating a party from this page.
- **Dynamic Contacts UI**: Replace the static Contact 1, 2, 3 fields with a dynamic list where users can click "Add Contact" to add multiple contacts. Each contact will have a dropdown for Type (Office, Factory, Warehouse, Other), a Name input, and a Mobile input.
- **Whitespace**: Tighten vertical gaps to eliminate unnecessary white space and fit more content on a single screen without scrolling.

## Verification Plan
1. Apply the UI layout tweaks (Address width, Type removal, Whitespace).
2. Execute the MySQL schema change via the backend.
3. Update the frontend state to use a `contacts` array and test saving a new Party with dynamic contacts.
4. Verify the data saves successfully via the backend API.
