# Smart Invoice Digitization (OCR)

You have requested to digitize physical bills (WhatsApp JPEG images) directly into the `Purchase Invoice` module using the Python environment we installed on the server.

## Technical Challenge
The tool we just installed (`pdfplumber`) is specifically designed to extract text that is mathematically embedded inside vector PDF documents (like the Price List PDF). 

The files in the `sample/invoices` directory are **JPEG images**. They contain pixels, not text. To convert these photos into digital Purchase Invoices, we need **Optical Character Recognition (OCR)** capable of understanding complex tables.

## Open Questions

Before we build this, we must choose an extraction engine. I need your decision on which path to take:

> [!IMPORTANT]
> **Option 1: AI Vision API (Recommended)**
> We can write a Python script that securely sends the image to a Vision AI (like OpenAI GPT-4o or Google Gemini) and asks it to return the exact items, HSNs, quantities, and prices in JSON format. 
> * **Pros:** Extremely accurate. Easily handles crinkled paper, weird tables, and varying supplier formats without custom coding for each supplier.
> * **Cons:** Requires you to provide an API key, and costs a few cents per scan.

> [!WARNING]
> **Option 2: Local Tesseract OCR (Free)**
> We can install `tesseract-ocr` and `pytesseract` on your server.
> * **Pros:** 100% free and runs locally on your server.
> * **Cons:** Extremely fragile. Tesseract struggles heavily with reading grid tables from photos. It will likely jumble the Item Names, Qty, and Prices together, requiring a massive amount of manual correction from the user.

## Approved Plan: Tesseract OCR (Prototype on Separate Route)

Per your instruction, we will avoid the AI Vision API and instead use **Local Tesseract OCR**. To prevent any disruptions to the main `PurchaseInvoice` module, we will build this strictly as a separate standalone experimental route.

### Backend 
#### [NEW] `backend/scripts/ocr_image.py`
A Python script that takes the image file path and runs `pytesseract` to extract raw text and attempt to parse tabular line items.

#### [NEW] `backend/controllers/ocrController.js`
Controller to handle the image upload and trigger the Python script.

#### [MODIFY] `backend/routes/purchaseInvoiceRoutes.js`
Add a new standalone route `POST /api/purchase/ocr-test` that accepts an image upload via `multer`.

### Frontend
#### [NEW] `FrontEndV2/src/pages/inventory/OCRTest.tsx`
A completely separate page (e.g. `Inventory > Advanced > OCR Prototype`) where you can upload the JPEG invoices and see the raw Tesseract text extraction results mapped to a grid.

#### [MODIFY] `FrontEndV2/src/App.tsx` & `TenantUsers.tsx`
Register the new route independently.
