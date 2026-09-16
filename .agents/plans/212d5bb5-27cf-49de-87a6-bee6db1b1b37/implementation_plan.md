# Separate Hundekaris Table Implementation Plan

The `Hundekari` data was previously being saved into the `Parties` table with `party_type = 'Hundekari'`. However, this was causing errors (`Data truncated for column 'party_type'`) because the `Parties` table's `party_type` column has restrictions (most likely an `ENUM` that doesn't include 'Hundekari').

Instead of modifying the core `Parties` table, we will architecturally separate `Hundekaris` into their own table, just like `Transporters`.

## User Review Required

> [!IMPORTANT]
> This requires a database migration on the live server. I will create the new `Hundekaris` table directly on the remote database. Any existing Hundekaris that were somehow saved in the `Parties` table will not be migrated (since they were failing to save anyway).

## Proposed Changes

---

### Backend Schema & Database

#### [NEW] `Hundekaris` Table
I will run a SQL script on the server to create the new table:
```sql
CREATE TABLE IF NOT EXISTS `Hundekaris` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firm_id` INT NOT NULL,
  `hundekari_name` VARCHAR(300) NOT NULL,
  `mobile` VARCHAR(15) NULL,
  `email` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_firm_mobile_h` (`firm_id`, `mobile`),
  UNIQUE KEY `idx_firm_email_h` (`firm_id`, `email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### Backend API Routes

#### [MODIFY] `Backend/routes/logisticsRoutes.js`
- Add a `GET /api/logistics/hundekaris` route to fetch all Hundekaris for the tenant.
- Add a `POST /api/logistics/hundekaris` route to create a new Hundekari.

#### [MODIFY] `Backend/controllers/logisticsController.js`
- Implement `getHundekaris` and `createHundekari` controller functions that interact with the new `Hundekaris` table securely using `req.firm_id`.

---

### Frontend

#### [MODIFY] `FrontEndV2/src/pages/purchase/LRList.tsx`
- Update the API call that fetches Hundekaris to use the new `/api/logistics/hundekaris` endpoint instead of `/api/masters/party`.

#### [MODIFY] `FrontEndV2/src/pages/purchase/LRList2.tsx`
- Update the API call that fetches Hundekaris to use the new `/api/logistics/hundekaris` endpoint instead of `/api/masters/party`.

#### [MODIFY] `FrontEndV2/src/components/inventory/HundekariModal.tsx`
- Change the `POST` endpoint from `/api/masters/party` to the new `/api/logistics/hundekaris`.

## Verification Plan

### Automated Tests
- No automated tests required for these manual views.

### Manual Verification
- Verify that `Alt+C` opens the Hundekari Modal.
- Verify that saving the Hundekari returns success and instantly adds it to the dropdown.
- Verify the server database properly reflects the new `Hundekaris` records.
