# Dynamic Contacts & UI Updates

- [/] Modify `backend/database/008_parties_schema.sql` to include `dynamic_contacts JSON NULL`.
- [/] Update `backend/controllers/partyController.js` to extract `contacts` from `req.body` and insert/update it into `dynamic_contacts`.
- [/] Update `PartyMaster.tsx` frontend:
  - [/] Add `contacts: [{ type: 'Office', name: '', mobile: '' }]` to `formData`.
  - [/] Remove `Type` dropdown and default to `Sundry Creditor (Vendor)`.
  - [/] Remove `contactPerson`, `mobileNumber`, etc. from state.
  - [/] Create UI for mapping over `formData.contacts` (Add/Remove rows).
  - [/] Double width of Address Lines 1, 2, 3 (`col-span-2`).
  - [/] Tighten whitespace padding/margins.
- [/] Apply same frontend changes to `PartyModal.tsx` for consistency.
- [/] Deploy backend API updates to production server.
- [/] Deploy frontend updates to production server.
- [/] Execute `ALTER TABLE Parties ADD COLUMN dynamic_contacts JSON NULL;` on production database (if applicable, or let the user know).
