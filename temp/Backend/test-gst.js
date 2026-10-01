const axios = require('axios');
async function test() {
    try {
        const res = await axios.get("https://services.gst.gov.in/services/searchtp", { validateStatus: () => true });
        const cookies = res.headers['set-cookie'];
        console.log("Cookies:", cookies);
        
        const res2 = await axios.get("https://services.gst.gov.in/services/captcha", {
            headers: { 'Cookie': cookies ? cookies.join('; ') : '' },
            responseType: 'arraybuffer'
        });
        console.log("Is Buffer?", Buffer.isBuffer(res2.data));
        console.log("Length:", res2.data.length);
        console.log("Data sample:", res2.data.slice(0, 20).toString('hex'));
    } catch(e) {
        console.error(e.message);
    }
}
test();
