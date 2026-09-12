# Switching to AI Vision OCR

As you have now seen in the prototype, traditional, free OCR (`Tesseract`) is simply not capable of understanding complex invoice tables from photos. It jumbles the text and completely misses the structure, making it impossible to reliably extract Item Names, Quantities, and Prices.

To get the **item or product data properly**, we must pivot to **Option 1** from our original discussion: **AI Vision Models**. 

## Proposed Architecture: Gemini Pro Vision / GPT-4o

Instead of running local Tesseract OCR, the Python script will send the image securely to an AI Vision API (like Google Gemini or OpenAI) along with a strict JSON schema:

```json
[
  { "item_name": "String", "qty": "Number", "price": "Number", "hsn": "String" }
]
```
The AI will perfectly "read" the image, understand the grid structure, and return a flawless JSON array that we can drop straight into the Purchase Invoice.

### Open Question / Action Required
To implement this, you will need to provide an API key for either **Google Gemini** or **OpenAI**. 
If you agree to this approach, please do the following:
1. Click **Proceed** to approve this plan.
2. Tell me whether you want to use **Google Gemini** or **OpenAI**.
3. Create an API key on their respective developer console and provide it to me so I can configure the server's `.env` file and write the script.
