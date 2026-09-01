const axios = require('axios');
async function test() {
    try {
        const headers = {
            'User-Agent': 'python-requests/2.28.1',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate'
        };
        const res = await axios.get("https://services.gst.gov.in/services/searchtp", { headers, validateStatus: () => true });
        const cookies = res.headers['set-cookie'];
        console.log("Cookies:", cookies);
        
        const res2 = await axios.get("https://services.gst.gov.in/services/captcha", {
            headers: { ...headers, 'Cookie': cookies ? cookies.join('; ') : '' },
            responseType: 'arraybuffer'
        });
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
