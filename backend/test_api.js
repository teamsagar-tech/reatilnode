const fs = require('fs');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('/Users/ratan/Downloads/RetailNodeV2/Backend/.env'));
const jwt = require('jsonwebtoken');

const token = jwt.sign({ userId: 1, firmId: 1, role: 'admin' }, envConfig.JWT_SECRET);

fetch('http://localhost:5000/api/masters/generic/sizesets', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(res => res.json()).then(data => {
  const s = data.find(x => x.name === '40-85');
  console.log('Found 40-85:', s);
  console.log('Total SizeSets:', data.length);
}).catch(console.error);
