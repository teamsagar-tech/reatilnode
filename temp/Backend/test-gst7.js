const axios = require('axios');
async function test() {
    try {
        const initResponse = await axios.get("https://services.gst.gov.in/services/searchtp", {
            validateStatus: () => true
        });
        const html = initResponse.data;
        const matches = html.match(/taxpayerDetails/gi);
        console.log("Matches:", matches);
        
        // Let's print out form fields or JS containing 'taxpayerDetails'
        const lines = html.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('taxpayerDetails')) {
                console.log("L" + i + ": " + lines[i].trim());
            }
        }
    } catch(e) {
        console.error(e.message);
    }
}
test();
