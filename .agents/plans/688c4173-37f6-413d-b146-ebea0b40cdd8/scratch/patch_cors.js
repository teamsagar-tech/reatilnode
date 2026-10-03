const fs = require('fs');
const file = '/var/www/RetailNodeV2/Backend/server.js';
let content = fs.readFileSync(file, 'utf8');

const oldCors = `app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));`;

const newCors = `const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://app.retailnode.in',
  'https://retailnode.in',
  'https://www.retailnode.in',
  'https://onevastra.technfest.com',
  'https://ovapi.technfest.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS error'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));`;

if (content.includes('origin: true')) {
  content = content.replace(oldCors, newCors);
  fs.writeFileSync(file, content);
  console.log('CORS updated successfully on the live server.');
} else {
  console.log('CORS already updated or pattern not found.');
}
