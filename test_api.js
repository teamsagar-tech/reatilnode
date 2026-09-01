const http = require('http');
const https = require('https');

const API_BASE = 'https://api.retailnode.in/api';

async function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data || '{}') });
        } catch(e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('Testing APIs on https://api.retailnode.in/api ...\n');
  const testEmail = `test_${Date.now()}@test.com`;

  try {
    console.log('1. Testing Registration (/auth/register)...');
    const regRes = await request('POST', '/auth/register', {
      firmName: 'Test Firm',
      userName: 'Test User',
      email: testEmail,
      password: 'password123'
    });
    console.log(`Registration Status: ${regRes.status}`);
    if (regRes.status !== 201) throw new Error('Registration failed');
    console.log('✅ Registration OK\n');

    console.log('2. Testing Login (/auth/login)...');
    const loginRes = await request('POST', '/auth/login', {
      email: testEmail,
      password: 'password123'
    });
    console.log(`Login Status: ${loginRes.status}`);
    if (loginRes.status !== 200 || !loginRes.data.token) throw new Error('Login failed');
    const token = loginRes.data.token;
    console.log('✅ Login OK. JWT Token received.\n');
    console.log('Available Firms:', loginRes.data.user.available_firms?.length || 0);

    console.log('3. Testing Switch Firm (/auth/switch-firm)...');
    const switchRes = await request('POST', '/auth/switch-firm', {
      target_firm_id: loginRes.data.user.firm_id
    }, token);
    console.log(`Switch Firm Status: ${switchRes.status}`);
    if (switchRes.status !== 200 || !switchRes.data.token) throw new Error('Switch Firm failed');
    const newToken = switchRes.data.token;
    console.log('✅ Switch Firm OK. New JWT Token received.\n');

    console.log('4. Testing Location Master Fetch (/masters/location)...');
    const locRes = await request('GET', '/masters/location', null, newToken);
    console.log(`Locations Status: ${locRes.status}`);
    if (locRes.status !== 200) throw new Error('Fetch locations failed');
    console.log(`✅ Locations Fetched OK. Count: ${locRes.data.length}\n`);

    console.log('5. Testing Create New Firm (/firms/me/new)...');
    const newFirmRes = await request('POST', '/firms/me/new', {
      name: 'Second Test Firm'
    }, newToken);
    console.log(`Create Firm Status: ${newFirmRes.status}`);
    if (newFirmRes.status !== 201) throw new Error('Create firm failed');
    console.log('✅ Create Firm OK. New Firm ID:', newFirmRes.data.firm?.id);

  } catch(e) {
    console.error('❌ TEST FAILED:', e.message);
  }
}

runTests();
