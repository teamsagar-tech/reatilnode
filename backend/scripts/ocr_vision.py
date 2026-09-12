import sys
import json
import os
import base64

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def parse_with_gemini(image_path):
    import google.generativeai as genai
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set in environment.")
    
    genai.configure(api_key=api_key)
    
    # Upload file to Gemini or just pass the image bytes
    # For Gemini 1.5 Flash/Pro, passing inline data is supported.
    img_bytes = open(image_path, "rb").read()
    
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    prompt = """
    Extract the tabular line items from this invoice image. 
    Return ONLY a valid JSON array of objects. Do not include markdown formatting like ```json or any other text.
    Each object must exactly match this schema:
    {
      "item_name": "string (the name of the product)",
      "qty": "number (the quantity)",
      "price": "number (the unit price)",
      "hsn": "string (the HSN code, if present, else empty)",
      "design_no": "string (if present, else empty)",
      "color": "string (if present, else empty)"
    }
    """
    
    response = model.generate_content([
        prompt,
        {"mime_type": "image/jpeg", "data": img_bytes}
    ])
    
    raw_text = response.text
    # Clean markdown if present
    if raw_text.startswith('```json'):
        raw_text = raw_text.split('```json')[1].split('```')[0].strip()
    elif raw_text.startswith('```'):
        raw_text = raw_text.split('```')[1].strip()
        
    return json.loads(raw_text)

def parse_with_openai(image_path):
    from openai import OpenAI
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set in environment.")
    
    client = OpenAI(api_key=api_key)
    base64_image = encode_image(image_path)
    
    prompt = """
    Extract the tabular line items from this invoice image. 
    Return ONLY a valid JSON array of objects. Do not include markdown formatting like ```json or any other text.
    Each object must exactly match this schema:
    {
      "item_name": "string (the name of the product)",
      "qty": "number (the quantity)",
      "price": "number (the unit price)",
      "hsn": "string (the HSN code, if present, else empty)",
      "design_no": "string (if present, else empty)",
      "color": "string (if present, else empty)"
    }
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        max_tokens=1500,
        temperature=0.0
    )
    
    raw_text = response.choices[0].message.content
    # Clean markdown if present
    if raw_text.startswith('```json'):
        raw_text = raw_text.split('```json')[1].split('```')[0].strip()
    elif raw_text.startswith('```'):
        raw_text = raw_text.split('```')[1].strip()
        
    return json.loads(raw_text)

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"success": False, "error": "Usage: python ocr_vision.py <engine> <image_path>"}))
        sys.exit(1)
        
    engine = sys.argv[1].lower()
    image_path = sys.argv[2]
    
    try:
        if engine == 'gemini':
            items = parse_with_gemini(image_path)
        elif engine == 'openai':
            items = parse_with_openai(image_path)
        else:
            raise ValueError("Unsupported engine. Use 'gemini' or 'openai'.")
            
        output = {
            "success": True,
            "engine": engine,
            "parsed_items": items
        }
        print(json.dumps(output))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    main()
