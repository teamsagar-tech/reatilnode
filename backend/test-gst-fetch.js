async function test() {
    try {
        const res1 = await fetch("https://services.gst.gov.in/services/searchtp");
        const cookies = res1.headers.get('set-cookie');
        console.log("Cookies:", cookies);
        
        // Sometimes set-cookie contains multiple cookies separated by commas, 
        // we can just pass the whole string back in the Cookie header.
        
        const res2 = await fetch("https://services.gst.gov.in/services/captcha", {
            headers: {
                'Cookie': cookies || ''
            }
        });
        const buffer = await res2.arrayBuffer();
        const data = Buffer.from(buffer);
        
        if (data.slice(0,4).toString('hex') === '89504e47') {
            console.log("SUCCESS! It's a PNG.");
        } else {
            console.log("Returned string:", data.toString('utf8'));
        }
    } catch(e) {
        console.error(e.message);
    }
}
test();
