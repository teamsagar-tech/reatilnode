const axios = require('axios');
async function test() {
    try {
        const initResponse = await axios.get("https://services.gst.gov.in/services/searchtp", { validateStatus: () => true });
        
        let cookiesMap = new Map();
        
        function extractCookies(res) {
            const setCookies = res.headers['set-cookie'];
            if (setCookies) {
                setCookies.forEach(c => {
                    const pair = c.split(';')[0];
                    const [key, val] = pair.split('=');
                    cookiesMap.set(key, pair);
                });
            }
        }
        
        extractCookies(initResponse);
        
        console.log("Cookies after searchtp:", Array.from(cookiesMap.values()).join('; '));

        const captchaResponse = await axios.get("https://services.gst.gov.in/services/captcha", {
            headers: { 'Cookie': Array.from(cookiesMap.values()).join('; ') },
            responseType: 'arraybuffer'
        });
        
        extractCookies(captchaResponse);
        console.log("Cookies after captcha:", Array.from(cookiesMap.values()).join('; '));

    } catch(e) {
        console.error(e.message);
    }
}
test();
