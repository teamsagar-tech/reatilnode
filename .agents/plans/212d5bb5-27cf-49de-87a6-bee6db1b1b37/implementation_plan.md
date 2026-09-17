# Invoice Import Implementation Plan

The `sample/invoices` directory contains 9 raw JPEG photos of multi-page invoices from different suppliers (e.g., LA BASE SHIRTS, MOMENTO FASHION, IT'S CREATION, etc.). 

You requested to insert all these invoices via the backend API instead of pushing directly to the database. 

## The Core Challenge
The `/api/purchase-invoices` endpoint expects relational integer IDs (e.g. `vendor_id`, `item_id`, `brand_id`) rather than raw string names. Because these invoices contain brand new suppliers and item names, **we cannot just post raw extracted strings to the invoice API**—it will crash because those Master records don't exist yet.

## Proposed Strategy

To automate this cleanly, I propose a **two-phase extraction and ingestion pipeline**:

### Phase 1: Manual Data Extraction (AI Vision)
1. I will visually inspect the 9 invoice images in batches.
2. I will extract and structure the invoice data into a pure `raw_invoices.json` file inside the `sample/invoices/` directory. This file will contain raw strings (e.g., Vendor Name, Item Name, Sizes, MRPs, Rates).

### Phase 2: Intelligent Ingestion Script (`import_invoices.js`)
I will write a custom Node.js script that will loop through `raw_invoices.json` and perform the following for each invoice:
1. **Master Data Resolution:** 
   - Check if the Vendor string exists via the DB. If not, auto-create it and grab the new `vendor_id`.
   - Check if the Brand/Item string exists via the DB. If not, auto-create it and grab the new `item_id`.
2. **Payload Construction:** 
   - Replace all the raw strings in the JSON with the newly resolved `vendor_id`, `item_id`, etc.
3. **API Insertion:** 
   - Hit the `/api/purchase-invoices` endpoint with the strictly compliant payload to save the invoice and update financial ledgers properly.

> [!CAUTION]
> **Master Data Clutter Warning**
> Running this script will automatically create roughly ~3 new Vendors, ~5 new Brands, and ~20-30 new Items in your master database to support these invoices. 

## Open Questions

1. **Auth Token:** The script will need a valid JWT token to hit the APIs. Are you okay with the script generating a temporary Superadmin token directly from the DB to authenticate its API calls?
2. **Database Auto-Creation:** Do you approve of the script auto-creating missing Vendors and Items based strictly on the text found in the images?

Once you approve, I will begin extracting the data from the images into a JSON file!
