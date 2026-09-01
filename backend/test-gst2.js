const axios = require('axios');
async function test() {
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive'
        };
        const res = await axios.get("https://services.gst.gov.in/services/searchtp", { headers, validateStatus: () => true });
        const cookies = res.headers['set-cookie'];
        console.log("Cookies:", cookies);
        
        const res2 = await axios.get("https://services.gst.gov.in/services/captcha", {
            headers: { ...headers, 'Cookie': cookies ? cookies.join('; ') : '' },
            responseType: 'arraybuffer'
        });
        console.log("Is Buffer?", Buffer.isBuffer(res2.data));
        console.log("Length:", res2.data.length);
        console.log("Data sample:", res2.data.slice(0, 10).toString('hex'));
        if (res2.data.slice(0,4).toString('hex') === '89504e47') {
            console.log("SUCCESS! It's a PNG.");
        } else {
            console.log("Returned string:", res2.data.toString('utf8'));
        }
    } catch(e) {
        console.error(e.message);
    }
}
test();
