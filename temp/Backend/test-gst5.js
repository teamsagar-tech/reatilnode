const axios = require('axios');
async function test() {
    try {
        const initResponse = await axios.get("https://services.gst.gov.in/services/searchtp", {
            validateStatus: () => true
        });
        
        const setCookies = initResponse.headers['set-cookie'];
        let cookiePairs = [];
        if (setCookies) {
            setCookies.forEach(c => {
                cookiePairs.push(c.split(';')[0]);
            });
        }
        const cookieString = cookiePairs.join('; ');
        console.log("Cookie string:", cookieString);

        // Fetch Captcha
        const captchaResponse = await axios.get("https://services.gst.gov.in/services/captcha", {
            headers: { 'Cookie': cookieString },
            responseType: 'arraybuffer'
        });
        
        // Wait for me to read the captcha? No, we can't do that easily here. 
        // We can just send a wrong captcha and see what the API returns.
        const gstData = {
            gstin: '27AABCV9163F1Z4', // Real GSTIN from user image
            captcha: '123456'
        };

        const response = await axios.post("https://services.gst.gov.in/services/api/search/taxpayerDetails", gstData, {
            headers: { 'Cookie': cookieString },
            validateStatus: () => true
        });

        console.log("Status:", response.status);
        if (typeof response.data === 'string') {
            console.log("Data:", response.data.slice(0, 100));
        } else {
            console.log("Data:", JSON.stringify(response.data));
        }
    } catch(e) {
        console.error(e.message);
    }
}
test();
