# Multi-Firm Access Tasks

- [x] Database Schema Updates
  - [x] Create `UserFirms` table migration in `server.js`
  - [x] Migrate existing users from `Users` table into `UserFirms` (initial mapping)
- [x] Backend API Updates
  - [x] Update `/api/auth/login` to fetch available firms from `UserFirms`
  - [x] Create `POST /api/auth/switch-firm` endpoint to issue new JWT tokens
  - [x] Create `POST /api/firms/me/new` for admin users to create their own firm
- [x] Frontend Updates
  - [x] Implement Firm Switcher Dropdown in `Header.tsx`
  - [x] Implement Create Firm logic in `Header.tsx`
  - [x] Handle token replacement and page reload on firm switch
- [/] Verification
  - [ ] Test login response contains multiple firms
  - [ ] Test switching firms updates the token and isolates data
