const axios = require('axios');

async function run() {
  try {
    const res = await axios.post('http://localhost:5000/api/vendors', {
      name: 'Test Vendor',
      gst_raw_data: { test: "data", "sts": "Active" }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test' // Wait, I need a valid token.
      }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
run();
