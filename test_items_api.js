const axios = require('axios');
async function run() {
    try {
        // since we are on local, just look at the controller
        const fs = require('fs');
        const code = fs.readFileSync('/var/www/RetailNodeV2/backend/controllers/itemController.js', 'utf8');
        const lines = code.split('\n').filter(l => l.includes('SELECT') || l.includes('query(') || l.includes('Items.'));
        console.log(lines.join('\n'));
    } catch(e) {}
}
run();
