import requests
import uuid
import base64

try:
    captcha = "https://services.gst.gov.in/services/captcha"
    session = requests.Session()

    response = session.get(
        "https://services.gst.gov.in/services/searchtp"
    )

    captchaResponse = session.get(captcha)
    print(captchaResponse.status_code)
    print("Is HTML?", "<html>" in str(captchaResponse.content[:20]))
    print("First 4 bytes:", captchaResponse.content[:4].hex())
except Exception as e:
    print(e)
