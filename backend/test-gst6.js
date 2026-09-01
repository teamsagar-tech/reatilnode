const axios = require('axios');
async function test() {
    try {
        const headers = {
            'User-Agent': 'python-requests/2.28.1',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate'
        };
        const initResponse = await axios.get("https://services.gst.gov.in/services/searchtp", {
            headers,
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

        // Fetch Captcha
        const captchaResponse = await axios.get("https://services.gst.gov.in/services/captcha", {
            headers: { ...headers, 'Cookie': cookieString },
            responseType: 'arraybuffer'
        });
        
        const gstData = {
            gstin: '27AABCV9163F1Z4',
            captcha: '123456'
        };

        const response = await axios.post("https://services.gst.gov.in/services/api/search/taxpayerDetails", gstData, {
            headers: { 
                ...headers,
                'Cookie': cookieString 
            },
            validateStatus: () => true
        });

        console.log("Status:", response.status);
        console.log("Data:", JSON.stringify(response.data));
    } catch(e) {
        console.error(e.message);
    }
}
test();
