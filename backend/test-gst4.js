const axios = require('axios');
async function test() {
    try {
        const res = await axios.get("https://services.gst.gov.in/services/searchtp", { validateStatus: () => true });
        const setCookies = res.headers['set-cookie'];
        
        let cookiePairs = [];
        if (setCookies) {
            setCookies.forEach(c => {
                cookiePairs.push(c.split(';')[0]);
            });
        }
        const cookieString = cookiePairs.join('; ');
        console.log("Proper Cookie String:", cookieString);
        
        const res2 = await axios.get("https://services.gst.gov.in/services/captcha", {
            headers: { 'Cookie': cookieString },
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
