import pytesseract
from PIL import Image
import sys

def parse_image(image_path):
    print(f"--- Parsing: {image_path} ---")
    try:
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img)
        print("--- EXTRACTED TEXT ---")
        print(text)
        print("----------------------\n")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 ocr_test.py <image_path>")
        sys.exit(1)
    parse_image(sys.argv[1])
