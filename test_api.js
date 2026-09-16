const http = require('http');
const req = http.request({
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/purchase-invoices',
  method: 'GET',
  headers: {
    'firm_id': '1' // mock or something, wait I don't know the firm_id
  }
});
